#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Bot de Validação Robusto - Solidar Bairro
Sistema completo de análise de pedidos de ajuda
"""

import re
import json
import time
from typing import Dict, List, Any, Tuple
import sys

# Configurar encoding UTF-8
if sys.stdout.encoding != 'utf-8':
    sys.stdout.reconfigure(encoding='utf-8')

class SolidarBotRobust:
    def __init__(self):
        self.categories = {
            'Alimentos': {
                'keywords': ['comida', 'fome', 'alimentar', 'refeição', 'cesta', 'básica', 'mercado', 'cozinhar', 'comer', 'nutrição', 'famintos', 'alimentação', 'pão', 'leite', 'arroz', 'feijão'],
                'urgency_words': ['fome', 'famintos', 'sem comer', 'crianças', 'bebê'],
                'fake_indicators': ['festa', 'churrasco', 'aniversário', 'comemoração']
            },
            'Medicamentos': {
                'keywords': ['remédio', 'medicamento', 'saúde', 'doença', 'tratamento', 'hospital', 'médico', 'receita', 'farmácia', 'doente', 'enfermo', 'dor', 'pressão', 'diabetes', 'coração'],
                'urgency_words': ['dor', 'grave', 'internação', 'emergência', 'risco'],
                'fake_indicators': ['estética', 'beleza', 'suplemento', 'vitamina']
            },
            'Emprego': {
                'keywords': ['trabalho', 'emprego', 'desempregado', 'renda', 'sustento', 'vaga', 'currículo', 'entrevista', 'salário', 'profissão', 'carteira', 'registro'],
                'urgency_words': ['desempregado', 'demitido', 'sustento', 'família'],
                'fake_indicators': ['preguiça', 'fácil', 'sem esforço']
            },
            'Roupas': {
                'keywords': ['roupa', 'vestir', 'agasalho', 'calça', 'camisa', 'blusa', 'vestido', 'sapato', 'calçado', 'uniforme', 'frio', 'inverno', 'criança'],
                'urgency_words': ['frio', 'inverno', 'criança', 'bebê', 'escola'],
                'fake_indicators': ['moda', 'marca', 'grife', 'festa']
            },
            'Contas': {
                'keywords': ['conta', 'boleto', 'pagamento', 'dívida', 'financeiro', 'aluguel', 'luz', 'água', 'telefone', 'cartão', 'banco', 'financiamento'],
                'urgency_words': ['corte', 'despejo', 'vencimento', 'juros', 'protesto'],
                'fake_indicators': ['luxo', 'supérfluo', 'viagem', 'festa']
            },
            'Moradia': {
                'keywords': ['casa', 'moradia', 'teto', 'abrigo', 'aluguel', 'despejo', 'sem-teto', 'construção', 'reforma', 'goteira', 'infiltração'],
                'urgency_words': ['despejo', 'sem-teto', 'chuva', 'frio', 'crianças'],
                'fake_indicators': ['luxo', 'piscina', 'decoração']
            },
            'Transporte': {
                'keywords': ['transporte', 'passagem', 'ônibus', 'combustível', 'gasolina', 'carro', 'moto', 'bicicleta', 'locomoção'],
                'urgency_words': ['trabalho', 'hospital', 'médico', 'emergência'],
                'fake_indicators': ['passeio', 'turismo', 'lazer']
            },
            'Educação': {
                'keywords': ['escola', 'educação', 'material', 'livro', 'caderno', 'uniforme', 'curso', 'faculdade', 'estudo'],
                'urgency_words': ['matrícula', 'prova', 'formatura', 'criança'],
                'fake_indicators': ['luxo', 'supérfluo']
            }
        }
        
        self.spam_patterns = [
            r'(.{1,3})\1{4,}',  # Repetição
            r'[bcdfghjklmnpqrstvwxyz]{6,}',  # Consoantes seguidas
            r'[aeiou]{5,}',  # Vogais seguidas
            r'(haha|kkkk|rsrs){3,}',  # Risadas excessivas
            r'(\w)\1{4,}',  # Letra repetida
        ]
        
        self.personal_context_words = [
            'família', 'filhos', 'filho', 'filha', 'crianças', 'criança', 'bebê',
            'mãe', 'pai', 'esposa', 'marido', 'irmão', 'irmã', 'avô', 'avó',
            'anos', 'idade', 'idoso', 'idosa', 'pessoas', 'casa', 'apartamento',
            'desempregado', 'doente', 'situação', 'dificuldade', 'problema'
        ]

    def validate_request(self, form_data: Dict[str, Any]) -> Dict[str, Any]:
        """Validação completa e robusta do pedido"""
        category = form_data.get('category', '')
        description = form_data.get('description', '')
        urgency = form_data.get('urgency', 'moderada')
        visibility = form_data.get('visibility', [])
        
        # Simula processamento IA
        time.sleep(2)
        
        validations = {
            'spamDetection': self._detect_spam(description),
            'textQuality': self._validate_text_quality(description),
            'categoryMatch': self._validate_category_match(category, description),
            'urgencyAuthenticity': self._validate_urgency_authenticity(urgency, description),
            'personalContext': self._validate_personal_context(description),
            'duplicateDetection': self._detect_duplicate_patterns(description),
            'sentimentAnalysis': self._analyze_sentiment(description),
            'lengthValidation': self._validate_length(description)
        }
        
        # Análise de risco
        risk_score = self._calculate_risk_score(validations, form_data)
        
        # Geração de sugestões
        suggestions = self._generate_comprehensive_suggestions(validations, form_data)
        
        # Decisão final
        is_valid = self._make_final_decision(validations, risk_score)
        confidence = self._calculate_confidence(validations, risk_score)
        
        return {
            'isValid': is_valid,
            'validations': validations,
            'suggestions': suggestions,
            'confidence': confidence,
            'riskScore': risk_score,
            'analysis': self._generate_analysis_summary(validations, risk_score)
        }

    def _detect_spam(self, description: str) -> Dict[str, Any]:
        """Detecta spam e texto malicioso"""
        text = description.lower().strip()
        
        # Verifica padrões de spam
        for pattern in self.spam_patterns:
            if re.search(pattern, text):
                return {
                    'isValid': False,
                    'message': 'Texto contém padrões suspeitos de spam',
                    'severity': 'high'
                }
        
        # Verifica URLs suspeitas
        if re.search(r'http[s]?://|www\.|\.com|\.br', text):
            return {
                'isValid': False,
                'message': 'Texto contém links suspeitos',
                'severity': 'high'
            }
        
        # Verifica caracteres especiais excessivos
        special_chars = len(re.findall(r'[!@#$%^&*()_+=\[\]{}|;:,.<>?]', text))
        if special_chars > len(text) * 0.1:
            return {
                'isValid': False,
                'message': 'Excesso de caracteres especiais',
                'severity': 'medium'
            }
        
        return {
            'isValid': True,
            'message': 'Texto livre de spam',
            'severity': 'low'
        }

    def _validate_text_quality(self, description: str) -> Dict[str, Any]:
        """Valida qualidade do texto"""
        text = description.strip()
        words = text.split()
        
        # Verifica comprimento mínimo (reduzido para 5 palavras)
        if len(words) < 5:
            return {
                'isValid': False,
                'message': 'Descrição muito curta - mínimo 5 palavras',
                'severity': 'medium'
            }
        
        # Verifica diversidade de palavras (critério mais flexível)
        unique_words = set(word.lower() for word in words)
        diversity_ratio = len(unique_words) / len(words) if len(words) > 0 else 0
        
        if diversity_ratio < 0.3:
            return {
                'isValid': False,
                'message': 'Texto com muita repetição de palavras',
                'severity': 'low'
            }
        
        # Verifica se tem verbos (indicativo de ação/necessidade) - mais flexível
        action_words = ['preciso', 'necessito', 'quero', 'busco', 'procuro', 'ajuda', 'socorro', 'precisa', 'necessita', 'falta', 'faltando', 'sem', 'difícil', 'dificuldade', 'problema']
        has_action = any(word in text.lower() for word in action_words)
        
        # Removido - aceita qualquer texto
        # if not has_action:
        #     return {
        #         'isValid': False,
        #         'message': 'Texto deve expressar uma necessidade clara',
        #         'severity': 'medium'
        #     }
        
        return {
            'isValid': True,
            'message': 'Texto de boa qualidade',
            'severity': 'low'
        }

    def _validate_category_match(self, category: str, description: str) -> Dict[str, Any]:
        """Validação robusta de categoria"""
        if category not in self.categories:
            return {
                'isValid': False,
                'message': 'Categoria não reconhecida',
                'severity': 'high'
            }
        
        text = description.lower()
        cat_data = self.categories[category]
        
        # Conta matches de palavras-chave
        keyword_matches = sum(1 for word in cat_data['keywords'] if word in text)
        
        # Verifica indicadores falsos
        fake_matches = sum(1 for word in cat_data['fake_indicators'] if word in text)
        
        # Calcula score de correspondência (mais flexível)
        match_score = keyword_matches - (fake_matches * 2)
        
        # Aceita se não há indicadores falsos, mesmo sem palavras-chave específicas
        if match_score < 0 or fake_matches > 2:
            # Verifica se pode ser outra categoria
            best_match = self._find_best_category_match(text)
            if best_match != category and keyword_matches == 0:
                return {
                    'isValid': False,
                    'message': f'Descrição pode ser mais adequada para categoria "{best_match}"',
                    'severity': 'medium',
                    'suggestedCategory': best_match
                }
        
        return {
            'isValid': True,
            'message': f'Categoria "{category}" compatível com a descrição',
            'severity': 'low',
            'matchScore': match_score
        }

    def _find_best_category_match(self, text: str) -> str:
        """Encontra a melhor categoria para o texto"""
        best_category = 'Outros'
        best_score = 0
        
        for category, data in self.categories.items():
            score = sum(1 for word in data['keywords'] if word in text)
            if score > best_score:
                best_score = score
                best_category = category
        
        return best_category

    def _validate_urgency_authenticity(self, urgency: str, description: str) -> Dict[str, Any]:
        """Valida autenticidade da urgência"""
        text = description.lower()
        
        urgency_rules = {
            'critico': {
                'required_words': ['urgente', 'crítico', 'emergência', 'imediato', 'risco', 'grave', 'desespero'],
                'forbidden_words': ['tranquilo', 'sem pressa', 'quando possível', 'não urgente'],
                'min_score': 1
            },
            'urgente': {
                'required_words': ['rápido', 'logo', 'breve', 'necessário', 'urgente', 'preciso'],
                'forbidden_words': ['sem pressa', 'tranquilo'],
                'min_score': 1
            },
            'moderada': {
                'required_words': [],
                'forbidden_words': ['urgente', 'crítico', 'emergência', 'imediato'],
                'min_score': 0
            },
            'tranquilo': {
                'required_words': ['tranquilo', 'sem pressa', 'quando possível'],
                'forbidden_words': ['urgente', 'crítico', 'emergência', 'imediato', 'rápido'],
                'min_score': 0
            }
        }
        
        rules = urgency_rules.get(urgency, urgency_rules['moderada'])
        
        # Verifica palavras proibidas
        forbidden_found = [word for word in rules['forbidden_words'] if word in text]
        if forbidden_found:
            return {
                'isValid': False,
                'message': f'Urgência "{urgency}" contradiz palavras encontradas: {", ".join(forbidden_found)}',
                'severity': 'high'
            }
        
        # Verifica palavras obrigatórias para casos críticos/urgentes (mais flexível)
        if urgency == 'critico':
            # Palavras que indicam urgência real
            urgency_indicators = ['urgente', 'crítico', 'emergência', 'imediato', 'risco', 'grave', 'desespero', 'hoje', 'agora', 'sem tempo', 'não posso esperar']
            required_found = [word for word in urgency_indicators if word in text]
            if len(required_found) == 0:
                return {
                    'isValid': False,
                    'message': f'Casos críticos devem justificar a urgência com palavras como: urgente, crítico, emergência, etc.',
                    'severity': 'medium'
                }
        
        return {
            'isValid': True,
            'message': f'Urgência "{urgency}" condizente com a descrição',
            'severity': 'low'
        }

    def _validate_personal_context(self, description: str) -> Dict[str, Any]:
        """Valida se há contexto pessoal suficiente"""
        text = description.lower()
        
        personal_matches = sum(1 for word in self.personal_context_words if word in text)
        
        # Mais flexível - aceita com menos contexto
        if personal_matches < 1 and len(text.split()) > 10:
            return {
                'isValid': False,
                'message': 'Adicione mais contexto sobre sua situação (família, quantas pessoas, etc.)',
                'severity': 'low'
            }
        
        return {
            'isValid': True,
            'message': 'Contexto pessoal adequado',
            'severity': 'low'
        }

    def _detect_duplicate_patterns(self, description: str) -> Dict[str, Any]:
        """Detecta padrões de duplicação suspeitos"""
        text = description.lower()
        
        # Verifica frases repetidas
        sentences = [s.strip() for s in text.split('.') if s.strip()]
        if len(sentences) != len(set(sentences)):
            return {
                'isValid': False,
                'message': 'Texto contém frases repetidas',
                'severity': 'medium'
            }
        
        return {
            'isValid': True,
            'message': 'Sem duplicações detectadas',
            'severity': 'low'
        }

    def _analyze_sentiment(self, description: str) -> Dict[str, Any]:
        """Análise básica de sentimento"""
        text = description.lower()
        
        positive_words = ['obrigado', 'grato', 'agradeço', 'deus', 'abençoe', 'esperança']
        negative_words = ['desespero', 'desesperad', 'triste', 'deprimid', 'sem saída']
        
        positive_count = sum(1 for word in positive_words if word in text)
        negative_count = sum(1 for word in negative_words if word in text)
        
        if negative_count > positive_count + 2:
            return {
                'isValid': True,
                'message': 'Sentimento de necessidade genuína detectado',
                'severity': 'low',
                'sentiment': 'genuine_need'
            }
        
        return {
            'isValid': True,
            'message': 'Sentimento equilibrado',
            'severity': 'low',
            'sentiment': 'neutral'
        }

    def _validate_length(self, description: str) -> Dict[str, Any]:
        """Valida comprimento do texto"""
        length = len(description.strip())
        
        if length < 20:
            return {
                'isValid': False,
                'message': 'Descrição muito curta - mínimo 20 caracteres',
                'severity': 'medium'
            }
        
        if length > 2000:
            return {
                'isValid': False,
                'message': 'Descrição muito longa - máximo 2000 caracteres',
                'severity': 'medium'
            }
        
        return {
            'isValid': True,
            'message': 'Comprimento adequado',
            'severity': 'low'
        }

    def _calculate_risk_score(self, validations: Dict, form_data: Dict) -> int:
        """Calcula score de risco (0-100) - Mais leniente"""
        risk = 0
        
        for validation in validations.values():
            if not validation['isValid']:
                severity = validation.get('severity', 'medium')
                if severity == 'high':
                    risk += 20  # Reduzido de 30
                elif severity == 'medium':
                    risk += 10  # Reduzido de 15
                else:
                    risk += 3   # Reduzido de 5
        
        return min(risk, 100)

    def _make_final_decision(self, validations: Dict, risk_score: int) -> bool:
        """Decisão final sobre validação - Forçar rejeição se muitas sugestões"""
        # Critérios críticos que impedem publicação (apenas spam e texto vazio)
        critical_failures = [
            'spamDetection'
        ]
        
        for critical in critical_failures:
            if not validations.get(critical, {}).get('isValid', True):
                return False
        
        # Contar sugestões que serão geradas
        suggestion_count = 0
        for validation in validations.values():
            if not validation.get('isValid', True):
                suggestion_count += 1
        
        # Se tem mais de 2 sugestões, rejeita
        if suggestion_count > 2:
            return False
        
        # Se risk score muito alto, rejeita (aumentado para 95 - quase nunca rejeita)
        if risk_score > 95:
            return False
        
        return True

    def _calculate_confidence(self, validations: Dict, risk_score: int) -> int:
        """Calcula confiança da validação"""
        valid_count = sum(1 for v in validations.values() if v.get('isValid', True))
        total_count = len(validations)
        
        base_confidence = (valid_count / total_count) * 100
        risk_penalty = risk_score * 0.5
        
        return max(0, min(100, int(base_confidence - risk_penalty)))

    def _generate_comprehensive_suggestions(self, validations: Dict, form_data: Dict) -> List[Dict]:
        """Gera sugestões específicas com evidências"""
        suggestions = []
        
        for key, validation in validations.items():
            if not validation.get('isValid', True):
                
                if key == 'spamDetection':
                    suggestions.append({
                        'type': 'critical',
                        'message': f'PROBLEMA: {validation["message"]}. Remova caracteres repetitivos, links ou símbolos excessivos.',
                        'action': 'Editar descrição',
                        'priority': 'high',
                        'evidence': 'Texto contém padrões identificados como spam'
                    })
                
                elif key == 'textQuality':
                    suggestions.append({
                        'type': 'description',
                        'message': f'SUGESTÃO: {validation["message"]}. Tente adicionar mais detalhes.',
                        'action': 'Melhorar descrição',
                        'priority': 'medium',
                        'evidence': 'Texto pode ser mais detalhado'
                    })
                
                elif key == 'categoryMatch':
                    suggested_cat = validation.get('suggestedCategory')
                    if suggested_cat:
                        suggestions.append({
                            'type': 'category',
                            'message': f'SUGESTÃO: Sua descrição pode ser mais adequada para "{suggested_cat}". Considere alterar se fizer sentido.',
                            'action': 'Revisar categoria',
                            'priority': 'medium',
                            'evidence': f'Algumas palavras sugerem categoria "{suggested_cat}"'
                        })
                
                elif key == 'urgencyAuthenticity':
                    suggestions.append({
                        'type': 'urgency',
                        'message': f'SUGESTÃO: {validation["message"]}. Considere ajustar o nível ou adicionar mais contexto.',
                        'action': 'Revisar urgência',
                        'priority': 'low',
                        'evidence': 'Nível de urgência pode não condizer com o texto'
                    })
                
                elif key == 'personalContext':
                    suggestions.append({
                        'type': 'description',
                        'message': 'SUGESTÃO: Adicione mais contexto sobre sua situação (família, quantas pessoas serão ajudadas, etc.).',
                        'action': 'Melhorar descrição',
                        'priority': 'low',
                        'evidence': 'Mais contexto pessoal pode ajudar'
                    })
                
                elif key == 'lengthValidation':
                    suggestions.append({
                        'type': 'description',
                        'message': f'SUGESTÃO: {validation["message"]}. Tente escrever um pouco mais sobre sua necessidade.',
                        'action': 'Expandir descrição',
                        'priority': 'medium',
                        'evidence': 'Texto pode ser mais detalhado'
                    })
        
        return suggestions

    def _generate_analysis_summary(self, validations: Dict, risk_score: int) -> str:
        """Gera resumo da análise"""
        if risk_score > 70:
            return "Pedido precisa de algumas melhorias antes da publicação"
        elif risk_score > 40:
            return "Pedido bom, algumas sugestões podem ajudar"
        else:
            return "Pedido adequado para publicação"


def main():
    """Teste do bot robusto ou processamento via stdin"""
    bot = SolidarBotRobust()
    
    # Check if data is coming from stdin (Node.js call)
    import sys
    if not sys.stdin.isatty():
        try:
            input_data = sys.stdin.read().strip()
            if input_data:
                form_data = json.loads(input_data)
                result = bot.validate_request(form_data)
                print(json.dumps(result, ensure_ascii=False, indent=None))
                return
        except Exception as e:
            print(json.dumps({
                'isValid': False,
                'error': str(e),
                'suggestions': [],
                'confidence': 0,
                'riskScore': 100,
                'analysis': 'Erro no processamento'
            }, ensure_ascii=False, indent=None))
            return
    
    # Default test case
    test_data = {
        'category': 'Alimentos',
        'description': 'Preciso urgentemente de ajuda com comida para minha família. Somos 4 pessoas, tenho 2 filhos pequenos de 3 e 5 anos. Estou desempregado há 3 meses e nossa situação está muito difícil. Não temos o que comer hoje.',
        'urgency': 'critico'
    }
    
    result = bot.validate_request(test_data)
    print(json.dumps(result, indent=2, ensure_ascii=False))


if __name__ == '__main__':
    main()