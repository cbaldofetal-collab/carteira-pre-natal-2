"use client"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Heart, Lock, Mail, AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { supabase } from "@/lib/supabaseClient"
import { Alert, AlertDescription } from "@/components/ui/alert"

function LoginForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    useEffect(() => {
        if (searchParams.get("cadastro") === "sucesso") {
            setSuccessMessage("Conta criada com sucesso! Faça login para continuar.")
        }
    }, [searchParams])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            })

            if (error) {
                throw error
            }

            // Login bem-sucedido
            router.push("/dashboard")
            router.refresh() // Atualiza o estado da sessão na aplicação
        } catch (err: any) {
            console.error("Erro no login:", err)
            setError(err.message === "Invalid login credentials"
                ? "E-mail ou senha incorretos."
                : "Ocorreu um erro ao fazer login. Tente novamente.")
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (error: any) {
            setError(error.message)
        }
    }

    return (
        <Card className="shadow-lg">
            <CardHeader className="space-y-1">
                <CardTitle className="text-2xl text-center">Bem-vinda de volta</CardTitle>
                <CardDescription className="text-center">
                    Entre com suas credenciais para acessar sua carteira
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {successMessage && (
                    <Alert className="bg-green-50 text-green-900 border-green-200">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <AlertDescription>{successMessage}</AlertDescription>
                    </Alert>
                )}

                {error && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleGoogleLogin}
                >
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                        <path
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            fill="#4285F4"
                        />
                        <path
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            fill="#34A853"
                        />
                        <path
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            fill="#FBBC05"
                        />
                        <path
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            fill="#EA4335"
                        />
                    </svg>
                    Continuar com Google
                </Button>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Ou continue com e-mail</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">E-mail</Label>
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
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Senha</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="remember"
                                className="rounded border-border"
                            />
                            <Label htmlFor="remember" className="text-sm font-normal cursor-pointer">
                                Lembrar-me
                            </Label>
                        </div>
                        <Link href="/recuperar-senha" className="text-sm text-primary hover:underline">
                            Esqueceu a senha?
                        </Link>
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-primary hover:bg-primary/90"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Entrando...
                            </>
                        ) : (
                            "Entrar"
                        )}
                    </Button>
                </form>
            </CardContent>
            <CardFooter>
                <p className="text-center text-sm text-muted-foreground w-full">
                    Não tem uma conta?{" "}
                    <Link href="/cadastro" className="text-primary font-medium hover:underline">
                        Cadastre-se
                    </Link>
                </p>
            </CardFooter>
        </Card>
    )
}

export default function LoginPage() {
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

                <Suspense fallback={
                    <Card className="shadow-lg">
                        <CardContent className="p-8 flex justify-center">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </CardContent>
                    </Card>
                }>
                    <LoginForm />
                </Suspense>
            </div>
        </div>
    )
}
