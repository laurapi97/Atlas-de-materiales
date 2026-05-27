export const APP_NAME = 'Atlas de Materiales'

export const VOCAB = {
  familias: [
    'Piedra', 'Madera', 'Metal', 'Cerámica', 'Vidrio',
    'Textiles', 'Hormigón', 'Compuestos', 'Materiales reciclados', 'Materiales naturales',
  ],
  atmosfera: [
    'calma', 'confort', 'sofisticación', 'rusticidad',
    'monumentalidad', 'naturalidad', 'introspección', 'dinamismo',
  ],
  scores: [
    { key: 'minHumedad',      label: 'Humedad',      field: 'puntajeHumedad' },
    { key: 'minDurabilidad',  label: 'Durabilidad',  field: 'puntajeDurabilidad' },
    { key: 'minMantenimiento',label: 'Mantenimiento',field: 'puntajeMantenimiento' },
    { key: 'minCalidez',      label: 'Calidez',      field: 'puntajeCalidez' },
    { key: 'minExpresividad', label: 'Expresividad', field: 'puntajeExpresividad' },
    { key: 'minAcustica',     label: 'Acústica',     field: 'puntajeAcustica' },
    { key: 'minSostenibilidad','label': 'Sostenibilidad', field: 'puntajeSostenibilidad' },
  ] as const,
} as const
