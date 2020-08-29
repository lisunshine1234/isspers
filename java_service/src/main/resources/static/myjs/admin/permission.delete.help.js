var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");
$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});


var permissionList = [];

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
        "<th scope='row'>操作</th>" +
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
            permissionList[i].permissionName,
            permissionList[i].permissionUrl,
            state,
            "<button type='button' class='btn btn-danger float-button-light' data-dismiss='modal' onclick='permissionDelete(\""+permissionList[i].id+"\")'>删除</button>"]);
    }
    return list;
}

function permissionDelete(permissionId) {
    swal({
        title: "警告",
        text: "确认后将会删除该权限信息，且不可恢复",
        type: 'warning',
        confirmButtonColor: '#F9534F',
        confirmButtonText: '删除',
        showCancelButton: true,
        cancelButtonColor: '#3085d6',
        cancelButtonText: '取消',
        allowOutsideClick: false,
        allowEscapeKey: false,
    }).then(function (isConfirm) {
        $.ajax({
            async: true,
            url: "/guteam/admin/permission/delete/permission",
            type: "POST",
            data:{"permissionId":permissionId},
            dataType: "json",
            beforeSend: function () {
                swal({
                    html: "<i  class='fa fa-spin fa-spinner'></i>正在删除权限数据，请稍等...",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false
                });
            },
            success: function (back) {
                if (back.sign === true) {
                    swal({
                        title: "成功",
                        text: "删除权限数据成功",
                        type: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '确定',
                    }).then(function () {
                        window.location.reload();
                    }).catch(swal.noop);
                } else {
                    swal({
                        title: "错误",
                        text: "删除权限数据失败",
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
    }, function (dismiss) {
    }).catch(swal.noop);
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

function elementLevelUp(obj) {
    var tr = $(obj.parentNode.parentNode);

    var pre = tr.prev();
    console.log(pre)
    if (pre.length == 0) {
        swal({
            title: "错误!",
            text: "已经是第一个",
            type: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '确定',
        }).catch(swal.noop);
    } else {
        pre.before(tr);
    }
}

function elementLevelDown(obj) {
    var tr = $(obj.parentNode.parentNode);
    var next = tr.next();
    if (next.length == 0) {
        swal({
            title: "错误!",
            text: "已经是最后一个",
            type: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '确定',
        }).catch(swal.noop);
    } else {
        tr.before(next)
    }
}