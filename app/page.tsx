// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, MapPin, Heart, BookOpen } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export default function Home() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [preletores, setPreletores] = useState<any[]>([]);
  const [diasFaltando, setDiasFaltando] = useState(0);

  // Número do WhatsApp da Pastora (Substitua pelo número real com código do país e DDD)
  const numeroPastora = '5513981607387'; 

  useEffect(() => {
    // Busca os preletores do banco
    const fetchPreletores = async () => {
      const { data } = await supabase.from('preletores').select('*');
      if (data) setPreletores(data);
    };
    fetchPreletores();

    // Calcula os dias para o evento
    const dataEvento = new Date('2026-10-17T19:00:00');
    setDiasFaltando(differenceInDays(dataEvento, new Date()));
  }, []);

  const handleInscricao = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Salva no banco de dados
    const { error } = await supabase.from('inscritas').insert([{ nome, telefone }]);
    
    if (!error) {
      // Redireciona para o WhatsApp da pastora
      const mensagem = `A Paz do Senhor, Pastora! Gostaria de confirmar minha inscrição e o pagamento (R$ 30) para o evento Café com Unção. Meu nome é ${nome}.`;
      const zapLink = `https://wa.me/${numeroPastora}?text=${encodeURIComponent(mensagem)}`;
      window.open(zapLink, '_blank');
      setNome('');
      setTelefone('');
    } else {
      alert('Erro ao realizar inscrição. Tente novamente.');
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0F5] text-gray-800 font-sans">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-pink-400 to-rose-300 text-white py-20 px-4 text-center rounded-b-[3rem] shadow-lg">
        <h3 className="text-pink-100 font-semibold mb-2 tracking-wider">EVENTO EXCLUSIVO PARA MULHERES</h3>
        <h1 className="text-4xl md:text-6xl font-bold mb-4 font-serif">CAFÉ COM UNÇÃO</h1>
        <h2 className="text-2xl md:text-3xl font-light italic mb-8">Mulher Renovada por Deus</h2>
        
        <div className="bg-white/20 inline-block p-4 rounded-xl backdrop-blur-sm border border-white/30 max-w-2xl">
          <BookOpen className="mx-auto mb-2 opacity-80" size={32} />
          <p className="text-lg md:text-xl font-medium">"E vos renovais no espírito do vosso entendimento."</p>
          <p className="text-sm mt-2 font-semibold">- Efésios 4:23 -</p>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Contagem Regressiva */}
        <div className="text-center mb-16">
          <p className="text-gray-500 mb-2">Faltam apenas</p>
          <div className="text-5xl font-bold text-rose-500">{diasFaltando} dias</div>
          <p className="text-gray-500 mt-2">para o nosso encontro!</p>
        </div>

        {/* Informações do Evento */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-pink-100 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <Calendar className="text-pink-500" size={28} />
              <div>
                <p className="text-sm text-gray-500 font-semibold">Data</p>
                <p className="text-lg font-medium">17 de Outubro de 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Clock className="text-pink-500" size={28} />
              <div>
                <p className="text-sm text-gray-500 font-semibold">Horário</p>
                <p className="text-lg font-medium">19:00</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <MapPin className="text-pink-500" size={28} />
              <div>
                <p className="text-sm text-gray-500 font-semibold">Local</p>
                <p className="text-lg font-medium">Igreja Evangélica Fazendo a Diferença</p>
                <p className="text-sm text-gray-500">Rua Viriato Leão de Moura, 215, Vila Clementina - SP</p>
              </div>
            </div>
          </div>

          {/* Formulário */}
          <div className="bg-white p-8 rounded-2xl shadow-xl shadow-pink-200/50 border border-pink-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 to-rose-400"></div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">Garantir minha vaga</h3>
            <p className="text-gray-500 mb-6">Valor simbólico: <span className="font-bold text-pink-500 text-lg">R$ 30,00</span></p>
            
            <form onSubmit={handleInscricao} className="flex flex-col gap-4">
              <input
                type="text"
                placeholder="Seu Nome Completo"
                required
                className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-gray-50"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              <input
                type="tel"
                placeholder="Seu Telefone (WhatsApp)"
                required
                className="p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-400 bg-gray-50"
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
              />
              <button 
                type="submit" 
                className="mt-2 bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-lg transition-colors shadow-md flex items-center justify-center gap-2"
              >
                <Heart size={20} />
                Quero Participar
              </button>
              <p className="text-xs text-gray-400 text-center mt-2">Ao clicar, você será direcionada ao WhatsApp da Pastora para concluir.</p>
            </form>
          </div>
        </div>

        {/* Preletores (Só aparece se houver cadastrados) */}
        {preletores.length > 0 && (
          <div className="mb-16">
            <h3 className="text-3xl font-serif font-bold text-center text-gray-800 mb-8">Quem estará conosco</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {preletores.map((p) => (
                <div key={p.id} className="text-center group">
                  <div className="w-32 h-32 mx-auto rounded-full overflow-hidden border-4 border-white shadow-lg mb-4 bg-gray-100">
                    <img src={p.imagem_url} alt={p.nome} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-bold text-gray-800">{p.nome}</h4>
                  <p className="text-sm text-pink-500 font-medium">{p.tema}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="bg-white border-t border-pink-100 py-8 text-center px-4">
        <Heart className="mx-auto text-rose-400 mb-3" size={32} />
        <p className="text-xl font-serif text-gray-700 italic">"Você é amada, cuidada e escolhida por Deus!"</p>
      </footer>
    </div>
  );
}