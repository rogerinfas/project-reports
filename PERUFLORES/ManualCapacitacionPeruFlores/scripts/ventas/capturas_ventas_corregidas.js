const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 600 });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page    = await context.newPage();

  console.log('--- LOGIN ---');
  await page.goto(`${BASE_URL}`);
  await page.waitForSelector('input[name="login"]', { timeout: 15000 });
  await page.fill('input[name="login"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/odoo/, { timeout: 20000 });
  
  // Wait for the home dashboard to fully load
  await page.waitForSelector('.o_app[data-menu-xmlid="sale.sale_menu_root"]', { timeout: 20000 });
  
  console.log('--- ENTERING VENTAS APP ---');
  // Click the Ventas app icon explicitly
  await page.click('.o_app[data-menu-xmlid="sale.sale_menu_root"]');
  
  // Wait for the list view to load (we should see the 'Nuevo' button or a list table)
  await page.waitForSelector('.o_list_view', { timeout: 20000 });
  await page.waitForTimeout(4000); // extra wait for data to populate
  
  // 1. CAPTURE LIST VIEW
  await page.screenshot({ path: path.join(ASSETS, 'ven_01_lista_cotizaciones_real.png') });
  console.log('ven_01_lista_cotizaciones_real.png guardado');

  // 2. HIGHLIGHT AND CLICK "NUEVO"
  const newBtn = await page.$('button.o_list_button_add, button:has-text("Nuevo"), button:has-text("New")');
  if (newBtn) {
      await newBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_02_nuevo_highlight_real.png') });
      console.log('ven_02_nuevo_highlight_real.png guardado');
      await newBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      
      await newBtn.click();
      
      // Wait for form view to load (partner_id field should appear)
      await page.waitForSelector('div[name="partner_id"]', { timeout: 20000 });
      await page.waitForTimeout(3000);
      
      // 3. CAPTURE FORM VIEW
      await page.screenshot({ path: path.join(ASSETS, 'ven_03_form_cotizacion_real.png') });
      console.log('ven_03_form_cotizacion_real.png guardado');
      
      // Highlight Cliente
      const clientField = await page.$('div[name="partner_id"]');
      if (clientField) {
          await clientField.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'ven_04_cliente_highlight_real.png') });
          await clientField.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      }
      
      // Highlight Add Product
      const addProduct = await page.$('a:has-text("Agregar un producto"), a:has-text("Add a product")');
      if (addProduct) {
          await addProduct.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'ven_05_lineas_pedido_highlight_real.png') });
          await addProduct.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      }
      
      // Highlight Send by email
      const sendEmail = await page.$('button[name="action_quotation_send"]');
      if (sendEmail) {
          await sendEmail.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'ven_06_enviar_correo_highlight_real.png') });
          await sendEmail.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      }
      
      // Highlight Confirm
      const confirmBtn = await page.$('button[name="action_confirm"]');
      if (confirmBtn) {
          await confirmBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'ven_07_confirmar_highlight_real.png') });
          await confirmBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      }
      
      // Highlight Preview
      const previewBtn = await page.$('button[name="preview_sale_order"]');
      if (previewBtn) {
          await previewBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'ven_08_vista_previa_highlight_real.png') });
          await previewBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      }
  } else {
      console.log('No se encontro boton NUEVO');
  }

  await browser.close();
})();
