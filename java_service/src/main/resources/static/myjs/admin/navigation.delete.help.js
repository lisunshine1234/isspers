var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");
$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});


var runInfoSwalWidth = parseInt(window.screen.width * 0.8);
var outputJsonList = [];
var navigationTypeList = [], navigationTypeList = [];
var navigationIdBak, urlBak = "/";
<!-- start -->
$(document).ready(function () {
    if ($("#navigation_page").length > 0) {
        getNavigationList();
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


function getNavigationList() {
    $.ajax({
        async: true,
        url: "/guteam/admin/navigation/view/getNavigationList",
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
            console.log(navigationTypeList)
            $("#navigation_page").html(navigationTypeFrame(navigationTabHelper()));
            $('#table_place').DataTable(tableOptionHelper(navigationTypeListFormat(navigationTypeList)));
            swal.close();
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}


function navigationTypeFrame(navigationHtml) {
    var frame =
        "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-3'>" +
        navigationHtml +
        "</div>" +
        "<div class='col-lg-9 col-md-9 col-sm-9 col-xs-9'>" +
        "<table class='display navigation-table' id='table_place'>" +
        navigationTypeTableHead() +
        "</table>" +
        "</div>";
    return frame;
}

function navigationTypeTableHead() {
    return "<thead><tr>" +
        "<th scope='row'>#</th>" +
        "<th scope='row'>导航名称</th>" +
        "<th scope='row'>是否为算法导航</th>" +
        "<th scope='row'>状态</th>" +
        "<th scope='row'>操作</th>" +
        "</tr></thead>";
}

function navigationParentTableHead() {
    return "<thead><tr>" +
        "<th scope='row'>#</th>" +
        "<th scope='row'>导航名称</th>" +
        "<th scope='row'>图标</th>" +
        "<th scope='row'>映射地址</th>" +
        "<th scope='row'>状态</th>" +
        "<th scope='row'>操作</th>" +
        "</tr></thead>";
}

function navigationTypeListFormat(navigationTypeList) {
    var list = [];
    for (var i = 0, len = navigationTypeList.length; i < len; i++) {
        var state;
        if (navigationTypeList[i]["activate"]) {
            state = " <a style='color: green;'>激活</a>";
        } else {
            state = " <a style='color: grey;'>未激活</a>";
        }
        list.push(["<strong>" + (i + 1) + "</strong>",
            navigationTypeList[i].navigationName,
            navigationTypeList[i].navigationAlgorithm.toString(),
            state,
            "<button type='button' class='btn btn-danger float-button-light' data-dismiss='modal' onclick='navigationTypeDelete(\""+navigationTypeList[i].id+"\")'>删除</button>"
        ]);
    }
    return list;
}

function navigationTypeDelete(navigationTypeId) {
    swal({
        title: "警告",
        text: "确认后将会删除该导航信息，且不可恢复",
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
            url: "/guteam/admin/navigation/delete/navigationType",
            type: "POST",
            data:{"navigationTypeId":navigationTypeId},
            dataType: "json",
            beforeSend: function () {
                swal({
                    html: "<i  class='fa fa-spin fa-spinner'></i>正在删除导航数据，请稍等...",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                });
            },
            success: function (back) {
                if (back.sign === true) {
                    swal({
                        title: "成功",
                        text: "删除导航数据成功",
                        type: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '确定',
                    }).then(function () {
                        window.location.reload();
                    }).catch(swal.noop);
                } else {
                    swal({
                        title: "错误",
                        text: "删除导航数据失败",
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
function navigationParentListFormat(navigationParentList) {
    var list = [];
    for (var i = 0, len = navigationParentList.length; i < len; i++) {
        var state;
        if (navigationParentList[i]["activate"]) {
            state = " <a  style='color: green;'>激活</a> ";
        } else {
            state = " <a style='color: grey;'>未激活</a> ";
        }
        list.push(["<strong>" + (i + 1) + "</strong>",
            navigationParentList[i].navigationName,
            "<i class='" + navigationParentList[i].navigationIcon + "'></i>",
            navigationParentList[i].navigationUrl,
            state,
            "<button type='button' class='btn btn-danger float-button-light' data-dismiss='modal' onclick='navigationParentDelete(\""+navigationParentList[i].id+"\")'>删除</button>"]);
    }
    return list;
}

function navigationParentDelete(navigationParentId) {
    swal({
        title: "警告",
        text: "确认后将会删除该导航信息，且不可恢复",
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
            url: "/guteam/admin/navigation/delete/navigationParent",
            type: "POST",
            data:{"navigationParentId":navigationParentId},
            dataType: "json",
            beforeSend: function () {
                swal({
                    html: "<i  class='fa fa-spin fa-spinner'></i>正在删除导航数据，请稍等...",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                });
            },
            success: function (back) {
                if (back.sign === true) {
                    swal({
                        title: "成功",
                        text: "删除导航数据成功",
                        type: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '确定',
                    }).then(function () {
                        window.location.reload();
                    }).catch(swal.noop);
                } else {
                    swal({
                        title: "错误",
                        text: "删除导航数据失败",
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
function navigationTabHelper() {
    var html = "";
    html += "<ul class='list-group'><div class='form-radio'>";

    html += "<li class='list-group-item'><div class='radio-button'>" +
        "<label><input type='radio' checked='checked' name='radio' onchange='navigationChooseType(\"type\",\"type\")'>" +
        "<i class='helper'></i>查看父类导航</label>" +
        "</div></li>";


    html += "<li class='list-group-item active'>查看子类导航</li>";
    for (var i = 0, len = navigationTypeList.length; i < len; i++) {
        html += "<li class='list-group-item'>" +
            "<div class='radio-button'>" +
            "<label>" +
            "<input type='radio' name='radio' onchange='navigationChooseType(\"" + navigationTypeList[i].id + "\",\"parent\")'>" +
            "<i class='helper'></i>" + navigationTypeList[i].navigationName + "</label></div></li>";
    }

    html += "</div></ul>";
    return html;
}

function navigationChooseType(key, type) {
    var temp;
    if (type == "type") {
        navigationTableDestroy($('#table_place'));
        $('#table_place').html(navigationTypeTableHead());
        $('#table_place').DataTable(tableOptionHelper(navigationTypeListFormat(navigationTypeList)));
    } else if (type == "parent") {
        temp = navigationTypeList.filter(function (e) {
            return e.id == key;
        });

        if (temp.length > 0) {
            temp = temp[0].navigationParentList;
        } else {
            temp = [];
        }

        navigationTableDestroy($('#table_place'));
        $('#table_place').html(navigationParentTableHead());
        $('#table_place').DataTable(tableOptionHelper(navigationParentListFormat(temp)));
    }
}

function modelOption() {
    var model = {
        backdrop: false,
        keyboard: false,
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
            "sEmptyTable": "无导航",
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

function navigationTableDestroy(obj) {
    var table = obj;
    var int_table = obj.DataTable();
    int_table.clear();
    int_table.destroy();
    table.empty();
}
