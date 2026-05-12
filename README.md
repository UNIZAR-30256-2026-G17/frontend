# 🚀 MontgomeryApp - Frontend

Aplicación móvil y web desarrollada con **React Native + Expo** y **React Native Paper**.

Soporta:
- 📱 Android
- 🌐 Web

---

# 📦 Instalación

Instala todas las dependencias del proyecto:

```bash
npm install
```

---

# ▶️ Ejecutar el proyecto

Inicia el servidor de desarrollo con Expo:

```bash
npm start
```

## 🌐 Ejecutar en Web

Para abrir la aplicación en el navegador directamente:

```bash
npm run web
```


## 🤖 Ejecutar en Android

Para abrir la aplicación en Android directamente:

```bash
npm run android
```

Esto abrirá la app en:
- Emulador Android (si está configurado)
- Dispositivo físico con Expo Go

---

# 📁 Estructura del proyecto

```bash
frontend/
├── assets/           # Imágenes e iconos
├── src/
│   ├── components/   # Componentes reutilizables (UI, Layout, Animations)
│   ├── context/      # Estados globales (Auth, Scroll)
│   ├── navigation/   # AppNavigator y Rutas protegidas
│   ├── screens/      # Pantallas de la app por roles
│   └── theme/        # Sistema de diseño (colores, estilos)
├── tests/            # Suite de pruebas unitarias
├── App.js
├── app.json
├── index.js
└── package.json
```

---

# 💡 Detalles Técnicos e Implementaciones Avanzadas

### 1. Sistema de Diseño "Glassmorphism"
Hemos implementado un sistema visual moderno que incluye:
- **Header Dinámico**: Utiliza `ScrollContext` para pasar de opaco a semitransparente con `blur` dinámico al hacer scroll.
- **Efecto Pulse**: El avatar de perfil incluye anillos animados que pulsan suavemente para un acabado premium.

### 2. Arquitectura de Estado y Rendimiento
- **ScrollContext**: Seguimiento centralizado del scroll que permite a componentes como el Header reaccionar sin causar re-renders innecesarios en las pantallas.
- **Memoización**: Optimización de cálculos pesados (como la generación de pestañas por rol) mediante `useMemo` para asegurar 60fps constantes.
- **HOC de Protección**: Sistema `withProtection` para asegurar que las rutas solo sean accesibles por los roles autorizados (`admin`, `police`, etc.).

### 3. Componentes Controlados
Refactorización de componentes de UI como `ToggleButton` para soportar lógica de selección única (tipo Radio) de forma determinista en los filtros de administración.

### 4. Tests y Calidad
Suite de pruebas integrada con `Jest` y `@testing-library/react-native`, cubriendo desde la carga de fuentes hasta los flujos de inicio de sesión con mocks avanzados de módulos nativos.
