import { Buffer } from 'buffer';

const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 32;
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const MIN_ENCRYPTED_LENGTH = SALT_LENGTH + IV_LENGTH + 16; // Minimum length including auth tag

const ENCRYPTION_KEY = import.meta.env.VITE_ENCRYPTION_KEY || 'development-key-do-not-use-in-production';

if (import.meta.env.DEV && !import.meta.env.VITE_ENCRYPTION_KEY) {
  console.warn('No encryption key found in environment variables. Using development key. DO NOT USE IN PRODUCTION!');
}

// Validate encrypted data format and length
async function deriveKey(salt: Uint8Array): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyData = encoder.encode(ENCRYPTION_KEY || 'development-key-do-not-use-in-production');

  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    keyData,
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return await crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: ALGORITHM, length: KEY_LENGTH * 8 },
    false,
    ['encrypt', 'decrypt']
  );
}

function getRandomBytes(length: number): Uint8Array {
  return crypto.getRandomValues(new Uint8Array(length));
}

function concatBuffers(...buffers: ArrayBuffer[]): ArrayBuffer {
  const totalLength = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  buffers.forEach(buffer => {
    result.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  });
  return result.buffer;
}

function isValidEncryptedData(data: Uint8Array): boolean {
  try {
    if (data.length < MIN_ENCRYPTED_LENGTH) {
      return false;
    }
    
    // Verify we have enough data for salt and IV
    const salt = data.slice(0, SALT_LENGTH);
    const iv = data.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const ciphertext = data.slice(SALT_LENGTH + IV_LENGTH);
    
    return salt.length === SALT_LENGTH && 
           iv.length === IV_LENGTH && 
           ciphertext.length >= 16; // Minimum ciphertext length with auth tag
  } catch (error) {
    return false;
  }
}

/**
 * Encrypts message content with enhanced security:
 * - Uses PBKDF2 for key derivation
 * - Includes salt for key derivation
 * - Uses random IV for each message
 * - Includes authentication tag
 */
export async function encryptMessage(text: string): Promise<string> {
  try {
    const salt = getRandomBytes(SALT_LENGTH);
    const iv = getRandomBytes(IV_LENGTH);

    const key = await deriveKey(salt);

    const encoder = new TextEncoder();
    const data = encoder.encode(text);

    const encryptedContent = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv
      },
      key,
      data
    );

    const result = concatBuffers(salt.buffer, iv.buffer, encryptedContent);
    return btoa(String.fromCharCode(...new Uint8Array(result)));
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt message');
  }
}

/**
 * Decrypts message content:
 * - Extracts salt, IV, and ciphertext
 * - Derives key using salt
 * - Verifies authentication tag
 */
export async function decryptMessage(encryptedText: string): Promise<string> {
  try {
    // Handle empty or invalid input
    if (!encryptedText) {
      return 'Message content unavailable';
    }

    let encrypted: Uint8Array;
    try {
      encrypted = Uint8Array.from(atob(encryptedText), c => c.charCodeAt(0));
    } catch (error) {
      console.error('Invalid base64 data:', error);
      return 'Message content unavailable';
    }

    // Validate encrypted data length
    if (!isValidEncryptedData(encrypted)) {
      console.warn('Invalid encrypted data length');
      return 'Message content unavailable';
    }

    const salt = encrypted.slice(0, SALT_LENGTH);
    const iv = encrypted.slice(SALT_LENGTH, SALT_LENGTH + IV_LENGTH);
    const data = encrypted.slice(SALT_LENGTH + IV_LENGTH);

    const key = await deriveKey(salt);

    const decryptedContent = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv
      },
      key,
      data
    );

    return new TextDecoder().decode(decryptedContent);
  } catch (error) {
    console.error('Decryption error:', error);
    return 'Message content unavailable';
  }
}