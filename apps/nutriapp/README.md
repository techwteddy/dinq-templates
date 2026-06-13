# Nutriapp — Nutrition PWA + Verified Food Tracking

Next.js · TypeScript · Tailwind CSS · Supabase · PWA · USDA API · Open Food Facts

## Descripción del Proyecto

Nutriapp es una Progressive Web App de nutrición enfocada en precisión, privacidad y seguimiento confiable de calorías y macronutrientes. El proyecto busca resolver un problema común en muchas aplicaciones de conteo calórico: datos nutricionales poco confiables, exceso de rastreadores externos y poca claridad en los cálculos utilizados para estimar los requerimientos del usuario.

La aplicación permite registrar alimentos, calcular requerimientos energéticos y visualizar el progreso nutricional diario mediante una experiencia moderna, responsive y mobile-first. Su enfoque combina fórmulas metabólicas reconocidas, fuentes de datos alimentarios verificables y una arquitectura basada en Supabase para autenticación y persistencia de información.

A diferencia de una aplicación genérica de calorías, Nutriapp está pensada como una herramienta más seria y precisa: prioriza cálculos claros, trazabilidad de datos alimentarios, privacidad del usuario y una interfaz optimizada para el uso diario desde móvil o escritorio.

## Objetivo

El objetivo principal de Nutriapp es ofrecer una aplicación web instalable que ayude al usuario a controlar su alimentación diaria mediante:

- Cálculo de calorías objetivo.
- Seguimiento de proteínas, carbohidratos y grasas.
- Consulta de alimentos desde bases de datos nutricionales.
- Registro de comidas.
- Visualización del progreso diario.
- Experiencia PWA optimizada para dispositivos móviles.
- Arquitectura sin rastreadores invasivos de terceros.

## Estructura del Proyecto

```text
Nutriapp/
├── docs/                  # Documentación técnica y notas del proyecto
├── public/                # Assets públicos e íconos PWA
├── scripts/               # Scripts auxiliares del proyecto
├── src/                   # Código principal de la aplicación
│   ├── app/               # Rutas y vistas principales de Next.js
│   ├── components/        # Componentes reutilizables de interfaz
│   ├── lib/               # Utilidades, clientes, cálculos e integraciones
│   ├── styles/            # Estilos globales
│   └── types/             # Tipos y definiciones TypeScript
├── supabase/
│   └── migrations/        # Migraciones de base de datos
├── .env.example           # Variables de entorno de ejemplo
├── next.config.mjs        # Configuración de Next.js
├── tailwind.config.ts     # Configuración de Tailwind CSS
├── vercel.json            # Configuración de despliegue en Vercel
├── package.json
└── README.md
```

## Módulos de la Solución

### 1. Cálculo Nutricional

Módulo encargado de estimar los requerimientos energéticos del usuario a partir de sus datos personales y objetivos de composición corporal.

Incluye:

- Estimación calórica basada en la fórmula Mifflin-St Jeor.
- Cálculo de calorías objetivo.
- Distribución de macronutrientes.
- Seguimiento de consumo diario.
- Comparación entre objetivo y consumo real.

### 2. Food Tracking

Sistema de registro de alimentos diseñado para reducir errores comunes en el conteo manual.

Incluye:

- Búsqueda de alimentos.
- Registro de porciones.
- Consulta de calorías y macronutrientes.
- Historial de comidas.
- Organización del consumo diario.

### 3. Integración con Fuentes Nutricionales

Nutriapp utiliza APIs de datos alimentarios para mejorar la confiabilidad de la información nutricional.

Incluye:

- USDA FoodData Central.
- Open Food Facts.
- Consulta de datos alimentarios verificables.
- Reducción de dependencia de entradas manuales no validadas.

### 4. Backend y Persistencia

Supabase se utiliza como base para la persistencia y gestión de datos del usuario.

Incluye:

- Autenticación.
- Almacenamiento de perfiles.
- Registro de comidas.
- Persistencia de objetivos nutricionales.
- Migraciones de base de datos.

### 5. PWA y Experiencia Mobile-First

La aplicación está diseñada para funcionar como una app instalable desde el navegador.

Incluye:

- Interfaz responsive.
- Optimización para móvil.
- Configuración PWA.
- Deploy en Vercel.
- Uso diario desde iOS, Android o escritorio.

## Características Principales

- Seguimiento de calorías y macronutrientes.
- Cálculo de requerimientos con Mifflin-St Jeor.
- Integración con USDA FoodData Central.
- Integración con Open Food Facts.
- Backend con Supabase.
- Interfaz responsive construida con Tailwind CSS.
- Arquitectura basada en Next.js y TypeScript.
- Enfoque privacy-first.
- PWA instalable.
- Deploy en Vercel.

## Tech Stack

| Área | Tecnología |
|---|---|
| Framework | Next.js |
| Lenguaje | TypeScript |
| UI | React |
| Estilos | Tailwind CSS |
| Backend / DB | Supabase |
| Datos nutricionales | USDA FoodData Central, Open Food Facts |
| PWA | Next.js PWA configuration |
| Deploy | Vercel |

## Cómo Ejecutar el Proyecto

### Requisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado:

- Node.js
- npm
- Cuenta de Supabase
- API key de USDA FoodData Central, si se utilizará la integración completa

### Instalación

Clona el repositorio:

```bash
git clone https://github.com/mmauriciocabanillas/Nutriapp.git
cd Nutriapp
```

Instala las dependencias:

```bash
npm install
```

Crea el archivo de variables de entorno:

```bash
cp .env.example .env.local
```

Configura las variables necesarias:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
USDA_API_KEY=your_usda_api_key
```

Ejecuta el servidor de desarrollo:

```bash
npm run dev
```

La aplicación estará disponible normalmente en:

```text
http://localhost:3000
```

## Scripts Disponibles

```bash
npm run dev
```

Ejecuta la aplicación en modo desarrollo.

```bash
npm run build
```

Genera la build de producción.

```bash
npm run start
```

Ejecuta la aplicación en modo producción.

## Demo

Aplicación desplegada:

```text
https://nutriapp-kappa.vercel.app
```

## Privacidad

Nutriapp está diseñada con un enfoque privacy-first. El objetivo es evitar dependencias innecesarias de rastreo externo y mantener el control de los datos del usuario dentro de la arquitectura de la aplicación.

## Estado del Proyecto

Proyecto funcional en desarrollo activo. La prioridad actual es consolidar la experiencia mobile-first, mejorar la precisión del tracking nutricional y fortalecer la integración con fuentes alimentarias verificadas.

## Autor

Alexander Cabanillas

## Licencia

MIT License. Ver el archivo `LICENSE` para más detalles.
