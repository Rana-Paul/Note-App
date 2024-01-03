import { User } from "@prisma/client";
import JWT from "jsonwebtoken";

export interface JWTUser {
  id: string;
  email: string;
}

class JWTServices {
  public static generateTokenForUser(user: User) {
    // generate payload
    const payload: JWTUser = {
      id: user?.id,
      email: user?.email,
    };

    // Signing the token
    const token = JWT.sign(payload, process.env.JWT_SECRET as string);
    return token;
  }

  public static decodeToken(token: string) {
    try {
      // Decoding the token
      return JWT.verify(token, process.env.JWT_SECRET as string) as JWTUser;
    } catch (error) {
      return null;
    }
  }
}

export default JWTServices;
