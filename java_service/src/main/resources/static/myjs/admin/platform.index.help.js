var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");
$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});

var systemIntroduceTypeList = [], systemIntroduceList = [];

var ScreenHeight = parseInt(window.screen.height * 0.7);
var ScreenWidth = parseInt(window.screen.width * 0.8);
var editor;
$(document).ready(function () {
    if ($("#platform_page").length > 0) {
        getPlatformList();
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


function getPlatformList() {
    $.ajax({
        async: true,
        url: "/guteam/admin/platform/index/getPlatformList",
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在获取系统介绍数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false
            });
        },
        success: function (back) {
            systemIntroduceList = back.platform.systemIntroduceList;
            systemIntroduceTypeList = back.platform.systemIntroduceTypeList;

            $("#platform_page").html(platformFrame(platformTabHelper()));
            $('#table_place').DataTable(tableOptionHelper(platformListFormat(systemIntroduceList)));

            swal.close();
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function doUpdateSystemIntroduceOrder() {
    var systemIntroduceElement = $("[name=systemIntroduceElement]");
    if (systemIntroduceElement.length > 0) {
        var json = {};
        for (var i = 0, len = systemIntroduceElement.length; i < len; i++) {
            json[$(systemIntroduceElement[i]).attr("systemIntroduceId")] = i;
        }
        console.log({"json": JSON.stringify(json)})
        $.ajax({
            async: true,
            url: "/guteam/admin/platform/update/save/systemIntroduceOrder",
            type: "POST",
            data: {"json": JSON.stringify(json)},
            dataType: "json",
            beforeSend: function () {
                swal({
                    html: "<i  class='fa fa-spin fa-spinner'></i>正在保存系统介绍数据，请稍等...",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false
                });
            },
            success: function (back) {
                if (back.sign === true) {
                    swal({
                        title: "成功",
                        text: "更新系统介绍数据成功",
                        type: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '确定'
                    }).then(function () {
                        window.location.reload();
                    }).catch(swal.noop);
                } else {
                    swal({
                        title: "错误",
                        text: "更新系统介绍数据失败",
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
}

function platformFrame(platformHtml) {
    var frame =
        "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-3'>" +
        platformHtml +
        "</div>" +
        "<div class='col-lg-9 col-md-9 col-sm-9 col-xs-9'>" +
        "<button type='button' style='margin-right: 20px' class='btn btn-primary float-button-light' onclick='insertPlatformModal()'>添加新的系统介绍</button>" +
        "<button type='button' class='btn btn-primary float-button-light'  onclick='updateSystemIntroduceOrder()'>修改系统介绍顺序</button>" +
        "<table class='display platform-table' id='table_place'>" +
        platformTableHead() +
        "</table>" +
        "</div>";
    return frame;
}

function insertSystemIntroduce() {

}

function updateSystemIntroduceOrder() {
    platformTableDestroy($('#systemIntroduceOrderTable'));
    $('#systemIntroduceOrderTable').html(systemIntroduceOrderTableHead());
    $('#systemIntroduceOrderTable').DataTable(tableOptionHelper(systemIntroduceListOrderFormat(systemIntroduceList)));

    $('#systemIntroduceOrderModal').modal(modelOption());
    var interval = setInterval(function () {
        if ($("#systemIntroduceOrderModal").css('display') == 'block') {
            $.fn.dataTable.tables({visible: false, api: true}).columns.adjust();
            clearInterval(interval);
        }
    }, 10);

}

function systemIntroduceListOrderFormat(platformIntroduceList) {
    var list = [];
    for (var i = 0, len = platformIntroduceList.length; i < len; i++) {
        var state;
        if (platformIntroduceList[i]["activate"]) {
            state = "<a style='color: green;'>激活</a>";
        } else {
            state = "<a style='color: grey;'>未激活</a>";
        }
        list.push(["<strong>" + (i + 1) + "</strong>",
            "<a name='systemIntroduceElement'  systemIntroduceId='" + platformIntroduceList[i].id + "'>" + platformIntroduceList[i].introduceName + "</a>",
            platformIntroduceList[i].createTime,
            platformIntroduceList[i].updateTime,
            state,
            "<button type='button' class='btn btn-primary float-button-light' name='levelChange' onclick='elementLevelUp(this)'><i class='fa fa-level-up'></i></a></button>" +
            "<button type='button' class='btn btn-primary float-button-light' name='levelChange' onclick='elementLevelDown(this)'><i class='fa fa-level-down'></i></a></button>"]);
    }
    return list;
}


function systemIntroduceOrderTableHead() {
    return "<thead><tr>" +
        "<th scope='row'>#</th>" +
        "<th scope='row'>名称</th>" +
        "<th scope='row'>创建时间</th>" +
        "<th scope='row'>修改时间</th>" +
        "<th scope='row'>状态</th>" +
        "<th scope='row'>移动</th>" +
        "</tr></thead>";
}

function platformTableHead() {
    return "<thead><tr>" +
        "<th scope='row'>#</th>" +
        "<th scope='row'>名称</th>" +
        "<th scope='row'>创建时间</th>" +
        "<th scope='row'>修改时间</th>" +
        "<th scope='row'>状态</th>" +
        "<th scope='row'>操作</th>" +
        "</tr></thead>";
}

function platformParentFrame(platformHtml) {
    var frame =
        "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-3'>" +
        platformHtml +
        "</div>" +
        "<div class='col-lg-9 col-md-9 col-sm-9 col-xs-9'>" +
        "<table class='display platform-table' id='table_place'>" +
        platformTableHead() +
        "</table>" +
        "</div>";
    return frame;
}


function platformListFormat(platformIntroduceList) {
    var list = [];
    for (var i = 0, len = platformIntroduceList.length; i < len; i++) {
        var state;
        if (platformIntroduceList[i]["activate"]) {
            state = "<a style='color: green;'>激活</a>";
        } else {
            state = "<a style='color: grey;'>未激活</a>";
        }
        list.push(["<strong>" + (i + 1) + "</strong>",
            "<a href='javascript:void(0);' style='color: #0b93d5' onclick='updatePlatformModal(\"" + platformIntroduceList[i].id + "\")'>" + platformIntroduceList[i].introduceName + "</a>",
            platformIntroduceList[i].createTime,
            platformIntroduceList[i].updateTime,
            state,
            "<button type='button' class='btn btn-danger float-button-light' data-dismiss='modal' onclick='systemIntroduceDelete(\"" + platformIntroduceList[i].id + "\")'>删除</button>"]);

    }
    return list;
}

function systemIntroduceDelete(systemIntroduceId) {
    swal({
        title: "警告",
        text: "确认后将会删除该系统介绍，且不可恢复",
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
            url: "/guteam/admin/platform/delete/systemIntroduceById",
            type: "POST",
            data: {"systemIntroduceId": systemIntroduceId},
            dataType: "json",
            beforeSend: function () {
                swal({
                    html: "<i  class='fa fa-spin fa-spinner'></i>正在删除系统介绍数据，请稍等...",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                });
            },
            success: function (back) {
                if (back.sign === true) {
                    swal({
                        title: "成功",
                        text: "删除系统介绍数据成功",
                        type: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '确定',
                    }).then(function () {
                        window.location.reload();
                    }).catch(swal.noop);
                } else {
                    swal({
                        title: "错误",
                        text: "删除系统介绍数据失败",
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

function platformTabHelper() {
    var html = "";
    html += "<ul class='list-group'><div class='form-radio'>";

    html += "<li class='list-group-item'><div class='radio-button'>" +
        "<label><input type='radio' checked='checked' name='radio' onchange='platformChooseActivate(\"all\",\"all\")'>" +
        "<i class='helper'></i>查看所有</label>" +
        "</div></li>";


    html += "<li class='list-group-item active'>状态</li>" +
        "<li class='list-group-item'>" +
        "<div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='platformChooseActivate(true,\"activate\")'>" +
        "<i class='helper'></i>激活</label></div></li>" +
        "<li class='list-group-item'>" +
        "<div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='platformChooseActivate(false,\"activate\")'>" +
        "<i class='helper'></i>未激活</label></div></li>";

    html += "</div></ul>";
    return html;
}

function platformChooseActivate(key, type) {
    var temp;
    if (type === "all") {
        platformTableDestroy($('#table_place'));
        $('#table_place').html(platformTableHead());
        $('#table_place').DataTable(tableOptionHelper(platformListFormat(systemIntroduceList)));
    } else if (type === "activate") {
        temp = systemIntroduceList.filter(function (e) {
            return e.activate === key;
        });
        platformTableDestroy($('#table_place'));
        $('#table_place').html(platformTableHead());
        $('#table_place').DataTable(tableOptionHelper(platformListFormat(temp)));
    }
}

function modelOption() {
    var model = {
        backdrop: false,
        keyboard: false
    }
    return model;
}

function insertPlatformModal() {
    var a =
        "  <label>名称</label>" +
        "  <div class='form-group'>" +
        "      <input class='form-control' id='systemIntroduceName' type='text' onblur='checkFormat(this)'>" +
        "  </div>" +
        "  <label>激活状态</label>" +
        "  <div class='form-group'>" +
        "      <label class='switcher'>" +
        "<input type='checkbox' checked  id='systemIntroduceState'>" +
        "          <span class='switcher-indicator success-switcher'></span>" +
        "      </label>" +
        "  </div>" +
        "  <label>项目描述</label>" +
        "  <div class='form-group'>" +
        "      <div id='introduceInfo'></div>" +
        "  </div>" +
        "</div>";


    var html =
        "<div class='modal fade ' id='platformModal' >" +
        "   <div class='modal-dialog modal-large'  style='width:" + ScreenWidth + "px;height:" + ScreenHeight + "px'>" +
        "       <div class='modal-content modal-content-modal'>" +
        "           <div class='modal-header'>" +
        "               <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
        "                   <span aria-hidden='true'>&times;</span>" +
        "               </button>" +
        "               <h4 class='modal-title'><label id='run_sign_title'>系统介绍</label></h4>" +
        "           </div>" +
        "           <div class='modal-body' >" +
        a +
        "           </div>" +
        "           <div class='modal-footer'>" +
        "               <button type='button' class='btn btn-danger float-button-light' onclick='insertSubmit()'>添加</button>" +
        "               <button type='button' class='btn btn-default float-button-light' data-dismiss='modal' >关闭</button>" +
        "           </div>" +
        "        </div>" +
        "    </div>" +
        "</div>";

    $("#platformModalPlace").html(html);
    var E = window.wangEditor;
    editor = new E('#introduceInfo');
    editor.customConfig.menus = ['head', 'bold', 'fontSize', 'fontName', 'italic', 'underline', 'strikeThrough', 'foreColor', 'backColor',
        'link', 'list', 'justify', 'quote', 'table', 'code', 'undo', 'redo'];
    editor.customConfig.onblur = function (html) {
        checkFormat($("#introduceInfo"));
    };
    editor.create();
    $("#platformModal").modal(modelOption());


}

function updatePlatformModal(platformId) {
    var systemIntroduce = systemIntroduceList.filter(function (e) {
        return e.id === platformId;

    });
    if (systemIntroduce.length > 0) {
        systemIntroduce = systemIntroduce[0];
        var activate = "";
        if (systemIntroduce.activate == true) {
            activate = "<input type='checkbox' checked  id='systemIntroduceState'>";
        } else {
            activate = "<input type='checkbox' id='systemIntroduceState'>";
        }
        var a =
            "  <label>名称</label>" +
            "  <div class='form-group'>" +
            "      <input class='form-control' id='systemIntroduceName' type='text' value='" + systemIntroduce.introduceName + "' onblur='checkFormat(this)'>" +
            "  </div>" +
            "  <label>创建时间</label>" +
            "  <div class='form-group'>" +
            "      <a>" + systemIntroduce.createTime + "</a>" +
            "  </div>" +
            "  <label>修改时间</label>" +
            "  <div class='form-group'>" +
            "      <a>" + systemIntroduce.updateTime + "</a>" +
            "  </div>" +
            "  <label>激活状态</label>" +
            "  <div class='form-group'>" +
            "      <label class='switcher'>" +
            activate +
            "          <span class='switcher-indicator success-switcher'></span>" +
            "      </label>" +
            "  </div>" +
            "  <label>项目描述</label>" +
            "  <div class='form-group'>" +
            "      <div id='introduceInfo'></div>" +
            "  </div>" +
            "</div>";


        var html =
            "<div class='modal fade ' id='platformModal' >" +
            "   <div class='modal-dialog modal-large'  style='width:" + ScreenWidth + "px;height:" + ScreenHeight + "px'>" +
            "       <div class='modal-content modal-content-modal'>" +
            "           <div class='modal-header'>" +
            "               <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
            "                   <span aria-hidden='true'>&times;</span>" +
            "               </button>" +
            "               <h4 class='modal-title'><label id='run_sign_title'>系统介绍</label></h4>" +
            "           </div>" +
            "           <div class='modal-body' >" +
            a +
            "           </div>" +
            "           <div class='modal-footer'>" +
            "               <button type='button' class='btn btn-danger float-button-light' onclick='updateSubmit(\"" + platformId + "\")'>修改</button>" +
            "               <button type='button' class='btn btn-default float-button-light' data-dismiss='modal' >关闭</button>" +
            "           </div>" +
            "        </div>" +
            "    </div>" +
            "</div>";
        $("#platformModalPlace").html(html);
        var E = window.wangEditor;
        editor = new E('#introduceInfo');
        editor.customConfig.menus = ['head', 'bold', 'fontSize', 'fontName', 'italic', 'underline', 'strikeThrough', 'foreColor', 'backColor',
            'link', 'list', 'justify', 'quote', 'table', 'code', 'undo', 'redo'];
        editor.customConfig.onblur = function (html) {
            checkFormat($("#introduceInfo"));
        }
        editor.create();
        editor.txt.html(systemIntroduce.introduceInfo);
        $("#platformModal").modal(modelOption());
    }


}


function insertSubmit() {
    swal({
        html: "<i  class='fa fa-spin fa-spinner'></i>正在检验输入格式，请稍等...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });
    var platformIntroduce = {};
    checkFormat($("#systemIntroduceName"));
    checkFormat($("#introduceInfo"));
    var validataInfo = $("[name='validataInfo']");
    if (validataInfo.length > 0) {
        swal.close();
        validataInfo[0].focus();
    } else {
        platformIntroduce["systemIntroduceState"] = $("#systemIntroduceState").prop("checked");
        platformIntroduce["systemIntroduceName"] = $("#systemIntroduceName").val();
        platformIntroduce["introduceInfo"] = editor.txt.html();
        console.log(platformIntroduce)
        swal.close();
        $.ajax({
            async: true,
            url: "/guteam/admin/platform/insert/saveSystemIntroduce",
            type: "POST",
            data: {"systemIntroduce": JSON.stringify(platformIntroduce)},
            dataType: "json",
            beforeSend: function () {
                swal({
                    html: "<i  class='fa fa-spin fa-spinner'></i>正在更新介绍，请稍等...",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false
                });
            },
            success: function (back) {
                if (back.sign == true) {
                    swal({
                        title: "成功",
                        text: "新建系统介绍成功",
                        type: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '确定'
                    }).then(function () {
                        window.location.reload();
                    }).catch(swal.noop);
                } else {
                    swal({
                        title: "错误",
                        text: "新建系统介绍失败",
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


function updateSubmit(platformId) {
    swal({
        html: "<i  class='fa fa-spin fa-spinner'></i>正在检验输入格式，请稍等...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });
    var platformIntroduce = systemIntroduceList.filter(function (e) {
        return e.id === platformId;
    })
    if (platformIntroduce.length > 0) {
        platformIntroduce = platformIntroduce[0];
        checkFormat($("#systemIntroduceName"));
        checkFormat($("#introduceInfo"));
        var validataInfo = $("[name='validataInfo']");
        if (validataInfo.length > 0) {
            swal.close();
            validataInfo[0].focus();
        } else {
            platformIntroduce.systemIntroduceState = $("#systemIntroduceState").prop("checked");
            platformIntroduce.systemIntroduceName = $("#systemIntroduceName").val();
            platformIntroduce.introduceInfo = editor.txt.html();
            swal.close();
            $.ajax({
                async: true,
                url: "/guteam/admin/platform/update/saveSystemIntroduce",
                type: "POST",
                data: {"systemIntroduce": JSON.stringify(platformIntroduce)},
                dataType: "json",
                beforeSend: function () {
                    swal({
                        html: "<i  class='fa fa-spin fa-spinner'></i>正在更新介绍，请稍等...",
                        allowOutsideClick: false,
                        allowEscapeKey: false,
                        showConfirmButton: false
                    });
                },
                success: function (back) {
                    if (back.sign == true) {
                        swal({
                            title: "成功",
                            text: "更新系统介绍成功",
                            type: 'success',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: '确定'
                        }).then(function () {
                            window.location.reload();
                        }).catch(swal.noop);
                    } else {
                        swal({
                            title: "错误",
                            text: "更新系统介绍失败",
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


}


function checkFormat(obj) {
    obj = $(obj);
    switch (obj.attr("id")) {
        case "systemIntroduceName":
            myValidata(obj.val(), "chineseAndEnglishKey", 1, 20, "介绍名称", obj);
            break;
        case "introduceInfo":
            myValidata(editor.txt.text(), "none", 1, 3000, "介绍描述", obj);
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
            "sEmptyTable": "无介绍",
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

function platformTableDestroy(obj) {
    var table = obj;
    var int_table = obj.DataTable();
    int_table.clear();
    int_table.destroy();
    table.empty();
}

function elementLevelUp(obj) {
    var tr = $(obj.parentNode.parentNode);

    var pre = tr.prev();
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