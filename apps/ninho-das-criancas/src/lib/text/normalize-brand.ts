const BRAND_PATTERNS = [
  /children['’]s\s+nest/gi,
  /childeren['’]s\s+net/gi,
  /children['’]s\s+net/gi,
];

const BRAND_NAME = "Ninho das Crianças";

export function normalizeBrandName(input: string): string {
  let out = input;
  for (const pattern of BRAND_PATTERNS) {
    out = out.replace(pattern, BRAND_NAME);
  }
  return out;
}
