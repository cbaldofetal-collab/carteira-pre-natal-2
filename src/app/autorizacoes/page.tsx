"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { QRCodeSVG } from 'qrcode.react'
import { Shield, QrCode, Clock, CheckCircle, XCircle, Copy, Plus, Trash2 } from "lucide-react"

export default function AutorizacoesPage() {
    const [showNewAuth, setShowNewAuth] = useState(false)
    const [authConfig, setAuthConfig] = useState({
        nomeMedico: "",
        duracaoHoras: "24",
        permissoes: {
            visualizar: true,
            editar: true,
            adicionarExames: true,
        }
    })

    // Mock - Token gerado
    const [tokenAtual, setTokenAtual] = useState<string | null>(null)

    // Mock - Histórico de autorizações
    const [autorizacoes, setAutorizacoes] = useState([
        {
            id: 1,
            nomeMedico: "Dr. João Silva",
            crm: "12345-SP",
            dataGeracao: "2025-11-20T10:00:00",
            dataExpiracao: "2025-11-21T10:00:00",
            status: "usado",
            dataUso: "2025-11-20T14:30:00",
            token: "ABC123XYZ"
        },
        {
            id: 2,
            nomeMedico: "Dra. Maria Santos",
            crm: "67890-SP",
            dataGeracao: "2025-11-15T09:00:00",
            dataExpiracao: "2025-11-16T09:00:00",
            status: "expirado",
            dataUso: null,
            token: "DEF456UVW"
        },
    ])

    const gerarToken = () => {
        // Gerar token único (em produção, isso seria feito no backend)
        const token = Math.random().toString(36).substring(2, 15).toUpperCase()
        setTokenAtual(token)

        // Adicionar ao histórico
        const novaAuth = {
            id: autorizacoes.length + 1,
            nomeMedico: authConfig.nomeMedico,
            crm: "",
            dataGeracao: new Date().toISOString(),
            dataExpiracao: new Date(Date.now() + parseInt(authConfig.duracaoHoras) * 60 * 60 * 1000).toISOString(),
            status: "ativo" as const,
            dataUso: null,
            token: token
        }

        setAutorizacoes([novaAuth, ...autorizacoes])
        setShowNewAuth(false)
    }

    const copiarToken = (token: string) => {
        navigator.clipboard.writeText(token)
        alert("Token copiado para a área de transferência!")
    }

    const revogarAutorizacao = (id: number) => {
        if (confirm("Tem certeza que deseja revogar esta autorização?")) {
            setAutorizacoes(autorizacoes.map(auth =>
                auth.id === id ? { ...auth, status: "revogado" as const } : auth
            ))
        }
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case "ativo": return "text-green-500 bg-green-500/10"
            case "usado": return "text-blue-500 bg-blue-500/10"
            case "expirado": return "text-gray-500 bg-gray-500/10"
            case "revogado": return "text-red-500 bg-red-500/10"
            default: return "text-gray-500 bg-gray-500/10"
        }
    }

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "ativo": return <Clock className="h-4 w-4" />
            case "usado": return <CheckCircle className="h-4 w-4" />
            case "expirado": return <XCircle className="h-4 w-4" />
            case "revogado": return <XCircle className="h-4 w-4" />
            default: return <Clock className="h-4 w-4" />
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container max-w-6xl py-6 space-y-6">
                {/* Header Section */}
                <div className="flex items-center justify-between">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                            <Shield className="h-8 w-8 text-primary" />
                            Autorizações Médicas
                        </h1>
                        <p className="text-muted-foreground">
                            Gerencie o acesso dos profissionais de saúde aos seus dados
                        </p>
                    </div>
                    <Button
                        onClick={() => setShowNewAuth(true)}
                        className="bg-primary hover:bg-primary/90"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Nova Autorização
                    </Button>
                </div>

                {/* Aviso Legal */}
                <Card className="border-primary/50 bg-primary/5">
                    <CardContent className="pt-6">
                        <div className="flex gap-3">
                            <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="font-semibold text-sm">Seus dados, suas regras</p>
                                <p className="text-sm text-muted-foreground">
                                    De acordo com a legislação brasileira, o cartão pré-natal é um documento de propriedade da gestante.
                                    Você tem total controle sobre quem pode acessar e modificar suas informações.
                                    Cada autorização gera um código único de uso limitado que pode ser revogado a qualquer momento.
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Modal de Nova Autorização */}
                {showNewAuth && (
                    <Card className="border-primary">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <QrCode className="h-5 w-5 text-primary" />
                                Gerar Nova Autorização
                            </CardTitle>
                            <CardDescription>
                                Crie um código de acesso único para um profissional de saúde
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nomeMedico">Nome do Profissional *</Label>
                                    <Input
                                        id="nomeMedico"
                                        value={authConfig.nomeMedico}
                                        onChange={(e) => setAuthConfig({ ...authConfig, nomeMedico: e.target.value })}
                                        placeholder="Ex: Dr. João Silva"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="duracao">Duração da Autorização</Label>
                                    <select
                                        id="duracao"
                                        value={authConfig.duracaoHoras}
                                        onChange={(e) => setAuthConfig({ ...authConfig, duracaoHoras: e.target.value })}
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                        <option value="1">1 hora</option>
                                        <option value="6">6 horas</option>
                                        <option value="12">12 horas</option>
                                        <option value="24">24 horas (padrão)</option>
                                        <option value="48">48 horas</option>
                                        <option value="168">7 dias</option>
                                    </select>
                                    <p className="text-xs text-muted-foreground">
                                        Após este período, o código expira automaticamente
                                    </p>
                                </div>

                                <div className="space-y-3">
                                    <Label>Permissões</Label>
                                    <div className="space-y-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={authConfig.permissoes.visualizar}
                                                onChange={(e) => setAuthConfig({
                                                    ...authConfig,
                                                    permissoes: { ...authConfig.permissoes, visualizar: e.target.checked }
                                                })}
                                                className="rounded border-gray-300"
                                            />
                                            <span className="text-sm">Visualizar dados</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={authConfig.permissoes.editar}
                                                onChange={(e) => setAuthConfig({
                                                    ...authConfig,
                                                    permissoes: { ...authConfig.permissoes, editar: e.target.checked }
                                                })}
                                                className="rounded border-gray-300"
                                            />
                                            <span className="text-sm">Editar informações</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={authConfig.permissoes.adicionarExames}
                                                onChange={(e) => setAuthConfig({
                                                    ...authConfig,
                                                    permissoes: { ...authConfig.permissoes, adicionarExames: e.target.checked }
                                                })}
                                                className="rounded border-gray-300"
                                            />
                                            <span className="text-sm">Adicionar exames e consultas</span>
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowNewAuth(false)}
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={gerarToken}
                                    disabled={!authConfig.nomeMedico}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    Gerar Código
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* QR Code Gerado */}
                {tokenAtual && (
                    <Card className="border-green-500 bg-green-500/5">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-green-600">
                                <CheckCircle className="h-5 w-5" />
                                Autorização Gerada com Sucesso!
                            </CardTitle>
                            <CardDescription>
                                Mostre este QR Code ou compartilhe o código com o profissional de saúde
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-6 md:grid-cols-2">
                                {/* QR Code */}
                                <div className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border-2 border-dashed">
                                    <QRCodeSVG
                                        value={tokenAtual}
                                        size={200}
                                        level="H"
                                        includeMargin={true}
                                    />
                                    <p className="text-sm text-muted-foreground mt-4">
                                        Escaneie com a câmera do celular
                                    </p>
                                </div>

                                {/* Código Manual */}
                                <div className="space-y-4">
                                    <div>
                                        <Label>Código de Acesso</Label>
                                        <div className="flex gap-2 mt-2">
                                            <Input
                                                value={tokenAtual}
                                                readOnly
                                                className="font-mono text-lg"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => copiarToken(tokenAtual)}
                                                className="px-3"
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Profissional:</span>
                                            <span className="font-medium">{authConfig.nomeMedico}</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Validade:</span>
                                            <span className="font-medium">{authConfig.duracaoHoras}h</span>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-muted-foreground">Status:</span>
                                            <span className="font-medium text-green-600">Ativo</span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => setTokenAtual(null)}
                                    >
                                        Fechar
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Histórico de Autorizações */}
                <Card>
                    <CardHeader>
                        <CardTitle>Histórico de Autorizações</CardTitle>
                        <CardDescription>
                            Todas as autorizações geradas e seu status atual
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {autorizacoes.map((auth) => (
                                <div
                                    key={auth.id}
                                    className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="rounded-full bg-primary/10 p-3">
                                            <Shield className="h-5 w-5 text-primary" />
                                        </div>
                                        <div>
                                            <p className="font-medium">{auth.nomeMedico}</p>
                                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                                <span>
                                                    Gerado em {new Date(auth.dataGeracao).toLocaleDateString('pt-BR')} às{' '}
                                                    {new Date(auth.dataGeracao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                                {auth.dataUso && (
                                                    <span>
                                                        • Usado em {new Date(auth.dataUso).toLocaleDateString('pt-BR')}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium ${getStatusColor(auth.status)}`}>
                                            {getStatusIcon(auth.status)}
                                            <span className="capitalize">{auth.status}</span>
                                        </div>
                                        {auth.status === "ativo" && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => revogarAutorizacao(auth.id)}
                                                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        )}
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
