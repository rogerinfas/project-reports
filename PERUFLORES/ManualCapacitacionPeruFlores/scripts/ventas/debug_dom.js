const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto('https://peruflorestours.odoo.com/odoo');
  await page.fill('input[name="login"]', 'peruflorestravelagency@gmail.com');
  await page.fill('input[name="password"]', 'agen*Flor.25pe');
  await page.click('button[type="submit"]');
  await page.waitForURL(/\/odoo/, { timeout: 20000 });
  
  await page.waitForTimeout(10000); // Wait 10 seconds for apps to fully load
  const domHome = await page.content();
  fs.writeFileSync('dom_home.html', domHome);
  console.log('DOM de Inicio guardado');

  // Intentar hacer click en Ventas buscando por texto
  const ventasLink = await page.$('a:has-text("Ventas"), a:has-text("Sales")');
  if (ventasLink) {
      await ventasLink.click();
      await page.waitForTimeout(10000);
      const domVentas = await page.content();
      fs.writeFileSync('dom_ventas.html', domVentas);
      console.log('DOM de Ventas guardado');
  } else {
      console.log('No se encontro el link de Ventas por texto');
  }

  await browser.close();
})();
