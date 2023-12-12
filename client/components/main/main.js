(function () {
    let tags = [];

    const editorMixin = {
        callbacks: {
            onChange: function(contents, $editable) {
                // displayUnfilledTags(extractContentInDoubleBraces(contents));
                setTags(extractContentInDoubleBraces(contents));
            }
        }
    }

    const setTags = (arr) => {
        const onlyUnique = (value, index, array) => {
            return array.indexOf(value) === index;
        }

        tags = arr.filter(onlyUnique);
    }

    // const displayUnfilledTags = (arr) => {
    //     if (Array.isArray(arr)) {
    //         let str = '';
    //
    //         tags = arr;
    //
    //         arr.forEach(tag => {
    //             str += `<div class="tag-to-be-filled">{{&nbsp;${tag}&nbsp;}}</div>`
    //         })
    //
    //         document.getElementById('unfilled-tags').innerHTML = str;
    //     }
    // }

    const extractContentInDoubleBraces = (inputString) => {
        const regex = /{{(.*?)}}/g;
        const matches = [];
        let match;

        while ((match = regex.exec(inputString)) !== null) {
            matches.push(match[1].trim());
        }

        return matches;
    }


    const serializeParams = () => {
        const urlSearchParams = new URLSearchParams(window.location.search);

        return Object.fromEntries(urlSearchParams.entries());
    }

    const initClient = () => {
        const { fileName, mode } = serializeParams();

        if (fileName) {
            $('.divider, #create-new').remove();

            $.ajax(`/storage/${fileName}.html`).then((res) => {
                const $summernoteBlock = $('#summernote');

                // displayUnfilledTags(extractContentInDoubleBraces(res));
                setTags(extractContentInDoubleBraces(res));

                $summernoteBlock[0].innerHTML = res;
                $summernoteBlock.summernote({
                    minHeight: 400,
                    ...editorMixin
                });
                $('.action-buttons-wrapper').show();
                $('.document-name').html(`${fileName}.html`);

                addHighlightListener();
            })
                .catch(() => {
                    document.body.innerHTML = '<h1">Document Not found</h1>'
                });
        } else if (mode === 'creation') {
            const $summernoteBlock = $('#summernote');

            $summernoteBlock[0].innerHTML = '';
            $summernoteBlock.summernote({
                minHeight: 400,
                ...editorMixin
            });
            $('#save-btn').remove();
            $('.action-buttons-wrapper').show();
            $('.divider, #create-new').remove();

            addHighlightListener();
        }
    }

    const printSuccessMessageAndRedirect = () => {
        $('body').html('<h3 class="success-message">Document saved ✓</h3>');

        setTimeout(() => {
            redirect();
        },1500);
    }

    const redirect = () => {
        window.location.href = '/';

    }

    const addHighlightListener = () => {
        document.querySelectorAll('.note-editable')[0].addEventListener('mouseup', (e) => {
            const highlightedText = getHighlightedText();

            document.body.querySelectorAll('.popup')[0]?.remove();

            if (`${highlightedText}`.trim()) {
                showPopup(e.pageX, e.pageY, highlightedText);
            }
        });
    }

    const getHighlightedText = () => {
        const selection = window.getSelection();

        return selection.toString();
    }

    const showPopup = (x, y, highlightedText) => {
        const popup = document.createElement('div');

        if (!tags.length) {
            return;
        }

        popup.className = 'popup';
        popup.style.top = y + 'px';
        popup.style.left = x + 'px';

        tags.forEach((option) => {
            const button = document.createElement('button');
            const optionAsTag = `{{ ${option} }}`

            button.textContent = optionAsTag;
            button.addEventListener('click', () => {
                replaceText(highlightedText, optionAsTag);
                document.body.removeChild(popup);
            });
            popup.appendChild(button);
        });

        // Append the popup to the body
        document.body.appendChild(popup);
    }

    const replaceText = (oldText, newText) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);

        range.deleteContents();
        range.insertNode(document.createTextNode(newText));
    }

    $('#save-btn').click(() => {
        const markup = $('#summernote').summernote('code');
        const { fileName } = serializeParams();

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

    $('#create-new').click(() => {
        window.location.href = '?mode=creation';
    })

    $('#cancel-btn').click(redirect);

    initClient();
})();
