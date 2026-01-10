import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import apiService from '../../services/apiService';
import { AnalyzingModal, InconsistentModal, SuccessModal } from '../../components/ui/modals';
import { 
  ShoppingCart, 
  Shirt, 
  Receipt, 
  Pill, 
  Plus, 
  Check, 
  Smartphone, 
  PhoneCall, 
  MessageSquare, 
  MapPin, 
  Users, 
  Building2,
  ChevronLeft,
  ArrowRight,
  Heart,
  ShieldCheck,
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
  Layers,
  Maximize2,
  User,
  X,
  Sparkles,
  Lightbulb,
  PenTool,
  Mic,
  MicOff,
  Volume2,
  Map as MapIcon,
  Globe,
  Star,
  Wand2,
  Target,
  Rocket
} from 'lucide-react';
import MapaAlcance from '../../components/MapaAlcance';
import './styles.css';
import './styles-enhanced.css';

const CATEGORIES = [
  { id: 'Alimentos', label: 'Alimentos', icon: <ShoppingCart size={24} />, color: '#f97316' },
  { id: 'Roupas', label: 'Roupas', icon: <Shirt size={24} />, color: '#3b82f6' },
  { id: 'Calçados', label: 'Calçados', icon: <Footprints size={24} />, color: '#6366f1' },
  { id: 'Medicamentos', label: 'Medicamentos', icon: <Pill size={24} />, color: '#10b981' },
  { id: 'Higiene', label: 'Higiene', icon: <Bath size={24} />, color: '#14b8a6' },
  { id: 'Contas', label: 'Contas', icon: <Receipt size={24} />, color: '#ef4444' },
  { id: 'Emprego', label: 'Emprego', icon: <Briefcase size={24} />, color: '#8b5cf6' },
  { id: 'Móveis', label: 'Móveis', icon: <Sofa size={24} />, color: '#f59e0b' },
  { id: 'Eletrodomésticos', label: 'Eletrodomésticos', icon: <Tv size={24} />, color: '#475569' },
  { id: 'Transporte', label: 'Transporte', icon: <Car size={24} />, color: '#0ea5e9' },
  { id: 'Outros', label: 'Outros', icon: <Plus size={24} />, color: '#94a3b8' },
];

const URGENCY_OPTIONS = [
  { id: 'critico', label: 'CRÍTICO', desc: 'Risco imediato à saúde ou vida', icon: <AlertTriangle size={24} />, color: '#ef4444', time: 'Imediato' },
  { id: 'urgente', label: 'URGENTE', desc: 'Necessário para as próximas 24h', icon: <Zap size={24} />, color: '#f97316', time: '24 horas' },
  { id: 'moderada', label: 'MODERADA', desc: 'Pode aguardar alguns dias', icon: <Calendar size={24} />, color: '#f59e0b', time: '3-5 dias' },
  { id: 'tranquilo', label: 'TRANQUILO', desc: 'Sem prazo rígido', icon: <Coffee size={24} />, color: '#10b981', time: 'Sem pressa' },
  { id: 'recorrente', label: 'RECORRENTE', desc: 'Necessidade mensal constante', icon: <RefreshCcw size={24} />, color: '#6366f1', time: 'Mensal' },
];

const SPECIALISTS = [
  { id: 'medicos', label: 'Médicos/Saúde', icon: <Pill size={16} />, color: '#10b981' },
  { id: 'advogados', label: 'Advogados/Jurídico', icon: <ShieldCheck size={16} />, color: '#3b82f6' },
  { id: 'psicologos', label: 'Psicólogos', icon: <Heart size={16} />, color: '#ec4899' },
  { id: 'assistentes', label: 'Assistentes Sociais', icon: <Users size={16} />, color: '#8b5cf6' },
];

const VISIBILITY_OPTIONS = [
  { id: 'bairro', label: 'Meu Bairro', desc: 'Até 2km de distância', icon: <MapPin size={32} />, color: '#10b981' },
  { id: 'proximos', label: 'Região Próxima', desc: 'Até 10km de distância', icon: <Users size={32} />, color: '#3b82f6' },
  { id: 'todos', label: 'Toda a Cidade', desc: 'Visível para todos na cidade', icon: <Globe size={32} />, color: '#f97316' },
  { id: 'ongs', label: 'ONGs Parceiras', desc: 'Visível para instituições', icon: <Building2 size={32} />, color: '#6366f1' },
];

const CATEGORY_DETAILS = {
  Alimentos: {
    options: [
      { 
        id: 'cesta', 
        label: 'Cesta Básica', 
        desc: 'Arroz, feijão, óleo e itens secos.', 
        color: '#f97316',
        contextInfo: 'Uma cesta básica padrão costuma alimentar uma família de 4 pessoas por cerca de 15 dias.',
        subQuestions: [
          { 
            id: 'itens_cesta', 
            label: 'Itens de maior necessidade?', 
            type: 'chips', 
            options: ['Arroz', 'Feijão', 'Óleo', 'Açúcar', 'Café', 'Leite', 'Macarrão', 'Sal', 'Farinha'] 
          },
          { 
            id: 'familia', 
            label: 'Tamanho da Família?', 
            type: 'select', 
            options: ['1-2 pessoas', '3-4 pessoas', '5 ou mais'] 
          },
          {
            id: 'restricao',
            label: 'Alguma restrição alimentar?',
            type: 'input',
            placeholder: 'Ex: Diabético, Intolerante a Lactose...'
          }
        ]
      },
      { 
        id: 'proteinas', 
        label: 'Proteínas & Ovos', 
        desc: 'Carne, frango, ovos e peixe.', 
        color: '#ef4444',
        contextInfo: 'Proteínas são fundamentais para o sistema imunológico e a manutenção da massa muscular, especialmente em crianças.',
        subQuestions: [
          { 
            id: 'tipo_proteina', 
            label: 'Qual a preferência?', 
            type: 'chips', 
            options: ['Frango', 'Ovos', 'Carne Bovina', 'Peixe', 'Porco'] 
          },
          {
            id: 'armazenamento_prot',
            label: 'Possui geladeira ou congelador?',
            type: 'select',
            options: ['Sim', 'Não', 'Espaço limitado']
          }
        ]
      },
      { 
        id: 'frescos', 
        label: 'Hortifruti', 
        desc: 'Frutas, legumes e verduras.', 
        color: '#10b981',
        contextInfo: 'Alimentos frescos são as melhores fontes de vitaminas e minerais essenciais para o desenvolvimento.',
        subQuestions: [
          { 
            id: 'tipo_fresco', 
            label: 'O que mais precisa?', 
            type: 'chips', 
            options: ['Legumes', 'Frutas', 'Verduras', 'Temperos Verdes'] 
          }
        ]
      },
      { 
        id: 'padaria', 
        label: 'Padaria & Laticínios', 
        desc: 'Pão, leite, queijo e café.', 
        color: '#f59e0b',
        contextInfo: 'O café da manhã é uma das refeições mais importantes para manter a energia e o foco durante o dia.',
        subQuestions: [
          { 
            id: 'itens_padaria', 
            label: 'Itens desejados?', 
            type: 'chips', 
            options: ['Pão de Forma', 'Pão Francês', 'Leite Integral', 'Manteiga/Marg.', 'Queijo/Frios', 'Café', 'Achocolatado'] 
          }
        ]
      },
      { 
        id: 'infantil', 
        label: 'Bebês & Crianças', 
        desc: 'Fórmulas, papinhas e fraldas.', 
        color: '#6366f1',
        contextInfo: 'A nutrição adequada nos primeiros anos de vida é crucial para o desenvolvimento cognitivo e físico.',
        subQuestions: [
          { 
            id: 'fralda', 
            label: 'Tamanho da Fralda?', 
            type: 'select', 
            options: ['RN', 'P', 'M', 'G', 'GG', 'XG'] 
          },
          { 
            id: 'leite_especial', 
            label: 'Leite ou Fórmula Específica?', 
            type: 'input', 
            placeholder: 'Ex: Nan Soy, Aptamil, etc.' 
          },
          {
            id: 'idade_crianca',
            label: 'Idade da criança?',
            type: 'input',
            placeholder: 'Ex: 6 meses'
          }
        ]
      },
      { 
        id: 'lanches', 
        label: 'Lanches & Merenda', 
        desc: 'Biscoitos, sucos e práticos.', 
        color: '#ec4899',
        contextInfo: 'Itens práticos ajudam na alimentação escolar e fornecem energia rápida para quem trabalha fora.',
        subQuestions: [
          { 
            id: 'tipo_lanche', 
            label: 'Preferência?', 
            type: 'chips', 
            options: ['Biscoitos Doces', 'Biscoitos Salgados', 'Sucos de Caixinha', 'Gelatina', 'Pipoca'] 
          }
        ]
      },
      { 
        id: 'cozinha', 
        label: 'Temperos & Cozinha', 
        desc: 'Óleo, sal, açúcar e temperos.', 
        color: '#475569',
        contextInfo: 'Temperos e itens básicos de cozinha permitem preparar uma variedade de pratos com dignidade e sabor.',
        subQuestions: [
          { 
            id: 'itens_coz', 
            label: 'O que falta?', 
            type: 'chips', 
            options: ['Óleo', 'Sal', 'Açúcar', 'Extrato Tomate', 'Vinagre', 'Caldo de Galinha/Carne'] 
          }
        ]
      },
      { 
        id: 'prontas', 
        label: 'Refeições Prontas', 
        desc: 'Marmitas e consumo imediato.', 
        color: '#f43f5e',
        contextInfo: 'Opção ideal para situações de emergência onde não há meios para cozinhar no momento.'
      },
    ]
  },
  Roupas: {
    options: [
      { 
        id: 'agasalhos', 
        label: 'Agasalhos', 
        desc: 'Casacos pesados, blusas de lã.', 
        color: '#1e40af',
        contextInfo: 'Agasalhos de lã ou sintéticos ajudam muito em frentes frias.' 
      },
      { 
        id: 'escolar', 
        label: 'Uniforme Escolar', 
        desc: 'Kits da rede municipal/estadual.', 
        color: '#6366f1',
        contextInfo: 'Estar uniformizado ajuda na integração da criança no ambiente escolar e evita o desgaste de roupas civis.',
        subQuestions: [
          { id: 'serie_escolar', label: 'Série/Idade?', type: 'input', placeholder: 'Ex: 3º ano / 8 anos' },
          { id: 'escola_nome', label: 'Nome da Escola (se necessário)', type: 'input', placeholder: 'Ex: Escola Municipal...' }
        ]
      },
      { id: 'calcados', label: 'Calçados', desc: 'Tênis, sapatos, botas ou chinelos.', color: '#2563eb' },
      { id: 'enxoval', label: 'Enxoval de Bebê', desc: 'Body, mantas e fraldas pano.', color: '#ec4899' },
      { id: 'intimas', label: 'Roupas Íntimas', desc: 'Novas: meias, cuecas, calcinhas.', color: '#f43f5e' },
      { id: 'cama_banho', label: 'Cama & Banho', desc: 'Lençóis, cobertas, toalhas.', color: '#14b8a6' },
      { id: 'verao', label: 'Roupas de Verão', desc: 'Camisetas, bermudas, vestidos.', color: '#f59e0b' },
      { id: 'profissional', label: 'Roupa Profissional', desc: 'Social para entrevistas ou trabalho.', color: '#475569' },
      { id: 'acessorios', label: 'Acessórios Inverno', desc: 'Toucas, luvas e cachecóis.', color: '#6b7280' },
    ],
    sizes: ['PP', 'P', 'M', 'G', 'GG', 'EXG', 'Infantil'],
    styles: ['Masculino', 'Feminino', 'Unissex', 'Infantil']
  },
  Calçados: {
    options: [
      { 
        id: 'tenis_esportivo', 
        label: 'Tênis Esportivo', 
        desc: 'Para exercícios e caminhadas.', 
        color: '#10b981',
        subQuestions: [
          { id: 'numeracao', label: 'Numeração', type: 'input', placeholder: 'Ex: 38, 42...' },
          { id: 'genero', label: 'Gênero', type: 'select', options: ['Masculino', 'Feminino', 'Infantil'] }
        ]
      },
      { 
        id: 'sapato_social', 
        label: 'Sapato Social', 
        desc: 'Para trabalho e entrevistas.', 
        color: '#475569',
        subQuestions: [
          { id: 'numeracao', label: 'Numeração', type: 'input', placeholder: 'Ex: 38, 42...' },
          { id: 'genero', label: 'Gênero', type: 'select', options: ['Masculino', 'Feminino'] }
        ]
      },
      { 
        id: 'chinelos', 
        label: 'Chinelos/Sandálias', 
        desc: 'Para uso doméstico e casual.', 
        color: '#f59e0b',
        subQuestions: [
          { id: 'numeracao', label: 'Numeração', type: 'input', placeholder: 'Ex: 38, 42...' },
          { id: 'tipo_chinelo', label: 'Tipo', type: 'select', options: ['Chinelo Simples', 'Sandália', 'Chinelo de Dedo'] }
        ]
      },
      { 
        id: 'botas', 
        label: 'Botas/Botinas', 
        desc: 'Para trabalho e proteção.', 
        color: '#dc2626',
        subQuestions: [
          { id: 'numeracao', label: 'Numeração', type: 'input', placeholder: 'Ex: 38, 42...' },
          { id: 'tipo_bota', label: 'Tipo', type: 'select', options: ['Bota de Segurança', 'Botina', 'Bota de Chuva'] }
        ]
      },
      { 
        id: 'calcados_infantis', 
        label: 'Calçados Infantis', 
        desc: 'Para crianças e bebês.', 
        color: '#ec4899',
        subQuestions: [
          { id: 'numeracao', label: 'Numeração', type: 'input', placeholder: 'Ex: 20, 25, 30...' },
          { id: 'idade_crianca', label: 'Idade da criança', type: 'input', placeholder: 'Ex: 2 anos, 5 anos...' },
          { id: 'tipo_calcado', label: 'Tipo', type: 'select', options: ['Tênis', 'Sapato', 'Sandália', 'Chinelo'] }
        ]
      },
      { 
        id: 'calcados_especiais', 
        label: 'Calçados Especiais', 
        desc: 'Ortopédicos ou para necessidades específicas.', 
        color: '#6366f1',
        subQuestions: [
          { id: 'numeracao', label: 'Numeração', type: 'input', placeholder: 'Ex: 38, 42...' },
          { id: 'tipo_especial', label: 'Tipo especial', type: 'input', placeholder: 'Ex: Ortopédico, diabético...' }
        ]
      },
    ],
    sizes: ['34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45'],
    styles: ['Masculino', 'Feminino', 'Infantil', 'Unissex']
  },
  Medicamentos: {
    options: [
      { 
        id: 'pressao', 
        label: 'Pressão Alta', 
        desc: 'Losartana, Enalapril, etc.', 
        color: '#ef4444',
        contextInfo: 'Medicamentos para pressão alta devem ser tomados continuamente conforme prescrição médica.',
        subQuestions: [
          { id: 'medicamento_nome', label: 'Nome do Medicamento', type: 'input', placeholder: 'Ex: Losartana, Enalapril...' },
          { id: 'dosagem', label: 'Dosagem (mg)?', type: 'input', placeholder: 'Ex: 50mg, 100mg...' }
        ]
      },
      { 
        id: 'diabetes', 
        label: 'Diabetes', 
        desc: 'Metformina, Insulinas.', 
        color: '#dc2626',
        contextInfo: 'Medicamentos para diabetes são essenciais para controle glicêmico.',
        subQuestions: [
          { id: 'medicamento_nome', label: 'Nome do Medicamento', type: 'input', placeholder: 'Ex: Metformina, Insulina...' },
          { id: 'receita', label: 'Possui receita médica?', type: 'select', options: ['Sim, atualizada', 'Sim, vencida', 'Não possuo'] }
        ]
      },
      { 
        id: 'analgesicos', 
        label: 'Analgésicos', 
        desc: 'Dipirona, Paracetamol, Ibuprofeno.', 
        color: '#10b981',
        contextInfo: 'Sempre verifique a data de validade e nunca se automedique sem orientação básica.',
        subQuestions: [
          { id: 'medicamento_nome', label: 'Nome do Medicamento', type: 'input', placeholder: 'Ex: Paracetamol, Dipirona...' }
        ]
      },
      { 
        id: 'bombinhas', 
        label: 'Bombinhas/Asma', 
        desc: 'Salbutamol, Beclometasona.', 
        color: '#0ea5e9',
        contextInfo: 'Medicamentos para asma são fundamentais para crises respiratórias.',
        subQuestions: [
          { id: 'medicamento_nome', label: 'Nome do Medicamento', type: 'input', placeholder: 'Ex: Salbutamol, Beclometasona...' }
        ]
      },
      { 
        id: 'antibioticos', 
        label: 'Antibióticos', 
        desc: 'Com receita médica atualizada.', 
        color: '#8b5cf6',
        contextInfo: 'Antibióticos só devem ser usados com receita médica válida.',
        subQuestions: [
          { id: 'receita', label: 'Possui receita médica?', type: 'select', options: ['Sim, atualizada', 'Sim, vencida', 'Não possuo'] },
          { id: 'medicamento_nome', label: 'Nome do Medicamento', type: 'input', placeholder: 'Ex: Amoxicilina, Azitromicina...' }
        ]
      },
      { 
        id: 'saude_mental', 
        label: 'Saúde Mental', 
        desc: 'Controlados com receita.', 
        color: '#ec4899',
        contextInfo: 'Medicamentos controlados requerem receita especial e acompanhamento médico.',
        subQuestions: [
          { id: 'receita', label: 'Possui receita médica?', type: 'select', options: ['Sim, atualizada', 'Sim, vencida', 'Não possuo'] }
        ]
      },
      { 
        id: 'antialergicos', 
        label: 'Antialérgicos', 
        desc: 'Loratadina, Desloratadina, etc.', 
        color: '#06b6d4',
        subQuestions: [
          { id: 'medicamento_nome', label: 'Nome do Medicamento', type: 'input', placeholder: 'Ex: Loratadina, Desloratadina...' }
        ]
      },
      { 
        id: 'suplementos', 
        label: 'Suplemento Vitamínico', 
        desc: 'Vitamina D, B12, Ferro.', 
        color: '#f59e0b',
        subQuestions: [
          { id: 'tipo_suplemento', label: 'Tipo de Suplemento', type: 'chips', options: ['Vitamina D', 'Vitamina B12', 'Ferro', 'Cálcio', 'Multivitamínico'] }
        ]
      },
      { 
        id: 'curativos', 
        label: 'Itens de Curativo', 
        desc: 'Gaze, esparadrapo, álcool 70%.', 
        color: '#64748b',
        subQuestions: [
          { id: 'itens_curativo', label: 'Itens necessários', type: 'chips', options: ['Gaze', 'Esparadrapo', 'Álcool 70%', 'Algodão', 'Band-Aid', 'Atadura'] }
        ]
      },
    ]
  },
  Higiene: {
    options: [
      { 
        id: 'kit_banho', 
        label: 'Kit Banho', 
        desc: 'Sabonete, shampoo, condicionador.', 
        color: '#14b8a6',
        contextInfo: 'A higiene corporal básica previne doenças de pele e contribui para o bem-estar mental.',
        subQuestions: [
          { id: 'itens_banho', label: 'O que falta?', type: 'chips', options: ['Sabonete', 'Shampoo', 'Condicionador', 'Desodorante', 'Papel Higiênico', 'Lâmina de Barbear'] }
        ]
      },
      { 
        id: 'saude_bucal', 
        label: 'Saúde Bucal', 
        desc: 'Pasta, escova, fio dental.', 
        color: '#0d9488',
        subQuestions: [
          { id: 'itens_bucal', label: 'Itens necessários', type: 'chips', options: ['Pasta de Dente', 'Escova de Dente', 'Fio Dental', 'Enxaguante Bucal'] }
        ]
      },
      { 
        id: 'higiene_intima', 
        label: 'Higiene Íntima', 
        desc: 'Absorventes e protetores.', 
        color: '#ec4899',
        subQuestions: [
          { id: 'tipo_absorvente', label: 'Tipo necessário', type: 'chips', options: ['Absorvente Externo', 'Absorvente Interno', 'Protetor Diário', 'Absorvente Noturno'] }
        ]
      },
      { 
        id: 'fraldas_infantis', 
        label: 'Fraldas Infantis', 
        desc: 'Tamanhos P ao XXG.', 
        color: '#6366f1',
        subQuestions: [
          { id: 'tamanho_fralda', label: 'Tamanho da Fralda', type: 'select', options: ['RN', 'P', 'M', 'G', 'GG', 'XG', 'XXG'] },
          { id: 'idade_crianca', label: 'Idade da criança', type: 'input', placeholder: 'Ex: 6 meses, 2 anos...' }
        ]
      },
      { 
        id: 'fraldas_geriatricas', 
        label: 'Fraldas Geriátricas', 
        desc: 'Uso adulto (M, G, GG).', 
        color: '#8b5cf6',
        subQuestions: [
          { id: 'tamanho_fralda_adulto', label: 'Tamanho', type: 'select', options: ['M', 'G', 'GG', 'EG'] }
        ]
      },
      { 
        id: 'barbear', 
        label: 'Barbear', 
        desc: 'Aparelhos e espuma.', 
        color: '#475569',
        subQuestions: [
          { id: 'itens_barbear', label: 'Itens necessários', type: 'chips', options: ['Aparelho de Barbear', 'Espuma de Barbear', 'Gel de Barbear', 'Pós-Barba'] }
        ]
      },
      { 
        id: 'limpeza_casa', 
        label: 'Limpeza Casa', 
        desc: 'Detergente, sabão pó, amaciante.', 
        color: '#059669',
        subQuestions: [
          { id: 'produtos_limpeza', label: 'Produtos necessários', type: 'chips', options: ['Detergente', 'Sabão em Pó', 'Amaciante', 'Desinfetante', 'Sabão em Barra', 'Esponja'] }
        ]
      },
      { 
        id: 'protecao', 
        label: 'Proteção', 
        desc: 'Repelente e protetor solar.', 
        color: '#f59e0b',
        subQuestions: [
          { id: 'tipo_protecao', label: 'Tipo de proteção', type: 'chips', options: ['Repelente', 'Protetor Solar', 'Repelente Infantil', 'Protetor Solar Infantil'] }
        ]
      },
      { 
        id: 'desinfeccao', 
        label: 'Desinfeção', 
        desc: 'Álcool em gel ou líquido.', 
        color: '#64748b',
        subQuestions: [
          { id: 'tipo_alcool', label: 'Tipo de álcool', type: 'chips', options: ['Álcool em Gel', 'Álcool Líquido 70%', 'Álcool Spray'] }
        ]
      },
    ]
  },
  Contas: {
    options: [
      { 
        id: 'conta_luz', 
        label: 'Conta de Luz', 
        desc: 'Evitar o desligamento imediato.', 
        color: '#ef4444',
        contextInfo: 'Se você recebe Bolsa Família ou tem baixa renda, pode ter direito a até 65% de desconto na luz (Tarifa Social).',
        subQuestions: [
          { id: 'valor_luz', label: 'Valor aproximado (R$)?', type: 'input', placeholder: 'Ex: 150,00' },
          { id: 'atraso_luz', label: 'Meses em atraso?', type: 'select', options: ['1 mês', '2 meses', '3 ou mais', 'Aviso de corte'] }
        ]
      },
      { 
        id: 'conta_agua', 
        label: 'Conta de Água', 
        desc: 'Manter o abastecimento.', 
        color: '#3b82f6',
        subQuestions: [
          { id: 'valor_agua', label: 'Valor aproximado (R$)?', type: 'input', placeholder: 'Ex: 80,00' },
          { id: 'atraso_agua', label: 'Meses em atraso?', type: 'select', options: ['1 mês', '2 meses', '3 ou mais', 'Aviso de corte'] }
        ]
      },
      { 
        id: 'gas_cozinha', 
        label: 'Gás de Cozinha', 
        desc: 'Recarga de botijão 13kg.', 
        color: '#f97316',
        subQuestions: [
          { id: 'tipo_gas', label: 'Tipo de gás', type: 'select', options: ['Botijão 13kg', 'Gás Encanado'] }
        ]
      },
      { 
        id: 'apoio_aluguel', 
        label: 'Apoio Aluguel', 
        desc: 'Ajuda para evitar despejo.', 
        color: '#dc2626',
        subQuestions: [
          { id: 'valor_aluguel', label: 'Valor do aluguel (R$)?', type: 'input', placeholder: 'Ex: 800,00' },
          { id: 'meses_atraso', label: 'Meses em atraso?', type: 'select', options: ['1 mês', '2 meses', '3 ou mais'] }
        ]
      },
      { 
        id: 'internet_estudo', 
        label: 'Internet/Estudo', 
        desc: 'Educação ou trabalho remoto.', 
        color: '#6366f1',
        subQuestions: [
          { id: 'finalidade_internet', label: 'Finalidade principal', type: 'chips', options: ['Estudo Online', 'Trabalho Remoto', 'Busca de Emprego', 'Cursos'] }
        ]
      },
      { 
        id: 'telefone_recarga', 
        label: 'Telefone/Recarga', 
        desc: 'Para manter comunicação.', 
        color: '#8b5cf6',
        subQuestions: [
          { id: 'tipo_recarga', label: 'Tipo de recarga', type: 'select', options: ['Crédito Celular', 'Pacote de Dados', 'Conta Fixa'] }
        ]
      },
      { 
        id: 'divida_transporte', 
        label: 'Dívida Transporte', 
        desc: 'Recarga de cartões de passagem.', 
        color: '#0ea5e9',
        subQuestions: [
          { id: 'tipo_cartao', label: 'Tipo de cartão', type: 'chips', options: ['Bilhete Único', 'Cartão Estudante', 'Vale Transporte'] }
        ]
      },
    ]
  },
  Emprego: {
    options: [
      { 
        id: 'curriculo', 
        label: 'Currículo', 
        desc: 'Elaboração e impressão.', 
        color: '#8b5cf6',
        contextInfo: 'Destaque suas experiências, mesmo as informais. Um bom currículo abre portas inesperadas.',
        subQuestions: [
          { id: 'tipo_curr', label: 'Qual a ajuda exata?', type: 'select', options: ['Criar um do zero', 'Revisar o atual', 'Apenas imprimir'] }
        ]
      },
      { 
        id: 'qualificacao', 
        label: 'Qualificação', 
        desc: 'Cursos técnicos ou básicos.', 
        color: '#7c3aed',
        subQuestions: [
          { id: 'area_curso', label: 'Área de interesse', type: 'chips', options: ['Informática', 'Administração', 'Saúde', 'Educação', 'Construção', 'Beleza'] }
        ]
      },
      { 
        id: 'epis_uniforme', 
        label: 'EPIs/Uniforme', 
        desc: 'Botinas, luvas ou roupas.', 
        color: '#059669',
        subQuestions: [
          { id: 'tipo_epi', label: 'Tipo de EPI', type: 'chips', options: ['Botina de Segurança', 'Luvas', 'Capacete', 'Uniforme', 'Óculos de Proteção'] }
        ]
      },
      { 
        id: 'ferramentas', 
        label: 'Ferramentas', 
        desc: 'Para pedreiro, eletricista, etc.', 
        color: '#dc2626',
        subQuestions: [
          { id: 'profissao', label: 'Profissão/Área', type: 'input', placeholder: 'Ex: Pedreiro, Eletricista...' },
          { id: 'ferramentas_especificas', label: 'Ferramentas necessárias', type: 'input', placeholder: 'Ex: Furadeira, Alicate...' }
        ]
      },
      { 
        id: 'estetica_beleza', 
        label: 'Estética/Beleza', 
        desc: 'Itens para cabeleireiro/manicure.', 
        color: '#ec4899',
        subQuestions: [
          { id: 'area_beleza', label: 'Área específica', type: 'chips', options: ['Cabeleireiro', 'Manicure', 'Estética', 'Maquiagem', 'Barbeiro'] }
        ]
      },
      { 
        id: 'informatica', 
        label: 'Informática', 
        desc: 'Peças ou conserto de PC/Notebook.', 
        color: '#3b82f6',
        subQuestions: [
          { id: 'tipo_ajuda_pc', label: 'Tipo de ajuda', type: 'select', options: ['Conserto', 'Peças', 'Software', 'Configuração'] }
        ]
      },
    ]
  },
  Móveis: {
    options: [
      { 
        id: 'cama_solteiro', 
        label: 'Cama Solteiro', 
        desc: 'Ou colchão de solteiro.', 
        color: '#f59e0b',
        contextInfo: 'Um sono de qualidade é essencial para a saúde física e mental de adultos e crianças.',
        subQuestions: [
          { id: 'tipo_cama', label: 'O que exatamente?', type: 'select', options: ['Cama Completa', 'Apenas Colchão', 'Apenas Estrutura'] }
        ]
      },
      { 
        id: 'cama_casal', 
        label: 'Cama Casal', 
        desc: 'Ou colchão de casal.', 
        color: '#d97706',
        subQuestions: [
          { id: 'tipo_cama', label: 'O que exatamente?', type: 'select', options: ['Cama Completa', 'Apenas Colchão', 'Apenas Estrutura'] }
        ]
      },
      { 
        id: 'berco', 
        label: 'Berço', 
        desc: 'Para recém-nascidos.', 
        color: '#ec4899',
        subQuestions: [
          { id: 'idade_bebe', label: 'Idade do bebê', type: 'input', placeholder: 'Ex: Recém-nascido, 6 meses...' }
        ]
      },
      { 
        id: 'armario_cozinha', 
        label: 'Armário Cozinha', 
        desc: 'Ou paneleiro.', 
        color: '#059669',
        subQuestions: [
          { id: 'tipo_armario', label: 'Tipo preferido', type: 'select', options: ['Armário Aéreo', 'Paneleiro', 'Balcão'] }
        ]
      },
      { 
        id: 'roupeiro', 
        label: 'Roupeiro', 
        desc: 'Guarda-roupa para o quarto.', 
        color: '#6366f1',
        subQuestions: [
          { id: 'tamanho_roupeiro', label: 'Tamanho necessário', type: 'select', options: ['2 Portas', '3 Portas', '4 ou mais Portas'] }
        ]
      },
      { 
        id: 'mesa_cadeiras', 
        label: 'Mesa/Cadeiras', 
        desc: 'Para refeições.', 
        color: '#8b5cf6',
        subQuestions: [
          { id: 'quantidade_lugares', label: 'Quantos lugares?', type: 'select', options: ['2 lugares', '4 lugares', '6 ou mais lugares'] }
        ]
      },
      { 
        id: 'sofa', 
        label: 'Sofá', 
        desc: 'Para a sala.', 
        color: '#475569',
        subQuestions: [
          { id: 'tamanho_sofa', label: 'Tamanho preferido', type: 'select', options: ['2 lugares', '3 lugares', 'Canto/L'] }
        ]
      },
      { 
        id: 'escrivaninha', 
        label: 'Escrivaninha', 
        desc: 'Para estudos ou trabalho.', 
        color: '#0ea5e9',
        subQuestions: [
          { id: 'finalidade_mesa', label: 'Finalidade principal', type: 'select', options: ['Estudo', 'Trabalho', 'Computador'] }
        ]
      },
    ]
  },
  Eletrodomésticos: {
    options: [
      { 
        id: 'geladeira', 
        label: 'Geladeira', 
        desc: 'Fundamental para alimentos.', 
        color: '#475569',
        contextInfo: 'Evite abrir a geladeira sem necessidade para economizar energia e manter os alimentos frescos.',
        subQuestions: [
          { id: 'volts_geladeira', label: 'Qual a voltagem necessária?', type: 'select', options: ['110v', '220v', 'Bivolt'] },
          { id: 'tamanho_geladeira', label: 'Tamanho preferido', type: 'select', options: ['Compacta', 'Média', 'Grande', 'Duplex'] }
        ]
      },
      { 
        id: 'fogao', 
        label: 'Fogão', 
        desc: 'Para preparo de refeições.', 
        color: '#334155',
        subQuestions: [
          { id: 'tipo_fogao', label: 'Tipo preferido', type: 'select', options: ['4 Bocas', '5 Bocas', '6 Bocas', 'Cooktop'] },
          { id: 'combustivel', label: 'Combustível', type: 'select', options: ['Gás', 'Elétrico'] }
        ]
      },
      { 
        id: 'maquina_lavar', 
        label: 'Máquina Lavar', 
        desc: 'Cuidado com as roupas.', 
        color: '#0ea5e9',
        subQuestions: [
          { id: 'capacidade_maquina', label: 'Capacidade necessária', type: 'select', options: ['Até 8kg', '9-11kg', '12kg ou mais'] },
          { id: 'voltagem', label: 'Voltagem', type: 'select', options: ['110v', '220v', 'Bivolt'] }
        ]
      },
      { 
        id: 'microondas', 
        label: 'Micro-ondas', 
        desc: 'Aquecimento rápido.', 
        color: '#64748b',
        subQuestions: [
          { id: 'voltagem', label: 'Voltagem', type: 'select', options: ['110v', '220v', 'Bivolt'] }
        ]
      },
      { 
        id: 'ferro_passar', 
        label: 'Ferro de Passar', 
        desc: 'Cuidado com vestimentas.', 
        color: '#6b7280',
        subQuestions: [
          { id: 'tipo_ferro', label: 'Tipo preferido', type: 'select', options: ['Ferro Seco', 'Ferro a Vapor', 'Ferro com Caldeira'] }
        ]
      },
      { 
        id: 'ventilador', 
        label: 'Ventilador', 
        desc: 'Para dias de calor.', 
        color: '#06b6d4',
        subQuestions: [
          { id: 'tipo_ventilador', label: 'Tipo preferido', type: 'select', options: ['Mesa', 'Coluna', 'Parede', 'Teto'] }
        ]
      },
      { 
        id: 'chuveiro_eletrico', 
        label: 'Chuveiro Elétrico', 
        desc: 'Banho quente essencial.', 
        color: '#f59e0b',
        subQuestions: [
          { id: 'potencia_chuveiro', label: 'Potência', type: 'select', options: ['4400W', '5500W', '6800W', '7500W'] },
          { id: 'voltagem', label: 'Voltagem', type: 'select', options: ['110v', '220v'] }
        ]
      },
    ]
  },
  Transporte: {
    options: [
      { 
        id: 'passagens', 
        label: 'Passagens', 
        desc: 'Ônibus ou trem (TRI/TEU).', 
        color: '#0ea5e9',
        contextInfo: 'Muitos municípios oferecem gratuidade ou passe social para desempregados e estudantes.',
        subQuestions: [
          { id: 'tipo_transp', label: 'Tipo de transporte?', type: 'chips', options: ['Ônibus', 'Metrô', 'Trem', 'Uber/Taxi (Emergência)'] },
          { id: 'freq_transp', label: 'Frequência da ajuda?', type: 'select', options: ['Única vez', 'Semanal', 'Mensal'] }
        ]
      },
      { 
        id: 'bicicleta', 
        label: 'Bicicleta', 
        desc: 'Trabalho ou escola.', 
        color: '#10b981',
        subQuestions: [
          { id: 'finalidade_bike', label: 'Finalidade principal', type: 'select', options: ['Trabalho', 'Estudo', 'Lazer', 'Exercício'] },
          { id: 'tipo_bike', label: 'Tipo preferido', type: 'select', options: ['Urbana', 'Mountain Bike', 'Infantil'] }
        ]
      },
      { 
        id: 'apoio_carona', 
        label: 'Apoio Carona', 
        desc: 'Consultas médicas.', 
        color: '#ec4899',
        subQuestions: [
          { id: 'tipo_carona', label: 'Tipo de carona', type: 'chips', options: ['Consulta Médica', 'Hospital', 'Exames', 'Emergência'] }
        ]
      },
      { 
        id: 'pecas_moto', 
        label: 'Peças Moto', 
        desc: 'Para quem trabalha com entrega.', 
        color: '#f97316',
        subQuestions: [
          { id: 'tipo_peca', label: 'Tipo de peça', type: 'input', placeholder: 'Ex: Pneu, Corrente, Freio...' },
          { id: 'modelo_moto', label: 'Modelo da moto', type: 'input', placeholder: 'Ex: Honda CG 160, Yamaha Factor...' }
        ]
      },
      { 
        id: 'combustivel', 
        label: 'Combustível', 
        desc: 'Ajuda pontual para emergências.', 
        color: '#dc2626',
        subQuestions: [
          { id: 'tipo_combustivel', label: 'Tipo de combustível', type: 'select', options: ['Gasolina', 'Etanol', 'Diesel'] },
          { id: 'motivo_combustivel', label: 'Motivo da emergência', type: 'input', placeholder: 'Ex: Consulta médica, entrevista de emprego...' }
        ]
      },
    ]
  },
  Outros: {
    options: [
      { 
        id: 'outros_ajuda', 
        label: 'Outro tipo de ajuda', 
        desc: 'Algo que não está nas categorias.', 
        color: '#94a3b8',
        subQuestions: [
          { id: 'especifique', label: 'O que exatamente você precisa?', type: 'input', placeholder: 'Descreva brevemente aqui...' }
        ]
      }
    ]
  }
};

const STORY_TEMPLATES = [
  {
    id: 'familia',
    label: 'Família',
    icon: <Users size={14} />,
    text: 'Preciso de ajuda com alimentos para minha família de [X] pessoas. Estamos passando por um momento difícil e qualquer contribuição de cesta básica seria muito bem-vinda.'
  },
  {
    id: 'saude',
    label: 'Saúde',
    icon: <Pill size={14} />,
    text: 'Estou precisando de ajuda para adquirir o medicamento [Nome] para uso contínuo. Não estou conseguindo arcar com os custos este mês devido a [Motivo].'
  },
  {
    id: 'emprego',
    label: 'Emprego',
    icon: <Briefcase size={14} />,
    text: 'Estou em busca de recolocação profissional e precisaria de ajuda com passagens de ônibus para comparecer a entrevistas ou ajuda para imprimir currículos.'
  }
];

const STEP_LABELS = ['Categoria', 'Detalhes', 'História', 'Urgência', 'Visibilidade', 'Confirmação'];
const TOTAL_STEPS = 6;

export default function PrecisoDeAjuda() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSubModal, setSelectedSubModal] = useState(null);
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [subQuestionAnswers, setSubQuestionAnswers] = useState({});
  const [templateUsed, setTemplateUsed] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [confettiTrigger, setConfettiTrigger] = useState(false);
  
  // Estados para análise de IA
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStage, setAnalysisStage] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [isInconsistent, setIsInconsistent] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  
  const stages = [
    'Verificando categoria e descrição',
    'Analisando urgência e contexto',
    'Validando dados de segurança',
    'Finalizando aprovação'
  ];

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          setLocationError('Não foi possível obter sua localização');
          // Default to São Paulo center if location fails
          setUserLocation({ lat: -23.5505, lng: -46.6333 });
        }
      );
    } else {
      setLocationError('Geolocalização não suportada');
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
    }
  }, []);

  // Mouse tracking for interactive effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'pt-BR';
        recognitionInstance.maxAlternatives = 1;

        let finalTranscript = '';
        let isProcessing = false;

        recognitionInstance.onstart = () => {
          finalTranscript = '';
          isProcessing = false;
        };

        recognitionInstance.onresult = (event) => {
          if (isProcessing) return;
          isProcessing = true;
          
          const transcript = event.results[0][0].transcript.trim();
          if (transcript && transcript !== finalTranscript) {
            finalTranscript = transcript;
            setFormData(prev => ({ 
              ...prev, 
              description: prev.description ? `${prev.description} ${transcript}` : transcript
            }));
          }
        };

        recognitionInstance.onend = () => {
          setIsRecording(false);
          isProcessing = false;
        };
        
        recognitionInstance.onerror = (event) => {
          setIsRecording(false);
          isProcessing = false;
          console.log('Erro na gravação de voz:', event.error);
        };

        setRecognition(recognitionInstance);
      }
    }
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      alert("Seu navegador não suporta gravação de áudio por voz.");
      return;
    }

    if (isRecording) {
      try {
        recognition.stop();
      } catch (error) {
        console.log('Erro ao parar gravação:', error);
      }
      setIsRecording(false);
    } else {
      try {
        // Garantir que não há gravação ativa
        recognition.abort();
        setTimeout(() => {
          recognition.start();
          setIsRecording(true);
        }, 100);
      } catch (error) {
        console.log('Erro ao iniciar gravação:', error);
        setIsRecording(false);
      }
    }
  };
  const [formData, setFormData] = useState({
    category: '',
    subCategory: [],
    size: '',
    style: '',
    subQuestionAnswers: {},
    description: '',
    urgency: '',
    visibility: [],
    specialists: [],
    isPublic: true,
    radius: 5
  });

  const nextStep = useCallback(() => setStep(s => Math.min(s + 1, TOTAL_STEPS)), []);
  const prevStep = useCallback(() => setStep(s => Math.max(s - 1, 1)), []);

  const updateData = useCallback((data) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const updateSubAnswer = useCallback((questionId, value) => {
    setFormData(prev => ({
      ...prev,
      subQuestionAnswers: {
        ...prev.subQuestionAnswers,
        [questionId]: value
      }
    }));
  }, []);

  const isDescriptionValid = useMemo(() => {
    if (formData.description.length < 10) return false;
    if (templateUsed) {
      const hasBrackets = /\[.*?\]/.test(formData.description);
      const isIdentical = formData.description === templateUsed;
      if (hasBrackets || isIdentical) return false;
    }
    return true;
  }, [formData.description, templateUsed]);

  const isStepValid = useMemo(() => {
    switch (step) {
      case 1: return formData.category !== '';
      case 2: {
        const details = CATEGORY_DETAILS[formData.category];
        if (!details) return true;
        return formData.subCategory.length > 0;
      }
      case 3: return isDescriptionValid;
      case 4: return formData.urgency !== '';
      case 5: return formData.visibility.length > 0;
      default: return true;
    }
  }, [step, formData, isDescriptionValid]);

  const handlePublish = useCallback(async () => {
    setIsSubmitting(true);
    setIsAnalyzing(true);
    setAnalysisStage(0);
    
    // Simular análise de IA
    for (let i = 0; i < stages.length; i++) {
      setAnalysisStage(i);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    // Simular resultado da análise
    const isValid = Math.random() > 0.2; // 80% de chance de aprovação
    
    setIsAnalyzing(false);
    
    if (isValid) {
      setAnalysis({
        reason: 'Pedido validado com sucesso. Todas as informações estão claras e condizem com a categoria selecionada.'
      });
      setIsPublished(true);
      
      try {
        const pedidoData = {
          category: formData.category,
          subCategory: formData.subCategory,
          size: formData.size,
          style: formData.style,
          subQuestionAnswers: formData.subQuestionAnswers,
          description: formData.description,
          urgency: formData.urgency,
          visibility: formData.visibility,
          specialists: formData.specialists,
          isPublic: formData.isPublic,
          radius: formData.radius
        };
        
        await apiService.createPedido(pedidoData);
      } catch (error) {
        console.error('Erro ao salvar pedido:', error);
      }
    } else {
      setIsInconsistent(true);
    }
    
    setIsSubmitting(false);
  }, [formData, stages]);

  const selectedCategory = useMemo(() => 
    CATEGORIES.find(c => c.id === formData.category), 
    [formData.category]
  );

  const selectedUrgency = useMemo(() => 
    URGENCY_OPTIONS.find(o => o.id === formData.urgency),
    [formData.urgency]
  );

  const renderCategoryStep = () => (
    <motion.div 
      className="compact-step"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="step-intro"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.span 
          className="step-badge magical-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <Wand2 size={14} /> Passo 01
        </motion.span>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Qual ajuda você precisa?
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Selecione a categoria principal do seu pedido.
        </motion.p>
      </motion.div>
      <motion.div 
        className="categories-grid-compact"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        {CATEGORIES.map((cat, index) => (
          <motion.button
            key={cat.id}
            onClick={() => {
              updateData({ category: cat.id, subCategory: [] });
              setConfettiTrigger(true);
              setTimeout(() => setConfettiTrigger(false), 1000);
            }}
            className={`cat-item enhanced ${formData.category === cat.id ? 'active' : ''}`}
            style={{ '--cat-color': cat.color }}
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.8 + (index * 0.1), 
              type: "spring", 
              stiffness: 150,
              damping: 12
            }}
            whileHover={{ 
              scale: 1.05, 
              y: -8,
              rotateY: 5,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.95 }}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
          >
            <motion.div 
              className="cat-icon-box"
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
            >
              {cat.icon}
            </motion.div>
            <span className="cat-text">{cat.label}</span>
            {formData.category === cat.id && (
              <motion.div
                className="selection-indicator"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Star size={16} fill="currentColor" />
              </motion.div>
            )}
          </motion.button>
        ))}
      </motion.div>
      {confettiTrigger && (
        <motion.div
          className="confetti-burst"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="confetti-piece"
              initial={{ 
                x: mousePosition.x - window.innerWidth / 2,
                y: mousePosition.y - window.innerHeight / 2,
                scale: 0,
                rotate: 0
              }}
              animate={{
                x: (Math.random() - 0.5) * 400,
                y: (Math.random() - 0.5) * 400,
                scale: [0, 1, 0],
                rotate: Math.random() * 360
              }}
              transition={{
                duration: 1,
                delay: i * 0.05,
                ease: "easeOut"
              }}
              style={{
                backgroundColor: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)].color
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );

  const toggleArrayItem = useCallback((array, item) => {
    return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
  }, []);

  const renderDetailsStep = () => {
    const details = CATEGORY_DETAILS[formData.category];
    
    if (!details) {
      return (
        <div className="compact-step centered">
          <div className="skip-box color-fade">
            <div className="skip-icon-wrapper" style={{ background: selectedCategory?.color }}>
              <Layers size={32} color="white" />
            </div>
            <h3>Categoria: {formData.category}</h3>
            <p>Esta categoria não possui sub-escolhas. Clique em próximo para continuar.</p>
          </div>
        </div>
      );
    }

    const handleToggleSub = (id) => {
      const opt = details.options.find(o => o.id === id);
      const isAlreadySelected = formData.subCategory.includes(id);
      const newSubCategory = toggleArrayItem(formData.subCategory, id);
      updateData({ subCategory: newSubCategory });
      
      if (!isAlreadySelected && opt?.subQuestions) {
        setSelectedSubModal(id);
      }
    };

    const subOptModal = selectedSubModal 
      ? details.options.find(o => o.id === selectedSubModal) 
      : null;

    return (
      <div className="compact-step">
        <div className="step-intro">
          <span className="step-badge" style={{ background: selectedCategory?.color }}>Passo 02</span>
          <h2>O que exatamente?</h2>
          <p>Selecione as opções desejadas em <strong>{formData.category}</strong>.</p>
        </div>
        
        <div className="step-2-v3-layout">
          <div className="options-grid-v3">
            {details.options.map((opt) => (
              <button
                key={opt.id}
                onClick={() => handleToggleSub(opt.id)}
                className={`opt-card-v3 ${formData.subCategory.includes(opt.id) ? 'active' : ''}`}
                style={{ '--opt-color': opt.color }}
              >
                <div className="opt-check-v3">
                  {formData.subCategory.includes(opt.id) && <Check size={14} />}
                </div>
                <div className="opt-body-v3">
                  <strong>{opt.label}</strong>
                  <span>{opt.desc}</span>
                </div>
                {opt.subQuestions && formData.subCategory.includes(opt.id) && (
                  <div 
                    className="opt-edit-badge" 
                    onClick={(e) => { e.stopPropagation(); setSelectedSubModal(opt.id); }}
                  >
                    <PenTool size={10} /> Editar
                  </div>
                )}
              </button>
            ))}
          </div>

          {details.sizes && (
            <button 
              className="btn-specs-trigger"
              onClick={() => setShowSpecsModal(true)}
              style={{ '--cat-color': selectedCategory?.color }}
            >
              <div className="trigger-info">
                <Maximize2 size={20} />
                <div className="text">
                  <strong>Especificações Gerais</strong>
                  <span>{formData.size || 'Tamanho'} • {formData.style || 'Preferência'}</span>
                </div>
              </div>
              <ChevronLeft size={20} className="rotate-icon" />
            </button>
          )}
        </div>

        {/* Modal de Especificações */}
        <AnimatePresence>
          {showSpecsModal && (
            <div className="modal-overlay-fullscreen">
              <motion.div 
                className="modal-overlay" 
                onClick={() => setShowSpecsModal(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="sub-modal-v3 specs-modal"
                  style={{ '--modal-color': selectedCategory?.color }}
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="modal-header">
                    <div className="header-info">
                      <h3>Especificações Gerais</h3>
                      <p>Defina o tamanho e a preferência para o seu pedido.</p>
                    </div>
                    <button className="close-btn" onClick={() => setShowSpecsModal(false)}>
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="modal-body">
                    <div className="specs-modal-content">
                      <div className="spec-item">
                        <label className="q-label"><Maximize2 size={16} /> Qual o tamanho?</label>
                        <div className="chips-grid">
                          {details.sizes.map((s) => (
                            <button
                              key={s}
                              onClick={() => updateData({ size: s })}
                              className={`chip-item ${formData.size === s ? 'active' : ''}`}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>

                      {details.styles && (
                        <div className="spec-item" style={{ marginTop: '24px' }}>
                          <label className="q-label"><User size={16} /> Qual a preferência?</label>
                          <div className="chips-grid">
                            {details.styles.map((s) => (
                              <button
                                key={s}
                                onClick={() => updateData({ style: s })}
                                className={`chip-item ${formData.style === s ? 'active' : ''}`}
                              >
                                {s}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button 
                      className="btn-v3 btn-modal-done"
                      onClick={() => setShowSpecsModal(false)}
                    >
                      Concluir <Check size={18} />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Modal de Subperguntas */}
        <AnimatePresence>
          {selectedSubModal && subOptModal && (
            <div className="modal-overlay-fullscreen">
              <motion.div 
                className="modal-overlay" 
                onClick={() => setSelectedSubModal(null)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="sub-modal-v3"
                  style={{ '--modal-color': subOptModal.color }}
                  onClick={(e) => e.stopPropagation()}
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                >
                  <div className="modal-header">
                    <div className="header-info">
                      <h3>Detalhes: {subOptModal.label}</h3>
                      <p>{subOptModal.desc}</p>
                    </div>
                    <button className="close-btn" onClick={() => setSelectedSubModal(null)}>
                      <X size={20} />
                    </button>
                  </div>
                  
                  <div className="modal-body scrollable-modal-content">
                    {subOptModal.contextInfo && (
                      <div className="modal-context-info">
                        <Lightbulb size={20} className="info-icon" />
                        <p>{subOptModal.contextInfo}</p>
                      </div>
                    )}
                    <div className="sub-q-grid-layout">
                      {subOptModal.subQuestions?.map((q) => (
                        <div key={q.id} className="q-item">
                          <label className="q-label">{q.label}</label>
                          
                          {q.type === 'chips' && q.options && (
                            <div className="chips-grid">
                              {q.options.map((opt) => {
                                const currentAnswers = (formData.subQuestionAnswers[q.id] || []);
                                const isActive = Array.isArray(currentAnswers) ? currentAnswers.includes(opt) : false;
                                return (
                                  <button
                                    key={opt}
                                    type="button"
                                    onClick={() => {
                                      const current = formData.subQuestionAnswers[q.id] || [];
                                      const next = isActive 
                                        ? current.filter(a => a !== opt)
                                        : [...current, opt];
                                      updateSubAnswer(q.id, next);
                                    }}
                                    className={`chip-item ${isActive ? 'active' : ''}`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          {q.type === 'select' && q.options && (
                            <div className="chips-grid">
                              {q.options.map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => updateSubAnswer(q.id, opt)}
                                  className={`chip-item ${formData.subQuestionAnswers[q.id] === opt ? 'active' : ''}`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          )}

                          {q.type === 'input' && (
                            <input 
                              type="text"
                              placeholder={q.placeholder}
                              value={formData.subQuestionAnswers[q.id] || ''}
                              onChange={(e) => updateSubAnswer(q.id, e.target.value)}
                              className="sub-input-v3"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button 
                      className="btn-v3 btn-modal-done"
                      onClick={() => setSelectedSubModal(null)}
                    >
                      Concluir <Check size={18} />
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const renderDescriptionStep = () => (
    <motion.div 
      className="compact-step"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="step-intro"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.span 
          className="step-badge storytelling-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <PenTool size={14} /> Passo 03
        </motion.span>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Conte sua história
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Dê detalhes para que as pessoas entendam como ajudar.
        </motion.p>
      </motion.div>

      <motion.div 
        className="story-layout-v3"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        <div className="story-main">
          <motion.div 
            className="input-group enhanced-input"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <motion.textarea
              placeholder="Ex: Preciso de ajuda com alimentos para meus 3 filhos este mês. Estamos passando por um momento difícil..."
              value={formData.description}
              onChange={(e) => updateData({ description: e.target.value.slice(0, 500) })}
              className={`compact-textarea v3 enhanced ${templateUsed && !isDescriptionValid ? 'warning' : ''}`}
              initial={{ borderColor: 'var(--gray-200)' }}
              whileFocus={{ 
                borderColor: 'var(--primary)',
                boxShadow: '0 0 0 3px rgba(249, 115, 22, 0.1)'
              }}
            />
            <motion.div 
              className={`count-tag enhanced ${isDescriptionValid ? 'valid' : ''}`}
              animate={{ 
                scale: formData.description.length > 0 ? 1 : 0.8,
                opacity: formData.description.length > 0 ? 1 : 0.6
              }}
            >
              {formData.description.length}/500
            </motion.div>
            
            <motion.button 
              className={`voice-record-btn enhanced ${isRecording ? 'recording' : ''}`}
              onClick={toggleRecording}
              title={isRecording ? "Parar Gravação" : "Gravar com Voz"}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={isRecording ? {
                boxShadow: [
                  '0 0 0 0 rgba(239, 68, 68, 0.4)',
                  '0 0 0 10px rgba(239, 68, 68, 0)',
                  '0 0 0 0 rgba(239, 68, 68, 0.4)'
                ]
              } : {}}
              transition={isRecording ? {
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              } : {}}
            >
              <motion.div
                animate={isRecording ? { rotate: 360 } : { rotate: 0 }}
                transition={isRecording ? { duration: 2, repeat: Infinity, ease: "linear" } : {}}
              >
                {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
              </motion.div>
              <span>{isRecording ? 'Ouvindo...' : 'Falar (Gravar Voz)'}</span>
              {isRecording && (
                <motion.div
                  className="recording-waves"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="wave"
                      animate={{
                        scaleY: [1, 2, 1],
                        opacity: [0.3, 1, 0.3]
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        delay: i * 0.2,
                        ease: "easeInOut"
                      }}
                    />
                  ))}
                </motion.div>
              )}
            </motion.button>
          </motion.div>

          {templateUsed && !isDescriptionValid && (
            <motion.div 
              className="template-warning"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <motion.div
                animate={{ rotate: [0, -5, 5, 0] }}
                transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 2 }}
              >
                <AlertTriangle size={16} />
              </motion.div>
              <span>Por favor, altere os dados entre colchetes [ ] com suas informações reais.</span>
            </motion.div>
          )}

          <motion.div 
            className="story-templates-box"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
          >
            <span className="section-subtitle">Ou use um modelo (lembre-se de editar):</span>
            <div className="templates-grid-v3">
              {STORY_TEMPLATES.map((t, index) => (
                <motion.button
                  key={t.id}
                  className={`template-btn-v3 enhanced ${templateUsed === t.text ? 'active' : ''}`}
                  onClick={() => {
                    updateData({ description: t.text });
                    setTemplateUsed(t.text);
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    delay: 1.1 + (index * 0.1),
                    type: "spring",
                    stiffness: 200
                  }}
                  whileHover={{ 
                    scale: 1.05,
                    y: -2,
                    transition: { type: "spring", stiffness: 400, damping: 10 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    animate={templateUsed === t.text ? {
                      rotate: [0, 360],
                      transition: { duration: 0.6 }
                    } : {}}
                  >
                    {t.icon}
                  </motion.div>
                  {t.label}
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );

  const renderUrgencyStep = () => (
    <motion.div 
      className="compact-step"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="step-intro"
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <motion.span 
          className="step-badge urgency-badge"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
        >
          <Target size={14} /> Passo 04
        </motion.span>
        <motion.h2
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          Qual o nível de urgência?
        </motion.h2>
        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          Isso ajuda a priorizar os pedidos mais críticos na comunidade.
        </motion.p>
      </motion.div>
      <motion.div 
        className="urgency-grid-v2"
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
      >
        {URGENCY_OPTIONS.map((opt, index) => (
          <motion.button
            key={opt.id}
            onClick={() => updateData({ urgency: opt.id })}
            className={`urgency-card-v2 enhanced ${formData.urgency === opt.id ? 'active' : ''}`}
            style={{ '--urg-color': opt.color }}
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ 
              delay: 0.8 + (index * 0.1),
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.03,
              y: -4,
              transition: { type: "spring", stiffness: 400, damping: 10 }
            }}
            whileTap={{ scale: 0.97 }}
          >
            <motion.div 
              className="urg-icon-v2"
              whileHover={{ 
                rotate: [0, -10, 10, 0],
                transition: { duration: 0.5 }
              }}
            >
              {opt.icon}
            </motion.div>
            <div className="urg-body-v2">
              <div className="urg-header-v2">
                <strong>{opt.label}</strong>
                <motion.span 
                  className="urg-time-badge"
                  animate={formData.urgency === opt.id ? {
                    scale: [1, 1.1, 1],
                    transition: { duration: 0.5 }
                  } : {}}
                >
                  {opt.time}
                </motion.span>
              </div>
              <span>{opt.desc}</span>
            </div>
            <motion.div 
              className="urg-check-v2"
              animate={formData.urgency === opt.id ? {
                scale: [0, 1.2, 1],
                rotate: [0, 180, 360]
              } : { scale: 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              {formData.urgency === opt.id && <Check size={20} />}
            </motion.div>
            {formData.urgency === opt.id && (
              <motion.div
                className="urgency-glow"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                style={{ backgroundColor: opt.color }}
              />
            )}
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );

  const renderVisibilityStep = () => (
    <div className="compact-step">
      <div className="step-intro">
        <span className="step-badge">Passo 05</span>
        <h2>Quem deve ver seu pedido?</h2>
        <p>Defina o alcance geográfico e o público-alvo da sua solicitação.</p>
      </div>

      <div className="visibility-layout-vertical-v4">
        <div className="vis-grid-v4">
          {VISIBILITY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => updateData({ visibility: toggleArrayItem(formData.visibility, opt.id) })}
              className={`vis-card-v4 ${formData.visibility.includes(opt.id) ? 'active' : ''}`}
              style={{ '--vis-color': opt.color }}
            >
              <div className="vis-icon-v4">{opt.icon}</div>
              <div className="vis-text-v4">
                <strong>{opt.label}</strong>
              </div>
            </button>
          ))}
        </div>

        <div className="vis-map-section-v4">
          <MapaAlcance 
            radius={formData.radius} 
            onRadiusChange={(r) => updateData({ radius: r })} 
          />
        </div>
      </div>
    </div>
  );

  const renderConfirmationStep = () => {
    const catColor = selectedCategory?.color;
    const details = CATEGORY_DETAILS[formData.category];
    
    return (
      <motion.div 
        className="compact-step"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.div 
          className="finish-header-v2"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <motion.div 
            className="finish-check-v2 enhanced"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              delay: 0.4, 
              type: "spring", 
              stiffness: 200,
              damping: 10
            }}
          >
            <motion.div
              animate={{
                rotate: [0, 360],
                scale: [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Rocket size={32} />
            </motion.div>
          </motion.div>
          <motion.h2
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Confirme seus dados
          </motion.h2>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Veja como seu pedido aparecerá para os vizinhos.
          </motion.p>
        </motion.div>

        <motion.div 
          className="review-card-v2 enhanced"
          initial={{ y: 40, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.6, type: "spring" }}
          whileHover={{ 
            scale: 1.02,
            boxShadow: '0 20px 40px -10px rgba(0, 0, 0, 0.15)'
          }}
        >
          <div className="review-main">
            <motion.div 
              className="review-tags"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.4 }}
            >
              <motion.span 
                className="tag-v2 enhanced" 
                style={{ background: catColor + '15', color: catColor }}
                whileHover={{ scale: 1.05 }}
              >
                {formData.category}
              </motion.span>
              {selectedUrgency && (
                <motion.span 
                  className="tag-v2 enhanced" 
                  style={{ background: selectedUrgency.color + '15', color: selectedUrgency.color }}
                  whileHover={{ scale: 1.05 }}
                  animate={{
                    boxShadow: [
                      `0 0 0 0 ${selectedUrgency.color}20`,
                      `0 0 0 4px ${selectedUrgency.color}20`,
                      `0 0 0 0 ${selectedUrgency.color}20`
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                >
                  {selectedUrgency.icon} {formData.urgency.toUpperCase()}
                </motion.span>
              )}
            </motion.div>
            <motion.div 
              className="review-quote enhanced"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.4 }}
            >
              <p>&ldquo;{formData.description}&rdquo;</p>
            </motion.div>
            {formData.subCategory.length > 0 && (
              <motion.div 
                className="review-details"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1.0, duration: 0.4 }}
              >
                <strong>Itens:</strong> {formData.subCategory.map(id => details?.options.find(o => o.id === id)?.label).join(', ')}
              </motion.div>
            )}
          </div>
          <motion.div 
            className="review-meta"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.4 }}
          >
            <motion.div 
              className="meta-item-v2"
              whileHover={{ scale: 1.05 }}
            >
              <MapPin size={16} /> <span>{formData.radius}km de alcance</span>
            </motion.div>
            <div className="meta-toggle-review">
              <label className="vis-switch-v3 enhanced">
                <input type="checkbox" checked={formData.isPublic} onChange={(e) => updateData({ isPublic: e.target.checked })} />
                <motion.div 
                  className="vis-switch-body-v3"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div 
                    className="vis-switch-handle-v3"
                    animate={formData.isPublic ? {
                      rotate: [0, 360],
                      transition: { duration: 0.5 }
                    } : {}}
                  >
                    {formData.isPublic ? <Globe size={14} /> : <ShieldCheck size={14} />}
                  </motion.div>
                  <span>{formData.isPublic ? 'Pedido Público' : 'Pedido Privado'}</span>
                </motion.div>
              </label>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    );
  };

  const renderStepContent = () => {
    switch (step) {
      case 1: return renderCategoryStep();
      case 2: return renderDetailsStep();
      case 3: return renderDescriptionStep();
      case 4: return renderUrgencyStep();
      case 5: return renderVisibilityStep();
      case 6: return renderConfirmationStep();
      default: return null;
    }
  };

  const selectedUrgencyData = URGENCY_OPTIONS.find(o => o.id === formData.urgency);
  const urgencyColor = selectedUrgencyData?.color || '#f59e0b';
  const urgencyLabel = selectedUrgencyData?.label || 'MODERADA';
  const urgencyIcon = selectedUrgencyData?.icon || <Calendar size={16} />;

  return (
    <div className="novo-pedido-container">
      <div className="bg-blobs">
        <div className="blob blob-orange" />
        <div className="blob blob-blue" />
      </div>

      {/* Visual de Análise (Assistente de IA) */}
      {isAnalyzing && (
        <AnalyzingModal stages={stages} analysisStage={analysisStage} />
      )}

      {/* Modal de Pedido Publicado */}
      {isPublished && (
        <SuccessModal
          urgencyColor={urgencyColor}
          urgencyLabel={urgencyLabel}
          urgencyIcon={urgencyIcon}
          reason={analysis?.reason || 'Pedido validado com sucesso'}
          onClose={() => navigate('/quero-ajudar')}
        />
      )}

      {/* Modal de Inconsistência */}
      {isInconsistent && (
        <InconsistentModal
          onEdit={() => { setIsInconsistent(false); setStep(3); }}
          onClose={() => navigate('/')}
        />
      )}

      <div className="wizard-box-v2">
        <div className="wizard-sidebar-v2">
          <div className="sidebar-header-v2">
            <Heart size={24} className="logo-icon-v2" fill="#f97316" color="#f97316" />
            <div className="sidebar-brand-v2">
              <h3>Solidar</h3>
              <span>Criação de Pedido</span>
            </div>
          </div>
          
          <div className="sidebar-steps-v2">
            {STEP_LABELS.map((label, i) => (
              <div 
                key={i} 
                className={`step-indicator-v3 ${i + 1 === step ? 'active' : i + 1 < step ? 'completed' : ''}`}
              >
                <div className="indicator-dot-v3">
                  {i + 1 < step ? <Check size={18} /> : i + 1}
                </div>
                <div className="indicator-info-v3">
                  <span className="indicator-step-v3">Passo {i + 1}</span>
                  <span className="indicator-label-v3">{label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="sidebar-footer-v2">
            <div className="progress-info-v2">
              <span>Status</span>
              <strong>{Math.round((step / TOTAL_STEPS) * 100)}%</strong>
            </div>
            <div className="progress-bar-v2">
              <div className="progress-fill-v2" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
            </div>
          </div>
        </div>

        <div className="wizard-content-v2">
          <div className="content-body-v2">
            <div className="step-container-v2">
              <AnimatePresence mode="wait">
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="step-motion-container"
                >
                  {renderStepContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="content-actions-v2">
            <button
              onClick={prevStep}
              disabled={step === 1}
              className="btn-v2 btn-ghost"
            >
              <ChevronLeft size={18} /> Voltar
            </button>
            
            {step < TOTAL_STEPS ? (
              <button
                onClick={nextStep}
                disabled={!isStepValid}
                className="btn-v2 btn-primary"
              >
                Continuar <ArrowRight size={18} />
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={isSubmitting}
                className="btn-v2 btn-publish"
              >
                {isSubmitting ? 'Finalizando...' : 'Publicar Pedido'} {!isSubmitting && <Check size={18} />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}