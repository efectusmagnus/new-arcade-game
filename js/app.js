let allEnemies;
let player;
let allWater;
let allGems;
let score = 0;

const enemySpeed = [2, 2.1, 3, 3.5, 4, 4.5/*, 5, 5.5, 6, 6.5, 7*/];
const gemSprites = ['images/gem-blue.png', 'images/gem-orange.png', 'images/gem-green.png'];
const gemPosX = [13, 114, 216, 316, 417];
const gemPosY = [132, 216, 300]; //119, 200, 285
const tileWidth = 101;
const tileHeight = 83;
const bugSizeX = 85;//75
const bugSizeY = 60;
/*The game beginns when the player is selected*/
/*This `sprite` argument makes reference to the players on the startpage*/
const startGame = function(sprite) {
  // Enemies our player must avoid
  const Enemy = function(y) {
      this.sprite = 'images/enemy-bug.png'; //loads enemy's image
      this.x = -tileWidth; //-101: beginns outside the game board
      this.y = y; //Described below: 55, 140, 224
      this.width = 100;
      this.height = 180;
      //this.y = bugSizeY + tileHeight * position; /* 60: corresponds to the
      //relationship between the position of the street in the y axis and the bug.
      //83: to the proximity of bugs to each other in the y axis. And the positions
      //go from 0 to 2, coresponding to the three tiles (boxes)*/
      //Random speed
      this.speed = enemySpeed[Math.floor(Math.random() * enemySpeed.length)];
  };
  // Update the enemy's position, required method for game
  // Parameter: dt, a time delta between ticks
  Enemy.prototype.update = function(dt) {
      // Multiply any movement by the dt parameter
      // which will ensure the game runs at the same speed for all computers.
      if (this.x < 506) { // 506 is the width of the canvas ;)
        this.x += bugSizeX * this.speed * dt; // 85 for bugSizeY
      } else { //Make the bug reappear on the left side again
        this.x = -tileWidth; // Negative, to make the illusion of coming from the left
      }
      'use strict';
      const spaceBox = 60;/*In a scale from 0 to 100, 0: the bug goes through
      player and nothing happens. 100: The extremities of the player are enough
      for the bug to make the player return to the start position */
      // If the player touches the bug
      if ((player.x < this.x + spaceBox) && (player.x + spaceBox > this.x) &&
        (player.y < this.y + spaceBox) && (spaceBox + player.y > this.y)) {
        player.reset();
        if (player.waterScore < 20) { //While the score is under 20
          player.waterScore = 0;// Take his points from him (give him `0` score)
        }
        if (player.life > 0) { //If there are still hearts
          player.life -= 1; //decrement by 1 the players heart
        }
      }
  };

  // Draw the enemy on the screen
  Enemy.prototype.render = function() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
  };

  // player class
  // This class requires an update(), render() and
  // a handleInput() method.
  const Player = function(image) {
    this.sprite = image;
    this.x = 1 + 100 * 2; // 1 + 100 * 2 = 202 /*tried with one value, but didn't work*/
    this.y = 60 + 85 * 4; //60 + 85 * 4 = 572
    this.width = 101;
    this.height = 170;
    this.dx = 0;
    this.dy = 0;
    //this.collision = false;
    this.waterScore = 0;
    this.gemScore = 0;
    this.totalScore = this.waterScore + this.gemScore;
    this.life = 3;
    this.playing = true;
    //this.won = false;
    //this.lost = false;
  };
  //Update the players position
  Player.prototype.update = function(dt) {
    this.x += this.dx;
    this.y += this.dy;
    this.dx = 0;
    this.dy = 0;

    'use strict'
    const box = 20;//60
    //If the player doesn't touch the bug
    if (player.y < box) { // and reaches the river,
      this.waterScore += 1; // give the player a point (augment the water score)
      this.reset(); //resets the player (returns the player to startpoint)
    }
  };

  //Render the player on the screen
  Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    //if the players wins
    if ((this.gemScore === 20) || (this.waterScore === 20) || (this.gemScore + this.waterScore === 20)) {
      this.reset();/*this refers to player :)*/
      this.playing = false;
      ctx.drawImage(Resources.get('images/game-won.png'), 0, 0, 505, 585);
    }
    //If there are no lifes left
    if(player.life <= 0) {
      this.reset();
      this.playing = false;
      ctx.drawImage(Resources.get('images/game-lost.png'), 0, 0, 505, 585);
    }
  };

  //Handle input for when keyborard is pressed. Defining player bounderies
  Player.prototype.handleInput = function(pressed) {
    if ((pressed === "left") && (this.x > 0)) {
        this.dx = -tileWidth; // -101
    }
    if ((pressed === "up") && (this.y > 0)) {
        this.dy = -tileHeight;// -83
    }
    if ((pressed === "right") && (this.x < 400)) {
        this.dx = tileWidth; // 101
    }
    if ((pressed === "down") && (this.y < 400)) { //Before 385
        this.dy = tileHeight; // 83
    }
    this.update();
  };
  //Handle input for when control button is clicked. Defining player bounderies
  Player.prototype.handleInput2 = function(clicked) {
    if ((clicked === "left") && (this.x > 0)) {
      this.dx = -tileWidth; // -101
    }
    if ((clicked === "up") && (this.y > 0)) {
      this.dy = -tileHeight; // 83
    }
    if ((clicked === "right") && (this.x < 400)) {
      this.dx = tileWidth; //101
    }
    if ((clicked === "down") && (this.y < 400)) {//Before 385,400
      this.dy = tileHeight; //83
    }
    this.update();
  };

  Player.prototype.reset = function() {
    this.x = 1 + 100 * 2; // 1 + 100 * 2 = 202
    this.y = 60 + 85 * 4; // 60 + 85 * 4 = 400
    this.dx = 0;
    this.dy = 0;
  };

  //variables for the hearts
  let Heart = function(x) {
    this.sprite = 'images/heart.png';
    this.x = x;
    this.y = 6;
    //Size of hearts
    this.width = 43;//45
    this.height = 38; //40
  }
  //Renders hearts on stone banner
  Heart.prototype.render = function() {
    let x = 0;
    for (let i = 0; i < player.life; i++) {
      ctx.drawImage(Resources.get(this.sprite), x, this.y, this.width, this.height);
      x = x + 40;
    }
  };

  let Water = function(x, waterScore) {
    this.sprite = 'images/drop.png';
    this.x = x;
    this.y = 5;
    //Size of hearts
    this.width = 38; //30
    this.height = 40;//38
  }

  //Renders water drop on stone banner
  Water.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    //Renders water score with white color and 2em
    ctx.font = '2em sans-serif';
    ctx.fillStyle = 'white';
    if (player.playing) { //if the player is playing, show the water score
      ctx.fillText(`${player.waterScore}`,195, 30);
    }
    ctx.textBaseline = 'middle';
  }

  // Varia for gem score
  let GemScore = function(x) {
    this.sprite = 'images/gem-point.png';
    this.x = x;
    this.y = 8;
    //Size of hearts
    this.width = 38;
    this.height = 38;
  }
  //Renders gem score on stone banner
  GemScore.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
    //Renders gem score with white color and 2em
    ctx.font = '2em sans-serif';
    ctx.fillStyle = 'white';
    if (player.playing) {
      ctx.fillText(`${player.gemScore}`,305, 30);////if the player is playing, show the gem score
    }
    ctx.textBaseline = 'middle';
  };

  //variables for gems
  let Gem = function(gem) {
    this.sprite = gemSprites[Math.floor(Math.random() * gemSprites.length)];
    this.x = gemPosX[Math.floor(Math.random() * gemPosX.length)];
    this.y = gemPosY[Math.floor(Math.random() * gemPosY.length)];
    //Size of hearts
    this.width = 58;//78
    this.height = 58;//79
  }

  Gem.prototype.update = function() {
    const pHeight = 15; //player height diminued. 170/2 = 85, 170/6.8 = 25
    const pWidth = 20; //player width diminued
    const gemH = 15; //gem height diminued
    const gemW = 15; //gem width diminued
    if ((player.x < this.x + gemW) && (player.x + pWidth > this.x) &&
      (player.y < this.y + gemH) && (75 + player.y > this. y)){ //75 or 85 for player height, less will not work :/
      if (player.gemScore < 20) {
        player.gemScore++;
      }
      //Ramdom gem values
      this.sprite = gemSprites[Math.floor(Math.random() * gemSprites.length)];
      this.x = gemPosX[Math.floor(Math.random() * gemPosX.length)];
      this.y = gemPosY[Math.floor(Math.random() * gemPosY.length)];
    }
  };

  //Renders gems on game board
  Gem.prototype.render = function(player) {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y, this.width, this.height);
  }
  /*
  var randomSpeed = function random(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  */

  // Now instantiate your objects.
  allGemScores = [new GemScore(260)];
  allGems = [new Gem()];
  allWater = [new Water(150)]; /*x position of water drop*/
  allHearts = [new Heart()];
  // Place all enemy objects in an array called allEnemies
  allEnemies = [new Enemy(55), new Enemy(140), new Enemy(224)]; /*The parameters define
  the positions of the bugs in the Y axis. 55, 140, 224*/
  // Place the player object in a variable called player
  const createPlayer = function(sprite) {
    player = new Player(sprite);
  };
  //This listens for key presses and sends the keys to Player.handleInput() method.
  document.addEventListener('keyup', function(e) {
      var allowedKeys = {
          37: 'left',
          38: 'up',
          39: 'right',
          40: 'down'
      };

       player.handleInput(allowedKeys[e.keyCode]);
  });
  /* Inspiration from this video called "Handling Events for many elements":
   https://www.youtube.com/watch?v=Xwq1Hj1DyDM */
  //This listens for clicks and sends the clicks to Player.handleInput2() method.
  var theParent = document.querySelector("#btn-panel");
  theParent.addEventListener("click", getChildren, false);
  function getChildren(e) {
  	if (e.target !== e.currentTarget) {
        var clickedItem = e.target.id;
        player.handleInput2(clickedItem);
      }
      e.stopPropagation();
  }

  createPlayer(sprite);
  //createGem(allGems);
  startEngine(); // This function is on the `engine.js` file
  //don't show the game board (until the player is selected)
  document.querySelector('#pickup-player').style.display = "none";
  document.querySelector('#restart-btn1').style.display = "block";
  /*Code from: https://www.wikitechy.com/tutorials/javascript/best-way-to-detect-a-mobile-device*/
  //Display control buttons if mobile device is detected;
  if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
    document.querySelector('#btn-panel').style.display = "block";
  }
};

/*Code from: https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_popup*/
// When the user clicks on div, open the popup
function popupInfo() {
    var popup = document.getElementById("myPopup");
    popup.classList.toggle("show");
}
