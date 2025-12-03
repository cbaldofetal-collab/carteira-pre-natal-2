import 'package:flutter/material.dart';
import 'screens/onboarding_screen.dart';
import 'screens/schedule_screen.dart';
import 'models/perfil.dart';
import 'services/notification_service.dart';
import 'screens/settings_screen.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(
    url: 'https://bsoehtjnmsrmdppigczs.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJzb2VodGpubXNybWRwcGlnY3pzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQ1NDMyMDksImV4cCI6MjA4MDExOTIwOX0.ly4okZZ55xXXokJ1c1ReV4KdP_VzaRb_GpFYvxBNLOs',
  );
  NotificationService.init();
  runApp(const GestUltrassomApp());
}

class GestUltrassomApp extends StatelessWidget {
  const GestUltrassomApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Gest Ultrassom',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xFF2E7D32)),
        useMaterial3: true,
      ),
      home: const OnboardingScreen(),
      onGenerateRoute: (settings) {
        if (settings.name == ScheduleScreen.routeName) {
          final perfil = settings.arguments as PerfilGestacional;
          return MaterialPageRoute(
            builder: (_) => ScheduleScreen(perfil: perfil),
          );
        }
        if (settings.name == '/settings') {
          final perfilId = settings.arguments as String;
          return MaterialPageRoute(
            builder: (_) => SettingsScreen(perfilId: perfilId),
          );
        }
        return null;
      },
    );
  }
}
