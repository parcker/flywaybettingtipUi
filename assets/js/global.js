 

const SpaAjax = function () {
    function GetTokenValue() {
        try {
            let csrfToken = $('input[name=__RequestVerificationToken]').val() || "";
            //console.log('__RequestVerificationToken', csrfToken);  //XSRF-TOKEN
            return csrfToken;
        } catch (x) { }
        return "";
    }

    return {

        _FxnSuccess: function (response, fxnSuccess) {
            PageLoading.Hide();
            //Check if the response has been logged out....
            console.log('logsuccess:', response);
            if (fxnSuccess != null) {
                fxnSuccess(response); //call function 
            }
        },
        _FxnError: function (error, fxnError) {
            PageLoading.Hide();
            SwalAlert.Error("SPA Error Occurred...");
            console.log('logError: ', error);
            if (fxnError != null) {
                fxnError(error);
            }
        },
        _AddCsrfHeader: function () {
            try {
                let csrfToken = GetTokenValue();
                //console.log('X-CSRF-TOKEN', csrfToken);  //XSRF-TOKEN
                //document.getElementsByName("__RequestVerificationToken").value || "";// document.getElementById('_csrf').value;
                if (csrfToken != "") {
                    $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': csrfToken, 'RequestVerificationToken': csrfToken } });
                }
            } catch (x) { }
        },

        Post: function (url, dataParams, fxnSuccess, fxnError) {
            SpaAjax._AddCsrfHeader();

            $.post(url, dataParams, function (response) {
                SpaAjax._FxnSuccess(response, fxnSuccess);
            }).fail(function (error) {
                SpaAjax._FxnError(error, fxnError);
            });
        },
        Get: function (url, params, fxnSuccess, fxnError) {
            SpaAjax._AddCsrfHeader();

            $.get(url, params, function (response) {
                SpaAjax._FxnSuccess(response, fxnSuccess);
            }).fail(function (error) {
                SpaAjax._FxnError(error, fxnError);
            });
        },

        InitSubmitForm: function () {
            $(".form-spa").each(function () {
                let formID = "#" + $.trim($(this).prop("id") || "");
                SpaAjax.SubmitForm(formID);
                //try {
                //    this.submit(function (event) {
                //        event.preventDefault();
                //        let form = $(this);
                //        SpaAjax.SubmitForm(form);
                //    });   
                //} catch (e) { }
            });
        },
        SubmitForm: function (formId) {
            let formThis = $(formId); // $.trim($(this).prop("id") || "");

            try {
                formThis.submit(function (event) {
                    event.preventDefault();
                    //-------------- 
                    let form = $(this);
                    let fxnPresubmit = $.trim(form.prop("spa-presubmit") || "");
                    if (fxnPresubmit != "") {
                        //call the function
                        if (fxnPresubmit() != true) {
                            return;
                        }
                    } else {
                        if (!FormValidator.IsFormValid(formId)) {
                            return;
                        }
                    }

                    //>>>>>>>>>>>>>>>>>>>>
                    /*  
                        <form id="formId" method="post" action="controll/action" class="form-spa" spa-presubmit="fxnPresubmit" spa-success="fxnSuccess" spa-error="fxnError"></form> 
                    */
                    //Check PreSubmit

                    let fxnSuccess = form.attr('spa-success');
                    let fxnError = form.attr('spa-error');
                    let fxnMethod = form.attr('method').toLowerCase();
                    let urlAction = form.attr('action');
                    let formParams = form.serialize();

                    PageLoading.Show();

                    if (fxnMethod == "get") {
                        this.Get(urlAction, formParams, fxnSuccess, fxnError);
                    } else {
                        this.Post(urlAction, formParams, fxnSuccess, fxnError);
                    }

                    //$.ajax({
                    //    type: form.attr('method'), //"POST",  
                    //    url: form.attr('action'),
                    //    data: form.serialize()
                    //}).done(function (response) {
                    //    SpaAjax._FxnSuccess(response, fxnSuccess);
                    //}).fail(function (error) {
                    //    SpaAjax._FxnError(error, fxnError);
                    //});
                });
            } catch (e) { }
        }

        /*  $.ajax({
                type: "POST",  url: url,
                headers: {  "CSRF-TOKEN-MOONGLADE-FORM": $('input[name="CSRF-TOKEN-MOONGLADE-FORM"]').val()    },
                data: makeCSRFExtendedData(pData),   success: function (data) {   funcSuccess(data);   },   dataType: "json"
            }); 
     
            $.ajax({
                type: "POST",  url: "/Demo?handler=Send",
                beforeSend: function (xhr) {  xhr.setRequestHeader("XSRF-TOKEN", $('input:hidden[name="__RequestVerificationToken"]').val());    },
                data: JSON.stringify({ Item1: item1, Item2: item2, Item3: item3 }),
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (response) {  },
                failure: function (response) {   alert(response);   }
            });
*/
    };
}();
 
function convertJsonToCSV(array) {
    var result = ''; var keys = [];
    for (var k in array[0]) {
        if (k.length > 1) {
            keys.push(k);
            result += k.toUpperCase().replace(',', ' ') + ',';
        }
    }
    var lastChar = result.slice(-1); if (lastChar == ',') { result = result.slice(0, -1); } result += "\r\n";
    array.forEach(function (obj) {
        keys.forEach(function (kk, ix) {
            if (ix) result += ",";
            var valu = '' + obj[kk];
            if (valu.indexOf('.') > 0 && valu.indexOf(',') > 0) {
                result += valu.replace(',', '');
            } else {
                result += valu.replace(',', ' ');
            }
        });
        result += "\r\n";
    });
    try { window.open("data:text/csv;charset=utf-8," + escape(result)); } catch (e) { alert('Error'); }
    return result;
}

function ToggleDisplay(header, body) {
    //var fa = $(header + " fa").attr('class'); 
    if ($(body).is(":visible")) {
        //its visible, so hide it
        $(body).slideUp();
        $(header + " fa").attr('class', "fa fa-angle-double-right");
    } else {
        //its hidden, so show it
        $(body).slideDown();
        $(header + " fa").attr('class', "fa fa-angle-double-down");
    }
}

function getRowData(trId) {
    var items = new Array(); var k = 1;
    $('#' + trId + ' td').each(function () { var texto = $(this).text(); items[k] = texto; k++; });
    var nCols = k - 1; var row = 0; var nRows = (items.length / nCols);
    var colArr = []; for (var i = 0; i < nRows; i++) { colArr[i] = []; }
    for (var i = 1; i <= nRows; i++) {
        for (var j = 1; j <= nCols; j++) { colArr[i][j] = items[(row + j)]; } row = row + nCols;
    }
    return colArr;
    /*for (var j = 1; j < colArr.length; j++) {     var arr = new Array(); arr = colArr[j];
        $('#divTB').html(">>> Name: " + arr[1] + " | Phone: " + arr[2] + " | Email: " + arr[3] + "<br>");
    }*/
    /*var tdArr = []; tdArr = getTR_values('trC' + id);
            for (var j = 1; j < tdArr.length; j++) {
                var arr = new Array(); arr = tdArr[j];
                $('#txtCountryNm_req').val($.trim(arr[1])); $('#txtCountryCode_req').val($.trim(arr[2]));
                $('#hidCountryID').val(id); $('#txtCountryZip').val($.trim(arr[3]));
            } */
}
function getTdValue(input) {
    var data = $.trim(input); if (data.length < 1) return '';
    try {
        data = input.replace((new RegExp(/["]/g)), "“");
        data = data.replace((new RegExp(/\<[^\<]+\>/g)), "");
    } catch (ex) { }
    return $.trim(data);
    /* $(el).find('tr').each(function () {        var tRow = [];
        $(this).filter(':visible').find('td').each(function () {
            if ($(this).css('display') != 'none') tRow[tRow.length] = formatData($(this).html());
        });   row2Csv(tRow);
       });  */
}
function convertJsonToCSV(array) {
    var result = ''; var keys = [];
    for (var k in array[0]) {
        if (k.length > 1) {
            keys.push(k);
            result += k.toUpperCase().replace(',', ' ') + ',';
        }
    }
    var lastChar = result.slice(-1); if (lastChar == ',') { result = result.slice(0, -1); } result += "\r\n";
    array.forEach(function (obj) {
        keys.forEach(function (kk, ix) {
            if (ix) result += ",";
            var valu = '' + obj[kk];
            if (valu.indexOf('.') > 0 && valu.indexOf(',') > 0) {
                result += valu.replace(',', '');
            } else {
                result += valu.replace(',', ' ');
            }
        });
        result += "\r\n";
    });
    try { window.open("data:text/csv;charset=utf-8," + escape(result)); } catch (e) { alert('Error'); }
    return result;
}
function ToggleDisplay(header, body) {
    //var fa = $(header + " fa").attr('class'); 
    if ($(body).is(":visible")) {
        //its visible, so hide it
        $(body).slideUp();
        $(header + " fa").attr('class', "fa fa-angle-double-right");
    } else {
        //its hidden, so show it
        $(body).slideDown();
        $(header + " fa").attr('class', "fa fa-angle-double-down");
    }
}



//var CSRF_TOKEN = "", ROOT_CONTROLLER="", ROOT_URL="", ROOT_ACTION="";
$(document).ready(function () {
    FormValidator.Init(); //ValidateForm=> .validate-form     
    try { setTimeout(function () { $(".flash-message").fadeOut(); $(".flash-message").remove(); }, 9000); } catch (e) { }
    //window.history.forward(); 
    //window.onpageshow = function (evt) { if (evt.persisted) window.history.forward(); }; window.onunload = function () { void (0); };

    //    $('form').submit(function () {    setTimeout(function () { PageLoadingFxn(); }, 2000);    });

    //try { CSRF_TOKEN = $('meta[name="csrf-token"]').attr("content"); }catch(e) {}
    //try { ROOT_CONTROLLER = $('meta[name="root-controller"]').attr("content"); }catch(e) {}
    //try { ROOT_URL = $('meta[name="root-controller"]').attr("content"); }catch(e) {}
    //try { ROOT_ACTION = $('meta[name="root-action"]').attr("content"); }catch(e) {}
    /*  $.ajaxSetup({ headers: { 'X-CSRF-TOKEN': '<?= $csrfToken ?>' } }); */
    try {
        $(".collapsible").click(function () {
            var bodyId = $(this).attr("collapse-item");
            $(this).find('i').toggleClass('fa-angle-double-left fa-angle-double-down');
            if ($(bodyId).is(":visible")) { $(bodyId).slideUp(300); } else { $(bodyId).slideDown(200); }
        });
    } catch (e) { }

    try {
        if (location.protocol == 'http:') { location.href = location.href.replace(/^http:/, 'https:'); }
        $('img').on("error", function () { $(this).attr('src', '/assets/img/logo.svg'); });
    } catch (ex) { }

    try {
        var currentHref = window.location.pathname;
        currentHref = currentHref.split('?')[0];
        if (currentHref[currentHref.length - 1] == "/") {
            currentHref = currentHref.slice(0, -1);
        }
        //console.log('Href: ', currentHref, ' --substring:', currentHref[currentHref.length-1]);

        //$('#sidebar-menu').find('li').each(function (e) {
        //    var li = this;
        //    $(this).find('a').each(function (e) {
        //        var href = $(this).attr('href');
        //        if (href == currentHref || (href == currentHref + "/index") || ((href + "/index") == currentHref)) {
        //            var parentIds = $(li).parents('li');
        //            $(parentIds).addClass("active");
        //            //$(parentIds).removeClass("collapse");
        //            $(li).addClass("active");
        //            //$(parentIds).click();
        //        }
        //    });
        //}); 
    } catch (e) { }

    console.log('I am global.js');
});

// $(document).on("keypress", "#txtSearchPart", function(e) { if (e.which == 13) { $("#txtSearchQty").focus(); } });
/*  $("#e1").select2();  $("#e2").select2({ placeholder: "Select a State",  allowClear: true  });   $("#e3").select2("val", "");
   var list = DATA_LOCATIONS.filter(function (el) { return (el.location_type == TYPE && el.link_id==valu); });
   ///>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>


  $("#formId input[type=text]").each(function() {
		let leng = Math.ceil(Math.random() * 10);
		$(this).val(generateValues(leng));
  });
  function generateValues(length) {
	   var result           = '';
	   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	   var charactersLength = characters.length;
	   for ( var i = 0; i < length; i++ ) {
		  result += characters.charAt(Math.floor(Math.random() * charactersLength));
	   }
	   return result;
  }
*/
