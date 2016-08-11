var canvas = document.getElementById("game-canvas");
var context = canvas.getContext("2d");
var ballRadius = 7,
    ballX = canvas.width/ 2,
    ballY = canvas.height-30,
    //ballDeltaX i ballDeltaY kontrolirat ball speed moje da
    // se smenqt s bonus: speed pri collision primerno
    ballDeltaX = 2,
    ballDeltaY = -2,
    //pada e mnogo grozen !!!
    padHeight = 10,
    padWidth = 75,
    paddleX = ((canvas.width-padWidth)/2) ,
    rightPressed = false,
    leftPressed = false,
    brickRows = 7,
    brickCols = 4,
    brickWidth = 75,
    brickHeight = 20,
    //bricksImagesPaths = ["images/brick.png", "images/purple-brick.png", "images/yellow-brick.png", "images/green-brick.png", "images/pink-brick.png"],
    brickPadding = 5,
    brickOffsetTop = 35,
    brickOffsetLeft = 35,
    // ne mi haresva score//lives !!! no da ima poveche
    score = 0,
    lives = 3;

var bricks = [];
for(let c=0; c<brickCols; c+=1) {
    bricks[c] = [];
    for(let r=0; r<brickRows; r+=1) {
        // brickLifes moje da e poveche ot 1 da napravim bricks koito se chupat ot 2-3 udara
        // primerno if r % 2 === 0 brickLife: 2
        // ili brickPower : false
        // if r % 5 === 0 brickPower:true i shhte se dobavi pri collision da dropva power
        // posle power pri collusion s pada razlichnite bonusi/anti-bonusi
        bricks[c][r] = { x: 0, y: 0, brickLives: 1 , brickPower : false};
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);


function keyDownHandler(ev) {
    if(ev.keyCode == 39) {
        rightPressed = true;
    }
    else if(ev.keyCode == 37) {
        leftPressed = true;
    }
}
function keyUpHandler(ev) {
    if(ev.keyCode == 39) {
        rightPressed = false;
    }
    else if(ev.keyCode == 37) {
        leftPressed = false;
    }
}

function collisionDetection() {
    for(let c=0; c<brickCols; c+=1) {
        for(let r=0; r<brickRows; r+=1) {
            var currentBrick = bricks[c][r];
            // pri povechko lifes trqbwa da se smenqt prowerkite
            // kakto i da se promenqt primerno imgs ili pone da svetkat
            if(currentBrick.brickLives == 1) {
                if( ballX - ballRadius > currentBrick.x &&
                    ballX - ballRadius< currentBrick.x + brickWidth &&
                    ballY - ballRadius> currentBrick.y &&
                    ballY - ballRadius < currentBrick.y + brickHeight) {
                    ballDeltaY *= -1;
                    currentBrick.brickLives = 0;
                    score++;
                    if(score == brickRows*brickCols) {
                        // Victory screen s menu za start new game
                        // ili return to main screen i highScore zapis
                        // i tn...
                        document.location.reload();
                    }
                }
            }
        }
    }
}

function drawBall() {
    //let image = new Image();
    //image.src = "images/lemon-slice.png";
    //let pattern = context.createPattern(image,'repeat');
    context.beginPath();
    context.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    // yellow cvqt na topkata izglejda otvratitelno v momenta
    context.fillStyle = "green";
    context.fill();
    context.closePath();
}
function drawPaddle() {
    context.beginPath();
    context.rect(paddleX, canvas.height-padHeight, padWidth, padHeight);
    context.fillStyle = "black";
    context.fill();
    context.closePath();
}
function drawBricks() {
    for(let c=0; c<brickCols; c+=1) {
        for(let r=0; r<brickRows; r+=1) {
            //smqna na proverkata ako pravim tuhli s poveche lives
            if(bricks[c][r].brickLives == 1) {
                let brickX = (r*(brickWidth+brickPadding))+brickOffsetLeft;
                let brickY = (c*(brickHeight+brickPadding))+brickOffsetTop;
                let image = new Image();
                image.src = "images/brick.png";
                let pattern = context.createPattern(image,'repeat');
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                context.beginPath();
                context.rect(brickX, brickY, brickWidth, brickHeight);
                context.fillStyle = pattern;
                context.fill();
                context.closePath();
            }
        }
    }
}
function drawScore() {
    context.font = "15px";
    context.fillStyle = "red";
    context.fillText("Total score: "+score, 8, 20);
}
function drawLives() {
    context.font = "15px";
    context.fillStyle = "red";
    context.fillText("Lives left: "+lives, canvas.width-65, 20);
}
function padMovement(){
    if(rightPressed && paddleX < canvas.width - (padWidth -3)) {
        paddleX += 5;
    }
    else if(leftPressed && paddleX > 3) {
        paddleX -= 5;
    }
}
function collisionWithWalls(){
    if(ballX + ballDeltaX > canvas.width-ballRadius || ballX + ballDeltaX < ballRadius) {
        ballDeltaX *= -1;
    }
    if(ballY + ballDeltaY < ballRadius) {
        ballDeltaY *= -1;
    }
    else if(ballY + ballDeltaY > canvas.height-ballRadius) {
        if(ballX - ballRadius > paddleX &&
            ballX - ballRadius < paddleX + padWidth) {
            ballDeltaY *= -1;
        }
        else {
            lives--;
            if(!lives) {
                //Game Over screen s menu i tn i tn
                //ili gameOver() koqto vika screen
                document.location.reload();
            }
            else {
                // da dobavim timeout ili da popva nqkakuv button Continue
                // koito da produljava igrata sus sledvashtiq live
                ballX = canvas.width/2;
                ballY = canvas.height-30;
                ballDeltaX = 2;
                ballDeltaY = -2;
                paddleX = (canvas.width-padWidth)/2;
            }
        }
    }
}
function draw() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    collisionWithWalls();
    padMovement();

    ballX += ballDeltaX;
    ballY += ballDeltaY;
    requestAnimationFrame(draw);
}

draw();