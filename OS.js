//POSSIBLE OPTIONS:
//Win
//Windows
//Mac
//iPad
//iPhone
//MacIntosh
//X11
//Linux
//Android
//Droid

function OS(os) {
    switch (os.toLowerCase()) {
        case 'android':
            os = 'Linux';
            break;
        case 'droid':
            os = 'Linux';
            break;
        case 'ipad':
            os = 'Mac';
            break;
        case 'iphone':
            os = 'Mac';
            break;
        case 'macintosh':
            os = 'Mac';
            break;
        case 'mac':
            os = 'Mac';
            break;
        case 'windows':
            os = 'Win';
            break;
        default:
            break;
    }
    if (navigator.appVersion.toLowerCase().indexOf(os.toLowerCase()) != -1)
        return true;
    else
        return false;
}

function SubmitResult(document, formName, suffix) {
    var result = BuildResult(document, formName);

    if (suffix != null) {
        result = result + encodeSuffixForiOS(suffix);
    }

    SubmitResultString(result);
}

function SubmitResultString(result) {
    if (OS("Android")) {
        Android.result(result);
        Android.exit();
    }
    else if (OS("Mac")) {
        var uri = 'sa://reportResult?' + result.replace(/;/g, "&");
        document.location.href = uri;
    }
    else if (typeof MzSA !== "undefined" && typeof MzSA.reportResult !== "undefined" && typeof MzSA.reportResult === "function") {
        MzSA.reportResult(result);
    }
    else {
        alert(result);
    }
}

function BuildResult(document, formName) {
    var result = '';
    var elem = document.getElementById(formName).elements;

    for (var i = 0; i < elem.length; i++) {
        if (elem[i].getAttribute('id') != 'EmailDomain' && elem[i].getAttribute('id') != 'Domain' && elem[i].getAttribute('id').substring(0, 3) != "mz_") {
            if (elem[i].type == "text" || elem[i].type == "textarea" || elem[i].type == "number" || elem[i].type == "tel" || elem[i].type == "email") {
                if (elem[i].value.trim() != '')
                    result += elem[i].getAttribute('id') + "=" + encodeForiOS(elem[i].value) + ";"
            }
            else if (elem[i].type == "select-one") {
                if (elem[i].options.length > 0 && elem[i].options[elem[i].selectedIndex].value.trim() != '')
                    result += elem[i].getAttribute('id') + "=" + encodeForiOS(elem[i].options[elem[i].selectedIndex].value) + ";"
            }
            else if (elem[i].type == "checkbox") {
                result += elem[i].getAttribute('id') + "=";
                if (elem[i].checked) {
                    result += "Yes;";
                }
                else {
                    result += "No;"
                }
            }
            else if (elem[i].type == "radio" && elem[i].checked) {
                result += elem[i].getAttribute('id') + "=";
                result += encodeForiOS(elem[i].value) + ";"
            }
            else if (elem[i].type == "hidden") {
                result += elem[i].getAttribute('id') + "=";
                result += encodeForiOS(elem[i].value) + ";"
            }
        }
    }

    return result;
}
function encodeSuffixForiOS(val) {
    var nuVal = "";
    try {
        if (OS("mac") || OS("macintosh") || OS("iphone") || OS("ipad")) {
            var s1 = val.split(';');
            for (var i = 0; i < s1.length; i++) {
                var s = s1[i].split('=');
                nuVal += s[0] + "=" + encodeURIComponent(s[1].replace(';', '')) + ";";
            }
        }
    }
    catch (e) { }
    val = nuVal === "" ? val : nuVal;
    return val;
}
function encodeForiOS(val) {
    try {
        if (OS("mac") || OS("macintosh") || OS("iphone") || OS("ipad")) {
            val = encodeURIComponent(val);
        }
    }
    catch (e) { }
    return val;
}
function ReportCancel() {
    if (OS("Android")) {
        Android.cancel();
    }
    else if (OS("Mac")) {
        document.location.href = "sa://cancel?";
    }
    else if (typeof MzSA !== "undefined" && typeof MzSA.cancel !== "undefined" && typeof MzSA.cancel === "function") {
        MzSA.cancel();
    }
}

function Exit() {

        ig.game.director.jumpTo(ig.global["LevelGame"]);
    if (OS("Android")) {
        Android.exit();
    }
    else if (OS("Mac")) {
        document.location.href = "sa://reportResult?";
    }
    else if (typeof MzSA !== "undefined" && typeof MzSA.reportResult !== "undefined" && typeof MzSA.reportResult === "function") {
        MzSA.reportResult('');
    }else{



    }


}

function GetDelimiter() {
    if (OS("Mac")) {
        return "&";
    }
    else {
        return ";";
    }
}

function stopSubmit() {
    return false;
}

