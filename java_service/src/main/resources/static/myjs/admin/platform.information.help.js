var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");
$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});

var systemInfo;
var systemLogo1, systemLogo2, systemLogo3, systemLogo4, systemLogo5;
$(document).ready(function () {
    if ($("#platform_page").length > 0) {
        getPlatformInformation();
    }
});


function ajaxError() {
    swal({
        title: "错误!",
        text: "无法连接到服务器",
        type: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '确定'
    });
}


function getPlatformInformation() {
    $.ajax({
        async: true,
        url: "/guteam/admin/platform/information/getPlatformInformation",
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在获取系统信息数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false
            });
        },
        success: function (back) {
            systemInfo = back;
            console.log(back)
            platformInformation(back);
            swal.close();
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function updateSubmit() {
    swal({
        html: "<i  class='fa fa-spin fa-spinner'></i>正在检验输入格式，请稍等...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });

    checkFormat($("#systemName"));
    checkFormat($("#systemFoot"));
    checkFormat($("#systemBatch"));
    checkFormat($("#systemLogo1_sign"));
    checkFormat($("#systemLogo2_sign"));
    checkFormat($("#systemLogo3_sign"));
    checkFormat($("#systemLogo4_sign"));
    checkFormat($("#systemLogo5_sign"));
    var validataInfo = $("[name='validataInfo']");
    if (validataInfo.length > 0) {
        swal.close();
        validataInfo[0].focus();
    } else {
        systemInfo.systemName = $("#systemName").val();
        systemInfo.systemFoot = $("#systemFoot").val();
        systemInfo.systemBatch = $("#systemBatch").val();
        systemInfo.systemLogo1Name = $("#systemLogo1_name").text();
        systemInfo.systemLogo2Name = $("#systemLogo2_name").text();
        systemInfo.systemLogo3Name = $("#systemLogo3_name").text();
        systemInfo.systemLogo4Name = $("#systemLogo4_name").text();
        systemInfo.systemLogo5Name = $("#systemLogo5_name").text();
        systemInfo.systemLogo1 = $("#systemLogo1_uuid").val();
        systemInfo.systemLogo2 = $("#systemLogo2_uuid").val();
        systemInfo.systemLogo3 = $("#systemLogo3_uuid").val();
        systemInfo.systemLogo4 = $("#systemLogo4_uuid").val();
        systemInfo.systemLogo5 = $("#systemLogo5_uuid").val();
        console.log(systemInfo)
        swal.close();
        $.ajax({
            async: true,
            url: "/guteam/admin/platform/information/save/platformInformation",
            type: "POST",
            data: {"json": JSON.stringify(systemInfo)},
            dataType: "json",
            beforeSend: function () {
                swal({
                    html: "<i  class='fa fa-spin fa-spinner'></i>正在更新系统信息，请稍等...",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false
                });
            },
            success: function (back) {
                if (back.sign == true) {
                    swal({
                        title: "成功",
                        text: "新建系统信息成功",
                        type: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '确定'
                    }).then(function () {
                        window.location.reload();
                    }).catch(swal.noop);
                } else {
                    swal({
                        title: "错误",
                        text: "新建系统信息失败",
                        type: 'error',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '确定'
                    });
                }
            },
            error: function (XMLHttpRequest, statusText) {
                ajaxError();
            }
        });
    }


}

style = 'background: #eceff4'

function platformInformation(platformInformation) {
    var html =
        "  <label>系统名称</label>" +
        "  <div class='form-group'>" +
        "      <input class='form-control' id='systemName' type='text' value='" + platformInformation.systemName + "' onblur='checkFormat(this)'>" +
        "  </div>" +
        "  <label>版权信息</label>" +
        "  <div class='form-group'>" +
        "      <input class='form-control' id='systemFoot' type='text' value='" + platformInformation.systemFoot + "' onblur='checkFormat(this)'>" +
        "  </div>" +
        "  <label>批号</label>" +
        "  <div class='form-group'>" +
        "      <input class='form-control' id='systemBatch' type='text' value='" + platformInformation.systemBatch + "' onblur='checkFormat(this)'>" +
        "  </div>" +
        "  <label>系统logo(80px*80px)</label>" +
        "  <div class='form-group'>" +
        pictureUploadModelHelper("systemLogo1", platformInformation.systemLogo1, platformInformation.systemLogo1Name, platformInformation.systemLogo1Url, 50, 50) +
        "  </div>" +
        "  <label>系统logo(180px*180px)</label>" +
        "  <div class='form-group'>" +
        pictureUploadModelHelper("systemLogo2", platformInformation.systemLogo2, platformInformation.systemLogo2Name, platformInformation.systemLogo2Url, 50, 50) +
        "  </div>" +
        "  <label>系统logo(192px*192px)</label>" +
        "  <div class='form-group'>" +
        pictureUploadModelHelper("systemLogo3", platformInformation.systemLogo3, platformInformation.systemLogo3Name, platformInformation.systemLogo3Url, 50, 50) +
        "  </div>" +
        "  <label>宽屏系统导航标志(150px*50px)</label>" +
        "  <div class='form-group'>" +
        pictureUploadModelHelper("systemLogo4", platformInformation.systemLogo4, platformInformation.systemLogo4Name, platformInformation.systemLogo4Url, 150, 50) +
        "  </div>" +
        "  <label>窄屏系统导航标志(650px*1000px)</label>" +
        "  <div class='form-group'>" +
        pictureUploadModelHelper("systemLogo5", platformInformation.systemLogo5, platformInformation.systemLogo5Name, platformInformation.systemLogo5Url, 32.5, 50) +
        "  </div>" +
        "<button type='button' class='btn btn-primary float-button-light' onclick='updateSubmit()'>修改</button>" +
        "</div>";
    $("#platform_page").html(html);
    fileuploadRender("systemLogo1", "ico", 1024);
    fileuploadRender("systemLogo2", "ico", 1024);
    fileuploadRender("systemLogo3", "ico", 1024);
    fileuploadRender("systemLogo4", "png", 1024);
    fileuploadRender("systemLogo5", "png", 1024);
}


function pictureUploadModelHelper(key, value, name, url, width, height) {
    var html =
        "<div class='sys-logo'>" +
        "<div class='col-lg-1 col-md-1 col-sm-1 col-xs-1'><i class='fa fa-check-square-o' id='" + key + "_sign' style='color: green'></i></div>" +
        "<div class='col-lg-4 col-md-4 col-sm-4 col-xs-4'><img  id='" + key + "_image' style='height:" + height + "px;width:" + width + "px;' src=' " + url + "'></div>" +
        "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-3'><a id='" + key + "_name'>" + name + "</a></div>" +
        "<div class='col-lg-2 col-md-2 col-sm-2 col-xs-2'><button type='button' class='btn btn-primary float-button-light' id='" + key + "_button' onclick='changeLogo(\"" + key + "\")'>更换</button></div>" +
        "<div class='col-lg-2 col-md-2 col-sm-2 col-xs-2'><button type='button' class='btn btn-primary float-button-light' id='" + key + "_re' onclick='reUpload(\"" + key + "\")' hidden>重新上传</button></div>" +
        "</div>" +
        "<input type='file' class='' id='" + key + "' name='fileUpload' hidden>" +
        "<input type='text' class='' id='" + key + "_uuid' value='" + value + "' hidden>";

    return html;
}

function reUpload(key) {
    var file = eval(key);
}

function changeLogo(key) {
    $("#" + key).click();
}

function fileuploadRender(key, type, size) {
    $('#' + key).fileupload({
        type: 'POST',
        url: '/guteam/admin/platform/information/upload/logo',
        dataType: 'json',
        autoUpload: true,
        singleFileUploads: true,
        multiple: false,
        dragDrop: true,
        sequential: true,
        sequentialCount: 1,
        add: function (ev, data) {
            if (data.files.length > 0) {
                var typeRegExp = new RegExp("(\\."+type+")$", "i");
                var file = data.files[0];
                var name = file.name;
                if (!(typeRegExp.test(name))) {
                    swal({
                        title: "文件格式错误",
                        text: "只限" + type + "格式的文件，请重新选择!",
                        type: 'error',
                        confirmButtonColor: '#F9534F',
                        confirmButtonText: '确定',
                    });
                } else if (size > 0 && file.size < size) {
                    swal({
                        title: "文件大小错误",
                        text: "文件最大为" + fileSizeFormat(size) + "，请重新选择!",
                        type: 'error',
                        confirmButtonColor: '#F9534F',
                        confirmButtonText: '确定',
                    });
                } else {
                    data.submit();

                }
            }
        },
        progress: function (e, data) {
            $("#" + key + "_sign").attr("class", "fa fa-spin fa-spinner");
            $("#" + key + "_sign").attr("style", "color:red;");
            $("#" + key + "_button").attr("display", "display");
        },
        //上传请求失败时触发的回调函数，如果服务器返回一个带有error属性的json响应这个函数将不会被触发
        fail: function (e, data) {
            swal({
                title: "错误",
                text: "图片上传出错！",
                type: 'error',
                confirmButtonColor: '#F9534F',
                confirmButtonText: '确定',
            });
            $("#" + key + "_sign").attr("class", "fa fa-times-rectangle-o");
            $("#" + key + "_sign").attr("style", "color:grey;");
            $("#" + key + "_re").show();
            $("#" + key + "_button").attr("display", "none");
        },

        done: function (e, data) {
        },
        success: function (result, textStatus, jqXHR) {
            if(result.sign === true){
                $("#" + key + "_sign").attr("class", "fa fa-check-square-o");
                $("#" + key + "_sign").attr("style", "color:green;");

                $("#" + key + "_re").hide();

                $("#" + key + "_button").attr("display", "none");

                $("#" + key + "_image").attr("src", result.fileUrl);
                $("#" + key + "_uuid").attr("value", result.fileName);
                $("#" + key + "_name").text(result.fileNameBefore);

            }else{
                swal({
                    title: "错误",
                    text: "图片上传出错！",
                    type: 'error',
                    confirmButtonColor: '#F9534F',
                    confirmButtonText: '确定',
                });
            }
        },
        //上传请求结束时（成功，错误或者中止）都会被触发。
        always: function (e, data) {
        }
    });

}


function checkFormat(obj) {
    obj = $(obj);
    switch (obj.attr("id")) {
        case "systemName":
            myValidata(obj.val(), "chineseAndEnglishKey", 1, 20, "系统名称", obj);
            break;
        case "systemFoot":
            myValidata(obj.val(), "chineseAndEnglishKey", 1, 200, "版权信息", obj);
            break;
        case "systemBatch":
            myValidata(obj.val(), "chineseAndEnglishKey", 1, 200, "批号", obj);
            break;
        case "systemLogo1_sign":
            myValidata(obj.attr("class"), "sign", -1, -1, "系统logo(80px*80px)", obj);
            break;
        case "systemLogo2_sign":
            myValidata(obj.attr("class"), "sign", -1, -1, "系统logo(180px*180px)", obj);
            break;
        case "systemLogo3_sign":
            myValidata(obj.attr("class"), "sign", -1, -1, "系统logo(192px*192px)", obj);
            break;
        case "systemLogo4_sign":
            myValidata(obj.attr("class"), "sign", -1, -1, "宽屏系统导航标志(150px*50px)", obj);
            break;
        case "systemLogo5_sign":
            myValidata(obj.attr("class"), "sign", -1, -1, "窄屏系统导航标志(650px*1000px)", obj);
            break;
    }
}

function addValidataInfo(obj, info) {
    if ($(obj).next().attr("name") != "validataInfo") {
        $(obj).after("<div class='font-red' name='validataInfo'>" + info + "</div>");
    }
}

function removeValidataInfo(obj) {
    var obj_temp = $(obj).next();
    if (obj_temp.attr("name") == "validataInfo") {
        obj_temp.remove();
    }
}


function myValidata(value, key, min_len, max_len, name, obj) {
    obj = $(obj);
    if (min_len < 0) {
        min_len = 0;
    }
    if (max_len < 0) {
        max_len = -1;
    }
    if (typeof value == "object") {
        if (value.length < min_len) {
            addValidataInfo(obj, name + "至少选择" + min_len + "个", "error");
            return false;
        }
        if (max_len > 0 && value.length > max_len) {
            addValidataInfo(obj, name + "至多选择" + max_len + "个", "error");
            return false;
        }
    } else {
        if (value.toString().length < min_len) {
            if (value.toString().length == 0) {
                addValidataInfo(obj, name + "不能为空", "error");
            } else {
                addValidataInfo(obj, name + "的最小长度为" + min_len, "error");
            }
            return false;
        }
        if (max_len > 0 && value.toString().length > max_len) {
            addValidataInfo(obj, name + "的最大长度为" + max_len, "error");
            return false;
        }
    }

    var englishKey = new RegExp("[0-9a-zA-Z_]*");
    var chineseKey = new RegExp("[\u0391-\uFFE5_]*");
    var chineseAndEnglishKey = new RegExp("[0-9a-zA-Z\u0391-\uFFE5_]*");
    switch (key) {
        case "englishKey":
            if (englishKey.test(value)) {
                removeValidataInfo(obj);
                return true;
            } else {
                addValidataInfo(obj, name + "的输入只能为大小写字母以及下划线");
                return false;
            }
        case "chineseKey":
            if (chineseKey.test(value)) {
                removeValidataInfo(obj);
                return true;
            } else {
                addValidataInfo(obj, name + "的输入只能为中文以及下划线");
                return false;
            }
        case "chineseAndEnglishKey" || "englishAndChineseKey":
            if (chineseAndEnglishKey.test(value)) {
                removeValidataInfo(obj);
                return true;
            } else {
                addValidataInfo(obj, name + "的输入只能为中文、大小写字母以及下划线");
                return false;
            }
        case "none":
            removeValidataInfo(obj);
            return true;
        case "sign":
            if (value === "fa fa-check-square-o") {
                removeValidataInfo(obj);
                return true;
            } else {
                addValidataInfo(obj, name + "未上传图片");
                return false;
            }
        default:
            return false;

    }
}

