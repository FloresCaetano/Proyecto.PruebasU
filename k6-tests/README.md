# K6 Tests para Railway

## 🚀 Configuración para Railway

### 1. Instalar k6
```bash
# Windows (usando Chocolatey)
choco install k6

# Windows (usando winget)
winget install k6

# O descarga directa desde: https://k6.io/docs/getting-started/installation/
```

### 2. Configurar URL de Railway
```powershell
# Configura tu URL de Railway como variable de entorno
$env:RAILWAY_URL = "https://TU-PROYECTO.up.railway.app"
```

## 📋 Tests Disponibles

### 🧪 Test de Verificación de Railway
Verifica que tu deployment en Railway esté funcionando correctamente:
```powershell
k6 run k6-tests/railway-test.js
```

### ⚡ Test de Carga
Ejecuta pruebas de carga con múltiples usuarios:
```powershell
k6 run k6-tests/load-test.js
```

### 💪 Test Individual de Endpoints
```powershell
k6 run k6-tests/auth_k6.js
k6 run k6-tests/autos_k6.js
k6 run k6-tests/cliente_k6_test.js
k6 run k6-tests/vendor_k6_test.js
k6 run k6-tests/concesionarias_k6.js
```

## 🔧 Scripts de Automatización

### Usar el script de PowerShell:
```powershell
# Ejecutar test de verificación
.\k6-tests\run-tests.ps1 railway

# Ejecutar test de carga
.\k6-tests\run-tests.ps1 load

# Ejecutar test de stress
.\k6-tests\run-tests.ps1 stress

# Con URL personalizada
.\k6-tests\run-tests.ps1 railway "https://tu-app.up.railway.app"
```

## 🎯 Qué Verifican los Tests

### Railway Test (`railway-test.js`)
- ✅ Servidor responde correctamente
- ✅ Conexión a MongoDB funcional
- ✅ Sistema de autenticación operativo
- ✅ Endpoints protegidos accesibles
- ✅ Operaciones de escritura en base de datos

### Load Test (`load-test.js`)
- ✅ CRUD completo de todos los modelos
- ✅ Autenticación bajo carga
- ✅ Performance de endpoints
- ✅ Manejo de múltiples usuarios concurrentes

## 🔍 Interpretación de Resultados

### ✅ Éxito
- `checks: 100%` - Todas las validaciones pasaron
- `http_req_failed: 0%` - No hay requests fallidos
- `p(95) < 2000ms` - 95% de requests responden en menos de 2 segundos

### ❌ Problemas Comunes

#### Error de Conexión
```
ERRO[0001] GoError: Get "https://...": dial tcp: no such host
```
**Solución**: Verifica la URL de Railway

#### Error de Autenticación
```
Login failed: 401 {"msg":"Credenciales inválidas"}
```
**Solución**: Asegúrate de que MongoDB tenga el usuario admin creado

#### Timeouts
```
http_req_duration: p(95) > 2000ms
```
**Solución**: Railway puede tardar más, es normal en algunos casos

## 📊 Monitoreo en Railway

1. Ve a tu Dashboard de Railway
2. Selecciona tu proyecto
3. Ve a la pestaña "Metrics"
4. Observa CPU/Memory durante los tests

## 🚨 Troubleshooting

### Test Fallando por Usuario Admin
Si el test falla por credenciales:
```bash
cd Backend
npm run seed  # Esto creará el usuario admin
```

### URL Incorrecta
Verifica tu URL en Railway:
1. Ve a tu proyecto en Railway
2. Ve a la pestaña "Settings"
3. Copia la URL pública

### Variables de Entorno
Asegúrate de tener configurado en Railway:
- `MONGO_URL` o `DATABASE_URL` (Railway lo configurará automáticamente si agregaste MongoDB)
- `JWT_SECRET`
- `PORT` (Railway lo asigna automáticamente)

## 💡 Tips para Railway

1. **Cold Starts**: El primer request puede ser lento (normal)
2. **MongoDB**: Usa MongoDB Atlas o el plugin de Railway
3. **Logs**: Usa `railway logs` para ver logs en tiempo real
4. **Scaling**: Los tests de stress pueden activar el autoscaling