var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");
$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});


var websocket = null;
var runInfoDivHeight = parseInt(window.screen.height * 0.5);
var ScreenHeight = parseInt(window.screen.height * 0.7);
var ScreenWidth = parseInt(window.screen.width * 0.8);
var runInfoSwalWidth = parseInt(window.screen.width * 0.8);
var outputJsonList = [];
var navigationTypeList = [], jobList = [];
var jobIdBak, urlBak = "/";
<!-- start -->
$(document).ready(function () {
    if ($("#job_page").length > 0) {
        getJobList();
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


function getJobList() {
    $.ajax({
        async: true,
        url: "/guteam/admin/job/view/getJobList",
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
            jobList = back;
            $("#job_page").html(jobFrame(jobTabHelper()));
            $('#table_place').DataTable(tableOptionHelper(jobListFormat(jobList)));
            swal.close();
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}


function jobFrame(navigationHtml) {
    var frame =
        "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-3'>" +
        navigationHtml +
        "</div>" +
        "<div class='col-lg-9 col-md-9 col-sm-9 col-xs-9'>" +
        "<table class='display job-table' id='table_place'>" +
        "<thead><tr>" +
        "<th scope='row'>#</th>" +
        "<th scope='row'>任务名称</th>" +
        "<th scope='row'>使用算法</th>" +
        "<th scope='row'>所属类别</th>" +
        "<th scope='row'>开始时间</th>" +
        "<th scope='row'>使用者</th>" +
        "<th scope='row'>状态</th>" +
        "</tr></thead></table>" +
        "</div>";
    return frame;
}


function jobListFormat(jobList) {
    var list = [];
    for (var i = 0, len = jobList.length; i < len; i++) {
        var state;
        if (!jobList[i]["nonLock"]) {
            state = " <i class='fa fa-lock' style='color: orange;'></i> 锁定";
        } else if (jobList[i]["shutdown"]&& jobList[i].nonLock != false) {
            state = " <i class='fa fa-times' style='color: red;'></i> 程序终止";
        } else if (jobList[i]["run"]&& jobList[i].nonLock != false) {
            state = " <i class='fa fa-spin fa-spinner'></i> 正在运行";
        } else if (jobList[i]["error"]&& jobList[i].nonLock != false) {
            state = " <i class='fa fa-times' style='color: red;'></i> 错误";
        } else if (jobList[i]["finish"] && jobList[i].nonLock != false && jobList[i].error == false && jobList[i].run == false && jobList[i].shutdown == false) {
            state = " <i class='fa fa-check' style='color: green;'></i> 完成";
        }
        list.push(["<strong>" + (i + 1) + "</strong>",
            "<a href='javascript:void(0);' style='color: #0b93d5' onclick='getAsyncJobInfo(\"" + jobList[i]["id"] + "\")'>" + jobList[i].id + "</a>",
            jobList[i].algorithmList,
            jobList[i].navigationName,
            jobList[i].createTime,
            jobList[i].userName,
            state
        ]);
    }
    return list;
}

function jobTabHelper() {
    var html = "";
    html += "<ul class='list-group'><div class='form-radio'>";
    html += "<li class='list-group-item'><div class='radio-button'>" +
        "<label><input type='radio' checked='checked' name='radio' onchange='jobChooseType(\"all\",\"all\")'>" +
        "<i class='helper'></i>所有任务(" + jobList.length + ")</label>" +
        "</div></li>";

    html += "<li class='list-group-item active'>任务状态</li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='jobChooseType(false,\"nonLock\")'>" +
        "<i class='helper'></i>锁定任务" + "(" + jobList.filter(function (e) {
            return e.nonLock == false;
        }).length + ")</label></div></li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='jobChooseType(true,\"shutdown\")'>" +
        "<i class='helper'></i>终止任务" + "(" + jobList.filter(function (e) {
            return e.shutdown == true && e.nonLock != false;
        }).length + ")</label></div></li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='jobChooseType(true,\"run\")'>" +
        "<i class='helper'></i>正在运行任务" + "(" + jobList.filter(function (e) {
            return e.run == true && e.nonLock != false;
        }).length + ")</label></div></li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='jobChooseType(true,\"error\")'>" +
        "<i class='helper'></i>错误任务" + "(" + jobList.filter(function (e) {
            return e.error == true && e.nonLock != false;
        }).length + ")</label></div></li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='jobChooseType(true,\"finish\")'>" +
        "<i class='helper'></i>完成任务" + "(" + jobList.filter(function (e) {
            return e.finish == true && e.nonLock != false && e.error == false && e.run == false && e.shutdown == false;
        }).length + ")</label></div></li>";
    html += "</div></ul>";
    return html;
}

function jobChooseType(key, type) {
    var temp;
    if (type == "all") {
        temp = jobList;
    } else if (type == "nonLock") {
        temp = jobList.filter(function (e) {
            return e.nonLock == false;
        });
    } else if (type == "shutdown") {
        temp = jobList.filter(function (e) {
            return e.shutdown == true && e.nonLock != false;
        });
    } else if (type == "run") {
        temp = jobList.filter(function (e) {
            return e.run == true && e.nonLock != false;
        });
    } else if (type == "error") {
        temp = jobList.filter(function (e) {
            return e.error == true && e.nonLock != false;
        });
    } else if (type == "finish") {
        temp = jobList.filter(function (e) {
            return e.finish == true && e.nonLock != false && e.error == false && e.run == false && e.shutdown == false;
        });
    }

    $('#table_place').DataTable(tableOptionHelper(jobListFormat(temp)));
}

function modelOption() {
    var model = {
        backdrop: false,
        keyboard: false,
    }
    return model;
}
function getAsyncJobInfo(jobId) {
    $.ajax({
        async: true,
        url: "/guteam/job/checkRun",
        type: "POST",
        dataType: "JSON",
        data: {"json": JSON.stringify({"jobId": jobId})},
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在发送请求，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            })
        },
        success: function (back) {
            var sign = back["sign"]
            if (sign) {
                getAsyncRunJobInfo(jobId);
            } else {
                window.location.href = "/guteam/admin/job/view/" + jobId;
            }
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    })
}


function getAsyncRunJobInfo(jobId) {
    if ('WebSocket' in window) {
        $.ajax({
            async: true,
            url: "/guteam/job/getRunJobInfo",
            type: "POST",
            data: {"json": JSON.stringify({"jobId": jobId})},
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
                jobModal(back, jobId);
                swal.close();
                $("#jobModal").modal(modelOption());
                $('#runInfo').slimScroll({
                    alwaysVisible: true,
                    height: runInfoDivHeight,
                });
                document.getElementById("run_info_run_parent").click()

                setAsyncMessageInHtml("<br><font style='color:black;'>正在与服务器建立连接...</font><br>");

                websocket = new WebSocket("ws://localhost/guteam/webSocket/algorithm/run/async/" + jobId);

                websocket.onopen = function () {
                    setAsyncMessageInHtml("<font style='color:black;'>与服务器连接成功！</font><br>")
                };
                window.onbeforeunload = function () {
                    websocket.close();
                };
                websocket.onmessage = function (event) {
                    setAsyncMessageInHtml(event.data, jobId);
                };


                websocket.onclose = function () {
                    websocket.close();
                };
                webSocketSend(jobId);
            },
            error: function (XMLHttpRequest, statusText) {
                ajaxError();
            }
        })

    } else {
        swal({
            title: "您的浏览器不支持查看!",
            text: "请您更换其他浏览器进行尝试",
            type: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '确定',
        })
    }
}

function webSocketSend(msg) {
    websocket.addEventListener('open', function () {
        websocket.send(msg)
    });
}
function setAsyncMessageInHtml(message, jobId) {
    if (message == "#done") {
        websocket.close();
        document.getElementById('run_sign_title').innerHTML = "<i class='fa fa-check' style='color: green;'></i> 执行结束!";
        window.location.href = "/guteam/job/view/" + jobId;
    } else {
        var runinfo = document.getElementById('runInfo');
        var sign = false;
        // $('#runInfo').slimScroll.bind('slimscroll', function(e, pos){
        //     sign = true;
        // });
        if (runinfo.scrollTop + runInfoDivHeight >= runinfo.scrollHeight * 0.98) {
            sign = true;
        }
        document.getElementById('runInfo').innerHTML += message;
        if (sign) {
            // $('#runInfo').slimScroll.slimScroll().bind();
            runinfo.scrollTop = runinfo.scrollHeight;
        }
    }
}

function runDisplayCreate(back) {
    var htmlParent = "";
    var htmlChild = "";

    // var tab_parent = document.getElementById("tab_parent_swal");
    // var tab_child = document.getElementById("tab_child_swal");

    var runInfo_temp = runDisplayRunInfo();
    htmlParent += runInfo_temp.htmlParent;
    htmlChild += runInfo_temp.htmlChild;

    var displayReview_temp = runDisplayReview(back);
    htmlParent += displayReview_temp.htmlParent;
    htmlChild += displayReview_temp.htmlChild;

    // tab_parent.innerHTML += htmlParent;
    // tab_child.innerHTML += htmlChild;

    return {"htmlParent": htmlParent, "htmlChild": htmlChild};
}

function runDisplayReview(back) {

    var th = "<th>#</th>";
    var td = [];
    td[0] = "<th scope='row'>算法名称</th>";
    td[1] = "<th scope='row'>运行环境</th>";
    td[2] = "<th scope='row'>算法引擎</th>";
    td[3] = "<th scope='row'>算法大小</th>";
    td[4] = "<th scope='row'>数据集</th>";
    td[5] = "<th scope='row'>参数</th>";

    var algorithmList = back["algorithmList"];
    var project = back["project"];

    for (var i = 0, len1 = algorithmList.length; i < len1; i++) {
        // var temp = $.parseJSON(algorithmList[i]);
        var temp = algorithmList[i];

        var algorithm = temp["algorithm"];
        var inputSetList = temp["inputSetList"];
        var inputFileList = temp["inputFileList"];
        var inputList = temp["inputList"];
        var matKey = temp["matKey"];


        var input = "";

        for (var key in inputList) {
            if (inputSetList.indexOf(key) > 0 || inputFileList.indexOf(key) > 0) {
                var key_split = key.split(".");
                if (key_split[key_split.length - 1] == "mat") {
                    input += key + " : " + inputList[key] + " (" + matKey[key] + ")<br>";
                }
            } else {
                input += key + " : " + inputList[key] + "<br>";
            }
        }

        th += "<th>算法#" + (i + 1) + "</th>";
        td[0] += "<td>" + algorithm["algorithmName"] + "</td>";
        td[1] += "<td>" + algorithm["algorithmEnvironment"] + "</td>";
        td[2] += "<td>" + algorithm["algorithmEngine"] + "</td>";
        td[3] += "<td>" + algorithm["algorithmSize"] + "</td>";
        td[4] += "<td>" + project["projectName"] + "</td>";
        td[5] += "<td>" + input + "</td>";
    }

    var html = "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'><div class='section-header'><h2>算法信息" +
        "<a data-toggle='tooltip' data-placement='top' title='展示算法的基本信息和运行过程中的记录信息'>  <i class='fa fa-question-circle'></i></a>" +
        "</h2></div><div class='section-body'>";

    html += "<table class='table table-hover run-table'>" +
        "       <thead>" +
        "           <tr>" + th + "</tr>" +
        "       </thead>" +
        "       <tbody>" +
        "          <tr>" + td[0] + "</tr>" +
        "          <tr>" + td[1] + "</tr>" +
        "          <tr>" + td[2] + "</tr>" +
        "          <tr>" + td[3] + "</tr>" +
        "          <tr>" + td[4] + "</tr>" +
        "         <tr>" + td[5] + "</tr>" +
        "       </tbody>" +
        "   </table>";
    html += "</div></div>";

    var reviewHtmlParent = displayParent("review_place_swal", "综述");
    var reviewHtmlChild = "<div id='review_place_swal' class='tab-pane fade' name='tab_div'>" + html + "</div>";

    return {"htmlParent": reviewHtmlParent, "htmlChild": reviewHtmlChild};
}
function displayParent(href, name) {
    return "<li role='presentation' name='tab_ul'><a href='#" + href + "' id='" + href + "_parent' data-toggle='tab'>" + name + "</a></li>";
}

function runDisplayRunInfo() {
    var htmlParent = displayParent("run_info_run", "运行");
    var htmlChild = "<div id='run_info_run' class='tab-pane fade in active' name='tab_div'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'>" +
        "<div class='section-header'><h2>控制台信息<a data-toggle='tooltip' data-placement='top' title='展示算法的运行过程中的控制台信息'>  " +
        "<i class='fa fa-question-circle'></i></a></h2></div><div class='section-body'>" +
        "<div class='runInfo' style='height:" + runInfoDivHeight + "px;' id='runInfo'></div></div></div></div>";

    return {"htmlParent": htmlParent, "htmlChild": htmlChild};
}
function jobModal(back, jobId) {
    var runDisplay_temp = runDisplayCreate(back);

    var html_temp =
        "<div class='border-tab'>" +
        "<ul class='nav nav-tabs' id='tab_parent_swal'>" +
        runDisplay_temp.htmlParent +
        "</ul>" +
        "<div class='tab-content' id='tab_child_swal'>" +
        runDisplay_temp.htmlChild +
        "</div>" +
        "</div>";
    var html =
        "<div class='modal fade ' id='jobModal' >" +
        "   <div class='modal-dialog modal-large'  style='width:" + ScreenWidth + "px;height:" + ScreenHeight + "px'>" +
        "       <div class='modal-content modal-content-modal'>" +
        "           <div class='modal-header'>" +
        "               <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
        "                   <span aria-hidden='true'>&times;</span>" +
        "               </button>" +
        "               <h4 class='modal-title'><label id='run_sign_title'><i  class='fa fa-spin fa-spinner'></i>正在运行，请稍等...</label></h4>" +
        "           </div>" +
        "           <div class='modal-body' >" +
        html_temp +
        "           </div>" +
        "           <div class='modal-footer'>" +
        "               <button type='button' class='btn btn-danger float-button-light' data-dismiss='modal' onclick='jobStop(\"" + jobId + "\")'>终止</button>" +
        "               <button type='button' class='btn btn-default float-button-light' data-dismiss='modal' onclick='jobWebSocketClose()'>关闭</button>" +
        "           </div>" +
        "        </div>" +
        "    </div>" +
        "</div>";
    $("#jobModalPlace").html(html);
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
            "sEmptyTable": "无任务",
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

function jobTableDestroy(obj) {
    var table = obj;
    var int_table = obj.DataTable();
    int_table.clear();
    int_table.destroy();
    table.empty();
}
