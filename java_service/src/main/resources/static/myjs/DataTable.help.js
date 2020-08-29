function DataTableCreate(set, label) {
    destroy();
    console.log(label)
    if (set != null) {
        if (set[0] == null) {
            set = [[set]]
        }
        else {
            if (set[0][0] == null) {
                set = [set]
            }
        }
        if (label == null || label.length == 0) {
            label = [];
            for (var i = 0, len = set[0].length; i < len; i++) {
                label[i] = '第' + (i + 1) + '列';
            }
        }
        var option = DataTableOption(set, label);
        $('#table').DataTable(option)
    }
}


function destroy() {
    var table = $('#table');
    var int_table = $('#table').DataTable();
    int_table.clear();
    int_table.destroy();
    table.empty();
}


function DataTableOption(set, label) {

    console.log(set)
    var column = labelCreate(label);

    var option = {
        "data": set,
        "columns": column,
        "destroy": true,
        "foot": column,
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

function labelCreate(label) {
    var column = [];

    for (var i = 0, len = label.length; i < len; i++) {
        column[i] = {"title": label[i] + "<div class=\"material-design-checkobx\"><div class=\"checkbox\"><label><input type=\"checkbox\" checked='checked' name='column_index' index='\" + i + \"'><i class=\"helper\"></i></label></div></div>"}
    }
    return column;
}


