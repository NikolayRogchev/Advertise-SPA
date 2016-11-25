let showError = require('./utility.js').showError;
let redirect = require('./views.js').redirect;
let showInfo = require('./utility.js').showInfo;

const baseUrl = 'https://baas.kinvey.com/';
const appId = 'kid_B1KRMHmGl';
const appSecret = '8a9e74562beb4b5299a0ec1a2b4eb0a2';


function registerUser() {
    let username = $('#formRegister input[name = username]').val();
    let pass = $('#formRegister input[name = passwd]').val();
    // TODO: Validate username and password
    let url = baseUrl + 'user/' + appId + '/';
    let userData = {username: username, password: pass};
    console.dir(userData);
    let headers = {'Content-Type': 'application/json', 'Authorization': "Basic " + btoa(appId + ':' + appSecret)};
    $.ajax({
        method: 'POST',
        url: url,
        headers: headers,
        data: JSON.stringify(userData)
    })
        .then(function () {
            redirect('#viewHome');
            showInfo('Registration successful! Please log in.');
            $('#formRegister input[name = username]').val('');
            $('#formRegister input[name = passwd]').val('');
        })
        .catch(function (err) {
            showError(err);
        })
}

function loginUser() {
    let username = $('#formLogin input[name = username]').val();
    let pass = $('#formLogin input[name = passwd]').val();
    let url = baseUrl + 'user/' + appId + '/login';
    let userData = {username: username, password: pass};
    let headers = {'Content-Type': 'application/json', 'Authorization': "Basic " + btoa(appId + ':' + appSecret)};
    let loginReq = new Promise(function (resolve, reject) {
        $.ajax({
            method: 'POST',
            url: url,
            headers: headers,
            data: JSON.stringify(userData),
            success: resolve,
            error: reject
        })
    });

    loginReq.then(function (data) {
        if(data.username == 'admin'){
            sessionStorage.setItem('role', 'admin');
        }
        sessionStorage.setItem('username', data.username);
        sessionStorage.setItem('authToken', data._kmd.authtoken);
        sessionStorage.setItem('userId', data._id);
        redirect('#viewHome');
        showInfo('Logged in!');
    });
    loginReq.catch(function (err) {
        showError(err);
    });
}

module.exports = {
    registerUser,
    loginUser
};