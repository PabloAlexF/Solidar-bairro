# TODO: Implementar Dicas e Dados Reais no Modal de Achados e Perdidos

## Backend Changes
- [ ] Criar modelo tipsModel.js para armazenar dicas na coleção 'tips' (campos: item_id, user_id, text, created_at)
- [ ] Atualizar achadosPerdidosController.js para incluir nome do usuário ao buscar detalhes do item (join com coleção de usuários)
- [ ] Adicionar endpoints para buscar e postar dicas no achadosPerdidosController.js

## Frontend Changes
- [ ] Atualizar DetailsModal.jsx para exibir nome real do usuário e horário de publicação do DB
- [ ] Mudar aba "Comentários" para "Dicas" no DetailsModal.jsx
- [ ] Substituir comentários simulados por dicas reais buscadas do backend no DetailsModal.jsx
- [ ] Implementar postagem de novas dicas no backend no DetailsModal.jsx

## Testing
- [ ] Testar modal para garantir que dados reais sejam exibidos
- [ ] Verificar que dicas sejam salvas e buscadas corretamente
- [ ] Verificar integração com banco de dados
