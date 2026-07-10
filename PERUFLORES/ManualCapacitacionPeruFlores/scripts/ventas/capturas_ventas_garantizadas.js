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
  await page.screenshot({ path: path.join(ASSETS, 'ven_g1_lista.png') });
  
  // 2. SEARCH BAR HIGHLIGHT
  const searchBar = await page.$('.o_searchview');
  if (searchBar) {
      await searchBar.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_g2_busqueda.png') });
      await searchBar.evaluate(el => el.style.border='');
  }

  // CLICK NUEVO
  const newBtn = await page.$('button.o_list_button_add, button:has-text("Nuevo"), button:has-text("New")');
  if (newBtn) await newBtn.click();
  await page.waitForTimeout(5000);

  // 3. EMPTY FORM
  await page.screenshot({ path: path.join(ASSETS, 'ven_g3_form.png') });

  // 4. ACTION BUTTONS (TOP LEFT)
  const actionBtns = await page.$('.o_statusbar_buttons');
  if (actionBtns) {
      await actionBtns.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_g4_botones_accion.png') });
      await actionBtns.evaluate(el => el.style.border='');
  }

  // 5. STATUS BAR (TOP RIGHT)
  const statusBar = await page.$('.o_statusbar_status');
  if (statusBar) {
      await statusBar.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_g5_estado.png') });
      await statusBar.evaluate(el => el.style.border='');
  }

  // 6. CLIENT FIELD
  const clientInput = await page.$('div[name="partner_id"]');
  if (clientInput) {
      await clientInput.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_g6_cliente.png') });
      await clientInput.evaluate(el => el.style.border='');
  }

  // 7. EXPIRATION & PAYMENT TERMS
  const termsBox = await page.$('div[name="validity_date"]');
  const paymentBox = await page.$('div[name="payment_term_id"]');
  if (termsBox) await termsBox.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
  if (paymentBox) await paymentBox.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
  await page.screenshot({ path: path.join(ASSETS, 'ven_g7_fechas_pago.png') });
  if (termsBox) await termsBox.evaluate(el => el.style.border='');
  if (paymentBox) await paymentBox.evaluate(el => el.style.border='');

  // 8. TABS AREA (Lineas de pedido)
  const tabsArea = await page.$('.o_notebook');
  if (tabsArea) {
      await tabsArea.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_g8_pestanas.png') });
      await tabsArea.evaluate(el => el.style.border='');
  }

  // 9. OTRA INFORMACION TAB
  const otherInfoTab = await page.$('a.nav-link:has-text("Otra información"), a.nav-link:has-text("Other Info")');
  if (otherInfoTab) {
      await otherInfoTab.click();
      await page.waitForTimeout(2000);
      await page.screenshot({ path: path.join(ASSETS, 'ven_g9_otra_info.png') });
  }

  // 10. CHATTER (RIGHT SIDE)
  const chatter = await page.$('.o-mail-Chatter');
  if (chatter) {
      await chatter.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_g10_chatter.png') });
      await chatter.evaluate(el => el.style.border='');
  }

  // 11. PLANIFICAR ACTIVIDAD BUTTON
  const activityBtn = await page.$('button:has-text("Planificar actividad"), button:has-text("Schedule activity")');
  if (activityBtn) {
      await activityBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'ven_g11_actividad.png') });
      await activityBtn.evaluate(el => el.style.border='');
  }

  console.log('--- 11 CAPTURAS GARANTIZADAS LISTAS ---');
  await browser.close();
})();
