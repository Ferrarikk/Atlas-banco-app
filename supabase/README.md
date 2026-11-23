# Supabase — configuração inicial do Atlas Bank

Esta etapa prepara a base técnica do protótipo. Não cria conta bancária real nem movimenta dinheiro.

## O que existe no repositório

- `profiles`: perfil associado ao usuário autenticado.
- `demo_accounts`: conta identificada como demonstração.
- `demo_transactions`: lançamentos fictícios, sempre com status `simulated`.
- `demo_accounts.demo_balance`: saldo demonstrativo alterado somente pela função SQL do servidor.
- `atlas_simulate_debit`: função RPC autenticada, atômica e idempotente para débitos fictícios; bloqueia saldo insuficiente e não movimenta dinheiro.
- RLS com leitura restrita ao proprietário.
- Nenhuma permissão do cliente para inserir/alterar contas ou movimentações.
- Trigger para criar perfil e conta demonstrativa após cadastro no Supabase Auth.
- `src/lib/supabase.ts`: cliente Supabase opcional, configurado com variáveis públicas e adaptador experimental de sessão nativa (não auditado).

**Ainda não confirmado:** não há evidência de que a migração tenha sido aplicada em um projeto Supabase, de que as políticas RLS tenham sido testadas ou de que as telas de autenticação tenham sido executadas com credenciais de um projeto real. O código das telas de cadastro, login, recuperação e logout já chama Supabase Auth quando configurado.

## Ativar em um projeto de desenvolvimento

1. Crie um projeto Supabase de teste.
2. Abra **SQL Editor**.
3. Abra `migrations/20261102100000_initial_demo_schema.sql` neste repositório.
4. Copie o SQL inteiro para uma nova consulta e execute.
5. Confira no **Table Editor** as três tabelas.
6. Crie dois usuários de teste e valide que cada um só consegue ler seus próprios registros.
7. Teste também que o cliente autenticado não consegue inserir/alterar contas nem transações.

Não use dados pessoais reais nesta etapa.

## Configuração local do app

1. Copie `.env.example` para `.env` no ambiente de desenvolvimento.
2. Preencha `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` com a URL e a chave publicável/anon do projeto.
3. Reinicie o Expo para recarregar as variáveis.
4. Verifique `isSupabaseConfigured` em `src/lib/supabase.ts`.

Nunca coloque a chave `service_role` no cliente, no `.env.example`, no GitHub ou em mensagens. Não compartilhe credenciais pelo chat.

## Armazenamento de sessão

- iOS/Android: sessões ficam somente em memória por enquanto; não há persistência de refresh token. O usuário precisará entrar novamente após reiniciar o app. Essa limitação é intencional até existir um adaptador de armazenamento persistente revisado e testado.
- Web: o adaptador usa `localStorage` somente para a prévia demonstrativa. JavaScript executado na página pode acessar esse armazenamento. Para produção web, substituir por fluxo backend/BFF com cookies `HttpOnly`, `Secure` e `SameSite`.
- Nenhuma implementação de armazenamento está certificada. Não use esta versão com dados bancários, credenciais reais ou operações financeiras.

## Próximas etapas

1. Aplicar e testar a migração/RLS no projeto Supabase.
2. Configurar variáveis locais e testar cadastro, login, confirmação de e-mail, recuperação de senha e logout.
3. Escolher, revisar e testar um adaptador de armazenamento persistente seguro para sessão no iOS/Android.
4. Buscar perfil e conta demonstrativa pelo usuário autenticado.
5. Testar a RPC `atlas_simulate_debit` quanto a concorrência, idempotência, saldo insuficiente e isolamento entre usuários.

Esta estrutura não é um livro-razão financeiro, não integra Pix, não processa pagamentos e não autoriza operações reais. Qualquer evolução financeira futura exige ledger no servidor, idempotência, controles antifraude, reconciliação, parceiro autorizado e revisão jurídica/regulatória.
