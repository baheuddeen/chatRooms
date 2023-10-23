export default class Encryption {
  private static keyPair: CryptoKeyPair;
  public static textDecoder = new TextDecoder();
  public static textEncoder = new TextEncoder();
  private static bufferSize = 100;
  public static exportedKeyText: string;

  public static async generateKeyPair() {
    Encryption.keyPair = await crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: 2048, // 2048-bit key size
        publicExponent: new Uint8Array([0x01, 0x00, 0x01]), // 65537
        hash: "SHA-256"
      },
      true, // Can export the private key
      ["encrypt", "decrypt"]
    );  
    Encryption.saveToLocalStorage();
    return Encryption.keyPair;
  }

  public static async exportKey(key: CryptoKey) {
    return JSON.stringify(await crypto.subtle.exportKey("jwk", key));
  }

  public static async importKey(keyJWK: string): Promise<CryptoKey> {
    return await crypto.subtle.importKey(
      "jwk",
      JSON.parse(keyJWK),
      { name: "RSA-OAEP", hash: { name: "SHA-256" } },
      true,
      ["encrypt"]
    ); 
  }

  private static async saveToLocalStorage() {    
      localStorage.setItem("privateKey", await Encryption.exportKey(Encryption.keyPair.privateKey));
      localStorage.setItem("publicKey", await Encryption.exportKey(Encryption.keyPair.publicKey));
  }

  public static async getCryptoKeyPair() {
    if (Encryption.keyPair) {
      return Encryption.keyPair;
    }
    // Check The Local Storage
    const storedPrivateKeyJWK = localStorage.getItem('privateKey');
    const storedPubliceKeyJWK = localStorage.getItem('publicKey');

    if (storedPrivateKeyJWK && storedPubliceKeyJWK) {
      Encryption.keyPair = {
        privateKey: null,
        publicKey: null,
      };
      

      Encryption.keyPair.privateKey = await crypto.subtle.importKey(
        "jwk",
        JSON.parse(storedPrivateKeyJWK),
        { name: "RSA-OAEP", hash: { name: "SHA-256" } },
        true,
        ["decrypt"]
      );      

      Encryption.keyPair.publicKey = await crypto.subtle.importKey(
        "jwk",
        JSON.parse(storedPubliceKeyJWK),
        { name: "RSA-OAEP", hash: { name: "SHA-256" } },
        true,
        ["encrypt"]
      );
      
      return Encryption.keyPair;
    }
    return null;
  }
  
  // Encrypt a message using the public key
  public static async encryptMessage(message: string, publicKey: CryptoKey) {
    console.log('i am here');
    if (!Encryption.keyPair) {
      await Encryption.getCryptoKeyPair();      
    }
    const encryptedDataArray: ArrayBuffer[] = [];
    const encodedMessage = new TextEncoder().encode(message);
    for(let i = 0; i < encodedMessage.length;  i += Encryption.bufferSize) {
      const end = Encryption.bufferSize > encodedMessage.length ? encodedMessage.length : Encryption.bufferSize;
      const dataToEncrypt = encodedMessage.slice(0, end);
      console.log(dataToEncrypt);
      
      encryptedDataArray.push(await crypto.subtle.encrypt(
        {
          name: "RSA-OAEP"
        },
        publicKey,
        dataToEncrypt
      ));
    }

      const encryptedData = new ArrayBuffer(encryptedDataArray.length * encryptedDataArray[0].byteLength);
      const destView = new Uint8Array(encryptedData);
      encryptedDataArray.forEach((data, index) => {
        const source =  new Uint8Array(data);
        destView.set(source, index * source.byteLength);
      });    
    return encryptedData;
  }
  
  // Decrypt the encrypted message using the private key
  public static async decryptMessage(encryptedMessage: ArrayBuffer): Promise<ArrayBuffer> {
    if (!Encryption.keyPair) {
      await Encryption.getCryptoKeyPair();
    }

    const decryptedDataArray: ArrayBuffer[] = [];

    for(let i = 0; i < encryptedMessage.byteLength;  i += 256) {
      
      const dataToDecrypt = encryptedMessage.slice(0, 256);
      console.log(dataToDecrypt);      
      decryptedDataArray.push(await crypto.subtle.decrypt(
        {
          name: "RSA-OAEP"
        },
        Encryption.keyPair.privateKey,
        dataToDecrypt
      ));
    }

      const decryptedData = new ArrayBuffer(decryptedDataArray.length * decryptedDataArray[0].byteLength);
      const destView = new Uint8Array(decryptedData);
      decryptedDataArray.forEach((data, index) => {
        const source =  new Uint8Array(data);
        destView.set(source, index * source.byteLength);
      });  

      return decryptedData;
  }
}