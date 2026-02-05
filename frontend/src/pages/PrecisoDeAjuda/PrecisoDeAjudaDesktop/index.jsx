"use client";

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AIAssistant } from './AIAssistant';
import { StatsManager } from '../../../utils/statsManager';
import { useAuth } from '../../../contexts/AuthContext';
import ApiService from '../../../services/apiService';
import { getSocket } from '../../../services/socketService';
import toast, { Toaster } from 'react-hot-toast';
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
  X,
  Minus,
  Quote,
  ArrowDown,
  ShieldCheck
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
    { id: 'Cesta Básica', label: 'Cesta Básica Completa', desc: 'Arroz, feijão, óleo, açúcar', options: ['Arroz', 'Feijão', 'Açúcar', 'Óleo', 'Macarrão', 'Farinha', 'Café', 'Sal', 'Leite em pó', 'Biscoito', 'Molho de Tomate', 'Sardinha'] },
    { id: 'Cereais & Grãos', label: 'Cereais & Grãos', desc: 'Arroz, feijão, lentilha', options: ['Arroz', 'Feijão', 'Lentilha', 'Milho', 'Soja'] },
    { id: 'Carnes & Aves', label: 'Carnes & Aves', desc: 'Carne, frango, peixe', options: ['Carne Bovina', 'Frango', 'Peixe', 'Porco', 'Ovelha'] },
    { id: 'Ovos & Laticínios', label: 'Ovos & Laticínios', desc: 'Ovos, leite, queijo', options: ['Ovos', 'Leite', 'Queijo', 'Iogurte', 'Manteiga'] },
    { id: 'Frutas Frescas', label: 'Frutas Frescas', desc: 'Banana, maçã, laranja', options: ['Banana', 'Maçã', 'Laranja', 'Uva', 'Abacaxi'] },
    { id: 'Verduras & Legumes', label: 'Verduras & Legumes', desc: 'Alface, tomate, batata', options: ['Alface', 'Tomate', 'Batata', 'Cenoura', 'Cebola'] },
    { id: 'Padaria & Café', label: 'Padaria & Café', desc: 'Pão, biscoito, café', options: ['Pão Francês', 'Pão de Forma', 'Bolo', 'Salgados', 'Café'] },
    { id: 'Temperos', label: 'Temperos', desc: 'Sal, açúcar, óleo', options: ['Sal', 'Açúcar', 'Óleo', 'Vinagre', 'Temperos'] },
    { id: 'Massas & Farinhas', label: 'Massas & Farinhas', desc: 'Macarrão, farinha', options: ['Macarrão', 'Farinha', 'Arroz', 'Aveia', 'Trigo'] },
    { id: 'Enlatados', label: 'Enlatados', desc: 'Sardinha, atum, milho', options: ['Sardinha', 'Atum', 'Milho', 'Ervilha', 'Seleta'] },
    { id: 'Bebidas & Sucos', label: 'Bebidas & Sucos', desc: 'Suco, refrigerante', options: ['Suco', 'Refrigerante', 'Água', 'Chá', 'Café'] },
    { id: 'Doces', label: 'Doces', desc: 'Chocolate, bolo', options: ['Chocolate', 'Bolo', 'Doce', 'Biscoito', 'Sorvete'] },
    { id: 'Alimentação Infantil', label: 'Alimentação Infantil', desc: 'Papinha, fórmula', options: ['Papinha', 'Fórmula', 'Leite Infantil', 'Suco Infantil', 'Cereais'] },
    { id: 'Alimentação Especial', label: 'Alimentação Especial', desc: 'Sem glúten, vegano', options: ['Sem Glúten', 'Vegano', 'Lactose Free', 'Diabético', 'Hipocalórico'] },
    { id: 'Marmitas', label: 'Marmitas', desc: 'Refeições prontas', options: ['Almoço', 'Jantar', 'Sopa', 'Sanduíche', 'Prato Feito'] },
    { id: 'Merenda', label: 'Merenda', desc: 'Lanche escolar', options: ['Pão', 'Fruta', 'Suco', 'Biscoito', 'Iogurte'] }
  ],
  'Roupas': [
    { id: 'Roupas Infantis', label: 'Roupas Infantis', desc: 'Para crianças de 0 a 12 anos', options: ['Recém-nascido', '1-3 anos', '4-8 anos', '9-12 anos', 'Menino', 'Menina', 'Calçados', 'Agasalhos'] },
    { id: 'Roupas Adulto', label: 'Roupas Adulto', desc: 'Masculino e Feminino', options: ['P', 'M', 'G', 'GG', 'Plus Size', 'Masculino', 'Feminino', 'Calça', 'Camisa', 'Vestido'] },
    { id: 'Roupas de Frio', label: 'Roupas de Frio', desc: 'Casacos, blusas, toucas', options: ['Casacos pesados', 'Moletom', 'Cobertores', 'Toucas/Luvas', 'Meias'] },
    { id: 'Roupas Verão', label: 'Roupas Verão', desc: 'Camisetas, bermudas', options: ['Camiseta', 'Bermuda', 'Short', 'Sunga', 'Sapatilha'] },
    { id: 'Uniforme Escolar', label: 'Uniforme Escolar', desc: 'Kits escolares', options: ['Camisa', 'Calça', 'Sapato', 'Mochila', 'Material Escolar'] },
    { id: 'Uniforme Trabalho', label: 'Uniforme Trabalho', desc: 'Aventais, jalecos', options: ['Avental', 'Jaleco', 'Calça', 'Camisa', 'Sapato'] },
    { id: 'Roupa Social', label: 'Roupa Social', desc: 'Entrevistas, trabalho', options: ['Calça Social', 'Camisa Social', 'Paletó', 'Sapato Social', 'Gravata'] },
    { id: 'Roupas Íntimas', label: 'Roupas Íntimas', desc: 'Cueca, calcinha (NOVAS)', options: ['Cueca', 'Calcinha', 'Sutiã', 'Meia', 'Pijama'] },
    { id: 'Roupas Infantis', label: 'Roupas Infantis', desc: '1 a 14 anos', options: ['1-3 anos', '4-8 anos', '9-12 anos', '13-14 anos', 'Menino', 'Menina'] },
    { id: 'Pijamas', label: 'Pijamas', desc: 'Roupas para dormir', options: ['Pijama Adulto', 'Pijama Infantil', 'Roupão', 'Chinelo', 'Touca'] }
  ],
  'Medicamentos': [
    { id: 'Analgésicos', label: 'Analgésicos', desc: 'Dor e febre', options: ['Dipirona', 'Paracetamol', 'Ibuprofeno', 'Aspirina'] },
    { id: 'Uso Contínuo', label: 'Uso Contínuo', desc: 'Hipertensão, Diabetes...', options: ['Losartana', 'Enalapril', 'Metformina', 'Glibenclamida', 'Insulina'] },
    { id: 'Primeiros Socorros', label: 'Primeiros Socorros', desc: 'Curativos, antissépticos', options: ['Alcool 70%', 'Gaze', 'Esparadrapo', 'Band-aid', 'Antisséptico', 'Algodão'] },
    { id: 'Vitaminas', label: 'Vitaminas', desc: 'Suplementação vitamínica', options: ['Vitamina C', 'Vitamina D', 'Complexo B', 'Ferro'] },
    { id: 'Asma', label: 'Asma', desc: 'Bombinhas, Salbutamol', options: ['Salbutamol', 'Beclometasona', 'Montelucaste', 'Bombinha'] },
    { id: 'Antibióticos', label: 'Antibióticos', desc: 'Com receita', options: ['Amoxicilina', 'Azitromicina', 'Ciprofloxacino', 'Cefalexina'] },
    { id: 'Saúde Mental', label: 'Saúde Mental', desc: 'Controlados', options: ['Fluoxetina', 'Sertralina', 'Clonazepam', 'Diazepam'] },
    { id: 'Anti-inflamatórios', label: 'Anti-inflamatórios', desc: 'Diclofenaco', options: ['Diclofenaco', 'Cetoprofeno', 'Nimesulida', 'Piroxicam'] },
    { id: 'Gástrico', label: 'Gástrico', desc: 'Omeprazol', options: ['Omeprazol', 'Pantoprazol', 'Ranitidina', 'Domperidona'] },
    { id: 'Pediátrico', label: 'Pediátrico', desc: 'Xaropes infantis', options: ['Xarope para Tosse', 'Antitérmico Infantil', 'Probiótico', 'Vitaminas Infantis'] }
  ],
  'Higiene': [
    { id: 'Pessoal', label: 'Higiene Pessoal', desc: 'Sabonete, shampoo, pasta...', options: ['Sabonete', 'Shampoo', 'Condicionador', 'Pasta de Dente', 'Escova de Dente', 'Desodorante', 'Absorvente', 'Papel Higiênico'] },
    { id: 'Limpeza', label: 'Limpeza da Casa', desc: 'Detergente, sabão, água sanitária', options: ['Detergente', 'Sabão em Pó', 'Água Sanitária', 'Desinfetante', 'Esponja'] },
    { id: 'Bebe', label: 'Higiene do Bebê', desc: 'Fraldas, lenços', options: ['Fraldas P', 'Fraldas M', 'Fraldas G', 'Fraldas XG', 'Lenço Umedecido', 'Pomada'] },
    { id: 'Geriatrica', label: 'Higiene Geriátrica', desc: 'Fraldas e cuidados para idosos', options: ['Fralda Geriátrica M', 'Fralda Geriátrica G', 'Fralda Geriátrica XG', 'Lenço Umedecido'] },
    { id: 'Banho', label: 'Produtos de Banho', desc: 'Sabonete líquido, espuma', options: ['Sabonete Líquido', 'Espuma de Banho', 'Óleo de Banho', 'Creme Hidratante', 'Loção Corporal'] },
    { id: 'Cabelo', label: 'Cuidados com Cabelo', desc: 'Shampoo, condicionador, óleo', options: ['Shampoo', 'Condicionador', 'Óleo Capilar', 'Máscara de Hidratação', 'Creme para Pentear'] },
    { id: 'Rosto', label: 'Cuidados com Rosto', desc: 'Creme dental, sabonete facial', options: ['Sabonete Facial', 'Creme Hidratante', 'Protetor Solar', 'Tônico Facial', 'Máscara Facial'] },
    { id: 'Feminina', label: 'Higiene Feminina', desc: 'Absorventes, protetores', options: ['Absorvente', 'Protetor Diário', 'Coletores Menstruais', 'Sabonete Íntimo', 'Lenços Umedecidos'] },
    { id: 'Masculina', label: 'Higiene Masculina', desc: 'Produtos específicos', options: ['Sabonete', 'Desodorante', 'Creme de Barbear', 'Gel de Cabelo', 'Loção Pós-Barbe'] },
    { id: 'Infantil', label: 'Higiene Infantil', desc: 'Produtos para crianças', options: ['Sabonete Infantil', 'Shampoo Infantil', 'Creme Hidratante', 'Lenços Umedecidos', 'Pomada para Assaduras'] }
  ],
  'Móveis': [
    { id: 'Cama', label: 'Cama/Colchão', desc: 'Solteiro, Casal, Beliche', options: ['Solteiro', 'Casal', 'Apenas Colchão', 'Cama Box', 'Beliche'] },
    { id: 'Mesa', label: 'Mesa e Cadeiras', desc: 'Para refeições', options: ['4 lugares', '6 lugares', 'Apenas cadeiras', 'Mesa pequena'] },
    { id: 'Sofa', label: 'Sofá', desc: 'Para sala de estar', options: ['2 lugares', '3 lugares', 'Retrátil', 'Poltrona'] },
    { id: 'Armario', label: 'Armário', desc: 'Quarto ou cozinha', options: ['Cozinha', 'Guarda-roupa Solteiro', 'Guarda-roupa Casal', 'Cômoda'] },
    { id: 'Estante', label: 'Estante/Livros', desc: 'Para livros e objetos', options: ['Estante pequena', 'Estante grande', 'Prateleira', 'Biblioteca'] },
    { id: 'Cadeira', label: 'Cadeiras', desc: 'Escritório, cozinha', options: ['Cadeira escritório', 'Cadeira cozinha', 'Cadeira balanço', 'Banqueta'] },
    { id: 'Rack', label: 'Rack/TV', desc: 'Para TV e objetos', options: ['Rack pequeno', 'Rack grande', 'Painel TV', 'Centro de entretenimento'] },
    { id: 'Criado', label: 'Criado-mudo', desc: 'Ao lado da cama', options: ['Criado-mudo simples', 'Criado-mudo com gavetas', 'Mesinha lateral'] }
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
    { id: 'Bota', label: 'Botas', desc: 'Para chuva ou frio', options: ['Galocha', 'Coturno', 'Cano Curto'] },
    { id: 'Sapatilha', label: 'Sapatilhas', desc: 'Confortáveis', options: ['Esporte', 'Casual', 'Trabalho', 'Escola'] },
    { id: 'Meia', label: 'Meias', desc: 'Para calçados', options: ['Curta', 'Longa', 'Esportiva', 'Social'] },
    { id: 'Cinto', label: 'Cintos', desc: 'Acessório', options: ['Couro', 'Sintético', 'Fino', 'Grosso'] }
  ],
  'Contas': [
    { id: 'Luz', label: 'Conta de Luz', desc: 'Pagamento de energia', options: ['Atrasada', 'Vencendo', 'Aviso de Corte'] },
    { id: 'Agua', label: 'Conta de Água', desc: 'Abastecimento', options: ['Atrasada', 'Vencendo', 'Aviso de Corte'] },
    { id: 'Aluguel', label: 'Aluguel', desc: 'Moradia', options: ['Atrasado', 'Parcial', 'Despejo'] },
    { id: 'Gas', label: 'Gás de Cozinha', desc: 'Botijão ou encanado', options: ['Botijão 13kg', 'Conta Gás'] },
    { id: 'Telefone', label: 'Telefone/Internet', desc: 'Comunicação', options: ['Fixo', 'Celular', 'Internet', 'Combo'] },
    { id: 'IPTU', label: 'IPTU', desc: 'Imposto territorial', options: ['Atrasado', 'Parcial', 'Parcelado'] },
    { id: 'Condominio', label: 'Condomínio', desc: 'Taxa mensal', options: ['Atrasado', 'Parcial', 'Despejo'] }
  ],
  'Emprego': [
    { id: 'Curriculo', label: 'Currículo', desc: 'Ajuda para montar ou imprimir', options: ['Revisão', 'Impressão', 'Formatação'] },
    { id: 'Indicacao', label: 'Indicação', desc: 'Oportunidades de trabalho', options: ['CLT', 'Freelance', 'Diária'] },
    { id: 'Entrevista', label: 'Roupa para Entrevista', desc: 'Traje adequado', options: ['Social', 'Esporte Fino', 'Sapato'] }
  ],
  'Transporte': [
    { id: 'Passagem', label: 'Passagem', desc: 'Transporte público', options: ['Ônibus', 'Metrô', 'Trem', 'Cartão Transporte'] },
    { id: 'Combustivel', label: 'Combustível', desc: 'Ajuda para abastecer', options: ['Gasolina', 'Etanol'] },
    { id: 'Bicicleta', label: 'Bicicleta', desc: 'Meio de transporte', options: ['Manutenção', 'Doação'] },
    { id: 'Moto', label: 'Moto', desc: 'Transporte pessoal', options: ['Manutenção', 'Combustível', 'Doação'] },
    { id: 'Carro', label: 'Carro', desc: 'Veículo próprio', options: ['Manutenção', 'Combustível', 'Seguro', 'Licenciamento'] },
    { id: 'Taxi', label: 'Táxi/Uber', desc: 'Transporte por aplicativo', options: ['Viagem Médica', 'Entrevista', 'Emergência'] },
    { id: 'Acessibilidade', label: 'Transporte Acessível', desc: 'Para pessoas com deficiência', options: ['Cadeira de Rodas', 'Rampas', 'Veículo Adaptado'] }
  ],
  'Outros': [
    { id: 'Brinquedos', label: 'Brinquedos', desc: 'Para crianças', options: ['Boneca', 'Carrinho', 'Jogos', 'Educativos'] },
    { id: 'Livros', label: 'Livros/Material', desc: 'Educação e cultura', options: ['Didáticos', 'Literatura', 'Cadernos'] },
    { id: 'Ferramentas', label: 'Ferramentas', desc: 'Para trabalho', options: ['Construção', 'Jardinagem', 'Mecânica'] },
    { id: 'Pet', label: 'Para Pet', desc: 'Ração e cuidados', options: ['Ração Cão', 'Ração Gato', 'Areia', 'Remédio'] },
    { id: 'Material Escolar', label: 'Material Escolar', desc: 'Para estudantes', options: ['Cadernos', 'Lápis', 'Borracha', 'Livros'] },
    { id: 'Equipamentos', label: 'Equipamentos', desc: 'Eletrônicos e outros', options: ['Computador', 'Impressora', 'Telefone', 'Tablet'] },
    { id: 'Roupas Especiais', label: 'Roupas Especiais', desc: 'Para necessidades específicas', options: ['Roupa Hospitalar', 'Roupa de Segurança', 'Uniforme', 'Roupa Térmica'] },
    { id: 'Ajuda Financeira', label: 'Ajuda Financeira', desc: 'Suporte financeiro', options: ['Empréstimo', 'Doação', 'Bolsa', 'Auxílio'] }
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

// Sistema de análise inteligente completo
const SmartValidator = {
  // Análise de categoria vs descrição
  analyzeCategoryMatch(category, description) {
    const descLower = description.toLowerCase();
    const patterns = {
      'Alimentos': {
        required: ['fome', 'comida', 'alimentar', 'cesta', 'família', 'criança'],
        forbidden: ['remédio', 'medicamento', 'doença', 'conta', 'aluguel'],
        context: ['desempregado', 'dificuldade', 'filhos', 'mãe', 'pai']
      },
      'Medicamentos': {
        required: ['remédio', 'medicamento', 'doença', 'saúde', 'tratamento', 'médico'],
        forbidden: ['fome', 'comida', 'alimento', 'conta', 'aluguel'],
        context: ['hospital', 'receita', 'dor', 'urgente', 'grave']
      },
      'Contas': {
        required: ['conta', 'pagar', 'vencimento', 'luz', 'água', 'aluguel'],
        forbidden: ['fome', 'remédio', 'doença'],
        context: ['corte', 'despejo', 'atrasado', 'venceu']
      },
      'Emprego': {
        required: ['trabalho', 'emprego', 'desempregado', 'vaga', 'currículo'],
        forbidden: ['fome', 'remédio', 'conta'],
        context: ['experiência', 'qualificação', 'renda']
      },
      'Roupas': {
        required: ['roupa', 'vestir', 'agasalho', 'frio', 'inverno'],
        forbidden: ['remédio', 'conta', 'emprego'],
        context: ['criança', 'tamanho', 'família']
      },
      'Móveis': {
        required: ['móvel', 'casa', 'cama', 'mesa', 'cadeira', 'geladeira'],
        forbidden: ['remédio', 'conta', 'emprego'],
        context: ['mudança', 'família', 'dormir']
      }
    };

    const pattern = patterns[category];
    if (!pattern) return { score: 50, issues: [] };

    const requiredMatches = pattern.required.filter(word => descLower.includes(word)).length;
    const forbiddenMatches = pattern.forbidden.filter(word => descLower.includes(word));
    const contextMatches = pattern.context.filter(word => descLower.includes(word)).length;

    let score = (requiredMatches / pattern.required.length) * 70 + (contextMatches / pattern.context.length) * 30;
    const issues = [];

    if (requiredMatches === 0) {
      issues.push({
        type: 'Categoria Incompatível',
        severity: 'high',
        message: `Sua descrição não menciona elementos típicos de ${category.toLowerCase()}`,
        suggestion: `Inclua palavras como: ${pattern.required.slice(0, 3).join(', ')}`
      });
      score = Math.max(score - 40, 10);
    }

    if (forbiddenMatches.length > 0) {
      issues.push({
        type: 'Categoria Conflitante',
        severity: 'high',
        message: `Sua descrição menciona "${forbiddenMatches[0]}" que não condiz com ${category}`,
        suggestion: `Verifique se escolheu a categoria correta`
      });
      score = Math.max(score - 30, 5);
    }

    return { score: Math.round(score), issues };
  },

  // Análise de urgência vs descrição
  analyzeUrgencyMatch(urgency, description) {
    const descLower = description.toLowerCase();
    const urgencyPatterns = {
      'critico': {
        required: ['urgente', 'emergência', 'risco', 'grave', 'imediato', 'hospital'],
        timeWords: ['hoje', 'agora', 'imediatamente'],
        context: ['vida', 'morte', 'perigo', 'crítico']
      },
      'urgente': {
        required: ['urgente', 'rápido', 'logo', 'breve'],
        timeWords: ['24h', 'hoje', 'amanhã', 'essa semana'],
        context: ['preciso', 'necessário', 'importante']
      },
      'moderada': {
        required: ['dias', 'semana', 'breve', 'possível'],
        timeWords: ['alguns dias', 'próxima semana', 'em breve'],
        context: ['ajuda', 'apoio', 'colaboração']
      },
      'tranquilo': {
        required: ['quando possível', 'sem pressa', 'tempo'],
        timeWords: ['mês', 'futuro', 'oportunidade'],
        context: ['agradeço', 'grato', 'abençoe']
      }
    };

    const pattern = urgencyPatterns[urgency];
    if (!pattern) return { score: 70, issues: [] };

    const requiredMatches = pattern.required.filter(word => descLower.includes(word)).length;
    const timeMatches = pattern.timeWords.filter(word => descLower.includes(word)).length;
    const contextMatches = pattern.context.filter(word => descLower.includes(word)).length;

    let score = 50;
    const issues = [];

    if (urgency === 'critico' && requiredMatches === 0 && timeMatches === 0) {
      issues.push({
        type: 'Urgência Exagerada',
        severity: 'medium',
        message: 'Urgência CRÍTICA deve indicar risco imediato à vida ou saúde',
        suggestion: 'Use "urgente" se não há risco imediato, ou explique o perigo'
      });
      score = 20;
    } else if (urgency === 'tranquilo' && (descLower.includes('urgente') || descLower.includes('rápido'))) {
      issues.push({
        type: 'Urgência Contraditória',
        severity: 'medium',
        message: 'Você marcou como "tranquilo" mas o texto indica urgência',
        suggestion: 'Revise o nível de urgência ou a descrição'
      });
      score = 30;
    } else {
      score = 60 + (requiredMatches * 15) + (timeMatches * 15) + (contextMatches * 10);
    }

    return { score: Math.min(Math.round(score), 100), issues };
  },

  // Análise de qualidade da descrição
  analyzeDescriptionQuality(description, category) {
    const issues = [];
    let score = 50;

    // Tamanho
    if (description.length < 50) {
      issues.push({
        type: 'Descrição Muito Curta',
        severity: 'high',
        message: 'Descrição muito breve pode não transmitir sua necessidade',
        suggestion: 'Explique sua situação com mais detalhes (mínimo 50 caracteres)'
      });
      score -= 30;
    } else if (description.length > 400) {
      score += 10;
    }

    // Contexto familiar
    const familyWords = ['família', 'filhos', 'criança', 'bebê', 'esposa', 'marido', 'mãe', 'pai'];
    const hasFamilyContext = familyWords.some(word => description.toLowerCase().includes(word));
    if (hasFamilyContext) score += 15;

    // Situação específica
    const situationWords = ['desempregado', 'doente', 'dificuldade', 'problema', 'necessidade'];
    const hasSituation = situationWords.some(word => description.toLowerCase().includes(word));
    if (!hasSituation) {
      issues.push({
        type: 'Falta Contexto',
        severity: 'medium',
        message: 'Não fica claro qual sua situação atual',
        suggestion: 'Explique brevemente sua situação (ex: desemprego, doença, etc.)'
      });
      score -= 15;
    }

    // Gratidão/educação
    const politeWords = ['por favor', 'agradeço', 'obrigado', 'deus abençoe', 'grato'];
    const isPolite = politeWords.some(word => description.toLowerCase().includes(word));
    if (isPolite) score += 10;

    return { score: Math.max(Math.min(Math.round(score), 100), 10), issues };
  },

  // Análise completa
  performCompleteAnalysis(formData) {
    const categoryAnalysis = this.analyzeCategoryMatch(formData.category, formData.description);
    const urgencyAnalysis = this.analyzeUrgencyMatch(formData.urgency, formData.description);
    const qualityAnalysis = this.analyzeDescriptionQuality(formData.description, formData.category);

    const allIssues = [...categoryAnalysis.issues, ...urgencyAnalysis.issues, ...qualityAnalysis.issues];
    const avgScore = Math.round((categoryAnalysis.score + urgencyAnalysis.score + qualityAnalysis.score) / 3);
    
    const canPublish = allIssues.filter(i => i.severity === 'high').length === 0 && avgScore >= 40;
    
    return {
      canPublish,
      confidence: avgScore,
      riskScore: Math.max(100 - avgScore, 10),
      analysis: this.generateAnalysisText(avgScore, allIssues.length, canPublish),
      specificIssues: allIssues.map(issue => ({
        type: issue.type,
        field: this.getFieldFromIssueType(issue.type),
        message: issue.message,
        suggestions: [issue.suggestion]
      })),
      scores: {
        category: categoryAnalysis.score,
        urgency: urgencyAnalysis.score,
        quality: qualityAnalysis.score
      }
    };
  },

  generateAnalysisText(score, issueCount, canPublish) {
    if (canPublish) {
      return score >= 80 ? 
        'Excelente! Seu pedido está muito bem estruturado e tem alta chance de receber ajuda.' :
        'Bom! Seu pedido atende aos critérios básicos e pode ser publicado.';
    }
    
    if (issueCount === 0) {
      return 'Seu pedido precisa de pequenos ajustes para melhorar sua eficácia.';
    }
    
    return issueCount === 1 ? 
      'Encontramos 1 problema que pode afetar a eficácia do seu pedido.' :
      `Encontramos ${issueCount} problemas que podem afetar a eficácia do seu pedido.`;
  },

  getFieldFromIssueType(type) {
    if (type.includes('Categoria')) return 'Categoria';
    if (type.includes('Urgência')) return 'Urgência';
    if (type.includes('Descrição')) return 'Descrição';
    return 'Geral';
  }
};

const validateRequiredFields = (formData) => {
  const errors = [];
  
  if (!formData.category) errors.push({ field: 'category', message: 'Selecione uma categoria' });
  if (!formData.description || formData.description.length < 20) {
    errors.push({ field: 'description', message: 'Descrição deve ter pelo menos 20 caracteres' });
  }
  if (!formData.urgency) errors.push({ field: 'urgency', message: 'Selecione o nível de urgência' });
  
  return errors;
};

const Tooltip = ({ children, content, className = "" }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isVisible) {
      try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) {
          const ctx = new AudioContext();
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          // Som sutil de "pop"
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.08);
          
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
          
          osc.start();
          osc.stop(ctx.currentTime + 0.08);
        }
      } catch (e) {
        // Ignorar erros de áudio
      }
    }
  }, [isVisible]);

  return (
    <div 
      className={`relative ${className}`}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 5, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 p-3 bg-slate-900 text-slate-50 text-xs font-medium rounded-xl shadow-2xl z-[10000] text-center pointer-events-none border border-slate-700 leading-relaxed"
          >
            {content}
            <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-slate-900" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ValidationModal = ({ isOpen, onClose, validationResult, onRetry, onForcePublish }) => {
  if (!isOpen || !validationResult) return null;

  const { canPublish, analysis, confidence, riskScore, suggestions, specificIssues } = validationResult;
  const hasIssues = specificIssues && specificIssues.length > 0;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/75 backdrop-blur-md p-4">
      <motion.div 
        initial={{ scale: 0.8, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-white rounded-[32px] p-8 w-full max-w-5xl shadow-2xl border border-slate-100 relative max-h-[90vh] flex flex-col"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400 to-red-500 rounded-full -translate-y-16 translate-x-16" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400 to-purple-500 rounded-full translate-y-12 -translate-x-12" />
        </div>
        
        <div className="overflow-y-auto custom-scrollbar flex-1 pr-2">
          <div className={`flex flex-col ${hasIssues ? 'lg:flex-row' : ''} gap-8 h-full`}>
            
            {/* Left Side: Header & Analysis */}
            <div className={`flex-1 flex flex-col ${hasIssues ? 'justify-start' : 'justify-center items-center text-center'}`}>
              
              {/* Header */}
              <div className={`mb-8 relative z-10 ${hasIssues ? 'text-left' : 'text-center'}`}>
                <div className={`w-20 h-20 ${hasIssues ? 'mr-auto' : 'mx-auto'} mb-4 rounded-2xl flex items-center justify-center ${
                  canPublish 
                    ? 'bg-green-50 border-2 border-green-200' 
                    : 'bg-orange-50 border-2 border-orange-200'
                }`}>
                  {canPublish ? <CheckCircle2 size={40} className="text-green-600" /> : <AlertTriangle size={40} className="text-orange-600" />}
                </div>
                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-3xl font-black text-slate-900 mb-2"
                >
                  {canPublish ? 'Pedido Aprovado!' : 'Pedido Requer Revisão'}
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-slate-500 text-lg"
                >
                  {canPublish ? 'Tudo certo para publicação' : 'Algumas melhorias são necessárias'}
                </motion.p>
              </div>
              
              {/* Detailed Analysis */}
              {validationResult.scores && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className={`relative z-20 w-full ${hasIssues ? '' : 'max-w-2xl'}`}
                >
                  <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 h-full">
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider mb-6 flex items-center gap-2">
                      <Sparkles size={16} className="text-blue-500" />
                      Análise Detalhada
                    </h3>
                    <div className="flex flex-row justify-between gap-4">
                      {/* Score Item 1 */}
                      <Tooltip className="flex-1" content="Avalia se a descrição corresponde à categoria selecionada.">
                        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 h-full cursor-help hover:bg-slate-50 transition-colors">
                          <div className={`text-2xl font-black ${
                            validationResult.scores.category >= 70 ? 'text-green-500' :
                            validationResult.scores.category >= 40 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                            {validationResult.scores.category}%
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Categoria</p>
                        </div>
                      </Tooltip>
                      
                      {/* Score Item 2 */}
                      <Tooltip className="flex-1" content="Verifica se o nível de urgência condiz com o relato.">
                        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 h-full cursor-help hover:bg-slate-50 transition-colors">
                          <div className={`text-2xl font-black ${
                            validationResult.scores.urgency >= 70 ? 'text-green-500' :
                            validationResult.scores.urgency >= 40 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                            {validationResult.scores.urgency}%
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Urgência</p>
                        </div>
                      </Tooltip>

                      {/* Score Item 3 */}
                      <Tooltip className="flex-1" content="Analisa o detalhamento e clareza da descrição.">
                        <div className="bg-white rounded-xl p-4 border border-slate-100 shadow-sm flex flex-col items-center justify-center gap-2 h-full cursor-help hover:bg-slate-50 transition-colors">
                          <div className={`text-2xl font-black ${
                            validationResult.scores.quality >= 70 ? 'text-green-500' :
                            validationResult.scores.quality >= 40 ? 'text-yellow-500' : 'text-red-500'
                          }`}>
                            {validationResult.scores.quality}%
                          </div>
                          <p className="text-xs font-bold text-slate-400 uppercase">Qualidade</p>
                        </div>
                      </Tooltip>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Specific Issues */}
            {hasIssues && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex-1 lg:max-w-md relative z-10"
              >
                <div className="bg-red-50 rounded-2xl p-6 border border-red-100 h-full flex flex-col">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                      <AlertTriangle size={18} />
                    </div>
                    <h3 className="font-black text-slate-900 text-sm uppercase tracking-wider">Problemas Encontrados</h3>
                  </div>
                  <div className="flex flex-col gap-3 overflow-y-auto custom-scrollbar pr-2 flex-1 max-h-[400px]">
                    {specificIssues.map((issue, index) => (
                      <motion.div 
                        key={index}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 + (index * 0.1) }}
                        className="bg-white rounded-xl p-4 border border-red-200 shadow-sm"
                      >
                        <div className="flex items-start gap-3">
                          <div className="mt-1">
                            <X size={16} className="text-red-500" strokeWidth={3} />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-bold text-red-500 uppercase mb-1">{issue.field}</p>
                            <p className="text-sm text-slate-800 font-bold mb-1 leading-tight">{issue.message}</p>
                            {issue.suggestions && issue.suggestions.length > 0 && (
                              <div className="mt-2 text-xs text-slate-600 bg-slate-50 rounded-lg p-2 border border-slate-100">
                                <strong className="block mb-1 text-slate-400">Sugestão:</strong>
                                {issue.suggestions[0]}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Actions */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 pt-6 border-t border-slate-100 flex gap-4 justify-end relative z-10"
        >
          {!canPublish && (
            <>
              <button 
                onClick={onRetry}
                className="py-3 px-6 bg-white hover:bg-slate-50 text-slate-600 rounded-2xl font-bold text-sm transition-all shadow-sm border border-slate-200 flex items-center justify-center gap-2"
              >
                <RefreshCcw size={16} /> Revisar Pedido
              </button>
              <button 
                onClick={onForcePublish}
                className="py-3 px-6 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 border-0"
              >
                <Rocket size={16} /> Publicar Mesmo Assim
              </button>
            </>
          )}
          {canPublish && (
            <motion.button 
              onClick={onClose}
              className="w-full md:w-auto py-3 px-8 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold text-sm transition-all shadow-lg flex items-center justify-center gap-2 border-0"
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

const SuccessModal = ({ urgencyColor, urgencyLabel, urgencyIcon: UrgencyIcon, reason, onClose, analysisResult }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-md">
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      className="bg-white rounded-[32px] p-12 max-w-lg w-full mx-4 shadow-2xl text-center"
    >
      <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
        <Check size={48} strokeWidth={3} />
      </div>
      <h2 className="text-4xl font-black text-slate-900 mb-4">Pedido Publicado!</h2>
      <p className="text-xl text-slate-500 mb-8">{reason}</p>
      
      {/* Success Analysis */}
      {analysisResult && (
        <div className="mb-8 p-6 bg-green-50 rounded-2xl border border-green-100">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center">
              <Check size={16} />
            </div>
            <span className="font-bold text-green-800">Qualidade: {analysisResult.confidence}%</span>
          </div>
          <p className="text-sm text-green-700">
            {analysisResult.confidence >= 80 ? 'Excelente estruturação!' :
             analysisResult.confidence >= 60 ? 'Boa estruturação!' : 'Pedido aprovado!'}
          </p>
        </div>
      )}
      
      <div className="flex items-center justify-center gap-3 mb-12 p-4 bg-slate-50 rounded-2xl border border-slate-100" style={{ '--urgency-color': urgencyColor }}>
        <div className="flex items-center gap-2 font-black uppercase tracking-widest text-sm success-urgency-label">
          {UrgencyIcon && <UrgencyIcon size={20} />}
          {urgencyLabel}
        </div>
      </div>
      <button 
        onClick={onClose}
        className="w-full py-5 bg-slate-900 text-white rounded-full font-black text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 border-0"
      >
        Ver no Mapa da Comunidade
      </button>
    </motion.div>
  </div>
);

const SoundWave = () => (
  <div className="sound-wave">
    <div className="bar"></div>
    <div className="bar"></div>
    <div className="bar"></div>
    <div className="bar"></div>
    <div className="bar"></div>
  </div>
);

const ItemSpecificationModal = ({ item, onClose, onSave, categoryColor }) => {
  const [selectedOptions, setSelectedOptions] = useState(item.selectedOptions || []);
  const [details, setDetails] = useState(item.details || '');

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
        className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm sm:max-w-md w-full shadow-lg relative border-0 modal-dynamic-wrapper"
        style={{ '--modal-color': categoryColor }}
      >
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-transparent rounded-3xl" />

        <div className="relative z-10">
          {/* Header */}
          <div className="flex items-start justify-between mb-8">
            <div className="flex-1">
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                {item.label}
              </h3>
              <p className="text-base text-slate-500 font-medium leading-relaxed">
                Selecione as opções que se aplicam à sua necessidade
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-xl text-slate-400 hover:text-slate-600 transition-colors ml-4 border-0"
            >
              <X size={20} />
            </button>
          </div>

          {/* Options Grid */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              {item.options?.map((opt, index) => {
                const isSelected = selectedOptions.includes(opt);
                return (
                  <motion.button
                    key={opt}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => toggleOption(opt)}
                    className={`group pda-option-btn modal-option-btn ${
                      isSelected
                        ? 'selected'
                        : ''
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="truncate flex-1">
                        {opt}
                      </span>
                      <div className="w-5 h-5 flex items-center justify-center flex-shrink-0 ml-2">
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-4 h-4 rounded-full flex items-center justify-center modal-check-circle"
                        >
                          <Check size={12} className="text-white" strokeWidth={3} />
                        </motion.div>
                      )}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Details Input */}
          <div className="mb-8">
            <label className="block text-sm font-bold text-slate-700 mb-3 ml-1">
              Observações adicionais
            </label>
            <textarea
              className="w-full p-4 bg-slate-50 border-0 rounded-2xl text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 transition-all resize-none min-h-[100px] text-sm font-medium shadow-inner modal-textarea"
              style={{ 
                borderColor: details ? categoryColor : undefined
              }}
              placeholder="Ex: Quantidade específica, preferências..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
            />
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-2">
            <button
              onClick={onClose}
              className="flex-1 py-4 px-6 text-slate-600 font-bold bg-slate-100 hover:bg-slate-200 rounded-2xl transition-colors border-0"
            >
              Cancelar
            </button>
            <button
              onClick={handleSave}
              className="flex-[2] py-4 px-6 text-white font-bold rounded-2xl transition-all hover:shadow-lg border-0 modal-confirm-btn"
            >
              Confirmar Seleção
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const CategoryConfirmationModal = ({ category, onClose, onConfirm }) => {
  if (!category) return null;
  
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center relative overflow-hidden modal-dynamic-wrapper"
        style={{ '--modal-color': category.color }}
      >
        <div className="absolute top-0 left-0 right-0 h-2 cat-confirm-bar" />
        
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center cat-confirm-icon-bg">
          <category.icon size={40} color={category.color} />
        </div>
        
        <h3 className="text-2xl font-black text-slate-900 mb-2">
          Selecionar {category.label}?
        </h3>
        <p className="text-slate-500 mb-8">
          Você escolheu a categoria <strong>{category.label}</strong>. Deseja prosseguir para a seleção de itens?
        </p>
        
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-xl font-bold transition-colors border-0"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 px-4 text-white rounded-xl font-bold transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 border-0 cat-confirm-btn"
          >
            Sim, continuar
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const fireConfetti = (e) => {
  const container = document.getElementById('pda-confetti-container');
  if (!container) {
    console.error('Confetti container not found!');
    return;
  }
  
  const x = e?.clientX || window.innerWidth / 2;
  const y = e?.clientY || window.innerHeight / 2;

  // Efeito sonoro de "pop"
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (AudioContext) {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.15);
      
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    }
  } catch (err) {
    // Silently fail if audio is not supported or blocked
  }

  for (let i = 0; i < 50; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'pda-confetti';
    confetti.style.left = `${x}px`;
    confetti.style.top = `${y}px`;
    confetti.style.backgroundColor = ['#ff595e', '#ffca3a', '#8ac926', '#1982c4', '#6a4c93', '#f72585', '#4cc9f0'][Math.floor(Math.random() * 7)];
    
    const angle = Math.random() * 360;
    const velocity = 100 + Math.random() * 200;
    const tx = Math.cos(angle * Math.PI / 180) * velocity;
    const ty = Math.sin(angle * Math.PI / 180) * velocity;

    confetti.style.setProperty('--tx', `${tx}px`);
    confetti.style.setProperty('--ty', `${ty}px`);
    confetti.style.setProperty('--rot', `${Math.random() * 720}deg`);
    container.appendChild(confetti);
    setTimeout(() => confetti.remove(), 1000);
  }
};

const Step2IntroModal = ({ onClose }) => (
  <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl text-center"
    >
      <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
        <ListChecks size={32} />
      </div>
      <h3 className="text-2xl font-black text-slate-900 mb-4">Vamos detalhar seu pedido</h3>
      <p className="text-slate-500 mb-8 text-lg">
        Clique nos itens abaixo que correspondem à sua necessidade. Você pode selecionar vários e adicionar detalhes específicos em cada um.
      </p>
      <button
        onClick={onClose}
        className="btn-start-selection"
      >
        Começar a selecionar
      </button>
    </motion.div>
  </div>
);

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
  const [pendingCategory, setPendingCategory] = useState(null);
  const [showStep2IntroModal, setShowStep2IntroModal] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(true);

  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);

  const [isPublished, setIsPublished] = useState(false);
    
  const stages = ['Analisando categoria', 'Verificando urgência', 'Avaliando descrição', 'Gerando sugestões'];

  const [formData, setFormData] = useState({
    category: '',
    items: [],
    description: '',
    urgency: '',
    visibility: ['bairro'],
    radius: 2,
    isPublic: true,
    userLocation: null,
    locationString: 'Detectando localização...',
    city: '',
    state: '',
    neighborhood: ''
  });

  // Load draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('solidar-pda-draft');
    if (savedDraft) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.formData) {
          setFormData(prev => ({ ...prev, ...parsed.formData }));
        }
        if (parsed.step) {
          setStep(parsed.step);
        }
      } catch (e) {
        console.error('Erro ao carregar rascunho:', e);
      }
    }
  }, []);

  // Save draft on change
  useEffect(() => {
    if (!isPublished) {
      const timeoutId = setTimeout(() => {
        localStorage.setItem('solidar-pda-draft', JSON.stringify({ formData, step }));
      }, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [formData, step, isPublished]);

  useEffect(() => {
    if (step === 2) {
      setShowStep2IntroModal(true);
    }
  }, [step]);

  useEffect(() => {
    if (step === 2) {
      const handleScroll = () => {
        const isBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 150;
        setShowScrollHint(!isBottom);
      };
      
      window.addEventListener('scroll', handleScroll);
      handleScroll(); // Check initially
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [step]);

  const [headerRef, headerInView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [formRef, formInView] = useInView({ threshold: 0.1, triggerOnce: true });

  const nextStep = useCallback(() => {
    setStep(s => Math.min(s + 1, TOTAL_STEPS));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleCategoryClick = (cat) => {
    setPendingCategory(cat);
  };

  const confirmCategory = () => {
    if (pendingCategory) {
      updateData({ category: pendingCategory.id });
      setPendingCategory(null);
      nextStep();
    }
  };
  
  const prevStep = useCallback(() => {
    setStep(s => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const updateData = useCallback((data) => {
    setFormData(prev => ({ ...prev, ...data }));
  }, []);

  const handlePublish = useCallback(async () => {
    // Validar campos obrigatórios primeiro
    const requiredFieldsErrors = validateRequiredFields(formData);
    if (requiredFieldsErrors.length > 0) {
      setValidationResult({
        canPublish: false,
        analysis: 'Campos obrigatórios não foram preenchidos adequadamente.',
        confidence: 0,
        riskScore: 100,
        specificIssues: requiredFieldsErrors.map(error => ({
          type: 'Campo Obrigatório',
          field: error.field === 'category' ? 'Categoria' : error.field === 'description' ? 'Descrição' : 'Urgência',
          message: error.message,
          suggestions: ['Preencha este campo antes de continuar']
        }))
      });
      setShowValidationModal(true);
      return;
    }

    setIsSubmitting(true);
    setIsAnalyzing(true);
    setAnalysisStage(0);
    
    try {
      // AI Analysis with progress
      for (let i = 0; i < stages.length; i++) {
        setAnalysisStage(i);
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Usar o sistema de análise inteligente
      const analysisResult = SmartValidator.performCompleteAnalysis(formData);
      
      setIsAnalyzing(false);
      
      // Se não pode publicar, mostrar modal com problemas
      if (!analysisResult.canPublish) {
        setValidationResult(analysisResult);
        setShowValidationModal(true);
        return;
      }
      
      // Get AI validation result (fallback)
      const result = await AIAssistant.validateRequest(formData);
      
      // Check if validation passed
      if (!result.canPublish) {
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
        isPublic: formData.isPublic,
        status: 'ativo'
      };
      
      console.log('📤 Enviando pedido para API:', pedidoData);
      const response = await ApiService.createPedido(pedidoData);
      console.log('✅ Pedido criado com sucesso:', response);
      
      // Registrar estatísticas
      if (user?.uid || user?.id) {
        StatsManager.registerPedidoCriado(user.uid || user.id, pedidoData);
      }
      
      // Manter resultado da análise para o modal de sucesso
      const finalAnalysis = SmartValidator.performCompleteAnalysis(formData);
      setValidationResult(finalAnalysis);
      
      // Limpar rascunho
      localStorage.removeItem('solidar-pda-draft');

      // Show success
      setIsPublished(true);
      
    } catch (error) {
      console.error('❌ Erro ao publicar pedido:', error);
      setIsAnalyzing(false);
      // Show error in validation modal
        setValidationResult({
          canPublish: false,
          analysis: `Erro de conexão: ${error.message}`,
          confidence: 0,
          riskScore: 100,
          specificIssues: [{
            type: 'Erro do Sistema',
            field: 'Conexão',
            message: error.message.includes('token') ? 'Você precisa estar logado para publicar um pedido' : 'Erro de conexão com o servidor',
            suggestions: ['Verifique sua conexão', 'Tente novamente em alguns instantes']
          }]
        });
      setShowValidationModal(true);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, stages.length]);

  const handleRetryValidation = () => {
    setShowValidationModal(false);
    setValidationResult(null);
    
    // Levar para o passo 2 (Itens) para revisão geral
    setStep(2);

    // Scroll to top to ensure visibility
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
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
        isPublic: formData.isPublic,
        status: 'ativo'
      };
      
      console.log('📤 Forçando publicação do pedido:', pedidoData);
      const response = await ApiService.createPedido(pedidoData);
      console.log('✅ Pedido forçado criado com sucesso:', response);
      
      // Registrar estatísticas
      if (user?.uid || user?.id) {
        StatsManager.registerPedidoCriado(user.uid || user.id, pedidoData);
      }
      
      localStorage.removeItem('solidar-pda-draft');
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
    if (len < 200) return { label: "História envolvente", color: "text-emerald-500", bg: "bg-emerald-50", width: "w-[80%]" };
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
    
    updateData({ description: `${prefix}${text}${suffix}`.slice(0, 300) });
    setIsImproving(false);
  };

  const isStepValid = useMemo(() => {
    switch (step) {
      case 1: return formData.category !== '';
      case 2: return true; // Items are optional but recommended
      case 3: return formData.description.length >= 20; // Aumentado para 20 caracteres mínimos
      case 4: return formData.urgency !== '';
      case 5: return formData.visibility.length > 0;
      case 6: {
        // Validação final antes de publicar
        const errors = validateRequiredFields(formData);
        return errors.length === 0;
      }
      default: return true;
    }
  }, [step, formData]);

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <motion.div className="form-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="w-full max-w-[1600px] mx-auto px-6 py-4">
              <div className="text-center mb-6">
                <h2 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">Qual tipo de ajuda você precisa?</h2>
                <p className="text-xl text-slate-500 font-medium">Escolha a categoria que melhor descreve sua necessidade.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-6">
                {CATEGORIES.map((cat, index) => (
                  <motion.button
                    key={cat.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => handleCategoryClick(cat)}
                    className={`relative flex flex-col items-center justify-center p-8 rounded-[32px] transition-all duration-300 bg-white group h-full min-h-[240px] border-0 ${
                      formData.category === cat.id 
                        ? 'shadow-2xl scale-105 ring-4 ring-offset-4 z-10' 
                        : 'shadow-lg hover:shadow-xl hover:-translate-y-1 hover:bg-slate-50/80'
                    }`}
                    style={{ 
                      '--cat-color': cat.color,
                      '--tw-ring-color': cat.color
                    }}
                  >
                    <div className={`relative mb-6 p-6 rounded-3xl transition-colors shadow-sm ${formData.category === cat.id ? 'bg-white' : 'bg-slate-50 group-hover:bg-white'}`}>
                      <cat.icon size={56} color={cat.color} strokeWidth={1.5} />
                    </div>
                    <span className={`text-xl font-bold transition-colors ${formData.category === cat.id ? 'text-slate-900' : 'text-slate-600 group-hover:text-slate-800'}`}>{cat.label}</span>
                    {formData.category === cat.id && (
                      <>
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 bg-green-500 text-white rounded-full p-2 shadow-lg"
                        >
                          <Check size={24} strokeWidth={4} />
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
            <div className="max-w-5xl mx-auto px-6 py-4">
              <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">O que você precisa exatamente?</h2>
                <p className="text-lg text-slate-500">Selecione os itens e especifique os detalhes.</p>
              </div>

              {currentSubcategories.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12 max-w-7xl mx-auto">
                  {currentSubcategories.length > 4 && showScrollHint && (
                    <div className="scroll-hint-badge">
                      <span className="text-sm font-bold text-white">Role para ver mais opções</span>
                      <ArrowDown size={16} className="text-white" />
                    </div>
                  )}
                  
                  {currentSubcategories.map((sub) => {
                    const savedItem = formData.items.find(i => i.id === sub.id);
                    const isSelected = !!savedItem;
                    
                    return (
                      <motion.div
                        key={sub.id}
                        whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(0,0,0,0.08)' }}
                        onClick={() => {
                          if (!isSelected) {
                            setCurrentItem(sub);
                            setShowItemModal(true);
                          }
                        }}
                        className={`p-8 rounded-[32px] text-left transition-all duration-300 relative overflow-hidden group border-0 cursor-pointer h-full item-card-wrapper ${
                          isSelected
                            ? 'bg-white shadow-xl ring-2 ring-offset-2 item-card-selected'
                            : 'bg-white shadow-lg hover:shadow-2xl'
                        }`}
                        style={{ '--item-color': catColor, '--tw-ring-color': catColor }}
                      >
                        <div className={`transition-all duration-300 ${isSelected ? 'blur-sm opacity-40 pointer-events-none' : ''}`}>
                          <div className={`absolute top-0 right-0 p-4 opacity-0 transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'group-hover:opacity-100'}`}>
                             <div className="w-8 h-8 rounded-full flex items-center justify-center item-icon-bg">
                               {isSelected ? <CheckCircle2 size={18} className="text-white" /> : <Plus size={18} className="text-slate-400" />}
                             </div>
                          </div>

                          <div className="flex justify-between items-start mb-2">
                            <span className={`block text-xl font-black mb-2 item-label-text`}>{sub.label}</span>
                          </div>
                          <p className="text-base font-medium text-slate-400 leading-relaxed pr-8">{sub.desc}</p>
                        </div>

                        {isSelected && (
                          <div className="item-card-overlay">
                            <motion.button
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                fireConfetti(e);
                                setTimeout(() => nextStep(), 400);
                              }}
                              className="w-full py-3 px-4 btn-confirm-continue text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
                            >
                              <CheckCircle2 size={18} />
                              Confirmar e Continuar
                            </motion.button>
                            
                            <motion.button
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                              onClick={(e) => {
                                e.stopPropagation();
                                setCurrentItem({ ...sub, ...savedItem });
                                setShowItemModal(true);
                              }}
                              className="w-full py-3 px-4 bg-white hover:bg-slate-50 text-slate-700 rounded-xl font-bold shadow-md border border-slate-200 flex items-center justify-center gap-2 transition-all hover:scale-105"
                            >
                              <Edit2 size={18} />
                              Editar
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center p-12 bg-white rounded-[32px] shadow-lg mb-12">
                  <p className="text-lg text-slate-500">Não há itens específicos pré-definidos para esta categoria. Por favor, descreva detalhadamente na próxima etapa.</p>
                </div>
              )}

              {formData.items.length > 0 && (
                <div className="bg-white rounded-[32px] p-8 shadow-lg">
                  <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-3">
                    <ListChecks size={20} /> Itens Configurados
                  </h3>
                  <div className="flex flex-col gap-4">
                    {formData.items.map((item, idx) => (
                      <div 
                        key={idx} 
                        className="relative p-6 rounded-2xl transition-all group border-0"
                        style={{
                          background: `linear-gradient(180deg, #ffffff 0%, ${catColor}05 100%)`,
                          boxShadow: `0 8px 24px -6px ${catColor}15`
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold mb-3" style={{ backgroundColor: `${catColor}15`, color: catColor }}>
                              <CheckCircle2 size={12} />
                              Configurado • {item.selectedOptions.length} opções
                            </div>
                            
                            <strong className="text-slate-900 block text-xl mb-2">{item.label}</strong>
                            
                            <div className="flex flex-wrap gap-2 mb-3">
                              {item.selectedOptions.map((opt, i) => (
                                <span key={i} className="text-sm font-medium text-slate-600 bg-white/80 px-2 py-1 rounded-md border border-slate-100">
                                  {opt}
                                </span>
                              ))}
                            </div>
                            
                            {item.details && (
                              <div className="flex items-start gap-2 text-sm text-slate-500 bg-white/50 p-3 rounded-xl border border-slate-100/50">
                                <Edit2 size={14} className="mt-0.5 opacity-50" />
                                <span className="italic">"{item.details}"</span>
                              </div>
                            )}
                          </div>
                          
                          <div className="flex flex-col gap-2 ml-4">
                            <button 
                              onClick={() => {
                                setCurrentItem(SUBCATEGORIES[formData.category].find(sub => sub.id === item.id));
                                setShowItemModal(true);
                              }}
                              className="p-2 rounded-xl bg-white border-0 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
                              title="Editar"
                            >
                              <Edit2 size={18} />
                            </button>
                            <button 
                              onClick={() => updateData({ items: formData.items.filter(i => i.id !== item.id) })}
                              className="p-2 rounded-xl bg-white border-0 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                              title="Remover"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
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
            <div className="max-w-5xl mx-auto px-6 py-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Conte sua história</h2>
                <p className="text-lg text-slate-500">Sua descrição ajuda as pessoas a entenderem como podem ser úteis.</p>
              </div>
              <div className="description-container flex flex-row gap-8">
                <div className="flex-[3] flex flex-col gap-6">
                  <div className="bg-white rounded-[32px] p-8 shadow-lg transition-shadow hover:shadow-xl border-0">
                    <div className="flex justify-between items-center mb-6">
                      <div className="flex items-center gap-3 text-rose-500 font-extrabold text-xl">
                        <Heart size={24} className="text-rose-500" />
                        <span>Sua história importa</span>
                      </div>
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-wider transition-all ${descriptionQuality.bg} ${descriptionQuality.color}`}>
                        <div className={`w-2 h-2 rounded-full ${descriptionQuality.width === 'w-0' ? 'bg-slate-300' : 'bg-current'} animate-pulse`} />
                        {descriptionQuality.label}
                      </div>
                    </div>
                    
                    <div className="relative group mb-4">
                      <textarea
                        placeholder="Exemplo: Sou mãe solteira de 3 filhos e estou desempregada há 2 meses. Preciso de cestas básicas para alimentar minha família. Meus filhos têm 5, 8 e 12 anos e estamos passando por dificuldades. Qualquer ajuda será muito bem-vinda e Deus abençoará quem puder nos ajudar neste momento difícil."
                        value={formData.description}
                        onChange={(e) => updateData({ description: e.target.value.slice(0, 300) })}
                        className="w-full p-0 border-0 text-lg leading-relaxed text-slate-700 placeholder:text-slate-300 focus:outline-none resize-none bg-transparent description-step-textarea"
                      />
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-slate-500">
                          {formData.description.length}/300
                        </span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <div 
                              key={i}
                              className={`w-1 h-1 rounded-full transition-all ${
                                i < Math.ceil((formData.description.length / 300) * 5) 
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
                          style={{ width: `${Math.min((formData.description.length / 300) * 100, 100)}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="action-buttons-container">
                    <motion.button
                      onClick={toggleRecording}
                      className={`voice-btn ${isRecording ? 'recording' : ''}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      {isRecording ? <SoundWave /> : <Mic size={20} />}
                      {isRecording ? 'Parar Gravação' : 'Gravar Voz'}
                    </motion.button>
                    
                    <motion.button
                      onClick={improveWithAI}
                      disabled={formData.description.length < 20 || isImproving}
                      className="ai-btn"
                      whileHover={formData.description.length >= 20 && !isImproving ? { scale: 1.02 } : {}}
                      whileTap={formData.description.length >= 20 && !isImproving ? { scale: 0.98 } : {}}
                    >
                      {isImproving ? (
                        <RefreshCcw size={20} className="animate-spin" />
                      ) : (
                        <Sparkles size={20} />
                      )}
                      {isImproving ? 'Melhorando...' : 'Melhorar com IA'}
                    </motion.button>
                  </div>
                </div>

                <div className="flex-1 tips-card h-fit">
                  <div className="tips-header">
                    <div className="tips-icon-box">
                      <Lightbulb size={24} />
                    </div>
                    <span className="tips-title">Dicas importantes</span>
                  </div>
                  <ul className="tips-list">
                    {dynamicTips.map((tip, i) => (
                      <motion.li 
                        key={i}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + (i * 0.1) }}
                        className="tip-item"
                      >
                        <div className="tip-check">
                          <Check size={14} strokeWidth={3} />
                        </div>
                        <span className="tip-text">{tip}</span>
                      </motion.li>
                    ))}
                  </ul>
                  
                  {/* Quality indicator */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Qualidade da História</span>
                      <span className={`text-xs font-bold ${descriptionQuality.color}`}>
                        {Math.round((formData.description.length / 300) * 100)}%
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
                        style={{ width: `${Math.min((formData.description.length / 300) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div className="form-step" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="max-w-6xl mx-auto px-6 py-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Qual a urgência?</h2>
                <p className="text-lg text-slate-500">Isso ajuda a priorizar casos críticos.</p>
              </div>
              <div className="flex flex-wrap justify-center gap-8">
                {URGENCY_OPTIONS.map((opt, index) => (
                  <motion.button
                    key={opt.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => updateData({ urgency: opt.id })}
                    className={`relative flex flex-col items-center p-8 rounded-[32px] transition-all duration-300 bg-white border-0 text-center group ${
                      formData.urgency === opt.id 
                        ? 'shadow-2xl scale-105 ring-4 ring-offset-4' 
                        : 'shadow-lg hover:shadow-2xl hover:-translate-y-2 hover:bg-slate-50/50'
                    }`}
                    style={{ '--urg-color': opt.color, '--tw-ring-color': opt.color }}
                  >
                    <div className="mb-6 p-5 rounded-full bg-slate-50 group-hover:bg-white transition-colors shadow-sm">
                      <opt.icon size={40} color={opt.color} strokeWidth={2} />
                    </div>
                    <div className="flex flex-col items-center">
                      <strong className="text-xl font-bold text-slate-800 mb-2">{opt.label}</strong>
                      <p className="text-base text-slate-500">{opt.desc}</p>
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
            <div className="visibility-step-container">
              <div className="text-center mb-6">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-4">Quem deve ver seu pedido?</h2>
                <p className="text-lg text-slate-500">Defina o alcance para notificar pessoas próximas.</p>
              </div>
              
              <div className="visibility-flex-container">
                <div className="visibility-options-side">
                  <div className="bg-white rounded-[32px] p-6 shadow-xl h-full flex flex-col justify-center overflow-y-auto">
                    <h3 className="text-lg font-bold text-slate-400 uppercase tracking-wider mb-6 ml-2">Opções de Visibilidade</h3>
                    <div className="space-y-4">
                      {VISIBILITY_OPTIONS.map((opt, index) => {
                        const isActive = formData.visibility.includes(opt.id);
                        return (
                          <motion.button
                            key={opt.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
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
                            className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all duration-200 border-2 text-left group relative overflow-hidden ${
                              isActive
                                ? 'bg-slate-50 border-blue-500 shadow-md'
                                : 'bg-white border-slate-100 hover:border-blue-200 hover:bg-slate-50'
                            }`}
                          >
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-colors ${
                              isActive ? 'bg-blue-500 text-white' : 'bg-slate-100 text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-50'
                            }`}>
                              <opt.icon size={24} />
                            </div>
                            <div className="flex-1 z-10">
                              <strong className={`block text-base font-bold mb-0.5 ${isActive ? 'text-slate-900' : 'text-slate-700'}`}>{opt.label}</strong>
                              <p className="text-sm text-slate-500">{opt.desc}</p>
                            </div>
                            {isActive && (
                              <motion.div 
                                initial={{ scale: 0 }} 
                                animate={{ scale: 1 }}
                                className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-sm"
                              >
                                <Check size={14} strokeWidth={3} />
                              </motion.div>
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="visibility-map-side">
                  <div className="bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden border-0 h-full min-h-[400px] lg:min-h-0 flex flex-col relative text-white group">
                    {/* Map Background Effect - Enhanced */}
                    <div className="absolute inset-0 opacity-30">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-blue-600/20 via-slate-900/60 to-slate-900"></div>
                        <div className="map-grid-pattern absolute inset-0"></div>
                    </div>

                    <div className="flex-1 relative flex items-center justify-center p-8 overflow-hidden">
                      {/* Radius Circles Animation - Dynamic based on radius */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                         {/* Multiple rings for radar effect */}
                         {[1, 2, 3].map(i => (
                             <motion.div 
                                key={i}
                                animate={{ 
                                    scale: [1, 1.1, 1],
                                    opacity: [0.1, 0.2, 0.1],
                                }}
                                transition={{ duration: 4, delay: i * 1.5, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute rounded-full border border-blue-500/20"
                                style={{
                                    width: `${Math.min(formData.radius * 15 + (i * 80), 400)}px`,
                                    height: `${Math.min(formData.radius * 15 + (i * 80), 400)}px`,
                                }}
                             />
                         ))}
                         
                         {/* Active Radius Circle */}
                         <motion.div 
                            animate={{ 
                                width: `${Math.min(Math.max(formData.radius * 20, 120), 380)}px`,
                                height: `${Math.min(Math.max(formData.radius * 20, 120), 380)}px`,
                                borderColor: ['rgba(59, 130, 246, 0.3)', 'rgba(59, 130, 246, 0.6)', 'rgba(59, 130, 246, 0.3)']
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute rounded-full border-2 border-blue-400/30 bg-blue-500/5 backdrop-blur-[1px]"
                         />
                      </div>

                      <div className="relative z-10 text-center">
                        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-[0_0_50px_-10px_rgba(59,130,246,0.6)] flex items-center justify-center mx-auto mb-6 relative z-20 ring-4 ring-slate-900/50">
                           <MapPin size={32} className="text-white drop-shadow-md" />
                           <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-pulse"></div>
                        </div>
                        
                        <div className="bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/10 shadow-xl inline-block max-w-[280px]">
                             <h4 className="font-bold text-white text-lg leading-tight truncate">{formData.locationString.split(',')[0]}</h4>
                             <p className="text-blue-300 text-xs mt-1 font-medium">{formData.city || 'Localização Atual'}</p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Controls Section */}
                    <div className="p-6 bg-slate-800/80 backdrop-blur-md border-t border-white/10 relative z-30">
                      <div className="flex items-center justify-between mb-6">
                          <div>
                              <p className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-1">Raio de Alcance</p>
                              <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-black text-white tracking-tight">{formData.radius}</span>
                                <span className="text-sm font-bold text-slate-400">km</span>
                              </div>
                          </div>
                          <div className="text-right">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estimativa</p>
                              <div className="flex items-center justify-end gap-1.5 text-emerald-400 text-sm font-bold bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20">
                                <Users size={14} />
                                <span>~{Math.floor(formData.radius * 150)} pessoas</span>
                              </div>
                          </div>
                      </div>
                      
                      {/* Slider Control */}
                      <div className="flex items-center gap-4">
                          <button 
                            onClick={() => updateData({ radius: Math.max(1, formData.radius - 1) })}
                            className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors border border-white/5 active:scale-95"
                          >
                            <Minus size={18} />
                          </button>
                          
                          <div className="flex-1 relative h-12 flex items-center">
                             <input 
                                type="range" 
                                min="1" 
                                max="50" 
                                step="1"
                                value={formData.radius}
                                onChange={(e) => updateData({ radius: parseInt(e.target.value) })}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500 relative z-10"
                             />
                             <div className="absolute inset-0 flex justify-between items-center px-1 pointer-events-none opacity-30 text-[10px] font-bold text-slate-400 mt-6">
                                 <span>1km</span>
                                 <span>25km</span>
                                 <span>50km</span>
                             </div>
                          </div>

                          <button 
                            onClick={() => updateData({ radius: Math.min(50, formData.radius + 1) })}
                            className="w-10 h-10 rounded-xl bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center transition-colors border border-white/5 active:scale-95"
                          >
                            <Plus size={18} />
                          </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div className="form-step confirmation-step" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-full max-w-3xl mx-auto px-4">
              <div className="text-center mb-8">
                <h2 className="text-3xl md:text-4xl font-black text-slate-800 mb-2">Confirmar pedido</h2>
                <p className="text-lg text-slate-500">Revise os detalhes antes de publicar.</p>
              </div>
              
              <div className="bg-white rounded-[32px] shadow-2xl overflow-hidden border border-slate-100 relative transition-transform hover:-translate-y-1 duration-300 mb-12">
                {/* Top colored bar */}
                <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${selectedCategory?.color || '#3b82f6'}, ${selectedUrgency?.color || '#f97316'})` }}></div>
                
                <div className="p-8 md:p-10">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8 pb-8 border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg text-white" style={{ backgroundColor: selectedCategory?.color || '#94a3b8' }}>
                                {selectedCategory && <selectedCategory.icon size={32} />}
                            </div>
                            <div>
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Categoria</p>
                                <h3 className="text-2xl font-black text-slate-800 leading-none">{formData.category}</h3>
                            </div>
                        </div>
                        
                        <div className="flex items-center gap-3 px-5 py-2.5 rounded-xl bg-slate-50 border-2" style={{ borderColor: selectedUrgency?.color || '#cbd5e1' }}>
                            {selectedUrgency && <selectedUrgency.icon size={20} style={{ color: selectedUrgency.color }} />}
                            <div>
                                <p className="text-[10px] font-bold uppercase tracking-wider opacity-60 leading-tight">Urgência</p>
                                <p className="text-sm font-black uppercase tracking-tight leading-tight" style={{ color: selectedUrgency?.color }}>{selectedUrgency?.label}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    {formData.items.length > 0 && (
                        <div className="mb-8">
                            <div className="flex items-center gap-2 mb-4 text-slate-400">
                                <ListChecks size={18} />
                                <span className="text-xs font-bold uppercase tracking-widest">Itens Solicitados</span>
                            </div>
                            <div className="bg-slate-50/80 rounded-2xl p-5 border border-slate-100 space-y-4">
                                {formData.items.map((item, idx) => (
                                    <div key={idx} className="flex gap-3">
                                        <div className="mt-1.5 w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: selectedCategory?.color }}></div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-800">{item.label}</p>
                                            <p className="text-sm text-slate-600 mt-1">{item.selectedOptions.join(', ')}</p>
                                            {item.details && <p className="text-sm text-slate-500 italic mt-1">"{item.details}"</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Description */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4 text-slate-400">
                            <Quote size={18} />
                            <span className="text-xs font-bold uppercase tracking-widest">Relato</span>
                        </div>
                        <div className="relative pl-6 border-l-4 border-slate-200 py-1">
                            <p className="text-lg text-slate-600 italic leading-relaxed confirmation-description-text">"{formData.description}"</p>
                        </div>
                    </div>

                    {/* Footer Info */}
                    <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                                <Globe size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Alcance</p>
                                <p className="text-sm font-black text-slate-800">{formData.radius}km</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center">
                                <MapPin size={20} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase">Localização</p>
                                <p className="text-sm font-black text-slate-800 truncate max-w-[150px]">{formData.neighborhood || formData.city}</p>
                            </div>
                        </div>
                    </div>

                    {/* Privacy Toggle */}
                    <label className="privacy-toggle-container">
                      <div className="pdam-public-switch" style={{ padding: 0, width: 'auto' }}>
                        <input 
                          type="checkbox" 
                          checked={formData.isPublic} 
                          onChange={(e) => updateData({ isPublic: e.target.checked })} 
                        />
                        <span className="pdam-switch-slider"></span>
                      </div>
                      <div className="privacy-content">
                        <h4>
                          {formData.isPublic ? <><Globe size={18} /> Pedido Público</> : <><ShieldCheck size={18} /> Pedido Anônimo</>}
                        </h4>
                        <p>
                          {formData.isPublic ? 'Seu nome será exibido para todos na plataforma.' : 'Seu nome será ocultado e aparecerá como "Usuário Anônimo".'}
                        </p>
                      </div>
                    </label>
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
      <div id="pda-confetti-container" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', pointerEvents: 'none', zIndex: 10000 }} />
      <AnimatedBackground />
      
      {showStep2IntroModal && <Step2IntroModal onClose={() => setShowStep2IntroModal(false)} />}
      
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

      <CategoryConfirmationModal
        category={pendingCategory}
        onClose={() => setPendingCategory(null)}
        onConfirm={confirmCategory}
      />

      {isPublished && (
        <SuccessModal 
          urgencyColor={selectedUrgency?.color || '#f97316'}
          urgencyLabel={selectedUrgency?.label || 'PUBLICADO'}
          urgencyIcon={selectedUrgency?.icon}
          reason="Seu pedido foi analisado e aprovado! Pessoas próximas serão notificadas."
          analysisResult={validationResult}
          onClose={() => window.location.href = '/'}
        />
      )}

      <main className="pda-main-wrapper">
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

              <div className="form-actions">
                {step > 1 ? (
                  <button onClick={prevStep} className="btn-back">
                    <ChevronLeft size={20} /> Voltar
                  </button>
                ) : (
                  null
                )}
                
                {step < TOTAL_STEPS && step !== 1 ? (
                  <button 
                    onClick={(e) => {
                      if (step === 3) fireConfetti(e);
                      nextStep();
                    }} 
                    disabled={!isStepValid} 
                    className="btn-next"
                  >
                    {step === 1 ? 'Confirmar Categoria' : 'Continuar'} <ArrowRight size={20} />
                  </button>
                ) : step === TOTAL_STEPS ? (
                  <button 
                    onClick={handlePublish} 
                    disabled={isSubmitting} 
                    className="btn-publish"
                  >
                    {isSubmitting ? 'Publicando...' : 'Publicar Pedido'} <Rocket size={20} />
                  </button>
                ) : null}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}