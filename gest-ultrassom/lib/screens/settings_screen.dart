import 'package:flutter/material.dart';
import '../services/storage_service.dart';
import '../services/supabase_service.dart';

class SettingsScreen extends StatefulWidget {
  final String perfilId;
  const SettingsScreen({super.key, required this.perfilId});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Configurações'),
        backgroundColor: Colors.green,
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          const ListTile(
            leading: Icon(Icons.info_outline),
            title: Text('Gest Ultrassom'),
            subtitle: Text('Agendamento Inteligente de Exames Pré-Natais'),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.cloud),
            title: const Text('Testar Supabase'),
            trailing: ElevatedButton(
              onPressed: () async {
                try {
                  final ok = await SupabaseService.health();
                  if (!mounted) return;
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: Text(ok ? '✓ Supabase OK' : '✗ Supabase indisponível'),
                      backgroundColor: ok ? Colors.green : Colors.red,
                    ),
                  );
                } catch (e) {
                  if (!mounted) return;
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(content: Text('Erro: $e')),
                  );
                }
              },
              child: const Text('Testar'),
            ),
          ),
          const Divider(),
          ListTile(
            leading: const Icon(Icons.delete_forever),
            title: const Text('Limpar dados locais'),
            subtitle: const Text('Remove dados salvos neste dispositivo'),
            trailing: ElevatedButton(
              style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
              onPressed: () async {
                final ok = await showDialog<bool>(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    title: const Text('Limpar dados'),
                    content: const Text(
                      'Tem certeza que deseja limpar os dados locais deste perfil?',
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.of(ctx).pop(false),
                        child: const Text('Cancelar'),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(backgroundColor: Colors.red),
                        onPressed: () => Navigator.of(ctx).pop(true),
                        child: const Text('Limpar'),
                      ),
                    ],
                  ),
                );
                if (ok == true) {
                  await StorageService.clearPerfil(widget.perfilId);
                  if (!mounted) return;
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('Dados locais limpos')),
                  );
                }
              },
              child: const Text('Limpar'),
            ),
          ),
        ],
      ),
    );
  }
}
