import type { Locale } from "@/lib/i18n/types";

export type PublicUiStrings = {
  nav: {
    intro: string;
    news: string;
    donate: string;
    donateCta: string;
    donateMobile: string;
    langSwitchKo: string;
    langSwitchPt: string;
    langSwitchAria: string;
    ariaMainNav: string;
    ariaMobileNav: string;
    menuOpen: string;
    menuClose: string;
  };
  footer: {
    title: string;
    description: string;
    adminLogin: string;
    rights: string;
  };
  provide: {
    kicker: string;
    title: string;
    subtitle: string;
    subtitleReduce: string;
    cards: { title: string; body: string }[];
  };
  dailyFlow: {
    kicker: string;
    title: string;
    lead: string;
    steps: { title: string; body: string }[];
  };
  stats: {
    kicker: string;
    title: string;
    lead: string;
    labels: { y2018: string; y2025: string; kids: string; days: string };
  };
  stories: { viewAllNews: string };
  news: {
    kicker: string;
    title: string;
    description: string;
    emptyCategory: string;
    tabsAria: string;
    tabLabels: Record<string, string>;
  };
  newsArticle: {
    backToList: string;
    relatedHeading: string;
    relatedEmpty: string;
    ctaTitle: string;
    ctaBody: string;
    donateButton: string;
    moreImagesHeading: string;
    translating: string;
    heroImageAltSuffix: string;
    extraImageAltSuffix: string;
    inlineImageAlt: string;
  };
  missionImageAlt: string;
  donate: {
    kicker: string;
    title: string;
    intro: string;
    whyHeading: string;
    whyLead: string;
    whyPoints: { title: string; body: string }[];
    useHeading: string;
    useLead: string;
    useOfFunds: { label: string; pct: string; note: string }[];
    waysHeading: string;
    bankTitle: string;
    externalTitle: string;
    externalLead: string;
    noExternalLink: string;
    faqHeading: string;
    faqs: { q: string; a: string }[];
    contactHeading: string;
    emailLabel: string;
    phoneLabel: string;
    backToNews: string;
  };
};

const ko: PublicUiStrings = {
  nav: {
    intro: "소개",
    news: "뉴스",
    donate: "후원",
    donateCta: "후원하기",
    donateMobile: "후원",
    langSwitchKo: "한",
    langSwitchPt: "PT",
    langSwitchAria: "언어 선택",
    ariaMainNav: "주요 메뉴",
    ariaMobileNav: "모바일 메뉴",
    menuOpen: "메뉴 열기",
    menuClose: "메뉴 닫기",
  },
  footer: {
    title: "어린이 둥지 · Ninho das Crianças",
    description:
      "브라질 취약 환경의 아이들을 위한 방과 후 돌봄 사역입니다.\n안전한 공간과 따뜻한 식사,\n교육과 놀이로 한 오후를 지켜 줍니다.",
    adminLogin: "관리자 로그인",
    rights: "All rights reserved.",
  },
  provide: {
    kicker: "What we provide",
    title: "무엇을 제공하나요?",
    subtitle:
      "다섯 가지 축으로 하루를 설계합니다.\n모션은 스크롤에 맞춰 가볍게 등장합니다.",
    subtitleReduce: "다섯 가지 축으로 하루를 설계합니다.",
    cards: [
      {
        title: "안전한 공간",
        body: "출입·동선·응급 연락망을 정비한 공간에서 하루를 보냅니다.",
      },
      {
        title: "따뜻한 식사",
        body: "균형 잡힌 한 끼와 간식으로 에너지를 채웁니다.",
      },
      {
        title: "교육 지원",
        body: "숙제와 독서, 작은 목표까지 곁에서 돕니다.",
      },
      {
        title: "놀이와 활동",
        body: "실내·실외 활동으로 몸과 마음을 함께 움직입니다.",
      },
      {
        title: "정서적 돌봄",
        body: "경청과 격려로 오늘의 감정을 나눌 수 있습니다.",
      },
    ],
  },
  dailyFlow: {
    kicker: "Daily flow",
    title: "하루의 흐름",
    lead: "방과 후 한 오후가 어떻게 이어지는지 타임라인으로 정리했습니다.",
    steps: [
      {
        title: "하교 후 도착",
        body: "등원·건강 체크로 하루를 안전하게 시작합니다.",
      },
      {
        title: "간식 · 식사",
        body: "에너지를 보충하고 함께 먹는 시간을 가집니다.",
      },
      {
        title: "학습 및 교육",
        body: "숙제·독서·팀 활동으로 학교를 돕습니다.",
      },
      {
        title: "다양한 활동",
        body: "미술·음악·운동 등 창의와 웃음을 나눕니다.",
      },
      {
        title: "귀가",
        body: "보호자 연락과 귀가 동선을 확인하며 마무리합니다.",
      },
    ],
  },
  stats: {
    kicker: "By the numbers",
    title: "숫자로 보는 둥지",
    lead: "후원과 기도로 쌓인 시간입니다.\n실제 수치는 운영 상황에 따라 갱신됩니다.",
    labels: {
      y2018: "사역 시작",
      y2025: "어린이 둥지 설립",
      kids: "돌봄 아동",
      days: "주당 운영",
    },
  },
  stories: { viewAllNews: "전체 뉴스 보기 →" },
  news: {
    kicker: "News",
    title: "뉴스",
    description:
      "게시 상태가 'published'인 글만 표시합니다.\nSupabase에 데이터가 없으면 샘플 글이 보입니다.",
    emptyCategory: "이 카테고리에 표시할 글이 없습니다.",
    tabsAria: "뉴스 카테고리",
    tabLabels: {
      all: "전체",
      daily: "일상",
      event: "행사",
      fundraising: "후원 소식",
      prayer: "기도 제목",
      impact: "변화 이야기",
    },
  },
  newsArticle: {
    backToList: "뉴스 목록으로",
    relatedHeading: "관련 소식",
    relatedEmpty: "표시할 관련 글이 없습니다.",
    ctaTitle: "한 아이의 오후를 함께 지켜 주세요",
    ctaBody: "후원은 식사·교육·공간 유지로 바로 이어집니다.",
    donateButton: "후원하기",
    moreImagesHeading: "추가 이미지",
    translating: "번역 중…",
    heroImageAltSuffix: "대표 이미지",
    extraImageAltSuffix: "추가 사진",
    inlineImageAlt: "본문 이미지",
  },
  missionImageAlt:
    "아이들과 함께하는 활동 모습을 상징하는 플레이스홀더 이미지",
  donate: {
    kicker: "Donate",
    title: "후원 안내",
    intro:
      "아이들의 오후를 지키는 데 쓰이는 후원의 흐름과 방법을 투명하게 안내합니다.\n계좌·링크·문의는 관리자 대시보드의「후원 문구」메뉴에서 수정할 수 있습니다.",
    whyHeading: "왜 후원이 필요한가요?",
    whyLead:
      "취약 환경의 아이들에게 방과 후 시간은 곧 안전과 자존감입니다.\n후원은 아래 영역으로 균형 있게 배분됩니다.",
    whyPoints: [
      {
        title: "식사 · 간식",
        body: "성장기에 필요한 영양과 규칙적인 식사 리듬을 지켜 줍니다.",
      },
      {
        title: "교육 · 학습",
        body: "숙제·독서·멘토링으로 학교 생활을 보조합니다.",
      },
      {
        title: "돌봄 · 안전",
        body: "등하원 동선과 응급 연락 체계로 하루를 안전하게 묶습니다.",
      },
      {
        title: "활동 · 놀이",
        body: "미술·음악·운동 등 다양한 경험으로 자존감을 쌓습니다.",
      },
      {
        title: "공간 유지",
        body: "청결·소모품·시설 보수로 매일 문을 열 수 있습니다.",
      },
    ],
    useHeading: "후원금은 어디에 쓰이나요?",
    useLead:
      "비율은 운영 계획에 따라 조정될 수 있는 예시입니다.\n아이콘 카드로 한눈에 보실 수 있습니다.",
    useOfFunds: [
      { label: "식재료 · 식사", pct: "32%", note: "따뜻한 한 끼와 간식" },
      { label: "교육 · 활동", pct: "28%", note: "재료·강사·프로그램" },
      { label: "인건비 · 돌봄", pct: "24%", note: "코디네이터·봉사 보조" },
      { label: "공간 · 행정", pct: "16%", note: "임차·유지·안전" },
    ],
    waysHeading: "후원 방법",
    bankTitle: "계좌 이체",
    externalTitle: "외부 링크",
    externalLead:
      "해외·정기 후원에 익숙한 분들을 위한 옵션입니다.",
    noExternalLink:
      "등록된 외부 링크가 없습니다. 관리자에서 추가할 수 있습니다.",
    faqHeading: "자주 묻는 질문",
    faqs: [
      {
        q: "후원금은 세금 공제가 되나요?",
        a: "국가·제휴 단체에 따라 다릅니다. 영수증이 필요하시면 문의 주세요. 관리자에서 안내 문구를 수정할 수 있습니다.",
      },
      {
        q: "정기 후원은 어떻게 하나요?",
        a: "계좌 이체로 매월 같은 날짜에 보내 주시거나, 외부 플랫폼 링크를 통해 설정할 수 있습니다. (아래 후원 방법 참고)",
      },
      {
        q: "물품 후원도 가능한가요?",
        a: "학용품·도서·비식품 등은 사전에 필요 품목을 안내드린 뒤 맞춰 받습니다. 식품은 유통기한·보관 조건을 확인합니다.",
      },
      {
        q: "현장 봉사는 어떻게 신청하나요?",
        a: "연락처로 간단한 소개와 가능한 일정을 보내 주시면 코디네이터가 연락드립니다.",
      },
    ],
    contactHeading: "연락처",
    emailLabel: "이메일",
    phoneLabel: "전화 · 메신저",
    backToNews: "소식으로 돌아가기",
  },
};

const pt: PublicUiStrings = {
  nav: {
    intro: "Início",
    news: "Notícias",
    donate: "Apoio",
    donateCta: "Apoiar agora",
    donateMobile: "Apoio",
    langSwitchKo: "KO",
    langSwitchPt: "PT",
    langSwitchAria: "Selecionar idioma",
    ariaMainNav: "Menu principal",
    ariaMobileNav: "Menu (celular)",
    menuOpen: "Abrir menu",
    menuClose: "Fechar menu",
  },
  footer: {
    title: "Ninho das Crianças",
    description:
      "Acolhimento pós-escola para crianças em situação de vulnerabilidade no Brasil.\nUm lugar seguro, refeições,\naprendizado e brincadeira para proteger a tarde.",
    adminLogin: "Entrar (admin)",
    rights: "Todos os direitos reservados.",
  },
  provide: {
    kicker: "O que oferecemos",
    title: "O que oferecemos?",
    subtitle:
      "Organizamos o dia em cinco eixos.\nOs blocos aparecem suavemente conforme você rola a página.",
    subtitleReduce: "Organizamos o dia em cinco eixos.",
    cards: [
      {
        title: "Espaço seguro",
        body: "Entradas, rotas e rede de emergência preparadas para o dia a dia.",
      },
      {
        title: "Refeições acolhedoras",
        body: "Refeições equilibradas e lanches para repor energia.",
      },
      {
        title: "Apoio escolar",
        body: "Lição de casa, leitura e pequenas metas com acompanhamento.",
      },
      {
        title: "Brincar e mover",
        body: "Atividades internas e externas para corpo e mente.",
      },
      {
        title: "Cuidado emocional",
        body: "Escuta e encorajamento para nomear o que se sente hoje.",
      },
    ],
  },
  dailyFlow: {
    kicker: "Rotina do dia",
    title: "Como flui o dia",
    lead: "Uma linha do tempo da tarde pós-escola.",
    steps: [
      {
        title: "Chegada após a escola",
        body: "Entrada e check-in de saúde para começar com segurança.",
      },
      {
        title: "Lanche e refeição",
        body: "Repomos energia e compartilhamos a mesa.",
      },
      {
        title: "Estudos",
        body: "Lição de casa, leitura e atividades em grupo.",
      },
      {
        title: "Atividades diversas",
        body: "Arte, música, esporte — criatividade e riso.",
      },
      {
        title: "Saída para casa",
        body: "Contato com responsáveis e rota de retorno conferidos.",
      },
    ],
  },
  stats: {
    kicker: "Em números",
    title: "O Ninho em números",
    lead: "Tempo construído com doação e oração.\nOs valores podem mudar conforme a operação.",
    labels: {
      y2018: "Início do trabalho",
      y2025: "Fundação do Ninho",
      kids: "Crianças acolhidas",
      days: "Dias por semana",
    },
  },
  stories: { viewAllNews: "Ver todas as notícias →" },
  news: {
    kicker: "Notícias",
    title: "Notícias",
    description:
      "Mostramos apenas posts com status 'published'.\nSe não houver dados no Supabase, você verá exemplos.",
    emptyCategory: "Não há posts nesta categoria.",
    tabsAria: "Categorias de notícias",
    tabLabels: {
      all: "Todos",
      daily: "Dia a dia",
      event: "Eventos",
      fundraising: "Doações",
      prayer: "Oração",
      impact: "Histórias de impacto",
    },
  },
  newsArticle: {
    backToList: "Voltar à lista de notícias",
    relatedHeading: "Relacionadas",
    relatedEmpty: "Não há posts relacionados.",
    ctaTitle: "Ajude a proteger a tarde de uma criança",
    ctaBody:
      "Sua doação vira refeições, aprendizado e manutenção do espaço.",
    donateButton: "Apoiar",
    moreImagesHeading: "Mais imagens",
    translating: "Traduzindo…",
    heroImageAltSuffix: "imagem de capa",
    extraImageAltSuffix: "foto adicional",
    inlineImageAlt: "Imagem no texto",
  },
  missionImageAlt:
    "Imagem ilustrativa de crianças em atividades no espaço",
  donate: {
    kicker: "Apoio",
    title: "Como apoiar",
    intro:
      "Transparência sobre para onde vai sua doação e como contribuir.\nConta, links e texto de contato podem ser editados no painel em “Conteúdo de doação”.",
    whyHeading: "Por que doar?",
    whyLead:
      "Para crianças em vulnerabilidade, o pós-escola é segurança e autoestima.\nA doação se distribui de forma equilibrada nas áreas abaixo.",
    whyPoints: [
      {
        title: "Refeições e lanches",
        body: "Nutrição e ritmo alimentar adequados à idade.",
      },
      {
        title: "Educação e estudo",
        body: "Lição de casa, leitura e mentoria para a vida escolar.",
      },
      {
        title: "Cuidado e segurança",
        body: "Rotas de chegada/saída e protocolos de emergência.",
      },
      {
        title: "Atividades e brincadeira",
        body: "Arte, música, esporte — experiências que fortalecem.",
      },
      {
        title: "Manutenção do espaço",
        body: "Limpeza, insumos e pequenos reparos para abrir as portas todos os dias.",
      },
    ],
    useHeading: "Para onde vai a doação?",
    useLead:
      "Percentuais de exemplo, sujeitos ao planejamento.\nVisão rápida em cartões.",
    useOfFunds: [
      { label: "Alimentação", pct: "32%", note: "Refeições e lanches" },
      { label: "Educação e atividades", pct: "28%", note: "Material e programas" },
      { label: "Equipe e cuidado", pct: "24%", note: "Coordenação e apoio" },
      { label: "Espaço e administração", pct: "16%", note: "Aluguel, manutenção, segurança" },
    ],
    waysHeading: "Formas de doar",
    bankTitle: "Transferência bancária",
    externalTitle: "Link externo",
    externalLead: "Opção para quem já doa online ou de forma recorrente.",
    noExternalLink:
      "Nenhum link externo cadastrado. Adicione no painel administrativo.",
    faqHeading: "Perguntas frequentes",
    faqs: [
      {
        q: "A doação é dedutível de imposto?",
        a: "Depende do país e da parceria. Peça recibo pelo contato. O texto pode ser ajustado no painel.",
      },
      {
        q: "Como faço doação recorrente?",
        a: "Transferência mensal na mesma data ou plataforma externa (veja Formas de doar).",
      },
      {
        q: "Posso doar itens?",
        a: "Material escolar, livros e não perecíveis após alinhamento de necessidades. Alimentos exigem checagem de validade e armazenamento.",
      },
      {
        q: "Como me inscrevo para voluntariado presencial?",
        a: "Envie uma breve apresentação e disponibilidade pelo contato; a coordenação retorna.",
      },
    ],
    contactHeading: "Contato",
    emailLabel: "E-mail",
    phoneLabel: "Telefone / mensagens",
    backToNews: "Voltar às notícias",
  },
};

export const publicUi: Record<Locale, PublicUiStrings> = { ko, pt };

export function getPublicUi(locale: Locale): PublicUiStrings {
  return publicUi[locale];
}
