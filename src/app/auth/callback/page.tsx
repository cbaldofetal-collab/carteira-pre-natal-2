"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabaseClient'
import { Loader2 } from 'lucide-react'

export default function AuthCallbackPage() {
    const router = useRouter()

    useEffect(() => {
        // O cliente supabase-js detecta automaticamente o código na URL e processa a sessão
        // quando é inicializado no browser.

        // Verifica se já tem sessão
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                router.push('/dashboard')
            }
        })

        // Ouve mudanças de estado (ex: quando o login completa)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
                // Verificar se o perfil existe, se não, criar (opcional, mas bom para garantir)
                if (session?.user) {
                    checkAndCreateProfile(session.user)
                }
                router.push('/dashboard')
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [router])

    const checkAndCreateProfile = async (user: any) => {
        const { data } = await supabase
            .from('perfil_clinico')
            .select('id')
            .eq('paciente_id', user.id)
            .single()

        if (!data) {
            // Criar perfil básico com dados do Google
            await supabase
                .from('perfil_clinico')
                .insert([
                    {
                        paciente_id: user.id,
                        nome: user.user_metadata.full_name || user.email?.split('@')[0] || "Usuário",
                        // Outros campos ficam nulos por enquanto
                    }
                ])
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-muted-foreground">Finalizando autenticação...</p>
            </div>
        </div>
    )
}
