/* ---------------- MOBILE BLOCK ---------------- */

const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(navigator.userAgent);

if (isMobile) {
    alert("Mobile devices are not allowed. Please use Desktop or Laptop.");
    document.body.innerHTML =
        "<h2 style='text-align:center;margin-top:120px'>Access Denied - Desktop Only</h2>";
}


/* ---------------- FULLSCREEN ---------------- */

function enterFullScreen() {
    const el = document.documentElement;
    if (el.requestFullscreen) {
        el.requestFullscreen();
    }
}


/* ---------------- MAIN SCRIPT ---------------- */

window.addEventListener("DOMContentLoaded", () => {

    enterFullScreen();

    let submitted = false;
    const form = document.getElementById("testForm");


/* ---------------- TIMER ---------------- */

    const timerEl = document.getElementById("timer");
    let timeLeft = parseInt(timerEl.dataset.time);

    function formatTime(t) {
        let m = Math.floor(t / 60);
        let s = t % 60;
        return m + ":" + (s < 10 ? "0" : "") + s;
    }

    timerEl.innerText = formatTime(timeLeft);

    const timer = setInterval(() => {

        if (timeLeft <= 0 && !submitted) {
            submitted = true;
            alert("Time up. Exam submitted.");
            form.submit();
        }

        timeLeft--;
        timerEl.innerText = formatTime(timeLeft);

    }, 1000);


/* ---------------- TAB SWITCH DETECTION ---------------- */

    document.addEventListener("visibilitychange", () => {

        if (document.hidden && !submitted) {
            submitted = true;
            alert("Tab switch detected. Exam submitted.");
            form.submit();
        }

    });


/* ---------------- FULLSCREEN EXIT ---------------- */

    document.addEventListener("fullscreenchange", () => {

        if (!document.fullscreenElement && !submitted) {
            submitted = true;
            alert("Fullscreen exited. Exam submitted.");
            form.submit();
        }

    });


/* ---------------- DISABLE RIGHT CLICK ---------------- */

    document.addEventListener("contextmenu", (e) => {
        e.preventDefault();
    });


/* ---------------- DISABLE COPY / PASTE ---------------- */

    document.addEventListener("copy", e => e.preventDefault());
    document.addEventListener("paste", e => e.preventDefault());
    document.addEventListener("cut", e => e.preventDefault());


/* ---------------- DEVTOOLS DETECT ---------------- */

    setInterval(() => {

        const threshold = 160;

        if (
            window.outerHeight - window.innerHeight > threshold ||
            window.outerWidth - window.innerWidth > threshold
        ) {
            alert("Developer tools detected. Exam submitted.");
            form.submit();
        }

    }, 1000);


/* ---------------- WINDOW RESIZE DETECT ---------------- */

    window.addEventListener("resize", () => {
        alert("Window resize detected. Exam submitted.");
        form.submit();
    });


/* ---------------- BLOCK SHORTCUT KEYS ---------------- */

    document.addEventListener("keydown", (e) => {

        if (
            e.key === "Escape" ||
            e.key === "F11" ||
            (e.ctrlKey && ["t", "w", "n", "r", "u", "s", "c"].includes(e.key.toLowerCase()))
        ) {
            e.preventDefault();
        }

    });


/* ---------------- BACK BUTTON BLOCK ---------------- */

    history.pushState(null, null, location.href);

    window.onpopstate = () => history.go(1);



/* =====================================================
   QUESTION PALETTE SYSTEM
===================================================== */

    const questions = document.querySelectorAll(".question");
    const palette = document.getElementById("questionPalette");

    questions.forEach((q, index) => {

        let box = document.createElement("div");

        box.classList.add("qbox");   // default = unseen

        box.innerText = index + 1;

        palette.appendChild(box);

        box.onclick = () => {

            box.classList.add("seen");

            document.getElementById("question" + (index + 1)).scrollIntoView({
                behavior: "smooth"
            });

        };

    });


/* ---------------- ANSWER DETECT ---------------- */

    const radios = document.querySelectorAll("input[type='radio']");

    radios.forEach(radio => {

        radio.addEventListener("change", function(){

            const questionDiv = this.closest(".question");
            const qIndex = questionDiv.id.replace("question","") - 1;

            const boxes = document.querySelectorAll(".qbox");

            boxes[qIndex].classList.remove("seen");
            boxes[qIndex].classList.add("answered");

        });

    });


/* ---------------- MARK FOR REVIEW ---------------- */

    const reviewBtns = document.querySelectorAll(".review-btn");

    reviewBtns.forEach((btn,index)=>{

        btn.addEventListener("click",function(){

            const boxes = document.querySelectorAll(".qbox");

            boxes[index].classList.remove("answered");
            boxes[index].classList.add("marked");

        });

    });

});