let showInfo = require('./utility.js').showInfo;
let showError = require('./utility.js').showError;
let redirect = require('./views.js').redirect;

const baseUrl = 'https://baas.kinvey.com/';
const appId = 'kid_B1KRMHmGl';
const appSecret = '8a9e74562beb4b5299a0ec1a2b4eb0a2';
let headers = {'Content-Type':'application/json'};

function loadAdverts() {
    let url = baseUrl + 'appdata/' + appId + '/adverts/';
    let authToken = sessionStorage.getItem('authToken');
    let headers = {'Content-Type': 'application/json', 'Authorization': 'Kinvey ' + authToken};
    let listAdRequest = new Promise(function (resolve, reject) {
        $.ajax({
            method: 'GET',
            url: url,
            headers: headers,
            success: resolve,
            error: reject
        })
    });
    listAdRequest.then(function (ads) {
        // TODO: Sort adverts by date
        displayAdverts(ads);
        showInfo('Ads loaded')
    });
    listAdRequest.catch(function (err) {
        showError(err);
    })
}

function createAd() {
    let tittle = $('#formCreateAd input[name = title]').val();
    let descr = $('#formCreateAd textarea[name = description]').val();
    let datePublished = $('#formCreateAd input[name = datePublished]').val();
    let price = $('#formCreateAd input[name = price]').val();
    let image = $('#formCreateAd input[name = image]').val();
    let adData = {
        title: tittle,
        description: descr,
        datePublished: datePublished,
        publisher: sessionStorage.getItem('username'),
        price: price,
        image: image
    };
    let url = baseUrl + 'appdata/' + appId + '/adverts/';
    headers['Authorization'] = 'Kinvey ' + sessionStorage.getItem('authToken');
    let createAd = new Promise(function (resolve, reject) {
        $.ajax({
            method: 'POST',
            url: url,
            headers: headers,
            data: JSON.stringify(adData),
            success: resolve,
            error: reject
        });
    });
    createAd.then(function () {
        showInfo('Advert successfully created!');
        loadAdverts();
    });
    createAd.catch(function (err) {
        showError(err);
    })
}

function editAd(id) {
    let url = baseUrl + 'appdata/' + appId + '/adverts/' + id;
    let authToken = sessionStorage.getItem('authToken');
    let headers = {'Content-Type': 'application/json', 'Authorization': 'Kinvey ' + authToken};
    let getAd = new Promise(function (resolve, reject) {
        $.ajax({
            method: 'GET',
            url: url,
            headers: headers,
            success: resolve,
            error: reject
        })
    });
    getAd.then(function (ad) {
        $('#formEditAd .image').remove();
        $('#formEditAd input[name = title]').val(ad.title);
        $('#formEditAd textarea[name = description]').val(ad.description);
        $('#formEditAd input[name = datePublished]').val(ad.datePublished);
        $('#formEditAd input[name = price]').val(ad.price);
        let img = $('#formEditAd input[name = image]');
        img.val("");
        $('#formEditAd div:contains("Image")').prepend(`<div class="image"><img src=${ad.image} class="imageSrc" alt="Image not found!"></div>`);
        redirect('#viewEditAd');
    });
    getAd.catch(function (err) {
        showError(err);
    })

}

function detailsAd(id) {
    alert('row clicked')
}

function deleteAd(id) {
    let url = baseUrl + 'appdata/' + appId + '/adverts/' + id;
    headers['Authorization'] = 'Kinvey ' + sessionStorage.getItem('authToken');
    $.ajax({
        method: 'DELETE',
        url: url,
        headers: headers,
        success: function () {
            loadAdverts();
            showInfo('Advert deleted!');
        },
        error: function (err) {
            showError(err);
        }
    });
}

function displayAdverts(ads) {
    let table = $('#ads table');
    $('#ads table tr').slice(1).remove(); // Skips the row with the headers and removes the other children
    console.dir(ads)
    for (let ad of ads) {
        let row = $('<tr>');
        row.append($(`<td>${ad.title}</td>`));
        row.append($(`<td>${ad.publisher}</td>`));
        row.append($(`<td>${ad.description}</td>`));
        row.append($(`<td>${ad.price}</td>`));
        row.append($(`<td>${ad.datePublished}</td>`));
        let deleteLink = '';
        let editLink = '';
        if (sessionStorage.getItem('userId') == ad._acl.creator) {
            deleteLink = $('<a href="#">[Delete]</a>');
            deleteLink.click(function () {
                deleteAd(ad._id);
            });
            editLink = $('<a href="#">[Edit]</a>');
            editLink.click(function () {
                editAd(ad._id);
            });
        }
        /* Attaches click event on the whole row except the last cell */
        row.children().slice(row.length - 2).click(function () {
            detailsAd(ad._id);
        });

        row.append($(`<td>`).append(deleteLink, editLink));
        table.append(row)
    }
    redirect('#viewAds');
}

module.exports = {loadAdverts, createAd};