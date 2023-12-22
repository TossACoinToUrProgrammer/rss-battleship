import { httpServer } from "./src/http_server/index.ts"
import { wsServer } from "./src/wsServer/index.ts"

const HTTP_PORT = 8181

console.log(`Start static http server on the ${HTTP_PORT} port!`)
httpServer.listen(HTTP_PORT)

const port = 3000

wsServer.listen(port, () => {
  console.log(`WebSocket server listening on port ${port}`)
})
