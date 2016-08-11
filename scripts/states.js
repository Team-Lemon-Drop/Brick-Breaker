var getStates = function () {
    var playButton = document.getElementById("play-button"),
        howToButton = document.getElementById("how-button"),
        creditsButton = document.getElementById("credits-button"),
        playAgainButton = document.getElementById("play-again"),
        $paths = $(".path"); 

    var startGame = function () {
        var gameContainer = document.getElementById("game-container"),
            menu = document.getElementById("menu"),
            endScreen = document.getElementById("end-screen");

            menu.style.display = 'none';
            gameContainer.style.display = 'block';
            endScreen.style.display = 'none';
        
        var game = createGame("#game-canvas");
            game.start();

    };

    var showRules = function () {
       var menu = document.getElementById("menu"),
           heading = document.createElement("h2");

       menu.innerHTML = '';
       heading.innerText = "Rules Of Game";
       menu.appendChild(heading);
    };

    var credits = function () {
        var menu = document.getElementById("menu"),
           heading = document.createElement("h5");

        menu.innerHTML = '';
        heading.innerText = "Game created by: DimaAtanasova, dimpechev, maryakach, nikola.stefanov, pepchon, pspassova, teod_st";
        menu.appendChild(heading);
    };

     var overEllipse = function (target) {        
        target.setAttribute('fill', 'lightgoldenrodyellow'); 
    };

    var outOfEllipse = function (target) {
        target.setAttribute('fill', 'lightblue');
    };

    

    $paths.mouseover(function(event){
        overEllipse(event.target);
    });

    $paths.mouseout(function(event){
        outOfEllipse(event.target);
    });

    playButton.addEventListener('click', startGame, false);
    howToButton.addEventListener('click', showRules, false);
    creditsButton.addEventListener('click', credits, false);
    playAgainButton.addEventListener('click', startGame, false);

};
