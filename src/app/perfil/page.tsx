"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Heart, Calendar, Activity, FileText, AlertCircle, Save } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"

export default function PerfilPage() {
    const [loading, setLoading] = useState(false)
    const pacienteId = "00000000-0000-0000-0000-000000000000" // Placeholder

    const [formData, setFormData] = useState({
        // Dados Pessoais
        nome: "",
        dataNascimento: "",
        tipagemSanguinea: "",

        // Dados da Gestação
        dum: "",
        dpp: "",
        igUltrassom: "",

        // Histórico Obstétrico
        gestas: "",
        partos: "",
        abortos: "",
        partosNormais: "",
        partosOperatorios: "",
        cesareas: "",
        prematuros: "",
        amamentou: "",

        // Antecedentes
        antecedentesClinico: "",
        antecedentesCirurgico: "",
        alergiaMedicamentosa: "",

        // Medicamentos em Uso
        medicamentosEmUso: ""
    })

    useEffect(() => {
        loadPerfil()
    }, [])

    const loadPerfil = async () => {
        try {
            const { data, error } = await supabase
                .from('perfil_clinico')
                .select('*')
                .eq('paciente_id', pacienteId)
                .single()

            if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned"
                console.error('Erro ao carregar perfil:', error)
                return
            }

            if (data) {
                setFormData({
                    nome: data.nome || "",
                    dataNascimento: data.data_nascimento || "",
                    tipagemSanguinea: data.tipagem_sanguinea || "",
                    dum: data.dum || "",
                    dpp: data.dpp || "",
                    igUltrassom: data.ig_ultrassom || "",
                    gestas: data.gestas?.toString() || "",
                    partos: data.partos?.toString() || "",
                    abortos: data.abortos?.toString() || "",
                    partosNormais: data.partos_normais?.toString() || "",
                    partosOperatorios: data.partos_operatorios?.toString() || "",
                    cesareas: data.cesareas?.toString() || "",
                    prematuros: data.prematuros || "",
                    amamentou: data.amamentou || "",
                    antecedentesClinico: data.antecedentes_clinico || "",
                    antecedentesCirurgico: data.antecedentes_cirurgico || "",
                    alergiaMedicamentosa: data.alergia_medicamentosa || "",
                    medicamentosEmUso: data.medicamentos_em_uso || ""
                })
            }
        } catch (error) {
            console.error('Erro:', error)
        }
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const perfilData = {
                paciente_id: pacienteId,
                nome: formData.nome,
                data_nascimento: formData.dataNascimento || null,
                tipagem_sanguinea: formData.tipagemSanguinea,
                dum: formData.dum || null,
                dpp: formData.dpp || null,
                ig_ultrassom: formData.igUltrassom,
                gestas: formData.gestas ? parseInt(formData.gestas) : null,
                partos: formData.partos ? parseInt(formData.partos) : null,
                abortos: formData.abortos ? parseInt(formData.abortos) : null,
                partos_normais: formData.partosNormais ? parseInt(formData.partosNormais) : null,
                partos_operatorios: formData.partosOperatorios ? parseInt(formData.partosOperatorios) : null,
                cesareas: formData.cesareas ? parseInt(formData.cesareas) : null,
                prematuros: formData.prematuros,
                amamentou: formData.amamentou,
                antecedentes_clinico: formData.antecedentesClinico,
                antecedentes_cirurgico: formData.antecedentesCirurgico,
                alergia_medicamentosa: formData.alergiaMedicamentosa,
                medicamentos_em_uso: formData.medicamentosEmUso
            }

            // Check if profile exists to decide between insert and update (though upsert handles both if conflict target is set)
            // Using upsert with onConflict on paciente_id
            const { error } = await supabase
                .from('perfil_clinico')
                .upsert(perfilData, { onConflict: 'paciente_id' })

            if (error) throw error

            alert("Perfil salvo com sucesso!")
        } catch (error) {
            console.error('Erro ao salvar perfil:', error)
            alert("Erro ao salvar perfil. Tente novamente.")
        } finally {
            setLoading(false)
        }
    }

    const calcularIdadeGestacional = () => {
        if (!formData.dum) return null
        const dum = new Date(formData.dum)
        const hoje = new Date()
        const diffTime = Math.abs(hoje.getTime() - dum.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        const semanas = Math.floor(diffDays / 7)
        const dias = diffDays % 7
        return `${semanas} semanas e ${dias} dias`
    }

    const calcularDPP = () => {
        if (!formData.dum) return ""
        const dum = new Date(formData.dum)
        // Regra de Naegele: DUM + 7 dias - 3 meses + 1 ano
        const dpp = new Date(dum)
        dpp.setDate(dpp.getDate() + 7)
        dpp.setMonth(dpp.getMonth() - 3)
        dpp.setFullYear(dpp.getFullYear() + 1)
        return dpp.toISOString().split('T')[0]
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container max-w-4xl py-6 space-y-6">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                        <User className="h-8 w-8 text-primary" />
                        Perfil Clínico
                    </h1>
                    <p className="text-muted-foreground">
                        Mantenha seus dados atualizados para um acompanhamento preciso
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Dados Pessoais */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Dados Pessoais
                            </CardTitle>
                            <CardDescription>Informações básicas de identificação</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="nome">Nome Completo *</Label>
                                    <Input
                                        id="nome"
                                        name="nome"
                                        value={formData.nome}
                                        onChange={handleChange}
                                        placeholder="Seu nome completo"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dataNascimento">Data de Nascimento *</Label>
                                    <Input
                                        id="dataNascimento"
                                        name="dataNascimento"
                                        type="date"
                                        value={formData.dataNascimento}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="tipagemSanguinea">Tipagem Sanguínea *</Label>
                                <select
                                    id="tipagemSanguinea"
                                    name="tipagemSanguinea"
                                    value={formData.tipagemSanguinea}
                                    onChange={handleChange}
                                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    required
                                >
                                    <option value="">Selecione</option>
                                    <option value="A+">A+</option>
                                    <option value="A-">A-</option>
                                    <option value="B+">B+</option>
                                    <option value="B-">B-</option>
                                    <option value="AB+">AB+</option>
                                    <option value="AB-">AB-</option>
                                    <option value="O+">O+</option>
                                    <option value="O-">O-</option>
                                </select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Dados da Gestação Atual */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Heart className="h-5 w-5 text-secondary" />
                                Dados da Gestação Atual
                            </CardTitle>
                            <CardDescription>Informações sobre a gestação em curso</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="dum">Data da Última Menstruação (DUM) *</Label>
                                    <Input
                                        id="dum"
                                        name="dum"
                                        type="date"
                                        value={formData.dum}
                                        onChange={handleChange}
                                        required
                                    />
                                    {formData.dum && (
                                        <p className="text-xs text-muted-foreground">
                                            IG calculada: {calcularIdadeGestacional()}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="dpp">Data Provável do Parto (DPP)</Label>
                                    <Input
                                        id="dpp"
                                        name="dpp"
                                        type="date"
                                        value={formData.dpp || calcularDPP()}
                                        onChange={handleChange}
                                        placeholder="Calculado automaticamente"
                                    />
                                    {formData.dum && !formData.dpp && (
                                        <p className="text-xs text-accent">
                                            DPP calculada pela Regra de Naegele
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="igUltrassom">Idade Gestacional pelo 1º Ultrassom</Label>
                                <Input
                                    id="igUltrassom"
                                    name="igUltrassom"
                                    value={formData.igUltrassom}
                                    onChange={handleChange}
                                    placeholder="Ex: 12 semanas e 3 dias"
                                />
                                <p className="text-xs text-muted-foreground">
                                    Informe a IG calculada pelo primeiro ultrassom, se disponível
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Histórico Obstétrico */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5 text-accent" />
                                Histórico Obstétrico
                            </CardTitle>
                            <CardDescription>Dados sobre gestações anteriores</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="space-y-2">
                                    <Label htmlFor="gestas">Gestas (G)</Label>
                                    <Input
                                        id="gestas"
                                        name="gestas"
                                        type="number"
                                        min="0"
                                        value={formData.gestas}
                                        onChange={handleChange}
                                        placeholder="0"
                                    />
                                    <p className="text-xs text-muted-foreground">Total de gestações</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="partos">Partos (P)</Label>
                                    <Input
                                        id="partos"
                                        name="partos"
                                        type="number"
                                        min="0"
                                        value={formData.partos}
                                        onChange={handleChange}
                                        placeholder="0"
                                    />
                                    <p className="text-xs text-muted-foreground">Total de partos</p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="abortos">Abortos (A)</Label>
                                    <Input
                                        id="abortos"
                                        name="abortos"
                                        type="number"
                                        min="0"
                                        value={formData.abortos}
                                        onChange={handleChange}
                                        placeholder="0"
                                    />
                                    <p className="text-xs text-muted-foreground">Total de abortos</p>
                                </div>
                            </div>

                            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                                <h4 className="font-medium text-sm">Detalhamento dos Partos</h4>
                                <div className="grid gap-4 md:grid-cols-3">
                                    <div className="space-y-2">
                                        <Label htmlFor="partosNormais">Partos Normais</Label>
                                        <Input
                                            id="partosNormais"
                                            name="partosNormais"
                                            type="number"
                                            min="0"
                                            value={formData.partosNormais}
                                            onChange={handleChange}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="partosOperatorios">Partos Operatórios</Label>
                                        <Input
                                            id="partosOperatorios"
                                            name="partosOperatorios"
                                            type="number"
                                            min="0"
                                            value={formData.partosOperatorios}
                                            onChange={handleChange}
                                            placeholder="0"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cesareas">Cesáreas</Label>
                                        <Input
                                            id="cesareas"
                                            name="cesareas"
                                            type="number"
                                            min="0"
                                            value={formData.cesareas}
                                            onChange={handleChange}
                                            placeholder="0"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label htmlFor="prematuros">Teve algum prematuro?</Label>
                                    <select
                                        id="prematuros"
                                        name="prematuros"
                                        value={formData.prematuros}
                                        onChange={handleChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="nao">Não</option>
                                        <option value="sim">Sim</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="amamentou">Amamentou?</Label>
                                    <select
                                        id="amamentou"
                                        name="amamentou"
                                        value={formData.amamentou}
                                        onChange={handleChange}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="">Selecione</option>
                                        <option value="nao">Não</option>
                                        <option value="sim">Sim</option>
                                        <option value="nao-se-aplica">Não se aplica</option>
                                    </select>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Antecedentes */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5 text-blue-500" />
                                Antecedentes
                            </CardTitle>
                            <CardDescription>Histórico clínico, cirúrgico e alergias</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="antecedentesClinico">Antecedentes Clínicos</Label>
                                <textarea
                                    id="antecedentesClinico"
                                    name="antecedentesClinico"
                                    value={formData.antecedentesClinico}
                                    onChange={handleChange}
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Ex: Hipertensão, Diabetes, Hipotireoidismo..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="antecedentesCirurgico">Antecedentes Cirúrgicos</Label>
                                <textarea
                                    id="antecedentesCirurgico"
                                    name="antecedentesCirurgico"
                                    value={formData.antecedentesCirurgico}
                                    onChange={handleChange}
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Ex: Apendicectomia, Colecistectomia..."
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="alergiaMedicamentosa" className="flex items-center gap-2">
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                    Alergia Medicamentosa
                                </Label>
                                <textarea
                                    id="alergiaMedicamentosa"
                                    name="alergiaMedicamentosa"
                                    value={formData.alergiaMedicamentosa}
                                    onChange={handleChange}
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Ex: Penicilina, Dipirona... (ou deixe em branco se não houver)"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Medicamentos em Uso */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Activity className="h-5 w-5 text-purple-500" />
                                Medicamentos em Uso
                            </CardTitle>
                            <CardDescription>Medicamentos que está utilizando atualmente</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="medicamentosEmUso">Medicamentos Atuais</Label>
                                <textarea
                                    id="medicamentosEmUso"
                                    name="medicamentosEmUso"
                                    value={formData.medicamentosEmUso}
                                    onChange={handleChange}
                                    className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    placeholder="Ex: Ácido Fólico 5mg 1x/dia, Sulfato Ferroso 40mg 1x/dia..."
                                />
                                <p className="text-xs text-muted-foreground">
                                    Liste os medicamentos com dosagem e frequência
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Botões de Ação */}
                    <div className="flex gap-4 justify-end">
                        <Button type="button" variant="outline">
                            Cancelar
                        </Button>
                        <Button type="submit" className="bg-primary hover:bg-primary/90" disabled={loading}>
                            {loading ? "Salvando..." : (
                                <>
                                    <Save className="h-4 w-4 mr-2" />
                                    Salvar Perfil
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </main>
        </div>
    )
}
