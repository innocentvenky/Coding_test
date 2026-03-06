function enterFullScreen() {

const el = document.documentElement;

if(el.requestFullscreen){
el.requestFullscreen();
}

}

window.addEventListener("DOMContentLoaded",()=>{

enterFullScreen();

const timerEl = document.getElementById("timer");

let timeLeft = parseInt(timerEl.dataset.time);

let submitted = false;

function formatTime(t){

let m = Math.floor(t/60);

let s = t%60;

return m+":"+(s<10?"0":"")+s;

}

timerEl.innerText = formatTime(timeLeft);

setInterval(()=>{

if(timeLeft<=0 && !submitted){

submitted=true;

alert("Time up. Exam submitted");

document.getElementById("testForm").submit();

}

timeLeft--;

timerEl.innerText=formatTime(timeLeft);

},1000);



const totalQuestions=document.querySelectorAll(".question").length;

document.getElementById("totalQ").innerText=totalQuestions;



function updateStatus(){

let answered=0;

document.querySelectorAll(".question").forEach(q=>{

if(q.querySelector("input[type='radio']:checked")){

answered++;

}

});

document.getElementById("answeredQ").innerText=answered;

document.getElementById("remainingQ").innerText=totalQuestions-answered;

}


document.querySelectorAll("input[type='radio']").forEach(r=>{

r.addEventListener("change",updateStatus);

});

updateStatus();



document.addEventListener("visibilitychange",()=>{

if(document.hidden && !submitted){

submitted=true;

alert("Tab switch detected");

document.getElementById("testForm").submit();

}

});



document.addEventListener("fullscreenchange",()=>{

if(!document.fullscreenElement && !submitted){

submitted=true;

alert("Fullscreen exited");

document.getElementById("testForm").submit();

}

});



document.addEventListener("keydown",(e)=>{

if(

e.key==="Escape" ||

e.key==="F11" ||

(e.ctrlKey && ["t","w","n","r"].includes(e.key.toLowerCase()))

){

e.preventDefault();

}

});



history.pushState(null,null,location.href);

window.onpopstate=()=>history.go(1);

});