import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Camera, 
  MapPin, 
  Calendar, 
  Tag, 
  FileText, 
  Car, 
  Smartphone, 
  PawPrint,
  AlertCircle,
  CheckCircle2,
  Send,
  Heart,
  Info,
  Plus,
  Sun,
  Moon,
  ChevronRight,
  ChevronLeft,
  Share2,
  Eye
} from 'lucide-react';

const CATEGORIES = [
  { id: 'documentos', label: 'Documentos', icon: FileText, color: 'blue' },
  { id: 'veiculos', label: 'Veículos', icon: Car, color: 'red' },
  { id: 'pets', label: 'Pets', icon: PawPrint, color: 'amber' },
  { id: 'eletronicos', label: 'Eletrônicos', icon: Smartphone, color: 'purple' },
  { id: 'outros', label: 'Outros', icon: Tag, color: 'emerald' },
];

const STEPS = [
  { id: 1, title: 'Tipo & Categoria', description: 'O que aconteceu?' },
  { id: 2, title: 'Detalhes', description: 'O que sumiu/apareceu?' },
  { id: 3, title: 'Contato & Fotos', description: 'Como te achar?' },
];

export default function NovoAnuncioPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isDark, setIsDark] = useState(false);
  
  const [formData, setFormData] = useState({
    type: 'perdido',
    category: '',
    title: '',
    description: '',
    location: '',
    date: '',
    reward: false,
    contact: '',
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, STEPS.length));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentStep < STEPS.length) {
      nextStep();
      return;
    }
    
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => {
        navigate('/achados-e-perdidos');
      }, 3000);
    }, 1500);
  };

  const theme = useMemo(() => ({
    bg: isDark ? "bg-[#020617]" : "bg-[#F8FAFC]",
    text: isDark ? "text-white" : "text-slate-900",
    textMuted: isDark ? "text-slate-400" : "text-slate-500",
    card: isDark ? "bg-white/5 backdrop-blur-xl border-white/10" : "bg-white border border-slate-200 shadow-2xl shadow-slate-200/50",
    input: isDark ? "bg-white/5 border-white/5 text-white placeholder:text-slate-600" : "bg-slate-50 border-slate-200 text-slate-900 placeholder:text-slate-400",
    navButton: isDark ? "bg-white/5 border-white/10 hover:bg-white/10" : "bg-white border border-slate-200 shadow-sm hover:bg-slate-50",
    gradient: isDark ? "from-white to-slate-400" : "from-slate-900 to-slate-700",
    accent: "purple-600"
  }), [isDark]);

  const selectedCategory = CATEGORIES.find(c => c.id === formData.category);

  if (success) {
    return (
      <div className={`min-h-screen ${theme.bg} flex items-center justify-center p-4 overflow-hidden relative font-['Outfit'] transition-colors duration-500`}>
        <div className={`relative ${isDark ? 'bg-white/10 backdrop-blur-2xl border-white/20' : 'bg-white border-slate-200 shadow-2xl'} rounded-[48px] p-12 max-w-lg w-full text-center scale-up-center`}>
          <div className="w-24 h-24 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 animate-bounce border border-emerald-500/30">
            <CheckCircle2 size={48} />
          </div>
          <h2 className={`text-4xl font-black ${theme.text} mb-4`}>Anúncio Publicado!</h2>
          <p className={`${theme.textMuted} font-medium text-lg mb-8`}>
            Seu anúncio já está visível para a vizinhança. Boa sorte!
          </p>
          <div className="animate-pulse flex items-center justify-center gap-2 text-purple-600 font-bold">
            Redirecionando...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme.bg} ${theme.text} pb-20 relative overflow-hidden font-['Outfit'] transition-colors duration-500`}>
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        {isDark ? (
          <>
            <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-purple-900/20 blur-[120px] rounded-full" />
            <div className="absolute bottom-[20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[150px] rounded-full" />
          </>
        ) : (
          <>
            <div className="absolute top-[-5%] right-[-5%] w-[30%] h-[30%] bg-purple-100/40 blur-[100px] rounded-full" />
            <div className="absolute bottom-[-5%] left-[-5%] w-[40%] h-[40%] bg-blue-100/30 blur-[100px] rounded-full" />
          </>
        )}
      </div>

      {/* Header */}
      <header className="py-6 lg:py-8 relative z-20 border-b border-slate-200/10 backdrop-blur-md sticky top-0">
        <div className="max-w-[1400px] mx-auto flex items-center justify-between px-6 lg:px-12">
          <button 
            onClick={() => navigate(-1)}
            className={`group flex items-center gap-3 font-bold ${theme.textMuted} hover:${theme.text} transition-all`}
          >
            <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl ${theme.navButton} flex items-center justify-center transition-all`}>
              <ArrowLeft size={20} />
            </div>
            <span className="hidden sm:inline text-lg">Voltar</span>
          </button>

          <div className="flex items-center gap-3 font-black text-xl lg:text-2xl tracking-tighter">
            <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg shadow-purple-600/20">
              <Plus className="text-white" size={20} />
            </div>
            <span className={`bg-gradient-to-r ${theme.gradient} bg-clip-text text-transparent`}>Novo Anúncio</span>
          </div>
          
          <button 
            onClick={() => setIsDark(!isDark)}
            className={`w-10 h-10 lg:w-12 lg:h-12 rounded-2xl ${theme.navButton} flex items-center justify-center transition-all text-purple-600`}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      <main className="max-w-[1400px] mx-auto pt-8 lg:pt-12 relative z-10 px-6 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left Column: Multi-step Form */}
          <div className="lg:col-span-7 space-y-10">
            {/* Stepper for Desktop */}
            <div className="hidden sm:flex items-center justify-between mb-8">
              {STEPS.map((step) => (
                <div key={step.id} className="flex-1 flex flex-col items-center group relative">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 mb-3 z-10 ${
                    currentStep === step.id 
                    ? 'bg-purple-600 border-purple-600 text-white shadow-lg shadow-purple-600/30' 
                    : currentStep > step.id 
                      ? 'bg-emerald-500 border-emerald-500 text-white' 
                      : `${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} text-slate-400`
                  }`}>
                    {currentStep > step.id ? <CheckCircle2 size={24} /> : <span className="text-xl font-black">{step.id}</span>}
                  </div>
                  <div className="text-center">
                    <p className={`text-xs font-black uppercase tracking-widest mb-1 ${currentStep >= step.id ? 'text-purple-600' : 'text-slate-400'}`}>
                      {step.title}
                    </p>
                    <p className={`text-[10px] font-bold ${theme.textMuted} opacity-60`}>{step.description}</p>
                  </div>
                  {step.id < STEPS.length && (
                    <div className={`absolute top-7 left-1/2 w-full h-[2px] -z-0 transition-colors duration-500 ${
                      currentStep > step.id ? 'bg-emerald-500' : isDark ? 'bg-white/10' : 'bg-slate-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in">
              {currentStep === 1 && (
                <div className="space-y-8 animate-slide-right">
                  <div className={`${theme.card} rounded-[40px] p-8 lg:p-12 transition-all duration-300`}>
                    <div className="flex items-center gap-5 mb-10">
                      <div className={`w-16 h-16 rounded-[24px] ${isDark ? 'bg-purple-500/10 text-purple-400' : 'bg-purple-100 text-purple-600'} flex items-center justify-center border-2 border-purple-500/20`}>
                        <Info size={32} />
                      </div>
                      <div>
                        <h3 className={`text-3xl lg:text-4xl font-black ${theme.text}`}>O que aconteceu?</h3>
                        <p className={`${theme.textMuted} text-lg font-bold`}>Selecione o tipo de ocorrência</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'perdido' })}
                        className={`relative overflow-hidden group flex flex-col items-center justify-center gap-6 p-10 lg:p-14 rounded-[40px] border-4 transition-all duration-500 ${
                          formData.type === 'perdido'
                          ? 'border-red-500 bg-red-500/10 shadow-[0_0_50px_-10px_rgba(239,68,68,0.3)]'
                          : `${isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'} hover:border-slate-300`
                        }`}
                      >
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                          formData.type === 'perdido' ? 'bg-red-500 text-white shadow-xl shadow-red-500/40' : `${isDark ? 'bg-white/10 text-slate-500' : 'bg-slate-200 text-slate-400'}`
                        }`}>
                          <AlertCircle size={44} />
                        </div>
                        <div className="text-center">
                          <span className={`block font-black uppercase tracking-widest text-2xl mb-1 ${formData.type === 'perdido' ? (isDark ? 'text-white' : 'text-red-700') : theme.textMuted}`}>
                            Perdi algo
                          </span>
                          <span className="text-sm text-slate-400 font-black uppercase tracking-tighter">Estou procurando</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, type: 'achado' })}
                        className={`relative overflow-hidden group flex flex-col items-center justify-center gap-6 p-10 lg:p-14 rounded-[40px] border-4 transition-all duration-500 ${
                          formData.type === 'achado'
                          ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_50px_-10px_rgba(16,185,129,0.3)]'
                          : `${isDark ? 'border-white/5 bg-white/5' : 'border-slate-100 bg-slate-50'} hover:border-slate-300`
                        }`}
                      >
                        <div className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-500 ${
                          formData.type === 'achado' ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-500/40' : `${isDark ? 'bg-white/10 text-slate-500' : 'bg-slate-200 text-slate-400'}`
                        }`}>
                          <CheckCircle2 size={44} />
                        </div>
                        <div className="text-center">
                          <span className={`block font-black uppercase tracking-widest text-2xl mb-1 ${formData.type === 'achado' ? (isDark ? 'text-white' : 'text-emerald-700') : theme.textMuted}`}>
                            Encontrei algo
                          </span>
                          <span className="text-sm text-slate-400 font-black uppercase tracking-tighter">Quero devolver</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  <div className={`${theme.card} rounded-[40px] p-8 lg:p-12`}>
                    <div className="flex items-center gap-5 mb-10">
                      <div className={`w-16 h-16 rounded-[24px] ${isDark ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'} flex items-center justify-center border-2 border-blue-500/20`}>
                        <Tag size={32} />
                      </div>
                      <div>
                        <h3 className={`text-3xl lg:text-4xl font-black ${theme.text}`}>Qual a Categoria?</h3>
                        <p className={`${theme.textMuted} text-lg font-bold`}>Selecione a que melhor se encaixa</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, category: cat.id })}
                          className={`flex flex-col items-center justify-center gap-4 p-8 rounded-[32px] border-4 transition-all duration-300 ${
                            formData.category === cat.id
                            ? 'border-purple-600 bg-purple-600 text-white shadow-xl shadow-purple-600/30 scale-105'
                            : `${isDark ? 'border-white/5 bg-white/5 text-slate-500' : 'border-slate-100 bg-slate-50 text-slate-500'} hover:border-purple-500/40`
                          }`}
                        >
                          <cat.icon size={36} />
                          <span className="font-black text-[10px] uppercase tracking-[0.2em]">{cat.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-8 animate-slide-right">
                  <div className={`${theme.card} rounded-[48px] p-8 lg:p-12 space-y-12`}>
                    <div className="flex items-center gap-5">
                      <div className={`w-16 h-16 rounded-[24px] ${isDark ? 'bg-amber-500/10 text-amber-400' : 'bg-amber-100 text-amber-600'} flex items-center justify-center border-2 border-amber-500/20`}>
                        <FileText size={32} />
                      </div>
                      <h3 className={`text-3xl lg:text-4xl font-black ${theme.text}`}>Conte os detalhes</h3>
                    </div>

                    <div className="grid grid-cols-1 gap-10">
                      <div className="space-y-4">
                        <label className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Título do Anúncio</label>
                        <input 
                          type="text" 
                          placeholder="Ex: iPhone 13 Pro Max Cinza..."
                          required
                          className={`w-full ${theme.input} border-4 rounded-[32px] p-7 font-black text-xl lg:text-2xl focus:bg-white focus:border-purple-500 focus:outline-none transition-all`}
                          value={formData.title}
                          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                      </div>

                      <div className="space-y-4">
                        <label className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Descrição Detalhada</label>
                        <textarea 
                          placeholder="Fale sobre marcas, cor, estado do item, onde exatamente foi visto..."
                          rows={4}
                          required
                          className={`w-full ${theme.input} border-4 rounded-[32px] p-7 font-bold text-lg lg:text-xl focus:bg-white focus:border-purple-500 focus:outline-none transition-all resize-none`}
                          value={formData.description}
                          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Onde?</label>
                          <div className="relative">
                            <MapPin size={24} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                              type="text" 
                              placeholder="Rua, Bairro ou Ponto"
                              required
                              className={`w-full ${theme.input} border-4 rounded-[32px] py-7 pl-16 pr-8 font-black text-lg focus:bg-white focus:border-purple-500 focus:outline-none transition-all`}
                              value={formData.location}
                              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <label className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Quando?</label>
                          <div className="relative">
                            <Calendar size={24} className="absolute left-7 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input 
                              type="date" 
                              required
                              className={`w-full ${theme.input} border-4 rounded-[32px] py-7 pl-16 pr-8 font-black text-lg focus:bg-white focus:border-purple-500 focus:outline-none transition-all ${isDark ? '[color-scheme:dark]' : ''}`}
                              value={formData.date}
                              onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-8 animate-slide-right">
                  <div className={`${theme.card} rounded-[48px] p-8 lg:p-12 space-y-10`}>
                    <div className="flex items-center gap-5">
                      <div className={`w-16 h-16 rounded-[24px] ${isDark ? 'bg-emerald-500/10 text-emerald-400' : 'bg-emerald-100 text-emerald-600'} flex items-center justify-center border-2 border-emerald-500/20`}>
                        <Smartphone size={32} />
                      </div>
                      <h3 className={`text-3xl lg:text-4xl font-black ${theme.text}`}>Finalizar Cadastro</h3>
                    </div>

                    <div className="space-y-10">
                      <div className="space-y-4">
                        <label className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] ml-2">Seu WhatsApp</label>
                        <input 
                          type="text" 
                          placeholder="(00) 00000-0000"
                          required
                          className={`w-full ${theme.input} border-4 rounded-[32px] p-7 font-black text-2xl focus:bg-white focus:border-purple-500 focus:outline-none transition-all`}
                          value={formData.contact}
                          onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                        />
                      </div>

                      {formData.type === 'perdido' && (
                        <label className={`flex items-center gap-6 p-8 rounded-[40px] border-4 transition-all cursor-pointer group ${
                          formData.reward 
                          ? 'bg-amber-500 border-amber-500 text-white shadow-xl shadow-amber-500/30' 
                          : `${isDark ? 'bg-white/5 border-white/5' : 'bg-slate-100 border-slate-200'} hover:border-amber-400`
                        }`}>
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${
                            formData.reward ? 'bg-white text-amber-500' : 'bg-slate-200 text-slate-400'
                          }`}>
                            <Heart size={28} fill={formData.reward ? "currentColor" : "none"} />
                          </div>
                          <div className="flex-1">
                            <input 
                              type="checkbox" 
                              className="hidden"
                              checked={formData.reward}
                              onChange={(e) => setFormData({ ...formData, reward: e.target.checked })}
                            />
                            <span className={`block font-black uppercase tracking-wider text-lg ${formData.reward ? 'text-white' : theme.text}`}>
                              Oferecer Gratificação
                            </span>
                            <span className={`text-sm font-bold ${formData.reward ? 'text-white/80' : 'text-slate-400'}`}>Símbolo de reconhecimento pela ajuda</span>
                          </div>
                        </label>
                      )}

                      <div className="pt-4">
                        <label className={`block w-full border-4 border-dashed ${isDark ? 'border-white/10' : 'border-slate-300'} rounded-[48px] p-16 text-center cursor-pointer hover:border-purple-600 hover:bg-purple-600/5 transition-all group`}>
                          <div className={`w-28 h-28 ${isDark ? 'bg-white/5' : 'bg-slate-100'} rounded-[36px] flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform`}>
                            <Camera size={56} className="text-slate-400 group-hover:text-purple-600" />
                          </div>
                          <span className={`block font-black text-3xl ${theme.text} mb-3`}>Adicionar Fotos</span>
                          <span className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Clique para selecionar</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex items-center gap-6 pt-6">
                {currentStep > 1 && (
                  <button
                    type="button"
                    onClick={prevStep}
                    className={`flex-1 py-8 rounded-[36px] font-black text-xl lg:text-2xl flex items-center justify-center gap-4 transition-all ${
                      isDark ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-white border-4 border-slate-200 text-slate-900 hover:border-slate-400'
                    }`}
                  >
                    <ChevronLeft size={28} />
                    Anterior
                  </button>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className={`flex-[2] py-8 rounded-[36px] font-black text-xl lg:text-2xl flex items-center justify-center gap-6 transition-all shadow-2xl ${
                    loading 
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                    : 'bg-slate-900 text-white hover:bg-purple-600 hover:scale-[1.02] active:scale-[0.98]'
                  }`}
                >
                  {loading ? (
                    <div className="w-8 h-8 border-4 border-slate-400 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>{currentStep === STEPS.length ? 'Publicar Anúncio' : 'Próximo Passo'}</span>
                      {currentStep === STEPS.length ? <Send size={28} /> : <ChevronRight size={28} />}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Right Column: Live Preview Card (Desktop Only) */}
          <div className="hidden lg:block lg:col-span-5 sticky top-32">
            <div className="space-y-6">
              <div className="flex items-center gap-3 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full w-fit mb-4">
                <Eye size={16} className="text-purple-600" />
                <span className="text-purple-600 text-[10px] font-black uppercase tracking-widest">Visualização em Tempo Real</span>
              </div>

              <div className={`${theme.card} rounded-[48px] overflow-hidden group transition-all duration-700 hover:rotate-1`}>
                <div className="aspect-[4/3] bg-slate-200 relative overflow-hidden flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                  <Camera size={64} className="text-slate-400" />
                  <div className="absolute top-8 left-8">
                    <div className={`px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl ${
                      formData.type === 'perdido' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                    }`}>
                      {formData.type === 'perdido' ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />}
                      {formData.type === 'perdido' ? 'Desaparecido' : 'Encontrado'}
                    </div>
                  </div>
                  {formData.reward && (
                    <div className="absolute top-8 right-8">
                      <div className="bg-amber-500 text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl flex items-center gap-2 animate-pulse">
                        <Heart size={14} fill="white" />
                        Gratifica
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-10 space-y-8">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      {selectedCategory && (
                        <div className={`p-3 rounded-xl ${isDark ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-900'}`}>
                          <selectedCategory.icon size={18} />
                        </div>
                      )}
                      <span className="text-sm font-black text-purple-600 uppercase tracking-widest">
                        {selectedCategory?.label || 'Selecione Categoria'}
                      </span>
                    </div>
                    <h2 className={`text-3xl font-black ${theme.text} leading-tight truncate`}>
                      {formData.title || 'Título do seu anúncio'}
                    </h2>
                    <p className={`${theme.textMuted} font-bold text-lg line-clamp-2`}>
                      {formData.description || 'Os detalhes que você escrever aparecerão aqui para ajudar a vizinhança...'}
                    </p>
                  </div>

                  <div className={`pt-8 border-t ${isDark ? 'border-white/10' : 'border-slate-100'} grid grid-cols-2 gap-6`}>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'} flex items-center justify-center text-slate-400`}>
                        <MapPin size={20} />
                      </div>
                      <div>
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter">Onde</span>
                        <span className={`font-black text-sm ${theme.text} truncate max-w-[120px] block`}>{formData.location || 'Localização'}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-50'} flex items-center justify-center text-slate-400`}>
                        <Calendar size={20} />
                      </div>
                      <div>
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter">Quando</span>
                        <span className={`font-black text-sm ${theme.text}`}>{formData.date || '--/--/----'}</span>
                      </div>
                    </div>
                  </div>

                  <div className={`p-6 rounded-3xl ${isDark ? 'bg-white/5' : 'bg-slate-50'} flex items-center justify-between`}>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-purple-600 flex items-center justify-center text-white font-black text-xl">
                        V
                      </div>
                      <div>
                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-tighter">Contato</span>
                        <span className={`font-black text-sm ${theme.text}`}>{formData.contact || '(00) 00000-0000'}</span>
                      </div>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-400 hover:text-purple-600 cursor-pointer transition-colors">
                      <Share2 size={20} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Tips */}
              <div className={`${theme.card} p-8 rounded-[36px] bg-gradient-to-br from-purple-600/5 to-transparent border-purple-600/10`}>
                <div className="flex items-start gap-5">
                  <div className="w-12 h-12 rounded-2xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-purple-600/20">
                    <Heart size={24} />
                  </div>
                  <div>
                    <h4 className={`font-black text-lg ${theme.text} mb-1 tracking-tight`}>Dica do Solidar</h4>
                    <p className={`${theme.textMuted} font-bold text-sm leading-relaxed`}>
                      Anúncios com fotos claras e descrição detalhada têm <span className="text-purple-600 underline underline-offset-4 decoration-2">3x mais chances</span> de serem resolvidos rapidamente.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Global CSS for Animations */}
      <style jsx global>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideRight {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleUp {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fadeIn 0.5s ease-out; }
        .animate-slide-right { animation: slideRight 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
        .scale-up-center { animation: scaleUp 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
      `}</style>
    </div>
  );
}