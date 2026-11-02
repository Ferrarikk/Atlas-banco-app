# Supabase — configuração inicial do Atlas Bank

Esta etapa prepara somente a estrutura de dados do protótipo. Ela não cria uma conta bancária real nem movimenta dinheiro.

## O que a migração cria

- `profiles`: perfil associado ao usuário autenticado.
- `demo_accounts`: conta identificada explicitamente como demonstração.
- `demo_transactions`: lançamentos fictícios, sempre com status `simulated`.
- Row Level Security (RLS) para que cada usuário autenticado só possa ler os próprios registros.
- Nenhuma permissão do cliente para inserir ou alterar contas ou movimentações.
- Um perfil e uma conta demonstrativa são criados quando um usuário é registrado no Supabase Auth.

Não existe coluna de saldo editável. O app não deve gravar saldo no cliente.

## Como ativar quando o projeto Supabase estiver criado

1. Abra o projeto Supabase correto.
2. Entre em **SQL Editor**.
3. Abra o arquivo `migrations/20261102100000_initial_demo_schema.sql) neste repositório.
4. Copie o SQL inteiro para uma nova consulta e execute.
5. Confira em **Table Editor** se as três tabelas foram criadas.
6. Antes de conectar o app, teste as políticas com dois usuários de teste diferentes e confirme que um não consegue consultar os registros do outro.

## Chaves e configuração do app

- Use somente a URL do projeto e a chave publicável/anon no cliente.
- Guarde os valores localmente em `.env`, usando `.env.example` como modelo.
- Nunca envie chaves pelo chat nem as coloque no GitHub.
- Nunca coloque a chave `service_role` no aplicativo, em `.env.example` ou em código cliente.
- O cliente Supabase e o armazenamento seguro de sessão ainda não foram conectados nesta etapa.

## Limites

Esta migração é para dados demonstrativos. Não é um livro-razão financeiro, não integra Pix, não processa pagamentos e não autoriza operações reais. Qualquer operação futura deverá passar por backend confiável, ledger imutável, idempotência, controles antifraude, parceiro financeiro autorizado e revisão jurídica/regulatória.
