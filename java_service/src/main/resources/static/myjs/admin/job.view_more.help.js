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

    var u = window.location.href.split("/");
    var url = u[u.length - 1];
    if ($("#job_view_page").length > 0) {
        getFinishJobInfo(url);
    }
});
function getFinishJobInfo(jobId) {
    $("#jobModal").modal("hide");
    $.ajax({
        async: true,
        url: "/guteam/job/getFinishJobInfo",
        type: "POST",
        dataType: "JSON",
        data: {"json": JSON.stringify({"jobId": jobId})},
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在获取数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            });
        },
        success: function (back) {
            var sign = back["sign"];
            if (sign) {
                swal({
                    html: "<i  class='fa fa-spin fa-spinner'></i>正在构建数据和渲染可视化，请稍等...",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                })
                for (var i = 0, len = back.jobOutputMongo.info.length; i < len; i++) {
                    if(back.jobOutputMongo.info[i].outputList == null){
                        break;
                    }
                    var outputList = JSON.parse(back.jobOutputMongo.info[i].outputList);

                    for (var key in outputList) {
                        outputList[key] = dataTitleHelper(outputList[key]);
                    }
                    outputJsonList.push(outputList);
                }

                finishDisplayCreate(back);
                swal.close();
            } else {
                swal({
                    text: "不存在该任务!",
                    type: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: '确定',
                })
            }

        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    })
}
function dataTitleHelper(data) {
    if (displayCheckTwoArray(data) == true) {
        data = arrayTitleTwoHelper(data)
    } else if (displayCheckOneArray(data) == true) {
        data = arrayTitleOneHelper(data);
    } else if (displayCheckNumber(data) == true) {
        data = numberTitleHelper({"data": data});
    } else if (displayCheckJson(data) == true) {
        data = jsonTitleHelper(data);
    }
    return data;
}


function dataTitleHelper(data) {
    if (displayCheckTwoArray(data) == true) {
        data = arrayTitleTwoHelper(data)
    } else if (displayCheckOneArray(data) == true) {
        data = arrayTitleOneHelper(data);
    } else if (displayCheckNumber(data) == true) {
        data = numberTitleHelper({"data": data});
    } else if (displayCheckJson(data) == true) {
        data = jsonTitleHelper(data);
    }
    return data;
}

function numberTitleHelper(data) {
    return {"data": data, "x": "数字"}
}

function arrayTitleOneHelper(data) {
    var len = data.length;
    var num_len = len.toString().length;

    var x = [];
    for (var i = 1; i <= len; i++) {
        x.push("第" + (Array(num_len).join('0') + i).slice(-num_len) + "个");
    }
    return {"data": data, "x": x}
}

function arrayTitleTwoHelper(data) {
    var row_len = data.length;
    var column_len = [0].length;
    var row_num_len = row_len.toString().length;
    var column_num_len = column_len.toString().length;

    var x = [];
    var y = [];
    for (var i = 1; i <= column_len; i++) {
        x.push("第" + (Array(column_num_len).join('0') + i).slice(-row_num_len) + "列");
    }
    for (var j = 1; j <= row_len; j++) {
        y.push("第" + (Array(row_num_len).join('0') + j).slice(-row_num_len) + "行");
    }
    return {"data": data, "x": x, "y": y};
}function displayParent(href, name) {
    return "<li role='presentation' name='tab_ul'><a href='#" + href + "' id='" + href + "_parent' data-toggle='tab'>" + name + "</a></li>";
}
function finishDisplayRunInfo(info) {
    var info_html = "";
    for (var i = 0, len = info.length; i < len; i++) {
        info_html += info[i];
    }
    var htmlParent = displayParent("run_info_finish", "运行");
    var htmlChild = "<div id='run_info_finish' class='tab-pane fade' name='tab_div'>" +
        "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'><div class='section-header'><h2>控制台信息" +
        "<a data-toggle='tooltip' data-placement='top' title='展示算法的运行过程中的控制台信息'>  <i class='fa fa-question-circle'></i></a>" +
        "</h2></div><div class='section-body'>" +
        "<div class='runInfoFinish' id='runInfo'>" + info_html + "</div></div></div></div>";

    return {"htmlParent": htmlParent, "htmlChild": htmlChild};
}function finishDisplayAlgorithm(back) {
    var htmlParent = "";
    var htmlChild = "";
    for (var i = 0, len = back.length; i < len; i++) {
        var temp = back[i];
        var algorithm = $.parseJSON(temp["algorithm"]);
        var displayList = temp["displayList"];

        htmlParent += displayParent("display_" + i, "#" + (i + 1) + " : " + algorithm["algorithmName"]);
        htmlChild += "<div id='display_" + i + "' class='tab-pane fade' name='tab_div'>";
        htmlChild += createDisplayModelByType(displayList, i);
        htmlChild += "</div>";
    }

    return {"htmlParent": htmlParent, "htmlChild": htmlChild}
}

function jsonTitleHelper(data) {
    if (displayCheckTwoArray(data.data) == true) {
        var row_max_len = data.data.length;
        var column_max_len = data.data[0].length;
        if (data.x == null || data.x.length != row_max_len) {
            var x = [];
            var x_num_len = column_max_len.toString().length;
            for (var j = 1; j <= column_max_len; j++) {
                x.push("第" + (Array(x_num_len).join('0') + j).slice(-x_num_len) + "列");
            }
            data.x = x;
        }
        if (data.y == null || data.y.length != column_max_len) {
            var y = [];
            var y_num_len = row_max_len.toString().length;
            for (var i = 1; i <= row_max_len; i++) {
                y.push("第" + (Array(y_num_len).join('0') + i).slice(-y_num_len) + "行");
            }
            data.y = y;
        }
    } else if (displayCheckOneArray(data.data) == true) {
        var max_len = data.data.length;
        var x = [];
        if (data.x == null || data.x.length != max_len) {
            var num_len = max_len.toString().length;
            for (var i = 1; i <= max_len; i++) {
                x.push("第" + (Array(num_len).join('0') + i).slice(-num_len) + "个");
            }
            data.x = x;
        }
    } else if (displayCheckNumber(data.data) == true) {
        if (data.x == null || !displayCheckString(data.x)) {
            data.x == "数字";
        }
    } else {
        data = {"data": [[]], "x": [], "y": ""};
    }
    return data;
}
function finishDisplayCreate(back) {
    var jobOutputMongo = back["jobOutputMongo"];
    var jobRunInfoMongo = back["jobRunInfoMongo"];
    var project = jobOutputMongo["project"];
    var info = jobOutputMongo["info"];
    var sign = jobOutputMongo["sign"];

    var htmlParent = "";
    var htmlChild = "";

    var tab_parent = $("#tab_parent");
    var tab_child = $("#tab_child");
    var tab_ul = document.getElementsByName("tab_ul");


    var tab_div = document.getElementsByName("tab_div");
    if (tab_ul.length > 1) {
        for (var i = 1, len1 = tab_ul.length; i < len1; i++) {
            tab_ul[1].remove();
        }
    }
    if (tab_div.length > 1) {
        for (var j = 1, len2 = tab_div.length; j < len2; j++) {
            tab_div[1].remove();
        }
    }

    var runInfo_temp = finishDisplayRunInfo(jobRunInfoMongo["info"]);
    htmlParent += runInfo_temp.htmlParent;
    htmlChild += runInfo_temp.htmlChild;


    var displayReview_temp;
    if (sign == "success") {
        displayReview_temp = finishSuccessDisplayReview(info, project);
        htmlParent += displayReview_temp.htmlParent;
        htmlChild += displayReview_temp.htmlChild;

        var displayAlgorithm_temp = finishDisplayAlgorithm(info);
        htmlParent += displayAlgorithm_temp.htmlParent;
        htmlChild += displayAlgorithm_temp.htmlChild;

        tab_parent.html(tab_parent.html() + htmlParent);
        tab_child.html(tab_child.html() + htmlChild);

        renderDisplayModelByType();

        $.fn.dataTable.tables({visible: false, api: true}).columns.adjust();
    } else {
        displayReview_temp = finishErrorDisplayReview(info, project);
        htmlParent += displayReview_temp.htmlParent;
        htmlChild += displayReview_temp.htmlChild;

        tab_parent.html(tab_parent.html() + htmlParent);
        tab_child.html(tab_child.html() + htmlChild);
    }

    $('#runInfo').slimScroll({
        alwaysVisible: true,
        height: runInfoDivHeight,
    });


    document.getElementById("run_info_finish_parent").click()


}

function finishSuccessDisplayReview(info, project) {

    var th = "<th>#</th>";
    var td = [];
    td[0] = "<th scope='row'>算法名称</th>";
    td[1] = "<th scope='row'>运行环境</th>";
    td[2] = "<th scope='row'>算法引擎</th>";
    td[3] = "<th scope='row'>算法大小</th>";
    td[4] = "<th scope='row'>数据集</th>";
    td[5] = "<th scope='row'>运行开始时间</th>";
    td[6] = "<th scope='row'>运行结束时间</th>";
    td[7] = "<th scope='row'>运行消耗时间</th>";
    td[8] = "<th scope='row'>参数</th>";

    for (var i = 0, len1 = info.length; i < len1; i++) {
        var temp = info[i];
        var algorithm = $.parseJSON(temp["algorithm"]);
        var inputList = $.parseJSON(temp["inputList"]);
        var startTime = temp["start"];
        var endTime = temp["end"];
        var costFormatTime = temp["costFormat"];
        var costTime = temp["costTime"];
        var input = "";

        for (var key in inputList) {
            input += key + " : " + inputList[key] + "<br>";
        }
        th += "<th>算法#" + (i + 1) + "</th>";
        td[0] += "<td>" + algorithm["algorithmName"] + "</td>";
        td[1] += "<td>" + algorithm["algorithmEnvironment"] + "</td>";
        td[2] += "<td>" + algorithm["algorithmEngine"] + "</td>";
        td[3] += "<td>" + algorithm["algorithmSize"] + "</td>";
        td[4] += "<td>" + project["projectName"] + "</td>";
        td[5] += "<td>" + startTime + "</td>";
        td[6] += "<td>" + endTime + "</td>";
        td[7] += "<td>" + costFormatTime + "</td>";
        td[8] += "<td>" + input + "</td>";
    }

    var html = "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'><div class='section-header'><h2>算法信息" +
        "<a data-toggle='tooltip' data-placement='top' title='展示算法的基本信息和运行过程中的记录信息'>  <i class='fa fa-question-circle'></i></a>" +
        "</h2></div><div class='section-body'>";

    html += "<table class='table table-hover'>" +
        "       <thead>" +
        "           <tr>" + th + "</tr>" +
        "       </thead>" +
        "       <tbody>" +
        "          <tr>" + td[0] + "</tr>" +
        "          <tr>" + td[1] + "</tr>" +
        "          <tr>" + td[2] + "</tr>" +
        "          <tr>" + td[3] + "</tr>" +
        "          <tr>" + td[4] + "</tr>" +
        "          <tr>" + td[5] + "</tr>" +
        "          <tr>" + td[6] + "</tr>" +
        "          <tr>" + td[7] + "</tr>" +
        "          <tr>" + td[8] + "</tr>" +
        "       </tbody>" +
        "   </table>";
    html += "</div></div>";
    var reviewHtmlParent = displayParent("review_place", "综述");
    var reviewHtmlChild = "<div id='review_place' class='tab-pane fade' name='tab_div'>" + html + "</div>";

    return {"htmlParent": reviewHtmlParent, "htmlChild": reviewHtmlChild};
}

function finishErrorDisplayReview(info, project) {

    var th = "<th>#</th>";
    var td = [];
    td[0] = "<th scope='row'>算法名称</th>";
    td[1] = "<th scope='row'>运行环境</th>";
    td[2] = "<th scope='row'>算法引擎</th>";
    td[3] = "<th scope='row'>算法大小</th>";
    td[4] = "<th scope='row'>数据集</th>";
    td[5] = "<th scope='row'>参数</th>";

    for (var i = 0, len1 = info.length; i < len1; i++) {
        var temp = info[i];
        var algorithm = temp["algorithm"];
        var inputList = temp["inputList"];
        var input = "";

        for (var key in inputList) {
            input += key + " : " + inputList[key] + "<br>";
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

    html += "<table class='table table-hover'>" +
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
    var reviewHtmlParent = displayParent("review_place", "综述");
    var reviewHtmlChild = "<div id='review_place' class='tab-pane fade' name='tab_div'>" + html + "</div>";

    return {"htmlParent": reviewHtmlParent, "htmlChild": reviewHtmlChild};
}


function ajaxError() {
    swal({
        title: "错误!",
        text: "无法连接到服务器",
        type: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '确定',
    });
}

