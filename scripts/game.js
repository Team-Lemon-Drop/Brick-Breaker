function createGame(canvasSelector) {
    var canvas = document.querySelector(canvasSelector),
        context = canvas.getContext("2d"),
        canvasHeight = canvas.height,
        canvasWidth = canvas.width,
        ball = generateBall(),
        bricks = [],
        bricksImagesPaths = ["images/brick.png", "images/purple-brick.png", "images/yellow-brick.png", "images/green-brick.png", "images/pink-brick.png"],
        numberOfBricksInRow = 8,
        numberOfBricksInCol = 5,
        padHeight = 10,
        padWidth = 85,
        padX = (canvasWidth - padWidth) / 2,
        padY = (canvasHeight - padHeight) - 5,
        ballDeltaX = ball.direction[0],
        ballDeltaY = ball.direction[1],
        prevCoordinatesX,
        prevCoordinatesY,
        isMoving = false;

    function gameLoop() {

        drawBall(ball, context);
        window.addEventListener('keyup', function(ev) {
            if ((ev.keyCode == 32) && isMoving === false) {
                moveBall();
                isMoving = true;
            }
        }, false);
        drawPad();
    }


    function drawBall(ball, context) {

        context.beginPath();
        context.arc(ball.x, ball.y, ball.radius, 0, 2 * Math.PI);
        context.fill();
        context.closePath();

        // var image = new Image();
        // image.onload = function() {
        //     context.drawImage(image, ball.x, ball.y, 30, 30);
        // };
        // image.src = "images/lemon-slice.png";
    }

    function moveBall() {
        context.clearRect(prevCoordinatesX - ball.radius, prevCoordinatesY - ball.radius,
            2 * ball.radius, 2 * ball.radius);

        drawBall(ball, context);

        prevCoordinatesX = ball.x;
        prevCoordinatesY = ball.y;

        ball.x += (ballDeltaX * ball.speed);
        ball.y += (ballDeltaY * ball.speed);

        if (ball.x - ball.radius < 0 || ball.x + ball.radius > canvas.width) {
            ballDeltaX *= -1;
        }
        if (ball.y - ball.radius < 0 || ball.y + ball.radius > canvas.height) {
            ballDeltaY *= -1;
        }

        window.requestAnimationFrame(moveBall);
    }

    function drawPad() {
        context.beginPath();
        context.rect(padX, padY, padWidth, padHeight);
        context.fillStyle = "black";
        context.fill();
        context.closePath();
    }

    function drawBricks() {
        generateBricks();
        var imgs = [];
        for (var j = 0; j < bricks.length; j++) { 
            var img = new Image();
            img.src = bricks[j].image;
            imgs.push(img);             
         }

         $.each(imgs, function(key, value ) {
             value.onload = function(){
                context.drawImage(value, bricks[key].x, bricks[key].y, bricks[key].width, bricks[key].height );
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

    function createBrick(x, y) {
        var randomIndex = (Math.random() * (bricksImagesPaths.length - 0) + 0) | 0;
        var brick = {
            x: x,
            y: y,
            width: 50,
            height: 20, 
            image: bricksImagesPaths[randomIndex]
        };

        return brick;
    }

    function generateBall() {
        var x = canvas.width / 2,
            y = canvas.height - 50,
            speed = 5,
            direction = [-1, -1],
            ball = createBall(x, y, 12, speed, direction);
        return ball;
    }

    function generateBricks() {
        for (var i = 1; i <= numberOfBricksInRow; i += 1) {
            for (var j = 1; j <= numberOfBricksInCol; j += 1) {
                bricks.push(createBrick(i * 60, j * 35));
            }
        }
    }

    return {
        "start": function() {
            drawBricks();
            gameLoop();
        }
    };
}
