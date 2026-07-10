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

  await page.goto(BASE_URL);
  try {
      await page.waitForSelector('input[name="login"]', { timeout: 10000 });
      await page.fill('input[name="login"]', EMAIL);
      await page.fill('input[name="password"]', PASSWORD);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/odoo/, { timeout: 20000 });
  } catch (e) {}
  
  await page.waitForTimeout(5000);
  await page.goto('https://peruflorestours.odoo.com/odoo/calendar'); 
  await page.waitForTimeout(8000);
  
  // Clickear en el medio del calendario para crear un evento rápido
  const daySlot = await page.$('.fc-daygrid-day-frame, .fc-timegrid-slot');
  if (daySlot) {
      // 1. Create event
      await daySlot.click();
      await page.waitForTimeout(2000);
      await page.fill('input[id^="name_"]', 'Reunión de prueba CRUD');
      await page.click('button:has-text("Crear"), button:has-text("Create")');
      await page.waitForTimeout(3000);
      
      // 2. Click the created event to see the popover (Read/Edit/Delete)
      const eventEl = await page.$('.fc-event:has-text("Reunión de prueba CRUD"), .fc-event-main:has-text("Reunión de prueba CRUD")');
      if (eventEl) {
          await eventEl.click();
          await page.waitForTimeout(2000);
          console.log('Capturando popup de evento existente (CRUD)...');
          
          // highlight edit and delete buttons
          const editBtn = await page.$('.o_cw_popover_edit, button:has-text("Editar"), button:has-text("Edit")');
          if (editBtn) await editBtn.evaluate(el => el.style.cssText += 'border:3px solid red!important;');
          
          const deleteBtn = await page.$('.o_cw_popover_delete, button:has-text("Eliminar"), button:has-text("Delete")');
          if (deleteBtn) await deleteBtn.evaluate(el => el.style.cssText += 'border:3px solid red!important;');

          await page.screenshot({ path: path.join(ASSETS, 'cal_04_popover_crud.png') });
          console.log('cal_04_popover_crud.png guardado');
          
          // Delete it to keep calendar clean
          if (deleteBtn) {
              await deleteBtn.click();
              await page.waitForTimeout(1000);
              // confirm delete
              const confirmBtn = await page.$('.modal-footer button.btn-primary');
              if (confirmBtn) await confirmBtn.click();
              await page.waitForTimeout(2000);
          }
      } else {
          console.log('No se encontro el evento creado');
      }
  }

  await browser.close();
})();
