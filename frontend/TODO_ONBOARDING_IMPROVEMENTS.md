# TODO: Melhorias no Modal de Onboarding

## ✅ 1. Adicionar mais categorias na seção "Preciso de Ajuda"
- ✅ Adicionar 2 novas categorias: "Saúde" e "Educação"
- ✅ Atualizar o array de categorias no componente Onboarding.jsx

## ✅ 2. Desbloquear botão "Próximo" após publicar pedido
- ✅ Modificar a lógica para habilitar o botão após completar a interação de publicação
- ✅ Garantir que o estado `isStepInteractionComplete` seja atualizado corretamente
- ✅ Corrigir stepId de 'help' para 'need-help' na chamada handleInteraction

## ✅ 3. Adicionar animações de seleção
- ✅ Implementar animações visuais quando o usuário seleciona itens (cards de ajuda, achados/perdidos)
- ✅ Adicionar feedback visual imediato (ex: escala, sombra, cor)
- ✅ Corrigir lógica de seleção para usar interactionsComplete diretamente
- ✅ Adicionar hover effect aprimorado para cards selecionados
- ✅ Melhorar efeito de seleção para todas as etapas: lift effect consistente ao invés de scale
- ✅ Aplicar efeito de seleção uniforme em cards de ajuda, categorias e itens de interesse

## ✅ 4. Melhorar CSS dos steps
- ✅ Ajustar espaçamentos e layouts dos steps no sidebar
- ✅ Melhorar responsividade e visual dos indicadores de progresso
- ✅ Otimizar cores e tipografia para melhor legibilidade
