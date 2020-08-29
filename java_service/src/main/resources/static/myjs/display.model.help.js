var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");
$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});
var display_count = 0, display_show_queue = [];
var windowHeight = window.screen.height * 0.5;
var windowWidth = window.screen.width * 0.7;
$(document).ready(function () {
    var interval_1 = setInterval(function () {
        if ($('a[data-toggle="tab"]').length > 0) {
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                $.fn.dataTable.tables({visible: false, api: true}).columns.adjust();
            });
            clearInterval(interval_1);
        }
    }, 10);
});

// main
function createDisplayModelByType(displayList, i) {
    var html = "";
    for (var j = 0, len2 = displayList.length; j < len2; j++) {
        display_count = display_count + 1;
        var display = displayList[j];

        html += "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12 display'>" +
            "<div class='section-header'>" +
            "<h2>" + display["displayName"] + "<a data-toggle='tooltip' data-placement='top' title='" + display["displayDescribe"] + "'><i class='fa fa-question-circle'></i></a></h2>";

        var data = outputJsonList[i][display["outputKey"]].data;
        var sign = true;

        var id = "display_visual_" + display_count;

        switch (display["displayType"]["displayKey"]) {
            case "table":
                if (displayCheckTwoArray(data) == true) {
                    html += displayTwoArrayRangeInput(id);
                    html += displayTable(id);
                } else if (displayCheckOneArray(data) == true) {
                    html += displayOneArrayRangeInput(id);
                    html += displayTable(id);
                } else if (displayCheckNumber(data) == true) {
                    html += displayTable(id);
                } else {
                    sign = false;
                }
                break;
            case "string":
                html += displayString(id);
                break;
            case "json":
                html += displayJson(id);
                break;
            case "fan-one":
                if (displayCheckTwoArray(data) == true) {
                    html += displayTwoArrayRangeInput(id);
                    html += displayRowAndColumnChooseRadio(id);
                    html += displaySelectHelper("", id);
                    html += displayEcharts(id);
                } else if (displayCheckOneArray(data) == true) {
                    html += displayOneArrayRangeInput(id);
                    html += displayEcharts(id);
                } else {
                    sign = false;
                }
                break;
            case "line-one-range":
                if (displayCheckTwoArray(data) == true) {
                    html += displayTwoArrayRangeInput(id);
                    html += displayRowAndColumnChooseRadio(id);
                    html += displaySelectHelper("", id);
                    html += displayEcharts(id);
                } else if (displayCheckOneArray(data) == true) {
                    html += displayOneArrayRangeInput(id);
                    html += displayEcharts(id);
                } else {
                    sign = false;
                }
                break;
            case "histogram-one":
                if (displayCheckTwoArray(data) == true) {
                    html += displayTwoArrayRangeInput(id);
                    html += displayRowAndColumnChooseRadio(id);
                    html += displaySelectHelper("", id);
                    html += displayEcharts(id);
                } else if (displayCheckOneArray(data) == true) {
                    html += displayOneArrayRangeInput(id);
                    html += displayEcharts(id);
                } else if (displayCheckNumber(data) == true) {
                    html += displayEcharts(id);
                } else {
                    sign = false;
                }
                break;
            case "line-many":
                if (displayCheckTwoArray(data) == true) {
                    html += displayTwoArrayRangeInput(id);
                    html += displayRowAndColumnChooseRadio(id);
                    html += displayEcharts(id);
                } else {
                    sign = false;
                }

                break;
            case "histogram-many":
                if (displayCheckTwoArray(data) == true) {
                    html += displayTwoArrayRangeInput(id);
                    html += displayRowAndColumnChooseRadio(id);
                    html += displayEcharts(id);
                } else {
                    sign = false;
                }
                break;
            case "radar-one":
                if (displayCheckTwoArray(data) == true) {
                    html += displayTwoArrayRangeInput(id);
                    html += displayRowAndColumnChooseRadio(id);
                    html += displaySelectHelper("", id);
                    html += displayEcharts(id);
                } else if (displayCheckOneArray(data) == true) {
                    html += displayOneArrayRangeInput(id);
                    html += displayEcharts(id);
                } else if (displayCheckNumber(data) == true) {
                    html += displayEcharts(id);
                } else {
                    sign = false;
                }
                break;
            case "radar-many":
                if (displayCheckTwoArray(data) == true) {
                    html += displayTwoArrayRangeInput(id);
                    html += displayRowAndColumnChooseRadio(id);
                    html += displayEcharts(id);
                } else {
                    sign = false;
                }
                break;
            default:
                sign = false;
        }
        data = null;
        html += "</div></div> ";
        if (sign == true) {
            display_show_queue.push({"id": id, "key": display["outputKey"], "type": display["displayType"]["displayKey"], "index": i});
        }
    }
    return html;
}

function renderDisplayModelSwitch(id, data, type) {
    var obj = $("#" + id)
    switch (type) {
        case "table":
            obj.DataTable().clear();
            obj.DataTable().destroy();
            data.data = arrToTwoArray(data.data);
            data = dataTitleHelper(data);

            var title = "<th scope='row'>行/列</th>";
            for (var i = 0, len = data.x.length; i < len; i++) {
                title += "<th scope='row'>" + data.x[i] + "</th>";
            }
            obj[0].getElementsByTagName("thead")[0].getElementsByTagName("tr")[0].innerHTML = title;

            obj.DataTable(displayTableOptionHelper(data));
            break;
        case "string":
            if (displayCheckString(data.data) === true) {
                obj.text(data.toString());
            }
            break;
        case "json":
            if (displayCheckJson(data) === true) {
                obj.text(stringFormatToJson(data));
            }
            break;
        case "fan-one":
            if (displayCheckOneArray(data.data)) {
                echarts.init(obj[0]).setOption(displayFanOneOptionHelper(data), true);
            } else if (displayCheckTwoArray(data.data)) {
                echarts.init(obj[0]).setOption(displayFanOneOptionHelper(data[0]), true);
            }
            break;
        case "line-one-range":
            if (displayCheckOneArray(data.data)) {
                echarts.init(obj[0]).setOption(displayLineOneRangeOptionHelper(data), true);
            } else if (displayCheckTwoArray(data.data)) {
                echarts.init(obj[0]).setOption(displayLineOneRangeOptionHelper(getJsonArrayByIndex(data, 0), true));
            }
            break;
        case "histogram-one":
            if (displayCheckOneArray(data.data)) {
                echarts.init(obj[0]).setOption(displayHistogramOneOptionHelper(data), true);
            } else if (displayCheckTwoArray(data.data)) {
                echarts.init(obj[0]).setOption(displayHistogramOneOptionHelper(getJsonArrayByIndex(data, 0)), true);
            } else if (displayCheckNumber(data.data)) {
                echarts.init(obj[0]).setOption(displayHistogramOneOptionHelper(getJsonArrayByIndex(data, 0)), true);
            }
            break;
        case "line-many":
            echarts.init(obj[0]).setOption(displayLineManyOptionHelper(data), true);
            break;
        case "histogram-many":
            echarts.init(obj[0]).setOption(displayHistogramManyOptionHelper(data), true);
            break;
        case "radar-one":
            if (displayCheckOneArray(data.data)) {
                echarts.init(obj[0]).setOption(displayRadarOneOptionHelper(data), true);
            } else if (displayCheckTwoArray(data.data)) {
                echarts.init(obj[0]).setOption(displayRadarOneOptionHelper(getJsonArrayByIndex(data, 0)), true);
            } else if (displayCheckNumber(data.data)) {
                echarts.init(obj[0]).setOption(displayRadarOneOptionHelper(getJsonArrayByIndex(data, 0)), true);
            }
            break;

        case "radar-many":
            echarts.init(obj[0]).setOption(displayRadarManyOptionHelper(data), true);
            break;
    }
    obj = null;
}

function renderDisplayModelByType() {
    for (var i = 0, len = display_show_queue.length; i < len; i++) {
        var data = outputJsonList[display_show_queue[i].index][display_show_queue[i].key];
        var radio_name = $("[name='" + display_show_queue[i].id + "_radio']");
        if (radio_name.length > 0) {
            $(radio_name[0]).click();
        } else {
            renderDisplayModelSwitch(display_show_queue[i].id, data, display_show_queue[i].type);
        }
    }
    swal.close();
}

//create
function displayTable(id) {
    return "</div><div class='section-body col-lg-12 col-md-12 col-sm-12 col-xs-12'><table id='" + id + "' class='display' ><thead><tr><td></td></tr></thead></table>";
}

function displayJson(id) {
    return "</div><div class='section-body col-lg-12 col-md-12 col-sm-12 col-xs-12'><div id='" + id + "' style='height: 300px;overflow: auto'></div>";
}

function displayString(id) {
    return "</div><div class='section-body col-lg-12 col-md-12 col-sm-12 col-xs-12'><div id='" + id + "' style='height: 300px;overflow: auto'></div>";
}

function displayEcharts(id) {
    return "</div><div class='section-body col-lg-12 col-md-12 col-sm-12 col-xs-12'><div id='" + id + "' style='height:" + windowHeight + "px;width:" + windowWidth + "px;'></div>";
}

//render
function displayTableOptionHelper(data) {
    var data_temp = JSON.parse(JSON.stringify(data.data));
    for (var j = 0, len1 = data_temp.length; j < len1; j++) {
        data_temp[j].unshift("<strong>" + data.y[j] + "</strong>");
    }

    var option = {
        "data": data_temp,
        'bDestroy': true,
        'bLengthChange': true,
        'aLengthMenu': [10, 25, 50, 100, 200],
        'bPaginate': true,                  //是否分页
        // 'iDisplayLength': 20,              //显示数据条数
        'bInfo': true,                       //数据查找状态，没数据会显示“没有数据”
        'bAutoWidth': true,                  //自动宽度
        'bSort': true,                      //是否排序
        'bFilter': false,                    //过滤功能
        "searching": true,                    //本地搜索
        'bProcessing': true,
        "sScrollX": "100%",
        "sScrollXInner": "100%",
        "serverSide": false,
        "scrollX": true,
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
            "sEmptyTable": "表中数据为空",
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

// visual help tools
function displayRowAndColumnChooseRadio(id) {
    return "<div class='form-radio display-tools col-lg-5 col-md-5 col-sm-5 col-xs-5'>" +
        "<div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='" + id + "_radio' r_c='0' onchange='displayChooseRadio(this)'>" +
        "<i class='helper'></i>按行" +
        "</label>" +
        "</div>" +
        "<div class='radio-button'>" +
        "<label>" +
        "<input type='radio' name='" + id + "_radio' r_c='1' onchange='displayChooseRadio(this)'>" +
        "<i class='helper'></i>按列" +
        "</label>" +
        "</div>" +
        "</div>";
}

function displayChooseRadio(obj) {
    var radio = $(obj);
    var id_temp = radio.attr("name");
    var idSplit = id_temp.split("_");
    var r_c = Number(radio.attr("r_c"));
    var id = id_temp.substr(0, id_temp.length - idSplit[idSplit.length - 1].length - 1);

    var displayShow = display_show_queue.filter(function (e) {
        return e.id == id;
    })[0];

    var data = outputJsonList[displayShow.index][displayShow.key];


    var row_min = 0;
    var row_max = -1;
    var column_min = 0;
    var column_max = -1;

    var input_do = $("#" + id + "_do");
    input_do.attr("row_min", row_min);
    input_do.attr("row_max", row_max);
    input_do.attr("column_min", column_min);
    input_do.attr("column_max", column_max);


    $("#" + id + "_row_min").val("");
    $("#" + id + "_row_max").val("");
    $("#" + id + "_column_min").val("");
    $("#" + id + "_column_max").val("");

    data = arrayTitleTwoSplit(data, row_min, row_max, column_min, column_max);

    if (r_c == 1) {
        data = arrayTitleTransposition(data);
    }

    var select = $("#" + id + "_select");
    if (select.length > 0) {
        var y = data.y;
        var titleHtml = "";
        for (let i = 0, len = y.length; i < len; i++) {
            titleHtml += "<option value='" + i + "'>" + y[i] + "</option>";
        }

        select.html(titleHtml);
        select.attr("r_c", r_c);
        select.val(0);
        displaySelectChange(select);
    } else {
        renderDisplayModelSwitch(id, data, displayShow.type);
    }

}

function displaySelectHelper(titleJsonList, id) {
    var html = "";
    html += "<div class='form-group display-tools col-lg-5 col-md-5 col-sm-5 col-xs-5'>" +
        "<select onchange='displaySelectChange(this)' r_c='0' class='form-control select-control' id='" + id + "_select'>";
    for (let i = 0; i < titleJsonList.length; i++) {
        html += "<option value='" + titleJsonList[i].value + "'>" + titleJsonList[i].key + "</option>";
    }
    html += "</select></div>";

    return html;
}

function displaySelectChange(obj) {
    var select = $(obj);
    var value = select.val();
    var id_temp = select.attr("id");
    var idSplit = id_temp.split("_");
    var r_c = Number(select.attr("r_c"));
    var id = id_temp.substr(0, id_temp.length - idSplit[idSplit.length - 1].length - 1);
    var displayShow = display_show_queue.filter(function (e) {
        return e.id == id;
    })[0];

    var data = outputJsonList[displayShow.index][displayShow.key];


    var input_do = $("#" + id + "_do");
    var row_min, row_max, column_min, column_max;
    if (input_do.length > 0) {
        row_min = Number(input_do.attr("row_min"));
        row_max = Number(input_do.attr("row_max"));
        column_min = Number(input_do.attr("column_min"));
        column_max = Number(input_do.attr("column_max"));
    } else {
        row_min = 0;
        row_max = -1;
        column_min = 0;
        column_max = -1;
    }

    if (isNaN(row_min)) {
        row_min = 0;
    }
    if (isNaN(row_max)) {
        row_max = -1;
    }
    if (isNaN(column_min)) {
        column_min = 0;
    }
    if (isNaN(column_max)) {
        column_max = -1;
    }
    data = arrayTitleTwoSplit(data, row_min, row_max, column_min, column_max);

    if (r_c == 1) {
        data = arrayTitleTransposition(data);
    }
    renderDisplayModelSwitch(id, getJsonArrayByIndex(data, value), displayShow.type);
}

function displayTwoArrayRangeInput(id) {
    return "<div class='display-tools col-lg-12 col-md-12 col-sm-12 col-xs-12'>" +
        "<div class='form-group row-column-range col-lg-2 col-md-2 col-sm-2 col-xs-2'>" +
        "<input class='form-control ' type='text' id='" + id + "_row_min' placeholder='行起始序号'>" +
        "</div>" +
        "<div class='form-group row-column-range col-lg-2 col-md-2 col-sm-2 col-xs-2'>" +
        "<input class='form-control' type='text' id='" + id + "_row_max' placeholder='行终止序号'>" +
        "</div>" +
        "<div class='form-group row-column-range col-lg-2 col-md-2 col-sm-2 col-xs-2'>" +
        "<input class='form-control' type='text' id='" + id + "_column_min' placeholder='列起始序号'>" +
        "</div>" +
        "<div class='form-group row-column-range col-lg-2 col-md-2 col-sm-2 col-xs-2'>" +
        "<input class='form-control' type='text' id='" + id + "_column_max' placeholder='列终止序号'>" +
        "</div>" +
        "<button type='button' class='btn btn-success' onclick='displayTwoArrayInputRangeDo(this)' id='" + id + "_do'>筛选</button>   " +
        "<a data-toggle='tooltip' data-placement='top' title='当起始序号小于1或者为空时，默认值为1；当终止序号大于最大长度或者为空时，默认值为最大值。'><i class='fa fa-question-circle'></i></a>" +
        "</div>";
}

function displayTwoArrayInputRangeDo(obj) {
    var button = $(obj);
    var id_temp = button.attr("id");
    var idSplit = id_temp.split("_");
    var id = id_temp.substr(0, id_temp.length - idSplit[idSplit.length - 1].length - 1);

    var displayShow = display_show_queue.filter(function (e) {
        return e.id == id;
    })[0];

    var data = outputJsonList[displayShow.index][displayShow.key];

    var row_min = Number($("#" + id + "_row_min").val());
    var row_max = Number($("#" + id + "_row_max").val());
    var column_min = Number($("#" + id + "_column_min").val());
    var column_max = Number($("#" + id + "_column_max").val());

    var row_max_len = data.data.length;
    var column_max_len = data.data[0].length;

    if (isNaN(row_min) || row_min < 1) {
        row_min = 1;
    }
    if (isNaN(row_max) || row_max < 1) {
        row_max = row_max_len;
    }
    if (isNaN(column_min) || column_min < 1) {
        column_min = 1;
    }
    if (isNaN(column_max) || column_max < 1) {
        column_max = column_max_len;
    }

    if (displayCheckNumber(row_min) == false || row_min > row_max_len) {
        swal({
            title: "错误!",
            text: "行起始序号为小于等于" + row_max_len + "的整数",
            type: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '确定'
        }).catch(swal.noop);
    } else if (displayCheckNumber(row_max) == false || row_max < row_min) {
        swal({
            title: "错误!",
            text: "行终止序号为大于等于" + row_min + "且的整数",
            type: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '确定'
        }).catch(swal.noop);
    } else if (displayCheckNumber(column_min) == false || column_min > column_max_len) {
        swal({
            title: "错误!",
            text: "列起始序号为小于等于" + column_max_len + "的整数",
            type: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '确定'
        }).catch(swal.noop);
    } else if (displayCheckNumber(column_max) == false || column_max < column_min) {
        swal({
            title: "错误!",
            text: "列终止序号为大于等于" + column_min + "的整数",
            type: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '确定'
        }).catch(swal.noop);
    } else {
        row_min = Number(row_min) - 1;
        row_max = Number(row_max) - 1;
        column_min = Number(column_min) - 1;
        column_max = Number(column_max) - 1;

        var input = $("#" + id + "_do");
        input.attr("row_min", row_min);
        input.attr("row_max", row_max);
        input.attr("column_min", column_min);
        input.attr("column_max", column_max);

        var select = $("#" + id + "_select");
        if (select.length > 0) {
            var r_c = Number(select.attr("r_c"));
            var titleHtml = "";
            if (r_c == 0) {
                var y = data.y;
                if (row_min > select.val() || row_max < select.val()) {
                    select.val(row_min);
                }
                for (let i = row_min; i < row_max + 1; i++) {
                    titleHtml += "<option value='" + i + "'>" + y[i] + "</option>";
                }
            } else {
                var x = data.x;
                if (column_min > select.val() || column_max < select.val()) {
                    select.val(column_min);
                }
                for (let i = column_min; i < column_max + 1; i++) {
                    titleHtml += "<option value='" + i + "'>" + x[i] + "</option>";
                }
            }
            select.html(titleHtml);
            displaySelectChange(select);
        } else {
            var r_c = 0;
            var radio = $("input[name='" + id + "_radio']:checked");
            if (radio.length > 0) {
                r_c = Number(radio.attr("r_c"));
            }
            data = arrayTitleTwoSplit(data, row_min, row_max, column_min, column_max);
            if (r_c == 1) {
                data = arrayTitleTransposition(data);
            }
            renderDisplayModelSwitch(id, data, displayShow.type);
        }
    }
}

function displayOneArrayRangeInput(id) {
    return "<div class='display-tools col-lg-12 col-md-12 col-sm-12 col-xs-12'>" +
        "<div class='form-group row-column-range col-lg-2 col-md-2 col-sm-2 col-xs-2'>" +
        "<input class='form-control ' type='text' id='" + id + "_row_min' placeholder='起始序号'>" +
        "</div>" +
        "<div class='form-group row-column-range col-lg-2 col-md-2 col-sm-2 col-xs-2'>" +
        "<input class='form-control' type='text' id='" + id + "_row_max' placeholder='终止序号'>" +
        "</div>" +
        "<button type='button' class='btn btn-success' onclick='displayOneArrayInputRangeDo(this)' id='" + id + "_do'>筛选</button>   " +
        "<a data-toggle='tooltip' data-placement='top' title='当起始序号小于1或者为空时，默认值为1；当终止序号大于最大长度或者为空时，默认值为最大值。'><i class='fa fa-question-circle'></i></a>" +
        "</div>";
}

function displayOneArrayInputRangeDo(obj) {
    var button = $(obj);
    var id_temp = button.attr("id");
    var idSplit = id_temp.split("_");
    var id = id_temp.substr(0, id_temp.length - idSplit[idSplit.length - 1].length - 1);

    var displayShow = display_show_queue.filter(function (e) {
        return e.id == id;
    })[0];

    var data = outputJsonList[displayShow.index][displayShow.key];

    var min = Number($("#" + id + "_row_min").val());
    var max = Number($("#" + id + "_row_max").val());

    var max_len = data.data.length;

    if (isNaN(min) || min < 1) {
        min = 1;
    }
    if (isNaN(max) || max < 1) {
        max = max_len;
    }

    if (displayCheckNumber(min) == false || min > max_len) {
        swal({
            title: "错误!",
            text: "行起始序号为小于等于" + max_len + "的整数",
            type: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '确定'
        }).catch(swal.noop);
    } else if (displayCheckNumber(max) == false || max < min) {
        swal({
            title: "错误!",
            text: "行终止序号为大于等于" + min + "的整数",
            type: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '确定'
        }).catch(swal.noop);
    } else {
        min = Number(min) - 1;
        max = Number(max) - 1;
        data = arrayTitleOneSplit(data, min, max);
        renderDisplayModelSwitch(id, data, displayShow.type);
    }
}

//common


function displayCheckObject(obj) {
    if (str == null || str == undefined) {
        return false;
    }
    if (typeof obj == 'string') {
        try {
            var obj = JSON.parse(obj);
            if (typeof obj == 'object' && obj) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    } else if (typeof obj == 'object') {
        return true;
    }
    return false;
}

function displayCheckJson(str) {
    if (str == null || str == undefined) {
        return false;
    }
    if (typeof str == 'string') {
        try {
            var obj = JSON.parse(str);
            if (typeof obj == 'object' && obj && obj.length == null) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    } else if (typeof str == 'object' && str.length == null) {
        return true;
    }
    return false;
}

function displayCheckArray(arr) {
    if (arr == null || arr == undefined) {
        return false;
    }
    if (typeof arr == 'object') {
        if (arr.length == null) {
            return false;
        }
        return true;
    } else if (typeof arr == 'string') {
        try {
            var obj = JSON.parse(arr);
            if (typeof obj == 'object' && obj && obj.length != null) {
                return true;
            } else {
                return false;
            }
        } catch (e) {
            return false;
        }
    }
    return false;
}

function displayCheckOneArray(arr) {
    if (arr == null || arr == undefined) {
        return false;
    }
    if (typeof arr == 'object') {
        if (arr.length == null) {
            return false;
        }
        if (arr.length > 0) {
            if (typeof arr[0] == 'object') {
                return false;
            }
        }
        return true;
    }
}

function displayCheckTwoArray(arr) {
    if (arr == null || arr == undefined) {
        return false;
    }
    if (typeof arr == 'object') {
        if (arr.length == null) {
            return false;
        }
        if (arr.length > 0) {
            if (typeof arr[0] == 'object') {
                if (arr[0].length == null) {
                    return false;
                } else {
                    if (arr[0].length > 0) {
                        if (typeof arr[0][0] == 'object') {
                            return false;
                        }
                    }
                }
            } else {
                return false;
            }
        }
        return true;
    }
}

function displayCheckNumber(num) {
    return typeof num == "number" || (typeof num == "string" && isNaN(Number("a")));
}

function displayCheckString(str) {
    return typeof str == "string";
}

function stringFormatToJson(json) {
    return JSON.stringify(JSON.parse(json), null, 2);
}

function jsonFormatToString(json) {
    return JSON.stringify(JSON.parse(json), null, 0);
}

function numberToOneArray(num) {
    var a = [];
    a.push(num);
    return a;
}

function numberToTwoArray(num) {
    var a = [];
    var b = [];
    a.push(num);
    b.push(a);
    return b;
}

function oneArrayToTwoArray(arr) {
    var a = [];
    a.push(arr);
    return a;
}

function arrToTwoArray(arr) {
    if (displayCheckNumber(arr)) {
        return numberToTwoArray(arr);
    } else if (displayCheckOneArray(arr)) {
        return oneArrayToTwoArray(arr);
    } else if (displayCheckTwoArray(arr)) {
        return arr;
    } else {
        return [[]];
    }
}

function arrayTransposition(arr) {
    var arr2 = [];
    for (let i = 0; i < arr[0].length; i++) {
        arr2[i] = [];
    }

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            arr2[j][i] = arr[i][j];
        }
    }

    return arr2;

}

function arrayTitleTransposition(data) {
    var arr = data.data;
    var arr2 = [];
    for (let i = 0; i < arr[0].length; i++) {
        arr2[i] = [];
    }

    for (let i = 0; i < arr.length; i++) {
        for (let j = 0; j < arr[i].length; j++) {
            arr2[j][i] = arr[i][j];
        }
    }

    return {"data": arr2, "x": data.y, "y": data.x};

}

function arrayTwoSplit(data, row_min, row_max, column_min, column_max) {
    var back = [];
    var row_max_len = data.length;
    var column_max_len = data[0].length;

    if (row_min < 0) {
        row_min = 0;
    }
    if (row_max < 0 || row_max > row_max_len - 1) {
        row_max = row_max_len - 1;
    }
    if (column_min < 0) {
        column_min = 0;
    }
    if (column_max < 0 || column_max > column_max_len - 1) {
        column_max = column_max_len - 1;
    }
    if (row_min > row_max || column_min > column_max) {
        return [back];
    }

    for (var i = row_min; i < row_max + 1; i++) {
        back.push(data[i].slice(column_min, column_max + 1));
    }
    return back;

}

function arrayTitleTwoSplit(data, row_min, row_max, column_min, column_max) {
    var data_temp = data.data;
    var x = data.x;
    var y = data.y;

    var back = [];
    var row_max_len = data_temp.length;
    var column_max_len = data_temp[0].length;

    if (row_min < 0) {
        row_min = 0;
    }
    if (row_max < 0 || row_max > row_max_len - 1) {
        row_max = row_max_len - 1;
    }
    if (column_min < 0) {
        column_min = 0;
    }
    if (column_max < 0 || column_max > column_max_len - 1) {
        column_max = column_max_len - 1;
    }
    if (row_min > row_max || column_min > column_max) {
        return {"data": [[]], "x": [], "y": []}
    }

    for (var i = row_min; i < row_max + 1; i++) {
        back.push(data_temp[i].slice(column_min, column_max + 1));
    }
    return {"data": back, "x": x.slice(column_min, column_max + 1), "y": y.slice(row_min, row_max + 1)};
}

function arrayOneSplit(data, min, max) {
    var max_len = data.length;

    if (min < 0) {
        min = 0
    }
    if (max < 0 || max > max_len - 1) {
        max = max_len - 1;
    }
    if (max > max_len - 1) {
        return [];
    }
    return data.slice(min, max + 1)
}

function arrayTitleOneSplit(data, min, max) {
    var set = data.data;
    if (set) {
        var x = data.x;
        var back = [];
        var max_len = set.length;
        if (max > max_len - 1) {
            return back;
        }
        if (min < 0) {
            min = 0
        }
        if (max < 0) {
            max = max_len - 1;
        }

        return {"data": set.slice(min, max + 1), "x": x.slice(min, max + 1)};
    } else {
        return {"data": [], "x": []}
    }
}

function getJsonArrayByIndex(data, index) {
    var data_temp = data.data;
    if (displayCheckTwoArray(data_temp) == true) {
        return {"data": data_temp[index], "x": data.x, "y": data.y[index]};
    } else if (displayCheckOneArray(data_temp) == true) {
        return {"data": data_temp[index], "x": data.x[index]};
    } else if (displayCheckNumber(data_temp) == true) {
        return {"data": [data_temp], "x": [data.x]};
    } else {
        return {"data": [[]], "x": [], "y": ""};
    }
}

//help
function rowAndColumn(type) {
    if (type == 0) {
        return "行";
    } else {
        return "列";
    }
}