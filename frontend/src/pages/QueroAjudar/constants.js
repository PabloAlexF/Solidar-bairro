import React from 'react';
import { 
  ShoppingCart,
  Shirt,
  Pill,
  Bath,
  Receipt,
  Briefcase,
  Sofa,
  Tv,
  Car,
  Plus,
  AlertTriangle,
  Zap,
  Calendar,
  Coffee,
  RefreshCcw
} from 'lucide-react';

export const CATEGORY_METADATA = {
  Alimentos: { 
    color: '#0ea5e9', 
    icon: <ShoppingCart size={24} />,
    details: { 
      cesta: { label: 'Cesta Básica', desc: 'Itens essenciais (arroz, feijão, óleo).' }, 
      proteinas: { label: 'Proteínas & Ovos', desc: 'Carne, frango ou ovos para a família.' }, 
      frescos: { label: 'Hortifruti', desc: 'Frutas e legumes frescos da estação.' }, 
      padaria: { label: 'Padaria & Leite', desc: 'Pães, leite e laticínios básicos.' }, 
      infantil: { label: 'Alimentação Infantil', desc: 'Fórmulas, papinhas e complementos.' }, 
      cozinha: { label: 'Itens de Cozinha', desc: 'Temperos, sal, açúcar e farinhas.' } 
    } 
  },
  Roupas: { 
    color: '#3b82f6', 
    icon: <Shirt size={24} />,
    details: { 
      agasalhos: { label: 'Agasalhos & Inverno', desc: 'Casacos, lãs e roupas pesadas.' }, 
      escolar: { label: 'Material/Uniforme', desc: 'Kits escolares ou uniforme da rede.' }, 
      calcados: { label: 'Calçados', desc: 'Tênis, sapatos ou chinelos.' },
      bebe: { label: 'Roupas de Bebê', desc: 'Enxoval e roupinhas pequenas.' }
    } 
  },
  Medicamentos: { 
    color: '#10b981', 
    icon: <Pill size={24} />,
    details: { 
      continuo: { label: 'Uso Contínuo', desc: 'Remédios para pressão, diabetes, etc.' }, 
      analgesico: { label: 'Sintomáticos', desc: 'Para dor, febre ou resfriados.' },
      especial: { label: 'Medicamento Especial', desc: 'Itens de alto custo ou específicos.' }
    } 
  },
  Higiene: { 
    color: '#14b8a6', 
    icon: <Bath size={24} />,
    details: { 
      banho: { label: 'Banho & Limpeza', desc: 'Sabonete, shampoo e desodorante.' }, 
      bucal: { label: 'Higiene Bucal', desc: 'Pasta e escovas de dente.' }, 
      feminina: { label: 'Saúde Íntima', desc: 'Absorventes e cuidados femininos.' } 
    } 
  },
  Contas: { 
    color: '#ef4444', 
    icon: <Receipt size={24} />,
    details: { 
      luz: { label: 'Energia Elétrica', desc: 'Evitar o corte de luz da residência.' }, 
      agua: { label: 'Água & Esgoto', desc: 'Conta de água essencial.' }, 
      gas: { label: 'Gás de Cozinha', desc: 'Botijão para preparo de alimentos.' } 
    } 
  },
  Emprego: { 
    color: '#8b5cf6', 
    icon: <Briefcase size={24} />,
    details: { 
      curriculo: { label: 'Currículo & Docs', desc: 'Montagem e impressão de currículos.' }, 
      vagas: { label: 'Oportunidades', desc: 'Indicação de vagas ou cursos.' } 
    } 
  },
  Móveis: { 
    color: '#f59e0b', 
    icon: <Sofa size={24} />,
    details: { 
      cama: { label: 'Dormitório', desc: 'Camas, colchões ou berços.' }, 
      cozinha_movel: { label: 'Cozinha', desc: 'Mesas, cadeiras ou armários.' } 
    } 
  },
  Eletrodomésticos: { 
    color: '#475569', 
    icon: <Tv size={24} />,
    details: { 
      geladeira: { label: 'Geladeira', desc: 'Fundamental para conservar alimentos.' }, 
      fogao: { label: 'Fogão', desc: 'Para preparo digno das refeições.' } 
    } 
  },
  Transporte: { 
    color: '#0ea5e9', 
    icon: <Car size={24} />,
    details: { 
      passagem: { label: 'Passagem Social', desc: 'Créditos para ônibus ou trem.' }, 
      bike: { label: 'Mobilidade', desc: 'Bicicleta para trabalho ou estudo.' } 
    } 
  },
  Outros: { 
    color: '#94a3b8', 
    icon: <Plus size={24} />,
    details: { 
      apoio: { label: 'Apoio Geral', desc: 'Outras necessidades específicas.' } 
    } 
  },
};

export const CATEGORIES = [
  { id: 'Todas', label: 'Todas Categorias', color: '#6366f1' },
  { id: 'Alimentos', label: 'Alimentos', color: '#0ea5e9' },
  { id: 'Roupas', label: 'Roupas', color: '#3b82f6' },
  { id: 'Medicamentos', label: 'Medicamentos', color: '#10b981' },
  { id: 'Contas', label: 'Contas', color: '#ef4444' },
  { id: 'Higiene', label: 'Higiene', color: '#14b8a6' },
  { id: 'Emprego', label: 'Emprego', color: '#8b5cf6' },
  { id: 'Móveis', label: 'Móveis', color: '#f59e0b' },
  { id: 'Transporte', label: 'Transporte', color: '#0ea5e9' },
  { id: 'Outros', label: 'Outros', color: '#94a3b8' },
];

export const URGENCY_OPTIONS = [
  { id: 'critico', label: 'CRÍTICO', desc: 'Risco imediato', icon: <AlertTriangle size={20} />, color: '#ef4444' },
  { id: 'urgente', label: 'URGENTE', desc: 'Próximas 24h', icon: <Zap size={20} />, color: '#f97316' },
  { id: 'moderada', label: 'MODERADA', desc: 'Alguns dias', icon: <Calendar size={20} />, color: '#f59e0b' },
  { id: 'tranquilo', label: 'TRANQUILO', desc: 'Sem pressa', icon: <Coffee size={20} />, color: '#10b981' },
  { id: 'recorrente', label: 'RECORRENTE', desc: 'Mensal', icon: <RefreshCcw size={20} />, color: '#9333ea' },
];

export const SUB_QUESTION_LABELS = {
  itens_cesta: 'Itens necessários',
  familia: 'Tamanho da família',
  restricao: 'Restrições alimentares',
  tipo_proteina: 'Preferência de proteína',
  armazenamento_prot: 'Possui geladeira?',
  tipo_fresco: 'Hortifruti desejado',
  itens_padaria: 'Itens de padaria',
  fralda: 'Tamanho da fralda',
  leite_especial: 'Leite específico',
  idade_crianca: 'Idade da criança',
  itens_coz: 'Temperos/Cozinha',
  tipo_lanche: 'Tipos de lanche',
  medicamento_nome: 'Nome do remédio',
  receita: 'Possui receita?',
  med_continuo: 'Medicamento contínuo',
  dosagem: 'Dosagem',
  itens_banho: 'Itens de banho',
  itens_bucal: 'Itens de higiene bucal',
  itens_fem: 'Itens de higiene feminina',
  valor_luz: 'Valor aproximado (Luz)',
  atraso_luz: 'Meses em atraso (Luz)',
  valor_agua: 'Valor aproximado (Água)',
  atraso_agua: 'Meses em atraso (Água)',
  valor_gas: 'Valor aproximado (Gás)',
  tipo_curr: 'Tipo de ajuda com currículo',
  area_interesse: 'Área de interesse',
  tipo_cama: 'Tipo de cama',
  tipo_movel: 'Tipo de móvel',
  volts_geladeira: 'Voltagem necessária',
  tipo_eletro: 'Tipo de eletrodoméstico',
  tipo_transp: 'Tipo de transporte',
  freq_transp: 'Frequência da ajuda',
  serie_escolar: 'Série Escolar',
  escola_nome: 'Nome da Escola',
  genero: 'Gênero',
  especifique: 'Detalhes da ajuda',
  size: 'Tamanho',
  style: 'Estilo/Preferência',
  quantidade: 'Quantidade',
  observacoes: 'Observações Adicionais',
  contato_pref: 'Contato Preferencial',
  horario: 'Melhor Horário',
  ponto_referencia: 'Ponto de Referência'
};