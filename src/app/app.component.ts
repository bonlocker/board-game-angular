import { Component, AfterViewInit, ViewChild, ElementRef, HostListener } from '@angular/core';


export enum KEY_CODE {
  RIGHT_ARROW = 39,
  LEFT_ARROW = 37,
  UP_ARROW = 38,
  DOWN_ARROW = 40
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  //@ViewChild('gameBoard') gameBoard: ElementRef
  title: string = 'board-game';
  gridHeight: number = 2;
  gridWidth: number = 2;
  boardCtx: CanvasRenderingContext2D;
  player: HTMLOrSVGImageElement;
  playerStepCount: number = 0;
  enemyCount: number;
  enemyPositions = [];
  playerPosition = {
    x: 0, y: 0
  }
  gameEnded = false;

  ngAfterViewInit() {
    this.getGridDimensions();
    this.generateGrid();
  }

  getGridDimensions() {
    this.gridWidth = parseInt(window.prompt('Enter board height (max 20)')) * 25;
    this.gridWidth = !this.gridWidth || this.gridWidth > 500 ? 250 : this.gridWidth;
    this.gridHeight = parseInt(window.prompt('Enter board width (max 20)')) * 25;
    this.gridHeight = !this.gridHeight || this.gridHeight > 500 ? 250 : this.gridHeight;
  }

  generateGrid() {
    let c = document.getElementById('gameBoard') as HTMLCanvasElement;
    this.boardCtx = c.getContext("2d");
    console.log(this.boardCtx)
    let p = 20;

    for (let x = 0; x <= this.gridWidth; x += 25) {
      this.boardCtx.moveTo(0.5 + x + p, p);
      this.boardCtx.lineTo(0.5 + x + p, this.gridHeight + p);
    }

    for (let x = 0; x <= this.gridHeight; x += 25) {
      this.boardCtx.moveTo(p, 0.5 + x + p);
      this.boardCtx.lineTo(this.gridWidth + p, 0.5 + x + p);
    }
    this.boardCtx.strokeStyle = "black";
    this.boardCtx.stroke();

    setTimeout(() => {
      this.initPlayer();
      this.renderEnemies();
    }, 500)
  }

  initPlayer() {
    this.player = document.getElementById('player') as HTMLOrSVGImageElement;
    this.playerPosition.x = Math.round((this.gridWidth) / 50) * 25;
    this.playerPosition.y = Math.round((this.gridHeight) / 50) * 25;
    this.renderPlayer();
  }

  renderPlayer() {
    this.boardCtx.drawImage(this.player, this.playerPosition.x, this.playerPosition.y);
    this.checkEnemies();
  }

  renderEnemies() {
    let enemy = document.getElementById('enemy') as HTMLOrSVGImageElement;
    this.enemyCount = this.gridHeight > this.gridWidth ? this.gridHeight / 25 : this.gridWidth / 25;
    console.log(this.enemyCount);
    let enemies = 0;
    for (let i = 25; i <= this.gridWidth; i += 25) {
      for (let j = 25; j <= this.gridHeight; j += 25) {
        if (Math.round(Math.random()) && this.playerPosition !== { x: i, y: j }) {
          this.boardCtx.drawImage(enemy, i, j);
          this.enemyPositions.push({ x: i, y: j });
          enemies++;
          if (enemies === this.enemyCount) break;
        }
        else { };
      } if (enemies === this.enemyCount) break;
    }
  }

  clearPreviousState(x, y) {
    let img = this.boardCtx.createImageData(15, 15);
    for (let i = img.data.length; --i >= 0;)
      img.data[i] = 0;
    this.boardCtx.putImageData(img, x, y);
  }


  moveRight() {
    if (this.playerPosition.x >= this.gridWidth) {
      return;
    }
    this.clearPreviousState(this.playerPosition.x, this.playerPosition.y)
    this.playerPosition.x += 25;
    this.renderPlayer();
    this.playerStepCount++;
  }

  moveLeft() {
    if (this.playerPosition.x === 25) {
      return;
    }
    this.clearPreviousState(this.playerPosition.x, this.playerPosition.y)
    this.playerPosition.x -= 25;
    this.renderPlayer();
    this.playerStepCount++;
  }

  moveUp() {
    if (this.playerPosition.y === 25) {
      return;
    }
    this.clearPreviousState(this.playerPosition.x, this.playerPosition.y);
    this.playerPosition.y -= 25;
    this.renderPlayer();
    this.playerStepCount++;
  }

  moveDown() {
    if (this.playerPosition.y >= this.gridHeight) {
      return;
    }
    this.clearPreviousState(this.playerPosition.x, this.playerPosition.y)
    this.playerPosition.y += 25;
    this.renderPlayer();
    this.playerStepCount++;
  }

  checkEnemies() {
    let enemyFound = this.enemyPositions.find((e)=>{return e.x===this.playerPosition.x && e.y===this.playerPosition.y});
    if (enemyFound) {
      console.log('Enemy encountered');
      this.enemyCount--;
      this.enemyPositions = this.enemyPositions.filter((e)=>{return !(e.x===this.playerPosition.x && e.y===this.playerPosition.y)});
      if (this.enemyCount === 0) {
        setTimeout(()=>{
          window.alert(`Victory!! You've defeated the game in ${this.playerStepCount} moves. Feel free to roam around`);
        },200)
        this.gameEnded = true;
      }
    }

  }

  @HostListener('window:keyup', ['$event'])
  keyEvent(event: KeyboardEvent) {
    //console.log(event);
    switch (event.keyCode) {
      case KEY_CODE.RIGHT_ARROW:
        this.moveRight();
        break;
      case KEY_CODE.LEFT_ARROW:
        this.moveLeft();
        break;
      case KEY_CODE.UP_ARROW:
        this.moveUp();
        break;
      case KEY_CODE.DOWN_ARROW:
        this.moveDown();
        break;
      default:
        console.log('Not a valid key');
        break;
    }
  }
}

