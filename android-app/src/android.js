/*
 * Desafio Ceará — versão Android (tablets e celulares).
 *
 * Carregado ANTES de js/store.js. Define window.vmStore com a mesma interface que o
 * Electron usa no Windows (electron/preload.js), gravando os dados no próprio aparelho:
 *   - pasta interna do app (fonte da verdade, gravação segura com .tmp e .anterior);
 *   - cópia do CSV em Documentos › Desafio Ceará BTM 2026 (visível no app "Arquivos").
 * Fora do app Android (navegador comum), não faz nada e o app usa o IndexedDB.
 */
(function () {
  const Cap = window.Capacitor;
  if (!Cap || !Cap.isNativePlatform || !Cap.isNativePlatform()) return;

  const { Filesystem, App, Share } = Cap.Plugins;
  const INTERNO = "DATA";       // pasta privada do app: não some ao fechar nem ao desligar
  const DOCUMENTOS = "DOCUMENTS"; // Documentos do aparelho: a equipe acessa pelo app Arquivos
  const PASTA = "Desafio Ceará BTM 2026";
  const BACKUP_A_CADA = 25;
  let ultimoTotal = 0;

  // O botão "voltar" do Android não deve tirar o visitante do quiz
  App.addListener("backButton", () => {});

  const caminho = (nome) => `${PASTA}/${nome}`;

  function carimbo() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
  }

  async function existe(path, directory) {
    try {
      await Filesystem.stat({ path, directory });
      return true;
    } catch (e) {
      return false;
    }
  }

  async function criarPasta(path, directory) {
    try {
      await Filesystem.mkdir({ path, directory, recursive: true });
    } catch (e) { /* já existe */ }
  }

  // Grava primeiro em .tmp, guarda a versão anterior e só então troca o arquivo
  async function gravarSeguro(nome, conteudo) {
    const p = caminho(nome);
    await Filesystem.writeFile({ path: p + ".tmp", directory: INTERNO, data: conteudo, encoding: "utf8" });
    if (await existe(p, INTERNO)) await Filesystem.copy({ from: p, to: p + ".anterior", directory: INTERNO });
    await Filesystem.rename({ from: p + ".tmp", to: p, directory: INTERNO });
  }

  async function lerJson(nome, padrao) {
    for (const candidato of [nome, nome + ".tmp", nome + ".anterior"]) {
      try {
        const r = await Filesystem.readFile({ path: caminho(candidato), directory: INTERNO, encoding: "utf8" });
        return JSON.parse(r.data);
      } catch (e) { /* tenta o próximo */ }
    }
    return padrao;
  }

  // Cópia visível em Documentos: é um extra, nunca pode impedir a gravação principal
  async function gravarEmDocumentos(nome, conteudo) {
    try {
      await Filesystem.writeFile({ path: caminho(nome), directory: DOCUMENTOS, data: conteudo, encoding: "utf8", recursive: true });
      return true;
    } catch (e) {
      return false;
    }
  }

  async function backup(motivo) {
    const nome = `participantes_${carimbo()}_${motivo || "manual"}.json`;
    if (!(await existe(caminho("participantes.json"), INTERNO))) return nome;
    await Filesystem.copy({ from: caminho("participantes.json"), to: caminho("backups/" + nome), directory: INTERNO });
    try {
      const r = await Filesystem.readFile({ path: caminho("participantes.json"), directory: INTERNO, encoding: "utf8" });
      await gravarEmDocumentos("backups/" + nome, r.data);
    } catch (e) { /* a cópia interna já foi feita */ }
    return nome;
  }

  window.vmStore = {
    async carregar() {
      await criarPasta(PASTA + "/backups", INTERNO);
      try { await Filesystem.requestPermissions(); } catch (e) { /* Android novo não precisa */ }
      const participantes = await lerJson("participantes.json", []);
      ultimoTotal = participantes.length;
      return {
        participantes,
        config: await lerJson("config.json", null),
        dir: `Documentos › ${PASTA} (neste aparelho)`
      };
    },

    async salvarParticipantes(lista, csv) {
      await gravarSeguro("participantes.json", JSON.stringify(lista));
      await gravarEmDocumentos("participantes.csv", csv);
      if (lista.length > ultimoTotal && lista.length % BACKUP_A_CADA === 0) await backup(`${lista.length}-participantes`);
      ultimoTotal = lista.length;
      return { ok: true, avisoCsv: null };
    },

    async salvarConfig(config) {
      await gravarSeguro("config.json", JSON.stringify(config, null, 2));
      return { ok: true };
    },

    backup,

    // Salva a planilha em Documentos e abre o "Compartilhar" do Android
    // (salvar no Drive, enviar por WhatsApp/e-mail ou copiar para um pendrive)
    async exportarCsv(csv, nomeSugerido) {
      let directory = DOCUMENTOS;
      let local = `Documentos › ${PASTA} › ${nomeSugerido}`;
      if (!(await gravarEmDocumentos(nomeSugerido, csv))) {
        directory = "CACHE";
        local = nomeSugerido;
        await Filesystem.writeFile({ path: nomeSugerido, directory, data: csv, encoding: "utf8" });
      }
      try {
        const { uri } = await Filesystem.getUri({ path: directory === "CACHE" ? nomeSugerido : caminho(nomeSugerido), directory });
        await Share.share({ title: "Participantes — Desafio Ceará", dialogTitle: "Enviar ou salvar a planilha", files: [uri] });
      } catch (e) { /* compartilhamento cancelado: o arquivo já está salvo */ }
      return { ok: true, caminho: local };
    },

    abrirPasta() { /* sem equivalente no Android: o botão fica oculto (android.css) */ },

    sair() { App.exitApp(); }
  };
})();
