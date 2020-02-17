/*
	Dopetrope by HTML5 UP
	html5up.net | @ajlkn
	Free for personal and commercial use under the CCA 3.0 license (html5up.net/license)
*/
$(function() {
    var posizioneCorrente = 1;
    var numeropagine;
    var persone = new Array();
    var cercaList = new Array();
    var idedit;
    var selectedID;
    /*FALSE ORDINATO CRESCENTE TRUE DECRESCENTE*/
    var nomeorder = false,
        cognomeorder = false,
        regioneorder = false,
        provinciaorder = false,
        comuneorder = false,
        annoorder = false;
    var siteScroll = function() {
        var title = false;
        $(window).scroll(function() {

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
    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "https://late-frost-5190.getsandbox.com/anagrafiche",
        dataType: "json",
        success: function(data) {
            $.each(data, function(i, value) {
                persone.push(Object.assign({}, value))
            });
            CalcPag(persone);
        }
    });
    /*CERCA*/
    $(document).on("keyup", "#search", function() {
        cercaList.length = 0;
        AggiornaTabella();
        var i = 0;
        var val = $(this).val();
        if (val) {
            val = val.toLowerCase();
            $.each(persone, function(_, obj) {
                // console.log(val,obj.name.toLowerCase().indexOf(val),obj)
                if (obj.nome.toLowerCase().indexOf(val) != -1 || obj.cognome.toLowerCase().indexOf(val) != -1 || obj.luogo_residenza.regione.toLowerCase().indexOf(val) != -1 || obj.luogo_residenza.provincia.toLowerCase().indexOf(val) != -1 || obj.luogo_residenza.comune.toLowerCase().indexOf(val) != -1 || obj.anno.toString().indexOf(val) > -1) {
                    cercaList[i] = obj;
                    i++;
                }
            });
            CalcPag(cercaList);
        } else CalcPag(persone);
    });
    /*CALCOLO NUMERO DELLE PAGINE*/
    function CalcPag(array) {
        $(".pagination").empty();
        if (((array.length) % $("#shownumber").val()) == 0) numeropagine = parseInt(array.length / $("#shownumber").val());
        else numeropagine = parseInt((array.length / $("#shownumber").val()) + 1);
        $(".pagination").append('<li class="page-item" id="previous"> <a class="page-link" href="#main" tabindex="-1"  style="text-decoration:none"aria-disabled="true">Precedente</a> </li>');
        for (let i = 0; i < numeropagine; i++) {
            $(".pagination").append('<li class="page-item numeri"><a class="page-link" style="text-decoration:none" href="#main">' + (i + 1) + '</a></li>');
        }
        $(".pagination").append('<li class="page-item" id="next"> <a class="page-link" href="#main" style="text-decoration:none"tabindex="-1" aria-disabled="true">Successivo</a> </li>');
        StampaTabella(1, $("#shownumber").val());
    }
    /*SVOTA TABELLA*/
    function AggiornaTabella() {
        $("#persone").empty();
    }
    /*STAMPA*/
    function StampaTabella(indicePartenza, numShow) {
        AggiornaTabella();
        for (let i = ((indicePartenza * numShow) - numShow); i < (numShow * indicePartenza); i++) {
            if ($("#search").val()) {
                $("#persone").append("<tr><td scope='row'>" + (i+1) + "</td><td>" + cercaList[i].nome + "</td><td>" + cercaList[i].cognome + "</td><td>" + cercaList[i].luogo_residenza.regione + "</td><td>" + cercaList[i].luogo_residenza.provincia + "</td><td>" + cercaList[i].luogo_residenza.comune + "</td><td>" + cercaList[i].anno + "</td><td class=\"d-flex justify-content-center\"><i class=\"fas fa-trash-alt delete rounded\" title=\"Elimina\" id=\""+(i+1)+"\" data-toggle=\"modal\" data-target=\"#exampleModal\"></i><i class=\"fas fa-edit edit rounded\" title=\"Modifica\" id=\""+(i+1)+"\"data-toggle=\"modal\" data-target=\"#exampleModalEdit\"></i><i class=\"fas fa-church wedding rounded\" title=\"Matrimonio\"></i><i class=\"fas fa-home home rounded\" title=\"Residenza\"></i><i class=\"fas fa-skull morte rounded\" title=\"Decesso\" id=\""+(i+1)+"\" data-toggle=\"modal\" data-target=\"#modalMorte\"></i></td></tr>");
            } else {
                $("#persone").append("<tr><td scope='row'>" + (i+1) + "</td><td>" + persone[i].nome + "</td><td>" + persone[i].cognome + "</td><td>" + persone[i].luogo_residenza.regione + "</td><td>" + persone[i].luogo_residenza.provincia + "</td><td>" + persone[i].luogo_residenza.comune + "</td><td>" + persone[i].anno + "</td><td class=\"d-flex justify-content-center\"><i class=\"fas fa-trash-alt delete rounded\" title=\"Elimina\" id=\""+(i+1)+"\" data-toggle=\"modal\" data-target=\"#exampleModal\"></i><i class=\"fas fa-edit edit rounded\" title=\"Modifica\" id=\""+(i+1)+"\" data-toggle=\"modal\" data-target=\"#exampleModalEdit\"></i><i class=\"fas fa-church wedding rounded\" title=\"Matrimonio\"></i><i class=\"fas fa-home home rounded\" title=\" Residenza\"></i><i class=\"fas fa-skull morte rounded\" title=\"Decesso\" id=\""+(i+1)+"\" data-toggle=\"modal\" data-target=\"#modalMorte\"></i></td></tr>");
            }
        }
    }
    /*CONTROLLA CAMBIO NUM DI NOMI DA VEDERE NELLA PAGINA*/
    $("#shownumber").change(function() {
        CalcPag(persone);
    });
    /*COMPARA*/
    function compare(a, b) {
        let comparison = 0;
        if (a > b) {
            comparison = 1;
        } else if (a < b) {
            comparison = -1;
        }
        return comparison;
    }
    /*EDIT*/
    $(document).on("click", ".edit", function() {
            idedit=$(this).attr("id");           
    });
    $(document).on("click", ".inviaModifica", function() {
        dt = '{"nome": "' + $("#nomemod").val().toString() + '", "cognome": "' + $('#cognomemod').val().toString() + '", "anno_nascita": "' + $('#annomod').val().toString() + '", "regione": "' + $('#regionemod').val().toString() + '","provincia": "' + $('#provinciamod').val().toString() + '", "comune": "' + $('#comunemod').val().toString() + '", "anno": 2020}';
        $.ajax({
            type: "POST",
            headers: { "Access-Control-Allow-Origin": "*" },
            data: dt,
            /* Per poter aggiungere una entry bisogna prima autenticarsi. */
            contentType: "application/json",
            url: "https://late-frost-5190.getsandbox.com/anagrafiche/edit/"+idedit,
            dataType: "json",
        });
    });

    /*DELETE*/
    $(document).on("click", ".delete", function() {
         selectedID = $(this).attr("id");
    });
        $(document).on("click", ".btnElimina", function(){
            $.ajax({
                type: "DELETE",
                /* Per poter rimuovere una entry bisogna prima autenticarsi con un'account di amministratore. */
                contentType: "application/json",
                url: "https://late-frost-5190.getsandbox.com/anagrafiche/remove/" + selectedID,
                dataType: "json",
                success: function(data){
                    CalcPag(persone);
                }
            });
        })
    });
    $(document).on("click", ".decesso", function(){

    })
    /*ORDINA*/
    $(document).on("click", ".order", function() {
        var temp = new Array();
        var f = $(this).attr("id");
        switch (f) {
            case "nome":
                for (let j = 0; j < persone.length; j++) {
                    for (let i = j + 1; i < persone.length; i++) {
                        // comparing adjacent strings
                        if (!nomeorder) {
                            if (compare(persone[i].nome, persone[j].nome) < 0) {
                                temp = persone[j];
                                persone[j] = persone[i]
                                persone[i] = temp;
                            }
                        } else {
                            if (compare(persone[i].nome, persone[j].nome) > 0) {
                                temp = persone[i];
                                persone[i] = persone[j];
                                persone[j] = temp;
                            }
                        }
                    }
                    CalcPag(persone);
                }
                if (!nomeorder) nomeorder = true;
                else nomeorder = false;
                break;
            case "cognome":
                for (let j = 0; j < persone.length; j++) {
                    for (let i = j + 1; i < persone.length; i++) {
                        // comparing adjacent strings
                        if (!cognomeorder) {
                            if (compare(persone[i].cognome, persone[j].cognome) < 0) {
                                temp = persone[j];
                                persone[j] = persone[i]
                                persone[i] = temp;
                            }
                        } else {
                            if (compare(persone[i].cognome, persone[j].cognome) > 0) {
                                temp = persone[i];
                                persone[i] = persone[j];
                                persone[j] = temp;
                            }
                        }
                    }
                    CalcPag(persone);
                }
                if (!cognomeorder) cognomeorder = true;
                else cognomeorder = false;
                break;
            case "regione":
                for (let j = 0; j < persone.length; j++) {
                    for (let i = j + 1; i < persone.length; i++) {
                        // comparing adjacent strings
                        if (!regioneorder) {
                            if (compare(persone[i].luogo_residenza.regione, persone[j].luogo_residenza.regione) < 0) {
                                temp = persone[j];
                                persone[j] = persone[i]
                                persone[i] = temp;
                            }
                        } else {
                            if (compare(persone[i].luogo_residenza.regione, persone[j].luogo_residenza.regione) > 0) {
                                temp = persone[i];
                                persone[i] = persone[j];
                                persone[j] = temp;
                            }
                        }
                    }
                    CalcPag(persone);
                }
                if (!regioneorder) regioneorder = true;
                else regioneorder = false;
                break;
            case "provincia":
                for (let j = 0; j < persone.length; j++) {
                    for (let i = j + 1; i < persone.length; i++) {
                        // comparing adjacent strings
                        if (!provinciaorder) {
                            if (compare(persone[i].luogo_residenza.provincia, persone[j].luogo_residenza.provincia) < 0) {
                                temp = persone[j];
                                persone[j] = persone[i]
                                persone[i] = temp;
                            }
                        } else {
                            if (compare(persone[i].luogo_residenza.provincia, persone[j].luogo_residenza.provincia) > 0) {
                                temp = persone[i];
                                persone[i] = persone[j];
                                persone[j] = temp;
                            }
                        }
                    }
                    CalcPag(persone);
                }
                if (!provinciaorder) provinciaorder = true;
                else provinciaorder = false;
                break;
            case "comune":
                for (let j = 0; j < persone.length; j++) {
                    for (let i = j + 1; i < persone.length; i++) {
                        // comparing adjacent strings
                        if (!comuneorder) {
                            if (compare(persone[i].luogo_residenza.comune, persone[j].luogo_residenza.comune) < 0) {
                                temp = persone[j];
                                persone[j] = persone[i]
                                persone[i] = temp;
                            }
                        } else {
                            if (compare(persone[i].luogo_residenza.comune, persone[j].luogo_residenza.comune) > 0) {
                                temp = persone[i];
                                persone[i] = persone[j];
                                persone[j] = temp;
                            }
                        }
                    }
                    CalcPag(persone);
                }
                if (!comuneorder) comuneorder = true;
                else comuneorder = false;
                break;
            case "anno":
                for (let j = 0; j < persone.length; j++) {
                    for (let i = j + 1; i < persone.length; i++) {
                        // comparing adjacent strings
                        if (!annoorder) {
                            if (compare(persone[i].anno, persone[j].anno) < 0) {
                                temp = persone[j];
                                persone[j] = persone[i]
                                persone[i] = temp;
                            }
                        } else {
                            if (compare(persone[i].anno, persone[j].anno) > 0) {
                                temp = persone[i];
                                persone[i] = persone[j];
                                persone[j] = temp;
                            }
                        }
                    }
                    CalcPag(persone);
                }
                if (!annoorder) annoorder = true;
                else annoorder = false;
                break;
            default:
                break;
        }
    });
    /*CLICK PRECEDENTE*/
    $(document).on("click", "#previous", function() {
        if (posizioneCorrente == 1) posizioneCorrente++;
        posizioneCorrente--;
        StampaTabella(posizioneCorrente, $("#shownumber").val());
    });
    /*CLICK SUCCESSIVO*/
    $(document).on("click", "#next", function() {
        if (posizioneCorrente == numeropagine) posizioneCorrente--;
        posizioneCorrente++;
        StampaTabella(posizioneCorrente, $("#shownumber").val());
    });
    /*CLICK NUMERO PAGINA*/
    $(document).on("click", ".numeri>.page-link", function() {
        var testo = $(this).text();
        posizioneCorrente = testo;
        StampaTabella(testo, $("#shownumber").val());
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
    $window.on('load', function() {
        window.setTimeout(function() {
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