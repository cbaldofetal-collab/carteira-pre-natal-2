import 'package:flutter/material.dart';
import 'dart:ui' as ui;
import 'package:share_plus/share_plus.dart';
import 'package:path_provider/path_provider.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/perfil.dart';
import '../models/exame_template.dart';
import '../services/gestacao_service.dart';
import '../config.dart';
import '../services/storage_service.dart';
import '../services/reminder_service.dart';

class ScheduleScreen extends StatefulWidget {
  static const routeName = '/schedule';
  final PerfilGestacional perfil;

  const ScheduleScreen({super.key, required this.perfil});

  @override
  State<ScheduleScreen> createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends State<ScheduleScreen> {
  Map<String, String> status = {};
  String filtro = 'todos';
  DateTime? dppCorrigida;
  bool usarCorrigida = false;
  String? flashId;
  final GlobalKey _exportKey = GlobalKey();
  Map<String, DateTime?> agendadoDatas = {};
  Map<String, DateTime?> realizadoDatas = {};

  Color _bgColor(String st) {
    if (st == 'agendado') return Colors.blue.shade100;
    if (st == 'realizado') return Colors.green.shade100;
    return Colors.grey.shade200;
  }

  Color _selColor(String st) {
    if (st == 'agendado') return Colors.blue.shade300;
    if (st == 'realizado') return Colors.green.shade300;
    return Colors.grey.shade400;
  }

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final s = await StorageService.loadStatus(widget.perfil.id);
    final dppc = await StorageService.loadDppCorrigida(widget.perfil.id);
    final templates = AppConfig.templates();
    final agd = <String, DateTime?>{};
    final rzd = <String, DateTime?>{};
    for (final t in templates) {
      agd[t.id] = await StorageService.getAgendadoData(widget.perfil.id, t.id);
      rzd[t.id] = await StorageService.getRealizadoData(widget.perfil.id, t.id);
    }
    setState(() {
      status = s;
      dppCorrigida = dppc;
      usarCorrigida = dppc != null;
      agendadoDatas = agd;
      realizadoDatas = rzd;
    });
  }

  Uri _waUri(String mensagem) {
    const numero = AppConfig.whatsappNumero;
    final encoded = Uri.encodeComponent(mensagem);
    return Uri.parse('https://wa.me/$numero?text=$encoded');
  }

  Future<void> _abrirWhatsApp(String mensagem) async {
    final uri = _waUri(mensagem);
    if (await canLaunchUrl(uri)) {
      await launchUrl(uri, mode: LaunchMode.externalApplication);
    }
  }

  Future<void> _setStatus(String exameId, String novo) async {
    status[exameId] = novo;
    setState(() {});
    await StorageService.saveStatus(widget.perfil.id, status);
    if (novo == 'realizado') {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Exame marcado como realizado')),
      );
      final hoje = DateUtils.dateOnly(DateTime.now());
      await StorageService.setRealizadoData(widget.perfil.id, exameId, hoje);
      realizadoDatas[exameId] = hoje;
    } else if (novo == 'agendado') {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Exame marcado como agendado')),
      );
    } else if (novo == 'pendente') {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Exame voltou para pendente')),
      );
      await StorageService.setAgendadoData(widget.perfil.id, exameId, DateTime.fromMillisecondsSinceEpoch(0));
      await StorageService.setRealizadoData(widget.perfil.id, exameId, DateTime.fromMillisecondsSinceEpoch(0));
      agendadoDatas[exameId] = null;
      realizadoDatas[exameId] = null;
    }
    flashId = exameId;
    setState(() {});
    await Future.delayed(const Duration(milliseconds: 800));
    if (mounted && flashId == exameId) {
      flashId = null;
      setState(() {});
    }
  }

  Future<void> _pickAgendado(String exameId) async {
    final hoje = DateTime.now();
    final escolhida = await showDatePicker(
      context: context,
      initialDate: hoje,
      firstDate: DateTime(hoje.year - 1),
      lastDate: DateTime(hoje.year + 1),
    );
    if (escolhida != null) {
      await StorageService.setAgendadoData(widget.perfil.id, exameId, escolhida);
      setState(() => agendadoDatas[exameId] = escolhida);
    }
  }

  Future<void> _pickRealizado(String exameId) async {
    final hoje = DateTime.now();
    final escolhida = await showDatePicker(
      context: context,
      initialDate: hoje,
      firstDate: DateTime(hoje.year - 1),
      lastDate: DateTime(hoje.year + 1),
    );
    if (escolhida != null) {
      await StorageService.setRealizadoData(widget.perfil.id, exameId, escolhida);
      setState(() => realizadoDatas[exameId] = escolhida);
    }
  }

  void _setFiltro(String novo) {
    setState(() => filtro = novo);
  }

  Future<void> _openCorrecaoDialog() async {
    DateTime? dataExame;
    final semanasCtrl = TextEditingController();
    final diasCtrl = TextEditingController();
    await showDialog(
      context: context,
      builder: (ctx) {
        return AlertDialog(
          title: const Text('Corrigir IG pelo 1º USG'),
          content: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: [
                  Expanded(
                    child: ElevatedButton(
                      onPressed: () async {
                        final hoje = DateTime.now();
                        final escolhida = await showDatePicker(
                          context: context,
                          initialDate: hoje,
                          firstDate: DateTime(hoje.year - 1),
                          lastDate: DateTime(hoje.year + 1),
                        );
                        if (escolhida != null) {
                          dataExame = escolhida;
                        }
                      },
                      child: Text(dataExame != null ? 'Data: ${GestacaoService.formatDate(dataExame!)}' : 'Selecionar data do exame'),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: [
                  Expanded(
                    child: TextField(
                      controller: semanasCtrl,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'IG semanas'),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Expanded(
                    child: TextField(
                      controller: diasCtrl,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: 'IG dias'),
                    ),
                  ),
                ],
              ),
            ],
          ),
          actions: [
            TextButton(
              onPressed: () => Navigator.of(ctx).pop(),
              child: const Text('Cancelar'),
            ),
            ElevatedButton(
              onPressed: () async {
                final w = int.tryParse(semanasCtrl.text) ?? 0;
                final d = int.tryParse(diasCtrl.text) ?? 0;
                if (dataExame != null && (w > 0 || d > 0)) {
                  final igDias = w * 7 + d;
                  final dppc = dataExame!.add(Duration(days: 280 - igDias));
                  await StorageService.saveDppCorrigida(widget.perfil.id, dppc);
                  setState(() {
                    dppCorrigida = dppc;
                    usarCorrigida = true;
                  });
                  Navigator.of(ctx).pop();
                }
              },
              child: const Text('Aplicar'),
            ),
          ],
        );
      },
    );
  }

  Future<void> _clearCorrecao() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Remover correção'),
        content: const Text('Tem certeza que deseja remover a correção de IG pelo USG? A agenda voltará a usar a DUM/DPP original.'),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(ctx).pop(false),
            child: const Text('Cancelar'),
          ),
          ElevatedButton(
            onPressed: () => Navigator.of(ctx).pop(true),
            child: const Text('Remover'),
          ),
        ],
      ),
    );
    if (ok == true) {
      await StorageService.clearDppCorrigida(widget.perfil.id);
      setState(() {
        dppCorrigida = null;
        usarCorrigida = false;
      });
    }
  }

  Future<void> _exportCronograma() async {
    try {
      final boundary = _exportKey.currentContext!.findRenderObject() as RenderRepaintBoundary;
      final image = await boundary.toImage(pixelRatio: 2.0);
      final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      if (byteData == null) return;
      final bytes = byteData.buffer.asUint8List();
      final dir = await getTemporaryDirectory();
      final path = '${dir.path}/cronograma_${DateTime.now().millisecondsSinceEpoch}.png';
      final file = await XFile.fromData(bytes, name: 'cronograma.png', mimeType: 'image/png').saveTo(path);
      await Share.shareXFiles([XFile(path)], text: 'Cronograma de exames');
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    final info = GestacaoService.calcular(dum: widget.perfil.dum, dpp: widget.perfil.dpp);
    final infoCorr = dppCorrigida != null
        ? GestacaoService.calcular(dum: null, dpp: dppCorrigida)
        : null;
    final hoje = DateUtils.dateOnly(DateTime.now());
    final templates = AppConfig.templates();

    List<Widget> itens = [];
    int total = templates.length;
    int cPend = 0;
    int cAgend = 0;
    int cReal = 0;
    for (final t in templates) {
      final st = status[t.id] ?? 'pendente';
      if (st == 'pendente') cPend++;
      if (st == 'agendado') cAgend++;
      if (st == 'realizado') cReal++;
    }
    final baseOriginal = widget.perfil.dum ?? (widget.perfil.dpp != null ? widget.perfil.dpp!.subtract(const Duration(days: 280)) : hoje);
    final base = usarCorrigida && dppCorrigida != null ? dppCorrigida!.subtract(const Duration(days: 280)) : baseOriginal;
    final reminders = ReminderService.gerar(base, templates).where((r) => r.quando.difference(hoje).inDays <= 60).toList();

    if (reminders.isNotEmpty) {
      itens.add(Card(
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text('Lembretes próximos', style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 8),
              ...reminders.take(5).map((r) => Row(
                    children: [
                      Expanded(child: Text('${r.tipo} • ${r.titulo} • ${GestacaoService.formatDate(r.quando)}')),
                    ],
                  )),
            ],
          ),
        ),
      ));
    }

    itens.add(Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Wrap(
        spacing: 8,
        children: [
          ChoiceChip(
            label: Text('Todos ($total)'),
            selected: filtro == 'todos',
            backgroundColor: Colors.grey.shade200,
            selectedColor: Colors.grey.shade400,
            onSelected: (_) => _setFiltro('todos'),
          ),
          ChoiceChip(
            label: Text('Pendente ($cPend)'),
            selected: filtro == 'pendente',
            backgroundColor: _bgColor('pendente'),
            selectedColor: _selColor('pendente'),
            onSelected: (_) => _setFiltro('pendente'),
          ),
          ChoiceChip(
            label: Text('Agendado ($cAgend)'),
            selected: filtro == 'agendado',
            backgroundColor: _bgColor('agendado'),
            selectedColor: _selColor('agendado'),
            onSelected: (_) => _setFiltro('agendado'),
          ),
          ChoiceChip(
            label: Text('Realizado ($cReal)'),
            selected: filtro == 'realizado',
            backgroundColor: _bgColor('realizado'),
            selectedColor: _selColor('realizado'),
            onSelected: (_) => _setFiltro('realizado'),
          ),
        ],
      ),
    ));
    for (final t in templates) {
      final baseOriginal = widget.perfil.dum ?? (widget.perfil.dpp != null ? widget.perfil.dpp!.subtract(const Duration(days: 280)) : hoje);
      final base = usarCorrigida && dppCorrigida != null ? dppCorrigida!.subtract(const Duration(days: 280)) : baseOriginal;
      final inicio = GestacaoService.addSemanas(base, t.inicioSemana);
      final fim = GestacaoService.addSemanas(base, t.fimSemana);
      final semanaAlvo = t.inicioSemana;
      var mensagem = 'Olá, sou ${widget.perfil.nome} [ID: ${widget.perfil.id}]. Gostaria de agendar o ${t.nome}, previsto para a minha ${semanaAlvo}ª semana.';
      final st = status[t.id] ?? 'pendente';
      final ativa = hoje.isAfter(inicio.subtract(const Duration(days: 1))) && hoje.isBefore(fim.add(const Duration(days: 1)));
      final destaque = ativa && st == 'pendente';
      final agd = agendadoDatas[t.id];
      final rzd = realizadoDatas[t.id];
      if (agd != null) {
        mensagem = '$mensagem Preferencialmente para o dia ${GestacaoService.formatDate(agd)}.';
      }
      if (filtro != 'todos' && st != filtro) {
        continue;
      }
      itens.add(Card(
        shape: ativa
            ? RoundedRectangleBorder(
                side: BorderSide(color: Colors.green.shade300, width: 1.5),
                borderRadius: BorderRadius.circular(8),
              )
            : null,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 250),
          curve: Curves.easeOut,
          color: flashId == t.id ? Colors.yellow.shade50 : null,
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(t.nome, style: Theme.of(context).textTheme.titleMedium),
                  ),
                  Chip(
                    label: Text('Alvo: ${semanaAlvo}ª'),
                    backgroundColor: Colors.grey.shade200,
                  ),
                  const SizedBox(width: 6),
                  Chip(
                    label: Text('Data alvo: ${GestacaoService.formatDate(inicio)}'),
                    backgroundColor: Colors.grey.shade200,
                  ),
                ],
              ),
              const SizedBox(height: 4),
              Text(t.descricao),
              if (ativa) ...[
                const SizedBox(height: 6),
                Row(
                  children: [
                    Icon(Icons.event_available, color: Colors.green.shade500),
                    const SizedBox(width: 6),
                    Text('Janela ativa', style: TextStyle(color: Colors.green.shade600)),
                  ],
                ),
                if (st == 'pendente') ...[
                  const SizedBox(height: 6),
                  Chip(
                    label: const Text('Agende agora'),
                    backgroundColor: Colors.orange.shade50,
                    labelStyle: TextStyle(color: Colors.orange.shade700),
                  ),
                ],
              ],
              const SizedBox(height: 6),
              Text('Janela ideal: ${t.inicioSemana}–${t.fimSemana} semanas'),
              Text('Estimativa: ${GestacaoService.formatDate(inicio)} a ${GestacaoService.formatDate(fim)}'),
              if (st == 'agendado') ...[
                const SizedBox(height: 6),
                Row(
                  children: [
                    Expanded(child: Text('Agendado para: ${agd != null ? GestacaoService.formatDate(agd) : 'definir data'}')),
                    ElevatedButton(onPressed: () => _pickAgendado(t.id), child: const Text('Definir data')),
                  ],
                ),
              ],
              if (st == 'realizado') ...[
                const SizedBox(height: 6),
                Row(
                  children: [
                    Expanded(child: Text('Realizado em: ${rzd != null ? GestacaoService.formatDate(rzd) : 'definir data'}')),
                    ElevatedButton(onPressed: () => _pickRealizado(t.id), child: const Text('Definir data')),
                  ],
                ),
              ],
              const SizedBox(height: 6),
              Wrap(
                spacing: 8,
                children: [
                  ChoiceChip(
                    label: const Text('Pendente'),
                    selected: st == 'pendente',
                    backgroundColor: _bgColor('pendente'),
                    selectedColor: _selColor('pendente'),
                    onSelected: (_) => _setStatus(t.id, 'pendente'),
                  ),
                  ChoiceChip(
                    label: const Text('Agendado'),
                    selected: st == 'agendado',
                    backgroundColor: _bgColor('agendado'),
                    selectedColor: _selColor('agendado'),
                    onSelected: (_) => _setStatus(t.id, 'agendado'),
                  ),
                  ChoiceChip(
                    label: const Text('Realizado'),
                    selected: st == 'realizado',
                    backgroundColor: _bgColor('realizado'),
                    selectedColor: _selColor('realizado'),
                    onSelected: (_) => _setStatus(t.id, 'realizado'),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              if (st != 'realizado')
                Align(
                  alignment: Alignment.centerRight,
                  child: ElevatedButton(
                    style: destaque ? ElevatedButton.styleFrom(backgroundColor: Colors.green.shade500, foregroundColor: Colors.white) : null,
                    onPressed: () => _abrirWhatsApp(mensagem),
                    child: const Text('Agendar no WhatsApp'),
                  ),
                ),
              const SizedBox(height: 6),
            ],
          ),
        ),
      ));
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(infoCorr != null
            ? '${widget.perfil.nome} • IG ${info.semanas}+${info.dias} • Corr ${infoCorr.semanas}+${infoCorr.dias}'
            : '${widget.perfil.nome} • IG ${info.semanas}+${info.dias}'),
        actions: [
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Chip(
              label: Text('Pendentes: $cPend'),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: ChoiceChip(
              label: Text(usarCorrigida ? 'Base: USG' : 'Base: Original'),
              selected: usarCorrigida,
              onSelected: (_) => setState(() => usarCorrigida = !usarCorrigida),
            ),
          ),
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 8),
            child: Chip(
              label: Text('DPP: ${GestacaoService.formatDate((usarCorrigida && infoCorr != null) ? infoCorr!.dpp : info.dpp)}'),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.medical_services),
            tooltip: 'Corrigir IG (1º USG)',
            onPressed: _openCorrecaoDialog,
          ),
          if (dppCorrigida != null)
            IconButton(
              icon: const Icon(Icons.delete_forever),
              tooltip: 'Limpar correção USG',
              onPressed: _clearCorrecao,
            ),
          IconButton(
            icon: const Icon(Icons.download),
            tooltip: 'Exportar cronograma',
            onPressed: _exportCronograma,
          ),
          IconButton(
            icon: const Icon(Icons.settings),
            tooltip: 'Configurações',
            onPressed: () => Navigator.of(context).pushNamed('/settings', arguments: widget.perfil.id),
          ),
        ],
      ),
      body: RepaintBoundary(
        key: _exportKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: itens,
        ),
      ),
    );
  }
}
