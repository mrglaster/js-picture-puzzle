let puzzleImageLink = '';
let imageB64 = '';
let difficulty = null;
let globalPuzzle = null;

const WIN_SOUND = "./sounds/you_won.wav";
const CLICK_SOUND = "./sounds/click.wav";
const GIVE_UP_SOUND = "./sounds/give_up.wav"

let difficultyLevels = {
    "easy_mode": "Easy",
    "medium_mode": "Medium",
    "hard_mode": "Hard"
}


/**Builds custom alert with SweetAlert */
function buildCustomAlert(title, text) {
    const wrapper = document.createElement('div');
    swal({
        title: title,
        text: text,
        content: wrapper
    });
}


/**Plays audiofile*/
function play_sound(sound_path){
    var audio = new Audio(sound_path);
    audio.play();
}


function giveUp(){
    play_sound(CLICK_SOUND);
    play_sound(GIVE_UP_SOUND);
    buildCustomAlert("What a pity!", "Look, who's given up here? Okay, we will collect the puzzle for you, so be it. But this is the last time.")
    if(globalPuzzle != null){
        globalPuzzle.solve();
        globalPuzzle.redraw();
    }
}


/**Redirects to settings */
function changeData(){
    play_sound(CLICK_SOUND);
    this.location.href = "index.html";
}




/**Gets required data for game start */
function getPuzzleInitData() {
    const urlParams = new URLSearchParams(window.location.search);
    puzzleImageLink = urlParams.get('image');
    difficulty = difficultyLevels[urlParams.get('difficulty')]
    const difficulty_header = document.getElementById('difficulty_header')

    if (difficulty != null) {
        difficulty_header.innerHTML = `DIFFICULTY: ${difficulty}`
    }

    else {
        difficulty_header.innerHTML = `DIFFICULTY: INSANE`
        difficulty = 'Insane'
        puzzleImageLink = 'https://i.ibb.co/7GMds31/image.png'
    }
    
    const sample_canvas = document.getElementById('tvshape')
    sample_canvas.style.backgroundSize = 'cover';
    sample_canvas.style.backgroundImage = 'url(' + puzzleImageLink + ')';
    buildCustomAlert("Welcome!", "Welcome to the puzzle game! Now we split selected image to puzzle tiles, so you only need to wait a bit.")
    processPuzzleGame()
}

/**Starts the jigsaw puzzle game */
function processPuzzleGame() {
    let cols = 0;
    let rows = 0;
    let tile_width = 0;
    let tile_height = 0;
    switch (difficulty) {
        case 'Easy':
            cols = 5;
            rows = 3;
            tile_width = 70;
            tile_height = 90;
            break;
        case 'Medium':
            cols = 8;
            rows = 5;
            tile_height = 50;
            tile_width = 50;
            break;
        case 'Hard':
            cols = 17;
            rows = 11;
            tile_height = 25
            tile_width = 25;
            break;
    }

    let loaded_image = new Image();
    loaded_image.src = puzzleImageLink;
    loaded_image.onload = () => {
        const validated = new headbreaker.Canvas('puzzle-place', {
            width: 900, height: 600,
            pieceSize: tile_width, proximity: 20,
            borderFill: 8, strokeWidth: 1.1,
            outline: new headbreaker.outline.Rounded(),
            lineSoftness: 0.18, image: loaded_image,
            fixed: true
        });
        validated.autogenerate({
            horizontalPiecesCount: cols,
            verticalPiecesCount: rows
        });
        if (!validated.puzzle.pieces.length){
            difficulty = 'Hard';
            puzzleImageLink = 'https://i.ibb.co/7GMds31/image.png'
            processPuzzleGame()
        }
   
        validated.shuffle();
        console.log(typeof(validated))
        validated.draw();
        validated.attachSolvedValidator();
        var requestedCanvas =  document.getElementsByTagName('canvas')[0];
        requestedCanvas.style.backgroundColor = '#dcded9';
        globalPuzzle = validated;
        validated.onValid(() => {
            setTimeout(() => {
                play_sound(WIN_SOUND)    
                buildCustomAlert("Congratulations!", "You have successfully completed the selected puzzle! Great job! But it could have been done sooner.)")
            }, 1500);
        })

    }

}


getPuzzleInitData()
