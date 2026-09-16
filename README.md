# Ephemora 📅✨

**Ephemora** es una aplicación móvil de productividad y gestión del tiempo construida con **React Native + TypeScript** sobre el ecosistema **Expo**. El proyecto está enfocado en organizar actividades diarias mediante una agenda/calendario inteligente con espacios dedicados para **tiempos de descanso**, **pausas activas**, gestión de horarios y un **dashboard** centralizado de seguimiento y bienestar, todo estructurado bajo una arquitectura modular y escalable.

---

## 🛠️ Stack Tecnológico y Arquitectura

- **Framework**: [React Native](https://reactnative.dev/) (v0.86) + [React](https://react.dev/) (v19)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/) para un tipado estático seguro
- **Plataforma & Toolchain**: [Expo SDK 57](https://expo.dev/)
- **Enrutamiento**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based Routing con soporte para Tabs, Layouts y Modales)
- **Criptografía & Seguridad**: Algoritmo simétrico **AES-256 (CBC + PKCS7)** con clave fija protegida en `.env`
- **Base de Datos Local**: [Expo SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) (`ephemora.db`) bajo patrón Repository / Modelo (ORM desacoplado)
- **Motor de Animaciones**: [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/) (animaciones fluidas a 60/120 FPS en hilo nativo UI)
- **Retroalimentación Física**: [Expo Haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) (vibraciones hápticas en dispositivo real)
- **Entorno de Pruebas en Vivo**: [Expo Go](https://expo.dev/go) + Puente [ADB](https://developer.android.com/tools/adb) + [scrcpy](https://github.com/Genymobile/scrcpy)

### Estructura de Directorios

```text
Ephemora/
├── app/                        # Enrutamiento basado en archivos (Expo Router)
│   ├── (tabs)/                 # Navegación por pestañas (Tab One, Tab Two)
│   │   ├── _layout.tsx         # Configuración del Tab Bar y barra superior
│   │   ├── index.tsx           # Punto de entrada (AuthProvider + Enrutador)
│   │   └── two.tsx             # Pantalla Tab Two
│   ├── _layout.tsx             # Layout raíz y temas
│   └── modal.tsx               # Modal informativo
├── components/                 # Componentes base y utilidades de Expo Router
├── constants/                  # Constantes globales de la app (Colores, Temas)
├── SQL/                        # Scripts DDL de base de datos relacional
│   └── schema.sql              # Esquema de tablas users y app_settings
├── src/                        # Arquitectura limpia y lógica de negocio modular
│   ├── components/             # Componentes propios (PersistentHeader, HamburgerMenu, TouchCounter, etc.)
│   ├── context/                # Estado global de sesión y autenticación (AuthContext)
│   ├── database/               # Conexión e inicialización de SQLite (sqlite.ts)
│   ├── models/                 # Modelos y capa ORM / Repository (User.ts, UserRepository.ts)
│   ├── screens/                # Pantallas completas (LoginScreen, DashboardScreen)
│   ├── styles/                 # Estilos desacoplados (TouchCounter.styles.ts)
│   └── utils/                  # Criptografía AES-256 (crypto.ts) y validaciones (validation.ts)
├── assets/                     # Recursos visuales (iconos, splash, tipografías)
├── .env                        # Variables de entorno secretas (ignorado en Git)
├── .env.example                # Plantilla de variables de entorno
├── app.json                    # Configuración del proyecto Expo
├── package.json                # Dependencias y scripts del proyecto
└── tsconfig.json               # Configuración del compilador TypeScript
```

---

## 🔐 Configuración de Variables de Entorno y Blindaje de Seguridad

El proyecto utiliza una clave de cifrado **AES-256 fija** almacenada en el archivo `.env` en la raíz. Si el archivo `.env` o la clave no están presentes, la aplicación bloquea automáticamente cualquier intento de login, registro o descifrado de datos para proteger la información.

1. Crea o verifica tu archivo `.env` en la raíz del proyecto:
   ```env
   ENCRYP_KEY=2b5d503dd4de96a0ec5ce0f3083bc02101db09a37872ce3b8e600ca4273a8e29
   EXPO_PUBLIC_ENCRYP_KEY=2b5d503dd4de96a0ec5ce0f3083bc02101db09a37872ce3b8e600ca4273a8e29
   ```

---

## 📱 Requisitos Previos para el Mirror y Desarrollo con Teléfono Físico

El flujo de trabajo utiliza un teléfono físico (**Xiaomi Redmi Note 8 Pro - Android 11**) conectado por cable USB, sincronizado con el PC mediante ADB y proyectado en tiempo real con **scrcpy** para control bilateral directo desde Windows.

### 1. Configuración en la PC (Windows)
- **Node.js** (versión LTS recomendada) y **npm / npx**.
- **Android SDK & ADB**: SDK de Android instalado (ej. descargado desde Android Studio en `D:\AndroidStudioSDK\platform-tools`). Asegurarse de tener acceso a `adb.exe` en la ruta de herramientas o variable de entorno PATH.
- **scrcpy**: Herramienta de mirroring de pantalla de alto rendimiento y baja latencia (ej. ubicada en `D:\AndroidStudioSDK\tools\scrcpy-win64-v4.1`). https://github.com/Genymobile/scrcpy/blob/master/doc/windows.md

### 2. Configuración en el Teléfono (Xiaomi / MIUI)
1. **Activar Opciones de Desarrollador**:
   - Ir a *Ajustes* > *Sobre el teléfono*.
   - Tocar 7 veces consecutivas sobre *Versión de MIUI* hasta que aparezca el mensaje *"Ya eres desarrollador"*.
2. **Habilitar Opciones de Depuración**:
   - Ir a *Ajustes adicionales* > *Opciones de desarrollador*.
   - **Depuración USB**: Activada.
   - **Instalar vía USB**: Activada (permite instalar Expo Go o componentes necesarios vía ADB).
   - **Depuración USB (Ajustes de seguridad)**: Activada (permite que `scrcpy` pueda enviar toques táctiles, clicks y entradas de teclado desde la PC al móvil).

---

## 🚀 Guía Paso a Paso para Inicializar el Proyecto y el Mirror en Vivo

### Paso 1: Conexión USB y Autorización ADB
1. Conecta el teléfono al PC mediante un cable USB de buena calidad.
2. Si aparece una ventana en el teléfono preguntando *"¿Permitir depuración USB?"*, marca la casilla de *"Permitir siempre desde este equipo"* y acepta.

### Paso 2: Iniciar la Ventana Mirror en Tiempo Real (`scrcpy`)
1. Ejecuta el archivo ejecutable `scrcpy.exe` (o desde la consola de Windows):
   ```powershell
   D:\AndroidStudioSDK\tools\scrcpy-win64-v4.1\scrcpy.exe
   ```
2. La terminal de scrcpy detectará el dispositivo mediante ADB (`(usb) nzeqvwfmibrwl7de device Redmi_Note_8_Pro`) y abrirá una ventana flotante con la pantalla del teléfono en tiempo real.
3. Desde esta ventana puedes controlar la pantalla con el ratón o directamente tocar la pantalla física de tu Redmi Note 8 Pro.

### Paso 3: Iniciar el Metro Bundler de Expo
1. Abre tu terminal o IDE en la raíz del proyecto:
   ```powershell
   cd "D:\Repositorios\GitHub\Android\ReactNative Expo\Ephemora"
   ```
2. Ejecuta el comando de inicio limpiando la caché de empaquetado:
   ```powershell
   npx expo start --clear
   ```
3. Verás en la consola el código QR de Metro, los endpoints locales (`exp://...` y `http://localhost:8081`) y la lista de comandos disponibles.

### Paso 4: Desplegar en el Dispositivo Móvil
1. Con la consola de Expo activa, presiona la tecla **`a`** (Open on Android).
2. Expo se comunicará con el puente ADB detectando automáticamente el `Redmi_Note_8_Pro` y abrirá la aplicación en **Expo Go**.
3. En pocos segundos verás reflejada la aplicación tanto en tu teléfono como en la ventana flotante de **scrcpy**.

### Paso 5: Desarrollo en Tiempo Real (Fast Refresh / Hot Reloading)
- Cualquier modificación que realices y guardes en los archivos de código se compilará y actualizará de inmediato en pantalla sin necesidad de reiniciar la sesión ni perder el estado actual.

---

## 🎮 Credenciales Demo de Prueba

Para probar el flujo de autenticación inmediato:
- **Documento (ID)**: `1098765432`
- **Contraseña**: `Password#2026`
- O utiliza el botón **"⚡ Autocompletar Usuario Demo"** en la pantalla de Login.

---

## 🗺️ Hoja de Ruta (Roadmap) del Proyecto

- [x] Inicialización del entorno base con Expo SDK 57, TypeScript y Expo Router.
- [x] Verificación de desarrollo en vivo vía USB con ADB y scrcpy en Redmi Note 8 Pro.
- [x] Componente interactivo de pruebas de interacción física y háptica (`TouchCounter`).
- [x] Sistema de autenticación con validaciones estrictas y cifrado AES-256.
- [x] Base de datos local SQLite (`ephemora.db`) con patrón Modelo/ORM Repository.
- [x] Blindaje de seguridad con clave fija en `.env`.
- [x] Header persistente y fijo ante el scroll.
- [x] Menú Hamburguesa con 5 opciones dinámicas de color y contenido.
- [ ] Módulo de Calendario y Bloques de Actividades Diarias.
- [ ] Sistema de Tiempos de Descanso y Pausas Activas configurables.
- [ ] Dashboard de seguimiento, métricas y estado diario.
- [ ] Notificaciones locales programadas para pausas activas.
