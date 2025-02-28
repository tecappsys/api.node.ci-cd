#!/bin/bash

# Variables
REPO=$1
BASE_DIR="/var/www/tecappsys/portfolio"
LOG_FILE="/var/www/tecappsys/api/node/api.node.ci-cd/deploy.log"

# Función para escribir logs
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

log "🔹 Recibida solicitud de despliegue para $REPO"

# Lógica de despliegue según el repositorio
case $REPO in
    "app.portal")
        log "📂 Moviéndose a $BASE_DIR/home/app.portal"
        cd "$BASE_DIR/home/app.portal" || exit

        log "🔄 Ejecutando git pull..."
        git pull origin main 2>&1 | tee -a $LOG_FILE

        log "📦 Instalando dependencias..."
        npm install 2>&1 | tee -a $LOG_FILE

        log "⚙️ Ejecutando build..."
        npm run build 2>&1 | tee -a $LOG_FILE

        log "✅ Despliegue exitoso para $REPO"
        ;;
    
    "api.node.mongo")
        log "📂 Moviéndose a /var/www/tecappsys/api.node.mongo"
        cd "/var/www/tecappsys/api.node.mongo" || exit

        log "🔄 Ejecutando git pull..."
        git pull origin main 2>&1 | tee -a $LOG_FILE

        log "📦 Instalando dependencias..."
        npm install 2>&1 | tee -a $LOG_FILE

        log "🚀 Reiniciando servicio con PM2..."
        pm2 restart api 2>&1 | tee -a $LOG_FILE

        log "✅ Despliegue exitoso para $REPO"
        ;;

    "app.angular.resume")
        log "📂 Moviéndose a $BASE_DIR/angular/resume"
        cd "$BASE_DIR/angular/resume" || exit

        log "🔄 Ejecutando git pull..."
        git pull origin main 2>&1 | tee -a $LOG_FILE

        log "📦 Instalando dependencias..."
        npm install 2>&1 | tee -a $LOG_FILE

        log "⚙️ Ejecutando build..."
        npm run build 2>&1 | tee -a $LOG_FILE

        log "✅ Despliegue exitoso para $REPO"
        ;;

    "app.react.portal")
        log "📂 Moviéndose a $BASE_DIR/react/portal"
        cd "$BASE_DIR/react/portal" || exit

        log "🔄 Ejecutando git pull..."
        git pull origin main 2>&1 | tee -a $LOG_FILE

        log "📦 Instalando dependencias..."
        npm install 2>&1 | tee -a $LOG_FILE

        log "⚙️ Ejecutando build..."
        npm run build 2>&1 | tee -a $LOG_FILE

        log "✅ Despliegue exitoso para $REPO"
        ;;
    
    *)
        log "❌ Repositorio no reconocido: $REPO"
        exit 1
        ;;
esac