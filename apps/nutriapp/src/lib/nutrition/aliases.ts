// Alias format:
//   "termino usado por el usuario en Peru": "consulta canonica en ingles para FDC"
//
// To add an alias:
// 1. Add the normalized Spanish term as the key. Accents are optional because
//    normalizeFoodSearchTerm removes them before lookup.
// 2. Use an English query that FoodData Central understands.
// 3. Test with: GET /api/foods/search?q=<alias>
//
// Future path: if aliases move to a food_aliases table, load those rows before
// this object and let DB aliases override code aliases.
export const FOOD_ALIASES_ES_PE: Record<string, string> = {
  // Fruits
  palta: 'avocado',
  aguacate: 'avocado',
  mandarina: 'tangerine',
  naranja: 'orange',
  mango: 'mango',
  uva: 'grape',
  uvas: 'grape',
  papaya: 'papaya',
  pina: 'pineapple',
  manzana: 'apple',
  pera: 'pear',
  sandia: 'watermelon',
  melon: 'melon',
  lucuma: 'lucuma',
  granadilla: 'passion fruit',
  maracuya: 'passion fruit',
  chirimoya: 'cherimoya',
  tuna: 'prickly pear',
  fresa: 'strawberry',
  fresas: 'strawberry',
  platano: 'banana',
  banana: 'banana',

  // Tubers and starchy vegetables
  camote: 'sweet potato',
  batata: 'sweet potato',
  yuca: 'cassava',
  mandioca: 'cassava',
  papa: 'potato',
  patata: 'potato',
  olluco: 'ulluco',
  mashua: 'mashua',

  // Corn and grains
  choclo: 'corn',
  mote: 'hominy',
  maiz: 'corn',
  maize: 'corn',
  cancha: 'corn nuts',
  arroz: 'rice cooked',
  quinua: 'quinoa cooked',
  quinoa: 'quinoa cooked',
  avena: 'oats',

  // Legumes
  frejol: 'bean',
  frijol: 'bean',
  frejoles: 'bean',
  frijoles: 'bean',
  lenteja: 'lentils cooked',
  lentejas: 'lentils cooked',
  garbanzo: 'chickpeas cooked',
  garbanzos: 'chickpeas cooked',
  pallares: 'lima beans cooked',
  pallar: 'lima beans cooked',
  arveja: 'peas cooked',
  arvejas: 'peas cooked',

  // Proteins
  pollo: 'chicken',
  pechuga: 'chicken breast',
  'pechuga de pollo': 'chicken breast',
  res: 'beef',
  carne: 'beef',
  cerdo: 'pork',
  chancho: 'pork',
  pescado: 'fish',
  'pescado blanco': 'whitefish',
  atun: 'tuna',
  bonito: 'bonito fish',
  jurel: 'mackerel',
  caballa: 'mackerel',
  huevo: 'egg',
  huevos: 'egg',

  // Dairy and basics
  'pan frances': 'french bread',
  'pan de molde': 'white bread',
  'pan integral': 'whole wheat bread',
  'queso fresco': 'queso fresco',
  queso: 'cheese',
  leche: 'milk',
  'leche evaporada': 'evaporated milk',
  yogurt: 'yogurt plain',
  yogur: 'yogurt plain',
  mantequilla: 'butter',
  aceite: 'vegetable oil',
  'aceite de oliva': 'olive oil',
};

export function normalizeFoodSearchTerm(term: string): string {
  return term
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, ' ');
}

export function resolveFoodSearchAlias(term: string): string {
  const normalized = normalizeFoodSearchTerm(term);
  return FOOD_ALIASES_ES_PE[normalized] ?? normalized;
}

export function foodResultPriority(name: string, query: string): number {
  const normalizedName = normalizeFoodSearchTerm(name);
  const normalizedQuery = normalizeFoodSearchTerm(query);

  if (normalizedName.includes('all commercial varieties')) return 0;
  if (normalizedName === normalizedQuery) return 1;
  if (normalizedName.startsWith(`${normalizedQuery}, raw`)) return 2;
  if (normalizedName.startsWith(`${normalizedQuery}s, raw`)) return 2;
  if (normalizedName.includes(`${normalizedQuery}, raw`)) return 3;
  if (normalizedName.includes(`${normalizedQuery}s, raw`)) return 3;
  if (normalizedName.includes(normalizedQuery)) return 4;
  return 5;
}

export function sortFoodResultsByRelevance<T extends { name?: string; description?: string; kcal?: number }>(
  foods: T[],
  query: string
): T[] {
  return [...foods].sort((a, b) => {
    const nameA = a.name ?? a.description ?? '';
    const nameB = b.name ?? b.description ?? '';
    const priorityA = foodResultPriority(nameA, query);
    const priorityB = foodResultPriority(nameB, query);
    if (priorityA !== priorityB) return priorityA - priorityB;
    const hasKcalA = (a.kcal ?? 0) > 0;
    const hasKcalB = (b.kcal ?? 0) > 0;
    if (hasKcalA !== hasKcalB) return hasKcalA ? -1 : 1;
    return nameA.localeCompare(nameB);
  });
}

export function getFoodDisplayName(name: string): string {
  const normalized = normalizeFoodSearchTerm(name);

  if (normalized === 'avocados, raw, all commercial varieties') {
    return 'Palta (promedio comercial)';
  }
  if (normalized === 'avocados, raw, california') {
    return 'Palta California / Hass';
  }
  if (normalized === 'avocados, raw, florida') {
    return 'Palta Florida';
  }
  if (normalized.includes('avocado') && normalized.includes('hass')) {
    return 'Palta Hass';
  }
  if (normalized.includes('oil, avocado') || normalized.includes('avocado oil')) {
    return 'Aceite de palta';
  }
  if (normalized.includes('sweet potato') && normalized.includes('raw')) {
    return 'Camote crudo';
  }
  if (normalized.includes('sweet potato') && normalized.includes('cooked')) {
    return 'Camote cocido';
  }
  if (normalized.includes('corn') && normalized.includes('sweet') && normalized.includes('raw')) {
    return 'Choclo / maiz dulce crudo';
  }
  if (normalized.includes('corn') && normalized.includes('sweet') && normalized.includes('cooked')) {
    return 'Choclo / maiz dulce cocido';
  }
  if (normalized.includes('strawberries') || normalized.includes('strawberry')) {
    return 'Fresa';
  }
  if (normalized.includes('bananas') || normalized.includes('banana')) {
    return 'Platano / banana';
  }
  if (normalized.includes('potatoes') || normalized.includes('potato')) {
    if (normalized.includes('baked')) return 'Papa al horno';
    if (normalized.includes('boiled') || normalized.includes('cooked')) return 'Papa cocida';
    if (normalized.includes('raw')) return 'Papa cruda';
  }
  if (normalized.includes('cassava')) {
    return normalized.includes('cooked') ? 'Yuca cocida' : 'Yuca';
  }
  if (normalized.includes('rice') && normalized.includes('cooked')) {
    return 'Arroz cocido';
  }
  if (normalized.includes('quinoa') && normalized.includes('cooked')) {
    return 'Quinua cocida';
  }
  if (normalized.includes('lentils')) {
    return 'Lentejas';
  }
  if (normalized.includes('chickpeas')) {
    return 'Garbanzo';
  }
  if (normalized.includes('lima beans')) {
    return 'Pallares / lima beans';
  }
  if (normalized.includes('french bread')) {
    return 'Pan frances';
  }
  if (normalized.includes('evaporated milk')) {
    return 'Leche evaporada';
  }
  if (normalized.includes('yogurt') && normalized.includes('plain')) {
    return 'Yogurt natural';
  }

  return name;
}
