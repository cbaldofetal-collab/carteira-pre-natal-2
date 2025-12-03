import { addDays } from './utils/date.js';

const templates = [
  { id: 'morf1', nome: 'Ultrassom Morfológico 1º Trimestre', inicioSemana: 11 },
  { id: 'morf2', nome: 'Ultrassom Morfológico 2º Trimestre', inicioSemana: 22 },
  { id: 'cres28', nome: 'Ultrassom de Crescimento', inicioSemana: 28 },
  { id: 'cres34', nome: 'Ultrassom de Crescimento Final', inicioSemana: 34 },
];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  try {
    const { baseDate } = req.body || {};
    const base = baseDate ? new Date(baseDate) : new Date();
    const reminders = [];
    for (const t of templates) {
      const inicio = addDays(base, t.inicioSemana * 7);
      const t14 = addDays(inicio, -14);
      const t7 = addDays(inicio, -7);
      reminders.push({ exameId: t.id, titulo: t.nome, quando: t14.toISOString(), tipo: 'T-14' });
      reminders.push({ exameId: t.id, titulo: t.nome, quando: t7.toISOString(), tipo: 'T-7' });
    }
    res.status(200).json({ reminders });
  } catch (e) {
    res.status(500).json({ error: 'internal_error' });
  }
}
