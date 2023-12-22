import { gameController } from "../gameController"
import { attackRes } from "../responses/attackRes"
import { finishRes } from "../responses/finishRes"
import { updateWinnersRes } from "../responses/updateWinnersRes"
import { WsMessageTypes } from "../types"
import { stringifyRes } from "../utils/stringifyRes"

export const attackHandler = (gameId: number, playerIndex: number, position?: { x: number; y: number }) => {
  const game = gameController.games[gameId]
  if (game.turn !== playerIndex) return

  const result = position
    ? gameController.attack(gameId, playerIndex, position.x, position.y)
    : gameController.randomAttack(gameId, playerIndex)

  if (!result) return

  let gameOver = false
  game.players.forEach((player) => {
    if (result.status === "killed") {
      result.positions!.forEach((pos) => {
        player.ws.send(attackRes(pos.x, pos.y, playerIndex, result.status))
      })
    } else {
      player.ws.send(attackRes(result.position!.x, result.position!.y, playerIndex, result.status))
    }

    const opponent = game.players.find(({ index }) => index !== playerIndex)!
    if (opponent.ships?.every((ship) => ship.health === 0)) {
      //if all opponents ships are destroyed: send responses, remove players from game
      if (player.index === playerIndex) {
        gameController.users[player.ws.id].wins++
      }
      gameOver = true
      player.ws.send(finishRes(playerIndex))
      game.players = game.players.filter((el) => el.index !== player.index)
    } else {
      player.ws.send(
        stringifyRes({
          type: WsMessageTypes.Turn,
          data: {
            currentPlayer: game.turn,
          },
          id: 0,
        })
      )
    }
  })

  if (gameOver) {
    gameController.users.forEach((user) => user.ws.send(updateWinnersRes()))
  }
}
