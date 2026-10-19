/*
 * Teclado virtual na tela, para totens touch.
 * Qualquer <input data-teclado="nome|texto|email|senha|telefone|numero"> abre o teclado ao receber foco.
 * Atributos opcionais: data-proximo="idDoProximoCampo".
 * Ao tocar OK, o input recebe o evento "teclado-ok" (cancelável); se não for cancelado,
 * o foco vai para data-proximo ou o teclado fecha.
 */
(function () {
  const NUM = "1234567890".split("");
  const L1 = "qwertyuiop".split("");
  const L2 = "asdfghjklç".split("");
  const L2_SEM_C = "asdfghjkl".split("");
  const L3 = "zxcvbnm".split("");
  const AC1 = "áàâãéêíóôõ".split("");
  const AC2 = "úüçñ".split("");

  const SHIFT = { k: "shift", t: "⇧", cls: "tecla-larga" };
  const BACK = { k: "back", t: "⌫", cls: "tecla-larga" };
  const OK = { k: "ok", t: "OK", cls: "tecla-ok" };
  const ACENTOS = { k: "acentos", t: "á é ç", cls: "tecla-larga" };
  const ESPACO = { k: "char", v: " ", t: "espaço", cls: "tecla-espaco" };
  const chip = (v) => ({ k: "char", v, t: v, cls: "tecla-chip" });

  function letras(modoAcentos, comCedilha) {
    if (modoAcentos) return [AC1, AC2];
    return [L1, comCedilha ? L2 : L2_SEM_C];
  }

  function layout(modo, estado) {
    const [r1, r2] = letras(estado.acentos, modo !== "email" && modo !== "senha");
    switch (modo) {
      case "telefone":
      case "numero":
        return [["1", "2", "3"], ["4", "5", "6"], ["7", "8", "9"], [BACK, "0", OK]];
      case "email":
        return [
          ["@gmail.com", "@hotmail.com", "@outlook.com", ".com", ".com.br"].map(chip),
          NUM, L1, L2_SEM_C,
          ["_"].concat(L3, [BACK]),
          ["-", "@", ".", OK]
        ];
      case "senha":
        return [NUM, L1, L2_SEM_C, [SHIFT].concat(L3, [BACK]), ["@", "#", "!", "$", ".", "-", "_", OK]];
      case "nome":
        return [r1, r2, [SHIFT].concat(L3, [BACK]), [ACENTOS, "'", ESPACO, "-", OK]];
      default: // texto
        return [NUM, r1, r2, [SHIFT].concat(L3, [BACK]), [ACENTOS, "&", ESPACO, ".", "-", OK]];
    }
  }

  const Teclado = {
    el: null,
    alvo: null,
    modo: "texto",
    estado: { shift: false, acentos: false },
    habilitado: () => !window.Store || window.Store.config.tecladoVirtual !== false,

    init() {
      this.el = document.getElementById("teclado");
      document.addEventListener("focusin", (e) => {
        const t = e.target;
        if (t && t.matches && t.matches("input[data-teclado]")) this.abrir(t);
      });
      // reforço: o toque no campo sempre abre o teclado, mesmo se o evento de foco não vier
      document.addEventListener("click", (e) => {
        const t = e.target;
        if (t && t.matches && t.matches("input[data-teclado]") && (this.el.hidden || this.alvo !== t)) this.abrir(t);
      });
      document.addEventListener("focusout", () => {
        setTimeout(() => {
          const a = document.activeElement;
          if (!a || !a.matches || !a.matches("input[data-teclado]")) this.fechar();
        }, 60);
      });
      this.el.addEventListener("pointerdown", (e) => this.tocar(e));
      this.el.addEventListener("mousedown", (e) => e.preventDefault());
      this.el.addEventListener("pointerup", () => this.pararRepeticao());
      this.el.addEventListener("pointerleave", () => this.pararRepeticao());
      this.el.addEventListener("pointercancel", () => this.pararRepeticao());
    },

    abrir(input) {
      const modo = input.dataset.teclado || "texto";
      if (!this.habilitado()) {
        input.setAttribute("inputmode", modo === "telefone" || modo === "numero" ? "numeric" : modo === "email" ? "email" : "text");
        this.fechar();
        return;
      }
      input.setAttribute("inputmode", "none");
      this.alvo = input;
      this.modo = modo;
      this.estado = { shift: modo === "nome" && this.inicioDePalavra(), acentos: false };
      this.render();
      this.el.hidden = false;
      document.body.classList.add("teclado-aberto");
      document.documentElement.style.setProperty("--altura-teclado", this.el.offsetHeight + "px");
      setTimeout(() => this.mostrarCampo(input), 30);
    },

    // Rola a tela para o campo ficar centralizado na área visível acima do teclado
    mostrarCampo(input) {
      const cont = input.closest(".tela, .modal");
      if (!cont) return;
      const r = input.getBoundingClientRect();
      const visivel = window.innerHeight - this.el.offsetHeight;
      const alvo = Math.max(16, visivel / 2 - r.height / 2);
      cont.scrollBy({ top: r.top - alvo, behavior: "smooth" });
    },

    fechar() {
      if (this.el.hidden) return;
      this.el.hidden = true;
      this.alvo = null;
      document.body.classList.remove("teclado-aberto");
      document.documentElement.style.setProperty("--altura-teclado", "0px");
    },

    inicioDePalavra() {
      const i = this.alvo;
      if (!i) return false;
      const antes = i.value.slice(0, i.selectionStart == null ? i.value.length : i.selectionStart);
      return antes.length === 0 || /\s$/.test(antes);
    },

    render() {
      const maiusc = this.estado.shift;
      const linhas = layout(this.modo, this.estado);
      const numerico = this.modo === "telefone" || this.modo === "numero";
      this.el.className = "teclado" + (numerico ? " teclado-numerico" : "");
      this.el.innerHTML = linhas.map((linha) =>
        `<div class="teclado-linha">${linha.map((tecla) => {
          const t = typeof tecla === "string" ? { k: "char", v: tecla, t: tecla } : tecla;
          const v = t.k === "char" && t.v.length === 1 && maiusc ? t.v.toUpperCase() : t.v;
          const rotulo = t.k === "char" && t.v.length === 1 && t.v !== " " ? v : t.t;
          const ativo = (t.k === "shift" && maiusc) || (t.k === "acentos" && this.estado.acentos) ? " ativa" : "";
          return `<button type="button" tabindex="-1" class="tecla ${t.cls || ""}${ativo}" data-k="${t.k}" data-v="${t.k === "char" ? window.Util.escapeHtml(v) : ""}">${window.Util.escapeHtml(rotulo)}</button>`;
        }).join("")}</div>`
      ).join("");
    },

    tocar(e) {
      const b = e.target.closest(".tecla");
      e.preventDefault(); // mantém o foco no campo
      if (!b || !this.alvo) return;
      b.classList.add("pressionada");
      setTimeout(() => b.classList.remove("pressionada"), 120);
      const k = b.dataset.k;
      if (k === "char") this.inserir(b.dataset.v);
      else if (k === "back") { this.apagar(); this.iniciarRepeticao(); }
      else if (k === "shift") { this.estado.shift = !this.estado.shift; this.render(); }
      else if (k === "acentos") { this.estado.acentos = !this.estado.acentos; this.render(); }
      else if (k === "ok") this.ok();
    },

    inserir(txt) {
      const i = this.alvo;
      const max = i.maxLength > 0 ? i.maxLength : Infinity;
      if (i.value.length + txt.length > max) return;
      const ini = i.selectionStart == null ? i.value.length : i.selectionStart;
      const fim = i.selectionEnd == null ? i.value.length : i.selectionEnd;
      i.setRangeText(txt, ini, fim, "end");
      i.dispatchEvent(new Event("input", { bubbles: true }));
      // shift vale para uma letra; no nome, liga sozinho no início de cada palavra
      this.estado.shift = this.modo === "nome" ? this.inicioDePalavra() : false;
      this.render();
    },

    apagar() {
      const i = this.alvo;
      if (!i) return;
      let ini = i.selectionStart == null ? i.value.length : i.selectionStart;
      const fim = i.selectionEnd == null ? i.value.length : i.selectionEnd;
      if (ini === fim) {
        if (ini === 0) return;
        ini -= 1;
      }
      i.setRangeText("", ini, fim, "end");
      i.dispatchEvent(new Event("input", { bubbles: true }));
      if (this.modo === "nome") { this.estado.shift = this.inicioDePalavra(); this.render(); }
    },

    iniciarRepeticao() {
      this.pararRepeticao();
      this.repTimeout = setTimeout(() => {
        this.repInterval = setInterval(() => this.apagar(), 70);
      }, 450);
    },

    pararRepeticao() {
      clearTimeout(this.repTimeout);
      clearInterval(this.repInterval);
    },

    ok() {
      const i = this.alvo;
      const ev = new CustomEvent("teclado-ok", { cancelable: true });
      if (!i.dispatchEvent(ev)) return;
      const prox = i.dataset.proximo && document.getElementById(i.dataset.proximo);
      if (prox) prox.focus();
      else i.blur();
    }
  };

  window.Teclado = Teclado;
})();
