"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Heart, FileText, Activity, Bell, Plus } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

export default function DashboardPage() {
    const pacienteId = "00000000-0000-0000-0000-000000000000" // Placeholder

    const [gestante, setGestante] = useState({
        nome: "Gestante",
        semanaGestacional: 0,
        dpp: "",
        proximaConsulta: null as any
    })
    const [examesPendentes, setExamesPendentes] = useState(0)
    const [ultimosExames, setUltimosExames] = useState<any[]>([])

    useEffect(() => {
        loadDashboardData()
    }, [])

    const loadDashboardData = async () => {
        // 1. Carregar Perfil (Nome e DUM/DPP)
        const { data: perfil } = await supabase
            .from('perfil_clinico')
            .select('nome, dum, dpp')
            .eq('paciente_id', pacienteId)
            .single()

        let semanas = 0
        let dpp = ""

        if (perfil) {
            if (perfil.dum) {
                const dumDate = new Date(perfil.dum)
                const hoje = new Date()
                const diffTime = Math.abs(hoje.getTime() - dumDate.getTime())
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                semanas = Math.floor(diffDays / 7)
            }
            dpp = perfil.dpp || ""
        }

        // 2. Carregar Próxima Consulta
        const { data: consultas } = await supabase
            .from('consultas')
            .select('*')
            .eq('paciente_id', pacienteId)
            .eq('status', 'agendada')
            .gte('data', new Date().toISOString().split('T')[0])
            .order('data', { ascending: true })
            .limit(1)

        const proximaConsulta = consultas && consultas.length > 0 ? consultas[0] : null

        // 3. Carregar Últimos Exames (Simplificado: apenas laboratoriais por enquanto)
        const { data: exames } = await supabase
            .from('exames_laboratoriais')
            .select('*')
            .eq('paciente_id', pacienteId)
            .order('data', { ascending: false })
            .limit(3)

        setGestante({
            nome: perfil?.nome || "Gestante",
            semanaGestacional: semanas,
            dpp: dpp,
            proximaConsulta: proximaConsulta
        })
        setUltimosExames(exames || [])
        setExamesPendentes(0) // Lógica de pendência pode ser implementada depois
    }

    const calcularDiasParaConsulta = () => {
        if (!gestante.proximaConsulta) return 0
        const hoje = new Date()
        const consulta = new Date(gestante.proximaConsulta.data)
        const diff = Math.ceil((consulta.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
        return diff
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container max-w-7xl py-6 space-y-6">
                {/* Welcome Section */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground">
                        Olá, {gestante.nome}! 👋
                    </h1>
                    <p className="text-muted-foreground">
                        Acompanhe sua jornada pré-natal de forma organizada e segura.
                    </p>
                </div>

                {/* Main Stats Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    {/* Semana Gestacional */}
                    <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Semana Gestacional
                            </CardTitle>
                            <Heart className="h-4 w-4 text-primary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-primary">{gestante.semanaGestacional}</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                DPP: {gestante.dpp ? new Date(gestante.dpp).toLocaleDateString('pt-BR') : "Não calculada"}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Próxima Consulta */}
                    <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Próxima Consulta
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-secondary" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-secondary">
                                {gestante.proximaConsulta ? `${calcularDiasParaConsulta()} dias` : "Nenhuma"}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {gestante.proximaConsulta ? new Date(gestante.proximaConsulta.data).toLocaleDateString('pt-BR') : "Agende uma consulta"}
                            </p>
                        </CardContent>
                    </Card>

                    {/* Exames Pendentes */}
                    <Card className="bg-gradient-to-br from-accent/10 to-accent/5 border-accent/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Exames Pendentes
                            </CardTitle>
                            <FileText className="h-4 w-4 text-accent" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold text-accent">3</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Para realizar este mês
                            </p>
                        </CardContent>
                    </Card>

                    {/* Status Geral */}
                    <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Status Geral
                            </CardTitle>
                            <Activity className="h-4 w-4 text-blue-500" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-blue-500">Ótimo</div>
                            <p className="text-xs text-muted-foreground mt-1">
                                Tudo em dia
                            </p>
                        </CardContent>
                    </Card>
                </div>

                {/* Content Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {/* Lembretes */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="h-5 w-5 text-primary" />
                                        Lembretes Importantes
                                    </CardTitle>
                                    <CardDescription>Ações pendentes e próximos passos</CardDescription>
                                </div>
                                <Button size="sm" variant="ghost">
                                    <Plus className="h-4 w-4 mr-1" />
                                    Adicionar
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {gestante.proximaConsulta ? (
                                <div className="flex items-start space-x-4 p-3 rounded-lg bg-secondary/10 border border-secondary/20">
                                    <div className="rounded-full bg-secondary/20 p-2">
                                        <Calendar className="h-4 w-4 text-secondary" />
                                    </div>
                                    <div className="flex-1 space-y-1">
                                        <p className="text-sm font-medium">{gestante.proximaConsulta.tipo}</p>
                                        <p className="text-xs text-muted-foreground">
                                            Agendada para {new Date(gestante.proximaConsulta.data).toLocaleDateString('pt-BR')} às {gestante.proximaConsulta.hora}
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-sm text-muted-foreground p-3">Nenhuma consulta agendada.</div>
                            )}

                            <div className="flex items-start space-x-4 p-3 rounded-lg bg-accent/10 border border-accent/20">
                                <div className="rounded-full bg-accent/20 p-2">
                                    <FileText className="h-4 w-4 text-accent" />
                                </div>
                                <div className="flex-1 space-y-1">
                                    <p className="text-sm font-medium">Ultrassom Morfológico</p>
                                    <p className="text-xs text-muted-foreground">
                                        Recomendado entre 20-24 semanas
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Ações Rápidas</CardTitle>
                            <CardDescription>Acesse suas funcionalidades</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link href="/perfil">
                                <Button variant="outline" className="w-full justify-start">
                                    <Heart className="mr-2 h-4 w-4" />
                                    Meu Perfil
                                </Button>
                            </Link>
                            <Link href="/exames">
                                <Button variant="outline" className="w-full justify-start">
                                    <FileText className="mr-2 h-4 w-4" />
                                    Meus Exames
                                </Button>
                            </Link>
                            <Link href="/consultas">
                                <Button variant="outline" className="w-full justify-start">
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Consultas
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Últimos Exames */}
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Últimos Exames</CardTitle>
                                <CardDescription>Resultados recentes</CardDescription>
                            </div>
                            <Link href="/exames">
                                <Button variant="ghost" size="sm">
                                    Ver todos
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {ultimosExames.map((exame) => (
                                <div key={exame.id} className="flex items-center justify-between p-4 rounded-lg border">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium">{exame.nome}</p>
                                        <p className="text-xs text-muted-foreground">{new Date(exame.data).toLocaleDateString('pt-BR')}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded">
                                            {exame.resultado || "Ver"}
                                        </span>
                                        <Button variant="ghost" size="sm">Ver</Button>
                                    </div>
                                </div>
                            ))}
                            {ultimosExames.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">Nenhum exame recente.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
