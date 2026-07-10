const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page    = await context.newPage();

  console.log('--- LOGIN ---');
  await page.goto(`${BASE_URL}`);
  await page.waitForSelector('input[name="login"]', { timeout: 15000 });
  await page.fill('input[name="login"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/odoo/, { timeout: 20000 });
  
  await page.waitForSelector('.o_app[data-menu-xmlid="sale.sale_menu_root"]', { timeout: 20000 });
  console.log('--- ENTERING VENTAS APP ---');
  await page.click('.o_app[data-menu-xmlid="sale.sale_menu_root"]');
  
  // Wait for list view
  await page.waitForTimeout(5000); 
  
  // 1. LIST VIEW
  await page.screenshot({ path: path.join(ASSETS, 'ven_s1_lista.png') });
  console.log('1. ven_s1_lista.png guardado');

  // CLICK NUEVO
  const newBtn = await page.$('button.o_list_button_add, button:has-text("Nuevo"), button:has-text("New")');
  if (newBtn) await newBtn.click();
  await page.waitForTimeout(5000); // Wait for form

  // 2. EMPTY FORM
  await page.screenshot({ path: path.join(ASSETS, 'ven_s2_form_vacio.png') });
  console.log('2. ven_s2_form_vacio.png guardado');

  // SET CLIENT
  const clientInput = await page.$('div[name="partner_id"] input');
  if (clientInput) {
      await clientInput.click();
      await page.waitForTimeout(500);
      await page.keyboard.type('Agencia');
      await page.waitForTimeout(1500);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      // Click somewhere else to close dropdown
      await page.mouse.click(10, 10);
      
      // 3. FORM WITH CLIENT
      const clientField = await page.$('div[name="partner_id"]');
      if (clientField) await clientField.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_s3_cliente_listo.png') });
      if (clientField) await clientField.evaluate(el => el.style.border='');
      console.log('3. ven_s3_cliente_listo.png guardado');
  }

  // ADD PRODUCT
  const addProd = await page.$('a:has-text("Agregar un producto"), a:has-text("Add a product")');
  if (addProd) {
      await addProd.click();
      await page.waitForTimeout(1000);
      const prodInput = await page.$('div[name="product_template_id"] input, div[name="product_id"] input');
      if (prodInput) {
          await prodInput.click();
          await page.waitForTimeout(500);
          await page.keyboard.type('Tour');
          await page.waitForTimeout(1500);
          await page.keyboard.press('Enter');
          await page.waitForTimeout(2000);
          
          // 4. FORM WITH PRODUCT
          const row = await page.$('.o_data_row');
          if (row) await row.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'ven_s4_producto_listo.png') });
          if (row) await row.evaluate(el => el.style.border='');
          console.log('4. ven_s4_producto_listo.png guardado');
      }
  }

  // 5. TOTALS HIGHLIGHT
  const totals = await page.$('table.oe_right, .oe_subtotal_footer');
  if (totals) {
      await totals.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_s5_totales.png') });
      await totals.evaluate(el => el.style.border='');
      console.log('5. ven_s5_totales.png guardado');
  }

  // 6. PORTAL PREVIEW
  const previewBtn = await page.$('button[name="preview_sale_order"]');
  if (previewBtn) {
      await previewBtn.click();
      await page.waitForTimeout(6000);
      await page.screenshot({ path: path.join(ASSETS, 'ven_s6_portal_cliente.png'), fullPage: true });
      console.log('6. ven_s6_portal_cliente.png guardado');
      
      const backBtn = await page.$('a:has-text("Volver a editar"), a:has-text("Back to edit mode")');
      if (backBtn) {
          await backBtn.click();
      } else {
          await page.goBack();
      }
      await page.waitForTimeout(5000);
  }

  // 7. SEND EMAIL MODAL
  const sendEmailBtn = await page.$('button[name="action_quotation_send"]');
  if (sendEmailBtn) {
      await sendEmailBtn.click();
      await page.waitForTimeout(4000);
      
      const modal = await page.$('.modal-dialog');
      if (modal) {
          await page.screenshot({ path: path.join(ASSETS, 'ven_s7_modal_correo.png') });
          console.log('7. ven_s7_modal_correo.png guardado');
          
          const sendModalBtn = await page.$('.modal-footer button:has-text("Enviar"), button[name="action_send_mail"]');
          if (sendModalBtn) {
              await sendModalBtn.click();
              await page.waitForTimeout(6000);
          }
      }
  }

  // 8. SENT STATUS
  const statusBar = await page.$('.o_statusbar_status');
  if (statusBar) {
      await statusBar.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_s8_estado_enviado.png') });
      await statusBar.evaluate(el => el.style.border='');
      console.log('8. ven_s8_estado_enviado.png guardado');
  }

  // 9. CONFIRM
  const confirmBtn = await page.$('button[name="action_confirm"]');
  if (confirmBtn) {
      await confirmBtn.click();
      await page.waitForTimeout(4000);
      
      const statusBar2 = await page.$('.o_statusbar_status');
      if (statusBar2) {
          await statusBar2.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'ven_s9_estado_confirmado.png') });
          await statusBar2.evaluate(el => el.style.border='');
          console.log('9. ven_s9_estado_confirmado.png guardado');
      }
  }

  // 10. INVOICE MODAL
  const createInvBtn = await page.$('button[name="%(sale.action_view_sale_advance_payment_inv)d"]');
  if (createInvBtn) {
      await createInvBtn.click();
      await page.waitForTimeout(3000);
      
      const invModal = await page.$('.modal-dialog');
      if (invModal) {
          await page.screenshot({ path: path.join(ASSETS, 'ven_s10_modal_factura.png') });
          console.log('10. ven_s10_modal_factura.png guardado');
      }
  }

  await browser.close();
  console.log('--- FIN DE SCRIPT ---');
})();
