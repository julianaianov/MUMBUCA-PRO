declare module '@supabase/ssr' {
  export interface CookieOptions {
    name?: string;
    domain?: string;
    path?: string;
    sameSite?: 'lax' | 'strict' | 'none';
    httpOnly?: boolean;
    secure?: boolean;
    maxAge?: number;
    expires?: Date;
  }

  export interface SSRClientCookies {
    get(name: string): string | undefined;
    set(name: string, value: string, options?: CookieOptions): void;
    remove(name: string, options?: CookieOptions): void;
  }

  export function createServerClient(
    supabaseUrl: string,
    supabaseKey: string,
    options: { cookies: SSRClientCookies }
  ): unknown;

  export function createBrowserClient(
    supabaseUrl: string,
    supabaseKey: string
  ): unknown;
} 