import React, { useState } from 'react';
import { Info } from 'lucide-react';

export default function SpreadsheetPreview() {
  const [activeTab, setActiveTab] = useState<'ordens' | 'desempenho'>('ordens');

  const ordens = [
    { num: 'ORD-001', prod: 'Vestido Canelado Malha', fac: 'FAC001', envio: '05/07', prazo: '10/07', env: 400, ret: 400, pend: 0, status: 'CONCLUÍDA' },
    { num: 'ORD-002', prod: 'Calça Cargo Jeans', fac: 'FAC002', envio: '06/07', prazo: '11/07', env: 350, ret: 150, pend: 200, status: 'EM RISCO' },
    { num: 'ORD-003', prod: 'Jaqueta Nylon Puffer', fac: 'FAC003', envio: '28/06', prazo: '08/07', env: 180, ret: 50, pend: 130, status: 'ATRASADA' },
    { num: 'ORD-004', prod: 'T-shirt Algodão Penteado', fac: 'FAC001', envio: '09/07', prazo: '18/07', env: 1000, ret: 0, pend: 1000, status: 'NO PRAZO' },
    { num: 'ORD-005', prod: 'Camisa Viscose Estampada', fac: 'FAC004', envio: '07/07', prazo: '14/07', env: 300, ret: 300, pend: 0, status: 'CONCLUÍDA' }
  ];

  const desempenhos = [
    { cod: 'FAC001', nome: 'Ateliê Costura de Ouro', env: 1400, ret: 400, pend: 1000, dev: '29%', status: 'Excelente' },
    { cod: 'FAC002', nome: 'Jeans do Vale Confecções', env: 350, ret: 150, pend: 200, dev: '43%', status: 'Alerta de Prazo' },
    { cod: 'FAC003', nome: 'Facção Puffer Sul', env: 180, ret: 50, pend: 130, dev: '28%', status: 'Atrasos Críticos' },
    { cod: 'FAC004', nome: 'Alfaiataria Elegância', env: 300, ret: 300, pend: 0, dev: '100%', status: 'Excelente' }
  ];

  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xl overflow-hidden">
      <div className="bg-slate-100 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-emerald-600 flex items-center justify-center text-white text-xs font-bold font-mono">
            X
          </div>
          <span className="text-xs font-bold text-slate-700 tracking-tight font-sans">
            Controle_de_Ordens_de_Faccao_Oficial.xlsx (Somente Leitura)
          </span>
        </div>
        <div className="flex gap-1">
          <span className="w-3 h-3 rounded-full bg-slate-300" />
          <span className="w-3 h-3 rounded-full bg-slate-300" />
          <span className="w-3 h-3 rounded-full bg-slate-300" />
        </div>
      </div>

      <div className="bg-slate-50 border-b border-slate-200 px-4 flex gap-1">
        <button
          onClick={() => setActiveTab('ordens')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'ordens'
              ? 'border-emerald-600 text-emerald-700 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          📋 Ordens de Facção
        </button>
        <button
          onClick={() => setActiveTab('desempenho')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all cursor-pointer ${
            activeTab === 'desempenho'
              ? 'border-emerald-600 text-emerald-700 bg-white'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          📊 Desempenho Geral
        </button>
      </div>

      <div className="bg-amber-50/80 border-b border-slate-200/60 px-4 py-2.5 text-xs text-amber-800 flex items-center gap-1.5 font-sans font-medium">
        <Info className="w-4 h-4 text-amber-600 shrink-0" />
        <span>Preencha apenas colunas com fundo <strong className="bg-amber-200/80 px-1 py-0.5 rounded">AMARELO</strong>. As colunas <strong className="bg-blue-100 px-1 py-0.5 rounded">AZUIS</strong> calculam totalmente sozinhas.</span>
      </div>

      <div className="overflow-x-auto">
        {activeTab === 'ordens' ? (
          <table className="w-full text-left text-xs min-w-[800px] border-collapse font-mono">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-2.5 px-3 bg-amber-500/5 text-amber-800 text-center w-20">Nº Ordem</th>
                <th className="py-2.5 px-3 bg-amber-500/5 text-amber-800">Produto</th>
                <th className="py-2.5 px-3 bg-amber-500/5 text-amber-800 text-center w-24">Cód. Facção</th>
                <th className="py-2.5 px-3 bg-amber-500/5 text-amber-800 text-center w-20">Data Envio</th>
                <th className="py-2.5 px-3 bg-amber-500/5 text-amber-800 text-center w-20">Prazo</th>
                <th className="py-2.5 px-3 bg-amber-500/5 text-amber-800 text-center w-20 font-sans">Qtd Enviada</th>
                <th className="py-2.5 px-3 bg-amber-500/5 text-amber-800 text-center w-20 font-sans">Qtd Retor.</th>
                <th className="py-2.5 px-3 bg-blue-50/80 text-blue-800 text-center w-20 font-sans">Qtd Pend.</th>
                <th className="py-2.5 px-3 bg-blue-50/80 text-blue-800 text-center w-20 font-sans">Dias p/ Praz.</th>
                <th className="py-2.5 px-3 bg-blue-50/80 text-blue-800 text-center w-20 font-sans">% Devol.</th>
                <th className="py-2.5 px-3 bg-blue-50/80 text-blue-800 text-center w-28 font-sans">STATUS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {ordens.map((o, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-3 text-center bg-amber-50/30 text-slate-800 font-bold border-r border-slate-100">{o.num}</td>
                  <td className="py-3 px-3 font-sans font-medium text-slate-900 bg-amber-50/30 border-r border-slate-100">{o.prod}</td>
                  <td className="py-3 px-3 text-center font-bold text-slate-600 bg-amber-50/30 border-r border-slate-100">{o.fac}</td>
                  <td className="py-3 px-3 text-center text-slate-500 bg-amber-50/30 border-r border-slate-100">{o.envio}</td>
                  <td className="py-3 px-3 text-center text-slate-500 bg-amber-50/30 border-r border-slate-100">{o.prazo}</td>
                  <td className="py-3 px-3 text-center text-slate-800 font-bold bg-amber-50/30 border-r border-slate-100">{o.env}</td>
                  <td className="py-3 px-3 text-center text-slate-800 font-bold bg-amber-50/50 border-r border-slate-100">{o.ret}</td>
                  <td className="py-3 px-3 text-center bg-blue-50/20 text-slate-700 font-bold border-r border-slate-100">{o.pend}</td>
                  <td className="py-3 px-3 text-center bg-blue-50/20 text-slate-600 font-bold border-r border-slate-100">
                    {o.status === 'CONCLUÍDA' ? '-' : o.status === 'ATRASADA' ? '-2' : '1'} dia(s)
                  </td>
                  <td className="py-3 px-3 text-center bg-blue-50/20 text-slate-700 font-bold border-r border-slate-100">
                    {Math.round((o.ret / o.env) * 100)}%
                  </td>
                  <td className="py-3 px-3 text-center bg-blue-50/30">
                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-extrabold uppercase shadow-sm select-none tracking-wider ${
                      o.status === 'CONCLUÍDA'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : o.status === 'ATRASADA'
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : o.status === 'EM RISCO'
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        o.status === 'CONCLUÍDA' ? 'bg-blue-500' :
                        o.status === 'ATRASADA' ? 'bg-red-500' :
                        o.status === 'EM RISCO' ? 'bg-amber-500' : 'bg-green-500'
                      }`} />
                      {o.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="w-full text-left text-xs min-w-[800px] border-collapse font-mono">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-600 font-bold">
                <th className="py-2.5 px-4 w-28 text-center">Código</th>
                <th className="py-2.5 px-4">Nome Oficina</th>
                <th className="py-2.5 px-4 text-center font-sans">Ordens Enviadas</th>
                <th className="py-2.5 px-4 text-center font-sans">Peças Recebidas</th>
                <th className="py-2.5 px-4 text-center font-sans">Saldo Pendente</th>
                <th className="py-2.5 px-4 text-center font-sans">% Aproveitamento</th>
                <th className="py-2.5 px-4 text-center font-sans">Status Geral</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-150">
              {desempenhos.map((d, idx) => (
                <tr key={idx} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-center font-bold text-indigo-600">{d.cod}</td>
                  <td className="py-3 px-4 font-sans font-bold text-slate-800">{d.nome}</td>
                  <td className="py-3 px-4 text-center text-slate-700">{d.env} pçs</td>
                  <td className="py-3 px-4 text-center text-emerald-600 font-bold">{d.ret} pçs</td>
                  <td className="py-3 px-4 text-center text-amber-600 font-bold">{d.pend} pçs</td>
                  <td className="py-3 px-4 text-center font-bold text-slate-700">{d.dev}</td>
                  <td className="py-3 px-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[10px] font-bold ${
                      d.status.includes('Atrasos') || d.status.includes('Críticos')
                        ? 'bg-red-100 text-red-800 border border-red-200'
                        : d.status.includes('Alerta')
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-green-100 text-green-800 border border-green-200'
                    }`}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="bg-slate-50 border-t border-slate-200 p-4">
        <h5 className="text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2.5">
          Legenda de Cores (Definida na Planilha)
        </h5>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-green-50 border border-green-100 rounded-lg p-2.5 text-[11px]">
            <span className="font-bold text-green-800 block mb-0.5">🟢 NO PRAZO</span>
            <span className="text-slate-500 font-sans">Dentro do prazo planejado. Tudo certo!</span>
          </div>
          <div className="bg-amber-50 border border-amber-100 rounded-lg p-2.5 text-[11px]">
            <span className="font-bold text-amber-800 block mb-0.5">🟡 EM RISCO</span>
            <span className="text-slate-500 font-sans">Faltam 3 dias ou menos para entregar.</span>
          </div>
          <div className="bg-red-50 border border-red-100 rounded-lg p-2.5 text-[11px]">
            <span className="font-bold text-red-800 block mb-0.5">🔴 ATRASADA</span>
            <span className="text-slate-500 font-sans">Prazo vencido e não entregue totalmente.</span>
          </div>
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-2.5 text-[11px]">
            <span className="font-bold text-blue-800 block mb-0.5">🔵 CONCLUÍDA</span>
            <span className="text-slate-500 font-sans">Quantidade enviada foi 100% devolvida.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
