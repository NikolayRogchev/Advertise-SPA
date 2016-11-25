function redirect(target) {
    $('main section').hide();
    $('header').children().hide();
    $(target).show();
    if (sessionStorage.getItem('username')) {
        $('#linkHome, #linkListAds, #linkCreateAd, #linkLogout').show();
    } else {
        $('#linkHome, #linkLogin, #linkRegister ').show();
    }
}

module.exports = {redirect};