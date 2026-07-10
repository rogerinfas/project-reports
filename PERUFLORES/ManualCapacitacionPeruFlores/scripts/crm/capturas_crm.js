const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets'); // scripts/crm -> assets

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
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

  // ── 1. KANBAN VIEW ───────────────────────────────────────────────────────
  await page.screenshot({ path: path.join(ASSETS, 'crm_01_kanban.png') });
  console.log('crm_01_kanban.png');

  // Highlight "Nuevo" button
  const newBtn = await page.$('button.o-kanban-button-new, button.o_list_button_add, button:has-text("Nuevo"), button:has-text("New")');
  if (newBtn) {
    await newBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
    await page.screenshot({ path: path.join(ASSETS, 'crm_02_nuevo_highlight.png') });
    await newBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
    console.log('crm_02_nuevo_highlight.png');

    // Click Nuevo to show Quick Create
    await newBtn.click();
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(ASSETS, 'crm_03_quick_create.png') });
    console.log('crm_03_quick_create.png');

    // Click "Editar" in quick create to go to full form
    const editBtn = await page.$('.o_kanban_quick_create button:has-text("Editar"), button:has-text("Edit")') || await page.$('.o_kanban_edit');
    if (editBtn) {
        await editBtn.click();
    } else {
        // if no edit button, just create it and open it or navigate to a new form manually
        const formBtn = await page.$('button.o_form_button_create');
        if(formBtn) await formBtn.click();
    }
    await page.waitForTimeout(4000);
  }

  // ── 2. FULL FORM VIEW ────────────────────────────────────────────────────
  await page.screenshot({ path: path.join(ASSETS, 'crm_04_form_completo.png') });
  console.log('crm_04_form_completo.png');

  // Highlight Stages bar
  const statusBar = await page.$('.o_statusbar_status');
  if (statusBar) {
    await statusBar.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
    await page.screenshot({ path: path.join(ASSETS, 'crm_05_etapas_highlight.png') });
    await statusBar.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
    console.log('crm_05_etapas_highlight.png');
  }

  // Highlight Won/Lost buttons
  const statusButtons = await page.$('.o_statusbar_buttons');
  if (statusButtons) {
      await statusButtons.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'crm_06_ganado_perdido_highlight.png') });
      await statusButtons.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      console.log('crm_06_ganado_perdido_highlight.png');
  }

  // Highlight "Nueva cotización"
  const newQuoteBtn = await page.$('button:has-text("Nueva cotización"), button:has-text("New Quotation")');
  if (newQuoteBtn) {
      await newQuoteBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'crm_07_nueva_cotizacion_highlight.png') });
      await newQuoteBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      console.log('crm_07_nueva_cotizacion_highlight.png');
  }

  // Highlight client field
  const partnerField = await page.$('.o_field_widget[name="partner_id"]');
  if (partnerField) {
      await partnerField.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'crm_08_cliente_highlight.png') });
      await partnerField.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      console.log('crm_08_cliente_highlight.png');
  }

  // Highlight Expected Revenue (Ingreso esperado)
  const revenueField = await page.$('.o_field_widget[name="expected_revenue"]');
  if (revenueField) {
      await revenueField.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'crm_09_ingreso_esperado_highlight.png') });
      await revenueField.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      console.log('crm_09_ingreso_esperado_highlight.png');
  }


  console.log('=== CAPTURAS CRM LISTAS ===');
  await browser.close();
})();
