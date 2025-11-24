"use client"

import { useState } from "react"
import { Header } from "@/components/layout/header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserCheck, Lock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AcessoMedicoPage() {
    const [token, setToken] = useState("")
    const [crmMedico, setCrmMedico] = useState("")
    const [nomeMedico, setNomeMedico] = useState("")
    const [validando, setValidando] = useState(false)
    const [resultado, setResultado] = useState<{
        tipo: "sucesso" | "erro" | null
        mensagem: string
    }>({ tipo: null, mensagem: "" })

    const validarToken = async () => {
        setValidando(true)

        // Simulação de validação (em produção, isso seria uma chamada ao backend)
        setTimeout(() => {
            // Mock - validação de token
            if (token.toUpperCase() === "ABC123XYZ" || token.length >= 8) {
                setResultado({
                    tipo: "sucesso",
                    mensagem: "Acesso autorizado! Redirecionando para o painel médico..."
                })

                // Redirecionar após 2 segundos
                setTimeout(() => {
                    window.location.href = "/painel-medico"
                }, 2000)
            } else {
                setResultado({
                    tipo: "erro",
                    mensagem: "Token inválido, expirado ou já utilizado. Solicite um novo código à paciente."
                })
            }
            setValidando(false)
        }, 1500)
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Header />

            <main className="flex-1 container max-w-2xl py-12">
                <div className="space-y-6">
                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="flex justify-center">
                            <div className="rounded-full bg-primary/10 p-4">
                                <UserCheck className="h-12 w-12 text-primary" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-bold">Acesso Médico</h1>
                        <p className="text-muted-foreground">
                            Insira o código de autorização fornecido pela paciente
                        </p>
                    </div>

                    {/* Aviso de Privacidade */}
                    <Card className="border-amber-500/50 bg-amber-500/5">
                        <CardContent className="pt-6">
                            <div className="flex gap-3">
                                <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                                <div className="space-y-1">
                                    <p className="font-semibold text-sm">Importante</p>
                                    <p className="text-sm text-muted-foreground">
                                        Este sistema respeita a privacidade e os direitos da gestante.
                                        O acesso aos dados só é permitido mediante autorização expressa da paciente
                                        através de um código único e temporário.
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Formulário de Acesso */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Validar Autorização</CardTitle>
                            <CardDescription>
                                Preencha os dados abaixo para acessar o prontuário da paciente
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="nomeMedico">Seu Nome Completo *</Label>
                                    <Input
                                        id="nomeMedico"
                                        value={nomeMedico}
                                        onChange={(e) => setNomeMedico(e.target.value)}
                                        placeholder="Ex: Dr. João Silva"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="crm">CRM *</Label>
                                    <Input
                                        id="crm"
                                        value={crmMedico}
                                        onChange={(e) => setCrmMedico(e.target.value)}
                                        placeholder="Ex: 12345-SP"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="token">Código de Autorização *</Label>
                                    <Input
                                        id="token"
                                        value={token}
                                        onChange={(e) => setToken(e.target.value.toUpperCase())}
                                        placeholder="Digite o código fornecido pela paciente"
                                        className="font-mono text-lg tracking-wider"
                                        maxLength={20}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        O código pode ser escaneado via QR Code ou digitado manualmente
                                    </p>
                                </div>
                            </div>

                            {/* Resultado da Validação */}
                            {resultado.tipo && (
                                <div className={`p-4 rounded-lg border ${resultado.tipo === "sucesso"
                                        ? "bg-green-500/10 border-green-500/50"
                                        : "bg-red-500/10 border-red-500/50"
                                    }`}>
                                    <div className="flex items-center gap-3">
                                        {resultado.tipo === "sucesso" ? (
                                            <CheckCircle className="h-5 w-5 text-green-500" />
                                        ) : (
                                            <XCircle className="h-5 w-5 text-red-500" />
                                        )}
                                        <p className={`text-sm font-medium ${resultado.tipo === "sucesso" ? "text-green-600" : "text-red-600"
                                            }`}>
                                            {resultado.mensagem}
                                        </p>
                                    </div>
                                </div>
                            )}

                            <Button
                                onClick={validarToken}
                                disabled={!token || !crmMedico || !nomeMedico || validando}
                                className="w-full bg-primary hover:bg-primary/90"
                            >
                                {validando ? (
                                    <>
                                        <Lock className="h-4 w-4 mr-2 animate-pulse" />
                                        Validando...
                                    </>
                                ) : (
                                    <>
                                        <Lock className="h-4 w-4 mr-2" />
                                        Validar e Acessar
                                    </>
                                )}
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Informações Adicionais */}
                    <Card className="bg-muted/50">
                        <CardContent className="pt-6">
                            <div className="space-y-3 text-sm">
                                <h3 className="font-semibold">Como funciona?</h3>
                                <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
                                    <li>A paciente gera um código de autorização único no aplicativo</li>
                                    <li>Ela compartilha o código com você via QR Code ou manualmente</li>
                                    <li>Você insere o código nesta página para validar o acesso</li>
                                    <li>Após validação, você terá acesso temporário aos dados da paciente</li>
                                    <li>O código é de uso único e expira após o período definido</li>
                                </ol>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Link para voltar */}
                    <div className="text-center">
                        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
                            Voltar para a página inicial
                        </Link>
                    </div>
                </div>
            </main>
        </div>
    )
}
