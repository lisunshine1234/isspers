var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});
var algorithmList;
var algorithmListAll;
var runInfoSwalWidth = parseInt(window.screen.width * 0.8);
$(document).ready(function () {
    var u = window.location.href.split("/");
    var url = u[u.length - 1];
    getAlgorithmInfoById(url);
});


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
                document.getElementById("algorithm_view_place").innerHTML = algorithmInfoCreate(back["algorithm"]);
                swal.close();
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
            "<a data-toggle='tooltip' data-placement='top' title='"+inputList[a]["inputType"]["inputDescribe"]+"'>  <i class='fa fa-question-circle'></i></a></td>" +
            "<td>" + inputList[a]["required"] + "</td></tr>";
    }

    for (var b = 0, lenb = outputList.length; b < lenb; b++) {
        output_tr += "<tr><td>" + outputList[b]["outputKey"] + "</td>" +
            "<td>" + outputList[b]["outputName"] + "</td>" +
            "<td>" + outputList[b]["outputDescribe"] + "</td>" +
            "<td>" + outputList[b]["outputType"]["outputName"] +
            "<a data-toggle='tooltip' data-placement='top' title='"+outputList[b]["outputType"]["outputDescribe"]+"'>  <i class='fa fa-question-circle'></i></a></td>" +
            "</tr>";
    }

    for (var c = 0, lenc = displayList.length; c < lenc; c++) {
        display_tr +=
            "<tr>" +
            "<td>" + displayList[c]["outputKey"] + "</td>" +
            "<td>" + displayList[c]["displayName"] + "</td>" +
            "<td>" + displayList[c]["displayDescribe"] + "</td>" +
            "<td>" + displayList[c]["displayType"]["displayName"] +
            "<a data-toggle='tooltip' data-placement='top' title='"+displayList[c]["displayType"]["displayDescribe"]+"'>  <i class='fa fa-question-circle'></i></a></td>" +
            "</tr>";
    }
    var cart;
    if (algorithm["cart"]) {
        cart = " <a href='javascript:void(0);' onclick='algorithmCartOut(this)' algorithmId='" + algorithm["id"] + "' data-toggle='tooltip' data-placement='top' title='已收藏'><i class='fa fa-star onstar'></i></a>";
    } else {
        cart = " <a href='javascript:void(0);' onclick='algorithmCartIn(this)' algorithmId='" + algorithm["id"] + "' data-toggle='tooltip' data-placement='top' title='未收藏'><i class='fa fa-star-o'></i></a>";
    }

    var html =
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

function ajaxError() {
    swal({
        title: "错误!",
        text: "无法连接到服务器",
        type: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '确定',
    })
}