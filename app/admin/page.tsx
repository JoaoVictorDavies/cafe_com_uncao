// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Users, UploadCloud } from 'lucide-react';

export default function AdminPage() {
  const [totalInscritas, setTotalInscritas] = useState(0);
  const [inscritas, setInscritas] = useState<any[]>([]);
  const [nomePreletor, setNomePreletor] = useState('');
  const [tema, setTema] = useState('');
  const [foto, setFoto] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const { data: inscritasData } = await supabase.from('inscritas').select('*');
    if (inscritasData) {
      setInscritas(inscritasData);
      setTotalInscritas(inscritasData.length);
    }
  };

  const handleAddPreletor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foto) return alert('Selecione uma foto');
    setLoading(true);

    try {
      // 1. Fazer upload da foto pro Storage
      const fileExt = foto.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fotos-preletores')
        .upload(fileName, foto);

      if (uploadError) throw uploadError;

      // 2. Pegar a URL pública da foto
      const { data: { publicUrl } } = supabase.storage
        .from('fotos-preletores')
        .getPublicUrl(fileName);

      // 3. Salvar no banco
      const { error: dbError } = await supabase.from('preletores').insert([
        { nome: nomePreletor, tema, imagem_url: publicUrl }
      ]);

      if (dbError) throw dbError;

      alert('Preletor(a) adicionado com sucesso!');
      setNomePreletor('');
      setTema('');
      setFoto(null);
    } catch (error) {
      console.error(error);
      alert('Erro ao salvar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Gestão: Café com Unção</h1>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Card de Estatísticas */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-pink-100 p-3 rounded-lg text-pink-600">
                <Users size={24} />
              </div>
              <div>
                <h2 className="text-xl font-bold">Total Confirmadas</h2>
                <p className="text-gray-500">Visualização das inscrições</p>
              </div>
            </div>
            <div className="text-6xl font-bold text-gray-800 mb-6">{totalInscritas}</div>
            <div className="h-48 overflow-y-auto border-t pt-4">
              {inscritas.map((inscrita, i) => (
                <div key={i} className="py-2 flex justify-between border-b text-sm">
                  <span className="font-medium text-gray-700">{inscrita.nome}</span>
                  <span className="text-gray-500">{inscrita.telefone}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form de Preletores */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <UploadCloud className="text-pink-500" /> Adicionar Preletora
            </h2>
            <form onSubmit={handleAddPreletor} className="flex flex-col gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Nome</label>
                <input type="text" required className="w-full mt-1 p-2 border rounded-lg" value={nomePreletor} onChange={(e) => setNomePreletor(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Tema da Palavra / Função</label>
                <input type="text" required className="w-full mt-1 p-2 border rounded-lg" value={tema} onChange={(e) => setTema(e.target.value)} />
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