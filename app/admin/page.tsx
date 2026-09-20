'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, UploadCloud, Trash2, Edit, MessageCircle, X } from 'lucide-react';

export default function AdminPage() {
  const [inscritas, setInscritas] = useState<any[]>([]);
  const [preletores, setPreletores] = useState<any[]>([]);
  
  // Estados de Criação Preletor
  const [nomeP, setNomeP] = useState('');
  const [temaP, setTemaP] = useState('');
  const [videoP, setVideoP] = useState('');
  const [fotoP, setFotoP] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // Estados de Edição (CRUD completo)
  const [editInscrita, setEditInscrita] = useState<any>(null);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const { data: iData } = await supabase.from('inscritas').select('*').order('criado_em', { ascending: false });
    if (iData) setInscritas(iData);
    
    const { data: pData } = await supabase.from('preletores').select('*');
    if (pData) setPreletores(pData);
  };

  // --- CRUD INSCRITAS ---
  const apagarInscrita = async (id: string) => {
    if (!confirm('Excluir esta inscrição?')) return;
    await supabase.from('inscritas').delete().eq('id', id);
    carregarDados();
  };

  const salvarEdicaoInscrita = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('inscritas').update({ nome: editInscrita.nome, telefone: editInscrita.telefone }).eq('id', editInscrita.id);
    setEditInscrita(null);
    carregarDados();
  };

  // --- CRUD PRELETORES ---
  const apagarPreletor = async (id: string) => {
    if (!confirm('Remover esta preletora do site?')) return;
    await supabase.from('preletores').delete().eq('id', id);
    carregarDados();
  };

  const addPreletor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fotoP) return alert('Selecione uma foto');
    setLoading(true);

    try {
      const fileExt = fotoP.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      await supabase.storage.from('fotos-preletores').upload(fileName, fotoP);
      const { data: { publicUrl } } = supabase.storage.from('fotos-preletores').getPublicUrl(fileName);

      let urlEmbed = videoP;
      if (videoP.includes('watch?v=')) urlEmbed = videoP.replace('watch?v=', 'embed/');
      else if (videoP.includes('youtu.be/')) urlEmbed = videoP.replace('youtu.be/', 'youtube.com/embed/');

      await supabase.from('preletores').insert([{ nome: nomeP, tema: temaP, imagem_url: publicUrl, video_url: urlEmbed }]);
      
      setNomeP(''); setTemaP(''); setVideoP(''); setFotoP(null);
      carregarDados();
    } catch (error) {
      alert('Erro ao salvar no banco.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-gray-800">Painel Administrativo</h1>

        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* GERENCIAR INSCRITAS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><Users className="text-pink-500" /> Confirmadas ({inscritas.length})</h2>
            <div className="h-[600px] overflow-y-auto pr-2 space-y-3">
              {inscritas.map((i) => (
                <div key={i.id} className="p-4 bg-gray-50 rounded-xl border flex items-center justify-between hover:border-pink-200 transition">
                  <div>
                    <p className="font-bold text-gray-800">{i.nome}</p>
                    <p className="text-sm text-gray-500">{i.telefone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setEditInscrita(i)} className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200" title="Editar"><Edit size={18} /></button>
                    <a href={`https://wa.me/${i.telefone.replace(/\D/g, '')}`} target="_blank" className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200" title="Chamar WhatsApp"><MessageCircle size={18} /></a>
                    <button onClick={() => apagarInscrita(i.id)} className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200" title="Excluir"><Trash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            {/* ADICIONAR PRELETOR */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2"><UploadCloud className="text-pink-500" /> Nova Preletora / Vídeo</h2>
              <form onSubmit={addPreletor} className="space-y-4">
                <input type="text" placeholder="Nome" required className="w-full p-3 border rounded-lg bg-gray-50" value={nomeP} onChange={e => setNomeP(e.target.value)} />
                <input type="text" placeholder="Tema ou Cargo" required className="w-full p-3 border rounded-lg bg-gray-50" value={temaP} onChange={e => setTemaP(e.target.value)} />
                <input type="url" placeholder="Link do Vídeo no YouTube (Opcional)" className="w-full p-3 border rounded-lg bg-gray-50" value={videoP} onChange={e => setVideoP(e.target.value)} />
                <input type="file" accept="image/*" required className="w-full p-3 border rounded-lg bg-gray-50" onChange={e => setFotoP(e.target.files?.[0] || null)} />
                <button disabled={loading} className="w-full bg-gray-800 text-white font-bold py-4 rounded-lg hover:bg-gray-900">{loading ? 'Salvando...' : 'Publicar no Site'}</button>
              </form>
            </div>

            {/* LISTA DE PRELETORES CADASTRADOS */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
               <h2 className="text-lg font-bold mb-4">Preletoras no Site</h2>
               <div className="grid grid-cols-2 gap-4">
                 {preletores.map((p) => (
                   <div key={p.id} className="relative border rounded-lg p-3 text-center">
                     <button onClick={() => apagarPreletor(p.id)} className="absolute top-2 right-2 p-1.5 bg-red-100 text-red-600 rounded-md hover:bg-red-200"><Trash2 size={14}/></button>
                     <img src={p.imagem_url} alt={p.nome} className="w-16 h-16 rounded-full mx-auto object-cover mb-2" />
                     <p className="font-bold text-sm truncate">{p.nome}</p>
                     {p.video_url && <span className="text-xs bg-pink-100 text-pink-600 px-2 py-1 rounded-full mt-1 inline-block">Com Vídeo</span>}
                   </div>
                 ))}
               </div>
            </div>
          </div>

        </div>
      </div>

      {/* MODAL DE EDIÇÃO (Abre por cima da tela) */}
      {editInscrita && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl relative">
            <button onClick={() => setEditInscrita(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-800"><X size={24} /></button>
            <h3 className="text-2xl font-bold mb-6 text-gray-800">Editar Inscrição</h3>
            <form onSubmit={salvarEdicaoInscrita} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Nome</label>
                <input type="text" className="w-full mt-1 p-3 border rounded-lg bg-gray-50" value={editInscrita.nome} onChange={e => setEditInscrita({...editInscrita, nome: e.target.value})} />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Telefone</label>
                <input type="text" className="w-full mt-1 p-3 border rounded-lg bg-gray-50" value={editInscrita.telefone} onChange={e => setEditInscrita({...editInscrita, telefone: e.target.value})} />
              </div>
              <button type="submit" className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl mt-4">Salvar Alterações</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}