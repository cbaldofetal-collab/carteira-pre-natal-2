class ExameTemplate {
  final String id;
  final String nome;
  final String descricao;
  final int inicioSemana;
  final int fimSemana;

  const ExameTemplate({
    required this.id,
    required this.nome,
    required this.descricao,
    required this.inicioSemana,
    required this.fimSemana,
  });
}

class TemplatesPadrao {
  static List<ExameTemplate> lista() {
    return const [
      ExameTemplate(
        id: 'morf1',
        nome: 'Ultrassom Morfológico 1º Trimestre',
        descricao: 'Avaliação anatômica inicial e translucência nucal.',
        inicioSemana: 11,
        fimSemana: 13,
      ),
      ExameTemplate(
        id: 'morf2',
        nome: 'Ultrassom Morfológico 2º Trimestre',
        descricao: 'Avaliação detalhada entre 22–24 semanas.',
        inicioSemana: 22,
        fimSemana: 24,
      ),
      ExameTemplate(
        id: 'cres28',
        nome: 'Ultrassom de Crescimento',
        descricao: 'Crescimento e Doppler conforme risco entre 28–32 semanas.',
        inicioSemana: 28,
        fimSemana: 32,
      ),
      ExameTemplate(
        id: 'cres34',
        nome: 'Ultrassom de Crescimento Final',
        descricao: 'Reavaliação final de crescimento em 34–36 semanas.',
        inicioSemana: 34,
        fimSemana: 36,
      ),
    ];
  }
}
