"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { X, Upload, FileText, CheckCircle } from "lucide-react"

interface ModalExameLaboratorialProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (exame: any) => void
}

export function ModalExameLaboratorial({ isOpen, onClose, onSubmit }: ModalExameLaboratorialProps) {
    const [formData, setFormData] = useState({
        tipo: "",
        data: "",
        resultado: "",
        arquivo: null as File | null
    })

    const examesLaboratoriais = [
        "Hemograma Completo",
        "Glicemia de Jejum",
        "Tipagem Sanguínea",
        "Ferritina",
        "Anti-HIV",
        "Reação Sorológica a Sífilis",
        "Sorologia Hepatite B",
        "Sorologia Hepatite C",
        "Sorologia Toxoplasmose",
        "Sorologia Citomegalovírus",
        "Anti-HTLV",
        "PPF",
        "TSH",
        "T4 Livre",
        "Teste de Tolerância Oral a Glicose (TTGO)",
        "Urina I",
        "Urocultura e Antibiograma",
        "Outro"
    ]

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(formData)
        setFormData({
            tipo: "",
            data: "",
            resultado: "",
            arquivo: null
        })
        onClose()
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, arquivo: e.target.files[0] })
        }
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Adicionar Exame Laboratorial</CardTitle>
                            <CardDescription>Registre um novo exame de laboratório</CardDescription>
                        </div>
                        <Button variant="ghost" size="sm" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="tipo">Tipo de Exame *</Label>
                            <select
                                id="tipo"
                                value={formData.tipo}
                                onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                required
                            >
                                <option value="">Selecione o tipo de exame</option>
                                {examesLaboratoriais.map(exame => (
                                    <option key={exame} value={exame}>{exame}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="data">Data de Realização *</Label>
                            <Input
                                id="data"
                                type="date"
                                value={formData.data}
                                onChange={(e) => setFormData({ ...formData, data: e.target.value })}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="resultado">Resultado/Observações *</Label>
                            <textarea
                                id="resultado"
                                value={formData.resultado}
                                onChange={(e) => setFormData({ ...formData, resultado: e.target.value })}
                                className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                placeholder="Ex: Normal, valores dentro da referência..."
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="arquivo">Anexar Arquivo (PDF ou Imagem)</Label>
                            <div className="flex items-center gap-2">
                                <Input
                                    id="arquivo"
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={handleFileChange}
                                    className="cursor-pointer"
                                />
                                {formData.arquivo && (
                                    <div className="flex items-center gap-1 text-sm text-green-600">
                                        <CheckCircle className="h-4 w-4" />
                                        <span>{formData.arquivo.name}</span>
                                    </div>
                                )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Formatos aceitos: PDF, JPG, PNG (máx. 10MB)
                            </p>
                        </div>

                        <div className="flex gap-3 justify-end pt-4">
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancelar
                            </Button>
                            <Button type="submit" className="bg-primary hover:bg-primary/90">
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Salvar Exame
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    )
}
