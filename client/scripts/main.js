const getFileNameFromURL = () => {
    const urlSearchParams = new URLSearchParams(window.location.search);
    const params = Object.fromEntries(urlSearchParams.entries());
    const { fileName } = params;

    return fileName;
}

const initClient = () => {
    const fileName = getFileNameFromURL();

    if (fileName) {
        $.ajax(`/storage/${fileName}.html`).then((res) => {
            const $summernoteBlock = $('#summernote');

            $summernoteBlock[0].innerHTML = res;
            $summernoteBlock.summernote();
            $('.action-buttons-wrapper').show();
            $('.url-block-wrapper').remove();
        })
        .catch(() => {
            document.body.innerHTML = '<h1 class="text-center">Document Not found</h1>'
        });
    } else {
        document.body.innerHTML = '<h1 class="text-center">Document Not found</h1>';
    }
}

const printSuccessMessageAndRedirect = () => {
    $('.action-buttons-wrapper').html('<h3 class="success-message">Document saved ✓</h3>');

    setTimeout(() => {
        window.location.href = document.referrer || 'https://google.com'
    },2000);
    // window.location.href = redirected url
}

$('#save-btn').click(() => {
    const markup = $('#summernote').summernote('code');

    $.ajax({
        url: '/save',
        contentType: 'application/json',
        method: 'post',
        data: JSON.stringify({
            markup,
            fileName: getFileNameFromURL()
        })
    });

    printSuccessMessageAndRedirect();
});

$('#save-as-btn').click(() => {
    let fileName = prompt("Type name for your new file");
    const markup = $('#summernote').summernote('code');

    if (fileName) {
        $.ajax({
            url: '/save',
            contentType: 'application/json',
            method: 'post',
            data: JSON.stringify({
                markup,
                fileName
            })
        });

        printSuccessMessageAndRedirect();
    }

});

$('#cancel-btn').click(() => {
    window.location.href = document.referrer || 'https://google.com';
});

initClient();
