import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import '../models/perfil.dart';
import '../services/supabase_service.dart';
import 'schedule_screen.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({super.key});

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  final nomeController = TextEditingController();
  DateTime? dum;
  DateTime? dpp;
  int modo = 0; // 0 = DUM, 1 = DPP
  bool loading = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Gest Ultrassom'),
        backgroundColor: Colors.green,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Icon(Icons.medical_services, size: 80, color: Colors.green),
            const SizedBox(height: 20),
            const Text(
              'Bem-vinda!',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 30),
            TextField(
              controller: nomeController,
              decoration: const InputDecoration(
                labelText: 'Seu nome',
                border: OutlineInputBorder(),
              ),
            ),
            const SizedBox(height: 20),
            SegmentedButton<int>(
              segments: const [
                ButtonSegment(value: 0, label: Text('Informar DUM')),
                ButtonSegment(value: 1, label: Text('Informar DPP')),
              ],
              selected: {modo},
              onSelectionChanged: (Set<int> newSelection) {
                setState(() => modo = newSelection.first);
              },
            ),
            const SizedBox(height: 20),
            if (modo == 0)
              ElevatedButton(
                onPressed: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: DateTime.now().subtract(const Duration(days: 90)),
                    firstDate: DateTime.now().subtract(const Duration(days: 365)),
                    lastDate: DateTime.now(),
                  );
                  if (picked != null) setState(() => dum = picked);
                },
                child: Text(dum == null ? 'Selecionar DUM' : 'DUM: ${dum!.day}/${dum!.month}/${dum!.year}'),
              ),
            if (modo == 1)
              ElevatedButton(
                onPressed: () async {
                  final picked = await showDatePicker(
                    context: context,
                    initialDate: DateTime.now().add(const Duration(days: 180)),
                    firstDate: DateTime.now(),
                    lastDate: DateTime.now().add(const Duration(days: 365)),
                  );
                  if (picked != null) setState(() => dpp = picked);
                },
                child: Text(dpp == null ? 'Selecionar DPP' : 'DPP: ${dpp!.day}/${dpp!.month}/${dpp!.year}'),
              ),
            const SizedBox(height: 30),
            if (loading)
              const CircularProgressIndicator()
            else
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 50, vertical: 15),
                ),
                onPressed: _continuar,
                child: const Text('Continuar', style: TextStyle(fontSize: 18)),
              ),
          ],
        ),
      ),
    );
  }

  Future<void> _continuar() async {
    final nome = nomeController.text.trim();
    if (nome.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor, informe seu nome')),
      );
      return;
    }

    if (modo == 0 && dum == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor, informe sua DUM')),
      );
      return;
    }

    if (modo == 1 && dpp == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Por favor, informe sua DPP')),
      );
      return;
    }

    setState(() => loading = true);

    try {
      // Criar perfil no Supabase
      final perfilId = await SupabaseService.savePerfil(
        nome: nome,
        dum: dum,
        dpp: dpp,
      );

      if (perfilId == null) throw Exception('Erro ao criar perfil');

      final perfil = PerfilGestacional(
        id: perfilId,
        nome: nome,
        dum: dum,
        dpp: dpp,
      );

      if (mounted) {
        Navigator.of(context).pushReplacementNamed(
          ScheduleScreen.routeName,
          arguments: perfil,
        );
      }
    } catch (e) {
      setState(() => loading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Erro: $e')),
        );
      }
    }
  }
}
