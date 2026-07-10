const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const BASE_URL = 'https://peruflorestours.odoo.com/odoo';
const EMAIL    = 'peruflorestravelagency@gmail.com';
const PASSWORD = 'agen*Flor.25pe';
const ASSETS   = path.join(__dirname, '..', '..', 'assets');

(async () => {
  const browser = await chromium.launch({ headless: false, slowMo: 600 });
  const context = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  
  async function getToProductList() {
      const page = await context.newPage();
      await page.goto(BASE_URL);
      try {
          await page.waitForSelector('input[name="login"]', { timeout: 5000 });
          await page.fill('input[name="login"]', EMAIL);
          await page.fill('input[name="password"]', PASSWORD);
          await page.click('button[type="submit"]');
          await page.waitForURL(/\/odoo/, { timeout: 20000 });
      } catch (e) {}
      await page.goto('https://peruflorestours.odoo.com/odoo/action-sale.product_template_action');
      await page.waitForTimeout(6000);
      return page;
  }

  // 1. CAPTURA LISTA (READ)
  let page1 = await getToProductList();
  console.log('Capturando lista...');
  await page1.screenshot({ path: path.join(ASSETS, 'prod_det_01_lista.png') });
  
  // 2. CREAR (CREATE)
  const btnNuevo = await page1.$('button.o_list_button_add, button.o-kanban-button-new, button:has-text("Nuevo"), button:has-text("New")');
  if (btnNuevo) {
      await btnNuevo.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page1.screenshot({ path: path.join(ASSETS, 'prod_det_02_boton_nuevo.png') });
      await btnNuevo.evaluate(el => el.style.border='');
      console.log('prod_det_02_boton_nuevo.png guardado');
      
      await btnNuevo.click();
      await page1.waitForTimeout(5000);
      
      // Resaltar tipo de producto
      const tipoProd = await page1.$('div[name="detailed_type"]');
      if (tipoProd) await tipoProd.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
      await page1.screenshot({ path: path.join(ASSETS, 'prod_det_03_form_crear.png') });
      console.log('prod_det_03_form_crear.png guardado');
  }
  await page1.close();

  // 3. EDITAR / PESTANAS (UPDATE)
  let page2 = await getToProductList();
  const firstProd = await page2.$('.o_kanban_record, .o_data_row');
  if (firstProd) {
      await firstProd.click();
      await page2.waitForTimeout(5000);
      
      // Resaltar descripcion de ventas
      const tabVentas = await page2.$('a[role="tab"]:has-text("Ventas"), a[role="tab"]:has-text("Sales")');
      if (tabVentas) {
          await tabVentas.click();
          await page2.waitForTimeout(2000);
          const descVentas = await page2.$('div[name="description_sale"]');
          if (descVentas) await descVentas.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page2.screenshot({ path: path.join(ASSETS, 'prod_det_04_ventas.png') });
          console.log('prod_det_04_ventas.png guardado');
      }
      
      // Ecommerce tab
      const tabEcommerce = await page2.$('a[role="tab"]:has-text("Comercio electrónico"), a[role="tab"]:has-text("eCommerce")');
      if (tabEcommerce) {
          await tabEcommerce.click();
          await page2.waitForTimeout(2000);
          const catEcom = await page2.$('div[name="public_categ_ids"]');
          if (catEcom) await catEcom.evaluate(el => el.style.cssText += 'border:4px solid red!important;');
          await page2.screenshot({ path: path.join(ASSETS, 'prod_det_05_ecommerce.png') });
          console.log('prod_det_05_ecommerce.png guardado');
      }

      // 4. ELIMINAR / ARCHIVAR (DELETE)
      const actionBtn = await page2.$('button:has-text("Acción"), button:has-text("Action"), .o_cp_action_menus button');
      if (actionBtn) {
          await actionBtn.click();
          await page2.waitForTimeout(1000);
          
          // Highlight Archive and Delete
          const archiveBtn = await page2.$('span:has-text("Archivar"), span:has-text("Archive")');
          if (archiveBtn) await archiveBtn.evaluate(el => el.parentElement.style.cssText += 'border:3px solid red!important;');
          
          const deleteBtn = await page2.$('span:has-text("Eliminar"), span:has-text("Delete")');
          if (deleteBtn) await deleteBtn.evaluate(el => el.parentElement.style.cssText += 'border:3px solid red!important;');
          
          await page2.screenshot({ path: path.join(ASSETS, 'prod_det_06_archivar.png') });
          console.log('prod_det_06_archivar.png guardado');
      }
  }
  await page2.close();
  
  await browser.close();
})();
