class Anexo {
  final String id;
  final String exameId;
  final String perfilId;
  final String nomeArquivo;
  final String caminhoStorage;
  final String? tipoMime;
  final int? tamanhoBytes;
  final DateTime createdAt;

  Anexo({
    required this.id,
    required this.exameId,
    required this.perfilId,
    required this.nomeArquivo,
    required this.caminhoStorage,
    this.tipoMime,
    this.tamanhoBytes,
    required this.createdAt,
  });

  factory Anexo.fromJson(Map<String, dynamic> json) {
    return Anexo(
      id: json['id'] as String,
      exameId: json['exame_id'] as String,
      perfilId: json['perfil_id'] as String,
      nomeArquivo: json['nome_arquivo'] as String,
      caminhoStorage: json['caminho_storage'] as String,
      tipoMime: json['tipo_mime'] as String?,
      tamanhoBytes: json['tamanho_bytes'] as int?,
      createdAt: DateTime.parse(json['created_at'] as String),
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'exame_id': exameId,
      'perfil_id': perfilId,
      'nome_arquivo': nomeArquivo,
      'caminho_storage': caminhoStorage,
      'tipo_mime': tipoMime,
      'tamanho_bytes': tamanhoBytes,
    };
  }

  String get tamanhoFormatado {
    if (tamanhoBytes == null) return '—';
    if (tamanhoBytes! < 1024) return '$tamanhoBytes B';
    if (tamanhoBytes! < 1024 * 1024) {
      return '${(tamanhoBytes! / 1024).toStringAsFixed(1)} KB';
    }
    return '${(tamanhoBytes! / (1024 * 1024)).toStringAsFixed(1)} MB';
  }
}
