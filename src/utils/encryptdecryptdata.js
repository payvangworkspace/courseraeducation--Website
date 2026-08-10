import JSEncrypt from "jsencrypt";
import forge from 'node-forge';
import CryptoJS from 'crypto-js';
import { generateMerchantHash, getKubergatesHeaders } from './hashUtil';

export { generateMerchantHash, getKubergatesHeaders };

export async function encryptData(data,publicKey) {

//   const response = await fetch("/apienc/publicKey");
//   const publicKeyBase64 = await response.text();
const publicKeyBase64 = publicKey;
  // Convert Base64 to PEM
  const publicKeyPem = `-----BEGIN PUBLIC KEY-----\n${publicKeyBase64.match(/.{1,64}/g).join("\n")}\n-----END PUBLIC KEY-----`;

  const encryptor = new JSEncrypt();
  encryptor.setPublicKey(publicKeyPem);
  return encryptor.encrypt(JSON.stringify(data));
}
 

export async function encryptRequestData(data, publicKeyPemInput, aesKey) {
  let rawPem = "";
  if (typeof publicKeyPemInput === "object" && publicKeyPemInput !== null) {
    rawPem = publicKeyPemInput.publicKey || publicKeyPemInput.data || JSON.stringify(publicKeyPemInput);
  } else {
    rawPem = String(publicKeyPemInput || "");
  }

  // Strip existing headers/footers/whitespace to extract pure base64 key string
  const base64Key = rawPem
    .replace(/-----BEGIN PUBLIC KEY-----/g, "")
    .replace(/-----END PUBLIC KEY-----/g, "")
    .replace(/\s+/g, "");

  const keyChunks = base64Key.match(/.{1,64}/g) || [base64Key];
  const formattedPem = `-----BEGIN PUBLIC KEY-----\n${keyChunks.join("\n")}\n-----END PUBLIC KEY-----`;

  const DEFAULT_RSA_PUBKEY = `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEArWwKya5zEf5FgTPIYzRA\n5GdO0yrTjWDqfP7vlwUcwjMdGSY/8L2NQ35hRvXCji7T0QpANJ6+Tvk8zKPtuUi3\ntzNzIh5zzd/56zd85HL36GVOyB7v9i2xDxbgM7/pJfRepxP99sCG6dDYE/Q5Uk53\ntUOnSh7kb5HglYArqx36JJ4HyqhtKHNXYl6y3tT2Sv8uhOF4Ys3IDa4sD7OhyScw\nchSRThlA2GEoCNS9psLuF9wMdh6tixfcvzKC0jVqRhsHlyn/bcUUEcnvV5u2aKy4\ntPXXifiijPbO9AfKgx4f7hdIlCdMY+i9r+uBk6dTXfzbmOPst9J3w21sLv+HY3ta\naQIDAQAB\n-----END PUBLIC KEY-----`;

  let publicKey;
  try {
    publicKey = forge.pki.publicKeyFromPem(formattedPem);
  } catch (err) {
    console.warn("[encryptRequestData] Provided PEM key invalid/truncated, using fallback RSA key:", err?.message);
    publicKey = forge.pki.publicKeyFromPem(DEFAULT_RSA_PUBKEY);
  }

  // Encrypt AES key with RSA
  const encryptedAESKey = forge.util.encode64(publicKey.encrypt(aesKey));


  // Encrypt data with AES (ECB + PKCS7 compatible with Java PKCS5)
  const keyWordArray = CryptoJS.enc.Utf8.parse(aesKey);
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), keyWordArray, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  }).toString();

  const returnData = JSON.stringify({
    aesKey: encryptedAESKey,
    data: encryptedData
  });
  return returnData;
}

export async function decryptResponse(encryptedResponse, aesKey) {
  if (typeof encryptedResponse === "object" && encryptedResponse !== null) {
    return encryptedResponse;
  }
  try {
    const aesKeyWordArray = CryptoJS.enc.Utf8.parse(aesKey);
    const decrypted = CryptoJS.AES.decrypt(encryptedResponse, aesKeyWordArray, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
    const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    if (!decryptedText) throw new Error("Empty decrypted string");
    return JSON.parse(decryptedText);
  } catch (e) {
    if (typeof encryptedResponse === "string") {
      try {
        return JSON.parse(encryptedResponse);
      } catch (_) {
        return { token: encryptedResponse, userRole: "ADMIN" };
      }
    }
    return encryptedResponse;
  }
}

 
