$(function () {
    "use strict";
    var hashFromClick = false;
    $("#demoLinks a").click(function (e) {
        if (this.target != "") return;
        var href = this.href;
        var srcType = this.getAttribute('data-type') || 'html';
        var preview = this.getAttribute('data-preview');
        if (preview === null) preview = '1';
        hashFromClick = true;
        location.hash = this.getAttribute('href');
        $.ajax(href, {
            type: "GET",
            cache: true,
            dataType: 'text',
            withCredentials: true
        }).done(function (html) {
            let pre = document.createElement('pre');
            var code = document.createElement('code');
            code.classList.add(srcType);
            pre.appendChild(code);
            code.textContent = html;

            $("#source").html('').append(pre);
            hljs.highlightBlock(code);


            var prevDom = $("#preview");
            if(preview==='1'){
                var iframe = document.createElement('iframe');
                iframe.src = 'about:blank';
                prevDom.html('').append(iframe);

                iframe.contentDocument.write(html);
                prevDom.show();
            }else{
                prevDom.hide();
            }


        }).fail(function () {
            location.href = href;
        });

        e.preventDefault();
    });

    function handleHashChange() {
        if (hashFromClick) {
            hashFromClick = false;
            return;
        }

        var hash = encodeURIComponent(location.hash.substr(1)).replace(/%2F/ig, '/');
        var a = $("a[href$='" + hash + "']");
        if (hash.length === 0) {
        } else if (a.length === 1) {
            a.click();
        } else {
            $("#source, #preview").empty();
            location.hash = "";
        }
    }

    $(window).bind('hashchange', function (e) {
        handleHashChange();
    });
    handleHashChange();
});