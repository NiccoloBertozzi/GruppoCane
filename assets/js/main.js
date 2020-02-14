/*
	Dopetrope by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/
$(function () {
    var posizioneCorrente = 1;
    var numeropagine;
    var siteScroll = function () {
        var title = false;
        $(window).scroll(function () {

            var st = $(this).scrollTop();

            if (st > 100) {
                if (!title) {
                    $("#nav>ul").prepend("<li class='titolo'>Ufficio Anagrafe</li>")
                    title = true;
                }
                $('#nav').addClass('shrink');
            } else {
                if (title) {
                    $("#nav>ul").find(":first").remove();
                    title = false;
                }
                $('#nav').removeClass('shrink');
            }

        })
    };
    var persone = new Array();
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://late-frost-5190.getsandbox.com/anagrafiche",
        dataType: "json",
        success: function (data) {
            $.each(data, function (i, value) {
                persone.push(Object.assign({}, value))
            });
            CalcPag();
            function CalcPag() {
                $(".pagination").empty();
                if (((persone.length) % $("#shownumber").val()) == 0) numeropagine = parseInt(persone.length / $("#shownumber").val());
                else numeropagine = parseInt((persone.length / $("#shownumber").val()) + 1);
                $(".pagination").append('<li class="page-item" id="previous"> <a class="page-link" href="#arrivo" tabindex="-1"  style="text-decoration:none"aria-disabled="true">Previous</a> </li>');
                for (let i = 0; i < numeropagine; i++) {
                    $(".pagination").append('<li class="page-item numeri"><a class="page-link" style="text-decoration:none" href="#arrivo">' + (i + 1) + '</a></li>');
                }
                $(".pagination").append('<li class="page-item" id="next"> <a class="page-link" href="#arrivo" style="text-decoration:none"tabindex="-1" aria-disabled="true">Next</a> </li>');
                StampaTabella(1, $("#shownumber").val());
            }
            function AggiornaTabella() {
                $("#persone").empty();
            }
            /*STAMPA*/
            function StampaTabella(indicePartenza, numShow) {
                AggiornaTabella();
                for (let i = ((indicePartenza * 10) - 10); i < (numShow * indicePartenza); i++) {
                    $("#persone").append("<tr><th scope='row'>" + (i + 1) + "</th><td>" + persone[i].nome + "</td><td>" + persone[i].cognome + "</td><td>" + persone[i].luogo_residenza.regione + "</td><td>" + persone[i].luogo_residenza.provincia + "</td><td>" + persone[i].luogo_residenza.comune + "</td><td>" + persone[i].anno + "</td></tr>")
                }
            }
            $("#shownumber").change(function () {
                CalcPag();
            });
            $("#previous").on("click", function () {
                if (posizioneCorrente == 1) posizioneCorrente++;
                posizioneCorrente--;
                StampaTabella(posizioneCorrente, $("#shownumber").val());
            });
            $("#next").on("click", function () {
                if (posizioneCorrente == numeropagine) posizioneCorrente--;
                posizioneCorrente++;
                StampaTabella(posizioneCorrente, $("#shownumber").val());
            });
            $(".numeri>.page-link").on("click", function () {
                var testo = $(this).text();
                posizioneCorrente = testo;
                StampaTabella(testo, $("#shownumber").val());
            });
        }
    });
    siteScroll();
    var $window = $(window),
        $body = $('body');

    // Breakpoints.
    breakpoints({
        xlarge: ['1281px', '1680px'],
        large: ['981px', '1280px'],
        medium: ['737px', '980px'],
        small: [null, '736px']
    });

    // Play initial animations on page load.
    $window.on('load', function () {
        window.setTimeout(function () {
            $body.removeClass('is-preload');
        }, 100);
    });

    // Dropdowns.
    $('#nav > ul').dropotron({
        mode: 'fade',
        noOpenerFade: true,
        alignment: 'center'
    });

    // Nav.

    // Title Bar.
    $(
        '<div id="titleBar">' +
        '<a href="#navPanel" class="toggle"></a>' +
        '</div>'
    )
        .appendTo($body);

    // Panel.
    $(
        '<div id="navPanel">' +
        '<nav>' +
        $('#nav').navList() +
        '</nav>' +
        '</div>'
    )
        .appendTo($body)
        .panel({
            delay: 500,
            hideOnClick: true,
            hideOnSwipe: true,
            resetScroll: true,
            resetForms: true,
            side: 'left',
            target: $body,
            visibleClass: 'navPanel-visible'
        });



});