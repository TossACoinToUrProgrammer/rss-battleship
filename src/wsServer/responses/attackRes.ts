import { WsMessageTypes } from "../types"
import { stringifyRes } from "../utils/stringifyRes"

export const attackRes = (x: number, y: number, playerIndex: number, status: string) =>
  stringifyRes({
    type: WsMessageTypes.Attack,
    data: {
      position: { x, y },
      currentPlayer: playerIndex /* id of the player in the current game */,
      status: status,
    },
    id: 0,
  })
