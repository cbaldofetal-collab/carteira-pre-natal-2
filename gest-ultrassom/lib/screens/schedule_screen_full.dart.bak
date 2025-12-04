import 'package:flutter/material.dart';
import 'dart:ui' as ui;
import 'package:share_plus/share_plus.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/perfil.dart';
import '../models/exame.dart';
import '../models/exame_template.dart';
import '../services/gestacao_service.dart';
import '../services/supabase_service.dart';
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
  // Agora usamos objetos Exame do Supabase em vez de maps locais
  List<Exame> exames = [];
  bool isLoading = true;
  String filtro = 'todos';
  DateTime? dppCorrigida;
  bool usarCorrigida = false;
  String? flashId;
  final GlobalKey _exportKey = GlobalKey();

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
    setState(() => isLoading = true);
    try {
      // Carregar exames do Supabase
      final examesData = await SupabaseService.listExames(widget.perfil.id);
      final examesList = examesData.map((e) => Exame.fromJson(e)).toList();
      
      // Carregar DPP corrigida do storage local (ou Supabase depois)
      final dppc = await StorageService.loadDppCorrigida(widget.perfil.id);
      
      setState(() {
        exames = examesList;
        dppCorrigida = dppc;
        usarCorrigida = dppc != null;
        isLoading = false;
      });
    } catch (e) {
      setState(() => isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao carregar exames: $e')),
        );
      }
    }
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

  Future<void> _setStatus(Exame exame, String novoStatus) async {
    try {
      // Atualizar no Supabase
      await SupabaseService.updateExameStatus(exame.id, novoStatus);
      
      // Atualizar datas se necessário
      if (novoStatus == 'realizado') {
        final hoje = DateUtils.dateOnly(DateTime.now());
        await SupabaseService.updateExameDatas(
          exameId: exame.id,
          realizadoEm: hoje,
        );
        
        // Recarregar dados
        await _load();
        
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Exame marcado como realizado')),
          );
        }
      } else if (novoStatus == 'agendado') {
        // Recarregar dados
        await _load();
        
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Exame marcado como agendado')),
          );
        }
      } else if (novoStatus == 'pendente') {
        // Limpar datas
        await SupabaseService.updateExameCompleto(
          exameId: exame.id,
          status: 'pendente',
          agendadoPara: DateTime.fromMillisecondsSinceEpoch(0),
          realizadoEm: DateTime.fromMillisecondsSinceEpoch(0),
        );
        
        // Recarregar dados
        await _load();
        
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Exame voltou para pendente')),
          );
        }
      }

      // Efeito visual de flash
      setState(() => flashId = exame.id);
      await Future.delayed(const Duration(milliseconds: 800));
      if (mounted && flashId == exame.id) {
        setState(() => flashId = null);
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro ao atualizar status: $e')),
        );
      }
    }
  }

  Future<void> _pickAgendado(Exame exame) async {
    final hoje = DateTime.now();
    final escolhida = await showDatePicker(
      context: context,
      initialDate: exame.agendadoPara ?? hoje,
      firstDate: DateTime(hoje.year - 1),
      lastDate: DateTime(hoje.year + 1),
    );
    if (escolhida != null) {
      try {
        await SupabaseService.updateExameDatas(
          exameId: exame.id,
          agendadoPara: escolhida,
        );
        await _load(); // Recarregar
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Erro: $e')),
          );
        }
      }
    }
  }

  Future<void> _pickRealizado(Exame exame) async {
    final hoje = DateTime.now();
    final escolhida = await showDatePicker(
      context: context,
      initialDate: exame.realizadoEm ?? hoje,
      firstDate: DateTime(hoje.year - 1),
      lastDate: DateTime(hoje.year + 1),
    );
    if (escolhida != null) {
      try {
        await SupabaseService.updateExameDatas(
          exameId: exame.id,
          realizadoEm: escolhida,
        );
        await _load(); // Recarregar
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Erro: $e')),
          );
        }
      }
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
        return StatefulBuilder(
          builder: (context, setDialogState) {
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
                              setDialogState(() => dataExame = escolhida);
                            }
                          },
                          child: Text(dataExame != null
                              ? 'Data: ${GestacaoService.formatDate(dataExame!)}'
                              : 'Selecionar data do exame'),
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
                      
                      // Salvar no Supabase
                      try {
                        await SupabaseService.updateDppCorrigida(widget.perfil.id, dppc);
                        await StorageService.saveDppCorrigida(widget.perfil.id, dppc);
                        
                        setState(() {
                          dppCorrigida = dppc;
                          usarCorrigida = true;
                        });
                        Navigator.of(ctx).pop();
                      } catch (e) {
                        if (mounted) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(content: Text('Erro: $e')),
                          );
                        }
                      }
                    }
                  },
                  child: const Text('Aplicar'),
                ),
              ],
            );
          },
        );
      },
    );
  }

  Future<void> _clearCorrecao() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Remover correção'),
        content: const Text(
            'Tem certeza que deseja remover a correção de IG pelo USG? A agenda voltará a usar a DUM/DPP original.'),
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
      try {
        await SupabaseService.updateDppCorrigida(widget.perfil.id, null);
        await StorageService.clearDppCorrigida(widget.perfil.id);
        setState(() {
          dppCorrigida = null;
          usarCorrigida = false;
        });
      } catch (e) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Erro: $e')),
          );
        }
      }
    }
  }

  Future<void> _exportCronograma() async {
    try {
      final boundary = _exportKey.currentContext!.findRenderObject() as RenderRepaintBoundary;
      final image = await boundary.toImage(pixelRatio: 2.0);
      final byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      if (byteData == null) return;
      final bytes = byteData.buffer.asUint8List();
      
      // Na web, não usamos path_provider
      await Share.shareXFiles(
        [XFile.fromData(bytes, name: 'cronograma.png', mimeType: 'image/png')],
        text: 'Cronograma de exames',
      );
    } catch (_) {}
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return Scaffold(
        appBar: AppBar(title: Text(widget.perfil.nome)),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final info = GestacaoService.calcular(dum: widget.perfil.dum, dpp: widget.perfil.dpp);
    final infoCorr = dppCorrigida != null
        ? GestacaoService.calcular(dum: null, dpp: dppCorrigida)
        : null;
    final hoje = DateUtils.dateOnly(DateTime.now());

    List<Widget> itens = [];
    int total = exames.length;
    int cPend = exames.where((e) => e.status == 'pendente').length;
    int cAgend = exames.where((e) => e.status == 'agendado').length;
    int cReal = exames.where((e) => e.status == 'realizado').length;

    final baseOriginal = widget.perfil.dum ??
        (widget.perfil.dpp != null
            ? widget.perfil.dpp!.subtract(const Duration(days: 280))
            : hoje);
    final base = usarCorrigida && dppCorrigida != null
        ? dppCorrigida!.subtract(const Duration(days: 280))
        : baseOriginal;

    // Carregar templates para os lembretes
    final templates = AppConfig.templates();
    final reminders =
        ReminderService.gerar(base, templates).where((r) => r.quando.difference(hoje).inDays <= 60).toList();

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
                      Expanded(
                          child: Text(
                              '${r.tipo} • ${r.titulo} • ${GestacaoService.formatDate(r.quando)}')),
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

    // Filtrar exames
    final examesFiltrados = filtro == 'todos'
        ? exames
        : exames.where((e) => e.status == filtro).toList();

    for (final exame in examesFiltrados) {
      final semanaAlvo = exame.semanaAlvo ?? 0;
      final inicio = exame.dataPrevista ?? hoje;
      
      // Encontrar template correspondente para obter fimSemana
      final template = templates.firstWhere(
        (t) => t.id == exame.tipo,
        orElse: () => ExameTemplate(
          id: exame.tipo,
          nome: exame.nome,
          descricao: '',
          inicioSemana: semanaAlvo,
          fimSemana: semanaAlvo + 2,
        ),
      );
      final fim = GestacaoService.addSemanas(base, template.fimSemana);
      
      var mensagem =
          'Olá, sou ${widget.perfil.nome} [ID: ${widget.perfil.id}]. Gostaria de agendar o ${exame.nome}, previsto para a minha ${semanaAlvo}ª semana.';
      
      final ativa = hoje.isAfter(inicio.subtract(const Duration(days: 1))) &&
          hoje.isBefore(fim.add(const Duration(days: 1)));
      final destaque = ativa && exame.status == 'pendente';
      
      if (exame.agendadoPara != null) {
        mensagem = '$mensagem Preferencialmente para o dia ${GestacaoService.formatDate(exame.agendadoPara!)}';
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
          color: flashId == exame.id ? Colors.yellow.shade50 : null,
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Expanded(
                    child: Text(exame.nome, style: Theme.of(context).textTheme.titleMedium),
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
              Text(template.descricao),
              if (ativa) ...[
                const SizedBox(height: 6),
                Row(
                  children: [
                    Icon(Icons.event_available, color: Colors.green.shade500),
                    const SizedBox(width: 6),
                    Text('Janela ativa', style: TextStyle(color: Colors.green.shade600)),
                  ],
                ),
                if (exame.status == 'pendente') ...[
                  const SizedBox(height: 6),
                  Chip(
                    label: const Text('Agende agora'),
                    backgroundColor: Colors.orange.shade50,
                    labelStyle: TextStyle(color: Colors.orange.shade700),
                  ),
                ],
              ],
              const SizedBox(height: 6),
              Text('Janela ideal: ${template.inicioSemana}–${template.fimSemana} semanas'),
              Text('Estimativa: ${GestacaoService.formatDate(inicio)} a ${GestacaoService.formatDate(fim)}'),
              if (exame.status == 'agendado') ...[
                const SizedBox(height: 6),
                Row(
                  children: [
                    Expanded(
                        child: Text(
                            'Agendado para: ${exame.agendadoPara != null ? GestacaoService.formatDate(exame.agendadoPara!) : 'definir data'}')),
                    ElevatedButton(
                      onPressed: () => _pickAgendado(exame),
                      child: const Text('Definir data'),
                    ),
                  ],
                ),
              ],
              if (exame.status == 'realizado') ...[
                const SizedBox(height: 6),
                Row(
                  children: [
                    Expanded(
                        child: Text(
                            'Realizado em: ${exame.realizadoEm != null ? GestacaoService.formatDate(exame.realizadoEm!) : 'definir data'}')),
                    ElevatedButton(
                      onPressed: () => _pickRealizado(exame),
                      child: const Text('Definir data'),
                    ),
                  ],
                ),
              ],
              const SizedBox(height: 6),
              Wrap(
                spacing: 8,
                children: [
                  ChoiceChip(
                    label: const Text('Pendente'),
                    selected: exame.status == 'pendente',
                    backgroundColor: _bgColor('pendente'),
                    selectedColor: _selColor('pendente'),
                    onSelected: (_) => _setStatus(exame, 'pendente'),
                  ),
                  ChoiceChip(
                    label: const Text('Agendado'),
                    selected: exame.status == 'agendado',
                    backgroundColor: _bgColor('agendado'),
                    selectedColor: _selColor('agendado'),
                    onSelected: (_) => _setStatus(exame, 'agendado'),
                  ),
                  ChoiceChip(
                    label: const Text('Realizado'),
                    selected: exame.status == 'realizado',
                    backgroundColor: _bgColor('realizado'),
                    selectedColor: _selColor('realizado'),
                    onSelected: (_) => _setStatus(exame, 'realizado'),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              if (exame.status != 'realizado')
                Align(
                  alignment: Alignment.centerRight,
                  child: ElevatedButton(
                    style: destaque
                        ? ElevatedButton.styleFrom(
                            backgroundColor: Colors.green.shade500,
                            foregroundColor: Colors.white)
                        : null,
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
            onPressed: () =>
                Navigator.of(context).pushNamed('/settings', arguments: widget.perfil.id),
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
