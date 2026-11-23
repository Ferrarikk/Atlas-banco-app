import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import { Platform } from "react-native";

/**
 * Web storage is retained only for the browser preview.
 * A production web app should use a backend/BFF and HttpOnly cookies.
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

const isWeb = Platform.OS === "web";

/**
 * Native sessions intentionally remain in memory until a reviewed,
 * authenticated persistent-storage adapter is implemented. This means
 * users must sign in again after closing/restarting the native app.
 * Do not store refresh tokens with the previous unauthenticated AES-CTR
 * prototype.
 */
export const supabase = isSupabaseConfigured
  ? createClient(projectUrl, publishableKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: isWeb,
        detectSessionInUrl: isWeb,
        ...(isWeb ? { storage: webStorage } : {}),
      },
    })
  : null;
