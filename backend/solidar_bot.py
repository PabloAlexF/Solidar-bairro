#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bot de Validação de Pedidos de Ajuda - Solidar Bairro
Valida automaticamente pedidos de ajuda usando análise de texto
"""

import re
import json
import time
from typing import Dict, List, Tuple, Any

class SolidarBot:
    def __init__(self):
        self.portuguese_words = {
            'preciso', 'ajuda', 'família', 'filhos', 'trabalho', 'casa', 'comida', 'dinheiro',
            'saúde', 'medicamento', 'roupa', 'emprego', 'conta', 'aluguel', 'situação',
            'difícil', 'problema', 'necessito', 'urgente', 'apoio', 'socorro', 'desempregado',
            'doente', 'criança', 'idoso', 'mãe', 'pai', 'esposa', 'marido', 'irmão', 'irmã'
        }
        
        self.category_keywords = {
            'Alimentos': {
                'primary': ['comida', 'fome', 'cesta', 'alimentar', 'refeição', 'mercado', 'básica'],
                'context': ['cozinhar', 'comer', 'nutrição', 'famintos', 'alimentação']
            },
            'Medicamentos': {
                'primary': ['remédio', 'medicamento', 'saúde', 'doença', 'tratamento'],
                'context': ['hospital', 'médico', 'receita', 'farmácia', 'doente', 'enfermo']
            },
            'Emprego': {
                'primary': ['trabalho', 'emprego', 'desempregado', 'renda', 'sustento'],
                'context': ['vaga', 'currículo', 'entrevista', 'salário', 'profissão']
            },
            'Roupas': {
                'primary': ['roupa', 'vestir', 'agasalho', 'calça', 'camisa'],
                'context': ['blusa', 'vestido', 'sapato', 'calçado', 'uniforme', 'frio']
            },
            'Contas': {
                'primary': ['conta', 'boleto', 'pagamento', 'dívida', 'financeiro'],
                'context': ['aluguel', 'luz', 'água', 'telefone', 'cartão', 'banco']
            }
        }

    def validate_request(self, form_data: Dict[str, Any]) -> Dict[str, Any]:
        """Valida um pedido de ajuda completo"""
        category = form_data.get('category', '')
        description = form_data.get('description', '')
        urgency = form_data.get('urgency', '')
        
        # Simula processamento IA
        time.sleep(1)
        
        validations = {
            'textIntelligence': self._validate_text_intelligence(description),
            'categoryMatch': self._validate_category_match(category, description),
            'urgencyAuthenticity': self._validate_urgency_authenticity(urgency, description)
        }
        
        suggestions = self._generate_suggestions(validations)
        is_valid = all(v['isValid'] for v in validations.values())
        confidence = self._calculate_confidence(validations)
        
        return {
            'isValid': is_valid,
            'validations': validations,
            'suggestions': suggestions,
            'confidence': confidence
        }

    def _validate_text_intelligence(self, description: str) -> Dict[str, Any]:
        """Valida inteligência do texto"""
        text = description.lower().strip()
        
        # Detecta texto repetitivo
        if re.search(r'(.{1,3})\1{4,}', text):
            return {
                'isValid': False,
                'message': 'Texto contém padrões repetitivos sem sentido'
            }
        
        # Verifica palavras reais em português
        has_real_words = any(word in text for word in self.portuguese_words)
        if not has_real_words:
            return {
                'isValid': False,
                'message': 'Texto não contém palavras reconhecíveis relacionadas a pedidos de ajuda'
            }
        
        # Verifica estrutura mínima
        sentences = [s.strip() for s in re.split(r'[.!?]+', text) if len(s.strip()) > 10]
        if not sentences:
            return {
                'isValid': False,
                'message': 'Texto não possui estrutura de frases coerentes'
            }
        
        return {
            'isValid': True,
            'message': 'Texto demonstra inteligência e coerência'
        }

    def _validate_category_match(self, category: str, description: str) -> Dict[str, Any]:
        """Valida se categoria corresponde à descrição"""
        desc_lower = description.lower()
        category_data = self.category_keywords.get(category)
        
        if not category_data:
            return {'isValid': False, 'message': 'Categoria não reconhecida'}
        
        # Verifica palavras primárias ou contexto
        has_primary = any(word in desc_lower for word in category_data['primary'])
        context_matches = sum(1 for word in category_data['context'] if word in desc_lower)
        
        is_valid = has_primary or context_matches >= 2
        
        return {
            'isValid': is_valid,
            'message': 'Categoria compatível com a descrição' if is_valid 
                      else f'Descrição não corresponde à categoria "{category}"'
        }

    def _validate_urgency_authenticity(self, urgency: str, description: str) -> Dict[str, Any]:
        """Valida autenticidade da urgência"""
        text = description.lower()
        
        urgency_indicators = {
            'critico': {
                'required': ['urgente', 'crítico', 'emergência', 'imediato', 'risco', 'desespero'],
                'forbidden': ['tranquilo', 'sem pressa', 'quando possível']
            },
            'urgente': {
                'required': ['rápido', 'logo', 'breve', 'necessário', 'urgente'],
                'forbidden': ['sem pressa', 'tranquilo']
            },
            'moderada': {
                'required': [],
                'forbidden': ['urgente', 'crítico', 'emergência', 'imediato']
            }
        }
        
        indicators = urgency_indicators.get(urgency, {})
        if not indicators:
            return {'isValid': True, 'message': 'Urgência válida'}
        
        # Verifica palavras proibidas
        has_forbidden = any(word in text for word in indicators.get('forbidden', []))
        if has_forbidden:
            return {
                'isValid': False,
                'message': f'Texto contradiz a urgência "{urgency}" selecionada'
            }
        
        # Para casos críticos, exige palavras indicativas
        if urgency in ['critico', 'urgente']:
            has_required = any(word in text for word in indicators.get('required', []))
            if not has_required:
                return {
                    'isValid': False,
                    'message': f'Casos "{urgency}" devem conter palavras que justifiquem a urgência'
                }
        
        return {
            'isValid': True,
            'message': 'Urgência condiz com o conteúdo da descrição'
        }

    def _generate_suggestions(self, validations: Dict[str, Dict]) -> List[Dict[str, str]]:
        """Gera sugestões baseadas nas validações"""
        suggestions = []
        
        if not validations.get('categoryMatch', {}).get('isValid'):
            suggestions.append({
                'type': 'category',
                'message': 'Considere revisar se a categoria escolhida corresponde à sua necessidade',
                'action': 'Revisar categoria'
            })
        
        if not validations.get('urgencyAuthenticity', {}).get('isValid'):
            suggestions.append({
                'type': 'urgency',
                'message': 'A urgência selecionada pode não refletir sua situação',
                'action': 'Revisar urgência'
            })
        
        if not validations.get('textIntelligence', {}).get('isValid'):
            suggestions.append({
                'type': 'description',
                'message': 'Adicione mais detalhes sobre sua situação para receber melhor ajuda',
                'action': 'Melhorar descrição'
            })
        
        return suggestions

    def _calculate_confidence(self, validations: Dict[str, Dict]) -> int:
        """Calcula confiança da validação"""
        valid_count = sum(1 for v in validations.values() if v.get('isValid'))
        total_count = len(validations)
        return round((valid_count / total_count) * 100) if total_count > 0 else 0


def main():
    """Função principal para testes"""
    bot = SolidarBot()
    
    # Teste básico
    test_data = {
        'category': 'Alimentos',
        'description': 'Preciso de ajuda com comida para minha família. Temos 3 filhos pequenos e estou desempregado.',
        'urgency': 'urgente'
    }
    
    result = bot.validate_request(test_data)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()