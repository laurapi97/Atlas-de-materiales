export const APP_NAME = 'Atlas de Materiales'

export const VOCAB = {
  categories: [
    'Piedra', 'Madera', 'Metal', 'Cerámica', 'Vidrio',
    'Textiles', 'Hormigón', 'Compuestos', 'Materiales reciclados', 'Materiales naturales',
  ],
  tactile:   ['rugoso', 'suave', 'liso', 'poroso', 'flexible', 'rígido'],
  thermal:   ['cálido', 'frío', 'neutro'],
  spatial:   ['interior', 'exterior', 'tránsito alto', 'acústico', 'húmedo', 'residencial', 'comercial'],
  durability:['baja', 'media', 'alta'],
  emotions:  ['calma', 'confort', 'sofisticación', 'rusticidad', 'monumentalidad', 'naturalidad', 'introspección', 'dinamismo'],
} as const
