const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 700 });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();
  
  await page.goto(BASE_URL);
  try {
      await page.waitForSelector('input[name="login"]', { timeout: 5000 });
      await page.fill('input[name="login"]', EMAIL);
      await page.fill('input[name="password"]', PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/odoo/, { timeout: 20000 });
  } catch (e) {}
  
  // IR AL SITIO WEB (Frontend)
  await page.goto('https://peruflorestours.odoo.com/');
  await page.waitForTimeout(5000); 
  
  const fs = require('fs');
  fs.writeFileSync('dom_website.html', await page.content());
  
  // Buscar boton Editar por texto
  const btnEditar = await page.$('a:has-text("Editar")');
  if (btnEditar) {
      await btnEditar.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'web_01_boton_editar.png') });
      console.log('web_01_boton_editar.png guardado');
      await btnEditar.evaluate(el => el.style.border='');
      
      await btnEditar.click();
      await page.waitForTimeout(10000); // esperar que cargue el constructor web
      
      const panelBuilder = await page.$('.o_we_website_top_actions, #oe_snippets, .o_we_customize_panel');
      if (panelBuilder) {
          await panelBuilder.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'web_02_panel_bloques.png') });
          console.log('web_02_panel_bloques.png guardado');
          await panelBuilder.evaluate(el => el.style.border='');
      }
      
      const btnGuardar = await page.$('button:has-text("Guardar"), a:has-text("Guardar")');
      if (btnGuardar) {
          await btnGuardar.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'web_03_boton_guardar.png') });
          console.log('web_03_boton_guardar.png guardado');
      }
      
      // Salir de edicion 
      await page.goto('https://peruflorestours.odoo.com/');
      await page.waitForTimeout(3000);
  }
  
  // NUEVA PAGINA
  const btnNuevo = await page.$('a:has-text("Nuevo"), a:has-text("+ Nuevo")');
  if (btnNuevo) {
      await btnNuevo.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page.screenshot({ path: path.join(ASSETS, 'web_04_boton_nuevo.png') });
      console.log('web_04_boton_nuevo.png guardado');
      await btnNuevo.evaluate(el => el.style.border='');
      
      await btnNuevo.click();
      await page.waitForTimeout(2000);
      
      await page.screenshot({ path: path.join(ASSETS, 'web_05_modal_nuevo.png') });
      console.log('web_05_modal_nuevo.png guardado');
  }

  // MENU SITIO
  const menuSite = await page.$('a:has-text("Sitio")');
  if (menuSite) {
      await menuSite.click();
      await page.waitForTimeout(1000);
      
      const menuEditor = await page.$('a:has-text("Editor de menú")');
      if (menuEditor) {
          await menuEditor.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page.screenshot({ path: path.join(ASSETS, 'web_06_editor_menu.png') });
          console.log('web_06_editor_menu.png guardado');
      }
  }

  await browser.close();
})();
