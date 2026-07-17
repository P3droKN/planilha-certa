import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Scissors, Check, Download, ShieldCheck, 
  CheckCircle2, Sparkles
} from 'lucide-react';
import { Lead } from './types';
import LeadForm from './components/LeadForm';
import SpreadsheetPreview from './components/SpreadsheetPreview';

export default function App() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [currentLead, setCurrentLead] = useState<Lead | null>(null);
  const [isFormSubmitting, setIsFormSubmitting] = useState(false);
  const [showNotification, setShowNotification] = useState(false);

  // Carrega leads e sessão do localStorage
  useEffect(() => {
    try {
      const storedLeads = localStorage.getItem('captured_leads');
      if (storedLeads) {
        setLeads(JSON.parse(storedLeads));
      }

      const storedSession = localStorage.getItem('current_visitor_lead');
      if (storedSession) {
        setCurrentLead(JSON.parse(storedSession));
      }
    } catch (e) {
      console.error('Erro ao acessar localStorage:', e);
    }
  }, []);

  // Link oficial de Download da planilha em formato XLSX
  const downloadSpreadsheetFile = () => {
    const link = document.createElement('a');
    link.href = 'https://docs.google.com/spreadsheets/d/14_UZXgA7KcT2Ko10lVQ2OTkNyDVfJ4mS/export?format=xlsx';
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Envia dados do Lead ao Webhook e salva localmente
  const handleCaptureLead = (leadData: Omit<Lead, 'id' | 'createdAt'>) => {
    setIsFormSubmitting(true);

    // Formatação em tempo real da data e hora em português
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
      confeccao: leadData.companyName || 'Não Informado',
      volume: leadData.productionVolume || 'Não Informado',
      data_hora: dataHora,
      dataHora: dataHora
    };

    // Envio via POST em JSON para o Webhook do Make
    fetch('https://hook.us2.make.com/8mhuejt6q9tmvxxezq6ev1jdnbvp5qdc', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      console.log('Dados enviados ao webhook do Make com sucesso');
    })
    .catch(error => {
      console.error('Erro ao enviar dados ao webhook:', error);
    })
    .finally(() => {
      const newLead: Lead = {
        ...leadData,
        companyName: leadData.companyName || 'Não Informado',
        productionVolume: leadData.productionVolume || 'Não Informado',
        id: 'lead-' + Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toISOString()
      };

      const updatedLeads = [newLead, ...leads]
