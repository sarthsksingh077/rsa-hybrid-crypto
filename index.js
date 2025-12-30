const crypto = require("crypto");
function toBuffer(data) {
  if (Buffer.isBuffer(data)) return data;
  else if (data instanceof ArrayBuffer) return Buffer.from(data);
  else if (typeof data === "object")
    return Buffer.from(JSON.stringify(data), "utf8");
  return Buffer.from(String(data), "utf8");
}
/**
 * Encrypt any data using hybrid encryption (AES + RSA)
 * @param {string|Buffer|object|ArrayBuffer} data
 * @returns {object} { encryptedKey, iv, authTag, data } all in base64
 */
function encrypt(publicKey, data) {
  // Convert data to Buffer
  let buffer = toBuffer(data);
  // 1. Generate random AES key & IV
  const aesKey = crypto.randomBytes(32); // AES-256
  const iv = crypto.randomBytes(16);

  // 2. Encrypt payload with AES-GCM
  const cipher = crypto.createCipheriv("aes-256-gcm", aesKey, iv);
  const encryptedData = Buffer.concat([cipher.update(buffer), cipher.final()]);
  const authTag = cipher.getAuthTag();
  // 3. Encrypt AES key with RSA public key
  const encryptedKey = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    aesKey
  );
  // Return everything as base64 strings
  return {
    encryptedKey: encryptedKey.toString("base64"),
    iv: iv.toString("base64"),
    authTag: authTag.toString("base64"),
    data: encryptedData.toString("base64"),
  };
}

/**
 * Decrypt data using hybrid decryption (AES + RSA)
 * @param {object} payload { encryptedKey, iv, authTag, data }
 * @param {boolean} parseJson - attempt to parse JSON back to object
 * @returns {string|object|Buffer} decrypted payload
 */
function decrypt(payload, privateKey, privateKeyPassphrase, parseJson = false) {
  const { encryptedKey, iv, authTag, data } = payload;

  // 1. Decrypt AES key using RSA private key
  const aesKey = crypto.privateDecrypt(
    {
      key: privateKey,
      passphrase: privateKeyPassphrase,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    Buffer.from(encryptedKey, "base64")
  );

  // 2. Decrypt data using AES-GCM
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    aesKey,
    Buffer.from(iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(authTag, "base64"));
  const decryptedBuffer = Buffer.concat([
    decipher.update(Buffer.from(data, "base64")),
    decipher.final(),
  ]);

  // 3. Try parsing JSON if requested
  if (parseJson) {
    try {
      return JSON.parse(decryptedBuffer.toString("utf8"));
    } catch {
      return decryptedBuffer;
    }
  }

  return decryptedBuffer;
}

module.exports = {
  encrypt,
  decrypt,
};
