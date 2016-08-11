var getStates = function () {
     var playButton = document.getElementById("play-button"),
        howToButton = document.getElementById("how-button"),
        creditsButton = document.getElementById("credits-button"),
        playAgainButton = document.getElementById("play-again"),
        returnToMenu = document.getElementById("go-to-menu"),
        endScreen = document.getElementById("end-screen"),
        creditsDiv = document.getElementById("credits"),
        $paths = $(".path"),
        $texts = $(".text"),
        menu = document.getElementById("menu"),
        backButton = document.createElement("button"),    
        contributorsText = document.createElement('h2'),     
        rulesDiv = document.getElementById('rules'),
        section = document.getElementById("game-section"),
        gameContainer = document.getElementById("game-container");

        backButton.className = "go-back-btn";

    var startGame = function () {            
            menu.style.display = 'none';
            gameContainer.style.display = 'block';
            endScreen.style.display = 'none';
        
        var game = createGame("#game-canvas");
            game.start();
    };

    var showRules = function () {    
        var heading = document.createElement("h2"),
            rule = document.createElement("p"),
            warning = document.createElement("p");

        backButton.innerText = "Go back";
        rule.className='rules';
        warning.className='warning';
        heading.className = 'heading';

        rulesDiv.style.display = '';
        menu.style.display = 'none';

        rulesDiv.className = 'game-div';        
        heading.innerText = "Rules Of Game"; 

        rule.innerText = '- press "SPACE" to start the game \n- use " < " or " > " to move the pad';      

        warning.innerText=
        "Your goal is to destroy all the bricks. :-)\n"+
        "You shouldn't let the ball hit the floor! \nYou have exactly 3 lives!";
        
        rulesDiv.appendChild(heading);
        rulesDiv.appendChild(rule);
        rulesDiv.appendChild(warning);
        rulesDiv.appendChild(backButton);
        section.appendChild(rulesDiv);
    };

     function createCredits(){ 
        var members = ["DimaAtanasova", "dimpechev", "maryakach", "nikola.stefanov", "pepchon", "pspassova", "teod_st"],
            teamUl = document.createElement('ul'),
            li = document.createElement("li");

        backButton.innerText = "Go back";
        creditsDiv.style.display = 'block';
        contributorsText.innerText = "Contributors:";
        contributorsText.id = "contributors";
        contributorsText.className = "heading";
        menu.style.display = "none";
        creditsDiv.className = "game-div";    
        teamUl.className = 'team-members';

        for(var i = 0, len = members.length; i < len; i+= 1){
            var member = li.cloneNode(true);

            member.innerText = members[i];
            member.className = "member";
            teamUl.appendChild(member);
        }

        creditsDiv.appendChild(contributorsText);
        creditsDiv.appendChild(teamUl);
        creditsDiv.appendChild(backButton); 

        section.appendChild(creditsDiv);        
    }

     var overEllipse = function (target) {        
        target.setAttribute('fill', 'lightgoldenrodyellow'); 
        target.style.cursor = "pointer";             
    };

    var outOfEllipse = function (target) {
        target.setAttribute('fill', 'lightblue');
    };
    
    var goToMainMenu = function(){
        creditsDiv.style.display = 'none';
        endScreen.style.display = 'none';
        rulesDiv.style.display = 'none';
        menu.style.display = '';      
        rulesDiv.innerHTML = '';  
        creditsDiv.innerHTML = '';
    };

    $paths.mouseover(function (event) {
        overEllipse(event.target);
    });

    $paths.mouseout(function (event) {
        outOfEllipse(event.target);
    });

    $texts.mouseover(function(event){        
        event.target.style.cursor = "pointer";  
    });           

    playButton.addEventListener('click', startGame, false);
    playAgainButton.addEventListener('click', startGame, false);   

    howToButton.addEventListener('click', showRules, false);
    creditsButton.addEventListener('click', createCredits, false);    

    backButton.addEventListener('click', goToMainMenu, false);
    returnToMenu.addEventListener('click', goToMainMenu, false);
};
