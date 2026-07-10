const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, 'assets');

async function highlight(page, selector, outFile) {
  // inject red border
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el) {
      el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;';
      el.dataset._hl = 'yes';
    }
  }, selector);
  await page.screenshot({ path: path.join(ASSETS, outFile), fullPage: false });
  // remove border
  await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (el && el.dataset._hl) {
      el.style.border = '';
      el.style.boxShadow = '';
      delete el.dataset._hl;
    }
  }, selector);
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page    = await context.newPage();

  // ── LOGIN ────────────────────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/web#action=login`);
  await page.goto(`${BASE_URL}`);

  // wait for login form
  await page.waitForSelector('input[name="login"]', { timeout: 15000 });
  await page.fill('input[name="login"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/odoo/, { timeout: 20000 });
  console.log('LOGIN OK');

  // ── NAVIGATE TO SURVEYS ──────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/surveys`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2000);

  // ── 1. LIST VIEW ─────────────────────────────────────────────────────────
  await page.screenshot({ path: path.join(ASSETS, 'enc_01_lista.png') });
  console.log('enc_01_lista.png');

  // highlight "Nuevo" / "New" button
  const newBtn = await page.$('button.o_list_button_add') || await page.$('button:has-text("Nuevo")') || await page.$('button:has-text("New")');
  if (newBtn) {
    await newBtn.evaluate(el => {
      el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;';
    });
    await page.screenshot({ path: path.join(ASSETS, 'enc_02_nuevo_highlight.png') });
    await newBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
  }
  console.log('enc_02_nuevo_highlight.png');

  // ── 2. CREATE NEW SURVEY ─────────────────────────────────────────────────
  // click Nuevo
  await page.click('button.o_list_button_add, button:has-text("Nuevo"), button:has-text("New")');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: path.join(ASSETS, 'enc_03_formulario_encuesta.png') });
  console.log('enc_03_formulario_encuesta.png');

  // highlight title field
  const titleField = await page.$('input[id*="title"], input[name="title"], .o_field_widget[name="title"] input');
  if (titleField) {
    await titleField.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
    await page.screenshot({ path: path.join(ASSETS, 'enc_04_titulo_highlight.png') });
    await titleField.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
  }
  console.log('enc_04_titulo_highlight.png');

  // fill title
  if (titleField) {
    await titleField.fill('Encuesta de satisfacción');
    await page.waitForTimeout(500);
  }

  // ── 3. ADD A QUESTION ────────────────────────────────────────────────────
  // look for "Agregar una pregunta" / "Add a question"
  const addQ = await page.$('a:has-text("Agregar una pregunta")') || await page.$('button:has-text("Agregar una pregunta")') || await page.$('a:has-text("Add a question")');
  if (addQ) {
    await addQ.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
    await page.screenshot({ path: path.join(ASSETS, 'enc_05_agregar_pregunta_highlight.png') });
    await addQ.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
    console.log('enc_05_agregar_pregunta_highlight.png');
    await addQ.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(ASSETS, 'enc_06_dialogo_pregunta.png') });
    console.log('enc_06_dialogo_pregunta.png');

    // highlight question name field in dialog
    const qName = await page.$('.modal input[name="value"], .modal input[id*="question"]') || await page.$('.modal .o_field_char input');
    if (qName) {
      await qName.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'enc_07_campo_pregunta_highlight.png') });
      await qName.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
    }
    console.log('enc_07_campo_pregunta_highlight.png');

    // close dialog without saving
    const closeBtn = await page.$('.modal button.btn-close, .modal button:has-text("Cerrar"), .modal button:has-text("Descartar")');
    if (closeBtn) { await closeBtn.click(); await page.waitForTimeout(1000); }
  }

  // ── 4. OPTIONS / TABS ────────────────────────────────────────────────────
  // Click "Opciones" tab if exists
  const optTab = await page.$('a:has-text("Opciones"), a[role="tab"]:has-text("Opciones"), a:has-text("Options")');
  if (optTab) {
    await optTab.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
    await page.screenshot({ path: path.join(ASSETS, 'enc_08_tab_opciones_highlight.png') });
    await optTab.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
    await optTab.click();
    await page.waitForTimeout(1500);
    await page.screenshot({ path: path.join(ASSETS, 'enc_09_opciones_panel.png') });
    console.log('enc_08_tab_opciones_highlight.png');
    console.log('enc_09_opciones_panel.png');
  }

  // ── 5. GO BACK TO LIST AND OPEN EXISTING ─────────────────────────────────
  await page.goto(`${BASE_URL}/surveys`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(2000);

  // open first survey if any
  const firstRow = await page.$('.o_data_row td.o_data_cell');
  if (firstRow) {
    await firstRow.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(ASSETS, 'enc_10_encuesta_existente.png') });
    console.log('enc_10_encuesta_existente.png');

    // highlight "Iniciar encuesta" / "Start Survey"
    const startBtn = await page.$('button:has-text("Iniciar"), button:has-text("Compartir"), a:has-text("Iniciar la encuesta")');
    if (startBtn) {
      await startBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'enc_11_iniciar_highlight.png') });
      await startBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      console.log('enc_11_iniciar_highlight.png');
    }

    // highlight "Ver resultados" / "See Results"
    const resultsBtn = await page.$('button:has-text("Ver resultados"), a:has-text("Ver resultados"), button:has-text("See Results")');
    if (resultsBtn) {
      await resultsBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'enc_12_ver_resultados_highlight.png') });
      await resultsBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      console.log('enc_12_ver_resultados_highlight.png');
      // click to see results
      await resultsBtn.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(ASSETS, 'enc_13_pantalla_resultados.png') });
      console.log('enc_13_pantalla_resultados.png');
    }
  }

  // ── DONE ─────────────────────────────────────────────────────────────────
  console.log('=== CAPTURAS LISTAS ===');
  await browser.close();
})();
