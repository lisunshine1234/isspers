function inputListCreate(num, algorithmId, algorithmName) {

    var inputList = getInputList(algorithmId);

    var html = "<div class='col-lg-12 col-md-12 col-sm-12 col-xs-12' id='" + "algorithmId_" + algorithmId + "_" + num + "' name='algorithm_model'><div class='section-header' ><h2>"
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
            case "dropdown":
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
    }
    else {
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
    }
    else {
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
    }
    else {
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
    }
    else {
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

    var inputJson = JSON.parse(input.inputJson);
    var first_key;
    var first_value;
    for (var key in inputJson) {
        first_key = key;
        first_value = inputJson[key];
        break;
    }
    var li_html = "";

    var i = 0;
    for (var key in inputJson) {
        li_html += "<li><a href='javascript:void(0)' class=' float-button-light' jsonKey='" + key + "' goal='" + "input_" + input.inputKey + "_" + num + "' onclick='inputDropDownChange(this)'>" + inputJson[key] + "</a></li>";
        i++;
    }

    var html = "";
    if (input.required) {
        html += "<label name='" + "algorithmId_" + input.algorithmId + "_" + num + "' inputKeyNum='" + "input_" + input.inputKey + "_" + num + "' required='1'>" + input.inputKey + "(" + input.inputName + ")" + "<a data-toggle='tooltip' data-placement='top' title='" + input.inputDescribe + "'>  <i class='fa fa-question-circle'></i></a></label>";
    }
    else {
        html += "<label name='" + "algorithmId_" + input.algorithmId + "_" + num + "' inputKeyNum='" + "input_" + input.inputKey + "_" + num + "' required='0'>" + input.inputKey + "(" + input.inputName + ")" + "<a data-toggle='tooltip' data-placement='top' title='" + input.inputDescribe + "'>  <i class='fa fa-question-circle'></i></a></label>";
    }
    html +=
        "<br><div class='btn-group'>" +
        "<button type='button' class='btn btn-primary btn-outline dropdown-toggle float-button-light' " +
        "data-toggle='dropdown' aria-expanded='false' " +
        "jsonKey='" + first_key + "' " +
        "inputType='" + input.inputType.inputKey + "' " +
        "name='" + "input_" + input.inputKey + "_" + num + "' " +
        "id='" + "input_" + input.inputKey + "_" + num + "'>" +
        first_value +
        "    <span class='caret'></span>" +
        "    <span class='sr-only'></span>" +
        "</button>" +
        "<ul class='dropdown-menu dropdown-menu-primary'" +
        "    aria-labelledby='primary-dropdown-outline'" +
        "    role='menu'>" +
        li_html +
        "</ul>" +
        "</div>";
    return html;

}

function inputDropDownChange(obj) {
    var goal = obj.getAttribute("goal");
    var jsonKey = obj.getAttribute("jsonKey");
    var value = obj.value;

    var dropdown = document.getElementById(goal);
    dropdown.setAttribute("jsonKey", jsonKey);
    dropdown.innerText = value + "<span class='caret'></span><span class='sr-only'></span>";
    // dropdown.setAttribute("keyValue",value)
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
                        var fileJsonKey = document.getElementById("mat_" + inputKeyNum).getAttribute("jsonKey");
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
                        matKey[input_key] = document.getElementById("mat_" + inputKeyNum).getAttribute("jsonKey");
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
                        var fileJsonKey = document.getElementById("mat_" + inputKeyNum).getAttribute("jsonKey");
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
                        matKey[input_key] = document.getElementById("mat_" + inputKeyNum).getAttribute("jsonKey");
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
                    value = algorithm_attribute[0].getAttribute("jsonKey");
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
    var li_html = "";
    for (var i = 0, len = keyList.length; i < len; i++) {
        li_html += "<li><a href='javascript:void(0)' class='float-button-light' goal='" + "mat_" + id + "' jsonKey='" + keyList[i] + "' onclick='inputDropDownChange(this)'>" + keyList[i] + "</a></li>";
    }
    var html =
        "<label style='padding-right: 10px'>变量名<a data-toggle='tooltip' data-placement='top' title='请选择mat文件中的变量名'>  <i class='fa fa-question-circle'></i></a></label>" +
        "<br><div class='btn-group'>" +
        "<button type='button' class='btn btn-primary btn-outline dropdown-toggle float-button-light' " +
        "id='" + "mat_" + id + "' data-toggle='dropdown' aria-expanded='false' jsonKey='" + keyList[0] + "'>" +
        keyList[0] +
        "    <span class='caret'></span>" +
        "    <span class='sr-only'></span>" +
        "</button>" +
        "<ul class='dropdown-menu dropdown-menu-primary'" +
        "    aria-labelledby='primary-dropdown-outline'" +
        "    role='menu'>" +
        li_html +
        "</ul>" +
        "</div>";
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