/* Componentes de interface: ícones, modal, toast, sons e confete. */
(function () {
  const ICONES = {
    trofeu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4z"/><path d="M17 5h3v2a4 4 0 0 1-4 4M7 5H4v2a4 4 0 0 0 4 4"/></svg>',
    presente: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="8" width="18" height="4" rx="1"/><path d="M12 8v13M19 12v9H5v-9"/><path d="M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5"/></svg>',
    festa: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5.8 11.3 2 22l10.7-3.8"/><path d="M4 3h.01M22 8h.01M15 2h.01M22 20h.01"/><path d="m22 2-2.2.7a2.9 2.9 0 0 0-1.9 3.3c.2 1-.6 2-1.6 2H16"/><path d="M11 13c1.9 1.9 2.8 4.2 2 5s-3.1-.1-5-2-2.8-4.2-2-5 3.1.1 5 2z"/></svg>',
    palmeira: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 8c0-2.8-2.2-5-5-5H6"/><path d="M13 7.1A5 5 0 0 1 21 7h-3.5"/><path d="M5.9 11.5A5 5 0 0 1 13 8c.3 2.1-.5 4-2 5.3"/><path d="M10 22c.5-3 .5-7 3-14 1.2 2 2.5 4.8 2.5 7.5"/><path d="M4 22h16"/></svg>',
    certo: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
    errado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
    relogio: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    olho: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>',
    olhoFechado: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9.9 4.2A10.8 10.8 0 0 1 12 4c6.5 0 10 8 10 8a17.6 17.6 0 0 1-2.2 3.2M6.6 6.6A17.5 17.5 0 0 0 2 12s3.5 8 10 8a9.7 9.7 0 0 0 5.4-1.6"/><path d="M9.9 9.9a3 3 0 0 0 4.2 4.2"/><path d="M2 2l20 20"/></svg>'
  };

  function icone(nome) {
    return `<span class="icone">${ICONES[nome] || ""}</span>`;
  }

  // ---------- Modal ----------
  const Modal = {
    aberto: false,
    fecharAtual: null,

    abrir({ titulo, html, botoes, classe, aoAbrir, aoFechar }) {
      const fundo = document.getElementById("modal");
      fundo.querySelector(".modal").className = "modal " + (classe || "");
      document.getElementById("modal-titulo").textContent = titulo || "";
      document.getElementById("modal-corpo").innerHTML = html || "";
      const acoes = document.getElementById("modal-acoes");
      acoes.innerHTML = "";
      const fechar = () => {
        // só fecha se este ainda for o modal aberto (uma ação pode ter aberto outro)
        if (!this.aberto || this.fecharAtual !== fechar) return;
        this.aberto = false;
        fundo.hidden = true;
        window.Teclado && window.Teclado.fechar();
        if (aoFechar) aoFechar();
      };
      (botoes || [{ texto: "OK", classe: "btn-principal" }]).forEach((b) => {
        const el = document.createElement("button");
        el.type = "button";
        el.className = "btn " + (b.classe || "btn-secundario");
        el.textContent = b.texto;
        el.addEventListener("click", async () => {
          if (b.acao) {
            const r = await b.acao();
            if (r === false) return; // ação pediu para manter o modal aberto
          }
          fechar();
        });
        acoes.appendChild(el);
      });
      this.aberto = true;
      this.fecharAtual = fechar;
      fundo.hidden = false;
      if (aoAbrir) aoAbrir(document.getElementById("modal-corpo"));
      return fechar;
    },

    fechar() {
      if (this.fecharAtual) this.fecharAtual();
    },

    confirmar(titulo, texto, textoOk) {
      return new Promise((resolve) => {
        let ok = false;
        this.abrir({
          titulo,
          html: `<p>${texto}</p>`,
          botoes: [
            { texto: "Cancelar", classe: "btn-secundario" },
            { texto: textoOk || "Confirmar", classe: "btn-perigo", acao: () => { ok = true; } }
          ],
          aoFechar: () => resolve(ok)
        });
      });
    }
  };

  // ---------- Toast ----------
  let toastTimer = null;
  function toast(msg, tipo) {
    const el = document.getElementById("toast");
    el.textContent = msg;
    el.className = "aviso-toast " + (tipo || "");
    el.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.hidden = true; }, 3500);
  }

  // ---------- Sons (gerados na hora, sem arquivos) ----------
  let ctx = null;
  function tom(freq, inicio, dur, tipo, vol) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = tipo || "sine";
    o.frequency.value = freq;
    const t = ctx.currentTime + inicio;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(vol || 0.18, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(ctx.destination);
    o.start(t);
    o.stop(t + dur + 0.05);
  }
  const Som = {
    tocar(nome) {
      if (!window.Store || !window.Store.config.som) return;
      try {
        ctx = ctx || new (window.AudioContext || window.webkitAudioContext)();
        if (ctx.state === "suspended") ctx.resume();
        if (nome === "certo") { tom(660, 0, 0.15); tom(990, 0.12, 0.25); }
        else if (nome === "errado") { tom(220, 0, 0.3, "triangle", 0.2); }
        else if (nome === "tique") { tom(880, 0, 0.06, "square", 0.05); }
        else if (nome === "vitoria") { [523, 659, 784, 1047].forEach((f, i) => tom(f, i * 0.13, 0.3)); }
        else if (nome === "toque") { tom(520, 0, 0.08, "sine", 0.08); }
      } catch (e) { /* sem áudio no equipamento */ }
    }
  };

  // ---------- Confete ----------
  const CORES = ["#ffd23f", "#f39200", "#e5602b", "#13b5c1", "#1ea7e1", "#2f3e9e", "#ffffff"];
  let animando = null;
  function confete(duracaoMs) {
    const cv = document.getElementById("confete");
    const c = cv.getContext("2d");
    cv.width = window.innerWidth;
    cv.height = window.innerHeight;
    const n = Math.round(Math.min(220, cv.width / 6));
    const pedacos = Array.from({ length: n }, () => ({
      x: Math.random() * cv.width,
      y: -20 - Math.random() * cv.height * 0.6,
      w: 8 + Math.random() * 10,
      h: 10 + Math.random() * 14,
      vy: 2.5 + Math.random() * 4,
      vx: -1.5 + Math.random() * 3,
      r: Math.random() * Math.PI,
      vr: -0.15 + Math.random() * 0.3,
      cor: CORES[Math.floor(Math.random() * CORES.length)]
    }));
    const fim = performance.now() + (duracaoMs || 3500);
    cancelAnimationFrame(animando);
    (function quadro(agora) {
      c.clearRect(0, 0, cv.width, cv.height);
      pedacos.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.r += p.vr;
        if (p.y > cv.height + 20 && agora < fim) { p.y = -20; p.x = Math.random() * cv.width; }
        c.save();
        c.translate(p.x, p.y);
        c.rotate(p.r);
        c.fillStyle = p.cor;
        c.fillRect(-p.w / 2, -p.h / 2, p.w, p.h * Math.abs(Math.cos(p.r)));
        c.restore();
      });
      if (agora < fim || pedacos.some((p) => p.y < cv.height + 20)) animando = requestAnimationFrame(quadro);
      else c.clearRect(0, 0, cv.width, cv.height);
    })(performance.now());
  }
  function pararConfete() {
    cancelAnimationFrame(animando);
    const cv = document.getElementById("confete");
    cv.getContext("2d").clearRect(0, 0, cv.width, cv.height);
  }

  // ---------- Mostrar/esconder senha ----------
  // Todo campo de senha (inclusive os criados depois, em janelas e no painel) ganha um botão de olho.
  function prepararSenha(input) {
    if (input.dataset.olho) return;
    input.dataset.olho = "1";
    const caixa = document.createElement("span");
    caixa.className = "senha-caixa";
    input.parentNode.insertBefore(caixa, input);
    caixa.appendChild(input);
    const botao = document.createElement("button");
    botao.type = "button";
    botao.tabIndex = -1;
    botao.className = "btn-olho";
    const atualizar = () => {
      const visivel = input.type === "text";
      botao.innerHTML = icone(visivel ? "olhoFechado" : "olho");
      botao.setAttribute("aria-label", visivel ? "Esconder senha" : "Mostrar senha");
    };
    // não tira o foco do campo (o teclado da tela continua aberto)
    botao.addEventListener("pointerdown", (e) => e.preventDefault());
    botao.addEventListener("mousedown", (e) => e.preventDefault());
    botao.addEventListener("click", (e) => {
      e.preventDefault();
      input.type = input.type === "password" ? "text" : "password";
      atualizar();
    });
    atualizar();
    caixa.appendChild(botao);
  }
  const prepararSenhas = () => document.querySelectorAll('input[type="password"]:not([data-olho])').forEach(prepararSenha);
  new MutationObserver(prepararSenhas).observe(document.body, { childList: true, subtree: true });
  prepararSenhas();

  window.UI = { ICONES, icone, Modal, toast, Som, confete, pararConfete };
})();
