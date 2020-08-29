var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");
$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});

var userTypeNameSign = 0, userTypeParentNameSign = 0;
$(document).ready(function () {
    if ($("#permission_page").length > 0) {
        getAllUserTypeParentList();
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


function getAllUserTypeParentList() {
    $.ajax({
        async: true,
        url: "/guteam/admin/role-permission/role/getPermissionRoleType",
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在获取角色权限数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false
            })
        },
        success: function (back) {
            if ($('#table_place').length != 0) {
                permissionTableDestroy($('#table_place'));
                $("#table_place").html(userTypeParentTableHead());
            } else {
                $("#permission_page").html(userTypeParentFrame(userTypeParentTabHelper(back.userTypeParentList)));
            }
            $('#table_place').DataTable(tableOptionHelper(userTypeParentListFormat(back.userTypeParentList)));
            swal.close();
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function getAllUserTypeListByParentId(userTypeParentId) {
    $.ajax({
        async: true,
        url: "/guteam/admin/role-permission/role/getPermissionRole",
        type: "POST",
        data: {"userTypeParentId": userTypeParentId},
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在获取角色权限数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false
            })
        },
        success: function (back) {
            if ($('#table_place').length != 0) {
                permissionTableDestroy($('#table_place'));
            }
            $("#table_place").html(userTypeTableHead());
            $('#table_place').DataTable(tableOptionHelper(userTypeListFormat(back.userTypeList)));
            swal.close();
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function userTypeParentFrame(userTypeHtml) {
    var frame =
        "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-3'>" +
        userTypeHtml +
        "</div>" +
        "<div class='col-lg-9 col-md-9 col-sm-9 col-xs-9'>" +
        "<button type='button' style='margin-right: 20px' class='btn btn-primary float-button-light' onclick='insertUserTypeParentModal()'>添加新的角色类型</button>" +
        "<button type='button' style='margin-right: 20px' class='btn btn-primary float-button-light' onclick='insertUserTypeModal()'>添加新的角色</button>" +
        "<table class='display permission-table' id='table_place'>" +
        userTypeParentTableHead() +
        "</table>" +
        "</div>";
    return frame;
}


function userTypeParentTableHead() {
    return "<thead><tr>" +
        "<th scope='row'>序号</th>" +
        "<th scope='row'>角色类型名称</th>" +
        "<th scope='row'>更新操作</th>" +
        "<th scope='row'>删除操作</th>" +
        "</tr></thead>";
}

function userTypeTableHead() {
    return "<thead><tr>" +
        "<th scope='row'>序号</th>" +
        "<th scope='row'>角色名称</th>" +
        "<th scope='row'>权限操作</th>" +
        "<th scope='row'>更新操作</th>" +
        "<th scope='row'>删除操作</th>" +
        "</tr></thead>";
}

function userTypeParentTabHelper(userTypeParentList) {
    var html = "";
    html += "<ul class='list-group'><div class='form-radio'>";

    html += "<li class='list-group-item'><div class='radio-button'>" +
        "<label><input type='radio' checked='checked' name='radio' onchange='userTypeAllChoose()'>" +
        "<i class='helper'></i>查看所有角色类型</label>" +
        "</div></li>";

    html += "<li class='list-group-item active'>角色类型</li>";
    for (var i = 0, len = userTypeParentList.length; i < len; i++) {
        html += "<li class='list-group-item'>" +
            "<div class='radio-button'>" +
            "<label>" +
            "<input type='radio' name='radio' onchange='userTypeParentChoose(\"" + userTypeParentList[i].id + "\")'>" +
            "<i class='helper'></i>" + userTypeParentList[i].userTypeParentName + "</label></div></li>";

    }
    html += "</div></ul>";
    return html;
}

function userTypeParentListFormat(userTypeParentList) {
    var list = [];
    for (var i = 0, len = userTypeParentList.length; i < len; i++) {
        list.push(["<strong>" + (i + 1) + "</strong>",
            userTypeParentList[i].userTypeParentName,
            "<button type='button' class='btn btn-primary float-button-light' onclick='updateUserTypeParentModal(\"" + userTypeParentList[i].id + "\")'>更改</button>",
            "<button type='button' class='btn btn-danger float-button-light' onclick='userTypeParentDelete(\"" + userTypeParentList[i].id + "\")'>删除</button>"]);
    }

    return list;
}


function userTypeListFormat(userTypePermissionList) {
    var list = [];
    for (var i = 0, len = userTypePermissionList.length; i < len; i++) {
        list.push(["<strong>" + (i + 1) + "</strong>",
            userTypePermissionList[i].userTypeName,
            "<button type='button' class='btn btn-primary float-button-light'  onclick='userTypePermissionUpdate(\"" + userTypePermissionList[i].id + "\")'>更改</button>",
            "<button type='button' class='btn btn-primary float-button-light'  onclick='updateUserTypeModal(\"" + userTypePermissionList[i].id + "\")'>更改</button>",
            "<button type='button' class='btn btn-danger float-button-light'  onclick='userTypeDelete(\"" + userTypePermissionList[i].id + "\")'>删除</button>"]);
    }

    return list;
}

function userTypeAllChoose() {
    getAllUserTypeParentList();
}

function userTypeParentChoose(userTypeParentId) {
    getAllUserTypeListByParentId(userTypeParentId);
}

function userTypePermissionUpdate(userTypeId) {
    $.ajax({
        async: true,
        url: "/guteam/admin/role-permission/update/getRolePermissionList",
        type: "POST",
        data: {"userTypeId": userTypeId},
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在获取角色权限数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false
            })
        },
        success: function (back) {
            userTypePermissionUpdateModal(userTypeId, back.permissionList);
            swal.close();
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}


function insertUserTypeParentModal() {
    var html =
        "<div class='modal fade ' id='userTypeModal' >" +
        "   <div class='modal-dialog modal-large'  style='width:80%'>" +
        "       <div class='modal-content modal-content-modal'>" +
        "           <div class='modal-header'>" +
        "               <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
        "                   <span aria-hidden='true'>&times;</span>" +
        "               </button>" +
        "               <h4 class='modal-title'>角色类型修改</h4>" +
        "           </div>" +
        "           <div class='modal-body' >" +
        "<label>角色类型名称</label>" +
        "<div class='form-group'>" +
        "<input class='form-control'  id='userTypeParentName' type='text' onblur='checkFormat(this)'>" +
        "</div>" +
        "<label>角色类型所属类别</label>" +
        "<div class='form-group'>" +
        "<select class='form-control select-control' id='userTypeParentTypeSelect' >" +
        "<option value='ADMIN'>管理员</option>" +
        "<option value='USER'>用户</option>" +
        "</select></div>" +
        "<input type='hidden' id='userTypeParentId' value='-1'>" +
        "           </div>" +
        "           <div class='modal-footer'>" +
        "               <button type='button' class='btn btn-primary float-button-light' onclick='insertUserTypeParent()'>添加</button>" +
        "               <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>" +
        "           </div>" +
        "        </div>" +
        "    </div>" +
        "</div>";
    $("#permissionModalPlace").html(html);
    $("#userTypeModal").modal(modelOption());
}

function insertUserTypeModal() {
    $.ajax({
        async: true,
        url: "/guteam/admin/role-permission/role/getPermissionRoleType",
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在获取角色类型数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false
            })
        },
        success: function (back) {
            var select =
                "<div class='form-group'>" +
                "<select class='form-control select-control' id='userTypeParentSelect' >";
            for (var j = 0, len = back.userTypeParentList.length; j < len; j++) {
                select += "<option value='" + back.userTypeParentList[j].id + "'>" + back.userTypeParentList[j].userTypeParentName + "</option>";
            }
            select += "</select></div>";
            var html =
                "<div class='modal fade ' id='userTypeParentModal' >" +
                "   <div class='modal-dialog modal-large'  style='width:80%'>" +
                "       <div class='modal-content modal-content-modal'>" +
                "           <div class='modal-header'>" +
                "               <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
                "                   <span aria-hidden='true'>&times;</span>" +
                "               </button>" +
                "               <h4 class='modal-title'>角色权限修改</h4>" +
                "           </div>" +
                "           <div class='modal-body' >" +
                "<label>角色名称</label>" +
                "<div class='form-group'>" +
                "<input class='form-control'  id='userTypeName' type='text' onblur='checkFormat(this)'>" +
                "</div>" +
                select +
                "<input type='hidden' id='userTypeId' value='-1'>" +
                "           </div>" +
                "           <div class='modal-footer'>" +
                "               <button type='button' class='btn btn-primary float-button-light' onclick='insertUserType()'>添加</button>" +
                "               <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>" +
                "           </div>" +
                "        </div>" +
                "    </div>" +
                "</div>";
            $("#permissionModalPlace").html(html);
            $("#userTypeParentModal").modal(modelOption());
            swal.close();
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });

}


function updateUserTypeParentModal(userTypeParentId) {
    $.ajax({
        async: true,
        url: "/guteam/admin/role-permission/update/getUserTypeParentById",
        type: "POST",
        dataType: "json",
        data: {"userTypeParentId": userTypeParentId},
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在获取角色类型数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false
            })
        },
        success: function (back) {
            var html =
                "<div class='modal fade ' id='userTypeModal' >" +
                "   <div class='modal-dialog modal-large'  style='width:80%'>" +
                "       <div class='modal-content modal-content-modal'>" +
                "           <div class='modal-header'>" +
                "               <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
                "                   <span aria-hidden='true'>&times;</span>" +
                "               </button>" +
                "               <h4 class='modal-title'>角色权限修改</h4>" +
                "           </div>" +
                "           <div class='modal-body' >" +
                "<label>角色类型名称</label>" +
                "<div class='form-group'>" +
                "<input class='form-control'  id='userTypeParentName' type='text' value='" + back.userTypeParent.userTypeParentName + "' onblur='checkFormat(this)'>" +
                "</div>" +
                "<label>角色类型所属类别</label>" +
                "<div class='form-group'>" +
                "<select class='form-control select-control' id='userTypeParentTypeSelect' >" +
                "<option value='ADMIN'>管理员</option>" +
                "<option value='USER'>用户</option>" +
                "</select></div>" +
                "<input type='hidden' id='userTypeParentId' value='" + back.userTypeParent.id + "'>" +
                "           </div>" +
                "           <div class='modal-footer'>" +
                "               <button type='button' class='btn btn-primary float-button-light' onclick='updateUserTypeParent()'>添加</button>" +
                "               <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>" +
                "           </div>" +
                "        </div>" +
                "    </div>" +
                "</div>";
            $("#permissionModalPlace").html(html);
            $("#userTypeParentTypeSelect").val(back.userTypeParent.userType)
            swal.close();
            $("#userTypeModal").modal(modelOption());
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function updateUserTypeModal(userTypeId) {
    $.ajax({
        async: true,
        url: "/guteam/admin/role-permission/update/getUserTypeById",
        type: "POST",
        dataType: "json",
        data: {"userTypeId": userTypeId},
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在获取角色类型数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false
            })
        },
        success: function (back) {
            var select =
                "<label>角色类型</label>" +
                "<div class='form-group'>" +
                "<select class='form-control select-control' id='userTypeParentSelect' >";
            for (var j = 0, len = back.userTypeParentList.length; j < len; j++) {
                select += "<option value='" + back.userTypeParentList[j].id + "'>" + back.userTypeParentList[j].userTypeParentName + "</option>";
            }
            select += "</select></div>";
            var html =
                "<div class='modal fade ' id='userTypeParentModal' >" +
                "   <div class='modal-dialog modal-large'  style='width:80%'>" +
                "       <div class='modal-content modal-content-modal'>" +
                "           <div class='modal-header'>" +
                "               <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
                "                   <span aria-hidden='true'>&times;</span>" +
                "               </button>" +
                "               <h4 class='modal-title'>角色权限修改</h4>" +
                "           </div>" +
                "           <div class='modal-body' >" +
                "<label>角色名称</label>" +
                "<div class='form-group'>" +
                "<input class='form-control'  id='userTypeName' type='text' value='" + back.userType.userTypeName + "' onblur='checkFormat(this)'>" +
                "</div>" +
                select +
                "<input type='hidden' id='userTypeId' value='" + back.userType.id + "'>" +
                "           </div>" +
                "           <div class='modal-footer'>" +
                "               <button type='button' class='btn btn-primary float-button-light' onclick='updateUserType()'>添加</button>" +
                "               <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>" +
                "           </div>" +
                "        </div>" +
                "    </div>" +
                "</div>";
            $("#permissionModalPlace").html(html);
            $("#userTypeParentSelect").val(back.userType.userTypeParentId)
            swal.close();
            $("#userTypeParentModal").modal(modelOption());
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });

}


function insertUserTypeParent() {
    swal({
        html: "<i  class='fa fa-spin fa-spinner'></i>格式校验中，请稍等...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });
    checkFormat($("#userTypeParentName"));

    var validataInfo = $("[name='validataInfo']");
    if (validataInfo.length > 0) {
        swal.close();
        validataInfo[0].focus();
    } else {
        var interval_3 = setInterval(function () {
            if (userTypeParentNameSign === 0) {
                validataInfo = $("[name='validataInfo']");
                swal.close();
                if (validataInfo.length > 0) {
                    validataInfo[0].focus();
                } else {
                    $.ajax({
                        async: true,
                        url: "/guteam/admin/role-permission/insert/userTypeParent",
                        type: "POST",
                        data: {
                            "userTypeParentName": $("#userTypeParentName").val(),
                            "userTypeParentType": $("#userTypeParentTypeSelect").val()
                        },
                        dataType: "json",
                        beforeSend: function () {
                            swal({
                                html: "<i  class='fa fa-spin fa-spinner'></i>正在插入角色类型数据，请稍等...",
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                showConfirmButton: false
                            });
                        },
                        success: function (back) {
                            if (back.sign === true) {
                                swal({
                                    title: "成功",
                                    text: "插入角色类型数据成功",
                                    type: 'success',
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: '确定',
                                }).then(function () {
                                    window.location.reload();
                                }).catch(swal.noop);
                            } else {
                                swal({
                                    title: "错误",
                                    text: "插入角色类型数据失败",
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


function insertUserType() {
    swal({
        html: "<i  class='fa fa-spin fa-spinner'></i>格式校验中，请稍等...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });
    checkFormat($("#userTypeName"));

    var validataInfo = $("[name='validataInfo']");
    if (validataInfo.length > 0) {
        swal.close();
        validataInfo[0].focus();
    } else {
        var interval_3 = setInterval(function () {
            if (userTypeNameSign === 0) {
                validataInfo = $("[name='validataInfo']");
                swal.close();
                if (validataInfo.length > 0) {
                    validataInfo[0].focus();
                } else {
                    $.ajax({
                        async: true,
                        url: "/guteam/admin/role-permission/insert/userType",
                        type: "POST",
                        data: {
                            "userTypeName": $("#userTypeName").val(),
                            "userTypeParentId": $("#userTypeParentSelect").val()
                        },
                        dataType: "json",
                        beforeSend: function () {
                            swal({
                                html: "<i  class='fa fa-spin fa-spinner'></i>正在插入角色数据，请稍等...",
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                showConfirmButton: false
                            });
                        },
                        success: function (back) {
                            if (back.sign === true) {
                                swal({
                                    title: "成功",
                                    text: "插入角色数据成功",
                                    type: 'success',
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: '确定',
                                }).then(function () {
                                    window.location.reload();
                                }).catch(swal.noop);
                            } else {
                                swal({
                                    title: "错误",
                                    text: "插入角色数据失败",
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


function updateUserTypeParent() {
    swal({
        html: "<i  class='fa fa-spin fa-spinner'></i>格式校验中，请稍等...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });
    checkFormat($("#userTypeParentName"));

    var validataInfo = $("[name='validataInfo']");
    if (validataInfo.length > 0) {
        swal.close();
        validataInfo[0].focus();
    } else {
        var interval_3 = setInterval(function () {
            if (userTypeParentNameSign === 0) {
                validataInfo = $("[name='validataInfo']");
                swal.close();
                if (validataInfo.length > 0) {
                    validataInfo[0].focus();
                } else {
                    $.ajax({
                        async: true,
                        url: "/guteam/admin/role-permission/update/userTypeParent",
                        type: "POST",
                        data: {
                            "userTypeParentId": $("#userTypeParentId").val(),
                            "userTypeParentName": $("#userTypeParentName").val(),
                            "userTypeParentType": $("#userTypeParentTypeSelect").val()
                        },
                        dataType: "json",
                        beforeSend: function () {
                            swal({
                                html: "<i  class='fa fa-spin fa-spinner'></i>正在更新角色类型数据，请稍等...",
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                showConfirmButton: false
                            });
                        },
                        success: function (back) {
                            if (back.sign === true) {
                                swal({
                                    title: "成功",
                                    text: "更新角色类型数据成功",
                                    type: 'success',
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: '确定',
                                }).then(function () {
                                    window.location.reload();
                                }).catch(swal.noop);
                            } else {
                                swal({
                                    title: "错误",
                                    text: "更新角色类型数据失败",
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


function updateUserType() {
    swal({
        html: "<i  class='fa fa-spin fa-spinner'></i>格式校验中，请稍等...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });
    checkFormat($("#userTypeName"));

    var validataInfo = $("[name='validataInfo']");
    if (validataInfo.length > 0) {
        swal.close();
        validataInfo[0].focus();
    } else {
        var interval_3 = setInterval(function () {
            if (userTypeNameSign === 0) {
                validataInfo = $("[name='validataInfo']");
                swal.close();
                if (validataInfo.length > 0) {
                    validataInfo[0].focus();
                } else {
                    $.ajax({
                        async: true,
                        url: "/guteam/admin/role-permission/update/userType",
                        type: "POST",
                        data: {
                            "userTypeId": $("#userTypeId").val(),
                            "userTypeName": $("#userTypeName").val(),
                            "userTypeParentId": $("#userTypeParentSelect").val()
                        },
                        dataType: "json",
                        beforeSend: function () {
                            swal({
                                html: "<i  class='fa fa-spin fa-spinner'></i>正在更新角色数据，请稍等...",
                                allowOutsideClick: false,
                                allowEscapeKey: false,
                                showConfirmButton: false
                            });
                        },
                        success: function (back) {
                            if (back.sign === true) {
                                swal({
                                    title: "成功",
                                    text: "更新角色数据成功",
                                    type: 'success',
                                    confirmButtonColor: '#3085d6',
                                    confirmButtonText: '确定',
                                }).then(function () {
                                    window.location.reload();
                                }).catch(swal.noop);
                            } else {
                                swal({
                                    title: "错误",
                                    text: "更新角色数据失败",
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


function userTypePermissionUpdateModal(userTypeId, permissionList) {
    var permissionListInfo =
        "<thead><tr>" +
        "<th scope='row'>序号</th>" +
        "<th scope='row'>权限名称</th>" +
        "<th scope='row'>权限赋予</th>" +
        "</tr></thead>";

    var list = [];
    for (var i = 0, len = permissionList.length; i < len; i++) {
        if (permissionList[i].checked === true) {
            list.push([i + 1,
                permissionList[i].permissionName,
                "<div class='checkbox'><label><input type='checkbox' checked='checked' permissionId='" + permissionList[i].id + "' name='permission'><i class='helper'></i></label></div>"]);
        } else {
            list.push([i + 1,
                permissionList[i].permissionName,
                "<div class='checkbox'><label><input type='checkbox' permissionId='" + permissionList[i].id + "' name='permission'><i class='helper'></i></label></div>"]);
        }
    }

    var html =
        "<div class='modal fade ' id='permissionModal' >" +
        "   <div class='modal-dialog modal-large'  style='width:80%'>" +
        "       <div class='modal-content modal-content-modal'>" +
        "           <div class='modal-header'>" +
        "               <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
        "                   <span aria-hidden='true'>&times;</span>" +
        "               </button>" +
        "               <h4 class='modal-title'>角色权限修改</h4>" +
        "           </div>" +
        "           <div class='modal-body' >" +
        "<table class='display permission-table' id='permission_table_place'>" +
        "<thead><tr><th></th></tr></thead></table>" +
        "           </div>" +
        "<input type='hidden' id='userTypeId' value='" + userTypeId + "'>" +
        "           <div class='modal-footer'>" +
        "               <button type='button' class='btn btn-primary float-button-light' onclick='updateUserTypePermission()'>修改</button>" +
        "               <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>" +
        "           </div>" +
        "        </div>" +
        "    </div>" +
        "</div>";
    $("#permissionModalPlace").html(html);
    permissionTableDestroy($('#permission_table_place'));
    $('#permission_table_place').html(permissionListInfo);
    $('#permission_table_place').DataTable(permissionTableOptionHelper(list));
    $("#permissionModal").modal(modelOption());

    var interval = setInterval(function () {
        if ($("#permissionModal").css('display') == 'block') {
            $.fn.dataTable.tables({visible: false, api: true}).columns.adjust();
            clearInterval(interval);
        }
    }, 10);

}

function updateUserTypePermission() {
    var permission = $("[name=permission]");
    var permissionList=[];
    for(var i=0,len=permission.length;i<len;i++){
        if($(permission[i]).prop("checked") === true){
            permissionList.push($(permission[i]).attr("permissionid"))
        }
    }
    console.log({
        "userTypeId": $("#userTypeId"),
        "permissionList": permissionList
    })
    $.ajax({
        async: true,
        url: "/guteam/admin/role-permission/update/updateRolePermissionList",
        type: "POST",
        data: {"json":JSON.stringify({
                "userTypeId": $("#userTypeId").val(),
                "permissionList": permissionList
            })},
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在更新角色权限数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false
            });
        },
        success: function (back) {
            if (back.sign === true) {
            swal({
                title: "成功",
                text: "更新角色权限数据成功",
                type: 'success',
                confirmButtonColor: '#3085d6',
                confirmButtonText: '确定',
            }).then(function () {
                window.location.reload();
            }).catch(swal.noop);
        } else {
            swal({
                title: "错误",
                text: "更新角色权限数据失败",
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
    console.log(permissionList)

}

function checkUserTypeNameExist(userTypeId, userTypeName) {
    $.ajax({
        async: true,
        url: "/guteam/admin/role-permission/insert/checkUserTypeName",
        type: "POST",
        data: {
            "userTypeId": userTypeId.toString(),
            "userTypeName": userTypeName.toString()
        },
        dataType: "json",
        beforeSend: function () {
        },
        success: function (back) {
            userTypeNameSign = back.sign;
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function checkUserTypeParentNameExist(userTypeParentId, userTypeParentName) {
    console.log(userTypeParentId, userTypeParentName)
    $.ajax({
        async: true,
        url: "/guteam/admin/role-permission/insert/checkUserTypeParentName",
        type: "POST",
        data: {
            "userTypeParentId": userTypeParentId.toString(),
            "userTypeParentName": userTypeParentName.toString()
        },
        dataType: "json",
        beforeSend: function () {
        },
        success: function (back) {
            userTypeParentNameSign = back.sign;
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function checkFormat(obj) {
    obj = $(obj);
    switch (obj.attr("id")) {
        case "userTypeName":
            if (userTypeNameSign === 0) {
                userTypeNameSign = 1;
                if (myValidata(obj.val(), "chineseAndEnglishKey", 1, 10, "角色名称", obj) === true) {
                    checkUserTypeNameExist($("#userTypeId").val(), $(obj).val());
                    var interval_1 = setInterval(function () {
                        if (userTypeNameSign === true || userTypeNameSign === false) {
                            if (userTypeNameSign === true) {
                                addValidataInfo(obj, "角色名称已存在");
                            } else {
                                removeValidataInfo(obj);
                            }
                            userTypeNameSign = 0;
                            clearInterval(interval_1);

                        }
                    }, 10);
                } else {
                    userTypeNameSign = 0;
                }
            }
            break;
        case "userTypeParentName":
            if (userTypeParentNameSign === 0) {
                userTypeParentNameSign = 1;
                if (myValidata(obj.val(), "chineseAndEnglishKey", 1, 20, "角色类型名称", obj) === true) {
                    checkUserTypeParentNameExist($("#userTypeParentId").val(), $(obj).val());
                    var interval_3 = setInterval(function () {
                        if (userTypeParentNameSign === true || userTypeParentNameSign === false) {
                            if (userTypeParentNameSign === true) {
                                addValidataInfo(obj, "角色类型名称已存在");
                            } else {
                                removeValidataInfo(obj);
                            }
                            userTypeParentNameSign = 0;
                            clearInterval(interval_3);
                        }
                    }, 10);
                } else {
                    userTypeParentNameSign = 0;
                }

            }
            break;
    }


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

function userTypeDelete(userTypeId) {
    swal({
        title: "警告",
        text: "确认后将会删除该角色信息，且不可恢复",
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
            url: "/guteam/admin/role-permission/delete/userType",
            type: "POST",
            data: {"userTypeId": userTypeId},
            dataType: "json",
            beforeSend: function () {
                swal({
                    html: "<i  class='fa fa-spin fa-spinner'></i>正在删除角色数据，请稍等...",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                });
            },
            success: function (back) {
                if (back.sign === true) {
                    swal({
                        title: "成功",
                        text: "删除角色数据成功",
                        type: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '确定',
                    }).then(function () {
                        window.location.reload();
                    }).catch(swal.noop);
                } else {
                    swal({
                        title: "错误",
                        text: "删除角色数据失败",
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

function userTypeParentDelete(userTypeParentId) {
    swal({
        title: "警告",
        text: "确认后将会删除该角色类型及其类别下的角色，且不可恢复",
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
            url: "/guteam/admin/role-permission/delete/userTypeParent",
            type: "POST",
            data: {"userTypeParentId": userTypeParentId},
            dataType: "json",
            beforeSend: function () {
                swal({
                    html: "<i  class='fa fa-spin fa-spinner'></i>正在删除角色类型数据，请稍等...",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                });
            },
            success: function (back) {
                if (back.sign === true) {
                    swal({
                        title: "成功",
                        text: "删除角色类型数据成功",
                        type: 'success',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '确定',
                    }).then(function () {
                        window.location.reload();
                    }).catch(swal.noop);
                } else {
                    swal({
                        title: "错误",
                        text: "删除角色类型数据失败",
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

function modelOption() {
    var model = {
        backdrop: false,
        keyboard: false
    }
    return model;
}


function permissionTableOptionHelper(data) {
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