#!/bin/bash

# Variables
REPO=$1
BASE_DIR="/var/www/tecappsys/portfolio"
LOG_FILE="/var/www/tecappsys/api/node/api.node.ci-cd/deploy.log"

# Función para escribir logs
log() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" >> $LOG_FILE
}

log "Recibida solicitud de despliegue para $REPO"

# Lógica de despliegue según el repositorio
case $REPO in
    "app.portal")
        cd "$BASE_DIR/home/app.portal" || exit
        git pull origin main
        npm install
        npm run build
        log "Despliegue exitoso para $REPO"
        ;;
    "api.node.mongo")
        cd "/var/www/tecappsys/api.node.mongo" || exit
        git pull origin main
        npm install
        pm2 restart api
        log "Despliegue exitoso para $REPO"
        ;;
    "app.angular.resume")
        cd "$BASE_DIR/angular/resume" || exit
        git pull origin main
        npm install
        npm run build
        log "Despliegue exitoso para $REPO"
        ;;
    "app.react.portal")
        cd "$BASE_DIR/react/portal" || exit
        git pull origin main
        npm install
        npm run build
        log "Despliegue exitoso para $REPO"
        ;;
    *)
        log "Repositorio no reconocido: $REPO"
        exit 1
        ;;
esac

exit 0
