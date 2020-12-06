import React from 'react'
import { IState, IBoard } from './type';
import './index.scss';

// 复制一份数组
function copy(board: IBoard): IBoard {
  let newBoard: IBoard = JSON.parse(JSON.stringify(board));
  newBoard = newBoard.map(row => {
    return row.map(item => Number(item));
  })
  return newBoard;
}

// 在棋盘的四个角中随机生成 1 个 "2"
function generate(board: IBoard): IBoard {
  let poses = [[0, 0], [0, 3], [3, 3], [3, 0]];
  let emptyPoses = poses.filter(pos => {
    let [row, col] = pos;
    return board[row][col] === 0;
  })
  if (emptyPoses.length === 0) {
    return board;
  }
  let len = emptyPoses.length;
  let randomPos = Math.floor(Math.random() * len);
  let [row, col] = emptyPoses[randomPos];
  let newBoard = copy(board);
  newBoard[row][col] = 2;
  return newBoard;
}

export default class index<T> extends React.Component {
  public state: IState;

  constructor(props: T) {
    super(props);
    this.state = {
      data: [
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0],
        [0,0,0,0]
      ],
      touchX: 0,
      touchY: 0,
      gameContainer: {
        current: null
      },
      gameOver: false,
      score: 0
    }
  }

  left() {
    let board = copy(this.state.data);
    let mergeTime = 0;
    let score = 0;
    const merge = () => {
      for (let i = 0; i < board.length; i++) {
        let row = board[i];
        for (let j = row.length - 2; j >= 0; j--) {
          if (row[j] === row[j+1] && row[j] !== 0) {
            row[j] = row[j] * 2;
            score += row[j];
            row[j+1] = 0;
            mergeTime++;
          }
        }
      }
    }
    const gather = () => {
      mergeTime = 0;
      for (let i = 0; i < board.length; i++) {
        let row = board[i];
        for (let j = 0; j < row.length; j++) {
          if (row[j] !== 0) {
            let pos = j-1;
            while (pos >= 0 && row[pos] === 0) {
              row[pos] = row[pos+1];
              row[pos+1] = 0;
              pos--;
            }
          }
        }
      }
    }
    do {
      gather();
      merge();
    } while (mergeTime > 0);
    this.updateData(board);
    this.updateScore(score);
  }

  up() {
    let board = copy(this.state.data);
    let mergeTime = 0;
    let score = 0;
    const merge = () => {
      for (let i = 0; i < board[0].length; i++) {
        for (let j = board.length - 2; j >= 0; j--) {
          if (board[j][i] === board[j+1][i] && board[j][i] !== 0) {
            board[j][i] = board[j][i] * 2;
            score += board[j][i];
            board[j+1][i] = 0;
            mergeTime++;
          }
        }
      }
    }
    const gather = () => {
      mergeTime = 0;
      for (let i = 0; i < board[0].length; i++) {
        for (let j = 1; j < board.length; j++) {
          if (board[j][i] !== 0) {
            let pos = j-1;
            while (pos >= 0 && board[pos][i] === 0) {
              board[pos][i] = board[pos+1][i];
              board[pos+1][i] = 0;
              pos--;
            }
          }
        }
      }
    }
    do {
      gather();
      merge();
    } while (mergeTime > 0);
    this.updateData(board);
    this.updateScore(score);
  }

  right() {
    let board = copy(this.state.data);
    let mergeTime = 0; // 上一次合并的次数
    let score = 0;
    const merge = () => {
      for (let i = 0; i < board.length; i++) {
        let row = board[i];
        for (let j = 1; j < row.length; j++) {
          if (row[j] === row[j-1] && row[j] !== 0) {
            row[j] = row[j] * 2;
            score += row[j];
            row[j-1] = 0;
            mergeTime++;
          }
        }
      }
    }
    const gather = () => {
      mergeTime = 0;
      for (let i = 0; i < board.length; i++) {
        let row = board[i];
        for (let j = row.length - 1; j >= 0; j--) {
          if (row[j] !== 0) {
            let pos = j+1;
            while (pos < row.length && row[pos] === 0) {
              row[pos] = row[pos-1];
              row[pos-1] = 0;
              pos++;
            }
          }
        }
      }
    }
    do {
      gather();
      merge();
    } while (mergeTime > 0);
    this.updateData(board);
    this.updateScore(score);
  }

  down() {
    let board = copy(this.state.data);
    let mergeTime = 0;
    let score = 0;
    const merge = () => {
      for (let i = 0; i < board[0].length; i++) {
        for (let j = 1; j < board.length; j++) {
          if (board[j][i] === board[j-1][i] && board[j][i] !== 0) {
            board[j][i] = board[j][i] * 2;
            score += board[j][i];
            board[j-1][i] = 0;
            mergeTime++;
          }
        }
      }
    }
    const gather = () => {
      mergeTime = 0;
      for (let i = 0; i < board[0].length; i++) {
        for (let j = board.length - 1; j >= 0; j--) {
          if (board[j][i] !== 0) {
            let pos = j+1;
            while (pos < board.length && board[pos][i] === 0) {
              board[pos][i] = board[pos-1][i];
              board[pos-1][i] = 0;
              pos++;
            }
          }
        }
      }
    }
    do {
      gather();
      merge();
    } while (mergeTime > 0);
    this.updateData(board);
    this.updateScore(score);
  }

  updateScore = (score: number) => {
    this.setState({
      score: score + this.state.score
    })
  }

  gameTruthOver = (data: IBoard): boolean => {
    // 1. 所有格子都不是空的 2. 相邻的格子不能有相同的
    let isHaveEmpty = false;
    outEmpty: for (let i = 0; i < data.length; i++) {
      let row = data[i];
      for (let j = 0; j < data[i].length; j++) {
        if (row[j] === 0) {
          isHaveEmpty = true;
          break outEmpty;
        }
      }
    }
    if (isHaveEmpty) {
      return false;
    }
    let isOver = true;
    outRow: for (let i = 0; i < data.length; i++) {
      let row = data[i];
      for (let j = 1; j < data[i].length; j++) {
        if (row[j] === row[j-1]) {
          isOver = false;
          break outRow;
        }
      }
    }
    if (isOver === false) return isOver;
    outCol: for (let i = 0; i < data.length; i++) {
      for (let j = 1; j < data[i].length; j++) {
        if (data[j][i] === data[j-1][i]) {
          isOver = false;
          break outCol;
        }
      }
    }
    return isOver;
  }

  updateData = (data: IBoard) => {
    let gameOver = this.gameTruthOver(data);
    let newBoard;
    if (!gameOver) {
      newBoard = generate(data);
    }
    this.setState({
      data: newBoard || data,
      gameOver
    });
  }

  initKeyListener = () => {
    document.onkeydown = (ev) => {
      ev = ev || window.event;
      switch(ev.keyCode){
        case 37:
          this.left();
          break;
        case 38:
          this.up();
          break;
        case 39:
          this.right();
          break;
        case 40:
          this.down();
          break;
      }
    }
  }

  touchStart(touch: Touch) {
    this.setState({
      touchX: touch.pageX,
      touchY: touch.pageY
    })
  }

  touchEnd(touch: Touch) {
    let { touchX, touchY } = this.state;
    let { pageX, pageY } = touch;
    let gapX = pageX - touchX;
    let gapY = pageY - touchY;
    if (Math.abs(gapX) > Math.abs(gapY)) { // x轴滑动距离大
      if (gapX >= 0) {
        this.right();
      } else {
        this.left();
      }
    } else {
      if (gapY >= 0) {
        this.down();
      } else {
        this.up();
      }
    }
    
  }

  initTouchListener() {
    (this.state.gameContainer.current as any).ontouchstart = (ev: TouchEvent) => {
      this.touchStart(ev.changedTouches[0]);
    }
    (this.state.gameContainer.current as any).ontouchend = (ev: TouchEvent) => {
      this.touchEnd(ev.changedTouches[0]);
    }
  }

  // 重新开始
  reset() {
    let data = [
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0],
      [0,0,0,0]
    ];
    let initState = generate(generate(data));
    this.setState({
      data: initState,
      touchX: 0,
      touchY: 0,
      gameOver: false
    })
  }

  componentDidMount() {
    // 监听键盘的上下左右四个按键
    this.initKeyListener();
    // 监听手指滑动的事件
    this.initTouchListener();
    let initState = generate(this.state.data);
    this.updateData(initState);
    this.setState({
      gameContainer: React.createRef()
    })
  }

  render() {
    return (
      <div className="game-container" ref={this.state.gameContainer}>
        {
          this.state.gameOver === true
            ? (
              <div className="game-over" />
            )
            : <div />
        }
        {
          this.state.data.map(row => {
            return row.map((item, index) => {
              return (
                <div className={['square', 'back-'+item ].join(' ')} key={index}>
                  {item === 0 ? null : item}
                </div>
              )
            })
          })
        }
        <div className="handle-area">
          <div className="score">分数：{ this.state.score }</div>
          <button className="reset" onClick={() => this.reset()}>重新开始</button>
        </div>
      </div>
    )
  }
}