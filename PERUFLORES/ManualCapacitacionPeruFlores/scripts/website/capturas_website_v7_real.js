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
  
  // 2. IR A LA APP SITIO WEB
  const appWeb = await page.$('.o_app[data-menu-xmlid="website.menu_website_configuration"]');
  if (appWeb) {
      await appWeb.click();
      console.log('Clickeando app Sitio Web...');
  } else {
      await page.goto('https://peruflorestours.odoo.com/odoo/website');
  }
  await page.waitForTimeout(10000); // Esperar a que cargue el frontend con la barra negra
  
  // 3. CAPTURAR EL BOTON NUEVO
  const btnNuevo = await page.$('button:has-text("Nuevo"), a:has-text("Nuevo")');
  if (btnNuevo) {
      await btnNuevo.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'web_04_boton_nuevo.png') });
      console.log('web_04_boton_nuevo.png guardado');
      await btnNuevo.evaluate(el => el.style.border='');
      
      // Abrir Modal de Nuevo
      await btnNuevo.click();
      await page.waitForTimeout(3000);
      const modalNuevo = await page.$('.modal, .o_new_content_modal');
      if (modalNuevo) {
          await modalNuevo.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'web_05_modal_nuevo.png') });
          console.log('web_05_modal_nuevo.png guardado');
          // Cerrar modal
          await page.keyboard.press('Escape');
          await page.waitForTimeout(1000);
      }
  }

  // 4. EDITOR DE MENU
  const menuSite = await page.$('a:has-text("Sitio"), button:has-text("Sitio")');
  if (menuSite) {
      await menuSite.click();
      await page.waitForTimeout(2000);
      const menuEditor = await page.$('a:has-text("Editor de menú"), button:has-text("Editor de menú")');
      if (menuEditor) {
          await menuEditor.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'web_06_editor_menu.png') });
          console.log('web_06_editor_menu.png guardado');
      }
      await page.keyboard.press('Escape');
      await page.waitForTimeout(1000);
  }

  // 5. ENTRAR A MODO EDICION (Boton Editar real de la barra negra)
  const btnEditar = await page.$('a[data-action="edit"], button:has-text("Editar"), a:has-text("Editar")');
  if (btnEditar) {
      await btnEditar.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'web_01_boton_editar.png') });
      console.log('web_01_boton_editar.png guardado');
      await btnEditar.evaluate(el => el.style.border='');
      
      // Click en Editar
      await btnEditar.click();
      console.log('Click en Editar (Barra Negra) realizado...');
      await page.waitForTimeout(15000); // Dar 15 segs al constructor web (muy pesado)
      
      // Panel de bloques
      // En Odoo 17, cuando entras al editor, la barra derecha es un panel
      const panelBuilder = await page.$('.o_we_customize_panel, #oe_snippets');
      if (panelBuilder) {
          await panelBuilder.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'web_02_panel_bloques.png') });
          console.log('web_02_panel_bloques.png guardado');
          await panelBuilder.evaluate(el => el.style.border='');
      } else {
          console.log('No se encontro el panel de bloques');
      }
      
      // Boton guardar
      const btnGuardar = await page.$('button[data-action="save"], button:has-text("Guardar")');
      if (btnGuardar) {
          await btnGuardar.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'web_03_boton_guardar.png') });
          console.log('web_03_boton_guardar.png guardado');
      } else {
          console.log('No se encontro el boton guardar');
      }
  } else {
      console.log('No se encontro el boton Editar de la barra negra');
  }

  await browser.close();
})();
