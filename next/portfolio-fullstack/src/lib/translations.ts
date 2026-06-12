export type Lang = "en" | "pt";

export interface TimelineItemData {
  title: string;
  period: string;
  type: "professional" | "education";
  institution: string;
  location: string;
  details: string[];
}

const t = {
  en: {
    nav: {
      home: "Home",
      skills: "Skills",
      projects: "Projects",
      timeline: "Timeline",
      contact: "Contact",
    },
    hero: {
      greeting: "Hi! 👋",
      role: "Software Engineer | Senior Fullstack Expert",
      description:
        "Building end-to-end products — from scalable backend APIs to polished frontend interfaces — with a focus on performance, reliability, and great user experiences.",
      downloadCV: "Download CV",
      typewriterDesktop: [
        "Building fullstack web products",
        "Specialist in React, Node.js & TypeScript",
        "Transforming ideas into reality",
      ],
      typewriterMobile: [
        "Building fullstack products",
        "React & Node.js engineer",
        "Bringing ideas to life",
      ],
    },
    stats: [
      { value: 8, suffix: "+", label: "Years of Experience" },
      { value: 100, suffix: "+", label: "Projects Delivered" },
      { value: 85, suffix: "%", label: "Avg. Performance Gain" },
      { value: 90, suffix: "%", label: "Avg. Bug Reduction" },
    ],
    skills: {
      title: "Skills",
      radarTitle: "Expertise Areas",
      radarData: [
        { subject: "Frontend", value: 88 },
        { subject: "Backend", value: 72 },
        { subject: "AI / APIs", value: 78 },
        { subject: "UI / Design", value: 82 },
        { subject: "CMS", value: 85 },
        { subject: "DevOps", value: 65 },
      ],
    },
    projects: {
      title: "Projects",
      all: "All Projects",
      showMore: "Show More",
      showLess: "Show Less",
      viewMore: "View more",
      viewCode: "View Code",
      liveDemo: "Live Demo",
      liveSite: "Live Site",
      close: "Close",
    },
    projectDescriptions: [
      "AI-powered code review tool that analyzes your code in real time, returning a quality score (0–100), a categorized issues list with concrete fixes, and a complete refactored version. Built for developers who want fast, actionable feedback without leaving the browser.",
      "AI-powered technical interview prep platform. Generate personalized study roadmaps from job descriptions, practice with AI-generated questions, review Flash Topics and track your progress — available in English and Portuguese.",
      "A personal CRM for managing job interview pipelines — track processes by stage, generate AI-powered recruiter responses and CV adaptations, and manage next steps across multiple open positions simultaneously.",
      "A monorepo design system with 5 themed token collections and 30 accessible React components. Built for developers who need a fully themeable, dark-mode-ready component library with CSS custom properties and no runtime dependencies.",
      "A collaborative personal finance PWA for couples — track shared expenses, income, budgets, credit card statements and recurring bills in real time, with AI-powered spreadsheet import via Claude Sonnet.",
      "Full Stack Project with Next.js and React. Seamlessly integrate with Google Calendar to schedule appointments. Simplify time management and enhance communication with this user-friendly scheduling application.",
      "React Design System Mastery: Crafting, Documenting, and Deploying with Storybook and GitHub Actions.",
      "An application that allows uploading videos and, through AI, automatically generates catchy titles and descriptions with good indexing.",
      "A shopping cart manager built to practice React state management and component architecture.",
      "A CRUD application to practice task management with React, TypeScript and Vite.",
      "A dashboard designed for restaurant owners participating in delivery applications.",
      "A project that connects people who want to make monetary contributions to NGOs that need help.",
      "Available for Web and Mobile, Feedget collects user feedback and stores it in a PostgreSQL database.",
      "A project that facilitates visits to orphanages near you.",
      "A reminder app to keep you moving — because exercise matters! 💜",
      "A project that connects people to waste collection points efficiently.",
      "A project that connects gamers who want to find partners to play a specific game online.",
    ],
    timeline: {
      title: "Experience & Education",
      viewMore: "View more",
      close: "Close",
      items: [
        {
          title: "Senior Software Engineer | Tech Lead",
          period: "2022 – Present",
          type: "professional" as const,
          institution: "+A Educação",
          location: "São Paulo, Brazil (Remote)",
          details: [
            "Reduced loading time by 38% across institutional websites through a complete front-end rebuild using Next.js (SSR), Tailwind CSS, and lazy loading strategies.",
            "Created a reusable Design System in React + Tailwind documented in Storybook, accelerating screen delivery by 50% and ensuring UI consistency.",
            "Developed an automated diagnostics dashboard integrating Google PageSpeed API and OpenAI API, enabling real-time SEO, accessibility, and performance feedback.",
            "Standardized SPA promotional modules and cut down campaign delivery time by 42%, supporting seasonal marketing peaks.",
            "Improved form conversion by 27% and reduced abandonment rate by 25% using Formik, Yup, Axios, and intl-tel-input with dynamic validation and Google Tag Manager.",
          ],
        },
        {
          title: "Specialization in Software Engineering",
          period: "2025",
          type: "education" as const,
          institution: "Universidade Estadual de Campinas – UNICAMP",
          location: "Campinas, Brazil",
          details: [
            "Object-Oriented Analysis and Design: expertise in designing robust software architectures using OO principles.",
            "Software Validation and Verification: testing methodologies to ensure software quality and reliability.",
            "Database Modeling and Design: creating and optimizing data models for efficient storage and retrieval.",
            "Service-Oriented Architecture (SOA): implementing scalable, service-based software solutions.",
          ],
        },
        {
          title: "Software Engineer",
          period: "2020 – 2022",
          type: "professional" as const,
          institution: "EBANX",
          location: "Curitiba, Brazil (Hybrid)",
          details: [
            "Accelerated delivery of promotional landing pages by 32% through a modular front-end framework in React and Tailwind, supported by Docker and GitHub Actions pipelines.",
            "Reduced bugs by 45% and increased code reusability via a Storybook-based component library tailored for marketing variations.",
            "Improved engagement reporting by 40% by automating the dataLayer and real-time event tracking via Google Tag Manager.",
            "Achieved a 28% gain in PageSpeed metrics (LCP and TBT) using server-side rendering with Next.js, WebP image optimization, and modular lazy loading.",
          ],
        },
        {
          title: "MBA in Full Stack Development",
          period: "2020",
          type: "education" as const,
          institution: "XP Educação",
          location: "Belo Horizonte, Brazil",
          details: [
            "Full-Stack Web Development: mastered end-to-end application development, including front-end and back-end technologies.",
            "Front-End Proficiency: advanced skills in building responsive, user-friendly interfaces using modern frameworks.",
            "Back-End Expertise: server-side applications with Node.js, focusing on scalable and efficient solutions.",
            "Agile Project Management: applied Kanban methodologies for effective project organization and team collaboration.",
          ],
        },
        {
          title: "Fullstack Developer",
          period: "2018 – Present",
          type: "professional" as const,
          institution: "Freelance & Personal Projects",
          location: "Remote",
          details: [
            "Developed institutional and e-commerce websites with an average PageSpeed score of 93+ and up to 28% higher conversion rates using Next.js and Tailwind CSS.",
            "Engineered robust back-end systems with 99.9% uptime using Node.js, TypeScript, PostgreSQL, MongoDB, and GraphQL within Clean Architecture principles.",
            "Maintained >85% test coverage and zero production-critical bugs, leveraging GitHub Actions for automated testing pipelines (Jest and Cypress).",
            "Implemented dynamic meta tags, JSON-LD, and sitemap configurations for advanced technical SEO optimizations.",
          ],
        },
        {
          title: "First Certificate in English",
          period: "2017",
          type: "education" as const,
          institution: "Cambridge Assessment English Exams",
          location: "London, United Kingdom",
          details: [
            "Advanced Reading Skills: comprehend complex texts and identify detailed information across various topics.",
            "Effective Writing Proficiency: crafting clear, coherent, and well-structured written communication.",
            "Listening and Comprehension: understanding a wide range of spoken materials, from interviews to academic discussions.",
            "Speaking Fluency: clear and confident oral communication in English, including interactive and formal conversations.",
          ],
        },
        {
          title: "Automation & Control Engineering",
          period: "2014",
          type: "education" as const,
          institution: "Instituto Mauá de Tecnologia",
          location: "São Caetano do Sul, Brazil",
          details: [
            "Robotics and Automation: designing and implementing automated systems and robotic solutions for industrial applications.",
            "Control Systems: analyzing and optimizing control processes to enhance efficiency and system performance.",
            "Electrical and Electronic Systems: designing and troubleshooting complex electrical and electronic circuits.",
            "Award-Winning Final Project: led a group project that won the ABB Award for Best Final Graduation Project.",
          ],
        },
      ] as TimelineItemData[],
    },
    contact: {
      title: "Get in Touch",
      collabTitle: "Let's Collaborate!",
      collabText:
        "I am always eager to collaborate on innovative projects, exchange creative ideas, and explore new opportunities. Whether you're looking to build full-stack products, design robust APIs, or scale existing platforms, I'd love to be part of your journey.",
      workTitle: "Work With Me",
      workText:
        "Whether you're a startup aiming to launch a standout product, a business seeking end-to-end technical expertise, or a fellow engineer passionate about learning and sharing knowledge, I am always open to meaningful conversations. Feel free to reach out — let's create something remarkable together!",
      cards: {
        email: { title: "E-mail", desc: "Reach me via email for inquiries and opportunities.", link: "Send an Email" },
        whatsapp: { title: "WhatsApp", desc: "Chat with me directly on WhatsApp.", link: "Message on WhatsApp" },
        linkedin: { title: "LinkedIn", desc: "Connect with me on LinkedIn.", link: "Visit my LinkedIn" },
        github: { title: "GitHub", desc: "Check out my projects on GitHub.", link: "Visit my GitHub" },
      },
    },
    footer: {
      developed: "Developed with",
      by: "by",
      builtWith: "Built with",
      deployedOn: "Deployed on",
    },
    terminal: {
      lines: [
        { cmd: "whoami", out: "Fernando Ghiberti — Senior Fullstack Developer" },
        { cmd: "ls skills/", out: "React  Node.js  TypeScript  PostgreSQL  Groq-AI" },
        { cmd: "cat mission.txt", out: "Building high-quality web products that make a difference." },
        { cmd: "./launch-portfolio.sh", out: "Launching... ✓" },
      ],
      skip: "Skip intro",
    },
    askFernando: {
      greeting: "Hi! I'm Fernando's AI assistant. Ask me anything about his skills, projects, or experience.",
      placeholder: "Ask something…",
      title: "Ask Fernando AI",
      thinking: "Thinking…",
    },
  },

  pt: {
    nav: {
      home: "Início",
      skills: "Habilidades",
      projects: "Projetos",
      timeline: "Carreira",
      contact: "Contato",
    },
    hero: {
      greeting: "Olá! 👋",
      role: "Engenheiro de Software | Senior Fullstack Expert",
      description:
        "Construindo produtos completos — de APIs backend escaláveis a interfaces frontend refinadas — com foco em performance, confiabilidade e experiências excepcionais.",
      downloadCV: "Baixar CV",
      typewriterDesktop: [
        "Construindo produtos web fullstack",
        "Especialista em React, Node.js e TypeScript",
        "Transformando ideias em realidade",
      ],
      typewriterMobile: [
        "Construindo produtos fullstack",
        "Engenheiro React & Node.js",
        "Dando vida às suas ideias",
      ],
    },
    stats: [
      { value: 8, suffix: "+", label: "Anos de Experiência" },
      { value: 100, suffix: "+", label: "Projetos Entregues" },
      { value: 85, suffix: "%", label: "Ganho Médio de Performance" },
      { value: 90, suffix: "%", label: "Redução Média de Bugs" },
    ],
    skills: {
      title: "Habilidades",
      radarTitle: "Áreas de Expertise",
      radarData: [
        { subject: "Frontend", value: 88 },
        { subject: "Backend", value: 72 },
        { subject: "IA / APIs", value: 78 },
        { subject: "UI / Design", value: 82 },
        { subject: "CMS", value: 85 },
        { subject: "DevOps", value: 65 },
      ],
    },
    projects: {
      title: "Projetos",
      all: "Todos os Projetos",
      showMore: "Ver Mais",
      showLess: "Ver Menos",
      viewMore: "Ver mais",
      viewCode: "Ver Código",
      liveDemo: "Demo ao Vivo",
      liveSite: "Site ao Vivo",
      close: "Fechar",
    },
    projectDescriptions: [
      "Ferramenta de revisão de código com IA que analisa seu código em tempo real, retornando uma pontuação de qualidade (0–100), uma lista categorizada de problemas com correções concretas e uma versão completamente refatorada. Criada para desenvolvedores que querem feedback rápido e acionável sem sair do navegador.",
      "Plataforma de preparação para entrevistas técnicas com IA. Gere roadmaps de estudo personalizados a partir de descrições de vagas, pratique com perguntas geradas por IA, revise Flash Topics e acompanhe seu progresso — disponível em inglês e português.",
      "CRM pessoal para gerenciar pipelines de entrevistas de emprego — acompanhe processos por etapa, gere respostas a recrutadores e adaptações de currículo com IA, e gerencie próximos passos em múltiplas vagas simultaneamente.",
      "Design system em monorepo com 5 coleções de tokens temáticos e 30 componentes React acessíveis. Criado para desenvolvedores que precisam de uma biblioteca de componentes totalmente personalizável, com suporte a dark mode e propriedades CSS customizadas.",
      "PWA de finanças pessoais colaborativa para casais — acompanhe despesas compartilhadas, renda, orçamentos, faturas de cartão e contas recorrentes em tempo real, com importação de planilhas via Claude Sonnet.",
      "Projeto Full Stack com Next.js e React. Integre com o Google Calendar para agendar compromissos e simplifique o gerenciamento de tempo com essa aplicação de agendamento.",
      "Domínio de Design System em React: criação, documentação e publicação com Storybook e GitHub Actions.",
      "Aplicação que permite enviar vídeos e, através de IA, gera automaticamente títulos e descrições atraentes com boa indexação.",
      "Gerenciador de carrinho de compras criado para praticar gerenciamento de estado e arquitetura de componentes React.",
      "Aplicação CRUD para praticar gerenciamento de tarefas com React, TypeScript e Vite.",
      "Dashboard para donos de restaurantes que participam de aplicativos de delivery.",
      "Projeto que conecta pessoas que querem fazer contribuições financeiras a ONGs que precisam de ajuda.",
      "Disponível para Web e Mobile, o Feedget coleta feedbacks de usuários e os armazena em um banco PostgreSQL.",
      "Projeto que facilita visitas a orfanatos próximos de você.",
      "App de lembretes para te manter em movimento — porque exercício é importante! 💜",
      "Projeto que conecta pessoas a pontos de coleta de resíduos de forma eficiente.",
      "Projeto que conecta gamers que querem encontrar parceiros para jogar um jogo específico online.",
    ],
    timeline: {
      title: "Experiência & Formação",
      viewMore: "Ver mais",
      close: "Fechar",
      items: [
        {
          title: "Engenheiro de Software Sênior | Tech Lead",
          period: "2022 – Presente",
          type: "professional" as const,
          institution: "+A Educação",
          location: "São Paulo, Brasil (Remoto)",
          details: [
            "Reduzi o tempo de carregamento em 38% nos sites institucionais com uma reconstrução completa do front-end usando Next.js (SSR), Tailwind CSS e lazy loading.",
            "Criei um Design System reutilizável em React + Tailwind documentado no Storybook, acelerando a entrega de telas em 50% e garantindo consistência visual.",
            "Desenvolvi um dashboard de diagnósticos automatizados integrando Google PageSpeed API e OpenAI API, com feedback em tempo real de SEO, acessibilidade e performance.",
            "Padronizei módulos SPA promocionais e reduzi o tempo de entrega de campanhas em 42%, suportando picos sazonais de marketing.",
            "Melhorei a conversão de formulários em 27% e reduzi o abandono em 25% com Formik, Yup, Axios e intl-tel-input com validação dinâmica e Google Tag Manager.",
          ],
        },
        {
          title: "Especialização em Engenharia de Software",
          period: "2025",
          type: "education" as const,
          institution: "Universidade Estadual de Campinas – UNICAMP",
          location: "Campinas, Brasil",
          details: [
            "Análise e Projeto Orientado a Objetos: expertise em arquiteturas de software robustas com princípios OO.",
            "Validação e Verificação de Software: metodologias de teste para garantir qualidade e confiabilidade.",
            "Modelagem e Design de Banco de Dados: criação e otimização de modelos de dados para armazenamento eficiente.",
            "Arquitetura Orientada a Serviços (SOA): implementação de soluções de software escaláveis baseadas em serviços.",
          ],
        },
        {
          title: "Engenheiro de Software",
          period: "2020 – 2022",
          type: "professional" as const,
          institution: "EBANX",
          location: "Curitiba, Brasil (Híbrido)",
          details: [
            "Acelerei a entrega de landing pages promocionais em 32% com um framework front-end modular em React e Tailwind, apoiado por pipelines Docker e GitHub Actions.",
            "Reduzi bugs em 45% e aumentei a reutilização de código com biblioteca de componentes baseada em Storybook para variações de marketing.",
            "Melhorei os relatórios de engajamento em 40% automatizando o dataLayer e rastreamento de eventos em tempo real via Google Tag Manager.",
            "Obtive 28% de ganho nas métricas PageSpeed (LCP e TBT) com SSR em Next.js, otimização de imagens WebP e lazy loading modular.",
          ],
        },
        {
          title: "MBA em Desenvolvimento Full Stack",
          period: "2020",
          type: "education" as const,
          institution: "XP Educação",
          location: "Belo Horizonte, Brasil",
          details: [
            "Desenvolvimento Web Full-Stack: domínio de desenvolvimento end-to-end, incluindo tecnologias de front-end e back-end.",
            "Proficiência em Front-End: habilidades avançadas para construir interfaces responsivas com frameworks modernos.",
            "Expertise em Back-End: aplicações server-side com Node.js, focando em soluções escaláveis e eficientes.",
            "Gestão Ágil de Projetos: aplicação de metodologias Kanban para organização e colaboração de equipe.",
          ],
        },
        {
          title: "Desenvolvedor Fullstack",
          period: "2018 – Presente",
          type: "professional" as const,
          institution: "Freelance & Projetos Pessoais",
          location: "Remoto",
          details: [
            "Desenvolvi sites institucionais e e-commerces com PageSpeed médio de 93+ e até 28% a mais em conversão usando Next.js e Tailwind CSS.",
            "Construí sistemas back-end robustos com 99,9% de uptime usando Node.js, TypeScript, PostgreSQL, MongoDB e GraphQL com Arquitetura Limpa.",
            "Mantive cobertura de testes >85% e zero bugs críticos em produção, com pipelines automatizados no GitHub Actions (Jest e Cypress).",
            "Implementei meta tags dinâmicas, JSON-LD e configurações de sitemap para otimizações avançadas de SEO técnico.",
          ],
        },
        {
          title: "First Certificate in English",
          period: "2017",
          type: "education" as const,
          institution: "Cambridge Assessment English Exams",
          location: "Londres, Reino Unido",
          details: [
            "Leitura Avançada: capacidade de compreender textos complexos e identificar informações detalhadas.",
            "Escrita Eficaz: criação de comunicação escrita clara, coerente e bem estruturada para diferentes finalidades.",
            "Escuta e Compreensão: entendimento de uma ampla gama de materiais falados, de entrevistas a discussões acadêmicas.",
            "Fluência Oral: comunicação clara e confiante em inglês, incluindo conversas interativas e formais.",
          ],
        },
        {
          title: "Engenharia de Automação e Controle",
          period: "2014",
          type: "education" as const,
          institution: "Instituto Mauá de Tecnologia",
          location: "São Caetano do Sul, Brasil",
          details: [
            "Robótica e Automação: projeto e implementação de sistemas automatizados e robóticos para aplicações industriais.",
            "Sistemas de Controle: análise e otimização de processos de controle para maior eficiência e desempenho.",
            "Sistemas Elétricos e Eletrônicos: projeto e manutenção de circuitos elétricos e eletrônicos complexos.",
            "Projeto Final Premiado: liderança de projeto que ganhou o Prêmio ABB de Melhor Projeto de Conclusão de Curso.",
          ],
        },
      ] as TimelineItemData[],
    },
    contact: {
      title: "Entre em Contato",
      collabTitle: "Vamos Colaborar!",
      collabText:
        "Estou sempre animado para colaborar em projetos inovadores, trocar ideias criativas e explorar novas oportunidades. Se você quer construir produtos fullstack completos, projetar APIs robustas ou escalar plataformas existentes, adoraria fazer parte da sua jornada.",
      workTitle: "Trabalhe Comigo",
      workText:
        "Seja você uma startup querendo lançar um produto de destaque, uma empresa buscando expertise técnica end-to-end ou um engenheiro apaixonado por aprender e compartilhar conhecimento, estou sempre aberto a conversas significativas. Fique à vontade para entrar em contato — vamos criar algo extraordinário juntos!",
      cards: {
        email: { title: "E-mail", desc: "Entre em contato por e-mail para consultas e oportunidades.", link: "Enviar E-mail" },
        whatsapp: { title: "WhatsApp", desc: "Converse comigo diretamente pelo WhatsApp.", link: "Mensagem no WhatsApp" },
        linkedin: { title: "LinkedIn", desc: "Conecte-se comigo no LinkedIn.", link: "Ver meu LinkedIn" },
        github: { title: "GitHub", desc: "Confira meus projetos no GitHub.", link: "Ver meu GitHub" },
      },
    },
    footer: {
      developed: "Desenvolvido com",
      by: "por",
      builtWith: "Feito com",
      deployedOn: "Publicado na",
    },
    terminal: {
      lines: [
        { cmd: "whoami", out: "Fernando Ghiberti — Desenvolvedor Fullstack Sênior" },
        { cmd: "ls habilidades/", out: "React  Node.js  TypeScript  PostgreSQL  Groq-AI" },
        { cmd: "cat missao.txt", out: "Construindo produtos web de alta qualidade que fazem a diferença." },
        { cmd: "./iniciar-portfolio.sh", out: "Iniciando... ✓" },
      ],
      skip: "Pular intro",
    },
    askFernando: {
      greeting: "Olá! Sou o assistente de IA do Fernando. Pergunte-me sobre suas habilidades, projetos ou experiência.",
      placeholder: "Pergunte algo…",
      title: "Pergunte ao Fernando",
      thinking: "Pensando…",
    },
  },
};

export default t;
