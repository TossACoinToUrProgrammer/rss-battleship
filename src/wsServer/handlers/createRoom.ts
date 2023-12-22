import { gameController } from "../gameController"
import { updateRoomRes } from "../responses/updateRoomsRes"

export const createRoom = (playerId: number) => {
  const res = gameController.createRoom(playerId)
  if (!res) return //if this player has already created room
  gameController.users.forEach((user) => user.ws.send(updateRoomRes()))
}
