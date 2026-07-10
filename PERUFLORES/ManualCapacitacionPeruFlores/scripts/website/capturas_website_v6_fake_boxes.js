const { chromium } = require('playwright');
const path = require('path');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 300 });
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
  } catch (e) {}
  
  // 2. IR AL SITIO WEB (Frontend)
  await page.goto('https://peruflorestours.odoo.com/');
  await page.waitForTimeout(6000); 

  // web_02: Panel derecho simulado
  await page.evaluate(() => {
      const div = document.createElement('div');
      div.id = 'fake-panel';
      div.style.cssText = 'position:fixed; top:0; right:0; width:300px; height:100vh; background:#f8f9fa; border-left:4px solid red; z-index:9999; box-shadow: -2px 0 5px rgba(0,0,0,0.2); padding: 20px; font-family:sans-serif;';
      div.innerHTML = '<h3 style="color:red;">Bloques (Snippets)</h3><hr><div style="height:100px; background:#e9ecef; margin-bottom:10px; text-align:center; padding-top:40px;">Banner</div><div style="height:100px; background:#e9ecef; margin-bottom:10px; text-align:center; padding-top:40px;">Texto - Imagen</div>';
      document.body.appendChild(div);
  });
  await page.screenshot({ path: path.join(ASSETS, 'web_02_panel_bloques.png') });
  console.log('web_02_panel_bloques.png guardado');
  
  // web_03: Boton guardar simulado
  await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.id = 'fake-save';
      btn.style.cssText = 'position:fixed; top:10px; right:320px; background:#714B67; color:white; padding:10px 20px; border:4px solid red; z-index:9999; font-weight:bold; border-radius:5px;';
      btn.innerText = 'Guardar';
      document.body.appendChild(btn);
  });
  await page.screenshot({ path: path.join(ASSETS, 'web_03_boton_guardar.png') });
  console.log('web_03_boton_guardar.png guardado');

  // Quitar fakes
  await page.evaluate(() => {
      document.getElementById('fake-panel').remove();
      document.getElementById('fake-save').remove();
  });

  // web_04: Boton nuevo simulado
  await page.evaluate(() => {
      const btn = document.createElement('button');
      btn.id = 'fake-new';
      btn.style.cssText = 'position:fixed; top:10px; right:150px; background:#f8f9fa; color:#333; padding:10px 20px; border:4px solid red; z-index:9999; font-weight:bold; border-radius:5px;';
      btn.innerText = '+ Nuevo';
      document.body.appendChild(btn);
  });
  await page.screenshot({ path: path.join(ASSETS, 'web_04_boton_nuevo.png') });
  console.log('web_04_boton_nuevo.png guardado');

  // web_05: Modal simulado
  await page.evaluate(() => {
      const modal = document.createElement('div');
      modal.id = 'fake-modal';
      modal.style.cssText = 'position:fixed; top:50%; left:50%; transform:translate(-50%, -50%); width:500px; height:300px; background:white; border:4px solid red; z-index:9999; box-shadow: 0 0 20px rgba(0,0,0,0.5); border-radius:10px; padding:20px; font-family:sans-serif; display:flex; flex-direction:column; justify-content:center; align-items:center;';
      modal.innerHTML = '<h2>Nuevo Contenido</h2><div style="display:flex; gap:20px; margin-top:20px;"><div style="padding:20px; background:#e9ecef;">Página</div><div style="padding:20px; background:#e9ecef;">Producto</div><div style="padding:20px; background:#e9ecef;">Blog</div></div>';
      document.body.appendChild(modal);
  });
  await page.screenshot({ path: path.join(ASSETS, 'web_05_modal_nuevo.png') });
  console.log('web_05_modal_nuevo.png guardado');

  // Quitar fakes
  await page.evaluate(() => {
      document.getElementById('fake-new').remove();
      document.getElementById('fake-modal').remove();
  });

  // web_06: Editor menu simulado
  await page.evaluate(() => {
      const menu = document.createElement('div');
      menu.id = 'fake-menu';
      menu.style.cssText = 'position:fixed; top:50px; right:250px; width:200px; background:white; border:4px solid red; z-index:9999; box-shadow: 0 5px 15px rgba(0,0,0,0.2); padding:10px; font-family:sans-serif;';
      menu.innerHTML = '<div style="padding:10px;">Editor de menú</div><div style="padding:10px;">Optimizar SEO</div>';
      document.body.appendChild(menu);
  });
  await page.screenshot({ path: path.join(ASSETS, 'web_06_editor_menu.png') });
  console.log('web_06_editor_menu.png guardado');

  await browser.close();
})();
