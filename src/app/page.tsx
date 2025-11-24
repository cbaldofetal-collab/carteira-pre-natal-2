"use client"

import { Header } from "@/components/layout/header"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary">
              Sua gestação, <br className="hidden sm:inline" />
              <span className="text-foreground">organizada e segura.</span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              A Carteira Pré-Natal Digital centraliza seus exames, consultas e histórico médico em um só lugar.
              Segurança para você e seu bebê.
            </p>
            <div className="space-x-4">
              <Link href="/cadastro">
                <Button size="lg" className="bg-secondary hover:bg-secondary/90">
                  Começar Agora
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

