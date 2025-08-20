import type { User } from '@/types/user.type';

export class UserService {
  private id: string;

  constructor(id?: string) {
    this.id = id ?? crypto.randomUUID();
  }

  login(): void {
    console.log('Login not implemented yet.');
  }

  logout(): void {
    console.log('Logout not implemented yet.');
  }

  getCurrentUser(): User {
    return {
      id: this.id,
    };
  }
}
