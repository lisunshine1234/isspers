var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});
var algorithmList;
var algorithmListAll;
var runInfoSwalWidth = parseInt(window.screen.width * 0.8);
$(document).ready(function () {
    getMyData();
});

function getMyData() {
    $.ajax({
        async: true,
        url: "/guteam/algorithm/my/getInfoJson",
        // type: "POST",
        // data: {"json": JSON.stringify({"jobId": jobId})},
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
            algorithmListAll = back["algorithmList"];
            console.log(algorithmListAll);
            algorithmList = JSON.parse(JSON.stringify(back["algorithmList"]));

            var navigationHtml = createAlgorithmTypeModel(back["navigation"], back["navigationCount"]);
            document.getElementById("algorithm_my_place").innerHTML = myFrame(navigationHtml);

            $('#algorithmTablePlace').DataTable(myTableOptionHelper(createAlgorithmModel()));
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    })
}

function myFrame(navigationHtml) {
    var frame =
        "<div class='col-lg-3 col-md-3 col-sm-3 col-xs-3'>" +
        navigationHtml +
        "</div>" +
        "<div class='col-lg-9 col-md-9 col-sm-9 col-xs-9' id='my_show_algorithm_place'>" +
        "<button type='button' class='btn btn-default float-button-light' onclick='uploadMyAlgorithm()'>上传新的算法</button>\n" +
        "<table class='datatable-default algorithm-table' id='algorithmTablePlace' style='border: '>" +
        "<thead><tr class='algorithm-table-tr0'><th></th></tr><tr class='algorithm-table-tr1'><th>" + mySortModel() + "</th></tr>" +
        "</thead></table>" +
        "</div>";
    return frame;
}

function uploadMyAlgorithm() {
    window.location.href = "/guteam/my_algorithm/add";
}

function createAlgorithmModel() {
    var len = algorithmList.length;
    var array = new Array();

    for (var i = 0; i < len; i++) {
        var array_temp = new Array();
        var describe = algorithmList[i]["algorithmDescribe"];
        if (describe == null) {
            describe = "";
        }
        var describe_len = 0;
        var describe_len_temp = 0;
        for (var j = 0; j < describe.length; j++) {
            var a = describe.charAt(j);
            if (a.match(/[^\x00-\xff]/ig) != null) {
                describe_len += 2;
            } else {
                describe_len += 1;
            }
        }
        if (describe_len > 200) {
            for (var k = 0; k < describe.length; k++) {
                var b = describe.charAt(k);
                if (b.match(/[^\x00-\xff]/ig) != null) {
                    describe_len_temp += 2;
                } else {
                    describe_len_temp += 1;
                }
                if (describe_len_temp >= 197) {
                    describe = describe.substr(0, k) + "...";
                    break;
                }
            }
        } else {
            describe = algorithmList[i]["algorithmDescribe"];
        }
        var name = "";
        if (!algorithmList[i]["hasFinish"]) {
            name = "<a href='javascript:void(0);' onclick='getAlgorithmInfoById(\"" + algorithmList[i]["id"] + "\")' class='algorithm-name' data-toggle='tooltip' data-placement='top' title='算法未完成'>" +
                " <i class='fa fa-circle' style='color: deepskyblue;'></i>" + algorithmList[i]["algorithmName"] + "</a>";
        } else if (!algorithmList[i]["nonLock"]) {
            name = "<a href='javascript:void(0);' onclick='getAlgorithmInfoById(\"" + algorithmList[i]["id"] + "\")' class='algorithm-name' data-toggle='tooltip' data-placement='top' title='算法已被锁定，请检查算法是否合法'>" +
                " <i class='fa fa-circle' style='color: red;'></i>" + algorithmList[i]["algorithmName"] + "</a>";
        } else if (!algorithmList[i]["pass"]) {
            name = "<a href='javascript:void(0);' onclick='getAlgorithmInfoById(\"" + algorithmList[i]["id"] + "\")' class='algorithm-name' data-toggle='tooltip' data-placement='top' title='算法正在审核'>" +
                " <i class='fa fa-circle' style='color: orange;'></i>" + algorithmList[i]["algorithmName"] + "</a>";
        } else if (!algorithmList[i]["activate"]) {
            name = "<a href='javascript:void(0);' onclick='getAlgorithmInfoById(\"" + algorithmList[i]["id"] + "\")' class='algorithm-name' data-toggle='tooltip' data-placement='top' title='算法未激活'>" +
                " <i class='fa fa-circle' style='color: grey;'></i>" + algorithmList[i]["algorithmName"] + "</a>";
        } else {
            name = "<a href='javascript:void(0);' onclick='getAlgorithmInfoById(\"" + algorithmList[i]["id"] + "\")' class='algorithm-name' data-toggle='tooltip' data-placement='top' title='算法可用'>" +
                " <i class='fa fa-circle' style='color: green;'></i>" + algorithmList[i]["algorithmName"] + "</a>";
        }

        var state_download, state_share;
        if (algorithmList[i]["share"]) {
            state_share = "<a data-toggle='tooltip' data-placement='top' title='已分享,他人可用的算法' ><i style='color: green' class='fa fa-users'></i></a>";
        } else {
            state_share = "<a data-toggle='tooltip' data-placement='top' title='未分享,他人不可用的算法' ><i style='color: grey' class='fa fa-users'></i></a>";
        }

        if (algorithmList[i]["download"]) {
            state_download = "<a data-toggle='tooltip' data-placement='top' title='可下载,他人可以下载算法的源代码' ><i style='color: green' class='fa fa-download'></i></a>";
        } else {
            state_download = "<a data-toggle='tooltip' data-placement='top' title='不可下载,他人不可以下载算法的源代码' ><i style='color: grey' class='fa fa-download'></i></a>";
        }


        var html_temp =
            "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 algorithm-card'>" +
            "  <div class='section-body'>" +
            "    <div class='algorithm-card-head'>" +
            name + "  " + state_share + state_download +
            "       <div class='algorithm-info-swal'>" +
            "           <a data-toggle='tooltip' data-placement='top' title='浏览量' ><i  class='fa fa-eye'></i>" + algorithmList[i]["visitCount"] + "</a>" +
            "           <a data-toggle='tooltip' data-placement='top' title='使用次数' ><i  class='fa fa-repeat'></i>" + algorithmList[i]["useCount"] + "</a>" +
            "           <a data-toggle='tooltip' data-placement='top' title='收藏数量' ><i  class='fa fa-star'></i>" + algorithmList[i]["cartCount"] + "</a>" +
            "       </div>" +
            "    </div>" +
            "    <div class='algorithm-card-info'>" +
            "        <div>类别：" + algorithmList[i]["navigationParent"]["navigationName"] + "</div>" +
            "        <div>引擎：" + algorithmList[i]["algorithmEngine"] + "</div>" +
            "        <div>大小：" + algorithmList[i]["algorithmSize"] + "</div>" +
            "        <div>拥有者：" + algorithmList[i]["userName"] + "</div>" +
            "        <div>上传时间：" + algorithmList[i]["uploadTime"] + "</div>" +
            "    </div>" +
            "    <div class='algorithm-card-body'>" +
            "       <p>" + describe + "</p>" +
            "   </div>" +
            "  </div>" +
            "</div>";
        array_temp.push(html_temp);
        array.push(array_temp);
    }
    return array;
}

function createAlgorithmTypeModel(navigationTypeList, navigationCount) {
    var html = "";
    html += "<ul class='list-group'><div class='form-radio'>";
    html += "<li class='list-group-item'><div class='radio-button'><label><input type='radio' checked='checked' name='radio' onchange='myChooseType(\"all\",\"all\")'><i class='helper'></i>查看所有类别(" + navigationCount["all"] + ")</label></div>";

    for (var i = 0, len = navigationTypeList.length; i < len; i++) {
        html += "<li class='list-group-item active'>" + navigationTypeList[i]["navigationName"] + "</li>";
        var navigationList = navigationTypeList[i]["navigationParentList"];
        for (var j = 0, len1 = navigationList.length; j < len1; j++) {
            if (j == 0) {
                html += "<li class='list-group-item'><div class='radio-button'><label><input type='radio'  name='radio' onchange='myChooseType(\"" + navigationTypeList[i]["id"] + "\",\"parent\")'><i class='helper'></i>查看所有(" + navigationCount[navigationTypeList[i]["id"]] + ")</label></div>";
            }
            html += "<li class='list-group-item'><div class='radio-button'><label><input type='radio' name='radio' onchange='myChooseType(\"" + navigationList[j]["id"] + "\",\"child\")'><i class='helper'></i>" +
                navigationList[j]["navigationName"] + "(" + navigationCount[navigationList[j]["id"]] + ")</label></div>";
        }
        html += "</li>";
    }
    html += "</div></ul>";
    return html;
}

function myChooseType(navigationId, type) {
    switch (type) {
        case "all":
            algorithmList = algorithmListAll;
            break;
        case "parent":
            algorithmList = algorithmListAll.filter(function (e) {
                return e.navigationParent.navigationTypeId == navigationId;
            });
            break;
        case "child":
            algorithmList = algorithmListAll.filter(function (e) {
                return e.navigationParent.id == navigationId;
            });
            break;
    }

    $('#algorithmTablePlace').dataTable().fnClearTable();
    $('#algorithmTablePlace').DataTable(myTableOptionHelper(createAlgorithmModel()));
}

function mySortModel() {
    var html =
        "<a href='javascript:void(0);' onclick='mySort(0)'><div class='algorithm-sort-click' sort_type='desc' name='algorithm_sort'>综合 <i class='fa fa-sort-desc'></i></div></a>" +
        "<a href='javascript:void(0);' onclick='mySort(1)'><div class='algorithm-sort' sort_type='none' name='algorithm_sort'>更新时间 <i class='fa fa-sort'></i></div></a>" +
        "<a href='javascript:void(0);' onclick='mySort(2)'><div class='algorithm-sort' sort_type='none' name='algorithm_sort'>浏览量 <i class='fa fa-sort'></i></div></a>" +
        "<a href='javascript:void(0);' onclick='mySort(3)'><div class='algorithm-sort' sort_type='none' name='algorithm_sort'>使用次数 <i class='fa fa-sort'></i></div></a>" +
        "<a href='javascript:void(0);' onclick='mySort(4)'><div class='algorithm-sort' sort_type='none' name='algorithm_sort'>收藏次数 <i class='fa fa-sort'></i></div></a>";

    return html;
}

function mySort(num) {
    var algorithm_sort_List = document.getElementsByName("algorithm_sort");
    var key;
    switch (num) {
        case 0:
            key = "name";
            break;
        case 1:
            key = "time";
            break;
        case 2:
            key = "visit";
            break;
        case 3:
            key = "use";
            break;
        case 4:
            key = "my";
            break;
    }


    for (var i = 0, len = algorithm_sort_List.length; i < len; i++) {
        var algorithm_sort = algorithm_sort_List[i];
        if (i == num) {
            algorithm_sort.setAttribute("class", "algorithm-sort-click");
            switch (algorithm_sort.getAttribute("sort_type")) {
                case "none":
                    algorithm_sort.setAttribute("sort_type", "desc");
                    algorithm_sort.getElementsByTagName("i")[0].setAttribute("class", "fa fa-sort-desc");
                    mySortAlgorithm(key, "desc");
                    break;
                case "asc":
                    algorithm_sort.setAttribute("sort_type", "desc");
                    algorithm_sort.getElementsByTagName("i")[0].setAttribute("class", "fa fa-sort-desc");
                    mySortAlgorithm(key, "desc");
                    break;
                case "desc":
                    algorithm_sort.setAttribute("sort_type", "asc");
                    algorithm_sort.getElementsByTagName("i")[0].setAttribute("class", "fa fa-sort-asc");
                    mySortAlgorithm(key, "asc");
                    break;
            }
        } else {
            algorithm_sort.setAttribute("class", "algorithm-sort");
            algorithm_sort.setAttribute("sort_type", "none");
            algorithm_sort.getElementsByTagName("i")[0].setAttribute("class", "fa fa-sort");
        }
    }
    $('#algorithmTablePlace').dataTable().fnClearTable();
    $('#algorithmTablePlace').DataTable(myTableOptionHelper(createAlgorithmModel()));
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
            swal.close();
            if (back["sign"]) {
                swal({
                    html: algorithmInfoCreate(back["algorithm"]),
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: '修改',
                    showCancelButton: true,
                    cancelButtonColor: '#F9534F',
                    cancelButtonText: '关闭',
                    width: runInfoSwalWidth
                }).then(function (isConfirm) {
                    window.location.href = "/guteam/my_algorithm/update/" + algorithmId;
                }, function (dismiss) {
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

function goNewPageViewAlgorithm(algorithmId) {
    console.log(123)
    window.open("/guteam/algorithm/view/" + algorithmId, "_blank");

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
        "<a href='javascript:void(0);' onclick='goNewPageViewAlgorithm(\"" + algorithm["id"] + "\")'>转到新的页面查看</a>" +
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

function algorithmMyIn(obj) {
    var algorithmId = obj.getAttribute("algorithmId");
    $.ajax({
        async: true,
        url: "/guteam/my/do/in",
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
                obj.setAttribute("onclick", "algorithmMyOut(this)")
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

function algorithmMyOut(obj) {
    var algorithmId = obj.getAttribute("algorithmId");
    $.ajax({
        async: true,
        url: "/guteam/my/do/out",
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
                obj.getElementsByTagName("i")[0].setAttribute("class", "fa fa-star-o");
                obj.setAttribute("onclick", "algorithmMyIn(this)");

                algorithmList = algorithmList.filter(function (e) {
                    return e.id != algorithmId;
                });

                $('#algorithmTablePlace').dataTable().fnClearTable();
                $('#algorithmTablePlace').DataTable(myTableOptionHelper(createAlgorithmModel()));
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

function mySortAlgorithm(key, type) {
    switch (key) {
        case "name":
            if (type == "asc") {
                algorithmList.sort(myAlgorithmNameAsc);
            } else {
                algorithmList.sort(myAlgorithmNameDesc);
            }
            break;
        case "time":
            if (type == "asc") {
                algorithmList.sort(myAlgorithmTimeAsc);
            } else {
                algorithmList.sort(myAlgorithmTimeDesc);
            }
            break;
        case "visit":
            if (type == "asc") {
                algorithmList.sort(myAlgorithmVisitAsc);
            } else {
                algorithmList.sort(myAlgorithmVisitDesc);
            }
            break;
        case "use":
            if (type == "asc") {
                algorithmList.sort(myAlgorithmUseAsc);
            } else {
                algorithmList.sort(myAlgorithmUseDesc);
            }
            break;
        case "my":
            if (type == "asc") {
                algorithmList.sort(myAlgorithmCartAsc);
            } else {
                algorithmList.sort(myAlgorithmCartDesc);
            }
            break;
    }
}

function myAlgorithmNameAsc(x, y) {
    return x.algorithmName.localeCompare(y.algorithmName);
}

function myAlgorithmNameDesc(x, y) {
    return y.algorithmName.localeCompare(x.algorithmName);
}

function myAlgorithmTimeAsc(x, y) {
    return x.uploadTime.localeCompare(y.uploadTime);
}

function myAlgorithmTimeDesc(x, y) {
    return y.uploadTime.localeCompare(x.uploadTime);
}

function myAlgorithmVisitAsc(x, y) {
    return x.visitCount - y.visitCount;
}

function myAlgorithmVisitDesc(x, y) {
    return y.visitCount - x.visitCount;
}

function myAlgorithmUseAsc(x, y) {
    return x.useCount - y.useCount;
}

function myAlgorithmUseDesc(x, y) {
    return y.useCount - x.useCount;
}

function myAlgorithmCartAsc(x, y) {
    return x.cartCount - y.cartCount;
}

function myAlgorithmCartDesc(x, y) {
    return y.cartCount - x.cartCount;
}

function myTableOptionHelper(data) {
    var option = {
        'data': data,
        'bDestroy': true,
        'bLengthChange': false,
        'bPaginate': true,                  //是否分页
        'iDisplayLength': 10,              //显示数据条数
        'bInfo': true,                       //数据查找状态，没数据会显示“没有数据”
        'bAutoWidth': true,                  //自动宽度
        'bSort': false,                      //是否排序
        'bFilter': false,                    //过滤功能
        "searching": true,                    //本地搜索
        'bProcessing': true,
        "sScrollX": "100%",
        "sScrollXInner": "100%",
        "info": false,
        'orderCellsTop': true,
        // "scrollX": true,
        // "createdRow": function (row, data, index) {
        //     //生成了行之后，开始生成表头>>>
        //     console.log(row)
        //     console.log( data)
        //     console.log(index)
        //     if (index == 0) {
        //         var innerTh = '<tr><th colspan="3">Name</th>';
        //         innerTh += '</tr>';
        //         //table的id为"id_table"
        //         document.getElementById('algorithmTablePlace').insertRow(0);
        //         var $tr = $("#algorithmTablePlace tr").eq(0);
        //         $tr.after(innerTh);
        //     }
        // },
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

    }
    return option;

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