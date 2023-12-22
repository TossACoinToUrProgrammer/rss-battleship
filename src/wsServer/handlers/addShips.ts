import { gameController } from "../gameController"
import { WsMessageTypes } from "../types"
import { stringifyRes } from "../utils/stringifyRes"

export const addShips = (gameId: number, ships: any[], playerIndex: number) => {
  gameController.addShips(gameId, playerIndex, ships)
  const currentGame = gameController.games[gameId]
  if (currentGame.players.some((player) => player.ships === null)) {
    return
  }

  currentGame.players.forEach((player) => {
    player.ws.send(
      stringifyRes({
        type: WsMessageTypes.StartGame,
        data: {
          ships: player.ships,
          currentPlayerIndex: player.index,
        },
        id: 0,
      })
    )

    player.ws.send(
      stringifyRes({
        type: WsMessageTypes.Turn,
        data: {
          currentPlayer: currentGame.turn,
        },
        id: 0,
      })
    )
  })
}
