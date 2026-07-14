import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, Check, ArrowRight, Download, ShieldCheck, 
  CheckCircle2, Sparkles
} from 'lucide-react';
import { Lead } from './types';
import LeadForm from './components/LeadForm';
import SpreadsheetPreview from './components/SpreadsheetPreview';
import AdminPanel from './components/AdminPanel';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  useEffect(() => {
    try {
      const storedLeads = localStorage.getItem('captured_leads');
      if (storedLeads) {
        setLeads(JSON.parse(storedLeads));
      } else {
        const initialMockLeads: Lead[] = [
          {
            id: 'l1',
            name: 'Carlos Eduardo Oliveira',
            email: 'carlos.eduardo@marcaexemplo.com.br',
            phone: '(11) 98765-4321',
            companyName: 'Oliver Jeans Wear',
            productionVolume: '5.000 a 10.000 peças/mês',
            createdAt: new Date(Date.now() - 3600000 * 2.5).toISOString()
          },
          {
            id: 'l2',
            name: 'Mariana Costa Faria',
            email: 'mariana.faria@ateliersp.com',
            phone: '(21) 99123-4567',
            companyName: 'Atelier Casual Chic',
            productionVolume: '1.000 a 5.000 peças/mês',
            createdAt: new Date(Date.now() - 3600000 * 18).toISOString()
          },
          {
            id: 'l3',
            name: 'Gerson Souza Cruz',
            email: 'gerson@nordesteconfeccoes.com.br',
            phone: '(81) 97654-3210',
            companyName: 'Nordeste Camisaria',
            productionVolume: 'Mais de 10.000 peças/mês',
            createdAt: new Date(Date.now() - 3600000 * 45).toISOString()
          }
        ];
        localStorage.setItem('captured_leads', JSON.stringify(initialMockLeads));
        setLeads(initialMockLeads);
      }

      const storedSession = localStorage.getItem('current_visitor_lead');
      if (storedSession) {
        setCurrentLead(JSON.parse(storedSession));
      }
    } catch (e) {
      console.error('Erro ao acessar localStorage:', e);
    }
  }, []);

  const downloadSpreadsheetFile = () => {
    const link = document.createElement('a');
    link.href = 'https://docs.google.com/spreadsheets/d/14_UZXgA7KcT2Ko10lVQ2OTkNyDVfJ4mS/export?format=xlsx';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCaptureLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    setIsFormSubmitting(true);

    let dataHora = '';
    try {
      dataHora = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
    } catch (e) {
      dataHora = new Date().toLocaleString('pt-BR');
    }

    const payload = {
      nome: leadData.name,
      whatsapp: leadData.phone,
      email: leadData.email,
      confeccao: leadData.companyName,
      volume: leadData.productionVolume,
      data_hora: dataHora,
      dataHora: dataHora
    };

    fetch('https://hook.us2.make.com/8mhuejt6q9tmvxxezq6ev1jdnbvp5qdc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(() => {
      console.log('Dados enviados ao webhook com sucesso');
    })
    .catch(error => {
      console.error('Erro ao enviar dados ao webhook:', error);
    })
    .finally(() => {
      const newLead: Lead = {
        ...leadData,
        id: 'lead-' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      };

      const updatedLeads = [newLead, ...leads];
      setLeads(updatedLeads);
      localStorage.setItem('captured_leads', JSON.stringify(updatedLeads));
      
      setCurrentLead(newLead);
      localStorage.setItem('current_visitor_lead', JSON.stringify(newLead));
      
      setIsFormSubmitting(false);
      setShowNotification(true);
      
      downloadSpreadsheetFile();

      setTimeout(() => {
        setShowNotification(false);
      }, 5000);
    });
  };

  const handleDeleteLead = (id: string) => {
    const filtered = leads.filter(l => l.id !== id);
    setLeads(filtered);
    localStorage.setItem('captured_leads', JSON.stringify(filtered));
  };

  const handleClearLeads = () => {
    setLeads([]);
    localStorage.setItem('captured_leads', JSON.stringify([]));
  };

  const handleResetSession = () => {
    setCurrentLead(null);
    localStorage.removeItem('current_visitor_lead');
  };

  const scrollToForm = () => {
    const formElement = document.getElementById('lead-form-container');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfe] text-slate-950 font-sans selection:bg-indigo-600 selection:text-white antialiased">
      
      {/* 1. BARRA DE URGÊNCIA (Topo) */}
      <div className="bg-slate-950 text-white py-3 px-4 text-center text-xs md:text-sm font-semibold tracking-wide border-b border-slate-900 select-none">
        <span className="inline-flex items-center gap-1.5">
          🔥 Mais de 1.200 confecções já baixaram — acesso gratuito por tempo limitado
        </span>
      </div>

      {/* 2. HEADER SIMPLES */}
      <header className="bg-white border-b border-slate-100 py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm">
              <Scissors className="w-4 h-4 rotate-90" />
            </div>
            <div>
              <span className="text-base font-extrabold tracking-tight text-slate-900">
                Faccio<span className="text-indigo-600">Ctrl</span>
              </span>
              <span className="block text-[8px] uppercase font-bold tracking-widest text-slate-400">
                Gestão de Costura Terceirizada
              </span>
            </div>
          </div>

          <button 
            onClick={() => setIsAdminOpen(!isAdminOpen)}
            className="text-[10px] font-bold text-slate-300 hover:text-indigo-600 transition-colors"
            title="Acesso Admin"
          >
            Acesso Restrito
          </button>
        </div>
      </header>

      {/* SUCCESS POPUP NOTIFICATION */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm bg-slate-950 text-white p-4.5 rounded-xl shadow-2xl border border-slate-800 flex gap-3"
          >
            <div className="w-9 h-9 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
              <Check className="w-5 h-5" />
            </div>
            <div>
              <h5 className="font-bold text-xs">Planilha baixada com sucesso!</h5>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Verifique o seu navegador. O download do arquivo oficial foi iniciado de forma automática!
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pb-20">
        
        <AnimatePresence mode="wait">
          {isAdminOpen ? (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
              >
                <AdminPanel 
                  leads={leads}
                  onDeleteLead={handleDeleteLead}
                  onClearLeads={handleClearLeads}
                  onClose={() => setIsAdminOpen(false)}
                />
              </motion.div>
            </div>
          ) : (
            <div className="space-y-16">
              
              {/* 3. HERO SECTION */}
              <section className="relative overflow-hidden pt-12 md:pt-16 pb-20 bg-gradient-to-b from-indigo-950 via-slate-900 to-slate-950 text-white">
                <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-10 right-10 w-96 h-96 bg-emerald-500/5 rounded-full blur-[80px] pointer-events-none" />
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                    
                    <div className="lg:col-span-7 space-y-6">
                      <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                        Pare de controlar suas facções pelo WhatsApp.
                      </h1>
                      
                      <p className="text-sm sm:text-base md:text-lg text-slate-300 font-light leading-relaxed">
                        Baixe grátis a planilha que mostra onde está cada ordem, antecipa atrasos e mede o desempenho de cada facção — automaticamente.
                      </p>

                      <div className="space-y-3.5 pt-2">
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs sm:text-sm text-slate-300 font-medium">
                            <strong className="text-white">Status automático:</strong> Saiba em tempo real se o lote está no prazo, em risco ou atrasado.
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs sm:text-sm text-slate-300 font-medium">
                            <strong className="text-white">Desempenho de cada facção:</strong> Acompanhe o percentual de devolução e aproveitamento na hora.
                          </span>
                        </div>
                        <div className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5 border border-emerald-500/20">
                            <Check className="w-3.5 h-3.5" />
                          </div>
                          <span className="text-xs sm:text-sm text-slate-300 font-medium">
                            <strong className="text-white">Sem instalações difíceis:</strong> Funciona perfeitamente no Microsoft Excel e Google Planilhas.
                          </span>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-slate-800 flex items-center gap-2 text-xs text-slate-400">
                        <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                        <span>Selo de Segurança: Download 100% livre de vírus e protegido.</span>
                      </div>
                    </div>

                    <div className="lg:col-span-5">
                      <AnimatePresence mode="wait">
                        {currentLead ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-slate-900 border border-emerald-500/20 rounded-2xl p-6 md:p-8 text-center space-y-5 shadow-2xl"
                          >
                            <div className="w-14 h-14 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                              <Sparkles className="w-7 h-7" />
                            </div>
                            <div>
                              <h3 className="text-lg md:text-xl font-bold text-white">Olá, {currentLead.name}!</h3>
                              <p className="text-xs text-slate-400 mt-1">
                                O seu acesso para a confecção <strong>{currentLead.companyName}</strong> está totalmente liberado.
                              </p>
                            </div>
                            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 text-left">
                              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest block mb-1">Status do Arquivo</span>
                              <div className="flex items-center gap-2 text-xs text-emerald-400 font-bold">
                                <CheckCircle2 className="w-4 h-4 shrink-0" />
                                Download Pronto & Disponível
                              </div>
                            </div>
                            <div className="space-y-3">
                              <button 
                                onClick={downloadSpreadsheetFile}
                                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-xs font-extrabold text-white transition-all cursor-pointer shadow-md shadow-emerald-950/20"
                              >
                                <Download className="w-4.5 h-4.5" />
                                Baixar Planilha Oficial (.xlsx)
                              </button>
                              <button 
                                onClick={handleResetSession}
                                className="text-[11px] text-slate-400 hover:text-white transition-colors underline block mx-auto py-1"
                              >
                                Cadastrar com outro contato
                              </button>
                            </div>
                          </motion.div>
                        ) : (
                          <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                          >
                            <LeadForm 
                              onSuccess={handleCaptureLead} 
                              isLoading={isFormSubmitting}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                  </div>
                </div>
              </section>

              {/* 4. SEÇÃO DE PROVA */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="text-center max-w-2xl mx-auto mb-10">
                  <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase">A Realidade da Costura</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                    Gargalos que Impedem Sua Confecção de Crescer
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6.5">
                  <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all space-y-3.5">
                    <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center font-bold text-xs select-none">
                      🔴
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">"Atraso descoberto tarde demais"</h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-light">
                        Você só fica sabendo que houve um problema na montagem quando o seu cliente final já está cobrando o envio das peças vendidas.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all space-y-3.5">
                    <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-100 text-amber-500 flex items-center justify-center font-bold text-xs select-none">
                      🟡
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">"WhatsApp virou central de produção"</h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-light">
                        Dezenas de conversas, áudios perdidos, sem histórico de entrega, sem controle real e sem visão do saldo de peças costuradas.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-slate-100 rounded-2xl p-6 hover:shadow-md transition-all space-y-3.5">
                    <div className="w-9 h-9 rounded-full bg-rose-50 border border-rose-100 text-rose-500 flex items-center justify-center font-bold text-xs select-none">
                      🔴
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">"Não sabe qual facção atrasa mais"</h4>
                      <p className="text-xs text-slate-500 mt-1.5 leading-relaxed font-light">
                        Sem dados matemáticos de aproveitamento e devolução de costuras, você não consegue cobrar qualidade nem trocar de parceiros.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. PREVIEW DA PLANILHA */}
              <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-2xl mx-auto mb-8">
                  <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase">Visualização de Amostra</span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                    É exatamente isso que você vai receber
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 font-light">
                    Veja abaixo a estrutura profissional de abas integradas contidas no arquivo Excel que você irá baixar.
                  </p>
                </div>

                <SpreadsheetPreview />

                <div className="text-center mt-4">
                  <p className="text-slate-400 text-[10px] italic">
                    Amostra representativa da aba Ordens de Facção com cálculo de status automatizado.
                  </p>
                </div>
              </section>

              {/* 6. SEGUNDO CTA */}
              <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-slate-900 rounded-3xl p-8 md:p-10 text-center text-white relative overflow-hidden border border-slate-850 shadow-xl">
                  <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px]" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
                  
                  <div className="relative z-10 max-w-xl mx-auto space-y-5">
                    <h3 className="text-xl sm:text-2xl font-extrabold tracking-tight">
                      Pronto para sair do caos do WhatsApp?
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-300 font-light leading-relaxed">
                      Não perca mais tempo. Profissionalize sua costura de forma 100% gratuita agora.
                    </p>
                    <div className="pt-2">
                      <button
                        onClick={currentLead ? downloadSpreadsheetFile : scrollToForm}
                        className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs sm:text-sm transition-all cursor-pointer shadow-lg shadow-indigo-950/40"
                      >
                        {currentLead ? 'Baixar Planilha Grátis (.xlsx)' : 'Baixar Planilha Grátis'}
                      </button>
                    </div>
                  </div>
                </div>
              </section>

            </div>
          )}
        </AnimatePresence>
      </main>

      {/* 7. RODAPÉ MÍNIMO */}
      <footer className="bg-slate-950 text-slate-500 py-10 border-t border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-slate-400">
            FaccioCtrl © 2026 • Seus dados estão seguros. Não enviamos spam.
          </p>
        </div>
      </footer>

    </div>
  );
}
