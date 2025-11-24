import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="mr-4 flex">
                    <Link href="/" className="mr-6 flex items-center space-x-2">
                        <Heart className="h-6 w-6 text-secondary" fill="currentColor" />
                        <span className="hidden font-bold sm:inline-block">
                            Carteira Pré-Natal
                        </span>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm font-medium">
                        <Link href="/dashboard" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Dashboard
                        </Link>
                        <Link href="/consultas" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Consultas
                        </Link>
                        <Link href="/exames" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Exames
                        </Link>
                        <Link href="/autorizacoes" className="transition-colors hover:text-foreground/80 text-foreground/60">
                            Autorizações
                        </Link>
                    </nav>
                </div>
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        {/* Search or other controls */}
                    </div>
                    <nav className="flex items-center">
                        <Link href="/login">
                            <Button variant="ghost" size="sm">
                                Entrar
                            </Button>
                        </Link>
                        <Link href="/cadastro">
                            <Button size="sm" className="ml-2">
                                Cadastrar
                            </Button>
                        </Link>
                    </nav>
                </div>
            </div>
        </header>
    )
}
