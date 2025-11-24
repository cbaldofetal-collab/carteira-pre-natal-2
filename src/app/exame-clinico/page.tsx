"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Stethoscope, Heart, Activity, TrendingUp, Calendar, Plus, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ExameClinicoPage() {
    const [formData, setFormData] = useState({
        data: "",
        idadeGestacional: "",
        igUltrassom: "",

        // Sinais Vitais
        pressaoSistolica: "",
        pressaoDiastolica: "",
        peso: "",
        alturaUterina: "",
        bcf: "",

        // Avaliação Clínica
        edema: "",
        movimentosFetais: "",
        apresentacaoFetal: "",

        // Observações
        observacoes: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: Salvar dados no backend
        console.log("Exame Clínico:", formData)
        alert("Exame clínico registrado com sucesso!")
    }

    // Mock data - histórico de exames
    const historicoExames = [
        {
            id: 1,
            data: "2025-11-20",
            ig: "24 semanas",
            pa: "120/80",
            peso: "68 kg",
            au: "24 cm",
            bcf: "140 bpm"
        },
        {
            id: 2,
            data: "2025-11-06",
            ig: "22 semanas",
            pa: "115/75",
            peso: "66 kg",
            au: "22 cm",
            bcf: "145 bpm"
        },
        {
            id: 3,
            data: "2025-10-23",
            ig: "20 semanas",
            pa: "118/78",
            peso: "64 kg",
            au: "20 cm",
            bcf: "142 bpm"
        },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container max-w-6xl py-6 space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Link href="/exames">
                                <Button variant="ghost" size="sm">
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    Voltar
                                </Button>
                            </Link>
                        </div>
                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                            <Stethoscope className="h-8 w-8 text-secondary" />
                            Exame Clínico
                        </h1>
                        <p className="text-muted-foreground">
                            Registre os dados vitais e observações da consulta
                        </p>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Formulário de Novo Exame */}
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Plus className="h-5 w-5 text-secondary" />
                                    Novo Registro
                                </CardTitle>
                                <CardDescription>Preencha os dados do exame clínico</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Data e IG */}
                                    <div className="grid gap-4 md:grid-cols-3">
                                        <div className="space-y-2">
                                            <Label htmlFor="data">Data da Consulta *</Label>
                                            <Input
                                                id="data"
                                                name="data"
                                                type="date"
                                                value={formData.data}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="idadeGestacional">Idade Gestacional</Label>
                                            <Input
                                                id="idadeGestacional"
                                                name="idadeGestacional"
                                                value={formData.idadeGestacional}
                                                onChange={handleChange}
                                                placeholder="Ex: 24 semanas e 3 dias"
                                            />
                                            <p className="text-xs text-muted-foreground">Calculada pela DUM</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="igUltrassom">IG pela Ultrassonografia</Label>
                                            <Input
                                                id="igUltrassom"
                                                name="igUltrassom"
                                                value={formData.igUltrassom}
                                                onChange={handleChange}
                                                placeholder="Ex: 24 semanas"
                                            />
                                            <p className="text-xs text-muted-foreground">Conforme último USG</p>
                                        </div>
                                    </div>

                                    {/* Sinais Vitais */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Heart className="h-4 w-4 text-secondary" />
                                            Sinais Vitais
                                        </h3>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label>Pressão Arterial (mmHg) *</Label>
                                                <div className="flex gap-2 items-center">
                                                    <Input
                                                        name="pressaoSistolica"
                                                        type="number"
                                                        value={formData.pressaoSistolica}
                                                        onChange={handleChange}
                                                        placeholder="120"
                                                        required
                                                    />
                                                    <span className="text-muted-foreground">/</span>
                                                    <Input
                                                        name="pressaoDiastolica"
                                                        type="number"
                                                        value={formData.pressaoDiastolica}
                                                        onChange={handleChange}
                                                        placeholder="80"
                                                        required
                                                    />
                                                </div>
                                                <p className="text-xs text-muted-foreground">Sistólica / Diastólica</p>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="peso">Peso (kg) *</Label>
                                                <Input
                                                    id="peso"
                                                    name="peso"
                                                    type="number"
                                                    step="0.1"
                                                    value={formData.peso}
                                                    onChange={handleChange}
                                                    placeholder="68.5"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="alturaUterina">Altura Uterina (cm) *</Label>
                                                <Input
                                                    id="alturaUterina"
                                                    name="alturaUterina"
                                                    type="number"
                                                    step="0.1"
                                                    value={formData.alturaUterina}
                                                    onChange={handleChange}
                                                    placeholder="24"
                                                    required
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="bcf">BCF (bpm) *</Label>
                                                <Input
                                                    id="bcf"
                                                    name="bcf"
                                                    type="number"
                                                    value={formData.bcf}
                                                    onChange={handleChange}
                                                    placeholder="140"
                                                    required
                                                />
                                                <p className="text-xs text-muted-foreground">Batimentos Cardíacos Fetais</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Avaliação Clínica */}
                                    <div className="space-y-4">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-secondary" />
                                            Avaliação Clínica
                                        </h3>

                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="edema">Edema</Label>
                                                <select
                                                    id="edema"
                                                    name="edema"
                                                    value={formData.edema}
                                                    onChange={handleChange}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                >
                                                    <option value="">Selecione</option>
                                                    <option value="ausente">Ausente</option>
                                                    <option value="mmii">MMII (+)</option>
                                                    <option value="mmii-moderado">MMII (++)</option>
                                                    <option value="generalizado">Generalizado</option>
                                                </select>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="movimentosFetais">Movimentos Fetais</Label>
                                                <select
                                                    id="movimentosFetais"
                                                    name="movimentosFetais"
                                                    value={formData.movimentosFetais}
                                                    onChange={handleChange}
                                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                >
                                                    <option value="">Selecione</option>
                                                    <option value="presentes">Presentes</option>
                                                    <option value="ativos">Ativos</option>
                                                    <option value="diminuidos">Diminuídos</option>
                                                    <option value="ausentes">Ausentes</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="apresentacaoFetal">Apresentação Fetal</Label>
                                            <select
                                                id="apresentacaoFetal"
                                                name="apresentacaoFetal"
                                                value={formData.apresentacaoFetal}
                                                onChange={handleChange}
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            >
                                                <option value="">Selecione</option>
                                                <option value="cefalica">Cefálica</option>
                                                <option value="pelvica">Pélvica</option>
                                                <option value="transversa">Transversa</option>
                                                <option value="nao-determinada">Não determinada</option>
                                            </select>
                                        </div>
                                    </div>

                                    {/* Observações */}
                                    <div className="space-y-2">
                                        <Label htmlFor="observacoes">Observações</Label>
                                        <textarea
                                            id="observacoes"
                                            name="observacoes"
                                            value={formData.observacoes}
                                            onChange={handleChange}
                                            className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                            placeholder="Anotações adicionais sobre a consulta..."
                                        />
                                    </div>

                                    {/* Botões */}
                                    <div className="flex gap-4 justify-end">
                                        <Button type="button" variant="outline">
                                            Cancelar
                                        </Button>
                                        <Button type="submit" className="bg-secondary hover:bg-secondary/90">
                                            Salvar Exame
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Resumo Rápido */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Último Registro</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {historicoExames.length > 0 && (
                                    <>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Data:</span>
                                            <span className="font-medium">
                                                {new Date(historicoExames[0].data).toLocaleDateString('pt-BR')}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">IG:</span>
                                            <span className="font-medium">{historicoExames[0].ig}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">PA:</span>
                                            <span className="font-medium">{historicoExames[0].pa} mmHg</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">Peso:</span>
                                            <span className="font-medium">{historicoExames[0].peso}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">AU:</span>
                                            <span className="font-medium">{historicoExames[0].au}</span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-muted-foreground">BCF:</span>
                                            <span className="font-medium">{historicoExames[0].bcf}</span>
                                        </div>
                                    </>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4" />
                                    Evolução
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="space-y-2 text-sm">
                                    <p className="text-muted-foreground">
                                        Ganho de peso: <span className="font-medium text-foreground">+8 kg</span>
                                    </p>
                                    <p className="text-muted-foreground">
                                        Total de consultas: <span className="font-medium text-foreground">{historicoExames.length}</span>
                                    </p>
                                </div>
                                <Link href="/graficos" className="block">
                                    <Button variant="outline" className="w-full" size="sm">
                                        <TrendingUp className="h-4 w-4 mr-2" />
                                        Ver Gráficos
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                {/* Histórico */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-secondary" />
                            Histórico de Exames Clínicos
                        </CardTitle>
                        <CardDescription>Registros anteriores</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {historicoExames.map((exame) => (
                                <div
                                    key={exame.id}
                                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-full bg-secondary/10 p-3">
                                            <Stethoscope className="h-5 w-5 text-secondary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">
                                                {new Date(exame.data).toLocaleDateString('pt-BR')}
                                            </p>
                                            <p className="text-sm text-muted-foreground">{exame.ig}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6 text-sm">
                                        <div>
                                            <span className="text-muted-foreground">PA: </span>
                                            <span className="font-medium">{exame.pa}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">Peso: </span>
                                            <span className="font-medium">{exame.peso}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">AU: </span>
                                            <span className="font-medium">{exame.au}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted-foreground">BCF: </span>
                                            <span className="font-medium">{exame.bcf}</span>
                                        </div>
                                        <Button variant="ghost" size="sm">Ver Detalhes</Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </main>
        </div>
    )
}
