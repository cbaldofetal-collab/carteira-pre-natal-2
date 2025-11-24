"use client"

import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts'
import { TrendingUp, Weight, Ruler, Baby, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function GraficosPage() {
    // Dados mock - Ganho de Peso Materno
    const dadosPeso = [
        { semana: 8, peso: 60, pesoIdeal: 60 },
        { semana: 12, peso: 61.5, pesoIdeal: 61.2 },
        { semana: 16, peso: 63, pesoIdeal: 62.8 },
        { semana: 20, peso: 64, pesoIdeal: 64.5 },
        { semana: 24, peso: 68, pesoIdeal: 66.5 },
        { semana: 28, peso: 70, pesoIdeal: 68.5 },
        { semana: 32, peso: 72, pesoIdeal: 70.5 },
        { semana: 36, peso: 74, pesoIdeal: 72.5 },
    ]

    // Dados mock - Altura Uterina
    const dadosAlturaUterina = [
        { semana: 12, au: 12, p10: 10, p50: 12, p90: 14 },
        { semana: 16, au: 16, p10: 14, p50: 16, p90: 18 },
        { semana: 20, au: 20, p10: 18, p50: 20, p90: 22 },
        { semana: 24, au: 24, p10: 22, p50: 24, p90: 26 },
        { semana: 28, au: 28, p10: 26, p50: 28, p90: 30 },
        { semana: 32, au: 31, p10: 29, p50: 32, p90: 34 },
        { semana: 36, au: 34, p10: 32, p50: 35, p90: 38 },
    ]

    // Dados mock - Percentil do Peso Fetal
    const dadosPercentilFetal = [
        { semana: 12, peso: 14, p10: 10, p50: 14, p90: 18 },
        { semana: 16, peso: 100, p10: 80, p50: 100, p90: 120 },
        { semana: 20, peso: 300, p10: 250, p50: 300, p90: 350 },
        { semana: 24, peso: 600, p10: 500, p50: 600, p90: 700 },
        { semana: 28, peso: 1000, p10: 850, p50: 1000, p90: 1200 },
        { semana: 32, peso: 1700, p10: 1500, p50: 1800, p90: 2100 },
        { semana: 36, peso: 2500, p10: 2200, p50: 2600, p90: 3000 },
    ]

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
                            Acompanhe a evolução da gestação através de gráficos
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
                            Evolução do peso durante a gestação comparado com a curva ideal
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <AreaChart data={dadosPeso}>
                                <defs>
                                    <linearGradient id="colorPeso" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorIdeal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.2} />
                                        <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="semana"
                                    label={{ value: 'Semanas de Gestação', position: 'insideBottom', offset: -5 }}
                                    stroke="hsl(var(--muted-foreground))"
                                />
                                <YAxis
                                    label={{ value: 'Peso (kg)', angle: -90, position: 'insideLeft' }}
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
                                <Area
                                    type="monotone"
                                    dataKey="pesoIdeal"
                                    stroke="hsl(var(--accent))"
                                    fillOpacity={1}
                                    fill="url(#colorIdeal)"
                                    name="Peso Ideal"
                                    strokeWidth={2}
                                    strokeDasharray="5 5"
                                />
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
                        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-primary"></div>
                                <span>Peso Atual: <strong>74 kg</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-accent"></div>
                                <span>Ganho Total: <strong>+14 kg</strong></span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="text-green-500">Dentro do esperado</span>
                            </div>
                        </div>
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
                            Medida da altura uterina com curvas de percentil (P10, P50, P90)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart data={dadosAlturaUterina}>
                                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                                <XAxis
                                    dataKey="semana"
                                    label={{ value: 'Semanas de Gestação', position: 'insideBottom', offset: -5 }}
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
                                    dataKey="au"
                                    stroke="hsl(var(--secondary))"
                                    strokeWidth={3}
                                    name="AU Medida"
                                    dot={{ fill: 'hsl(var(--secondary))', r: 5 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded bg-secondary"></div>
                                <span>Última medida: <strong>34 cm</strong> (36 semanas)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="text-green-500">Crescimento adequado</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Gráfico 3: Percentil do Peso Fetal */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Baby className="h-5 w-5 text-pink-500" />
                            Evolução do Percentil do Peso Fetal
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
                        <div className="mt-4 flex items-center justify-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                                <div className="w-4 h-4 rounded" style={{ backgroundColor: '#ec4899' }}></div>
                                <span>Peso estimado: <strong>2500g</strong> (36 semanas)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <TrendingUp className="h-4 w-4 text-green-500" />
                                <span className="text-green-500">Percentil 50 - Adequado</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Informações Adicionais */}
                <Card className="bg-muted/50">
                    <CardContent className="pt-6">
                        <div className="grid gap-4 md:grid-cols-3">
                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Weight className="h-4 w-4 text-primary" />
                                    Ganho de Peso
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    O ganho de peso ideal varia de acordo com o IMC pré-gestacional.
                                    A curva mostra a comparação entre o peso atual e o esperado.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Ruler className="h-4 w-4 text-secondary" />
                                    Altura Uterina
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    A altura uterina deve crescer cerca de 1cm por semana após a 20ª semana.
                                    Valores entre P10 e P90 são considerados normais.
                                </p>
                            </div>
                            <div className="space-y-2">
                                <h3 className="font-semibold flex items-center gap-2">
                                    <Baby className="h-4 w-4 text-pink-500" />
                                    Peso Fetal
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    O peso fetal é estimado por ultrassom. Valores entre P10 e P90
                                    indicam crescimento adequado para a idade gestacional.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
