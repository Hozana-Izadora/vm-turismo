/* Sorteio das perguntas da rodada: 2 fáceis, 2 intermediárias e 1 difícil (em ordem crescente). */
(function () {
  const U = window.Util;
  const ORDEM = ["facil", "intermediario", "dificil"];

  const norm = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");

  // Duas perguntas "conflitam" (não caem na mesma rodada) se:
  //  - uma resposta contém a outra ("Mundaú" × "Rio Mundaú", ou respostas iguais);
  //  - o texto de uma entrega a resposta da outra
  //    (ex.: "Em qual município fica a Praia de Morro Branco?" × "...labirinto de falésias?" → Morro Branco);
  //  - pertencem ao mesmo "grupo", definido em perguntas.js.
  function conflitam(a, b) {
    const ra = norm(a.correta), rb = norm(b.correta);
    if (a.grupo && a.grupo === b.grupo) return true;
    return ra.includes(rb) || rb.includes(ra) || norm(b.texto).includes(ra) || norm(a.texto).includes(rb);
  }

  function sortear(perguntas, distribuicao) {
    const escolhidas = [];
    ORDEM.forEach((nivel) => {
      const doNivel = U.embaralhar(perguntas.filter((p) => p.nivel === nivel));
      const qtd = distribuicao[nivel] || 0;
      const doNivelEscolhidas = [];
      doNivel.forEach((p) => {
        if (doNivelEscolhidas.length < qtd && !escolhidas.concat(doNivelEscolhidas).some((e) => conflitam(e, p))) {
          doNivelEscolhidas.push(p);
        }
      });
      // reserva: se o banco editado não permitir evitar conflitos, completa mesmo assim
      doNivel.forEach((p) => {
        if (doNivelEscolhidas.length < qtd && !doNivelEscolhidas.includes(p)) doNivelEscolhidas.push(p);
      });
      escolhidas.push(...doNivelEscolhidas);
    });
    return escolhidas.map((p) => ({
      id: p.id,
      nivel: p.nivel,
      texto: p.texto,
      correta: p.correta,
      alternativas: U.embaralhar([p.correta].concat(p.erradas))
    }));
  }

  const NOME_NIVEL = { facil: "Fácil", intermediario: "Intermediária", dificil: "Difícil" };

  window.Quiz = { sortear, NOME_NIVEL };
})();
