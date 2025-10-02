# 🏋️ Fitness Tracker

Una aplicación React + TypeScript para registrar entrenamientos, peso, % de grasa y fotos de progreso, usando Google Sheets como base de datos.

## 🚀 Características

- **Dashboard completo** con métricas de peso, IMC, progreso y records personales
- **Registro de peso** con % de grasa corporal
- **Entrenamientos** con cálculo automático de 1RM usando fórmula de Epley
- **Hábitos diarios** (sueño, agua, cardio) con seguimiento de cumplimiento
- **Fotos de progreso** con subida a Cloudinary
- **Diseño responsive** optimizado para PC y móvil
- **UI moderna** con TailwindCSS y shadcn/ui

## 🛠️ Tecnologías

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: TailwindCSS + shadcn/ui
- **Iconos**: Lucide React
- **Gráficos**: Recharts (opcional)
- **Base de datos**: Google Sheets + Apps Script
- **Almacenamiento de imágenes**: Cloudinary

## 📋 Prerequisitos

- Node.js 18+ 
- Cuenta de Google (para Google Sheets)
- Cuenta de Cloudinary (para fotos)

## ⚙️ Configuración

### 1. Instalación

```bash
# Clonar el repositorio
git clone <tu-repo>
cd fitness-tracker

# Instalar dependencias
npm install

# Copiar archivo de configuración
cp env.example .env
```

### 2. Configurar Google Sheets + Apps Script

#### Paso 1: Crear Google Sheet
1. Ve a [Google Sheets](https://sheets.google.com)
2. Crea una nueva hoja llamada "Fitness Tracker"
3. Crea las siguientes hojas:
   - `Weight` (Peso)
   - `Workouts` (Entrenamientos) 
   - `Habits` (Hábitos)
   - `Photos` (Fotos)

#### Paso 2: Configurar Apps Script
1. En tu Google Sheet, ve a `Extensiones > Apps Script`
2. Reemplaza el código con el script proporcionado en el README completo
3. Configura las variables API_KEY y SHEET_ID

#### Paso 3: Desplegar Apps Script
1. Haz clic en "Desplegar" > "Nueva implementación"
2. Selecciona tipo "Aplicación web"
3. Ejecuta como "Yo"
4. Acceso "Cualquier usuario"
5. Copia la URL de la aplicación web

### 3. Configurar Cloudinary

1. Ve a [Cloudinary](https://cloudinary.com) y crea una cuenta
2. En el Dashboard, copia tu "Cloud name"
3. Ve a "Settings" > "Upload" > "Upload presets"
4. Crea un nuevo preset con:
   - **Preset name**: `fitness_photos`
   - **Signing Mode**: `Unsigned`
   - **Folder**: `fitness-tracker`
5. Copia el nombre del preset

### 4. Configurar variables de entorno

Edita el archivo `.env`:

```env
# Google Sheets Apps Script Configuration
VITE_APP_SCRIPT_URL=https://script.google.com/macros/s/TU_SCRIPT_ID/exec
VITE_API_KEY=tu_api_key_segura_aqui

# Cloudinary Configuration
VITE_CLOUDINARY_NAME=tu_cloudinary_name
VITE_CLOUDINARY_UPLOAD_PRESET=fitness_photos

# App Configuration
VITE_APP_TITLE=Fitness Tracker
```

## 🚀 Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build

# Preview de la build
npm run preview
```

## 📦 Despliegue en Vercel

1. Instala Vercel CLI:
```bash
npm i -g vercel
```

2. En el directorio del proyecto:
```bash
vercel
```

3. Configura las variables de entorno en Vercel
4. Redespliega:
```bash
vercel --prod
```

## 📊 Automatizaciones en Google Sheets

La aplicación está diseñada para que Google Sheets maneje todos los cálculos:

### Fórmulas recomendadas:

**En la hoja Weight:**
- IMC: `=B2/(1.75^2)` (asumiendo altura de 1.75m)
- Progreso: `=(B2-85)/(105-85)*100` (ejemplo: de 105kg a 85kg)

**En la hoja Workouts:**
- 1RM: `=C2*(1+D2/30)` (fórmula de Epley)
- PR por ejercicio: Usar formato condicional para resaltar en dorado

**En la hoja Habits:**
- Cumplimiento semanal: `=COUNTIF(B2:D8,TRUE)/21*100`

## 🎨 Personalización

### Colores
Los colores se pueden personalizar en `tailwind.config.js`

### Ejercicios
Modifica la lista de ejercicios en `src/pages/WorkoutsPage.tsx`

## 🐛 Solución de problemas

### Error de CORS
Si tienes problemas de CORS con Google Sheets:
1. Asegúrate de que el Apps Script esté desplegado correctamente
2. Verifica que la URL del Apps Script sea correcta
3. Revisa que el API_KEY coincida

### Error de Cloudinary
Si las imágenes no se suben:
1. Verifica que el Cloudinary name sea correcto
2. Asegúrate de que el upload preset esté configurado como "Unsigned"
3. Revisa los límites de tamaño (máximo 5MB)

### Variables de entorno
Si las variables no se cargan:
1. Asegúrate de que empiecen con `VITE_`
2. Reinicia el servidor de desarrollo
3. Verifica que el archivo `.env` esté en la raíz del proyecto

## 📝 Licencia

MIT License

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:
1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request