class PerfilGestacional {
  final String nome;
  final String id;
  final DateTime? dum;
  final DateTime? dpp;
  final DateTime? dppCorrigida;

  const PerfilGestacional({
    required this.nome,
    required this.id,
    this.dum,
    this.dpp,
    this.dppCorrigida,
  });
}
