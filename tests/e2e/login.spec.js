const { test, expect } = require('@playwright/test');

test.describe('Login Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Vamos a la landing page en lugar de navegar directamente a /login
    // ya que la configuración de rutas de la app requiere interacción.
    await page.goto('/');

    // Esperamos a que la landing cargue
    await expect(page.getByText('Condado de Montgomery · Maryland')).toBeVisible();

    // Usamos getByText ya que el componente puede no tener el rol 'button' explícito
    await page.getByText('Iniciar sesión').first().click();

    // Verificamos que estamos en la pantalla de login buscando el campo de email
    await expect(page.getByPlaceholder('ejemplo@gmail.com')).toBeVisible();
  });

  test('should login successfully as admin', async ({ page }) => {
    // Rellenar campos con datos erróneos
    await page.getByPlaceholder('ejemplo@gmail.com').fill('admin@montgomerysafetymap.com');
    await page.getByPlaceholder('Ejemplo123@').fill('123456');

    // En la pantalla de login, el texto "Iniciar sesión" aparece como título (índice 0)
    // y como botón del formulario (índice 1).
    const loginButton = page.getByText('Iniciar sesión', { exact: true }).nth(1);
    await loginButton.evaluate(el => el.click());

    // El admin navega a Panel de Alertas
    await expect(page.getByText('Panel de Alertas')).toBeVisible();
  });
});
