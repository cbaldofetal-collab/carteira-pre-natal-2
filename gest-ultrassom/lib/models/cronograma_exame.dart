import 'exame_template.dart';

class CronogramaExame {
  final ExameTemplate template;
  final String status;
  final int semanaAlvo;
  final DateTime inicioJanela;
  final DateTime fimJanela;

  const CronogramaExame({
    required this.template,
    required this.status,
    required this.semanaAlvo,
    required this.inicioJanela,
    required this.fimJanela,
  });
}
