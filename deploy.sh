#!/bin/bash

# Variables
REPO=$1
BASE_DIR="/var/www/tecappsys/portfolio"
LOG_FILE="/var/www/tecappsys/api/node/api.node.ci-cd/deploy.log"

# Función para escribir logs con salto de línea
log() {
    echo -e "\n$(date '+%Y-%m-%d %H:%M:%S'): \n $1" | tee -a $LOG_FILE
}

# Función para manejar errores y abortar
abort() {
    log "❌ ERROR: $1"
    log "🛑 Deteniendo servicio ci-cd en PM2..."
    pm2 stop ci-cd 2>&1 | tee -a $LOG_FILE
    exit 1
}

# Habilitar detección de errores en tuberías (evita que errores silenciosos pasen desapercibidos)
set -o pipefail

# Función para ejecutar el despliegue estándar (git pull, npm install, build)
deploy() {
    local dir=$1
    local needs_build=$2
    log "📂 Moviéndose a $dir"
    cd "$dir" || abort "No se pudo acceder a $dir"

    log "🔄 Ejecutando git pull..."
    git pull origin 2>&1 | tee -a $LOG_FILE || abort "git pull falló"

    log "📦 Instalando dependencias..."
    npm install 2>&1 | tee -a $LOG_FILE || abort "npm install falló"

    log "✅ Despliegue exitoso para $REPO"
}

log "🔹 Recibida solicitud de despliegue para $REPO"

# Lógica de despliegue según el repositorio
case $REPO in
    "app.portal")
        deploy "$BASE_DIR/home/app.portal" true
        ;;
    
    "api.node.mongo")
        deploy "/var/www/tecappsys/api.node.mongo" false
        log "🚀 Reiniciando servicio con PM2..."
        pm2 restart api 2>&1 | tee -a $LOG_FILE || abort "pm2 restart falló"
        ;;
    
    "app.angular.resume")
        deploy "$BASE_DIR/angular/resume" true
        ;;
    
    "app.react.portal")
        deploy "$BASE_DIR/react/portal" true
        ;;
    
    *)
        abort "Repositorio no reconocido: $REPO"
        ;;
esac
