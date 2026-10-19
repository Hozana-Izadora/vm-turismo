/* Funções utilitárias compartilhadas. */
(function () {
  function escapeHtml(v) {
    return String(v == null ? "" : v)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }

  function soDigitos(v) {
    return String(v || "").replace(/\D/g, "");
  }

  function formatarTelefone(v) {
    const d = soDigitos(v).slice(0, 11);
    if (d.length <= 2) return d.length ? `(${d}` : "";
    if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
    if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
    return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  }

  function telefoneValido(v) {
    const d = soDigitos(v);
    if (d.length !== 10 && d.length !== 11) return false;
    if (d[0] === "0" || d[1] === "0") return false; // DDD válido: 11 a 99
    if (d.length === 11 && d[2] !== "9") return false; // celular começa com 9
    return true;
  }

  function emailValido(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || "").trim());
  }

  function normalizarNome(v) {
    return String(v || "").replace(/\s+/g, " ").trim();
  }

  function primeiroNome(nome) {
    return normalizarNome(nome).split(" ")[0] || "";
  }

  function embaralhar(lista) {
    const a = lista.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function uuid() {
    if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
    return "p-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 10);
  }

  function pad(n, t) {
    return String(n).padStart(t || 2, "0");
  }

  function dataBR(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
  }

  function horaBR(iso) {
    if (!iso) return "";
    const d = new Date(iso);
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  }

  function segundos(ms) {
    return (Math.round((ms || 0) / 100) / 10).toLocaleString("pt-BR", { minimumFractionDigits: 1 });
  }

  function codigo(n) {
    return "#" + pad(n, 4);
  }

  // SHA-256 em JavaScript puro (funciona também via file://, sem crypto.subtle)
  function sha256(texto) {
    const rotr = (x, n) => (x >>> n) | (x << (32 - n));
    const primos = [];
    for (let n = 2; primos.length < 64; n++) {
      if (primos.every((p) => n % p !== 0)) primos.push(n);
    }
    const frac = (x) => ((x - Math.floor(x)) * 4294967296) >>> 0;
    const K = primos.map((p) => frac(Math.cbrt(p)));
    let H = primos.slice(0, 8).map((p) => frac(Math.sqrt(p)));

    const bytes = new TextEncoder().encode(texto);
    const total = (((bytes.length + 9 + 63) >> 6) << 6);
    const buf = new Uint8Array(total);
    buf.set(bytes);
    buf[bytes.length] = 0x80;
    const dv = new DataView(buf.buffer);
    const bits = bytes.length * 8;
    dv.setUint32(total - 8, Math.floor(bits / 4294967296));
    dv.setUint32(total - 4, bits >>> 0);

    const W = new Uint32Array(64);
    for (let i = 0; i < total; i += 64) {
      for (let t = 0; t < 16; t++) W[t] = dv.getUint32(i + t * 4);
      for (let t = 16; t < 64; t++) {
        const s0 = rotr(W[t - 15], 7) ^ rotr(W[t - 15], 18) ^ (W[t - 15] >>> 3);
        const s1 = rotr(W[t - 2], 17) ^ rotr(W[t - 2], 19) ^ (W[t - 2] >>> 10);
        W[t] = (W[t - 16] + s0 + W[t - 7] + s1) >>> 0;
      }
      let [a, b, c, d, e, f, g, h] = H;
      for (let t = 0; t < 64; t++) {
        const S1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
        const ch = (e & f) ^ (~e & g);
        const t1 = (h + S1 + ch + K[t] + W[t]) >>> 0;
        const S0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
        const mj = (a & b) ^ (a & c) ^ (b & c);
        const t2 = (S0 + mj) >>> 0;
        h = g; g = f; f = e; e = (d + t1) >>> 0;
        d = c; c = b; b = a; a = (t1 + t2) >>> 0;
      }
      H = [a, b, c, d, e, f, g, h].map((v, k) => (H[k] + v) >>> 0);
    }
    return H.map((x) => x.toString(16).padStart(8, "0")).join("");
  }

  window.Util = {
    escapeHtml, soDigitos, formatarTelefone, telefoneValido, emailValido,
    normalizarNome, primeiroNome, embaralhar, uuid, pad, dataBR, horaBR,
    segundos, codigo, sha256
  };
})();
