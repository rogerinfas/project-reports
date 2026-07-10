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
      
      // 7. FOTO DEL PRODUCTO
      const imgUpload = await page.$('.o_field_image');
      if (imgUpload) await imgUpload.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'prod_det_07_foto.png') });
      console.log('prod_det_07_foto.png guardado');
      if (imgUpload) await imgUpload.evaluate(el => el.style.border='');
      
      // 8. PESTAÑA VENTAS
      const tabVentas = await page.$('a[role="tab"]:has-text("Ventas"), a[role="tab"]:has-text("Sales")');
      if (tabVentas) {
          await tabVentas.click();
          await page.waitForTimeout(2000);
          const descVentas = await page.$('div[name="description_sale"]');
          if (descVentas) await descVentas.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'prod_det_08_ventas.png') });
          console.log('prod_det_08_ventas.png guardado');
          if (descVentas) await descVentas.evaluate(el => el.style.border='');
      }

      // 9. PESTAÑA ECOMMERCE
      const tabEcommerce = await page.$('a[role="tab"]:has-text("Comercio electrónico"), a[role="tab"]:has-text("eCommerce")');
      if (tabEcommerce) {
          await tabEcommerce.click();
          await page.waitForTimeout(2000);
          const catEcom = await page.$('div[name="public_categ_ids"]');
          if (catEcom) await catEcom.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'prod_det_09_ecommerce.png') });
          console.log('prod_det_09_ecommerce.png guardado');
          if (catEcom) await catEcom.evaluate(el => el.style.border='');
      }
      
      // 10. REF INTERNA / SKU
      const tabGeneral = await page.$('a[role="tab"]:has-text("Información general")');
      if (tabGeneral) await tabGeneral.click();
      await page.waitForTimeout(2000);
      const defaultCode = await page.$('div[name="default_code"]');
      if (defaultCode) await defaultCode.evaluate(el => el.parentElement.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'prod_det_10_sku.png') });
      console.log('prod_det_10_sku.png guardado');
  }

  await browser.close();
})();
