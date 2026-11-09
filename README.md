# Atlas Bank — protótipo mobile

Aplicativo demonstrativo para iOS e Android com Expo, React Native e TypeScript.

## Estado do projeto

- Interface de demonstração com início, extrato, cartões e perfil.
- PIX, transferência e pagamento são apenas simulações locais; não movimentam dinheiro.
- Migração inicial do Supabase preparada em `supabase/migrations/`, ainda não confirmada como aplicada ou testada em um projeto.
- Cliente Supabase criado em `src/lib/supabase.ts`, mas as telas de autenticação ainda não estão conectadas a ele.
- Sessões nativas são preparadas para armazenamento criptografado usando uma chave no Keychain/Android Keystore e dados cifrados no AsyncStorage.
- Na prévia web, o armazenamento usa `localStorage` apenas para demonstração; não usar para contas reais.
- O app não é instituição financeira e não está pronto para produção.

## Configurar o Supabase de demonstração

1. Crie um projeto Supabase de desenvolvimento.
2. No SQL Editor, execute o arquivo `supabase/migrations/20261102100000_initial_demo_schema.sql`.
3. Confira se `profiles`, `demo_accounts` e `demo_transactions` foram criadas.
4. Teste as políticas RLS com dois usuários diferentes antes de conectar qualquer dado.
5. Copie `.env.example` para `.env` localmente e preencha `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY` com os valores públicos do projeto.
6. Nunca envie chaves pelo chat nem faça commit do arquivo `.env`. Nunca coloque a chave `service_role` no app.

O arquivo `src/lib/supabase.ts` exporta `isSupabaseConfigured` e `supabase`. O cliente fica `null` enquanto as duas variáveis públicas não estiverem configuradas. A interface ainda precisa receber os fluxos de cadastro, login, recuperação de senha e sessão.

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

A autenticação ainda não está ligada à interface e a migração/RLS precisam ser aplicadas e testadas. A prévia web usa armazenamento do navegador, inadequado para autenticação financeira de produção. Qualquer futura operação real exigirá backend confiável, parceiro financeiro autorizado, controles antifraude, revisão de segurança, LGPD e avaliação regulatória.
