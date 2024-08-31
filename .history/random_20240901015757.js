const crypto = require("crypto");

const encryptionKey = crypto.randomBytes(32).toString("hex");

console.log(encryptionKey); // In mã khóa ra console
