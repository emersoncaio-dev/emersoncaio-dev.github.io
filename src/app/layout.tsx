import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Emerson Caio — Software Engineer & Cybersecurity Specialist",
  description:
    "Engenheiro de Software graduado, pós-graduando em Ethical Hacking & Cybersecurity. Full-Stack Development com React/Next.js, arquiteturas seguras com Supabase/PostgreSQL e integração de IA.",
  openGraph: {
    title: "Emerson Caio — Software Engineer & Cybersecurity",
    description:
      "Engenharia de software de alta performance, arquiteturas seguras e inteligência artificial.",
    type: "website",
    locale: "pt_BR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="antialiased bg-bg-primary text-text-primary">
        {children}
      </body>
    </html>
  );
}
