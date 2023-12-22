import { WebSocket } from "ws"
import http from "http"

import { RegRequest, WebSocketType, WsMessageTypes } from "./types"
import { addShips, addUserToRoom, attackHandler, createRoom, disconnectHandler, registerPlayer } from "./handlers"

export const wsServer = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/plain" })
  res.end("WebSocket server\n")
})
export const wss = new WebSocket.Server({ server: wsServer })

wss.on("connection", (ws: WebSocketType) => {
  console.log("Client connected")

  ws.on("message", (message: string) => {
    console.log(`Received: ${message}`)
    const msg = JSON.parse(message)
    let data = msg.data
    if (data !== "") data = JSON.parse(msg.data)

    switch (msg.type) {
      case WsMessageTypes.Reg:
        registerPlayer(ws, { data } as RegRequest)
        break

      case WsMessageTypes.CreateRoom:
        createRoom(ws.id)
        break

      case WsMessageTypes.AddUserToRoom:
        addUserToRoom(data.indexRoom, ws.playerName, ws.id)
        break

      case WsMessageTypes.AddShips:
        addShips(data.gameId, data.ships, data.indexPlayer)
        break

      case WsMessageTypes.Attack:
        attackHandler(data.gameId, data.indexPlayer, { x: data.x, y: data.y })
        break

      case WsMessageTypes.RandomAttack:
        attackHandler(data.gameId, data.indexPlayer)
        break

      default:
        break
    }
  })

  ws.on("close", () => {
    console.log("Client disconnected")
    disconnectHandler(ws)
  })
})
