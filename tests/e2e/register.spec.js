const { test, expect } = require('@playwright/test');

test.describe('Register Flow', () => {
  test.beforeEach(async ({ page }) => {
    // Vamos a la landing page
    await page.goto('/');

    // Navegamos a Iniciar Sesión desde la Home
    const startButton = page.getByText('Iniciar sesión').first();
    await startButton.evaluate(el => el.click());

    // Desde la pantalla de Login, navegamos a Registro
    const toRegisterButton = page.getByText('Registrarse').first();
    await toRegisterButton.evaluate(el => el.click());

    // Verificamos que estamos en la pantalla de registro buscando el campo de placa
    await expect(page.getByPlaceholder('1234').filter({ visible: true })).toBeVisible();
  });

  test('should show error with incomplete data', async ({ page }) => {
    // Rellenar solo algunos campos (usamos filter({ visible: true }) para evitar conflictos con la pantalla de login en el DOM)
    await page.getByPlaceholder('ejemplo@gmail.com').filter({ visible: true }).fill('nuevo_agente@test.com');
    await page.getByPlaceholder('Ejemplo123@').filter({ visible: true }).fill('password123');

    // El texto "Registrarse" aparece como título (índice 0) y como botón (índice 1)
    const registerButton = page.getByText('Registrarse', { exact: true }).filter({ visible: true }).nth(1);
    await registerButton.evaluate(el => el.click());

    // Verificamos el mensaje de error del Snackbar
    await expect(page.getByText('Todos los campos son obligatorios').filter({ visible: true })).toBeVisible();
  });

  test('should register successfully and navigate to police map', async ({ page }) => {
    // Generamos datos aleatorios para evitar colisiones en la DB si se ejecuta varias veces
    const randomBadge = Math.floor(Math.random() * 1000000).toString();
    const randomEmail = `agente_${randomBadge}@test.com`;

    await page.getByPlaceholder('ejemplo@gmail.com').filter({ visible: true }).fill(randomEmail);
    await page.getByPlaceholder('Ejemplo123@').filter({ visible: true }).fill('password123');
    await page.getByPlaceholder('1234').filter({ visible: true }).fill(randomBadge);

    const registerButton = page.getByText('Registrarse', { exact: true }).filter({ visible: true }).nth(1);
    await registerButton.evaluate(el => el.click());

    // Tras el éxito, la app hace login automático y navega al Mapa Policial
    await expect(page.getByText('Mapa de Montgomery').filter({ visible: true })).toBeVisible();
  });
});
