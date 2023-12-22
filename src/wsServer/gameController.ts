import { IGame, IUser, IRoom, IShip, WebSocketType } from "./types"

class GameController {
  private _rooms: IRoom[] = []
  users: IUser[] = []
  games: IGame[] = []

  constructor() {}

  addUser(name: string, password: string, ws: WebSocketType) {
    const foundUser = this.users.find((user) => user.name === name)
    if (foundUser) {
      foundUser.ws = ws
      return foundUser.index
    }

    const newUser = { name, password, index: this.users.length, ws, wins: 0 }
    this.users.push(newUser)
    return newUser.index
  }

  createRoom(playerId: number) {
    const player = this.users[playerId]
    if (this._rooms.some((room) => room.roomUsers.some((user) => user.name === player.name && !room.closed))) return

    const newRoom = {
      roomId: this._rooms.length,
      roomUsers: [{ name: player.name, index: player.index }],
      closed: false,
    }
    this._rooms.push(newRoom)
    return newRoom
  }

  getRooms(): IRoom[] {
    return this._rooms.reduce((acc: any, { closed, ...room }) => {
      if (!closed) {
        acc.push(room)
      }
      return acc
    }, [])
  }

  closeRoom(roomId: number) {
    this._rooms[roomId].closed = true
  }

  addToRoom(roomIndex: number, playerName: string, playerIndex: number) {
    const room = this._rooms[roomIndex]
    if (!room || room.roomUsers.some((el) => el.name === playerName)) return null
    this._rooms[roomIndex].roomUsers.push({ name: playerName, index: playerIndex })
  }

  getWinners() {
    return this.users.map((player) => ({ wins: player.wins, name: player.name })).sort((a, b) => b.wins - a.wins)
  }

  createGame(roomId: number) {
    const newGame: IGame = {
      id: this.games.length,
      players: [],
      turn: 0,
      nextTurn: function () {
        if (this.turn === 0) this.turn = 1
        else this.turn = 0
      },
    }
    this._rooms[roomId].roomUsers.forEach((user) =>
      newGame.players.push({
        name: user.name,
        index: newGame.players.length,
        ships: null,
        ws: this.users.find(({ name }) => name === user.name)!.ws,
        attackedCells: [],
      })
    )
    this.games.push(newGame)
    return newGame
  }

  addShips(gameId: number, playerId: number, ships: any) {
    const player = this.games[gameId].players[playerId]
    player.ships = ships.map((ship: IShip) => ({ ...ship, health: ship.length }))
    return player
  }

  attack(gameId: number, playerId: number, x: number, y: number) {
    const game = this.games[gameId]
    const player = game.players[playerId]
    if (player.attackedCells.some((cell) => cell.x === x && cell.y === y)) {
      return null
    }
    player.attackedCells.push({ x, y })
    
    const opponentShips = game.players.find(({ index }) => index !== playerId)?.ships!
    const result = this._shoot(x, y, opponentShips)
    if (result.status === "miss") game.nextTurn()
    return result
  }

  randomAttack(gameId: number, playerId: number) {
    const game = this.games[gameId]
    const attackedCells = game.players[playerId].attackedCells
    let randomPosition = null

    while (randomPosition === null) {
      const randomX = Math.floor(Math.random() * 10)
      const randomY = Math.floor(Math.random() * 10)

      if (!attackedCells.some((cell) => cell.x === randomX && cell.y === randomY)) {
        randomPosition = { x: randomX, y: randomY }
      }
    }

    return this.attack(gameId, playerId, randomPosition.x, randomPosition.y)
  }

  _shoot(x: number, y: number, ships: IShip[]) {
    const propsPosition = { x, y }

    for (const ship of ships) {
      const mainAxis = ship.direction ? "y" : "x"
      const secondAxis = ship.direction ? "x" : "y"

      if (
        ship.position[secondAxis] !== propsPosition[secondAxis] ||
        ship.position[mainAxis] > propsPosition[mainAxis] ||
        ship.position[mainAxis] + (ship.length - 1) < propsPosition[mainAxis]
      ) {
        continue
      }

      ship.health -= 1

      if (ship.health === 0) {
        const positions = new Array(ship.length).fill(null).map((_, index) => ({
          [secondAxis]: ship.position[secondAxis],
          [mainAxis]: ship.position[mainAxis] + index,
        }))

        return { status: "killed", positions }
      }

      return { status: "shot", position: propsPosition }
    }

    return { status: "miss", position: propsPosition }
  }
}

export const gameController = new GameController()
