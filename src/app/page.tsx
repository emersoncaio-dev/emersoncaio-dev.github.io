"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useForm, ValidationError } from '@formspree/react';

/* ============================================
   TYPES
   ============================================ */
type Lang = "PT" | "EN" | "ES";
type L = Record<Lang, string>;

/* ============================================
   ANIMATION VARIANTS
   ============================================ */
const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.16, 1, 0.3, 1] as const },
  },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const fadeUpCard = {
  hidden: { opacity: 0, y: 40, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  },
};

/* ============================================
   i18n DICTIONARY
   ============================================ */
const dict = {
  PT: {
    /* Nav */
    navAbout: "Sobre",
    navExperience: "Experiência",
    navProjects: "Projetos",
    navCerts: "Certificações",
    navContact: "Contato",
    navCta: "Fale Comigo",
    /* Hero */
    heroName: "Emerson Caio",
    heroTitle1: "Engenharia de Software",
    heroTitle2: "& Cibersegurança",
    heroSub:
      "Graduado em Engenharia de Software e pós-graduando em Ethical Hacking & Cybersecurity. Desenvolvo aplicações web escaláveis, arquiteturas seguras com Supabase/PostgreSQL e integrações inteligentes com IA.",
    heroBadge1: "Bacharel em Engenharia de Software",
    heroBadge2: "Pós em Ethical Hacking & Security",
    heroBadge3: "Full-Stack & Cloud Architecture",
    heroCta1: "Ver Projetos",
    heroCta2: "Download CV",
    /* About */
    aboutBadge: "● SOBRE MIM & FORMAÇÃO",
    aboutTitle: "Engenharia de Software & Segurança por Design",
    aboutP1:
      "Sou Emerson Caio, bacharel em Engenharia de Software e pós-graduando em Ethical Hacking & Cibersegurança. Atuo no desenvolvimento de soluções digitais de ponta a ponta, unindo engenharia full-stack moderna e princípios rigorosos de segurança defensiva.",
    aboutP2:
      "Minha atuação abrange a criação de interfaces de alta performance com Next.js, React e TypeScript, aliada a arquiteturas backend resilientes em Node.js e bancos relacionais PostgreSQL com Supabase. Priorizo a segurança por design em cada etapa do projeto, implementando controle rigoroso de acesso (RLS), proteção contra vulnerabilidades críticas (OWASP) e integrações eficientes com inteligência artificial para entregar sistemas escaláveis, estáveis e seguros.",
    degree1Title: "🎓 Bacharel em Engenharia de Software",
    degree1School: "Universidade Estácio de Sá",
    degree2Title: "🛡️ Pós-graduando em Ethical Hacking & Cybersecurity",
    degree2School: "Faculdade Anhanguera",
    degree3Title: "⚡ Experiência Prática em Análise de Sistemas",
    degree3School: "Grupo Igreja Simples",
    /* Certifications */
    certsTitle: "CERTIFICAÇÕES & ESPECIALIZAÇÕES",
    certsSubtitle: "Especializações acadêmicas e certificações técnicas reconhecidas.",
    /* Projects */
    projTitle: "Meus Trabalhos & Projetos em Produção",
    projSubtitle: "Sistemas robustos, arquiteturas seguras e produtos digitais desenvolvidos com foco em escalabilidade e performance.",
    projCta: "Ver Projeto",
    /* Stack */
    stackBadge: "● ARSENAL TÉCNICO & STACK",
    stackTitle: "Tecnologias Modernas & Arquitetura de Alto Nível",
    stackSubtitle: "Ecossistema de ferramentas selecionadas para entregar performance, segurança rigorosa e escalabilidade.",
    /* Service */
    serviceBadge: "● CIBERSEGURANÇA & ARQUITETURA DEFENSIVA",
    serviceTitle: "Auditoria de Segurança, Code Review & Consultoria Técnica",
    serviceDesc:
      "Análise aprofundada de vulnerabilidades, modelagem de ameaças (Threat Modeling), aplicação rigorosa de boas práticas OWASP Top 10 e arquiteturas resilientes com foco em segurança por design.",
    serviceCta: "AGENDAR CONSULTORIA",
    /* Contact */
    contactTitle: "VAMOS CONSTRUIR ALGO\nSEGURO E ESCALÁVEL?",
    contactText:
      "Estou disponível para projetos, oportunidades e consultorias em engenharia de software e segurança.",
    contactFormTitle: "ENVIE SUA MENSAGEM",
    contactName: "Nome",
    contactEmail: "Email",
    contactMessage: "Mensagem",
    contactSend: "Enviar Mensagem",
    footerRights: "Todos os direitos reservados.",
    location: "São Bernardo do Campo — SP",
  },
  EN: {
    navAbout: "About",
    navExperience: "Experience",
    navProjects: "Projects",
    navCerts: "Certifications",
    navContact: "Contact",
    navCta: "Let's Talk",
    heroName: "Emerson Caio",
    heroTitle1: "Software Engineering",
    heroTitle2: "& Cybersecurity",
    heroSub:
      "Bachelor's in Software Engineering and postgraduate in Ethical Hacking & Cybersecurity. I build scalable web applications, secure architectures with Supabase/PostgreSQL, and intelligent AI integrations.",
    heroBadge1: "B.Sc. Software Engineering",
    heroBadge2: "Postgrad. Ethical Hacking & Security",
    heroBadge3: "Full-Stack & Cloud Architecture",
    heroCta1: "View Projects",
    heroCta2: "Download CV",
    aboutBadge: "● ABOUT ME & EDUCATION",
    aboutTitle: "Software Engineering & Security by Design",
    aboutP1:
      "I am Emerson Caio, holding a Bachelor's degree in Software Engineering and pursuing a postgraduate degree in Ethical Hacking & Cybersecurity. I work in the end-to-end development of digital solutions, combining modern full-stack engineering with rigorous defensive security principles.",
    aboutP2:
      "My work encompasses creating high-performance interfaces with Next.js, React, and TypeScript, combined with resilient backend architectures in Node.js and relational PostgreSQL databases with Supabase. I prioritize security by design at every project stage, implementing strict access control (RLS), protection against critical vulnerabilities (OWASP), and efficient AI integrations to deliver scalable, stable, and secure systems.",
    degree1Title: "🎓 B.Sc. in Software Engineering",
    degree1School: "Universidade Estácio de Sá",
    degree2Title: "🛡️ Postgraduate in Ethical Hacking & Cybersecurity",
    degree2School: "Faculdade Anhanguera",
    degree3Title: "⚡ Practical Experience in Systems Analysis",
    degree3School: "Grupo Igreja Simples",
    certsTitle: "CERTIFICATIONS & SPECIALIZATIONS",
    certsSubtitle: "Recognized academic specializations and technical certifications.",
    projTitle: "My Work & Projects in Production",
    projSubtitle: "Robust systems, secure architectures, and digital products developed with a focus on scalability and performance.",
    projCta: "View Project",
    stackBadge: "● TECHNICAL ARSENAL & STACK",
    stackTitle: "Modern Technologies & High-Level Architecture",
    stackSubtitle: "Ecosystem of selected tools to deliver performance, rigorous security, and scalability.",
    serviceBadge: "● CYBERSECURITY & DEFENSIVE ARCHITECTURE",
    serviceTitle: "Security Audit, Code Review & Technical Consulting",
    serviceDesc:
      "In-depth vulnerability analysis, Threat Modeling, rigorous application of OWASP Top 10 best practices, and resilient architectures focusing on security by design.",
    serviceCta: "SCHEDULE CONSULTATION",
    contactTitle: "LET'S BUILD SOMETHING\nSECURE AND SCALABLE?",
    contactText:
      "I'm available for projects, opportunities, and consulting in software engineering and security.",
    contactFormTitle: "SEND YOUR MESSAGE",
    contactName: "Name",
    contactEmail: "Email",
    contactMessage: "Message",
    contactSend: "Send Message",
    footerRights: "All rights reserved.",
    location: "São Bernardo do Campo — SP, Brazil",
  },
  ES: {
    navAbout: "Sobre",
    navExperience: "Experiencia",
    navProjects: "Proyectos",
    navCerts: "Certificaciones",
    navContact: "Contacto",
    navCta: "Hablemos",
    heroName: "Emerson Caio",
    heroTitle1: "Ingeniería de Software",
    heroTitle2: "& Ciberseguridad",
    heroSub:
      "Graduado en Ingeniería de Software y posgraduando en Ethical Hacking & Cybersecurity. Desarrollo aplicaciones web escalables, arquitecturas seguras con Supabase/PostgreSQL e integraciones inteligentes con IA.",
    heroBadge1: "Licenciatura en Ingeniería de Software",
    heroBadge2: "Posgrado en Ethical Hacking & Security",
    heroBadge3: "Full-Stack & Cloud Architecture",
    heroCta1: "Ver Proyectos",
    heroCta2: "Descargar CV",
    aboutBadge: "● SOBRE MÍ & FORMACIÓN",
    aboutTitle: "Ingeniería de Software & Seguridad por Diseño",
    aboutP1:
      "Soy Emerson Caio, licenciado en Ingeniería de Software y cursando un posgrado en Ethical Hacking & Ciberseguridad. Trabajo en el desarrollo de soluciones digitales de principio a fin, uniendo la ingeniería full-stack moderna y rigurosos principios de seguridad defensiva.",
    aboutP2:
      "Mi trabajo abarca la creación de interfaces de alto rendimiento con Next.js, React y TypeScript, combinadas con arquitecturas backend resilientes en Node.js y bases de datos relacionales PostgreSQL con Supabase. Priorizo la seguridad por diseño en cada etapa del proyecto, implementando controles de acceso estrictos (RLS), protección contra vulnerabilidades críticas (OWASP) e integraciones eficientes con inteligencia artificial para entregar sistemas escalables, estables y seguros.",
    degree1Title: "🎓 Licenciatura en Ingeniería de Software",
    degree1School: "Universidade Estácio de Sá",
    degree2Title: "🛡️ Posgrado en Ethical Hacking & Cybersecurity",
    degree2School: "Faculdade Anhanguera",
    degree3Title: "⚡ Experiencia Práctica en Análisis de Sistemas",
    degree3School: "Grupo Igreja Simples",
    certsTitle: "CERTIFICACIONES & ESPECIALIZACIONES",
    certsSubtitle: "Especializaciones académicas y certificaciones técnicas reconocidas.",
    projTitle: "Mis Trabajos & Proyectos en Producción",
    projSubtitle: "Sistemas robustos, arquitecturas seguras y productos digitales desarrollados con enfoque en escalabilidad y rendimiento.",
    projCta: "Ver Proyecto",
    stackBadge: "● ARSENAL TÉCNICO & STACK",
    stackTitle: "Tecnologías Modernas & Arquitectura de Alto Nivel",
    stackSubtitle: "Ecosistema de herramientas seleccionadas para ofrecer rendimiento, seguridad rigurosa y escalabilidad.",
    serviceBadge: "● CIBERSEGURIDAD & ARQUITECTURA DEFENSIVA",
    serviceTitle: "Auditoría de Seguridad, Code Review & Consultoría Técnica",
    serviceDesc:
      "Análisis exhaustivo de vulnerabilidades, modelado de amenazas (Threat Modeling), aplicación rigurosa de buenas prácticas OWASP Top 10 y arquitecturas resilientes con enfoque en seguridad por diseño.",
    serviceCta: "AGENDAR CONSULTORÍA",
    contactTitle: "¿CONSTRUIMOS ALGO\nSEGURO Y ESCALABLE?",
    contactText:
      "Estoy disponible para proyectos, oportunidades y consultorías en ingeniería de software y seguridad.",
    contactFormTitle: "ENVÍA TU MENSAJE",
    contactName: "Nombre",
    contactEmail: "Email",
    contactMessage: "Mensaje",
    contactSend: "Enviar Mensaje",
    footerRights: "Todos los derechos reservados.",
    location: "São Bernardo do Campo — SP, Brasil",
  },
};

/* ============================================
   CERTIFICATIONS DATA
   ============================================ */
const certifications: {
  title: L;
  hours: string | null;
  institution: string | null;
  focus: L;
}[] = [
  {
    title: {
      PT: "Programação de Sistemas de Informação",
      EN: "Information Systems Programming",
      ES: "Programación de Sistemas de Información",
    },
    hours: "286h",
    institution: "Estácio",
    focus: {
      PT: "Modelagem de Sistemas e Programação",
      EN: "Systems Modeling & Programming",
      ES: "Modelado de Sistemas y Programación",
    },
  },
  {
    title: {
      PT: "Aplicação da Melhoria Contínua",
      EN: "Applied Continuous Improvement",
      ES: "Aplicación de la Mejora Continua",
    },
    hours: "330h",
    institution: "Estácio",
    focus: {
      PT: "Modelagem de Dados, Modelagem de Sistemas e Métodos Ágeis",
      EN: "Data Modeling, Systems Modeling & Agile Methods",
      ES: "Modelado de Datos, Modelado de Sistemas y Métodos Ágiles",
    },
  },
  {
    title: {
      PT: "Gerência de Projetos de T.I.",
      EN: "IT Project Management",
      ES: "Gerencia de Proyectos de T.I.",
    },
    hours: "198h",
    institution: "Estácio",
    focus: {
      PT: "Gestão de Projetos e Métricas de Software",
      EN: "Project Management & Software Metrics",
      ES: "Gestión de Proyectos y Métricas de Software",
    },
  },
  {
    title: {
      PT: "Direitos e Privacidade dos Usuários",
      EN: "User Rights & Privacy",
      ES: "Derechos y Privacidad de los Usuarios",
    },
    hours: "110h",
    institution: "Estácio",
    focus: {
      PT: "Gestão de Segurança da Informação e Linhas de Software",
      EN: "Information Security Management & Software Lines",
      ES: "Gestión de Seguridad de la Información y Líneas de Software",
    },
  },
  {
    title: {
      PT: "AWS Training — Amazon Translate",
      EN: "AWS Training — Amazon Translate",
      ES: "AWS Training — Amazon Translate",
    },
    hours: null,
    institution: "Amazon Web Services",
    focus: {
      PT: "Amazon Translate Getting Started",
      EN: "Amazon Translate Getting Started",
      ES: "Amazon Translate Getting Started",
    },
  },
  {
    title: {
      PT: "Especializações Técnicas",
      EN: "Technical Specializations",
      ES: "Especializaciones Técnicas",
    },
    hours: null,
    institution: null,
    focus: {
      PT: "Full Stack Development, Inteligência Artificial, Power BI e Automação de Processos",
      EN: "Full Stack Development, Artificial Intelligence, Power BI & Process Automation",
      ES: "Full Stack Development, Inteligencia Artificial, Power BI y Automatización de Procesos",
    },
  },
];

/* ============================================
   PROJECTS DATA
   ============================================ */
const projects: {
  name: string;
  description: L;
  link?: { url: string; label: L };
  actionBadge?: L;
  techs: string[];
}[] = [
  {
    name: "Associa Mais",
    description: {
      PT: "Plataforma de gestão integrada com isolamento de dados via Row-Level Security (RLS) no Supabase, modelagem relacional e painéis administrativos responsivos.",
      EN: "Integrated management platform with data isolation via Row-Level Security (RLS) in Supabase, relational modeling, and responsive admin dashboards.",
      ES: "Plataforma de gestión integrada con aislamiento de datos a través de Row-Level Security (RLS) en Supabase, modelado relacional y paneles administrativos responsivos.",
    },
    link: { url: "https://gestaoassociamais.com.br/home", label: { PT: "Acessar Plataforma ↗", EN: "Access Platform ↗", ES: "Acceder Plataforma ↗" } },
    techs: ["Next.js", "Supabase", "PostgreSQL", "RLS", "Tailwind CSS"],
  },
  {
    name: "Igreja Simples / Segurança Flow",
    description: {
      PT: "Infraestrutura de autenticação segura e controle de acesso. Implementação de proteção contra vulnerabilidades, validação de tokens JWT e APIs resilientes.",
      EN: "Secure authentication infrastructure and access control. Implementation of vulnerability protection, JWT token validation, and resilient APIs.",
      ES: "Infraestructura de autenticación segura y control de acceso. Implementación de protección contra vulnerabilidades, validación de tokens JWT y APIs resilientes.",
    },
    link: { url: "https://www.appigrejasimples.com.br/auth", label: { PT: "Acessar Plataforma ↗", EN: "Access Platform ↗", ES: "Acceder Plataforma ↗" } },
    techs: ["Node.js", "Express", "JWT", "Supabase", "Segurança"],
  },
  {
    name: "Rede Zion",
    description: {
      PT: "Redesign de interface e evolução front-end da plataforma. Otimização da experiência do usuário (UX), componentização modular em React/Next.js e refinamento visual dos fluxos de autenticação.",
      EN: "Interface redesign and platform front-end evolution. User experience (UX) optimization, modular componentization in React/Next.js, and visual refinement of authentication flows.",
      ES: "Rediseño de interfaz y evolución front-end de la plataforma. Optimización de la experiencia del usuario (UX), componentización modular en React/Next.js y refinamiento visual de los flujos de autenticación.",
    },
    link: { url: "https://redezion.com.br/auth", label: { PT: "Acessar Plataforma ↗", EN: "Access Platform ↗", ES: "Acceder Plataforma ↗" } },
    techs: ["React", "Next.js", "UI/UX", "TypeScript", "Tailwind CSS"],
  },
  {
    name: "VeloClip",
    description: {
      PT: "Plataforma para processamento e corte dinâmico de vídeos, com renderização otimizada e interface fluida para produtores de conteúdo.",
      EN: "Platform for dynamic video processing and clipping, with optimized rendering and a fluid interface for content producers.",
      ES: "Plataforma para el procesamiento y recorte dinámico de videos, con renderizado optimizado y una interfaz fluida para productores de contenido.",
    },
    actionBadge: { PT: "Em Desenvolvimento", EN: "In Development", ES: "En Desarrollo" },
    techs: ["Next.js", "TypeScript", "Tailwind CSS"],
  },
];

/* ============================================
   STACK DATA
   ============================================ */
const stackCategories = [
  {
    label: { PT: "Front-End Engineering", EN: "Front-End Engineering", ES: "Front-End Engineering" } as L,
    items: ["React.js", "Next.js", "TypeScript", "JavaScript (ES6+)", "Tailwind CSS", "Vite"],
  },
  {
    label: { PT: "Back-End & Data", EN: "Back-End & Data", ES: "Back-End & Data" } as L,
    items: ["Node.js", "Express.js", "APIs REST", "PostgreSQL", "Supabase", "Row-Level Security (RLS)", "JWT"],
  },
  {
    label: { PT: "Security & AI", EN: "Security & AI", ES: "Security & AI" } as L,
    items: ["Ethical Hacking", "OWASP Top 10", "Zero-Trust", "OpenAI API", "Prompt Engineering"],
  },
  {
    label: { PT: "DevOps & Ferramentas", EN: "DevOps & Tools", ES: "DevOps & Herramientas" } as L,
    items: ["Git", "GitHub", "Docker", "Postman", "Insomnia", "Vercel", "Netlify", "Power BI"],
  },
];

/* ============================================
   SOCIAL LINKS
   ============================================ */
const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/emersoncaio-dev",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/emersoncaio-dev",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: "Email",
    b64: "bWFpbHRvOmVtZXJzb25jYWlvNDAwQG91dGxvb2suY29t",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="4" width="20" height="16" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "WhatsApp",
    b64: "aHR0cHM6Ly93YS5tZS81NTExOTQxNDI4OTkw",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
];

/* ============================================
   SPOTLIGHT CARD COMPONENT
   ============================================ */
function SpotlightCard({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    cardRef.current?.style.setProperty(
      "--spotlight-x",
      `${e.clientX - rect.left}px`
    );
    cardRef.current?.style.setProperty(
      "--spotlight-y",
      `${e.clientY - rect.top}px`
    );
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={`spotlight-card ${className}`}
    >
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ============================================
   MAIN COMPONENT
   ============================================ */
export default function Home() {
  const [lang, setLang] = useState<Lang>("PT");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Security Form State
  const [state, handleSubmit] = useForm('mzebbnog');
  
  const t = dict[lang];

  /* Lock body scroll when mobile menu open */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { href: "#sobre", label: t.navAbout },
    { href: "#skills", label: t.navExperience },
    { href: "#projetos", label: t.navProjects },
    { href: "#certifications", label: t.navCerts },
    { href: "#contact", label: t.navContact },
  ];

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary overflow-x-hidden">
      {/* ============ NAVBAR ============ */}
      <header className="fixed top-0 w-full z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-white/[0.06]">
        <div className="max-w-[var(--spacing-container)] mx-auto px-[var(--spacing-page-x-mobile)] md:px-[var(--spacing-page-x)] flex items-center justify-between h-16 md:h-[72px]">
          {/* Logo */}
          <a
            href="#"
            className="text-white font-semibold text-lg tracking-tight shrink-0"
          >
            Portfólio Profissional
          </a>

          {/* Center Nav — Desktop */}
          <nav
            className="hidden lg:flex items-center gap-1"
            aria-label="Main navigation"
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-[13px] font-medium text-text-secondary hover:text-accent transition-colors duration-200 uppercase tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right — Desktop */}
          <div className="hidden lg:flex items-center gap-4">
            {/* Language Selector */}
            <div className="relative mr-2 group flex items-center">
              <div className="absolute left-3 pointer-events-none flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300">
                  <path d="m5 8 6 6" />
                  <path d="m4 14 6-6 2-3" />
                  <path d="M2 5h12" />
                  <path d="M7 2h1" />
                  <path d="m22 22-5-10-5 10" />
                  <path d="M14 18h6" />
                </svg>
              </div>
              <select
                value={lang}
                onChange={(e) => setLang(e.target.value as Lang)}
                className="appearance-none bg-zinc-900/80 hover:bg-zinc-800/90 backdrop-blur-md border border-white/20 hover:border-white/40 transition-colors rounded-md py-1.5 pl-9 pr-8 text-xs sm:text-sm text-white font-medium shadow-sm cursor-pointer outline-none h-[34px]"
              >
                <option value="PT" className="bg-zinc-950 text-zinc-200">Português</option>
                <option value="EN" className="bg-zinc-950 text-zinc-200">English</option>
                <option value="ES" className="bg-zinc-950 text-zinc-200">Español</option>
              </select>
              <div className="absolute right-2.5 pointer-events-none flex items-center justify-center">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>

            <a href="#contact" className="btn-primary !py-2.5 !px-5 !text-[12px] !rounded-lg">
              {t.navCta}
            </a>
          </div>

          {/* Hamburger — Mobile */}
          <div className="lg:hidden flex items-center gap-4">
            <button
              className="flex flex-col justify-center items-center w-8 h-8 gap-[5px]"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
            >
              <span
                className={`block w-5 h-[2px] bg-white transition-all duration-300 ${
                  mobileMenuOpen ? "rotate-45 translate-y-[7px]" : ""
                }`}
              />
              <span
                className={`block w-5 h-[2px] bg-white transition-all duration-300 ${
                  mobileMenuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-[2px] bg-white transition-all duration-300 ${
                  mobileMenuOpen ? "-rotate-45 -translate-y-[7px]" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="lg:hidden fixed inset-0 top-16 bg-bg-primary/98 backdrop-blur-xl"
            >
              <nav
                className="flex flex-col items-center justify-center h-full gap-8"
                aria-label="Mobile navigation"
              >
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-2xl text-white font-bold uppercase tracking-wider hover:text-accent transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="relative mt-4 group flex items-center">
                  <div className="absolute left-3 pointer-events-none flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-300">
                      <path d="m5 8 6 6" />
                      <path d="m4 14 6-6 2-3" />
                      <path d="M2 5h12" />
                      <path d="M7 2h1" />
                      <path d="m22 22-5-10-5 10" />
                      <path d="M14 18h6" />
                    </svg>
                  </div>
                  <select
                    value={lang}
                    onChange={(e) => {
                      setLang(e.target.value as Lang);
                      setMobileMenuOpen(false);
                    }}
                    className="appearance-none bg-zinc-900/80 hover:bg-zinc-800/90 backdrop-blur-md border border-white/20 hover:border-white/40 transition-colors rounded-md py-2 pl-10 pr-9 text-sm text-white font-medium shadow-sm cursor-pointer outline-none h-[40px] w-[140px]"
                  >
                    <option value="PT" className="bg-zinc-950 text-zinc-200">Português</option>
                    <option value="EN" className="bg-zinc-950 text-zinc-200">English</option>
                    <option value="ES" className="bg-zinc-950 text-zinc-200">Español</option>
                  </select>
                  <div className="absolute right-3 pointer-events-none flex items-center justify-center">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-zinc-400">
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </div>
                </div>
                <a
                  href="#contact"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary mt-4"
                >
                  {t.navCta}
                </a>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ============ HERO ============ */}
      <section className="relative min-h-[90vh] flex items-center bg-[#090d16] overflow-hidden">
        {/* Ambient Glow - Optional for extra depth */}
        <div className="absolute top-1/4 left-[10%] w-96 h-96 bg-emerald-500/[0.03] rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-[10%] w-80 h-80 bg-blue-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[var(--spacing-container)] mx-auto px-[var(--spacing-page-x-mobile)] md:px-[var(--spacing-page-x)] pt-24 md:pt-32 pb-16 md:pb-24 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            
            {/* Left — Content */}
            <motion.div
              initial={{ opacity: 0, x: -60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <h1 className="text-4xl sm:text-5xl lg:text-[3.8rem] xl:text-[4.2rem] font-extrabold tracking-tight leading-[1.1] text-white">
                <span className="block text-white mb-2">{t.heroName}</span>
                <span className="block">
                  <span className="block md:inline text-zinc-200 mr-0 md:mr-3 mb-2 md:mb-0">{t.heroTitle1}</span>
                  <span className="block md:inline bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent filter drop-shadow-[0_0_15px_rgba(251,146,60,0.4)]">
                    {t.heroTitle2}
                  </span>
                </span>
              </h1>

              <p className="text-sm sm:text-base text-zinc-400 leading-relaxed max-w-xl mt-4">
                {t.heroSub}
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              className="flex justify-center lg:justify-end w-full"
            >
              <div className="relative w-full max-w-[300px] sm:max-w-[380px] md:max-w-[440px] lg:w-[500px] xl:w-[540px] mx-auto lg:mx-0">
                {/* Glow effects specific to the image container */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-cyan-500/20 rounded-full blur-3xl -z-10" />

                <Image
                  src="/profile.jpg"
                  alt="Emerson Caio"
                  className="w-full h-full object-cover rounded-2xl shadow-2xl border border-white/10"
                  width={540}
                  height={675}
                  priority
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ ABOUT & ACADEMIC ============ */}
      <section id="sobre" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-5 relative group"
          >
            {/* Glow */}
            <div className="absolute inset-0 bg-emerald-500/20 blur-[100px] rounded-full -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
            <Image
              src="/about-macbook.jpg"
              alt="Sobre Emerson Caio"
              width={800}
              height={1000}
              priority
              unoptimized
              className="w-full h-auto object-cover aspect-[4/5] rounded-2xl border border-white/10 shadow-2xl shadow-emerald-950/20 hover:border-emerald-500/30 transition-all duration-500"
            />
          </motion.div>

          {/* Right Column: Text */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col items-start text-left"
          >
            <h2 className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight mt-3">
              {t.aboutTitle}
            </h2>
            <p className="text-base text-zinc-300 leading-relaxed mt-5">
              {t.aboutP1}
            </p>
            <p className="text-sm sm:text-base text-zinc-400 leading-relaxed mt-4">
              {t.aboutP2}
            </p>
          </motion.div>

        </div>
      </section>

      {/* ============ CERTIFICATIONS ============ */}
      <section
        id="certifications"
        className="bg-bg-primary py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)] border-t border-white/[0.06]"
      >
        <div className="max-w-[var(--spacing-container)] mx-auto px-[var(--spacing-page-x-mobile)] md:px-[var(--spacing-page-x)]">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mb-12 md:mb-16"
          >
            <motion.p
              variants={fadeUp}
              className="text-[13px] font-mono font-semibold text-accent uppercase tracking-widest mb-3"
            >
              {t.certsTitle}
            </motion.p>
            <motion.p variants={fadeUp} className="text-lg text-text-secondary max-w-lg">
              {t.certsSubtitle}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {certifications.map((cert, idx) => (
              <motion.div
                key={idx}
                variants={fadeUpCard}
                whileHover={{ y: -6, scale: 1.02, transition: { duration: 0.25, ease: "easeOut" } }}
                whileTap={{ scale: 0.98, transition: { duration: 0.15 } }}
                className="cert-card cursor-default"
              >
                <div className="flex items-center justify-between mb-4">
                  {cert.hours && (
                    <span className="text-[11px] font-mono font-bold text-accent tracking-wider">
                      {cert.hours}
                    </span>
                  )}
                  {cert.institution && (
                    <span className="text-[10px] font-mono text-text-secondary uppercase tracking-widest">
                      {cert.institution}
                    </span>
                  )}
                </div>
                <h3 className="text-[15px] font-bold text-white tracking-tight mb-3 leading-snug">
                  {cert.title[lang]}
                </h3>
                <p className="text-[12px] text-text-secondary leading-relaxed">
                  {cert.focus[lang]}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ PROJECTS ============ */}
      <section
        id="projetos"
        className="relative bg-bg-secondary py-24 px-6 max-w-7xl mx-auto border-t border-white/[0.06]"
      >
        <div className="w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mb-12 md:mb-16"
          >
            <motion.h2
              variants={fadeUp}
              className="text-3xl lg:text-4xl font-extrabold text-white tracking-tight"
            >
              {t.projTitle}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-sm sm:text-base text-zinc-400 mt-3 max-w-2xl">
              {t.projSubtitle}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12"
          >
            {projects.map((proj, idx) => (
              <motion.div
                key={idx}
                variants={fadeUpCard}
                whileHover={{ y: -8, scale: 1.015, transition: { duration: 0.3, ease: "easeOut" } }}
                whileTap={{ scale: 0.985, transition: { duration: 0.15 } }}
                className="h-full"
              >
                <SpotlightCard className="h-full group hover:-translate-y-1 transition-all duration-500 ease-in-out rounded-3xl">
                  <div className="bg-gradient-to-b from-white/[0.04] via-zinc-950/60 to-zinc-950/90 backdrop-blur-md border border-white/[0.08] hover:border-emerald-500/30 active:border-emerald-500/40 rounded-3xl p-7 lg:p-8 flex flex-col justify-between shadow-2xl hover:shadow-emerald-950/30 transition-all duration-500 ease-in-out h-full">
                    
                    <div>
                      {/* Name */}
                      <h3 className="text-xl font-bold text-white tracking-tight mb-4 group-hover:text-emerald-400 transition-colors">
                        {proj.name}
                      </h3>

                      {/* Description */}
                      <p className="text-sm text-zinc-400 leading-relaxed font-normal min-h-[4rem] mb-8">
                        {proj.description[lang]}
                      </p>

                      {/* Techs */}
                      <div className="flex flex-wrap gap-2 mb-8">
                        {proj.techs.map((tech) => (
                          <span key={tech} className="px-2.5 py-1 rounded-md text-[11px] font-mono text-zinc-300 bg-white/[0.04] border border-white/5 hover:border-white/20 transition-colors">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Link / Action */}
                    <div className="mt-auto">
                      {proj.link ? (
                        <a
                          href={proj.link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full py-3 px-4 rounded-xl bg-white/[0.03] hover:bg-emerald-500/10 border border-white/10 hover:border-emerald-500/30 text-sm font-medium text-white flex items-center justify-between transition-all group/btn mt-6"
                        >
                          {proj.link.label[lang]}
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="transition-transform group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
                          >
                            <path d="M7 17 17 7" />
                            <path d="M7 7h10v10" />
                          </svg>
                        </a>
                      ) : proj.actionBadge ? (
                        <div className="w-full py-3 px-4 rounded-xl bg-white/[0.02] border border-white/5 text-sm font-medium text-zinc-500 flex items-center justify-between cursor-not-allowed mt-6">
                          {proj.actionBadge[lang]}
                        </div>
                      ) : null}
                    </div>
                  </div>
                </SpotlightCard>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ============ TECH STACK ============ */}
      <section id="skills" className="bg-bg-primary py-24 px-6 max-w-7xl mx-auto border-t border-white/[0.06]">
        <div className="w-full">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="mb-12 md:mb-16"
          >
            <motion.p
              variants={fadeUp}
              className="text-3xl md:text-4xl font-bold tracking-tight leading-tight mb-4 text-white"
            >
              {t.stackTitle}
            </motion.p>
            <motion.p variants={fadeUp} className="text-base md:text-lg text-text-secondary leading-relaxed max-w-2xl">
              {t.stackSubtitle}
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={stagger}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start"
          >
            {/* Left Column: Image */}
            <motion.div variants={fadeUp} className="lg:col-span-5 relative w-full max-w-sm sm:max-w-md mx-auto lg:max-w-none">
              <div className="w-full h-auto rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950/40 flex items-center justify-center">
                <Image
                  src="/cybersecurity-laptop.jpg"
                  alt="Cybersecurity Laptop"
                  width={600}
                  height={450}
                  className="w-full h-auto object-cover aspect-square lg:aspect-[4/3] rounded-2xl"
                />
              </div>
            </motion.div>

            {/* Right Column: Skills Grid */}
            <motion.div variants={fadeUp} className="lg:col-span-7">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {stackCategories.map((cat, catIdx) => (
                  <motion.div
                    key={catIdx}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: catIdx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                    whileHover={{ y: -4, scale: 1.015, transition: { duration: 0.25, ease: "easeOut" } }}
                    whileTap={{ scale: 0.985, transition: { duration: 0.15 } }}
                    className="bg-white/[0.02] border border-white/[0.04] p-6 rounded-2xl flex flex-col h-full hover:border-white/10 hover:bg-white/[0.04] hover:shadow-lg hover:shadow-black/20 transition-all duration-500 ease-in-out cursor-default"
                  >
                    <h3 className="text-sm font-semibold text-white tracking-tight mb-4">
                      {cat.label[lang]}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {cat.items.map((item) => (
                        <span
                          key={item}
                          className="bg-white/[0.04] hover:bg-emerald-500/10 active:bg-emerald-500/15 border border-white/5 hover:border-emerald-500/30 text-zinc-300 text-xs font-mono py-1.5 px-3 rounded-lg transition-all duration-300 ease-in-out cursor-default"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ============ FEATURED SERVICE ============ */}
      <section id="auditoria" className="py-24 px-6 max-w-7xl mx-auto overflow-visible">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10 items-center">
          
          {/* Center Column: Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left z-10"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-[3rem] font-extrabold text-white tracking-tight leading-[1.1]">
              {t.serviceTitle}
            </h2>
            <p className="text-base sm:text-lg lg:text-[1.2rem] text-zinc-300 leading-relaxed mt-6 lg:pr-12">
              {t.serviceDesc}
            </p>
          </motion.div>

          {/* Right Column: Image 2 */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="lg:col-span-5 w-full max-w-sm sm:max-w-md mx-auto lg:max-w-none h-full"
          >
            <Image
              src="/emerson-profile-studio.jpg"
              alt="Emerson Caio"
              width={600}
              height={750}
              priority
              unoptimized
              className="w-full h-auto object-cover aspect-[4/5] rounded-2xl border border-white/10 shadow-2xl shadow-emerald-950/20 hover:border-emerald-500/30 transition-all duration-500"
            />
          </motion.div>

        </div>
      </section>

      {/* ============ CONTACT ============ */}
      <section
        id="contact"
        className="bg-bg-primary py-[var(--spacing-section-mobile)] md:py-[var(--spacing-section)] border-t border-white/[0.06]"
      >
        <div className="max-w-[var(--spacing-container)] mx-auto px-[var(--spacing-page-x-mobile)] md:px-[var(--spacing-page-x)]">
          <div className="grid md:grid-cols-2 gap-16 md:gap-20">
            {/* Left — Info */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
            >
              <motion.h2
                variants={fadeUp}
                className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-[1.1] whitespace-pre-line mb-6 text-white"
              >
                {t.contactTitle}
              </motion.h2>
              <motion.p
                variants={fadeUp}
                className="text-base text-text-secondary max-w-md mb-10 leading-relaxed"
              >
                {t.contactText}
              </motion.p>

              {/* Social Links */}
              <motion.div variants={fadeUp} className="flex flex-col gap-4">
                {socialLinks.map((link: any) => {
                  const isLink = !!link.href;
                  
                  return isLink ? (
                    <a
                      key={link.label}
                      href={link.href}
                      target={link.href.startsWith("http") ? "_blank" : undefined}
                      rel={
                        link.href.startsWith("http")
                          ? "noopener noreferrer"
                          : undefined
                      }
                      className="group flex items-center gap-4 py-3 border-b border-white/[0.06] hover:border-accent/30 transition-colors duration-300"
                    >
                      <span className="text-text-secondary group-hover:text-accent transition-colors">
                        {link.icon}
                      </span>
                      <span className="text-sm font-medium text-text-secondary group-hover:text-white transition-colors">
                        {link.label}
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-text-secondary/40 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </a>
                  ) : (
                    <button
                      key={link.label}
                      onClick={() => {
                        if (link.b64) window.open(atob(link.b64), link.b64.includes("aHR0c") ? "_blank" : "_self", "noopener,noreferrer");
                      }}
                      className="group flex w-full items-center gap-4 py-3 border-b border-white/[0.06] hover:border-accent/30 transition-colors duration-300 text-left"
                    >
                      <span className="text-text-secondary group-hover:text-accent transition-colors">
                        {link.icon}
                      </span>
                      <span className="text-sm font-medium text-text-secondary group-hover:text-white transition-colors">
                        {link.label}
                      </span>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-auto text-text-secondary/40 group-hover:text-accent group-hover:translate-x-1 transition-all duration-300">
                        <path d="M5 12h14" />
                        <path d="m12 5 7 7-7 7" />
                      </svg>
                    </button>
                  );
                })}

                {/* Location */}
                <div className="flex items-center gap-4 py-3">
                  <span className="text-text-secondary">
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </span>
                  <span className="text-sm text-text-secondary">
                    {t.location}
                  </span>
                </div>
              </motion.div>
            </motion.div>

            {/* Right — Form */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              variants={stagger}
            >
              <motion.h3
                variants={fadeUp}
                className="text-sm font-bold uppercase tracking-widest text-accent mb-8"
              >
                {t.contactFormTitle}
              </motion.h3>
              {state.succeeded ? (
                <motion.p variants={fadeUp} className="text-zinc-300 text-base leading-relaxed">
                  Mensagem enviada com sucesso! Obrigado pelo contato.
                </motion.p>
              ) : (
              <motion.form
                variants={fadeUp}
                className="flex flex-col gap-6"
                onSubmit={handleSubmit}
              >
                {/* Honeypot Field — Anti-spam */}
                <input 
                  type="text" 
                  name="_gotcha" 
                  tabIndex={-1} 
                  autoComplete="off" 
                  className="opacity-0 absolute -z-10 h-0 w-0" 
                  aria-hidden="true" 
                />
                {/* Formspree: redirect após envio */}
                <input type="hidden" name="_next" value="" />
                <input type="hidden" name="_subject" value="Nova mensagem do Portfólio — Emerson Caio" />
                
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-[11px] font-mono text-text-secondary uppercase tracking-widest mb-2"
                  >
                    {t.contactName}
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    className="w-full bg-transparent border-b border-white/[0.08] text-white py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                    placeholder="—"
                  />
                </div>
                <div>
                  <label
                    htmlFor="contact-email"
                    className="block text-[11px] font-mono text-text-secondary uppercase tracking-widest mb-2"
                  >
                    {t.contactEmail}
                  </label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    className="w-full bg-transparent border-b border-white/[0.08] text-white py-3 text-sm focus:outline-none focus:border-accent transition-colors"
                    placeholder="—"
                  />
                  <ValidationError prefix="Email" field="email" errors={state.errors} className="text-red-500 text-xs mt-1 block" />
                </div>
                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-[11px] font-mono text-text-secondary uppercase tracking-widest mb-2"
                  >
                    {t.contactMessage}
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={4}
                    required
                    className="w-full bg-transparent border-b border-white/[0.08] text-white py-3 text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                    placeholder="—"
                  />
                  <ValidationError prefix="Message" field="message" errors={state.errors} className="text-red-500 text-xs mt-1 block" />
                </div>
                <button type="submit" disabled={state.submitting} className="btn-primary self-start mt-2 disabled:opacity-50 transition-all">
                  {state.submitting ? "Enviando..." : t.contactSend}
                  {!state.submitting && (
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  )}
                </button>
              </motion.form>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============ FOOTER ============ */}
      <footer className="bg-bg-deep border-t border-white/[0.04]">
        <div className="max-w-[var(--spacing-container)] mx-auto px-[var(--spacing-page-x-mobile)] md:px-[var(--spacing-page-x)] py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-sm font-semibold text-white tracking-tight">
            Emerson Caio
          </span>

          <div className="flex items-center gap-5">
            {socialLinks.slice(0, 2).map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-text-secondary hover:text-accent transition-colors"
                aria-label={link.label}
              >
                {link.icon}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              {(["PT", "EN", "ES"] as Lang[]).map((l, idx) => (
                <React.Fragment key={l}>
                  <button
                    onClick={() => setLang(l)}
                    className={`px-1 text-[11px] font-mono transition-colors ${
                      lang === l
                        ? "text-accent"
                        : "text-text-secondary hover:text-white"
                    }`}
                  >
                    {l}
                  </button>
                  {idx < 2 && (
                    <span className="text-white/10 text-[10px]">|</span>
                  )}
                </React.Fragment>
              ))}
            </div>
            <span className="text-[12px] text-text-secondary">
              © 2026 Emerson Caio. Todos os direitos reservados.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
