var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");
$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});

var runInfoDivHeight = parseInt(window.screen.height * 0.5);
var ScreenHeight = parseInt(window.screen.height * 0.7);
var ScreenWidth = parseInt(window.screen.width * 0.8);
var runInfoSwalWidth = parseInt(window.screen.width * 0.8);
var outputJsonList = [];
var navigationTypeList = [], navigationTypeList = [];
var navigationUrlSign = 0, navigationParentNameSign = 0, navigationTypeNameSign = 0;
var navigationParentId = "-1", navigationTypeId = "-1";
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
        "<button type='button' class='btn btn-default float-button-light' data-dismiss='modal' id='updateNavigationOrder' onclick='updateNavigationOrder()'>修改导航栏顺序</button>" +
        "<table class='display navigation-table' id='table_place'>" +
        navigationTypeTableHead() +
        "</table>" +
        "</div>";
    return frame;
}

function updateNavigationOrder() {
    var a = $('input:radio[name=navigationLeftHelper]:checked').attr("onchange");
    var keyAndTpe = a.split("(\"")[1].replace("\")", "").split("\",\"");
    var temp;
    if (keyAndTpe[1] === "type") {
        navigationTableDestroy($('#navigationOrderTable'));
        $('#navigationOrderTable').html(navigationTypeOrderTableHead());
        $('#navigationOrderTable').DataTable(tableOptionHelper(navigationTypeListOrderFormat(navigationTypeList)));
    } else if (keyAndTpe[1] === "parent") {
        temp = navigationTypeList.filter(function (e) {
            return e.id === keyAndTpe[0];
        });

        if (temp.length > 0) {
            temp = temp[0].navigationParentList;
        } else {
            temp = [];
        }
        navigationTableDestroy($('#navigationOrderTable'));
        $('#navigationOrderTable').html(navigationParentOrderTableHead());
        $('#navigationOrderTable').DataTable(tableOptionHelper(navigationParentListOrderFormat(temp)));
    }
    $('#navigationOrderModal').modal(modelOption());
    var interval = setInterval(function () {
        if ($("#navigationOrderModal").css('display') == 'block') {
            $.fn.dataTable.tables({visible: false, api: true}).columns.adjust();
            clearInterval(interval);
        }
    }, 10);

}


function doUpdateNavigationOrder() {
    var a = $('input:radio[name=navigationLeftHelper]:checked').attr("onchange");
    var keyAndTpe = a.split("(\"")[1].replace("\")", "").split("\",\"");

    if (keyAndTpe[1] === "type") {
        doUpdateNavigationTypeOrder();
    } else if (keyAndTpe[1] === "parent") {
        doUpdateNavigationParentOrder(keyAndTpe[0]);
    }

}

function doUpdateNavigationTypeOrder() {

    var navigationElement = $("[name=navigationElement]");
    if (navigationElement.length > 0) {
        var json = {};
        for (var i = 0, len = navigationElement.length; i < len; i++) {
            json[$(navigationElement[i]).attr("navigationId")] = i;
        }

        $.ajax({
            async: true,
            url: "/guteam/admin/navigation/update/save/navigationTypeOrder",
            type: "POST",
            data: {"json": JSON.stringify(json)},
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
                        text: "更新数据成功",
                        type: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '确定'
                    }).then(function () {
                        window.location.reload();
                    }).catch(swal.noop);
                } else {
                    swal({
                        title: "错误",
                        text: "更新数据失败",
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

function doUpdateNavigationParentOrder(navigationParentId) {
    var navigationElement = $("[name=navigationElement]");
    if (navigationElement.length > 0) {
        var json = {};
        for (var i = 0, len = navigationElement.length; i < len; i++) {
            json[$(navigationElement[i]).attr("navigationId")] = i;
        }

        $.ajax({
            async: true,
            url: "/guteam/admin/navigation/update/save/navigationParentOrder",
            type: "POST",
            data: {"navigationParentId": navigationParentId, "json": JSON.stringify(json)},
            dataType: "json",
            beforeSend: function () {
                swal({
                    html: "<i  class='fa fa-spin fa-spinner'></i>正在保存导航数据，请稍等...",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                });
            },
            success: function (back) {
                if (back.sign === true) {
                    swal({
                        title: "成功",
                        text: "更新数据成功",
                        type: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '确定',
                    }).then(function () {
                        window.location.reload();
                    }).catch(swal.noop);
                } else {
                    swal({
                        title: "错误",
                        text: "更新数据失败",
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

function navigationTypeTableHead() {
    return "<thead><tr>" +
        "<th scope='row'>#</th>" +
        "<th scope='row'>导航名称</th>" +
        "<th scope='row'>是否为算法导航</th>" +
        "<th scope='row'>状态</th>" +
        "</tr></thead>";
}


function navigationParentTableHead() {
    return "<thead><tr>" +
        "<th scope='row'>#</th>" +
        "<th scope='row'>导航名称</th>" +
        "<th scope='row'>图标</th>" +
        "<th scope='row'>映射地址</th>" +
        "<th scope='row'>状态</th>" +
        "</tr></thead>";
}

function navigationTypeOrderTableHead() {
    return "<thead><tr>" +
        "<th scope='row'>#</th>" +
        "<th scope='row'>导航名称</th>" +
        "<th scope='row'>移动</th>" +
        "</tr></thead>";
}


function navigationParentOrderTableHead() {
    return "<thead><tr>" +
        "<th scope='row'>#</th>" +
        "<th scope='row'>导航名称</th>" +
        "<th scope='row'>移动</th>" +
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
            "<a href='javascript:void(0);' style='color: #0b93d5' onclick='getNavigationTypeInfoById(\"" + navigationTypeList[i]["id"] + "\")'>" + navigationTypeList[i].navigationName + "</a>",
            navigationTypeList[i].navigationAlgorithm.toString(),
            state]);
    }
    return list;
}

function navigationTypeListOrderFormat(navigationTypeList) {
    var list = [];
    for (var i = 0, len = navigationTypeList.length; i < len; i++) {
        list.push(["<strong>" + (i + 1) + "</strong>",
            "<a name='navigationElement' navigationId='" + navigationTypeList[i].id + "'>" + navigationTypeList[i].navigationName + "</a>",
            "<button type='button' class='btn btn-primary float-button-light' name='levelChange' onclick='elementLevelUp(this)'><i class='fa fa-level-up'></i></a></button>" +
            "<button type='button' class='btn btn-primary float-button-light' name='levelChange' onclick='elementLevelDown(this)'><i class='fa fa-level-down'></i></a></button>"
        ]);
    }
    return list;
}

function navigationParentListFormat(navigationParentList) {
    var list = [];
    for (var i = 0, len = navigationParentList.length; i < len; i++) {
        var state;
        if (navigationParentList[i]["activate"]) {
            state = " <a style='color: green;'>激活</a> ";
        } else {
            state = " <a  style='color: grey;'>未激活</a> ";
        }
        list.push(["<strong>" + (i + 1) + "</strong>",
            "<a href='javascript:void(0);' style='color: #0b93d5' onclick='getNavigationParentInfoById(\"" + navigationParentList[i]["id"] + "\")'>" + navigationParentList[i].navigationName + "</a>",
            "<i class='" + navigationParentList[i].navigationIcon + "'></i>",
            navigationParentList[i].navigationUrl,
            state]);
    }
    return list;
}

function navigationParentListOrderFormat(navigationParentList) {
    var list = [];
    for (var i = 0, len = navigationParentList.length; i < len; i++) {
        list.push(["<strong>" + (i + 1) + "</strong>",
            "<a name='navigationElement' navigationId='" + navigationParentList[i].id + "'>" + navigationParentList[i].navigationName + "</a>",
            "<button type='button' class='btn btn-primary float-button-light' name='levelChange' onclick='elementLevelUp(this)'><i class='fa fa-level-up'></i></a></button>" +
            "<button type='button' class='btn btn-primary float-button-light' name='levelChange' onclick='elementLevelDown(this)'><i class='fa fa-level-down'></i></a></button>"
        ]);
    }
    return list;
}

function getNavigationTypeInfoById(navigationTypeId) {
    navigationTypeUpdateModal(navigationTypeList.filter(function (e) {
        return e.id === navigationTypeId;
    })[0]);
}

function getNavigationParentInfoById(navigationParentId) {
    var navigationParent;
    for (var i = 0, len = navigationTypeList.length; i < len; i++) {
        navigationParent = navigationTypeList[i].navigationParentList.filter(function (e) {
            return e.id === navigationParentId;
        });
        if (navigationParent.length > 0) {
            break;
        }
    }

    navigationParentUpdateModal(navigationParent[0]);
}


function navigationTypeUpdateModal(navigationType) {
    navigationTypeId = navigationType.id;
    var state;

    if (navigationType.activate == true) {
        state = "<input type='checkbox' checked id='navigationTypeState'>";
    } else {
        state = "<input type='checkbox' id='navigationTypeState'>";
    }
    var navigationInfo =
        "<label>导航名称</label>" +
        "<div class='form-group'>" +
        "<input class='form-control'  id='navigationTypeName' type='text' value='" + navigationType.navigationName + "' onblur='checkFormat(this)'>" +
        "</div>" +
        "<label>激活状态</label>" +
        "<div class='form-group'>" +
        "<label class='switcher'>" +
        state +
        "<span class='switcher-indicator'></span>" +
        "</label></div>";
    var html =
        "<div class='modal fade ' id='navigationModal' >" +
        "   <div class='modal-dialog modal-large'  style='width:80%'>" +
        "       <div class='modal-content modal-content-modal'>" +
        "           <div class='modal-header'>" +
        "               <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
        "                   <span aria-hidden='true'>&times;</span>" +
        "               </button>" +
        "               <h4 class='modal-title'>父类导航修改</h4>" +
        "           </div>" +
        "           <div class='modal-body' >" +
        navigationInfo +
        "           </div>" +
        "           <div class='modal-footer'>" +
        "               <button type='button' class='btn btn-primary float-button-light' onclick='updateNavigationType(\"" + navigationType.id + "\")'>修改</button>" +
        "               <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>" +
        "           </div>" +
        "        </div>" +
        "    </div>" +
        "</div>";
    $("#navigationModalPlace").html(html);
    $("#navigationModal").modal(modelOption());
}


function navigationParentUpdateModal(navigationParent) {
    navigationParentId = navigationParent.id;
    var navigationType = navigationTypeList.filter(function (e) {
        return e.id === navigationParent.navigationTypeId;
    })[0];

    var algorithm, state, navigation, value;
    if (navigationType.navigationAlgorithm == true) {
        algorithm = "<a>algorithm/</a><input class='form-control' id='navigationUrl' type='text' onblur='checkFormat(this)' value='" + navigationParent.navigationUrl.toString().substring(10, navigationParent.navigationUrl.toString().length) + "'>";
        navigation = navigationTypeSelectAlgorithm();
        value = navigationType.id;
    } else {
        algorithm = "<input class='form-control' type='text' value='" + navigationParent.navigationUrl + "' disabled>";
        navigation = "<input class='form-control' type='text' value='" + navigationType.navigationName + "' disabled>";
    }

    if (navigationParent.activate == true) {
        state = "<input type='checkbox' checked id='navigationParentState'>";
    } else {
        state = "<input type='checkbox' id='navigationParentState'>";
    }
    var navigationInfo =
        "<label>导航名称</label>" +
        "<div class='form-group'>" +
        "<input class='form-control' id='navigationParentName' type='text' value='" + navigationParent.navigationName + "' onblur='checkFormat(this)'>" +
        "</div>" +
        "<label>导航图标</label>" +
        "<div class='form-group'>" +
        "<i id='navigationIcon' class='" + navigationParent.navigationIcon + "' style='margin-right: 50px'></i>" +
        "<button type='button' class='btn btn-default float-button-light' onclick='iconsChangeModal()'>更换</button>" +
        "</div>" +
        "<label>映射地址</label>" +
        "<div class='form-group'>" +
        algorithm +
        "</div>" +
        "<label>所属类别</label>" +
        "<div class='form-group'>" +
        navigation +
        "</div>" +
        "<label>激活状态</label>" +
        "<div class='form-group'>" +
        "<label class='switcher'>" +
        state +
        "<span class='switcher-indicator'></span>" +
        "</label>";


    var html =
        "<div class='modal fade ' id='navigationModal' >" +
        "   <div class='modal-dialog modal-large'  style='width:80%'>" +
        "       <div class='modal-content modal-content-modal'>" +
        "           <div class='modal-header'>" +
        "               <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
        "                   <span aria-hidden='true'>&times;</span>" +
        "               </button>" +
        "               <h4 class='modal-title'>子类导航修改</h4>" +
        "           </div>" +
        "           <div class='modal-body' >" +
        navigationInfo +
        "           </div>" +
        "           <div class='modal-footer'>" +
        "               <button type='button' class='btn btn-primary float-button-light' onclick='updateNavigationParent(\"" + navigationParent.id + "\")'>修改</button>" +
        "               <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>" +
        "           </div>" +
        "        </div>" +
        "    </div>" +
        "</div>";
    $("#navigationModalPlace").html(html);
    if (value != null) {
        $("#navigationTypeSelect").val(value);
    }

    $("#navigationModal").modal(modelOption());
}

function updateNavigationType(navigationTypeId) {
    swal({
        html: "<i  class='fa fa-spin fa-spinner'></i>格式校验中，请稍等...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });
    var navigationType = navigationTypeList.filter(function (e) {
        return e.id === navigationTypeId;
    });
    if (navigationType.length > 0) {
        navigationType = navigationType[0];
        checkFormat($("#navigationTypeName"));
        var validataInfo =  $("[name='validataInfo']");
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
                        navigationType.navigationName = $("#navigationTypeName").val();
                        navigationType.navigationTypeState = $("#navigationTypeState").prop("checked");
                        $.ajax({
                            async: true,
                            url: "/guteam/admin/navigation/update/save/navigationType",
                            type: "POST",
                            data: {"navigationType": JSON.stringify(navigationType)},
                            dataType: "json",
                            beforeSend: function () {
                                swal({
                                    html: "<i  class='fa fa-spin fa-spinner'></i>正在保存导航数据，请稍等...",
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    showConfirmButton: false,
                                });
                            },
                            success: function (back) {
                                if (back.sign === true) {
                                    swal({
                                        title: "成功",
                                        text: "更新数据成功",
                                        type: 'success',
                                        confirmButtonColor: '#3085d6',
                                        confirmButtonText: '确定',
                                    }).then(function () {
                                        window.location.reload();
                                    }).catch(swal.noop);
                                } else {
                                    swal({
                                        title: "错误",
                                        text: "更新数据失败",
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
    }
}

function updateNavigationParent(navigationParentId) {
    swal({
        html: "<i  class='fa fa-spin fa-spinner'></i>格式校验中，请稍等...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });
    var navigationParent, navigationType;
    for (var i = 0, len = navigationTypeList.length; i < len; i++) {
        navigationParent = navigationTypeList[i].navigationParentList.filter(function (e) {
            return e.id === navigationParentId;
        });
        if (navigationParent.length > 0) {
            navigationType = navigationTypeList[i];
            navigationParent = navigationParent[0];
            break;
        }
    }

    if (navigationType != null) {
        var validataInfo;
        if (navigationType.navigationAlgorithm === true) {
            checkFormat($("#navigationParentName"));
            checkFormat($("#navigationUrl"));

            validataInfo = $("[name='validataInfo']");
            if (validataInfo.length > 0) {
                swal.close();
                validataInfo[0].focus();
            } else {
                navigationParent.navigationName = $("#navigationParentName").val();
                navigationParent.navigationIcon = $("#navigationIcon").attr("class");
                navigationParent.navigationUrl = "algorithm/" + $("#navigationUrl").val();
                navigationParent.navigationTypeId = $("#navigationTypeSelect").val();
                navigationParent.activate = $("#navigationParentState").prop("checked");
            }

        } else {
            checkFormat($("#navigationParentName"));
            validataInfo =  $("[name='validataInfo']");
            if (validataInfo.length > 0) {
                validataInfo[0].focus();
            } else {
                navigationParent.navigationName = $("#navigationParentName").val();
                navigationParent.activate = $("#navigationParentState").prop("checked");
                navigationParent.navigationIcon = $("#navigationIcon").attr("class");
            }
        }
        var interval_3 = setInterval(function () {
            if (navigationParentNameSign === 0 && navigationUrlSign === 0) {
                validataInfo = $("[name='validataInfo']");
                swal.close();
                if (validataInfo.length > 0) {
                    validataInfo[0].focus();
                } else {
                    validataInfo = $("[name='validataInfo']");
                    if (validataInfo.length > 0) {
                        validataInfo[0].focus();
                    } else {
                        $.ajax({
                            async: true,
                            url: "/guteam/admin/navigation/update/save/navigationParent",
                            type: "POST",
                            data: {"navigationParent": JSON.stringify(navigationParent)},
                            dataType: "json",
                            beforeSend: function () {
                                swal({
                                    html: "<i  class='fa fa-spin fa-spinner'></i>正在保存导航数据，请稍等...",
                                    allowOutsideClick: false,
                                    allowEscapeKey: false,
                                    showConfirmButton: false,
                                });
                            },
                            success: function (back) {
                                if (back.sign === true) {
                                    swal({
                                        title: "成功",
                                        text: "更新数据成功",
                                        type: 'success',
                                        confirmButtonColor: '#3085d6',
                                        confirmButtonText: '确定',
                                    }).then(function () {
                                        window.location.reload();
                                    }).catch(swal.noop);
                                } else {
                                    swal({
                                        title: "错误",
                                        text: "更新数据失败",
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
                clearInterval(interval_3);
            }
        });


    }

}

function iconsChangeModal() {
    $("#iconsModal").modal(modelOption());
}

function chooseIcons() {
    $("#navigationIcon").attr("class", $('input:radio[name=icons]:checked').next().attr("class"));
}

function navigationTypeSelectAlgorithm() {
    var html =
        "<div class='form-group'>" +
        "<select class='form-control select-control' id='navigationTypeSelect' >";
    var navigationTypeList_temp = navigationTypeList.filter(function (e) {
        return e.navigationAlgorithm == true;
    })
    for (var j = 0, len = navigationTypeList_temp.length; j < len; j++) {
        html += "<option value='" + navigationTypeList_temp[j].id + "'>" + navigationTypeList_temp[j].navigationName + "</option>";
    }
    html += "</select></div>";
    return html;
}

function navigationTabHelper() {
    var html = "";
    html += "<ul class='list-group'><div class='form-radio'>";

    html += "<li class='list-group-item'><div class='radio-button'>" +
        "<label><input type='radio' checked='checked' name='navigationLeftHelper' onchange='navigationChooseType(\"type\",\"type\")'>" +
        "<i class='helper'></i>查看父类导航</label>" +
        "</div></li>";


    html += "<li class='list-group-item active'>查看子类导航</li>";
    for (var i = 0, len = navigationTypeList.length; i < len; i++) {
        html += "<li class='list-group-item'>" +
            "<div class='radio-button'>" +
            "<label>" +
            "<input type='radio' name='navigationLeftHelper' onchange='navigationChooseType(\"" + navigationTypeList[i].id + "\",\"parent\")'>" +
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


function checkNavigationUrlExist(navigationId, navigationUrl) {
    $.ajax({
        async: true,
        url: "/guteam/admin/navigation/update/checkNavigationUrl",
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
        url: "/guteam/admin/navigation/update/checkNavigationParentName",
        type: "POST",
        data: {
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
        url: "/guteam/admin/navigation/update/checkNavigationTypeName",
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
                    checkNavigationParentNameExist(navigationParentId, $(obj).val());
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
                    checkNavigationTypeNameExist(navigationTypeId, $(obj).val());
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
                    checkNavigationUrlExist(navigationParentId, $(obj).val());
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
