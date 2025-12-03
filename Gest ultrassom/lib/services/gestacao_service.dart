import 'package:flutter/material.dart';

class GestacaoInfo {
  final int semanas;
  final int dias;
  final DateTime dpp;

  const GestacaoInfo({
    required this.semanas,
    required this.dias,
    required this.dpp,
  });
}

class GestacaoService {
  static GestacaoInfo calcular({DateTime? dum, DateTime? dpp}) {
    final hoje = DateUtils.dateOnly(DateTime.now());
    if (dum != null) {
      final dppCalc = dum.add(const Duration(days: 280));
      final diasGestacao = hoje.difference(dum).inDays;
      final semanas = diasGestacao ~/ 7;
      final dias = diasGestacao % 7;
      return GestacaoInfo(semanas: semanas, dias: dias, dpp: dppCalc);
    }
    if (dpp != null) {
      final diasRestantes = dpp.difference(hoje).inDays;
      final diasGestacao = 280 - diasRestantes;
      final semanas = diasGestacao ~/ 7;
      final dias = diasGestacao % 7;
      return GestacaoInfo(semanas: semanas, dias: dias, dpp: dpp);
    }
    final vazio = hoje.add(const Duration(days: 280));
    return GestacaoInfo(semanas: 0, dias: 0, dpp: vazio);
  }

  static DateTime addSemanas(DateTime base, int semanas) {
    return base.add(Duration(days: semanas * 7));
  }

  static String formatDate(DateTime d) {
    final day = d.day.toString().padLeft(2, '0');
    final month = d.month.toString().padLeft(2, '0');
    final year = d.year.toString();
    return '$day/$month/$year';
  }
}
