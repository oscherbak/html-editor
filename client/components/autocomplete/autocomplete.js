(function () {
    const onSelect = (documentName) => {
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());

        params.fileName = documentName;

        const query = new URLSearchParams(params).toString();

        window.location.href = `?${query}`;
    }

    $.ajax('/documents').then(res => {
        const { files } = res;

        if (files.length) {
            const $elem = $( "#autocomplete" ).autocomplete({
                source: files,
                minLength: 0,
                select: function (event, ui) {
                    const value = ui.item.value;

                    onSelect(value);
                }
            }).focus(function () {
                $(this).autocomplete("search");
            });

            $elem.data("ui-autocomplete")
                ._renderItem = function (ul, item) {
                if (this.term) {
                    var newText = String(item.value).replace(
                        new RegExp(this.term, "gi"),
                        "<b>$&</b>");
                } else {
                    newText = item.value;
                }

                return $("<li></li>")
                    .data("item.autocomplete", item)
                    .append("<div>" + newText + "</div>")
                    .appendTo(ul);
            };
        }
    })

})()
