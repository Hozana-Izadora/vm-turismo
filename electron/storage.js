// Armazenamento em disco: Documentos\Desafio Ceará BTM 2026\
// participantes.json é a fonte da verdade; participantes.csv é regenerado a cada gravação.
const fs = require("fs");
const path = require("path");

const BACKUP_A_CADA = 25;

function criarStorage(dir) {
  const arq = {
    participantes: path.join(dir, "participantes.json"),
    config: path.join(dir, "config.json"),
    csv: path.join(dir, "participantes.csv"),
    backups: path.join(dir, "backups")
  };
  fs.mkdirSync(arq.backups, { recursive: true });

  function gravarAtomico(arquivo, conteudo) {
    const tmp = arquivo + ".tmp";
    const fd = fs.openSync(tmp, "w");
    try {
      fs.writeFileSync(fd, conteudo, "utf8");
      fs.fsyncSync(fd);
    } finally {
      fs.closeSync(fd);
    }
    // mantém a versão anterior como .anterior para recuperação
    if (fs.existsSync(arquivo)) fs.copyFileSync(arquivo, arquivo + ".anterior");
    fs.renameSync(tmp, arquivo);
  }

  function lerJson(arquivo, padrao) {
    for (const candidato of [arquivo, arquivo + ".anterior"]) {
      try {
        if (fs.existsSync(candidato)) return JSON.parse(fs.readFileSync(candidato, "utf8"));
      } catch (e) {
        console.error("Falha ao ler", candidato, e);
      }
    }
    return padrao;
  }

  function carimbo() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}_${p(d.getHours())}-${p(d.getMinutes())}-${p(d.getSeconds())}`;
  }

  function backup(motivo) {
    const destino = path.join(arq.backups, `participantes_${carimbo()}_${motivo || "manual"}.json`);
    if (fs.existsSync(arq.participantes)) fs.copyFileSync(arq.participantes, destino);
    return destino;
  }

  return {
    dir,
    carregar() {
      return {
        participantes: lerJson(arq.participantes, []),
        config: lerJson(arq.config, null)
      };
    },

    salvarParticipantes(lista, csv) {
      const anterior = lerJson(arq.participantes, []).length;
      gravarAtomico(arq.participantes, JSON.stringify(lista, null, 2));
      let avisoCsv = null;
      try {
        // o CSV pode estar aberto no Excel (arquivo bloqueado) — não pode impedir a gravação do JSON
        gravarAtomico(arq.csv, csv);
      } catch (e) {
        avisoCsv = "Não foi possível atualizar participantes.csv (arquivo aberto no Excel?). Os dados estão salvos em participantes.json.";
      }
      if (lista.length > anterior && lista.length % BACKUP_A_CADA === 0) backup(`${lista.length}-participantes`);
      return { ok: true, avisoCsv };
    },

    salvarConfig(config) {
      gravarAtomico(arq.config, JSON.stringify(config, null, 2));
      return { ok: true };
    },

    backup
  };
}

module.exports = { criarStorage };
