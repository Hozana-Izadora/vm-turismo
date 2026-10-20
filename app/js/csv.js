/* Exportação CSV compatível com Excel em português (BOM UTF-8 + separador ";"). */
(function () {
  const U = window.Util;

  const STATUS = { concluido: "Concluído", em_andamento: "Em andamento", incompleto: "Incompleto" };

  function celula(v) {
    let s = String(v == null ? "" : v);
    // evita que o Excel interprete o conteúdo como fórmula
    if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
    if (/[;"\r\n]/.test(s)) s = '"' + s.replace(/"/g, '""') + '"';
    return s;
  }

  function gerar(participantes) {
    const cab = [
      "Código", "Data", "Hora", "Nome", "WhatsApp", "E-mail", "Agência/Empresa",
      "Consentimento LGPD", "Aceita comunicações", "Status", "Acertos", "Pontos",
      "Tempo total (s)", "Prêmio", "Entregue", "Data/hora entrega", "Respostas"
    ];
    const linhas = participantes
      .slice()
      .sort((a, b) => a.codigo - b.codigo)
      .map((p) => [
        U.codigo(p.codigo),
        U.dataBR(p.criadoEm),
        U.horaBR(p.criadoEm),
        p.nome,
        U.formatarTelefone(p.telefone),
        p.email,
        p.empresa || "",
        p.semCadastro ? "Sem cadastro" : p.consentimento ? "Sim" : "Não",
        p.semCadastro ? "" : p.aceitaComunicacoes ? "Sim" : "Não",
        STATUS[p.status] || p.status,
        p.status === "concluido" ? p.acertos : "",
        p.status === "concluido" ? p.pontos : "",
        p.status === "concluido" ? U.segundos(p.tempoTotalMs) : "",
        p.premioNome || "",
        p.entregue ? "Sim" : "Não",
        p.entregueEm ? `${U.dataBR(p.entregueEm)} ${U.horaBR(p.entregueEm)}` : "",
        (p.perguntas || []).map((q) => `P${q.id}:${q.correta ? "certo" : q.resposta == null ? "tempo" : "errado"}`).join(" ")
      ].map(celula).join(";"));
    return "﻿" + [cab.map(celula).join(";")].concat(linhas).join("\r\n") + "\r\n";
  }

  window.Csv = { gerar };
})();
