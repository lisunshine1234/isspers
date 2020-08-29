var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");
$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});

var ScreenWidth = parseInt(window.screen.width * 0.8);
var ScreenHeight = parseInt(window.screen.height * 0.7);
var navigationTypeList = [], setList = [];
var setIdBak, urlBak = "/";
<!-- start -->
$(document).ready(function () {
    if ($("#set_page").length > 0) {
        getSetList();
        setModal();
        $('#path').on('keypress', function (event) {
            //13 代表的是回车健 
            if (event.keyCode == 13) {
                getFileList();
            }
        });
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


function getSetList() {
    $.ajax({
        async: true,
        url: "/guteam/admin/set/view/getSetList",
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在获取数据集数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            });
        },
        success: function (back) {
            setList = back;
            $("#set_page").html(setFrame(setTabHelper()));
            $('#table_place').DataTable(tableOptionHelper(setListFormat(setList)));
            swal.close();
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function setListFormat(setList) {
    var list = [];
    for (var i = 0, len = setList.length; i < len; i++) {
        var state;
        if (!setList[i]["nonLock"]) {
            state = " <a style='color: red;'>锁定</a>";
        } else if (!setList[i]["activate"]) {
            state = " <a style='color: grey;'>未激活</a>";
        } else {
            state = " <a style='color: green;'>可用</a>";
        }
        list.push(["<strong>" + (i + 1) + "</strong>",
            "<a href='javascript:void(0);' style='color: #0b93d5' onclick='getSetInfoById(\"" + setList[i]["id"] + "\")'>" + setList[i].projectName + "</a>",
            setList[i].createTime,
            setList[i].updateTime,
            setList[i].userName,
            state
        ]);
    }
    return list;
}

function setFrame(navigationHtml) {
    var frame =
        "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-3'>" +
        navigationHtml +
        "</div>" +
        "<div class='col-lg-9 col-md-9 col-sm-9 col-xs-9'>" +
        "<table class='display set-table' id='table_place'>" +
        "<thead><tr>" +
        "<th scope='row'>#</th>" +
        "<th scope='row'>数据集名</th>" +
        "<th scope='row'>创建时间</th>" +
        "<th scope='row'>更新时间</th>" +
        "<th scope='row'>拥有者</th>" +
        "<th scope='row'>状态</th>" +
        "</tr></thead></table>" +
        "</div>";
    return frame;
}


function setTabHelper() {
    var html = "";
    html += "<ul class='list-group'><div class='form-radio'>";
    html += "<li class='list-group-item'><div class='radio-button'>" +
        "<label><input type='radio' checked='checked' name='radio' onchange='setChooseType(\"all\",\"all\")'>" +
        "<i class='helper'></i>查看所有类别(" + setList.length + ")</label>" +
        "</div></li>";

    html += "<li class='list-group-item active'>数据集状态</li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='setChooseType(true,\"normal\")'>" +
        "<i class='helper'></i>正常" + "(" + setList.filter(function (e) {
            return e.nonLock == true && e.activate == true;
        }).length + ")</label></div></li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='setChooseType(true,\"activate\")'>" +
        "<i class='helper'></i>锁定" + "(" + setList.filter(function (e) {
            return e.nonLock == false;
        }).length + ")</label></div></li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='setChooseType(false,\"nonLock\")'>" +
        "<i class='helper'></i>未激活" + "(" + setList.filter(function (e) {
            return e.activate == false;
        }).length + ")</label></div></li>";
    html += "</div></ul>";
    return html;
}

function getSetInfoById(setId) {
    setIdBak = setId;
    $.ajax({
        async: true,
        url: "/guteam/admin/set/view/getInfo",
        type: "POST",
        data: {"setId": setId},
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在获取数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            })
        },
        success: function (back) {
            var setFileList = back["setFileList"];
            urlBak = back["url"];
            setTableDestroy($('#fileList'));
            $('#fileList').DataTable(fileListDataTableOption(createFileList(setFileList), urlBak));

            $("#path").val(urlBak);

            $("#setModal").modal(modelOption());
            var interval = setInterval(function () {
                if ($("#setModal").css('display') == 'block') {
                    $.fn.dataTable.tables({visible: false, api: true}).columns.adjust();
                    clearInterval(interval);
                }
            }, 10);
            swal.close();


        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    })

}

function modelOption() {
    var model = {
        backdrop: false,
        keyboard: false,
    }
    return model;
}


function setModal() {
    var html =
        "<div class='modal fade ' id='setModal' >" +
        "   <div class='modal-dialog modal-large'  style='width:" + ScreenWidth + "px;height:" + ScreenHeight + "px;'>" +
        "       <div class='modal-content modal-content-modal'>" +
        "           <div class='modal-header'>" +
        "               <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
        "                   <span aria-hidden='true'>&times;</span>" +
        "               </button>" +
        "               <h4 class='modal-title'>数据集</h4>" +
        "           </div>" +
        "           <div class='modal-body' >" +
        "       <div class='form-group col-lg-12 col-md-12 col-sm-12 col-xs-12' >" +
        "           <div class='input-group'>" +
        "               <input type='text' class='form-control' id='path'>" +
        "               <span class='input-group-btn'><button class='btn btn-default' type='button' onclick='getFileList()'><i class='fa fa-mail-forward'></i></button></span>" +
        "           </div>" +
        "       </div>" +
        "       <div class='form-group col-lg-12 col-md-12 col-sm-12 col-xs-12'>" +
        "           <table id='fileList' class='display'><thead><tr><th></th></tr></thead></table>" +
        "       </div>" +
        "           </div>" +
        "           <div class='modal-footer'>" +
        "               <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>" +
        "           </div>" +
        "        </div>" +
        "    </div>" +
        "</div>";
    $("#setModalPlace").html(html);
}


function createFileList(fileList) {
    var html = new Array();
    for (var i = 0, len = fileList.length; i < len; i++) {
        html[i] = new Array(6);
        html[i][0] = "<input type='checkbox' name='file' path='" + fileList[i]["filePath"] + "' file='" + fileList[i]["fileName"] + "'>";
        if (fileList[i]["fileType"] == "1") {
            html[i][1] = "<i class='fa fa-file-text-o'></i>";
        } else if (fileList[i]["fileType"] == "0") {
            html[i][1] = "<a href='javacript:void(0);' onclick='fileGo(\"" + fileList[i]["fileName"] + "\")'><i class='fa fa-folder'></i>";
        }
        html[i][1] += " " + fileList[i]["fileName"] + "</a>";
        html[i][2] = fileList[i]["fileSize"];
        html[i][3] = fileList[i]["fileFormat"];
        html[i][4] = fileList[i]["fileUpdateTime"];
        html[i][5] = "<a href='javacript:void(0);' onclick='changeFileName(\"" + fileList[i]["filePath"] + "\",\"" + fileList[i]["fileName"] + "\")' ><i class='fa fa-pencil-square'></i></a>  ";
    }
    return html;
}

function fileGo(url) {
    $("#path").val(urlBak + "/" + url);
    getFileList();
}

function setChooseType(key, type) {
    var temp;
    if (type == "all") {
        temp = setList;
    } else if (type == "nonLock") {
        temp = setList.filter(function (e) {
            return e.nonLock == false;
        });
    } else if (type == "activate") {
        temp = setList.filter(function (e) {
            return e.activate == false;
        });
    } else if (type == "normal") {
        temp = setList.filter(function (e) {
            return e.nonLock == true && e.activate == true;
        });
    }

    $('#table_place').DataTable(tableOptionHelper(setListFormat(temp)));
}


function getFileList() {
    $.ajax({
        async: true,
        url: "/guteam/admin/set/view/getInfo",
        type: "POST",
        data: {"setId": setIdBak, "url": $("#path").val()},
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在获取数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            })
        },
        success: function (back) {
            if (back.sign == true) {
                var setFileList = back["setFileList"];
                urlBak = back["url"];
                setTableDestroy($('#fileList'));
                $('#fileList').DataTable(fileListDataTableOption(createFileList(setFileList), urlBak));

                $("#path").val(urlBak);

                $("#setModal").modal(modelOption());
                var interval = setInterval(function () {
                    if ($("#setModal").css('display') == 'block') {
                        $.fn.dataTable.tables({visible: false, api: true}).columns.adjust();
                        clearInterval(interval);
                    }
                }, 10);
                swal.close();

            } else {
                swal({
                    title: "错误",
                    text: "目录不存在",
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

function fileBack() {
    var url_split = urlBak.split("/");
    var len = url_split.length;
    if (len > 2) {
        urlBak = urlBak.substring(0, urlBak.length - url_split[len - 2].toString().length-1)
        $("#path").val(urlBak);
        getFileList();
    } else {
        getFileList();
    }
}

function fileListDataTableOption(data, url) {
    var column = "<thead><tr><th></th><th>文件名称</th><th>文件大小</th><th>格式</th><th>上传时间</th><th>操作</th></tr><tr><th></th><th colspan='5'>";

    if (url == "/") {
        column += "<a style='color: #C0C0C0'>"
    } else {
        column += "<a href='javacript:void(0);' onclick='fileBack()'>"
    }
    column += "<i class='fa fa-mail-reply'></i>返回上一级</a></th></tr></thead>";
    document.getElementById("fileList").innerHTML = column;
    var option = {
        "data": data,
        "destroy": true,
        "scrollY": "1000px",
        "paging": false,
        "orderCellsTop": true,
        "order": [[1, 'asc']],  //desc
        "aoColumns": [
            {bSearchable: false, bSortable: false},
            {},
            {},
            {},
            {},
            {bSearchable: false, bSortable: false},
        ],
        "language": {//代替表下方的英文页码说明
            "sProcessing": "处理中...",
            "sLengthMenu": "每页 _MENU_ 项",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "总计 _TOTAL_ 个文件。",
            "sInfoEmpty": "当前显示第 0 至 0 项，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "sUrl": "",
            "sEmptyTable": "无文件",
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
    };
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

function setTableDestroy(obj) {
    var table = obj;
    var int_table = obj.DataTable();
    int_table.clear();
    int_table.destroy();
    table.empty();
}
