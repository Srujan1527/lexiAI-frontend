import { http } from "../api/http";

export type AuthUser = {
  userId: string;
  email: string;
};

export type UserResponse = { user: { id: string; email: string } | AuthUser };

/**
 * Backend auth:
 *  POST /api/auth/register  { email, password }
 *  POST /api/auth/login     { email, password }
 *  GET  /api/auth/me        (cookie)
 *  POST /api/auth/logout
 */
export const authApi = {
  async register(email: string, password: string) {
    const { data } = await http.post<UserResponse>("/auth/register", {
      email,
      password,
    });
    return normalizeUser(data.user);
  },

  async login(email: string, password: string) {
    const { data } = await http.post<UserResponse>("/auth/login", {
      email,
      password,
    });
    return normalizeUser(data.user);
  },

  async me() {
    const { data } = await http.get<{ user: AuthUser }>("/auth/me");
    return normalizeUser(data.user);
  },

  async logout() {
    await http.post("/auth/logout");
  },
};

function normalizeUser(user: any): AuthUser {
  // login/register returns {id,email}; me returns {userId,email}
  if (!user) throw new Error("Invalid user payload");
  return {
    userId: user.userId ?? user.id,
    email: user.email,
  };
}
