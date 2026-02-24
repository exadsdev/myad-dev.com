/* Edge-safe simple HMAC token signer & verifier (no external deps) */
export const TOKEN_COOKIE = "admin_session";

/* ===== Base64URL helpers (Edge/Node safe) ===== */
function uint8ToBase64url(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  const b64 = typeof btoa === "function" ? btoa(bin) : Buffer.from(bytes).toString("base64");
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function textToUint8(text) {
  return new TextEncoder().encode(text);
}

function base64urlEncode(text) {
  return uint8ToBase64url(textToUint8(text));
}

function base64urlToUint8(b64url) {
  const b64 = b64url.replace(/-/g, "+").replace(/_/g, "/");
  const bin = typeof atob === "function" ? atob(b64) : Buffer.from(b64, "base64").toString("binary");
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

/* ===== HMAC (SHA-256) using Web Crypto (Edge/Node >=18) ===== */
async function importKey(secret) {
  return crypto.subtle.importKey(
    "raw",
    textToUint8(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

export async function signToken(payload, secret) {
  const header = { alg: "HS256", typ: "JWT" };
  const h = base64urlEncode(JSON.stringify(header));
  const p = base64urlEncode(JSON.stringify(payload));
  const data = `${h}.${p}`;

  const key = await importKey(secret);
  const sigBuf = await crypto.subtle.sign("HMAC", key, textToUint8(data));
  const sig = uint8ToBase64url(new Uint8Array(sigBuf));

  return `${data}.${sig}`;
}

export async function verifyToken(token, secret) {
  if (!token || token.split(".").length !== 3) return null;
  const [h, p, sig] = token.split(".");
  const data = `${h}.${p}`;
  const key = await importKey(secret);

  const sigBytes = base64urlToUint8(sig);
  const ok = await crypto.subtle.verify("HMAC", key, sigBytes, textToUint8(data));
  if (!ok) return null;

  try {
    const payloadBytes = base64urlToUint8(p);
    const json = JSON.parse(new TextDecoder().decode(payloadBytes));
    if (!json || typeof json !== "object") return null;
    if (typeof json.exp !== "number") return null;
    const now = Math.floor(Date.now() / 1000);
    if (now >= json.exp) return null;
    return json;
  } catch {
    return null;
  }
}

/* ===== Cookie helpers ===== */
export function makeCookie(name, value, maxAgeSec) {
  const parts = [
    `${name}=${value}`,
    `Path=/`,
    `HttpOnly`,
    `SameSite=Lax`,
    `Secure`,
    `Max-Age=${maxAgeSec}`,
  ];
  return parts.join("; ");
}

export function expireCookie(name) {
  return `${name}=; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=0`;
}
