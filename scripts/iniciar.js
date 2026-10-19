// Inicia o Electron ignorando ELECTRON_RUN_AS_NODE (definida pelo terminal do VS Code),
// que faria o Electron rodar como Node puro, sem abrir a janela.
const { spawn } = require("child_process");
const path = require("path");
const electron = require("electron");

const env = Object.assign({}, process.env);
delete env.ELECTRON_RUN_AS_NODE;

const proc = spawn(electron, [".", ...process.argv.slice(2)], {
  cwd: path.join(__dirname, ".."),
  env,
  stdio: "inherit"
});
proc.on("exit", (codigo) => process.exit(codigo == null ? 0 : codigo));
