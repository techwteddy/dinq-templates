export interface TeamMember {
  id: number;
  name: string;
  role: string;
  category: string;
  image: string;
}

export const teamMembers: TeamMember[] = [
  { id: 1, name: "Тетяна Шевченко", role: "В.о. директора, лікар ФРМ, лікар-психіатр дитячий, лікар невролог дитячий", category: "Лікарі", image: "/images/shevckenko.webp" },
  { id: 2, name: "Левківська Кароліна", role: "Завідувач відділенням медичної реабілітації передчасно народжених та перших трьох років життя, Лікар ФРМ", category: "Лікарі", image: "/images/Levkivska.webp" },
  { id: 3, name: "Машталер Тетяна", role: "Завідувач відділенням стаціонарної медичної реабілітації, невролог дитячий, лікар ФРМ", category: "Лікарі", image: "/images/Mashtaler.webp" },
  { id: 4, name: "Кобилінська Віра", role: "Лікар-психіатр дитячий", category: "Лікарі", image: "/images/Kobulinska.webp" },
  { id: 5, name: "Шевчук Євгенія", role: "Фізичний терапевт, ерготерапевт", category: "Професіонали", image: "/images/Shevchyk.webp" },
  { id: 6, name: "Щербак Олександр", role: "Лікар-хірург дитячий", category: "Лікарі", image: "/images/Sherbak.webp" },
  { id: 7, name: "Фурман Олесандра", role: "Клінічний психолог", category: "Професіонали", image: "/images/Furman.webp" },
  { id: 8, name: "Шадура Світлана", role: "Асистент фізичного терапевта", category: "Фахівці з реабілітації", image: "/images/Shadyra.webp" },
  { id: 9, name: "Михальчук Віта", role: "Асистент ерготерапевта", category: "Фахівці з реабілітації", image: "/images/Muchalchyk.webp" },
  { id: 10, name: "Гераймович Світлана", role: "Вихователь", category: "Педагогічний персонал", image: "/images/Heraimovich.webp" },
  { id: 11, name: "Бондарчук Олена", role: "Вихователь", category: "Педагогічний персонал", image: "/images/Bondarchyk.webp" },
  { id: 12, name: "Дмитрук Алла", role: "Вчитель Монтессорі", category: "Педагогічний персонал", image: "/images/Dmitryk.webp" },
  { id: 13, name: "Чумакевич Оксана", role: "Логопед", category: "Психологи та Логопеди", image: "/images/Chymackevich.webp" },
  { id: 14, name: "Ковальова Ольга", role: "Логопед", category: "Психологи та Логопеди", image: "/images/Kovaloyva.webp" },
  { id: 15, name: "Зозуля Світлана", role: "Вчитель - дефектолог", category: "Педагогічний персонал", image: "/images/Zozyla.webp" },
  { id: 16, name: "Матвієнко Ганна", role: "Музичний керівник", category: "Педагогічний персонал", image: "/images/Maatvienko.webp" },
  { id: 17, name: "Мельничук Дарина", role: "Вчитель - дефектолог", category: "Педагогічний персонал", image: "/images/Melnichyk.webp" }
];
