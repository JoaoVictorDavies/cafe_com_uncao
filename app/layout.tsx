// app/layout.tsx
import type { Metadata, Viewport } from 'next';
import './globals.css';

export const viewport: Viewport = {
  themeColor: '#f472b6', 
};

// ATENÇÃO: Substitua a URL abaixo pelo link real do seu site na Vercel
const siteUrl = 'https://cafe-com-uncao.vercel.app'; 

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Café com Unção - Mulher Renovada',
  description: 'Evento exclusivo para mulheres. Você é amada, cuidada e escolhida por Deus!',
  openGraph: {
    title: 'Café com Unção - Mulher Renovada por Deus',
    description: 'Junte-se a nós neste encontro especial! Dia 17/10 às 19:00. Clique para garantir sua vaga.',
    url: siteUrl,
    siteName: 'Café com Unção',
    locale: 'pt_BR',
    type: 'website',
    // Não precisamos mais colocar a tag "images" aqui, porque o arquivo físico "opengraph-image" que você colocou na pasta app fará o trabalho de forma mais eficiente!
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className="scroll-smooth">
      <body className="antialiased">{children}</body>
    </html>
  );
}