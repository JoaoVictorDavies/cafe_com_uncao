import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#f472b6', 
};

const siteUrl = 'https://cafecomuncao.vercel.app'; 

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Café com Unção - Mulher Renovada',
  description: 'Evento exclusivo para mulheres. Você é amada, cuidada e escolhida por Deus!',
  openGraph: {
    title: 'Café com Unção - Mulher Renovada',
    description: 'Junte-se a nós neste encontro especial! Dia 17/10 às 19:00.',
    url: siteUrl,
    siteName: 'Café com Unção',
    images: [
      {
        url: `${siteUrl}/capa.jpg`,
        width: 1200,
        height: 630,
        alt: 'Convite Café com Unção',
        type: 'image/jpeg', // Ajuda o WhatsApp a ler mais rápido
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
  // O TRUQUE DE MESTRE: Isso força o formato "Banner Grande" no WhatsApp, Telegram e iOS
  twitter: {
    card: 'summary_large_image',
    title: 'Café com Unção - Mulher Renovada',
    description: 'Junte-se a nós neste encontro especial! Dia 17/10 às 19:00.',
    images: [`${siteUrl}/capa.jpg`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}