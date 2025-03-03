#!/bin/bash

# Habilitar modo estricto para manejar errores
set -euo pipefail

# Variables recibidas como argumentos
REPO=${1:-}
COPY_PATH=${2:-}
REPO_PATH=${3:-}
LOG_FILE=${4:-}

# Función para escribir logs con timestamp
log() {
    echo -e "$(date '+%Y-%m-%d %H:%M:%S') | $1" | tee -a "$LOG_FILE"
}

# Validación inicial
if [[ -z "$REPO" || -z "$COPY_PATH" || -z "$REPO_PATH" ]]; then
    log "🚫 Parámetros insuficientes. Uso: ./deploy.sh <REPO> <COPY_PATH> <REPO_PATH> <LOG_FILE>"
    exit 1
fi

# Iniciar despliegue
log "📢 Iniciando despliegue para el repositorio: $REPO"

# Verificar si el directorio del repositorio existe
if [[ -d "$REPO_PATH" ]]; then
    log "📂 Moviéndose al directorio del repositorio: $REPO_PATH"
    cd "$REPO_PATH"

    # Actualizar el repositorio
    log "🔄 Ejecutando 'git pull'..."
    if git pull 2>&1 | tee -a "$LOG_FILE"; then
        log "✅ Repositorio actualizado correctamente."
    else
        log "🚫 Error al actualizar el repositorio."
        exit 1
    fi
else
    log "⚠️ El directorio del repositorio $REPO_PATH no existe."
    exit 1
fi

# Verificar si el directorio destino existe
if [[ -d "$COPY_PATH" ]]; then
    log "⏳ Borrando los archivos en $COPY_PATH"
    rm -rf "${COPY_PATH:?}"/*  # Precaución con rutas vacías
    log "✅ Archivos eliminados en $COPY_PATH"

    log "⏳ Copiando archivos de $REPO_PATH/dist* a $COPY_PATH"
    if cp -r "$REPO_PATH"/dist/* "$COPY_PATH"; then
        log "✅ Archivos copiados exitosamente a $COPY_PATH"
    else
        log "🚫 Error al copiar los archivos al directorio destino $COPY_PATH"
        exit 1
    fi
else
    log "⚠️ El directorio destino $COPY_PATH no existe"
    exit 1
fi

exit