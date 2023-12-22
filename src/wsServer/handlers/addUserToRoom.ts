import { gameController } from "../gameController"
import { WsMessageTypes } from "../types"
import { stringifyRes } from "../utils/stringifyRes"
import { updateRoomRes } from "../responses/updateRoomsRes"

export const addUserToRoom = (roomIndex: number, playerName: string, playerIndex: number) => {
  const res = gameController.addToRoom(roomIndex, playerName, playerIndex)
  if (res === null) return null

  const rooms = gameController.getRooms()
  const room = rooms.find((room) => room.roomId === roomIndex)
  //close all rooms that consists current 2 players
  room?.roomUsers.forEach((user) => {
    rooms.forEach((el) => {
      if (el.roomUsers.some((innerUser) => innerUser.name === user.name)) gameController.closeRoom(el.roomId)
    })
  })

  gameController.users.forEach((player) => player.ws.send(updateRoomRes()))

  const game = gameController.createGame(roomIndex)

  gameController.users.forEach((user) => {
    const gamePlayer = game.players.find(({ name }) => name === user.ws.playerName)
    if (!gamePlayer) {
      return
    }
    user.ws.send(
      stringifyRes({
        type: WsMessageTypes.CreateGame,
        data: {
          idGame: game.id,
          idPlayer: gamePlayer.index,
        },
        id: 0,
      })
    )
  })
}
