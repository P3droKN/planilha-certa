import React, { useState } from 'react';
import { User, Mail, Phone, Factory, BarChart3, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Lead } from '../types';

interface LeadFormProps {
  onSuccess: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  isLoading?: boolean;
}

export default function LeadForm({ onSuccess, isLoading = false }: LeadFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [productionVolume, setProductionVolume] = useState('');
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFocused, setIsFocused] = useState<string | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) value = value.slice(0, 11);
    
    if (value.length > 6) {
      value = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    } else if (value.length > 2) {
      value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    } else if (value.length > 0) {
      value = `(${value}`;
    }
    
    setPhone(value);
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    
    if (name.trim().length < 3) {
      newErrors.name = 'Por favor, insira seu nome completo.';
    }
    
    const emailValue = email;
    const hasSpace = /\s/.test(emailValue);
    const hasAt = emailValue.includes('@') && emailValue.indexOf('@') > 0 && emailValue.indexOf('@') === emailValue.lastIndexOf('@');
    const hasDotAfterAt = hasAt && emailValue.substring(emailValue.indexOf('@') + 1).includes('.');
    const isValidEmailFormat = !hasSpace && hasAt && hasDotAfterAt && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);

    if (!isValidEmailFormat) {
      newErrors.email = 'Por favor insira um e-mail válido.';
    } else {
      try {
        const storedLeads = localStorage.getItem('captured_leads');
        const leadsArray = storedLeads ? JSON.parse(storedLeads) : [];
        const isEmailUsed = Array.isArray(leadsArray) && leadsArray.some((l: any) => l.email && l.email.trim().toLowerCase() === emailValue.trim().toLowerCase());
        
        if (isEmailUsed) {
          newErrors.email = 'Este e-mail já foi utilizado para baixar a planilha.';
        }
      } catch (err) {
        console.error('Erro ao verificar e-mail duplicado no localStorage:', err);
      }
    }
    
    const rawPhone = phone.replace(/\D/g, '');
    if (rawPhone.length < 10) {
      newErrors.phone = 'Insira um número de telefone com DDD válido.';
    }
    
    if (!companyName.trim()) {
      newErrors.companyName = 'Por favor, informe o nome da sua marca/confecção.';
    }
    
    if (!productionVolume) {
      newErrors.productionVolume = 'Selecione uma faixa de volume de produção.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSuccess({
        name,
        email,
        phone,
        companyName,
        productionVolume,
      });
    }
  };

  return (
    <div id="lead-form-container" className="w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500" />
      
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 mb-3 animate-pulse border border-emerald-100">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Acesso Gratuito e Vitalício
        </span>
        <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
          Liberar Minha Planilha Agora
        </h3>
        <p className="text-sm text-slate-500 mt-1">
          Preencha os campos abaixo para desbloquear o download imediatamente.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Seu Nome Completo
          </label>
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${isFocused === 'name' ? 'text-indigo-600' : 'text-slate-400'}`}>
              <User className="w-4 h-4" />
            </div>
            <input
              id="name"
              type="text"
              required
              placeholder="Ex: Pedro Silva"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
              }}
              onFocus={() => setIsFocused('name')}
              onBlur={() => setIsFocused(null)}
              className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white transition-all outline-none duration-200 ${
                errors.name ? 'border-red-400 focus:border-red-500 ring-2 ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.name && <p className="text-xs text-red-500 font-medium mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            WhatsApp com DDD
          </label>
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${isFocused === 'phone' ? 'text-indigo-600' : 'text-slate-400'}`}>
              <Phone className="w-4 h-4" />
            </div>
            <input
              id="phone"
              type="tel"
              required
              placeholder="Ex: (11) 99999-9999"
              value={phone}
              onChange={handlePhoneChange}
              onFocus={() => setIsFocused('phone')}
              onBlur={() => setIsFocused(null)}
              className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white transition-all outline-none duration-200 ${
                errors.phone ? 'border-red-400 focus:border-red-500 ring-2 ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.phone && <p className="text-xs text-red-500 font-medium mt-1">{errors.phone}</p>}
        </div>

        <div>
          <label htmlFor="email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            E-mail Profissional
          </label>
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${isFocused === 'email' ? 'text-indigo-600' : 'text-slate-400'}`}>
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              required
              placeholder="Ex: pedro@suamarca.com.br"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
              }}
              onFocus={() => setIsFocused('email')}
              onBlur={() => setIsFocused(null)}
              className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white transition-all outline-none duration-200 ${
                errors.email ? 'border-red-400 focus:border-red-500 ring-2 ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.email && <p className="text-xs text-red-500 font-medium mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="companyName" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Sua Marca ou Confecção
          </label>
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${isFocused === 'companyName' ? 'text-indigo-600' : 'text-slate-400'}`}>
              <Factory className="w-4 h-4" />
            </div>
            <input
              id="companyName"
              type="text"
              required
              placeholder="Ex: Confecções Estrela ou Marca XYZ"
              value={companyName}
              onChange={(e) => {
                setCompanyName(e.target.value);
                if (errors.companyName) setErrors(prev => ({ ...prev, companyName: '' }));
              }}
              onFocus={() => setIsFocused('companyName')}
              onBlur={() => setIsFocused(null)}
              className={`w-full pl-10 pr-4 py-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white transition-all outline-none duration-200 ${
                errors.companyName ? 'border-red-400 focus:border-red-500 ring-2 ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
              }`}
            />
          </div>
          {errors.companyName && <p className="text-xs text-red-500 font-medium mt-1">{errors.companyName}</p>}
        </div>

        <div>
          <label htmlFor="productionVolume" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            Volume de Produção Mensal
          </label>
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${isFocused === 'productionVolume' ? 'text-indigo-600' : 'text-slate-400'}`}>
              <BarChart3 className="w-4 h-4" />
            </div>
            <select
              id="productionVolume"
              required
              value={productionVolume}
              onChange={(e) => {
                setProductionVolume(e.target.value);
                if (errors.productionVolume) setErrors(prev => ({ ...prev, productionVolume: '' }));
              }}
              onFocus={() => setIsFocused('productionVolume')}
              onBlur={() => setIsFocused(null)}
              className={`w-full pl-10 pr-10 py-3 bg-slate-50/50 hover:bg-slate-50 rounded-xl border text-sm text-slate-900 focus:bg-white transition-all outline-none duration-200 appearance-none ${
                errors.productionVolume ? 'border-red-400 focus:border-red-500 ring-2 ring-red-100' : 'border-slate-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100'
              }`}
            >
              <option value="" disabled>Selecione uma opção...</option>
              <option value="Até 1.000 peças/mês">Até 1.000 peças/mês</option>
              <option value="1.000 a 5.000 peças/mês">1.000 a 5.000 peças/mês</option>
              <option value="5.000 a 10.000 peças/mês">5.000 a 10.000 peças/mês</option>
              <option value="Mais de 10.000 peças/mês">Mais de 10.000 peças/mês</option>
            </select>
            <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          {errors.productionVolume && <p className="text-xs text-red-500 font-medium mt-1">{errors.productionVolume}</p>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full flex items-center justify-center gap-2 mt-6 px-6 py-4 rounded-xl text-white font-bold bg-gradient-to-r from-indigo-600 via-indigo-500 to-emerald-500 hover:opacity-95 shadow-md shadow-indigo-100 active:scale-[0.98] transition-all cursor-pointer disabled:opacity-75 disabled:cursor-wait"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processando e Liberando...
            </>
          ) : (
            <>
              Quero Baixar a Planilha Grátis
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-4 text-center">
          <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>Não enviamos spam. Seus dados estão 100% seguros.</span>
        </div>
      </form>
    </div>
  );
}
