"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Weight, Ruler, Baby, ArrowLeft, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { supabase } from "@/lib/supabaseClient"

export default function GraficosPage() {
    const [loading, setLoading] = useState(true)
    const [dadosPeso, setDadosPeso] = useState<any[]>([])
    const [dadosAlturaUterina, setDadosAlturaUterina] = useState<any[]>([])

    // Placeholder patient ID - replace with auth context later
    const pacienteId = "00000000-0000-0000-0000-000000000000"

    // Curvas de referência (mantidas estáticas por enquanto para comparação)
    const referenciaAlturaUterina = [
        { semana: 20, p10: 18, p50: 20, p90: 22 },
        { semana: 24, p10: 22, p50: 24, p90: 26 },
        { semana: 28, p10: 26, p50: 28, p90: 30 },
        { semana: 32, p10: 29, p50: 32, p90: 34 },
        { semana: 36, p10: 32, p50: 35, p90: 38 },
        { semana: 40, p10: 34, p50: 37, p90: 40 },
    ]

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            // Buscar exames clínicos
            const { data: exames, error } = await supabase
                .from('exames_clinicos')
                .select('data, peso, altura_uterina, idade_gestacional') // Precisamos garantir que esses campos existam ou sejam adaptados
                .eq('paciente_id', pacienteId)
                .order('data', { ascending: true })

            if (error) throw error

            if (exames) {
                // Processar dados para o gráfico de Peso
                // Assumindo que temos uma data base para calcular semanas ou o campo idade_gestacional
                // Para simplificar, vamos tentar extrair a semana da string "XX semanas" se existir, ou usar um contador simples

                const processedPeso = exames.map((exame, index) => {
                    // Tenta extrair número da string "24 semanas"
                    const semanaMatch = exame.idade_gestacional?.match(/(\d+)/)
                    const semana = semanaMatch ? parseInt(semanaMatch[0]) : index * 4 + 12 // Fallback

                    return {
                        semana,
                        peso: parseFloat(exame.peso) || null,
                        // Peso ideal simplificado: ganho de 0.4kg/semana a partir da semana 12 (base 60kg)
                        pesoIdeal: 60 + (semana > 12 ? (semana - 12) * 0.4 : 0)
                    }
                }).filter(d => d.peso !== null)

                setDadosPeso(processedPeso)

                // Processar dados para Altura Uterina
                // Combinar dados reais com curvas de referência
                const processedAU = exames.map((exame, index) => {
                    const semanaMatch = exame.idade_gestacional?.match(/(\d+)/)
                    const semana = semanaMatch ? parseInt(semanaMatch[0]) : index * 4 + 12

                    // Encontrar referência próxima
                    const ref = referenciaAlturaUterina.find(r => Math.abs(r.semana - semana) <= 2) || {}

                    return {
                        semana,
                        au: parseFloat(exame.altura_uterina) || null,
                        ...ref
                    }
                }).filter(d => d.au !== null)

                // Se não tiver dados reais suficientes, mesclar com referência para mostrar o gráfico de fundo
                if (processedAU.length === 0) {
                    setDadosAlturaUterina(referenciaAlturaUterina)
                } else {
                    setDadosAlturaUterina(processedAU)
                }
            }
        } catch (error) {
            console.error("Erro ao carregar gráficos:", error)
        } finally {
            setLoading(false)
        }
    }

    // Dados mock - Percentil do Peso Fetal (mantido mock por enquanto pois vem de USG)
    const dadosPercentilFetal = [
        { semana: 12, peso: 14, p10: 10, p50: 14, p90: 18 },
        { semana: 16, peso: 100, p10: 80, p50: 100, p90: 120 },
        { semana: 20, peso: 300, p10: 250, p50: 300, p90: 350 },
        { semana: 24, peso: 600, p10: 500, p50: 600, p90: 700 },
        { semana: 28, peso: 1000, p10: 850, p50: 1000, p90: 1200 },
        { semana: 32, peso: 1700, p10: 1500, p50: 1800, p90: 2100 },
        { semana: 36, peso: 2500, p10: 2200, p50: 2600, p90: 3000 },
    ]

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container max-w-7xl py-6 space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Link href="/exame-clinico">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Voltar
                                </Button>
                            </Link>
                        </div>
                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                            <TrendingUp className="h-8 w-8 text-primary" />
                            Gráficos de Evolução
                        </h1>
                        <p className="text-muted-foreground">
                            Acompanhe a evolução da gestação com base nos seus registros clínicos
                        </p>
                    </div>
                </div>

                {/* Gráfico 1: Ganho de Peso Materno */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Weight className="h-5 w-5 text-primary" />
                            Ganho de Peso Materno
                        </CardTitle>
                        <CardDescription>
                            Evolução do peso durante a gestação
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {dadosPeso.length > 0 ? (
                            <ResponsiveContainer width="100%" height={350}>
                                <AreaChart data={dadosPeso}>
                                    <defs>
                                        <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                    <XAxis
                                        dataKey="semana"
                                        label={{ value: 'Semanas', position: 'insideBottom', offset: -5 }}
                                        stroke="hsl(var(--muted-foreground))"
                                    />
                                    <YAxis
                                        label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft' }}
                                        stroke="hsl(var(--muted-foreground))"
                                        domain={['auto', 'auto']}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: 'hsl(var(--background))',
                                            border: '1px solid hsl(var(--border))',
                                            borderRadius: '8px'
                                        }}
                                    />
                                    <Legend />
                                    <Area
                                        type="monotone"
                                        dataKey="peso"
                                        stroke="hsl(var(--primary))"
                                        fillOpacity={1}
                                        fill="url(#colorPeso)"
                                        name="Peso Atual"
                                        strokeWidth={3}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="h-[350px] flex items-center justify-center text-muted-foreground bg-muted/10 rounded-lg">
                                Nenhum dado de peso registrado ainda.
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Gráfico 2: Altura Uterina */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Ruler className="h-5 w-5 text-secondary" />
                            Altura Uterina
                        </CardTitle>
                        <CardDescription>
                            Medida da altura uterina (cm) por semana de gestação
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={dadosAlturaUterina}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="semana"
                                    label={{ value: 'Semanas', position: 'insideBottom', offset: -5 }}
                                    stroke="hsl(var(--muted-foreground))"
                                />
                                <YAxis
                                    label={{ value: 'Altura Uterina (cm)', angle: -90, position: 'insideLeft' }}
                                    stroke="hsl(var(--muted-foreground))"
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="p10"
                                    stroke="hsl(var(--muted-foreground))"
                                    strokeDasharray="5 5"
                                    strokeWidth={1.5}
                                    name="P10"
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="p50"
                                    stroke="hsl(var(--accent))"
                                    strokeDasharray="3 3"
                                    strokeWidth={2}
                                    name="P50 (Média)"
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="p90"
                                    stroke="hsl(var(--muted-foreground))"
                                    strokeDasharray="5 5"
                                    strokeWidth={1.5}
                                    name="P90"
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="au"
                                    stroke="hsl(var(--secondary))"
                                    strokeWidth={3}
                                    name="Sua Medida"
                                    connectNulls
                                    dot={{ fill: 'hsl(var(--secondary))', r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                {/* Gráfico 3: Percentil do Peso Fetal */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Baby className="h-5 w-5 text-pink-500" />
                            Evolução do Percentil do Peso Fetal (Exemplo)
                        </CardTitle>
                        <CardDescription>
                            Estimativa do peso fetal por ultrassom com curvas de percentil
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={dadosPercentilFetal}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="semana"
                                    label={{ value: 'Semanas de Gestação', position: 'insideBottom', offset: -5 }}
                                    stroke="hsl(var(--muted-foreground))"
                                />
                                <YAxis
                                    label={{ value: 'Peso Fetal (g)', angle: -90, position: 'insideLeft' }}
                                    stroke="hsl(var(--muted-foreground))"
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: 'hsl(var(--background))',
                                        border: '1px solid hsl(var(--border))',
                                        borderRadius: '8px'
                                    }}
                                />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="p10"
                                    stroke="hsl(var(--muted-foreground))"
                                    strokeDasharray="5 5"
                                    strokeWidth={1.5}
                                    name="P10"
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="p50"
                                    stroke="hsl(var(--accent))"
                                    strokeDasharray="3 3"
                                    strokeWidth={2}
                                    name="P50 (Mediana)"
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="p90"
                                    stroke="hsl(var(--muted-foreground))"
                                    strokeDasharray="5 5"
                                    strokeWidth={1.5}
                                    name="P90"
                                    dot={false}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="peso"
                                    stroke="#ec4899"
                                    strokeWidth={3}
                                    name="Peso Estimado"
                                    dot={{ fill: '#ec4899', r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
