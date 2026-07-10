const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, 'assets');

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

  // ── NAVEGAR A ENCUESTAS ──────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/surveys`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(3000);

  // ── CAPTURA 6.5: FLUJO COMPARTIR ────────────────────────────────────────
  // Highlight botón "Compartir" en la lista
  const compartirBtn = await page.$('.o_kanban_record button:has-text("Compartir"), .o_data_row button:has-text("Compartir"), button:has-text("Compartir")');
  if (compartirBtn) {
    await compartirBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
    await page.screenshot({ path: path.join(ASSETS, 'enc_14_compartir_highlight.png') });
    await compartirBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
    console.log('enc_14_compartir_highlight.png');

    // Click Compartir
    await compartirBtn.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(ASSETS, 'enc_15_pantalla_compartir.png') });
    console.log('enc_15_pantalla_compartir.png');

    // Highlight campo de correo si existe
    const emailField = await page.$('.modal input[type="email"], .modal input[name="email"], .o_field_many2many_tags input, input[placeholder*="orreo"], input[placeholder*="mail"]');
    if (emailField) {
      await emailField.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'enc_16_campo_correo_highlight.png') });
      await emailField.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      console.log('enc_16_campo_correo_highlight.png');
    }

    // Highlight botón Enviar si existe
    const enviarBtn = await page.$('button:has-text("Enviar"), button:has-text("Send")');
    if (enviarBtn) {
      await enviarBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'enc_17_boton_enviar_highlight.png') });
      await enviarBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      console.log('enc_17_boton_enviar_highlight.png');
    }

    // Cerrar modal si está abierto
    const discardBtn = await page.$('button:has-text("Descartar"), button:has-text("Cerrar"), button.btn-close, button:has-text("Close")');
    if (discardBtn) { await discardBtn.click(); await page.waitForTimeout(1500); }
  }

  // ── VOLVER A LISTA ───────────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/surveys`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(3000);

  // ── CAPTURA 6.6: VER RESULTADOS ──────────────────────────────────────────
  // Highlight "Ver resultados"
  const verResultados = await page.$('button:has-text("Ver resultados"), a:has-text("Ver resultados")');
  if (verResultados) {
    await verResultados.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
    await page.screenshot({ path: path.join(ASSETS, 'enc_18_ver_resultados_highlight.png') });
    await verResultados.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
    console.log('enc_18_ver_resultados_highlight.png');

    // Clic y esperar pantalla de resultados
    await verResultados.click();
    await page.waitForTimeout(4000);
    await page.screenshot({ path: path.join(ASSETS, 'enc_19_pantalla_resultados.png') });
    console.log('enc_19_pantalla_resultados.png');
  }

  console.log('=== CAPTURAS 6.5 y 6.6 LISTAS ===');
  await browser.close();
})();
