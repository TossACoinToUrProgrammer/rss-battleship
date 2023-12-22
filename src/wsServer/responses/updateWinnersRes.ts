import { gameController } from "../gameController"
import { WsMessageTypes } from "../types"
import { stringifyRes } from "../utils/stringifyRes"

export const updateWinnersRes = () =>
  stringifyRes({
    type: WsMessageTypes.UpdateWinners,
    data: gameController.getWinners(),
    id: 0,
  })
