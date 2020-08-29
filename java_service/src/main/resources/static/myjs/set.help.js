var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});

$(document).ready(function () {
    document.getElementById("setManage").innerHTML = setFrame();
    getSetList();
    $('#path').on('keypress', function (event) {
        //13 代表的是回车健 
        if (event.keyCode == 13) {
            fileGo();
        }
    });
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

function getSetList() {
    $.ajax({
        async: true,
        url: "/guteam/set/setConciseList",
        type: "GET",
        dataType: "JSON",
        timeout: 3000,
        success: function (back) {
            setTableDestroy($('#setList'));
            $('#setList').DataTable(setListDataTableOption(createSetList(back)));
            getFileList("/");
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function getDirList(url) {
    var setList = document.getElementsByName("set");
    for (var i = 0, len = setList.length; i < len; i++) {
        if (setList[i].getAttribute('activate') != null) {
            $.ajax({
                async: true,
                url: "/guteam/set/dirList",
                type: "GET",
                dataType: "JSON",
                data: {
                    "id": setList[i].getAttribute('set-id'),
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
                            confirmButtonText: "确定",
                        });
                    } else {
                        var setDirList = back["setDirList"];
                        var url = back["url"];
                        setTableDestroy($('#dirList'));
                        $('#dirList').DataTable(dirListDataTableOption(createDirList(setDirList), url));
                        var path = document.getElementById("dirPath");
                        path.value = url;
                        path.setAttribute("path", url);
                    }

                },
                error: function (XMLHttpRequest, statusText) {
                    ajaxError();
                }
            });
        }
    }
}

function getFileList(url) {
    var setList = document.getElementsByName("set");
    for (var i = 0, len = setList.length; i < len; i++) {
        if (setList[i].getAttribute('activate') != null) {
            $.ajax({
                async: true,
                url: "/guteam/set/fileList",
                type: "GET",
                dataType: "JSON",
                data: {
                    "id": setList[i].getAttribute('set-id'),
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
                            confirmButtonText: "确定",
                        });
                    } else {
                        var setFileList = back["setFileList"];
                        var url = back["url"];
                        setTableDestroy($('#fileList'));
                        $('#fileList').DataTable(fileListDataTableOption(createFileList(setFileList), url));
                        var path = document.getElementById("path");
                        path.value = url;
                        path.setAttribute("path", url);
                    }

                },
                error: function (XMLHttpRequest, statusText) {
                    ajaxError();
                }
            });
        }
    }
}

function dirList() {
    document.getElementById("fileManage").innerHTML = dirListModel();
    $("#dirListModel").modal();
    getDirList("/");
}

function dirGo() {
    getDirList(document.getElementById("dirPath").value);
}

function fileGo() {
    getFileList(document.getElementById("path").value);
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

function chooseDir() {
    var filePath = document.getElementById("filePath");
    var path = document.getElementById("dirPath").getAttribute("path");
    filePath.value = path;
    filePath.setAttribute("path", path);
    $("#dirListModel").modal('hide');
}

function createDir() {
    document.getElementById("uploadManage").innerHTML = createDirModel();
    document.getElementById("filePath").value = "新建文件夹";
    $("#createDirModel").modal();

    var id = "";
    var setList = document.getElementsByName("set");
    for (var i = 0, len = setList.length; i < len; i++) {
        if (setList[i].getAttribute('activate') != null) {
            id = setList[i].getAttribute("set-id");
        }
    }

    $("#createDirForm").validate({
        onsubmit: true,// 是否在提交是验证
        onfocusout: function (element) {
            $(element).valid();
        },// 是否在失去焦点时验证
        rules: {
            filePath: {
                required: true,
            }
        },
        submitHandler: function (form) { //通过之后回调
            var doIt = document.getElementById("doIt");
            var value = doIt.innerHTML;
            doIt.innerHTML = "<i class='fa fa-spin fa-spinner'></i>执行中";
            doIt.setAttribute("type", "button");
            var dir = document.getElementById("path").getAttribute("path");
            var createDir = document.getElementById("filePath").value;
            var json = {"id": id, "dir": dir, "fileName": createDir};
            $.ajax({
                async: true,
                url: "/guteam/file/create",
                type: "POST",
                dataType: "text",
                data: {
                    "json": JSON.stringify(json)
                },
                timeout: 3000,
                success: function (back) {
                    if (back == "true") {
                        swal("成功!", "新建文件夹成功!", 'success');
                        $("#createDirModel").modal('hide');
                        getFileList(dir);
                    } else {
                        doIt.innerHTML = value;
                        doIt.setAttribute("type", "submit");
                        swal({
                            title: "错误!",
                            text: back,
                            type: "error",
                            confirmButtonText: "确定",
                        });
                    }
                }
            })
        }
    });
}

function copyFile() {
    var fileListName = document.getElementsByName("file");
    var fileName = new Array();

    for (var i = 0, len = fileListName.length; i < len; i++) {
        if (fileListName[i].checked) {
            fileName.push(fileListName[i].getAttribute("file"));
        }
    }
    if (fileName.length > 0) {
        document.getElementById("uploadManage").innerHTML = copyFileModel();
        document.getElementById("filePath").value = "/";
        $("#copyFileModel").modal();

        var id = "";
        var setList = document.getElementsByName("set");
        for (var i = 0, len = setList.length; i < len; i++) {
            if (setList[i].getAttribute('activate') != null) {
                id = setList[i].getAttribute("set-id");
            }
        }
        $("#copyFileForm").validate({
            onsubmit: true,// 是否在提交是验证
            onfocusout: function (element) {
                $(element).valid();
            },// 是否在失去焦点时验证
            rules: {
                filePath: {
                    required: true,
                }
            },
            submitHandler: function (form) { //通过之后回调
                var doIt = document.getElementById("doIt");
                var value = doIt.innerHTML;
                doIt.innerHTML = "<i class='fa fa-spin fa-spinner'></i>执行中";
                doIt.setAttribute("type", "button");
                var dir = fileListName[0].getAttribute("path");
                var newDir = document.getElementById("filePath").getAttribute("path");
                var json = {"id": id, "dir": dir, "fileName": fileName, "newDir": newDir};
                console.log(json)
                $.ajax({
                    async: true,
                    url: "/guteam/file/copy",
                    type: "POST",
                    dataType: "text",
                    data: {
                        "json": JSON.stringify(json)
                    },
                    timeout: 3000,
                    success: function (back) {
                        if (back == "true") {
                            swal("成功!", "复制成功!", 'success');
                            $("#copyFileModel").modal('hide');
                            getFileList(dir);
                        } else {
                            doIt.innerHTML = value;
                            doIt.setAttribute("type", "submit");
                            swal({
                                title: "错误!",
                                text: back,
                                type: "error",
                                confirmButtonText: "确定",
                            });
                        }
                    }
                })
            }
        });

    } else {
        swal({
            title: "未选择文件",
            text: "请勾选文件进行操作",
            type: "error",
            confirmButtonText: "确定",
        });
    }

}

function moveFile() {
    var fileListName = document.getElementsByName("file");
    var fileName = new Array();

    for (var i = 0, len = fileListName.length; i < len; i++) {
        if (fileListName[i].checked) {
            fileName.push(fileListName[i].getAttribute("file"));
        }
    }
    if (fileName.length > 0) {
        document.getElementById("uploadManage").innerHTML = moveFileModel();
        document.getElementById("filePath").value = "/";
        $("#moveFileModel").modal();

        var id = "";
        var setList = document.getElementsByName("set");
        for (var i = 0, len = setList.length; i < len; i++) {
            if (setList[i].getAttribute('activate') != null) {
                id = setList[i].getAttribute("set-id");
            }
        }
        $("#moveFileForm").validate({
            onsubmit: true,// 是否在提交是验证
            onfocusout: function (element) {
                $(element).valid();
            },// 是否在失去焦点时验证
            rules: {
                filePath: {
                    required: true,
                }
            },
            submitHandler: function (form) { //通过之后回调
                var doIt = document.getElementById("doIt");
                var value = doIt.innerHTML;
                doIt.innerHTML = "<i class='fa fa-spin fa-spinner'></i>执行中";
                doIt.setAttribute("type", "button");

                var dir = fileListName[0].getAttribute("path");
                var newDir = document.getElementById("filePath").getAttribute("path");
                var json = {"id": id, "dir": dir, "fileName": fileName, "newDir": newDir};

                $.ajax({
                    async: true,
                    url: "/guteam/file/move",
                    type: "POST",
                    dataType: "text",
                    data: {
                        "json": JSON.stringify(json)
                    },
                    timeout: 3000,
                    success: function (back) {
                        if (back == "true") {
                            swal("成功!", "移动成功!", 'success');
                            $("#moveFileModel").modal('hide');
                            getFileList(dir);
                        } else {
                            doIt.innerHTML = value;
                            doIt.setAttribute("type", "submit");
                            swal({
                                title: "错误!",
                                text: back,
                                type: "error",
                                confirmButtonText: "确定",
                            });
                        }
                    }
                })
            }
        });

    } else {
        swal({
            title: "未选择文件",
            text: "请勾选文件进行操作",
            type: "error",
            confirmButtonText: "确定",
        });
    }


}

function delFile() {
    var fileListName = document.getElementsByName("file");
    var fileName = new Array();

    for (var i = 0, len = fileListName.length; i < len; i++) {
        if (fileListName[i].checked) {
            fileName.push(fileListName[i].getAttribute("file"));
        }
    }

    if (fileName.length > 0) {
        var id = "";
        var setList = document.getElementsByName("set");
        for (var i = 0, len = setList.length; i < len; i++) {
            if (setList[i].getAttribute('activate') != null) {
                id = setList[i].getAttribute("set-id");
            }
        }

        swal({
            title: '将要删除' + fileName.length + '个文件',
            text: "确定之后将无法恢复！",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: '确定',
            cancelButtonText: '取消'
        }).then(function () {
            swal({
                title: "请稍等",
                type: 'info',
                html: "<i class='fa fa-spin fa-spinner'></i>正在删除中...",
                confirmButtonText: '确定'
            });

            var dir = fileListName[0].getAttribute("path");
            var json = {"id": id, "dir": dir, "fileName": fileName};
            $.ajax({
                async: true,
                url: "/guteam/file/delete",
                type: "POST",
                dataType: "text",
                data: {
                    "json": JSON.stringify(json)
                },
                timeout: 3000,
                success: function (back) {
                    if (back == "true") {
                        swal("成功!", "删除成功!", 'success');
                        getFileList(dir);
                    } else {
                        swal({
                            title: "错误!",
                            text: back,
                            type: "error",
                            confirmButtonText: "确定",
                        });
                    }
                }
            })
        });
    } else {
        swal({
            title: "未选择文件",
            text: "请勾选文件进行操作",
            type: "error",
            confirmButtonText: "确定",
        });
    }


}

function changeSet(obj) {
    var setList = document.getElementsByName("set");
    for (var i = 0, len = setList.length; i < len; i++) {
        if (setList[i].getAttribute('activate') != null) {
            setList[i].removeAttribute('activate');
            setList[i].style = "padding-left: 0px;";
            break;
        }
    }
    obj.setAttribute("activate", "");
    obj.style = "padding-left: 0px;font-weight: bold;color: black;";

    getFileList("/");

}

function changeFileName(dir, fileName) {
    document.getElementById("uploadManage").innerHTML = changeFileNameModel();
    document.getElementById("newFileName").value = fileName;
    $("#changeFileName").modal();

    var id = "";
    var setList = document.getElementsByName("set");
    for (var i = 0, len = setList.length; i < len; i++) {
        if (setList[i].getAttribute('activate') != null) {
            id = setList[i].getAttribute("set-id");
        }
    }

    $("#changeFileNameForm").validate({
        onsubmit: true,// 是否在提交是验证
        onfocusout: function (element) {
            $(element).valid();
        },// 是否在失去焦点时验证
        rules: {
            newFileName: {
                required: true,
            }
        },
        submitHandler: function (form) { //通过之后回调
            var doIt = document.getElementById("doIt");
            var value = doIt.innerHTML;
            doIt.innerHTML = "<i class='fa fa-spin fa-spinner'></i>执行中";
            doIt.setAttribute("type", "button");

            var newFileName = document.getElementById("newFileName").value;
            var json = {"id": id, "dir": dir, "fileName": fileName, "newFileName": newFileName};
            $.ajax({
                async: true,
                url: "/guteam/file/changeFileName",
                type: "POST",
                dataType: "text",
                data: {
                    "json": JSON.stringify(json)
                },
                timeout: 3000,
                success: function (back) {
                    if (back == "true") {
                        swal("成功!", "更改成功!", 'success');
                        $("#changeFileName").modal('hide');
                        getFileList(dir);
                    } else {
                        doIt.innerHTML = value;
                        doIt.setAttribute("type", "submit");
                        swal({
                            title: "错误!",
                            text: back,
                            type: "error",
                            confirmButtonText: "确定",
                        });
                    }
                }
            })

        }
    });
}

function uploadCreate() {
    document.getElementById("uploadManage").innerHTML = uploadModel();
    document.getElementById("filePath").value = "/";
    $("#upload").modal();
    var id = "";
    var setList = document.getElementsByName("set");
    for (var i = 0, len = setList.length; i < len; i++) {
        if (setList[i].getAttribute('activate') != null) {
            id = setList[i].getAttribute("set-id");
        }
    }

    $("#projectUploadForm").validate({
        onsubmit: true,// 是否在提交是验证
        onfocusout: function (element) {
            $(element).valid();
        },// 是否在失去焦点时验证
        rules: {
            projectFile: {
                extension: "txt|csv|mat|data",
                required: true,
            }
        },
        submitHandler: function (form) { //通过之后回调
            var doIt = document.getElementById("doIt");
            var value = doIt.innerHTML;
            doIt.innerHTML = "<i class='fa fa-spin fa-spinner'></i>执行中";
            doIt.setAttribute("type", "button");
            var formData = new FormData(form);
            formData.append("id", id);
            var fileNameList = new Array();
            var fileList = formData.getAll("projectFile");

            for (var i = 0, len = fileList.length; i < len; i++) {
                fileNameList[i] = fileList[i]["name"];
            }
            var json = {"id": id, "dir": formData.get("filePath"), "fileNameList": fileNameList}
            $.ajax({
                async: true,
                url: "/guteam/file/checkFileName",
                type: "POST",
                dataType: "text",
                data: {
                    "json": JSON.stringify(json)
                },
                timeout: 3000,
                success: function (back) {
                    if (back == '-1') {
                        doIt.innerHTML = value;
                        doIt.setAttribute("type", "submit");
                        swal({
                            title: "错误!",
                            text: "上传目录错误",
                            type: "error",
                            confirmButtonText: "确定",
                        });
                    } else if (back == 0) {
                        $.ajax({
                            async: true,
                            url: "/guteam/file/upload",
                            type: "POST",
                            dataType: "text",
                            processData: false,
                            contentType: false,
                            cache: false,
                            data: formData,
                            timeout: 3000,
                            success: function (back) {
                                if (back == 'true') {
                                    swal({
                                        title: "上传成功!",
                                        text: "成功上传文件到指定目录",
                                        type: "success",
                                        confirmButtonText: "确定",
                                    });
                                    $("#upload").modal('hide');
                                    getFileList(formData.get("savePath"));
                                } else {
                                    doIt.innerHTML = value;
                                    doIt.setAttribute("type", "submit");
                                    swal({
                                        title: "上传失败!",
                                        text: "未能将文件上传到指定目录",
                                        type: "error",
                                        confirmButtonText: "确定",
                                    })
                                }
                            },
                            error: function (XMLHttpRequest, statusText) {
                                ajaxError();
                            }
                        });
                    }
                    else {
                        swal({
                            title: back + '个重名文件',
                            text: "确定之后将会覆盖掉原文件！",
                            type: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: '确定',
                            cancelButtonText: '取消'
                        }).then(function () {
                            $.ajax({
                                async: true,
                                url: "/guteam/file/upload",
                                type: "POST",
                                dataType: "text",
                                processData: false,
                                contentType: false,
                                cache: false,
                                data: formData,
                                timeout: 3000,
                                success: function (back) {
                                    if (back == 'true') {
                                        swal({
                                            title: "上传成功!",
                                            text: "成功上传文件到指定目录",
                                            type: "success",
                                            confirmButtonText: "确定",
                                        });
                                        $("#upload").modal('hide');
                                        getFileList(formData.get("savePath"));
                                    } else {
                                        doIt.innerHTML = value;
                                        doIt.setAttribute("type", "submit");
                                        swal({
                                            title: "上传失败!",
                                            text: "未能将文件上传到指定目录",
                                            type: "error",
                                            confirmButtonText: "确定",
                                        })
                                    }

                                },
                                error: function (XMLHttpRequest, statusText) {
                                    ajaxError();
                                }
                            });
                        })
                    }
                },
                error: function (XMLHttpRequest, statusText) {
                    ajaxError();
                }
            });


        },
        invalidHandler: function (form, validator) {
            return false;
        }
    });
}

function setFrame() {
    var frame =
        "   <div class='col-lg-3 col-md-3 col-sm-3 col-xs-3' style='border-right:1px solid gainsboro;'>\n" +
        "       <a href='/guteam/set/create' style='float: right;border-bottom:1px solid gainsboro;padding-bottom: 10px '>\n" +
        "           <button type='button' class='btn btn-default float-button-light'>新建数据仓库</button>\n" +
        "       </a>\n" +
        "       <table id='setList' class='display' style='border-right: none;border-left: none;border-top: none'><thead><tr><th></th></tr></thead></table>" +
        "   </div>\n" +
        "   <div class='col-lg-9 col-md-9 col-sm-9 col-xs-9'>\n" +
        "       <div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'>" +
        "               <button type='button' class='btn btn-default float-button-light' onclick='delFile()' style='float: right;margin: 10px'>删除</button>\n" +
        "               <button type='button' class='btn btn-default float-button-light' onclick='moveFile()' style='float: right;margin: 10px'>移动</button>\n" +
        "               <button type='button' class='btn btn-default float-button-light' onclick='copyFile()' style='float: right;margin: 10px'>复制</button>\n" +
        // "           <a href='/guteam/set/create' style='float: right;border-bottom:1px solid gainsboro;padding-bottom: 10px '>\n" +
        // "           </a>\n" +
        // "           <a href='/guteam/set/create' style='float: right;border-bottom:1px solid gainsboro;padding-bottom: 10px;padding-right: 10px'>\n" +
        "               <button type='button' class='btn btn-default float-button-light' onclick='createDir()' style='margin: 10px'>新建文件夹</button>\n" +
        "               <button type='button' class='btn btn-default float-button-light' onclick='uploadCreate()' style='margin: 10px'>上传新文件</button>\n" +
        // "           </a>" +
        "       </div>" +
        "       <div class='form-group col-lg-12 col-md-12 col-sm-12 col-xs-12'>" +
        "           <div class='input-group'>" +
        "               <input type='text' class='form-control' id='path' path='/'>" +
        "               <span class='input-group-btn'><button class='btn btn-default' type='button' onclick='fileGo()'><i class='fa fa-mail-forward'></i></button></span>" +
        "           </div>" +
        "       </div>" +
        "       <div class='form-group col-lg-12 col-md-12 col-sm-12 col-xs-12'>" +
        "           <table id='fileList' class='display'><thead><tr><th></th></tr></thead></table>\n" +
        "       </div>\n" +
        "</div>\n";
    return frame;
}

function copyFileModel() {
    var html = "" +
        "<div class='modal fade' id='copyFileModel'>\n" +
        "    <div class='modal-dialog modal-large'>\n" +
        "        <div class='modal-content modal-content-modal'>\n" +
        "            <div class='modal-header'>\n" +
        "                <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>\n" +
        "                    <span aria-hidden='true'>&times;</span>\n" +
        "                </button>\n" +
        "                <h4 class='modal-title'>复制到</h4>\n" +
        "            </div>\n" +
        "            <form id='copyFileForm' method='POST' enctype='multipart/form-data'>\n" +
        "            <div class='modal-body'>" +

        "                <label>目录</label>\n" +
        "                <div class='form-group'>\n" +
        "                    <div class='input-group'>" +
        "                    <input type='text' class='form-control' name='filePath' id='filePath' path='/'>\n" +
        "                   <span class='input-group-btn'><button class='btn btn-default' type='button' onclick='dirList()'>...</button></span>" +
        "                </div></div>" +

        "            </div>\n" +
        "            <div class='modal-footer'>\n" +
        "                <button type='submit' class='btn btn-primary float-button-light' id='doIt'>复制</button>\n" +
        "                <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>\n" +
        "            </div>\n" +
        "            </form>" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>";
    return html;
}

function moveFileModel() {
    var html = "" +
        "<div class='modal fade' id='moveFileModel'>\n" +
        "    <div class='modal-dialog modal-large'>\n" +
        "        <div class='modal-content modal-content-modal'>\n" +
        "            <div class='modal-header'>\n" +
        "                <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>\n" +
        "                    <span aria-hidden='true'>&times;</span>\n" +
        "                </button>\n" +
        "                <h4 class='modal-title'>移动到</h4>\n" +
        "            </div>\n" +
        "            <form id='moveFileForm' method='POST' enctype='multipart/form-data'>\n" +
        "            <div class='modal-body'>" +

        "                <label>目录</label>\n" +
        "                <div class='form-group'>\n" +
        "                    <div class='input-group'>" +
        "                    <input type='text' class='form-control' name='filePath' id='filePath' path='/'>\n" +
        "                    <span class='input-group-btn'><button class='btn btn-default' type='button' onclick='dirList()'>...</button></span>" +
        "                </div></div>" +

        "            </div>\n" +
        "            <div class='modal-footer'>\n" +
        "                <button type='submit' class='btn btn-primary float-button-light' id='doIt'>移动</button>\n" +
        "                <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>\n" +
        "            </div>\n" +
        "            </form>" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>";
    return html;
}

function createDirModel() {
    var html = "" +
        "<div class='modal fade' id='createDirModel'>\n" +
        "    <div class='modal-dialog modal-large'>\n" +
        "        <div class='modal-content modal-content-modal'>\n" +
        "            <div class='modal-header'>\n" +
        "                <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>\n" +
        "                    <span aria-hidden='true'>&times;</span>\n" +
        "                </button>\n" +
        "                <h4 class='modal-title'>创建新文件夹</h4>\n" +
        "            </div>\n" +
        "            <form id='createDirForm' method='POST' enctype='multipart/form-data'>\n" +
        "            <div class='modal-body'>" +

        "                <label>文件夹名字</label>\n" +
        "                <div class='form-group'>\n" +
        "                    <input type='text' class='form-control' name='filePath' id='filePath' >\n" +
        "                </div>" +

        "            </div>\n" +
        "            <div class='modal-footer'>\n" +
        "                <button type='submit' class='btn btn-primary float-button-light' id='doIt'>创建</button>\n" +
        "                <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>\n" +
        "            </div>\n" +
        "            </form>" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>";
    return html;
}

function changeFileNameModel() {
    var html = "" +
        "<div class='modal fade' id='changeFileName'>\n" +
        "    <div class='modal-dialog modal-large'>\n" +
        "        <div class='modal-content modal-content-modal'>\n" +
        "            <div class='modal-header'>\n" +
        "                <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>\n" +
        "                    <span aria-hidden='true'>&times;</span>\n" +
        "                </button>\n" +
        "                <h4 class='modal-title'>文件重命名</h4>\n" +
        "            </div>\n" +
        "            <form id='changeFileNameForm' method='POST' enctype='multipart/form-data'>\n" +
        "            <div class='modal-body'>" +

        "                <label>重命名</label>\n" +
        "                <div class='form-group'>\n" +
        "                    <input type='text' class='form-control' type='filename' name='newFileName' id='newFileName'>\n" +
        "                </div>" +

        "            </div>\n" +
        "            <div class='modal-footer'>\n" +
        "                <button type='submit' class='btn btn-primary float-button-light' id='doIt'>更改</button>\n" +
        "                <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>\n" +
        "            </div>\n" +
        "            </form>" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>";
    return html;
}

function uploadModel() {
    var html = "" +
        "<div class='modal fade' id='upload'>\n" +
        "    <div class='modal-dialog modal-large'>\n" +
        "        <div class='modal-content modal-content-modal'>\n" +
        "            <div class='modal-header'>\n" +
        "                <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>\n" +
        "                    <span aria-hidden='true'>&times;</span>\n" +
        "                </button>\n" +
        "                <h4 class='modal-title'>上传文件</h4>\n" +
        "            </div>\n" +
        "            <form id='projectUploadForm' method='POST' enctype='multipart/form-data'>\n" +
        "            <div class='modal-body'>" +
        "                <label>数据集文件</label>\n" +
        "                <div class='form-group file-control-upload'>\n" +
        "                    <input class='form-control-file' type='file' multiple='multiple' name='projectFile' id='projectFile'>\n" +
        "                </div>" +
        "               <label>保存到</label>\n" +
        "                <div class='form-group file-control-upload'>\n" +
        "                    <div class='input-group'>" +
        "                    <input type='text' class='form-control' name='filePath' id='filePath' placeholder='/' path='/'>\n" +
        "                   <span class='input-group-btn'><button class='btn btn-default' type='button' onclick='dirList()'>...</button></span>" +
        "                </div></div>" +

        "            </div>\n" +
        "            <div class='modal-footer'>\n" +
        "                <button type='submit' class='btn btn-primary float-button-light' id='doIt'>上传</button>\n" +
        "                <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>\n" +
        "            </div>\n" +
        "            </form>" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>";
    return html;
}

function dirListModel() {
    var html = "" +
        "<div class='modal fade' id='dirListModel'>\n" +
        "    <div class='modal-dialog modal-large'>\n" +
        "        <div class='modal-content modal-content-modal'>\n" +
        "            <div class='modal-header'>\n" +
        "                <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>\n" +
        "                    <span aria-hidden='true'>&times;</span>\n" +
        "                </button>\n" +
        "                <h4 class='modal-title'>目录</h4>\n" +
        "            </div>\n" +
        // "            <form id='projectUploadForm' method='POST' enctype='multipart/form-data'>\n" +
        "            <div class='modal-body'>" +
        "               <div class='form-group col-lg-12 col-md-12 col-sm-12 col-xs-12'>" +
        "                   <div class='input-group'>" +
        "                       <input type='text' class='form-control' id='dirPath' path='/'>" +
        "                       <span class='input-group-btn'><button class='btn btn-default' type='button' onclick='dirGo()'><i class='fa fa-mail-forward'></i></button></span>" +
        "                   </div>" +
        "               </div>" +
        "               <div class='form-group col-lg-12 col-md-12 col-sm-12 col-xs-12'>" +
        "                   <table id='dirList' class='display'><thead><tr><th></th></tr></thead></table>\n" +
        "               </div>\n" +
        "            </div>\n" +
        "            <div class='modal-footer'>\n" +
        "                <button type='button' class='btn btn-primary float-button-light' onclick='chooseDir()'>选择</button>\n" +
        "                <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>\n" +
        "            </div>\n" +
        // "            </form>" +
        "        </div>\n" +
        "    </div>\n" +
        "</div>";
    return html;
}

function createSetList(setList) {
    var html = new Array();
    for (var i = 0, len = setList.length; i < len; i++) {
        html[i] = new Array(1);
        if (setList[i]["activate"] == true) {
            html[i][0] = "<a href='javacript:void(0);' onclick='changeSet(this)' set-id='" + setList[i]['id'] + "' name='set' activate style='padding: 0px;font-weight: bold;color: black;'>";
            html[i][0] += "<i class='fa fa-circle' style='color: green;'></i>";
        }
        else if (setList[i]["nonLock"] == true) {
            html[i][0] = "<a href='javacript:void(0);' onclick='changeSet(this)' set-id='" + setList[i]['id'] + "'  name='set' style='padding: 0px;'>";
            html[i][0] += "<i class='fa fa-circle' style='color: grey;'></i>";
        }
        else {
            html[i][0] = "<a href='javacript:void(0);' onclick='changeSet(this)' set-id='" + setList[i]['id'] + "'  name='set' style='padding: 0px;'>";
            html[i][0] += "<i class='fa fa-circle' style='color: red;'></i>";
        }
        html[i][0] += " <a href='/guteam/set/update/" + setList[i]['id'] + "' style=''>" + setList[i]["projectName"] + "</a>";
    }
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
        html[i][0] = "<input type='checkbox' name='file' path='" + fileList[i]["filePath"] + "' file='" + fileList[i]["fileName"] + "'>";
        if (fileList[i]["fileType"] == "1") {
            html[i][1] = "<i class='fa fa-file-text-o'></i>";
        }
        else if (fileList[i]["fileType"] == "0") {
            html[i][1] = "<a href='javacript:void(0);' onclick='fileSkip(\"" + fileList[i]["filePath"] + fileList[i]["fileName"] + "\")'><i class='fa fa-folder'></i>";
        }
        html[i][1] += " " + fileList[i]["fileName"] + "</a>";
        html[i][2] = fileList[i]["fileSize"];
        html[i][3] = fileList[i]["fileFormat"];
        html[i][4] = fileList[i]["fileUpdateTime"];
        html[i][5] = "<a href='javacript:void(0);' onclick='changeFileName(\"" + fileList[i]["filePath"] + "\",\"" + fileList[i]["fileName"] + "\")' ><i class='fa fa-pencil-square'></i></a>  ";
    }
    return html;
}

function setListDataTableOption(data) {
    var column = "<thead><tr><th>数据仓库列表</th></tr></thead>";
    document.getElementById("setList").innerHTML = column;
    var option = {
        "data": data,
        "scrollY": "1000px",
        "paging": false,
        "destroy": true,
        "ordering": false,
        "striped": false,
        "language": {//代替表下方的英文页码说明
            "sProcessing": "处理中...",
            "sLengthMenu": "每页 _MENU_ 项",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "总计 _TOTAL_ 个数据集。",
            "sInfoEmpty": "当前显示第 0 至 0 项，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "sUrl": "",
            "sEmptyTable": "无数据集",
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

function fileListDataTableOption(data, url) {
    var column = "<thead><tr><th></th><th>文件名称</th><th>文件大小</th><th>格式</th><th>上传时间</th><th>操作</th></tr><tr><th></th><th colspan='5'>";

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

function setTableDestroy(obj) {
    var table = obj;
    var int_table = obj.DataTable();
    int_table.clear();
    int_table.destroy();
    table.empty();
}

