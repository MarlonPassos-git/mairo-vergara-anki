# Como instalar um template no Anki

Guia manual para quem nao quer mexer em codigo.

## Escolha o template

- `basic-editorial-v1`: tipo de nota `Mairo Clean - Basic Editorial v1`.
- `basic-editorial-v2`: tipo de nota `Mairo Clean - Basic Editorial v2`.

## Passo a passo

1. Abra o Anki.
2. Clique em `Tools` e depois em `Manage Note Types`.
3. Clique em `Add` ou duplique um tipo de nota existente.
4. Crie os campos com os mesmos nomes listados em [templates.md](templates.md).
5. Abra a pasta do template dentro de `templates/`.
6. Copie `front.template.html` para `Front Template`.
7. Copie `back.template.html` para `Back Template`.
8. Copie `styling.css` para `Styling`.
9. Salve e crie um card de teste.

## Dica

Use [index.html](index.html) para conferir a aparencia esperada de frente e verso antes de colar no Anki.
