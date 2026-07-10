const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 700 });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();
  
  // 1. LOGIN
  await page.goto(BASE_URL);
  try {
      await page.waitForSelector('input[name="login"]', { timeout: 5000 });
      await page.fill('input[name="login"]', EMAIL);
      await page.fill('input[name="password"]', PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/odoo/, { timeout: 20000 });
  } catch (e) {
      console.log('Login skip o error:', e.message);
  }
  
  // 2. IR AL SITIO WEB (Frontend)
  await page.goto('https://peruflorestours.odoo.com/');
  await page.waitForTimeout(6000); 
  
  // Screenshot 1: Botón Editar (Editor) resaltado
  const btnEditar = await page.$('.o_frontend_to_backend_edit_btn, a[title="Editar este contenido"]');
  if (btnEditar) {
      await btnEditar.evaluate(el => el.style.cssText += 'border:4px solid red!important; background-color: rgba(255,0,0,0.2);');
      await page.screenshot({ path: path.join(ASSETS, 'web_01_boton_editar.png') });
      console.log('web_01_boton_editar.png guardado');
      await btnEditar.evaluate(el => el.style.border='');
      
      // Entrar a Modo Edición
      await btnEditar.click();
      await page.waitForTimeout(12000); // esperar que cargue el editor web pesado
      
      // Screenshot 2: Panel de Bloques (Builder) resaltado
      // En Odoo 17, el panel es #oe_snippets o .o_we_website_top_actions
      const panelBuilder = await page.$('#oe_snippets');
      if (panelBuilder) {
          await panelBuilder.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'web_02_panel_bloques.png') });
          console.log('web_02_panel_bloques.png guardado');
          await panelBuilder.evaluate(el => el.style.border='');
      }
      
      // Screenshot 3: Botón Guardar resaltado
      const btnGuardar = await page.$('button[data-action="save"]');
      if (btnGuardar) {
          await btnGuardar.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'web_03_boton_guardar.png') });
          console.log('web_03_boton_guardar.png guardado');
      }
      
      // Salir de edicion (descartar o guardar)
      const btnDescartar = await page.$('button[data-action="cancel"]');
      if (btnDescartar) await btnDescartar.click();
      await page.waitForTimeout(3000);
      try {
          const confirmDiscard = await page.$('.modal-footer .btn-primary');
          if (confirmDiscard) await confirmDiscard.click();
          await page.waitForTimeout(4000);
      } catch (e) {}
  }
  
  // 3. NUEVA PAGINA O PRODUCTO
  // En frontend Odoo 17, el menu Nuevo está en la barra superior
  const menuSiteTop = await page.$('.o_menu_systray');
  if (menuSiteTop) {
      // Tomaremos captura genérica de la barra superior donde está + Nuevo
      await menuSiteTop.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'web_04_boton_nuevo.png') });
      console.log('web_04_boton_nuevo.png guardado');
      await menuSiteTop.evaluate(el => el.style.border='');
  }

  // 4. MENU SITIO -> EDITOR DE MENU
  const menuSite = await page.$('a[data-menu="site"]');
  if (menuSite) {
      await menuSite.click();
      await page.waitForTimeout(2000);
      
      const menuEditor = await page.$('a[data-action="edit_menu"]');
      if (menuEditor) {
          await menuEditor.evaluate(el => el.parentElement.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'web_06_editor_menu.png') });
          console.log('web_06_editor_menu.png guardado');
      }
  }

  await browser.close();
})();
