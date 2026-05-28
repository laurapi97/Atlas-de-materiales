#!/usr/bin/env bash
set -e

LOG="deploy.log"
TIMESTAMP=$(date '+%Y-%m-%d %H:%M:%S')

echo "================================================" | tee "$LOG"
echo "  DEPLOY — Atlas de Materiales" | tee -a "$LOG"
echo "  $TIMESTAMP" | tee -a "$LOG"
echo "================================================" | tee -a "$LOG"
echo "" | tee -a "$LOG"

echo "▶ Verificando tipos con TypeScript..." | tee -a "$LOG"
npx tsc -b 2>&1 | tee -a "$LOG"
echo "✓ TypeScript OK" | tee -a "$LOG"
echo "" | tee -a "$LOG"

echo "▶ Construyendo bundle de producción con Vite..." | tee -a "$LOG"
npx vite build 2>&1 | tee -a "$LOG"
echo "" | tee -a "$LOG"

echo "▶ Archivos generados en dist/:" | tee -a "$LOG"
ls -lh dist/assets/ 2>&1 | tee -a "$LOG"
echo "" | tee -a "$LOG"

echo "================================================" | tee -a "$LOG"
echo "  ✓ Build completado — $(date '+%H:%M:%S')" | tee -a "$LOG"
echo "  Log guardado en: $LOG" | tee -a "$LOG"
echo "================================================" | tee -a "$LOG"
