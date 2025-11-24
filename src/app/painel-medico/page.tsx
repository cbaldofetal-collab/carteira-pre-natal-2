"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    UserCheck,
    Clock,
    LogOut,
    User,
    Calendar,
    Heart,
    Activity,
    FileText,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Stethoscope,
    Baby,
    Download
} from "lucide-react"
import Link from "next/link"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function PainelMedicoPage() {
    const [tempoRestante, setTempoRestante] = useState("23h 45min")

    // Mock - Dados da sessão médica
    const sessaoMedica = {
        nomeMedico: "Dr. João Silva",
        crm: "12345-SP",
        dataAcesso: new Date().toISOString(),
        expiraEm: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        permissoes: {
            visualizar: true,
            editar: true,
            adicionarExames: true,
        }
    }

    // Mock - Dados da paciente
    const paciente = {
        nome: "Maria da Silva",
        dataNascimento: "1990-05-15",
        idade: 34,
        tipoSanguineo: "O+",
        dum: "2025-05-01",
        dpp: "2026-02-05",
        igAtual: "24 semanas e 3 dias",
        gesta: 2,
        para: 1,
        aborto: 0,
    }

    // Mock - Últimos exames
    const ultimosExames = [
        { tipo: "Hemograma", data: "2025-11-15", resultado: "Normal" },
        { tipo: "Glicemia", data: "2025-11-15", resultado: "85 mg/dL" },
        { tipo: "Ultrassom", data: "2025-11-10", resultado: "Desenvolvimento adequado" },
    ]

    // Mock - Últimas consultas
    const ultimasConsultas = [
        { data: "2025-11-20", ig: "24 semanas", pa: "120/80", peso: "68 kg" },
        { data: "2025-11-06", ig: "22 semanas", pa: "115/75", peso: "66 kg" },
    ]

    const [novoExame, setNovoExame] = useState({
        data: "",
        pressaoSistolica: "",
        pressaoDiastolica: "",
        peso: "",
        alturaUterina: "",
        bcf: "",
        observacoes: ""
    })

    const handleSubmitExame = (e: React.FormEvent) => {
        e.preventDefault()
        alert("Exame clínico registrado com sucesso!")
        // Reset form
        setNovoExame({
            data: "",
            pressaoSistolica: "",
            pressaoDiastolica: "",
            peso: "",
            alturaUterina: "",
            bcf: "",
            observacoes: ""
        })
    }

    const encerrarSessao = () => {
        if (confirm("Deseja encerrar o acesso ao prontuário da paciente?")) {
            window.location.href = "/acesso-medico"
        }
    }

    const gerarPDF = () => {
        const doc = new jsPDF()
        const dataGeracao = new Date().toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })

        // Cabeçalho
        doc.setFontSize(18)
        doc.setFont("helvetica", "bold")
        doc.text("Prontuário Pré-Natal", 105, 20, { align: "center" })

        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text(`Gerado em: ${dataGeracao}`, 105, 27, { align: "center" })
        doc.text(`Médico: ${sessaoMedica.nomeMedico} - CRM ${sessaoMedica.crm}`, 105, 32, { align: "center" })

        // Linha separadora
        doc.setLineWidth(0.5)
        doc.line(20, 35, 190, 35)

        // Dados da Paciente
        let yPos = 45
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("Dados da Paciente", 20, yPos)

        yPos += 8
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.text(`Nome: ${paciente.nome}`, 20, yPos)
        yPos += 6
        doc.text(`Idade: ${paciente.idade} anos`, 20, yPos)
        doc.text(`Tipo Sanguíneo: ${paciente.tipoSanguineo}`, 120, yPos)
        yPos += 6
        doc.text(`DUM: ${new Date(paciente.dum).toLocaleDateString('pt-BR')}`, 20, yPos)
        doc.text(`DPP: ${new Date(paciente.dpp).toLocaleDateString('pt-BR')}`, 120, yPos)
        yPos += 6
        doc.text(`IG Atual: ${paciente.igAtual}`, 20, yPos)
        doc.text(`Histórico Obstétrico: G${paciente.gesta} P${paciente.para} A${paciente.aborto}`, 120, yPos)

        // Últimas Consultas
        yPos += 15
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("Últimas Consultas", 20, yPos)

        yPos += 5
        autoTable(doc, {
            startY: yPos,
            head: [['Data', 'IG', 'PA (mmHg)', 'Peso (kg)']],
            body: ultimasConsultas.map(c => [
                new Date(c.data).toLocaleDateString('pt-BR'),
                c.ig,
                c.pa,
                c.peso
            ]),
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] },
            margin: { left: 20, right: 20 }
        })

        // Últimos Exames
        yPos = (doc as any).lastAutoTable.finalY + 15
        doc.setFontSize(14)
        doc.setFont("helvetica", "bold")
        doc.text("Últimos Exames", 20, yPos)

        yPos += 5
        autoTable(doc, {
            startY: yPos,
            head: [['Tipo', 'Data', 'Resultado']],
            body: ultimosExames.map(e => [
                e.tipo,
                new Date(e.data).toLocaleDateString('pt-BR'),
                e.resultado
            ]),
            theme: 'grid',
            headStyles: { fillColor: [59, 130, 246] },
            margin: { left: 20, right: 20 }
        })

        // Rodapé
        const pageCount = doc.getNumberOfPages()
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i)
            doc.setFontSize(8)
            doc.setFont("helvetica", "italic")
            doc.text(
                `Página ${i} de ${pageCount}`,
                105,
                doc.internal.pageSize.height - 10,
                { align: "center" }
            )
            doc.text(
                "Documento gerado eletronicamente - Carteira Pré-Natal Digital",
                105,
                doc.internal.pageSize.height - 5,
                { align: "center" }
            )
        }

        // Salvar PDF
        doc.save(`prontuario-${paciente.nome.replace(/\s+/g, '_')}-${new Date().toISOString().split('T')[0]}.pdf`)
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {/* Header Médico */}
            <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-blue-600 text-white">
                <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
                    <div className="flex items-center gap-3">
                        <UserCheck className="h-6 w-6" />
                        <div>
                            <p className="font-semibold text-sm">Modo Médico</p>
                            <p className="text-xs opacity-90">{sessaoMedica.nomeMedico} - CRM {sessaoMedica.crm}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>Expira em: {tempoRestante}</span>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={encerrarSessao}
                            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Encerrar Sessão
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1 container max-w-7xl py-6 space-y-6">
                {/* Aviso de Acesso Temporário */}
                <Card className="border-blue-500/50 bg-blue-500/5">
                    <CardContent className="pt-6">
                        <div className="flex gap-3">
                            <AlertCircle className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="font-semibold text-sm">Acesso Temporário Autorizado</p>
                                <p className="text-sm text-muted-foreground">
                                    Você tem acesso temporário aos dados desta paciente.
                                    Todas as ações são registradas e podem ser auditadas.
                                    O acesso expira automaticamente em {tempoRestante}.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Dados da Paciente */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <User className="h-5 w-5 text-primary" />
                            Dados da Paciente
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Nome Completo</p>
                                <p className="font-medium">{paciente.nome}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Idade</p>
                                <p className="font-medium">{paciente.idade} anos</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Tipo Sanguíneo</p>
                                <p className="font-medium">{paciente.tipoSanguineo}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">DUM</p>
                                <p className="font-medium">{new Date(paciente.dum).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">DPP</p>
                                <p className="font-medium">{new Date(paciente.dpp).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">IG Atual</p>
                                <p className="font-medium text-primary">{paciente.igAtual}</p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Histórico Obstétrico</p>
                                <p className="font-medium">G{paciente.gesta} P{paciente.para} A{paciente.aborto}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Resumo Clínico */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Últimas Consultas */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar className="h-5 w-5 text-secondary" />
                                    Últimas Consultas
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {ultimasConsultas.map((consulta, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                                            <div>
                                                <p className="font-medium">{new Date(consulta.data).toLocaleDateString('pt-BR')}</p>
                                                <p className="text-sm text-muted-foreground">{consulta.ig}</p>
                                            </div>
                                            <div className="flex gap-4 text-sm">
                                                <span>PA: {consulta.pa}</span>
                                                <span>Peso: {consulta.peso}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Últimos Exames */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-5 w-5 text-accent" />
                                    Últimos Exames
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {ultimosExames.map((exame, index) => (
                                        <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                                            <div>
                                                <p className="font-medium">{exame.tipo}</p>
                                                <p className="text-sm text-muted-foreground">
                                                    {new Date(exame.data).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <CheckCircle className="h-4 w-4 text-green-500" />
                                                <span className="text-sm">{exame.resultado}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Formulário de Novo Exame Clínico */}
                        {sessaoMedica.permissoes.adicionarExames && (
                            <Card className="border-secondary">
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Stethoscope className="h-5 w-5 text-secondary" />
                                        Registrar Novo Exame Clínico
                                    </CardTitle>
                                    <CardDescription>
                                        Adicione os dados da consulta atual
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmitExame} className="space-y-4">
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <div className="space-y-2">
                                                <Label htmlFor="data">Data da Consulta *</Label>
                                                <Input
                                                    id="data"
                                                    type="date"
                                                    value={novoExame.data}
                                                    onChange={(e) => setNovoExame({ ...novoExame, data: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Pressão Arterial (mmHg) *</Label>
                                                <div className="flex gap-2 items-center">
                                                    <Input
                                                        type="number"
                                                        value={novoExame.pressaoSistolica}
                                                        onChange={(e) => setNovoExame({ ...novoExame, pressaoSistolica: e.target.value })}
                                                        placeholder="120"
                                                        required
                                                    />
                                                    <span>/</span>
                                                    <Input
                                                        type="number"
                                                        value={novoExame.pressaoDiastolica}
                                                        onChange={(e) => setNovoExame({ ...novoExame, pressaoDiastolica: e.target.value })}
                                                        placeholder="80"
                                                        required
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid gap-4 md:grid-cols-3">
                                            <div className="space-y-2">
                                                <Label htmlFor="peso">Peso (kg) *</Label>
                                                <Input
                                                    id="peso"
                                                    type="number"
                                                    step="0.1"
                                                    value={novoExame.peso}
                                                    onChange={(e) => setNovoExame({ ...novoExame, peso: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="au">Altura Uterina (cm) *</Label>
                                                <Input
                                                    id="au"
                                                    type="number"
                                                    step="0.1"
                                                    value={novoExame.alturaUterina}
                                                    onChange={(e) => setNovoExame({ ...novoExame, alturaUterina: e.target.value })}
                                                    required
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="bcf">BCF (bpm) *</Label>
                                                <Input
                                                    id="bcf"
                                                    type="number"
                                                    value={novoExame.bcf}
                                                    onChange={(e) => setNovoExame({ ...novoExame, bcf: e.target.value })}
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="obs">Observações</Label>
                                            <textarea
                                                id="obs"
                                                value={novoExame.observacoes}
                                                onChange={(e) => setNovoExame({ ...novoExame, observacoes: e.target.value })}
                                                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                                placeholder="Observações sobre a consulta..."
                                            />
                                        </div>

                                        <Button type="submit" className="w-full bg-secondary hover:bg-secondary/90">
                                            <CheckCircle className="h-4 w-4 mr-2" />
                                            Salvar Exame Clínico
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    {/* Ações Rápidas */}
                    <div className="space-y-4">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Ações Rápidas</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    onClick={gerarPDF}
                                    className="w-full justify-start bg-green-600 hover:bg-green-700 text-white"
                                >
                                    <Download className="h-4 w-4 mr-2" />
                                    Gerar PDF do Prontuário
                                </Button>
                                <Link href="/perfil" className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <User className="h-4 w-4 mr-2" />
                                        Ver Perfil Completo
                                    </Button>
                                </Link>
                                <Link href="/exames" className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <FileText className="h-4 w-4 mr-2" />
                                        Todos os Exames
                                    </Button>
                                </Link>
                                <Link href="/graficos" className="block">
                                    <Button variant="outline" className="w-full justify-start">
                                        <TrendingUp className="h-4 w-4 mr-2" />
                                        Gráficos de Evolução
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>

                        <Card className="bg-muted/50">
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Baby className="h-5 w-5 text-pink-500" />
                                    Resumo Gestacional
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Semana Atual:</span>
                                    <span className="font-medium">24ª semana</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Trimestre:</span>
                                    <span className="font-medium">2º Trimestre</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Dias até DPP:</span>
                                    <span className="font-medium">112 dias</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-muted-foreground">Ganho de Peso:</span>
                                    <span className="font-medium text-green-600">+8 kg (adequado)</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-amber-500/50 bg-amber-500/5">
                            <CardContent className="pt-6">
                                <div className="flex gap-2">
                                    <Heart className="h-5 w-5 text-amber-500 flex-shrink-0" />
                                    <div className="space-y-1">
                                        <p className="font-semibold text-sm">Lembrete</p>
                                        <p className="text-xs text-muted-foreground">
                                            Sempre solicite consentimento verbal antes de realizar procedimentos.
                                        </p>
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
