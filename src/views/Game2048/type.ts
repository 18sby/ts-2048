import { DOMElement } from "react";

type IRow = number[];

export type IBoard = IRow[]

export interface IState {
  data: IBoard
  touchX: number
  touchY: number
  gameContainer: {
    current: any | null
  },
  gameOver: boolean,
  score: number
}