var Token = localStorage.getItem("Token");;


function getRequests() {
    var url = "https://api.un1c0de.com/api/requests";
    var result = Method_Post(url, Token);
    if (JSON.parse(result).isPrevTokenValid == false) {
        Register(true);
        return getRequests();
    }
    JSON.parse(result);
    return JSON.parse(result);
}
function getSystemInfo() {
    var url = "https://api.un1c0de.com/api/ServerStatus";
    var result = Method_Post(url, Token);
    if (JSON.parse(result).isPrevTokenValid == false) {
        Register(true);
        return getSystemInfo();
    }
    JSON.parse(result);
    return JSON.parse(result);
}
function Register(force) {
    if (force == true) {
        var url = "https://api.un1c0de.com/api/register";

        var result = Method_Post(url, localStorage.getItem("Token"));
        localStorage.setItem("TokenGetTime", Date.now());
        localStorage.setItem("Token", JSON.parse(result).Token);
        localStorage.setItem("TokenTimeout", JSON.parse(result).TokenTimeout);
        Token = localStorage.getItem("Token");
        return;
    }
    Token = localStorage.getItem("Token");
    if (localStorage.getItem("Token") != null && Date.now() - localStorage.getItem("TokenGetTime") < localStorage.getItem("TokenTimeout")) {
        return;
    }
    var url = "https://api.un1c0de.com/api/register";

    var result = Method_Post(url, localStorage.getItem("Token"));
    if (JSON.parse(result).isPrevTokenValid == true) {
        return;
    }
    localStorage.setItem("TokenGetTime", Date.now());
    localStorage.setItem("Token", JSON.parse(result).Token);
    localStorage.setItem("TokenTimeout", JSON.parse(result).TokenTimeout);
    Token = localStorage.getItem("Token");
    return;
}
function Method_Get(url) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('GET', url, false);


    httpRequest.send();
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {

        return httpRequest.responseText;
    }
    return "{}";
}
function Method_Post(url, body) {
    var httpRequest = new XMLHttpRequest();
    httpRequest.open('POST', url, false);
    httpRequest.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    httpRequest.send(body);
    if (httpRequest.readyState == 4 && httpRequest.status == 200) {

        return httpRequest.responseText;
    }
    return "{}";
}