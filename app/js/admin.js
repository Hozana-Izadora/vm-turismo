/* Painel administrativo da equipe VM Turismo (acesso por senha). */
(function () {
  const U = window.Util;
  const { Modal, toast } = window.UI;
  const Store = window.Store;
  const P = window.Premios;
  const $ = (id) => document.getElementById(id);
  const esc = U.escapeHtml;

  const STATUS = { concluido: "Concluído", em_andamento: "Em andamento", incompleto: "Incompleto" };

  const estado = { aba: "resumo", busca: "", filtro: "todos" };

  function concluidos() {
    return Store.participantes.filter((p) => p.status === "concluido");
  }

  function pct(a, b) {
    return b ? Math.round((a / b) * 100) + "%" : "—";
  }

  // ---------------- Resumo ----------------
  function abaResumo() {
    const todos = Store.participantes;
    const conc = concluidos();
    const totalPerguntas = conc.reduce((s, p) => s + p.perguntas.length, 0);
    const totalAcertos = conc.reduce((s, p) => s + p.acertos, 0);
    const entregues = todos.filter((p) => p.entregue).length;
    const aguardando = todos.filter((p) => p.premioId && !p.entregue).length;
    const optIn = todos.filter((p) => p.aceitaComunicacoes).length;

    const cards = [
      [todos.length, "Participantes"],
      [conc.length, "Quizzes concluídos"],
      [pct(totalAcertos, totalPerguntas), "Média de acertos"],
      [entregues, "Brindes entregues"],
      [aguardando, "Aguardando entrega"],
      [optIn, "Aceitam comunicações"]
    ].map(([v, r]) => `<div class="stat"><strong>${v}</strong><span>${r}</span></div>`).join("");

    const premios = P.ordenadas(Store.config.premios).map((pr) => `
      <tr><td>${esc(pr.nome)}</td><td>${pr.estoque}</td><td>${P.atribuidos(pr, todos)}</td>
      <td>${P.entregues(pr, todos)}</td><td><strong>${P.disponiveis(pr, todos)}</strong></td></tr>`).join("");

    const porDia = {};
    todos.forEach((p) => {
      const d = U.dataBR(p.criadoEm);
      porDia[d] = porDia[d] || { total: 0, conc: 0 };
      porDia[d].total += 1;
      if (p.status === "concluido") porDia[d].conc += 1;
    });
    const dias = Object.entries(porDia).map(([d, v]) => `<tr><td>${d}</td><td>${v.total}</td><td>${v.conc}</td></tr>`).join("")
      || `<tr><td colspan="3" class="vazio">Nenhum participante ainda.</td></tr>`;

    const maxAcertos = window.Quiz.total;
    const dist = Array.from({ length: maxAcertos + 1 }, (_, n) => conc.filter((p) => p.acertos === n).length);
    const maiorDist = Math.max(1, ...dist);
    const barras = dist.map((qtd, n) => `
      <div class="barra-linha"><span>${n} acerto${n === 1 ? "" : "s"}</span>
      <div class="barra"><i style="width:${(qtd / maiorDist) * 100}%"></i></div><b>${qtd}</b></div>`).join("");

    const porPergunta = window.PERGUNTAS.map((q) => {
      const resp = conc.flatMap((p) => p.perguntas.filter((r) => r.id === q.id));
      return { q, n: resp.length, certos: resp.filter((r) => r.correta).length };
    }).filter((x) => x.n > 0).sort((a, b) => a.certos / a.n - b.certos / b.n);
    const perguntas = porPergunta.map((x) => `
      <tr><td>${x.q.id}</td><td class="texto-pergunta">${esc(x.q.texto)}</td><td>${window.Quiz.NOME_NIVEL[x.q.nivel]}</td>
      <td>${x.n}</td><td>${pct(x.certos, x.n)}</td></tr>`).join("")
      || `<tr><td colspan="5" class="vazio">Sem respostas ainda.</td></tr>`;

    return `
      <div class="stats">${cards}</div>
      <div class="grade-2">
        <div class="painel"><h3>Prêmios</h3>
          <table><thead><tr><th>Faixa</th><th>Estoque</th><th>Atribuídos</th><th>Entregues</th><th>Disponíveis</th></tr></thead>
          <tbody>${premios}</tbody></table></div>
        <div class="painel"><h3>Participantes por dia</h3>
          <table><thead><tr><th>Data</th><th>Cadastros</th><th>Concluídos</th></tr></thead><tbody>${dias}</tbody></table></div>
      </div>
      <div class="painel"><h3>Distribuição de acertos</h3>${barras}</div>
      <div class="painel"><h3>Taxa de acerto por pergunta (mais difíceis primeiro)</h3>
        <table><thead><tr><th>#</th><th>Pergunta</th><th>Nível</th><th>Respostas</th><th>Acerto</th></tr></thead>
        <tbody>${perguntas}</tbody></table></div>`;
  }

  // ---------------- Participantes ----------------
  function filtrarParticipantes() {
    const termo = estado.busca.trim().toLowerCase();
    const termoDig = U.soDigitos(termo);
    return Store.participantes.filter((p) => {
      if (estado.filtro === "aguardando" && !(p.premioId && !p.entregue)) return false;
      if (estado.filtro === "entregues" && !p.entregue) return false;
      if (estado.filtro === "incompletos" && p.status === "concluido") return false;
      if (!termo) return true;
      return p.nome.toLowerCase().includes(termo) || p.email.includes(termo)
        || (p.empresa || "").toLowerCase().includes(termo)
        || (termoDig && (p.telefone.includes(termoDig) || String(p.codigo) === termoDig.replace(/^0+/, "")));
    }).sort((a, b) => b.codigo - a.codigo);
  }

  function linhasParticipantes() {
    const lista = filtrarParticipantes();
    const LIMITE = 300;
    const linhas = lista.slice(0, LIMITE).map((p) => {
      const premio = p.premioNome ? esc(p.premioNome) : "—";
      const entrega = !p.premioId ? "" : p.entregue
        ? `<span class="tag tag-ok">Entregue ${U.horaBR(p.entregueEm).slice(0, 5)}</span>
           <button type="button" class="btn-mini" data-acao="desfazer" data-id="${p.id}">Desfazer</button>`
        : `<button type="button" class="btn-mini btn-mini-principal" data-acao="entregar" data-id="${p.id}">Marcar entregue</button>`;
      const liberar = p.semCadastro ? ""
        : p.liberadoNovaTentativa
        ? `<span class="tag">Nova tentativa liberada</span>`
        : `<button type="button" class="btn-mini" data-acao="liberar" data-id="${p.id}">Liberar nova tentativa</button>`;
      return `<tr>
        <td><strong>${U.codigo(p.codigo)}</strong></td>
        <td>${p.semCadastro ? `<span class="tag">Sem cadastro</span>`
          : `<strong>${esc(p.nome)}</strong><br><small>${esc(U.formatarTelefone(p.telefone))} · ${esc(p.email)}${p.empresa ? " · " + esc(p.empresa) : ""}</small>`}</td>
        <td>${U.dataBR(p.criadoEm)}<br><small>${U.horaBR(p.criadoEm)}</small></td>
        <td>${p.status === "concluido" ? `${p.acertos}/${p.perguntas.length}<br><small>${p.pontos} pts · ${U.segundos(p.tempoTotalMs)} s</small>` : `<span class="tag tag-alerta">${STATUS[p.status] || p.status}</span>`}</td>
        <td>${premio}</td>
        <td class="acoes-linha">${entrega}${liberar}</td>
      </tr>`;
    }).join("") || `<tr><td colspan="6" class="vazio">Nenhum participante encontrado.</td></tr>`;
    const extra = lista.length > LIMITE ? `<p class="nota">Mostrando ${LIMITE} de ${lista.length}. Use a busca para refinar.</p>` : "";
    return { linhas, extra, total: lista.length };
  }

  function abaParticipantes() {
    const filtros = [["todos", "Todos"], ["aguardando", "Aguardando entrega"], ["entregues", "Entregues"], ["incompletos", "Incompletos"]]
      .map(([v, t]) => `<button type="button" class="chip ${estado.filtro === v ? "ativo" : ""}" data-filtro="${v}">${t}</button>`).join("");
    const r = linhasParticipantes();
    return `
      <div class="barra-ferramentas">
        <input id="admin-busca" type="text" placeholder="Buscar por nome, telefone, e-mail ou código" value="${esc(estado.busca)}" data-teclado="texto" autocomplete="off">
        <div class="chips">${filtros}</div>
      </div>
      <div class="painel painel-tabela">
        <p class="nota" id="admin-total">${r.total} participante(s)</p>
        <table class="tabela-participantes"><thead><tr><th>Código</th><th>Participante</th><th>Data</th><th>Resultado</th><th>Prêmio</th><th>Ações</th></tr></thead>
        <tbody id="admin-linhas">${r.linhas}</tbody></table>
        <div id="admin-extra">${r.extra}</div>
      </div>`;
  }

  function atualizarTabela() {
    const r = linhasParticipantes();
    $("admin-linhas").innerHTML = r.linhas;
    $("admin-extra").innerHTML = r.extra;
    $("admin-total").textContent = `${r.total} participante(s)`;
  }

  // ---------------- Ranking ----------------
  function abaRanking() {
    const lista = concluidos().slice().sort((a, b) => b.pontos - a.pontos || a.tempoTotalMs - b.tempoTotalMs).slice(0, 50);
    const linhas = lista.map((p, i) => `<tr class="${i < 3 ? "podio podio-" + (i + 1) : ""}">
      <td><strong>${i + 1}º</strong></td><td><strong>${p.semCadastro ? "Sem cadastro" : esc(p.nome)}</strong>${p.empresa ? `<br><small>${esc(p.empresa)}</small>` : ""}</td>
      <td>${p.acertos}/${p.perguntas.length}</td><td>${p.pontos}</td><td>${U.segundos(p.tempoTotalMs)} s</td>
      <td>${U.codigo(p.codigo)}</td><td>${U.dataBR(p.criadoEm)} ${U.horaBR(p.criadoEm).slice(0, 5)}</td></tr>`).join("")
      || `<tr><td colspan="7" class="vazio">Nenhum quiz concluído ainda.</td></tr>`;
    return `<div class="painel"><h3>Ranking — pontuação e, no empate, menor tempo total</h3>
      <table><thead><tr><th>Posição</th><th>Participante</th><th>Acertos</th><th>Pontos</th><th>Tempo</th><th>Código</th><th>Data</th></tr></thead>
      <tbody>${linhas}</tbody></table></div>`;
  }

  // ---------------- Prêmios ----------------
  function abaPremios() {
    const todos = Store.participantes;
    const linhas = P.ordenadas(Store.config.premios).map((pr) => `
      <div class="premio-config">
        <label class="campo"><span>Nome do prêmio (a partir de ${pr.minAcertos} acerto${pr.minAcertos === 1 ? "" : "s"})</span>
          <input type="text" maxlength="60" data-premio="${pr.id}" data-campo="nome" value="${esc(pr.nome)}" data-teclado="texto"></label>
        <label class="campo campo-curto"><span>Quantidade total</span>
          <input type="text" maxlength="5" data-premio="${pr.id}" data-campo="estoque" value="${pr.estoque}" data-teclado="numero"></label>
        <div class="premio-numeros">
          <span>Atribuídos <b>${P.atribuidos(pr, todos)}</b></span>
          <span>Entregues <b>${P.entregues(pr, todos)}</b></span>
          <span>Disponíveis <b>${P.disponiveis(pr, todos)}</b></span>
        </div>
      </div>`).join("");
    return `<div class="painel"><h3>Prêmios e estoque</h3>
      <p class="nota">Quando uma faixa esgota, o participante recebe automaticamente o prêmio da faixa inferior que ainda tiver estoque.
      "Atribuídos" inclui brindes ganhos que ainda não foram retirados.</p>
      ${linhas}
      <div class="acoes"><button type="button" class="btn btn-principal" id="btn-salvar-premios">Salvar prêmios</button></div></div>`;
  }

  async function salvarPremios() {
    let ok = true;
    document.querySelectorAll("[data-premio]").forEach((inp) => {
      const pr = Store.config.premios.find((p) => p.id === inp.dataset.premio);
      if (inp.dataset.campo === "nome") {
        const v = U.normalizarNome(inp.value);
        if (v) pr.nome = v; else ok = false;
      } else {
        const n = parseInt(U.soDigitos(inp.value), 10);
        if (Number.isFinite(n) && n >= 0) pr.estoque = n; else ok = false;
      }
    });
    if (!ok) { toast("Verifique os nomes e quantidades.", "erro"); return; }
    await Store.salvarConfig();
    window.App.renderInicio();
    toast("Prêmios salvos.", "sucesso");
    render();
  }

  // ---------------- Dados e configurações ----------------
  function abaConfig() {
    const c = Store.config;
    const local = Store.modo === "disco"
      ? `<p>Os dados são gravados no disco deste computador, na pasta:</p><p class="caminho">${esc(Store.dir)}</p>
         <p class="nota"><b>participantes.json</b> (dados completos), <b>participantes.csv</b> (atualizado automaticamente, abre no Excel)
         e a pasta <b>backups</b> (cópia a cada 25 participantes).</p>`
      : `<p><b>Modo navegador:</b> os dados ficam no armazenamento deste navegador. Exporte o CSV com frequência como backup
         e nunca limpe os dados de navegação deste equipamento.</p>`;
    const toggle = (id, rotulo, ligado) => `
      <label class="check"><input type="checkbox" id="${id}" ${ligado ? "checked" : ""}><span class="check-caixa"></span>
      <span class="check-texto">${rotulo}</span></label>`;
    return `
      <div class="grade-2">
        <div class="painel"><h3>Dados dos participantes</h3>${local}
          <div class="acoes acoes-esquerda">
            <button type="button" class="btn btn-principal" id="btn-exportar">Exportar CSV (Excel)</button>
            <button type="button" class="btn btn-secundario" id="btn-backup">Fazer backup agora</button>
            ${Store.modo === "disco" ? `<button type="button" class="btn btn-secundario" id="btn-pasta">Abrir pasta</button>` : ""}
          </div>
        </div>
        <div class="painel"><h3>Opções do quiz</h3>
          ${toggle("cfg-formulario", "Formulário de dados antes do quiz (desative para ir direto às perguntas, sem coletar nome, WhatsApp e e-mail)", c.formularioDados)}
          ${toggle("cfg-som","Sons de acerto, erro e comemoração", c.som)}
          ${toggle("cfg-teclado", "Teclado virtual na tela (desative se o equipamento tiver teclado próprio)", c.tecladoVirtual)}
          <div class="linha-campos">
            <label class="campo campo-curto"><span>Segundos por pergunta</span>
              <input type="text" id="cfg-tempo" maxlength="2" value="${c.tempoPergunta}" data-teclado="numero"></label>
            <label class="campo campo-curto"><span>Inatividade no cadastro (s)</span>
              <input type="text" id="cfg-inatividade" maxlength="3" value="${c.inatividadeSeg}" data-teclado="numero"></label>
          </div>
          <div class="acoes acoes-esquerda"><button type="button" class="btn btn-principal" id="btn-salvar-opcoes">Salvar opções</button></div>
        </div>
      </div>
      <div class="grade-2">
        <div class="painel"><h3>Senha do painel</h3>
          <label class="campo"><span>Nova senha (mín. 6 caracteres)</span><input type="password" id="cfg-senha1" maxlength="40" data-teclado="senha" data-proximo="cfg-senha2"></label>
          <label class="campo"><span>Repita a nova senha</span><input type="password" id="cfg-senha2" maxlength="40" data-teclado="senha"></label>
          <div class="acoes acoes-esquerda"><button type="button" class="btn btn-secundario" id="btn-senha">Alterar senha</button></div>
        </div>
        <div class="painel"><h3>PIN da equipe</h3>
          <p class="nota">Usado na tela de resultado para confirmar a entrega do brinde. PIN atual: <b>${esc(c.pinEquipe)}</b></p>
          <label class="campo campo-curto"><span>Novo PIN (4 a 8 números)</span><input type="password" id="cfg-pin" maxlength="8" data-teclado="numero"></label>
          <div class="acoes acoes-esquerda"><button type="button" class="btn btn-secundario" id="btn-pin">Alterar PIN</button></div>
        </div>
      </div>
      ${Store.podeSair() ? `<div class="painel"><h3>Aplicativo</h3>
        <div class="acoes acoes-esquerda"><button type="button" class="btn btn-secundario" id="btn-sair">Fechar o aplicativo</button></div>
      </div>` : ""}
      <p class="versao" id="admin-versao">Desafio Ceará · versão 1.0</p>`;
  }

  async function exportar() {
    try {
      const r = await Store.exportarCsv();
      if (r && r.ok) toast("CSV exportado: " + r.caminho, "sucesso");
    } catch (e) {
      toast("Falha ao exportar: " + e.message, "erro");
    }
  }

  async function salvarOpcoes() {
    const tempo = parseInt($("cfg-tempo").value, 10);
    const ina = parseInt($("cfg-inatividade").value, 10);
    if (!(tempo >= 5 && tempo <= 60)) { toast("Tempo por pergunta: entre 5 e 60 segundos.", "erro"); return; }
    if (!(ina >= 20 && ina <= 600)) { toast("Inatividade: entre 20 e 600 segundos.", "erro"); return; }
    Object.assign(Store.config, {
      formularioDados: $("cfg-formulario").checked,
      som: $("cfg-som").checked,
      tecladoVirtual: $("cfg-teclado").checked,
      tempoPergunta: tempo,
      inatividadeSeg: ina
    });
    await Store.salvarConfig();
    toast("Opções salvas.", "sucesso");
  }

  async function alterarSenha() {
    const s1 = $("cfg-senha1").value, s2 = $("cfg-senha2").value;
    if (s1.length < 6) { toast("A senha precisa ter pelo menos 6 caracteres.", "erro"); return; }
    if (s1 !== s2) { toast("As senhas não conferem.", "erro"); return; }
    Store.config.senhaHash = U.sha256(s1);
    await Store.salvarConfig();
    $("cfg-senha1").value = ""; $("cfg-senha2").value = "";
    toast("Senha alterada.", "sucesso");
  }

  async function alterarPin() {
    const pin = U.soDigitos($("cfg-pin").value);
    if (pin.length < 4 || pin.length > 8) { toast("O PIN precisa ter de 4 a 8 números.", "erro"); return; }
    Store.config.pinEquipe = pin;
    await Store.salvarConfig();
    toast("PIN alterado.", "sucesso");
    render();
  }

  // Zerar fica escondido: só abre segurando 5 s o texto de versão no rodapé da aba de configurações,
  // e ainda exige a senha do painel e a palavra ZERAR.
  function pedirZerar() {
    const total = Store.participantes.length;
    const confirmar = async () => {
      const senhaOk = U.sha256($("zerar-senha").value) === Store.config.senhaHash;
      const palavraOk = $("zerar-palavra").value.trim().toUpperCase() === "ZERAR";
      if (!senhaOk || !palavraOk) {
        $("zerar-erro").textContent = !senhaOk ? "Senha incorreta." : "Digite ZERAR para confirmar.";
        return false;
      }
      await Store.zerar();
      toast("Participantes apagados. Backup criado.", "sucesso");
      render();
      return true;
    };
    Modal.abrir({
      titulo: "Zerar participantes",
      html: `<p>Isso apagará <strong>${total}</strong> participante(s) deste equipamento.
        Um backup é criado antes, mas exporte os dados primeiro.</p>
        <label class="campo"><span>Senha do painel</span>
          <input id="zerar-senha" type="password" maxlength="40" data-teclado="senha" data-proximo="zerar-palavra" autocomplete="off"></label>
        <label class="campo"><span>Digite ZERAR para confirmar</span>
          <input id="zerar-palavra" type="text" maxlength="10" data-teclado="senha" autocomplete="off"></label>
        <small class="erro" id="zerar-erro"></small>`,
      botoes: [
        { texto: "Cancelar", classe: "btn-secundario" },
        { texto: "Zerar agora", classe: "btn-perigo", acao: async () => ((await confirmar()) ? undefined : false) }
      ]
    });
  }

  // ---------------- Ações da tabela ----------------
  async function acaoLinha(acao, id) {
    const p = Store.participantes.find((x) => x.id === id);
    if (!p) return;
    if (acao === "entregar") {
      p.entregue = true;
      p.entregueEm = new Date().toISOString();
    } else if (acao === "desfazer") {
      if (!(await Modal.confirmar("Desfazer entrega?", `Marcar o brinde de ${esc(p.nome)} como não entregue?`, "Desfazer"))) return;
      p.entregue = false;
      p.entregueEm = null;
    } else if (acao === "liberar") {
      if (!(await Modal.confirmar("Liberar nova tentativa?", `${esc(p.nome)} poderá jogar novamente com o mesmo WhatsApp. A participação anterior continua registrada.`, "Liberar"))) return;
      p.liberadoNovaTentativa = true;
    }
    await Store.salvarParticipantes();
    atualizarTabela();
  }

  // ---------------- Renderização ----------------
  const ABAS = { resumo: abaResumo, participantes: abaParticipantes, ranking: abaRanking, premios: abaPremios, config: abaConfig };

  function render() {
    document.querySelectorAll("#admin-abas button").forEach((b) => b.classList.toggle("ativa", b.dataset.aba === estado.aba));
    $("admin-conteudo").innerHTML = ABAS[estado.aba]();
    $("admin-conteudo").scrollTop = 0;
    if (Store.ultimoAviso) toast(Store.ultimoAviso, "erro");
  }

  function ligarEventos() {
    $("admin-abas").addEventListener("click", (e) => {
      const b = e.target.closest("button[data-aba]");
      if (!b) return;
      estado.aba = b.dataset.aba;
      render();
    });
    $("btn-admin-voltar").addEventListener("click", () => window.App.voltarAoInicio());

    const c = $("admin-conteudo");
    c.addEventListener("click", (e) => {
      const alvo = e.target.closest("button");
      if (!alvo) return;
      if (alvo.dataset.acao) return acaoLinha(alvo.dataset.acao, alvo.dataset.id);
      if (alvo.dataset.filtro) { estado.filtro = alvo.dataset.filtro; render(); return; }
      const acoes = {
        "btn-salvar-premios": salvarPremios,
        "btn-exportar": exportar,
        "btn-backup": async () => { await Store.backup("manual"); toast("Backup criado.", "sucesso"); },
        "btn-pasta": () => Store.abrirPasta(),
        "btn-salvar-opcoes": salvarOpcoes,
        "btn-senha": alterarSenha,
        "btn-pin": alterarPin,
        "btn-sair": () => Store.sair()
      };
      if (acoes[alvo.id]) acoes[alvo.id]();
    });
    // segurar 5 s no texto de versão abre o "Zerar participantes"
    let timerZerar = null;
    c.addEventListener("pointerdown", (e) => {
      if (e.target.id !== "admin-versao") return;
      clearTimeout(timerZerar);
      timerZerar = setTimeout(pedirZerar, 5000);
    });
    ["pointerup", "pointercancel", "pointerout"].forEach((ev) =>
      c.addEventListener(ev, () => clearTimeout(timerZerar)));
    c.addEventListener("input", (e) => {
      if (e.target.id === "admin-busca") {
        estado.busca = e.target.value;
        atualizarTabela();
      }
    });
  }

  let eventosLigados = false;
  window.Admin = {
    abrir() {
      if (!eventosLigados) { ligarEventos(); eventosLigados = true; }
      estado.aba = "resumo";
      estado.busca = "";
      estado.filtro = "todos";
      window.App.irPara("admin");
      render();
    }
  };
})();
