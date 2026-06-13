export const countryNames: Record<string, Record<string, string>> = {
  SD: { en: "Sudan", ar: "السودان", de: "Sudan" },
  YE: { en: "Yemen", ar: "اليمن", de: "Jemen" },
  PS: { en: "Palestine", ar: "فلسطين", de: "Palästina" },
};

export function getCountryName(countryCode: string, locale: string): string {
  return countryNames[countryCode]?.[locale] ?? countryCode;
}