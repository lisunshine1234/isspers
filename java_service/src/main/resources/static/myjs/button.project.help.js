var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");
$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});

var id;
$().ready(function () {
    if (document.getElementById("update") != null) {
        var id_split = window.location.href.split("/");
        id = id_split[id_split.length - 1];
        $.ajax({
            async: true,
            url: "/guteam/set/information",
            type: "POST",
            dataType: "JSON",
            data: {"id": id},
            timeout: 3000,
            success: function (back) {
                document.getElementById("update").innerHTML = createUpdatePage(back);
                var E = window.wangEditor;
                editor = new E('#editor');
                editor.customConfig.menus = ['head', 'bold', 'fontSize', 'fontName', 'italic', 'underline', 'strikeThrough', 'foreColor', 'backColor',
                    'link', 'list', 'justify', 'quote', 'table', 'code', 'undo', 'redo'];
                editor.create();
                editor.txt.html(back["projectDescribe"]);

                $("#projectUpdateForm").validate({
                    onsubmit: true,// 是否在提交是验证
                    onfocusout: function (element) {
                        $(element).valid();
                    },// 是否在失去焦点时验证
                    rules: {
                        projectName: {
                            required: true,
                            minlength: 1,
                            maxlength: 20,
                        }
                    },
                    submitHandler: function (form) { //通过之后回调
                        var projectName = document.getElementById("projectName").value;
                        var projectDescribe = editor.txt.html();
                        var projectActivate = document.getElementById("projectActivate").checked;
                        var json = {"projectName": projectName, "id": id, "projectDescribe": projectDescribe, "projectActivate": projectActivate};

                        $.ajax({
                            async: true,
                            url: "/guteam/set/updating",
                            type: "POST",
                            dataType: "text",
                            data: {"json": JSON.stringify(json)},
                            timeout: 3000,
                            success: function (back) {
                                if (back == 'true') {
                                    swal({
                                        title: "修改成功!",
                                        text: "请确认或者10秒后自动跳转到项目列表页面",
                                        type: "success",
                                        confirmButtonText: "确定",
                                    }).then(function () {
                                        window.location = "/guteam/set";
                                    });
                                    setTimeout(function () {
                                        window.location.href = "/guteam/set";
                                    }, 10000);
                                } else {
                                    swal("失败!", "修改失败!", 'error')
                                }
                            },
                            error: function (XMLHttpRequest, statusText) {
                                console.log(XMLHttpRequest);
                                console.log(statusText);
                                alert("系统异常!")
                            }
                        });
                    },
                    invalidHandler: function (form, validator) {
                        return false;
                    }
                });
            },
            error: function (XMLHttpRequest, statusText) {
                console.log(XMLHttpRequest);
                console.log(statusText);
                alert("系统异常!")
            }
        });
    }
    else {
        var E = window.wangEditor;
        editor = new E('#editor');
        editor.customConfig.menus = ['head', 'bold', 'fontSize', 'fontName', 'italic', 'underline', 'strikeThrough', 'foreColor', 'backColor',
            'link', 'list', 'justify', 'quote', 'table', 'code', 'undo', 'redo'];
        editor.create();
    }
// 在键盘按下并释放及提交后验证提交表单
    $("#projectCreateForm").validate({
        onsubmit: true,// 是否在提交是验证
        onfocusout: function (element) {
            $(element).valid();
        },// 是否在失去焦点时验证
        rules: {
            projectName: {
                required: true,
                minlength: 1,
                maxlength: 20,
            }
        },
        submitHandler: function (form) { //通过之后回调
            var formData = new FormData(form);
            formData.append("projectDescribe", editor.txt.html());
            $.ajax({
                async: true,
                url: "/guteam/set/creating",
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
                            title: "提交成功!",
                            text: "请确认或者10秒后自动跳转到项目列表页面",
                            type: "success",
                            confirmButtonText: "确定",
                        }).then(function () {
                            window.location = "/guteam/set";
                        });
                        setTimeout(function () {
                            window.location.href = "/guteam/set";
                        }, 10000);
                    } else {
                        swal("失败!", "提交失败!", 'error')
                    }
                },
                error: function (XMLHttpRequest, statusText) {
                    console.log(XMLHttpRequest);
                    console.log(statusText);
                    alert("系统异常!")
                }
            });
        },
        invalidHandler: function (form, validator) {
            return false;
        }
    });

});

function createUpdatePage(data) {
    var activate = "";
    if (data["activate"] == true) {
        activate = "<input type='checkbox' checked name='projectActivate' id='projectActivate'>"
    } else {
        activate = "<input type='checkbox' name='projectActivate' id='projectActivate'>"
    }
    var html = "" +
        "<div class='section-header'>" +
        "<h2>修改项目</h2>" +
        "</div>" +
        "<div class='section-body'>" +
        "<form id='projectUpdateForm' method='POST' enctype='multipart/form-data'>" +
        "  <label>项目名称</label>" +
        "  <div class='form-group'>" +
        "      <input class='form-control' name='projectName' id='projectName' type='text' value='" + data["projectName"] + "'>" +
        "  </div>" +
        "  <label>创建时间</label>" +
        "  <div class='form-group'>" +
        "      <a>" + data["createTime"] + "</a>" +
        "  </div>" +
        "  <label>修改时间</label>" +
        "  <div class='form-group'>" +
        "      <a>" + data["updateTime"] + "</a>" +
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
        "      <div id='editor'></div>" +
        "  </div>" +
        "  <div class='form-group'>" +
        "      <button type='submit' class='btn btn-primary float-button-light waves-effect waves-button waves-float waves-light'>" +
        "          修改" +
        "      </button>" +
        "      <button type='button' class='btn btn-danger float-button-light waves-effect waves-button waves-float waves-light' onclick='delSet(\"" + id + "\")'>" +
        "          删除" +
        "      </button>" +
        "  </div>" +
        "</form>" +
        "</div>";
    return html;
}

function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);//search,查询？后面的参数，并匹配正则
    if (r != null) return unescape(r[2]);
    return null;
}


function delSet(id) {

    swal({
        title: '是否删除?',
        text: "删除之后无法恢复！",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '删除',
        cancelButtonText: '取消'
    }).then(function () {
        swal({
            title: "请稍等",
            type: 'info',
            html: "<i class='fa fa-spin fa-spinner'></i>正在删除中...",
            confirmButtonText: '确定',
        });
        $.ajax({
            async: true,
            url: "/guteam/set/deleting",
            type: "POST",
            dataType: "text",
            data: {"id": id},
            timeout: 3000,
            success: function (back) {
                var fa = true;
                if (back == 'true') {
                    swal({
                        title: "删除成功!",
                        text: "请确认或者10秒后重新加载数据集列表",
                        type: "success",
                        confirmButtonText: "确定",
                    }).then(function () {
                        fa = false;
                        getSetList();
                    });
                    if (fa) {
                        setTimeout(function () {
                            getSetList();
                        }, 10000);
                    }
                } else {
                    swal("失败!", "删除失败!", 'error')
                }
            },
            error: function (XMLHttpRequest, statusText) {
                ajaxError();
            }
        });
    })
}