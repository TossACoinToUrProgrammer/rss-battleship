import { WebSocket } from "ws"

export interface IUser {
  name: string
  password: string
  index: number
  ws: WebSocketType
  wins: number
}

export interface IRoom {
  roomId: number
  roomUsers: { name: string; index: number }[]
  closed: boolean
}

export interface IGame {
  id: number
  turn: number
  players: {
    name: string
    index: number
    ships: IShip[] | null
    ws: WebSocketType
    attackedCells: { x: number; y: number }[] //cells this user shot at
  }[]
  nextTurn: () => void
}

export interface IShip {
  position: {
    x: number
    y: number
  }
  direction: boolean
  length: number
  type: "small" | "medium" | "large" | "huge"
  health: number
}

export type WebSocketType = WebSocket & { playerName: string; id: number }

export interface DataReg {
  type: "reg"
}

export enum WsMessageTypes {
  Reg = "reg",
  UpdateWinners = "update_winners",
  UpdateRoom = "update_room",
  CreateRoom = "create_room",
  AddUserToRoom = "add_user_to_room",
  CreateGame = "create_game",
  AddShips = "add_ships",
  StartGame = "start_game",
  Turn = "turn",
  Attack = "attack",
  RandomAttack = "randomAttack",
  Finish = "finish",
}

export interface RegRequest {
  type: WsMessageTypes.Reg
  index: 0
  data: {
    name: string
    password: string
  }
}

