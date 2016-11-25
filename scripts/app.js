let registerUser = require('./user.js').registerUser;
let loginUser = require('./user.js').loginUser;
let redirect = require('./views.js').redirect;
let loadAdverts = require('./advert.js').loadAdverts;
let createAd = require('./advert.js').createAd;

(function () {
    redirect('#viewHome');
    attachEvents();

    function attachEvents() {
        $('#linkHome').click(function () {
            redirect('#viewHome');
        });
        $('#linkLogin').click(function () {
            redirect('#viewLogin');
        });
        $('#linkRegister').click(function () {
            redirect('#viewRegister');
        });
        $('#linkLogout').click(function () {
            sessionStorage.clear();
            redirect('#viewHome');
        });
        $('#linkListAds').click(function () {
            loadAdverts();
        });
        $('#linkCreateAd').click(function () {
            redirect('#viewCreateAd');
        });
        $('#buttonRegisterUser').click(registerUser);
        $('#buttonLoginUser').click(loginUser);
        $('#buttonCreateAd').click(createAd);
    }

    $(document).ajaxStart(function () {
        $('#loadingBox').show();
    });
    $(document).ajaxStop(function () {
        $('#loadingBox').hide();
    });
})();