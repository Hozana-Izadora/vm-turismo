/* Fluxo do participante: boas-vindas → cadastro → quiz → resultado/premiação. */
(function () {
  const U = window.Util;
  const T = window.TEXTOS;
  const { Modal, Som, icone, toast } = window.UI;
  const Store = window.Store;
  const $ = (id) => document.getElementById(id);

  const AVISO_INATIVIDADE_SEG = 10;
  const VOLTA_RESULTADO_SEG = 45;
  const INATIVIDADE_ADMIN_SEG = 180;
  const FEEDBACK_MS = 1300;

  const estado = {
    tela: "inicio",
    participante: null,
    rodada: [],
    indice: 0,
    inicioPergunta: 0,
    timerPergunta: null,
    respondendo: false,
    ultimoToque: Date.now(),
    avisoInatividade: false,
    timerResultado: null,
    tapsLogo: []
  };

  // ---------------- Navegação ----------------
  function irPara(tela) {
    document.querySelectorAll(".tela").forEach((s) => s.classList.toggle("ativa", s.id === "tela-" + tela));
    document.documentElement.dataset.tela = tela;
    estado.tela = tela;
    estado.ultimoToque = Date.now();
    window.Teclado.fechar();
    if (tela !== "resultado") { clearInterval(estado.timerResultado); window.UI.pararConfete(); }
    if (tela !== "quiz") clearInterval(estado.timerPergunta);
  }

  function voltarAoInicio() {
    estado.participante = null;
    Modal.fechar();
    limparCadastro();
    renderInicio();
    irPara("inicio");
  }

  // ---------------- Boas-vindas ----------------
  function renderInicio() {
    $("txt-evento").textContent = T.evento;
    $("txt-titulo").textContent = T.titulo;
    $("txt-subtitulo").textContent = T.subtitulo;
    $("txt-chamada").textContent = T.chamada;
    const icones = { especial: "trofeu", intermediario: "presente", participacao: "festa" };
    $("faixas-inicio").innerHTML = window.Premios.ordenadas(Store.config.premios).map((p) => `
      <div class="faixa-chip">${icone(icones[p.id] || "presente")}
        <span><strong>${U.escapeHtml(p.nome)}</strong><small>${descricaoFaixa(p)}</small></span>
      </div>`).join("");
  }

  function descricaoFaixa(p) {
    const lista = window.Premios.ordenadas(Store.config.premios);
    const i = lista.indexOf(p);
    const max = i === 0 ? window.Quiz.total : lista[i - 1].minAcertos - 1;
    if (max <= p.minAcertos) return `${p.minAcertos} acertos`;
    if (p.minAcertos === 0) return `até ${max} acertos`;
    return max - p.minAcertos === 1 ? `${p.minAcertos} ou ${max} acertos` : `${p.minAcertos} a ${max} acertos`;
  }

  // Acesso oculto ao admin: 5 toques no logo em até 3 segundos
  function tocarLogo() {
    const agora = Date.now();
    estado.tapsLogo = estado.tapsLogo.filter((t) => agora - t < 3000).concat(agora);
    if (estado.tapsLogo.length >= 5) {
      estado.tapsLogo = [];
      pedirSenhaAdmin();
    }
  }

  function pedirSenhaAdmin() {
    let tentativa = "";
    const validar = () => {
      tentativa = $("admin-senha").value;
      if (U.sha256(tentativa) === Store.config.senhaHash) {
        Modal.fechar();
        window.Admin.abrir();
        return true;
      }
      $("admin-senha-erro").textContent = "Senha incorreta.";
      $("admin-senha").value = "";
      return false;
    };
    Modal.abrir({
      titulo: "Acesso da equipe",
      html: `<label class="campo"><span>Senha do painel administrativo</span>
        <input id="admin-senha" type="password" maxlength="40" data-teclado="senha" autocomplete="off"></label>
        <small class="erro" id="admin-senha-erro"></small>`,
      botoes: [
        { texto: "Cancelar", classe: "btn-secundario" },
        { texto: "Entrar", classe: "btn-principal", acao: () => (validar() ? undefined : false) }
      ],
      aoAbrir: () => {
        const i = $("admin-senha");
        i.addEventListener("teclado-ok", (e) => { e.preventDefault(); validar(); });
        i.addEventListener("keydown", (e) => { if (e.key === "Enter") validar(); });
        setTimeout(() => i.focus(), 50);
      }
    });
  }

  // ---------------- Cadastro ----------------
  function limparCadastro() {
    ["f-nome", "f-telefone", "f-email", "f-empresa"].forEach((id) => { $(id).value = ""; });
    $("f-consentimento").checked = false;
    $("f-comunicacoes").checked = false;
    document.querySelectorAll("[data-erro]").forEach((e) => { e.textContent = ""; });
    document.querySelectorAll(".campo.invalido").forEach((e) => e.classList.remove("invalido"));
  }

  function erro(campo, msg) {
    const el = document.querySelector(`[data-erro="${campo}"]`);
    if (el) el.textContent = msg || "";
    const input = $("f-" + campo);
    if (input && input.closest(".campo")) input.closest(".campo").classList.toggle("invalido", !!msg);
  }

  function validarCadastro() {
    const nome = U.normalizarNome($("f-nome").value);
    const telefone = U.soDigitos($("f-telefone").value);
    const email = $("f-email").value.trim().toLowerCase();
    const consentimento = $("f-consentimento").checked;
    let ok = true;

    if (nome.split(" ").filter((p) => p.length > 0).length < 2 || nome.length < 5) {
      erro("nome", "Informe seu nome e sobrenome."); ok = false;
    } else erro("nome");
    if (!U.telefoneValido(telefone)) {
      erro("telefone", "Informe um WhatsApp válido com DDD."); ok = false;
    } else erro("telefone");
    if (!U.emailValido(email)) {
      erro("email", "Informe um e-mail válido."); ok = false;
    } else erro("email");
    if (!consentimento) {
      erro("consentimento", "Para participar, é preciso concordar com o tratamento dos dados."); ok = false;
    } else erro("consentimento");

    if (!ok) {
      const primeiro = document.querySelector(".campo.invalido input");
      if (primeiro) primeiro.scrollIntoView({ block: "center", behavior: "smooth" });
      return null;
    }
    return {
      nome, telefone, email,
      empresa: U.normalizarNome($("f-empresa").value),
      consentimento,
      aceitaComunicacoes: $("f-comunicacoes").checked
    };
  }

  function jaParticipou(telefone) {
    return Store.participantes.some((p) => p.telefone === telefone && !p.liberadoNovaTentativa);
  }

  async function enviarCadastro(e) {
    e.preventDefault();
    window.Teclado.fechar();
    const dados = validarCadastro();
    if (!dados) { Som.tocar("errado"); return; }

    if (jaParticipou(dados.telefone)) {
      Modal.abrir({
        titulo: "Você já participou!",
        html: `<p>${U.escapeHtml(T.jaParticipou)}</p>`,
        botoes: [{ texto: "Entendi", classe: "btn-principal", acao: () => voltarAoInicio() }]
      });
      return;
    }

    const participante = Object.assign({
      id: U.uuid(),
      codigo: Store.proximoCodigo(),
      criadoEm: new Date().toISOString(),
      status: "em_andamento",
      perguntas: [],
      acertos: 0,
      pontos: 0,
      tempoTotalMs: 0,
      premioId: null,
      premioNome: null,
      entregue: false,
      entregueEm: null,
      liberadoNovaTentativa: false
    }, dados);

    Store.participantes.push(participante);
    try {
      await Store.salvarParticipantes();
    } catch (err) {
      console.error(err);
      toast("Atenção: falha ao gravar os dados. Chame a equipe.", "erro");
    }
    estado.participante = participante;
    iniciarQuiz();
  }

  function mostrarAviso() {
    Modal.abrir({
      titulo: T.avisoPrivacidadeTitulo,
      html: T.avisoPrivacidade.map((p) => `<p>${U.escapeHtml(p)}</p>`).join(""),
      classe: "modal-largo",
      botoes: [{ texto: "Fechar", classe: "btn-principal" }]
    });
  }

  // ---------------- Quiz ----------------
  function iniciarQuiz() {
    estado.rodada = window.Quiz.sortear(window.PERGUNTAS, window.DISTRIBUICAO_NIVEIS);
    estado.indice = 0;
    irPara("quiz");
    mostrarPergunta();
  }

  function mostrarPergunta() {
    const q = estado.rodada[estado.indice];
    const total = estado.rodada.length;
    estado.respondendo = false;
    $("quiz-contador").textContent = `Pergunta ${estado.indice + 1} de ${total}`;
    const nivel = $("quiz-nivel");
    nivel.textContent = window.Quiz.NOME_NIVEL[q.nivel];
    nivel.className = "nivel nivel-" + q.nivel;
    $("quiz-progresso").innerHTML = estado.rodada.map((_, i) => {
      const r = estado.participante.perguntas[i];
      const cls = i < estado.indice ? (r && r.correta ? "certo" : "errado") : i === estado.indice ? "atual" : "";
      return `<span class="${cls}"></span>`;
    }).join("");
    $("quiz-pergunta").textContent = q.texto;
    $("quiz-feedback").hidden = true;
    $("quiz-alternativas").innerHTML = q.alternativas.map((alt, i) => `
      <button type="button" class="alternativa" data-i="${i}">
        <span class="letra">${"ABCD"[i]}</span><span class="alt-texto">${U.escapeHtml(alt)}</span>
      </button>`).join("");
    const cartao = document.querySelector(".cartao-quiz");
    cartao.classList.remove("entrar");
    void cartao.offsetWidth; // reinicia a animação
    cartao.classList.add("entrar");

    estado.inicioPergunta = performance.now();
    atualizarCronometro();
    clearInterval(estado.timerPergunta);
    estado.timerPergunta = setInterval(atualizarCronometro, 100);
  }

  let ultimoSegundo = null;
  function atualizarCronometro() {
    const limite = Store.config.tempoPergunta * 1000;
    const passado = performance.now() - estado.inicioPergunta;
    const resta = Math.max(0, limite - passado);
    const seg = Math.ceil(resta / 1000);
    $("crono-num").textContent = seg;
    const circ = 2 * Math.PI * 44;
    const barra = $("crono-barra");
    barra.style.strokeDasharray = circ;
    barra.style.strokeDashoffset = circ * (1 - resta / limite);
    const cron = $("cronometro");
    cron.classList.toggle("alerta", seg <= 5);
    if (seg <= 5 && seg > 0 && seg !== ultimoSegundo && !estado.respondendo) Som.tocar("tique");
    ultimoSegundo = seg;
    if (resta <= 0 && !estado.respondendo) responder(null);
  }

  function responder(indiceAlt) {
    if (estado.respondendo) return;
    estado.respondendo = true;
    clearInterval(estado.timerPergunta);
    const q = estado.rodada[estado.indice];
    const limite = Store.config.tempoPergunta * 1000;
    const tempoMs = Math.min(limite, Math.round(performance.now() - estado.inicioPergunta));
    const resposta = indiceAlt == null ? null : q.alternativas[indiceAlt];
    const correta = resposta === q.correta;
    estado.participante.perguntas.push({ id: q.id, nivel: q.nivel, resposta, correta, tempoMs });

    const botoes = document.querySelectorAll(".alternativa");
    botoes.forEach((b) => { b.disabled = true; });
    if (indiceAlt != null) botoes[indiceAlt].classList.add(correta ? "certa" : "errada");

    // Feedback sem revelar a resposta correta (evita "cola" de quem está na fila)
    const fb = $("quiz-feedback");
    fb.className = "feedback " + (correta ? "feedback-certo" : "feedback-errado");
    fb.innerHTML = indiceAlt == null
      ? `${icone("relogio")}<span>Tempo esgotado!</span>`
      : correta ? `${icone("certo")}<span>Acertou! +${Store.config.pontosPorAcerto} pontos</span>`
        : `${icone("errado")}<span>Não foi dessa vez!</span>`;
    fb.hidden = false;
    Som.tocar(correta ? "certo" : "errado");

    setTimeout(() => {
      estado.indice += 1;
      if (estado.indice < estado.rodada.length) mostrarPergunta();
      else finalizarQuiz();
    }, FEEDBACK_MS);
  }

  async function finalizarQuiz() {
    const p = estado.participante;
    p.acertos = p.perguntas.filter((q) => q.correta).length;
    p.pontos = p.acertos * Store.config.pontosPorAcerto;
    p.tempoTotalMs = p.perguntas.reduce((s, q) => s + q.tempoMs, 0);
    p.finalizadoEm = new Date().toISOString();
    const r = window.Premios.atribuir(p.acertos, Store.config.premios, Store.participantes.filter((x) => x !== p));
    p.premioId = r.premio ? r.premio.id : null;
    p.premioNome = r.premio ? r.premio.nome : null;
    p.status = "concluido";
    try {
      await Store.salvarParticipantes();
    } catch (err) {
      console.error(err);
      toast("Atenção: falha ao gravar os dados. Chame a equipe.", "erro");
    }
    mostrarResultado(r);
  }

  // ---------------- Resultado ----------------
  function mostrarResultado(r) {
    const p = estado.participante;
    const total = p.perguntas.length;
    const nome = U.escapeHtml(U.primeiroNome(p.nome));
    const titulo = p.acertos === total ? `Incrível, ${nome}! Você é expert no Ceará!`
      : p.acertos >= 3 ? `Muito bem, ${nome}!`
        : `Valeu pela participação, ${nome}!`;
    $("res-titulo").innerHTML = titulo;
    $("res-acertos").textContent = `${p.acertos}/${total}`;
    $("res-pontos").textContent = p.pontos;
    $("res-tempo").textContent = U.segundos(p.tempoTotalMs);
    $("res-bolinhas").innerHTML = p.perguntas.map((q) =>
      `<span class="${q.correta ? "certo" : "errado"}">${icone(q.correta ? "certo" : "errado")}</span>`).join("");

    const icones = { especial: "trofeu", intermediario: "presente", participacao: "festa" };
    if (r.premio) {
      $("res-premio").className = "premio premio-" + r.premio.id;
      $("res-premio").innerHTML = `
        <div class="premio-icone">${icone(icones[r.premio.id] || "presente")}</div>
        <div class="premio-info">
          <span class="premio-rotulo">Você ganhou</span>
          <strong>${U.escapeHtml(r.premio.nome)}</strong>
          <span>${U.escapeHtml(T.retirada)}</span>
        </div>
        <div class="premio-codigo"><span>Código</span><strong>${U.codigo(p.codigo)}</strong></div>`;
      $("btn-entrega").hidden = false;
      window.UI.confete(p.acertos >= 3 ? 4000 : 2500);
      Som.tocar("vitoria");
    } else {
      $("res-premio").className = "premio premio-vazio";
      $("res-premio").innerHTML = `<div class="premio-icone">${icone("palmeira")}</div>
        <div class="premio-info"><strong>Obrigado por participar!</strong><span>${U.escapeHtml(T.semPremio)}</span></div>
        <div class="premio-codigo"><span>Código</span><strong>${U.codigo(p.codigo)}</strong></div>`;
      $("btn-entrega").hidden = true;
    }
    const nota = $("res-nota");
    nota.hidden = !(r.premio && r.rebaixado && r.faixa);
    if (!nota.hidden) nota.textContent = `O estoque de "${r.faixa.nome}" acabou — você leva o próximo prêmio disponível.`;
    irPara("resultado");
    iniciarVoltaAutomatica();
  }

  function iniciarVoltaAutomatica() {
    let resta = VOLTA_RESULTADO_SEG;
    const atualizar = () => { $("res-volta").textContent = `Voltando à tela inicial em ${resta} s`; };
    atualizar();
    clearInterval(estado.timerResultado);
    estado.timerResultado = setInterval(() => {
      if (Modal.aberto) return; // pausa enquanto a equipe confirma a entrega
      resta -= 1;
      atualizar();
      if (resta <= 0) voltarAoInicio();
    }, 1000);
  }

  // Confirmação de entrega pela equipe direto na tela de resultado (PIN numérico)
  function confirmarEntrega() {
    const p = estado.participante;
    if (!p) return;
    if (p.entregue) { toast("Entrega já registrada."); return; }
    const validar = async () => {
      if ($("pin-equipe").value !== String(Store.config.pinEquipe)) {
        $("pin-erro").textContent = "PIN incorreto.";
        $("pin-equipe").value = "";
        return false;
      }
      p.entregue = true;
      p.entregueEm = new Date().toISOString();
      await Store.salvarParticipantes();
      Modal.fechar();
      $("btn-entrega").hidden = true;
      toast(`Entrega registrada: ${p.premioNome} (${U.codigo(p.codigo)})`, "sucesso");
      return true;
    };
    Modal.abrir({
      titulo: "Confirmar entrega do brinde",
      html: `<p><strong>${U.escapeHtml(p.premioNome)}</strong> para ${U.escapeHtml(p.nome)} (${U.codigo(p.codigo)})</p>
        <label class="campo"><span>PIN da equipe</span>
        <input id="pin-equipe" type="password" maxlength="8" data-teclado="numero" autocomplete="off"></label>
        <small class="erro" id="pin-erro"></small>`,
      botoes: [
        { texto: "Cancelar", classe: "btn-secundario" },
        { texto: "Confirmar entrega", classe: "btn-principal", acao: async () => ((await validar()) ? undefined : false) }
      ],
      aoAbrir: () => {
        const i = $("pin-equipe");
        i.addEventListener("teclado-ok", (e) => { e.preventDefault(); validar(); });
        setTimeout(() => i.focus(), 50);
      }
    });
  }

  // ---------------- Inatividade ----------------
  function verificarInatividade() {
    const ocioso = (Date.now() - estado.ultimoToque) / 1000;
    if (estado.tela === "admin" && ocioso > INATIVIDADE_ADMIN_SEG) {
      voltarAoInicio();
      return;
    }
    if (estado.tela !== "cadastro" || estado.avisoInatividade) return;
    if (ocioso > Store.config.inatividadeSeg) avisarInatividade();
  }

  function avisarInatividade() {
    estado.avisoInatividade = true;
    let resta = AVISO_INATIVIDADE_SEG;
    let timer = null;
    let continuar = false;
    Modal.abrir({
      titulo: "Você ainda está aí?",
      html: `<p>Por segurança, seus dados serão apagados em <strong id="ina-seg">${resta}</strong> segundos.</p>`,
      botoes: [{ texto: "Continuar participando", classe: "btn-principal", acao: () => { continuar = true; } }],
      aoFechar: () => {
        clearInterval(timer);
        estado.avisoInatividade = false;
        estado.ultimoToque = Date.now();
        if (!continuar) voltarAoInicio();
      }
    });
    timer = setInterval(() => {
      resta -= 1;
      const el = $("ina-seg");
      if (el) el.textContent = resta;
      if (resta <= 0) Modal.fechar();
    }, 1000);
  }

  // ---------------- Inicialização ----------------
  async function iniciar() {
    try {
      await Store.init();
    } catch (err) {
      console.error(err);
      toast("Falha ao carregar os dados salvos. Chame a equipe.", "erro");
    }
    window.Quiz.total = Object.values(window.DISTRIBUICAO_NIVEIS).reduce((a, b) => a + b, 0);
    window.Teclado.init();

    $("txt-consentimento").textContent = T.consentimento;
    $("txt-comunicacoes").textContent = T.comunicacoes;
    document.querySelectorAll("[data-icone]").forEach((el) => { el.innerHTML = icone(el.dataset.icone); });

    $("tela-inicio").addEventListener("click", (e) => {
      if (e.target.closest("#logo-admin")) return;
      Som.tocar("toque");
      irPara("cadastro");
    });
    $("logo-admin").addEventListener("click", tocarLogo);
    $("form-cadastro").addEventListener("submit", enviarCadastro);
    $("btn-voltar-cadastro").addEventListener("click", voltarAoInicio);
    $("btn-aviso").addEventListener("click", (e) => { e.preventDefault(); mostrarAviso(); });
    $("f-telefone").addEventListener("input", (e) => {
      e.target.value = U.formatarTelefone(e.target.value);
      // avisa logo ao completar o número, antes do resto do formulário
      const tel = U.soDigitos(e.target.value);
      if (U.telefoneValido(tel) && jaParticipou(tel)) erro("telefone", "Este WhatsApp já participou do Desafio Ceará.");
      else if (document.querySelector('[data-erro="telefone"]').textContent.includes("já participou")) erro("telefone");
    });
    $("f-email").addEventListener("input", (e) => {
      const v = e.target.value.toLowerCase().replace(/\s/g, "");
      if (v !== e.target.value) e.target.value = v;
    });
    $("quiz-alternativas").addEventListener("click", (e) => {
      const b = e.target.closest(".alternativa");
      if (b && !b.disabled) responder(Number(b.dataset.i));
    });
    $("btn-concluir").addEventListener("click", voltarAoInicio);
    $("btn-entrega").addEventListener("click", confirmarEntrega);

    ["pointerdown", "keydown"].forEach((ev) =>
      document.addEventListener(ev, () => { estado.ultimoToque = Date.now(); }, true));
    setInterval(verificarInatividade, 1000);

    // Totem: sem menu de contexto, sem arrastar imagens, sem zoom por gesto
    document.addEventListener("contextmenu", (e) => e.preventDefault());
    document.addEventListener("dragstart", (e) => e.preventDefault());
    document.addEventListener("gesturestart", (e) => e.preventDefault());
    document.addEventListener("wheel", (e) => { if (e.ctrlKey) e.preventDefault(); }, { passive: false });
    document.addEventListener("keydown", (e) => {
      // Atalho alternativo para a equipe (teclado físico): Ctrl + Shift + A
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") { e.preventDefault(); pedirSenhaAdmin(); }
    });

    renderInicio();
    irPara("inicio");
    if (Store.ultimoAviso) toast(Store.ultimoAviso, "erro");
  }

  window.App = { irPara, voltarAoInicio, renderInicio, estado };
  document.addEventListener("DOMContentLoaded", iniciar);
})();
