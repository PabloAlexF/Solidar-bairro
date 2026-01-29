"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  ArrowRight, 
  Utensils, 
  Shirt, 
  Droplets, 
  Pill, 
  HandCoins, 
  Briefcase, 
  Plus, 
  Info,
  Check,
  Smartphone,
  Phone,
  MessageSquare,
  AlertCircle,
  Clock,
  MapPin,
  Building2,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// --- Types ---

type FormData = {
  category: string;
  foodTypes: string[];
  description: string;
  urgency: string;
  contactPreferences: string[];
  visibility: string[];
};

const INITIAL_DATA: FormData = {
  category: "",
  foodTypes: [],
  description: "",
  urgency: "",
  contactPreferences: [],
  visibility: [],
};

// --- Main Page Component ---

export default function WizardPage() {
  const [step, setStep] = React.useState(1);
  const [formData, setFormData] = React.useState<FormData>(INITIAL_DATA);
  const totalSteps = 7;

  const nextStep = () => setStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep((s) => Math.max(s - 1, 1));

  const isStepValid = () => {
    switch (step) {
      case 1: return formData.category && formData.category !== "";
      case 2: return formData.category !== "Alimentos" || (formData.foodTypes && formData.foodTypes.length > 0);
      case 3: return formData.description && formData.description.trim().length >= 10;
      case 4: return formData.urgency && formData.urgency !== "";
      case 5: return true; // Contact preferences are now optional
      case 6: return true; // Visibility is now optional
      default: return true;
    }
  };

  const updateData = (data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  return (
    <div className="min-h-screen bg-[#f2f2f2] flex flex-col items-center py-12 px-4 md:py-24 font-sans selection:bg-orange-100">
      {/* Container Principal inspirado no exemplo do usuário */}
      <div className="w-full max-w-[1500px] flex flex-col items-center">
        
        <Card className="w-full bg-white rounded-[40px] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border-none overflow-hidden relative">
          
          {/* Header do Card */}
          <div className="p-8 md:p-12 border-b border-zinc-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="bg-orange-500 p-4 rounded-2xl shadow-lg shadow-orange-200">
                <Users className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-zinc-900 tracking-tight">Preciso de Ajuda</h1>
                <p className="text-zinc-400 text-sm font-medium uppercase tracking-widest mt-0.5">Rede de Apoio Comunitário</p>
              </div>
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <Badge className="bg-orange-100 text-orange-600 hover:bg-orange-100 border-none px-4 py-1.5 rounded-full font-bold text-sm">
                Etapa {step} de {totalSteps}
              </Badge>
              <div className="w-48 h-2 bg-zinc-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${(step / totalSteps) * 100}%` }}
                  className="h-full bg-orange-500"
                />
              </div>
            </div>
          </div>

          {/* Conteúdo Centralizado e Espaçoso */}
          <div className="p-8 md:p-20 min-h-[500px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <StepContent 
                  step={step} 
                  formData={formData} 
                  updateData={updateData} 
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Rodapé de Navegação */}
          <div className="p-8 md:px-20 md:py-10 bg-zinc-50/50 border-t border-zinc-100 flex items-center justify-between">
            <Button
              variant="ghost"
              onClick={prevStep}
              disabled={step === 1}
              className="text-zinc-500 hover:text-zinc-900 px-6 h-12 rounded-xl font-bold transition-all disabled:opacity-20"
            >
              <ChevronLeft className="mr-2 h-5 w-5" />
              Voltar
            </Button>
            
            {step < totalSteps ? (
              <Button
                onClick={nextStep}
                disabled={!isStepValid()}
                className="bg-orange-500 hover:bg-orange-600 text-white px-10 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-orange-200 transition-all active:scale-95 disabled:opacity-50 group"
              >
                Continuar
                <ArrowRight className="ml-3 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            ) : (
              <Button
                onClick={() => alert("Pedido enviado com sucesso!")}
                className="bg-zinc-900 hover:bg-black text-white px-10 h-14 rounded-2xl font-bold text-lg shadow-xl shadow-zinc-200 transition-all active:scale-95"
              >
                Publicar Pedido
                <Check className="ml-3 h-5 w-5" />
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// --- Sub-componentes ---

function StepContent({ step, formData, updateData }: { 
  step: number; 
  formData: FormData; 
  updateData: (data: Partial<FormData>) => void; 
}) {
  switch (step) {
    case 1: return <Step1 formData={formData} updateData={updateData} />;
    case 2: return <Step2 formData={formData} updateData={updateData} />;
    case 3: return <Step3 formData={formData} updateData={updateData} />;
    case 4: return <Step4 formData={formData} updateData={updateData} />;
    case 5: return <Step5 formData={formData} updateData={updateData} />;
    case 6: return <Step6 formData={formData} updateData={updateData} />;
    case 7: return <Step7 formData={formData} updateData={updateData} />;
    default: return null;
  }
}

function Step1({ formData, updateData }: { formData: FormData; updateData: (data: Partial<FormData>) => void }) {
  const categories = [
    { id: "Alimentos", icon: Utensils, label: "Alimentos" },
    { id: "Roupas", icon: Shirt, label: "Roupas" },
    { id: "Higiene", icon: Droplets, label: "Higiene" },
    { id: "Medicamentos", icon: Pill, label: "Medicamentos" },
    { id: "Contas", icon: HandCoins, label: "Contas" },
    { id: "Emprego", icon: Briefcase, label: "Emprego" },
    { id: "Outros", icon: Plus, label: "Outros" },
  ];

  return (
    <div className="max-w-4xl mx-auto text-center space-y-12">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-zinc-900 tracking-tight">Qual tipo de ajuda você precisa?</h2>
        <p className="text-zinc-500 text-lg">Selecione a categoria que melhor descreve seu pedido.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateData({ category: cat.id })}
            className={cn(
              "flex flex-col items-center justify-center p-8 rounded-[32px] border transition-all duration-300 gap-4 group",
              formData.category === cat.id
                ? "border-orange-500 bg-orange-50 shadow-lg shadow-orange-100 ring-4 ring-orange-50"
                : "border-zinc-100 bg-white hover:border-zinc-300 hover:shadow-md"
            )}
          >
            <div className={cn(
              "p-5 rounded-2xl transition-all duration-300",
              formData.category === cat.id ? "bg-orange-500 text-white" : "bg-zinc-50 text-zinc-400 group-hover:bg-zinc-100"
            )}>
              <cat.icon className="w-8 h-8" />
            </div>
            <span className={cn(
              "font-bold text-sm uppercase tracking-widest",
              formData.category === cat.id ? "text-orange-600" : "text-zinc-500"
            )}>
              {cat.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step2({ formData, updateData }: { formData: FormData; updateData: (data: Partial<FormData>) => void }) {
  if (formData.category !== "Alimentos") {
    return (
      <div className="max-w-2xl mx-auto text-center py-20 space-y-6">
        <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-blue-500">
          <Info className="w-10 h-10" />
        </div>
        <h2 className="text-3xl font-bold text-zinc-900">Esta etapa é para Alimentos</h2>
        <p className="text-zinc-500 text-lg">Como você selecionou <span className="text-orange-600 font-bold">{formData.category}</span>, pode continuar para a próxima etapa.</p>
      </div>
    );
  }

  const options = [
    { id: "Cesta Básica", label: "Cesta Básica", desc: "Arroz, feijão, óleo, açúcar", icon: Utensils },
    { id: "Alimentos Frescos", label: "Alimentos Frescos", desc: "Frutas, verduras, carnes", icon: Droplets },
    { id: "Alimentação Infantil", label: "Alimentação Infantil", desc: "Leite, papinha, fralda", icon: Pill },
    { id: "Refeições Prontas", label: "Refeições Prontas", desc: "Marmitas, lanches", icon: Utensils },
  ];

  const toggle = (id: string) => {
    const current = formData.foodTypes || [];
    const next = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    updateData({ foodTypes: next });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-zinc-900 tracking-tight">Que tipo de alimento você precisa?</h2>
        <p className="text-zinc-500 text-lg">Selecione as opções que melhor descrevem sua necessidade.</p>
      </div>

      <div className="bg-blue-50 p-6 rounded-2xl flex items-center gap-4 text-blue-700 border border-blue-100">
        <Info className="w-6 h-6 shrink-0" />
        <p className="font-semibold">Você pode escolher mais de uma opção para facilitar as doações.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={cn(
              "flex items-center gap-6 p-8 rounded-[32px] border-2 transition-all duration-300 text-left",
              formData.foodTypes.includes(opt.id) 
                ? "border-blue-500 bg-blue-50 ring-4 ring-blue-50" 
                : "border-zinc-100 hover:border-zinc-200 bg-white"
            )}
          >
            <Checkbox 
              checked={formData.foodTypes.includes(opt.id)} 
              className="w-6 h-6 rounded-lg border-zinc-200 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600" 
            />
            <div className="flex-1">
              <p className="font-bold text-xl text-zinc-900">{opt.label}</p>
              <p className="text-zinc-500 text-sm font-medium">{opt.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step3({ formData, updateData }: { formData: FormData; updateData: (data: Partial<FormData>) => void }) {
  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-zinc-900 tracking-tight">Explique sua necessidade</h2>
        <p className="text-zinc-500 text-lg">Sua mensagem será vista por vizinhos dispostos a ajudar.</p>
      </div>

      <div className="relative">
        <Textarea
          placeholder="Ex: Estou passando por um momento difícil e precisaria de uma cesta básica para este mês…"
          value={formData.description}
          onChange={(e) => updateData({ description: e.target.value.slice(0, 500) })}
          className="min-h-[250px] rounded-[32px] border-zinc-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-50/50 transition-all p-8 text-lg text-zinc-700 placeholder:text-zinc-300"
        />
        <div className="absolute bottom-6 right-8 text-zinc-400 font-bold text-sm">
          {formData.description.length}/500
        </div>
      </div>

      <p className="text-zinc-400 text-sm font-semibold flex items-center gap-2">
        <MessageSquare className="w-4 h-4" />
        Seja claro sobre o que você precisa para que os vizinhos possam agir rápido.
      </p>
    </div>
  );
}

function Step4({ formData, updateData }: { formData: FormData; updateData: (data: Partial<FormData>) => void }) {
  const options = [
    { id: "urgente", label: "Urgente", icon: AlertCircle, color: "text-red-500", bg: "bg-red-50" },
    { id: "moderada", label: "Moderada", icon: Clock, color: "text-orange-500", bg: "bg-orange-50" },
    { id: "esperar", label: "Pode esperar", icon: Check, color: "text-blue-500", bg: "bg-blue-50" },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="space-y-4 text-center">
        <h2 className="text-4xl font-bold text-zinc-900 tracking-tight">Qual a urgência do pedido?</h2>
        <p className="text-zinc-500 text-lg">Isso ajuda a comunidade a priorizar os atendimentos.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => updateData({ urgency: opt.id })}
            className={cn(
              "flex flex-col items-center p-10 rounded-[40px] border-2 transition-all duration-300 gap-6 group",
              formData.urgency === opt.id 
                ? "border-orange-500 bg-orange-50 ring-4 ring-orange-50" 
                : "border-zinc-100 hover:border-zinc-200 bg-white"
            )}
          >
            <div className={cn("p-6 rounded-2xl", opt.bg, opt.color)}>
              <opt.icon className="w-10 h-10" />
            </div>
            <span className="font-bold text-2xl text-zinc-900">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step5({ formData, updateData }: { formData: FormData; updateData: (data: Partial<FormData>) => void }) {
  const options = [
    { id: "WhatsApp", label: "WhatsApp", icon: Smartphone, color: "text-green-600", bg: "bg-green-50" },
    { id: "Ligação", label: "Ligação", icon: Phone, color: "text-blue-600", bg: "bg-blue-50" },
    { id: "Chat", label: "Chat Interno", icon: MessageSquare, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  const toggle = (id: string) => {
    const current = formData.contactPreferences || [];
    const next = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    updateData({ contactPreferences: next });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-zinc-900 tracking-tight">Qual seria a preferência de contato?</h2>
        <p className="text-zinc-500 text-lg">Selecione onde você se sente mais confortável para conversar.</p>
      </div>

      <div className="bg-orange-50 p-6 rounded-2xl flex items-center gap-4 text-orange-700 border border-orange-100">
        <Plus className="w-6 h-6 shrink-0" />
        <p className="font-semibold">Escolha múltiplas opções para que mais pessoas possam te ajudar rapidamente!</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={cn(
              "flex flex-col items-center p-10 rounded-[40px] border-2 transition-all duration-300 gap-6",
              formData.contactPreferences.includes(opt.id) 
                ? "border-orange-500 bg-orange-50 ring-4 ring-orange-50" 
                : "border-zinc-100 hover:border-zinc-200 bg-white"
            )}
          >
            <Checkbox checked={formData.contactPreferences.includes(opt.id)} className="w-6 h-6 rounded-full border-zinc-200 data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600" />
            <div className={cn("p-6 rounded-2xl", opt.bg, opt.color)}>
              <opt.icon className="w-8 h-8" />
            </div>
            <span className="font-bold text-xl text-zinc-900">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step6({ formData, updateData }: { formData: FormData; updateData: (data: Partial<FormData>) => void }) {
  const options = [
    { id: "Apenas meu bairro", label: "Apenas meu bairro", icon: MapPin },
    { id: "Bairros próximos", label: "Bairros próximos", icon: Users },
    { id: "ONGs parceiras", label: "ONGs parceiras", icon: Building2 },
  ];

  const toggle = (id: string) => {
    const current = formData.visibility || [];
    const next = current.includes(id) ? current.filter(i => i !== id) : [...current, id];
    updateData({ visibility: next });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10">
      <div className="space-y-4">
        <h2 className="text-4xl font-bold text-zinc-900 tracking-tight">Quem pode ver seu pedido?</h2>
        <p className="text-zinc-500 text-lg">Escolha o alcance da sua solicitação de ajuda.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {options.map((opt) => (
          <button
            key={opt.id}
            onClick={() => toggle(opt.id)}
            className={cn(
              "flex flex-col items-center p-10 rounded-[40px] border-2 transition-all duration-300 gap-6",
              formData.visibility.includes(opt.id) 
                ? "border-orange-500 bg-orange-50 ring-4 ring-orange-50" 
                : "border-zinc-100 hover:border-zinc-200 bg-white"
            )}
          >
            <Checkbox checked={formData.visibility.includes(opt.id)} className="w-6 h-6 border-zinc-200 data-[state=checked]:bg-orange-500" />
            <div className="p-6 bg-zinc-50 rounded-2xl text-zinc-400 group-hover:text-zinc-600 transition-colors">
              <opt.icon className="w-8 h-8" />
            </div>
            <span className="font-bold text-xl text-zinc-900">{opt.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Step7({ formData, updateData }: { formData: FormData; updateData: (data: Partial<FormData>) => void }) {
  return (
    <div className="max-w-[1400px] mx-auto">
      
      {/* Header da página de revisão */}
      <div className="text-center mb-16">
        <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
          <Check className="w-12 h-12 text-green-500" />
        </div>
        <h2 className="text-4xl font-bold text-zinc-900 tracking-tight mb-4">Pronto para Publicar!</h2>
        <p className="text-zinc-500 text-lg max-w-2xl mx-auto">
          Revise todas as informações antes de publicar seu pedido na comunidade.
        </p>
      </div>

      {/* Container principal com layout inspirado no CSS */}
      <div className="bg-white rounded-[40px] border border-zinc-100 shadow-lg overflow-hidden">
        
        {/* Seção de informações principais */}
        <div className="p-12 border-b border-zinc-100">
          <div className="grid md:grid-cols-2 gap-12">
            
            {/* Coluna esquerda - Informações básicas */}
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
                  Informações do Pedido
                </h3>
                
                <div className="flex items-center gap-4 mb-6">
                  {/* Card de Categoria */}
                  <div className="bg-zinc-50 min-w-[200px] h-[75px] border-2 border-zinc-200 rounded-[24px] flex items-center justify-center transition-all hover:border-orange-300">
                    <p className="font-bold text-zinc-900 uppercase tracking-[0.2em] text-lg">
                      {formData.category}
                    </p>
                  </div>

                  {/* Card de Urgência */}
                  <div className="bg-zinc-50 min-w-[150px] h-[75px] border-2 border-zinc-200 rounded-[24px] flex items-center justify-center transition-all hover:border-orange-300">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "w-4 h-4 rounded-full",
                        formData.urgency === 'urgente' ? "bg-red-500" : 
                        formData.urgency === 'moderada' ? "bg-orange-500" : "bg-blue-500"
                      )} />
                      <p className="font-bold text-zinc-600 uppercase tracking-widest text-sm">
                        {formData.urgency}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itens solicitados (se for alimentos) */}
              {formData.category === "Alimentos" && formData.foodTypes.length > 0 && (
                <div className="pt-8 border-t border-zinc-100">
                  <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest mb-4">
                    Itens Solicitados
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {formData.foodTypes.map(item => (
                      <span 
                        key={item} 
                        className="px-6 py-3 bg-orange-50 border border-orange-200 rounded-full font-bold text-orange-700 text-sm transition-all hover:bg-orange-100"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Coluna direita - Mensagem */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">
                Sua Mensagem
              </h3>
              <div className="relative">
                <div className="bg-zinc-50 border-2 border-zinc-200 rounded-[32px] p-8 min-h-[200px] transition-all hover:border-orange-300">
                  <p className="text-zinc-700 text-lg leading-relaxed font-medium italic">
                    "{formData.description}"
                  </p>
                </div>
                <div className="absolute top-6 right-6 text-zinc-300">
                  <MessageSquare className="w-8 h-8" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Seção de detalhes de contato e visibilidade */}
        <div className="p-12">
          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Card de Contato */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-8 rounded-[32px] border-2 border-orange-200 transition-all hover:shadow-lg hover:border-orange-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-orange-500 p-3 rounded-xl shadow-lg">
                  <Smartphone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-orange-600 uppercase tracking-widest mb-1">
                    Contato Preferencial
                  </p>
                  <p className="font-bold text-orange-900 text-lg">
                    {formData.contactPreferences.length > 0 
                      ? formData.contactPreferences.join(", ") 
                      : "Não definido"
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Card de Visibilidade */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-8 rounded-[32px] border-2 border-blue-200 transition-all hover:shadow-lg hover:border-blue-300">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-blue-500 p-3 rounded-xl shadow-lg">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">
                    Alcance do Pedido
                  </p>
                  <p className="font-bold text-blue-900 text-lg">
                    {formData.visibility.length > 0 
                      ? formData.visibility.join(", ") 
                      : "Não definido"
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Banner de confirmação */}
          <div className="mt-12 bg-gradient-to-r from-green-500 to-emerald-500 p-8 rounded-[32px] text-white shadow-xl">
            <div className="flex items-center gap-6">
              <div className="bg-white/20 p-4 rounded-2xl backdrop-blur-sm">
                <Check className="w-8 h-8 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-2">Tudo pronto!</h3>
                <p className="text-green-100 text-lg font-medium">
                  Seu pedido será publicado na rede de apoio comunitário e vizinhos próximos poderão te ajudar.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}