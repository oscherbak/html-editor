$('#get-document-btn').click(async () => {
    const inputValue = $('#url-input')[0].value;
    const $summernoteBlock = $('#summernote');

    $summernoteBlock[0].innerHTML = await $.ajax(inputValue);
    $summernoteBlock.summernote();
    $('#download-file-btn').show();
    $('.url-block-wrapper').remove();
});

$('#download-file-btn').click(async () => {
    const markup = $('#summernote').summernote('code');

    const response = await $.ajax({
        url: '/save',
        contentType: 'application/json',
        method: 'post',
        data: JSON.stringify({
            markup
        })
    });

    window.location.href = '/download?id=' + response.id;
})
