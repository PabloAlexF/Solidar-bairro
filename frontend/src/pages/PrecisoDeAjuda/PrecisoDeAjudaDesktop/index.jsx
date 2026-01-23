import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../contexts/NotificationContext';
import { MapaAlcance } from './MapaAlcance';
import { AnalyzingModal, InconsistentModal, SuccessModal } from './modals';
import AnimatedParticles from '../AnimatedParticles';
import LandingHeader from '../../../components/layout/LandingHeader';
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
  Globe,
  Star,
  Wand2,
  Target,
  Rocket,
  ChevronDown,
  Bell
} from 'lucide-react';
import './styles.css';

const CATEGORIES = [
  { id: 'Alimentos', label: 'Alimentos', icon: <ShoppingCart size={32} />, color: '#f97316' },
  { id: 'Roupas', label: 'Roupas', icon: <Shirt size={32} />, color: '#3b82f6' },
  { id: 'Calçados', label: 'Calçados', icon: <Footprints size={32} />, color: '#6366f1' },
  { id: 'Medicamentos', label: 'Medicamentos', icon: <Pill size={32} />, color: '#10b981' },
  { id: 'Higiene', label: 'Higiene', icon: <Bath size={32} />, color: '#14b8a6' },
  { id: 'Contas', label: 'Contas', icon: <Receipt size={32} />, color: '#ef4444' },
  { id: 'Emprego', label: 'Emprego', icon: <Briefcase size={32} />, color: '#8b5cf6' },
  { id: 'Móveis', label: 'Móveis', icon: <Sofa size={32} />, color: '#f59e0b' },
  { id: 'Eletrodomésticos', label: 'Eletrodomésticos', icon: <Tv size={32} />, color: '#475569' },
  { id: 'Transporte', label: 'Transporte', icon: <Car size={32} />, color: '#0ea5e9' },
  { id: 'Outros', label: 'Outros', icon: <Plus size={32} />, color: '#94a3b8' },
];

const URGENCY_OPTIONS = [
  {
    id: 'emergencia',
    label: 'EMERGÊNCIA',
    desc: 'Situação de emergência imediata',
    icon: <AlertTriangle size={32} />,
    color: '#dc2626',
    time: 'Imediato',
    examples: ['Acidente grave', 'Doença crítica', 'Perigo iminente de vida'],
    priority: 'Máxima',
    response: '< 30 min'
  },
  {
    id: 'critico',
    label: 'CRÍTICO',
    desc: 'Risco imediato à saúde ou vida',
    icon: <AlertTriangle size={32} />,
    color: '#ef4444',
    time: 'Imediato',
    examples: ['Falta de medicamento vital', 'Risco de despejo hoje', 'Sem comida há 2+ dias'],
    priority: 'Máxima',
    response: '< 2 horas'
  },
  {
    id: 'urgente',
    label: 'URGENTE',
    desc: 'Necessário para as próximas 24h',
    icon: <Zap size={32} />,
    color: '#f97316',
    time: '24 horas',
    examples: ['Conta vencendo hoje', 'Entrevista amanhã', 'Medicamento acabando'],
    priority: 'Alta',
    response: '< 24 horas'
  },
  {
    id: 'moderada',
    label: 'MODERADA',
    desc: 'Pode aguardar alguns dias',
    icon: <Calendar size={32} />,
    color: '#f59e0b',
    time: '3-5 dias',
    examples: ['Roupas para inverno', 'Móveis básicos', 'Documentos'],
    priority: 'Média',
    response: '2-5 dias'
  },
  {
    id: 'recorrente',
    label: 'RECORRENTE',
    desc: 'Necessidade mensal constante',
    icon: <RefreshCcw size={32} />,
    color: '#6366f1',
    time: 'Mensal',
    examples: ['Cesta básica mensal', 'Medicamentos contínuos', 'Transporte regular'],
    priority: 'Contínua',
    response: 'Agendado'
  },
  {
    id: 'tranquilo',
    label: 'TRANQUILO',
    desc: 'Sem prazo rígido',
    icon: <Coffee size={32} />,
    color: '#10b981',
    time: 'Sem pressa',
    examples: ['Melhorias gerais', 'Itens extras', 'Complementos'],
    priority: 'Baixa',
    response: '1-2 semanas'
  },
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
        label: 'Cesta Básica Completa', 
        desc: 'Arroz, feijão, óleo, açúcar, sal, café, macarrão.', 
        color: '#f97316',
        contextInfo: 'Uma cesta básica padrão costuma alimentar uma família de 4 pessoas por cerca de 15 dias.',
        subQuestions: [
          { id: 'itens_cesta', label: 'Itens de maior necessidade?', type: 'chips', options: ['Arroz', 'Feijão', 'Óleo', 'Açúcar', 'Café', 'Leite', 'Macarrão', 'Sal', 'Farinha'] },
          { id: 'familia', label: 'Tamanho da Família?', type: 'select', options: ['1-2 pessoas', '3-4 pessoas', '5 ou mais'] },
          { id: 'restricao', label: 'Alguma restrição alimentar?', type: 'input', placeholder: 'Ex: Diabético, Intolerante a Lactose...' }
        ]
      },
      { id: 'cereais_graos', label: 'Cereais & Grãos', desc: 'Arroz, feijão, lentilha, grão-de-bico, quinoa.', color: '#d97706' },
      { id: 'proteinas_carnes', label: 'Carnes & Aves', desc: 'Carne bovina, frango, peixe, linguiça.', color: '#ef4444' },
      { id: 'ovos_laticinios', label: 'Ovos & Laticínios', desc: 'Ovos, leite, queijo, iogurte, manteiga.', color: '#f59e0b' },
      { id: 'frutas_frescas', label: 'Frutas Frescas', desc: 'Banana, maçã, laranja, mamão, abacaxi.', color: '#10b981' },
      { id: 'verduras_legumes', label: 'Verduras & Legumes', desc: 'Alface, tomate, cebola, batata, cenoura.', color: '#059669' },
      { id: 'padaria_matinal', label: 'Padaria & Café da Manhã', desc: 'Pão, biscoito, café, achocolatado, aveia.', color: '#8b5cf6' },
      { id: 'temperos_condimentos', label: 'Temperos & Condimentos', desc: 'Sal, açúcar, óleo, vinagre, alho, cebola.', color: '#475569' },
      { id: 'massas_farinhas', label: 'Massas & Farinhas', desc: 'Macarrão, farinha de trigo, fubá, polvilho.', color: '#6366f1' },
      { id: 'enlatados_conservas', label: 'Enlatados & Conservas', desc: 'Sardinha, atum, milho, ervilha, molho de tomate.', color: '#dc2626' },
      { id: 'bebidas_sucos', label: 'Bebidas & Sucos', desc: 'Suco natural, refrigerante, água, chá.', color: '#0ea5e9' },
      { id: 'doces_sobremesas', label: 'Doces & Sobremesas', desc: 'Chocolate, bolo, pudim, gelatina, sorvete.', color: '#ec4899' },
      { id: 'alimentacao_infantil', label: 'Alimentação Infantil', desc: 'Papinha, fórmula, leite em pó, mingau, biscoito.', color: '#f43f5e' },
      { id: 'alimentacao_especial', label: 'Alimentação Especial', desc: 'Sem glúten, sem lactose, diabético, vegano.', color: '#7c3aed' },
      { id: 'refeicoes_prontas', label: 'Refeições Prontas', desc: 'Marmitas, comida congelada, lanches prontos.', color: '#f97316' },
      { id: 'merenda_escolar', label: 'Merenda & Lanche', desc: 'Biscoito, suco de caixinha, fruta, sanduíche.', color: '#14b8a6' },
      { id: 'produtos_limpeza_cozinha', label: 'Limpeza da Cozinha', desc: 'Detergente, esponja, pano de prato, álcool.', color: '#64748b' },
      { id: 'utensilios_cozinha', label: 'Utensílios de Cozinha', desc: 'Panela, prato, copo, talher, tábua de corte.', color: '#374151' },
    ]
  },
  Roupas: {
    options: [
      { id: 'roupas_inverno', label: 'Roupas de Inverno', desc: 'Casacos, blusas de lã, cachecol, luvas.', color: '#1e40af' },
      { id: 'roupas_verao', label: 'Roupas de Verão', desc: 'Camisetas, bermudas, vestidos leves, shorts.', color: '#f59e0b' },
      { id: 'uniforme_escolar', label: 'Uniforme Escolar', desc: 'Kits da rede municipal/estadual completos.', color: '#6366f1' },
      { id: 'uniforme_trabalho', label: 'Uniforme de Trabalho', desc: 'Aventais, jalecos, uniformes profissionais.', color: '#475569' },
      { id: 'roupa_social', label: 'Roupa Social', desc: 'Camisa, calça social, blazer para entrevistas.', color: '#374151' },
      { id: 'roupa_esportiva', label: 'Roupa Esportiva', desc: 'Camiseta de time, bermuda, calça de ginastica.', color: '#10b981' },
      { id: 'roupas_intimas', label: 'Roupas Íntimas', desc: 'Cueca, calcinha, sutiã, meias (NOVAS).', color: '#f43f5e' },
      { id: 'roupas_gestante', label: 'Roupas de Gestante', desc: 'Blusas, vestidos, calças para grávidas.', color: '#ec4899' },
      { id: 'enxoval_bebe', label: 'Enxoval de Bebê', desc: 'Body, macacão, manta, touca, luva.', color: '#f472b6' },
      { id: 'roupas_crianca', label: 'Roupas Infantis', desc: 'Tamanhos 1 a 14 anos, masculino e feminino.', color: '#8b5cf6' },
      { id: 'roupas_adolescente', label: 'Roupas de Adolescente', desc: 'Tamanhos juvenis, roupas da moda.', color: '#6366f1' },
      { id: 'pijamas_dormir', label: 'Pijamas & Camisolas', desc: 'Roupas para dormir, camisola, pijama.', color: '#14b8a6' },
      { id: 'acessorios_roupas', label: 'Acessórios', desc: 'Cinto, boné, chapéu, bolsa, mochila.', color: '#059669' },
      { id: 'roupas_especiais', label: 'Roupas Especiais', desc: 'Festa, casamento, formatura, eventos.', color: '#7c3aed' },
      { id: 'cama_mesa_banho', label: 'Cama, Mesa & Banho', desc: 'Lençol, cobertor, toalha, cortina.', color: '#0ea5e9' },
    ],
    sizes: ['RN', 'P', 'M', 'G', 'GG', 'EXG', '1-2 anos', '3-4 anos', '5-6 anos', '7-8 anos', '9-10 anos', '11-12 anos', '13-14 anos', 'PP', 'P', 'M', 'G', 'GG', 'EXG'],
    styles: ['Masculino', 'Feminino', 'Unissex', 'Infantil Masculino', 'Infantil Feminino', 'Bebê']
  },
  Calçados: {
    options: [
      { id: 'tenis_esportivo', label: 'Tênis Esportivo', desc: 'Para exercícios, caminhadas e corridas.', color: '#10b981' },
      { id: 'tenis_casual', label: 'Tênis Casual', desc: 'Para uso diário, escola e passeios.', color: '#059669' },
      { id: 'sapato_social_masculino', label: 'Sapato Social Masculino', desc: 'Para trabalho, entrevistas e eventos.', color: '#475569' },
      { id: 'sapato_social_feminino', label: 'Sapato Social Feminino', desc: 'Scarpin, sapato baixo para trabalho.', color: '#374151' },
      { id: 'sandalia_feminina', label: 'Sandália Feminina', desc: 'Rasteirinha, sandália de salto baixo.', color: '#ec4899' },
      { id: 'chinelos_havaianas', label: 'Chinelos & Havaianas', desc: 'Para uso doméstico e praia.', color: '#f59e0b' },
      { id: 'botas_trabalho', label: 'Botas de Trabalho', desc: 'Bota de segurança, botina com bico de aço.', color: '#dc2626' },
      { id: 'botas_chuva', label: 'Botas de Chuva', desc: 'Galocha, bota impermeável.', color: '#0ea5e9' },
      { id: 'calcados_infantis', label: 'Calçados Infantis', desc: 'Tênis, sapato, sandália para crianças.', color: '#8b5cf6' },
      { id: 'calcados_bebe', label: 'Calçados de Bebê', desc: 'Sapatinho, meia-calça, pantufinha.', color: '#f472b6' },
      { id: 'calcados_idoso', label: 'Calçados para Idosos', desc: 'Sapato ortopédico, confortável.', color: '#6b7280' },
      { id: 'palmilhas_acessorios', label: 'Palmilhas & Acessórios', desc: 'Palmilha, meia, proteção para pés.', color: '#64748b' },
    ],
    sizes: ['15', '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44', '45', '46', '47', '48'],
    styles: ['Masculino', 'Feminino', 'Infantil Masculino', 'Infantil Feminino', 'Bebê', 'Unissex']
  },
  Medicamentos: {
    options: [
      { id: 'pressao_alta', label: 'Pressão Alta', desc: 'Losartana, Enalapril, Captopril, Amlodipina.', color: '#ef4444' },
      { id: 'diabetes', label: 'Diabetes', desc: 'Metformina, Glibenclamida, Insulina.', color: '#dc2626' },
      { id: 'analgesicos_antitermicos', label: 'Analgésicos & Antitérmicos', desc: 'Dipirona, Paracetamol, Ibuprofeno, Aspirina.', color: '#10b981' },
      { id: 'asma_bronquite', label: 'Asma & Bronquite', desc: 'Salbutamol, Beclometasona, bombinhas.', color: '#0ea5e9' },
      { id: 'antibioticos', label: 'Antibióticos', desc: 'Amoxicilina, Azitromicina (com receita).', color: '#8b5cf6' },
      { id: 'saude_mental', label: 'Saúde Mental', desc: 'Antidepressivos, ansioliticos (controlados).', color: '#ec4899' },
      { id: 'antiinflamatorios', label: 'Anti-inflamatórios', desc: 'Diclofenaco, Nimesulida, Cetoprofeno.', color: '#f59e0b' },
      { id: 'gastrico_digestivo', label: 'Gástrico & Digestivo', desc: 'Omeprazol, Ranitidina, Dimeticona.', color: '#14b8a6' },
      { id: 'cardiaco', label: 'Cardíaco', desc: 'AAS, Sinvastatina, Propranolol.', color: '#f43f5e' },
      { id: 'hormonal_tireoidiano', label: 'Hormonal & Tireoide', desc: 'Levotiroxina, Puran, hormônios.', color: '#7c3aed' },
      { id: 'vitaminas_suplementos', label: 'Vitaminas & Suplementos', desc: 'Complexo B, Vitamina D, Ferro, Cálcio.', color: '#059669' },
      { id: 'pediatrico', label: 'Medicamentos Pediátricos', desc: 'Xaropes, gotas, medicamentos infantis.', color: '#f472b6' },
      { id: 'geriatrico', label: 'Medicamentos Geriátricos', desc: 'Medicamentos para idosos, doses especiais.', color: '#6b7280' },
      { id: 'dermatologico', label: 'Dermatológico', desc: 'Pomadas, cremes, antifúngicos.', color: '#64748b' },
      { id: 'oftalmico_otologico', label: 'Oftálmico & Otológico', desc: 'Colírios, gotas para ouvido.', color: '#475569' },
    ]
  },
  Higiene: {
    options: [
      { id: 'kit_banho_completo', label: 'Kit Banho Completo', desc: 'Sabonete, shampoo, condicionador, esponja.', color: '#14b8a6' },
      { id: 'saude_bucal', label: 'Saúde Bucal', desc: 'Pasta de dente, escova, fio dental, enxaguante.', color: '#0d9488' },
      { id: 'higiene_intima_feminina', label: 'Higiene Íntima Feminina', desc: 'Absorvente, protetor diário, sabonete íntimo.', color: '#ec4899' },
      { id: 'fraldas_infantis', label: 'Fraldas Infantis', desc: 'Tamanhos RN, P, M, G, XG, XXG.', color: '#6366f1' },
      { id: 'fraldas_geriatricas', label: 'Fraldas Geriátricas', desc: 'Uso adulto tamanhos M, G, GG, EXG.', color: '#8b5cf6' },
      { id: 'produtos_cabelo', label: 'Produtos para Cabelo', desc: 'Shampoo, condicionador, creme para pentear.', color: '#f59e0b' },
      { id: 'desodorante_perfume', label: 'Desodorante & Perfume', desc: 'Desodorante roll-on, aerosol, perfume.', color: '#10b981' },
      { id: 'cuidados_pele', label: 'Cuidados com a Pele', desc: 'Hidratante, protetor solar, sabonete facial.', color: '#f97316' },
      { id: 'higiene_masculina', label: 'Higiene Masculina', desc: 'Espuma de barbear, lâmina, pós-barba.', color: '#475569' },
      { id: 'limpeza_casa', label: 'Limpeza da Casa', desc: 'Detergente, sabão em pó, amaciante, álcool.', color: '#059669' },
      { id: 'papel_higienico', label: 'Papel Higiênico & Toalha', desc: 'Papel higiênico, papel toalha, lenco.', color: '#64748b' },
      { id: 'produtos_limpeza_pesada', label: 'Limpeza Pesada', desc: 'Desinfetante, água sanitária, multiuso.', color: '#374151' },
      { id: 'higiene_bebe', label: 'Higiene do Bebê', desc: 'Shampoo bebê, sabonete, óleo, talco.', color: '#f472b6' },
      { id: 'acessorios_higiene', label: 'Acessórios de Higiene', desc: 'Escova de cabelo, pente, cortador de unha.', color: '#6b7280' },
    ]
  },
  Contas: {
    options: [
      { id: 'conta_luz', label: 'Conta de Luz', desc: 'Evitar corte de energia elétrica.', color: '#ef4444' },
      { id: 'conta_agua', label: 'Conta de Água', desc: 'Manter abastecimento de água.', color: '#3b82f6' },
      { id: 'gas_cozinha', label: 'Gás de Cozinha', desc: 'Recarga de botijão 13kg ou gás encanado.', color: '#f97316' },
      { id: 'apoio_aluguel', label: 'Apoio com Aluguel', desc: 'Ajuda para evitar despejo.', color: '#dc2626' },
      { id: 'internet_telefone', label: 'Internet & Telefone', desc: 'Para estudo, trabalho remoto ou comunicação.', color: '#6366f1' },
      { id: 'financiamento_casa', label: 'Financiamento da Casa', desc: 'Prestação da casa própria.', color: '#8b5cf6' },
      { id: 'condominio_iptu', label: 'Condomínio & IPTU', desc: 'Taxas prediais e condominiais.', color: '#059669' },
      { id: 'plano_saude', label: 'Plano de Saúde', desc: 'Mensalidade do convênio médico.', color: '#10b981' },
      { id: 'educacao_escola', label: 'Educação & Escola', desc: 'Mensalidade, material escolar, uniforme.', color: '#f59e0b' },
      { id: 'transporte_publico', label: 'Transporte Público', desc: 'Recarga de cartão, passagens.', color: '#0ea5e9' },
      { id: 'seguro_veiculo', label: 'Seguro do Veículo', desc: 'IPVA, seguro obrigatório, licenciamento.', color: '#475569' },
      { id: 'emprestimo_cartao', label: 'Empréstimo & Cartão', desc: 'Quitação de dívidas urgentes.', color: '#f43f5e' },
    ]
  },
  Emprego: {
    options: [
      { id: 'curriculo_impressao', label: 'Currículo & Impressão', desc: 'Elaboração, revisão e impressão.', color: '#8b5cf6' },
      { id: 'qualificacao_cursos', label: 'Qualificação & Cursos', desc: 'Cursos técnicos, profissionalizantes.', color: '#7c3aed' },
      { id: 'epis_uniforme_trabalho', label: 'EPIs & Uniforme', desc: 'Botinas, luvas, capacete, roupas de trabalho.', color: '#059669' },
      { id: 'ferramentas_profissionais', label: 'Ferramentas Profissionais', desc: 'Para pedreiro, eletricista, encanador.', color: '#dc2626' },
      { id: 'transporte_entrevistas', label: 'Transporte para Entrevistas', desc: 'Passagens, combustível para entrevistas.', color: '#0ea5e9' },
      { id: 'documentacao_trabalho', label: 'Documentação', desc: 'Carteira de trabalho, CPF, RG, certidões.', color: '#f59e0b' },
      { id: 'capacitacao_digital', label: 'Capacitação Digital', desc: 'Informática básica, redes sociais.', color: '#6366f1' },
      { id: 'material_vendas', label: 'Material para Vendas', desc: 'Produtos para revenda, carrinho, balanca.', color: '#10b981' },
      { id: 'licencas_alvaras', label: 'Licenças & Alvarás', desc: 'Documentação para trabalho autônomo.', color: '#f97316' },
      { id: 'equipamentos_beleza', label: 'Equipamentos de Beleza', desc: 'Para manicure, cabeleireira, estética.', color: '#ec4899' },
      { id: 'material_limpeza_profissional', label: 'Material de Limpeza', desc: 'Para serviços de limpeza profissional.', color: '#14b8a6' },
    ]
  },
  Móveis: {
    options: [
      { id: 'cama_solteiro', label: 'Cama de Solteiro', desc: 'Cama ou colchão de solteiro.', color: '#f59e0b' },
      { id: 'cama_casal', label: 'Cama de Casal', desc: 'Cama ou colchão de casal.', color: '#d97706' },
      { id: 'berco_bebe', label: 'Berço & Móveis de Bebê', desc: 'Berço, cômoda, trocador.', color: '#ec4899' },
      { id: 'sofa_poltrona', label: 'Sofá & Poltrona', desc: 'Para sala de estar, descanso.', color: '#6366f1' },
      { id: 'mesa_jantar', label: 'Mesa de Jantar', desc: 'Mesa com cadeiras para refeições.', color: '#8b5cf6' },
      { id: 'armario_cozinha', label: 'Armário de Cozinha', desc: 'Paneleiro, armário suspenso.', color: '#059669' },
      { id: 'guarda_roupa', label: 'Guarda-roupa', desc: 'Roupeiro para o quarto.', color: '#10b981' },
      { id: 'estante_prateleira', label: 'Estante & Prateleira', desc: 'Para livros, objetos, organização.', color: '#0ea5e9' },
      { id: 'mesa_estudo', label: 'Mesa de Estudo', desc: 'Escrivaninha, cadeira para estudos.', color: '#f97316' },
      { id: 'rack_tv', label: 'Rack & Suporte TV', desc: 'Móvel para televisão e equipamentos.', color: '#475569' },
      { id: 'moveis_banheiro', label: 'Móveis de Banheiro', desc: 'Gabinete, espelheira, prateleiras.', color: '#14b8a6' },
      { id: 'moveis_varanda', label: 'Móveis de Varanda', desc: 'Mesa, cadeira para área externa.', color: '#64748b' },
    ]
  },
  Eletrodomésticos: {
    options: [
      { id: 'geladeira_freezer', label: 'Geladeira & Freezer', desc: 'Fundamental para conservar alimentos.', color: '#475569' },
      { id: 'fogao_cooktop', label: 'Fogão & Cooktop', desc: 'Para preparo de refeições.', color: '#334155' },
      { id: 'maquina_lavar_roupa', label: 'Máquina de Lavar', desc: 'Lavar roupas, tanquinho.', color: '#0ea5e9' },
      { id: 'microondas', label: 'Micro-ondas', desc: 'Aquecimento rápido de alimentos.', color: '#64748b' },
      { id: 'ventilador_ar', label: 'Ventilador & Ar Condicionado', desc: 'Para dias de calor intenso.', color: '#06b6d4' },
      { id: 'televisao', label: 'Televisão', desc: 'TV, conversor digital, antena.', color: '#374151' },
      { id: 'ferro_passar', label: 'Ferro de Passar', desc: 'Tábua e ferro para roupas.', color: '#6b7280' },
      { id: 'liquidificador_batedeira', label: 'Liquidificador & Batedeira', desc: 'Para preparo de alimentos.', color: '#10b981' },
      { id: 'aspirador_po', label: 'Aspirador de Pó', desc: 'Limpeza de carpetes e sofás.', color: '#8b5cf6' },
      { id: 'aquecedor_agua', label: 'Aquecedor de Água', desc: 'Chuveiro elétrico, boiler.', color: '#f97316' },
      { id: 'eletronicos_pequenos', label: 'Eletrônicos Pequenos', desc: 'Torradeira, cafeteira, sanduicheira.', color: '#f59e0b' },
      { id: 'som_radio', label: 'Som & Rádio', desc: 'Aparelho de som, rádio, caixa de som.', color: '#ec4899' },
    ]
  },
  Transporte: {
    options: [
      { id: 'passagens_onibus', label: 'Passagens de Ônibus', desc: 'Ônibus urbano, intermunicipal, TRI/TEU.', color: '#0ea5e9' },
      { id: 'passagens_metro_trem', label: 'Metrô & Trem', desc: 'Transporte sobre trilhos, integração.', color: '#3b82f6' },
      { id: 'bicicleta', label: 'Bicicleta', desc: 'Para trabalho, escola, exercícios.', color: '#10b981' },
      { id: 'combustivel_veiculo', label: 'Combustível', desc: 'Gasolina, álcool, diesel para veículo.', color: '#f97316' },
      { id: 'manutencao_veiculo', label: 'Manutenção de Veículo', desc: 'Conserto, peças, pneu, bateria.', color: '#dc2626' },
      { id: 'apoio_carona', label: 'Apoio com Carona', desc: 'Consultas médicas, emergências.', color: '#ec4899' },
      { id: 'pecas_moto', label: 'Peças de Moto', desc: 'Para quem trabalha com delivery.', color: '#f59e0b' },
      { id: 'taxi_uber', label: 'Taxi & Uber', desc: 'Transporte de emergência, consultas.', color: '#8b5cf6' },
      { id: 'cadeira_rodas', label: 'Cadeira de Rodas', desc: 'Mobilidade para pessoas com deficiência.', color: '#6366f1' },
      { id: 'transporte_escolar', label: 'Transporte Escolar', desc: 'Van, ônibus escolar para crianças.', color: '#059669' },
    ]
  },
  Outros: {
    options: [
      { id: 'educacao_cursos', label: 'Educação & Cursos', desc: 'Material escolar, livros, cursos online.', color: '#6366f1' },
      { id: 'saude_consultas', label: 'Saúde & Consultas', desc: 'Consultas médicas, exames, tratamentos.', color: '#10b981' },
      { id: 'juridico_documentos', label: 'Jurídico & Documentos', desc: 'Advogado, cartório, certidões.', color: '#8b5cf6' },
      { id: 'tecnologia_equipamentos', label: 'Tecnologia', desc: 'Celular, computador, tablet, internet.', color: '#0ea5e9' },
      { id: 'animais_estimacao', label: 'Animais de Estimação', desc: 'Ração, veterinário, medicamentos.', color: '#f59e0b' },
      { id: 'reforma_casa', label: 'Reforma da Casa', desc: 'Material de construção, mão de obra.', color: '#dc2626' },
      { id: 'lazer_cultura', label: 'Lazer & Cultura', desc: 'Livros, brinquedos, jogos, passeios.', color: '#ec4899' },
      { id: 'servicos_domesticos', label: 'Serviços Domésticos', desc: 'Faxina, jardinagem, consertos.', color: '#059669' },
      { id: 'emergencia_funeral', label: 'Emergência & Funeral', desc: 'Situações de emergência, óbito.', color: '#374151' },
      { id: 'outros_ajuda', label: 'Outro Tipo de Ajuda', desc: 'Algo que não está nas categorias.', color: '#94a3b8' }
    ]
  }
};

const STORY_TEMPLATES = [
  { id: 'familia', label: 'Família', icon: <Users size={20} />, text: 'Preciso de ajuda com alimentos para minha família de [X] pessoas. Estamos passando por um momento difícil e qualquer contribuição de cesta básica seria muito bem-vinda.' },
  { id: 'saude', label: 'Saúde', icon: <Pill size={20} />, text: 'Estou precisando de ajuda para adquirir o medicamento [Nome] para uso contínuo. Não estou conseguindo arcar com os custos este mês devido a [Motivo].' },
  { id: 'emprego', label: 'Emprego', icon: <Briefcase size={20} />, text: 'Estou em busca de recolocação profissional e precisaria de ajuda com passagens de ônibus para comparecer a entrevistas ou ajuda para imprimir currículos.' },
];

const STEP_LABELS = ['Categoria', 'Detalhes', 'História', 'Urgência', 'Visibilidade', 'Confirmação'];
const TOTAL_STEPS = 6;

export function PrecisoDeAjudaDesktop() {
  const navigate = useNavigate();
  const { notifications, getUnreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [selectedSubModal, setSelectedSubModal] = useState(null);
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [templateUsed, setTemplateUsed] = useState(null);
  const [recognition, setRecognition] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
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
    radius: 5,
    userLocation: null,
    locationString: '',
    city: '',
    state: '',
    neighborhood: ''
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications) {
        const notificationElement = document.querySelector('.pda-notifications');
        if (notificationElement && !notificationElement.contains(event.target)) {
          setShowNotifications(false);
        }
      }
      if (showUserMenu) {
        const userElement = document.querySelector('.pda-user-avatar');
        if (userElement && !userElement.contains(event.target)) {
          setShowUserMenu(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showNotifications, showUserMenu]);

  useEffect(() => {
    if (navigator.geolocation) {
      const options = { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 };
      
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(coords);
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}&addressdetails=1&zoom=18`
            );
            const data = await response.json();
            
            if (data?.address) {
              const address = data.address;
              const bairro = address.suburb || address.neighbourhood || address.quarter || address.city_district || '';
              const cidade = address.city || address.town || address.village || address.municipality || '';
              const estado = address.state || address.region || '';
              
              let locationString = bairro ? `${bairro}, ` : '';
              locationString += `${cidade} - ${estado}`;
              
              updateData({ 
                userLocation: coords,
                locationString,
                city: cidade,
                state: estado,
                neighborhood: bairro
              });
            }
          } catch {
            setLocationError('Localização obtida, mas não foi possível determinar o endereço');
          }
        },
        () => {
          setLocationError('Não foi possível obter sua localização');
          setUserLocation({ lat: -23.5505, lng: -46.6333 });
          updateData({ 
            userLocation: { lat: -23.5505, lng: -46.6333 },
            locationString: 'São Paulo, SP - Centro',
            city: 'São Paulo',
            state: 'SP',
            neighborhood: 'Centro'
          });
        },
        options
      );
    } else {
      setLocationError('Geolocalização não suportada');
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
      updateData({ 
        userLocation: { lat: -23.5505, lng: -46.6333 },
        locationString: 'São Paulo, SP - Centro',
        city: 'São Paulo',
        state: 'SP',
        neighborhood: 'Centro'
      });
    }
  }, [updateData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognitionAPI = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognitionAPI) {
        const recognitionInstance = new SpeechRecognitionAPI();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = 'pt-BR';
        recognitionInstance.maxAlternatives = 1;

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
  }, []);

  const toggleRecording = () => {
    if (!recognition) {
      alert("Seu navegador não suporta gravação de áudio por voz.");
      return;
    }

    if (isRecording) {
      recognition.stop();
      setIsRecording(false);
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

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
    
    try {
      // Simulate analysis stages
      for (let i = 0; i < stages.length; i++) {
        setAnalysisStage(i);
        await new Promise(resolve => setTimeout(resolve, 1500));
      }
      
      setIsAnalyzing(false);
      
      // Prepare data for API
      const pedidoData = {
        category: formData.category,
        subCategory: formData.subCategory,
        description: formData.description,
        urgency: formData.urgency,
        visibility: formData.visibility,
        radius: formData.radius,
        // Estrutura corrigida para o backend
        locationString: formData.locationString,
        city: formData.city,
        state: formData.state,
        neighborhood: formData.neighborhood,
        coordinates: formData.userLocation,
        isPublic: formData.isPublic,
        subQuestionAnswers: formData.subQuestionAnswers
      };
      
      // Import ApiService dynamically
      const { default: ApiService } = await import('../../../services/apiService');
      
      // Call API to create pedido
      const response = await ApiService.createPedido(pedidoData);
      
      if (response.success) {
        // Criar notificação para nova ajuda
        const { NotificationManager } = await import('../../../utils/notifications');
        NotificationManager.createHelpNotification({
          userName: 'Alguém',
          category: formData.category,
          neighborhood: formData.neighborhood || 'Região próxima'
        });
        
        setAnalysis({
          reason: 'Pedido criado com sucesso! Sua solicitação já está visível na rede Solidar.'
        });
        setIsPublished(true);
      } else {
        throw new Error(response.error || 'Erro ao criar pedido');
      }
    } catch (error) {
      console.error('Erro ao publicar pedido:', error);
      setIsAnalyzing(false);
      
      // Check if it's a validation error or server error
      if (error.message.includes('validação') || error.message.includes('inconsistent')) {
        setIsInconsistent(true);
      } else {
        // Show generic error
        alert('Erro ao publicar pedido: ' + error.message);
      }
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, stages.length]);

  const selectedCategory = useMemo(() => 
    CATEGORIES.find(c => c.id === formData.category), 
    [formData.category]
  );

  const selectedUrgency = useMemo(() => 
    URGENCY_OPTIONS.find(o => o.id === formData.urgency),
    [formData.urgency]
  );

  const toggleArrayItem = useCallback((array, item) => {
    return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
  }, []);

  const renderCategoryStep = () => (
    <motion.div 
      className="pda-compact-step"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      <div className="pda-step-intro">
        <span className="pda-step-badge" style={{ background: 'var(--pda-primary)' }}>
          CATEGORIA PRINCIPAL
        </span>
        <h2>Qual o foco da sua necessidade?</h2>
        <p>A Solidar conecta você com vizinhos dispostos a ajudar. Escolha uma categoria para começar.</p>
      </div>

      <div className="pda-scroll-hint">
        <ChevronDown size={20} />
        <span>Role para baixo para ver todas as categorias</span>
      </div>

      <div className="pda-categories-grid-compact" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', paddingBottom: '2rem' }}>
        {CATEGORIES.map((cat, index) => (
          <motion.button
            key={cat.id}
            onClick={() => updateData({ category: cat.id, subCategory: [] })}
            className={`pda-cat-item ${formData.category === cat.id ? 'active' : ''}`}
            whileHover={{ scale: 1.02, translateY: -2 }}
            whileTap={{ scale: 0.98 }}
            style={{ 
              '--cat-color': cat.color,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
              background: formData.category === cat.id ? `${cat.color}15` : 'white',
              border: `2px solid ${formData.category === cat.id ? cat.color : '#e2e8f0'}`,
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              height: '100%',
              minHeight: '140px'
            }}
          >
            <div className="pda-cat-icon-box" style={{ color: cat.color, marginBottom: '1rem' }}>
              {cat.icon}
            </div>
            <span className="pda-cat-text" style={{ fontWeight: '600', color: '#334155' }}>{cat.label}</span>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  const renderDetailsStep = () => {
    const details = CATEGORY_DETAILS[formData.category];
    
    if (!details) return null;

    return (
      <motion.div 
        className="pda-compact-step"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
      >
        <div className="pda-step-intro">
          <span className="pda-step-badge" style={{ background: selectedCategory?.color }}>
            {formData.category.toUpperCase()} • DETALHES
          </span>
          <h2>O que exatamente<br/>você precisa?</h2>
          <p>Selecione um ou mais itens dentro da categoria {formData.category}.</p>
        </div>

        <div className="pda-scroll-hint">
          <ChevronDown size={20} />
          <span>Role para baixo para ver todas as opções</span>
        </div>

        <div className="pda-options-grid-v3" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem', paddingBottom: '2rem' }}>
          {details.options.map((opt, index) => (
            <motion.button
              key={opt.id}
              onClick={() => updateData({ subCategory: toggleArrayItem(formData.subCategory, opt.id) })}
              className={`pda-opt-card-v3 ${formData.subCategory.includes(opt.id) ? 'active' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ 
                '--opt-color': opt.color,
                display: 'flex',
                alignItems: 'flex-start',
                padding: '1.25rem',
                background: formData.subCategory.includes(opt.id) ? `${opt.color}10` : 'white',
                border: `1px solid ${formData.subCategory.includes(opt.id) ? opt.color : '#e2e8f0'}`,
                borderRadius: '12px',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative'
              }}
            >
              <div className="pda-opt-check-v3" style={{ position: 'absolute', top: '10px', right: '10px', color: opt.color }}>
                {formData.subCategory.includes(opt.id) && <Check size={14} />}
              </div>
              <div className="pda-opt-body-v3">
                <strong style={{ display: 'block', marginBottom: '4px', color: '#334155' }}>{opt.label}</strong>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{opt.desc}</span>
              </div>
            </motion.button>
          ))}
        </div>
      </motion.div>
    );
  };

  const renderDescriptionStep = () => (
    <motion.div className="pda-compact-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="pda-step-intro">
        <span className="pda-step-badge" style={{ background: 'var(--pda-dark)' }}>
          HISTÓRIA E CONTEXTO
        </span>
        <h2>Conte sua<br/>história</h2>
        <p>A ajuda vem mais rápido quando as pessoas entendem o motivo e o contexto.</p>
      </div>

      <div className="pda-story-container-v4">
        <div className="pda-story-main-v4">
          <div className="pda-input-wrapper-v4">
            <textarea
              placeholder="Descreva sua necessidade aqui com o máximo de detalhes possível..."
              value={formData.description}
              onChange={(e) => updateData({ description: e.target.value.slice(0, 500) })}
              className="pda-textarea-v4"
            />
            
            <div className="pda-textarea-footer-v4">
              <div className="pda-voice-action-v4">
                <button
                  onClick={toggleRecording}
                  className={`pda-mic-btn-v4 ${isRecording ? 'recording' : ''}`}
                >
                  {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
                  {isRecording && <span className="pda-recording-pulse" />}
                </button>
                <span className="pda-voice-label-v4">
                  {isRecording ? 'Ouvindo...' : 'Ditar história'}
                </span>
              </div>

              <div className="pda-char-counter-v4">
                <div className="pda-counter-progress-v4">
                  <div 
                    className="pda-counter-fill-v4"
                    style={{ 
                      width: `${(formData.description.length / 500) * 100}%`,
                      background: formData.description.length > 450 ? 'var(--pda-danger)' : 
                                 formData.description.length > 400 ? 'var(--pda-warning)' : 
                                 'var(--pda-primary)' 
                    }}
                  />
                </div>
                <span>{formData.description.length}/500</span>
              </div>
            </div>
          </div>

          <div className="pda-templates-section-v4">
            <div className="pda-section-label-v4">
              <Sparkles size={16} />
              SUGESTÕES DE TEXTO
            </div>
            <div className="pda-templates-grid-v4">
              {STORY_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  className={`pda-template-card-v4 ${templateUsed === t.text ? 'active' : ''}`}
                  onClick={() => {
                    updateData({ description: t.text });
                    setTemplateUsed(t.text);
                  }}
                >
                  <div className="pda-template-icon-v4">{t.icon}</div>
                  <div className="pda-template-info-v4">
                    <strong>{t.label}</strong>
                    <span>Usar modelo</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="pda-story-tips-v4">
          <div className="pda-tips-header-v4">
            <Lightbulb size={20} />
            Dicas para uma boa história
          </div>
          <ul className="pda-tips-list-v4">
            <li><strong>Seja específico:</strong> Diga exatamente o que aconteceu e por que precisa de ajuda agora.</li>
            <li><strong>Mencione a urgência:</strong> Se houver um prazo crítico (ex: despejo, remédio acabando), deixe claro.</li>
            <li><strong>Tamanho da família:</strong> Informe quantas pessoas serão beneficiadas.</li>
            <li><strong>Fotos ajudam:</strong> Após publicar, você poderá adicionar fotos para aumentar a confiança.</li>
          </ul>
          
          <div className="pda-security-badge-v4">
            <ShieldCheck size={18} />
            Sua história será analisada por nossa IA de segurança antes de ser publicada.
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderUrgencyStep = () => (
    <motion.div className="pda-compact-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="pda-step-intro">
        <span className="pda-step-badge" style={{ background: 'var(--pda-danger)' }}>
          PRIORIDADE DO PEDIDO
        </span>
        <h2>Qual a urgência<br/>do seu pedido?</h2>
        <p>A escala de prioridade ajuda doadores e voluntários a agirem no tempo certo.</p>
      </div>

      <div className="pda-urgency-container-v3">
        <div className="pda-urgency-scale-v3">
          <div 
            className="pda-urgency-scale-fill-v3" 
            style={{ 
              height: formData.urgency === 'critico' ? '100%' : 
                      formData.urgency === 'urgente' ? '80%' : 
                      formData.urgency === 'moderada' ? '60%' : 
                      formData.urgency === 'tranquilo' ? '40%' : 
                      formData.urgency === 'recorrente' ? '20%' : '10%'
            }}
          />
          <span className="pda-urgency-level-label" style={{ top: '10%' }}>Crítico</span>
          <span className="pda-urgency-level-label" style={{ top: '50%' }}>Moderado</span>
          <span className="pda-urgency-level-label" style={{ top: '90%' }}>Baixo</span>
        </div>

        <div className="pda-urgency-grid-v3" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          {URGENCY_OPTIONS.map((opt, index) => (
            <motion.button
              key={opt.id}
              onClick={() => updateData({ urgency: opt.id })}
              className={`pda-urgency-card-v3 ${formData.urgency === opt.id ? 'active' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ 
                '--urg-color': opt.color,
                padding: '1.5rem',
                background: formData.urgency === opt.id ? `${opt.color}10` : 'white',
                border: `2px solid ${formData.urgency === opt.id ? opt.color : '#e2e8f0'}`,
                borderRadius: '16px',
                cursor: 'pointer',
                textAlign: 'left',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}
            >
              <div className="pda-urg-icon-v3">
                {opt.icon}
              </div>
              <div className="pda-urg-body-v3">
                <strong>{opt.label}</strong>
                <p>{opt.desc}</p>
                <div className="pda-urg-examples">
                  <span className="pda-examples-label">Exemplos:</span>
                  <ul>
                    {opt.examples.map((example, i) => (
                      <li key={i}>{example}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="pda-urg-check-v3">
                {formData.urgency === opt.id && <Check size={18} />}
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );

  const renderVisibilityStep = () => (
    <motion.div className="pda-compact-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="pda-step-intro">
        <span className="pda-step-badge" style={{ background: 'var(--pda-info)' }}>
          ALCANCE GEOGRÁFICO
        </span>
        <h2>Quem deve ver<br/>o seu pedido?</h2>
        <p>Defina o raio de alcance para que as pessoas próximas sejam notificadas.</p>
      </div>

      <div className="pda-vis-container-v4">
        <div className="pda-vis-options-v4">
          {VISIBILITY_OPTIONS.map((opt, index) => (
            <motion.button
              key={opt.id}
              onClick={() => {
                const newRadius = opt.id === 'bairro' ? 2 : opt.id === 'proximos' ? 10 : opt.id === 'todos' ? 50 : 5;
                updateData({ 
                  visibility: toggleArrayItem(formData.visibility, opt.id),
                  radius: newRadius
                });
              }}
              className={`pda-vis-card-v4 ${formData.visibility.includes(opt.id) ? 'active' : ''}`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{ 
                '--vis-color': opt.color,
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.5rem',
                background: formData.visibility.includes(opt.id) ? `${opt.color}10` : 'white',
                border: `2px solid ${formData.visibility.includes(opt.id) ? opt.color : '#e2e8f0'}`,
                borderRadius: '16px',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div className="pda-vis-icon-v4">
                {opt.icon}
              </div>
              <div className="pda-vis-body-v4">
                <strong>{opt.label}</strong>
                <p>{opt.desc}</p>
              </div>
              <div className="pda-vis-check-v4">
                {formData.visibility.includes(opt.id) && <Check size={16} />}
              </div>
            </motion.button>
          ))}
        </div>

        <div className="pda-vis-map-section-v4">
          <MapaAlcance 
            radius={formData.radius} 
            onRadiusChange={(r) => updateData({ radius: r })}
            userLocation={formData.userLocation}
          />
        </div>
      </div>
    </motion.div>
  );

  const renderConfirmationStep = () => (
    <motion.div className="pda-compact-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
      <div className="pda-step-intro">
        <span className="pda-step-badge" style={{ background: 'var(--pda-success)' }}>
          RESUMO FINAL
        </span>
        <h2>Tudo certo?</h2>
        <p>Revise os detalhes antes de publicar seu pedido na rede Solidar.</p>
      </div>

      <div className="pda-review-card-v2">
        <div className="pda-review-quote">
          <p style={{ whiteSpace: 'pre-wrap' }}>{formData.description}</p>
        </div>
        
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <div className="pda-location-indicator">
            <MapPin size={16} /> {formData.locationString}
          </div>
          <div className="pda-location-indicator" style={{ background: selectedUrgency?.color + '20', color: selectedUrgency?.color }}>
            <Target size={16} /> Urgência: {selectedUrgency?.label}
          </div>
          <div className="pda-location-indicator" style={{ background: selectedCategory?.color + '20', color: selectedCategory?.color }}>
            {selectedCategory?.icon} {formData.category}
          </div>
        </div>
      </div>
    </motion.div>
  );

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

  return (
    <div className="pda-novo-pedido-container" style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f0fdfa 0%, #f3e8ff 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem'
    }}>
      {isAnalyzing && <AnalyzingModal stages={stages} analysisStage={analysisStage} />}
      
      {isPublished && <SuccessModal urgencyColor={selectedUrgency?.color || '#f97316'} urgencyLabel={selectedUrgency?.label || ''} urgencyIcon={selectedUrgency?.icon} reason={analysis?.reason || ''} onClose={() => navigate('/')} />}
      {isInconsistent && <InconsistentModal onEdit={() => { setIsInconsistent(false); setStep(3); }} onClose={() => navigate('/')} />}

      <div className="pda-wizard-box-v2" style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1600px',
        height: '85vh',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRadius: '24px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        overflow: 'hidden'
      }}>
        <div className="pda-wizard-sidebar-v2" style={{
          width: '300px',
          background: 'rgb(255 255 255)',
          color: '#000000',
          display: 'flex',
          flexDirection: 'column',
          padding: '2rem',
          flexShrink: 0
        }}>
          <div className="pda-sidebar-header-v2">
            <div className="pda-brand-wrapper">
              <div className="pda-logo-container">
                <Heart size={32} color="white" fill="white" />
              </div>
              <div className="pda-sidebar-brand-v2">
                <h3>Solidar</h3>
                <span>{formData.city || 'Sua Localização'}</span>
              </div>
            </div>
          </div>
          
          <div className="pda-sidebar-steps-v2">
            {STEP_LABELS.map((label, i) => (
              <div 
                key={i} 
                className={`pda-step-indicator-v3 ${i + 1 === step ? 'active' : i + 1 < step ? 'completed' : ''}`}
                onClick={() => i + 1 < step && setStep(i + 1)}
              >
                <div className="pda-indicator-dot-v3">
                  {i + 1 < step ? <Check size={20} /> : i + 1}
                </div>
                <div className="pda-indicator-info-v3">
                  <span className="pda-indicator-step-v3">PASSO {i + 1}</span>
                  <span className="pda-indicator-label-v3">{label}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pda-sidebar-footer-v2">
            <div className="pda-progress-info-v2">
              <span>Progresso</span>
              <strong>{Math.round((step / TOTAL_STEPS) * 100)}%</strong>
            </div>
            <div className="pda-progress-bar-v2">
              <div 
                className="pda-progress-fill-v2" 
                style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
              />
            </div>
            
            <div className="pda-user-section">
              <div className="pda-user-avatar" onClick={() => setShowUserMenu(!showUserMenu)}>
                <div className="pda-avatar-image">
                  <User size={18} />
                </div>
                <div className="pda-user-info">
                  <span className="pda-user-name">Usuário</span>
                  <span className="pda-user-status">Online</span>
                </div>
                
                {showUserMenu && (
                  <div className="pda-user-dropdown">
                    <button 
                      className="pda-menu-item"
                      onClick={() => {
                        navigate('/conversas');
                        setShowUserMenu(false);
                      }}
                    >
                      💬 Conversas
                    </button>
                    <button 
                      className="pda-menu-item"
                      onClick={() => {
                        navigate('/perfil');
                        setShowUserMenu(false);
                      }}
                    >
                      👤 Perfil
                    </button>
                    <button 
                      className="pda-menu-item pda-logout-btn"
                      onClick={() => {
                        localStorage.removeItem('solidar-user');
                        window.location.reload();
                      }}
                    >
                      🚪 Sair
                    </button>
                  </div>
                )}
              </div>
              
              <div className="pda-notifications">
                <button 
                  className="pda-notification-btn"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#dcb000ff" stroke="none">
                    <path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/>
                  </svg>
                  {getUnreadCount() > 0 && (
                    <span className="pda-notification-badge">{getUnreadCount()}</span>
                  )}
                </button>
                
                {showNotifications && (
                  <div className="pda-notification-dropdown">
                    <div className="pda-notification-header">
                      <h3>Notificações</h3>
                      {notifications.length > 0 && (
                        <div className="pda-notification-actions">
                          {getUnreadCount() > 0 && (
                            <button 
                              className="pda-action-btn pda-mark-read-btn"
                              onClick={markAllAsRead}
                              title="Marcar todas como lidas"
                            >
                              ✓
                            </button>
                          )}
                          <button 
                            className="pda-action-btn pda-clear-btn"
                            onClick={clearNotifications}
                            title="Limpar todas"
                          >
                            🗑️
                          </button>
                        </div>
                      )}
                    </div>
                    <div className="pda-notification-list">
                      {notifications.length === 0 ? (
                        <div className="pda-no-notifications">
                          Nenhuma notificação ainda
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`pda-notification-item ${notification.read ? 'read' : 'unread'}`}
                            onClick={() => {
                              if (!notification.read) {
                                markAsRead(notification.id);
                              }
                            }}
                          >
                            <div className="pda-notification-content">
                              <div className="pda-notification-icon">
                                {notification.type === 'chat' ? '💬' : '🔔'}
                              </div>
                              <div className="pda-notification-text">
                                <p className="pda-notification-title">{notification.title}</p>
                                <p className="pda-notification-message">{notification.message}</p>
                                <span className="pda-notification-time">
                                  {new Date(notification.timestamp).toLocaleString('pt-BR', {
                                    day: '2-digit',
                                    month: '2-digit',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </span>
                              </div>
                            </div>
                            {!notification.read && <div className="pda-unread-dot"></div>}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="pda-wizard-content-v2" style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div className="pda-global-progress-container">
            <div 
              className="pda-global-progress-fill" 
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>

          <div className="pda-step-indicator-overlay">
            PASSO <strong>{step}</strong> / {TOTAL_STEPS}
          </div>

          <div className="pda-content-body-v2">
            <div className="pda-step-container-v2">
              <div className="pda-step-motion-container">
                <AnimatePresence mode="wait">
                  {renderStepContent()}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="pda-content-actions-v2">
            <button 
              onClick={step === 1 ? () => navigate('/') : prevStep} 
              className="pda-btn-v2 pda-btn-ghost"
            >
              <ChevronLeft size={20} /> VOLTAR
            </button>
            
            {step < TOTAL_STEPS ? (
              <button 
                onClick={nextStep} 
                disabled={!isStepValid} 
                className="pda-btn-v2 pda-btn-primary"
              >
                CONTINUAR <ArrowRight size={20} />
              </button>
            ) : (
              <button 
                onClick={handlePublish} 
                disabled={isSubmitting} 
                className="pda-btn-v2 pda-btn-primary"
                style={{ background: 'var(--pda-success)' }}
              >
                {isSubmitting ? 'PUBLICANDO...' : 'PUBLICAR PEDIDO'} <Rocket size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrecisoDeAjudaDesktop;