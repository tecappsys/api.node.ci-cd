#!/bin/bash

# Variables
REPO=$1
COPY_DIR=$2
LOG_FILE="/var/www/tecappsys/api/node/api.node.ci-cd/deploy.log"

# Función para escribir logs con salto de línea
log() {
    echo -e "\n$(date '+%Y-%m-%d %H:%M:%S'): \n $1" | tee -a $LOG_FILE
}

# Habilitar detección de errores en tuberías (evita que errores silenciosos pasen desapercibidos)
set -o pipefail

# Función para ejecutar el despliegue estándar (git pull, npm install, build)
deploy() {
    local dir=$1
    local needs_build=$2
    log "📂 Moviéndose a $dir"
    cd "$dir"

    log "🔄 Ejecutando git pull..."
    git pull 2>&1 | tee -a $LOG_FILE

    log "📦 Instalando dependencias..."
    npm install 2>&1 | tee -a $LOG_FILE

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
    *)
        abort "Repositorio no reconocido: $REPO"
        ;;
esac
