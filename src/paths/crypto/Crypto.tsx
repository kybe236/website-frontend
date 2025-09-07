import {useState} from "react";
import CryptoJS from "crypto-js";
import "./Crypto.css"

const KYBE_UTILS_START = "k©";
const KYBE_UTILS_END = "$%";
const KYBE_UTILS_SALT_LEN = 16;
const KYBE_UTILS_IV_LEN = 12;
const KYBE_UTILS_TAG_LEN = 128;

type AESGCMKey = CryptoKey;

const bufToBase64 = (buf: ArrayBuffer): string =>
    btoa(String.fromCharCode(...new Uint8Array(buf)));

const base64ToBuf = (b64: string): ArrayBuffer => {
    const binary = atob(b64);
    const buf = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) buf[i] = binary.charCodeAt(i);
    return buf.buffer;
};

// kybes-utils
async function kybesUtilsDeriveKey(password: string, salt: Uint8Array): Promise<AESGCMKey> {
    const enc = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        "raw",
        enc.encode(password),
        {name: "PBKDF2"},
        false,
        ["deriveKey"]
    );
    return crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt,
            iterations: 100_000,
            hash: "SHA-256",
        },
        keyMaterial,
        {name: "AES-GCM", length: 128},
        false,
        ["encrypt", "decrypt"]
    );
}

async function kybesUtilsEncrypt(plaintext: string, password: string): Promise<string> {
    const enc = new TextEncoder();
    const salt = crypto.getRandomValues(new Uint8Array(KYBE_UTILS_SALT_LEN));
    const iv = crypto.getRandomValues(new Uint8Array(KYBE_UTILS_IV_LEN));
    const key = await kybesUtilsDeriveKey(password, salt);
    const ciphertext = await crypto.subtle.encrypt(
        {name: "AES-GCM", iv, tagLength: KYBE_UTILS_TAG_LEN},
        key,
        enc.encode(plaintext)
    );

    const combined = new Uint8Array(salt.length + iv.length + ciphertext.byteLength);
    combined.set(salt, 0);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(ciphertext), salt.length + iv.length);

    return KYBE_UTILS_START + bufToBase64(combined.buffer) + KYBE_UTILS_END;
}

async function kybesUtilsDecrypt(ciphertext: string, password: string): Promise<string | null> {
    if (!ciphertext) return null;
    if (!ciphertext.startsWith(KYBE_UTILS_START)) return "Error: kybe-utils ciphertext must start with 'k©'";
    if (!ciphertext.endsWith(KYBE_UTILS_END)) return "Error: kybe-utils ciphertext must end with '$%'";

    const ciphertextInner = ciphertext.slice(KYBE_UTILS_START.length, -KYBE_UTILS_END.length);

    let data: Uint8Array;
    try {
        data = new Uint8Array(base64ToBuf(ciphertextInner));
    } catch {
        throw new Error("Base64 decode failed");
    }

    if (data.length < KYBE_UTILS_SALT_LEN + KYBE_UTILS_IV_LEN + 1) throw new Error("Data too short");

    const salt = data.slice(0, KYBE_UTILS_SALT_LEN);
    const iv = data.slice(KYBE_UTILS_SALT_LEN, KYBE_UTILS_SALT_LEN + KYBE_UTILS_IV_LEN);
    const actualCiphertext = data.slice(KYBE_UTILS_SALT_LEN + KYBE_UTILS_IV_LEN);
    const key = await kybesUtilsDeriveKey(password, salt);

    try {
        const decrypted = await crypto.subtle.decrypt(
            {name: "AES-GCM", iv, tagLength: KYBE_UTILS_TAG_LEN},
            key,
            actualCiphertext
        );
        return new TextDecoder().decode(decrypted);
    } catch {
        throw new Error("Decryption failed (bad key or corrupted data)");
    }
}

// tilley.lol
const TILLEY_LOL_START = "&&";

function tilleyLolEncrypt(plaintext: string, passphrase: string): string {
    const key = CryptoJS.SHA256(passphrase);
    const iv = CryptoJS.lib.WordArray.random(16);
    const encrypted = CryptoJS.AES.encrypt(plaintext, key, {iv});
    return TILLEY_LOL_START + CryptoJS.enc.Base64.stringify(iv.concat(encrypted.ciphertext));
}

function tilleyLolDecrypt(ciphertext: string, passphrase: string): string | null {
    if (!ciphertext) return null;
    if (!ciphertext.startsWith(TILLEY_LOL_START)) return "Error: tilley.lol ciphertext must start with '&&'";

    const decoded = CryptoJS.enc.Base64.parse(ciphertext.slice(TILLEY_LOL_START.length));
    const iv = CryptoJS.lib.WordArray.create(decoded.words.slice(0, 4), 16);
    const encryptedWords = CryptoJS.lib.WordArray.create(decoded.words.slice(4), decoded.sigBytes - 16);
    const cipherParams = CryptoJS.lib.CipherParams.create({
        ciphertext: encryptedWords
    });

    const key = CryptoJS.SHA256(passphrase);
    const decrypted = CryptoJS.AES.decrypt(cipherParams, key, {iv});

    return decrypted.toString(CryptoJS.enc.Utf8);
}


export default function Crypto() {
    const [method, setMethod] = useState<"kybes-utils" | "tilley.lol">("kybes-utils");
    const [operation, setOperation] = useState<"encrypt" | "decrypt">("encrypt");
    const [key, setKey] = useState<string>("");
    const [input, setInput] = useState<string>("");
    const [output, setOutput] = useState<string>("");

    const processInput = async () => {
        setOutput("Processing...");
        if (!key) return setOutput("Error: Password required.");
        if (!input) return setOutput("Error: Text input required.");

        try {
            let result: string | null;
            if (method === "kybes-utils") {
                result = operation === "encrypt"
                    ? await kybesUtilsEncrypt(input, key)
                    : await kybesUtilsDecrypt(input, key);
            } else {
                result = operation === "encrypt"
                    ? tilleyLolEncrypt(input, key)
                    : tilleyLolDecrypt(input, key);
            }
            setOutput(result ?? "");
        } catch (e: unknown) {
            if (e instanceof Error) setOutput("Error: " + e.message);
            else setOutput("Error: Unknown error");
        }
    };

    return (
        <div className="main-container">
            <h1>Kybe Crypt</h1>

            <div className="top-bar">
                <label>
                    Encryption Method:
                    <select id="encryption-method-select" value={method}
                            onChange={e => setMethod(e.target.value as "kybes-utils" | "tilley.lol")}>
                        <option value="kybes-utils">kybes-utils</option>
                        <option value="tilley.lol">tilley.lol</option>
                    </select>
                </label>
                <label>
                    Operation:
                    <select id="operation-select" value={operation}
                            onChange={e => setOperation(e.target.value as "encrypt" | "decrypt")}>
                        <option value="encrypt">Encrypt</option>
                        <option value="decrypt">Decrypt</option>
                    </select>
                </label>
            </div>
            <div className="text-box">
                <textarea id="text-input" rows={6} value={input} onChange={e => setInput(e.target.value)}
                          placeholder="Enter text here"></textarea>
            </div>
            <div className="password-section">
                <input type="text" id="key-input" value={key} onChange={e => setKey(e.target.value)}
                       placeholder="Enter password"/>
            </div>
            <div className="exec-section">
                <button id="exec-btn" onClick={processInput}>exec</button>
            </div>
            <textarea id="result-output" readOnly value={output}/>
        </div>
    );
}