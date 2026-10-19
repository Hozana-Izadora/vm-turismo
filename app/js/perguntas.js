/*
 * Banco de perguntas — Desafio Ceará (BTM 2026)
 *
 * Fontes: "Perguntas Quiz Praias Ceará.pdf" (perguntas 1 a 25) e
 *         "Desafio_Ceara_65_Perguntas_BTM_2026.pdf" (perguntas 26 a 90), só com a resposta correta.
 * As alternativas incorretas ("erradas") foram sugeridas e DEVEM SER REVISADAS
 * pela equipe da VM Turismo antes do evento.
 *
 * Os números (id) seguem os PDFs e não devem ser alterados: eles aparecem nos relatórios.
 * Perguntas repetidas foram retiradas e estão em PERGUNTAS_REMOVIDAS (no fim do arquivo).
 * Perguntas reescritas para não entregarem a resposta trazem o campo "original".
 *
 * Para editar: altere o texto entre aspas. Cada pergunta precisa de
 *   - nivel: "facil" | "intermediario" | "dificil"
 *   - correta: a resposta certa
 *   - erradas: exatamente 3 alternativas incorretas
 *   - grupo (opcional): perguntas com o mesmo grupo nunca caem na mesma rodada
 * As alternativas são embaralhadas automaticamente na tela.
 */
window.PERGUNTAS = [
  // ---------- Nível fácil ----------
  { id: 1, nivel: "facil",
    texto: "Em qual município fica a Praia de Lagoinha?",
    correta: "Paraipaba",
    erradas: ["Trairi", "Paracuru", "São Gonçalo do Amarante"] },

  { id: 2, nivel: "facil",
    texto: "Qual praia cearense é famosa pelos passeios de buggy nas dunas e pela prática de kitesurf?",
    correta: "Cumbuco",
    erradas: ["Praia do Futuro", "Praia de Iracema", "Ponta Grossa"] },

  { id: 3, nivel: "facil",
    texto: "Em qual município fica a Praia de Canoa Quebrada?",
    correta: "Aracati",
    erradas: ["Beberibe", "Icapuí", "Fortim"] },

  { id: 4, nivel: "facil",
    texto: "Qual praia de Fortaleza é conhecida por suas grandes barracas de praia?",
    correta: "Praia do Futuro",
    erradas: ["Praia de Iracema", "Praia do Meireles", "Praia do Mucuripe"] },

  { id: 5, nivel: "facil",
    texto: "Qual destino do Ceará é famoso pela Duna do Pôr do Sol?",
    correta: "Jericoacoara",
    erradas: ["Flecheiras", "Praia do Futuro", "Águas Belas"] },

  { id: 6, nivel: "facil",
    texto: "Em qual município fica a Praia de Morro Branco?",
    correta: "Beberibe",
    erradas: ["Cascavel", "Aracati", "Aquiraz"] },

  { id: 7, nivel: "facil",
    texto: "Qual praia cearense é conhecida pelo símbolo da lua e estrela nas falésias?",
    correta: "Canoa Quebrada",
    erradas: ["Morro Branco", "Ponta Grossa", "Praia das Fontes"] },

  { id: 8, nivel: "facil",
    texto: "Em qual município fica a Praia de Flecheiras?",
    correta: "Trairi",
    erradas: ["Paraipaba", "Itapipoca", "Paracuru"] },

  { id: 26, nivel: "facil",
    texto: "Em qual município fica a Praia de Cumbuco?",
    correta: "Caucaia",
    erradas: ["Aquiraz", "São Gonçalo do Amarante", "Paracuru"] },

  { id: 27, nivel: "facil",
    texto: "Qual praia do Ceará é famosa por uma rua conhecida como Broadway, repleta de bares e restaurantes?",
    correta: "Canoa Quebrada",
    erradas: ["Cumbuco", "Morro Branco", "Praia do Futuro"] },

  { id: 28, nivel: "facil",
    texto: "Qual praia do litoral oeste cearense é conhecida pela Lagoa do Banana?",
    correta: "Cumbuco",
    erradas: ["Lagoinha", "Flecheiras", "Icaraizinho de Amontada"] },

  { id: 29, nivel: "facil",
    texto: "Qual destino do litoral cearense é conhecido pela famosa Lagoa do Paraíso?",
    correta: "Jericoacoara",
    erradas: ["Cumbuco", "Canoa Quebrada", "Lagoinha"] },

  { id: 30, nivel: "facil",
    texto: "Qual praia do litoral leste é conhecida pelas falésias coloridas e pelo artesanato com areias de diferentes cores?",
    correta: "Morro Branco",
    erradas: ["Uruaú", "Águas Belas", "Prainha"] },

  { id: 32, nivel: "facil",
    texto: "Qual praia de Fortaleza é conhecida pela tradicional feirinha de artesanato na Avenida Beira-Mar?",
    correta: "Meireles",
    erradas: ["Praia do Futuro", "Sabiaguaba", "Barra do Ceará"] },

  { id: 35, nivel: "facil",
    texto: "Qual praia do litoral leste cearense é conhecida pela presença de fontes naturais de água doce que brotam das falésias?",
    correta: "Praia das Fontes",
    erradas: ["Canoa Quebrada", "Uruaú", "Ponta Grossa"] },

  { id: 42, nivel: "facil",
    texto: "Qual destino do litoral cearense é conhecido por suas falésias avermelhadas e pela pesca da lagosta?",
    correta: "Icapuí",
    erradas: ["Cumbuco", "Lagoinha", "Uruaú"] },

  // ---------- Nível intermediário ----------
  { id: 9, nivel: "intermediario",
    texto: "Qual praia do Ceará é famosa pelo labirinto de falésias de areias coloridas?",
    correta: "Morro Branco",
    erradas: ["Cumbuco", "Flecheiras", "Icaraizinho de Amontada"] },

  { id: 10, nivel: "intermediario",
    texto: "Em qual município fica a Praia de Águas Belas?",
    correta: "Cascavel",
    erradas: ["Beberibe", "Aquiraz", "Aracati"] },

  { id: 11, nivel: "intermediario",
    texto: "Qual praia do litoral cearense é conhecida pelo encontro do Rio Mal Cozinhado com o mar?",
    correta: "Águas Belas",
    erradas: ["Prainha", "Porto das Dunas", "Morro Branco"] },

  { id: 12, nivel: "intermediario",
    texto: "Em qual município fica a Praia de Ponta Grossa?",
    correta: "Icapuí",
    erradas: ["Aracati", "Fortim", "Beberibe"] },

  { id: 13, nivel: "intermediario",
    texto: "Qual praia de Trairi é conhecida pelas piscinas naturais formadas durante a maré baixa?",
    correta: "Flecheiras",
    erradas: ["Guajiru", "Emboaca", "Mundaú"] },

  { id: 14, nivel: "intermediario",
    texto: "Qual destino do litoral oeste cearense é conhecido pelo passeio de catamarã, que permite contemplar o encontro do rio com o mar?",
    correta: "Mundaú",
    erradas: ["Lagoinha", "Cumbuco", "Guajiru"] },

  { id: 15, nivel: "intermediario",
    texto: "Qual destino do litoral leste cearense é famoso por sua lagoa de águas tranquilas, ideal para passeios e momentos de lazer?",
    correta: "Uruaú",
    erradas: ["Prainha", "Iguape", "Canoa Quebrada"] },

  { id: 16, nivel: "intermediario",
    texto: "Em qual município fica a Praia das Fontes, famosa por suas fontes de água doce nas falésias?",
    correta: "Beberibe",
    erradas: ["Aracati", "Cascavel", "Icapuí"] },

  { id: 17, nivel: "intermediario",
    texto: "Qual praia cearense é conhecida pela Pedra Furada, uma formação rochosa natural?",
    correta: "Jericoacoara",
    erradas: ["Canoa Quebrada", "Morro Branco", "Lagoinha"] },

  { id: 46, nivel: "intermediario",
    texto: "Qual lagoa de Cumbuco é conhecida pela prática de esquibunda?",
    correta: "Lagoa do Parnamirim",
    erradas: ["Lagoa do Paraíso", "Lagoa do Uruaú", "Lagoa Azul"] },

  { id: 47, nivel: "intermediario", grupo: "cauipe",
    texto: "Qual rio deságua no mar na região de Cumbuco, formando uma barra e uma lagoa muito procuradas para a prática de kitesurf?",
    original: "Qual rio forma o encontro das águas com o mar na Barra do Cauípe, em Cumbuco?",
    correta: "Rio Cauípe",
    erradas: ["Rio Jaguaribe", "Rio Cocó", "Rio Mundaú"] },

  { id: 49, nivel: "intermediario",
    texto: "Em qual município fica a Praia de Mundaú?",
    correta: "Trairi",
    erradas: ["Paraipaba", "Amontada", "Paracuru"] },

  { id: 51, nivel: "intermediario",
    texto: "Qual rio deságua no mar na divisa entre os municípios de Trairi e Itapipoca?",
    original: "Qual rio deságua no mar na região da Praia de Mundaú?",
    correta: "Rio Mundaú",
    erradas: ["Rio Curu", "Rio Cauípe", "Rio Jaguaribe"] },

  { id: 58, nivel: "intermediario",
    texto: "Qual praia do litoral leste cearense é conhecida por suas falésias avermelhadas e pela presença de jangadas de pescadores?",
    correta: "Canoa Quebrada",
    erradas: ["Uruaú", "Águas Belas", "Prainha"] },

  { id: 60, nivel: "intermediario",
    texto: "Qual praia do litoral oeste cearense possui um mirante natural com vista para uma enseada cercada por coqueirais?",
    correta: "Lagoinha",
    erradas: ["Flecheiras", "Mundaú", "Guajiru"] },

  { id: 62, nivel: "intermediario",
    texto: "Qual praia do litoral leste cearense é conhecida por suas falésias e pela possibilidade de realizar passeios de buggy pela região?",
    correta: "Morro Branco",
    erradas: ["Prainha", "Iguape", "Caponga"] },

  { id: 68, nivel: "intermediario",
    texto: "Qual destino do litoral oeste cearense possui a famosa Lagoa Azul?",
    correta: "Jericoacoara",
    erradas: ["Cumbuco", "Lagoinha", "Canoa Quebrada"] },

  { id: 70, nivel: "intermediario",
    texto: "Qual praia do litoral oeste cearense é conhecida por sua paisagem de coqueirais e pela prática de esportes aquáticos, no município de Trairi?",
    correta: "Flecheiras",
    erradas: ["Lagoinha", "Cumbuco", "Icaraizinho de Amontada"] },

  // ---------- Nível difícil ----------
  { id: 18, nivel: "dificil",
    texto: "Em qual município do litoral oeste fica a Praia de Icaraizinho, famosa pela prática de kitesurf?",
    original: "Em qual município fica a Praia de Icaraizinho de Amontada?",
    correta: "Amontada",
    erradas: ["Itapipoca", "Trairi", "Itarema"] },

  { id: 19, nivel: "dificil",
    texto: "Qual município cearense abriga a Praia da Redonda, conhecida por suas falésias e comunidade pesqueira?",
    correta: "Icapuí",
    erradas: ["Aracati", "Beberibe", "Fortim"] },

  { id: 20, nivel: "dificil",
    texto: "Qual destino do litoral oeste cearense é conhecido por suas águas tranquilas, coqueirais e pela prática de esportes como kitesurf?",
    correta: "Icaraizinho de Amontada",
    erradas: ["Ponta Grossa", "Morro Branco", "Praia das Fontes"] },

  { id: 21, nivel: "dificil",
    texto: "Qual atração turística de Fortaleza reúne construções históricas, artesanato e gastronomia regional em um antigo complexo prisional?",
    correta: "Centro de Turismo do Ceará (Emcetur)",
    erradas: ["Mercado Central", "Theatro José de Alencar", "Centro Dragão do Mar de Arte e Cultura"] },

  { id: 22, nivel: "dificil",
    texto: "Qual rio do litoral leste cearense é conhecido por seu encontro com o mar na região de Fortim?",
    correta: "Rio Jaguaribe",
    erradas: ["Rio Ceará", "Rio Cocó", "Rio Acaraú"] },

  { id: 23, nivel: "dificil",
    texto: "Em qual destino do litoral leste do Ceará os visitantes podem viver a experiência de um passeio de barco com mergulho para observar peixes em seu ambiente natural?",
    correta: "Icapuí",
    erradas: ["Beberibe", "Aracati", "Cascavel"] },

  { id: 24, nivel: "dificil",
    texto: "Qual cidade serrana do Ceará é conhecida pelo clima ameno, produção de flores e atrativos naturais, sendo um dos destinos turísticos da Serra de Baturité?",
    correta: "Guaramiranga",
    erradas: ["Ubajara", "Viçosa do Ceará", "Tianguá"] },

  { id: 25, nivel: "dificil",
    texto: "Qual praia de Fortaleza é famosa pela Ponte dos Ingleses, também conhecida como Ponte Metálica, e por sua importância histórica e cultural?",
    correta: "Praia de Iracema",
    erradas: ["Praia do Futuro", "Praia do Meireles", "Praia do Mucuripe"] },

  { id: 77, nivel: "dificil",
    texto: "Qual destino do litoral oeste cearense fica dentro de um Parque Nacional, criado em 2002 para proteger suas dunas, lagoas e manguezais?",
    original: "Qual destino do litoral cearense possui uma área protegida pelo Parque Nacional de Jericoacoara?",
    correta: "Jericoacoara",
    erradas: ["Cumbuco", "Lagoinha", "Flecheiras"] },

  { id: 81, nivel: "dificil",
    texto: "Qual praia do litoral leste cearense é conhecida pela pesca artesanal da lagosta e por suas falésias, no município de Icapuí?",
    correta: "Praia de Ponta Grossa",
    erradas: ["Praia de Morro Branco", "Praia de Uruaú", "Praia de Majorlândia"] },

  { id: 82, nivel: "dificil",
    texto: "Qual praia do litoral leste cearense é conhecida por sua comunidade pesqueira e pelas falésias avermelhadas, no município de Icapuí?",
    correta: "Praia da Redonda",
    erradas: ["Praia de Morro Branco", "Praia de Canoa Quebrada", "Praia de Uruaú"] },

  { id: 85, nivel: "dificil",
    texto: "Qual praia do litoral oeste cearense é conhecida por suas dunas, lagoas e pela presença de redes dentro da água em um de seus principais atrativos?",
    correta: "Jericoacoara",
    erradas: ["Flecheiras", "Lagoinha", "Mundaú"] },

  { id: 87, nivel: "dificil", grupo: "cauipe",
    texto: "Qual praia vizinha a Cumbuco é conhecida pelo encontro de um rio com o mar e pela prática de kitesurf e outros esportes náuticos?",
    original: "Qual praia do litoral oeste cearense é conhecida pela prática de esportes náuticos e pelo encontro do Rio Cauípe com o mar?",
    correta: "Barra do Cauípe",
    erradas: ["Flecheiras", "Lagoinha", "Icaraizinho de Amontada"] }
];

/* Quantas perguntas de cada nível entram em cada rodada (total = 5). */
window.DISTRIBUICAO_NIVEIS = { facil: 2, intermediario: 2, dificil: 1 };

/*
 * Perguntas retiradas por repetirem outra (mesma resposta e mesma pista principal).
 * NÃO são usadas no quiz. Para devolver uma pergunta, mova o bloco para PERGUNTAS acima
 * (o campo "motivo" pode ficar ou ser apagado).
 */
window.PERGUNTAS_REMOVIDAS = [
  { id: 31, nivel: "facil", motivo: "repete a 60 (mirante de Lagoinha)",
    texto: "Qual praia do litoral oeste é conhecida por suas dunas e pelo mirante com vista panorâmica para o mar?",
    correta: "Lagoinha", erradas: ["Flecheiras", "Guajiru", "Mundaú"] },
  { id: 33, nivel: "facil", motivo: "repete a 29 e a 85 (Lagoa do Paraíso / redes na água)",
    texto: "Qual destino do litoral cearense é conhecido pelas redes instaladas dentro das águas da Lagoa do Paraíso?",
    correta: "Jericoacoara", erradas: ["Canoa Quebrada", "Morro Branco", "Icapuí"] },
  { id: 34, nivel: "facil", motivo: "repete a 2 (buggy nas dunas de Cumbuco)",
    texto: "Qual praia do litoral oeste é conhecida pelos passeios de buggy com paradas em lagoas e dunas?",
    correta: "Cumbuco", erradas: ["Flecheiras", "Guajiru", "Praia do Futuro"] },
  { id: 36, nivel: "facil", motivo: "repete a 13 (piscinas naturais de Flecheiras)",
    texto: "Qual praia do litoral oeste cearense é conhecida por suas piscinas naturais durante a maré baixa?",
    correta: "Flecheiras", erradas: ["Cumbuco", "Lagoinha", "Icaraizinho de Amontada"] },
  { id: 37, nivel: "facil", motivo: "repete a 17 (Pedra Furada)",
    texto: "Qual praia do Ceará é conhecida pela formação rochosa chamada Pedra Furada?",
    correta: "Jericoacoara", erradas: ["Canoa Quebrada", "Morro Branco", "Lagoinha"] },
  { id: 38, nivel: "facil", motivo: "repete a 11 (Rio Mal Cozinhado)",
    texto: "Qual destino do litoral leste cearense é conhecido pelo encontro do Rio Mal Cozinhado com o mar?",
    correta: "Águas Belas", erradas: ["Prainha", "Uruaú", "Morro Branco"] },
  { id: 39, nivel: "facil", motivo: "repete a 14 (catamarã em Mundaú)",
    texto: "Qual praia do litoral oeste cearense é conhecida pelos passeios de catamarã no encontro do rio com o mar?",
    correta: "Mundaú", erradas: ["Cumbuco", "Lagoinha", "Flecheiras"] },
  { id: 40, nivel: "facil", motivo: "repete a 15 (Lagoa do Uruaú) e entrega a resposta no enunciado",
    texto: "Qual praia do litoral leste é conhecida pela Lagoa do Uruaú?",
    correta: "Uruaú", erradas: ["Morro Branco", "Águas Belas", "Prainha"] },
  { id: 41, nivel: "facil", motivo: "repete a 7 (lua e estrela nas falésias)",
    texto: "Qual praia do Ceará é conhecida pelo símbolo da lua e estrela esculpido nas falésias?",
    correta: "Canoa Quebrada", erradas: ["Morro Branco", "Ponta Grossa", "Praia das Fontes"] },
  { id: 43, nivel: "facil", motivo: "repete a 4 (barracas da Praia do Futuro)",
    texto: "Qual praia de Fortaleza é conhecida por suas barracas com piscinas, restaurantes e estrutura de lazer?",
    correta: "Praia do Futuro", erradas: ["Praia de Iracema", "Meireles", "Mucuripe"] },
  { id: 44, nivel: "facil", motivo: "repete a 5 (Duna do Pôr do Sol)",
    texto: "Qual destino do litoral oeste é conhecido pelas dunas, lagoas e pela famosa Duna do Pôr do Sol?",
    correta: "Jericoacoara", erradas: ["Cumbuco", "Lagoinha", "Flecheiras"] },
  { id: 45, nivel: "facil", motivo: "repete a 20 (kitesurf e coqueirais em Icaraizinho)",
    texto: "Qual praia do litoral oeste cearense é conhecida pelos coqueirais e pela prática de kitesurf, no município de Amontada?",
    correta: "Icaraizinho de Amontada", erradas: ["Flecheiras", "Lagoinha", "Mundaú"] },
  { id: 48, nivel: "intermediario", motivo: "repete a 28 (Lagoa do Banana)",
    texto: "Qual praia do litoral oeste cearense é conhecida pela Lagoa do Banana e pelas atividades de lazer em suas águas?",
    correta: "Cumbuco", erradas: ["Lagoinha", "Flecheiras", "Mundaú"] },
  { id: 50, nivel: "intermediario", motivo: "repete a 13 (piscinas naturais de Flecheiras)",
    texto: "Qual praia do litoral oeste cearense é conhecida por seus coqueirais, piscinas naturais e restaurantes à beira-mar?",
    correta: "Flecheiras", erradas: ["Cumbuco", "Lagoinha", "Icaraizinho de Amontada"] },
  { id: 52, nivel: "intermediario", motivo: "repete a 30 (artesanato com areias coloridas)",
    texto: "Qual praia do litoral leste cearense é famosa pelo artesanato produzido com areias coloridas?",
    correta: "Morro Branco", erradas: ["Uruaú", "Águas Belas", "Prainha"] },
  { id: 53, nivel: "intermediario", motivo: "repete a 9 (labirinto das falésias)",
    texto: "Qual praia do litoral leste cearense possui um labirinto natural formado pela erosão das falésias?",
    correta: "Morro Branco", erradas: ["Uruaú", "Águas Belas", "Ponta Grossa"] },
  { id: 54, nivel: "intermediario", motivo: "repete a 35 (fontes de água doce)",
    texto: "Qual praia de Beberibe é conhecida pelas fontes de água doce que brotam das falésias próximas ao mar?",
    correta: "Praia das Fontes", erradas: ["Uruaú", "Parajuru", "Canoa Quebrada"] },
  { id: 55, nivel: "intermediario", motivo: "repete a 15 (Lagoa do Uruaú)",
    texto: "Qual praia do litoral leste cearense possui uma lagoa de mesmo nome, muito procurada para lazer e esportes aquáticos?",
    correta: "Uruaú", erradas: ["Morro Branco", "Águas Belas", "Praia das Fontes"] },
  { id: 56, nivel: "intermediario", motivo: "repete a 23 (passeio de barco com mergulho)",
    texto: "Qual praia do litoral leste é conhecida pela experiência de passeio de barco com mergulho para observação de peixes?",
    correta: "Icapuí", erradas: ["Beberibe", "Aracati", "Cascavel"] },
  { id: 57, nivel: "intermediario", motivo: "repete a 22 (rio de Fortim)",
    texto: "Qual rio deságua no mar na região de Fortim?",
    correta: "Rio Jaguaribe", erradas: ["Rio Ceará", "Rio Cocó", "Rio Acaraú"] },
  { id: 59, nivel: "intermediario", motivo: "repete a 20 (kitesurf em Icaraizinho)",
    texto: "Qual praia do litoral oeste cearense é conhecida pela prática de kitesurf e pelos ventos constantes na região de Amontada?",
    correta: "Icaraizinho de Amontada", erradas: ["Flecheiras", "Lagoinha", "Mundaú"] },
  { id: 61, nivel: "intermediario", motivo: "repete a 25 (Ponte dos Ingleses)",
    texto: "Qual praia de Fortaleza fica próxima à Ponte dos Ingleses e é conhecida por sua importância histórica e cultural?",
    correta: "Praia de Iracema", erradas: ["Praia do Futuro", "Meireles", "Mucuripe"] },
  { id: 63, nivel: "intermediario", motivo: "repete a 14 (encontro do rio com o mar em Mundaú) e entrega a resposta no enunciado",
    texto: "Qual praia do litoral oeste cearense é conhecida pelo encontro do Rio Mundaú com o Oceano Atlântico?",
    correta: "Mundaú", erradas: ["Flecheiras", "Lagoinha", "Cumbuco"] },
  { id: 64, nivel: "intermediario", motivo: "repete a 13 (piscinas naturais de Flecheiras)",
    texto: "Qual praia do litoral oeste cearense é conhecida por suas piscinas naturais que aparecem durante a maré baixa?",
    correta: "Flecheiras", erradas: ["Cumbuco", "Lagoinha", "Icaraizinho de Amontada"] },
  { id: 65, nivel: "intermediario", motivo: "repete a 11 (encontro do rio com o mar em Águas Belas)",
    texto: "Qual praia do litoral leste cearense é conhecida pelo encontro do rio com o mar, no município de Cascavel?",
    correta: "Águas Belas", erradas: ["Uruaú", "Morro Branco", "Prainha"] },
  { id: 66, nivel: "intermediario", motivo: "repete a 42 (falésias e pesca em Icapuí)",
    texto: "Qual destino do litoral leste cearense é conhecido pelas falésias, pela pesca artesanal e por praias como Ponta Grossa e Redonda?",
    correta: "Icapuí", erradas: ["Aracati", "Beberibe", "Fortim"] },
  { id: 67, nivel: "intermediario", motivo: "repete a 2 (buggy nas dunas de Cumbuco)",
    texto: "Qual praia do litoral oeste cearense é conhecida pela combinação de dunas, lagoas e passeios de buggy, próxima a Fortaleza?",
    correta: "Cumbuco", erradas: ["Jericoacoara", "Flecheiras", "Mundaú"] },
  { id: 69, nivel: "intermediario", motivo: "repete a 35 (fontes de água doce)",
    texto: "Qual praia do litoral leste cearense é conhecida pela presença de fontes naturais de água doce próximas às falésias?",
    correta: "Praia das Fontes", erradas: ["Canoa Quebrada", "Uruaú", "Águas Belas"] },
  { id: 71, nivel: "dificil", motivo: "repete a 9 e a 30 (falésias coloridas de Morro Branco)",
    texto: "Qual praia do litoral leste cearense é conhecida pela formação de falésias com diferentes tonalidades de areia, resultado de processos naturais de erosão?",
    correta: "Morro Branco", erradas: ["Uruaú", "Águas Belas", "Prainha"] },
  { id: 72, nivel: "dificil", motivo: "igual à 47 (rio da Barra do Cauípe)",
    texto: "Qual é o nome do rio que deságua na região da Barra do Cauípe, em Cumbuco?",
    correta: "Rio Cauípe", erradas: ["Rio Ceará", "Rio Cocó", "Rio Curu"] },
  { id: 73, nivel: "dificil", motivo: "repete a 14 (encontro do rio com o mar em Mundaú) e entrega a resposta no enunciado",
    texto: "Qual praia do litoral oeste cearense é conhecida pelo encontro do Rio Mundaú com o mar e pela presença de manguezais?",
    correta: "Mundaú", erradas: ["Flecheiras", "Lagoinha", "Guajiru"] },
  { id: 74, nivel: "dificil", motivo: "repete a 58 (falésias avermelhadas de Canoa Quebrada)",
    texto: "Qual praia do litoral leste cearense possui falésias avermelhadas e é um dos principais destinos turísticos do município de Aracati?",
    correta: "Canoa Quebrada", erradas: ["Morro Branco", "Ponta Grossa", "Praia das Fontes"] },
  { id: 75, nivel: "dificil", motivo: "repete a 13 (piscinas naturais de Flecheiras)",
    texto: "Qual praia do litoral oeste cearense é conhecida por suas piscinas naturais formadas entre os recifes durante a maré baixa?",
    correta: "Flecheiras", erradas: ["Cumbuco", "Lagoinha", "Mundaú"] },
  { id: 76, nivel: "dificil", motivo: "repete a 35 (fontes de água doce)",
    texto: "Qual praia do litoral leste cearense é conhecida pela presença de fontes de água doce que brotam diretamente das falésias?",
    correta: "Praia das Fontes", erradas: ["Canoa Quebrada", "Uruaú", "Ponta Grossa"] },
  { id: 78, nivel: "dificil", motivo: "repete a 2 (dunas e lagoas de Cumbuco)",
    texto: "Qual praia do litoral oeste cearense é conhecida pelo encontro de dunas móveis com lagoas e pela prática de esportes aquáticos?",
    correta: "Cumbuco", erradas: ["Flecheiras", "Mundaú", "Lagoinha"] },
  { id: 79, nivel: "dificil", motivo: "repete a 15 (Lagoa do Uruaú) e entrega a resposta no enunciado",
    texto: "Qual praia do litoral leste cearense é conhecida por suas paisagens naturais e pela proximidade com a Lagoa do Uruaú?",
    correta: "Uruaú", erradas: ["Águas Belas", "Canoa Quebrada", "Prainha"] },
  { id: 80, nivel: "dificil", motivo: "repete a 60 (mirante de Lagoinha)",
    texto: "Qual praia do litoral oeste cearense é conhecida pela paisagem de coqueirais e pelo mirante natural localizado no município de Paraipaba?",
    correta: "Lagoinha", erradas: ["Flecheiras", "Mundaú", "Cumbuco"] },
  { id: 83, nivel: "dificil", motivo: "repete a 20 (kitesurf em Icaraizinho)",
    texto: "Qual praia do litoral oeste cearense é conhecida pelos ventos favoráveis ao kitesurf e pela tranquilidade de sua vila de pescadores, no município de Amontada?",
    correta: "Icaraizinho de Amontada", erradas: ["Flecheiras", "Guajiru", "Lagoinha"] },
  { id: 84, nivel: "dificil", motivo: "repete a 11 (Rio Mal Cozinhado)",
    texto: "Qual praia do litoral leste cearense é conhecida pelo encontro do Rio Mal Cozinhado com o mar, formando piscinas naturais durante a maré baixa?",
    correta: "Águas Belas", erradas: ["Uruaú", "Prainha", "Morro Branco"] },
  { id: 86, nivel: "dificil", motivo: "repete a 30 (artesanato com areia)",
    texto: "Qual praia do litoral leste cearense é conhecida pelas falésias coloridas e pelo artesanato de garrafinhas com desenhos feitos de areia?",
    correta: "Morro Branco", erradas: ["Uruaú", "Águas Belas", "Prainha"] },
  { id: 88, nivel: "dificil", motivo: "repete a 27 (rua Broadway)",
    texto: "Qual praia do litoral leste cearense é conhecida pelas falésias e pela famosa rua Broadway, que concentra bares e restaurantes?",
    correta: "Canoa Quebrada", erradas: ["Morro Branco", "Ponta Grossa", "Praia das Fontes"] },
  { id: 89, nivel: "dificil", motivo: "repete a 14 (catamarã em Mundaú)",
    texto: "Qual praia do litoral oeste cearense é conhecida pelo passeio de catamarã que percorre o rio e permite contemplar os manguezais?",
    correta: "Mundaú", erradas: ["Cumbuco", "Flecheiras", "Lagoinha"] },
  { id: 90, nivel: "dificil", motivo: "repete a 23 (passeio de barco com mergulho)",
    texto: "Qual praia do litoral leste cearense é conhecida pela experiência de mergulho com observação de peixes durante passeios de barco?",
    correta: "Icapuí", erradas: ["Beberibe", "Aracati", "Cascavel"] }
];
