const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets');

if (!fs.existsSync(ASSETS)) {
    fs.mkdirSync(ASSETS, { recursive: true });
}

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 600 });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await context.newPage();

  console.log('Iniciando login...');
  await page.goto(BASE_URL);
  try {
      await page.waitForSelector('input[name="login"]', { timeout: 10000 });
      await page.fill('input[name="login"]', EMAIL);
      await page.fill('input[name="password"]', PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/odoo/, { timeout: 20000 });
  } catch (e) {
      console.log('Quizá ya estaba logueado o hubo un error:', e.message);
  }
  
  await page.waitForTimeout(5000); // Esperar a que cargue el dashboard de iconos

  // Buscar el ícono de calendario
  console.log('Navegando a Calendario...');
  const calIcon = await page.$('a:has-text("Calendario"), a:has-text("Calendar")');
  if (calIcon) {
      await calIcon.click();
  } else {
      console.log('No se encontró el ícono por texto, intentando por imagen o app-id');
      await page.goto('https://peruflorestours.odoo.com/odoo/calendar'); 
  }

  await page.waitForTimeout(8000);
  
  // Capturar vista general
  console.log('Capturando vista principal del calendario...');
  await page.screenshot({ path: path.join(ASSETS, 'cal_01_vista_mensual.png') });
  
  // Clickear en el medio del calendario para crear un evento rápido
  console.log('Creando evento rápido...');
  // Odoo 17 calendar grid usually has classes like .fc-timegrid-slot or .fc-daygrid-day
  const daySlot = await page.$('.fc-daygrid-day-frame, .fc-timegrid-slot');
  if (daySlot) {
      await daySlot.click();
      await page.waitForTimeout(3000);
      await page.screenshot({ path: path.join(ASSETS, 'cal_02_crear_cita.png') });
      
      // Click 'Más opciones' / 'More options' or 'Editar'
      const masOpciones = await page.$('button:has-text("Más opciones"), button:has-text("Edit"), button:has-text("Editar")');
      if (masOpciones) {
          await masOpciones.click();
          await page.waitForTimeout(4000);
          console.log('Capturando formulario completo...');
          await page.screenshot({ path: path.join(ASSETS, 'cal_03_formulario_completo.png') });
      } else {
          console.log('No se encontró el botón de Más Opciones');
      }
  } else {
      console.log('No se pudo encontrar un cuadro de día para hacer click.');
  }

  await browser.close();
  console.log('Script de Calendario Finalizado');
})();
