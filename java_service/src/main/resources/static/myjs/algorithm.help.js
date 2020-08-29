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
<!-- start -->
$(document).ready(function () {
    var u = window.location.href.split("/");
    var url = u[u.length - 1];

    if ($("#job_page").length > 0) {
        getJobList();

    }
    if ($("#job_view_page").length > 0) {
        getFinishJobInfo(url);
    }
    if ($("#attribute_page").length > 0) {
        if ($("#algorithmManage").length > 0) {
            document.getElementById("algorithmManage").innerHTML = algorithmWindowModel();
            getAlgorithmList(url);

            $("#algorithmWindowModel").modal(modelOption());
            var interval = setInterval(function () {
                if ($("#algorithmWindowModel").css('display') == 'block') {
                    $.fn.dataTable.tables({visible: false, api: true}).columns.adjust();
                    clearInterval(interval);
                }
            }, 10);
        }
    }
    var interval_1 = setInterval(function () {
        if ($('a[data-toggle="tab"]').length > 0) {
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                $.fn.dataTable.tables({visible: false, api: true}).columns.adjust();
            });
            clearInterval(interval_1);
        }
    }, 10);
});

<!-- common-->
function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

function ajaxError() {
    swal({
        title: "错误!",
        text: "无法连接到服务器",
        type: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '确定',
    })
}

function stringToArrayAndJson(data) {
    if (typeof data == 'object') {
        if (displayCheckArray(data) == true) {
            if (displayCheckOneArray(data) || displayCheckTwoArray(data)) {
                return data;
            }
            for (var i = 0, len = data.length; i < len; i++) {
                if (typeof data[i] == "string") {
                    data[i] = stringToArrayAndJson(data[i]);
                }
            }
        } else {
            for (var key in data) {
                if (typeof data[key] == "string" && displayCheckObject(data[key])) {
                    data[i] = stringToArrayAndJson(data[i]);
                }
            }
        }
    } else if (typeof data == 'string' && displayCheckObject(data)) {
        data = stringToArrayAndJson(JSON.parse(data));
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
        // x.push(i);
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

        // x.push(i);
    }
    for (var j = 1; j <= row_len; j++) {
        // x.push(j);
        y.push("第" + (Array(row_num_len).join('0') + j).slice(-row_num_len) + "行");
    }
    return {"data": data, "x": x, "y": y};
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
                // x.push(j);
            }
            data.x = x;
        }
        if (data.y == null || data.y.length != column_max_len) {
            var y = [];
            var y_num_len = row_max_len.toString().length;
            for (var i = 1; i <= row_max_len; i++) {
                y.push("第" + (Array(y_num_len).join('0') + i).slice(-y_num_len) + "行");
                // y.push(i);
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
                // x.push(i);
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


<!-- algorithm -->
function modelOption() {
    var model = {
        backdrop: false,
        keyboard:false,
    }
    return model;
}

function openAlgorithmWindow() {
    $("#algorithmWindowModel").modal(modelOption());

    $.fn.dataTable.tables({visible: true, api: true}).columns.adjust();
}

function getAlgorithmList(url) {
    var json = {"url": url};
    $.ajax({
        async: true,
        url: "/guteam/algorithm/do/getAlgorithmList",
        type: "POST",
        dataType: "json",
        data: {"json": JSON.stringify(json)},
        timeout: 3000,
        success: function (back) {
            if (back["sign"]) {
                var algorithmBaseList = back["algorithmBaseList"];
                var algorithmCartList = back["algorithmCartList"];
                var algorithmCustomList = back["algorithmCustomList"];
                // tableAlgorithmDestroy($('#algorithm_base'));
                // tableAlgorithmDestroy($('#algorithm_cart'));
                // tableAlgorithmDestroy($('#algorithm_owner'));

                $("#algorithm_base").dataTable().fnDestroy();
                $("#algorithm_cart").dataTable().fnDestroy();
                $("#algorithm_owner").dataTable().fnDestroy();

                $('#algorithm_base').DataTable(algorithmBaseDataTableOption(algorithmBaseData(algorithmBaseList)));
                $('#algorithm_cart').DataTable(algorithmCartDataTableOption(algorithmCartData(algorithmCartList)));
                $('#algorithm_owner').DataTable(algorithmOwnerDataTableOption(algorithmCustomData(algorithmCustomList)));


            } else {
                swal({
                    title: "错误!",
                    text: back["tip"],
                    type: "error",
                    confirmButtonText: '确定',
                })
            }
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    })
}

function chooseAlgorithm() {
    var algorithm_choose = document.getElementsByName("algorithm_choose");
    var len = algorithm_choose.length;
    if (len == 0) {
        swal({
            title: "错误!",
            text: "未选择算法",
            type: "error",
            confirmButtonText: '确定',
        })
    } else {
        var algorithmId;
        var algorithmName;
        var algorithm_model = document.getElementsByName("algorithm_model");
        var num;
        var algorithm_model_split

        for (var i = 0; i < len; i++) {
            if (algorithm_choose[i].checked) {
                algorithmId = algorithm_choose[i].value;
                algorithmName = algorithm_choose[i].getAttribute("algorithmName");
                break;
            }
        }
        if (algorithmId == null) {
            swal({
                title: "错误!",
                text: "未选择算法",
                type: "error",
                confirmButtonText: '确定',
            })
        } else {
            if (algorithm_model.length == 0) {
                num = 1;
            } else {
                algorithm_model_split = algorithm_model[algorithm_model.length - 1].getAttribute("id").split("_");
                num = Number(algorithm_model_split[algorithm_model_split.length - 1]) + 1;
            }

            $("#algorithmWindowModel").modal('hide');
            document.getElementById("attribute_model").innerHTML += algorithmModel(num, algorithmId, algorithmName);

        }

    }


}

function delAlgorithmModel(id, num) {
    swal({
        title: '是否移除?',
        text: "移除该算法模块！",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: '移除',
        cancelButtonText: '取消'
    }).then(function () {
        document.getElementById("algorithmId_" + id + "_" + num).remove();
    });
}

function resetAlgorithmModel() {
    var algorithm_run_now = document.getElementById("algorithm_run_now");
    var algorithm_run_back = document.getElementById("algorithm_run_back");
    var algorithm_run_reset = document.getElementById("algorithm_run_reset");
    algorithm_run_reset.innerHTML = "<i  class='fa fa-spin fa-spinner'></i>执行中";
    algorithm_run_now.setAttribute("disabled", true);
    algorithm_run_back.setAttribute("disabled", true);
    algorithm_run_reset.setAttribute("disabled", true);

    document.getElementById("attribute_model").innerHTML = "";

    algorithm_run_reset.innerHTML = "重置";
    algorithm_run_now.removeAttribute("disabled");
    algorithm_run_back.removeAttribute("disabled");
    algorithm_run_reset.removeAttribute("disabled");
}

function algorithmModel(num, algorithmId, algorithmName) {
    var html = inputListCreate(num, algorithmId, algorithmName);
    return html;
}

function algorithmWindowModel() {
    var html = "" +
        "<div class='modal fade ' id='algorithmWindowModel' >" +
        "   <div class='modal-dialog modal-large'  style='width:80%'>" +
        "       <div class='modal-content modal-content-modal'>" +
        "           <div class='modal-header'>" +
        "               <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
        "                   <span aria-hidden='true'>&times;</span>" +
        "               </button>" +
        "               <h4 class='modal-title'>选择算法</h4>" +
        "           </div>" +
        "           <div class='modal-body' >" +
        "               <div class='border-tab'>" +
        "                   <ul class='nav nav-tabs'>" +
        "                       <li role='presentation' class='active'><a href='#algorithm_base_place' data-toggle='tab'>通用</a></li>" +
        "                       <li role='presentation'><a href='#algorithm_cart_place' data-toggle='tab'>收藏</a></li>" +
        "                       <li role='presentation'><a href='#algorithm_owner_place' data-toggle='tab'>个人</a></li>" +
        "                   </ul>" +
        "                   <div class='tab-content'>" +
        "                       <div id='algorithm_base_place' class='tab-pane fade in active'>" +
        "                               <table id='algorithm_base' class='display'><thead><tr><th></th></tr></thead></table>" +
        "                       </div>" +
        "                       <div id='algorithm_cart_place' class='tab-pane fade'>" +
        "                               <table id='algorithm_cart' class='display'><thead><tr><th></th></tr></thead></table>" +
        "                       </div>" +
        "                       <div id='algorithm_owner_place' class='tab-pane fade'>" +
        "                               <table id='algorithm_owner' class='display'><thead><tr><th></th></tr></thead></table>" +
        "                       </div>" +
        "                   </div>" +
        "               </div>" +
        "           </div>" +
        "           <div class='modal-footer'>" +
        "               <button type='button' class='btn btn-primary float-button-light' onclick='chooseAlgorithm()'>选择</button>" +
        "               <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>" +
        "           </div>" +
        "        </div>" +
        "    </div>" +
        "</div>";
    return html;
}

function algorithmBaseData(data) {
    var back = new Array();
    for (var i = 0, len = data.length; i < len; i++) {
        back[i] = new Array();
        back[i][0] = "<input type='radio' name='algorithm_choose' value='" + data[i]["id"] + "' algorithmName='" + data[i]["algorithmName"] + "'>";
        back[i][1] = "<a href='javascript:void(0);' style='color: #0b93d5' onclick='getAlgorithmInfoById(\"" + data[i]["id"] + "\")'>" + data[i]["algorithmName"] + "</a>";
        back[i][2] = data[i]["algorithmSize"];
        back[i][3] = data[i]["algorithmEnvironment"];
        back[i][4] = data[i]["algorithmEngine"];
        back[i][5] = data[i]["uploadTime"];
        back[i][6] = data[i]["userName"];
    }
    return back;

}

function algorithmCartData(data) {
    var back = new Array();
    for (var i = 0, len = data.length; i < len; i++) {
        back[i] = new Array();
        back[i][0] = "<input type='radio' name='algorithm_choose' value='" + data[i]["id"] + "' algorithmName='" + data[i]["algorithmName"] + "'>";
        back[i][1] = "<a href='javascript:void(0);' style='color: #0b93d5' onclick='getAlgorithmInfoById(\"" + data[i]["id"] + "\")'>" + data[i]["algorithmName"] + "</a>";
        back[i][2] = data[i]["algorithmSize"];
        back[i][3] = data[i]["algorithmEnvironment"];
        back[i][4] = data[i]["algorithmEngine"];
        back[i][5] = data[i]["uploadTime"];
        back[i][6] = data[i]["userName"];
    }
    return back;
}

function algorithmCustomData(data) {
    var back = new Array();
    for (var i = 0, len = data.length; i < len; i++) {
        back[i] = new Array();
        back[i][0] = "<input type='radio' name='algorithm_choose' value='" + data[i]["id"] + "'algorithmName='" + data[i]["algorithmName"] + "'>";
        back[i][1] = "<a href='javascript:void(0);' style='color: #0b93d5' onclick='getAlgorithmInfoById(\"" + data[i]["id"] + "\")'>" + data[i]["algorithmName"] + "</a>";
        back[i][2] = data[i]["algorithmSize"];
        back[i][3] = data[i]["algorithmEnvironment"];
        back[i][4] = data[i]["algorithmEngine"];
        back[i][5] = data[i]["uploadTime"];
        back[i][6] = data[i]["userName"];
    }
    return back;
}

function algorithmBaseDataTableOption(data) {
    var column = "<thead><tr><th></th><th>名称</th><th>大小</th><th>运行环境</th><th>引擎</th><th>修改时间</th><th>拥有者</th></tr>";

    document.getElementById("algorithm_base").innerHTML = column;

    var option = algorithmTableOptionHelper(data);
    return option;
}

function algorithmCartDataTableOption(data) {
    var column = "<thead><tr><th></th><th>名称</th><th>大小</th><th>运行环境</th><th>引擎</th><th>修改时间</th><th>拥有者</th></tr>";

    document.getElementById("algorithm_cart").innerHTML = column;
    var option = algorithmTableOptionHelper(data);
    return option;
}

function algorithmOwnerDataTableOption(data) {
    var column = "<thead><tr><th></th><th>名称</th><th>大小</th><th>运行环境</th><th>引擎</th><th>修改时间</th><th>拥有者</th></tr>";

    document.getElementById("algorithm_owner").innerHTML = column;
    var option = algorithmTableOptionHelper(data);
    return option;
}

function tableAlgorithmDestroy(obj) {
    var table = obj;
    var int_table = obj.DataTable();
    int_table.clear();
    int_table.destroy();
    table.empty();
}

function algorithmTableOptionHelper(data) {
    var option = {
        "data": data,
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
        // "scrollY": "300px",
        "orderCellsTop": true,
        // serverSide : false,
        "language": {//代替表下方的英文页码说明
            "sProcessing": "处理中...",
            "sLengthMenu": "每页 _MENU_ 项",
            "sZeroRecords": "没有匹配结果",
            "sInfo": "总计 _TOTAL_ 个算法。",
            "sInfoEmpty": "当前显示第 0 至 0 项，共 0 项",
            "sInfoFiltered": "(由 _MAX_ 项结果过滤)",
            "sInfoPostFix": "",
            "sSearch": "搜索:",
            "sUrl": "",
            "sEmptyTable": "无算法",
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

function getAlgorithmInfoById(algorithmId) {
    $.ajax({
        async: true,
        url: "/guteam/algorithm/get/info",
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
            if (back["sign"]) {
                swal({
                    html: algorithmInfoCreate(back["algorithm"]),
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: '关闭',
                    width: runInfoSwalWidth,
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
            "<td>" + inputList[a]["required"] + "</td></tr>";
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
        display_tr +=
            "<tr>" +
            "<td>" + displayList[c]["outputKey"] + "</td>" +
            "<td>" + displayList[c]["displayName"] + "</td>" +
            "<td>" + displayList[c]["displayDescribe"] + "</td>" +
            "<td>" + displayList[c]["displayType"]["displayName"] +
            "<a data-toggle='tooltip' data-placement='top' title='" + displayList[c]["displayType"]["displayDescribe"] + "'>  <i class='fa fa-question-circle'></i></a></td>" +
            "</tr>";
    }


    var cart;
    if (algorithm["cart"]) {
        cart = " <a href='javascript:void(0);' onclick='algorithmCartOut(this)' algorithmId='" + algorithm["id"] + "' data-toggle='tooltip' data-placement='top' title='已收藏'><i class='fa fa-star onstar'></i></a>";
    } else {
        cart = " <a href='javascript:void(0);' onclick='algorithmCartIn(this)' algorithmId='" + algorithm["id"] + "' data-toggle='tooltip' data-placement='top' title='未收藏'><i class='fa fa-star-o'></i></a>";
    }
    var html =
        "<div  class='algorithm-href'>" +
        "<a href='javascript:void(0);' onclick='goNewPageViewAlgorithm(" + algorithm["id"] + ")'>转到新的页面查看</a>" +
        "</div>" +
        "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 algorithm-card-swal'><div class='section-header'>" +
        "<h2>算法基本信息" +
        "<a data-toggle='tooltip' data-placement='top' title='算法的基本信息'>  <i class='fa fa-question-circle'></i>" +
        "</a>" +
        "</h2>" +
        "</div>" +
        "  <div class='section-body'>" +
        "    <div class='algorithm-card-head-swal'>" +
        "       <div class='algorithm-name-swal'>" + algorithm["algorithmName"] + cart + "</div>" +
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
        "<tr><th>关键词</th><th>名称</th><th>名称描述</th><th>类型</th></tr>" +
        "</thead>" +
        "<tbody>" +
        display_tr +
        "</tbody>" +
        "</table>" +
        "</div>" +
        "</div>";

    return html;
}

function algorithmCartIn(obj) {
    var algorithmId = obj.getAttribute("algorithmId");
    $.ajax({
        async: true,
        url: "/guteam/cart/do/in",
        type: "POST",
        data: {"json": JSON.stringify({"algorithmId": algorithmId})},
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在收藏中，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            })
        },
        success: function (back) {
            swal.close();
            if (back["sign"]) {
                swal({
                    title: "成功!",
                    text: back["tip"],
                    type: "success",
                    confirmButtonText: "确定",
                });
                obj.getElementsByTagName("i")[0].setAttribute("class", "fa fa-star onstar")
                obj.setAttribute("onclick", "algorithmCartOut(this)")
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

function algorithmCartOut(obj) {
    var algorithmId = obj.getAttribute("algorithmId");
    $.ajax({
        async: true,
        url: "/guteam/cart/do/out",
        type: "POST",
        data: {"json": JSON.stringify({"algorithmId": algorithmId})},
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在取消收藏中，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            })
        },
        success: function (back) {
            swal.close();
            if (back["sign"]) {
                swal({
                    title: "成功!",
                    text: back["tip"],
                    type: "success",
                    confirmButtonText: "确定",
                });
                obj.getElementsByTagName("i")[0].setAttribute("class", "fa fa-star-o")
                obj.setAttribute("onclick", "algorithmCartIn(this)")
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

<!-- input -->
function getInputList(algorithmId) {
    var json = {"algorithmId": algorithmId};
    var inputList;
    $.ajax({
        async: false,
        url: "/guteam/input/getInputList",
        type: "POST",
        dataType: "json",
        data: {"json": JSON.stringify(json)},
        timeout: 3000,
        success: function (back) {
            inputList = back["inputList"];
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
    return inputList;
}

function inputListCreate(num, algorithmId, algorithmName) {

    var inputList = getInputList(algorithmId);

    var html = "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 algorithm-model' id='" + "algorithmId_" + algorithmId + "_" + num + "' name='algorithm_model'><div class='section-header' ><h2>"
        + algorithmName + "<a data-toggle='tooltip' data-placement='top' title='展示算法的基本信息和运行过程中的记录信息'>  <i class='fa fa-question-circle'> </i></a>" +
        "<a href='javascript:void(0)' style='font-size: 15px;float: right' onclick='delAlgorithmModel(" + algorithmId + "," + num + ")'><i class='fa fa-times-circle'> </i> 移除</a>" +
        "</h2></div><div class='section-body'><form id='attribute_" + algorithmId + "_" + num + "' method='POST' enctype='multipart/form-data'><div class='modal-body'>";

    // var html = "<div id='" + "algorithmId_" + algorithmId + "_" + num + "' name='algorithm_model'><div><h2 >" +
    //     algorithmName + "<a href='javascript:void(0)' style='font-size: 15px;float: right' onclick='delAlgorithmModel(" + algorithmId + "," + num + ")'>" +
    //     "<i class='fa fa-times-circle'></i> 移除</a></h2></div><div>" +
    //     "<form id='attribute_" + algorithmId + "_" + num + "' method='POST' enctype='multipart/form-data'><div class='modal-body'>";

    for (var i = 0, len = inputList.length; i < len; i++) {
        switch (inputList[i].inputType.inputKey) {
            case "file":
                html += inputFileModel(inputList[i], num);
                break;
            case "set":
                html += inputFileModel(inputList[i], num);
                break;
            case "input":
                html += inputInputModel(inputList[i], num);
                break;
            case "radio":
                html += inputRadioModel(inputList[i], num);
                break;
            case "checkbox":
                html += inputCheckBoxModel(inputList[i], num);
                break;
            case "select":
                html += inputDropDownModel(inputList[i], num);
                break;
            default:
                break;
        }
    }
    html += "</div></form></div></div>";
    return html;
}

function inputFileModel(input, num) {
    var html = "";
    if (input.required) {
        html += "<label name='" + "algorithmId_" + input.algorithmId + "_" + num + "' inputKeyNum='" + "input_" + input.inputKey + "_" + num + "' required='1'>" + input.inputKey + "(" + input.inputName + ")" + "<a data-toggle='tooltip' data-placement='top' title='" + input.inputDescribe + "'>  <i class='fa fa-question-circle'></i></a></label>";
    } else {
        html += "<label name='" + "algorithmId_" + input.algorithmId + "_" + num + "' inputKeyNum='" + "input_" + input.inputKey + "_" + num + "' required='0'>" + input.inputKey + "(" + input.inputName + ")" + "<a data-toggle='tooltip' data-placement='top' title='" + input.inputDescribe + "'>  <i class='fa fa-question-circle'></i></a></label>";
    }
    html +=
        "<div class='form-group'>" +
        "    <div class='input-group '>" +
        "         <input type='text' class='form-control' inputType='" + input.inputType.inputKey + "' name='" + "input_" + input.inputKey + "_" + num + "' id='" + "input_" + input.inputKey + "_" + num + "' path='/' onblur='checkInputFile(this)'>" +
        "         <span class='input-group-btn'><button class='btn btn-default' type='button' goal='" + "input_" + input.inputKey + "_" + num + "' onclick='fileList(this)'>...</button></span>" +
        "    </div>" +
        "    <div id='" + "matPlace_input_" + input.inputKey + "_" + num + "'></div>" +
        "</div>";

    return html;
}

function inputInputModel(input, num) {
    var html = "";
    if (input.required) {
        html += "<label name='" + "algorithmId_" + input.algorithmId + "_" + num + "' inputKeyNum='" + "input_" + input.inputKey + "_" + num + "' required='1'>" + input.inputKey + "(" + input.inputName + ")" + "<a data-toggle='tooltip' data-placement='top' title='" + input.inputDescribe + "'>  <i class='fa fa-question-circle'></i></a></label>";
    } else {
        html += "<label name='" + "algorithmId_" + input.algorithmId + "_" + num + "' inputKeyNum='" + "input_" + input.inputKey + "_" + num + "' required='0'>" + input.inputKey + "(" + input.inputName + ")" + "<a data-toggle='tooltip' data-placement='top' title='" + input.inputDescribe + "'>  <i class='fa fa-question-circle'></i></a></label>";
    }
    html += "<div class='form-group'>" +
        "    <input type='text' inputType='" + input.inputType.inputKey + "' class='form-control' name='" + "input_" + input.inputKey + "_" + num + "'>" +
        "</div>";
    return html;
}

function inputRadioModel(input, num) {
    var html = "";
    if (input.required) {
        html += "<label name='" + "algorithmId_" + input.algorithmId + "_" + num + "' inputKeyNum='" + "input_" + input.inputKey + "_" + num + "' required='1'>" + input.inputKey + "(" + input.inputName + ")" + "<a data-toggle='tooltip' data-placement='top' title='" + input.inputDescribe + "'>  <i class='fa fa-question-circle'></i></a></label>";
    } else {
        html += "<label name='" + "algorithmId_" + input.algorithmId + "_" + num + "' inputKeyNum='" + "input_" + input.inputKey + "_" + num + "' required='0'>" + input.inputKey + "(" + input.inputName + ")" + "<a data-toggle='tooltip' data-placement='top' title='" + input.inputDescribe + "'>  <i class='fa fa-question-circle'></i></a></label>";
    }
    html += "<div class='control-group'>";
    var inputJson = JSON.parse(input.inputJson);

    var i = 0;
    for (var key in inputJson) {
        html += "<label class='control control-radio control-inline'>" + inputJson[key] +
            "    <input type='radio' inputType='" + input.inputType.inputKey + "' jsonKey='" + key + "' name='" + "input_" + input.inputKey + "_" + num + "'";
        if (i == 0) {
            html += "checked='checked' />";
        } else {
            html += " />";
        }
        html += "<span class='control-indicator'></span></label>";
        i++;
    }

    html += "</div>";
    return html;
}

function inputCheckBoxModel(input, num) {
    var html = "";
    if (input.required) {
        html += "<label name='" + "algorithmId_" + input.algorithmId + "_" + num + "' inputKeyNum='" + "input_" + input.inputKey + "_" + num + "' required='1'>" + input.inputKey + "(" + input.inputName + ")" + "<a data-toggle='tooltip' data-placement='top' title='" + input.inputDescribe + "'>  <i class='fa fa-question-circle'></i></a></label>";
    } else {
        html += "<label name='" + "algorithmId_" + input.algorithmId + "_" + num + "' inputKeyNum='" + "input_" + input.inputKey + "_" + num + "' required='0'>" + input.inputKey + "(" + input.inputName + ")" + "<a data-toggle='tooltip' data-placement='top' title='" + input.inputDescribe + "'>  <i class='fa fa-question-circle'></i></a></label>";
    }

    var inputJson = JSON.parse(input.inputJson);
    var i = 0;
    var li_html = "";
    for (var key in inputJson) {
        li_html += "<label class='control control-radio control-inline checkbox' style='padding-right: 15px;'>" + inputJson[key] +
            "<input type='checkbox' " +
            "jsonKey='" + key + "' " +
            "inputType='" + input.inputType.inputKey + "' " +
            "name='" + "input_" + input.inputKey + "_" + num + "' " +
            "inputKey='" + input.inputKey + "'>" +
            "<i class='helper'></i></label>";
        i++;
    }

    html +=
        "<div class='control-group'>" +
        li_html +
        "</div>"
    return html;

}

function inputDropDownModel(input, num) {
    var html = "<div class='form-group'>";

    if (input.required) {
        html += "<select id='input_" + input.inputKey + "_" + num + "' name='algorithmId_" + input.algorithmId + "_" + num + "' class='form-control select-control' required='1'>";

    } else {
        html += "<select id='input_" + input.inputKey + "_" + num + "' name='algorithmId_" + input.algorithmId + "_" + num + "' class='form-control select-control' required='0'>";

    }

    var inputJson = JSON.parse(input.inputJson);
    for (var key in inputJson) {
        html += "<option value='" + key + "'>" + inputJson[key] + "</option>";
    }
    html += "</select></div>";
    return html;
}

function splitKeyNum(key_num) {
    var key_num_split = key_num.split("_");
    var num = key_num_split[key_num_split.length - 1];
    var label = key_num_split[0];

    var key = key_num.substring((label.length + 1), (key_num.length - 1 - num.length));
    return {"key": key, "num": num, "label": label};
}

function getInputAndVali() {
    var algorithm_model = document.getElementsByName("algorithm_model");

    var algorithmList = [];
    for (var i = 0, len = algorithm_model.length; i < len; i++) {
        var algorithm = {};
        var algorithm_model_id = algorithm_model[i].getAttribute("id");
        var algorithm_attribute_inputKeys = document.getElementsByName(algorithm_model_id);

        var algorithm_id_num = splitKeyNum(algorithm_model_id);
        var algorithm_id = algorithm_id_num.key;
        var num = algorithm_id_num.num;

        var attribute = {};
        var matKey = {};
        for (var j = 0, len1 = algorithm_attribute_inputKeys.length; j < len1; j++) {
            var inputKeyNum = algorithm_attribute_inputKeys[j].getAttribute("inputKeyNum");
            var algorithm_attribute = document.getElementsByName(inputKeyNum);
            var required = algorithm_attribute_inputKeys[j].getAttribute("required");
            var input_key_num = splitKeyNum(inputKeyNum);
            var input_key = input_key_num.key;
            switch (algorithm_attribute[0].getAttribute("inputType")) {
                case "file":
                    var value = algorithm_attribute[0].value;
                    if (required == "1" && value.length == 0) {
                        swal({
                            title: "错误!",
                            text: input_key + "属性不能为空！",
                            type: 'error',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: '确定',
                        });
                        algorithm_attribute[0].focus();
                        return {"sign": false};
                    }
                    var fileSplit = value.split(".");
                    var fileType = fileSplit[fileSplit.length - 1];
                    if (fileType == "mat") {
                        var fileJsonKey = document.getElementById("mat_" + inputKeyNum).valueOf();
                        if (fileJsonKey == "" || fileJsonKey == null) {
                            swal({
                                title: "错误!",
                                text: "请选择" + input_key + "属性的mat文件下使用的数据集！",
                                type: 'error',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: '确定',
                            });
                            algorithm_attribute[0].focus();
                            return {"sign": false};
                        }
                        matKey[input_key] = fileJsonKey;
                    }
                    attribute[input_key] = value;
                    break;
                case "set":
                    var value = algorithm_attribute[0].value;
                    if (required == "1" && value.length == 0) {
                        swal({
                            title: "错误!",
                            text: input_key + "属性不能为空！",
                            type: 'error',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: '确定',
                        });
                        algorithm_attribute[0].focus();
                        return {"sign": false};
                    }
                    var fileSplit = value.split(".");
                    var fileType = fileSplit[fileSplit.length - 1];
                    if (fileType == "mat") {
                        var fileJsonKey = document.getElementById("mat_" + inputKeyNum).valueOf();
                        if (fileJsonKey == "" || fileJsonKey == null) {
                            swal({
                                title: "错误!",
                                text: "请选择" + input_key + "属性的mat文件下使用的数据集！",
                                type: 'error',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: '确定',
                            });
                            algorithm_attribute[0].focus();
                            return {"sign": false};
                        }
                        matKey[input_key] = fileJsonKey;
                    }
                    attribute[input_key] = value;
                    break;
                case "input":
                    var value = algorithm_attribute[0].value;
                    if (required == "1" && value.length == 0) {
                        swal({
                            title: "错误!",
                            text: input_key + "属性不能为空！",
                            type: 'error',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: '确定',
                        });
                        algorithm_attribute[0].focus();
                        return {"sign": false};
                    }
                    attribute[input_key] = algorithm_attribute[0].value;
                    break;
                case "radio":
                    var value = "";

                    for (var k = 0, len2 = algorithm_attribute.length; k < len2; k++) {
                        if (algorithm_attribute[k].checked) {
                            value = algorithm_attribute[k].getAttribute("jsonKey");
                            break;
                        }
                    }
                    if (required == "1" && value.length == 0) {
                        swal({
                            title: "错误!",
                            text: input_key + "属性不能为空！",
                            type: 'error',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: '确定',
                        });
                        algorithm_attribute[0].focus();
                        return {"sign": false};
                    }
                    attribute[input_key] = value;
                    break;
                case "checkbox":
                    var value = "";
                    for (var k = 0, len2 = algorithm_attribute.length; k < len2; k++) {
                        if (algorithm_attribute[k].checked) {
                            if (k != 0) {
                                value += ",";
                            }
                            value += algorithm_attribute[k].getAttribute("jsonKey");
                        }
                    }
                    if (required == "1" && value.length == 0) {
                        swal({
                            title: "错误!",
                            text: input_key + "属性不能为空！",
                            type: 'error',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: '确定',
                        });
                        algorithm_attribute[0].focus();
                        return {"sign": false};
                    }
                    attribute[input_key] = value;
                    break;
                case "dropdown":
                    var value = "";
                    value = algorithm_attribute[0].valueOf();
                    if (required == "1" && value.length == 0) {
                        swal({
                            title: "错误!",
                            text: input_key + "属性不能为空！",
                            type: 'error',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: '确定',
                        });
                        algorithm_attribute[0].focus();
                        return {"sign": false};
                    }
                    attribute[input_key] = value;
                    break;
                default:
                    swal({
                        title: "错误!",
                        text: input_key + "未知类型！",
                        type: 'error',
                        confirmButtonColor: '#3085d6',
                        confirmButtonText: '确定',
                    });
                    algorithm_attribute[0].focus();
                    return {"sign": false};
            }

        }
        algorithm["inputList"] = attribute;
        algorithm["algorithm_id"] = algorithm_id;
        algorithm["matKey"] = matKey;
        algorithmList.push(algorithm)
    }
    return {"sign": true, "algorithmList": algorithmList};
}

function checkInputFile(obj) {
    var file = obj.value;
    if (file != null && file != "") {
        var sign = false;
        sign = checkInputFileExist(file);
        if (!sign) {
            swal({
                text: "文件不存在！",
                type: 'error',
                confirmButtonColor: '#3085d6',
                confirmButtonText: '确定',
            })
            return sign;
        }
        inputMatHelper(file, obj.getAttribute("id"));
    }
}

function inputMatHelper(file, id) {
    var fileSplit = file.split(".");
    var fileType = fileSplit[fileSplit.length - 1];
    var keyList;
    if (fileType == "mat") {
        $.ajax({
            async: false,
            url: "/guteam/file/getMatKey",
            type: "POST",
            dataType: "JSON",
            data: {"json": JSON.stringify({"file": file})},
            timeout: 3000,
            success: function (back) {
                keyList = back["keyList"]
                var html = matDropDownHelper(keyList, id);
                document.getElementById("matPlace_" + id).innerHTML = html;

            },
            error: function (XMLHttpRequest, statusText) {
                ajaxError();
            }
        });
    } else {
        document.getElementById("matPlace_" + id).innerHTML = "";
    }
}

function matDropDownHelper(keyList, id) {
    var html =
        "<label style='padding-right: 10px'>变量名<a data-toggle='tooltip' data-placement='top' title='请选择mat文件中的变量名'>  <i class='fa fa-question-circle'></i></a></label>" +
        "<div class='form-group'>" +
        "<select id='mat_" + id + "' class='form-control select-control'>";
    for (var i = 0, len = keyList.length; i < len; i++) {
        html += "<option value='" + keyList[i] + "'>" + keyList[i] + "</option>";
    }
    html += "</select></div>";
    return html;
}

function checkInputFileExist(file) {
    var sign = false;
    $.ajax({
        async: false,
        url: "/guteam/file/checkExist",
        type: "POST",
        dataType: "JSON",
        data: {"json": JSON.stringify({"file": file})},
        timeout: 3000,
        success: function (back) {
            sign = back;
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    })
    return sign;
}

<!-- algorithm run -->
function syncRunAlgorithm() {
    var algorithm_run_now = document.getElementById("algorithm_run_now");
    var algorithm_run_back = document.getElementById("algorithm_run_back");
    var algorithm_run_reset = document.getElementById("algorithm_run_reset");
    algorithm_run_now.innerHTML = "<i  class='fa fa-spin fa-spinner'></i>执行中";
    algorithm_run_now.setAttribute("disabled", true);
    algorithm_run_back.setAttribute("disabled", true);
    algorithm_run_reset.setAttribute("disabled", true);

    var inputList = getInputAndVali();
    if (inputList.sign) {
        var algorithmList = inputList.algorithmList;
        $.ajax({
            async: true,
            url: "/guteam/job/do/run",
            type: "POST",
            data: {"json": JSON.stringify({"algorithmList": algorithmList})},
            beforeSend: function () {
                swal({
                    html: "<i  class='fa fa-spin fa-spinner'></i>正在发送请求，请稍等...",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                })
            },
            success: function (back) {
                getSyncRunJobInfo(back);
            },
            error: function (XMLHttpRequest, statusText) {
                ajaxError();
            }
        })
    }

}

function asyncRunAlgorithm() {
    var algorithm_run_now = document.getElementById("algorithm_run_now");
    var algorithm_run_back = document.getElementById("algorithm_run_back");
    var algorithm_run_reset = document.getElementById("algorithm_run_reset");
    algorithm_run_back.innerHTML = "<i  class='fa fa-spin fa-spinner'></i>执行中";
    algorithm_run_now.setAttribute("disabled", true);
    algorithm_run_back.setAttribute("disabled", true);
    algorithm_run_reset.setAttribute("disabled", true);
    var inputList = getInputAndVali();
    if (inputList.sign) {
        var algorithmList = inputList.algorithmList;
        $.ajax({
            async: true,
            url: "/guteam/job/do/run",
            type: "POST",
            data: {"json": JSON.stringify({"algorithmList": algorithmList})},

            beforeSend: function () {
                swal({
                    html: "<i  class='fa fa-spin fa-spinner'></i>正在发送请求，请稍等...",
                    allowOutsideClick: false,
                    allowEscapeKey: false,
                    showConfirmButton: false,
                })
            },
            success: function (back) {
                var algorithm_run_now = document.getElementById("algorithm_run_now");
                var algorithm_run_back = document.getElementById("algorithm_run_back");
                var algorithm_run_reset = document.getElementById("algorithm_run_reset");
                algorithm_run_back.innerHTML = "后台执行";
                algorithm_run_now.removeAttribute("disabled");
                algorithm_run_back.removeAttribute("disabled");
                algorithm_run_reset.removeAttribute("disabled");
                swal({
                    title: "任务开始执行",
                    text: "是否跳转到任务页面查看任务详情？",
                    type: 'success',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: '跳转',
                    cancelButtonText: '关闭'
                }).then(function () {
                    window.location.href = "/guteam/job";
                });

            },
            error: function (XMLHttpRequest, statusText) {
                ajaxError();
            }
        })
    }

}

<!-- display -->
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
}

function finishDisplayAlgorithm(back) {
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

function runDisplayRunInfo() {
    var htmlParent = displayParent("run_info_run", "运行");
    var htmlChild = "<div id='run_info_run' class='tab-pane fade in active' name='tab_div'><div class='col-lg-12 col-md-12 col-sm-12 col-xs-12'>" +
        "<div class='section-header'><h2>控制台信息<a data-toggle='tooltip' data-placement='top' title='展示算法的运行过程中的控制台信息'>  " +
        "<i class='fa fa-question-circle'></i></a></h2></div><div class='section-body'>" +
        "<div class='runInfo' style='height:" + runInfoDivHeight + "px;' id='runInfo'></div></div></div></div>";

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


<!-- job -->
function getAsyncJobInfo(obj) {
    var jobId = obj.innerText;
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
                window.location.href = "/guteam/job/view/" + jobId;
            }
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    })
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

function jobStop(jobId) {
    swal({
        title: "是否确定!",
        text: "确定后将会终止算法的运行",
        type: 'warning',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '确定',
        showCancelButton: true,
        cancelButtonColor: '#d33',
        cancelButtonText: '取消',
    }).then(function () {
        websocket.close();
        shutdownJob(jobId);
    });
}

function jobWebSocketClose() {
    websocket.close();
}

function getSyncRunJobInfo(jobId) {
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
                var algorithm_run_now = document.getElementById("algorithm_run_now");
                var algorithm_run_back = document.getElementById("algorithm_run_back");
                var algorithm_run_reset = document.getElementById("algorithm_run_reset");
                algorithm_run_now.innerHTML = "执行";
                algorithm_run_now.removeAttribute("disabled");
                algorithm_run_back.removeAttribute("disabled");
                algorithm_run_reset.removeAttribute("disabled");

                jobModal(back, jobId);
                swal.close();
                $("#jobModal").modal(modelOption());

                $('#runInfo').slimScroll({
                    alwaysVisible: true,
                    height: runInfoDivHeight,
                });
                document.getElementById("run_info_run_parent").click();

                setSyncMessageInHtml("<br><font style='color:black;'>正在与服务器建立连接...</font><br>");

                websocket = new WebSocket("ws://localhost/guteam/webSocket/algorithm/run/sync/" + jobId);

                websocket.onopen = function () {
                    setSyncMessageInHtml("<font style='color:black;'>与服务器连接成功！</font><br>")
                };
                window.onbeforeunload = function () {
                    websocket.close();
                };
                websocket.onmessage = function (event) {
                    setSyncMessageInHtml(event.data, jobId);
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

function shutdownJob(jobId) {
    $.ajax({
        async: true,
        url: "/guteam/job/shutdown",
        type: "POST",
        data: {"json": JSON.stringify({"jobId": jobId})},
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在终止算法，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            })
        },
        success: function (back) {
            if (back["sign"]) {
                swal({
                    title: "成功!",
                    text: back["tip"],
                    type: "success",
                    confirmButtonText: "确定",
                });
            } else {
                swal({
                    title: "失败!",
                    text: back["tip"],
                    type: "error",
                    confirmButtonText: "确定",
                })
            }

        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    })
}

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
            console.log(back)
            swal.close();
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

function webSocketSend(msg) {
    websocket.addEventListener('open', function () {
        websocket.send(msg)
    });
}

function setSyncMessageInHtml(message, jobId) {
    if (message == "#done") {
        websocket.close();
        document.getElementById('run_sign_title').innerHTML = "<i class='fa fa-check' style='color: green;'></i> 执行结束!";

        getFinishJobInfo(jobId);
    } else {
        var runinfo = document.getElementById('runInfo');
        var sign = false;
        // $('#runInfo').slimScroll.slimScroll().bind('slimscroll', function(e, pos){
        //     sign = true;
        // });
        if (runinfo.scrollTop + runInfoDivHeight >= runinfo.scrollHeight * 0.98) {
            sign = true;
        }
        document.getElementById('runInfo').innerHTML += message;
        if (sign) {
            runinfo.scrollTop = runinfo.scrollHeight;
        }
    }
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

function getJobList() {
    $.ajax({
        async: true,
        url: "/guteam/job/getJobList",
        type: "POST",
        dataType: "json",
        timeout: 3000,
        success: function (back) {
            if (back["sign"]) {
                var jobList = back["jobList"];
                jobTabHelper(jobList);
            } else {
                swal({
                    title: "错误!",
                    text: back["tip"],
                    type: "error",
                    confirmButtonText: '确定',
                }).then(function () {
                    window.location.href = "/guteam/login";
                })
            }
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    })
}

function jobTabHelper(jobList) {
    var job_run = [], job_lock = [], job_error = [], job_finish = [], job_all = [], job_shutdown = [];
    var tab_parent = "";
    var tab_child = "";

    for (var j = 0, len1 = jobList.length; j < len1; j++) {
        if (jobList[j]["algorithmList"].length > 10) {
            jobList[j]["algorithmList"] = "<a data-toggle='tooltip' data-placement='top' title='" + jobList[j]["algorithmList"] + "'>" + jobList[j]["algorithmList"].substr(0, 10) + "...</a>";

        } else {
            jobList[j]["algorithmList"] = "<a data-toggle='tooltip' data-placement='top' title='" + jobList[j]["algorithmList"] + "'>" + jobList[j]["algorithmList"].substr(0, 10) + "</a>";
        }
    }


    for (var i = 0, len = jobList.length; i < len; i++) {
        var job = jobList[i];
        if (!job["nonLock"]) {
            var a = ["<a href='javascript:void(0);' style='color: #0b93d5' onclick='getAsyncJobInfo(this)'>" + job["id"] + "</a>", job["algorithmList"], job["navigationName"], job["createTime"], "<i class='fa fa-lock' style='color: orange;'></i> 锁定"];
            job_all.push(a.slice());
            job_lock.push(a.slice());
        } else if (job["shutdown"]) {
            var b = ["<a href='javascript:void(0);' style='color: #0b93d5' onclick='getAsyncJobInfo(this)'>" + job["id"] + "</a>", job["algorithmList"], job["navigationName"], job["createTime"], "<i class='fa fa-times' style='color: red;'></i> 程序终止"];
            job_all.push(b.slice());
            job_shutdown.push(b.slice());
        } else if (job["run"]) {
            var c = ["<a href='javascript:void(0);' style='color: #0b93d5' onclick='getAsyncJobInfo(this)'>" + job["id"] + "</a>", job["algorithmList"], job["navigationName"], job["createTime"], "<i class='fa fa-spin fa-spinner'></i> 正在运行"];
            job_all.push(c.slice());
            job_run.push(c.slice());
        } else if (job["error"]) {
            var d = ["<a href='javascript:void(0);' style='color: #0b93d5' onclick='getAsyncJobInfo(this)'>" + job["id"] + "</a>", job["algorithmList"], job["navigationName"], job["createTime"], "<i class='fa fa-times' style='color: red;'></i> 错误"];
            job_error.push(d.slice());
            job_all.push(d.slice());
        } else if (job["finish"]) {
            var e = ["<a href='javascript:void(0);' style='color: #0b93d5' onclick='getAsyncJobInfo(this)'>" + job["id"] + "</a>", job["algorithmList"], job["navigationName"], job["createTime"], "<i class='fa fa-check' style='color: green;'></i> 完成"];
            job_finish.push(e.slice());
            job_all.push(e.slice());
        }
    }
    tab_parent += jobTabParentHelp("all", "所有任务", "active");
    tab_parent += jobTabParentHelp("run", "正在运行任务", "");
    tab_parent += jobTabParentHelp("finish", "完成任务", "");
    tab_parent += jobTabParentHelp("error", "错误任务", "");
    tab_parent += jobTabParentHelp("lock", "锁定任务", "");
    tab_parent += jobTabParentHelp("shutdown", "终止任务", "");

    tab_child += jobTabChildHelp("all", "tab-pane fade in active");
    tab_child += jobTabChildHelp("run", "tab-pane fade in");
    tab_child += jobTabChildHelp("finish", "tab-pane fade in");
    tab_child += jobTabChildHelp("error", "tab-pane fade in");
    tab_child += jobTabChildHelp("lock", "tab-pane fade in");
    tab_child += jobTabChildHelp("shutdown", "tab-pane fade in");

    document.getElementById("tab_parent").innerHTML = tab_parent;
    document.getElementById("tab_child").innerHTML = tab_child;

    $('#jobTable_all').DataTable(jobTableOptionHelper(job_all, "all"));
    $('#jobTable_run').DataTable(jobTableOptionHelper(job_run, "run"));
    $('#jobTable_finish').DataTable(jobTableOptionHelper(job_finish, "finish"));
    $('#jobTable_error').DataTable(jobTableOptionHelper(job_error, "error"));
    $('#jobTable_lock').DataTable(jobTableOptionHelper(job_lock, "lock"));
    $('#jobTable_shutdown').DataTable(jobTableOptionHelper(job_shutdown, "shutdown"));
}

function jobTabParentHelp(id, name, c) {
    return "<li role='presentation' class='" + c + "'><a href='#job_" + id + "' data-toggle='tab'>" + name + "</a></li>";
}

function jobTabChildHelp(id, c) {
    var html =
        "<div id='job_" + id + "' class='" + c + "'>" +
        "<table id='" + "jobTable_" + id + "' class='display' ><thead id='jobTableThead_" + id + "'><tr><th></th></tr></thead><tfoot id='jobTableTfoot_" + id + "'></tfoot></table>" +
        "</div>";
    return html;
}

function jobTableOptionHelper(data, id) {
    var data_temp = data.slice();
    var column = "<tr><th scope='row'>#</th><th scope='row'>任务名称</th><th scope='row'>使用算法</th><th scope='row'>所属类别</th><th scope='row'>开始时间</th><th scope='row'>状态</th></tr>";

    if (data.length > 0) {
        for (var j = 0, len1 = data_temp.length; j < len1; j++) {
            data_temp[j].unshift("<strong>" + (j + 1) + "</strong>")
        }
    }
    document.getElementById("jobTableThead_" + id).innerHTML = column;
    document.getElementById("jobTableTfoot_" + id).innerHTML = column;
    var option = {
        "data": data_temp,
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

function swalHelper(title, text, type, id) {
    swal({
        title: title,
        text: text,
        type: type,
        showConfirmButton: false,
        showCancelButton: true,
        cancelButtonColor: '#3085d6',
        cancelButtonText: '确定',
    }).then(function (isConfirm) {
        $('html,body').animate({scrollTop: $('#' + id).offset().top - 50}, 1000);
    }, function (dismiss) {
        $('html,body').animate({scrollTop: $('#' + id).offset().top - 50}, 1000);
    }).catch(swal.noop);
}

function myValidata(value, key, min_len, max_len, name, id) {
    if (min_len < 0) {
        min_len = 0;
    }
    if (max_len < 0) {
        max_len = -1
    }

    if (typeof value == "object") {
        if (value.length < min_len) {
            swalHelper("错误", name + "至少选择" + min_len + "个", "error", id);
            return false;
        }
        if (max_len > 0 && value.length > max_len) {
            swalHelper("错误", name + "至多选择" + max_len + "个", "error", id);
            return false;
        }
    } else {
        if (value.length < min_len) {
            swalHelper("错误", name + "的最小长度为" + min_len, "error", id);
            return false;
        }
        if (max_len > 0 && value.length > max_len) {
            swalHelper("错误", name + "的最大长度为" + max_len, "error", id);
            return false;
        }
    }

    var englishKey = new RegExp("[0-9a-zA-Z_]*");
    var chineseKey = new RegExp("[\u0391-\uFFE5_]*");
    var chineseAndEnglishKey = new RegExp("[0-9a-zA-Z\u0391-\uFFE5_]*");
    switch (key) {
        case "englishKey":
            if (englishKey.test(value)) {
                return true;
            } else {
                swalHelper("错误", name + "的输入只能为大小写字母以及下划线" + max_len, "error", id);
                return false;
            }
        case "chineseKey":
            if (chineseKey.test(value)) {
                return true;
            } else {
                swalHelper("错误", name + "的输入只能为中文以及下划线" + max_len, "error", id);
                return false;
            }
        case "chineseAndEnglishKey" || "englishAndChineseKey":
            if (chineseAndEnglishKey.test(value)) {
                return true;
            } else {
                swalHelper("错误", name + "的输入只能为中文、大小写字母以及下划线" + max_len, "error", id);
                return false;
            }
        case "none":
            return true;
        case "json":
            return isJSON(value);
        default:
            return false;

    }
}
