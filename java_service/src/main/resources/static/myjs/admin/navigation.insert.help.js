var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");
$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});


var websocket = null;
var runInfoDivHeight = parseInt(window.screen.height * 0.5);
var ScreenHeight = parseInt(window.screen.height * 0.7);
var ScreenWidth = parseInt(window.screen.width * 0.8);
var runInfoSwalWidth = parseInt(window.screen.width * 0.8);
var outputJsonList = [];
var navigationTypeList = [], navigationTypeList = [];
var navigationUrlSign = 0, navigationParentNameSign = 0, navigationTypeNameSign = 0;
<!-- start -->
$(document).ready(function () {
    getNavigationList();
    $.fn.dataTable.tables({visible: false, api: true}).columns.adjust();
});

function getNavigationList() {
    $.ajax({
        async: true,
        url: "/guteam/admin/navigation/insert/getNavigationList",
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在获取导航栏数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            });
        },
        success: function (back) {
            navigationTypeList = back;
            swal.close();
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function ajaxError() {
    swal({
        title: "错误!",
        text: "无法连接到服务器",
        type: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '确定',
    });
}

function navigationTypeChange(obj) {
    var a = $(obj);
    var html;
    if (a.val() === "type") {
        html = "<label>导航名</label>" +
            "<div class='form-group'>" +
            "<input id='navigationTypeName' class='form-control' type='text' onblur='checkFormat(this)'>" +
            "</div>" +
            "<label>激活状态</label>" +
            "<div class='form-group'>" +
            "<label class='switcher'>" +
            "<input type='checkbox' checked id='navigationTypeState'>" +
            "<span class='switcher-indicator'></span>" +
            "</label>" +
            "</div>";
        $("#navigationInsertPlace").html(html);
    } else if (a.val() === "parent") {
        html = "<label>导航名称</label>" +
            "<div class='form-group'>" +
            "<input class='form-control' id='navigationParentName' type='text' onblur='checkFormat(this)'>" +
            "</div>" +
            "<label>导航图标</label>" +
            "<div class='form-group'>" +
            "<i id='navigationIcon' class='fa fa-address-book' style='margin-right: 50px'></i>" +
            "<button type='button' class='btn btn-default float-button-light' onclick='iconsChangeModal()'>更换</button>" +
            "</div>" +
            "<label>映射地址</label>" +
            "<div class='form-group'>" +
            "<a>algorithm/</a><input id='navigationUrl' class='form-control' type='text' onblur='checkFormat(this)'>" +
            "</div>" +
            "<label>所属类别</label>" +
            "<div class='form-group'>" +
            navigationTypeSelectAlgorithm() +
            "</div>" +
            "<label>激活状态</label>" +
            "<div class='form-group'>" +
            "<label class='switcher'>" +
            "<input type='checkbox' checked id='navigationParentState'>" +
            "<span class='switcher-indicator'></span>" +
            "</label>";
        $("#navigationInsertPlace").html(html);
    }
}

function navigationTypeSelectAlgorithm() {
    var html =
        "<div class='form-group'>" +
        "<select class='form-control select-control' id='navigationTypeSelect' >";

    for (var j = 0, len = navigationTypeList.length; j < len; j++) {
        html += "<option value='" + navigationTypeList[j].id + "'>" + navigationTypeList[j].navigationName + "</option>";
    }
    html += "</select></div>";
    return html;
}

function iconsChangeModal() {
    $("#iconsModal").modal(modelOption());
}

function chooseIcons() {
    $("#navigationIcon").attr("class", $('input:radio[name=icons]:checked').next().attr("class"));
}

function modelOption() {
    var model = {
        backdrop: false,
        keyboard: false
    }
    return model;
}

function insertNavigationSubmit() {
    swal({
        html: "<i  class='fa fa-spin fa-spinner'></i>格式校验中，请稍等...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });
    var navigationType = $("#navigationType").val();

    if (navigationType === "type") {
        checkFormat($("#navigationTypeName"));

        var validataInfo = $("[name='validataInfo']");
        if (validataInfo.length > 0) {
            swal.close();
            validataInfo[0].focus();
        } else {
            var interval_2 = setInterval(function () {
                if (navigationTypeNameSign === 0) {

                    validataInfo = $("[name='validataInfo']");
                    swal.close();
                    if (validataInfo.length > 0) {
                        validataInfo[0].focus();
                    } else {
                        $.ajax({
                            async: true,
                            url: "/guteam/admin/navigation/insert/save/navigationType",
                            type: "POST",
                            data: {"navigationTypeName": $("#navigationTypeName").val(), "navigationTypeState": $("#navigationTypeState").prop("checked")},
                            dataType: "json",
                            beforeSend: function () {
                                swal({
                                    html: "<i  class='fa fa-spin fa-spinner'></i>正在保存导航数据，请稍等...",
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    showConfirmButton: false
                                });
                            },
                            success: function (back) {
                                if (back.sign === true) {
                                    swal({
                                        title: "成功",
                                        text: "插入导航数据成功",
                                        type: 'success',
                                        confirmButtonColor: '#3085d6',
                                        confirmButtonText: '确定'
                                    }).then(function () {
                                        window.location.reload();
                                    }).catch(swal.noop);
                                } else {
                                    swal({
                                        title: "错误",
                                        text: "插入导航数据失败",
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
                    clearInterval(interval_2);
                }
            });
        }
    } else if (navigationType === "parent") {
        checkFormat($("#navigationParentName"));
        checkFormat($("#navigationUrl"));

        var validataInfo = $("[name='validataInfo']");
        if (validataInfo.length > 0) {
            swal.close();
            validataInfo[0].focus();
        } else {
            var interval_3 = setInterval(function () {
                if (navigationParentNameSign === 0  && navigationUrlSign === 0 ) {
                    validataInfo = $("[name='validataInfo']");
                    swal.close();
                    if (validataInfo.length > 0) {
                        validataInfo[0].focus();
                    } else {
                        $.ajax({
                            async: true,
                            url: "/guteam/admin/navigation/insert/save/navigationParent",
                            type: "POST",
                            data: {
                                "navigationParentName": $("#navigationParentName").val(),
                                "navigationIcon": $("#navigationIcon").attr("class"),
                                "navigationUrl": "algorithm/" + $("#navigationUrl").val(),
                                "navigationTypeId": $("#navigationTypeSelect").val(),
                                "navigationParentState": $("#navigationParentState").prop("checked")
                            },
                            dataType: "json",
                            beforeSend: function () {
                                swal({
                                    html: "<i  class='fa fa-spin fa-spinner'></i>正在保存导航数据，请稍等...",
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    showConfirmButton: false
                                });
                            },
                            success: function (back) {
                                if (back.sign === true) {
                                    swal({
                                        title: "成功",
                                        text: "插入导航数据成功",
                                        type: 'success',
                                        confirmButtonColor: '#3085d6',
                                        confirmButtonText: '确定',
                                    }).then(function () {
                                        window.location.reload();
                                    }).catch(swal.noop);
                                } else {
                                    swal({
                                        title: "错误",
                                        text: "插入导航数据失败",
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
}

function checkNavigationUrlExist(navigationId, navigationUrl) {
    $.ajax({
        async: true,
        url: "/guteam/admin/navigation/insert/checkNavigationUrl",
        type: "POST",
        data: {
            "navigationId": navigationId.toString(),
            "navigationUrl": "algorithm/" + navigationUrl.toString()
        },
        dataType: "json",
        beforeSend: function () {
        },
        success: function (back) {
            navigationUrlSign = back.sign;
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function checkNavigationParentNameExist(navigationId, navigationParentName) {
    $.ajax({
        async: true,
        url: "/guteam/admin/navigation/insert/checkNavigationParentName",
        type: "POST",
        data:{
            "navigationId": navigationId.toString(),
            "navigationParentName": navigationParentName.toString()
        },
        dataType: "json",
        beforeSend: function () {
        },
        success: function (back) {
            navigationParentNameSign = back.sign;
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function checkNavigationTypeNameExist(navigationId, navigationTypeName) {
    $.ajax({
        async: true,
        url: "/guteam/admin/navigation/insert/checkNavigationTypeName",
        type: "POST",
        data: {
            "navigationId": navigationId.toString(),
            "navigationTypeName": navigationTypeName.toString()
        },
        dataType: "json",
        beforeSend: function () {
        },
        success: function (back) {
            navigationTypeNameSign = back.sign;
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}


function checkFormat(obj) {
    obj = $(obj);
    switch (obj.attr("id")) {
        case "navigationParentName":
            if (navigationParentNameSign === 0) {
                navigationParentNameSign = 1;
                if (myValidata(obj.val(), "chineseAndEnglishKey", 1, 10, "导航名称", obj) === true) {
                    checkNavigationParentNameExist("-1", $(obj).val());
                    var interval_1 = setInterval(function () {
                        if (navigationParentNameSign === true || navigationParentNameSign === false) {
                            if (navigationParentNameSign === true) {
                                addValidataInfo(obj, "导航名已存在");
                            } else {
                                removeValidataInfo(obj);
                            }
                            navigationParentNameSign = 0;
                            clearInterval(interval_1);

                        }
                    }, 10);
                } else {
                    navigationParentNameSign = 0;
                }
            }
            break;
        case "navigationTypeName":
            if (navigationTypeNameSign === 0) {
                navigationTypeNameSign = 1;
                if (myValidata(obj.val(), "chineseAndEnglishKey", 1, 10, "导航名称", obj) === true) {
                    checkNavigationTypeNameExist("-1", $(obj).val());
                    var interval_2 = setInterval(function () {
                        if (navigationTypeNameSign === true || navigationTypeNameSign === false) {
                            if (navigationTypeNameSign === true) {
                                addValidataInfo(obj, "导航名已存在");
                            } else {
                                removeValidataInfo(obj);
                            }
                            navigationTypeNameSign = 0;
                            clearInterval(interval_2);
                        }
                    }, 10);
                } else {
                    navigationTypeNameSign = 0;
                }
            }
            break;
        case "navigationUrl":
            if (navigationUrlSign === 0) {
                navigationUrlSign = 1;
                if (myValidata(obj.val(), "englishKey", 1, 20, "映射地址", obj) === true) {
                    checkNavigationUrlExist("-1", $(obj).val());
                    var interval_3 = setInterval(function () {
                        if (navigationUrlSign === true || navigationUrlSign === false) {
                            if (navigationUrlSign === true) {
                                addValidataInfo(obj, "映射地址已存在");
                            } else {
                                removeValidataInfo(obj);
                            }
                            navigationUrlSign = 0;
                            clearInterval(interval_3);
                        }
                    }, 10);
                } else {
                    navigationUrlSign = 0;
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
        default:
            return false;

    }
}
