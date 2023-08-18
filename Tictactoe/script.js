const selectBox = document.querySelector(".select-box"),
selectBtnX = selectBox.querySelector(".options .playerX"),
selectBtnO = selectBox.querySelector(".options .playerO"),
playBoard = document.querySelector(".play-board"),
players = document.querySelector(".players"),
allBox = document.querySelectorAll("section span"),
resultBox = document.querySelector(".result-box"),
wonText = resultBox.querySelector(".won-text"),
replayBtn = resultBox.querySelector("button");

window.onload = ()=>{
    for (let i = 0; i < allBox.length; i++) {
       allBox[i].setAttribute("onclick", "clickedBox(this)");
    }
}

selectBtnX.onclick = ()=>{
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
}

selectBtnO.onclick = ()=>{ 
    selectBox.classList.add("hide");
    playBoard.classList.add("show");
    players.setAttribute("class", "players active player");
}

let playerXIcon = "fas fa-times",
playerOIcon = "far fa-circle",
playerSign = "X",
runBot = true;

function clickedBox(element){
    document.getElementById("clickSound").play();
    if(players.classList.contains("player")){
        playerSign = "O";
        element.innerHTML = `<i class="${playerOIcon}"></i>`;
        players.classList.remove("active");
        element.setAttribute("id", playerSign);
    }else{
        element.innerHTML = `<i class="${playerXIcon}"></i>`;
        element.setAttribute("id", playerSign);
        players.classList.add("active");
    }
    selectWinner();
    element.style.pointerEvents = "none";
    playBoard.style.pointerEvents = "none";
    let randomTimeDelay = ((Math.random() * 1000) + 200).toFixed();
    setTimeout(()=>{
        bot(runBot);
    }, randomTimeDelay);
}

function bot(){
    let array = [];
    if(runBot){
        if(players.classList.contains("player")){ 
            playerSign = "X";
        }else{
            playerSign = "O";
        }
        for (let i = 0; i < allBox.length; i++) {
            if(allBox[i].childElementCount == 0){
                array.push(i);
            }
        }
        let bestMove = minimax(array, playerSign).index;
        if(array.length > 0){
            if(players.classList.contains("player")){ 
                allBox[bestMove].innerHTML = `<i class="${playerXIcon}"></i>`;
                allBox[bestMove].setAttribute("id", playerSign);
                players.classList.add("active");
            }else{
                playerSign = "O";
                allBox[bestMove].innerHTML = `<i class="${playerOIcon}"></i>`;
                players.classList.remove("active");
                allBox[bestMove].setAttribute("id", playerSign);
            }
            selectWinner();
        }
        allBox[bestMove].style.pointerEvents = "none";
        playBoard.style.pointerEvents = "auto";
        playerSign = "X";
    }
}

function minimax(array, player){
    let bestScore = (player == "O") ? -Infinity : Infinity;
    let bestMove;
    if(checkIdSign(1,2,3,player) || checkIdSign(4,5,6, player) || checkIdSign(7,8,9, player) || checkIdSign(1,4,7, player) || checkIdSign(2,5,8, player) || checkIdSign(3,6,9, player) || checkIdSign(1,5,9, player) || checkIdSign(3,5,7, player)){
        let score = (player == "O") ? 1 : -1;
        return {score};
    }else if(array.length == 0){
        return {score: 0};
    }else{
        for (let i = 0; i < array.length; i++) {
            let move = array[i];
            let oldSign = allBox[move].getAttribute("id");
            allBox[move].setAttribute("id", player);
            allBox[move].innerHTML = `<i class="${(player == "O") ? playerOIcon : playerXIcon}"></i>`;
            let score = minimax(array.filter(item => item != move), (player == "O") ? "X" : "O").score;
            allBox[move].setAttribute("id", oldSign);
            allBox[move].innerHTML = "";
            if(player == "O"){
                if(score > bestScore){
                    bestScore = score;
                    bestMove = move;
                }
            }else{
                if(score < bestScore){
                    bestScore = score;
                    bestMove = move;
                }
            }
        }
        return {score: bestScore, index: bestMove};
    }
}

function max(){
    let result = this.is_end();
    if(result != null){
        if(result == "X"){
            return (-1, 0, 0);
        }else if(result == "O"){
            return (1, 0, 0);
        }else{
            return (0, 0, 0);
        }
    }else{
        let maxv = -Infinity;
        let px = null;
        let py = null;
        for(let i = 0; i < 3; i++){
            for(let j = 0; j < 3; j++){
                if(this.current_state[i][j] == '.'){
                    this.current_state[i][j] = 'O';
                    let v = this.min();
                    if(v > maxv){
                        maxv = v;
                        px = i;
                        py = j;
                    }
                    this.current_state[i][j] = '.';
                }
            }
        }
        return (maxv, px, py);
    }
}

function getIdVal(classname){
    return document.querySelector(".box" + classname).id;
}
function checkIdSign(val1, val2, val3, sign){ 
    if(getIdVal(val1) == sign && getIdVal(val2) == sign && getIdVal(val3) == sign){
        return true;
    }
}
function isBoardFull() {
  for (let i = 0; i < allBox.length; i++) {
    if (allBox[i].childElementCount == 0) {
      return false;
    }
  }
  return true;
}
function selectWinner() {
  if (
    checkIdSign(1, 2, 3, playerSign) ||
    checkIdSign(4, 5, 6, playerSign) ||
    checkIdSign(7, 8, 9, playerSign) ||
    checkIdSign(1, 4, 7, playerSign) ||
    checkIdSign(2, 5, 8, playerSign) ||
    checkIdSign(3, 6, 9, playerSign) ||
    checkIdSign(1, 5, 9, playerSign) ||
    checkIdSign(3, 5, 7, playerSign)
  ) {
    runBot = false;
    bot();
    setTimeout(() => {
      resultBox.classList.add("show");
      playBoard.classList.remove("show");
    }, 700);
    document.getElementById("winAudio").play();
    wonText.innerHTML = `¡Jugador <p>${playerSign}</p> gano!`;
  } else if (isBoardFull()) {
    runBot = false;
    bot();
    setTimeout(() => {
      resultBox.classList.add("show");
      playBoard.classList.remove("show");
    }, 700);
    document.getElementById("drawAudio").play();
    wonText.textContent = "¡Empate!";
  } else {
    // continue playing
  }
}

replayBtn.onclick = ()=>{
    window.location.reload();
}