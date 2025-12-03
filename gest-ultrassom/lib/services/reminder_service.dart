import 'package:flutter/material.dart';
import '../models/exame_template.dart';
import 'gestacao_service.dart';

class Reminder {
  final String exameId;
  final String titulo;
  final DateTime quando;
  final String tipo;

  const Reminder({required this.exameId, required this.titulo, required this.quando, required this.tipo});
}

class ReminderService {
  static List<Reminder> gerar(DateTime base, List<ExameTemplate> templates) {
    final hoje = DateUtils.dateOnly(DateTime.now());
    final list = <Reminder>[];
    for (final t in templates) {
      final inicio = GestacaoService.addSemanas(base, t.inicioSemana);
      final r14 = inicio.subtract(const Duration(days: 14));
      final r7 = inicio.subtract(const Duration(days: 7));
      list.add(Reminder(exameId: t.id, titulo: t.nome, quando: r14, tipo: 'T-14'));
      list.add(Reminder(exameId: t.id, titulo: t.nome, quando: r7, tipo: 'T-7'));
    }
    list.sort((a, b) => a.quando.compareTo(b.quando));
    return list.where((r) => !r.quando.isBefore(hoje)).toList();
  }
}
