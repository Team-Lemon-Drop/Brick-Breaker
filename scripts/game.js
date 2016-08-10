function createGame(canvasSelector) {
    var canvas = document.querySelector(canvasSelector),
        context = canvas.getContext("2d"),

        ball = generateBall(),
        ballImage = new Image(),
        ballImagePath = "images/lemon-slice.png",
        ballDeltaX = ball.direction[0],
        ballDeltaY = ball.direction[1],
        prevCoordinatesX,
        prevCoordinatesY,
        isMoving = false,

        pad = generatePad(),
        padMovingSpeed = 5,
        padOffset = 30,
        onLeftArrowPressed = false,
        onRightArrowPressed = false,

        bricks = [],
        bricksImagesPaths = ["images/brick.png", "images/purple-brick.png", "images/yellow-brick.png", "images/green-brick.png", "images/pink-brick.png"],
        numberOfBricksInRow = 8,
        numberOfBricksInCol = 5,
        
        lives = 3;

    document.getElementById('game-canvas').style.cursor = 'none';//hides the cursor

    

    function gameLoop() {
        printLives();
        drawBall(ball, context);
        //changed to keydown
        window.addEventListener('keydown', function (ev) {
            if ((ev.keyCode == 32)  && isMoving === false) {
                moveBall();
                isMoving = true;
            }
            if (ev.keyCode == 39) {
                //console.log(ev);
                onRightArrowPressed = true;
                onLeftArrowPressed = false;
                movePad();

            } else if (ev.keyCode == 37) {
                //console.log(ev);
                onRightArrowPressed = false;
                onLeftArrowPressed = true;
                movePad();

            }
        }, false);

        window.addEventListener('keyup', function (ev) {
            if (ev.keyCode == 39 || ev.keyCode == 37) {
                onRightArrowPressed = false;
                onLeftArrowPressed = false;
                movePad();
                window.cancelAnimationFrame(movePad);
            } 
        }, false);

        window.addEventListener('dblclick', function (ev) {
            if (isMoving === false) {
                console.log(ev);
                moveBall();
                isMoving = true;
            }
        }, false);

        window.addEventListener('mousemove', function (ev) {
            pad.x = ev.clientX - canvas.offsetLeft;
            padCollisionWithWalls();
            movePad();
        }, false);

    }


    function drawBall(ball, context) {

        ballImage.src = ballImagePath;
        ballImage.onload = function () {
            context.drawImage(ballImage, ball.x, ball.y, ball.radius * 2, ball.radius * 2);
        };
        context.drawImage(ballImage, ball.x, ball.y, ball.radius * 2, ball.radius * 2);
    }

    function moveBall() {
        context.clearRect(prevCoordinatesX, prevCoordinatesY, 2 * ball.radius, 2 * ball.radius);
        
        drawBall(ball, context);

        prevCoordinatesX = ball.x;
        prevCoordinatesY = ball.y;

        ball.x += (ballDeltaX * ball.speed);
        ball.y += (ballDeltaY * ball.speed);


        if(ball.y + ball.radius * 2 > canvas.height){
            endLive();
            window.cancelAnimationFrame(moveBall);
            //return;
        }

        if (ball.x < 0 || ball.x + ball.radius * 2 > canvas.width) {
            ballDeltaX *= -1;
        }
        if (ball.y < 0 || ball.y + ball.radius * 2 > canvas.height) {
            ballDeltaY *= -1;
        } else if (padCollisionWithBall(pad, ball)) { //problem with the lemon pic-it is rectangle
            ballDeltaY *= -1;
        }
        
        bricks.some(brick => collisionWithBricks(ball, brick));

        window.requestAnimationFrame(moveBall);
    }

    function collisionWithBricks(ball, brick) {

        var half = {
            x: (brick.width / 2),
            y: (brick.height / 2)
        },
            center = {
                x: ball.x + ball.radius - (brick.x + half.x),
                y: ball.y + ball.radius - (brick.y + half.y)
            };
        var side = {
            x: Math.abs(center.x) - half.x,
            y: Math.abs(center.y) - half.y
        };
        if (side.x > ball.radius || side.y > ball.radius) { // no collision
            return;
        }

        if ((side.x < 0 || side.y < 0) && brick.isDestroyed === false) {
            if (Math.abs(side.x) < ball.radius && side.y < 0) { // hits the top or the bottom of the brick
                ballDeltaX = center.x * side.x < 0 ? -1 : 1;

                brick.isDestroyed = true;
                context.clearRect(brick.x, brick.y, brick.width, brick.height);

            } else if ((Math.abs(side.y) < ball.radius && side.x < 0) && brick.isDestroyed === false) { // hits a side of the brick
                ballDeltaY = center.y * side.y < 0 ? -1 : 1;

                brick.isDestroyed = true;
                context.clearRect(brick.x, brick.y, brick.width, brick.height);
            }
            return;
        }
        if (brick.isDestroyed === false) {
            ballDeltaX = center.x < 0 ? -1 : 1; // hits the corner of the brick
            ballDeltaY = center.y < 0 ? -1 : 1; // bounces back in the same direction           

            brick.isDestroyed = true;
            context.clearRect(brick.x, brick.y, brick.width, brick.height);
            return;
        }
    }

    function drawPad() {
        context.clearRect(pad.x - padOffset, pad.y,
            2 * pad.width + padOffset, pad.height);
        context.beginPath();
        context.fillStyle = "black";
        context.rect(pad.x, pad.y, pad.width, pad.height);
        context.fill();
        context.closePath();

    }


    function movePad() {
        context.clearRect(0, pad.y, pad.x, pad.height);
        context.clearRect(pad.x + pad.width, pad.y, canvas.width, pad.height);

        if (onRightArrowPressed && pad.x < canvas.width - (pad.width)) {
            if (pad.x - pad.width < canvas.width) {
                pad.x += padMovingSpeed;
            } else {
                pad.x = canvas.width;
                drawPad();
                return;
            }
        } else if (onLeftArrowPressed) {
            if (pad.x > 0) {
                pad.x -= padMovingSpeed;
            } else {
                pad.x = 0;
                drawPad();
                return;
            }
        }

        drawPad();
    }

    
    function padCollisionWithWalls() {
        if (pad.x < 0) {
            pad.x = 0;
        }
        if (pad.x + pad.width > canvas.width) {
            pad.x = canvas.width - pad.width;
        }
    }

    function padCollisionWithBall(pad, ball) {
        return !!(ball.x + 2*ball.radius > pad.x &&
            ball.x < pad.x + pad.width &&
            ball.y + ball.radius + (ballDeltaY * ball.speed) * 3 >= pad.y - pad.height);
    }

    function drawBricks() {
        generateBricks();
        var imgs = [];
        for (var j = 0; j < bricks.length; j++) {
            var img = new Image();
            img.src = bricks[j].image;
            imgs.push(img);
        }

        $.each(imgs, function (key, value) {
            value.onload = function () {
                context.drawImage(value, bricks[key].x, bricks[key].y, bricks[key].width, bricks[key].height);
            };
        });
    }

    function createBall(x, y, radius, speed, direction) {
        var ball = {
            x: x,
            y: y,
            radius: radius,
            speed: speed,
            direction: direction,
            move: move
        };

        function move() {
            this.x += this.direction[0] * this.speed;
            this.y += this.direction[1] * this.speed;
        }

        return ball;
    }

    function createPad(x, y, width, height) {
        var pad = {
            x: x,
            y: y,
            width: width,
            height: height
        };
        return pad;
    }

    function generatePad() {
        var x = (canvas.width - 85) / 2,
            y = (canvas.height - 10) - 5,
            width = 85,
            height = 10,
            pad = createPad(x, y, width, height);
        return pad;

    }

    function createBrick(x, y) {
        var randomIndex = Math.random() * bricksImagesPaths.length | 0;
        var brick = {
            x: x,
            y: y,
            width: 50,
            height: 20,
            image: bricksImagesPaths[randomIndex],
            isDestroyed: false
        };

        return brick;
    }

    function generateBall() {
        var radius = 15,
            x = canvas.width / 2 - radius,
            y = canvas.height - 50,
            speed = 3, //decrease the speed
            direction = [-1, -1],

            ball = createBall(x, y, radius, speed, direction);

        return ball;
    }

    function generateBricks() {
        for (var i = 1; i <= numberOfBricksInRow; i += 1) {
            for (var j = 1; j <= numberOfBricksInCol; j += 1) {
                bricks.push(createBrick(i * 60, j * 35));
            }
        }
    }

    function endLive() {
        lives -= 1;
        ball.x = canvas.width / 2 - ball.radius;
        ball.y = canvas.height - 50;
        isMoving = false;
        //pad.x = canvas.width / 2 - pad.width/2;
        /*
        ball.direction = [1, -1];
        ball.ballDeltaX = 1;
        ball.ballDeltaY = 1;
        */
        isGameSuccess();
        console.log(lives);
        if(lives===0)
        {
            
            console.log("End Game")
        }
    }

    function printLives() {
        context.font = "15px Arial";
        context.clearRect(500,0,250,20);
        context.fillText("Lives :"+lives, 530, 20);
    }

    function drawAll(params) {
        movePad();
        printLives();
        //moveBall();
    
        window.requestAnimationFrame(drawAll);
    }
    drawAll();

    function isGameSuccess() {        
        var allBricksDestroyed = false;
        
        for (var i = 0, len = bricks.length; i < len; i+=1) {
            if (bricks[i].isDestroyed===false || bricks.length != 40) {
                console.log(bricks[i].isDestroyed);
                return;
            }
            allBricksDestroyed = true;
            console.log("Success!"); 
        }

        if (allBricksDestroyed || lives<=0) {
            return true;
        }else{
            return false;
        }
    }

    

    return {
        "start": function () {
            drawBricks();
            drawPad();
            gameLoop();
        }
    };
}