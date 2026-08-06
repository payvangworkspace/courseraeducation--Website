import JSEncrypt from "jsencrypt";
import forge from 'node-forge';
import CryptoJS from 'crypto-js';

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
 

export async function encryptRequestData(data,publicKeyPem,aesKey) {
   // console.log('The aesKey--->'+aesKey);
    // Convert to forge public key
    const publicKey = forge.pki.publicKeyFromPem(
        "-----BEGIN PUBLIC KEY-----\n" +
        publicKeyPem.match(/.{1,64}/g).join("\n") +
        "\n-----END PUBLIC KEY-----"
    );
    // Encrypt AES key with RSA
    const encryptedAESKey = forge.util.encode64(publicKey.encrypt(aesKey));

    // Encrypt data with AES (ECB + PKCS7 compatible with Java PKCS5)
    const keyWordArray = CryptoJS.enc.Utf8.parse(aesKey);
    const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), keyWordArray, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    }).toString();

    const returnData=JSON.stringify({
            aesKey: encryptedAESKey,
            data: encryptedData
        })
    return returnData;
}
 export async function decryptResponse(encryptedResponse, aesKey) {
  //console.log('In decryptResponse () The enc data -->'+encryptedResponse+',# and key is --'+aesKey)
     
    //const aesKeyWordArray = CryptoJS.enc.Base64.parse(aesKey);
    const aesKeyWordArray =  CryptoJS.enc.Utf8.parse(aesKey)
    // Decrypt AES
    const decrypted = CryptoJS.AES.decrypt(encryptedResponse, aesKeyWordArray, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
    });
 
    // Convert decrypted bytes to UTF-8 string
     const decryptedText = decrypted.toString(CryptoJS.enc.Utf8);
    // const decryptedText = decrypted.toString();
   // console.log('Before return...'+decryptedText);
    // Parse JSON if server sent JSON
    return JSON.parse(decryptedText);
}
 
