export interface BankDetailRow {
  label: string;
  value: string;
  field: string;
}

export interface MaterialNeedItem {
  name: string;
  status: "critical" | "always" | "normal";
}

export interface MaterialNeedCategory {
  category: string;
  items: MaterialNeedItem[];
}

export const bankDetails: BankDetailRow[] = [
  { label: "Отримувач", value: "КНП 'Дитячий клінічний центр Вітрила Життя'", field: "recipient" },
  { label: "Код ЄДРПОУ", value: "12345678", field: "edrpou" },
  { label: "Банк отримувача", value: "АТ КБ 'ПриватБанк'", field: "bank" },
  { label: "IBAN рахунку", value: "UA893052990000026001234567890", field: "iban" },
  { label: "Призначення платежу", value: "Благодійний внесок на статутну діяльність центру", field: "purpose" },
];

export const materialNeeds: MaterialNeedCategory[] = [
  {
    category: "Засоби догляду та гігієни",
    items: [
      { name: "Підгузки дитячі (розміри 4, 5, 6)", status: "critical" },
      { name: "Вологі серветки гіпоалергенні", status: "always" },
      { name: "Одноразові пелюшки (60х90 см)", status: "critical" },
      { name: "Рідке мило та дитячі шампуні", status: "always" },
    ],
  },
  {
    category: "Реабілітаційні матеріали та іграшки",
    items: [
      { name: "Сенсорні м'ячі та балансири", status: "critical" },
      { name: "Розвиваючі дерев'яні іграшки (пазли, бізіборди)", status: "always" },
      { name: "Обважнювачі та жилети для сенсорної інтеграції", status: "normal" },
      { name: "Кінетичний пісок та пластилін", status: "always" },
    ],
  },
  {
    category: "Витратні реабілітаційні матеріали",
    items: [
      { name: "Одноразові простирадла в рулонах для кушеток", status: "critical" },
      { name: "Масажні дитячі олії та гіпоалергенні креми", status: "always" },
      { name: "Перев'язувальні матеріали та еластичні пластирі", status: "always" },
      { name: "Безпечні антисептики для іграшок та поверхонь", status: "always" },
    ],
  },
];
