$(function () {
    "use strict";
    var hashFromClick = false;
    $("#demoLinks a").click(function (e) {
        var href = this.href;
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
            pre.appendChild(code);
            code.textContent = html;

            $("#source").html('').append(pre);
            hljs.highlightBlock(code);

            var iframe = document.createElement('iframe');
            iframe.src = 'about:blank';
            $("#preview").html('').append(iframe);

            iframe.contentDocument.write(html);
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

        var hash = encodeURIComponent(location.hash.substr(1));
        var a = $("a[href$='" + hash + "']");
        if(hash.length===0){
        }else if(a.length===1){
            a.click();
        }else{
            $("#source, #preview").empty();
            location.hash = "";
        }
    }

    $(window).bind('hashchange', function (e) {
        handleHashChange();
    });
    handleHashChange();
});