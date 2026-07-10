const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 600 });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 }, acceptDownloads: true });
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

  // CLICK NUEVO
  const newBtn = await page.$('button.o_list_button_add, button:has-text("Nuevo"), button:has-text("New")');
  if (newBtn) await newBtn.click();
  await page.waitForTimeout(5000);

  // SET CLIENT
  const clientInput = await page.$('div[name="partner_id"] input');
  if (clientInput) {
      await clientInput.click();
      await page.waitForTimeout(500);
      await page.keyboard.type('Agencia');
      await page.waitForTimeout(1500);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(2000);
      await page.mouse.click(10, 10);
      await page.waitForTimeout(2000);
  }

  console.log('Guardando cotizacion inicial...');
  // Force Save to generate an ID and enable buttons
  const saveBtn = await page.$('.o_form_button_save, i.fa-cloud-upload');
  if (saveBtn) await saveBtn.click();
  await page.waitForTimeout(3000);

  // 1. IMPRIMIR
  console.log('Buscando Imprimir...');
  const actionBtn = await page.$('button:has-text("Acción"), button:has-text("Action"), .o_cp_action_menus button');
  if (actionBtn) {
      await actionBtn.click();
      await page.waitForTimeout(1000);
      await page.screenshot({ path: path.join(ASSETS, 'ven_flujo_1_imprimir_menu.png') });
      console.log('ven_flujo_1_imprimir_menu.png');
      // click away to close
      await page.mouse.click(10, 10);
      await page.waitForTimeout(1000);
  }

  // 2. VISTA PREVIA
  console.log('Buscando Vista Previa...');
  const previewBtn = await page.$('button[name="preview_sale_order"]');
  if (previewBtn) {
      await previewBtn.click();
      await page.waitForTimeout(6000); // Wait for portal
      await page.screenshot({ path: path.join(ASSETS, 'ven_flujo_2_vista_previa.png'), fullPage: true });
      console.log('ven_flujo_2_vista_previa.png');
      
      const backBtn = await page.$('a:has-text("Volver a editar"), a:has-text("Back to edit mode")');
      if (backBtn) await backBtn.click();
      else await page.goBack();
      await page.waitForTimeout(5000);
  }

  // 3. ENVIAR POR CORREO (MODAL)
  console.log('Buscando Enviar por Correo...');
  const sendEmailBtn = await page.$('button[name="action_quotation_send"]');
  if (sendEmailBtn) {
      await sendEmailBtn.click();
      await page.waitForTimeout(5000); // Wait for modal
      
      const modal = await page.$('.modal-dialog, .modal-content');
      if (modal) {
          await page.screenshot({ path: path.join(ASSETS, 'ven_flujo_3_modal_correo.png') });
          console.log('ven_flujo_3_modal_correo.png');
          
          const sendModalBtn = await page.$('.modal-footer button[name="action_send_mail"], .modal-footer button:has-text("Enviar")');
          if (sendModalBtn) await sendModalBtn.click();
          await page.waitForTimeout(5000);
      }
  }

  // 4. ESTADO ENVIADO
  console.log('Capturando estado enviado...');
  await page.screenshot({ path: path.join(ASSETS, 'ven_flujo_4_estado_enviado.png') });
  console.log('ven_flujo_4_estado_enviado.png');

  // 5. CONFIRMAR
  console.log('Buscando Confirmar...');
  const confirmBtn = await page.$('button[name="action_confirm"]');
  if (confirmBtn) {
      await confirmBtn.click();
      await page.waitForTimeout(5000);
      
      await page.screenshot({ path: path.join(ASSETS, 'ven_flujo_5_estado_confirmado.png') });
      console.log('ven_flujo_5_estado_confirmado.png');
  }

  // 6. FACTURAR
  console.log('Buscando Crear Factura...');
  const createInvBtn = await page.$('button[name="%(sale.action_view_sale_advance_payment_inv)d"], button:has-text("Crear factura")');
  if (createInvBtn) {
      await createInvBtn.click();
      await page.waitForTimeout(4000);
      
      const invModal = await page.$('.modal-dialog, .modal-content');
      if (invModal) {
          await page.screenshot({ path: path.join(ASSETS, 'ven_flujo_6_modal_factura.png') });
          console.log('ven_flujo_6_modal_factura.png');
      }
  }

  await browser.close();
  console.log('--- FIN DE SCRIPT FLUJOS ---');
})();
