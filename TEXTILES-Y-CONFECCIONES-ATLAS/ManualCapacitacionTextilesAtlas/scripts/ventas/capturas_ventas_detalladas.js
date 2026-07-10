const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page    = await context.newPage();

  console.log('--- EMPEZANDO SCRIPT DETALLADO DE VENTAS ---');

  // ── LOGIN ────────────────────────────────────────────────────────────────
  await page.goto(`${BASE_URL}`);
  await page.waitForSelector('input[name="login"]', { timeout: 15000 });
  await page.fill('input[name="login"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/odoo/, { timeout: 20000 });
  console.log('LOGIN OK');

  // ── NAVIGATE TO VENTAS ───────────────────────────────────────────────────
  await page.goto(`${BASE_URL}/sale`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(4000);

  // ── 1. CREACION ──────────────────────────────────────────────────────────
  const newBtn = await page.$('button.o_list_button_add, button:has-text("Nuevo"), button:has-text("New")');
  if (newBtn) {
    await newBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
    await page.screenshot({ path: path.join(ASSETS, 'ven_10_nuevo_highlight.png') });
    await newBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
    console.log('ven_10_nuevo_highlight.png');
    
    await newBtn.click();
    await page.waitForTimeout(4000);
  }

  await page.screenshot({ path: path.join(ASSETS, 'ven_11_form_vacio.png') });
  console.log('ven_11_form_vacio.png');

  // Set Customer
  const partnerField = await page.$('.o_field_widget[name="partner_id"] input');
  if (partnerField) {
      await partnerField.click();
      await page.waitForTimeout(500);
      await page.keyboard.type('Agencia');
      await page.waitForTimeout(1000);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(ASSETS, 'ven_12_cliente_seleccionado.png') });
      console.log('ven_12_cliente_seleccionado.png');
  }

  // Add Product Line
  const addProductLnk = await page.$('a:has-text("Agregar un producto"), a:has-text("Add a product")');
  if (addProductLnk) {
      await addProductLnk.click();
      await page.waitForTimeout(1000);
      const productField = await page.$('div[name="product_template_id"] input, div[name="product_id"] input');
      if (productField) {
         await productField.click();
         await page.waitForTimeout(500);
         await page.keyboard.type('Tour');
         await page.waitForTimeout(1500);
         await page.keyboard.press('Enter');
         await page.waitForTimeout(3000);
         
         // Highlight the line
         const lineRow = await page.$('.o_list_table tbody tr.o_data_row');
         if(lineRow) {
             await lineRow.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
             await page.screenshot({ path: path.join(ASSETS, 'ven_13_linea_producto.png') });
             await lineRow.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
             console.log('ven_13_linea_producto.png');
         }
         
         // Highlight Totals
         const totalsBox = await page.$('table.oe_right');
         if (totalsBox) {
             await totalsBox.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
             await page.screenshot({ path: path.join(ASSETS, 'ven_14_total_cotizacion.png') });
             await totalsBox.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
             console.log('ven_14_total_cotizacion.png');
         }
      }
  }

  // ── 2. VISTA PREVIA (PORTAL) ─────────────────────────────────────────────
  const previewBtn = await page.$('button[name="preview_sale_order"]');
  if (previewBtn) {
      await previewBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_15_boton_vista_previa.png') });
      await previewBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      console.log('ven_15_boton_vista_previa.png');

      await previewBtn.click();
      await page.waitForTimeout(6000); // Wait for portal load
      await page.screenshot({ path: path.join(ASSETS, 'ven_16_portal_cliente.png'), fullPage: true });
      console.log('ven_16_portal_cliente.png');

      // Go back to backend
      const backBtn = await page.$('a:has-text("Volver a editar"), a:has-text("Back to edit mode")');
      if (backBtn) {
          await backBtn.click();
          await page.waitForTimeout(4000);
      } else {
          await page.goBack();
          await page.waitForTimeout(4000);
      }
  }

  // ── 3. ENVIO POR CORREO ──────────────────────────────────────────────────
  const sendEmailBtn = await page.$('button[name="action_quotation_send"]');
  if (sendEmailBtn) {
      await sendEmailBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_17_boton_enviar_correo.png') });
      await sendEmailBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      console.log('ven_17_boton_enviar_correo.png');

      await sendEmailBtn.click();
      await page.waitForTimeout(3000); // Wait for modal
      
      const emailModal = await page.$('.modal-dialog');
      if (emailModal) {
          await emailModal.screenshot({ path: path.join(ASSETS, 'ven_18_modal_correo.png') });
          console.log('ven_18_modal_correo.png');
          
          const sendBtnModal = await emailModal.$('button[name="action_send_mail"]');
          if (sendBtnModal) await sendBtnModal.click();
          await page.waitForTimeout(4000); // Wait to finish sending
      }
  }

  // ── 4. CONFIRMACION DE VENTA ─────────────────────────────────────────────
  const confirmBtn = await page.$('button[name="action_confirm"]');
  if (confirmBtn) {
      await confirmBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_19_boton_confirmar.png') });
      await confirmBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      console.log('ven_19_boton_confirmar.png');

      await confirmBtn.click();
      await page.waitForTimeout(4000);
      
      const statusBar = await page.$('.o_statusbar_status');
      if (statusBar) {
          await statusBar.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'ven_20_estado_pedido.png') });
          await statusBar.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
          console.log('ven_20_estado_pedido.png');
      }
  }

  // ── 5. FACTURACION / COBRO ───────────────────────────────────────────────
  const createInvoiceBtn = await page.$('button[name="%(sale.action_view_sale_advance_payment_inv)d"]');
  if (createInvoiceBtn) {
      await createInvoiceBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_21_boton_crear_factura.png') });
      await createInvoiceBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      console.log('ven_21_boton_crear_factura.png');

      await createInvoiceBtn.click();
      await page.waitForTimeout(2000);
      
      const invModal = await page.$('.modal-dialog');
      if (invModal) {
          await invModal.screenshot({ path: path.join(ASSETS, 'ven_22_modal_facturacion.png') });
          console.log('ven_22_modal_facturacion.png');
      }
  }

  console.log('=== CAPTURAS DETALLADAS DE VENTAS LISTAS ===');
  await browser.close();
})();
