# Anki Setup

Pasta de trabalho para os templates e snippets do Anki usados no curso do Mairo Vergara.

## Projeto

Este repositório agora fica em `C:\Users\Usuario\personal\mairo-vergara-anki`.

Comandos principais:

```powershell
pnpm install
pnpm lint:ci
pnpm type-check
pnpm test:ci
pnpm build
```

Sincronizar o template v2 com o Anki:

```powershell
pnpm sync
```

## Estrutura

- `templates/basic-editorial-v1/`
  Template base atual, com visual inspirado no card de referência.
- `templates/basic-editorial-v2/`
  Template N+1 para cards novos, com campos descritivos.
- `scripts/`
  Automação para sincronizar templates com o Anki via AnkiConnect.
- `docs/`
  Material histórico e notas longas sobre decisões de layout.
- `AGENTS.md`
  Regras de organização e manutenção desta pasta.

## Templates

Template legado: `basic-editorial-v1`

Arquivos:

- `templates/basic-editorial-v1/front.template.html`
- `templates/basic-editorial-v1/back.template.html`
- `templates/basic-editorial-v1/styling.css`
- `templates/basic-editorial-v1/verso.exemplo.html`
- `templates/basic-editorial-v1/anki.model.json`

Template novo: `basic-editorial-v2`

Campos:

- `Frase em ingles`: frase N+1, com o trecho desconhecido em negrito.
- `Traducao do trecho`: traducao apenas da palavra ou expressao desconhecida.
- `Traducao da frase`: traducao completa opcional da frase.
- `Audio em ingles`: audio em ingles com a sintaxe `[sound:arquivo.mp3]`.
- `Transcricao JSON`: lista opcional de palavras com timestamps para highlight sincronizado.

Arquivos:

- `templates/basic-editorial-v2/front.template.html`
- `templates/basic-editorial-v2/back.template.html`
- `templates/basic-editorial-v2/styling.css`
- `templates/basic-editorial-v2/traducao-do-trecho.exemplo.html`
- `templates/basic-editorial-v2/traducao-da-frase.exemplo.html`
- `templates/basic-editorial-v2/anki.model.json`

## Como usar no Anki

1. Duplicar o tipo de nota `Basic`
2. Garantir que os campos sigam o arquivo `anki.model.json` do template escolhido
3. Colar `front.template.html` em `Front Template`
4. Colar `back.template.html` em `Back Template`
5. Colar `styling.css` em `Styling`
6. Usar o conteúdo de `verso.exemplo.html` como referência para preencher o campo `Verso`
7. Para áudio, preencher `Audio` com a sintaxe do Anki: `[sound:arquivo.mp3]`

### Usar a v2

Na v2, preencher `Traducao do trecho` com a resposta principal. Preencher
`Traducao da frase` apenas quando a traducao completa ajudar como contexto.
Preencher `Transcricao JSON` apenas quando existir transcricao com timestamps.

Exemplo:

- `Frase em ingles`: `She gave me a <b>ride</b> home.`
- `Traducao do trecho`: `carona`
- `Traducao da frase`: `Ela me deu uma carona para casa.`
- `Audio em ingles`: `[sound:ride.mp3]`
- `Transcricao JSON`: `[{"s":0.1,"e":0.3,"w":"She"},{"s":0.31,"e":0.5,"w":"gave"}]`

## Automação

Pré-requisito: instalar o add-on `AnkiConnect` no Anki.

Passos:

1. Abrir o Anki
2. Ir em `Tools -> Add-ons -> Get Add-ons`
3. Instalar o código `2055492159`
4. Reiniciar o Anki

Depois disso, os scripts desta pasta conseguem atualizar os templates automaticamente pela API local em `http://127.0.0.1:8765`.

### Configuração do modelo

O arquivo `templates/basic-editorial-v1/anki.model.json` define:

- nome do note type no Anki
- nome do card template
- arquivos usados como front, back e CSS
- campos esperados

### Sincronizar uma vez

```powershell
pwsh -File .\scripts\Sync-AnkiTemplate.ps1 -Template .\templates\basic-editorial-v1
```

Para a v2:

```powershell
pwsh -File .\scripts\Sync-AnkiTemplate.ps1 -Template .\templates\basic-editorial-v2 -CreateIfMissing
```

### Sincronização automática ao salvar

```powershell
pwsh -File .\scripts\Watch-AnkiTemplate.ps1 -Template .\templates\basic-editorial-v1
```

Para observar a v2:

```powershell
pwsh -File .\scripts\Watch-AnkiTemplate.ps1 -Template .\templates\basic-editorial-v2
```

Esse modo observa alterações em:

- `front.template.html`
- `back.template.html`
- `styling.css`
- `anki.model.json`

## Status atual do seu ambiente

Validação feita em `2026-04-20`:

- o Anki está rodando
- o `AnkiConnect` respondeu na porta `127.0.0.1:8765`
- o note type `Mairo Clean - Basic Editorial v1` foi criado com sucesso

Isso significa que a sincronização automática já pode ser usada neste perfil.

## Decisão técnica atual

No verso da v1, o template usa `{{Frente}}` em vez de `{{FrontSide}}`.

Motivo:

- `{{FrontSide}}` replica todo o HTML da frente
- isso atrapalha layouts mais refinados com card único
- para esse padrão visual, `{{Frente}}` é a opção correta

## Próximas versões

- `basic-minimal-v1`
- `word-audio-v1`
- `sentence-study-v1`

## Testes

```powershell
pwsh -File .\__tests__\basic-editorial-v2.spec.ps1
```
