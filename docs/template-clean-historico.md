---
created: 2026-04-20
type: anki-template
course: Curso de Ingles Mairo Vergara
---

# Template clean para Anki

Objetivo: ter um card limpo, legível e consistente no desktop e no mobile.

## Versão 1: Basic `Frente` + `Verso`

Essa é a versão mais simples, usando só dois campos:

1. `Frente`
2. `Verso`

### Front Template

```html
<script>
  qFade = 0;
  if (typeof anki !== "undefined") anki.qFade = qFade;
</script>

<div class="mv-frame">
  <div class="mv-panel mv-panel-front">
    <div class="mv-word">{{Frente}}</div>
  </div>
</div>
```

### Back Template

```html
<div class="mv-frame">
  <div class="mv-panel">
    <div class="mv-word mv-word-back">{{Frente}}</div>

    <hr id="answer">

    <div class="mv-content">
      {{Verso}}
    </div>

    {{#Tags}}
    <div class="mv-footer">
      <div class="mv-footer-chip">{{Tags}}</div>
    </div>
    {{/Tags}}
  </div>
</div>
```

Observação: aqui eu usei `{{Frente}}` no verso em vez de `{{FrontSide}}`. Visualmente fica melhor, porque `{{FrontSide}}` replica o HTML inteiro da frente e quebra esse formato de card único.

### Styling

```css
:root {
  color-scheme: light dark;
  --mv-page: #f4f1ea;
  --mv-page-glow: #ece7de;
  --mv-panel: rgba(255, 255, 255, 0.78);
  --mv-panel-border: rgba(32, 34, 38, 0.1);
  --mv-text: #1c1d20;
  --mv-muted: #6f7177;
  --mv-soft: #8a8d93;
  --mv-accent: #d4a441;
  --mv-line: rgba(28, 29, 32, 0.1);
  --mv-shadow: 0 24px 60px rgba(17, 19, 24, 0.12);
  --mv-footer: rgba(28, 29, 32, 0.04);
}

@media (prefers-color-scheme: dark) {
  :root {
    --mv-page: #0d0d0e;
    --mv-page-glow: #151618;
    --mv-panel: rgba(23, 23, 24, 0.88);
    --mv-panel-border: rgba(255, 255, 255, 0.08);
    --mv-text: #f2f2f3;
    --mv-muted: #a1a1aa;
    --mv-soft: #7f8187;
    --mv-accent: #e2b252;
    --mv-line: rgba(255, 255, 255, 0.09);
    --mv-shadow: 0 28px 70px rgba(0, 0, 0, 0.45);
    --mv-footer: rgba(255, 255, 255, 0.04);
  }
}

.card {
  font-family: "Aptos", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  font-size: 18px;
  line-height: 1.6;
  color: var(--mv-text);
  text-align: left;
  background:
    radial-gradient(circle at top center, var(--mv-page-glow), transparent 36%),
    linear-gradient(180deg, var(--mv-page) 0%, var(--mv-page) 100%);
  margin: 0;
  padding: 28px 16px;
}

.mv-frame {
  max-width: 760px;
  margin: 0 auto;
}

.mv-panel {
  overflow: hidden;
  border: 1px solid var(--mv-panel-border);
  border-radius: 22px;
  background: var(--mv-panel);
  backdrop-filter: blur(10px);
  box-shadow: var(--mv-shadow);
}

.mv-panel-front {
  min-height: 320px;
  display: grid;
  place-items: center;
  padding: 40px 32px;
}

.mv-panel:not(.mv-panel-front) {
  padding: 36px 30px 0;
}

.mv-word {
  font-size: clamp(34px, 7vw, 54px);
  line-height: 1.08;
  font-weight: 800;
  letter-spacing: -0.02em;
  text-align: center;
}

.mv-word-back {
  margin-bottom: 24px;
  font-size: clamp(30px, 6vw, 48px);
}

#answer {
  margin: 0 0 26px;
  border: 0;
  border-top: 1px solid var(--mv-line);
}

.mv-content {
  padding-bottom: 26px;
}

.mv-content > :first-child {
  margin-top: 0;
}

.mv-content > :last-child {
  margin-bottom: 0;
}

.mv-content p {
  margin: 0 0 18px;
}

.mv-content strong {
  color: var(--mv-accent);
  font-weight: 800;
}

.mv-content small {
  color: var(--mv-muted);
}

.mv-content ul,
.mv-content ol {
  margin: 0 0 18px 1.2em;
  padding: 0;
}

.mv-content li + li {
  margin-top: 8px;
}

.mv-content blockquote {
  margin: 18px 0;
  padding: 0 0 0 16px;
  border-left: 2px solid var(--mv-line);
  color: var(--mv-muted);
}

.mv-content hr {
  margin: 22px 0;
  border: 0;
  border-top: 1px solid var(--mv-line);
}

.mv-content .mv-meta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 26px;
  color: var(--mv-muted);
  font-size: 14px;
  text-align: center;
}

.mv-content .mv-badge {
  display: inline-flex;
  align-items: center;
  min-height: 24px;
  padding: 0 8px;
  border: 1px solid var(--mv-line);
  border-radius: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--mv-soft);
}

.mv-content .mv-def {
  margin-bottom: 28px;
  font-size: clamp(20px, 2.5vw, 28px);
  line-height: 1.45;
  text-align: center;
}

.mv-content .mv-def strong {
  margin-right: 4px;
}

.mv-content .mv-example {
  margin: 0 0 26px;
  padding-left: 30px;
  position: relative;
}

.mv-content .mv-example::before {
  content: "◉";
  position: absolute;
  left: 0;
  top: 2px;
  color: var(--mv-soft);
  font-size: 12px;
}

.mv-content .mv-example-en {
  margin: 0 0 8px;
  font-size: clamp(20px, 2.4vw, 30px);
  line-height: 1.45;
}

.mv-content .mv-example-pt {
  margin: 0;
  color: var(--mv-muted);
  font-size: 17px;
  line-height: 1.55;
}

.mv-footer {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  min-height: 56px;
  margin: 0 -30px;
  padding: 0 24px;
  border-top: 1px solid var(--mv-line);
  background: var(--mv-footer);
}

.mv-footer-chip {
  color: var(--mv-soft);
  font-size: 14px;
  font-weight: 600;
}

img {
  max-width: 100% !important;
  height: auto !important;
  border-radius: 14px;
}

.mobile .card {
  padding: 14px 10px;
  font-size: 17px;
}

.mobile .mv-panel-front {
  min-height: 260px;
  padding: 28px 20px;
}

.mobile .mv-panel:not(.mv-panel-front) {
  padding: 26px 18px 0;
}

.mobile .mv-content .mv-def {
  font-size: 20px;
}

.mobile .mv-content .mv-example {
  padding-left: 22px;
}

.mobile .mv-content .mv-example-en {
  font-size: 19px;
}

.mobile .mv-content .mv-example-pt {
  font-size: 15px;
}

.mobile .mv-footer {
  margin: 0 -18px;
  padding: 0 18px;
}

.nightMode.card {
  --mv-page: #0d0d0e;
  --mv-page-glow: #151618;
  --mv-panel: rgba(23, 23, 24, 0.88);
  --mv-panel-border: rgba(255, 255, 255, 0.08);
  --mv-text: #f2f2f3;
  --mv-muted: #a1a1aa;
  --mv-soft: #7f8187;
  --mv-accent: #e2b252;
  --mv-line: rgba(255, 255, 255, 0.09);
  --mv-shadow: 0 28px 70px rgba(0, 0, 0, 0.45);
  --mv-footer: rgba(255, 255, 255, 0.04);
}
```

### Campos

- `Frente`: pergunta, frase ou expressão
- `Verso`: resposta, tradução ou explicação

### Estrutura sugerida para o campo `Verso`

Se você quiser chegar perto do layout da imagem, o ideal é preencher o `Verso` com um HTML simples e padronizado, por exemplo:

```html
<div class="mv-meta">
  <span class="mv-badge">US</span>
  <span>/prɑʊd/</span>
</div>

<div class="mv-def">
  <strong>adj.</strong> orgulhoso; soberbo; altivo; arrogante;
  vaidoso; altaneiro
</div>

<div class="mv-example">
  <p class="mv-example-en">
    They are <strong>proud</strong> in humility; <strong>proud</strong> that
    they are not <strong>proud</strong>.
  </p>
  <p class="mv-example-pt">
    Eles são orgulhosos de humildade; orgulhosos por não serem orgulhosos.
  </p>
</div>

<div class="mv-example">
  <p class="mv-example-en">
    I'm <strong>proud</strong> of myself. Yes, I'm <strong>proud</strong>.
  </p>
  <p class="mv-example-pt">
    Estou orgulhoso de mim mesmo. Sim, estou orgulhoso.
  </p>
</div>
```

### Quando usar

Use essa versão quando você quiser:

- começar rápido
- ter visual próximo do card da imagem
- não depender de campos extras
- padronizar cards simples de pergunta e resposta

## Estrutura recomendada do tipo de nota

Em vez de usar o `Basic` puro com apenas `Front` e `Back`, vale mais a pena duplicar o tipo básico e criar estes campos:

1. `Phrase`
2. `Translation`
3. `Notes`
4. `Example`
5. `Audio`
6. `Hint`
7. `Label`
8. `Phonetic`

Uso sugerido:

- `Phrase`: frase principal em inglês
- `Translation`: tradução em português
- `Notes`: observações curtas
- `Example`: exemplo extra
- `Audio`: arquivo no formato do Anki, ex. `[sound:frase-001.mp3]`
- `Hint`: dica curta opcional
- `Label`: categoria opcional, ex. `Modulo 01`
- `Phonetic`: pronúncia opcional

## Front Template

```html
<script>
  qFade = 0;
  if (typeof anki !== "undefined") anki.qFade = qFade;
</script>

<div class="mv-shell">
  {{#Label}}
  <div class="mv-topbar">
    <div class="mv-chip">{{Label}}</div>
  </div>
  {{/Label}}

  <div class="mv-eyebrow">Compreensão</div>

  <div class="mv-phrase">{{Phrase}}</div>

  {{#Phonetic}}
  <div class="mv-phonetic">{{Phonetic}}</div>
  {{/Phonetic}}

  {{#Hint}}
  <div class="mv-hint">{{hint:Hint}}</div>
  {{/Hint}}

  {{#Audio}}
  <div class="mv-audio">{{Audio}}</div>
  {{/Audio}}
</div>
```

## Back Template

```html
<div class="mv-shell">
  {{#Label}}
  <div class="mv-topbar">
    <div class="mv-chip">{{Label}}</div>
  </div>
  {{/Label}}

  <div class="mv-eyebrow">Frase</div>
  <div class="mv-phrase mv-phrase-back">{{Phrase}}</div>

  {{#Phonetic}}
  <div class="mv-phonetic">{{Phonetic}}</div>
  {{/Phonetic}}

  {{#Audio}}
  <div class="mv-audio">{{Audio}}</div>
  {{/Audio}}

  <div id="answer" class="mv-answer">
    <div class="mv-section">
      <div class="mv-section-label">Tradução</div>
      <div class="mv-translation">{{Translation}}</div>
    </div>

    {{#Notes}}
    <div class="mv-section">
      <div class="mv-section-label">Notas</div>
      <div class="mv-notes">{{Notes}}</div>
    </div>
    {{/Notes}}

    {{#Example}}
    <div class="mv-section">
      <div class="mv-section-label">Exemplo</div>
      <div class="mv-example">{{Example}}</div>
    </div>
    {{/Example}}
  </div>
</div>
```

## Styling

```css
:root {
  --mv-bg-1: #f7f3ec;
  --mv-bg-2: #edf3f1;
  --mv-surface: #fffdfa;
  --mv-text: #1f2937;
  --mv-muted: #6b7280;
  --mv-line: #e7e2d9;
  --mv-accent: #2f6f64;
  --mv-accent-soft: #edf7f4;
  --mv-answer: #f8fbfa;
  --mv-shadow: 0 18px 40px rgba(35, 44, 52, 0.08);
}

.card {
  font-family: "Aptos", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
  font-size: 18px;
  line-height: 1.55;
  text-align: left;
  color: var(--mv-text);
  background:
    radial-gradient(circle at top left, var(--mv-bg-1), transparent 42%),
    linear-gradient(135deg, #fbfaf7 0%, var(--mv-bg-2) 100%);
  margin: 0;
  padding: 16px;
}

.mv-shell {
  max-width: 760px;
  margin: 0 auto;
  padding: 20px;
  background: var(--mv-surface);
  border: 1px solid var(--mv-line);
  border-radius: 24px;
  box-shadow: var(--mv-shadow);
}

.mv-topbar {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 12px;
}

.mv-chip {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 0 12px;
  border-radius: 999px;
  background: var(--mv-accent-soft);
  color: var(--mv-accent);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.mv-eyebrow {
  margin-bottom: 10px;
  color: var(--mv-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.mv-phrase {
  font-size: clamp(28px, 5vw, 42px);
  line-height: 1.22;
  font-weight: 800;
  letter-spacing: -0.02em;
}

.mv-phrase-back {
  font-size: clamp(24px, 4.3vw, 34px);
}

.mv-phonetic {
  margin-top: 10px;
  color: var(--mv-muted);
  font-size: 16px;
}

.mv-hint {
  margin-top: 18px;
  padding: 12px 14px;
  border: 1px dashed #c8d6d2;
  border-radius: 16px;
  color: var(--mv-muted);
  background: #fcfffe;
}

.mv-audio {
  margin-top: 18px;
}

.mv-answer {
  margin-top: 22px;
  padding-top: 18px;
  border-top: 1px solid var(--mv-line);
}

.mv-section + .mv-section {
  margin-top: 18px;
}

.mv-section-label {
  margin-bottom: 6px;
  color: var(--mv-muted);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.mv-translation,
.mv-notes,
.mv-example {
  padding: 14px 16px;
  border: 1px solid var(--mv-line);
  border-radius: 18px;
  background: var(--mv-answer);
}

.mv-translation {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.35;
}

.mv-notes,
.mv-example {
  font-size: 17px;
}

.hint {
  color: var(--mv-accent);
  text-decoration: none;
  font-weight: 700;
}

.hint:hover {
  text-decoration: underline;
}

.replay-button {
  border-radius: 999px;
}

.replay-button svg {
  width: 28px;
  height: 28px;
}

.replay-button svg circle {
  fill: var(--mv-accent);
}

.replay-button svg path {
  fill: #ffffff;
  stroke: #ffffff;
}

img {
  max-width: 100% !important;
  height: auto !important;
  border-radius: 14px;
}

.mobile .card {
  padding: 10px;
  font-size: 17px;
}

.mobile .mv-shell {
  padding: 16px;
  border-radius: 20px;
}

.mobile .mv-translation {
  font-size: 20px;
}

.nightMode.card {
  background:
    radial-gradient(circle at top left, #2b2d31, transparent 42%),
    linear-gradient(135deg, #191c20 0%, #1d2424 100%);
  color: #eef2f7;
}

.nightMode .mv-shell {
  background: #12161a;
  border-color: #28303a;
  box-shadow: none;
}

.nightMode .mv-eyebrow,
.nightMode .mv-phonetic,
.nightMode .mv-section-label {
  color: #9aa7b5;
}

.nightMode .mv-chip {
  background: #173630;
  color: #92d7c8;
}

.nightMode .mv-answer,
.nightMode .mv-translation,
.nightMode .mv-notes,
.nightMode .mv-example,
.nightMode .mv-hint {
  border-color: #28303a;
  background: #171d22;
}

.nightMode .hint {
  color: #92d7c8;
}
```

## Personalização rápida

Se quiser mudar a identidade visual sem mexer na estrutura:

- cor principal: `--mv-accent`
- fundo do card: `--mv-surface`
- cor do texto: `--mv-text`
- tamanho da frase principal: `.mv-phrase`
- bordas e divisões: `--mv-line`

## Fluxo recomendado no Anki

1. Duplicar o tipo `Basic`
2. Renomear para algo como `Mairo Clean`
3. Criar os campos acima
4. Colar o HTML em `Front Template`
5. Colar o HTML em `Back Template`
6. Colar o CSS em `Styling`

## Observações importantes

- O campo `Audio` deve receber o valor já no formato do Anki, por exemplo `[sound:minha-frase.mp3]`
- O `id="answer"` foi mantido para o Anki rolar corretamente até a resposta no mobile
- O áudio aparece no verso também, porque o `FrontSide` não reproduz automaticamente o áudio da frente
- Se quiser usar só `Front` e `Back`, dá para adaptar, mas você perde padronização

## Próxima versão útil

Se fizer sentido, a próxima melhoria é montar uma segunda variação:

- `minimal`: mais seca e compacta
- `editorial`: mais bonita e com mais destaque para a frase e para o áudio
