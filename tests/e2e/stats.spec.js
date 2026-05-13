const { test, expect } = require('@playwright/test');

test.describe('Visitor Stats Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Vamos a la landing page
    await page.goto('/');

    // Navegamos a Estadísticas utilizando el enlace del header "Estadísticas"
    // Usamos exact: true para no confundirlo con "Estadísticas avanzadas"
    const statsButton = page.getByText('Estadísticas', { exact: true }).first();
    await statsButton.evaluate(el => el.click());

    // Verificamos que estamos en la pantalla de estadísticas buscando el título del Card principal
    await expect(page.getByText('Distribución de delitos').filter({ visible: true })).toBeVisible();
  });

  test('should change data when switching from last month to last year', async ({ page }) => {
    // 1. Capturamos el valor inicial para "Violencia y delitos contra la persona" (Último mes por defecto)
    const initialPercentText = await page.locator('div').filter({ hasText: /^Violencia y delitos contra la persona$/ }).locator('..').getByText(/%/).innerText();
    console.log(`Porcentaje último mes: ${initialPercentText}`);

    // 2. Abrimos el dropdown
    const dropdownButton = page.getByText('Último mes', { exact: true }).filter({ visible: true });
    await dropdownButton.evaluate(el => el.click());

    // 3. Seleccionamos "Último año"
    const lastYearOption = page.getByText('Último año', { exact: true }).filter({ visible: true });
    await lastYearOption.evaluate(el => el.click());

    // 4. Esperamos a que los datos se actualicen (podemos esperar a que el texto cambie o que pase un breve tiempo)
    // En una app real, esperaríamos a que el LoadingOverlay desaparezca.
    await expect(page.getByText('Cargando estadísticas...')).not.toBeVisible();

    // 5. Capturamos el nuevo valor
    const newPercentText = await page.locator('div').filter({ hasText: /^Violencia y delitos contra la persona$/ }).locator('..').getByText(/%/).innerText();
    console.log(`Porcentaje último año: ${newPercentText}`);

    // 6. Verificamos que los valores sean distintos (asumiendo que los datos de la API varían)
    expect(initialPercentText).not.toBe(newPercentText);
  });
});
