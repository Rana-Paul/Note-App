import {Router} from "express";
import { userSignUp } from "../controllers/User";
const userRouter = Router();

userRouter.get("/signup", userSignUp)

export default userRouter