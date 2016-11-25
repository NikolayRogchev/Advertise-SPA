function showInfo(msg) {
    $('#infoBox').text(msg);
    $('#infoBox').show();
    setTimeout(function () {
        $('#infoBox').fadeOut();
    }, 3000);
}

function showError(response) {
    let errorMsg = JSON.stringify(response);
    if (response.responseJSON &&
        response.responseJSON.description) {
        errorMsg = response.responseJSON.description;
    }

    $('#errorBox').text(errorMsg);
    $('#errorBox').show();
    setTimeout(function () {
        $('#errorBox').fadeOut();
    }, 4000)

}

module.exports = {showInfo, showError};