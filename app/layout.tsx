import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#f472b6', 
};

// MUITO IMPORTANTE: Coloque o seu link real da Vercel aqui (sem a barra / no final)
const siteUrl = 'https://SEU-LINK-AQUI.vercel.app'; 

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
        // Aqui nós forçamos o link absoluto da imagem que está na pasta public
        url: `${siteUrl}/capa.jpg`,
        width: 1200,
        height: 630,
        alt: 'Convite Café com Unção',
      },
    ],
    locale: 'pt_BR',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}