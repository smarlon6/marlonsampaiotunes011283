import { http } from "../../../lib/http";
import type { TokenPayload } from "../../../lib/tokenStorage";

export const authFacade = {
  async login(username: string, password: string) {
    const res = await http.post<TokenPayload>("/autenticacao/login", { username, password });
    return res.data;
  },

  async refresh(refreshToken: string) {
    // A API pode aceitar refresh via Authorization Bearer (como você já fazia)
    const res = await http.put<TokenPayload>(
      "/autenticacao/refresh",
      null,
      { headers: { Authorization: `Bearer ${refreshToken}` } }
    );
    return res.data;
  },
};
