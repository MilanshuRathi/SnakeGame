//script for snake game
const canvas = document.getElementById("snake");
const context = canvas.getContext("2d");
// create the unit
let btn=document.getElementById("startButton");
const box = 32;
// load images
const ground = new Image();
ground.src = "img/ground.png";
const foodImg = new Image();
foodImg.src = "img/food.png";
const mineImg=new Image();
mineImg.src="img/bomb.png";
// load audio files
let speed=100,speedFlag=1;
let dead = new Audio();
let eat = new Audio();
let up = new Audio();
let right = new Audio();
let left = new Audio();
let down = new Audio();
let levelUp=new Audio();
dead.src = "audio/dead.mp3";
eat.src = "audio/eat.mp3";
up.src = "audio/up.mp3";
right.src = "audio/right.mp3";
left.src = "audio/left.mp3";
down.src = "audio/down.mp3";
levelUp.src="audio/levelUp.mp3";
// create the snake

let snake = [];
let mine=[]
mine[0]={
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}
snake[0] = {
    x : 9 * box,
    y : 10 * box
};
// create the food
let wall=[];
wall[0]={x:4*box,y:10*box,height:5*box};
wall[1]={x:11*box,y:4*box,height:3*box};
let food = {
    x : Math.floor(Math.random()*17+1) * box,
    y : Math.floor(Math.random()*15+3) * box
}

// create the score var

let score =0,level=1,prescore=0;
let isMine=false,isWalls=false;
//control the snake
let d;

document.addEventListener("keydown",direction);
function direction(event){
    let key = event.keyCode;
    btn.value="Click here to Restart Game";
        btn.innerHTML=btn.value;
    if( key == 37 && d != "RIGHT"){
        left.play();
        d = "LEFT";
    }else if(key == 38 && d != "DOWN"){
        d = "UP";
        up.play();
    }else if(key == 39 && d != "LEFT"){
        d = "RIGHT";
        right.play();
    }else if(key == 40 && d != "UP"){
        d = "DOWN";
        down.play();
    }
}
// cheack collision function
function wallCollision(head,array){
    for(let i = 0; i < array.length; i++){
        for(let j=0;j<head.length;j++){
            if(head[j].x == array[i].x &&array[i].y>=head[j].y&&array[i].y<head[j].y+head[j].height)
            return true;
        }
    }
    return false;
}
function collision(head,array){
    for(let i = 0; i < array.length; i++){
        if(head.x == array[i].x && head.y == array[i].y){
            return true;
        }
    }
    return false;
}
// draw everything to the canvas
let isWon=false,isPlaying=true;
function gameOver(){
    if(isWon){
        context.fillStyle("black");
        context.fillText("You won",5*box,5*box);
    }
    else{
        context.fillStyle("black");
        context.fillText("You Lost",5*box,5*box);
    }
}
let t2=0,t1=0;
function draw(){    
    context.drawImage(ground,0,0);        
    for( let i = 0; i < snake.length ; i++){
        context.fillStyle = "rgb(52, 125, 235)";//(i==0) ? "white":"purple";
        context.fillRect(snake[i].x,snake[i].y,box,box);        
        context.strokeStyle = "rgb(52, 125, 235)";
        context.strokeRect(snake[i].x,snake[i].y,box,box);
    }
    context.drawImage(foodImg, food.x, food.y);
    if(level>2&&mine.length<5&&t2-t1>=100){
        t2=0;
        t1=0;
        mine.push({x : Math.floor(Math.random()*17+1) * box,y : Math.floor(Math.random()*15+3) * box});
    }
    else if(level>2)
    t2+=1;
    if(level==5){
        for(let i=0;i<wall.length;i++){
            context.fillStyle= "rgb(247, 132, 45)";
            context.fillRect(wall[i].x,wall[i].y,box,wall[i].height);
            context.strokeStyle = "rgb(52, 125, 235)";
            context.strokeRect(wall[i].x,wall[i].y,box,wall[i].height);
        }        
    }
    for(let i=0;level>1&&i<mine.length;i++){
        if(!(mine[i].x!=food.x||mine[i].y!=food.y)){        
            mine[i].x= Math.floor(Math.random()*17+1) * box;
            mine[i].y= Math.floor(Math.random()*15+3) * box
        }
        context.drawImage(mineImg,mine[i].x,mine[i].y);
    }
    // old head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;
    
    // which direction
    if( d == "LEFT") snakeX -= box;
    if( d == "UP") snakeY -= box;
    if( d == "RIGHT") snakeX += box;
    if( d == "DOWN") snakeY += box;
    if(score==100){
        context.fillStyle = "white";
    context.font = "45px Changa one";
        context.fillText("You Won",13*box,1.6*box);
        clearInterval(game);
        levelUp.play();
    }
    if(score-prescore==20)
    {
        prescore=score;
        level++;
        if(level==2)
            isMine=true;
        if(level==5)
            isWall=true;
        speed-=10;
        speedFlag++;
        levelUp.play();
    }
    // if the snake eats the mine
    if(isMine&&collision({x:snakeX,y:snakeY},mine)||level==5&&wallCollision(wall,snake)){  
        context.fillStyle = "white";
    context.font = "45px Changa one";
        context.fillText("You Lost",13*box,1.6*box);                             
        clearInterval(game);                   
        dead.play();                      
    }    
    //  if snake eats the food
    if(snakeX == food.x && snakeY == food.y){
        score++;
        eat.play();
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }
    }    
    else{
        // remove the tail
        snake.pop();
    }
    
    // add new Head
    
    let newHead = {
        x : snakeX,
        y : snakeY
    }
    
    // game over
    
    if((level>3&&(snakeX < box || snakeX > 17 * box || snakeY < 3*box || snakeY > 17*box ))|| collision(newHead,snake)){                        
        context.fillStyle = "white";
        context.fillText("You Lost",13*box,1.6*box);
        clearInterval(game);
        dead.play();        
    }//passing throught the walls
    else if(snakeX < box){
        newHead.x=17*box;
        if(snakeX == food.x && snakeY == food.y){
            score++;
            eat.play();
            food = {
                x : Math.floor(Math.random()*17+1) * box,
                y : Math.floor(Math.random()*15+3) * box
            }
            // we don't remove the tail
        }
    }
    else if(snakeX>17*box){
        newHead.x=box;
    }
    else if(snakeY<3*box){
        newHead.y=17*box;        
    }
    else if(snakeY>17*box){
        newHead.y=3*box;
    }
    if(newHead.x == food.x && newHead.y == food.y){
        score++;
        eat.play();
        food = {
            x : Math.floor(Math.random()*17+1) * box,
            y : Math.floor(Math.random()*15+3) * box
        }               
    }
    snake.unshift(newHead);    
    context.fillStyle = "white";
    context.font = "45px Changa one";
    context.fillText(score,2*box,1.6*box);
    context.fillText(score,2*box,1.6*box);    
    context.fillText("Level- "+level,5*box,1.6*box);
}
btn.addEventListener("click",function(){    
    if(btn.value=="Click here to Restart Game"){
        window.location.reload();        
    }
    else{
        btn.value="Click here to Restart Game";
        btn.innerHTML=btn.value;
    }
});
let game = setInterval(draw,speed);
//game=setInterval(gameOver,100);














