// Generates a branded PDF from a PlanoTreino using Puppeteer.
// The plan data is rendered as styled HTML and then printed to PDF.

import puppeteer from "puppeteer";
import type { PlanoTreino } from "@/types";

// Escapes special HTML characters so AI-generated text can't break the template
function esc(text: string): string {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>");
}

function buildHTML(plano: PlanoTreino): string {
  const weeksHTML = plano.semanas
    .map((semana) => {
      const daysHTML = semana.dias
        .map((dia) => {
          if (dia.descanso || !dia.sessao) {
            return `
              <div class="day day-rest">
                <div class="day-name">${esc(dia.dia)}</div>
                <div class="day-rest-label">Descanso / Recuperação Activa</div>
              </div>`;
          }
          const s = dia.sessao;
          return `
            <div class="day">
              <div class="day-name">${esc(dia.dia)}</div>
              <div class="session-type">${esc(s.tipo)}</div>
              <div class="session-meta">${esc(s.duracao)} &nbsp;·&nbsp; ${esc(s.zonaIntensidade)}</div>
              ${s.aquecimento ? `<div class="session-detail"><strong>Aquecimento:</strong> ${esc(s.aquecimento)}</div>` : ""}
              <div class="session-desc">${esc(s.instrucoes)}</div>
              ${s.arrefecimento ? `<div class="session-detail"><strong>Arrefecimento:</strong> ${esc(s.arrefecimento)}</div>` : ""}
            </div>`;
        })
        .join("");

      return `
        <div class="week">
          <div class="week-header">
            <span class="week-number">Semana ${semana.semana}</span>
            <span class="week-focus">${esc(semana.foco)}</span>
          </div>
          <div class="week-days">${daysHTML}</div>
        </div>`;
    })
    .join("");

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <title>${esc(plano.titulo)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, Helvetica, sans-serif; color: #1f2937; background: #ffffff; font-size: 13px; }

    /* ── Header ── */
    .header { background: #0D1B2A; color: #ffffff; padding: 28px 40px; }
    .logo { font-size: 26px; font-weight: 900; color: #1E90FF; letter-spacing: -0.5px; margin-bottom: 6px; }
    .plan-title { font-size: 18px; font-weight: 700; }
    .plan-sub { font-size: 12px; color: #94a3b8; margin-top: 4px; }

    /* ── Content sections ── */
    .content { padding: 28px 40px; }
    .section { margin-bottom: 28px; }
    .section-title {
      font-size: 13px; font-weight: 700; color: #0D1B2A;
      border-left: 4px solid #1E90FF; padding-left: 10px;
      margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.5px;
    }
    .section-text { font-size: 12px; line-height: 1.75; color: #374151; }

    /* ── Week blocks ── */
    .week { margin-bottom: 18px; page-break-inside: avoid; border-radius: 6px; overflow: hidden; border: 1px solid #e5e7eb; }
    .week-header { background: #0D1B2A; color: #ffffff; padding: 9px 14px; display: flex; justify-content: space-between; align-items: center; }
    .week-number { font-size: 13px; font-weight: 700; }
    .week-focus { font-size: 11px; color: #1E90FF; font-weight: 600; }

    /* ── Day rows ── */
    .day { padding: 10px 14px; border-bottom: 1px solid #f3f4f6; }
    .day:last-child { border-bottom: none; }
    .day-rest { background: #f9fafb; }
    .day-name { font-size: 10px; font-weight: 700; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 3px; }
    .day-rest-label { font-size: 12px; color: #9ca3af; font-style: italic; }
    .session-type { font-size: 13px; font-weight: 700; color: #1E90FF; margin-bottom: 2px; }
    .session-meta { font-size: 11px; color: #6b7280; margin-bottom: 4px; }
    .session-desc { font-size: 12px; color: #374151; line-height: 1.6; margin-bottom: 3px; }
    .session-detail { font-size: 11px; color: #9ca3af; line-height: 1.5; margin-top: 2px; }

    /* ── Footer ── */
    .footer { background: #f8fafc; border-top: 1px solid #e5e7eb; padding: 14px 40px; text-align: center; margin-top: 10px; }
    .footer-text { font-size: 11px; color: #9ca3af; }

    @media print { body { -webkit-print-color-adjust: exact; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">VelociPlan</div>
    <div class="plan-title">${esc(plano.titulo)}</div>
    <div class="plan-sub">Plano personalizado gerado por Inteligência Artificial &nbsp;·&nbsp; ${plano.duracao} semanas</div>
  </div>

  <div class="content">
    <div class="section">
      <div class="section-title">O Teu Perfil</div>
      <p class="section-text">${esc(plano.resumoPerfil)}</p>
    </div>

    <div class="section">
      <div class="section-title">Visão Geral do Plano</div>
      <p class="section-text">${esc(plano.resumoPlano)}</p>
    </div>

    <div class="section">
      <div class="section-title">Programa Semanal</div>
      ${weeksHTML}
    </div>

    <div class="section">
      <div class="section-title">Nutrição</div>
      <p class="section-text">${esc(plano.nutricao)}</p>
    </div>

    <div class="section">
      <div class="section-title">Recuperação</div>
      <p class="section-text">${esc(plano.recuperacao)}</p>
    </div>

    <div class="section">
      <div class="section-title">Mensagem Final</div>
      <p class="section-text">${esc(plano.mensagemMotivacional)}</p>
    </div>
  </div>

  <div class="footer">
    <p class="footer-text">VelociPlan &nbsp;·&nbsp; Plano gerado com Inteligência Artificial &nbsp;·&nbsp; Para uso pessoal</p>
  </div>
</body>
</html>`;
}

export async function gerarPDF(plano: PlanoTreino): Promise<Buffer> {
  const html = buildHTML(plano);

  const browser = await puppeteer.launch({
    headless: true,
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "15mm", bottom: "15mm", left: "0mm", right: "0mm" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
