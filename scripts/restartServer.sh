#!/bin/bash

# Habilitar modo estricto para manejar errores
set -euo pipefail

# Variables recibidas como argumentos
REPO=${1:-}
REPO_PATH=${2:-}
LOG_FILE=${3:-}

# Función para escribir logs con timestamp
log() {
    echo -e "$(date '+%Y-%m-%d %H:%M:%S') | $1" | tee -a "$LOG_FILE"
}

# Validación inicial
if [[ -z "$REPO" || -z "$REPO_PATH" ]]; then
    log "🚫 Parámetros insuficientes. Uso: ./deploy.sh <REPO> <REPO_PATH> <LOG_FILE>"
    exit 1
fi

# Iniciar despliegue
log "📢 Iniciando despliegue para el repositorio: $REPO"

# Verificar si el directorio del repositorio existe
if [[ -d "$REPO_PATH" ]]; then
    log "📂 Moviéndose al directorio del repositorio: $REPO_PATH"
    cd "$REPO_PATH"

    log "🗑️ Borrando /dist"
    if rm -rf "${REPO_PATH:?}"/dist 2>&1 | tee -a "$LOG_FILE"; then
        log "✅ /dist borrado correctamente."
    else
        log "🚫 Error al borrar /dist"
        exit 1
    fi

    log "🔄 Ejecutando 'git pull'..."
    if git pull 2>&1 | tee -a "$LOG_FILE"; then
        log "✅ Repositorio actualizado correctamente."
    else
        log "🚫 Error al actualizar el repositorio."
        exit 1
    fi

    log "📦 Instalando dependencias..."
    if npm install 2>&1 | tee -a "$LOG_FILE"; then
        log "✅ Dependencias instalandas correctamente."
    else
        log "🚫 Error al instalar dependencias."
        exit 1
    fi

    log "🛠️ Build del repo..."
    if npm run build 2>&1 | tee -a "$LOG_FILE"; then
        log "✅ Build completado correctamente."
    else
        log "🚫 Error en el build."
        exit 1
    fi

    log "🚀 Reiniciando servicio con PM2..."
    if pm2 restart node-main | tee -a "$LOG_FILE"; then
        log "✅ Node-Main reiniciado correctamente."
    else
        log "🚫 Error al reiniciado Node-Main."
        exit 1
    fi

else
    log "⚠️ El directorio del repositorio $REPO_PATH no existe."
    exit 1
fi

exit
