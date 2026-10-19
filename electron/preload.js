// Ponte segura entre a interface (app/) e o armazenamento em disco do Electron.
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("vmStore", {
  carregar: () => ipcRenderer.invoke("store:carregar"),
  salvarParticipantes: (lista, csv) => ipcRenderer.invoke("store:salvarParticipantes", lista, csv),
  salvarConfig: (config) => ipcRenderer.invoke("store:salvarConfig", config),
  backup: (motivo) => ipcRenderer.invoke("store:backup", motivo),
  exportarCsv: (csv, nomeSugerido) => ipcRenderer.invoke("store:exportarCsv", csv, nomeSugerido),
  abrirPasta: () => ipcRenderer.invoke("store:abrirPasta"),
  sair: () => ipcRenderer.invoke("app:sair")
});
