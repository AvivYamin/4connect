class Event {
    constructor() {
      this.listeners = [];
    }
  
    addListener(listener) {
      this.listeners.push(listener);
    }
  
    trigger(params) {
        // console.log(params);
      this.listeners.forEach(listener => { listener(params); });
    }
}

class Connect {
    constructor() {
      this.board = Array(42).fill();
      this.currentPlayer = 'X';
      this.finished = false;
    
      this.updateCellEvent = new Event();
      this.victoryEvent = new Event();
      this.drawEvent = new Event();
    }
  
    play(move) {
        // if (this.finished) { return false; }

    //  console.log(move);
    //   move = move % 7 + 35;
    //   move = this.addtoBottom(move);
    //   console.log(move)
    //   if (this.finished || move < 0 || move > 42 || this.board[move] || move) { return false; }
       this.board[move] = this.currentPlayer;
      this.updateCellEvent.trigger({ move, player: this.currentPlayer });
  
      this.finished = this.victory() || this.draw();
  
      if (!this.finished) { this.switchPlayer(); }
  
      return true;
    }

    addtoBottom(move) {
         if(move > 0){
             if(this.board[move]){
                 move = move - 7;
                 this.addtoBottom(move);
             }else{
                this.board[move] = this.currentPlayer;
                 return move;
             }
         }else{
             return false;
         }
    }
  
    victory() {
      const lines = [
        [0, 1, 2, 3],
        [41, 40, 39, 38],
        [7, 8, 9, 10],
        [34, 33, 32, 31],
        [14, 15, 16, 17],
        [27, 26, 25, 24],
        [21, 22, 23, 24],
        [20, 19, 18, 17],
        [28, 29, 30, 31],
        [13, 12, 11, 10],
        [35, 36, 37, 38],
        [6, 5, 4, 3],
        [0, 7, 14, 21],
        [41, 34, 27, 20],
        [1, 8, 15, 22],
        [40, 33, 26, 19],
        [2, 9, 16, 23],
        [39, 32, 25, 18],
        [3, 10, 17, 24],
        [38, 31, 24, 17],
        [4, 11, 18, 25],
        [37, 30, 23, 16],
        [5, 12, 19, 26],
        [36, 29, 22, 15],
        [6, 13, 20, 27],
        [35, 28, 21, 14],
        [0, 8, 16, 24],
        [41, 33, 25, 17],
        [7, 15, 23, 31],
        [34, 26, 18, 10],
        [14, 22, 30, 38],
        [27, 19, 11, 3],
        [35, 29, 23, 17],
        [6, 12, 18, 24],
        [28, 22, 16, 10],
        [13, 19, 25, 31],
        [21, 15, 9, 3],
        [20, 26, 32, 38],
        [36, 30, 24, 18],
        [5, 11, 17, 23],
        [37, 31, 25, 19],
        [4, 10, 16, 22],
        [2, 10, 18, 26],
        [39, 31, 23, 15],
        [1, 9, 17, 25],
        [40, 32, 24, 16],
        [9, 17, 25, 33],
        [8, 16, 24, 32],
        [11, 17, 23, 29],
        [12, 18, 24, 30],
        [1, 2, 3, 4],
        [5, 4, 3, 2],
        [8, 9, 10, 11],
        [12, 11, 10, 9],
        [15, 16, 17, 18],
        [19, 18, 17, 16],
        [22, 23, 24, 25],
        [26, 25, 24, 23],
        [29, 30, 31, 32],
        [33, 32, 31, 30],
        [36, 37, 38, 39],
        [40, 39, 38, 37],
        [7, 14, 21, 28],
        [8, 15, 22, 29],
        [9, 16, 23, 30],
        [10, 17, 24, 31],
        [11, 18, 25, 32],
        [12, 19, 26, 33],
        [13, 20, 27, 34],
      ];
  
      const victory = lines.some(l => this.board[l[0]]
        && this.board[l[0]] === this.board[l[1]]
        && this.board[l[1]] === this.board[l[2]] 
        && this.board[l[2]] === this.board[l[3]]);
  
      if (victory) {
        this.victoryEvent.trigger(this.currentPlayer);
      }
  
      return victory;
    }
  
    draw() {
      const draw = this.board.every(i => i);
  
      if (draw) {
        this.drawEvent.trigger();
      }
  
      return draw;
    }
  
    switchPlayer() {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    }
}

class View {
    constructor() {
      this.playEvent = new Event();
    }
  
    render() {
      const board = document.createElement('div');
      board.className = 'board';
    
    //   this.collums = Array(7).fill().map((_, i) => {
    //       console.log(i);
    //     const collum = document.createElement('div');
    //     collum.className = 'collum';

        // collum.addEventListener('click', () => {
        //     console.log(i);
        //     this.playEvent.trigger(i);
        // });
        //board.appendChild(collum);
       
    // });
  
      this.cells = Array(42).fill().map((_, i) => {
        const cell = document.createElement('div');
        cell.className = 'cell';
  
         cell.addEventListener('click', () => {
           this.playEvent.trigger(i);
         });
        board.appendChild(cell);
        return cell;
      });
  
      this.message = document.createElement('div');
      this.message.className = 'message';
  
      document.body.appendChild(board);
      document.body.appendChild(this.message);
    }
  
    updateCell(data) {
        // console.log(data);
      this.cells[data.move].innerHTML = data.player;
    }
  
    victory(winner) {
      this.message.innerHTML = `${winner} wins!`;
    }
  
    draw() {
      this.message.innerHTML = "It's a draw!";
    }
}

class Controller {
    constructor() {
      this.model = new Connect();
      this.view = new View();
  
      this.view.playEvent.addListener(move => { this.model.play(move); });
  
      this.model.updateCellEvent.addListener(data => { this.view.updateCell(data); });
      this.model.victoryEvent.addListener(winner => { this.view.victory(winner); });
      this.model.drawEvent.addListener(() => { this.view.draw(); });
    }
  
    run() {
      this.view.render();
    }
}

const app = new Controller();
  
app.run();
