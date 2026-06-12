/* eslint-disable @typescript-eslint/no-unused-vars */
import type { AuthRepository, AuthSession } from "@/repositories/interfaces";
import type { Profile } from "@/types";

export class SupabaseAuthRepository implements AuthRepository {
  async login(_email: string, _password: string): Promise<AuthSession> {
    throw new Error("SupabaseAuthRepository.login not implemented");
  }

  async signup(_email: string, _password: string): Promise<AuthSession> {
    throw new Error("SupabaseAuthRepository.signup not implemented");
  }

  async logout(): Promise<void> {
    throw new Error("SupabaseAuthRepository.logout not implemented");
  }

  async forgotPassword(_email: string): Promise<void> {
    throw new Error("SupabaseAuthRepository.forgotPassword not implemented");
  }

  async getSession(): Promise<AuthSession | null> {
    throw new Error("SupabaseAuthRepository.getSession not implemented");
  }

  async updateSession(_session: AuthSession | null): Promise<void> {
    throw new Error("SupabaseAuthRepository.updateSession not implemented");
  }

  async completeOnboarding(_userId: string, _profile: Partial<Profile>): Promise<void> {
    throw new Error("SupabaseAuthRepository.completeOnboarding not implemented");
  }
}
