var getStates = function () {
     var playButton = document.getElementById("play-button"),
        howToButton = document.getElementById("how-button"),
        creditsButton = document.getElementById("credits-button"),
        playAgainButton = document.getElementById("play-again"),
        returnToMenu = document.getElementById("go-to-menu"),
        endScreen = document.getElementById("end-screen"),
        $paths = $(".path"),
        menu = document.getElementById("menu"),
        htmlOfStartScreen = menu.innerHTML, 
        backButton = document.createElement("button"),    
        div = document.createElement("div"),
        contributorsText = document.createElement('h2'),        
        rulesDiv = div.cloneNode(true),
        section = document.getElementById("game-section");

         backButton.className = "go-back-btn";

    var startGame = function () {
        var gameContainer = document.getElementById("game-container");
            
            menu.style.display = 'none';
            gameContainer.style.display = 'block';
            endScreen.style.display = 'none';
        
        var game = createGame("#game-canvas");
            game.start();
    };

    var showRules = function () {
        var menu = document.getElementById("menu"),
            heading = document.createElement("h2"),
            rule = document.createElement("p");
            rule.className='rules';
            var warning=document.createElement("p");
            warning.className='warning';

        menu.innerHTML = '';
        heading.innerText = "Rules Of Game";
        menu.appendChild(heading);

        rule.innerText = '- press "SPACE" to start the game \n- use " < " or " > " to move the pad';
        menu.appendChild(rule);

        warning.innerText=
        "Your goal is to destroy all the bricks. :-)\n"+
        "You shouldn't let the ball hit the floor! \nYou have exactly 3 lives!";
        menu.appendChild(warning);

        return menu;
    };

     var overEllipse = function (target) {        
        target.setAttribute('fill', 'lightgoldenrodyellow'); 
        target.style.cursor = "pointer";
    };

    var outOfEllipse = function (target) {
        target.setAttribute('fill', 'lightblue');
    };

    
    var goToMainMenu = function(){
        rulesDiv.style.display = 'none';
        endScreen.style.display = 'none';
        menu.style.display = '';        
    };

    $paths.mouseover(function (event) {
        overEllipse(event.target);
    });

    $paths.mouseout(function (event) {
        outOfEllipse(event.target);
    });

     function createRules(){
        var members = ["DimaAtanasova", "dimpechev", "maryakach", "nikola.stefanov", "pepchon", "pspassova", "teod_st"],
            teamUl = document.createElement('ul'),
            li = document.createElement("li");
        
        rulesDiv.style.display = 'block';
        contributorsText.innerText = "Contributors:";
        contributorsText.id = "contributors";
        menu.style.display = "none";
        rulesDiv.className = "game-div";    
        teamUl.className = 'team-members';

        for(var i = 0; i < 7; i+= 1){
            var member = li.cloneNode(true);
            member.innerText = members[i];
            member.className = "member";
            teamUl.appendChild(member);
        }

        rulesDiv.appendChild(contributorsText);
        rulesDiv.appendChild(teamUl);   
        backButton.innerText = "Go back";  
        rulesDiv.appendChild(backButton); 

        section.appendChild(rulesDiv);
    }

    playButton.addEventListener('click', startGame, false);
    playAgainButton.addEventListener('click', startGame, false);   

    howToButton.addEventListener('click', showRules, false);
    creditsButton.addEventListener('click', createRules, false);    

    backButton.addEventListener('click', goToMainMenu, false);
    returnToMenu.addEventListener('click', goToMainMenu, false);

};
