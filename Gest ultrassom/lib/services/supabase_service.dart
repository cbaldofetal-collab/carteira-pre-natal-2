import 'package:supabase_flutter/supabase_flutter.dart';

class SupabaseService {
  static SupabaseClient get _client => Supabase.instance.client;

  static Future<bool> health() async {
    try {
      final res = await _client.functions.invoke('health');
      return res.status == 200;
    } catch (_) {
      return false;
    }
  }

  static Future<void> savePerfil(Map<String, dynamic> perfil) async {
    await _client.from('perfis').upsert(perfil);
  }

  static Future<List<Map<String, dynamic>>> listExames(String perfilId) async {
    final rows = await _client
        .from('exames')
        .select()
        .eq('perfil_id', perfilId)
        .order('data', ascending: true);
    return List<Map<String, dynamic>>.from(rows as List);
  }

  static Future<void> addExame(Map<String, dynamic> exame) async {
    await _client.from('exames').insert(exame);
  }
}
