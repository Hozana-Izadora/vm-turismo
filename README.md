# Desafio Ceará — VM Turismo & Receptivo · BTM 2026

Quiz para o totem do estande da VM Turismo na BTM (22 e 23/out/2026). Funciona **100% offline**:
coleta os dados do visitante, aplica 5 perguntas sorteadas sobre o litoral cearense, entrega o
prêmio na hora conforme a pontuação e guarda tudo no próprio equipamento.

**Fluxo do visitante (cerca de 2 min):** boas-vindas → cadastro (nome, WhatsApp, e-mail, empresa opcional,
consentimento LGPD e aceite opcional de comunicações) → 5 perguntas (2 fáceis, 2 intermediárias, 1 difícil),
com 15 s cada → resultado e prêmio, com o código do participante.

| Acertos | Pontos  | Prêmio (padrão)        |
|---------|---------|------------------------|
| 5       | 500     | Prêmio especial        |
| 3 ou 4  | 300–400 | Brinde intermediário   |
| 0 a 2   | 0–200   | Brinde de participação |

Quando uma faixa esgota, o participante recebe automaticamente o prêmio da faixa de baixo. No empate, o ranking
usa o menor tempo total. Cada WhatsApp participa uma vez (a equipe pode liberar uma nova tentativa no painel).

---

## 1. Como instalar no totem

### Totem com Windows (recomendado)
1. Copie `dist/DesafioCeara-portatil.exe` para o totem (por pendrive, por exemplo). Não é preciso instalar nada.
2. Dê dois cliques para abrir. O app abre em **tela cheia (modo quiosque)**.
3. Os dados ficam em **`Documentos\Desafio Ceará BTM 2026\`**.

Para iniciar junto com o Windows, coloque um atalho do `.exe` em `shell:startup` (Win + R → `shell:startup`).

Se preferir um instalador com atalho no menu Iniciar, gere com `npm run dist:instalador`.

### Totem com Android, ou equipamento onde não dá para instalar nada
Copie a pasta `app/` para o equipamento e abra `app/index.html` no **Chrome**, em tela cheia.
Nesse modo os dados ficam no armazenamento do navegador. Por isso:
- **exporte o CSV com frequência** (painel → Dados e configurações);
- **nunca limpe os dados de navegação** do equipamento durante o evento.

---

## 2. Operação durante o evento

### Acesso da equipe (painel administrativo)
- Na tela inicial, **toque 5 vezes seguidas no logo da VM**. Com teclado físico, use `Ctrl + Shift + A`.
- Senha inicial: **`VM2026@BTM`**. **Troque a senha antes do evento** em *Dados e configurações*.
- O painel volta sozinho para a tela inicial após 3 minutos sem uso, para não deixar dados expostos.

### Entrega dos brindes
- **Na própria tela de resultado:** toque em *Equipe: confirmar entrega* e digite o **PIN da equipe**
  (padrão **`2026`**, que pode ser trocado no painel).
- **Pelo painel:** aba *Participantes* → busque pelo nome, telefone ou código (ex.: `42`) → *Marcar entregue*.

### Painel administrativo
- **Resumo:** cadastros, média de acertos, brindes entregues e aguardando entrega, estoque por faixa,
  participantes por dia, distribuição de acertos e taxa de acerto de cada pergunta.
- **Participantes:** busca, filtros, entrega, desfazer entrega e liberar nova tentativa.
- **Ranking:** top 50 por pontos e, no empate, pelo menor tempo.
- **Prêmios:** nome e quantidade total de cada faixa.
- **Dados e configurações:** exportar CSV, fazer backup, abrir a pasta, ligar ou desligar os sons e o teclado virtual,
  ajustar o tempo por pergunta e a inatividade, trocar a senha e o PIN, e fechar o app.

### Zerar participantes (escondido de propósito)
Para evitar que alguém apague os dados sem querer, não há botão visível.
1. Exporte o CSV antes.
2. Em *Dados e configurações*, **segure o dedo por 5 segundos** no texto "Desafio Ceará · versão 1.0", no rodapé.
3. Digite a **senha do painel** e a palavra **ZERAR**, e toque em *Zerar agora*.

Um backup é criado automaticamente antes de apagar (pasta `backups/`; no modo navegador, um download do CSV).

### Fechar o aplicativo
Use *Dados e configurações → Fechar o aplicativo*. Emergência: `Ctrl + Shift + Alt + Q`.

---

## 3. Dados e backup

Na pasta `Documentos\Desafio Ceará BTM 2026\`:

| Arquivo | Conteúdo |
|---|---|
| `participantes.json` | Fonte principal, com todos os dados e cada resposta. É gravado a cada participante. |
| `participantes.csv` | Planilha atualizada automaticamente. Abre direto no Excel, com acentos e separador `;`. |
| `config.json` | Prêmios, estoques, senha (guardada como hash), PIN e opções. |
| `backups/` | Cópia automática a cada 25 participantes e antes de *Zerar participantes*. |
| `*.anterior` | Versão anterior de cada arquivo, usada para recuperação automática. |

- Se o `participantes.csv` estiver aberto no Excel, o app continua gravando normalmente no `.json`
  e mostra um aviso. Feche o Excel e o CSV volta a ser atualizado no próximo participante.
- Para gravar em outra pasta (ex.: direto no pendrive), defina a variável de ambiente `DESAFIO_DADOS` com o caminho.
- **Ao fim de cada dia:** exporte o CSV para um pendrive.
- **LGPD:** os dados ficam sem criptografia no equipamento. Mantenha o totem sob supervisão. Depois do evento,
  transfira os dados para os sistemas da VM e apague-os do equipamento.

---

## 4. Personalização

| O que mudar | Onde |
|---|---|
| Perguntas, respostas e alternativas | `app/js/perguntas.js` |
| Quantas perguntas de cada nível por rodada | `DISTRIBUICAO_NIVEIS`, no fim de `app/js/perguntas.js` |
| Textos (títulos, consentimento, **aviso de privacidade**) | `app/js/textos.js` |
| Nome e quantidade dos prêmios | Painel → Prêmios (sem mexer em código) |
| Foto de fundo da tela inicial | Coloque `app/assets/fotos/capa.jpg` (de preferência na vertical, 1080×1920) |

> ⚠️ As **alternativas incorretas** foram sugeridas e precisam ser **revisadas pela equipe da VM Turismo**.
> O texto do **aviso de privacidade** é um modelo e também precisa de revisão.

O sorteio evita colocar na mesma rodada perguntas com a mesma resposta, ou em que o enunciado de uma
entrega a resposta de outra (ex.: "Em qual município fica a Praia de Morro Branco?" e
"Qual praia é famosa pelo labirinto de falésias?").

Depois de alterar arquivos em `app/`, gere o executável de novo (`npm run dist`).

---

## 5. Checklist antes da BTM

- [ ] Revisar as alternativas em `app/js/perguntas.js` e o aviso de privacidade em `app/js/textos.js`
- [ ] Gerar o `.exe` e testar no totem real (toque, orientação, som)
- [ ] Trocar a **senha** do painel e o **PIN** da equipe
- [ ] Cadastrar nomes e quantidades reais dos prêmios
- [ ] Fazer um participante de teste e depois zerar os participantes (ver "Zerar participantes"; o teste fica no backup)
- [ ] No Windows do totem: desligar suspensão e proteção de tela, pausar o Windows Update e deixar o volume adequado
- [ ] Levar um pendrive para exportar os dados ao fim de cada dia

---

## 6. Desenvolvimento

Requisitos: Node.js 18 ou superior. A internet só é necessária para instalar as dependências e gerar o `.exe`.

```bash
npm install
npm start                  # abre em modo quiosque (tela cheia)
npm run dev                # abre em janela, com DevTools
npm run dist               # gera dist/DesafioCeara-portatil.exe
npm run dist:instalador    # gera dist/DesafioCeara-instalador.exe
```

Estrutura:

```
electron/   main.js (janela quiosque, bloqueio de rede, IPC) · preload.js · storage.js (gravação atômica em disco)
app/        index.html · css/styles.css
app/js/     perguntas.js · textos.js · util.js · csv.js · store.js (disco ou IndexedDB) · quiz.js (sorteio)
            premios.js (faixas e estoque) · teclado.js (teclado virtual) · ui.js · admin.js · app.js (fluxo)
app/assets/ logos extraídos do PDF · fonte Montserrat (embutida) · fotos/ (opcional)
```

O app Electron bloqueia qualquer acesso à rede, então tudo o que ele usa (fontes, imagens, sons) fica dentro do pacote.
