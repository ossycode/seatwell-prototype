export interface JwtPayload {
  id: string;
  email: string;
  role: "seller" | "buyer" | "admin";
  exp: number;
  iat: number;
}
