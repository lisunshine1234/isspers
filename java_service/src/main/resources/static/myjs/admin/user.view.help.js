var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");
$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});

var userList = [];
<!-- start -->
$(document).ready(function () {
    if ($("#user_page").length > 0) {
        getUserList();
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


function getUserList() {
    $.ajax({
        async: true,
        url: "/guteam/admin/user/getUserList",
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在获取用户数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            });
        },
        success: function (back) {
            userList = back;
            $("#user_page").html(userFrame(userTabHelper()));
            $('#table_place').DataTable(tableOptionHelper(userListFormat(back)));
            swal.close();
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}



function userListFormat(userList) {
    var list = [];
    for (var i = 0, len = userList.length; i < len; i++) {
        var state;
        if (userList[i].nonLock == true) {
            state = "<a style='color: green'>正常</a>";
        } else {
            state = "<a style='color: red'>锁定</a>";
        }
        list.push(["<strong>" + (i + 1) + "</strong>", userList[i].userName, userList[i].phone, userList[i].email, userList[i].userType.userTypeName, state]);
    }
    return list;
}

function userTabHelper() {
    var html = "";
    html += "<ul class='list-group'><div class='form-radio'>";
    html += "<li class='list-group-item'><div class='radio-button'>" +
        "<label><input type='radio' checked='checked' name='radio' onchange='userChooseType(\"all\",\"all\")'>" +
        "<i class='helper'></i>查看所有类别("+userList.length+")</label>" +
        "</div></li>";

    html += "<li class='list-group-item active'>用户角色</li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='userChooseType(\"SUPER_ADMIN\",\"role\")'>" +
        "<i class='helper'></i>超级管理员" + "(" + userList.filter(function (e) {
            return e.userType.userTypeKey == "SUPER_ADMIN";
        }).length + ")</label></div></li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='userChooseType(\"ADMIN\",\"role\")'>" +
        "<i class='helper'></i>管理员" + "(" + userList.filter(function (e) {
            return e.userType.userTypeKey == "ADMIN";
        }).length + ")</label></div></li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='userChooseType(\"ADMIN\",\"role\")'>" +
        "<i class='helper'></i>用户" + "(" + userList.filter(function (e) {
            return e.userType.userTypeKey == "USER";
        }).length + ")</label></div></li>";
    html += "<li class='list-group-item active'>用户状态</li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='userChooseType(true,\"state\")'>" +
        "<i class='helper'></i>正常" + "(" + userList.filter(function (e) {
            return e.nonLock == true;
        }).length + ")</label></div></li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='userChooseType(false,\"state\")'>" +
        "<i class='helper'></i>锁定" + "(" + userList.filter(function (e) {
            return e.nonLock == false;
        }).length + ")</label></div></li>";
    html += "</div></ul>";
    return html;

}

function userChooseType(key, type) {
    var temp;
    if (type == "all") {
        temp = userList;
    } else if (type == "role") {
        temp = userList.filter(function (e) {
            return e.userType.userTypeKey == key;
        });
    } else if (type == "state") {
        temp = userList.filter(function (e) {
            return e.nonLock == key;
        });
    }

    $('#table_place').DataTable(tableOptionHelper(userListFormat(temp)));
}

function userFrame(navigationHtml) {
    var frame =
        "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-3'>" +
        navigationHtml +
        "</div>" +
        "<div class='col-lg-9 col-md-9 col-sm-9 col-xs-9'>" +
        "<table class='display algorithm-table' id='table_place'>" +
        "<thead><tr><th scope='row'>#</th><th scope='row'>用户名</th><th scope='row'>手机号码</th><th scope='row'>邮箱</th><th scope='row'>角色</th><th scope='row'>状态</th></tr></thead></table>" +
        "</div>";
    return frame;
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
            "sEmptyTable": "无用户",
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


function swalHelper(title, text, type, id) {
    swal({
        title: title,
        text: text,
        type: type,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonColor: '#3085d6',
        cancelButtonText: '确定',
    }).then(function (isConfirm) {
        $('html,body').animate({scrollTop: $('#' + id).offset().top - 50}, 1000);
    }, function (dismiss) {
        $('html,body').animate({scrollTop: $('#' + id).offset().top - 50}, 1000);
    }).catch(swal.noop);
}

function myValidata(value, key, min_len, max_len, name, id) {
    if (min_len < 0) {
        min_len = 0;
    }
    if (max_len < 0) {
        max_len = -1
    }

    if (typeof value == "object") {
        if (value.length < min_len) {
            swalHelper("错误", name + "至少选择" + min_len + "个", "error", id);
            return false;
        }
        if (max_len > 0 && value.length > max_len) {
            swalHelper("错误", name + "至多选择" + max_len + "个", "error", id);
            return false;
        }
    } else {
        if (value.length < min_len) {
            swalHelper("错误", name + "的最小长度为" + min_len, "error", id);
            return false;
        }
        if (max_len > 0 && value.length > max_len) {
            swalHelper("错误", name + "的最大长度为" + max_len, "error", id);
            return false;
        }
    }

    var englishKey = new RegExp("[0-9a-zA-Z_]*");
    var chineseKey = new RegExp("[\u0391-\uFFE5_]*");
    var chineseAndEnglishKey = new RegExp("[0-9a-zA-Z\u0391-\uFFE5_]*");
    switch (key) {
        case "englishKey":
            if (englishKey.test(value)) {
                return true;
            } else {
                swalHelper("错误", name + "的输入只能为大小写字母以及下划线" + max_len, "error", id);
                return false;
            }
        case "chineseKey":
            if (chineseKey.test(value)) {
                return true;
            } else {
                swalHelper("错误", name + "的输入只能为中文以及下划线" + max_len, "error", id);
                return false;
            }
        case "chineseAndEnglishKey" || "englishAndChineseKey":
            if (chineseAndEnglishKey.test(value)) {
                return true;
            } else {
                swalHelper("错误", name + "的输入只能为中文、大小写字母以及下划线" + max_len, "error", id);
                return false;
            }
        case "none":
            return true;
        case "json":
            return isJSON(value);
        default:
            return false;

    }
}
