// Monta android-app/www a partir de ../app (o mesmo app do Windows) + os ajustes do Android (src/).
// ../app não é alterado.
const fs = require("fs");
const path = require("path");

const raiz = path.join(__dirname, "..");
const origem = path.join(raiz, "..", "app");
const destino = path.join(raiz, "www");

fs.rmSync(destino, { recursive: true, force: true });
fs.cpSync(origem, destino, { recursive: true });
fs.cpSync(path.join(raiz, "src"), path.join(destino, "android"), { recursive: true });

const arqHtml = path.join(destino, "index.html");
let html = fs.readFileSync(arqHtml, "utf8");

function inserirAntes(marcador, trecho) {
  if (!html.includes(marcador)) throw new Error(`Não encontrei "${marcador}" em app/index.html`);
  html = html.replace(marcador, trecho + marcador);
}

// o armazenamento Android precisa existir antes de js/store.js
inserirAntes('  <script src="js/textos.js"></script>', '  <script src="android/android.js"></script>\n');
inserirAntes("</head>", '  <link rel="stylesheet" href="android/android.css">\n');

fs.writeFileSync(arqHtml, html);
console.log("www pronto:", destino);
