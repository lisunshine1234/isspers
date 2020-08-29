var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});

function ajaxError() {
    swal({
        title: "错误!",
        text: "无法连接到服务器",
        type: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '确定',
    })
}

function getDirList(url) {
    $.ajax({
        async: true,
        url: "/guteam/set/dirListByActivate",
        type: "GET",
        dataType: "JSON",
        data: {
            "url": url,
        },
        timeout: 3000,
        success: function (back) {
            var sign = back["sign"];
            if (sign == false) {
                swal({
                    title: "错误!",
                    text: back["tip"],
                    type: "error",
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '关闭'
                }).then(function () {
                    if (back["url"] != null) {
                        window.location.href = back["url"];
                    }
                });
            } else {
                $("#dirListModel").modal();
                var setDirList = back["setDirList"];
                var url = back["url"];
                tableDestroy($('#dirList'));
                $('#dirList').DataTable(dirListDataTableOption(createDirList(setDirList), url));
                var path = document.getElementById("dirListPath");
                path.value = url;
                path.setAttribute("path", url);
            }

        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });

}

function getFileList(url) {
    $.ajax({
        async: true,
        url: "/guteam/set/fileListByActivate",
        type: "GET",
        dataType: "JSON",
        data: {
            "url": url,
        },
        timeout: 3000,
        success: function (back) {
            var sign = back["sign"];
            if (sign == false) {
                swal({
                    title: "错误!",
                    text: back["tip"],
                    type: "error",
                    showCancelButton: true,
                    confirmButtonText: '确定',
                    cancelButtonText: '关闭'
                }).then(function () {
                    if (back["url"] != null) {
                        window.location.href = back["url"];
                    }
                });
            } else {
                $("#fileListModel").modal();
                var setFileList = back["setFileList"];
                var url = back["url"];
                tableDestroy($('#fileList'));
                $('#fileList').DataTable(fileListDataTableOption(createFileList(setFileList), url));
                var path = document.getElementById("fileListPath");
                path.value = url;
                path.setAttribute("path", url);
                setTimeout(function () {
                    $.fn.dataTable.tables({visible: false, api: true}).columns.adjust();
                }, 200);
            }

        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });

}

function dirList(obj) {
    document.getElementById("fileManage").innerHTML = dirListModel(obj.getAttribute("goal"));
    getDirList("/");
}

function fileList(obj) {
    document.getElementById("fileManage").innerHTML = fileListModel(obj.getAttribute("goal"));
    getFileList("/");
}

function dirEven() {
    if (event.keyCode == 13) {
        dirGo();
    }
}

function fileEven() {
    if (event.keyCode == 13) {
        fileGo();
    }
}

function dirGo() {
    getDirList(document.getElementById("dirListPath").value);
}

function fileGo() {
    getFileList(document.getElementById("fileListPath").value);
}

function dirSkip(url) {
    getDirList(url);
}

function fileSkip(url) {
    getFileList(url);
}

function dirBack(url) {
    var url_split = url.split("/");
    var url_new = "";
    var len = url_split.length;
    if (len > 2) {
        for (var i = 0; i < len - 2; i++) {
            url_new += url_split[i] + "/";
        }
        getDirList(url_new);
    } else {
        getDirList("/");
    }
}

function fileBack(url) {
    var url_split = url.split("/");
    var url_new = "";
    var len = url_split.length;
    if (len > 2) {
        for (var i = 0; i < len - 2; i++) {
            url_new += url_split[i] + "/";
        }
        getFileList(url_new);
    } else {
        getFileList("/");
    }
}

function chooseDir(filePath) {
    var path = document.getElementById("dirListPath").getAttribute("path");
    $("#dirListModel").modal('hide');
    document.getElementById(filePath).value = path;
}

function chooseFile(filePath) {
    var name = document.getElementsByName("file");
    var fileName = "";
    for (var i = 0, len = name.length; i < len; i++) {
        if (name[i].checked) {
            fileName = name[i].getAttribute("path") + name[i].getAttribute("file");
            break;
        }
    }
    if (fileName == "") {
        swal({
            title: "错误!",
            text: "未选择文件",
            type: "error",
            confirmButtonText: '确定',
        })
    } else {
        $("#fileListModel").modal('hide');
        var matPlace = document.getElementById("matPlace_" + filePath);

        if (matPlace != null) {
            inputMatHelper(fileName, filePath);
        }
        document.getElementById(filePath).value = fileName;
    }

}

function dirListModel(filePath) {
    var html = "" +
        "<div class='modal fade' id='dirListModel'>" +
        "    <div class='modal-dialog modal-large'  style='width:80%'>" +
        "        <div class='modal-content modal-content-modal'>" +
        "            <div class='modal-header'>" +
        "                <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
        "                    <span aria-hidden='true'>&times;</span>" +
        "                </button>" +
        "                <h4 class='modal-title'>选择目录</h4>" +
        "            </div>" +
        "            <div class='modal-body'>" +
        "               <div class='form-group col-lg-12 col-md-12 col-sm-12 col-xs-12'>" +
        "                   <div class='input-group'>" +
        "                       <input type='text' class='form-control' id='dirListPath' path='/' onkeypress='dirEven()'>" +
        "                       <span class='input-group-btn'><button class='btn btn-default' type='button' onclick='dirGo()'><i class='fa fa-mail-forward'></i></button></span>" +
        "                   </div>" +
        "               </div>" +
        "               <div class='form-group col-lg-12 col-md-12 col-sm-12 col-xs-12'>" +
        "                   <table id='dirList' class='display'><thead><tr><th></th></tr></thead></table>" +
        "               </div>" +
        "            </div>" +
        "            <div class='modal-footer'>" +
        "                <button type='button' class='btn btn-primary float-button-light' onclick='chooseDir(\"" + filePath + "\")'>选择</button>" +
        "                <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>" +
        "            </div>" +
        "        </div>" +
        "    </div>" +
        "</div>";
    return html;
}

function fileListModel(filePath) {
    var html = "" +
        "<div class='modal fade' id='fileListModel'>" +
        "    <div class='modal-dialog modal-large'  style='width:80%'>" +
        "        <div class='modal-content modal-content-modal'>" +
        "            <div class='modal-header'>" +
        "                <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
        "                    <span aria-hidden='true'>&times;</span>" +
        "                </button>" +
        "                <h4 class='modal-title'>选择文件</h4>" +
        "            </div>" +
        // "            <form id='projectUploadForm' method='POST' enctype='multipart/form-data'>" +
        "            <div class='modal-body'>" +
        "               <div class='form-group col-lg-12 col-md-12 col-sm-12 col-xs-12'>" +
        "                   <div class='input-group'>" +
        "                       <input type='text' class='form-control' id='fileListPath' path='/' onkeypress='fileEven()'>" +
        "                       <span class='input-group-btn'><button class='btn btn-default' type='button' onclick='fileGo()'><i class='fa fa-mail-forward'></i></button></span>" +
        "                   </div>" +
        "               </div>" +
        "               <div class='form-group col-lg-12 col-md-12 col-sm-12 col-xs-12'>" +
        "                   <table id='fileList' class='display'><thead><tr><th></th></tr></thead></table>" +
        "               </div>" +
        "            </div>" +
        "            <div class='modal-footer'>" +
        "                <button type='button' class='btn btn-primary float-button-light' onclick='chooseFile(\"" + filePath + "\")'>选择</button>" +
        "                <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>" +
        "            </div>" +
        // "            </form>" +
        "        </div>" +
        "    </div>" +
        "</div>";
    return html;
}

function createDirList(fileList) {
    var html = new Array();
    for (var i = 0, len = fileList.length; i < len; i++) {
        html[i] = new Array(2);
        html[i][0] = "<a href='javacript:void(0);' onclick='dirSkip(\"" + fileList[i]["filePath"] + fileList[i]["fileName"] + "\")'><i class='fa fa-folder'></i> "
            + fileList[i]["fileName"] + "</a>";
        html[i][1] = fileList[i]["fileUpdateTime"];
    }
    return html;
}

function createFileList(fileList) {
    var html = new Array();
    for (var i = 0, len = fileList.length; i < len; i++) {
        html[i] = new Array(6);
        if (fileList[i]["fileType"] == "1") {
            html[i][0] = "<input type='radio' name='file' path='" + fileList[i]["filePath"] + "' file='" + fileList[i]["fileName"] + "'>";
            html[i][1] = "<i class='fa fa-file-text-o'></i>";
        }
        else if (fileList[i]["fileType"] == "0") {
            html[i][0] = "";
            html[i][1] = "<a href='javacript:void(0);' onclick='fileSkip(\"" + fileList[i]["filePath"] + fileList[i]["fileName"] + "\")'><i class='fa fa-folder'></i>";
        }
        html[i][1] += " " + fileList[i]["fileName"] + "</a>";
        html[i][2] = fileList[i]["fileSize"];
        html[i][3] = fileList[i]["fileFormat"];
        html[i][4] = fileList[i]["fileUpdateTime"];
    }
    return html;
}

function dirListDataTableOption(data, url) {
    var column = "<thead><tr><th>文件名称</th><th>上传时间</th></tr><tr><th colspan='2'>";

    if (url == "/") {
        column += "<a style='color: #C0C0C0'>"
    }
    else {
        column += "<a href='javacript:void(0);' onclick='dirBack(\"" + url + "\")'>"
    }
    column += "<i class='fa fa-mail-reply'></i>返回上一级</a></th></tr></thead>";
    document.getElementById("dirList").innerHTML = column;
    var option = {
        "data": data,
        "destroy": true,
        "scrollY": "300px",
        'bDestroy': true,
        'bLengthChange': false,
        'bPaginate': false,                  //是否分页
        'iDisplayLength': 10,              //显示数据条数
        'bInfo': true,                       //数据查找状态，没数据会显示“没有数据”
        'bAutoWidth': true,                  //自动宽度
        'bSort': true,                      //是否排序
        'bFilter': false,                    //过滤功能
        "searching": true,                    //本地搜索
        'bProcessing': true,
        "sScrollX": "100%",
        "sScrollXInner": "100%",

        "orderCellsTop": true,
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

function fileListDataTableOption(data, url) {
    var column = "<thead><tr><th></th><th>文件名称</th><th>文件大小</th><th>格式</th><th>上传时间</th></tr><tr><th></th><th colspan='4'>";

    if (url == "/") {
        column += "<a style='color: #C0C0C0'>"
    }
    else {
        column += "<a href='javacript:void(0);' onclick='fileBack(\"" + url + "\")'>"
    }
    column += "<i class='fa fa-mail-reply'></i>返回上一级</a></th></tr></thead>";

    document.getElementById("fileList").innerHTML = column;
    var option = {
        "data": data,
        "destroy": true,
        "scrollY": "300px",
        "paging": false,
        "orderCellsTop": true,
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

function tableDestroy(obj) {
    var table = obj;
    var int_table = obj.DataTable();
    int_table.clear();
    int_table.destroy();
    table.empty();
}