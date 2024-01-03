import  { Express, Request, Response } from "express";
import { prismaClient } from "../db";
import axios from "axios";
import JWTServices from "../services/jwt";

interface GoogleTokenResult{
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
    if(typeof googleToken !== "string" || !googleToken) {
        res.status(400).json({
            message: "Invalid google token"
        })
        return
    } 
    
    const googleOauthURL = new URL("https://oauth2.googleapis.com/tokeninfo")
    googleOauthURL.searchParams.set("id_token", googleToken)

    const {data} = await axios.get(googleOauthURL.toString(), {
        responseType: "json"
    })

    const checkUser = await prismaClient.user.findUnique({
        where: {
            email: data.email
        }
    });

    if(!checkUser){

        await prismaClient.user.create({
            data: {
                email: data.email,
                firstName: data.given_name,
                lastName: data.family_name
            }
        });
        
    }

    const userInDb = await prismaClient.user.findUnique({
        where: {
            email: data.email
        }
    })
    if(!userInDb) throw new Error("User not found");

    const userToken = await JWTServices.generateTokenForUser(userInDb);

    res.status(200).json({
        token: userToken
    })
    return

}

