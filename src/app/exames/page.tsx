"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { FileText, Microscope, Stethoscope, Image as ImageIcon, Plus, Search, Calendar } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabaseClient"
import { ModalExameLaboratorial } from "@/components/modals/ModalExameLaboratorial"
import { ModalExameImagem } from "@/components/modals/ModalExameImagem"

export const dynamic = 'force-dynamic'

type TabType = "laboratoriais" | "clinicos" | "imagenologia"

export default function ExamesPage() {
    const [activeTab, setActiveTab] = useState<TabType>("laboratoriais")
    const [searchTerm, setSearchTerm] = useState("")
    const [modalLaboratorialOpen, setModalLaboratorialOpen] = useState(false)
    const [modalImagemOpen, setModalImagemOpen] = useState(false)

    const [examesLaboratoriais, setExamesLaboratoriais] = useState<any[]>([]);

    const [imagenologia, setImagenologia] = useState<any[]>([]);

    // Placeholder patient ID – replace with real patient context
    const pacienteId = "00000000-0000-0000-0000-000000000000";

    // Load exams from Supabase
    const loadExames = async () => {
        const { data: labData, error: labError } = await supabase
            .from("exames_laboratoriais")
            .select("id, nome, data, resultado, arquivo_url")
            .eq("paciente_id", pacienteId);
        if (!labError) setExamesLaboratoriais(labData);

        const { data: clinData, error: clinError } = await supabase
            .from("exames_clinicos")
            .select("id, nome, data, valor, observacao")
            .eq("paciente_id", pacienteId);
        // Clinical exams are mock data; no state update needed

        const { data: imgData, error: imgError } = await supabase
            .from("exames_imagem")
            .select("id, nome, data, ig, observacao, arquivo_url")
            .eq("paciente_id", pacienteId);
        if (!imgError) setImagenologia(imgData);
    };

    useEffect(() => {
        loadExames();
    }, []);

    const uploadFile = async (file: File) => {
        try {
            const fileExt = file.name.split('.').pop()
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
            const filePath = `${fileName}`

            const { error: uploadError } = await supabase.storage
                .from('exames')
                .upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            const { data } = supabase.storage.from('exames').getPublicUrl(filePath)
            return data.publicUrl
        } catch (error) {
            console.error("Erro no upload:", error)
            throw error
        }
    }

    const handleSubmitExameLaboratorial = async (exame: any) => {
        let arquivoUrl = null

        if (exame.arquivo) {
            try {
                arquivoUrl = await uploadFile(exame.arquivo)
            } catch (error) {
                alert("Erro ao fazer upload do arquivo. Tente novamente.")
                return
            }
        }

        const { error } = await supabase.from("exames_laboratoriais").insert([
            {
                paciente_id: pacienteId,
                nome: exame.nome,
                data: exame.data,
                resultado: exame.resultado,
                arquivo_url: arquivoUrl,
            },
        ]);
        if (!error) {
            await loadExames();
            alert("Exame laboratorial adicionado com sucesso!");
        } else {
            console.error(error);
            alert("Erro ao adicionar exame.");
        }
    };

    const handleSubmitExameImagem = async (exame: any) => {
        let arquivoUrl = null

        if (exame.arquivo) {
            try {
                arquivoUrl = await uploadFile(exame.arquivo)
            } catch (error) {
                alert("Erro ao fazer upload do arquivo. Tente novamente.")
                return
            }
        }

        const { error } = await supabase.from("exames_imagem").insert([
            {
                paciente_id: pacienteId,
                nome: exame.nome,
                data: exame.data,
                ig: exame.ig,
                observacao: exame.observacoes,
                arquivo_url: arquivoUrl,
            },
        ]);
        if (!error) {
            await loadExames();
            alert("Exame de imagem adicionado com sucesso!");
        } else {
            console.error(error);
            alert("Erro ao adicionar exame de imagem.");
        }
    };

    // Existing mock data for clinical exams remains unchanged (can be fetched similarly later)
    const examesClinicosMock = [
        { id: 1, nome: "Pressão Arterial", data: "2025-11-20", valor: "120/80 mmHg", observacao: "" },
        { id: 2, nome: "Peso", data: "2025-11-20", valor: "68 kg", observacao: "Ganho adequado" },
        { id: 3, nome: "Altura Uterina", data: "2025-11-20", valor: "24 cm", observacao: "Compatível com IG" },
        { id: 4, nome: "BCF (Batimentos Cardíacos Fetais)", data: "2025-11-20", valor: "140 bpm", observacao: "Normal" },
    ]

    // Duplicate function removed – real handler defined earlier

    const tabs = [
        { id: "laboratoriais" as TabType, label: "Exames Laboratoriais", icon: Microscope, count: examesLaboratoriais.length },
        { id: "clinicos" as TabType, label: "Exame Clínico", icon: Stethoscope, count: examesClinicosMock.length },
        { id: "imagenologia" as TabType, label: "Imagenologia", icon: ImageIcon, count: imagenologia.length },
    ]

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container max-w-7xl py-6 space-y-6">
                {/* Header Section */}
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                        <FileText className="h-8 w-8 text-primary" />
                        Meus Exames
                    </h1>
                    <p className="text-muted-foreground">
                        Gerencie todos os seus exames e resultados em um só lugar
                    </p>
                </div>

                {/* Tabs Navigation */}
                <div className="border-b border-border">
                    <nav className="flex gap-2 overflow-x-auto pb-2">
                        {tabs.map((tab) => {
                            const Icon = tab.icon
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex items-center gap-2 px-4 py-2 rounded-t-lg whitespace-nowrap transition-colors ${activeTab === tab.id
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted hover:bg-muted/80 text-muted-foreground"
                                        }`}
                                >
                                    <Icon className="h-4 w-4" />
                                    {tab.label}
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${activeTab === tab.id ? "bg-primary-foreground/20" : "bg-background"
                                        }`}>
                                        {tab.count}
                                    </span>
                                </button>
                            )
                        })}
                    </nav>
                </div>

                {/* Search and Add */}
                <div className="flex flex-col sm:flex-row gap-4 justify-between">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar exames..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                    {activeTab === "clinicos" ? (
                        <Link href="/exame-clinico">
                            <Button className="bg-secondary hover:bg-secondary/90">
                                <Plus className="h-4 w-4 mr-2" />
                                Novo Exame Clínico
                            </Button>
                        </Link>
                    ) : activeTab === "laboratoriais" ? (
                        <Button
                            onClick={() => setModalLaboratorialOpen(true)}
                            className="bg-primary hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Exame
                        </Button>
                    ) : (
                        <Button
                            onClick={() => setModalImagemOpen(true)}
                            className="bg-primary hover:bg-primary/90"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Exame
                        </Button>
                    )}
                </div>

                {/* Tab Content */}
                <div className="space-y-4">
                    {/* Exames Laboratoriais */}
                    {activeTab === "laboratoriais" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Exames Laboratoriais</CardTitle>
                                <CardDescription>Hemogramas, glicemia, tipagem sanguínea e outros</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {examesLaboratoriais.map((exame) => (
                                        <div
                                            key={exame.id}
                                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="rounded-full bg-primary/10 p-3">
                                                    <Microscope className="h-5 w-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{exame.nome}</p>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(exame.data).toLocaleDateString('pt-BR')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium text-accent bg-accent/10 px-3 py-1 rounded">
                                                    {exame.resultado}
                                                </span>
                                                <Button variant="ghost" size="sm">Ver</Button>
                                                <Button variant="ghost" size="sm">Editar</Button>
                                            </div>
                                        </div>
                                    ))}
                                    {examesLaboratoriais.length === 0 && (
                                        <div className="text-center py-12 text-muted-foreground">
                                            <Microscope className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                            <p>Nenhum exame laboratorial cadastrado</p>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Exame Clínico */}
                    {activeTab === "clinicos" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Exame Clínico</CardTitle>
                                <CardDescription>Pressão arterial, peso, altura uterina, BCF</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {examesClinicosMock.map((exame) => (
                                        <div
                                            key={exame.id}
                                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="rounded-full bg-secondary/10 p-3">
                                                    <Stethoscope className="h-5 w-5 text-secondary" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{exame.nome}</p>
                                                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(exame.data).toLocaleDateString('pt-BR')}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-sm font-medium">
                                                    {exame.valor}
                                                </span>
                                                <Button variant="ghost" size="sm">Ver</Button>
                                                <Button variant="ghost" size="sm">Editar</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Imagenologia */}
                    {activeTab === "imagenologia" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Imagenologia</CardTitle>
                                <CardDescription>Ultrassons, morfológicos e outros exames de imagem</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {imagenologia.map((exame) => (
                                        <div
                                            key={exame.id}
                                            className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="rounded-full bg-accent/10 p-3">
                                                    <ImageIcon className="h-5 w-5 text-accent" />
                                                </div>
                                                <div>
                                                    <p className="font-medium">{exame.nome}</p>
                                                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-3 w-3" />
                                                            {new Date(exame.data).toLocaleDateString('pt-BR')}
                                                        </div>
                                                        <span>IG: {exame.ig}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <Button variant="ghost" size="sm">Ver Imagens</Button>
                                                <Button variant="ghost" size="sm">Editar</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}


                </div>
            </main>

            {/* Modals */}
            <ModalExameLaboratorial
                isOpen={modalLaboratorialOpen}
                onClose={() => setModalLaboratorialOpen(false)}
                onSubmit={handleSubmitExameLaboratorial}
            />
            <ModalExameImagem
                isOpen={modalImagemOpen}
                onClose={() => setModalImagemOpen(false)}
                onSubmit={handleSubmitExameImagem}
            />
        </div>
    )
}
