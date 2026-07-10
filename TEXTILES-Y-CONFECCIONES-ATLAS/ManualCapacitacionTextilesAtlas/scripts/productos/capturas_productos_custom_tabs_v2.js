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
      
      // 1. PESTAÑA: Configuración Precios (CRM)
      const tabCRM = await page.$('button[name="tour_pricing_config_page"]');
      if (tabCRM) {
          await tabCRM.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await tabCRM.click();
          await page.waitForTimeout(3000);
          await page.screenshot({ path: path.join(ASSETS, 'prod_det_11_precios_crm.png') });
          console.log('prod_det_11_precios_crm.png guardado');
          await tabCRM.evaluate(el => el.style.border='');
      }

      // 2. PESTAÑA: Datos del Tour
      const tabTour = await page.$('button[name="tour_data_page"]');
      if (tabTour) {
          await tabTour.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await tabTour.click();
          await page.waitForTimeout(3000);
          await page.screenshot({ path: path.join(ASSETS, 'prod_det_12_datos_tour.png') });
          console.log('prod_det_12_datos_tour.png guardado');
          await tabTour.evaluate(el => el.style.border='');
      }

      // 3. PESTAÑA: Contenidos Multi-Idioma
      const tabIdioma = await page.$('button[name="tour_translations_page"]');
      if (tabIdioma) {
          await tabIdioma.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await tabIdioma.click();
          await page.waitForTimeout(3000);
          await page.screenshot({ path: path.join(ASSETS, 'prod_det_13_multi_idioma.png') });
          console.log('prod_det_13_multi_idioma.png guardado');
          await tabIdioma.evaluate(el => el.style.border='');
      }
      
  }

  await browser.close();
})();
