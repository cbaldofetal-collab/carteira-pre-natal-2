import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:flutter/foundation.dart';
import '../firebase_options.dart';
import '../config.dart';
import 'package:http/http.dart' as http;
import '../services/supabase_service.dart';

class NotificationService {
  static bool _inited = false;

  static Future<void> init() async {
    if (_inited) return;
    try {
      await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
    } catch (_) {}
    final messaging = FirebaseMessaging.instance;
    await messaging.requestPermission(alert: true, badge: true, sound: true);
    final token = await messaging.getToken(vapidKey: kIsWeb ? AppConfig.webVapidKey : null);
    if (token != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('fcm_token', token);
    }
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {});
    _inited = true;
  }

  static Future<String?> getToken() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString('fcm_token');
  }

  static Future<String?> fetchToken() async {
    try {
      await Firebase.initializeApp(options: DefaultFirebaseOptions.currentPlatform);
    } catch (_) {}
    final messaging = FirebaseMessaging.instance;
    final token = await messaging.getToken(vapidKey: kIsWeb ? AppConfig.webVapidKey : null);
    if (token != null) {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('fcm_token', token);
    }
    return token;
  }

  static Future<bool> sendTokenToBackend(String perfilId) async {
    final token = await getToken();
    if (token == null) return false;
    try {
      if (kIsWeb && AppConfig.backendBaseUrl.isEmpty) {
        return await SupabaseService.registerToken(perfilId: perfilId, token: token);
      } else {
        if (AppConfig.backendBaseUrl.isEmpty) return false;
        final url = Uri.parse('${AppConfig.backendBaseUrl}/api/registerToken');
        final res = await http.post(url, headers: {'Content-Type': 'application/json'}, body: '{"perfilId":"$perfilId","token":"$token"}');
        return res.statusCode == 200;
      }
    } catch (_) {
      return false;
    }
  }

  static Future<bool> pingBackend() async {
    try {
      Uri url;
      if (kIsWeb && AppConfig.backendBaseUrl.isEmpty) {
        url = Uri.parse('/api/health');
      } else {
        if (AppConfig.backendBaseUrl.isEmpty) return false;
        url = Uri.parse('${AppConfig.backendBaseUrl}/api/health');
      }
      final res = await http.get(url);
      return res.statusCode == 200;
    } catch (_) {
      return false;
    }
  }
}
