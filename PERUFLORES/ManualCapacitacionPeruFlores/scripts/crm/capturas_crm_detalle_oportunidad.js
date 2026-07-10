const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page    = await context.newPage();

  // ── LOGIN ────────────────────────────────────────────────────────────────
  await page.goto(`${BASE_URL}`);
  await page.waitForSelector('input[name="login"]', { timeout: 15000 });
  await page.fill('input[name="login"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/odoo/, { timeout: 20000 });
  console.log('LOGIN OK');

  // ── NAVIGATE TO CRM ──────────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/crm`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(4000);

  // ── OPEN AN OPPORTUNITY ──────────────────────────────────────────────────
  const oppCard = await page.$('.o_kanban_record:not(.o_kanban_ghost)');
  if (oppCard) {
    await oppCard.click();
    await page.waitForTimeout(4000);

    // 1. Highlight Etapas (Stages)
    const statusBar = await page.$('.o_statusbar_status');
    if (statusBar) {
        await statusBar.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
        await page.screenshot({ path: path.join(ASSETS, 'crm_15_detalle_etapas.png') });
        await statusBar.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
        console.log('crm_15_detalle_etapas.png');
    }

    // 2. Highlight Nueva Cotizacion
    const newQuoteBtn = await page.$('button:has-text("Nueva cotización"), button:has-text("New Quotation")');
    if (newQuoteBtn) {
        await newQuoteBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
        await page.screenshot({ path: path.join(ASSETS, 'crm_16_detalle_nueva_cotizacion.png') });
        await newQuoteBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
        console.log('crm_16_detalle_nueva_cotizacion.png');
    }

    // 3. Highlight Ganado/Perdido
    const wonBtn = await page.$('button:has-text("Ganado"), button:has-text("Won")');
    const lostBtn = await page.$('button:has-text("Perdido"), button:has-text("Lost")');
    if (wonBtn || lostBtn) {
        if(wonBtn) await wonBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
        if(lostBtn) await lostBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
        await page.screenshot({ path: path.join(ASSETS, 'crm_17_detalle_ganado_perdido.png') });
        if(wonBtn) await wonBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
        if(lostBtn) await lostBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
        console.log('crm_17_detalle_ganado_perdido.png');
    }

    // 4. Highlight Notas Internas tab
    const notasTab = await page.$('a.nav-link:has-text("Notas internas"), a.nav-link:has-text("Internal Notes")');
    if (notasTab) {
        await notasTab.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
        await page.screenshot({ path: path.join(ASSETS, 'crm_18_detalle_notas_internas.png') });
        await notasTab.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
        console.log('crm_18_detalle_notas_internas.png');
    }

    // 5. Highlight Chatter (Registrar nota / Schedule activity)
    const chatterBox = await page.$('.o-mail-ChatterTopbar');
    if (chatterBox) {
        await chatterBox.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
        await page.screenshot({ path: path.join(ASSETS, 'crm_19_detalle_chatter.png') });
        await chatterBox.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
        console.log('crm_19_detalle_chatter.png');
    }

  }

  console.log('=== CAPTURAS DETALLE OPORTUNIDAD LISTAS ===');
  await browser.close();
})();
