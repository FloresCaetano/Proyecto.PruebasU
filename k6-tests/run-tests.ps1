# Scripts k6 para Railway
# Asegúrate de tener k6 instalado: https://k6.io/docs/getting-started/installation/

Write-Host "🚀 K6 Tests for Railway Deployment" -ForegroundColor Cyan
Write-Host "===================================" -ForegroundColor Cyan

# Test básico para verificar que Railway está funcionando
function Test-Railway {
    param(
        [string]$Url = $null
    )
    
    Write-Host "`n🧪 Running Railway Health Check..." -ForegroundColor Yellow
    
    if ($Url) {
        $env:RAILWAY_URL = $Url
        Write-Host "Using custom URL: $Url" -ForegroundColor Green
    }
    
    k6 run k6-tests/railway-test.js
}

# Test de carga completo
function Test-Load {
    param(
        [string]$Url = $null
    )
    
    Write-Host "`n⚡ Running Load Test..." -ForegroundColor Yellow
    
    if ($Url) {
        $env:RAILWAY_URL = $Url
        Write-Host "Using custom URL: $Url" -ForegroundColor Green
    }
    
    k6 run k6-tests/load-test.js
}

# Test de stress
function Test-Stress {
    param(
        [string]$Url = $null
    )
    
    Write-Host "`n💪 Running Stress Test..." -ForegroundColor Yellow
    
    if ($Url) {
        $env:RAILWAY_URL = $Url
        Write-Host "Using custom URL: $Url" -ForegroundColor Green
    }
    
    # Crear y ejecutar test de stress temporal
    $stressTest = @"
import { config } from './k6-tests/config.js';
import { sleep, group } from 'k6';
import { login } from './k6-tests/auth_k6.js';

export const options = config.stressTestOptions;

export default function () {
    const token = login(config.baseUrl, config.auth.adminEmail, config.auth.adminPassword);
    if (token) {
        // Test básico durante el stress
        sleep(Math.random() * 2);
    }
}
"@
    
    $stressTest | Out-File -FilePath "temp-stress-test.js" -Encoding UTF8
    k6 run temp-stress-test.js
    Remove-Item "temp-stress-test.js" -ErrorAction SilentlyContinue
}

# Mostrar ayuda
function Show-Help {
    Write-Host "`n📋 Available Commands:" -ForegroundColor Cyan
    Write-Host "  Test-Railway [URL]  - Health check for Railway deployment"
    Write-Host "  Test-Load [URL]     - Load test with multiple users"
    Write-Host "  Test-Stress [URL]   - Stress test with heavy load"
    Write-Host "  Show-Help           - Show this help"
    Write-Host "`n🔧 Examples:" -ForegroundColor Yellow
    Write-Host "  Test-Railway"
    Write-Host "  Test-Railway 'https://myapp.up.railway.app'"
    Write-Host "  Test-Load"
    Write-Host "`n💡 Set your Railway URL as environment variable:" -ForegroundColor Green
    Write-Host "  `$env:RAILWAY_URL = 'https://your-app.up.railway.app'"
}

# Ejecutar comando por defecto
if ($args.Count -eq 0) {
    Show-Help
} else {
    switch ($args[0]) {
        "railway" { Test-Railway $args[1] }
        "load" { Test-Load $args[1] }
        "stress" { Test-Stress $args[1] }
        "help" { Show-Help }
        default { 
            Write-Host "Unknown command: $($args[0])" -ForegroundColor Red
            Show-Help 
        }
    }
}