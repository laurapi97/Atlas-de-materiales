export const APP_NAME = 'Atlas de Materiales'

export const MATERIAL_CATEGORIES = [
  { value: 'madera', label: 'Madera' },
  { value: 'metal', label: 'Metal' },
  { value: 'piedra', label: 'Piedra' },
  { value: 'tela', label: 'Tela' },
  { value: 'vidrio', label: 'Vidrio' },
  { value: 'ceramica', label: 'Cerámica' },
  { value: 'plastico', label: 'Plástico' },
  { value: 'otro', label: 'Otro' },
] as const

export const MATERIAL_FINISHES = [
  { value: 'mate', label: 'Mate' },
  { value: 'brillante', label: 'Brillante' },
  { value: 'satinado', label: 'Satinado' },
  { value: 'texturizado', label: 'Texturizado' },
] as const
