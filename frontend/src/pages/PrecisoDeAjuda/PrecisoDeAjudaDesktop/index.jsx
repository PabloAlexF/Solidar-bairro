"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AIAssistant } from './AIAssistant';
import { StatsManager } from '../../../utils/statsManager';
import { useAuth } from '../../../contexts/AuthContext';
import { 
  ShoppingCart, 
  Shirt, 
  Receipt, 
  Pill, 
  Plus, 
  Check, 
  MapPin, 
  Users, 
  Building2,
  ChevronLeft,
  ArrowRight,
  Heart,
  Zap,
  Coffee,
  Calendar,
  AlertTriangle,
  RefreshCcw,
  Footprints,
  Briefcase,
  Bath,
  Sofa,
  Tv,
  Car,
  Sparkles,
  Lightbulb,
  Mic,
  MicOff,
  Globe,
  Rocket,
  Clock,
  CheckCircle2,
  Eye,
  Trash2,
  Edit2,
  ListChecks,
  X
} from 'lucide-react';
import './styles.css';

const CATEGORIES = [
  { id: 'Alimentos', label: 'Alimentos', icon: ShoppingCart, color: '#f97316' },
  { id: 'Roupas', label: 'Roupas', icon: Shirt, color: '#3b82f6' },
  { id: 'Calçados', label: 'Calçados', icon: Footprints, color: '#6366f1' },
  { id: 'Medicamentos', label: 'Medicamentos', icon: Pill, color: '#10b981' },
  { id: 'Higiene', label: 'Higiene', icon: Bath, color: '#14b8a6' },
  { id: 'Contas', label: 'Contas', icon: Receipt, color: '#ef4444' },
  { id: 'Emprego', label: 'Emprego', icon: Briefcase, color: '#8b5cf6' },
  { id: 'Móveis', label: 'Móveis', icon: Sofa, color: '#f59e0b' },
  { id: 'Eletrodomésticos', label: 'Eletro', icon: Tv, color: '#475569' },
  { id: 'Transporte', label: 'Transporte', icon: Car, color: '#0ea5e9' },
  { id: 'Outros', label: 'Outros', icon: Plus, color: '#94a3b8' },
];

const URGENCY_OPTIONS = [
  { id: 'critico', label: 'CRÍTICO', desc: 'Risco imediato', icon: AlertTriangle, color: '#ef4444' },
  { id: 'urgente', label: 'URGENTE', desc: 'Próximas 24h', icon: Zap, color: '#f97316' },
  { id: 'moderada', label: 'MODERADA', desc: 'Alguns dias', icon: Calendar, color: '#f59e0b' },
  { id: 'tranquilo', label: 'TRANQUILO', desc: 'Sem pressa', icon: Coffee, color: '#10b981' },
  { id: 'recorrente', label: 'RECORRENTE', desc: 'Mensal', icon: RefreshCcw, color: '#6366f1' },
];

const VISIBILITY_OPTIONS = [
  { id: 'bairro', label: 'Meu Bairro', desc: 'Até 2km', icon: MapPin, color: '#10b981', rgb: '16, 185, 129' },
  { id: 'proximos', label: 'Região Próxima', desc: 'Até 10km', icon: Users, color: '#3b82f6', rgb: '59, 130, 246' },
  { id: 'todos', label: 'Toda a Cidade', desc: 'Visível para todos', icon: Globe, color: '#f97316', rgb: '249, 115, 22' },
  { id: 'ongs', label: 'ONGs Parceiras', desc: 'Instituições', icon: Building2, color: '#6366f1', rgb: '139, 92, 246' },
];

const SUBCATEGORIES = {
  'Alimentos': [
    { id: 'Cesta Básica', label: 'Cesta Básica', desc: 'Monte sua cesta com o que mais precisa', options: ['Arroz', 'Feijão', 'Açúcar', 'Óleo', 'Macarrão', 'Farinha', 'Café', 'Sal', 'Leite em pó', 'Biscoito', 'Molho de Tomate', 'Sardinha'] },
    { id: 'Leite', label: 'Leite', desc: 'Caixa, em pó ou especial', options: ['Integral', 'Desnatado', 'Sem lactose', 'Em pó', 'Infantil'] },
    { id: 'Perecíveis', label: 'Perecíveis', desc: 'Carnes, verduras, legumes, frutas', options: ['Carne Bovina', 'Frango', 'Ovos', 'Legumes', 'Frutas', 'Verduras'] },
    { id: 'Marmita', label: 'Marmita/Refeição', desc: 'Alimento pronto para consumo', options: ['Almoço', 'Jantar', 'Sopa', 'Sanduíche'] },
    { id: 'Formula', label: 'Fórmula Infantil', desc: 'Leite específico para bebês', options: ['NAN', 'Aptamil', 'Nestogeno', '0-6 meses', '6-12 meses'] },
    { id: 'Padaria', label: 'Padaria', desc: 'Pães e massas', options: ['Pão Francês', 'Pão de Forma', 'Bolo', 'Salgados'] },
    { id: 'Suplemento', label: 'Suplementos', desc: 'Nutrição especial', options: ['Ensure', 'Nutren', 'Whey', 'Vitamina'] },
    { id: 'Água', label: 'Água Potável', desc: 'Garrafas ou galões', options: ['Garrafa 1.5L', 'Galão 5L', 'Galão 20L'] }
  ],
  'Roupas': [
    { id: 'Infantil', label: 'Roupas Infantis', desc: 'Para crianças de 0 a 12 anos', options: ['Recém-nascido', '1-3 anos', '4-8 anos', '9-12 anos', 'Menino', 'Menina', 'Calçados', 'Agasalhos'] },
    { id: 'Adulto', label: 'Roupas Adulto', desc: 'Masculino e Feminino', options: ['P', 'M', 'G', 'GG', 'Plus Size', 'Masculino', 'Feminino', 'Calça', 'Camisa', 'Vestido'] },
    { id: 'Inverno', label: 'Roupas de Frio', desc: 'Casacos, blusas, toucas', options: ['Casacos pesados', 'Moletom', 'Cobertores', 'Toucas/Luvas', 'Meias'] },
    { id: 'Acessorios', label: 'Acessórios', desc: 'Cintos, bolsas, bonés', options: ['Cinto', 'Boné', 'Bolsa', 'Mochila'] },
    { id: 'CamaBanho', label: 'Cama e Banho', desc: 'Lençóis, toalhas, cobertores', options: ['Lençol Solteiro', 'Lençol Casal', 'Toalha de Banho', 'Cobertor', 'Travesseiro'] },
    { id: 'Enxoval', label: 'Enxoval Bebê', desc: 'Itens para recém-nascido', options: ['Banheira', 'Saída Maternidade', 'Cueiro', 'Mantas'] }
  ],
  'Medicamentos': [
    { id: 'Analgesicos', label: 'Analgésicos', desc: 'Dor e febre', options: ['Dipirona', 'Paracetamol', 'Ibuprofeno', 'Aspirina'] },
    { id: 'Uso Continuo', label: 'Uso Contínuo', desc: 'Hipertensão, Diabetes...', options: ['Losartana', 'Enalapril', 'Metformina', 'Glibenclamida', 'Insulina'] },
    { id: 'Primeiros Socorros', label: 'Primeiros Socorros', desc: 'Curativos, antissépticos', options: ['Alcool 70%', 'Gaze', 'Esparadrapo', 'Band-aid', 'Antisséptico', 'Algodão'] },
    { id: 'Vitaminas', label: 'Vitaminas', desc: 'Suplementação vitamínica', options: ['Vitamina C', 'Vitamina D', 'Complexo B', 'Ferro'] }
  ],
  'Higiene': [
    { id: 'Pessoal', label: 'Higiene Pessoal', desc: 'Sabonete, shampoo, pasta...', options: ['Sabonete', 'Shampoo', 'Condicionador', 'Pasta de Dente', 'Escova de Dente', 'Desodorante', 'Absorvente', 'Papel Higiênico'] },
    { id: 'Limpeza', label: 'Limpeza da Casa', desc: 'Detergente, sabão, água sanitária', options: ['Detergente', 'Sabão em Pó', 'Água Sanitária', 'Desinfetante', 'Esponja'] },
    { id: 'Bebe', label: 'Higiene do Bebê', desc: 'Fraldas, lenços', options: ['Fraldas P', 'Fraldas M', 'Fraldas G', 'Fraldas XG', 'Lenço Umedecido', 'Pomada'] },
    { id: 'Geriatrica', label: 'Higiene Geriátrica', desc: 'Fraldas e cuidados para idosos', options: ['Fralda Geriátrica M', 'Fralda Geriátrica G', 'Fralda Geriátrica XG', 'Lenço Umedecido'] }
  ],
  'Móveis': [
    { id: 'Cama', label: 'Cama/Colchão', desc: 'Solteiro, Casal, Beliche', options: ['Solteiro', 'Casal', 'Apenas Colchão', 'Cama Box', 'Beliche'] },
    { id: 'Mesa', label: 'Mesa e Cadeiras', desc: 'Para refeições', options: ['4 lugares', '6 lugares', 'Apenas cadeiras', 'Mesa pequena'] },
    { id: 'Sofa', label: 'Sofá', desc: 'Para sala de estar', options: ['2 lugares', '3 lugares', 'Retrátil', 'Poltrona'] },
    { id: 'Armario', label: 'Armário', desc: 'Quarto ou cozinha', options: ['Cozinha', 'Guarda-roupa Solteiro', 'Guarda-roupa Casal', 'Cômoda'] }
  ],
  'Eletrodomésticos': [
    { id: 'Geladeira', label: 'Geladeira', desc: 'Refrigerador', options: ['110v', '220v', 'Duplex', 'Simples'] },
    { id: 'Fogao', label: 'Fogão', desc: 'Gás ou elétrico', options: ['4 bocas', '6 bocas', 'Cooktop', 'Com forno'] },
    { id: 'Maquina Lavar', label: 'Máquina de Lavar', desc: 'Roupas', options: ['110v', '220v', 'Tanquinho', 'Automática'] }
  ],
  'Calçados': [
    { id: 'Tenis', label: 'Tênis', desc: 'Esportivo ou casual', options: ['Masculino', 'Feminino', 'Infantil', '34-38', '39-44'] },
    { id: 'Social', label: 'Sapato Social', desc: 'Para trabalho ou eventos', options: ['Preto', 'Marrom', 'Salto', 'Sapatilha'] },
    { id: 'Chinelo', label: 'Chinelo/Sandália', desc: 'Uso diário', options: ['Havaianas', 'Sandália', 'Pantufa'] },
    { id: 'Bota', label: 'Botas', desc: 'Para chuva ou frio', options: ['Galocha', 'Coturno', 'Cano Curto'] }
  ],
  'Contas': [
    { id: 'Luz', label: 'Conta de Luz', desc: 'Pagamento de energia', options: ['Atrasada', 'Vencendo', 'Aviso de Corte'] },
    { id: 'Agua', label: 'Conta de Água', desc: 'Abastecimento', options: ['Atrasada', 'Vencendo', 'Aviso de Corte'] },
    { id: 'Aluguel', label: 'Aluguel', desc: 'Moradia', options: ['Atrasado', 'Parcial', 'Despejo'] },
    { id: 'Gas', label: 'Gás de Cozinha', desc: 'Botijão ou encanado', options: ['Botijão 13kg', 'Conta Gás'] }
  ],
  'Emprego': [
    { id: 'Curriculo', label: 'Currículo', desc: 'Ajuda para montar ou imprimir', options: ['Revisão', 'Impressão', 'Formatação'] },
    { id: 'Indicacao', label: 'Indicação', desc: 'Oportunidades de trabalho', options: ['CLT', 'Freelance', 'Diária'] },
    { id: 'Entrevista', label: 'Roupa para Entrevista', desc: 'Traje adequado', options: ['Social', 'Esporte Fino', 'Sapato'] }
  ],
  'Transporte': [
    { id: 'Passagem', label: 'Passagem', desc: 'Transporte público', options: ['Ônibus', 'Metrô', 'Trem', 'Cartão Transporte'] },
    { id: 'Combustivel', label: 'Combustível', desc: 'Ajuda para abastecer', options: ['Gasolina', 'Etanol'] },
    { id: 'Bicicleta', label: 'Bicicleta', desc: 'Meio de transporte', options: ['Manutenção', 'Doação'] }
  ],
  'Outros': [
    { id: 'Brinquedos', label: 'Brinquedos', desc: 'Para crianças', options: ['Boneca', 'Carrinho', 'Jogos', 'Educativos'] },
    { id: 'Livros', label: 'Livros/Material', desc: 'Educação e cultura', options: ['Didáticos', 'Literatura', 'Cadernos'] },
    { id: 'Ferramentas', label: 'Ferramentas', desc: 'Para trabalho', options: ['Construção', 'Jardinagem', 'Mecânica'] },
    { id: 'Pet', label: 'Para Pet', desc: 'Ração e cuidados', options: ['Ração Cão', 'Ração Gato', 'Areia', 'Remédio'] }
  ]
};

const STEP_LABELS = ['Categoria', 'Itens', 'Descrição', 'Urgência', 'Visibilidade', 'Confirmação'];
const TOTAL_STEPS = 6;

function AnimatedBackground() {
  return (
    <div className="animated-background">
      <div className="geometric-shapes">
        {[...Array(6)].map((_, i) => (
          <div 
            key={i} 
            className={`shape shape-${(i % 6) + 1}`}
            style={{
              '--delay': `${i * 2}s`,
              '--duration': `${15 + i * 3}s`
            }}
          />
        ))}
      </div>
      
      <div className="gradient-orbs">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className={`orb orb-${(i % 4) + 1}`}
            style={{
              '--delay': `${i * 3}s`,
              '--size': `${100 + i * 30}px`
            }}
          />
        ))}
      </div>
    </div>
  );
}

const ValidationModal = ({ isOpen, onClose, validationResult, onRetry, onForcePublish }) => {
  if (!isOpen || !validationResult) return null;

  const { canPublish, analysis, confidence, riskScore, suggestions } = validationResult;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 backdrop-blur-lg p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white/95 backdrop-blur-sm rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-white/20"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full translate-y-12 -translate-x-12" />
        </div>
        
        {/* Header */}
        <div className="text-center mb-8 relative z-10">
          <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center ${
            canPublish 
              ? 'bg-green-50 border-2 border-green-200' 
              : 'bg-orange-50 border-2 border-orange-200'
          }`}>
            {canPublish ? <CheckCircle2 size={32} className="text-green-600" /> : <AlertTriangle size={32} className="text-orange-600" />}
          </div>
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-black text-slate-900 mb-2"
          >
            {canPublish ? 'Pedido Aprovado!' : 'Pedido Requer Revisão'}
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-slate-500 text-sm"
          >
            {canPublish ? 'Tudo certo para publicação' : 'Algumas melhorias são necessárias'}
          </motion.p>
        </div>
        
        {/* Analysis */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8 relative z-10"
        >
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <p className="text-slate-700 leading-relaxed mb-4 text-sm">{analysis}</p>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <span className="text-xs font-bold text-slate-600">Confiança: {confidence}%</span>
              </div>
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  riskScore > 70 ? 'bg-red-500' : riskScore > 40 ? 'bg-orange-500' : 'bg-green-500'
                }`} />
                <span className="text-xs font-bold text-slate-600">Risco: {riskScore}%</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Suggestions */}
        {suggestions && suggestions.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8 relative z-10"
          >
            <div className="bg-red-50 rounded-2xl p-6 border border-red-100">
              <div className="flex items-center gap-2 mb-4">
                <AlertTriangle size={18} className="text-red-600" />
                <h3 className="font-black text-slate-900 text-sm">Problemas Identificados</h3>
              </div>
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + (index * 0.1) }}
                    className="bg-white rounded-xl p-4 border border-red-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-red-100 text-red-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <AlertTriangle size={12} strokeWidth={3} />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-slate-800 font-medium mb-2">{suggestion.message}</p>
                        {suggestion.evidence && (
                          <p className="text-xs text-slate-600 bg-slate-50 rounded-lg p-2 border">
                            <strong>Evidência:</strong> {suggestion.evidence}
                          </p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="flex gap-3 relative z-10"
        >
          {!canPublish && (
            <>
              <button 
                onClick={onRetry}
                className="flex-1 py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-2xl font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <RefreshCcw size={16} /> Revisar Pedido
              </button>
              <button 
                onClick={onForcePublish}
                className="flex-1 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
              >
                <Rocket size={16} /> Publicar Mesmo Assim
              </button>
            </>
          )}
          {canPublish && (
            <motion.button 
              onClick={onClose}
              className="w-full py-3 px-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-semibold text-sm transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <CheckCircle2 size={16} /> Continuar
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

const AnalyzingModal = ({ stages, analysisStage }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-md">
    <motion.div 
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-[32px] p-12 max-w-md w-full mx-4 shadow-2xl text-center"
    >
      <div className="w-20 h-20 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-8 animate-spin-slow">
        <RefreshCcw size={40} />
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-2">Assistente IA Analisando</h3>
      <p className="text-slate-500 mb-8">{stages[analysisStage]}</p>
      <div className="space-y-3 text-left">
        {stages.map((stage, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${i <= analysisStage ? 'bg-green-500 text-white' : 'bg-slate-100 text-slate-400'}`}>
              {i < analysisStage ? <Check size={12} /> : i + 1}
            </div>
            <span className={`text-sm font-bold ${i === analysisStage ? 'text-slate-900' : 'text-slate-400'}`}>{stage}</span>
          </div>
        ))}
      </div>
    </motion.div>
  </div>
);

const SuccessModal = ({ urgencyColor, urgencyLabel, urgencyIcon: UrgencyIcon, reason, onClose }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-md">
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      className="bg-white rounded-[32px] p-12 max-w-lg w-full mx-4 shadow-2xl text-center"
    >
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
        <Check size={48} strokeWidth={3} />
      </div>
      <h2 className="text-4xl font-black text-slate-900 mb-4">Sucesso!</h2>
      <p className="text-xl text-slate-500 mb-8">{reason}</p>
      <div className="flex items-center justify-center gap-3 mb-12 p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <div style={{ color: urgencyColor }} className="flex items-center gap-2 font-black uppercase tracking-widest text-sm">
          {UrgencyIcon && <UrgencyIcon size={20} />}
          {urgencyLabel}
        </div>
      </div>
      <button 
        onClick={onClose}
        className="w-full py-5 bg-slate-900 text-white rounded-full font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
      >
        Voltar para o Início
      </button>
    </motion.div>
  </div>
);

const ItemSpecificationModal = ({ item, onClose, onSave, categoryColor }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [details, setDetails] = useState('');

  const toggleOption = (option) => {
    if (selectedOptions.includes(option)) {
      setSelectedOptions(selectedOptions.filter(o => o !== option));
    } else {
      setSelectedOptions([...selectedOptions, option]);
    }
  };

  const handleSave = () => {
    onSave({
      ...item,
      selectedOptions,
      details
    });
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 400,
          duration: 0.3
        }}
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-lg border border-slate-100/50 relative"
      >
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-transparent rounded-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-1">
                {item.label}
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Selecione os itens que você precisa
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors ml-4"
            >
              <X size={20} />
            </button>
          </div>

          {/* Options Grid */}
          <div className="mb-6">
            <div className="grid grid-cols-2 gap-3">
              {item.options?.map((opt, index) => {
                const isSelected = selectedOptions.includes(opt);
                return (
                  <motion.button
                    key={opt}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => toggleOption(opt)}
                    className={`group relative p-4 rounded-2xl text-sm font-medium transition-all duration-200 text-left focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                      isSelected
                        ? 'bg-white text-slate-900 shadow-sm'
                        : 'bg-slate-50 text-slate-700 hover:bg-white'
                    }`}
                    style={isSelected ? {
                      '--tw-ring-color': categoryColor
                    } : {}}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`truncate font-medium ${isSelected ? 'text-slate-900' : 'text-slate-700 group-hover:text-slate-900'}`}>
                        {opt}
                      </span>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ml-3"
                          style={{ backgroundColor: categoryColor }}
                        >
                          <Check size={10} className="text-white" />
                        </motion.div>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Details Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 mb-3">
              Observações adicionais
            </label>
            <textarea
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:ring-2 focus:border-transparent transition-all resize-none min-h-[80px] text-sm"
              style={{ '--tw-ring-color': categoryColor }}
              placeholder="Ex: Quantidade específica, preferências..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 text-slate-600 font-medium bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-3 px-4 text-white font-medium rounded-2xl transition-all hover:shadow-lg"
              style={{
                backgroundColor: categoryColor,
                boxShadow: `0 4px 12px ${categoryColor}25`
              }}
            >
              Confirmar
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default function PDAForm() {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isImproving, setIsImproving] = useState(false);
  
  // AI Assistant states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationResult, setValidationResult] = useState(null);
  const [showSuccessNotification, setShowSuccessNotification] = useState(false);
  const [showItemModal, setShowItemModal] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  
  const [isPublished, setIsPublished] = useState(false);
    
  const stages = ['Analisando categoria', 'Verificando urgência', 'Avaliando descrição', 'Gerando sugestões'];

  const [formData, setFormData] = useState({
    category: '',
    items: [],
    description: '',
    urgency: '',
    visibility: ['bairro'],
    radius: 2,
    userLocation: null,
    locationString: 'Detectando localização...',
    city: '',
    state: '',
    neighborhood: ''
  });

  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [formRef, formInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const nextStep = useCallback(() => {
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCategorySelect = (id) => {
    if (formData.category === id) {
      nextStep();
      return;
    }
    updateData({ category: id });
  };
  
  const prevStep = useCallback(() => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const updateData = useCallback((data) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const handlePublish = useCallback(async () => {
    setIsSubmitting(true);
    setIsAnalyzing(true);
    setAnalysisStage(0);
    
    try {
      // AI Analysis with progress
      for (let i = 0; i < stages.length; i++) {
        setAnalysisStage(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Get AI validation result
      const result = await AIAssistant.validateRequest(formData);
      
      setIsAnalyzing(false);
      
      // Check if validation passed
      if (!result.canPublish) {
        // Show validation modal with issues
        setValidationResult(result);
        setShowValidationModal(true);
        return;
      }
      
      // If validation passed, create the pedido in the backend
      const { default: ApiService } = await import('../../../services/apiService');
      
      const pedidoData = {
        category: formData.category,
        subCategory: formData.items.map(i => i.label),
        subQuestionAnswers: formData.items.reduce((acc, item) => ({
          ...acc,
          [item.label]: `${item.selectedOptions.join(', ')}${item.details ? `. Detalhes: ${item.details}` : ''}`
        }), {}),
        description: formData.description,
        urgency: formData.urgency,
        visibility: formData.visibility,
        radius: formData.radius,
        location: formData.userLocation,
        locationString: formData.locationString,
        city: formData.city,
        state: formData.state,
        neighborhood: formData.neighborhood,
        status: 'ativo'
      };
      
      console.log('📤 Enviando pedido para API:', pedidoData);
      const response = await ApiService.createPedido(pedidoData);
      console.log('✅ Pedido criado com sucesso:', response);
      
      // Registrar estatísticas
      if (user?.uid || user?.id) {
        StatsManager.registerPedidoCriado(user.uid || user.id, pedidoData);
      }
      
      // Show success
      setIsPublished(true);
      
    } catch (error) {
      console.error('❌ Erro ao publicar pedido:', error);
      setIsAnalyzing(false);
      // Show error in validation modal
      setValidationResult({
        canPublish: false,
        analysis: `Erro ao salvar pedido: ${error.message}`,
        confidence: 0,
        riskScore: 100,
        suggestions: [{
          type: 'error',
          message: error.message.includes('token') ? 'Você precisa estar logado para publicar um pedido' : 'Erro de conexão com o servidor',
          action: 'Tentar novamente',
          priority: 'high'
        }],
        validations: {}
      });
      setShowValidationModal(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, stages.length]);

  const handleRetryValidation = () => {
    // Store the validation result before clearing it
    const currentValidationResult = validationResult;
    
    setShowValidationModal(false);
    setValidationResult(null);
    
    // Navigate to the step with the main problem based on suggestion type
    if (currentValidationResult?.suggestions?.length > 0) {
      const mainProblem = currentValidationResult.suggestions[0];
      
      // Navigate based on suggestion type
      if (mainProblem.type === 'description' || mainProblem.action === 'Melhorar descrição' || mainProblem.action === 'Expandir descrição') {
        setStep(2); // Description step
      } else if (mainProblem.type === 'category' || mainProblem.action === 'Alterar categoria') {
        setStep(1); // Category step
      } else if (mainProblem.type === 'urgency' || mainProblem.action === 'Revisar urgência') {
        setStep(3); // Urgency step
      } else {
        // Fallback to description for general issues
        setStep(2);
      }
    }
  };

  const handleForcePublish = async () => {
    setShowValidationModal(false);
    setValidationResult(null);
    
    try {
      // Force publish even with validation issues
      const { default: ApiService } = await import('../../../services/apiService');
      
      const pedidoData = {
        category: formData.category,
        subCategory: formData.items.map(i => i.label),
        description: formData.description,
        urgency: formData.urgency,
        visibility: formData.visibility,
        radius: formData.radius,
        location: formData.userLocation,
        locationString: formData.locationString,
        city: formData.city,
        state: formData.state,
        neighborhood: formData.neighborhood,
        status: 'ativo'
      };
      
      console.log('📤 Forçando publicação do pedido:', pedidoData);
      const response = await ApiService.createPedido(pedidoData);
      console.log('✅ Pedido forçado criado com sucesso:', response);
      
      // Registrar estatísticas
      if (user?.uid || user?.id) {
        StatsManager.registerPedidoCriado(user.uid || user.id, pedidoData);
      }
      
      setIsPublished(true);
    } catch (error) {
      console.error('❌ Erro ao forçar publicação:', error);
      alert(`Erro ao publicar pedido: ${error.message}`);
    }
  };

  const selectedCategory = useMemo(() => 
    CATEGORIES.find(c => c.id === formData.category), 
    [formData.category]
  );

  const selectedUrgency = useMemo(() => 
    URGENCY_OPTIONS.find(o => o.id === formData.urgency),
    [formData.urgency]
  );

  const descriptionQuality = useMemo(() => {
    const len = formData.description.length;
    if (len === 0) return { label: "Esperando sua história", color: "text-slate-400", bg: "bg-slate-100", width: "w-0" };
    if (len < 30) return { label: "Muito curto", color: "text-rose-500", bg: "bg-rose-50", width: "w-[20%]" };
    if (len < 100) return { label: "Ficando melhor!", color: "text-amber-500", bg: "bg-amber-50", width: "w-[50%]" };
    if (len < 300) return { label: "História envolvente", color: "text-emerald-500", bg: "bg-emerald-50", width: "w-[80%]" };
    return { label: "História completa!", color: "text-blue-600", bg: "bg-blue-50", width: "w-full" };
  }, [formData.description]);

  const dynamicTips = useMemo(() => {
    const tips = ["Seja específico sobre sua situação"];
    
    if (formData.category === 'Alimentos') tips.push("Mencione se há crianças ou idosos");
    else if (formData.category === 'Medicamentos') tips.push("Informe a dosagem e se tem receita");
    else if (formData.category === 'Contas') tips.push("Explique o prazo crítico de pagamento");
    else if (formData.category === 'Emprego') tips.push("Destaque sua experiência principal");
    
    tips.push("Informe quantas pessoas serão ajudadas");
    tips.push("Explique como a ajuda fará diferença");
    
    return tips;
  }, [formData.category]);

  useEffect(() => {
    // Geolocation
    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1&zoom=18`
            );
            const data = await response.json();
            
            if (data?.address) {
              const address = data.address;
              const bairro = address.suburb || address.neighbourhood || address.village || "";
              const cidade = address.city || address.town || "";
              const estado = address.state || "";
              
              updateData({ 
                userLocation: coords,
                locationString: `${bairro}${bairro ? ", " : ""}${cidade} - ${estado}`,
                city: cidade,
                state: estado,
                neighborhood: bairro
              });
            }
          } catch (err) {
            updateData({ userLocation: coords, locationString: "Localização detectada" });
          }
        },
        () => {
          updateData({ locationString: "São Paulo, SP - Centro" });
        }
      );
    } else {
      updateData({ locationString: "São Paulo, SP - Centro" });
    }

    // Speech Recognition
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        const recognitionInstance = new SpeechRecognitionAPI();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'pt-BR';

        recognitionInstance.onresult = (event) => {
          const transcript = event.results[0][0].transcript.trim();
          if (transcript) {
            setFormData(prev => ({ 
              ...prev, 
              description: prev.description ? `${prev.description} ${transcript}` : transcript
            }));
          }
        };

        recognitionInstance.onend = () => setIsRecording(false);
        recognitionInstance.onerror = () => setIsRecording(false);

        setRecognition(recognitionInstance);
      }
    }
  }, [updateData]);

  const toggleRecording = () => {
    if (!recognition) return;
    if (isRecording) {
      recognition.stop();
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const improveWithAI = async () => {
    if (formData.description.length < 20 || isImproving) return;
    
    setIsImproving(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const prefixes = [
      "Olá, gostaria de relatar que ",
      "Escrevo este pedido pois ",
      "Gostaria de contar com a ajuda de vocês porque "
    ];
    const suffixes = [
      " Este apoio seria fundamental para nossa família.",
      " Agradeço imensamente quem puder colaborar.",
      " Que Deus abençoe quem puder ajudar."
    ];
    
    const prefix = prefixes[Math.floor(Math.random() * prefixes.length)];
    const suffix = suffixes[Math.floor(Math.random() * suffixes.length)];
    
    let text = formData.description.trim();
    if (!text.endsWith('.') && !text.endsWith('!') && !text.endsWith('?')) text += '.';
    
    updateData({ description: `${prefix}${text}${suffix}`.slice(0, 500) });
    setIsImproving(false);
  };

  const isStepValid = useMemo(() => {
    switch (step) {
      case 1: return formData.category !== '';
      case 2: return true; // Items are optional but recommended
      case 3: return formData.description.length >= 10;
      case 4: return formData.urgency !== '';
      case 5: return formData.visibility.length > 0;
      default: return true;
    }
  }, [step, formData]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div className="form-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="step-content">
              <div className="step-header">
                <h2>Qual tipo de ajuda você precisa?</h2>
                <p>Escolha a categoria que melhor descreve sua necessidade.</p>
              </div>
              <div className="categories-grid">
                {CATEGORIES.map((cat, index) => (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleCategorySelect(cat.id)}
                    className={`category-card ${formData.category === cat.id ? 'active' : ''}`}
                    style={{ '--cat-color': cat.color }}
                  >
                    <div className="relative">
                      <cat.icon size={48} color={cat.color} strokeWidth={1.5} />
                    </div>
                    <span className="category-label">{cat.label}</span>
                    {formData.category === cat.id && (
                      <>
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-5 right-5 bg-green-500 text-white rounded-full p-2 shadow-lg z-10"
                        >
                          <Check size={20} strokeWidth={4} />
                        </motion.div>
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute bottom-6 left-1/2 -translate-x-1/2 py-3 px-6 bg-blue-600 text-white text-xs font-black uppercase tracking-wider rounded-full flex items-center gap-2 whitespace-nowrap shadow-xl"
                        >
                          Confirmar Categoria <ArrowRight size={14} />
                        </motion.div>
                      </>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 2:
        const currentSubcategories = SUBCATEGORIES[formData.category] || [];
        const catColor = CATEGORIES.find(c => c.id === formData.category)?.color || '#64748b';
        
        return (
          <motion.div className="form-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="step-content">
              <div className="step-header">
                <h2>O que você precisa exatamente?</h2>
                <p>Selecione os itens e especifique os detalhes (Ficha Técnica).</p>
              </div>

              {currentSubcategories.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  {currentSubcategories.map((sub) => {
                    const isSelected = formData.items.some(i => i.id === sub.id);
                    return (
                      <motion.button
                        key={sub.id}
                        whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(0,0,0,0.08)' }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          setCurrentItem(sub);
                          setShowItemModal(true);
                        }}
                        className={`p-5 rounded-[24px] text-left transition-all duration-300 relative overflow-hidden group ${
                          isSelected
                            ? 'bg-gradient-to-br from-white to-slate-50/30'
                            : 'bg-white'
                        }`}
                        style={isSelected ? {
                          boxShadow: `0 20px 40px -12px ${catColor}25, 0 8px 16px -8px rgba(0,0,0,0.04)`
                        } : {}}
                      >
                        <div className={`absolute top-0 right-0 p-4 opacity-0 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'group-hover:opacity-100'}`}>
                           <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: isSelected ? catColor : '#f1f5f9' }}>
                             {isSelected ? <CheckCircle2 size={18} className="text-white" /> : <Plus size={18} className="text-slate-400" />}
                           </div>
                        </div>

                        <div className="flex justify-between items-start mb-2">
                          <span className={`block text-lg font-black mb-1 ${isSelected ? '' : 'text-slate-700'}`} style={isSelected ? { color: catColor } : {}}>{sub.label}</span>
                        </div>
                        <p className="text-sm font-medium text-slate-400 leading-relaxed pr-8">{sub.desc}</p>
                        <div className="mt-4 min-h-[28px] flex items-center">
                          {isSelected && (
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-50"
                            >
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: catColor }} />
                              <span className="text-xs font-bold text-slate-600">
                                {formData.items.find(i => i.id === sub.id).selectedOptions.length} opções
                              </span>
                            </motion.div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200 mb-8">
                  <p className="text-slate-500">Não há itens específicos pré-definidos para esta categoria. Por favor, descreva detalhadamente na próxima etapa.</p>
                </div>
              )}

              {formData.items.length > 0 && (
                <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <ListChecks size={20} /> Itens Selecionados
                  </h3>
                  <div className="space-y-3">
                    {formData.items.map((item, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-start">
                        <div>
                          <strong className="text-slate-900 block">{item.label}</strong>
                          <p className="text-sm text-slate-600 mt-1">{item.selectedOptions.join(', ')}</p>
                          {item.details && <p className="text-xs text-slate-500 mt-1 italic">"{item.details}"</p>}
                        </div>
                        <button 
                          onClick={() => updateData({ items: formData.items.filter(i => i.id !== item.id) })}
                          className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div className="form-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="step-content">
              <div className="step-header">
                <h2>Conte sua história</h2>
                <p>Sua descrição ajuda as pessoas a entenderem como podem ser úteis.</p>
              </div>
              <div className="description-container">
                <div className="pda-textarea-wrapper">
                  <div className="flex justify-between items-center mb-6">
                    <div className="textarea-header !m-0">
                      <Heart size={22} className="text-rose-500" />
                      <span>Sua história importa</span>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${descriptionQuality.bg} ${descriptionQuality.color}`}>
                      <div className={`w-2 h-2 rounded-full ${descriptionQuality.width === 'w-0' ? 'bg-slate-300' : 'bg-current'} animate-pulse`} />
                      {descriptionQuality.label}
                    </div>
                  </div>
                  
                  <div className="relative group">
                    <textarea
                      placeholder="Exemplo: Sou mãe solteira de 3 filhos e estou desempregada há 2 meses. Preciso de cestas básicas para alimentar minha família. Meus filhos têm 5, 8 e 12 anos e estamos passando por dificuldades. Qualquer ajuda será muito bem-vinda e Deus abençoará quem puder nos ajudar neste momento difícil."
                      value={formData.description}
                      onChange={(e) => updateData({ description: e.target.value.slice(0, 500) })}
                      className="description-textarea !min-h-[280px]"
                    />
                  </div>
                  
                  <div className="mt-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-500">
                        {formData.description.length}/500
                      </span>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <div 
                            key={i}
                            className={`w-1 h-1 rounded-full transition-all ${
                              i < Math.ceil((formData.description.length / 500) * 5) 
                                ? 'bg-blue-500' 
                                : 'bg-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="h-1 bg-slate-100 rounded-full overflow-hidden flex-1 mx-4">
                      <div 
                        className={`h-full transition-all duration-700 ease-out rounded-full ${
                          formData.description.length === 0 ? 'bg-slate-300' :
                          formData.description.length < 30 ? 'bg-rose-400' :
                          formData.description.length < 100 ? 'bg-amber-400' :
                          formData.description.length < 300 ? 'bg-emerald-400' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min((formData.description.length / 500) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="tips-card">
                  <div className="tips-header">
                    <Lightbulb size={24} className="text-amber-500" />
                    <span className="text-lg">Dicas para uma boa descrição</span>
                  </div>
                  <ul className="space-y-0">
                    {dynamicTips.map((tip, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                        className="flex items-start gap-3 text-sm text-slate-600 leading-relaxed"
                      >
                        <div className="w-5 h-5 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check size={12} strokeWidth={3} />
                        </div>
                        {tip}
                      </motion.li>
                    ))}
                  </ul>
                  
                  {/* Quality indicator */}
                  <div className="mt-6 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Qualidade da História</span>
                      <span className={`text-xs font-bold ${descriptionQuality.color}`}>
                        {Math.round((formData.description.length / 500) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div 
                        className={`h-full transition-all duration-700 ease-out ${
                          formData.description.length === 0 ? 'bg-slate-300' :
                          formData.description.length < 30 ? 'bg-rose-400' :
                          formData.description.length < 100 ? 'bg-amber-400' :
                          formData.description.length < 300 ? 'bg-emerald-400' : 'bg-blue-500'
                        }`}
                        style={{ width: `${Math.min((formData.description.length / 500) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center items-center gap-3 mt-6">
                <motion.button
                  onClick={toggleRecording}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    isRecording 
                      ? 'bg-red-500 text-white' 
                      : 'bg-white text-slate-600 hover:bg-slate-50 shadow-sm border border-slate-200'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isRecording ? <MicOff size={16} /> : <Mic size={16} />}
                  {isRecording ? 'Parar Gravação' : 'Gravar Voz'}
                </motion.button>
                
                <motion.button
                  onClick={improveWithAI}
                  disabled={formData.description.length < 20 || isImproving}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    formData.description.length >= 20 && !isImproving
                      ? 'bg-white text-slate-600 hover:bg-slate-50 shadow-sm border border-slate-200' 
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200'
                  }`}
                  whileHover={formData.description.length >= 20 && !isImproving ? { scale: 1.05 } : {}}
                  whileTap={formData.description.length >= 20 && !isImproving ? { scale: 0.95 } : {}}
                >
                  {isImproving ? (
                    <RefreshCcw size={16} className="animate-spin" />
                  ) : (
                    <Sparkles size={16} />
                  )}
                  {isImproving ? 'Melhorando...' : 'Melhorar com IA'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div className="form-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="step-content">
              <div className="step-header">
                <h2>Qual a urgência?</h2>
                <p>Isso ajuda a priorizar casos críticos.</p>
              </div>
              <div className="urgency-grid">
                {URGENCY_OPTIONS.map((opt, index) => (
                  <motion.button
                    key={opt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => updateData({ urgency: opt.id })}
                    className={`urgency-card ${formData.urgency === opt.id ? 'active' : ''}`}
                    style={{ '--urg-color': opt.color }}
                  >
                    <opt.icon size={40} color={opt.color} strokeWidth={2} />
                    <div className="urgency-content text-left">
                      <strong>{opt.label}</strong>
                      <p className="text-sm opacity-70">{opt.desc}</p>
                    </div>
                    {formData.urgency === opt.id && <Check size={24} className="ml-auto text-green-500" />}
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div className="form-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="step-content">
              <div className="step-header">
                <h2>Quem deve ver seu pedido?</h2>
                <p>Defina o alcance para notificar pessoas próximas.</p>
              </div>
              <div className="visibility-container">
                <div className="visibility-options">
                  {VISIBILITY_OPTIONS.map((opt, index) => {
                    const isActive = formData.visibility.includes(opt.id);
                    return (
                      <motion.button
                        key={opt.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => {
                          const newRadius = opt.id === 'bairro' ? 2 : opt.id === 'proximos' ? 10 : opt.id === 'todos' ? 50 : 5;
                          updateData({ 
                            visibility: formData.visibility.includes(opt.id) 
                              ? formData.visibility.filter(i => i !== opt.id)
                              : [...formData.visibility, opt.id],
                            radius: newRadius
                          });
                        }}
                        className={`visibility-card ${isActive ? 'active' : ''}`}
                        style={{ '--vis-color': opt.color, '--vis-rgb': opt.rgb }}
                      >
                        <div className="visibility-icon"><opt.icon size={24} /></div>
                        <div className="visibility-content text-left">
                          <strong>{opt.label}</strong>
                          <p>{opt.desc}</p>
                        </div>
                        {isActive && <Check size={24} className="ml-auto text-green-500" />}
                      </motion.button>
                    );
                  })}
                </div>
                <div className="map-section">
                  <div className="map-placeholder">
                    <div className="map-indicator">
                      <MapPin size={48} className="text-blue-500 animate-bounce" />
                      <span className="font-black text-slate-800">{formData.locationString}</span>
                      <p className="text-sm opacity-70 font-normal">Sua localização para encontrar ajuda próxima.</p>
                    </div>
                  </div>
                  <div className="p-6 bg-blue-50/50 rounded-b-[24px]">
                    <p className="text-sm font-black text-blue-700 flex items-center gap-2">
                      <Globe size={16} /> Alcance selecionado: {formData.radius}km
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div className="form-step" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="step-content">
              <div className="step-header">
                <h2>Confirmar pedido</h2>
                <p>Revise os detalhes antes de publicar.</p>
              </div>
              <div className="confirmation-card">
                <div className="flex justify-between items-start mb-12 gap-4 flex-wrap">
                  <div className="category-badge flex items-center gap-3" style={{ background: `${selectedCategory?.color}15`, color: selectedCategory?.color }}>
                    {selectedCategory && <selectedCategory.icon size={20} />}
                    <span className="text-sm font-black uppercase tracking-wider">{formData.category}</span>
                  </div>
                  <div className="flex items-center gap-3 px-6 py-3 rounded-full border-2" style={{ borderColor: selectedUrgency?.color, color: selectedUrgency?.color }}>
                    {selectedUrgency && <selectedUrgency.icon size={20} />}
                    <span className="font-black text-sm uppercase tracking-tighter">{selectedUrgency?.label}</span>
                  </div>
                </div>
                
                {formData.items.length > 0 && (
                  <div className="mb-8 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                    <h4 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-4">Itens Solicitados</h4>
                    <ul className="space-y-2">
                      {formData.items.map((item, idx) => (
                        <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                          <div className="w-1.5 h-1.5 bg-slate-400 rounded-full mt-2 flex-shrink-0" />
                          <span><strong>{item.label}:</strong> {item.selectedOptions.join(', ')} {item.details && `(${item.details})`}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="description-preview italic text-slate-700">
                  "{formData.description}"
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
                  <div className="p-8 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center gap-6">
                    <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
                      <Eye size={28} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Alcance</p>
                      <p className="font-black text-slate-900 text-lg">{formData.radius}km de raio</p>
                    </div>
                  </div>
                  <div className="p-8 rounded-[24px] bg-slate-50 border border-slate-100 flex items-center gap-6">
                    <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                      <MapPin size={28} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 uppercase font-black tracking-widest">Localização</p>
                      <p className="font-black text-slate-900 text-lg truncate max-w-[180px]">{formData.neighborhood || formData.city || 'Sua Região'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="pda-page">
      <AnimatedBackground />
      
      {/* AI Analysis Modal */}
      {isAnalyzing && <AnalyzingModal stages={stages} analysisStage={analysisStage} />}
      
      {/* Validation Modal */}
      <ValidationModal 
        isOpen={showValidationModal}
        onClose={() => setShowValidationModal(false)}
        validationResult={validationResult}
        onRetry={handleRetryValidation}
        onForcePublish={handleForcePublish}
      />
      
      {showItemModal && currentItem && (
        <ItemSpecificationModal
          item={currentItem}
          onClose={() => setShowItemModal(false)}
          onSave={(itemData) => {
            // Remove existing item if present and add new one
            const newItems = formData.items.filter(i => i.id !== itemData.id);
            updateData({ items: [...newItems, itemData] });
            setShowItemModal(false);
          }}
          categoryColor={selectedCategory?.color}
        />
      )}

      {isPublished && (
        <SuccessModal 
          urgencyColor={selectedUrgency?.color || '#f97316'}
          urgencyLabel={selectedUrgency?.label || 'PUBLICADO'}
          urgencyIcon={selectedUrgency?.icon}
          reason="Seu pedido foi enviado com sucesso e pessoas próximas serão notificadas."
          onClose={() => window.location.href = '/'}
        />
      )}

      <main className="pda-main-wrapper" style={{ paddingTop: '80px' }}>
        <div className="content-section" ref={formRef}>
          {!isPublished && (
            <>
              <motion.div 
                className="step-indicator"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                Passo {step} de {TOTAL_STEPS}: {STEP_LABELS[step-1]}
              </motion.div>

              <AnimatePresence mode="wait">
                {renderStepContent()}
              </AnimatePresence>

              {step > 1 && (
                <div className="form-actions">
                  <button onClick={prevStep} className="btn-back">
                    <ChevronLeft size={20} /> Voltar
                  </button>
                  
                  {step < TOTAL_STEPS ? (
                    <button 
                      onClick={nextStep} 
                      disabled={!isStepValid} 
                      className="btn-next"
                    >
                      Continuar <ArrowRight size={20} />
                    </button>
                  ) : (
                    <button 
                      onClick={handlePublish} 
                      disabled={isSubmitting} 
                      className="btn-publish"
                    >
                      {isSubmitting ? 'Publicando...' : 'Publicar Pedido'} <Rocket size={20} />
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}