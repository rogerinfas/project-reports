const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 400 });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page    = await context.newPage();

  // ── LOGIN ────────────────────────────────────────────────────────────────
  await page.goto(`${BASE_URL}`);
  await page.waitForSelector('input[name="login"]', { timeout: 15000 });
  await page.fill('input[name="login"]', EMAIL);
  await page.fill('input[name="password"]', PASSWORD);
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/odoo/, { timeout: 20000 });
  console.log('LOGIN OK');

  // ── NAVIGATE TO VENTAS (SALES) ───────────────────────────────────────────
  await page.goto(`${BASE_URL}/sale`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(4000);

  // 1. KANBAN / LIST VIEW
  await page.screenshot({ path: path.join(ASSETS, 'ven_01_lista_cotizaciones.png') });
  console.log('ven_01_lista_cotizaciones.png');

  // Highlight "Nuevo" button
  const newBtn = await page.$('button.o_list_button_add, button:has-text("Nuevo"), button:has-text("New")');
  if (newBtn) {
    await newBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
    await page.screenshot({ path: path.join(ASSETS, 'ven_02_nuevo_highlight.png') });
    await newBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
    console.log('ven_02_nuevo_highlight.png');
    
    // Click "Nuevo" to create a new quotation
    await newBtn.click();
    await page.waitForTimeout(4000);
  }

  // 2. FORM VIEW
  await page.screenshot({ path: path.join(ASSETS, 'ven_03_form_cotizacion.png') });
  console.log('ven_03_form_cotizacion.png');

  // Highlight Client Field
  const partnerField = await page.$('.o_field_widget[name="partner_id"]');
  if (partnerField) {
      await partnerField.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_04_cliente_highlight.png') });
      await partnerField.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      console.log('ven_04_cliente_highlight.png');
      
      // Let's type something to have data
      await partnerField.click();
      await page.waitForTimeout(500);
      await page.keyboard.type('Agencia');
      await page.waitForTimeout(1000);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(1000);
  }

  // Highlight Order Lines ("Agregar un producto" / "Add a product")
  const addProductLnk = await page.$('a:has-text("Agregar un producto"), a:has-text("Add a product")');
  if (addProductLnk) {
      await addProductLnk.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_05_lineas_pedido_highlight.png') });
      await addProductLnk.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      console.log('ven_05_lineas_pedido_highlight.png');

      await addProductLnk.click();
      await page.waitForTimeout(1000);
      const productField = await page.$('div[name="product_template_id"] input, div[name="product_id"] input');
      if (productField) {
         await productField.click();
         await page.waitForTimeout(500);
         await page.keyboard.type('Tour');
         await page.waitForTimeout(1000);
         await page.keyboard.press('Enter');
         await page.waitForTimeout(2000);
      }
  }

  // Highlight action buttons: "Enviar por correo", "Confirmar"
  const sendEmailBtn = await page.$('button[name="action_quotation_send"]');
  if (sendEmailBtn) {
      await sendEmailBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_06_enviar_correo_highlight.png') });
      await sendEmailBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      console.log('ven_06_enviar_correo_highlight.png');
  }

  const confirmBtn = await page.$('button[name="action_confirm"]');
  if (confirmBtn) {
      await confirmBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_07_confirmar_highlight.png') });
      await confirmBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      console.log('ven_07_confirmar_highlight.png');
      
      // Let's click confirm to show the "Create Invoice" button
      await confirmBtn.click();
      await page.waitForTimeout(4000);
  }

  // Highlight Create Invoice ("Crear Factura" / "Create Invoice")
  const createInvoiceBtn = await page.$('button[name="%(sale.action_view_sale_advance_payment_inv)d"]');
  if (createInvoiceBtn) {
      await createInvoiceBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_08_crear_factura_highlight.png') });
      await createInvoiceBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      console.log('ven_08_crear_factura_highlight.png');
  }


  console.log('=== CAPTURAS VENTAS LISTAS ===');
  await browser.close();
})();
