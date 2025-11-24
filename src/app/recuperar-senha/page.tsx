"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Mail, ArrowLeft, CheckCircle } from "lucide-react"

export default function RecuperarSenhaPage() {
    const [email, setEmail] = useState("")
    const [enviado, setEnviado] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        // TODO: Implementar lógica de recuperação de senha com Supabase
        // await supabase.auth.resetPasswordForEmail(email)

        // Simular envio
        setTimeout(() => {
            setEnviado(true)
            setLoading(false)
        }, 1500)
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/10 via-background to-secondary/10 p-4">
            <div className="w-full max-w-md">
                <div className="flex justify-center mb-8">
                    <div className="flex items-center space-x-2">
                        <Heart className="h-10 w-10 text-secondary" fill="currentColor" />
                        <span className="text-2xl font-bold text-foreground">
                            Carteira Pré-Natal
                        </span>
                    </div>
                </div>

                <Card className="shadow-lg">
                    <CardHeader className="space-y-1">
                        <CardTitle className="text-2xl text-center">
                            {enviado ? "E-mail enviado!" : "Recuperar senha"}
                        </CardTitle>
                        <CardDescription className="text-center">
                            {enviado
                                ? "Verifique sua caixa de entrada"
                                : "Digite seu e-mail para receber as instruções"}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {enviado ? (
                            <div className="text-center space-y-4 py-4">
                                <div className="flex justify-center">
                                    <CheckCircle className="h-16 w-16 text-green-500" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Enviamos um link de recuperação de senha para:{" "}
                                    <strong className="text-foreground">{email}</strong>
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Se você não receber o e-mail em alguns minutos, verifique sua pasta de spam.
                                </p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">E-mail cadastrado</Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                        <Input
                                            id="email"
                                            type="email"
                                            placeholder="seu@email.com"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="pl-10"
                                            required
                                            disabled={loading}
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="w-full bg-primary hover:bg-primary/90"
                                    disabled={loading}
                                >
                                    {loading ? "Enviando..." : "Enviar link de recuperação"}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                    <CardFooter className="flex flex-col space-y-2">
                        <Link
                            href="/login"
                            className="flex items-center text-sm text-primary hover:underline"
                        >
                            <ArrowLeft className="h-4 w-4 mr-1" />
                            Voltar para o login
                        </Link>
                        {enviado && (
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={() => {
                                    setEnviado(false)
                                    setEmail("")
                                }}
                            >
                                Enviar novamente
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}
