import type { Profile, User } from "@/types";

export interface AuthSession {
  token: string;
  user: User;
}

export interface AuthRepository {
  login(email: string, password: string): Promise<AuthSession>;
  signup(email: string, password: string): Promise<AuthSession>;
  logout(): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  getSession(): Promise<AuthSession | null>;
  updateSession(session: AuthSession | null): Promise<void>;
  completeOnboarding(userId: string, profile: Partial<Profile>): Promise<void>;
}
