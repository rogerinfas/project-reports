const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets');

if (!fs.existsSync(ASSETS)) {
    fs.mkdirSync(ASSETS, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 600 });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();

  console.log('Iniciando login...');
  await page.goto(BASE_URL);
  try {
      await page.waitForSelector('input[name="login"]', { timeout: 10000 });
      await page.fill('input[name="login"]', EMAIL);
      await page.fill('input[name="password"]', PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/odoo/, { timeout: 20000 });
  } catch (e) {
      console.log('Quizá ya estaba logueado');
  }
  
  await page.waitForTimeout(5000); 

  // Go to Products in Sales app (or Inventory). Sales -> Products is standard.
  console.log('Navegando a Productos...');
  await page.goto('https://peruflorestours.odoo.com/odoo/action-sale.product_template_action');
  await page.waitForTimeout(8000);
  
  // 1. Capturar vista lista/kanban
  await page.screenshot({ path: path.join(ASSETS, 'prod_01_lista.png') });
  console.log('prod_01_lista.png guardado');
  
  // 2. Click "Nuevo"
  const btnNuevo = await page.$('button.o_list_button_add, button.o-kanban-button-new, button:has-text("Nuevo"), button:has-text("New")');
  if (btnNuevo) {
      await btnNuevo.click();
      await page.waitForTimeout(5000);
      
      // Resaltar tipo de producto
      const tipoProd = await page.$('div[name="detailed_type"]');
      if (tipoProd) await tipoProd.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      
      await page.screenshot({ path: path.join(ASSETS, 'prod_02_nuevo_servicio.png') });
      console.log('prod_02_nuevo_servicio.png guardado');
      if (tipoProd) await tipoProd.evaluate(el => el.style.border='');
  } else {
      console.log('No se encontro el boton Nuevo');
  }

  // Go back to list and open a real product
  await page.goto('https://peruflorestours.odoo.com/odoo/action-sale.product_template_action');
  await page.waitForTimeout(5000);
  
  const firstProd = await page.$('.o_kanban_record, .o_data_row');
  if (firstProd) {
      await firstProd.click();
      await page.waitForTimeout(5000);
      
      await page.screenshot({ path: path.join(ASSETS, 'prod_03_formulario.png') });
      console.log('prod_03_formulario.png guardado');
      
      // Click Pestana Ventas
      const tabVentas = await page.$('a[role="tab"]:has-text("Ventas"), a[role="tab"]:has-text("Sales")');
      if (tabVentas) {
          await tabVentas.click();
          await page.waitForTimeout(2000);
          await page.screenshot({ path: path.join(ASSETS, 'prod_04_pestana_ventas.png') });
          console.log('prod_04_pestana_ventas.png guardado');
      }
      
      // Click Pestana Comercio Electronico
      const tabEcommerce = await page.$('a[role="tab"]:has-text("Comercio electrónico"), a[role="tab"]:has-text("eCommerce")');
      if (tabEcommerce) {
          await tabEcommerce.click();
          await page.waitForTimeout(2000);
          await page.screenshot({ path: path.join(ASSETS, 'prod_05_pestana_ecommerce.png') });
          console.log('prod_05_pestana_ecommerce.png guardado');
      }
  }

  await browser.close();
  console.log('Script de Productos Finalizado');
})();
