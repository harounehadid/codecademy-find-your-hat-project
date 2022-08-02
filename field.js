const prompt = require('prompt-sync')({sigint: true});

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

class Field {
  constructor(field) {
    this._field = field;
    this._allowedMovements = ['u', 'U', 'r', 'R', 'd', 'D', 'l', 'L'];
    this._curPosition = {x: 0, y: 0};
    this._isGameOver = false;
    this._isHatFound = false;
  }

  playGame() {
    this.displayWelcomeMessages();

    while (!this.isGameOver) {
      this.print();
      
      const directionInput = this.handlePlayerInput();
      this.updateGame(directionInput);
    }

    this.isHatFound ? this.displayWinningMes() : this.displayGameOverMes();
  }

  updateGame(direction) {
    this.updatePosition(direction);
    
    const isSafe = this.isInBoundaries() && !this.steppedOn(hole);
    if (isSafe) this.isHatFound = this.steppedOn(hat);

    if (!isSafe || this.isHatFound) {
      this.isGameOver = true;
      return;
    }
    
    this.updateField();
  }

  handlePlayerInput() {
    let directionInput = prompt(`Were are you running! `);

    while (!this.checkIfMovementAllowed(directionInput)) {
      console.log(`\n/!\\ Invalid input try again`);
      directionInput = prompt(`Were are you running! `);
    }

    return directionInput;
  }

  checkIfMovementAllowed(movement) {
    return this.allowedMovements.includes(movement);
  }

  updatePosition(direction) {
    direction = direction.toLowerCase();
    const nextPos = this.curPosition;
    
    if (direction === 'u') {
      nextPos.y--;
    }
    else if (direction === 'r') {
      nextPos.x++;
    }
    else if (direction === 'd') {
      nextPos.y++;
    }
    else if (direction === 'l') {
      nextPos.x--;
    }
    else {
      console.warn(`There is something wrong with the direction input!`);
    }

    this.curPosition = nextPos;
  }

  isInBoundaries() {
    return (
      this.curPosition.x >= 0 && 
      this.curPosition.y >= 0 &&
      this.curPosition.y < this.field.length &&
      this.curPosition.x < this.field[0].length
    );
  }

  steppedOn(fieldCharacter) {
    const {x, y} = this.curPosition;
    return this.field[y][x] === fieldCharacter;
  }

  updateField() {
    const {x, y} = this.curPosition;
    this.field[y][x] = pathCharacter;
  }
  // Printing Methods ----- -----
  displayWelcomeMessages() {
    console.log(`\n_Welcome to this game, watchout where you walk!_`);
    console.log(`Here are the controls available:`);
    console.log(`--------------------------`);
    console.log(`  u or U to move up`);
    console.log(`  r or R to move right`);
    console.log(`  d or D to move down`);
    console.log(`  l or L to move left`);
    console.log(`--------------------------`);
  }

  print() {
    const fieldToPrint = this.field.map(row => row.join(''));
    console.log('');
    fieldToPrint.forEach(row => console.log(row));
    console.log('');
  }

  displayGameOverMes() {
    console.log(`\n -GAME OVER- \n  YOU LOST!`);
  }

  displayWinningMes() {
    console.log(`\n CONGRATS \n  YOU WON!`);
  }

  // Static & Related Methods ----- -----
  static generateField(width, height, holesPercentage) {

    let holesToAdd = Field.calculateHolesNumber(width * height, holesPercentage);
    console.log(holesToAdd);
    const newField = [];
    
    for (let i = 0; i < height; i++) {
      newField[i] = [];
      for (let j = 0; j < width; j++) {
        // Covering the whole of the field with fieldCharacter
        newField[i][j] = fieldCharacter;
      }
    }

    // Tracing the initial position
    newField[0][0] = pathCharacter;

    // Adding the hat to random position
    const hatPos = {
        x: Math.floor(Math.random() * width),
        y: Math.floor(Math.random() * height)
    };
    // -> To avoid putting the hat at the position (0, 0)
    while (hatPos.x === 0 && hatPos.y === 0) {
        hatPos.x = Math.floor(Math.random() * width);
        hatPos.y = Math.floor(Math.random() * height);
    }
    
    newField[hatPos.y][hatPos.x] = hat;

    // Add the holes
    while(holesToAdd > 0) {     
        for (let i = 0; i < height; i++) {
            for (let j = 0; j < width; j++) {
            let addHole = (Math.random() * 10) > 8;
                const curElement = newField[i][j];
                if (addHole && curElement === fieldCharacter) {
                    newField[i][j] = hole;
                    holesToAdd--;
                }
            }
        }
    }

    return newField;
  }

  static calculateHolesNumber(cellsNumber, percentage) {
    return Math.floor(cellsNumber * percentage / 100);
  }
  // Getters & Setters  -----  -----
  get curPosition() {
    return this._curPosition;
  }
  set curPosition(nextPos) {
    this._curPosition = nextPos;
  }

  get field() {
    return this._field;
  }
  set field(field) {
    this._field = field;
  }

  get isGameOver() {
    return this._isGameOver;
  }
  set isGameOver(bool) {
    this._isGameOver = bool;
  }

  get allowedMovements() {
    return this._allowedMovements;
  }

  get isHatFound() {
    return this._isHatFound;
  }
  set isHatFound(found) {
    this._isHatFound = found;
  }
  // ----- ----- ----- ----- -----
}

module.exports = Field;
