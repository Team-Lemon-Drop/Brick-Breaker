function createGame(canvasSelector){
    var canvas = document.querySelector(canvasSelector),
        context = canvas.getContext("2d"),
        bricks = [];
    var numberOfBricksInRow = 8,
          numberOfBricksInCol = 5;

          function gameLoop() {
              generateBricks();
              drawBricks();
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

        function createBrick(x,y) {
            var brick = {
                x: x,
                y: y,
                width: 50,
                height: 20
            };

            return brick;
        }

        function generateBricks() {   
            for (var i = 1; i <= numberOfBricksInRow; i+=1) {
                for(var j= 1; j <= numberOfBricksInCol; j += 1){
                     bricks.push(createBrick(i * 60, j * 35));    
                }                    
            }
        }

        return {
        "start": function() {             
            gameLoop();
        }
    };
}