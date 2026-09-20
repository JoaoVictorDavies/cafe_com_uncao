import type { Metadata, Viewport } from 'next';
import './globals.css';

// Pinta a barra do navegador no celular de rosa (Google Chrome/Safari)
export const viewport: Viewport = {
  themeColor: '#f472b6', 
};

// Configurações para compartilhamento no WhatsApp, Insta, etc.
export const metadata: Metadata = {
  title: 'Café com Unção - Mulher Renovada',
  description: 'Evento exclusivo para mulheres. Você é amada, cuidada e escolhida por Deus!',
  openGraph: {
    title: 'Café com Unção - Mulher Renovada por Deus',
    description: 'Junte-se a nós neste encontro especial! Dia 17/10 às 19:00. Clique para garantir sua vaga.',
    url: 'https://seusite.vercel.app', // A Vercel entende automaticamente
    siteName: 'Café com Unção',
    images: [
      {
        // Uma imagem floral bonita puxada do Unsplash para ilustrar o link
        url: 'https://images.unsplash.com/photo-1490730141103-6cac27aaab94?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Flores e Bíblia',
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