import 'package:flutter/material.dart';
import '../models/perfil.dart';
import '../services/gestacao_service.dart';
import '../services/storage_service.dart';
import '../services/supabase_service.dart';
import '../config.dart';
import 'schedule_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final nomeController = TextEditingController();
  int modo = 0;
  DateTime? dum;
  DateTime? dpp;

  @override
  void initState() {
    super.initState();
    _loadPerfil();
  }

  Future<void> _loadPerfil() async {
    final perfil = await StorageService.loadPerfil();
    if (perfil != null) {
      setState(() {
        nomeController.text = perfil.nome;
        dum = perfil.dum;
        dpp = perfil.dpp;
        if (dum != null) modo = 0; else if (dpp != null) modo = 1;
      });
      if (perfil.nome.isNotEmpty && (perfil.dum != null || perfil.dpp != null)) {
        await Future.delayed(const Duration(milliseconds: 100));
        Navigator.of(context).pushNamed(ScheduleScreen.routeName, arguments: perfil);
      }
    }
  }

  @override
  void dispose() {
    nomeController.dispose();
    super.dispose();
  }

  Future<void> selecionarData(BuildContext context, bool selecionarDum) async {
    final hoje = DateTime.now();
    final primeira = DateTime(hoje.year - 1);
    final ultima = DateTime(hoje.year + 1);
    final escolhida = await showDatePicker(
      context: context,
      initialDate: hoje,
      firstDate: primeira,
      lastDate: ultima,
    );
    if (escolhida != null) {
      final hojeOnly = DateTime(hoje.year, hoje.month, hoje.day);
      if (selecionarDum) {
        final maxDum = hojeOnly;
        final minDum = hojeOnly.subtract(const Duration(days: 301));
        if (escolhida.isAfter(maxDum) || escolhida.isBefore(minDum)) return;
        setState(() {
          dum = escolhida;
          dpp = null;
        });
      } else {
        final minDpp = hojeOnly.add(const Duration(days: 1));
        final maxDpp = hojeOnly.add(const Duration(days: 310));
        if (escolhida.isBefore(minDpp) || escolhida.isAfter(maxDpp)) return;
        setState(() {
          dpp = escolhida;
          dum = null;
        });
      }
    }
  }

  Future<void> continuar() async {
    final nome = nomeController.text.trim();
    if (nome.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Informe seu nome')));
      return;
    }
    if (modo == 0 && dum == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Informe sua DUM')));
      return;
    }
    if (modo == 1 && dpp == null) {
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Informe sua DPP')));
      return;
    }

    // Mostrar loading
    final messenger = ScaffoldMessenger.of(context);
    final navigator = Navigator.of(context);
    
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => const Center(child: CircularProgressIndicator()),
    );

    try {
      // Calcular DPP se necessário
      final info = GestacaoService.calcular(
        dum: modo == 0 ? dum : null,
        dpp: modo == 1 ? dpp : null,
      );

      // Criar perfil no Supabase
      final perfilData = {
        'nome': nome,
        'dum': modo == 0 ? dum?.toIso8601String().split('T')[0] : null,
        'dpp': info.dpp.toIso8601String().split('T')[0],
      };

      final perfilId = await SupabaseService.savePerfil(perfilData);

      // Criar exames automaticamente
      final templates = AppConfig.templates();
      final baseDate = modo == 0 ? dum! : info.dpp.subtract(const Duration(days: 280));
      
      await SupabaseService.createExamesFromTemplates(
        perfilId: perfilId,
        baseDate: baseDate,
        templates: templates.map((t) => {
          'id': t.id,
          'nome': t.nome,
          'inicioSemana': t.inicioSemana,
        }).toList(),
      );

      // Criar perfil local para navegação
      final perfil = PerfilGestacional(
        nome: nome,
        id: perfilId,
        dum: modo == 0 ? dum : null,
        dpp: info.dpp,
      );

      // Salvar localmente também (para cache)
      await StorageService.savePerfil(perfil);

      // Fechar loading
      navigator.pop();

      // Navegar para o dashboard
      navigator.pushNamed(
        ScheduleScreen.routeName,
        arguments: perfil,
      );

      messenger.showSnackBar(
        const SnackBar(content: Text('Perfil criado com sucesso!')),
      );
    } catch (e) {
      // Fechar loading
      navigator.pop();
      
      messenger.showSnackBar(
        SnackBar(content: Text('Erro ao criar perfil: $e')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Gest Ultrassom')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text('Bem-vinda'),
            const SizedBox(height: 8),
            TextField(
              controller: nomeController,
              decoration: const InputDecoration(labelText: 'Nome'),
            ),
            const SizedBox(height: 16),
            const Text('Informe DUM ou DPP'),
            const SizedBox(height: 8),
            Row(
              children: [
                ChoiceChip(
                  label: const Text('DUM'),
                  selected: modo == 0,
                  onSelected: (_) => setState(() => modo = 0),
                ),
                const SizedBox(width: 8),
                ChoiceChip(
                  label: const Text('DPP'),
                  selected: modo == 1,
                  onSelected: (_) => setState(() => modo = 1),
                ),
              ],
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                Expanded(
                  child: ElevatedButton(
                    onPressed: () => selecionarData(context, modo == 0),
                    child: Text(
                      modo == 0
                          ? (dum != null
                              ? 'DUM: ${GestacaoService.formatDate(dum!)}'
                              : 'Selecionar DUM')
                          : (dpp != null
                              ? 'DPP: ${GestacaoService.formatDate(dpp!)}'
                              : 'Selecionar DPP'),
                    ),
                  ),
                ),
              ],
            ),
            const Spacer(),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: continuar,
                child: const Text('Continuar'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
