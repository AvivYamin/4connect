
class Event {
    constructor() {
      this.listeners = []; //Empty array of listeners 
    }
  
    addListener(listener) {
      this.listeners.push(listener); //Method of the event obj, pushes a new listener () to the listeners array ? 
    }
  
    trigger(params) {
      this.listeners.forEach(listener => { listener(params); }); //Method of the event obj, for each listener () it activates a function () ?
    }
}

class TicTacToe { //The model
    constructor() {
      this.board = Array(9).fill(); //Generates new array with the length of 9 and each cell is empty field --> [undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined] 
      this.currentPlayer = 'X'; //Current player's value in initilaization is 'X'
      this.finished = false; //Flag for finished game (Boolean), initial with flase;
    
      this.updateCellEvent = new Event(); 
      this.victoryEvent = new Event();
      this.drawEvent = new Event();
    }
  
    play(move) { //Play function receives a move number 
      if (this.finished || //Check if game is finished
        move < 0 || // Checks that the move is positive
         move > 8 || // Check if it the move is the maximum moves possible (9)
          this.board[move] //Check the value of the board array in the move number index to equal "undefined"
          ) { return false; } // if one of the conditions for a gameover is true than returns false
  
      this.board[move] = this.currentPlayer; // Inserts the value of the current player (X/O) to the cell of the board array
      this.updateCellEvent.trigger({ move, player: this.currentPlayer }); // Triggers and update cell event with an object with the move number and inserts the current player to the player key 
  
      this.finished = this.victory() || this.draw(); // inserts the boolean value of the functions victory and draw(false by default)
  
      if (!this.finished) { this.switchPlayer(); } // if the value did not change to true than activate switch player
  
      return true; //returns true
    }
  
    victory() { //Function with victory possibilites (l = line cell out of the lines array) 
      const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
      ];
  
      const victory = lines.some(l => this.board[l[0]] // Inserts a boolean value to victory variable
        && this.board[l[0]] === this.board[l[1]] // true : if the first cell of the line equals the second and the third
        && this.board[l[1]] === this.board[l[2]]);
  
      if (victory) { //If the victory value is true then triggers a victory event with the winner(X/O)
        this.victoryEvent.trigger(this.currentPlayer);
      }
  
      return victory; //Returns the boolean value of victory variable
    }
  
    draw() {
      const draw = this.board.every(i => i); //checks if every cell in the board has a value (not undefined)
  
      if (draw) {
        this.drawEvent.trigger(); //trigers draw event
      }
  
      return draw; //returns the boolean value 
    }
  
    switchPlayer() {
      this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X'; //puts the opposite value of the current player to currentplayer
    }
}

class View {
    constructor() {
      this.playEvent = new Event();
    }
  
    render() { //updates the DOM
      const board = document.createElement('div');
      board.className = 'board';
      this.cells = Array(9).fill().map((_, i) => { //For each cell in the array create a sub element and insert it in array of elements called this.cells
        const cell = document.createElement('div');
        cell.className = 'cell';
  
        cell.addEventListener('click', () => { //adds a click listener to each cell element
          this.playEvent.trigger(i); //on click it triggers the play event with the i number argument
        });
  
        board.appendChild(cell); // appends the cell element to the board
  
        return cell;
      });
  
      this.message = document.createElement('div'); //creates a div element for a messege and appends it to the body
      this.message.className = 'message';
  
      document.body.appendChild(board);
      document.body.appendChild(this.message);
    }
  
    updateCell(data) { //recieves a data object with move index key(number) and player key(X/O) and inserts the player to to this.cells[index]
      this.cells[data.move].innerHTML = data.player; 
    }
  
    victory(winner) {
      this.message.innerHTML = `${winner} wins!`; //annonce the winer when there's a victory from the model
    }
  
    draw() {
      this.message.innerHTML = "It's a draw!"; //annonces a draw when there's a draw from the model
    }
}

class Controller {
    constructor() {

      this.model = new TicTacToe(); //creates the model
      console.log(this.model);
      this.view = new View(); //creates the viewer
      console.log(this.view);

      this.view.playEvent.addListener(move => { this.model.play(move); });  //adds a "move" listener from the viewer to a play event that triggers the model to play the move(number)

      this.model.updateCellEvent.addListener(data => { this.view.updateCell(data); }); //updates the cell element in the viewer that listens to chage in data 
      this.model.victoryEvent.addListener(winner => { this.view.victory(winner); }); //updates the DOM with the winner messege on case of a win event
      this.model.drawEvent.addListener(() => { this.view.draw(); }); //updates the DOM with the draw messege on case of a draw event
    }
  
    run() {
      this.view.render(); //initializes the DOM with the render setup
    }
}

const app = new Controller(); //creates the new controller

app.run(); // runs the render to setup the initial DOM



render() {
    const board = document.createElement('div');
    board.className = 'board';

    this.collums = Array(7).fill().map((_, i) => {
        const collum = document.createElement('div');
        collum.className = 'collum';
        collum.addEventListener('click', () => {
            console.log(i);
            this.playEvent.trigger(i);
        });
        board.appendChild(collum);
        return collum;
    });