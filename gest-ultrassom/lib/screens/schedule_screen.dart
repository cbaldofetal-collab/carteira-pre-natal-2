import 'package:flutter/material.dart';
import '../models/perfil.dart';
import '../models/exame.dart';
import '../services/supabase_service.dart';
import '../services/gestacao_service.dart';

class ScheduleScreen extends StatefulWidget {
  static const routeName = '/schedule';
  final PerfilGestacional perfil;

  const ScheduleScreen({super.key, required this.perfil});

  @override
  State<ScheduleScreen> createState() => _ScheduleScreenState();
}

class _ScheduleScreenState extends State<ScheduleScreen> {
  List<Exame> exames = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    _loadExames();
  }

  Future<void> _loadExames() async {
    setState(() => isLoading = true);
    try {
      final data = await SupabaseService.listExames(widget.perfil.id);
      setState(() {
        exames = data.map((e) => Exame.fromJson(e)).toList();
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

  Future<void> _updateStatus(Exame exame, String novoStatus) async {
    try {
      await SupabaseService.updateExameStatus(exame.id, novoStatus);
      await _loadExames();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Status atualizado para: $novoStatus')),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro: $e')),
        );
      }
    }
  }

  Color _getStatusColor(String status) {
    switch (status) {
      case 'agendado':
        return Colors.blue.shade100;
      case 'realizado':
        return Colors.green.shade100;
      default:
        return Colors.grey.shade200;
    }
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return Scaffold(
        appBar: AppBar(
          title: Text(widget.perfil.nome),
          backgroundColor: Colors.green,
        ),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    final info = GestacaoService.calcular(
      dum: widget.perfil.dum,
      dpp: widget.perfil.dpp,
    );

    return Scaffold(
      appBar: AppBar(
        title: Text('${widget.perfil.nome} • IG ${info.semanas}+${info.dias}'),
        backgroundColor: Colors.green,
        actions: [
          Padding(
            padding: const EdgeInsets.all(8.0),
            child: Chip(
              label: Text('DPP: ${info.dpp.day}/${info.dpp.month}/${info.dpp.year}'),
            ),
          ),
        ],
      ),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: exames.length,
        itemBuilder: (context, index) {
          final exame = exames[index];
          return Card(
            color: _getStatusColor(exame.status),
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    exame.nome,
                    style: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  const SizedBox(height: 8),
                  Text('Semana alvo: ${exame.semanaAlvo}ª'),
                  if (exame.dataPrevista != null)
                    Text('Data prevista: ${exame.dataPrevista!.day}/${exame.dataPrevista!.month}/${exame.dataPrevista!.year}'),
                  const SizedBox(height: 12),
                  Wrap(
                    spacing: 8,
                    children: [
                      ChoiceChip(
                        label: const Text('Pendente'),
                        selected: exame.status == 'pendente',
                        onSelected: (_) => _updateStatus(exame, 'pendente'),
                      ),
                      ChoiceChip(
                        label: const Text('Agendado'),
                        selected: exame.status == 'agendado',
                        selectedColor: Colors.blue.shade300,
                        onSelected: (_) => _updateStatus(exame, 'agendado'),
                      ),
                      ChoiceChip(
                        label: const Text('Realizado'),
                        selected: exame.status == 'realizado',
                        selectedColor: Colors.green.shade300,
                        onSelected: (_) => _updateStatus(exame, 'realizado'),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
