declare module '@supabase/ssr' {
  // Minimal surface needed by this project. Keeps runtime import the same.
  export function createServerClient<T = any>(
    supabaseUrl: string,
    supabaseKey: string,
    options: {
      cookies: {
        get(name: string): string | undefined;
        set(name: string, value: string, options?: CookieOptions): void;
        remove(name: string, options?: CookieOptions): void;
      };
    }
  ): any;

  export function createBrowserClient<T = any>(
    supabaseUrl: string,
    supabaseKey: string
  ): any;

  export type CookieOptions = {
    name?: string;
    domain?: string;
    path?: string;
    sameSite?: 'lax' | 'strict' | 'none';
    httpOnly?: boolean;
    secure?: boolean;
    maxAge?: number;
    expires?: Date;
  };
} 