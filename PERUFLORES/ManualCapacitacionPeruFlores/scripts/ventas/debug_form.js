const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();
  
  await page.goto(`${BASE_URL}`);
  await page.waitForSelector('input[name="login"]', { timeout: 15000 });
  await page.fill('input[name="login"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/odoo/, { timeout: 20000 });
  
  // Go to Ventas directly via URL to avoid clicking wrong icon
  console.log('Navigating directly to Sales...');
  await page.goto('https://peruflorestours.odoo.com/odoo/action-sale.action_quotations_with_onboarding');
  await page.waitForTimeout(10000); // wait for list to load

  console.log('Clicking first record...');
  const firstRecord = await page.$('.o_data_row');
  if (firstRecord) {
      await firstRecord.click();
      await page.waitForTimeout(10000); // wait for form view to load

      console.log('DOM de Ventas Formulario guardado');
      const domForm = await page.content();
      fs.writeFileSync('dom_ventas_form.html', domForm);

      // Now let's just take screenshots by their exact class names since we are in the form!
      
      // Enviar por correo
      const enviarBtn = await page.$('button[name="action_quotation_send"]');
      if(enviarBtn) {
          await enviarBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'ven_flujo_1_enviar.png') });
          await enviarBtn.evaluate(el => el.style.border='');
          console.log('ven_flujo_1_enviar.png');
          
          await enviarBtn.click();
          await page.waitForTimeout(8000);
          
          await page.screenshot({ path: path.join(ASSETS, 'ven_flujo_2_modal_correo.png') });
          console.log('ven_flujo_2_modal_correo.png');
          
          // Close modal
          const closeBtn = await page.$('button[name="action_cancel"], button.btn-close, button:has-text("Cancelar")');
          if(closeBtn) await closeBtn.click();
          await page.waitForTimeout(3000);
      }

      // Imprimir
      const actionBtn = await page.$('.o_cp_action_menus button, button:has-text("Acción")');
      if (actionBtn) {
          await actionBtn.click();
          await page.waitForTimeout(2000);
          await page.screenshot({ path: path.join(ASSETS, 'ven_flujo_3_imprimir.png') });
          console.log('ven_flujo_3_imprimir.png');
          await page.mouse.click(10,10);
      }

      // Confirmar
      const confirmarBtn = await page.$('button[name="action_confirm"]');
      if (confirmarBtn) {
          await confirmarBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'ven_flujo_4_confirmar.png') });
          await confirmarBtn.evaluate(el => el.style.border='');
          console.log('ven_flujo_4_confirmar.png');
      }
      
      // Vista Previa
      const vistaBtn = await page.$('button[name="preview_sale_order"]');
      if (vistaBtn) {
          await vistaBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'ven_flujo_5_vistaprevia.png') });
          await vistaBtn.evaluate(el => el.style.border='');
          console.log('ven_flujo_5_vistaprevia.png');
      }
  }

  await browser.close();
})();
