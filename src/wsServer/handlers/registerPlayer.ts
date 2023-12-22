import { gameController } from "../gameController"
import { RegRequest, WebSocketType } from "../types"
import { stringifyRes } from "../utils/stringifyRes"
import { updateRoomRes } from "../responses/updateRoomsRes"
import { updateWinnersRes } from "../responses/updateWinnersRes"

export const registerPlayer = (ws: WebSocketType, { data }: RegRequest) => {
  const foundUser = gameController.users.find((user) => user.name === data.name)
  if (foundUser && foundUser.password !== data.password) {
    ws.send(
      stringifyRes({
        type: "reg",
        data: {
          name: data.name,
          index: NaN,
          error: true,
          errorText: "Wrong password",
        },
        id: 0,
      })
    )
    return
  }

  const playerIndex = gameController.addUser(data.name, data.password, ws)
  ws.playerName = data.name
  ws.id = playerIndex

  ws.send(
    stringifyRes({
      type: "reg",
      data: {
        name: data.name,
        index: playerIndex,
        error: false,
        errorText: "",
      },
      id: 0,
    })
  )

  gameController.users.forEach((user) => user.ws.send(updateWinnersRes()))

  ws.send(updateRoomRes())
}
