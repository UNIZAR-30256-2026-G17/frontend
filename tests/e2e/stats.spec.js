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

  test('should show statistics for the last month', async ({ page }) => {
    // Verificamos que las categorías principales sean visibles
    await expect(page.getByText('Violencia y delitos contra la persona').filter({ visible: true })).toBeVisible();
    await expect(page.getByText('Orden público y vandalismo').filter({ visible: true })).toBeVisible();
    await expect(page.getByText('Robos y hurtos').filter({ visible: true })).toBeVisible();

    // El filtro por defecto es "Último mes".
    const dropdownButton = page.getByText('Último mes', { exact: true }).filter({ visible: true });
    await dropdownButton.evaluate(el => el.click());

    // Seleccionamos la opción "Último mes" de nuevo para verificar interactividad
    const lastMonthOption = page.getByText('Último mes', { exact: true }).last();
    await lastMonthOption.evaluate(el => el.click());

    await expect(page.getByText('Distribución de delitos').filter({ visible: true })).toBeVisible();
  });
});
