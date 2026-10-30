# Atlas Bank — protótipo mobile

Aplicativo demonstrativo para iOS e Android com Expo, React Native e TypeScript.

## Pré-visualizar pelo navegador (Codespaces)

Para testar pelo iPhone sem configurar ngrok:

1. No Codespaces, abra a paleta de comandos (ícone de pesquisa/comandos ou menu View).
2. Escolha **Tasks: Run Task**.
3. Selecione **ATLAS BANK: abrir prévia no navegador**.
4. Aguarde a instalação dos pacotes web e o início do Expo.
5. Abra a aba **Ports**, localize a porta **8081** e toque em **Open in Browser**. Se solicitado, torne a porta 8081 pública/visível.

Alternativa pelo terminal:

```bash
npm run web
```

## Executar como app mobile

Requer Node.js compatível com Expo SDK 58.

```bash
npm install
npx expo start
```

Abra o QR code com Expo Go compatível ou use um development build.

## Estado atual

- Tela inicial com identidade roxo profundo e branco.
- Saldo e movimentações fictícios.
- Sem conexão com banco de dados, PIX ou pagamentos reais.
- Prévia web é apenas uma forma de visualizar o protótipo; não transforma o projeto em um serviço bancário.

## Segurança

Leia [SECURITY.md](./SECURITY.md) e [docs/SECURITY_CHECKLIST.md](./docs/SECURITY_CHECKLIST.md). Autenticação, armazenamento seguro de sessão e RLS ainda precisam ser implementados e testados antes de usar dados pessoais.

Este protótipo não é uma instituição financeira e não está pronto para produção.
