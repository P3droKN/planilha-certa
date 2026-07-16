import React, { useState } from 'react';
import { User, Mail, Phone, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { Lead } from '../types';

interface LeadFormProps {
  onSuccess: (lead: Omit<Lead, 'id' | 'createdAt'>) => void;
  isLoading: boolean;
}

export default function LeadForm({ onSuccess, isLoading }: LeadFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isFocused, setIsFocused] = useState<string | null>(null);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    
    if (value.length > 11) {
      value = value.substring(0, 11);
    }

    if (value.length > 10) {
      value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
    } else if (value.length > 6) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
    } else if (value.length > 2) {
      value = value.replace(/^(\d{2})(\d{0,4})$/, '($1) $2');
    } else if (value.length > 0) {
      value = value.replace(/^(\d*)$/, '($1');
    }

    setPhone(value);
    if (errors.phone) setErrors(prev => ({ ...prev, phone: '' }));
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm() && !isLoading) {
      onSuccess({
        name,
        email,
        phone,
      });
    }
  };

  return (
    <div className="bg-white text-slate-950 rounded-2xl p-6 md:p-8 shadow-2xl border border-slate-100 relative">
      
      <div className="mb-6">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold tracking-wide uppercase">
          🎁 Acesso 100% Gratuito
        </span>
        <h3 className="text-lg md:text-xl font-extrabold tracking-tight mt-2 text-slate-900">
          Receba a Planilha Agora
        </h3>
        <p className="text-xs text-slate-500 mt-1 font-light">
          Preencha abaixo para iniciar o download do arquivo modelo oficial.
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
            Seu WhatsApp / Telefone
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
            Seu Melhor E-mail
          </label>
          <div className="relative">
            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-200 ${isFocused === 'email' ? 'text-indigo-600' : 'text-slate-400'}`}>
              <Mail className="w-4 h-4" />
            </div>
            <input
              id="email"
              type="email"
              required
              placeholder="Ex: pedro@suaconfeccao.com.br"
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

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl text-xs font-bold text-white transition-all shadow-lg select-none cursor-pointer ${
            isLoading 
              ? 'bg-indigo-400 cursor-not-allowed' 
              : 'bg-indigo-600 hover:bg-indigo-500 active:scale-95 shadow-indigo-200'
          }`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              Quero baixar a planilha grátis
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>

        <div className="pt-2.5 flex items-center justify-center gap-4 text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
            <span>Dados protegidos</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
            <span>Download imediato</span>
          </div>
        </div>

      </form>
    </div>
  );
}
