import type { AuthRepository } from "@/repositories/interfaces";
import type { Profile } from "@/types";

export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  login(email: string, password: string) {
    return this.authRepository.login(email, password);
  }

  signup(email: string, password: string) {
    return this.authRepository.signup(email, password);
  }

  logout() {
    return this.authRepository.logout();
  }

  forgotPassword(email: string) {
    return this.authRepository.forgotPassword(email);
  }

  getSession() {
    return this.authRepository.getSession();
  }

  completeOnboarding(userId: string, updates: Partial<Profile>) {
    return this.authRepository.completeOnboarding(userId, updates);
  }
}
