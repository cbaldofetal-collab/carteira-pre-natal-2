import 'package:shared_preferences/shared_preferences.dart';
import '../models/perfil.dart';

class StorageService {
  static Future<Map<String, String>> loadStatus(String perfilId) async {
    final prefs = await SharedPreferences.getInstance();
    final map = <String, String>{};
    final keys = prefs.getStringList('status_keys_$perfilId') ?? [];
    for (final k in keys) {
      final v = prefs.getString('status_$perfilId_$k');
      if (v != null) map[k] = v;
    }
    return map;
  }

  static Future<void> saveStatus(String perfilId, Map<String, String> map) async {
    final prefs = await SharedPreferences.getInstance();
    final keys = map.keys.toList();
    await prefs.setStringList('status_keys_$perfilId', keys);
    for (final e in map.entries) {
      await prefs.setString('status_$perfilId_${e.key}', e.value);
    }
  }

  static Future<void> savePerfil(PerfilGestacional perfil) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('perfil_id', perfil.id);
    await prefs.setString('perfil_nome', perfil.nome);
    await prefs.setString('perfil_dum', perfil.dum?.toIso8601String() ?? '');
    await prefs.setString('perfil_dpp', perfil.dpp?.toIso8601String() ?? '');
  }

  static Future<PerfilGestacional?> loadPerfil() async {
    final prefs = await SharedPreferences.getInstance();
    final id = prefs.getString('perfil_id');
    final nome = prefs.getString('perfil_nome');
    if (id == null || nome == null) return null;
    final dumStr = prefs.getString('perfil_dum');
    final dppStr = prefs.getString('perfil_dpp');
    final dum = (dumStr != null && dumStr.isNotEmpty) ? DateTime.tryParse(dumStr) : null;
    final dpp = (dppStr != null && dppStr.isNotEmpty) ? DateTime.tryParse(dppStr) : null;
    final dppc = await loadDppCorrigida(id);
    return PerfilGestacional(nome: nome, id: id, dum: dum, dpp: dpp, dppCorrigida: dppc);
  }

  static Future<DateTime?> loadDppCorrigida(String perfilId) async {
    final prefs = await SharedPreferences.getInstance();
    final v = prefs.getString('dppc_$perfilId');
    if (v == null) return null;
    return DateTime.tryParse(v);
  }

  static Future<void> saveDppCorrigida(String perfilId, DateTime dppCorrigida) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('dppc_$perfilId', dppCorrigida.toIso8601String());
  }

  static Future<void> clearDppCorrigida(String perfilId) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('dppc_$perfilId');
  }

  static Future<DateTime?> getAgendadoData(String perfilId, String exameId) async {
    final prefs = await SharedPreferences.getInstance();
    final s = prefs.getString('agendado_${perfilId}_$exameId');
    if (s == null || s.isEmpty) return null;
    return DateTime.tryParse(s);
  }

  static Future<void> setAgendadoData(String perfilId, String exameId, DateTime data) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('agendado_${perfilId}_$exameId', data.toIso8601String());
  }

  static Future<DateTime?> getRealizadoData(String perfilId, String exameId) async {
    final prefs = await SharedPreferences.getInstance();
    final s = prefs.getString('realizado_${perfilId}_$exameId');
    if (s == null || s.isEmpty) return null;
    return DateTime.tryParse(s);
  }

  static Future<void> setRealizadoData(String perfilId, String exameId, DateTime data) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString('realizado_${perfilId}_$exameId', data.toIso8601String());
  }
  static Future<bool> getConsentNotifications() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getBool('consent_notifications') ?? false;
  }

  static Future<void> setConsentNotifications(bool v) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setBool('consent_notifications', v);
  }

  static Future<void> clearPerfil(String perfilId) async {
    final prefs = await SharedPreferences.getInstance();
    final keys = prefs.getStringList('status_keys_$perfilId') ?? [];
    for (final k in keys) {
      await prefs.remove('status_$perfilId_$k');
    }
    await prefs.remove('status_keys_$perfilId');
    await prefs.remove('perfil_id');
    await prefs.remove('perfil_nome');
    await prefs.remove('perfil_dum');
    await prefs.remove('perfil_dpp');
    await prefs.remove('dppc_$perfilId');
  }
}
