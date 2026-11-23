# Atlas Bank — protótipo mobile

Aplicativo demonstrativo para iOS e Android com Expo, React Native e TypeScript.

## Estado do projeto

- Interface de demonstração com início, extrato, cartões e perfil.
- PIX, transferência e pagamento são sempre simulações; com Supabase configurado, débitos fictícios são registrados no servidor de demonstração. Nenhuma operação movimenta dinheiro.
- Telas de cadastro, login, recuperação de senha e logout chamam Supabase Auth quando as variáveis locais estão configuradas.
- O modo demonstração sem login usa estado local, que pode ser perdido ao fechar o app. Com login e migrações aplicadas, saldo e extrato vêm do Supabase.
- Migrações do Supabase preparadas em `supabase/migrations/`; ainda não há confirmação de aplicação ou teste em um projeto.
- Cliente Supabase criado em `src/lib/supabase.ts`; cadastro, login, recuperação, leitura da conta/extrato e débito demonstrativo via RPC estão conectados no código. A conexão real ainda depende de um projeto configurado e testes.
- No iOS/Android, a sessão fica somente em memória nesta etapa; será necessário entrar novamente após reiniciar o app. A persistência segura aguarda um adaptador revisado.
- Na prévia web, o armazenamento usa `localStorage` apenas para demonstração; não usar para contas reais.
- Com usuário autenticado e migrações aplicadas, o saldo e extrato demonstrativos são lidos do Supabase; débitos simulados passam por RPC atômica e idempotente. O modo sem Supabase continua local.
- O app não é instituição financeira e não está pronto para produção.

## Configurar o Supabase de demonstração

1. Crie um projeto Supabase de desenvolvimento.
2. No SQL Editor, execute os arquivos em `supabase/migrations/` em ordem de nome, começando por `20261102100000_initial_demo_schema.sql` e depois `20261123100000_demo_transfer_rpc.sql`.
3. Confira se `profiles`, `demo_accounts` e `demo_transactions` foram criadas.
4. Teste as políticas RLS com dois usuários diferentes antes de conectar qualquer dado.
5. Copie `.env.example` para `.env` localmente e preencha `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` com os valores públicos do projeto.
6. Nunca envie chaves pelo chat nem faça commit do arquivo `.env`. Nunca coloque a chave `service_role` no app.
7. No app, teste cadastro, confirmação de e-mail, login, recuperação de senha e logout com contas fictícias. A confirmação do cadastro pode depender da configuração de e-mail do projeto Supabase.

Os arquivos `src/lib/supabase.ts` e `src/lib/demoBanking.ts` configuram o cliente e os dados demonstrativos. O cliente fica `null` enquanto as duas variáveis públicas não estiverem configuradas. As telas de cadastro, login e recuperação chamam Supabase Auth quando configurado.

## Pré-visualizar pelo navegador (Codespaces)

1. No Codespaces, abra a paleta de comandos.
2. Escolha **Tasks: Run Task**.
3. Selecione **ATLAS BANK: abrir prévia no navegador**.
4. Aguarde a instalação dos pacotes web e o início do Expo.
5. Abra **Ports**, localize a porta **8081** e toque em **Open in Browser**.

Alternativa pelo terminal:

```bash
npm install
npm run web
```

## Executar como app mobile

Requer Node.js compatível com Expo SDK 58.

```bash
npm install
npx expo start
```

Abra o QR code com Expo Go compatível ou use um development build.

## Segurança e limites

Leia [SECURITY.md](./SECURITY.md), [docs/SECURITY_CHECKLIST.md](./docs/SECURITY_CHECKLIST.md) e [supabase/README.md](./supabase/README.md).

A autenticação está ligada à interface, mas ainda precisa ser testada com um projeto Supabase. As migrações/RLS e a RPC precisam ser aplicadas e testadas. A prévia web usa armazenamento do navegador, inadequado para autenticação financeira de produção. Qualquer futura operação real exigirá backend confiável, parceiro financeiro autorizado, controles antifraude, revisão de segurança, LGPD e avaliação regulatória.
