import "react-native-get-random-values";
import "react-native-url-polyfill/auto";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import * as aesjs from "aes-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Stores the Supabase session encrypted in AsyncStorage.
 * The random AES key for each item is kept in the iOS Keychain /
 * Android Keystore through Expo SecureStore.
 *
 * SecureStore alone is not used for the full session because platform
 * keychain values can be size-limited.
 */
class LargeSecureStore {
  private async encrypt(key: string, value: string): Promise<string> {
    const encryptionKey = crypto.getRandomValues(new Uint8Array(32));
    const cipher = new aesjs.ModeOfOperation.ctr(
      encryptionKey,
      new aesjs.Counter(1),
    );
    const encryptedBytes = cipher.encrypt(aesjs.utils.utf8.toBytes(value));

    await SecureStore.setItemAsync(
      key,
      aesjs.utils.hex.fromBytes(encryptionKey),
      { keychainAccessible: SecureStore.WHEN_UNLOCKED },
    );

    return aesjs.utils.hex.fromBytes(encryptedBytes);
  }

  private async decrypt(key: string, encryptedValue: string): Promise<string | null> {
    const encryptionKeyHex = await SecureStore.getItemAsync(key);
    if (!encryptionKeyHex) return null;

    const cipher = new aesjs.ModeOfOperation.ctr(
      aesjs.utils.hex.toBytes(encryptionKeyHex),
      new aesjs.Counter(1),
    );
    const decryptedBytes = cipher.decrypt(
      aesjs.utils.hex.toBytes(encryptedValue),
    );

    return aesjs.utils.utf8.fromBytes(decryptedBytes);
  }

  async getItem(key: string): Promise<string | null> {
    const encryptedValue = await AsyncStorage.getItem(key);
    if (!encryptedValue) return null;
    return this.decrypt(key, encryptedValue);
  }

  async setItem(key: string, value: string): Promise<void> {
    const encryptedValue = await this.encrypt(key, value);
    await AsyncStorage.setItem(key, encryptedValue);
  }

  async removeItem(key: string): Promise<void> {
    await Promise.all([
      AsyncStorage.removeItem(key),
      SecureStore.deleteItemAsync(key),
    ]);
  }
}

/**
 * Browser storage is only for the web demo. localStorage is accessible to
 * JavaScript in the page; production web authentication should move to a
 * backend-for-frontend with secure, HttpOnly, SameSite cookies.
 */
const webStorage = {
  getItem: async (key: string): Promise<string | null> =>
    typeof window === "undefined" ? null : window.localStorage.getItem(key),
  setItem: async (key: string, value: string): Promise<void> => {
    if (typeof window !== "undefined") window.localStorage.setItem(key, value);
  },
  removeItem: async (key: string): Promise<void> => {
    if (typeof window !== "undefined") window.localStorage.removeItem(key);
  },
};

const projectUrl = process.env.EXPO_PUBLIC_SUPABASE_URL?.trim() ?? "";
const publishableKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? "";

export const isSupabaseConfigured =
  projectUrl.length > 0 && publishableKey.length > 0;

const sessionStorage =
  Platform.OS === "web" ? webStorage : new LargeSecureStore();

/**
 * Null until the developer supplies the public project URL and publishable
 * (anon) key in a local, untracked .env file. Never use service_role here.
 */
export const supabase = isSupabaseConfigured
  ? createClient(projectUrl, publishableKey, {
      auth: {
        storage: sessionStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: Platform.OS === "web",
      },
    })
  : null;
