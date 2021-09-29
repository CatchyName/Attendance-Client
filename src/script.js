let form = document.getElementById("scan");
let id = document.getElementById("id");
let err = document.getElementById("error");
let employee = document.getElementById("employee");

let name = document.getElementById("name");
let userID = document.getElementById("userID");
let image = document.getElementById("image");
let status = document.getElementById("status");
let select = document.getElementById("select");

const ip = localStorage.getItem("url");
const sessionID = localStorage.getItem("sessionID");

const Load = async () => {
    id.value = "";
    id.disabled = true;

    let r = await fetch(ip + "/terminal/centers", {
        mode: 'cors',
        method: 'get',
        headers: {
            'Content-Type': 'application/json',
        },
    }).then(res => res.json());

    for (let i = 0; i < r.length; i++) {
        var option = document.createElement("option");
        option.textContent = r[i];
        option.value = i + 1;
        select.appendChild(option);
    }

    id.value = "";
    id.disabled = false;
    id.focus();
}

Load();

form.onsubmit = async e => {
    e.preventDefault();

    let parsedID = parseInt(id.value);

    if (!parsedID) {
        err.innerHTML = "ID can only be an integer.";
        id.value = "";
        return;
    }

    if (parsedID < 10000 || parsedID > 999999 || parsedID < 0) {
        err.innerHTML = "ID cannot exist.";
        id.value = "";
        return;
    }
    err.innerHTML = "";

    id.disabled = true;

    // Contact server
    let response = await fetch(ip + "/terminal/scan", {
        mode: 'cors',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sessionID: sessionID,
            employeeID: parsedID,
            departmentID: parseInt(select.options[select.selectedIndex].value)
        }),
    }).then(res => res.json());


    if (response) {

        name.innerHTML = response.name;

        if (response.sessions[0].finish) {
            const date = new Date(response.sessions[0].start);
            status.innerHTML = "Employee left " + response.sessions[0].department + " on " + date.toTimeString();
        } else {
            status.innerHTML = "Employee is in the department";
        }

        userID.innerHTML = "id : " + parsedID;

    } else {
        error.innerHTML = "Something went wrong.";
    }

    id.value = "";
    id.disabled = false;
    id.focus();
}
