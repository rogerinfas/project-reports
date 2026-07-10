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
  
  await page.waitForSelector('.o_app[data-menu-xmlid="sale.sale_menu_root"]', { timeout: 20000 });
  await page.click('.o_app[data-menu-xmlid="sale.sale_menu_root"]');
  await page.waitForTimeout(5000); 

  // 1. LIST VIEW
  await page.screenshot({ path: path.join(ASSETS, 'ven_f1_lista.png') });
  console.log('1. ven_f1_lista.png');

  // CLICK NUEVO
  const newBtn = await page.$('button.o_list_button_add, button:has-text("Nuevo"), button:has-text("New")');
  if (newBtn) await newBtn.click();
  await page.waitForTimeout(5000);

  // 2. EMPTY FORM
  await page.screenshot({ path: path.join(ASSETS, 'ven_f2_form.png') });
  console.log('2. ven_f2_form.png');

  // SET CLIENT
  const clientInput = await page.$('div[name="partner_id"] input');
  if (clientInput) {
      await clientInput.click();
      await page.waitForTimeout(500);
      await page.keyboard.type('Agencia');
      await page.waitForTimeout(1500);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      await page.mouse.click(10, 10); // click away
      
      // 3. WITH CLIENT
      await page.screenshot({ path: path.join(ASSETS, 'ven_f3_cliente.png') });
      console.log('3. ven_f3_cliente.png');
  }

  // ADD PRODUCT (Try multiple selectors)
  const addProd = await page.$('a:has-text("Agregar producto"), a:has-text("Add a product"), a:has-text("Agregar un producto")');
  if (addProd) {
      await addProd.click();
      await page.waitForTimeout(1500);
      await page.keyboard.type('Tour');
      await page.waitForTimeout(1500);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(3000);
      await page.mouse.click(10, 10);
      
      // 4. WITH PRODUCT
      await page.screenshot({ path: path.join(ASSETS, 'ven_f4_producto.png') });
      console.log('4. ven_f4_producto.png');
  }

  // 5. TOTALS
  const totals = await page.$('table.oe_right, div[name="tax_totals"]');
  if (totals) {
      await totals.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_f5_totales.png') });
      await totals.evaluate(el => el.style.border='');
      console.log('5. ven_f5_totales.png');
  }

  // 6. SEND EMAIL
  const sendEmailBtn = await page.$('button[name="action_quotation_send"]');
  if (sendEmailBtn) {
      await sendEmailBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_f6_btn_correo.png') });
      await sendEmailBtn.evaluate(el => el.style.border='');
      console.log('6. ven_f6_btn_correo.png');

      await sendEmailBtn.click();
      await page.waitForTimeout(5000); // Wait for modal
      
      const modal = await page.$('.modal-dialog, .modal-content');
      if (modal) {
          // 7. MODAL EMAIL
          await page.screenshot({ path: path.join(ASSETS, 'ven_f7_modal_correo.png') });
          console.log('7. ven_f7_modal_correo.png');
          
          const sendModalBtn = await page.$('.modal-footer button[name="action_send_mail"], .modal-footer button:has-text("Enviar")');
          if (sendModalBtn) {
              await sendModalBtn.click();
              await page.waitForTimeout(6000);
          } else {
             // Fallback: close modal
             const closeBtn = await page.$('button:has-text("Cancelar"), button.btn-close');
             if(closeBtn) await closeBtn.click();
             await page.waitForTimeout(2000);
          }
      }
  }

  // 8. SENT STATUS
  const statusBar = await page.$('.o_statusbar_status');
  if (statusBar) {
      await statusBar.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_f8_estado_enviado.png') });
      await statusBar.evaluate(el => el.style.border='');
      console.log('8. ven_f8_estado_enviado.png');
  }

  // 9. CONFIRM
  const confirmBtn = await page.$('button[name="action_confirm"]');
  if (confirmBtn) {
      await confirmBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_f9_btn_confirmar.png') });
      await confirmBtn.evaluate(el => el.style.border='');
      console.log('9. ven_f9_btn_confirmar.png');

      await confirmBtn.click();
      await page.waitForTimeout(5000);
  }

  // 10. INVOICE MODAL
  const createInvBtn = await page.$('button[name="%(sale.action_view_sale_advance_payment_inv)d"], button:has-text("Crear factura")');
  if (createInvBtn) {
      await createInvBtn.click();
      await page.waitForTimeout(4000);
      
      const invModal = await page.$('.modal-dialog, .modal-content');
      if (invModal) {
          await page.screenshot({ path: path.join(ASSETS, 'ven_f10_modal_factura.png') });
          console.log('10. ven_f10_modal_factura.png');
      }
  }

  await browser.close();
  console.log('--- FIN DE SCRIPT ---');
})();
