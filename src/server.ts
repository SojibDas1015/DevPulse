import app from "./app"
import config from "./Config"
import { initDb } from "./DB/server"

app.listen(config.port, () => {
    initDb()
    console.log(`Example app listening on port ${config.port}`)
})