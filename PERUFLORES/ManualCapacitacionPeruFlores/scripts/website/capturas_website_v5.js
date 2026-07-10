const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 600 });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();
  
  // 1. LOGIN
  await page.goto(BASE_URL);
  try {
      await page.waitForSelector('input[name="login"]', { timeout: 5000 });
      await page.fill('input[name="login"]', EMAIL);
      await page.fill('input[name="password"]', PASSWORD);
      await page.evaluate(() => document.querySelector('button[type="submit"]').click());
      await page.waitForURL(/\/odoo/, { timeout: 20000 });
  } catch (e) {
      console.log('Login skip o error:', e.message);
  }
  
  // 2. IR AL SITIO WEB (Frontend)
  await page.goto('https://peruflorestours.odoo.com/');
  await page.waitForTimeout(6000); 
  
  // 3. CAPTURAR EL BOTON NUEVO
  const menuSiteTop = await page.$('.o_menu_systray');
  if (menuSiteTop) {
      await menuSiteTop.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'web_04_boton_nuevo.png') });
      console.log('web_04_boton_nuevo.png guardado');
      await menuSiteTop.evaluate(el => el.style.border='');
  }

  // 4. ABRIR EL MODAL DE NUEVO
  const btnNuevo = await page.$('a:has-text("Nuevo"), a:has-text("+ Nuevo"), .o_new_content_btn');
  if (btnNuevo) {
      await btnNuevo.evaluate(el => el.click());
      await page.waitForTimeout(4000);
      const modalNuevo = await page.$('.modal-content, .modal-dialog');
      if (modalNuevo) {
          await modalNuevo.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'web_05_modal_nuevo.png') });
          console.log('web_05_modal_nuevo.png guardado');
          const closeBtn = await page.$('.modal-header .btn-close');
          if (closeBtn) await closeBtn.evaluate(el => el.click());
          await page.waitForTimeout(1000);
      }
  }

  // 5. EDITOR DE MENU
  const menuSite = await page.$('a[data-menu="site"], a:has-text("Sitio")');
  if (menuSite) {
      await menuSite.evaluate(el => el.click());
      await page.waitForTimeout(2000);
      const menuEditor = await page.$('a[data-action="edit_menu"], a:has-text("Editor de menú")');
      if (menuEditor) {
          await menuEditor.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'web_06_editor_menu.png') });
          console.log('web_06_editor_menu.png guardado');
      }
      // Click afuera
      await page.mouse.click(10, 10);
      await page.waitForTimeout(1000);
  }

  // 6. ENTRAR A MODO EDICION
  const btnEditar = await page.$('.o_frontend_to_backend_edit_btn, a[title="Editar este contenido"]');
  if (btnEditar) {
      await btnEditar.evaluate(el => el.style.cssText += 'border:4px solid red!important; background-color: rgba(255,0,0,0.2);');
      await page.screenshot({ path: path.join(ASSETS, 'web_01_boton_editar.png') });
      console.log('web_01_boton_editar.png guardado');
      await btnEditar.evaluate(el => el.style.border='');
      
      // FORZAR CLICK VIA DOM
      await btnEditar.evaluate(el => el.click());
      console.log('Click en Editar realizado, esperando carga del constructor...');
      await page.waitForTimeout(15000);
      
      // Panel de bloques
      const panelBuilder = await page.$('#oe_snippets, .o_we_website_top_actions, .o_we_customize_panel');
      if (panelBuilder) {
          await panelBuilder.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'web_02_panel_bloques.png') });
          console.log('web_02_panel_bloques.png guardado');
          await panelBuilder.evaluate(el => el.style.border='');
      } else {
          console.log('No se encontro el panel de bloques');
      }
      
      // Boton guardar
      const btnGuardar = await page.$('button[data-action="save"]');
      if (btnGuardar) {
          await btnGuardar.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'web_03_boton_guardar.png') });
          console.log('web_03_boton_guardar.png guardado');
      } else {
          console.log('No se encontro el boton guardar');
      }
      
      // Salir de edicion 
      const btnDescartar = await page.$('button[data-action="cancel"]');
      if (btnDescartar) await btnDescartar.evaluate(el => el.click());
      await page.waitForTimeout(3000);
      try {
          const confirmDiscard = await page.$('.modal-footer .btn-primary');
          if (confirmDiscard) await confirmDiscard.evaluate(el => el.click());
          await page.waitForTimeout(3000);
      } catch (e) {}
  } else {
      console.log('No se encontro el boton Editar');
  }

  await browser.close();
})();
