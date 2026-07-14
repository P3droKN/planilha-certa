import React, { useState, useMemo } from 'react';
import { 
  Users, Download, Trash2, Search, X, Check,
  Layers, PhoneCall, Mail
} from 'lucide-react';
import { Lead } from '../types';

interface AdminPanelProps {
  leads: Lead[];
  onDeleteLead: (id: string) => void;
  onClearLeads: () => void;
  onClose: () => void;
}

export default function AdminPanel({ leads, onDeleteLead, onClearLeads, onClose }: AdminPanelProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmClear, setConfirmClear] = useState(false);

  const filteredLeads = useMemo(() => {
    return leads.filter(lead => 
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm)
    );
  }, [leads, searchTerm]);

  const handleExportCSV = () => {
    if (leads.length === 0) return;

    const headers = ['ID', 'Nome', 'E-mail', 'WhatsApp', 'Nome Confecção/Marca', 'Volume Mensal', 'Data de Cadastro'];
    const rows = leads.map(l => [
      l.id,
      l.name,
      l.email,
      l.phone,
      l.companyName,
      l.productionVolume,
      new Date(l.createdAt).toLocaleString('pt-BR')
    ]);

    const csvContent = [headers, ...rows]
      .map(row => row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(';'))
      .join('\n');

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `leads_planilha_faccoes_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const stats = useMemo(() => {
    const total = leads.length;
    
    let microCount = 0;
    let mediumCount = 0;
    let largeCount = 0;

    leads.forEach(l => {
      if (l.productionVolume === 'Até 1.000 peças/mês') {
        microCount++;
      } else if (l.productionVolume === 'Mais de 10.000 peças/mês') {
        largeCount++;
      } else {
        mediumCount++;
      }
    });

    return { total, microCount, mediumCount, largeCount };
  }, [leads]);

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-100 shadow-xl overflow-hidden animate-fadeIn">
      <div className="bg-slate-900 px-6 py-5 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-extrabold text-base md:text-lg">Gerenciador de Leads</h3>
            <p className="text-xs text-slate-400">Painel do Administrador • Controle de Capturas</p>
          </div>
        </div>

        <button 
          onClick={onClose}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="bg-slate-50 border-b border-slate-100 px-6 py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-500">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
          Banco de Dados: <strong className="text-slate-700">Local Storage (Ativo)</strong>
        </span>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4">
            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest block mb-1">Total de Capturas</span>
            <span className="text-3xl font-extrabold text-indigo-900 font-mono">{stats.total}</span>
            <span className="text-[10px] text-indigo-500 block mt-1">leads qualificados salvos</span>
          </div>

          <div className="bg-emerald-50/50 border border-emerald-100 rounded-xl p-4">
            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block mb-1">Até 1.000 pçs/mês</span>
            <span className="text-3xl font-extrabold text-emerald-900 font-mono">{stats.microCount}</span>
            <span className="text-[10px] text-emerald-500 block mt-1">marcas iniciantes</span>
          </div>

          <div className="bg-amber-50/50 border border-amber-100 rounded-xl p-4">
            <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest block mb-1">1.000 a 10.000 pçs/mês</span>
            <span className="text-3xl font-extrabold text-amber-900 font-mono">{stats.mediumCount}</span>
            <span className="text-[10px] text-amber-500 block mt-1">confecções consolidadas</span>
          </div>

          <div className="bg-rose-50/50 border border-rose-100 rounded-xl p-4">
            <span className="text-[10px] font-bold text-rose-600 uppercase tracking-widest block mb-1">Acima de 10k pçs/mês</span>
            <span className="text-3xl font-extrabold text-rose-900 font-mono">{stats.largeCount}</span>
            <span className="text-[10px] text-rose-500 block mt-1">grandes marcas industriais</span>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input 
              type="text"
              placeholder="Buscar por nome, e-mail, marca ou telefone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white outline-none focus:border-indigo-500 transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCSV}
              disabled={leads.length === 0}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md shadow-indigo-100 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Download className="w-4 h-4" />
              Exportar para Excel (CSV)
            </button>

            {confirmClear ? (
              <div className="flex items-center gap-1 bg-red-50 border border-red-200 p-1 rounded-lg">
                <button
                  onClick={() => {
                    onClearLeads();
                    setConfirmClear(false);
                  }}
                  className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white rounded text-[10px] font-bold cursor-pointer"
                >
                  Confirmar Exclusão
                </button>
                <button
                  onClick={() => setConfirmClear(false)}
                  className="px-2 py-1 text-slate-500 hover:bg-slate-100 rounded text-[10px] font-bold cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirmClear(true)}
                disabled={leads.length === 0}
                className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 border border-slate-200 rounded-lg text-xs font-bold transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" />
                Limpar Banco
              </button>
            )}
          </div>
        </div>

        <div className="w-full border border-slate-150 rounded-xl overflow-hidden bg-white overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[800px] border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-150 text-slate-500 font-bold select-none">
                <th className="py-3 px-4">Nome</th>
                <th className="py-3 px-4">Marca / Confecção</th>
                <th className="py-3 px-4">WhatsApp</th>
                <th className="py-3 px-4">E-mail</th>
                <th className="py-3 px-4 text-center">Produção Mensal</th>
                <th className="py-3 px-4 text-right">Data de Cadastro</th>
                <th className="py-3 px-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.length > 0 ? (
                filteredLeads.map(lead => (
                  <tr key={lead.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-slate-900">{lead.name}</td>
                    
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-50 text-indigo-700 font-semibold text-[10px]">
                        <Layers className="w-3 h-3 text-indigo-500" />
                        {lead.companyName}
                      </span>
                    </td>
                    
                    <td className="py-3.5 px-4">
                      <a 
                        href={`https://wa.me/${lead.phone.replace(/\D/g, '')}`} 
                        target="_blank" 
                        referrerPolicy="no-referrer"
                        className="inline-flex items-center gap-1 text-slate-700 hover:text-emerald-600 hover:underline font-mono"
                      >
                        <PhoneCall className="w-3 h-3 text-emerald-500" />
                        {lead.phone}
                      </a>
                    </td>
                    
                    <td className="py-3.5 px-4">
                      <a 
                        href={`mailto:${lead.email}`}
                        className="inline-flex items-center gap-1 text-slate-600 hover:text-indigo-600 hover:underline font-mono"
                      >
                        <Mail className="w-3 h-3 text-indigo-500" />
                        {lead.email}
                      </a>
                    </td>
                    
                    <td className="py-3.5 px-4 text-center font-medium text-slate-700">
                      <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-800 text-[10px] font-semibold">
                        {lead.productionVolume}
                      </span>
                    </td>
                    
                    <td className="py-3.5 px-4 text-right text-slate-400 font-mono text-[11px]">
                      {new Date(lead.createdAt).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => onDeleteLead(lead.id)}
                        className="text-slate-400 hover:text-red-500 p-1 rounded hover:bg-red-50 transition-colors cursor-pointer"
                        title="Excluir Lead"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 font-medium">
                    {searchTerm ? 'Nenhum lead encontrado com estes filtros.' : 'Nenhum lead capturado ainda.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
