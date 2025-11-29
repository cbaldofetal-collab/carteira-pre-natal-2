import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import '../services/notification_service.dart';
import '../services/storage_service.dart';
import '../config.dart';
import '../services/supabase_service.dart';

class SettingsScreen extends StatefulWidget {
  final String perfilId;
  const SettingsScreen({super.key, required this.perfilId});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool consent = false;
  String? token;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    final c = await StorageService.getConsentNotifications();
    final t = await NotificationService.getToken();
    setState(() {
      consent = c;
      token = t;
    });
  }

  Future<void> _setConsent(bool v) async {
    await StorageService.setConsentNotifications(v);
    setState(() => consent = v);
    if (v) {
      await NotificationService.init();
      final t = await NotificationService.getToken();
      setState(() => token = t);
    }
  }

  Future<void> _copyToken() async {
    if (token == null) return;
    await Clipboard.setData(ClipboardData(text: token!));
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Token copiado')));
  }

  Future<void> _clearAll() async {
    final ok = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Limpar dados'),
        content: const Text('Tem certeza que deseja limpar dados locais deste perfil?'),
        actions: [
          TextButton(onPressed: () => Navigator.of(ctx).pop(false), child: const Text('Cancelar')),
          ElevatedButton(onPressed: () => Navigator.of(ctx).pop(true), child: const Text('Limpar')),
        ],
      ),
    );
    if (ok == true) {
      await StorageService.clearPerfil(widget.perfilId);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Dados limpos')));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Configurações')),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(
            children: [
              Chip(
                label: Text(token != null ? 'Push: Ativo' : 'Push: Inativo'),
                backgroundColor: token != null ? Colors.green.shade100 : Colors.grey.shade200,
              ),
            ],
          ),
          const SizedBox(height: 8),
          SwitchListTile(
            title: const Text('Receber notificações'),
            value: consent,
            onChanged: _setConsent,
          ),
          ListTile(
            title: const Text('Backend'),
            subtitle: Text(AppConfig.backendBaseUrl.isEmpty ? 'Mesmo domínio (web)' : AppConfig.backendBaseUrl),
            trailing: ElevatedButton(
              onPressed: () async {
                final ok = await NotificationService.pingBackend();
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(ok ? 'Backend OK' : 'Backend indisponível')));
              },
              child: const Text('Testar'),
            ),
          ),
          ListTile(
            title: const Text('Supabase'),
            trailing: ElevatedButton(
              onPressed: () async {
                final ok = await SupabaseService.health();
                if (!mounted) return;
                ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(ok ? 'Supabase OK' : 'Supabase indisponível')));
              },
              child: const Text('Testar'),
            ),
          ),
          ListTile(
            title: const Text('Token FCM'),
            subtitle: Text(token ?? 'vazio'),
            trailing: Wrap(
              spacing: 8,
              children: [
                ElevatedButton(onPressed: () async { final t = await NotificationService.fetchToken(); setState(() => token = t); }, child: const Text('Atualizar')),
                ElevatedButton(onPressed: _copyToken, child: const Text('Copiar')),
                ElevatedButton(onPressed: () async { final ok = await NotificationService.sendTokenToBackend(widget.perfilId); if (!mounted) return; ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(ok ? 'Token enviado ao backend' : 'Falha ao enviar token'))); }, child: const Text('Enviar')),
              ],
            ),
          ),
          const SizedBox(height: 8),
          ElevatedButton(onPressed: _clearAll, child: const Text('Limpar dados locais')),
        ],
      ),
    );
  }
}
