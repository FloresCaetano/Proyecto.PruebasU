# 🚂 Configuración de Railway para el Proyecto

## 📋 Guía Completa de Deployment

### 1. 🏗️ Preparación del Proyecto

Tu proyecto ya está configurado para Railway con:
- ✅ MongoDB con Mongoose
- ✅ Variables de entorno configuradas  
- ✅ Scripts de build y start
- ✅ Tests k6 para Railway

### 2. 🌐 Crear Cuenta y Proyecto en Railway

1. Ve a [railway.app](https://railway.app)
2. Crea cuenta con GitHub
3. Conecta tu repositorio

### 3. 🗄️ Configurar MongoDB

**Opción A: MongoDB Atlas (Recomendado)**
1. Ve a [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Crea cluster gratuito
3. Crea usuario de base de datos
4. Obtén connection string
5. En Railway, ve a Variables → Agrega:
   ```
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/concesionaria
   ```

**Opción B: Plugin MongoDB de Railway**
1. En tu proyecto Railway, ve a "New" → "Database" → "Add MongoDB"
2. Railway configurará automáticamente `DATABASE_URL`

### 4. 🔧 Variables de Entorno en Railway

En tu proyecto Railway, ve a **Settings → Variables** y agrega:

```bash
# Base de datos (usar una de estas opciones)
MONGO_URL=mongodb+srv://tu-usuario:tu-password@cluster.mongodb.net/concesionaria
# O si usas el plugin de MongoDB:
# DATABASE_URL se configura automáticamente

# JWT Secret (genera uno seguro)
JWT_SECRET=tu-clave-muy-segura-aqui-cambiala

# Puerto (Railway lo asigna automáticamente, pero puedes especificar)
PORT=3000

# Opcional: Entorno
NODE_ENV=production
```

### 5. 📦 Configuración del Build

Railway detectará automáticamente tu proyecto Node.js. Verifica que tu `package.json` tenga:

```json
{
  "scripts": {
    "start": "node src/app.js",
    "seed": "node src/seeders.js"
  },
  "main": "src/app.js"
}
```

### 6. 🚀 Deploy Inicial

1. Conecta tu repositorio en Railway
2. Railway hará el build automáticamente
3. Una vez deployado, obtienes una URL como: `https://tu-proyecto.up.railway.app`

### 7. 🌱 Inicializar Base de Datos

**Opción A: Usar Railway CLI**
```bash
# Instala Railway CLI
npm install -g @railway/cli

# Login
railway login

# Conecta al proyecto
railway link

# Ejecuta seeder
railway run npm run seed
```

**Opción B: Temporal en el código**
Puedes modificar temporalmente `src/app.js` para ejecutar el seeder al inicio:

```javascript
// Agregar después de database.connect()
database.connect().then(async () => {
    await createDefaultAdmin();
    
    // SOLO PARA PRIMERA VEZ - REMOVE DESPUÉS
    const { seedDatabase } = require('./seeders');
    await seedDatabase();
    
}).catch(error => {
    console.error('Error inicializando aplicación:', error);
});
```

**¡IMPORTANTE!** Remueve el código del seeder después del primer deploy.

### 8. 🧪 Verificar el Deployment

Ejecuta los tests k6:
```bash
# Configura tu URL
$env:RAILWAY_URL = "https://tu-proyecto.up.railway.app"

# Ejecuta test de verificación
k6 run k6-tests/railway-test.js
```

### 9. 📁 Estructura de Archivos para Railway

Asegúrate de que tu estructura sea:
```
Backend/
├── src/
│   ├── app.js          # Punto de entrada
│   ├── config/
│   │   └── database.js # Configuración MongoDB
│   ├── models/         # Modelos Mongoose
│   ├── controllers/    # Controllers con MongoDB
│   ├── routes/         # Rutas
│   └── middleware/     # Middleware
├── package.json        # Dependencias y scripts
└── .env.example       # Variables de ejemplo
```

### 10. 🔍 Troubleshooting Común

#### ❌ Error: Usuario Admin No Encontrado
**Solución**: Ejecuta el seeder manualmente
```bash
railway run npm run seed
```

#### ❌ Error de Conexión a MongoDB
**Problema**: `MongoNetworkError` o `ENOTFOUND`
**Solución**: 
- Verifica la variable `MONGO_URL` en Railway
- Asegúrate de que el cluster MongoDB permita conexiones desde cualquier IP (0.0.0.0/0)

#### ❌ Error de JWT
**Problema**: `JsonWebTokenError: invalid signature`  
**Solución**: Configura `JWT_SECRET` en Railway

#### ❌ App No Inicia
**Problema**: Error en logs de Railway
**Solución**: Verifica que `package.json` tenga el script `start` correcto

### 11. 📊 Monitoreo y Logs

**Ver logs en tiempo real:**
```bash
railway logs
```

**En Railway Dashboard:**
- Ve a tu proyecto → "Deployments" → Click en el deployment actual
- Ve logs, métricas de CPU/RAM
- Revisa variables de entorno

### 12. 🔄 Auto-Deploy

Railway se actualiza automáticamente cuando:
- Haces push a la rama conectada (main/master)
- Cambias variables de entorno

### 13. 💰 Consideraciones de Costo

**Railway Plan Gratuito:**
- $5 USD de crédito mensual gratis
- Suficiente para desarrollo y testing
- Upgrade a plan pagado para producción

**Tips para optimizar costo:**
- Usa MongoDB Atlas free tier
- El app se "duerme" cuando no se usa (normal)

### 14. 🔗 URLs Importantes

Después del deploy tendrás:
- **App URL**: `https://tu-proyecto.up.railway.app`
- **API Endpoints**: 
  - `https://tu-proyecto.up.railway.app/api/auth/login`
  - `https://tu-proyecto.up.railway.app/api/autos`
  - etc.

### 15. ✅ Checklist Post-Deploy

- [ ] App responde en `/` con status de BD
- [ ] Login funciona con admin@consecionaria.com
- [ ] Endpoints protegidos requieren autenticación
- [ ] CRUD operations funcionan correctamente
- [ ] Tests k6 pasan exitosamente
- [ ] Variables de entorno configuradas
- [ ] MongoDB conectado
- [ ] Logs muestran app saludable

## 🆘 Contacto y Ayuda

Si tienes problemas:
1. Revisa los logs en Railway Dashboard
2. Ejecuta tests k6 para diagnosticar
3. Verifica variables de entorno
4. Consulta la documentación de [Railway](https://docs.railway.app)