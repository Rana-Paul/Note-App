import { Express, Request, Response } from "express";
import { prismaClient } from "../db";
import axios from "axios";
import JWTServices from "../services/jwt";

// Google token result type
interface GoogleTokenResult {
  iss?: string;
  nbf?: string;
  aud?: string;
  sub?: string;
  email: string;
  email_verified: string;
  azp?: string;
  name?: string;
  picture?: string;
  given_name: string;
  family_name?: string;
  iat?: string;
  exp?: string;
  jti?: string;
  alg?: string;
  kid?: string;
  typ?: string;
}

export const userSignUp = async (req: Request, res: Response) => {
  const googleToken = req.body;

  // Validate google token type
  if (typeof googleToken !== "string" || !googleToken) {
    res.status(400).json({
      error: "Invalid google token",
    });
    return;
  }

  try {
    // Get user data from google token
    const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo");
    googleOauthURL.searchParams.set("id_token", googleToken);

    const { data } = await axios.get<GoogleTokenResult>(googleOauthURL.toString(), {
      responseType: "json",
    });

    // Check if user exists
    const checkUser = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    });

    // If not exists, Create new user
    if (!checkUser) {
      await prismaClient.user.create({
        data: {
          email: data.email,
          firstName: data.given_name,
          lastName: data.family_name,
        },
      });
    }

    // Recheck if user exists
    const userInDb = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    });

    // If still not exists
    if (!userInDb) throw new Error("User not found");

    // Generate token
    const userToken = await JWTServices.generateTokenForUser(userInDb);

    // Return token
    return res.status(200).json({
      token: userToken,
    });
  } catch (error) {
    return res.status(500).json({
      error: "Server Error",
    });
  }
};
