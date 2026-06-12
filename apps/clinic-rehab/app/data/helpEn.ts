export interface BankDetailRowEn {
  label: string;
  value: string;
  field: string;
}

export interface MaterialNeedItemEn {
  name: string;
  status: "critical" | "always" | "normal";
}

export interface MaterialNeedCategoryEn {
  category: string;
  items: MaterialNeedItemEn[];
}

export const bankDetails: BankDetailRowEn[] = [
  { label: "Recipient", value: "KNP 'Children Clinical Center Sails of Life'", field: "recipient" },
  { label: "EDRPOU Code", value: "12345678", field: "edrpou" },
  { label: "Recipient Bank", value: "JSC 'PrivatBank'", field: "bank" },
  { label: "IBAN Account", value: "UA893052990000026001234567890", field: "iban" },
  { label: "Purpose of Payment", value: "Charity donation for the center's statutory activity", field: "purpose" },
];

export const materialNeeds: MaterialNeedCategoryEn[] = [
  {
    category: "Care & Hygiene Products",
    items: [
      { name: "Baby diapers (sizes 4, 5, 6)", status: "critical" },
      { name: "Hypoallergenic wet wipes", status: "always" },
      { name: "Disposable underpads (60x90 cm)", status: "critical" },
      { name: "Liquid soap and baby shampoos", status: "always" },
    ],
  },
  {
    category: "Rehabilitation Materials & Toys",
    items: [
      { name: "Sensory balls and balance boards", status: "critical" },
      { name: "Educational wooden toys (puzzles, busy boards)", status: "always" },
      { name: "Weights and vests for sensory integration", status: "normal" },
      { name: "Kinetic sand and plasticine", status: "always" },
    ],
  },
  {
    category: "Disposable Rehab Consumables",
    items: [
      { name: "Disposable paper sheets in rolls for massage couches", status: "critical" },
      { name: "Baby massage oils and hypoallergenic creams", status: "always" },
      { name: "Dressings and elastic kinesio patches", status: "always" },
      { name: "Safe disinfectants for toys and surfaces", status: "always" },
    ],
  },
];
