export interface AuthUser {
  _id?: string;
  username?: string;
  email?: string;
}

export interface AuthState {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  setAuth: (payload: { token: string; user?: AuthUser | null }) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}