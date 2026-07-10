const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 600 });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  
  async function loginAndGoToFirstRecord() {
      const page = await context.newPage();
      await page.goto(BASE_URL);
      // Wait for login or dashboard
      try {
          await page.waitForSelector('input[name="login"]', { timeout: 5000 });
          await page.fill('input[name="login"]', EMAIL);
          await page.fill('input[name="password"]', PASSWORD);
          await page.click('button[type="submit"]');
          await page.waitForURL(/\/odoo/, { timeout: 20000 });
      } catch(e) {} // already logged in
      
      await page.goto('https://peruflorestours.odoo.com/odoo/action-sale.action_quotations_with_onboarding');
      await page.waitForTimeout(5000);
      
      const firstRecord = await page.$('.o_data_row');
      if (firstRecord) await firstRecord.click();
      await page.waitForTimeout(6000);
      return page;
  }

  // FLUJO 1: VISTA PREVIA
  console.log('Iniciando Vista Previa...');
  let page1 = await loginAndGoToFirstRecord();
  const vistaBtn = await page1.$('button[name="preview_sale_order"]');
  if (vistaBtn) {
      await vistaBtn.click();
      await page1.waitForTimeout(8000); // wait for portal to load
      await page1.screenshot({ path: path.join(ASSETS, 'ven_flujo_3_vistaprevia_portal.png'), fullPage: true });
      console.log('ven_flujo_3_vistaprevia_portal.png guardado');
  }
  await page1.close();

  // FLUJO 2: CONFIRMAR
  console.log('Iniciando Confirmar...');
  let page2 = await loginAndGoToFirstRecord();
  const confirmarBtn = await page2.$('button[name="action_confirm"]');
  if (confirmarBtn) {
      await confirmarBtn.click();
      await page2.waitForTimeout(6000);
      await page2.screenshot({ path: path.join(ASSETS, 'ven_flujo_4_confirmado.png') });
      console.log('ven_flujo_4_confirmado.png guardado');
  }
  await page2.close();

  // FLUJO 3: IMPRIMIR Y CANCELAR
  console.log('Iniciando Imprimir y Cancelar...');
  let page3 = await loginAndGoToFirstRecord();
  
  const cancelarBtn = await page3.$('button[name="action_cancel"]');
  if (cancelarBtn) {
      await cancelarBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page3.screenshot({ path: path.join(ASSETS, 'ven_flujo_5_cancelar.png') });
      await cancelarBtn.evaluate(el => el.style.border='');
      console.log('ven_flujo_5_cancelar.png guardado');
  }

  const printBtn = await page3.$('button:has-text("Imprimir"), button:has-text("Acción")');
  if (printBtn) {
      await printBtn.click();
      await page3.waitForTimeout(2000);
      await page3.screenshot({ path: path.join(ASSETS, 'ven_flujo_6_imprimir_menu.png') });
      console.log('ven_flujo_6_imprimir_menu.png guardado');
  }
  await page3.close();

  await browser.close();
  console.log('--- TODOS LOS FLUJOS COMPLETADOS ---');
})();
