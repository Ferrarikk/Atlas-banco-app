# Supabase — configuração inicial do Atlas Bank

Esta etapa prepara a base técnica do protótipo. Não cria conta bancária real nem movimenta dinheiro.

## O que existe no repositório

- `profiles`: perfil associado ao usuário autenticado.
- `demo_accounts`: conta identificada como demonstração.
- `demo_transactions`: lançamentos fictícios, sempre com status `simulated`.
- RLS com leitura restrita ao proprietário.
- Nenhuma permissão do cliente para inserir/alterar contas ou movimentações.
- Trigger para criar perfil e conta demonstrativa após cadastro no Supabase Auth.
- `src/lib/supabase.ts`: cliente Supabase opcional, configurado com variáveis públicas e adaptador de sessão criptografada para iOS/Android.

**Ainda não confirmado:** não há evidência de que a migração tenha sido aplicada em um projeto Supabase, de que as políticas RLS tenham sido testadas ou de que o cliente esteja conectado às telas de login.

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

- iOS/Android: a implementação cifra o valor da sessão com AES-CTR; a chave aleatória fica no Keychain/Android Keystore via Expo SecureStore e o conteúdo cifrado fica no AsyncStorage.
- Web: o adaptador usa `localStorage` somente para a prévia demonstrativa. JavaScript executado na página pode acessar esse armazenamento. Para produção web, substituir por fluxo backend/BFF com cookies `HttpOnly`, `Secure` e `SameSite`.
- Esta implementação é uma fundação inicial, não uma certificação ou garantia de segurança. Deve passar por revisão técnica e testes antes de qualquer uso com dados sensíveis.

## Próximas etapas

1. Aplicar e testar a migração/RLS no projeto Supabase.
2. Conectar telas de cadastro, login, logout e recuperação de senha.
3. Persistir sessão e proteger rotas.
4. Buscar perfil e conta demonstrativa pelo usuário autenticado.
5. Persistir somente lançamentos de demonstração por função/endpoint com autorização; nunca aceitar saldo enviado pelo cliente.

Esta estrutura não é um livro-razão financeiro, não integra Pix, não processa pagamentos e não autoriza operações reais. Qualquer evolução financeira futura exige ledger no servidor, idempotência, controles antifraude, reconciliação, parceiro autorizado e revisão jurídica/regulatória.
