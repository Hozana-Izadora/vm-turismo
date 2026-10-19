/*
 * Premiação imediata por faixa de acertos, com controle de estoque.
 * Se a faixa conquistada estiver esgotada, o participante recebe a faixa inferior disponível.
 */
(function () {
  function ordenadas(premios) {
    return premios.slice().sort((a, b) => b.minAcertos - a.minAcertos);
  }

  function atribuidos(premio, participantes) {
    return participantes.filter((p) => p.premioId === premio.id).length;
  }

  function entregues(premio, participantes) {
    return participantes.filter((p) => p.premioId === premio.id && p.entregue).length;
  }

  function disponiveis(premio, participantes) {
    return Math.max(0, (Number(premio.estoque) || 0) - atribuidos(premio, participantes));
  }

  function faixa(acertos, premios) {
    return ordenadas(premios).find((p) => acertos >= p.minAcertos) || null;
  }

  // Retorna { premio, faixa, rebaixado } — premio = null se todas as faixas possíveis esgotaram
  function atribuir(acertos, premios, participantes) {
    const lista = ordenadas(premios);
    const conquistada = faixa(acertos, premios);
    const inicio = conquistada ? lista.indexOf(conquistada) : lista.length;
    for (let i = inicio; i < lista.length; i++) {
      if (disponiveis(lista[i], participantes) > 0) {
        return { premio: lista[i], faixa: conquistada, rebaixado: i !== inicio };
      }
    }
    return { premio: null, faixa: conquistada, rebaixado: false };
  }

  window.Premios = { ordenadas, atribuidos, entregues, disponiveis, faixa, atribuir };
})();
