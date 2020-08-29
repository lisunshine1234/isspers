var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");
$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});


var permissionUrlSign = 0, permissionNameSign = 0;
$(document).ready(function () {

});


function ajaxError() {
    swal({
        title: "错误!",
        text: "无法连接到服务器",
        type: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '确定',
    });
}


function modelOption() {
    var model = {
        backdrop: false,
        keyboard: false
    }
    return model;
}

function insertPermissionSubmit() {
    swal({
        html: "<i  class='fa fa-spin fa-spinner'></i>格式校验中，请稍等...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });
    checkFormat($("#permissionName"));
    checkFormat($("#permissionUrl"));

    var validataInfo = $("[name='validataInfo']");
    if (validataInfo.length > 0) {
        swal.close();
        validataInfo[0].focus();
    } else {
        var interval_3 = setInterval(function () {
            if (permissionNameSign === 0 && permissionUrlSign === 0) {
                validataInfo = $("[name='validataInfo']");
                swal.close();
                if (validataInfo.length > 0) {
                    validataInfo[0].focus();
                } else {
                    $.ajax({
                        async: true,
                        url: "/guteam/admin/permission/insert/save/permission",
                        type: "POST",
                        data: {
                            "permissionName": $("#permissionName").val(),
                            "permissionUrl": $("#permissionUrl").val(),
                            "permissionState": $("#permissionState").prop("checked")
                        },
                        dataType: "json",
                        beforeSend: function () {
                            swal({
                                html: "<i  class='fa fa-spin fa-spinner'></i>正在保存权限数据，请稍等...",
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                showConfirmButton: false
                            });
                        },
                        success: function (back) {
                            if (back.sign === true) {
                                swal({
                                    title: "成功",
                                    text: "插入权限数据成功",
                                    type: 'success',
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: '确定',
                                }).then(function () {
                                    window.location.reload();
                                }).catch(swal.noop);
                            } else {
                                swal({
                                    title: "错误",
                                    text: "插入权限数据失败",
                                    type: 'error',
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: '确定',
                                });
                            }
                        },
                        error: function (XMLHttpRequest, statusText) {
                            ajaxError();
                        }
                    });
                }
                clearInterval(interval_3);
            }
        });
    }

}

function checkPermissionUrlExist(permissionId, permissionUrl) {
    $.ajax({
        async: true,
        url: "/guteam/admin/permission/insert/checkPermissionUrl",
        type: "POST",
        data: {
            "permissionId": permissionId.toString(),
            "permissionUrl":  permissionUrl.toString()
        },
        dataType: "json",
        beforeSend: function () {
        },
        success: function (back) {
            permissionUrlSign = back.sign;
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function checkPermissionNameExist(permissionId, permissionName) {
    $.ajax({
        async: true,
        url: "/guteam/admin/permission/insert/checkPermissionName",
        type: "POST",
        data: {
            "permissionId": permissionId.toString(),
            "permissionName": permissionName.toString()
        },
        dataType: "json",
        beforeSend: function () {
        },
        success: function (back) {
            permissionNameSign = back.sign;
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}


function checkFormat(obj) {
    obj = $(obj);
    switch (obj.attr("id")) {
        case "permissionName":
            if (permissionNameSign === 0) {
                permissionNameSign = 1;
                if (myValidata(obj.val(), "chineseAndEnglishKey", 1, 10, "权限名称", obj) === true) {
                    checkPermissionNameExist("-1", $(obj).val());
                    var interval_1 = setInterval(function () {
                        if (permissionNameSign === true || permissionNameSign === false) {
                            if (permissionNameSign === true) {
                                addValidataInfo(obj, "权限名称已存在");
                            } else {
                                removeValidataInfo(obj);
                            }
                            permissionNameSign = 0;
                            clearInterval(interval_1);

                        }
                    }, 10);
                } else {
                    permissionNameSign = 0;
                }
            }
            break;
        case "permissionUrl":
            if (permissionUrlSign === 0) {
                permissionUrlSign = 1;
                if (myValidata(obj.val(), "englishKey", 1, 20, "映射地址", obj) === true) {
                    checkPermissionUrlExist("-1", $(obj).val());
                    var interval_3 = setInterval(function () {
                        if (permissionUrlSign === true || permissionUrlSign === false) {
                            if (permissionUrlSign === true) {
                                addValidataInfo(obj, "映射地址已存在");
                            } else {
                                removeValidataInfo(obj);
                            }
                            permissionUrlSign = 0;
                            clearInterval(interval_3);
                        }
                    }, 10);
                } else {
                    permissionUrlSign = 0;
                }

            }
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
            addValidataInfo(obj, name + "的最小长度为" + min_len, "error");
            return false;
        }
        if (max_len > 0 && value.toString().length > max_len) {
            addValidataInfo(obj, name + "的最大长度为" + max_len, "error");
            return false;
        }
    }

    var englishKey = new RegExp("[0-9a-zA-Z_/]*");
    var chineseKey = new RegExp("[\u0391-\uFFE5_]*");
    var chineseAndEnglishKey = new RegExp("[0-9a-zA-Z\u0391-\uFFE5_]*");
    switch (key) {
        case "englishKey":
            if (englishKey.test(value)) {
                removeValidataInfo(obj);
                return true;
            } else {
                addValidataInfo(obj, name + "的输入只能为大小写字母、下划线和左斜杠");
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
        default:
            return false;

    }
}
