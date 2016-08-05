function createGame(canvasSelector) {
    var canvas = document.querySelector(canvasSelector),
        context = canvas.getContext("2d"),
        canvasHeight = canvas.height,
        canvasWidth = canvas.width,

        ball = generateBall(),
        ballImage = new Image(),
        ballImagePath = "images/lemon-slice.png",
        ballDeltaX = ball.direction[0],
        ballDeltaY = ball.direction[1],
        prevCoordinatesX,
        prevCoordinatesY,
        isMoving = false,

        bricks = [],
        bricksImagesPaths = ["images/brick.png", "images/purple-brick.png", "images/yellow-brick.png", "images/green-brick.png", "images/pink-brick.png"],
        numberOfBricksInRow = 8,
        numberOfBricksInCol = 5,

        padHeight = 10,
        padWidth = 85,
        padX = (canvasWidth - padWidth) / 2,
        padY = (canvasHeight - padHeight) - 5;

    function gameLoop() {

        drawBall(ball, context);
        window.addEventListener('keyup', function (ev) {
            if ((ev.keyCode == 32) && isMoving === false) {
                moveBall();
                isMoving = true;
            }
        }, false);
        drawPad();
    }

    function drawBall(ball, context) {

        ballImage.src = ballImagePath,
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

        if (ball.x < 0 || ball.x + ball.radius * 2 > canvas.width) {
            ballDeltaX *= -1;
        }
        if (ball.y < 0 || ball.y + ball.radius * 2 > canvas.height) {
            ballDeltaY *= -1;
        }

        bricks.some(brick => collisionWithBricks(ball, brick));

        window.requestAnimationFrame(moveBall);
    }

    function collisionWithBricks(ball, brick) {

        var half = { x: (brick.width / 2), y: (brick.height / 2) },
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

    function createBrick(x, y) {
        var randomIndex = (Math.random() * (bricksImagesPaths.length - 0) + 0) | 0;
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
            speed = 5,
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

    return {
        "start": function () {
            drawBricks();
            gameLoop();
        }
    };
}
