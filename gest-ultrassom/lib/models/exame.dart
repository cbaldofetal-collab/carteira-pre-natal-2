class Exame {
  final String id; // UUID do Supabase
  final String perfilId;
  final String tipo; // ID do template (ex: "1tri_usg")
  final String nome; // Nome legível
  final int? semanaAlvo;
  final DateTime? dataPrevista;
  final String status; // 'pendente', 'agendado', 'realizado'
  final DateTime? agendadoPara;
  final DateTime? realizadoEm;
  final String? observacoes;
  final DateTime createdAt;
  final DateTime updatedAt;

  Exame({
    required this.id,
    required this.perfilId,
    required this.tipo,
    required this.nome,
    this.semanaAlvo,
    this.dataPrevista,
    required this.status,
    this.agendadoPara,
    this.realizadoEm,
    this.observacoes,
    required this.createdAt,
    required this.updatedAt,
  });

  factory Exame.fromJson(Map<String, dynamic> json) {
    return Exame(
      id: json['id'] as String,
      perfilId: json['perfil_id'] as String,
      tipo: json['tipo'] as String,
      nome: json['nome'] as String,
      semanaAlvo: json['semana_alvo'] as int?,
      dataPrevista: json['data_prevista'] != null
          ? DateTime.parse(json['data_prevista'] as String)
          : null,
      status: json['status'] as String? ?? 'pendente',
      agendadoPara: json['agendado_para'] != null
          ? DateTime.parse(json['agendado_para'] as String)
          : null,
      realizadoEm: json['realizado_em'] != null
          ? DateTime.parse(json['realizado_em'] as String)
          : null,
      observacoes: json['observacoes'] as String?,
      createdAt: DateTime.parse(json['created_at'] as String),
      updatedAt: DateTime.parse(json['updated_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'perfil_id': perfilId,
      'tipo': tipo,
      'nome': nome,
      'semana_alvo': semanaAlvo,
      'data_prevista': dataPrevista?.toIso8601String().split('T')[0],
      'status': status,
      'agendado_para': agendadoPara?.toIso8601String().split('T')[0],
      'realizado_em': realizadoEm?.toIso8601String().split('T')[0],
      'observacoes': observacoes,
    };
  }

  Exame copyWith({
    String? id,
    String? perfilId,
    String? tipo,
    String? nome,
    int? semanaAlvo,
    DateTime? dataPrevista,
    String? status,
    DateTime? agendadoPara,
    DateTime? realizadoEm,
    String? observacoes,
    DateTime? createdAt,
    DateTime? updatedAt,
  }) {
    return Exame(
      id: id ?? this.id,
      perfilId: perfilId ?? this.perfilId,
      tipo: tipo ?? this.tipo,
      nome: nome ?? this.nome,
      semanaAlvo: semanaAlvo ?? this.semanaAlvo,
      dataPrevista: dataPrevista ?? this.dataPrevista,
      status: status ?? this.status,
      agendadoPara: agendadoPara ?? this.agendadoPara,
      realizadoEm: realizadoEm ?? this.realizadoEm,
      observacoes: observacoes ?? this.observacoes,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }
}
