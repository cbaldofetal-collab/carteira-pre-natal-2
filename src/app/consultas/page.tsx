"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Calendar as CalendarIcon,
    Clock,
    Plus,
    MapPin,
    User,
    CheckCircle,
    AlertCircle,
    ChevronLeft,
    ChevronRight,
    Stethoscope
} from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"

export default function ConsultasPage() {
    const [showNovaConsulta, setShowNovaConsulta] = useState(false)
    const [mesAtual, setMesAtual] = useState(new Date())

    const [consultas, setConsultas] = useState<any[]>([])
    const pacienteId = "00000000-0000-0000-0000-000000000000" // Placeholder

    const loadConsultas = async () => {
        const { data, error } = await supabase
            .from("consultas")
            .select("*")
            .eq("paciente_id", pacienteId)
            .order("data", { ascending: true })

        if (error) {
            console.error("Erro ao carregar consultas:", error)
        } else {
            setConsultas(data || [])
        }
    }

    useEffect(() => {
        loadConsultas()
    }, [])

    const [novaConsulta, setNovaConsulta] = useState({
        data: "",
        hora: "",
        medico: "",
        local: "",
        tipo: "Consulta de Rotina",
        observacoes: ""
    })

    const handleSubmitConsulta = async (e: React.FormEvent) => {
        e.preventDefault()

        const { error } = await supabase.from("consultas").insert([
            {
                paciente_id: pacienteId,
                ...novaConsulta,
                status: "agendada"
            }
        ])

        if (error) {
            console.error("Erro ao agendar consulta:", error)
            alert("Erro ao agendar consulta. Tente novamente.")
        } else {
            await loadConsultas()
            setShowNovaConsulta(false)
            setNovaConsulta({
                data: "",
                hora: "",
                medico: "",
                local: "",
                tipo: "Consulta de Rotina",
                observacoes: ""
            })
            alert("Consulta agendada com sucesso!")
        }
    }

    const consultasAgendadas = consultas.filter(c => c.status === "agendada")
    const consultasRealizadas = consultas.filter(c => c.status === "realizada")

    const proximaConsulta = consultasAgendadas.sort((a, b) =>
        new Date(a.data).getTime() - new Date(b.data).getTime()
    )[0]

    // Funções do calendário
    const getDiasNoMes = (data: Date) => {
        const ano = data.getFullYear()
        const mes = data.getMonth()
        const primeiroDia = new Date(ano, mes, 1)
        const ultimoDia = new Date(ano, mes + 1, 0)
        const diasNoMes = ultimoDia.getDate()
        const diaSemanaInicio = primeiroDia.getDay()

        return { diasNoMes, diaSemanaInicio }
    }

    const mesAnterior = () => {
        setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() - 1))
    }

    const mesSeguinte = () => {
        setMesAtual(new Date(mesAtual.getFullYear(), mesAtual.getMonth() + 1))
    }

    const temConsultaNoDia = (dia: number) => {
        const dataConsulta = new Date(mesAtual.getFullYear(), mesAtual.getMonth(), dia)
        return consultas.some(c => {
            const dataC = new Date(c.data)
            return dataC.getDate() === dia &&
                dataC.getMonth() === mesAtual.getMonth() &&
                dataC.getFullYear() === mesAtual.getFullYear()
        })
    }

    const { diasNoMes, diaSemanaInicio } = getDiasNoMes(mesAtual)
    const diasArray = Array.from({ length: diasNoMes }, (_, i) => i + 1)
    const espacosVazios = Array.from({ length: diaSemanaInicio }, (_, i) => i)

    const mesesNomes = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ]

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container max-w-7xl py-6 space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                            <CalendarIcon className="h-8 w-8 text-primary" />
                            Controle de Consultas
                        </h1>
                        <p className="text-muted-foreground">
                            Gerencie suas consultas pré-natais
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowNovaConsulta(true)}
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Consulta
                    </Button>
                </div>

                {/* Próxima Consulta - Destaque */}
                {proximaConsulta && (
                    <Card className="border-primary bg-primary/5">
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-primary/10 p-3">
                                    <AlertCircle className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-semibold text-lg mb-2">Próxima Consulta</h3>
                                    <div className="grid gap-2 md:grid-cols-2 lg:grid-cols-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                            <span>{new Date(proximaConsulta.data).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <Clock className="h-4 w-4 text-muted-foreground" />
                                            <span>{proximaConsulta.hora}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <span>{proximaConsulta.medico}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="h-4 w-4 text-muted-foreground" />
                                            <span>{proximaConsulta.local}</span>
                                        </div>
                                    </div>
                                    {proximaConsulta.observacoes && (
                                        <p className="mt-3 text-sm text-muted-foreground">
                                            <strong>Observações:</strong> {proximaConsulta.observacoes}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Calendário */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Calendário de Consultas</CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Button variant="outline" size="sm" onClick={mesAnterior}>
                                            <ChevronLeft className="h-4 w-4" />
                                        </Button>
                                        <span className="font-medium min-w-[150px] text-center">
                                            {mesesNomes[mesAtual.getMonth()]} {mesAtual.getFullYear()}
                                        </span>
                                        <Button variant="outline" size="sm" onClick={mesSeguinte}>
                                            <ChevronRight className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-7 gap-2">
                                    {/* Cabeçalho dos dias da semana */}
                                    {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(dia => (
                                        <div key={dia} className="text-center text-sm font-medium text-muted-foreground p-2">
                                            {dia}
                                        </div>
                                    ))}

                                    {/* Espaços vazios antes do primeiro dia */}
                                    {espacosVazios.map(i => (
                                        <div key={`empty-${i}`} className="p-2"></div>
                                    ))}

                                    {/* Dias do mês */}
                                    {diasArray.map(dia => {
                                        const hoje = new Date()
                                        const ehHoje = dia === hoje.getDate() &&
                                            mesAtual.getMonth() === hoje.getMonth() &&
                                            mesAtual.getFullYear() === hoje.getFullYear()
                                        const temConsulta = temConsultaNoDia(dia)

                                        return (
                                            <div
                                                key={dia}
                                                className={`
                          relative p-2 text-center rounded-lg cursor-pointer transition-colors
                          ${ehHoje ? 'bg-primary text-primary-foreground font-bold' : ''}
                          ${temConsulta && !ehHoje ? 'bg-secondary/20 border-2 border-secondary' : ''}
                          ${!ehHoje && !temConsulta ? 'hover:bg-muted' : ''}
                        `}
                                            >
                                                <span className="text-sm">{dia}</span>
                                                {temConsulta && (
                                                    <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
                                                        <div className="w-1.5 h-1.5 rounded-full bg-secondary"></div>
                                                    </div>
                                                )}
                                            </div>
                                        )
                                    })}
                                </div>

                                <div className="mt-4 flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded bg-primary"></div>
                                        <span>Hoje</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="w-4 h-4 rounded border-2 border-secondary bg-secondary/20"></div>
                                        <span>Com consulta</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Formulário de Nova Consulta */}
                        {showNovaConsulta && (
                            <Card className="mt-6 border-primary">
                                <CardHeader>
                                    <CardTitle>Agendar Nova Consulta</CardTitle>
                                    <CardDescription>
                                        Preencha os dados da consulta
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmitConsulta} className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="data">Data *</Label>
                                                <Input
                                                    id="data"
                                                    type="date"
                                                    value={novaConsulta.data}
                                                    onChange={(e) => setNovaConsulta({ ...novaConsulta, data: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="hora">Horário *</Label>
                                                <Input
                                                    id="hora"
                                                    type="time"
                                                    value={novaConsulta.hora}
                                                    onChange={(e) => setNovaConsulta({ ...novaConsulta, hora: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="medico">Médico *</Label>
                                                <Input
                                                    id="medico"
                                                    value={novaConsulta.medico}
                                                    onChange={(e) => setNovaConsulta({ ...novaConsulta, medico: e.target.value })}
                                                    placeholder="Ex: Dr. João Silva"
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="local">Local *</Label>
                                                <Input
                                                    id="local"
                                                    value={novaConsulta.local}
                                                    onChange={(e) => setNovaConsulta({ ...novaConsulta, local: e.target.value })}
                                                    placeholder="Ex: Clínica Vida"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="tipo">Tipo de Consulta *</Label>
                                            <select
                                                id="tipo"
                                                value={novaConsulta.tipo}
                                                onChange={(e) => setNovaConsulta({ ...novaConsulta, tipo: e.target.value })}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            >
                                                <option value="Consulta de Rotina">Consulta de Rotina</option>
                                                <option value="Ultrassom">Ultrassom</option>
                                                <option value="Ultrassom Morfológico">Ultrassom Morfológico</option>
                                                <option value="Exames Laboratoriais">Exames Laboratoriais</option>
                                                <option value="Retorno">Retorno</option>
                                                <option value="Emergência">Emergência</option>
                                            </select>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="observacoes">Observações</Label>
                                            <textarea
                                                id="observacoes"
                                                value={novaConsulta.observacoes}
                                                onChange={(e) => setNovaConsulta({ ...novaConsulta, observacoes: e.target.value })}
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                placeholder="Levar exames, documentos, etc..."
                                            />
                                        </div>

                                        <div className="flex gap-3 justify-end">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                onClick={() => setShowNovaConsulta(false)}
                                            >
                                                Cancelar
                                            </Button>
                                            <Button type="submit" className="bg-primary hover:bg-primary/90">
                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                Agendar Consulta
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Lista de Consultas */}
                    <div className="space-y-4">
                        {/* Consultas Agendadas */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Consultas Agendadas</CardTitle>
                                <CardDescription>
                                    {consultasAgendadas.length} consulta(s) pendente(s)
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {consultasAgendadas.length === 0 ? (
                                    <p className="text-sm text-muted-foreground text-center py-4">
                                        Nenhuma consulta agendada
                                    </p>
                                ) : (
                                    consultasAgendadas.map(consulta => (
                                        <div key={consulta.id} className="p-3 rounded-lg border bg-card">
                                            <div className="flex items-start justify-between mb-2">
                                                <div className="flex-1">
                                                    <p className="font-medium text-sm">{consulta.tipo}</p>
                                                    <p className="text-xs text-muted-foreground">{consulta.medico}</p>
                                                </div>
                                                <div className="rounded-full bg-amber-500/10 px-2 py-1">
                                                    <span className="text-xs font-medium text-amber-600">Agendada</span>
                                                </div>
                                            </div>
                                            <div className="space-y-1 text-xs text-muted-foreground">
                                                <div className="flex items-center gap-1">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    <span>{new Date(consulta.data).toLocaleDateString('pt-BR')}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{consulta.hora}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" />
                                                    <span>{consulta.local}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>

                        {/* Histórico */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Histórico</CardTitle>
                                <CardDescription>
                                    Consultas realizadas
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {consultasRealizadas.slice(0, 5).map(consulta => (
                                    <div key={consulta.id} className="p-3 rounded-lg border bg-muted/50">
                                        <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                                <p className="font-medium text-sm">{consulta.tipo}</p>
                                                <p className="text-xs text-muted-foreground">{consulta.medico}</p>
                                            </div>
                                            <CheckCircle className="h-4 w-4 text-green-500" />
                                        </div>
                                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <CalendarIcon className="h-3 w-3" />
                                            <span>{new Date(consulta.data).toLocaleDateString('pt-BR')}</span>
                                        </div>
                                    </div>
                                ))}

                                {consultasRealizadas.length > 5 && (
                                    <Button variant="outline" className="w-full" size="sm">
                                        Ver Todas ({consultasRealizadas.length})
                                    </Button>
                                )}
                            </CardContent>
                        </Card>

                        {/* Link para Exame Clínico */}
                        <Card className="bg-secondary/10 border-secondary">
                            <CardContent className="pt-6">
                                <div className="flex gap-3">
                                    <Stethoscope className="h-5 w-5 text-secondary flex-shrink-0" />
                                    <div className="space-y-2">
                                        <p className="font-semibold text-sm">Após a consulta</p>
                                        <p className="text-xs text-muted-foreground">
                                            Registre os dados do exame clínico realizado
                                        </p>
                                        <Link href="/exame-clinico">
                                            <Button variant="outline" size="sm" className="w-full mt-2">
                                                Ir para Exame Clínico
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
