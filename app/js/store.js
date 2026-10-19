/*
 * Camada de armazenamento.
 *  - No app Electron (totem Windows): grava em disco via window.vmStore.
 *  - No navegador puro (Chrome/Edge/Android): IndexedDB, com localStorage como reserva.
 * Os dados ficam em memória (Store.participantes / Store.config) e são gravados a cada alteração.
 */
(function () {
  const U = window.Util;

  const CONFIG_PADRAO = {
    versao: 1,
    senhaHash: U.sha256("VM2026@BTM"),
    pinEquipe: "2026",
    tempoPergunta: 15,
    pontosPorAcerto: 100,
    inatividadeSeg: 60,
    som: true,
    tecladoVirtual: true,
    premios: [
      { id: "especial", nome: "Prêmio especial", minAcertos: 5, estoque: 20 },
      { id: "intermediario", nome: "Brinde intermediário", minAcertos: 3, estoque: 150 },
      { id: "participacao", nome: "Brinde de participação", minAcertos: 0, estoque: 400 }
    ]
  };

  function mesclarConfig(salva) {
    const c = Object.assign({}, CONFIG_PADRAO, salva || {});
    c.premios = CONFIG_PADRAO.premios.map((padrao) => {
      const s = ((salva && salva.premios) || []).find((p) => p.id === padrao.id);
      return Object.assign({}, padrao, s || {});
    });
    return c;
  }

  // ---------- IndexedDB (modo navegador) ----------
  const DB_NOME = "desafio-ceara";
  let dbPromessa = null;

  function abrirDb() {
    if (dbPromessa) return dbPromessa;
    dbPromessa = new Promise((resolve, reject) => {
      if (!window.indexedDB) return reject(new Error("IndexedDB indisponível"));
      const req = indexedDB.open(DB_NOME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore("kv");
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => reject(req.error);
    });
    return dbPromessa;
  }

  async function idbGet(chave) {
    try {
      const db = await abrirDb();
      return await new Promise((resolve, reject) => {
        const r = db.transaction("kv").objectStore("kv").get(chave);
        r.onsuccess = () => resolve(r.result);
        r.onerror = () => reject(r.error);
      });
    } catch (e) {
      const v = localStorage.getItem(DB_NOME + ":" + chave);
      return v ? JSON.parse(v) : undefined;
    }
  }

  async function idbSet(chave, valor) {
    try {
      const db = await abrirDb();
      await new Promise((resolve, reject) => {
        const tx = db.transaction("kv", "readwrite");
        tx.objectStore("kv").put(valor, chave);
        tx.oncomplete = resolve;
        tx.onerror = () => reject(tx.error);
      });
    } catch (e) {
      localStorage.setItem(DB_NOME + ":" + chave, JSON.stringify(valor));
    }
  }

  function baixarArquivo(conteudo, nome, tipo) {
    const blob = new Blob([conteudo], { type: tipo });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = nome;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
  }

  function carimbo() {
    const d = new Date();
    return `${d.getFullYear()}-${U.pad(d.getMonth() + 1)}-${U.pad(d.getDate())}_${U.pad(d.getHours())}-${U.pad(d.getMinutes())}`;
  }

  const disco = window.vmStore || null;

  const Store = {
    modo: disco ? "disco" : "navegador",
    dir: null,
    participantes: [],
    config: mesclarConfig(null),
    ultimoAviso: null,

    async init() {
      let dados;
      if (disco) {
        dados = await disco.carregar();
        this.dir = dados.dir;
      } else {
        dados = { participantes: await idbGet("participantes"), config: await idbGet("config") };
        if (navigator.storage && navigator.storage.persist) navigator.storage.persist().catch(() => {});
      }
      this.participantes = Array.isArray(dados.participantes) ? dados.participantes : [];
      this.config = mesclarConfig(dados.config);

      // Quem estava no meio do quiz quando o app fechou fica como "incompleto"
      let alterou = false;
      this.participantes.forEach((p) => {
        if (p.status === "em_andamento") { p.status = "incompleto"; alterou = true; }
      });
      if (alterou) await this.salvarParticipantes();
      if (!dados.config) await this.salvarConfig();
    },

    proximoCodigo() {
      return this.participantes.reduce((m, p) => Math.max(m, p.codigo || 0), 0) + 1;
    },

    async salvarParticipantes() {
      const csv = window.Csv.gerar(this.participantes);
      if (disco) {
        const r = await disco.salvarParticipantes(this.participantes, csv);
        this.ultimoAviso = r && r.avisoCsv;
      } else {
        await idbSet("participantes", this.participantes);
      }
    },

    async salvarConfig() {
      if (disco) await disco.salvarConfig(this.config);
      else await idbSet("config", this.config);
    },

    async backup(motivo) {
      if (disco) return disco.backup(motivo);
      // no navegador, o backup é um download do CSV
      baixarArquivo(window.Csv.gerar(this.participantes), `desafio-ceara_backup_${carimbo()}.csv`, "text/csv;charset=utf-8");
      return "download";
    },

    async exportarCsv() {
      const csv = window.Csv.gerar(this.participantes);
      const nome = `desafio-ceara_participantes_${carimbo()}.csv`;
      if (disco) return disco.exportarCsv(csv, nome);
      baixarArquivo(csv, nome, "text/csv;charset=utf-8");
      return { ok: true, caminho: nome };
    },

    async zerar() {
      await this.backup("antes-de-zerar");
      this.participantes = [];
      await this.salvarParticipantes();
    },

    abrirPasta() { if (disco) disco.abrirPasta(); },
    podeSair() { return !!disco; },
    sair() { if (disco) disco.sair(); }
  };

  window.Store = Store;
})();
