# Guía de Deployment en Render

Esta guía te ayudará a desplegar tu proyecto Concesionaria en Render paso a paso.

## 📋 Requisitos Previos

1. **Cuenta en Render**: Regístrate en [render.com](https://render.com)
2. **MongoDB Atlas** (recomendado): Crear un cluster gratuito en [mongodb.com](https://www.mongodb.com/atlas)
3. **Repositorio en GitHub**: Tu código debe estar en un repositorio público de GitHub

## 🚀 Pasos para Deployment

### 1. Configurar MongoDB Atlas (Base de Datos)

1. Ve a [MongoDB Atlas](https://www.mongodb.com/atlas) y crea una cuenta
2. Crea un nuevo cluster (usa el plan gratuito M0)
3. Configura el acceso:
   - Ve a "Database Access" → Crear un usuario con permisos de lectura/escritura
   - Ve a "Network Access" → Agregar IP `0.0.0.0/0` (permite acceso desde cualquier lugar)
4. Obtén tu connection string:
   - Ve a "Connect" → "Connect your application"
   - Copia el string que se ve así: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### 2. Desplegar el Backend (API)

1. **En Render Dashboard**:
   - Click "New" → "Web Service"
   - Conecta tu repositorio de GitHub
   - Configuración:
     - **Name**: `concesionaria-api`
     - **Environment**: `Node`
     - **Build Command**: `cd Backend && npm install`
     - **Start Command**: `cd Backend && npm start`

2. **Variables de Entorno**:
   ```
   NODE_ENV=production
   PORT=10000
   MONGO_URL=mongodb+srv://tuusuario:tupassword@cluster0.xxxxx.mongodb.net/concesionaria?retryWrites=true&w=majority
   JWT_SECRET=tu-clave-secreta-muy-segura-aqui
   ```

3. **Deploy**: Click "Create Web Service"

### 3. Desplegar el Frontend (React)

1. **En Render Dashboard**:
   - Click "New" → "Static Site"
   - Usa el mismo repositorio
   - Configuración:
     - **Name**: `concesionaria-frontend`
     - **Build Command**: `cd frontend && npm install && npm run build`
     - **Publish Directory**: `frontend/build`

2. **Variables de Entorno**:
   ```
   REACT_APP_API_URL=https://concesionaria-api.onrender.com
   ```
   (Reemplaza con la URL real de tu backend API)

3. **Deploy**: Click "Create Static Site"

### 4. Configuración Post-Deploy

#### Backend API:
- URL estará disponible en: `https://concesionaria-api.onrender.com`
- Healthcheck: `https://concesionaria-api.onrender.com/`

#### Frontend:
- URL estará disponible en: `https://concesionaria-frontend.onrender.com`

### 5. Configurar CORS (si es necesario)

Si tienes problemas de CORS, asegúrate de que tu backend permita requests desde el frontend:

```javascript
// En tu app.js del backend
app.use(cors({
    origin: [
        'https://concesionaria-frontend.onrender.com',
        'http://localhost:3000' // para desarrollo
    ]
}));
```

## 🔧 Troubleshooting

### Problemas Comunes:

1. **Build falla**:
   - Revisa que las rutas en build/start commands sean correctas
   - Verifica que package.json tenga todos los scripts necesarios

2. **Base de datos no conecta**:
   - Verifica que MONGO_URL esté bien configurada
   - Asegúrate de que MongoDB Atlas permita conexiones (Network Access)

3. **Frontend no puede conectar al API**:
   - Verifica que REACT_APP_API_URL apunte correctamente al backend
   - Revisa configuración de CORS en el backend

4. **Servicios duermen (plan gratuito)**:
   - Los servicios gratuitos de Render duermen después de 15min de inactividad
   - Primera request después del sueño puede tardar hasta 30 segundos

## 🆚 Diferencias con Railway

| Aspecto | Railway | Render |
|---------|---------|---------|
| Configuration | `railway.json` | `render.yaml` (opcional) |
| Database | Incluida | Externa (MongoDB Atlas) |
| Build Command | Single service | Separate services |
| Environment Variables | Automáticas | Manuales |
| Cold Start | ~5s | ~15-30s |

## 📝 Comandos Útiles

### Logs del Backend:
```bash
# Desde Render Dashboard
Navigate to: concesionaria-api → Logs
```

### Test local antes de deploy:
```bash
# Backend
cd Backend
npm install
npm start

# Frontend (en otra terminal)
cd frontend 
npm install
REACT_APP_API_URL=http://localhost:3000 npm start
```

## 🔄 Re-deploys Automáticos

Render automáticamente re-desplegará tu aplicación cada vez que hagas push a la rama main de tu repositorio GitHub.

Para desactivar auto-deploy: Settings → Build & Deploy → Auto-Deploy: Off

## 💡 Tips de Optimización

1. **Uso de Cache**: Render cache `node_modules`, acelera builds
2. **Health Checks**: Configura endpoint `/health` en tu API
3. **Environment Variables**: Usa Render's environment groups para reutilizar configs
4. **Monitoring**: Usa Render's built-in monitoring para performance

---

¿Necesitas ayuda con algún paso específico? ¡Pregunta!