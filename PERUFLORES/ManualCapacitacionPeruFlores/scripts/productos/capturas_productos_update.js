const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 600 });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  
  const page = await context.newPage();
  await page.goto(BASE_URL);
  try {
      await page.waitForSelector('input[name="login"]', { timeout: 5000 });
      await page.fill('input[name="login"]', EMAIL);
      await page.fill('input[name="password"]', PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/odoo/, { timeout: 20000 });
  } catch (e) {}
  
  await page.goto('https://peruflorestours.odoo.com/odoo/action-sale.product_template_action');
  await page.waitForTimeout(6000);
  
  const firstProd = await page.$('.o_kanban_record, .o_data_row');
  if (firstProd) {
      await firstProd.click();
      await page.waitForTimeout(5000);
      
      // Capturar Seccion Precios (Update)
      const priceField = await page.$('div[name="list_price"]');
      if (priceField) await priceField.evaluate(el => el.parentElement.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'prod_det_04_precios.png') });
      console.log('prod_det_04_precios.png guardado');
      
      // Capturar Seccion Costos (Update)
      const costField = await page.$('div[name="standard_price"]');
      if (costField) await costField.evaluate(el => el.parentElement.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'prod_det_05_costos.png') });
      console.log('prod_det_05_costos.png guardado');
  }

  await browser.close();
})();
