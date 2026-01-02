import { api } from "./client";

// ----------------------
// SIGNUP
// ----------------------
export const signup = (payload: any) => {
  return api.post("/signup", { user: payload });
};

// ----------------------
// LOGIN
// ----------------------
export const login = async ({
  email,
  password,
}: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/login", { user: { email, password } });

  // Rails sends token in Authorization header
  const token = res.headers["authorization"]?.replace("Bearer ", "");

  return {
    token,
    role: res.data.data["role"],
  };
};
