import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router()

router.post('/signup', authController.userSignUp)
router.post('/login', authController.userLogin)

export const auth = router