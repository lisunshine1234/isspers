var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");
$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});


var permissionList = [];
var permissionUrlSign = 0, permissionNameSign = 0;

$(document).ready(function () {
    if ($("#permission_page").length > 0) {
        getPermissionList();
    }
    $.fn.dataTable.tables({visible: false, api: true}).columns.adjust();
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


function getPermissionList() {
    $.ajax({
        async: true,
        url: "/guteam/admin/permission/update/getPermissionList",
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在获取权限数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            });
        },
        success: function (back) {
            permissionList = back.permissionList;
            $("#permission_page").html(permissionFrame(permissionTabHelper()));
            $('#table_place').DataTable(tableOptionHelper(permissionListFormat(permissionList)));
            swal.close();
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}


function permissionFrame(permissionHtml) {
    var frame =
        "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-3'>" +
        permissionHtml +
        "</div>" +
        "<div class='col-lg-9 col-md-9 col-sm-9 col-xs-9'>" +
        "<table class='display permission-table' id='table_place'>" +
        permissionTableHead() +
        "</table>" +
        "</div>";
    return frame;
}

function permissionTableHead() {
    return "<thead><tr>" +
        "<th scope='row'>序号</th>" +
        "<th scope='row'>权限名称</th>" +
        "<th scope='row'>映射地址</th>" +
        "<th scope='row'>状态</th>" +
        "</tr></thead>";
}

function permissionListFormat(permissionList) {
    var list = [];
    for (var i = 0, len = permissionList.length; i < len; i++) {
        var state;
        if (permissionList[i]["activate"]) {
            state = "<a style='color: green;'>激活</a>";
        } else {
            state = "<a style='color: grey;'>未激活</a>";
        }
        list.push(["<strong>" + (i + 1) + "</strong>",
            "<a href='javascript:void(0);' style='color: #0b93d5' onclick='getPermissionById(\"" + permissionList[i]["id"] + "\")'>" + permissionList[i].permissionName + "</a>",
            permissionList[i].permissionUrl,
            state]);
    }
    return list;
}

function getPermissionById(permissionId) {
    $.ajax({
        async: true,
        url: "/guteam/admin/permission/update/getPermissionById",
        type: "POST",
        data: {"permissionId": permissionId},
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在获取权限数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            });
        },
        success: function (back) {
            if (back.permission == null) {
                swal({
                    title: "错误",
                    text: "未找到该权限的信息",
                    type: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: '确定',
                });
            } else {
                swal.close();
                permissionUpdateModal(back.permission);
            }
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}


function permissionUpdateModal(permission) {
    permissionId = permission.id;
    var state;

    if (permission.activate == true) {
        state = "<input type='checkbox' checked id='permissionState'>";
    } else {
        state = "<input type='checkbox' id='permissionState'>";
    }
    var permissionInfo =
        "<label>权限名称</label>" +
        "<div class='form-group'>" +
        "<input class='form-control'  id='permissionName' type='text' value='" + permission.permissionName + "' onblur='checkFormat(this)'>" +
        "</div>" +
        "<label>映射地址</label>" +
        "<div class='form-group'>" +
        "<input id='permissionUrl' class='form-control' type='text'  value='" + permission.permissionUrl + "' onblur='checkFormat(this)'>" +
        "</div>" +
        "<label>激活状态</label>" +
        "<div class='form-group'>" +
        "<label class='switcher'>" +
        state +
        "<span class='switcher-indicator'></span>" +
        "</label></div>" +
        "<input id='permissionId' type='text' value='" + permission.id + "'  hidden>";
    var html =
        "<div class='modal fade ' id='permissionModal' >" +
        "   <div class='modal-dialog modal-large'  style='width:80%'>" +
        "       <div class='modal-content modal-content-modal'>" +
        "           <div class='modal-header'>" +
        "               <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
        "                   <span aria-hidden='true'>&times;</span>" +
        "               </button>" +
        "               <h4 class='modal-title'>权限修改</h4>" +
        "           </div>" +
        "           <div class='modal-body' >" +
        permissionInfo +
        "           </div>" +
        "           <div class='modal-footer'>" +
        "               <button type='button' class='btn btn-primary float-button-light' onclick='updatePermission()'>修改</button>" +
        "               <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>" +
        "           </div>" +
        "        </div>" +
        "    </div>" +
        "</div>";
    $("#permissionModalPlace").html(html);
    $("#permissionModal").modal(modelOption());
}

function updatePermission() {
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
                        url: "/guteam/admin/permission/update/save/permission",
                        type: "POST",
                        data: {
                            "permissionId": $("#permissionId").val(),
                            "permissionName": $("#permissionName").val(),
                            "permissionUrl": $("#permissionUrl").val(),
                            "permissionState": $("#permissionState").prop("checked")
                        },
                        dataType: "json",
                        beforeSend: function () {
                            swal({
                                html: "<i  class='fa fa-spin fa-spinner'></i>正在更新权限数据，请稍等...",
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                showConfirmButton: false
                            });
                        },
                        success: function (back) {
                            if (back.sign === true) {
                                swal({
                                    title: "成功",
                                    text: "更新权限数据成功",
                                    type: 'success',
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: '确定',
                                }).then(function () {
                                    window.location.reload();
                                }).catch(swal.noop);
                            } else {
                                swal({
                                    title: "错误",
                                    text: "更新权限数据失败",
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

function permissionTabHelper() {
    var html = "";
    html += "<ul class='list-group'><div class='form-radio'>";

    html += "<li class='list-group-item'><div class='radio-button'>" +
        "<label><input type='radio' checked='checked' name='radio' onchange='permissionChooseType(\"all\",\"all\")'>" +
        "<i class='helper'></i>查看所有</label>" +
        "</div></li>";


    html += "<li class='list-group-item active'>激活状态</li>";
    html += "<li class='list-group-item'>" +
        "<div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='permissionChooseType(true,\"activate\")'>" +
        "<i class='helper'></i>激活</label></div></li>";
    html += "<li class='list-group-item'>" +
        "<div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='permissionChooseType(false,\"activate\")'>" +
        "<i class='helper'></i>未激活</label></div></li>";
    html += "</div></ul>";
    return html;
}

function permissionChooseType(key, type) {
    var temp;
    if (type === "all") {
        permissionTableDestroy($('#table_place'));
        $('#table_place').html(permissionTableHead());
        $('#table_place').DataTable(tableOptionHelper(permissionListFormat(permissionList)));
    } else if (type === "activate") {
        temp = permissionList.filter(function (e) {
            return e.activate === key;
        });

        permissionTableDestroy($('#table_place'));
        $('#table_place').html(permissionTableHead());
        $('#table_place').DataTable(tableOptionHelper(permissionListFormat(temp)));
    }
}

function modelOption() {
    var model = {
        backdrop: false,
        keyboard: false
    }
    return model;
}


function tableOptionHelper(data) {
    var option = {
        "data": data,
        'bDestroy': true,
        'bLengthChange': false,
        // 'bPaginate': false,                  //是否分页
        'iDisplayLength': 20,              //显示数据条数
        'bInfo': true,                       //数据查找状态，没数据会显示“没有数据”
        'bAutoWidth': true,                  //自动宽度
        'bSort': true,                      //是否排序
        'bFilter': false,                    //过滤功能
        "searching": true,                    //本地搜索
        'bProcessing': true,
        "sScrollX": "100%",
        "sScrollXInner": "100%",
        // "scrollX": true,
        "language": {//代替表下方的英文页码说明
            "sProcessing": "处理中...",
            "sLengthMenu": "每页 _MENU_ 项",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "当前显示第 _START_ 至 _END_ 项，共 _TOTAL_ 项。",
            "sInfoEmpty": "当前显示第 0 至 0 项，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "sUrl": "",
            "sEmptyTable": "无权限内容",
            "sLoadingRecords": "载入中...",
            "sInfoThousands": ",",
            "oPaginate": {
                "sFirst": "首页",
                "sPrevious": "上页",
                "sNext": "下页",
                "sLast": "末页",
                "sJump": "跳转"
            }
        }
    }
    return option;

}

function permissionTableDestroy(obj) {
    var table = obj;
    var int_table = obj.DataTable();
    int_table.clear();
    int_table.destroy();
    table.empty();
}


function checkFormat(obj) {
    obj = $(obj);
    switch (obj.attr("id")) {
        case "permissionName":
            if (permissionNameSign === 0) {
                permissionNameSign = 1;
                if (myValidata(obj.val(), "chineseAndEnglishKey", 1, 10, "权限名称", obj) === true) {
                    checkPermissionNameExist($("#permissionId").val(), $(obj).val());
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
                    checkPermissionUrlExist($("#permissionId").val(), $(obj).val());
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
function addValidataInfo(obj, info) {
    if ($(obj).next().attr("name") !== "validataInfo") {
        $(obj).after("<div class='font-red' name='validataInfo'>" + info + "</div>");
    }
}

function removeValidataInfo(obj) {
    var obj_temp = $(obj).next();
    if (obj_temp.attr("name") === "validataInfo") {
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