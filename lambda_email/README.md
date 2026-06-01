Resumo

- Função Lambda mínima em Python para enviar e-mail via SMTP (substitui SendGrid localmente).

Pré-requisitos

- `aws` CLI configurado
- `sam` CLI (opcional, para deploy simplificado)
- Conta AWS com permissões para criar Lambda

Variáveis de ambiente importantes

- `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `FROM_EMAIL`

Como empacotar e fazer deploy com SAM

```bash
cd lambda_email
sam build
sam deploy --guided
```

Testando localmente com `aws lambda invoke` (após deploy)

```bash
aws lambda invoke --function-name <NomeDaFuncao> --payload '{"to":"seu@email.com","subject":"Teste","body":"Olá"}' response.json
cat response.json
```

Testar rapidamente local (sem AWS):

- Você pode executar `handler.lambda_handler` localmente definindo variáveis de ambiente e chamando a função via um pequeno script Python.

Observações importantes

- Emails enviados diretamente podem cair em SPAM. Para produção, configure SPF/DKIM e use um serviço de envio confiável.
- Se quer que os envs sejam armazenados no código (temporário), configure no `template.yaml` ou no painel Lambda.
