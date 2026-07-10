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

  // ── QUICK CREATE FORM ────────────────────────────────────────────────────
  const newBtn = await page.$('button.o-kanban-button-new, button.o_list_button_add, button:has-text("Nuevo"), button:has-text("New")');
  if (newBtn) {
    await newBtn.click();
    await page.waitForTimeout(2000); // wait for quick create UI to appear

    // Ensure quick create is visible
    const quickCreate = await page.$('.o_kanban_quick_create');
    if (quickCreate) {
        // highlight the whole quick create box
        await quickCreate.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
        await page.screenshot({ path: path.join(ASSETS, 'crm_10_quick_create_box.png') });
        await quickCreate.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
        console.log('crm_10_quick_create_box.png');

        // highlight fields inside quick create
        const titleField = await quickCreate.$('input[placeholder="e.g. Product Pricing"], input[placeholder*="ej."]');
        if (titleField) {
            await titleField.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
            await page.screenshot({ path: path.join(ASSETS, 'crm_11_quick_create_titulo.png') });
            await titleField.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
            console.log('crm_11_quick_create_titulo.png');
        }

        const clientField = await quickCreate.$('.o_field_many2one input');
        if (clientField) {
            await clientField.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
            await page.screenshot({ path: path.join(ASSETS, 'crm_12_quick_create_cliente.png') });
            await clientField.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
            console.log('crm_12_quick_create_cliente.png');
        }
        
        const expectedRevenue = await quickCreate.$('.o_field_monetary input');
        if (expectedRevenue) {
            await expectedRevenue.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
            await page.screenshot({ path: path.join(ASSETS, 'crm_13_quick_create_ingreso.png') });
            await expectedRevenue.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
            console.log('crm_13_quick_create_ingreso.png');
        }

        const addBtn = await quickCreate.$('button:has-text("Añadir"), button:has-text("Add")');
        if (addBtn) {
            await addBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
            await page.screenshot({ path: path.join(ASSETS, 'crm_14_quick_create_add.png') });
            await addBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
            console.log('crm_14_quick_create_add.png');
        }
    }
  }

  console.log('=== CAPTURAS QUICK CREATE LISTAS ===');
  await browser.close();
})();
