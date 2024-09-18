const crypto = require("crypto");

const algorithm = "aes-256-cbc";

// Kiểm tra biến môi trường
const keyHex = (process.env.ENCRYPTION_KEY || "").trim();
if (!keyHex || typeof keyHex !== "string") {
  throw new Error("ENCRYPTION_KEY is not defined or is not a string");
}
console.log("ENCRYPTION_KEY:", process.env.ENCRYPTION_KEY);

if (keyHex.length !== 64) {
  throw new Error("ENCRYPTION_KEY must be a 64-character hex string");
}
const key = Buffer.from(keyHex, "hex");

// Mã hóa tin nhắn
function encryptMessage(message) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(message, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

// Giải mã tin nhắn
function decryptMessage(encryptedMessage) {
  const [ivHex, encrypted] = encryptedMessage.split(":");
  if (!ivHex || !encrypted) {
    throw new Error("Invalid encrypted message format");
  }
  const iv = Buffer.from(ivHex, "hex");
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

module.exports = { encryptMessage, decryptMessage };
