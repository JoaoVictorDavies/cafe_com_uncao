'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Calendar, Clock, MapPin, Heart, BookOpen, CheckCircle, ArrowRight, Copy, Check } from 'lucide-react';
import { differenceInDays } from 'date-fns';

export default function Home() {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [preletores, setPreletores] = useState<any[]>([]);
  const [diasFaltando, setDiasFaltando] = useState(0);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [copiado, setCopiado] = useState(false);

  const numeroPastora = '5513981607387'; 
  const chavePix = '13981607387';

  useEffect(() => {
    const fetchPreletores = async () => {
      const { data } = await supabase.from('preletores').select('*');
      if (data) setPreletores(data);
    };
    fetchPreletores();

    const dataEvento = new Date('2026-10-17T19:00:00');
    setDiasFaltando(differenceInDays(dataEvento, new Date()));
  }, []);

  const handleInscricao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const { error } = await supabase.from('inscritas').insert([{ nome, telefone }]);
    
    setIsSubmitting(false);
    if (!error) {
      setSucesso(true); 
    } else {
      alert('Erro ao realizar inscrição. Verifique sua conexão.');
    }
  };

  const copiarPix = () => {
    navigator.clipboard.writeText(chavePix);
    setCopiado(true);
    setTimeout(() => setCopiado(false), 3000);
  };

  const irParaWhatsApp = () => {
    const mensagem = `A Paz do Senhor, Pastora! Acabei de me inscrever no site para o Café com Unção. Meu nome é ${nome} e segue o meu comprovante do PIX no valor de R$30.`;
    window.open(`https://wa.me/${numeroPastora}?text=${encodeURIComponent(mensagem)}`, '_blank');
    setNome('');
    setTelefone('');
    setSucesso(false);
  };

  // Lógica inteligente que separa o Vídeo das Pessoas Reais
  const videoDestaque = preletores.find(p => p.nome === 'VIDEO_DESTAQUE')?.video_url;
  const preletoresReais = preletores.filter(p => p.nome !== 'VIDEO_DESTAQUE');

  return (
    <div className="min-h-screen bg-[#FFF0F5] text-gray-800 font-sans selection:bg-pink-300">
      
      <header className="bg-gradient-to-br from-pink-500 via-rose-400 to-pink-300 text-white py-24 px-4 text-center rounded-b-[4rem] shadow-xl animate-in fade-in slide-in-from-top-8 duration-1000">
        <h3 className="text-pink-100 font-semibold mb-3 tracking-[0.2em] text-sm md:text-base uppercase">Evento Exclusivo para Mulheres</h3>
        <h1 className="text-5xl md:text-7xl font-bold mb-4 font-serif drop-shadow-md">Café com Unção</h1>
        <h2 className="text-2xl md:text-3xl font-light italic mb-10">Mulher Renovada por Deus</h2>
        
        <div className="bg-white/10 inline-block p-6 rounded-2xl backdrop-blur-md border border-white/20 max-w-2xl transform transition hover:scale-105 duration-300">
          <BookOpen className="mx-auto mb-3 opacity-90" size={36} />
          <p className="text-xl md:text-2xl font-medium leading-relaxed">"E vos renovais no espírito do vosso entendimento."</p>
          <p className="text-base mt-3 font-semibold tracking-widest uppercase opacity-80">Efésios 4:23</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12 -mt-10 relative z-10">
        
        {/* Renderiza o vídeo AQUI SEPARADAMENTE */}
        {videoDestaque && (
          <div className="bg-white p-2 md:p-3 rounded-2xl shadow-2xl mb-16 animate-in fade-in zoom-in duration-1000 delay-300 max-w-3xl mx-auto border border-pink-100">
            <div className="w-full aspect-video rounded-xl overflow-hidden bg-gray-900 shadow-inner">
              <iframe width="100%" height="100%" src={videoDestaque} title="Convite" frameBorder="0" allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen></iframe>
            </div>
          </div>
        )}

        {/* Renderiza APENAS AS PRELETORAS reais aqui */}
        {preletoresReais.length > 0 && (
          <div className="mb-20 pt-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
            <h3 className="text-4xl font-serif font-bold text-center text-gray-800 mb-12">Quem estará conosco</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {preletoresReais.map((p) => (
                <div key={p.id} className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-xl transition-all duration-300 border border-pink-50 text-center flex flex-col items-center group">
                  <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-pink-100 shadow-inner mb-6 group-hover:border-pink-300 transition-colors">
                    <img src={p.imagem_url} alt={p.nome} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <h4 className="font-bold text-2xl text-gray-800 mb-1">{p.nome}</h4>
                  <p className="text-base text-pink-500 font-medium">{p.tema}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="w-24 h-1 bg-pink-200 mx-auto mb-16 rounded-full"></div>

        <div className="grid lg:grid-cols-5 gap-8 mb-16 items-start">
          
          <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-lg border border-pink-100 flex flex-col gap-8">
            <div className="text-center pb-6 border-b border-gray-100">
              <p className="text-gray-500 text-sm uppercase tracking-widest mb-2">Faltam apenas</p>
              <div className="text-6xl font-black text-rose-500 tracking-tighter">{diasFaltando}</div>
              <p className="text-gray-500 mt-1 font-medium">dias para o evento</p>
            </div>
            
            <div className="flex items-center gap-5">
              <div className="bg-pink-50 p-4 rounded-full text-pink-500"><Calendar size={28} /></div>
              <div><p className="text-sm text-gray-500 font-semibold">Data</p><p className="text-lg font-bold text-gray-800">17/10/2026</p></div>
            </div>
            <div className="flex items-center gap-5">
              <div className="bg-pink-50 p-4 rounded-full text-pink-500"><Clock size={28} /></div>
              <div><p className="text-sm text-gray-500 font-semibold">Horário</p><p className="text-lg font-bold text-gray-800">19:00 horas</p></div>
            </div>
            <div className="flex items-center gap-5">
              <div className="bg-pink-50 p-4 rounded-full text-pink-500"><MapPin size={28} /></div>
              <div>
                <p className="text-sm text-gray-500 font-semibold">Local</p>
                <p className="text-base font-bold text-gray-800">Igreja Fazendo a Diferença</p>
                <p className="text-sm text-gray-500 mt-1">Rua Viriato Leão de Moura, 215<br/>Vila Clementina - SP</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 bg-white p-8 md:p-10 rounded-3xl shadow-xl shadow-pink-200/40 border border-pink-100 relative overflow-hidden">
            {!sucesso ? (
              <div className="animate-in fade-in duration-500">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-400 via-rose-400 to-pink-400"></div>
                <h3 className="text-3xl font-bold text-gray-800 mb-3 font-serif">Garantir minha vaga</h3>
                <p className="text-gray-600 mb-8 text-lg">Investimento: <span className="font-bold text-pink-500 text-xl">R$ 30,00</span></p>
                
                <form onSubmit={handleInscricao} className="flex flex-col gap-5">
                  <div>
                    <label className="text-sm font-semibold text-gray-600 ml-1">Nome Completo</label>
                    <input type="text" required className="w-full mt-1 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white" value={nome} onChange={(e) => setNome(e.target.value)} />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-gray-600 ml-1">WhatsApp</label>
                    <input type="tel" required className="w-full mt-1 p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-400 focus:border-transparent outline-none transition-all bg-gray-50 hover:bg-white" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
                  </div>
                  
                  <button type="submit" disabled={isSubmitting} className="mt-4 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-5 rounded-xl transition-all shadow-lg hover:shadow-pink-500/30 flex items-center justify-center gap-3 text-lg disabled:opacity-70 transform hover:-translate-y-1">
                    {isSubmitting ? 'Processando...' : <><Heart size={22} className="animate-pulse" /> Quero Participar</>}
                  </button>
                </form>
              </div>
            ) : (
              <div className="text-center py-6 animate-in zoom-in duration-500 flex flex-col items-center">
                <CheckCircle className="text-green-500 mb-4" size={64} />
                <h3 className="text-2xl font-bold text-gray-800 mb-2">Quase lá, {nome.split(' ')[0]}!</h3>
                <p className="text-gray-600 mb-6 text-sm md:text-base">Sua vaga está pré-reservada. Realize o pagamento de <span className="font-bold text-pink-500">R$ 30,00</span> e envie o comprovante.</p>
                
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 w-full mb-8 text-left">
                  <p className="text-sm text-gray-500 mb-2 font-medium">Chave PIX (Celular)</p>
                  <div className="flex items-center justify-between bg-white border border-gray-200 rounded-lg p-3 shadow-sm">
                    <span className="font-mono font-bold text-lg text-gray-800 tracking-wide">{chavePix}</span>
                    <button onClick={copiarPix} className="flex items-center gap-2 bg-pink-100 hover:bg-pink-200 text-pink-700 px-4 py-2 rounded-md transition-colors font-medium text-sm">
                      {copiado ? <><Check size={16} /> Copiado</> : <><Copy size={16} /> Copiar</>}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-3 flex items-center gap-1">
                    <CheckCircle size={12} className="text-green-500" /> Silvana Barboza de Sousa
                  </p>
                </div>

                <button onClick={irParaWhatsApp} className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 text-lg w-full transform hover:-translate-y-1">
                  Enviar Comprovante <ArrowRight size={20} />
                </button>
              </div>
            )}
          </div>
        </div>

      </main>

      <footer className="bg-white border-t border-pink-100 py-10 text-center px-4">
        <Heart className="mx-auto text-rose-400 mb-4" size={32} />
        <p className="text-2xl font-serif text-gray-700 italic">"Você é amada, cuidada e escolhida por Deus!"</p>
      </footer>
    </div>
  );
}