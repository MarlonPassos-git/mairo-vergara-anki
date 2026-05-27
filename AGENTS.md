# AGENTS.md

## Objetivo

Esta pasta centraliza todos os artefatos de template do Anki para o curso do Mairo Vergara.

## Estrutura padrão

- cada template deve ficar em uma pasta própria dentro de `templates/`
- cada versão deve separar:
  - `front.template.html`
  - `back.template.html`
  - `styling.css`
  - arquivos opcionais de exemplo, como `verso.exemplo.html`
- notas explicativas longas devem ficar em `docs/`

## Convenções

- usar nomes de pasta em minúsculas e com hífen
- manter uma versão por pasta, por exemplo `basic-editorial-v1`
- evitar misturar múltiplos templates no mesmo arquivo
- preferir campos explícitos do Anki em vez de HTML inline excessivo
- em templates novos, preferir nomes descritivos de campo em vez de `Frente`/`Verso`
- manter dados estruturados em campos próprios; não misturar JSON de apoio com HTML visual

## Regras de UI

- o template precisa funcionar bem em desktop e mobile
- sempre prever tema claro e escuro
- preferir `prefers-color-scheme` para tema automático
- manter fallback com `.nightMode` do Anki quando necessário
- evitar layouts quebrados por `{{FrontSide}}`; usar apenas quando a composição exigir reaproveitar todo o front
- em cards N+1, a frase em inglês é o foco principal
- na frente, trecho desconhecido em `<b>`/`<strong>` deve aparecer apenas em bold amarelo
- no verso, o trecho desconhecido pode ganhar sublinhado/seta para conectar com a tradução
- a tradução do trecho deve ser discreta, próxima do estilo textual do verso da v1; evitar caixa pesada ou aparência de botão
- quando houver highlight sincronizado com áudio, garantir contraste no estado ativo

## Regras de implementação

- preservar `id="answer"` no verso quando houver divisão entre frente e resposta
- simular renderizacao do Anki nos testes com `tools/anki-renderer.mjs`
- manter os testes Playwright cobrindo desktop e mobile para ajustes visuais
- imagens devem ser responsivas
- tipografia e espaçamento devem continuar legíveis em tela pequena
- CSS deve ficar isolado no arquivo `styling.css`
- exemplos de preenchimento do campo `Verso` devem ser mantidos em arquivos dedicados
- para `basic-editorial-v2`, os campos esperados são:
  - `Frase em ingles`
  - `Traducao do trecho`
  - `Traducao da frase`
  - `Audio em ingles`
  - `Transcricao JSON`
- `Transcricao JSON` deve aceitar lista compacta `[{ "s": 0, "e": 0.2, "w": "word" }]`
- `Transcricao JSON` também pode aceitar o formato Whisper `start`/`end`/`word`
- manter fallback quando o Anki não expuser elemento `<audio>` real
- automacoes locais devem ficar em `scripts/`

## Fluxo recomendado

1. criar nova pasta de versão em `templates/`
2. copiar a base da versão mais próxima
3. ajustar front, back e CSS
4. documentar diferenças em `docs/templates.md`
5. adicionar um exemplo de uso se o template exigir HTML estruturado dentro de um campo
6. atualizar ou criar teste visual em `__tests__/*.visual.spec.js`
7. sincronizar com Anki usando `scripts/Sync-AnkiTemplate.mjs`

<!-- setup-standard:start -->
# AGENTS.md - mairo-vergara-anki

## Project Context

Catalogo de templates Anki para o Curso de Ingles Mairo Vergara.

## Runtime

- pnpm `10.33.0`
- Biome para lint/format dos arquivos suportados
- Playwright para testes visuais desktop/mobile de templates Anki
- Node para scripts de sincronizacao e geracao de docs

## Commands

```powershell
pnpm install
pnpm lint
pnpm test
pnpm test:ui
pnpm sync
```

## Testing Rules

- `pnpm test` roda checagens Node em `__tests__/**/*.spec.mjs`.
- `pnpm test:ui` roda Playwright em `__tests__/*.visual.spec.js`.
- Testes visuais devem simular classes/plataformas do Anki via `tools/anki-renderer.mjs`.
- Para mudanças visuais intencionais, atualizar snapshots com `pnpm test:ui -- --update-snapshots`.

## Coding Rules

- Keep functions small and focused.
- Prefer explicit types and dependency injection.
- Preserve existing project structure and conventions.
- Keep user-facing CLI output plain text and observability logs structured.
<!-- setup-standard:end -->
