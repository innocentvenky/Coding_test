
function togglePassword() {
    const input = document.getElementById("passwordField");
    const text = event.target;

    if (input.type === "password") {
        input.type = "text";
        text.innerText = "Hide";
    } else {
        input.type = "password";
        text.innerText = "Show";
    }
}
