// set width and the total number of bombs
//create a board dynamically 
//create the 100 squares in the main grid and give them a unique id
//each square has a bomb or total number of bombs around them
//calculate total number of bombs in all 8 directions and display it when clicked
//if a square with 0 value clicked > it should display cells around it till it gets a val>0.
//right click > add and remove flags 
//if bomb clicked game over > if game over > show all bombs
//win game > when flags are marked at all the bomb locations 
//         > when all the non bomb sqaures are checked
// keep a timer 
//load new game when game over, time up or game is won

//The DOMContentLoaded event fires when the initial HTML document has 
//been completely loaded and parsed, without waiting for stylesheets, images, and subframes to finish loading.
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid');
    const flagsLeft = document.querySelector('#flags-left')
    const result = document.querySelector('#result');
    let timeDisplay = document.querySelector('.timeDisplay');
    let width= 10;
    let bombAmount = 20;
    let flags = 0;
    let squares = [];
    let isGameOver = false;
    let time = 60;
    //create Board 
    function createBoard() {
        //get shuffled array with random bombs
        flagsLeft.innerHTML = bombAmount;
        result.innerHTML = '';
        const bombsArray = Array(bombAmount).fill('bomb');
        const emptyArray = Array(width*width - bombAmount).fill('valid');
        const gameArray = emptyArray.concat(bombsArray);
        const shuffledArray = gameArray.sort(() => Math.random()-0.5);
        

        for(let i=0;i< width*width; i++){
            const square = document.createElement('div');
            square.setAttribute('id',i);
            square.classList.add(shuffledArray[i]);
            grid.appendChild(square);
            squares.push(square);
            square.addEventListener('click',function(e) {
                click(square);checkForWin();
            });

            //right click
            square.oncontextmenu = function(e) {
                e.preventDefault();
                addFlag(square);
            }
        }

        //add numbers
        for(let i=0; i< squares.length; i++){
            let total = 0;
            const isLeftEdge =( i % width === 0);
            const isRightEdge = ((i % width) === (width - 1)) ;

            if(squares[i].classList.contains('valid')) {
                if( i > 0 && !isLeftEdge && squares[i-1].classList.contains('bomb')){ total++; } // West
                if( i > 9 && !isRightEdge && squares[i+1 - width].classList.contains('bomb')){ total++; } //NE
                if( i > 10 && squares[i - width].classList.contains('bomb')){ total++; } //North
                if( i > 11 && !isLeftEdge && squares[i-1 - width].classList.contains('bomb')){ total++; } //NW
                if( i < 98 && !isRightEdge && squares[i+1].classList.contains('bomb')){ total++; } // East
                if( i < 90 && !isLeftEdge && squares[i-1 + width].classList.contains('bomb')){ total++; } // SW
                if( i < 88 && !isRightEdge && squares[i+1 + width].classList.contains('bomb')){ total++; } //SE
                if( i < 89 && squares[i + width].classList.contains('bomb')){ total++;} //South
                squares[i].setAttribute('data',total);
                
            }   
        }
    }
    createBoard();
    setInterval(countdown,1000);
    //countdown timer
    function countdown(){
        //make sure time is not run out
        if(time > 0){
            time--;
        } 
        else if(time === 0){
            //Game over
            isGameOver = true;
            if(!isGameOver){
                result.innerHTML = 'Time up! Game Over!';
            }
            setTimeout(()=>{document.location.reload();},2000); //if time is over then load another game
        }
        //display time
        timeDisplay.innerHTML = `Time - ${Math.floor(time/60)}:${time%60}`;
    }
    //add flags on right click
    function addFlag(square){
        if(isGameOver) return;
        if(!square.classList.contains('checked') && (flags < bombAmount)){
            if(!square.classList.contains('flag')){
                square.classList.add('flag');
                square.innerHTML = '🚩';
                flags++;
                flagsLeft.innerHTML = bombAmount- flags
                checkForWin();
            }else{
                square.classList.remove('flag');
                square.innerHTML = '';
                flags--;
                flagsLeft.innerHTML = bombAmount- flags
            }
        }
    }

    //clicking actions
    function click(square) {
        let currentId = square.id;
        if(isGameOver) return;
        if(square.classList.contains('checked') || square.classList.contains('.flag')) return;
        if(square.classList.contains('bomb')){
            gameOver(square);
        }else{
            let total = square.getAttribute('data');
            if(total !=0){
                square.classList.add('checked');
                if (total == 1) square.classList.add('one')
                if (total == 2) square.classList.add('two')
                if (total == 3) square.classList.add('three')
                if (total == 4) square.classList.add('four')
                square.innerHTML = total;
                return
            }
            
            checkSquare(currentId);
            
        }
        square.classList.add('checked');
        
    }

    //opening all the neighboring squares - NOT working
    function checkSquare(currentId){
        const isLeftEdge =( currentId % width === 0);
        const isRightEdge = ((currentId % width) === (width - 1)) ;

        setTimeout(()=>{
            if(currentId>0 && !isLeftEdge){
                const newId = squares[parseInt(currentId)-1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if( currentId > 9 && !isRightEdge){
                const newId = squares[parseInt(currentId)+1-width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if( currentId > 10){
                const newId = squares[parseInt(currentId)-width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if(currentId > 11 && !isLeftEdge){
                const newId = squares[parseInt(currentId)-1-width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if( currentId < 98 && !isRightEdge){
                const newId = squares[parseInt(currentId)+1].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if( currentId < 90 && !isLeftEdge){
                const newId = squares[parseInt(currentId)-1+width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if( currentId < 88 && !isRightEdge){
                const newId = squares[parseInt(currentId)+1+width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
            if( currentId < 89){
                const newId = squares[parseInt(currentId)+width].id;
                const newSquare = document.getElementById(newId);
                click(newSquare);
            }
        },10)
    }

    function gameOver(square){
        isGameOver = true;
        result.innerHTML = 'BOOM! Game Over!';

        //show all the bombs
        squares.forEach(square => {
            if( square.classList.contains('bomb')){
                square.innerHTML = '💣';
            }
        });
        setTimeout(()=>{document.location.reload();},2000);
    }

    function checkForWin() {
        
        let matches = 0;
        let validCount = 0;
        for(let i = 0; i < squares.length;i++){
            if(squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
                matches++;
            }
            if(squares[i].classList.contains('valid') && squares[i].classList.contains('checked')){
                validCount++;
            }
            if(matches === bombAmount || validCount === (width*width - bombAmount)){
                isGameOver = true;
                result.innerHTML='YOU WIN!';
                setTimeout(()=>{document.location.reload();},2000);
            }
        }
    }
});