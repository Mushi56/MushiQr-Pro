/**
 * Cryptographic utilities using Web Crypto API for secure QR code protection.
 * Leverages AES-GCM and PBKDF2 for password-based encryption.
 */

// Helper: Convert string to ArrayBuffer
function str2ab(str) {
  const enc = new TextEncoder();
  return enc.encode(str);
}

// Helper: Convert ArrayBuffer to string
function ab2str(buf) {
  const dec = new TextDecoder();
  return dec.decode(buf);
}

// Helper: Convert ArrayBuffer to Base64 (URL-safe)
function bufferToBase64(buf) {
  const binstr = Array.from(new Uint8Array(buf))
    .map(ch => String.fromCharCode(ch))
    .join('');
  return btoa(binstr).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

// Helper: Convert URL-safe Base64 to ArrayBuffer
function base64ToBuffer(base64) {
  let binstr = base64.replace(/-/g, '+').replace(/_/g, '/');
  const pad = 4 - (binstr.length % 4);
  if (pad < 4) {
    binstr += '='.repeat(pad);
  }
  const str = atob(binstr);
  const buf = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) {
    buf[i] = str.charCodeAt(i);
  }
  return buf.buffer;
}

/**
 * Derives an AES-GCM key from a password and salt.
 */
async function deriveKey(password, salt) {
  const baseKey = await window.crypto.subtle.importKey(
    'raw',
    str2ab(password),
    'PBKDF2',
    false,
    ['deriveKey']
  );

  return window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    baseKey,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts data with a password.
 * Output format: Base64(salt [16 bytes] + iv [12 bytes] + ciphertext)
 */
export async function encryptData(data, password) {
  const salt = window.crypto.getRandomValues(new Uint8Array(16));
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(password, salt);

  const ciphertext = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv: iv },
    key,
    str2ab(data)
  );

  // Combine salt + iv + ciphertext
  const combined = new Uint8Array(salt.byteLength + iv.byteLength + ciphertext.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.byteLength);
  combined.set(new Uint8Array(ciphertext), salt.byteLength + iv.byteLength);

  return bufferToBase64(combined.buffer);
}

/**
 * Decrypts data with a password.
 */
export async function decryptData(combinedBase64, password) {
  try {
    const combined = new Uint8Array(base64ToBuffer(combinedBase64));
    
    if (combined.byteLength < 28) {
      throw new Error('Invalid ciphertext format');
    }

    const salt = combined.slice(0, 16);
    const iv = combined.slice(16, 28);
    const ciphertext = combined.slice(28);

    const key = await deriveKey(password, salt);

    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: iv },
      key,
      ciphertext
    );

    return ab2str(decrypted);
  } catch (err) {
    console.error('Decryption failed:', err);
    throw new Error('Incorrect password or corrupted data');
  }
}
