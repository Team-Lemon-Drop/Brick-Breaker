function createGame(canvasSelector) {
    var canvas = document.querySelector(canvasSelector),
        context = canvas.getContext("2d"),
        bricks = [];
    var numberOfBricksInRow = 8,
        numberOfBricksInCol = 5;

    function gameLoop() {
        var ball = generateBall();
        drawBall(ball, context);
        generateBricks();
        drawBricks();
    }


    function drawBall(ball, context) {
        var image = new Image();
        image.onload = function () {
            context.drawImage(image, ball.x, ball.y, 30, 30);
        }
        image.src = "images/lemon-slice.png";
    }

    function drawBricks() {
        debugger;
        var image = new Image();
        image.src = "images/brick.png";
        for (var i = 0; i < bricks.length; i++) {
            var currentBrick = bricks[i];
            context.beginPath();
            context.rect(currentBrick.x, currentBrick.y, currentBrick.width, currentBrick.height);
            //context.drawImage(image, currentBrick.x, currentBrick.y, currentBrick.width, currentBrick.height);               
            context.fill();
            context.closePath();
        }
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
        var brick = {
            x: x,
            y: y,
            width: 50,
            height: 20
        };

        return brick;
    }

    function generateBall() {
        var x = canvas.width / 2 - 20,
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
        "start": function () {
            gameLoop();
        }
    };
}