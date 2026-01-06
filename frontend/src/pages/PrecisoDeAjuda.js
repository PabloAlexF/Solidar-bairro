import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Map as MapIcon
} from 'lucide-react';
import './PrecisoDeAjuda.css';

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
      { id: 'blusas', label: 'Blusas/Camisetas', desc: 'Peças para o tronco.', color: '#3b82f6' },
      { id: 'calcas', label: 'Calças/Bermudas', desc: 'Peças para as pernas.', color: '#2563eb' },
      { id: 'agasalhos', label: 'Agasalhos', desc: 'Casacos e blusas de frio.', color: '#1e40af', contextInfo: 'Agasalhos de lã ou sintéticos ajudam muito em frentes frias.' },
      { id: 'intimas', label: 'Roupas Íntimas', desc: 'Peças básicas de higiene.', color: '#1d4ed8', contextInfo: 'Por questões de higiene, recomendamos apenas peças novas.' },
      { 
        id: 'escolar', 
        label: 'Uniforme Escolar', 
        desc: 'Roupas para escola.', 
        color: '#6366f1',
        contextInfo: 'Estar uniformizado ajuda na integração da criança no ambiente escolar e evita o desgaste de roupas civis.',
        subQuestions: [
          { id: 'serie_escolar', label: 'Série/Idade?', type: 'input', placeholder: 'Ex: 3º ano / 8 anos' },
          { id: 'escola_nome', label: 'Nome da Escola (se necessário)', type: 'input', placeholder: 'Ex: Escola Municipal...' }
        ]
      },
      { 
        id: 'trabalho', 
        label: 'Roupa de Trabalho', 
        desc: 'EPIs ou roupas formais.', 
        color: '#475569',
        contextInfo: 'Roupas adequadas de trabalho garantem segurança e uma boa apresentação profissional.',
        subQuestions: [
          { id: 'tipo_trab', label: 'Qual o tipo?', type: 'select', options: ['Operacional (Obra)', 'Formal (Escritório)', 'Saúde (Branco)', 'Cozinha'] }
        ]
      },
      { id: 'bebe_roupas', label: 'Enxoval de Bebê', desc: 'Bodies, pagãos e mantas.', color: '#ec4899', contextInfo: 'Bebês perdem roupas muito rápido. Doar enxovais é uma forma maravilhosa de solidariedade.' },
    ],
    sizes: ['PP', 'P', 'M', 'G', 'GG', 'EXG', 'Infantil'],
    styles: ['Masculino', 'Feminino', 'Unissex', 'Infantil']
  },
  Calçados: {
    options: [
      { id: 'tenis', label: 'Tênis', desc: 'Uso diário e esportivo.', color: '#6366f1' },
      { id: 'chinelo', label: 'Chinelos/Sandálias', desc: 'Uso casual.', color: '#4f46e5', contextInfo: 'Chinelos são essenciais para a higiene e conforto dentro de casa.' },
      { 
        id: 'botas', 
        label: 'Botas/Galochas', 
        desc: 'Proteção e frio.', 
        color: '#4338ca',
        contextInfo: 'Essencial para locais com lama, chuvas fortes ou para quem trabalha em ambientes externos.',
        subQuestions: [
          {
            id: 'tipo_bota',
            label: 'Finalidade da Bota?',
            type: 'select',
            options: ['Chuva/Lama (Galocha)', 'Frio (Botinha)', 'Trabalho (Botina)']
          }
        ]
      },
      { id: 'social', label: 'Sapato Social', desc: 'Trabalho e eventos.', color: '#3730a3', contextInfo: 'Ter um calçado adequado para entrevistas aumenta a confiança e a apresentação pessoal.' },
      { id: 'escolar_calc', label: 'Tênis Escolar', desc: 'Branco ou padrão escolar.', color: '#1e40af', contextInfo: 'Calçados confortáveis são vitais para crianças que caminham até a escola.' },
      { id: 'esporte_calc', label: 'Chuteira/Esportivo', desc: 'Para atividades físicas.', color: '#10b981', contextInfo: 'O esporte é uma ferramenta de inclusão social importante para jovens.' },
    ],
    sizes: ['18-25', '26-33', '34-36', '37-39', '40-42', '43-45'],
    styles: ['Masculino', 'Feminino', 'Unissex', 'Infantil']
  },
  Medicamentos: {
    options: [
      { 
        id: 'analgesico', 
        label: 'Analgésicos', 
        desc: 'Para dor e febre.', 
        color: '#10b981',
        contextInfo: 'Sempre verifique a data de validade e nunca se automedique sem orientação básica.',
        subQuestions: [
          { id: 'medicamento_nome', label: 'Nome do Medicamento', type: 'input', placeholder: 'Ex: Paracetamol, Dipirona...' }
        ]
      },
      { 
        id: 'continuo', 
        label: 'Uso Contínuo', 
        desc: 'Pressão, diabetes, etc.', 
        color: '#059669',
        contextInfo: 'Atenção: A interrupção de tratamentos contínuos pode agravar doenças crônicas rapidamente.',
        subQuestions: [
          { id: 'receita', label: 'Possui receita médica?', type: 'select', options: ['Sim, atualizada', 'Sim, vencida', 'Não possuo'] },
          { id: 'med_continuo', label: 'Qual o medicamento?', type: 'input', placeholder: 'Ex: Losartana, Metformina...' },
          { id: 'dosagem', label: 'Dosagem (mg)?', type: 'input', placeholder: 'Ex: 50mg, 100mg...' }
        ]
      },
      { 
        id: 'antibiotico', 
        label: 'Antibióticos', 
        desc: 'Necessário prescrição.', 
        color: '#047857',
        contextInfo: 'Antibióticos devem ser tomados rigorosamente nos horários certos para evitar resistência bacteriana.',
        subQuestions: [
          { id: 'nome_antibiotico', label: 'Qual o antibiótico?', type: 'input', placeholder: 'Ex: Amoxicilina...' },
          { id: 'duracao_trat', label: 'Duração do tratamento?', type: 'select', options: ['5 dias', '7 dias', '10 dias', '14 dias'] }
        ]
      },
      { id: 'curativo', label: 'Curativos/Primeiros Socorros', desc: 'Gaze, álcool, etc.', color: '#065f46', contextInfo: 'Manter um kit de primeiros socorros limpo previne infecções em pequenos ferimentos.' },
      { 
        id: 'mental', 
        label: 'Saúde Mental', 
        desc: 'Ansiedade, depressão.', 
        color: '#6366f1',
        contextInfo: 'A saúde mental é tão importante quanto a física. Nunca interrompa medicamentos controlados sem apoio médico.',
        subQuestions: [
          { id: 'med_mental', label: 'Medicamento?', type: 'input', placeholder: 'Ex: Sertralina, Fluoxetina...' }
        ]
      },
      { id: 'vitaminas', label: 'Vitaminas/Suplementos', desc: 'Vitamina C, Ferro, etc.', color: '#f59e0b', contextInfo: 'Suplementos de ferro são essenciais para combater a anemia, comum em crianças e idosos.' },
    ]
  },
  Higiene: {
    options: [
      { 
        id: 'banho', 
        label: 'Banho & Corpo', 
        desc: 'Sabonete, shampoo, etc.', 
        color: '#14b8a6',
        contextInfo: 'A higiene corporal básica previne doenças de pele e contribui para o bem-estar mental.',
        subQuestions: [
          { id: 'itens_banho', label: 'O que falta?', type: 'chips', options: ['Sabonete', 'Shampoo', 'Condicionador', 'Desodorante', 'Papel Higiênico', 'Lâmina de Barbear'] }
        ]
      },
      { 
        id: 'bucal', 
        label: 'Higiene Bucal', 
        desc: 'Pasta, escova, fio dental.', 
        color: '#0d9488',
        contextInfo: 'A saúde bucal reflete na saúde de todo o corpo. Escovar os dentes 3 vezes ao dia é o recomendado.',
        subQuestions: [
          { id: 'itens_bucal', label: 'Quais itens precisa?', type: 'chips', options: ['Escova Adulto', 'Escova Infantil', 'Pasta de Dente', 'Fio Dental', 'Enxaguante'] }
        ]
      },
      { 
        id: 'limpeza', 
        label: 'Limpeza da Casa', 
        desc: 'Detergente, sabão em pó.', 
        color: '#0f766e', 
        contextInfo: 'Uma casa limpa afasta vetores de doenças como ratos e baratas, protegendo sua família.',
        subQuestions: [
          { id: 'itens_limpeza', label: 'O que mais precisa?', type: 'chips', options: ['Detergente', 'Sabão em Pó', 'Água Sanitária', 'Desinfetante', 'Esponja', 'Amaciante'] }
        ]
      },
      { id: 'feminina', label: 'Saúde Feminina', desc: 'Absorventes e higiene.', color: '#ec4899', contextInfo: 'A dignidade menstrual é fundamental. O acesso a absorventes é uma necessidade básica de saúde.' },
      { 
        id: 'hig_infantil', 
        label: 'Higiene Infantil', 
        desc: 'Fraldas e lenços.', 
        color: '#3b82f6',
        contextInfo: 'Trocar a fralda frequentemente evita assaduras e infecções urinárias em bebês.',
        subQuestions: [
          { id: 'tam_fralda_hig', label: 'Tamanho?', type: 'select', options: ['P', 'M', 'G', 'GG', 'XG'] },
          { id: 'extra_bebe', label: 'Outros itens?', type: 'chips', options: ['Lenço Umedecido', 'Pomada Assadura', 'Talco', 'Sabonete Líquido Bebê'] }
        ]
      },
      { id: 'protecao', label: 'Proteção & Saúde', desc: 'Máscaras, álcool em gel.', color: '#475569', contextInfo: 'A higienização das mãos é a forma mais eficaz de prevenir a transmissão de viroses.' },
    ]
  },
  Contas: {
    options: [
      { 
        id: 'luz', 
        label: 'Energia Elétrica', 
        desc: 'Conta de luz atrasada.', 
        color: '#ef4444',
        contextInfo: 'Se você recebe Bolsa Família ou tem baixa renda, pode ter direito a até 65% de desconto na luz (Tarifa Social).',
        subQuestions: [
          { id: 'valor_luz', label: 'Valor aproximado (R$)?', type: 'input', placeholder: 'Ex: 150,00' },
          { id: 'atraso_luz', label: 'Meses em atraso?', type: 'select', options: ['1 mês', '2 meses', '3 ou mais', 'Aviso de corte'] }
        ]
      },
      { 
        id: 'agua', 
        label: 'Água / Saneamento', 
        desc: 'Conta de água.', 
        color: '#3b82f6',
        contextInfo: 'O fornecimento de água é vital. Mantenha as torneiras bem fechadas para evitar desperdícios e contas altas.',
        subQuestions: [
          { id: 'valor_agua', label: 'Valor aproximado (R$)?', type: 'input', placeholder: 'Ex: 80,00' },
          { id: 'atraso_agua', label: 'Meses em atraso?', type: 'select', options: ['1 mês', '2 meses', '3 ou mais', 'Aviso de corte'] }
        ]
      },
      { 
        id: 'aluguel', 
        label: 'Auxílio Aluguel', 
        desc: 'Moradia e abrigo.', 
        color: '#10b981',
        contextInfo: 'A segurança da moradia é a base para a estabilidade da família. Procure o CRAS de sua região para auxílios oficiais.',
        subQuestions: [
          { id: 'valor_aluguel', label: 'Valor do Aluguel (R$)?', type: 'input', placeholder: 'Ex: 600,00' },
          { id: 'atraso_aluguel', label: 'Dias de atraso?', type: 'input', placeholder: 'Ex: 15 dias' }
        ]
      },
      { id: 'gas', label: 'Botijão de Gás', desc: 'Para cozinhar alimentos.', color: '#f97316', contextInfo: 'O vale-gás é um benefício que pode ajudar a manter sua alimentação em dia sem comprometer outras contas.' },
      { 
        id: 'internet', 
        label: 'Internet / Estudos', 
        desc: 'Para escola ou trabalho.', 
        color: '#6366f1',
        contextInfo: 'O acesso à informação é um direito. Internet em casa ajuda crianças nos estudos e adultos na busca por emprego.',
        subQuestions: [
          { id: 'finalidade_net', label: 'Qual a finalidade?', type: 'select', options: ['Estudos (Escola)', 'Trabalho (Home Office)', 'Busca de Emprego'] }
        ]
      },
      { id: 'farmacia_conta', label: 'Contas de Farmácia', desc: 'Remédios de emergência.', color: '#ec4899', contextInfo: 'Muitos medicamentos podem ser obtidos gratuitamente pelo programa Farmácia Popular.' },
    ]
  },
  Emprego: {
    options: [
      { 
        id: 'curriculo', 
        label: 'Currículo Profissional', 
        desc: 'Ajuda para criar ou imprimir.', 
        color: '#8b5cf6',
        contextInfo: 'Destaque suas experiências, mesmo as informais. Um bom currículo abre portas inesperadas.',
        subQuestions: [
          { id: 'tipo_curr', label: 'Qual a ajuda exata?', type: 'select', options: ['Criar um do zero', 'Revisar o atual', 'Apenas imprimir'] }
        ]
      },
      { id: 'vagas', label: 'Busca de Vagas', desc: 'Indicação de oportunidades.', color: '#7c3aed', contextInfo: 'Muitas vagas são preenchidas por indicação. Manter uma rede de contatos é fundamental.' },
      { 
        id: 'ferramentas', 
        label: 'Ferramentas de Trabalho', 
        desc: 'Para autônomos.', 
        color: '#f59e0b',
        contextInfo: 'Ter sua própria ferramenta permite que você aceite serviços como diarista, pedreiro ou manicure com mais facilidade.',
        subQuestions: [
          { id: 'quais_ferramentas', label: 'Quais ferramentas?', type: 'input', placeholder: 'Ex: Kit de limpeza, ferramentas de obra...' }
        ]
      },
      { 
        id: 'transporte_emp', 
        label: 'Transporte p/ Busca', 
        desc: 'Auxílio para se deslocar.', 
        color: '#5b21b6',
        contextInfo: 'Não deixe de ir a uma entrevista por falta de passagem. Peça ajuda com antecedência.',
        subQuestions: [
          { id: 'destino_ent', label: 'Para onde você precisa ir?', type: 'input', placeholder: 'Ex: Centro, Bairro tal...' }
        ]
      },
      { id: 'cursos', label: 'Cursos & Qualificação', desc: 'Indicação de cursos grátis.', color: '#10b981', contextInfo: 'A qualificação contínua é o melhor caminho para salários melhores e estabilidade.' },
      { id: 'entrevista_prep', label: 'Preparação p/ Entrevista', desc: 'Dicas de fala e vestimenta.', color: '#3b82f6', contextInfo: 'Simular uma entrevista ajuda a diminuir o nervosismo e a organizar as ideias.' },
    ]
  },
  Móveis: {
    options: [
      { 
        id: 'cama', 
        label: 'Cama/Colchão', 
        desc: 'Para dormir com dignidade.', 
        color: '#f59e0b',
        contextInfo: 'Um sono de qualidade é essencial para a saúde física e mental de adultos e crianças.',
        subQuestions: [
          { id: 'tipo_cama', label: 'Qual o tipo?', type: 'select', options: ['Solteiro', 'Casal', 'Berço', 'Apenas Colchão'] }
        ]
      },
      { 
        id: 'mesa', 
        label: 'Mesa & Cadeiras', 
        desc: 'Para refeições e estudo.', 
        color: '#d97706',
        contextInfo: 'Ter um local para as refeições em família fortalece os laços e incentiva o estudo das crianças.',
        subQuestions: [
          { id: 'tam_mesa', label: 'Para quantas pessoas?', type: 'select', options: ['2 pessoas', '4 pessoas', '6 ou mais'] }
        ]
      },
      { id: 'armario', label: 'Armário/Cozinha', desc: 'Organização de itens.', color: '#b45309', contextInfo: 'Manter alimentos e roupas organizados ajuda a conservar os itens por mais tempo.' },
      { 
        id: 'infantil_mov', 
        label: 'Berço/Enxoval', 
        desc: 'Segurança para o bebê.', 
        color: '#92400e',
        contextInfo: 'O berço deve seguir normas de segurança para evitar acidentes. Colchões firmes são os ideais.',
        subQuestions: [
          { id: 'itens_bebe', label: 'Precisa de algo mais?', type: 'select', options: ['Sim, Banheira', 'Sim, Carrinho', 'Apenas o Berço'] }
        ]
      },
      { id: 'sofa', label: 'Sofá / Poltrona', desc: 'Para o descanso da família.', color: '#7c3aed', contextInfo: 'Um ambiente de estar acolhedor ajuda na saúde mental e no convívio familiar.' },
      { 
        id: 'estudo_mov', 
        label: 'Mesa de Estudo', 
        desc: 'Para crianças e jovens.', 
        color: '#3b82f6',
        contextInfo: 'Ter um espaço dedicado ao estudo aumenta significativamente o rendimento escolar das crianças.',
        subQuestions: [
          { id: 'cadeira_estudo', label: 'Precisa de cadeira também?', type: 'select', options: ['Sim', 'Não, apenas a mesa'] }
        ]
      },
    ]
  },
  Eletrodomésticos: {
    options: [
      { 
        id: 'geladeira', 
        label: 'Geladeira', 
        desc: 'Conservação de alimentos.', 
        color: '#475569',
        contextInfo: 'Evite abrir a geladeira sem necessidade para economizar energia e manter os alimentos frescos.',
        subQuestions: [
          { id: 'volts_geladeira', label: 'Qual a voltagem necessária?', type: 'select', options: ['110v', '220v', 'Bivolt'] }
        ]
      },
      { 
        id: 'fogao', 
        label: 'Fogão', 
        desc: 'Para cozinhar refeições.', 
        color: '#334155',
        contextInfo: 'Cuidado redobrado com a mangueira do gás. Ela tem data de validade e deve ser trocada periodicamente.',
        subQuestions: [
          { id: 'bocas_fogao', label: 'Preferência de tamanho?', type: 'select', options: ['2 bocas', '4 bocas', '5 ou mais bocas'] }
        ]
      },
      { id: 'lavar', label: 'Máquina de Lavar', desc: 'Higiene das roupas.', color: '#1e293b', contextInfo: 'Lavar roupas à máquina economiza tempo e água em comparação à lavagem manual pesada.' },
      { id: 'ventilador', label: 'Ventilador', desc: 'Conforto térmico.', color: '#0ea5e9', contextInfo: 'O conforto térmico é importante para o descanso, especialmente em regiões muito quentes.' },
      { id: 'microondas', label: 'Micro-ondas', desc: 'Praticidade no aquecimento.', color: '#6366f1', contextInfo: 'Ideal para quem tem pouco tempo ou para idosos que moram sozinhos e precisam de facilidade.' },
      { id: 'ferro', label: 'Ferro de Passar', desc: 'Apresentação das roupas.', color: '#f59e0b', contextInfo: 'Roupas passadas são importantes para a auto-estima e apresentação em entrevistas.' },
    ]
  },
  Transporte: {
    options: [
      { 
        id: 'passagem', 
        label: 'Passagem Urbana', 
        desc: 'Ônibus, metrô ou trem.', 
        color: '#0ea5e9',
        contextInfo: 'Muitos municípios oferecem gratuidade ou passe social para desempregados e estudantes.',
        subQuestions: [
          { id: 'tipo_transp', label: 'Tipo de transporte?', type: 'chips', options: ['Ônibus', 'Metrô', 'Trem', 'Uber/Taxi (Emergência)'] },
          { id: 'freq_transp', label: 'Frequência da ajuda?', type: 'select', options: ['Única vez', 'Semanal', 'Mensal'] }
        ]
      },
      { id: 'viagem', label: 'Viagem Interestadual', desc: 'Para retorno ou saúde.', color: '#0284c7', contextInfo: 'Existem leis que garantem passagens gratuitas para idosos e jovens de baixa renda em viagens longas.' },
      { id: 'manutencao', label: 'Manutenção Veicular', desc: 'Conserto essencial.', color: '#0369a1', contextInfo: 'Veículos de trabalho devem estar com a manutenção básica em dia para evitar prejuízos maiores.' },
      { id: 'frete', label: 'Frete/Mudança', desc: 'Transporte de carga.', color: '#075985', contextInfo: 'Ajuda com frete é essencial para quem precisa transportar doações grandes ou realizar mudanças.' },
      { id: 'bike', label: 'Bicicleta', desc: 'Para trabalho ou estudo.', color: '#10b981', contextInfo: 'A bicicleta é um transporte de custo zero que gera saúde e autonomia de movimento.' },
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
const URGENCY_OPTIONS = [
  { id: 'critico', label: 'CRÍTICO', desc: 'Risco imediato à saúde ou vida', icon: <AlertTriangle size={24} />, color: '#ef4444', time: 'Imediato' },
  { id: 'urgente', label: 'URGENTE', desc: 'Necessário para as próximas 24h', icon: <Zap size={24} />, color: '#f97316', time: '24 horas' },
  { id: 'moderada', label: 'MODERADA', desc: 'Pode aguardar alguns dias', icon: <Calendar size={24} />, color: '#f59e0b', time: '3-5 dias' },
  { id: 'tranquilo', label: 'TRANQUILO', desc: 'Sem prazo rígido', icon: <Coffee size={24} />, color: '#10b981', time: 'Sem pressa' },
  { id: 'recorrente', label: 'RECORRENTE', desc: 'Necessidade mensal constante', icon: <RefreshCcw size={24} />, color: '#6366f1', time: 'Mensal' },
];

const VISIBILITY_OPTIONS = [
  { id: 'bairro', label: 'Meu Bairro', desc: 'Até 2km de distância', icon: <MapPin size={20} />, color: '#10b981' },
  { id: 'proximos', label: 'Região Próxima', desc: 'Até 10km de distância', icon: <Users size={20} />, color: '#3b82f6' },
  { id: 'ongs', label: 'ONGs Parceiras', desc: 'Visível para instituições', icon: <Building2 size={20} />, color: '#6366f1' },
];

const STEP_LABELS = ['Categoria', 'Detalhes', 'História', 'Urgência', 'Visibilidade', 'Confirmação'];
const TOTAL_STEPS = 6;

const INITIAL_FORM_DATA = {
  category: '',
  subCategory: [],
  size: '',
  style: '',
  subQuestionAnswers: {},
  description: '',
  urgency: '',
  visibility: [],
  isPublic: true,
  radius: 5
};

const STORY_TEMPLATES = [
  {
    id: 'familia',
    label: 'Família',
    text: 'Preciso de ajuda com alimentos para minha família de [X] pessoas. Estamos passando por um momento difícil e qualquer contribuição de cesta básica seria muito bem-vinda.'
  },
  {
    id: 'saude',
    label: 'Saúde',
    text: 'Estou precisando de ajuda para adquirir o medicamento [Nome] para uso contínuo. Não estou conseguindo arcar com os custos este mês devido a [Motivo].'
  },
  {
    id: 'emprego',
    label: 'Emprego',
    text: 'Estou em busca de recolocação profissional e precisaria de ajuda com passagens de ônibus para comparecer a entrevistas ou ajuda para imprimir currículos.'
  }
];

const STORY_TIPS = [
  { icon: <Sparkles size={16} />, text: 'Seja claro e objetivo sobre o que precisa.' },
  { icon: <PenTool size={16} />, text: 'Explique brevemente o motivo da necessidade.' },
  { icon: <Lightbulb size={16} />, text: 'Mencione se é para você ou para outra pessoa.' }
];

export default function PrecisoDeAjuda() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSubModal, setSelectedSubModal] = useState(null);
  const [showSpecsModal, setShowSpecsModal] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  
  // Audio Recording State
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  
  // Template verification state
  const [templateUsed, setTemplateUsed] = useState(null);

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

  const toggleArrayItem = useCallback((array, item) => {
    return array.includes(item) ? array.filter(i => i !== item) : [...array, item];
  }, []);
  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = true;
        recognitionInstance.interimResults = true;
        recognitionInstance.lang = 'pt-BR';

        recognitionInstance.onresult = (event) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setFormData(prev => ({ ...prev, description: (prev.description + ' ' + transcript).trim() }));
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
    } else {
      recognition.start();
      setIsRecording(true);
    }
  };

  const isDescriptionValid = useMemo(() => {
    if (formData.description.length < 10) return false;
    
    // Se usou template, verifica se alterou os colchetes [ ]
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
        if (formData.subCategory.length === 0) return false;
        if (details.sizes && !formData.size) return false;
        if (details.styles && !formData.style) return false;
        return true;
      }
      case 3: return isDescriptionValid;
      case 4: return formData.urgency !== '';
      case 5: return formData.visibility.length > 0;
      default: return true;
    }
  }, [step, formData, isDescriptionValid]);

  const handlePublish = useCallback(() => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      navigate('/painel');
    }, 2000);
  }, [navigate]);

  const selectedCategory = useMemo(() => 
    CATEGORIES.find(c => c.id === formData.category), 
    [formData.category]
  );

  const selectedUrgency = useMemo(() => 
    URGENCY_OPTIONS.find(o => o.id === formData.urgency),
    [formData.urgency]
  );
  const renderCategoryStep = () => (
    <div className="compact-step">
      <div className="step-intro">
        <span className="step-badge">Passo 01</span>
        <h2>Qual ajuda você precisa?</h2>
        <p>Selecione a categoria principal do seu pedido.</p>
      </div>
      <div className="categories-grid-compact">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => updateData({ category: cat.id, subCategory: [], size: '', style: '' })}
            className={`cat-item ${formData.category === cat.id ? 'active' : ''}`}
            style={{ '--cat-color': cat.color }}
          >
            <div className="cat-icon-box">{cat.icon}</div>
            <span className="cat-text">{cat.label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const renderSpecsModal = () => {
    const details = CATEGORY_DETAILS[formData.category];
    if (!details || !details.sizes) return null;

    return (
      <>
        {showSpecsModal && (
          <div className="modal-overlay" onClick={() => setShowSpecsModal(false)}>
            <div 
              className="sub-modal-v3 specs-modal"
              style={{ '--modal-color': selectedCategory?.color }}
              onClick={(e) => e.stopPropagation()}
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
            </div>
          </div>
        )}
      </>
    );
  };
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

        {renderSpecsModal()}

        {selectedSubModal && subOptModal && (
          <div className="modal-overlay" onClick={() => setSelectedSubModal(null)}>
            <div 
              className="sub-modal-v3"
              style={{ '--modal-color': subOptModal.color }}
              onClick={(e) => e.stopPropagation()}
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
                            const currentAnswers = (formData.subQuestionAnswers[q.id]) || [];
                            const isActive = currentAnswers.includes(opt);
                            return (
                              <button
                                key={opt}
                                type="button"
                                onClick={() => {
                                  const next = isActive 
                                    ? currentAnswers.filter(a => a !== opt)
                                    : [...currentAnswers, opt];
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
                          value={(formData.subQuestionAnswers[q.id]) || ''}
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
            </div>
          </div>
        )}
      </div>
    );
  };
  const renderDescriptionStep = () => (
    <div className="compact-step">
      <div className="step-intro">
        <span className="step-badge">Passo 03</span>
        <h2>Conte sua história</h2>
        <p>Dê detalhes para que as pessoas entendam como ajudar.</p>
      </div>

      <div className="story-layout-v3">
        <div className="story-main">
          <div className="input-group">
            <textarea
              placeholder="Ex: Preciso de ajuda com alimentos para meus 3 filhos este mês. Estamos passando por um momento difícil..."
              value={formData.description}
              onChange={(e) => updateData({ description: e.target.value.slice(0, 500) })}
              className={`compact-textarea v3 ${templateUsed && !isDescriptionValid ? 'warning' : ''}`}
            />
            <div className={`count-tag ${isDescriptionValid ? 'valid' : ''}`}>
              {formData.description.length}/500
            </div>
            
            <button 
              className={`voice-record-btn ${isRecording ? 'recording' : ''}`}
              onClick={toggleRecording}
              title={isRecording ? "Parar Gravação" : "Gravar com Voz"}
            >
              {isRecording ? <MicOff size={24} /> : <Mic size={24} />}
              <span>{isRecording ? 'Ouvindo...' : 'Falar (Gravar Voz)'}</span>
            </button>
          </div>

          {templateUsed && !isDescriptionValid && (
            <div className="template-warning">
              <AlertTriangle size={16} />
              <span>Por favor, altere os dados entre colchetes [ ] com suas informações reais.</span>
            </div>
          )}

          <div className="story-templates-box">
            <span className="section-subtitle">Ou use um modelo (lembre-se de editar):</span>
            <div className="templates-grid-v3">
              {STORY_TEMPLATES.map((t) => (
                <button
                  key={t.id}
                  className={`template-btn-v3 ${templateUsed === t.text ? 'active' : ''}`}
                  onClick={() => {
                    updateData({ description: t.text });
                    setTemplateUsed(t.text);
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="story-sidebar-v3">
          <div className="tips-box-v3">
            <div className="tips-header-v3">
              <Lightbulb size={18} className="tip-icon-v3" />
              <strong>Dicas de Ouro</strong>
            </div>
            <div className="tips-list-v3">
              {STORY_TIPS.map((tip, i) => (
                <div key={i} className="tip-item-v3">
                  <div className="tip-bullet-v3">{tip.icon}</div>
                  <p>{tip.text}</p>
                </div>
              ))}
              <div className="tip-item-v3">
                <div className="tip-bullet-v3"><Volume2 size={16} /></div>
                <p>Idosos podem usar o botão de voz para facilitar a descrição.</p>
              </div>
            </div>
          </div>

          <div className="privacy-alert-v3">
            <ShieldCheck size={18} />
            <p>Seus dados sensíveis nunca são expostos publicamente.</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderUrgencyStep = () => (
    <div className="compact-step">
      <div className="step-intro">
        <span className="step-badge">Passo 04</span>
        <h2>Qual o nível de urgência?</h2>
        <p>Isso ajuda a priorizar os pedidos mais críticos na comunidade.</p>
      </div>
      <div className="urgency-grid-v2">
        {URGENCY_OPTIONS.map((opt) => (
          <button
            key={opt.id}
            onClick={() => updateData({ urgency: opt.id })}
            className={`urgency-card-v2 ${formData.urgency === opt.id ? 'active' : ''}`}
            style={{ '--urg-color': opt.color }}
          >
            <div className="urg-icon-v2">{opt.icon}</div>
            <div className="urg-body-v2">
              <div className="urg-header-v2">
                <strong>{opt.label}</strong>
                <span className="urg-time-badge">{opt.time}</span>
              </div>
              <span>{opt.desc}</span>
            </div>
            <div className="urg-check-v2">
              {formData.urgency === opt.id && <Check size={20} />}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderVisibilityStep = () => (
    <div className="compact-step">
      <div className="step-intro">
        <span className="step-badge">Passo 05</span>
        <h2>Quem deve ver seu pedido?</h2>
        <p>Defina o alcance geográfico da sua solicitação.</p>
      </div>
      <div className="visibility-layout-v2">
        <div className="vis-grid-v2">
          {VISIBILITY_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => updateData({ visibility: toggleArrayItem(formData.visibility, opt.id) })}
              className={`vis-card-v2 ${formData.visibility.includes(opt.id) ? 'active' : ''}`}
              style={{ '--vis-color': opt.color }}
            >
              <div className="vis-icon-v2">{opt.icon}</div>
              <div className="vis-text-v2">
                <strong>{opt.label}</strong>
                <span>{opt.desc}</span>
              </div>
            </button>
          ))}
        </div>

        <div className="radius-control-v2">
          <div className="control-top">
            <div className="control-label">
              <strong>Alcance: {formData.radius}km</strong>
              <p>Defina o raio de busca para encontrar doadores</p>
            </div>
            <label className="switch-v2">
              <input 
                type="checkbox" 
                checked={formData.isPublic} 
                onChange={(e) => updateData({ isPublic: e.target.checked })} 
              />
              <span className="slider-v2"></span>
              <span className="label-text-v2">{formData.isPublic ? 'Público' : 'Privado'}</span>
            </label>
          </div>
          <input 
            type="range" 
            min="1" 
            max="20" 
            value={formData.radius} 
            onChange={(e) => updateData({ radius: parseInt(e.target.value) })}
            className="range-input-v2" 
          />
          
          <div className="map-placeholder-v2">
            <div className="map-overlay-v2">
              <MapIcon size={40} className="map-icon-v2" />
              <p>O mapa será exibido aqui com seu local e raio de alcance</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  const renderConfirmationStep = () => {
    const catColor = selectedCategory?.color;
    const details = CATEGORY_DETAILS[formData.category];
    
    return (
      <div className="compact-step">
        <div className="finish-header-v2">
          <div className="finish-check-v2">
            <Check size={32} />
          </div>
          <h2>Confirme seus dados</h2>
          <p>Veja como seu pedido aparecerá para os vizinhos.</p>
        </div>

        <div className="review-card-v2">
          <div className="review-main">
            <div className="review-tags">
              <span className="tag-v2" style={{ background: catColor + '15', color: catColor }}>
                {formData.category}
              </span>
              {selectedUrgency && (
                <span className="tag-v2" style={{ background: selectedUrgency.color + '15', color: selectedUrgency.color }}>
                  {selectedUrgency.icon} {formData.urgency.toUpperCase()}
                </span>
              )}
            </div>
            <div className="review-quote">
              <p>&ldquo;{formData.description}&rdquo;</p>
            </div>
            {formData.subCategory.length > 0 && (
              <div className="review-details">
                <div className="review-items-list">
                  <strong>Itens:</strong> {formData.subCategory.map(id => {
                    const opt = details?.options.find(o => o.id === id);
                    return opt?.label;
                  }).filter(Boolean).join(', ')}
                </div>
                {Object.keys(formData.subQuestionAnswers).length > 0 && (
                  <div className="review-sub-details">
                    {Object.entries(formData.subQuestionAnswers).map(([qId, val]) => {
                      if (!val || (Array.isArray(val) && val.length === 0)) return null;
                      return (
                        <div key={qId} className="sub-detail-row">
                          <span className="sub-q-label">{qId.replace(/_/g, ' ')}:</span>
                          <span className="sub-q-val">{Array.isArray(val) ? val.join(', ') : val}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                {(formData.size || formData.style) && (
                  <div className="review-specs">
                    {formData.size && <span><strong>Tam:</strong> {formData.size}</span>}
                    {formData.style && <span> • <strong>Estilo:</strong> {formData.style}</span>}
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="review-meta">
            <div className="meta-item-v2">
              <MessageSquare size={16} />
              <span>Contato via Chat do App</span>
            </div>
            <div className="meta-item-v2">
              <MapPin size={16} />
              <span>{formData.radius}km de alcance</span>
            </div>
            <div className="trust-badge-v2">
              <ShieldCheck size={16} />
              <span>Ambiente Seguro</span>
            </div>
          </div>
        </div>
      </div>
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

  return (
    <div className="novo-pedido-container">
      <div className="bg-blobs">
        <div className="blob blob-orange" />
        <div className="blob blob-blue" />
      </div>

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
              {renderStepContent()}
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