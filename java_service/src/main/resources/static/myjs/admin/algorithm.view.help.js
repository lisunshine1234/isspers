var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");
$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});

var runInfoSwalWidth = parseInt(window.screen.width * 0.8);
var navigationTypeList = [], algorithmList = [];
<!-- start -->
$(document).ready(function () {
    if ($("#algorithm_page").length > 0) {
        getAlgorithmList();
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


function getAlgorithmList() {
    $.ajax({
        async: true,
        url: "/guteam/admin/algorithm/getAlgorithmList",
        type: "POST",
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在获取算法数据，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            });
        },
        success: function (back) {
            algorithmList = back.algorithmList;
            navigationTypeList = back.navigationTypeList;
            $("#algorithm_page").html(algorithmFrame(algorithmTabHelper()));
            $('#table_place').DataTable(tableOptionHelper(algorithmListFormat(algorithmList)));
            swal.close();
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function algorithmListFormat(algorithmList) {
    var list = [];
    for (var i = 0, len = algorithmList.length; i < len; i++) {
        var state;
        if (!algorithmList[i]["hasFinish"]) {
            state = " <a style='color: deepskyblue;'>未完成</a>";
        } else if (!algorithmList[i]["nonLock"]) {
            state = " <a style='color: red;'>锁定</a>";
        } else if (!algorithmList[i]["pass"]) {
            state = " <a style='color: orange;'>未通过审核</a>";
        } else if (!algorithmList[i]["activate"]) {
            state = " <a style='color: grey;'>未激活</a>";
        } else {
            state = " <a style='color: green;'>可用</a>";
        }
        list.push(["<strong>" + (i + 1) + "</strong>",
            "<a href='javascript:void(0);' style='color: #0b93d5' onclick='getAlgorithmInfoById(\"" + algorithmList[i]["id"] + "\")'>" + algorithmList[i]["algorithmName"] + "</a>",
            algorithmList[i].navigationParent.navigationName,
            algorithmList[i].algorithmEngine,
            algorithmList[i].algorithmSize,
            algorithmList[i].uploadTime,
            algorithmList[i].userName,
            state
        ]);
    }
    return list;
}


function getAlgorithmInfoById(algorithmId) {
    $.ajax({
        async: true,
        url: "/guteam/admin/algorithm/get/info",
        type: "POST",
        data: {"json": JSON.stringify({"algorithmId": algorithmId})},
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
            swal.close();
            if (back["sign"]) {
                swal({
                    html: algorithmInfoCreate(back["algorithm"]),
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: '关闭',
                    width: runInfoSwalWidth
                }).catch(swal.noop);


            } else {
                swal({
                    title: "错误!",
                    text: back["tip"],
                    type: "error",
                    confirmButtonText: "确定",
                });
            }

        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    })

}


function algorithmInfoCreate(back) {
    var algorithm = back;
    var inputList = algorithm["inputList"];
    var outputList = algorithm["outputList"];
    var displayList = algorithm["displayList"];

    var input_tr = "";
    var output_tr = "";
    var display_tr = "";

    for (var a = 0, lena = inputList.length; a < lena; a++) {
        input_tr += "<tr><td>" + inputList[a]["inputKey"] + "</td>" +
            "<td>" + inputList[a]["inputName"] + "</td>" +
            "<td>" + inputList[a]["inputDescribe"] + "</td>" +
            "<td>" + inputList[a]["inputType"]["inputName"] +
            "<a data-toggle='tooltip' data-placement='top' title='" + inputList[a]["inputType"]["inputDescribe"] + "'>  <i class='fa fa-question-circle'></i></a></td>" +
            "<td>" + inputList[a]["required"] + "</td>" +
            "</tr>";
    }

    for (var b = 0, lenb = outputList.length; b < lenb; b++) {
        output_tr += "<tr><td>" + outputList[b]["outputKey"] + "</td>" +
            "<td>" + outputList[b]["outputName"] + "</td>" +
            "<td>" + outputList[b]["outputDescribe"] + "</td>" +
            "<td>" + outputList[b]["outputType"]["outputName"] +
            "<a data-toggle='tooltip' data-placement='top' title='" + outputList[b]["outputType"]["outputDescribe"] + "'>  <i class='fa fa-question-circle'></i></a></td>" +
            "</tr>";
    }

    for (var c = 0, lenc = displayList.length; c < lenc; c++) {
        display_tr += "<tr><td>" + displayList[c]["outputKey"] + "</td>" +
            "<td>" + displayList[c]["displayName"] + "</td>" +
            "<td>" + displayList[c]["displayDescribe"] + "</td>" +
            "<td>" + displayList[c]["displayType"]["displayName"] +
            "<a data-toggle='tooltip' data-placement='top' title='" + displayList[c]["displayType"]["displayDescribe"] + "'>  <i class='fa fa-question-circle'></i></a></td>" +
            "</tr>";
    }

    var my;
    if (algorithm["my"]) {
        my = " <a href='javascript:void(0);' onclick='algorithmMyOut(this)' algorithmId='" + algorithm["id"] + "' data-toggle='tooltip' data-placement='top' title='已收藏'><i class='fa fa-star onstar'></i></a>";
    } else {
        my = " <a href='javascript:void(0);' onclick='algorithmMyIn(this)' algorithmId='" + algorithm["id"] + "' data-toggle='tooltip' data-placement='top' title='未收藏'><i class='fa fa-star-o'></i></a>";
    }
    var html =
        "<div  class='algorithm-href'>" +
        "</div>" +
        "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 algorithm-card-swal'><div class='section-header'>" +
        "<h2>算法基本信息" +
        "<a data-toggle='tooltip' data-placement='top' title='算法的基本信息'>  <i class='fa fa-question-circle'></i>" +
        "</a>" +
        "</h2>" +
        "</div>" +
        "  <div class='section-body'>" +
        "    <div class='algorithm-card-head-swal'>" +
        "       <div class='algorithm-name-swal'>" + algorithm["algorithmName"] + my + "</div>" +
        "       <div class='algorithm-info-swal'><a data-toggle='tooltip' data-placement='top' title='浏览量' ><i  class='fa fa-eye'></i>" + algorithm["visitCount"] + "</a>" +
        "       <a data-toggle='tooltip' data-placement='top' title='使用次数' ><i  class='fa fa-repeat'></i>" + algorithm["useCount"] + "</a>" +
        "       <a data-toggle='tooltip' data-placement='top' title='收藏数量' ><i  class='fa fa-star'></i>" + algorithm["cartCount"] + "</a></div>" +
        "    </div>" +
        "    <div class='algorithm-card-info-swal'>" +
        "        <div>类别：" + algorithm["navigationParent"]["navigationName"] + "</div>" +
        "        <div>引擎：" + algorithm["algorithmEngine"] + "</div>" +
        "        <div>大小：" + algorithm["algorithmSize"] + "</div>" +
        "        <div>拥有者：" + algorithm["userName"] + "</div>" +
        "        <div>上传时间：" + algorithm["uploadTime"] + "</div>" +
        "    </div>" +
        "    <div class='algorithm-card-body-swal'>" +
        "       <p>" + algorithm["algorithmDescribe"] + "</p>" +
        "   </div>" +
        "  </div>" +
        "</div>";

    html += "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 algorithm-card-swal'><div class='section-header'>" +
        "<h2>算法的输入信息" +
        "<a data-toggle='tooltip' data-placement='top' title='算法的输入信息'>  <i class='fa fa-question-circle'></i>" +
        "</a>" +
        "</h2>" +
        "</div>" +
        "<div class='section-body'>" +
        "<table class='table table-hover run-table'>" +
        "<thead><tr><th>关键词</th><th>名称</th><th>名称描述</th><th>类型</th><th>是否为必须</th></tr>" +
        "</thead>" +
        "<tbody>" +
        input_tr +
        "</tbody>" +
        "</table>" +
        "</div>" +
        "</div>";

    html += "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 algorithm-card-swal'><div class='section-header'>" +
        "<h2>算法的输出信息" +
        "<a data-toggle='tooltip' data-placement='top' title='算法的输出信息'>  <i class='fa fa-question-circle'></i>" +
        "</a>" +
        "</h2>" +
        "</div>" +
        "<div class='section-body'>" +
        "<table class='table table-hover run-table'>" +
        "<thead>" +
        "<tr><th>关键词</th><th>名称</th><th>名称描述</th><th>类型</th></tr>" +
        "</thead>" +
        "<tbody>" +
        output_tr +
        "</tbody>" +
        "</table>" +
        "</div>" +
        "</div>";

    html += "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 algorithm-card-swal'><div class='section-header'>" +
        "<h2>算法的可视化展示信息" +
        "<a data-toggle='tooltip' data-placement='top' title='算法的可视化展示信息'>  <i class='fa fa-question-circle'></i></a>" +
        "</h2>" +
        "</div>" +
        "<div class='section-body'>" +
        "<table class='table table-hover run-table'>" +
        "<thead>" +
        "<tr><th>输出关键词</th><th>名称</th><th>名称描述</th><th>类型</th></tr>" +
        "</thead>" +
        "<tbody>" +
        display_tr +
        "</tbody>" +
        "</table>" +
        "</div>" +
        "</div>";

    return html;
}

function algorithmTabHelper() {
    var html = "";
    html += "<ul class='list-group'><div class='form-radio'>";
    html += "<li class='list-group-item'><div class='radio-button'>" +
        "<label><input type='radio' checked='checked' name='radio' onchange='algorithmChooseType(\"all\",\"all\")'>" +
        "<i class='helper'></i>查看所有类别(" + algorithmList.length + ")</label>" +
        "</div>";
    for (var i = 0, len = navigationTypeList.length; i < len; i++) {
        html += "<li class='list-group-item active'>" + navigationTypeList[i]["navigationName"] + "</li>";
        var navigationList = navigationTypeList[i]["navigationParentList"];
        for (var j = 0, len1 = navigationList.length; j < len1; j++) {
            if (j == 0) {
                html += "<li class='list-group-item'><div class='radio-button'><label><input type='radio'  name='radio' onchange='algorithmChooseType(\"" + navigationTypeList[i]["id"] + "\",\"parent\")'><i class='helper'></i>" +
                    "查看所有(" + algorithmList.filter(function (e) {

                        return e.navigationParent.navigationTypeId == navigationTypeList[i].id;
                    }).length + ")</label></div>";
            }
            html += "<li class='list-group-item'><div class='radio-button'><label><input type='radio' name='radio' onchange='algorithmChooseType(\"" + navigationList[j]["id"] + "\",\"child\")'><i class='helper'></i>" +
                navigationList[j]["navigationName"] + "(" + algorithmList.filter(function (e) {
                    return e.navigationParent.id == navigationList[j].id;
                }).length + ")</label></div>";
        }
        html += "</li>";
    }

    html += "<li class='list-group-item active'>算法状态</li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='algorithmChooseType(false,\"hasFinish\")'>" +
        "<i class='helper'></i>未完成" + "(" + algorithmList.filter(function (e) {
            return e.hasFinish == false;
        }).length + ")</label></div></li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='algorithmChooseType(false,\"nonLock\")'>" +
        "<i class='helper'></i>锁定" + "(" + algorithmList.filter(function (e) {
            return e.nonLock == false;
        }).length + ")</label></div></li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='algorithmChooseType(false,\"pass\")'>" +
        "<i class='helper'></i>未通过审核" + "(" + algorithmList.filter(function (e) {
            return e.pass == false;
        }).length + ")</label></div></li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='algorithmChooseType(false,\"activate\")'>" +
        "<i class='helper'></i>未激活" + "(" + algorithmList.filter(function (e) {
            return e.activate == false;
        }).length + ")</label></div></li>" +
        "<li class='list-group-item'><div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='radio' onchange='algorithmChooseType(false,\"normal\")'>" +
        "<i class='helper'></i>可用" + "(" + algorithmList.filter(function (e) {
            return e.hasFinish == true && e.nonLock == true && e.pass == true && e.activate == true;
        }).length + ")</label></div></li>";
    html += "</div></ul>";

    return html;
}

function algorithmChooseType(key, type) {
    var temp;
    if (type == "all") {
        temp = algorithmList;
    } else if (type == "parent") {
        temp = algorithmList.filter(function (e) {
            return e.navigationParent.navigationTypeId == key;
        });
    } else if (type == "child") {
        temp = algorithmList.filter(function (e) {
            return e.navigationParent.id == key;
        });
    } else if (type == "hasFinish") {
        temp = algorithmList.filter(function (e) {
            return e.hasFinish == false;
        });
    } else if (type == "nonLock") {
        temp = algorithmList.filter(function (e) {
            return e.nonLock == false;
        });
    } else if (type == "pass") {
        temp = algorithmList.filter(function (e) {
            return e.pass == false;
        });
    } else if (type == "activate") {
        temp = algorithmList.filter(function (e) {
            return e.activate == false;
        });
    } else if (type == "normal") {
        temp = algorithmList.filter(function (e) {
            return e.hasFinish == true && e.nonLock == true && e.pass == true && e.activate == true;
        });
    }

    $('#table_place').DataTable(tableOptionHelper(algorithmListFormat(temp)));
}

function algorithmFrame(navigationHtml) {
    var frame =
        "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-3'>" +
        navigationHtml +
        "</div>" +
        "<div class='col-lg-9 col-md-9 col-sm-9 col-xs-9'>" +
        "<table class='display algorithm-table' id='table_place'>" +
        "<thead><tr><th scope='row'>#</th><th scope='row'>算法名</th><th scope='row'>类别</th><th scope='row'>引擎</th><th scope='row'>大小</th><th scope='row'>上传时间</th><th scope='row'>拥有者</th><th scope='row'>状态</th></tr></thead></table>" +
        "</div>";
    return frame;
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
