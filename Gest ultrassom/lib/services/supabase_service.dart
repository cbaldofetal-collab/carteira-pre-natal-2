import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseService {
  static SupabaseClient get _client => Supabase.instance.client;

  // ==================== PERFIS ====================
  
  static Future<bool> health() async {
    try {
      final res = await _client.functions.invoke('health');
      return res.status == 200;
    } catch (_) {
      return false;
    }
  }

  static Future<String> savePerfil(Map<String, dynamic> perfil) async {
    final response = await _client.from('perfis').upsert(perfil).select();
    if (response.isEmpty) throw Exception('Erro ao salvar perfil');
    return response[0]['id'] as String;
  }

  static Future<Map<String, dynamic>?> getPerfil(String perfilId) async {
    final rows = await _client
        .from('perfis')
        .select()
        .eq('id', perfilId)
        .limit(1);
    if (rows.isEmpty) return null;
    return rows[0] as Map<String, dynamic>;
  }

  static Future<void> updateDppCorrigida(String perfilId, DateTime? dppCorrigida) async {
    await _client.from('perfis').update({
      'dpp_corrigida': dppCorrigida?.toIso8601String().split('T')[0],
    }).eq('id', perfilId);
  }

  // ==================== EXAMES ====================

  static Future<List<Map<String, dynamic>>> listExames(String perfilId) async {
    final rows = await _client
        .from('exames')
        .select()
        .eq('perfil_id', perfilId)
        .order('data_prevista', ascending: true);
    return List<Map<String, dynamic>>.from(rows as List);
  }

  static Future<void> addExame(Map<String, dynamic> exame) async {
    await _client.from('exames').insert(exame);
  }

  static Future<void> updateExameStatus(String exameId, String status) async {
    await _client.from('exames').update({
      'status': status,
    }).eq('id', exameId);
  }

  static Future<void> updateExameDatas({
    required String exameId,
    DateTime? agendadoPara,
    DateTime? realizadoEm,
  }) async {
    final data = <String, dynamic>{};
    if (agendadoPara != null) {
      data['agendado_para'] = agendadoPara.toIso8601String().split('T')[0];
    }
    if (realizadoEm != null) {
      data['realizado_em'] = realizadoEm.toIso8601String().split('T')[0];
    }
    if (data.isNotEmpty) {
      await _client.from('exames').update(data).eq('id', exameId);
    }
  }

  static Future<void> updateExameCompleto({
    required String exameId,
    String? status,
    DateTime? agendadoPara,
    DateTime? realizadoEm,
    String? observacoes,
  }) async {
    final data = <String, dynamic>{};
    if (status != null) data['status'] = status;
    if (observacoes != null) data['observacoes'] = observacoes;
    if (agendadoPara != null) {
      data['agendado_para'] = agendadoPara.toIso8601String().split('T')[0];
    }
    if (realizadoEm != null) {
      data['realizado_em'] = realizadoEm.toIso8601String().split('T')[0];
    }
    
    if (data.isNotEmpty) {
      await _client.from('exames').update(data).eq('id', exameId);
    }
  }

  static Future<void> createExamesFromTemplates({
    required String perfilId,
    required DateTime baseDate,
    required List<Map<String, dynamic>> templates,
  }) async {
    final exames = <Map<String, dynamic>>[];
    
    for (final template in templates) {
      final semanaAlvo = template['inicioSemana'] as int;
      final dataPrevista = baseDate.add(Duration(days: semanaAlvo * 7));
      
      exames.add({
        'perfil_id': perfilId,
        'tipo': template['id'] as String,
        'nome': template['nome'] as String,
        'semana_alvo': semanaAlvo,
        'data_prevista': dataPrevista.toIso8601String().split('T')[0],
        'status': 'pendente',
      });
    }
    
    if (exames.isNotEmpty) {
      await _client.from('exames').insert(exames);
    }
  }

  // ==================== ANEXOS ====================

  static Future<String> uploadAnexo({
    required String perfilId,
    required String exameId,
    required String fileName,
    required List<int> fileBytes,
    String? mimeType,
  }) async {
    // Upload para o Storage
    final timestamp = DateTime.now().millisecondsSinceEpoch;
    final storagePath = '$perfilId/$exameId/$timestamp-$fileName';
    
    await _client.storage
        .from('exam-attachments')
        .uploadBinary(storagePath, fileBytes);
    
    // Registrar no banco
    await _client.from('anexos').insert({
      'exame_id': exameId,
      'perfil_id': perfilId,
      'nome_arquivo': fileName,
      'caminho_storage': storagePath,
      'tipo_mime': mimeType,
      'tamanho_bytes': fileBytes.length,
    });
    
    return storagePath;
  }

  static Future<List<Map<String, dynamic>>> listAnexos(String exameId) async {
    final rows = await _client
        .from('anexos')
        .select()
        .eq('exame_id', exameId)
        .order('created_at', ascending: false);
    return List<Map<String, dynamic>>.from(rows as List);
  }

  static String getAnexoUrl(String storagePath) {
    return _client.storage
        .from('exam-attachments')
        .getPublicUrl(storagePath);
  }

  static Future<void> deleteAnexo(String anexoId, String storagePath) async {
    // Deletar do storage
    await _client.storage.from('exam-attachments').remove([storagePath]);
    
    // Deletar do banco
    await _client.from('anexos').delete().eq('id', anexoId);
  }

  // ==================== FCM TOKENS ====================

  static Future<bool> registerToken({
    required String perfilId,
    required String token,
  }) async {
    try {
      final res = await _client.functions.invoke('registerToken', body: {
        'perfilId': perfilId,
        'token': token,
      });
      return res.status == 200;
    } catch (_) {
      return false;
    }
  }
}

