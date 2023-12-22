import { WsMessageTypes } from "../types"
import { stringifyRes } from "../utils/stringifyRes"
import { gameController } from "../gameController"

export const updateRoomRes = () =>
  stringifyRes({
    type: WsMessageTypes.UpdateRoom,
    data: gameController.getRooms(),
    id: 0,
  })
