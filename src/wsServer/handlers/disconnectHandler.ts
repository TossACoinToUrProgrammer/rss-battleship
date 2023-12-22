import { WebSocketType } from "../types"
import { gameController } from "../gameController"
import { finishRes } from "../responses/finishRes"
import { updateWinnersRes } from "../responses/updateWinnersRes"
import { updateRoomRes } from "../responses/updateRoomsRes"

export const disconnectHandler = (ws: WebSocketType) => {
  if (ws.playerName) {
    const room = gameController.getRooms().find((room) => {
      return room.roomUsers.some((user) => ws.playerName === user.name)
    })

    if (room) {
      gameController.closeRoom(room.roomId)
      gameController.users.forEach((user) => user.ws.send(updateRoomRes()))
    }

    const game = gameController.games.find((game) => {
      return game.players.some((player) => ws.playerName === player.name)
    })
    if (!game) return

    game.players = game.players.filter((player) => player.name !== ws.playerName)

    const winner = game.players[0]
    if (winner) {
      const user = gameController.users.find((user) => user.name === winner.name)
      if (user) {
        user.wins++
      }
      game.players = []
      winner.ws.send(finishRes(winner.index))
      gameController.users.forEach((user) => user.ws.send(updateWinnersRes()))
    }
  }
}
