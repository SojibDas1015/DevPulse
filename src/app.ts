import express, { json, type Application, type Request, type Response } from "express"
import { auth } from "./modules/auth/auth.router"
import { issues } from "./modules/issues/issues.router"
import sendResponse from "./utility/sendresponse"
const app: Application = express()

app.use(express.json())
app.use(express.text())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req: Request, res: Response) => {
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Welcome To DevPulse API",
  })
})

app.use('/api/auth', auth)
app.use('/api/issues', issues)

export default app