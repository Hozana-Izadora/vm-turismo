// Desafio Ceará — processo principal do Electron (modo totem/kiosk, 100% offline).
const { app, BrowserWindow, ipcMain, dialog, shell, session, Menu } = require("electron");
const path = require("path");
const fs = require("fs");
const { criarStorage } = require("./storage");

const MODO_DEV = process.argv.includes("--dev");
let janela = null;
let podeFechar = false;
let storage = null;

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.on("second-instance", () => {
  if (janela) {
    if (janela.isMinimized()) janela.restore();
    janela.focus();
  }
});

function criarJanela() {
  janela = new BrowserWindow({
    width: 1080,
    height: 1920,
    fullscreen: !MODO_DEV,
    kiosk: !MODO_DEV,
    autoHideMenuBar: true,
    backgroundColor: "#06344a",
    title: "Desafio Ceará — VM Turismo",
    icon: path.join(__dirname, "..", "build", "icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
      spellcheck: false,
      devTools: MODO_DEV
    }
  });

  if (!MODO_DEV) Menu.setApplicationMenu(null);

  const wc = janela.webContents;
  wc.on("did-finish-load", () => wc.setVisualZoomLevelLimits(1, 1));
  wc.setWindowOpenHandler(() => ({ action: "deny" }));
  wc.on("will-navigate", (e) => e.preventDefault());

  // Bloqueia atalhos que tirariam o visitante do app (recarregar, zoom, fechar aba)
  wc.on("before-input-event", (e, input) => {
    if (MODO_DEV) return;
    const k = (input.key || "").toLowerCase();
    const ctrl = input.control || input.meta;
    if (ctrl && ["r", "w", "+", "-", "=", "0", "p", "s", "o", "n", "t"].includes(k)) e.preventDefault();
    if (["f5", "f11", "f12"].includes(k)) e.preventDefault();
    // Saída de emergência da equipe: Ctrl + Shift + Alt + Q
    if (ctrl && input.shift && input.alt && k === "q") {
      podeFechar = true;
      app.quit();
    }
  });

  janela.on("close", (e) => {
    if (!podeFechar && !MODO_DEV) e.preventDefault();
  });

  janela.loadFile(path.join(__dirname, "..", "app", "index.html"));
}

function registrarIpc() {
  ipcMain.handle("store:carregar", () => ({ ...storage.carregar(), dir: storage.dir }));
  ipcMain.handle("store:salvarParticipantes", (_e, lista, csv) => storage.salvarParticipantes(lista, csv));
  ipcMain.handle("store:salvarConfig", (_e, config) => storage.salvarConfig(config));
  ipcMain.handle("store:backup", (_e, motivo) => storage.backup(motivo));
  ipcMain.handle("store:abrirPasta", () => shell.openPath(storage.dir));

  ipcMain.handle("store:exportarCsv", async (_e, csv, nomeSugerido) => {
    // Permite escolher o destino (ex.: pendrive)
    const r = await dialog.showSaveDialog(janela, {
      title: "Exportar participantes",
      defaultPath: path.join(storage.dir, nomeSugerido),
      filters: [{ name: "Planilha CSV (Excel)", extensions: ["csv"] }]
    });
    if (r.canceled || !r.filePath) return { ok: false };
    fs.writeFileSync(r.filePath, csv, "utf8");
    return { ok: true, caminho: r.filePath };
  });

  ipcMain.handle("app:sair", () => {
    podeFechar = true;
    app.quit();
  });
}

app.whenReady().then(() => {
  // Pasta de dados: Documentos\Desafio Ceará BTM 2026 (ou a definida em DESAFIO_DADOS)
  const dir = process.env.DESAFIO_DADOS || path.join(app.getPath("documents"), "Desafio Ceará BTM 2026");
  storage = criarStorage(dir);

  // Garante funcionamento offline: nenhuma requisição de rede sai do app
  session.defaultSession.webRequest.onBeforeRequest(
    { urls: ["http://*/*", "https://*/*", "ws://*/*", "wss://*/*"] },
    (_d, cb) => cb({ cancel: true })
  );
  session.defaultSession.setPermissionRequestHandler((_wc, _perm, cb) => cb(false));

  registrarIpc();
  criarJanela();
});

app.on("window-all-closed", () => app.quit());
