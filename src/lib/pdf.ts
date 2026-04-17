// Generates a branded PDF from a PlanoTreino using Puppeteer.
// Visual design matches the VelociPlan landing page (dark navy + blue).
//
// Header strategy:
//   position:fixed mini-header lives at top:0 on every page.
//   Every element that can start at the top of a page is wrapped in a
//   .page-slot div that carries its own 46px spacer. When break-inside:avoid
//   moves the slot to a new page, the spacer travels with it and always
//   creates 46px of clear space below the header — nothing can overlap.

import fs from "fs";
import path from "path";
import type { PlanoTreino } from "@/types";

const HEADER_H = 46;    // px — mini-header height
const SLOT_SPACE = 62;  // px — header + breathing room below it

function esc(text: string): string {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/\n/g, "<br>");
}

function escBullets(text: string): string {
  const escaped = String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
  return escaped
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (trimmed.startsWith("•")) {
        return `<div class="bullet">${trimmed}</div>`;
      }
      return trimmed ? `<span>${trimmed}</span>` : "";
    })
    .filter(Boolean)
    .join("");
}

function getLogoDataUri(): string {
  try {
    const logoPath = path.join(process.cwd(), "public", "logo.png");
    const logoBuffer = fs.readFileSync(logoPath);
    return `data:image/png;base64,${logoBuffer.toString("base64")}`;
  } catch {
    return "";
  }
}

function buildHTML(plano: PlanoTreino): string {
  const logoDataUri = getLogoDataUri();
  const totalSessoes = plano.semanas.reduce(
    (acc, s) => acc + s.dias.filter((d) => !d.descanso).length,
    0
  );

  // Each week is wrapped in .page-slot so the spacer travels with the week
  // when break-inside:avoid moves it to the next page.
  function weekHTML(semana: PlanoTreino["semanas"][number]): string {
    const daysHTML = semana.dias
      .map((dia) => {
        if (dia.descanso || !dia.sessao) {
          return `
            <div class="day day-rest">
              <span class="day-name">${esc(dia.dia)}</span>
              <span class="day-rest-label">Descanso</span>
            </div>`;
        }
        const s = dia.sessao;
        return `
          <div class="day">
            <div class="day-header">
              <span class="day-name">${esc(dia.dia)}</span>
              <span class="session-badge">${esc(s.tipo)}</span>
            </div>
            <div class="session-meta">${esc(s.duracao)} &nbsp;·&nbsp; ${esc(s.zonaIntensidade)}</div>
            ${s.aquecimento ? `<div class="session-detail">▸ <strong>Aquec.:</strong> ${esc(s.aquecimento)}</div>` : ""}
            <div class="session-desc">${esc(s.instrucoes)}</div>
            ${s.arrefecimento ? `<div class="session-detail">▸ <strong>Arrec.:</strong> ${esc(s.arrefecimento)}</div>` : ""}
          </div>`;
      })
      .join("");

    return `
      <div class="page-slot">
        <div class="slot-space"></div>
        <div class="week">
          <div class="week-header">
            <span class="week-number">Semana ${semana.semana}</span>
            <span class="week-focus">${esc(semana.foco)}</span>
          </div>
          <div class="week-days">${daysHTML}</div>
        </div>
      </div>`;
  }

  // Page 1
  const page1 = `
    <div class="pdf-page">
      <div class="content">
        <div class="slot-space"></div>
        <div class="plan-cover">
          <div class="cover-badge">Plano Personalizado por IA</div>
          <div class="cover-title">${esc(plano.titulo)}</div>
          <div class="plan-stats">
            <div class="stat"><div class="stat-dot"></div>${plano.duracao} semanas</div>
            <div class="stat"><div class="stat-dot"></div>${totalSessoes} sessões de treino</div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">O Teu Perfil</div>
          <div class="card-blue">
            <p class="section-text">${esc(plano.resumoPerfil)}</p>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Visão Geral do Plano</div>
          <div class="card">
            <p class="section-text">${esc(plano.resumoPlano)}</p>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Programa Semanal</div>
          ${weekHTML(plano.semanas[0])}
        </div>
      </div>
    </div>`;

  // Week pages (pairs)
  const remaining = plano.semanas.slice(1);
  const weekPages: string[] = [];
  for (let i = 0; i < remaining.length; i += 2) {
    const pair = remaining.slice(i, i + 2);
    weekPages.push(`
      <div class="pdf-page page-break">
        <div class="content">
          ${pair.map(weekHTML).join("")}
        </div>
      </div>`);
  }

  // Last page — slot-space keeps the content below the header
  const lastPage = `
    <div class="pdf-page pdf-page-last page-break">
      <div class="content">
        <div class="slot-space"></div>
        <div class="section">
          <div class="section-title">Nutrição</div>
          <div class="card">
            <div class="section-text">${escBullets(plano.nutricao)}</div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Recuperação</div>
          <div class="card">
            <div class="section-text">${escBullets(plano.recuperacao)}</div>
          </div>
        </div>
        <div class="section">
          <div class="section-title">Mensagem Final</div>
          <div class="motivational">
            <p>${esc(plano.mensagemMotivacional)}</p>
          </div>
        </div>
      </div>
      <div class="footer">
        ${logoDataUri
          ? `<img class="footer-logo" src="${logoDataUri}" alt="VelociPlan">`
          : `<span style="font-size:11px;color:#334155;font-weight:700;">VelociPlan</span>`}
        <span class="footer-text">Plano gerado com Inteligência Artificial &nbsp;·&nbsp; Para uso pessoal</span>
      </div>
    </div>`;

  const allPages = [page1, ...weekPages, lastPage].join("\n");

  return `<!DOCTYPE html>
<html lang="pt">
<head>
  <meta charset="utf-8">
  <title>${esc(plano.titulo)}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }

    @page { size: A4; margin: 0; }

    body {
      font-family: Arial, Helvetica, sans-serif;
      background: #0D1B2A;
      color: #e2e8f0;
      font-size: 12px;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }

    /* ── FIXED MINI-HEADER — repeats on every PDF page ── */
    .mini-header {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      height: ${HEADER_H}px;
      background: #0a1520;
      border-bottom: 1px solid rgba(30,144,255,0.25);
      padding: 0 36px;
      display: flex;
      align-items: center;
      gap: 14px;
      z-index: 100;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .mini-logo { height: 26px; width: auto; }
    .mini-logo-text { font-size: 14px; font-weight: 900; color: #1E90FF; }
    .mini-title { font-size: 10px; color: #475569; font-weight: 600; }

    /* ── SLOT-SPACE — travels with its sibling element via .page-slot ── */
    /* Guarantees ${HEADER_H}px of clear space below the header whenever  */
    /* a .page-slot lands at the top of any page (first page or overflow). */
    .slot-space {
      height: ${SLOT_SPACE}px;
      flex-shrink: 0;
    }

    /* .page-slot keeps slot-space + week together on the same page */
    .page-slot {
      break-inside: avoid;
      page-break-inside: avoid;
    }

    /* ── PAGE STRUCTURE ── */
    .pdf-page {
      background: #0D1B2A;
      width: 210mm;
      display: flex;
      flex-direction: column;
    }
    .pdf-page-last { min-height: 200mm; }
    .page-break {
      break-before: page;
      page-break-before: always;
    }

    /* ── PLAN COVER ── */
    .plan-cover {
      background: #0a1520;
      border: 1px solid rgba(30,144,255,0.2);
      border-radius: 10px;
      padding: 20px 20px 18px;
      margin-bottom: 18px;
    }
    .cover-badge {
      display: inline-block;
      background: rgba(30,144,255,0.12);
      border: 1px solid rgba(30,144,255,0.35);
      color: #60a5fa;
      font-size: 9px;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 20px;
      letter-spacing: 1px;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .cover-title {
      font-size: 18px;
      font-weight: 900;
      color: #ffffff;
      line-height: 1.3;
      margin-bottom: 12px;
    }
    .plan-stats { display: flex; gap: 20px; }
    .stat { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #94a3b8; }
    .stat-dot { width: 5px; height: 5px; background: #1E90FF; border-radius: 50%; flex-shrink: 0; }

    /* ── CONTENT ── */
    .content { padding: 0 36px 20px; flex: 1; }

    /* ── SECTION ── */
    .section { margin-bottom: 18px; }
    .section-title {
      font-size: 10px;
      font-weight: 800;
      color: #1E90FF;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      border-left: 3px solid #1E90FF;
      padding-left: 9px;
      margin-bottom: 10px;
    }
    .section-text { font-size: 12px; line-height: 1.8; color: #cbd5e1; }

    /* ── CARDS ── */
    .card {
      background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 8px;
      padding: 14px 16px;
    }
    .card-blue {
      background: rgba(30,144,255,0.07);
      border: 1px solid rgba(30,144,255,0.2);
      border-radius: 8px;
      padding: 14px 16px;
    }

    /* ── WEEK ── */
    .week {
      margin-bottom: 10px;
      border-radius: 8px;
      overflow: hidden;
      border: 1px solid rgba(255,255,255,0.08);
    }
    .week-header {
      background: rgba(30,144,255,0.15);
      border-bottom: 1px solid rgba(30,144,255,0.25);
      padding: 9px 14px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .week-number { font-size: 13px; font-weight: 800; color: #ffffff; }
    .week-focus { font-size: 10px; font-weight: 700; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.5px; }

    /* ── DAY ── */
    .day { padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .day:last-child { border-bottom: none; }
    .day-rest {
      padding: 8px 14px;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      display: flex;
      align-items: center;
      gap: 12px;
      background: rgba(0,0,0,0.15);
    }
    .day-rest:last-child { border-bottom: none; }
    .day-header { display: flex; align-items: center; gap: 10px; margin-bottom: 5px; }
    .day-name { font-size: 10px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; }
    .day-rest-label { font-size: 11px; color: #334155; font-style: italic; }
    .session-badge {
      background: rgba(30,144,255,0.15);
      border: 1px solid rgba(30,144,255,0.3);
      color: #60a5fa;
      font-size: 10px;
      font-weight: 700;
      padding: 2px 8px;
      border-radius: 10px;
    }
    .session-meta { font-size: 11px; color: #64748b; margin-bottom: 5px; }
    .session-desc { font-size: 12px; color: #cbd5e1; line-height: 1.65; margin-bottom: 3px; }
    .session-detail { font-size: 11px; color: #475569; line-height: 1.5; margin-top: 3px; }

    /* ── MOTIVATIONAL ── */
    .motivational {
      background: linear-gradient(135deg, rgba(30,144,255,0.1) 0%, rgba(30,144,255,0.04) 100%);
      border: 1px solid rgba(30,144,255,0.25);
      border-radius: 8px;
      padding: 16px;
      text-align: center;
    }
    .motivational p { font-size: 13px; font-style: italic; color: #93c5fd; line-height: 1.8; }

    /* ── FOOTER ── */
    .footer {
      background: #0a1520;
      border-top: 1px solid rgba(255,255,255,0.06);
      padding: 12px 36px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: auto;
      flex-shrink: 0;
    }
    .footer-logo { height: 24px; width: auto; opacity: 0.5; }
    .footer-text { font-size: 10px; color: #334155; }

    /* ── BULLETS ── */
    .bullet { font-size: 12px; color: #cbd5e1; line-height: 1.7; padding-left: 4px; }
    .bullet::before { content: ""; }
  </style>
</head>
<body>

<div class="mini-header">
  ${logoDataUri
    ? `<img class="mini-logo" src="${logoDataUri}" alt="VelociPlan">`
    : `<span class="mini-logo-text">VelociPlan</span>`}
  <span class="mini-title">${esc(plano.titulo)}</span>
</div>

${allPages}
</body>
</html>`;
}

export async function gerarPDF(plano: PlanoTreino): Promise<Buffer> {
  const html = buildHTML(plano);

  let browser;

  if (process.env.NODE_ENV === "production") {
    // Vercel: usa puppeteer-core + chromium comprimido (~50MB, cabe no limite)
    const chromium = (await import("@sparticuz/chromium")).default;
    const puppeteerCore = (await import("puppeteer-core")).default;
    browser = await puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless,
    });
  } else {
    // Local: usa puppeteer completo (inclui o seu próprio Chromium)
    const puppeteer = (await import("puppeteer")).default;
    browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });
  }

  try {
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    const pdf = await page.pdf({
      format: "A4",
      printBackground: true,
      margin: { top: "0mm", bottom: "0mm", left: "0mm", right: "0mm" },
    });
    return Buffer.from(pdf);
  } finally {
    await browser.close();
  }
}
