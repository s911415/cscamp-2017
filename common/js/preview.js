$(function () {
    "use strict";
    $("#demoLinks a").click(function (e) {
        var href = this.href;
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
});