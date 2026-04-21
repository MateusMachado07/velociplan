// One-off script — generates public/stripe-preview.png
// Run with: node generate-stripe-preview.mjs

import puppeteer from "puppeteer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const logoPath = path.join(__dirname, "public", "logo.png");
const logoB64 = fs.existsSync(logoPath)
  ? `data:image/png;base64,${fs.readFileSync(logoPath).toString("base64")}`
  : "";

const html = `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 800px; height: 600px; overflow: hidden;
    font-family: Arial, Helvetica, sans-serif;
    background: #0D1B2A;
    color: #e2e8f0;
    -webkit-font-smoothing: antialiased;
  }

  /* Header */
  .header {
    background: #0a1520;
    border-bottom: 1px solid rgba(30,144,255,0.3);
    padding: 14px 32px;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  .header img { height: 30px; }
  .header-label {
    font-size: 11px;
    color: #475569;
    font-weight: 600;
    letter-spacing: 0.5px;
  }

  /* Body */
  .body { padding: 28px 32px; display: flex; flex-direction: column; gap: 18px; }

  /* Cover */
  .cover {
    background: #0a1520;
    border: 1px solid rgba(30,144,255,0.22);
    border-radius: 10px;
    padding: 20px 22px 18px;
  }
  .badge {
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
    font-size: 19px;
    font-weight: 900;
    color: #fff;
    margin-bottom: 12px;
    line-height: 1.3;
  }
  .stats { display: flex; gap: 20px; }
  .stat { display: flex; align-items: center; gap: 6px; font-size: 11px; color: #94a3b8; }
  .dot { width: 5px; height: 5px; background: #1E90FF; border-radius: 50%; flex-shrink: 0; }

  /* Sections */
  .sections { display: flex; gap: 16px; }
  .section { flex: 1; }
  .section-title {
    font-size: 9px;
    font-weight: 800;
    color: #1E90FF;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    border-left: 3px solid #1E90FF;
    padding-left: 8px;
    margin-bottom: 8px;
  }
  .card-blue {
    background: rgba(30,144,255,0.07);
    border: 1px solid rgba(30,144,255,0.2);
    border-radius: 8px;
    padding: 11px 13px;
  }
  .card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 11px 13px;
  }
  .bar {
    height: 8px;
    border-radius: 4px;
    margin-bottom: 6px;
  }
  .bar:last-child { margin-bottom: 0; }

  /* Week */
  .week {
    border-radius: 8px;
    overflow: hidden;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .week-header {
    background: rgba(30,144,255,0.15);
    border-bottom: 1px solid rgba(30,144,255,0.25);
    padding: 8px 13px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .week-num { font-size: 12px; font-weight: 900; color: #fff; }
  .week-focus { font-size: 9px; font-weight: 700; color: #60a5fa; text-transform: uppercase; letter-spacing: 0.5px; }
  .day { padding: 7px 13px; border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; align-items: center; gap: 10px; }
  .day:last-child { border-bottom: none; }
  .day-rest { background: rgba(0,0,0,0.15); }
  .day-name { font-size: 9px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; width: 80px; flex-shrink: 0; }
  .session-badge {
    background: rgba(30,144,255,0.15);
    border: 1px solid rgba(30,144,255,0.3);
    color: #60a5fa;
    font-size: 9px;
    font-weight: 700;
    padding: 2px 7px;
    border-radius: 10px;
  }
  .rest-label { font-size: 10px; color: #334155; font-style: italic; }
  .day-bar { height: 7px; background: rgba(255,255,255,0.08); border-radius: 3px; flex: 1; }

  /* Watermark */
  .watermark {
    position: absolute;
    bottom: 18px;
    right: 28px;
    font-size: 10px;
    color: #1E3A5F;
    font-weight: 700;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
</style>
</head>
<body>

<div class="header">
  ${logoB64 ? `<img src="${logoB64}" alt="VelociPlan">` : `<span style="font-size:16px;font-weight:900;color:#1E90FF;">VelociPlan</span>`}
  <span class="header-label">Plano Personalizado por Inteligência Artificial</span>
</div>

<div class="body">

  <!-- Cover -->
  <div class="cover">
    <div class="badge">Plano Personalizado por IA</div>
    <div class="cover-title">Plano de Treino de Ciclismo Personalizado — 8 Semanas</div>
    <div class="stats">
      <div class="stat"><div class="dot"></div>8 semanas</div>
      <div class="stat"><div class="dot"></div>24 sessões de treino</div>
    </div>
  </div>

  <!-- Profile + Overview -->
  <div class="sections">
    <div class="section">
      <div class="section-title">O Teu Perfil</div>
      <div class="card-blue">
        <div class="bar" style="background:rgba(30,144,255,0.2);width:100%"></div>
        <div class="bar" style="background:rgba(30,144,255,0.15);width:80%"></div>
      </div>
    </div>
    <div class="section">
      <div class="section-title">Visão Geral</div>
      <div class="card">
        <div class="bar" style="background:rgba(255,255,255,0.1);width:100%"></div>
        <div class="bar" style="background:rgba(255,255,255,0.07);width:75%"></div>
      </div>
    </div>
  </div>

  <!-- Week block -->
  <div>
    <div class="section-title">Programa Semanal</div>
    <div class="week">
      <div class="week-header">
        <span class="week-num">Semana 1</span>
        <span class="week-focus">Base Aeróbica</span>
      </div>
      <div class="day">
        <span class="day-name">Segunda</span>
        <span class="session-badge">Endurance</span>
        <div class="day-bar"></div>
      </div>
      <div class="day day-rest">
        <span class="day-name">Terça</span>
        <span class="rest-label">Descanso</span>
      </div>
      <div class="day">
        <span class="day-name">Quarta</span>
        <span class="session-badge">Força e Cadência</span>
        <div class="day-bar"></div>
      </div>
      <div class="day day-rest">
        <span class="day-name">Quinta</span>
        <span class="rest-label">Descanso</span>
      </div>
      <div class="day">
        <span class="day-name">Sábado</span>
        <span class="session-badge">Saída Longa</span>
        <div class="day-bar"></div>
      </div>
    </div>
  </div>

</div>

<div class="watermark">velociplan.pt</div>

</body>
</html>`;

const browser = await puppeteer.launch({
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox"],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: 800, height: 600, deviceScaleFactor: 2 });
  await page.setContent(html, { waitUntil: "networkidle0" });

  const outputPath = path.join(__dirname, "public", "stripe-preview.png");
  await page.screenshot({ path: outputPath, type: "png", fullPage: false });

  console.log(`✓ Imagem gerada: ${outputPath}`);
} finally {
  await browser.close();
}
