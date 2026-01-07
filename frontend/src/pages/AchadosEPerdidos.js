import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  MapPin, 
  Tag, 
  ArrowLeft, 
  Clock, 
  FileText, 
  Car, 
  Smartphone, 
  Package, 
  PawPrint,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  Heart,
  Moon,
  Sun,
  HandHeart
} from 'lucide-react';

const CATEGORIES = [
  { id: 'all', label: 'Todos', icon: Package, color: 'slate' },
  { id: 'documentos', label: 'Documentos', icon: FileText, color: 'blue' },
  { id: 'veiculos', label: 'Veículos', icon: Car, color: 'red' },
  { id: 'pets', label: 'Pets', icon: PawPrint, color: 'amber' },
  { id: 'eletronicos', label: 'Eletrônicos', icon: Smartphone, color: 'purple' },
  { id: 'outros', label: 'Outros', icon: Tag, color: 'emerald' },
];

const INITIAL_ITEMS = [
  {
    id: '1',
    type: 'perdido',
    title: 'RG - Maria Silva',
    category: 'documentos',
    description: 'Perdi meu RG próximo à praça central. Está em uma capinha transparente.',
    location: 'Bairro Centro',
    date: '2024-03-20',
    reward: true,
    author: 'Maria S.',
    image: null
  },
  {
    id: '2',
    type: 'achado',
    title: 'Chave de Carro Toyota',
    category: 'veiculos',
    description: 'Encontrei uma chave de carro Toyota no estacionamento do mercado.',
    location: 'Bairro Jardim',
    date: '2024-03-21',
    author: 'João P.',
    image: null
  },
  {
    id: '3',
    type: 'perdido',
    title: 'Cachorro Golden Retriever',
    category: 'pets',
    description: 'Fugiu de casa ontem à noite. Atende pelo nome de Max.',
    location: 'Bairro Vila Nova',
    date: '2024-03-19',
    reward: true,
    author: 'Ana L.',
    image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=200'
  }
];

export default function AchadosEPerdidosPage() {
  const navigate = useNavigate();
  const [isDark, setIsDark] = useState(false);
  const [items, setItems] = useState(INITIAL_ITEMS);
  const [filterType, setFilterType] = useState('all'); 
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredItems = items.filter(item => {
    const matchesType = filterType === 'all' || item.type === filterType;
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesCategory && matchesSearch;
  });

  return (
    <div className={`min-h-screen ${isDark ? 'bg-[#020617] text-white' : 'bg-slate-50 text-slate-900'} selection:bg-emerald-500/30 font-['Outfit'] transition-colors duration-300`}>
      {/* Abstract Background Elements */}
      <div className={`fixed inset-0 overflow-hidden pointer-events-none z-0 ${isDark ? 'opacity-100' : 'opacity-50'}`}>
        <div className={`absolute -top-[10%] -left-[10%] w-[50%] h-[50%] ${isDark ? 'bg-emerald-900/20' : 'bg-emerald-500/10'} blur-[120px] rounded-full`} />
        <div className={`absolute top-[20%] -right-[10%] w-[40%] h-[40%] ${isDark ? 'bg-orange-900/20' : 'bg-orange-500/10'} blur-[120px] rounded-full`} />
        <div className={`absolute -bottom-[10%] left-[20%] w-[60%] h-[40%] ${isDark ? 'bg-blue-900/10' : 'bg-blue-500/10'} blur-[120px] rounded-full`} />
      </div>

      {/* Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? `${isDark ? 'bg-[#020617]/80 border-white/10' : 'bg-white/80 border-slate-200'} backdrop-blur-xl border-b py-4 shadow-lg` 
          : 'bg-transparent py-8'
      }`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6">
          <div className="flex items-center gap-4 lg:gap-8">
            <button 
              onClick={() => navigate('/')}
              className={`group flex items-center gap-3 font-bold ${isDark ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-emerald-600'} transition-all`}
            >
              <div className={`w-10 h-10 rounded-xl ${isDark ? 'bg-white/5 border-white/10' : 'bg-slate-200/50 border-slate-300'} flex items-center justify-center border group-hover:bg-emerald-500/10 group-hover:border-emerald-500/50 transition-all`}>
                <ArrowLeft size={18} />
              </div>
              <span className="hidden sm:inline text-lg">Início</span>
            </button>

            <div className={`h-8 w-px ${isDark ? 'bg-white/10' : 'bg-slate-300'} hidden lg:block`} />

            <div className="flex items-center gap-3 font-black text-2xl tracking-tighter cursor-pointer" onClick={() => navigate('/')}>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <HandHeart className="text-white" size={22} />
              </div>
              <div className="flex flex-col leading-none">
                <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} text-sm font-black uppercase tracking-widest`}>Solidar</span>
                <span className={`${isDark ? 'text-white' : 'text-slate-900'} text-xl`}>Bairro</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDark(!isDark)}
              className={`w-12 h-12 rounded-2xl ${isDark ? 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10' : 'bg-slate-200/50 border-slate-300 text-slate-600 hover:bg-white'} flex items-center justify-center border transition-all shadow-sm`}
              aria-label="Alternar Tema"
            >
              {isDark ? <Sun size={22} /> : <Moon size={22} />}
            </button>

            <button 
              onClick={() => navigate('/achados-e-perdidos/novo')}
              className={`${isDark ? 'bg-white text-black hover:bg-emerald-50 shadow-white/5' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'} px-6 py-3 rounded-2xl font-black flex items-center gap-2 transition-all hover:scale-105 active:scale-95 shadow-xl`}
            >
              <Plus size={20} />
              <span className="hidden sm:inline">Anunciar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero / Search Section */}
      <main className="relative z-10 pt-40 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center mb-20">
            <div className={`inline-flex items-center gap-2 px-6 py-2 ${isDark ? 'bg-orange-500/20 border-orange-500/30' : 'bg-orange-500/10 border-orange-500/20'} border rounded-full mb-8`}>
              <Heart size={16} className={`${isDark ? 'text-orange-400 fill-orange-400' : 'text-orange-600 fill-orange-600'}`} />
              <span className={`${isDark ? 'text-orange-400' : 'text-orange-700'} text-sm font-black uppercase tracking-widest`}>
                Achados & Perdidos
              </span>
            </div>
            <h1 className={`text-5xl sm:text-7xl lg:text-8xl font-black ${isDark ? 'text-white' : 'text-slate-900'} mb-8 tracking-tight leading-[0.9]`}>
              Perdeu algo? <br />
              <span className={`${isDark ? 'text-emerald-500' : 'text-emerald-600'} italic`}>A gente te ajuda.</span>
            </h1>
            <p className={`text-lg sm:text-xl ${isDark ? 'text-slate-400' : 'text-slate-600'} font-medium mb-12 max-w-2xl mx-auto leading-relaxed`}>
              Conectamos pessoas que perderam pertences com vizinhos que os encontraram. Solidariedade e segurança para todas as idades.
            </p>

            {/* Premium Search Bar */}
            <div className="relative max-w-2xl mx-auto mb-16 group">
              <div className={`absolute inset-y-0 left-8 flex items-center pointer-events-none transition-transform group-focus-within:scale-110`}>
                <Search className={`${isDark ? 'text-slate-500 group-focus-within:text-emerald-400' : 'text-slate-400 group-focus-within:text-emerald-600'}`} size={28} />
              </div>
              <input 
                type="text"
                placeholder="O que você está procurando?"
                className={`w-full ${isDark ? 'bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:bg-white/10 focus:border-emerald-500/50' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-emerald-500/50'} border-2 rounded-[32px] py-8 pl-20 pr-10 text-xl font-bold focus:outline-none transition-all ${isDark ? '' : 'shadow-2xl'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Type Toggles */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
              <button 
                onClick={() => setFilterType('all')}
                className={`px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all ${
                  filterType === 'all' 
                  ? `${isDark ? 'bg-white text-black shadow-white/10' : 'bg-emerald-600 text-white shadow-emerald-600/20'} shadow-xl` 
                  : `${isDark ? 'bg-white/5 border-white/5 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50'} text-slate-500 border`
                }`}
              >
                Todos
              </button>
              <button 
                onClick={() => setFilterType('perdido')}
                className={`px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 ${
                  filterType === 'perdido' 
                  ? 'bg-red-500 text-white shadow-xl shadow-red-500/20' 
                  : `${isDark ? 'bg-white/5 border-white/5 hover:bg-red-500/10 hover:text-red-400' : 'bg-white border-slate-200 hover:bg-red-50 hover:text-red-600'} text-slate-500 border`
                }`}
              >
                <AlertCircle size={18} /> Perdidos
              </button>
              <button 
                onClick={() => setFilterType('achado')}
                className={`px-10 py-4 rounded-full font-black uppercase tracking-widest text-xs transition-all flex items-center gap-2 ${
                  filterType === 'achado' 
                  ? 'bg-emerald-600 text-white shadow-xl shadow-emerald-600/20' 
                  : `${isDark ? 'bg-white/5 border-white/5 hover:bg-emerald-500/10 hover:text-emerald-400' : 'bg-white border-slate-200 hover:bg-emerald-50 hover:text-emerald-600'} text-slate-500 border`
                }`}
              >
                <CheckCircle2 size={18} /> Achados
              </button>
            </div>

            {/* Categories */}
            <div className="flex flex-wrap justify-center gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition-all duration-300 ${
                    selectedCategory === cat.id
                    ? 'bg-orange-500 text-white scale-110 shadow-lg shadow-orange-500/30'
                    : `${isDark ? 'bg-white/5 border-white/5 text-slate-500 hover:bg-white/10 hover:text-white' : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-900'} border`
                  }`}
                >
                  <cat.icon size={16} />
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <div 
                  key={item.id}
                  className={`group relative ${isDark ? 'bg-white/5 border-white/10 hover:bg-white/10' : 'bg-white border-slate-200 hover:bg-slate-50 shadow-slate-200/50'} backdrop-blur-xl rounded-[48px] border p-10 transition-all duration-500 hover:-translate-y-3 overflow-hidden ${isDark ? '' : 'shadow-xl'}`}
                >
                  {/* Type Badge */}
                  <div className={`absolute top-0 right-0 px-8 py-3 rounded-bl-[32px] font-black text-[10px] uppercase tracking-[0.2em] ${
                    item.type === 'perdido' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'
                  }`}>
                    {item.type}
                  </div>

                  <div className="mb-8">
                    <div className={`w-16 h-16 rounded-3xl ${isDark ? 'bg-white/5 border-white/10 text-emerald-400' : 'bg-slate-100 border-slate-200 text-emerald-600'} border flex items-center justify-center group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500`}>
                      {React.createElement(CATEGORIES.find(c => c.id === item.category)?.icon || Tag, { size: 32 })}
                    </div>
                  </div>

                  <h3 className={`text-3xl font-black ${isDark ? 'text-white group-hover:text-emerald-400' : 'text-slate-900 group-hover:text-emerald-600'} mb-4 leading-tight transition-colors`}>
                    {item.title}
                  </h3>
                  
                  <p className={`${isDark ? 'text-slate-400' : 'text-slate-600'} font-medium mb-8 line-clamp-2 leading-relaxed`}>
                    {item.description}
                  </p>

                  <div className="space-y-4 mb-10">
                    <div className={`flex items-center gap-4 text-sm font-bold ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      <div className={`w-8 h-8 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-100'} flex items-center justify-center`}>
                        <MapPin size={16} className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                      </div>
                      {item.location}
                    </div>
                    <div className={`flex items-center gap-4 text-sm font-bold ${isDark ? 'text-slate-500' : 'text-slate-500'}`}>
                      <div className={`w-8 h-8 rounded-xl ${isDark ? 'bg-white/5' : 'bg-slate-100'} flex items-center justify-center`}>
                        <Clock size={16} className={`${isDark ? 'text-slate-400' : 'text-slate-500'}`} />
                      </div>
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                    </div>
                    {item.reward && (
                      <div className={`inline-flex items-center gap-3 text-xs font-black ${isDark ? 'text-orange-400' : 'text-orange-600'} bg-orange-500/10 px-4 py-2 rounded-full border border-orange-500/20 uppercase tracking-widest`}>
                        <Heart size={12} fill="currentColor" />
                        Gratidão Oferecida
                      </div>
                    )}
                  </div>

                  <div className={`flex items-center justify-between pt-8 border-t ${isDark ? 'border-white/5' : 'border-slate-100'}`}>
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl ${isDark ? 'bg-gradient-to-br from-slate-700 to-slate-800 border-white/10 text-white' : 'bg-gradient-to-br from-slate-100 to-slate-200 border-slate-200 text-slate-600'} flex items-center justify-center font-black text-sm border`}>
                        {item.author.substring(0, 2)}
                      </div>
                      <span className={`text-sm font-bold ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{item.author}</span>
                    </div>
                    <button className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:gap-3 transition-all group/btn`}>
                      Detalhes 
                      <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className={`col-span-full py-32 text-center ${isDark ? 'bg-white/5 border-white/10' : 'bg-white border-slate-200'} rounded-[60px] border-dashed shadow-sm`}>
                <div className={`w-24 h-24 ${isDark ? 'bg-white/5' : 'bg-slate-50'} rounded-full flex items-center justify-center mx-auto mb-8`}>
                  <Package size={48} className={`${isDark ? 'text-slate-700' : 'text-slate-300'}`} />
                </div>
                <h3 className={`text-3xl font-black ${isDark ? 'text-white' : 'text-slate-900'} mb-4`}>Nenhum item por aqui</h3>
                <p className="text-slate-500 font-medium text-lg">Tente ajustar sua busca ou seja o primeiro a anunciar!</p>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className={`py-20 border-t ${isDark ? 'border-white/5 bg-[#020617]' : 'border-slate-200 bg-white'} relative z-10 px-6`}>
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-3 font-black text-2xl mb-6">
            <HandHeart className={`${isDark ? 'text-emerald-500' : 'text-emerald-600'}`} size={28} />
            <div className="flex flex-col leading-none text-left">
              <span className={`${isDark ? 'text-emerald-400' : 'text-emerald-600'} text-xs uppercase tracking-[0.3em]`}>Solidar</span>
              <span className={`${isDark ? 'text-white' : 'text-slate-900'} tracking-tighter`}>Bairro</span>
            </div>
          </div>
          <p className="text-slate-500 text-sm font-bold tracking-widest uppercase">
            &copy; 2024 - Criando conexões que devolvem o que foi perdido.
          </p>
        </div>
      </footer>

      {/* FAB Mobile */}
      <button 
        className={`fixed bottom-8 right-8 sm:hidden w-20 h-20 ${isDark ? 'bg-white text-black shadow-white/20 border-white/10' : 'bg-emerald-600 text-white shadow-emerald-600/40 border-white/20'} rounded-[32px] flex items-center justify-center shadow-2xl z-50 active:scale-90 transition-all border-4 backdrop-blur-lg`}
        onClick={() => navigate('/achados-e-perdidos/novo')}
      >
        <Plus size={36} />
      </button>
    </div>
  );
}