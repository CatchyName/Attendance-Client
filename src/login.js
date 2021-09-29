const form = document.getElementById("login");
const ip = document.getElementById("ip");
const pass = document.getElementById("pass");
const err = document.getElementById("error");

form.onsubmit = async e => {

    e.preventDefault();

    let response = await fetch("http://" + ip.value + "/terminal/login", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            password: pass.value,
        }),
    }).then(res => res.json());

    if (response[0]) {
        localStorage.setItem("url", "http://" + ip.value);
        localStorage.setItem("sessionID", response[0]);

        window.location.replace("index.html");

    } else {
        pass.value = "";
        err.innerHTML = "Wrong password";
    }
}