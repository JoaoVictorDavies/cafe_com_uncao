'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, UploadCloud, Trash2, MessageCircle } from 'lucide-react';

export default function AdminPage() {
  const [totalInscritas, setTotalInscritas] = useState(0);
  const [inscritas, setInscritas] = useState<any[]>([]);
  const [nomePreletor, setNomePreletor] = useState('');
  const [tema, setTema] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const { data: inscritasData } = await supabase.from('inscritas').select('*').order('criado_em', { ascending: false });
    if (inscritasData) {
      setInscritas(inscritasData);
      setTotalInscritas(inscritasData.length);
    }
  };

  const handleExcluirInscrita = async (id: string) => {
    if (!confirm('Tem certeza que deseja remover esta inscrição?')) return;
    
    await supabase.from('inscritas').delete().eq('id', id);
    carregarDados(); // Recarrega a lista após apagar
  };

  const handleAddPreletor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foto) return alert('Selecione uma foto');
    setLoading(true);

    try {
      const fileExt = foto.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('fotos-preletores')
        .upload(fileName, foto);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('fotos-preletores')
        .getPublicUrl(fileName);

      // Converte link comum do YouTube para link de Embed
      let urlEmbed = videoUrl;
      if (videoUrl.includes('youtube.com/watch?v=')) {
        urlEmbed = videoUrl.replace('watch?v=', 'embed/');
      } else if (videoUrl.includes('youtu.be/')) {
        urlEmbed = videoUrl.replace('youtu.be/', 'youtube.com/embed/');
      }

      const { error: dbError } = await supabase.from('preletores').insert([
        { nome: nomePreletor, tema, imagem_url: publicUrl, video_url: urlEmbed }
      ]);

      if (dbError) throw dbError;

      alert('Preletora adicionada com sucesso!');
      setNomePreletor('');
      setTema('');
      setVideoUrl('');
      setFoto(null);
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar. Verifique se o bucket "fotos-preletores" existe no Supabase.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestão: Café com Unção</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card de Inscritas (Agora com CRUD) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-pink-100 p-3 rounded-lg text-pink-600">
                <Users size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Total Confirmadas</h2>
                <p className="text-gray-500">Gerencie quem vai participar</p>
              </div>
            </div>
            <div className="text-5xl font-bold text-gray-800 mb-6">{totalInscritas} <span className="text-lg font-normal text-gray-400">mulheres</span></div>
            
            <div className="h-96 overflow-y-auto border-t pt-4 flex flex-col gap-3">
              {inscritas.map((inscrita) => (
                <div key={inscrita.id} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between border">
                  <div>
                    <p className="font-bold text-gray-700">{inscrita.nome}</p>
                    <p className="text-xs text-gray-500">{inscrita.telefone}</p>
                  </div>
                  <div className="flex gap-2">
                    <a 
                      href={`https://wa.me/${inscrita.telefone.replace(/\D/g, '')}`} 
                      target="_blank"
                      rel="noreferrer"
                      className="p-2 bg-green-100 text-green-600 rounded-md hover:bg-green-200 transition"
                      title="Chamar no WhatsApp"
                    >
                      <MessageCircle size={18} />
                    </a>
                    <button 
                      onClick={() => handleExcluirInscrita(inscrita.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition"
                      title="Remover Inscrição"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
              {inscritas.length === 0 && <p className="text-gray-400 text-sm">Nenhuma inscrição ainda.</p>}
            </div>
          </div>

          {/* Form de Preletores (Agora com Vídeo) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UploadCloud className="text-pink-500" /> Adicionar Preletora / Atração
            </h2>
            <form onSubmit={handleAddPreletor} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Nome</label>
                <input type="text" required className="w-full mt-1 p-2 border rounded-lg" value={nomePreletor} onChange={(e) => setNomePreletor(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Tema da Palavra</label>
                <input type="text" required className="w-full mt-1 p-2 border rounded-lg" value={tema} onChange={(e) => setTema(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Link do Vídeo do YouTube (Opcional)</label>
                <input type="url" placeholder="https://youtube.com/..." className="w-full mt-1 p-2 border rounded-lg" value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} />
                <p className="text-xs text-gray-400 mt-1">Coloque o link do YouTube para aparecer no site.</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Foto</label>
                <input type="file" accept="image/*" required className="w-full mt-1 p-2 border rounded-lg bg-gray-50" onChange={(e) => setFoto(e.target.files?.[0] || null)} />
              </div>
              <button disabled={loading} type="submit" className="mt-4 bg-gray-800 text-white font-bold py-3 rounded-lg hover:bg-gray-900 transition-colors">
                {loading ? 'Salvando...' : 'Salvar no Site'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}