const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets'); // from scripts/contactos to assets

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
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

  // ── NAVIGATE TO CONTACTS ─────────────────────────────────────────────────
  // Go to Contacts app. Odoo 17/18 URL is often /odoo/contacts
  await page.goto(`${BASE_URL}/contacts`, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(4000);

  // ── 1. LIST VIEW ─────────────────────────────────────────────────────────
  await page.screenshot({ path: path.join(ASSETS, 'con_01_lista.png') });
  console.log('con_01_lista.png');

  // highlight "Nuevo" button
  const newBtn = await page.$('button.o_list_button_add, button:has-text("Nuevo"), button:has-text("New")');
  if (newBtn) {
    await newBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
    await page.screenshot({ path: path.join(ASSETS, 'con_02_nuevo_highlight.png') });
    await newBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
  }
  console.log('con_02_nuevo_highlight.png');

  // highlight Search bar
  const searchBar = await page.$('.o_searchview');
  if (searchBar) {
    await searchBar.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
    await page.screenshot({ path: path.join(ASSETS, 'con_03_busqueda_highlight.png') });
    await searchBar.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
  }
  console.log('con_03_busqueda_highlight.png');

  // ── 2. CREATE NEW CONTACT ────────────────────────────────────────────────
  // click Nuevo
  if (newBtn) {
    await newBtn.click();
    await page.waitForTimeout(3000);
    await page.screenshot({ path: path.join(ASSETS, 'con_04_formulario.png') });
    console.log('con_04_formulario.png');

    // highlight Name field
    const nameField = await page.$('input[id*="name"], input[placeholder="e.g. Lumber Inc"], input[placeholder*="Nombre"]');
    if (nameField) {
      await nameField.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'con_05_nombre_highlight.png') });
      await nameField.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
    }
    console.log('con_05_nombre_highlight.png');

    // fill form slightly to show save button (Odoo 17 auto-saves, but let's see)
    if (nameField) {
      await nameField.fill('Juan Perez (Ejemplo)');
      await page.waitForTimeout(1000);
    }
  }

  // ── 3. ATTACHMENTS (CHATTER) ──────────────────────────────────────────────
  // highlight paperclip icon in chatter
  const paperclip = await page.$('button[aria-label="Adjuntar archivo"], button[title="Adjuntar archivo"], button i.fa-paperclip');
  if (paperclip) {
    // try to get the button if the selector matched the icon
    const attachBtn = await paperclip.evaluateHandle(el => el.tagName === 'I' ? el.closest('button') : el);
    await attachBtn.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
    await page.screenshot({ path: path.join(ASSETS, 'con_06_adjuntar_highlight.png') });
    await attachBtn.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
  } else {
      // try to click on chatter top area if paperclip is hidden behind a button
      const chatterTop = await page.$('.o_ChatterTopbar_actions');
      if(chatterTop) {
          await chatterTop.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'con_06_adjuntar_highlight.png') });
          await chatterTop.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
      }
  }
  console.log('con_06_adjuntar_highlight.png');

  // highlight stat buttons (cotizaciones, ventas, etc)
  const statButtons = await page.$('.oe_button_box');
  if (statButtons) {
      await statButtons.evaluate(el => el.style.cssText += 'border:4px solid red!important;box-shadow:0 0 15px red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'con_07_stat_buttons_highlight.png') });
      await statButtons.evaluate(el => { el.style.border=''; el.style.boxShadow=''; });
  }
  console.log('con_07_stat_buttons_highlight.png');


  console.log('=== CAPTURAS CONTACTOS LISTAS ===');
  await browser.close();
})();
