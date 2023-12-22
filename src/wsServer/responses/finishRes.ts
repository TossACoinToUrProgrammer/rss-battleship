import { WsMessageTypes } from "../types"
import { stringifyRes } from "../utils/stringifyRes"

export const finishRes = (playerIndex: number) =>
  stringifyRes({
    type: WsMessageTypes.Finish,
    data: {
      winPlayer: playerIndex,
    },
    id: 0,
  })
