// Compila o APK e copia para android-app/dist/.
//   node scripts/gerar-apk.js release  → dist/DesafioCeara.apk (para entregar)
//   node scripts/gerar-apk.js debug    → dist/DesafioCeara-teste.apk (permite inspecionar no emulador)
const { spawnSync } = require("child_process");
const fs = require("fs");
const os = require("os");
const path = require("path");

const tipo = process.argv[2] === "debug" ? "debug" : "release";
const raiz = path.join(__dirname, "..");
const pastaAndroid = path.join(raiz, "android");

function acharJdk() {
  if (process.env.JAVA_HOME && fs.existsSync(path.join(process.env.JAVA_HOME, "bin"))) return process.env.JAVA_HOME;
  const candidatos = [
    path.join(os.homedir(), ".jdks"),
    "C:\\Program Files\\Android\\Android Studio\\jbr",
    "C:\\Program Files\\Java",
    "C:\\Program Files\\Eclipse Adoptium"
  ];
  for (const c of candidatos) {
    if (!fs.existsSync(c)) continue;
    if (fs.existsSync(path.join(c, "bin", "java.exe"))) return c;
    const sub = fs.readdirSync(c).map((d) => path.join(c, d)).find((d) => fs.existsSync(path.join(d, "bin", "java.exe")));
    if (sub) return sub;
  }
  throw new Error("Java (JDK 17) não encontrado. Instale o Android Studio ou defina JAVA_HOME.");
}

function acharSdk() {
  const c = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT || path.join(os.homedir(), "AppData", "Local", "Android", "Sdk");
  if (!fs.existsSync(c)) throw new Error("Android SDK não encontrado. Instale o Android Studio ou defina ANDROID_HOME.");
  return c;
}

if (tipo === "release" && !fs.existsSync(path.join(raiz, "assinatura", "keystore.properties"))) {
  throw new Error("Falta android-app/assinatura (chave de assinatura). Sem ela o APK de entrega não pode ser gerado.");
}

const env = Object.assign({}, process.env, { JAVA_HOME: acharJdk(), ANDROID_HOME: acharSdk() });
delete env.ELECTRON_RUN_AS_NODE;
fs.writeFileSync(path.join(pastaAndroid, "local.properties"), `sdk.dir=${env.ANDROID_HOME.replace(/\\/g, "/")}\n`);

const tarefa = tipo === "release" ? "assembleRelease" : "assembleDebug";
const gradlew = path.join(pastaAndroid, process.platform === "win32" ? "gradlew.bat" : "gradlew");
const r = spawnSync(`"${gradlew}"`, [tarefa, "--console=plain"], { cwd: pastaAndroid, env, stdio: "inherit", shell: true });
if (r.status !== 0) process.exit(r.status || 1);

const apk = path.join(pastaAndroid, "app", "build", "outputs", "apk", tipo, `app-${tipo}.apk`);
const destino = path.join(raiz, "dist", tipo === "release" ? "DesafioCeara.apk" : "DesafioCeara-teste.apk");
fs.mkdirSync(path.dirname(destino), { recursive: true });
fs.copyFileSync(apk, destino);
console.log(`\nAPK gerado: ${destino} (${(fs.statSync(destino).size / 1048576).toFixed(1)} MB)`);
