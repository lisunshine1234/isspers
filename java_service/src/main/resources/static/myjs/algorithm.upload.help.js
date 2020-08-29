var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");

$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});

var maxFileSize = 1024 * 1024 * 10;
var minFileSize = 1;
var maxNumberOfFiles = 5000;
var uploadedBytes = 1024 * 1024 * 100;
var acceptFileTypes = /(\.|\/)py|m$/i;
var FileTypes = acceptFileTypes.toString().substring(8, acceptFileTypes.toString().length - 3);

var baseInfo_editor;

var now_loaded = 0,
    finish_upload_num = 0,
    now_size = 0,
    fileIndex = 0,
    functionIndex = 0,
    count = 0,
    jqupload,
    outputList_bak = [],
    inputListServer,
    outputListServer,
    displayListServer,
    outputKeyToIdJson = {};

var fileList = {files: [], paramName: [], originalFiles: []},
    uploadFileList = {},
    uploadFileNameList = [];

var algorithmEngine,
    algorithmEnvironment,
    algorithmType,
    methodFileList,
    inputTypeList,
    outputTypeList,
    outputIdWithDisplayTypeList;

var baseInfo = {},
    inputList = [],
    outputList = [],
    displayList = [],
    algorithmInfo;


var file_upload_remind = "点击或拖拉上传文件<br>" +
    "文件类型：" + FileTypes + "<br>" +
    "文件最大个数：" + maxNumberOfFiles + "<br>" +
    "单文件最小字节：" + fileSizeFormat(minFileSize) + "<br>" +
    "单文件最大字节：" + fileSizeFormat(maxFileSize) + "<br>" +
    "上传最大字节：" + fileSizeFormat(uploadedBytes);


$(document).ready(function () {
    "use strict";

    var u = window.location.href.split("/");
    var url2 = u[u.length - 2];
    if (url2 == "update") {
        var algorithmAllInfo = JSON.parse($("#algorithmAllInfo").val());
        $("#algorithmAllInfo").remove();
        getRunEnvironmentAndEngine(algorithmAllInfo);
    } else {
        getRunEnvironmentAndEngine(null);
    }
});

function renderAlgorithmInPage(json) {
    algorithmInfo = json.baseInfo;

    var navigation_parent = algorithmInfo.navigationParentId;
    var typeId;
    for (var i = 0, len = algorithmType.length; i < len; i++) {
        var navigationParent = algorithmType[i].navigationParentList.filter(function (e) {
            return e.id === navigation_parent;
        });
        if (navigationParent.length > 0) {
            typeId = algorithmType[i].id;
            break;
        }
    }

    document.getElementById("baseInfo_parent").innerHTML = parentSelectModel(typeId);

    baseInfo.name = algorithmInfo.algorithmName;
    baseInfo.type = typeId;
    baseInfo.parent = navigation_parent;
    baseInfo.environment = algorithmInfo.algorithmEnvironmentId;
    baseInfo.engine = algorithmInfo.algorithmEngineId;
    baseInfo.describe = algorithmInfo.algorithmDescribe;
    baseInfo.activate = algorithmInfo.activate;
    baseInfo.download = algorithmInfo.download;
    baseInfo.share = algorithmInfo.share;


    $("#baseInfo_name").val(algorithmInfo.algorithmName);
    $("#baseInfo_type").val(typeId);
    $("#baseInfo_parent").val(navigation_parent);
    $("#baseInfo_env").val(algorithmInfo.algorithmEnvironmentId);
    $("#baseInfo_eng").val(algorithmInfo.algorithmEngineId);
    $('#baseInfo_activate').prop('checked', algorithmInfo.activate);
    $('#baseInfo_download').prop('checked', algorithmInfo.download);
    $('#baseInfo_share').prop('checked', algorithmInfo.share);

    baseInfo_editor.txt.html(algorithmInfo.algorithmDescribe);


    if (algorithmInfo.algorithmPath != null) {
        renderAlgorithmFileListInPage(algorithmInfo.algorithmPath);
        inputListServer = json.inputList;
        outputListServer = json.outputList;
        displayListServer = json.displayList;
    }
}

function renderAlgorithmFileListInPage(path) {
    $.ajax({
        async: true,
        url: "/guteam/algorithm/my/getAlgorithmFileList",
        type: "POST",
        data: {"path": path},
        dataType: "json",
        beforeSend: function () {
            // swal({
            //     html: "<i  class='fa fa-spin fa-spinner'></i>正在获取算法文件，请稍等...",
            //     allowOutsideClick: false,
            //     allowEscapeKey: false,
            //     showConfirmButton: false
            // });
        },
        success: function (back) {
            if (back != null && back.length > 0) {
                $('#upload_place').removeClass("file-upload");
                $('#upload_place').addClass("file-upload-on");
                $("#upload_place").off("click");
                $('#upload_place').html("<table class='table' id='upload_table'><tbody></tbody></table>");
                $('#upload_table').append(uploadFileFromServerShow(back));
                $('#upload_add').show();
                $('#upload_submit').show();
                $('#upload_del_all').show();
                $('#upload_del').hide();
                $('#upload_del_close').hide();
            }
            swal.close();

        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function renderAlgorithmMethodInAndOutInPage() {
    var methodFile_temp = methodFileList.filter(function (e) {
        return e.fileName == algorithmInfo.algorithmFile;
    });
    console.log(methodFile_temp)
    if (methodFile_temp.length > 0) {
        var methodFile = methodFile_temp[0];
        fileIndex = methodFileList.indexOf(methodFile);
        $("#run_file").val(fileIndex);

        var methedList = methodFile.methodList;
        var method_temp = methedList.filter(function (e) {
            return e.methodName == algorithmInfo.algorithmRun;
        });
        if (method_temp.length > 0) {
            var method = method_temp[0];
            functionIndex = methedList.indexOf(method);
            $("#run_function").val(functionIndex);
            inputListInPage(inputListServer);
            outputListInPage(outputListServer);
            inputListServer = null;
            outputListServer = null;
        }
    }


}

function inputListInPage(inputList_in) {
    var html = "<table class='table upload-input-output-table'>" +
        "<thead>" +
        "<tr>" +
        "<td></td><td>关键词</td><td>名称</td><td>类型</td><td>类型内容</td><td>描述</td><td>是否必须</td><td>移动</td>" +
        "</tr>" +
        "</thead>" +
        "<tbody>";
    var typeIdList = [];
    if (inputList_in != null) {
        var len = inputList_in.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                count += 1;
                var input = {
                    "key": inputList_in[i].inputKey,
                    "name": inputList_in[i].inputName,
                    "describe": inputList_in[i].inputDescribe,
                    "type": inputList_in[i].inputTypeId,
                    "required": inputList_in[i].required
                };
                var inputType = inputTypeList.filter(function (e) {
                    return e.id == inputList_in[i].inputTypeId;
                })[0];
                typeIdList.push({"id": "input_type_" + count, "value": input.type});
                var required;
                if (inputList_in[i].required == false) {
                    required = "<input type='checkbox' id='input_required_" + count + "' name='functionInput'/>";
                } else {
                    required = "<input type='checkbox' checked='checked' id='input_required_" + count + "' name='functionInput'/>";
                }

                var hasJson = inputType.hasJson;
                var typeJson;
                if (hasJson == true) {
                    typeJson = "<input type='text' class='form-control' value='" + inputList_in[i].inputJson + "'id='input_typeJson_" + count + "' name='functionInput' onfocus='inputJsonInTextArea(this)' >";
                    input.typeJson = inputList_in[i].inputJson;
                } else {
                    typeJson = "<input type='text' class='form-control' disabled id='input_typeJson_" + count + "' name='functionInput' onfocus='inputJsonInTextArea(this)' >";
                }
                inputList.push(input);
                html +=
                    "<tr id='input_" + count + "'>" +
                    "<td><a name='del_file' href='javascript:void(0);' onclick='delInputAndOutputInTable(this)'><i class='fa fa-trash-o'></i></a></td>" +
                    "<td><input type='text' class='form-control' value='" + input.key + "' id='input_key_" + count + "' name='functionInput'></td>" +
                    "<td><input type='text' class='form-control' value='" + input.name + "' id='input_name_" + count + "' name='functionInput'></td>" +
                    "<td>" + inputTypeListModel(count) + "</td>" +
                    "<td>" + typeJson + "</td>" +
                    "<td><input type='text' class='form-control' value='" + input.describe + "' id='input_describe_" + count + "' name='functionInput' onfocus='inputTextInTextArea(this)' ></td>" +
                    "<td><label class='control control-checkbox control-inline'>" + required + "<span class='control-indicator'></span></label></td>" +
                    "<td>" +
                    "<button type='button' class='btn btn-primary float-button-light' onclick='elementLevelUp(this)'><i class='fa fa-level-up'></i></a></button>" +
                    "<button type='button' class='btn btn-primary float-button-light' onclick='elementLevelDown(this)'><i class='fa fa-level-down'></i></a></button>" +
                    "</td>" +
                    "</tr>";
            }
        }
    }
    html +=
        "<tr>" +
        "<td colspan='8'>" +
        "<button type='button' class='btn btn-block btn-primary float-button-light' id='addInput' onclick='addInput(this)'><i class='fa fa-plus'></i> 添加新的输入</button>" +
        "</td>" +
        "</tr>" +
        "</tbody>" +
        "</table>";
    document.getElementById("function_input_place").innerHTML = html;
    for (var j = 0, len1 = typeIdList.length; j < len1; j++) {
        $("#" + typeIdList[j].id).val(typeIdList[j].value);
    }
}

function outputListInPage(outputList_in) {
    var html =
        "<table class='table upload-input-output-table' >" +
        "<thead>" +
        "<tr>" +
        "<td></td><td>关键词</td><td>名称</td><td>类型</td><td>描述</td><td>移动</td>" +
        "</tr>" +
        "</thead>" +
        "<tbody>";

    var typeIdList = [];
    if (outputList_in != null) {
        var len = outputList_in.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                outputKeyToIdJson[outputList_in[i].outputKey] = outputList_in[i].id;
                var output = {
                    "key": outputList_in[i].outputKey,
                    "name": outputList_in[i].outputName,
                    "type": outputList_in[i].outputTypeId,
                    "describe": outputList_in[i].outputDescribe
                };
                count += 1;
                typeIdList.push({"id": "output_type_" + count, "value": outputList_in[i].outputTypeId});
                html +=
                    "<tr id='output_" + count + "'>" +
                    "<td ><a name='del_file' href='javascript:void(0);' onclick='delInputAndOutputInTable(this)'><i class='fa fa-trash-o'></i></a></td>" +
                    "<td ><input type='text' class='form-control' id='output_key_" + count + "' name='functionOutput' value='" + outputList_in[i].outputKey + "'></td>" +
                    "<td ><input type='text' class='form-control' id='output_name_" + count + "' name='functionOutput' value='" + outputList_in[i].outputName + "'></td>" +
                    "<td>" + outputTypeListModel(count) + "</td>" +
                    "<td><input type='text' class='form-control' name='functionOutput' value='" + outputList_in[i].outputDescribe + "' id='output_describe_" + count + "' onfocus='inputTextInTextArea(this)' ></td>" +
                    "<td>" +
                    "<button type='button' class='btn btn-primary float-button-light' onclick='elementLevelUp(this)'><i class='fa fa-level-up'></i></a></button>" +
                    "<button type='button' class='btn btn-primary float-button-light' onclick='elementLevelDown(this)'><i class='fa fa-level-down'></i></a></button>" +
                    "</td>" +
                    "</tr>";
            }
        }
    }
    html +=
        "<tr>" +
        "<td colspan='7'>" +
        "<button type='button' class='btn btn-block btn-primary float-button-light' id='addOutput' onclick='addOutput(this)'><i class='fa fa-plus'></i> 添加新的输出</button>" +
        "</td>" +
        "</tr>" +
        "</tbody>" +
        "</table>";
    document.getElementById("function_output_place").innerHTML = html;
    for (var j = 0, len1 = typeIdList.length; j < len1; j++) {
        $("#" + typeIdList[j].id).val(typeIdList[j].value);
    }
}

function displayListInPage(displayList_in) {
    var attr_id_value_list = [];
    var html = "";
    for (var j = 0, len1 = displayList_in.length; j < len1; j++) {
        count += 1;
        var key = displayList_in[j].outputKey;
        html +=
            "<tr>" +
            "<td ><a name='del_file' href='javascript:void(0);' onclick='delFileInTable(this)'><i class='fa fa-trash-o'></i></a></td>";
        if (key.indexOf(",") > -1) {
            html += "<td >" + outputKeyGroupCheckboxModel(count) + "</td>";
        } else {
            html += "<td >" + outputKeySelectModel(count) + "</td>";
        }
        html += "<td ><input type='text' id='display_name_" + count + "' name='functionDisplay' class='form-control'></td>" +
            "<td>" + outputTypeDisplayTypeListWithOption(count, displayList_in[j].outputTypeId) + "</td>" +
            "<td><input type='text' class='form-control' id='display_describe_" + count + "' name='functionDisplay' onfocus='inputTextInTextArea(this)'></td>" +
            "<td>" +
            "<button type='button' class='btn btn-primary float-button-light' onclick='elementLevelUp(this)'><i class='fa fa-level-up'></i></a></button>" +
            "<button type='button' class='btn btn-primary float-button-light' onclick='elementLevelDown(this)'><i class='fa fa-level-down'></i></a></button>" +
            "</td>" +
            "</tr>";

        attr_id_value_list.push({"id": "display_key_" + count, "value": key});
        attr_id_value_list.push({"id": "display_name_" + count, "value": displayList_in[j].displayName});
        attr_id_value_list.push({"id": "display_type_" + count, "value": displayList_in[j].displayTypeId});
        attr_id_value_list.push({"id": "display_describe_" + count, "value": displayList_in[j].displayDescribe});
    }

    $('#addGroupDisplay').parent().parent().before(html);

    for (var k = 0, len2 = attr_id_value_list.length; k < len2; k++) {
        $("#" + attr_id_value_list[k].id).val(attr_id_value_list[k].value);
    }
}

//初始化
function initModel() {
    $('#algorithm_upload_model_all').html(algorithmUploadModel());
    stepsRender();
    wangEditorRender();
    fileuploadRender();
    document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = "500px";
    document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = document.getElementById("algorithm_upload-p-0").scrollHeight + 50 + "px";

    $('#modalHelpPlace').html(inputTextInModalHtml() + inputJsonInModalHtml() + displayGroupModal());

    $('#upload_place').click(function () {
        $('#fileList').click();
    });

    $('#upload_add').click(function () {
        $('#fileList').click();
    });

    $('#upload_submit').click(function () {
        finish_upload_num = 0;
        uploadFileList.files = [];
        uploadFileList.originalFiles = [];
        uploadFileList.paramName = [];
        for (var i = 0, len = fileList.files.length; i < len; i++) {
            if (document.getElementById("upload_" + fileList.files[i].name).getAttribute("hasUpload") == 0) {
                uploadFileList.files.push(fileList.files[i]);
                uploadFileList.paramName.push(fileList.paramName[i]);
                uploadFileList.originalFiles.push(fileList.originalFiles[i]);
            }
        }
        if (uploadFileList.files.length > 0) {
            $('#progress_bar_all').css('width', "0%");
            $('#progress_bar_all').html('0%');
            $('#progress_bar_all').attr("aria-valuenow", 0);
            $('#upload_add').hide();
            $('#upload_submit').hide();
            $('#upload_del_all').hide();
            $('#upload_stop').show();

            uploadFileList.formData = {"algorithmInfo": JSON.stringify(algorithmInfo)};
            jqupload = uploadFileList.submit();
        } else {
            swal({
                title: "错误",
                text: "未找到可上传的文件",
                type: "error",
                confirmButtonColor: "#F9534F",
                confirmButtonText: "确定"
            });
        }
    });

    $('#upload_del_all').click(function () {
        var file_list_temp = $("[name='del_file']");
        for (var i = 0, len = file_list_temp.length; i < len; i++) {
            file_list_temp[i].setAttribute("onclick", "");
            file_list_temp[i].innerHTML = "<input type='checkbox' name='del_checkbox' value='" + file_list_temp[i].getAttribute("delId") + "'>";
        }
        $('#upload_add').hide();
        $('#upload_submit').hide();
        $('#upload_del_all').hide();
        $('#upload_del').show();
        $('#upload_del_close').show();
    });

    $('#upload_del').click(function () {

        var checkList = $("input[name='del_checkbox']:checked");
        var len = checkList.length;
        if (len < 0) {
            swal({
                title: "错误",
                text: "请选择需要删除的文件",
                type: 'error',
                confirmButtonColor: '#F9534F',
                confirmButtonText: '确定',
            })
        } else {
            delFileListInTable(checkList);
            // for (var i = 0; i < len; i++) {
            //     delFileInTable(checkList[i].parentNode);
            // }
        }
    });

    $('#upload_del_close').click(function () {
        var file_list_temp = $("[name='del_file']");
        for (var i = 0, len = file_list_temp.length; i < len; i++) {
            file_list_temp[i].setAttribute("onclick", "delFileInTable(this)");
            file_list_temp[i].innerHTML = "<i class='fa fa-trash-o'></i>";
        }
        $('#upload_add').show();
        $('#upload_submit').show();
        $('#upload_del_all').show();
        $('#upload_del').hide();
        $('#upload_del_close').hide();
    });

    $('#upload_stop').click(function () {
        jqupload.abort();
        swal({
            html: "<i  class='fa fa-spin fa-spinner'></i>正在终止上传，请稍等...",
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
        });
        var len = uploadFileList.files.length;
        if (document.getElementById("upload_" + uploadFileList.files[len - 1].name).getAttribute("hasUpload") == 1) {
            swal({
                title: "结束",
                text: "文件已上传结束，无法终止！",
                type: 'warning',
                confirmButtonColor: '#F9534F',
                confirmButtonText: '确定',
            })
        } else {
            for (var i = 0; i < len; i++) {
                $('#progress_bar_all').css('width', "0%");
                $('#progress_bar_all').html('0%');
                $('#progress_bar_all').attr("aria-valuenow", 0);
                var fileName = uploadFileList.files[i].name;
                var file_state = $("[id='" + fileName + "_state']");
                $("[id='progress_bar_" + fileName + "']").css('width', "0%");
                $("[id='progress_bar_" + fileName + "']").attr("aria-valuenow", 0);
                $("[id='upload_" + fileName + "']").attr("hasUpload", 0);
                file_state.children("i")[0].setAttribute("class", "fa fa-times");
                file_state.children("i")[0].style.color = "red";
                $('#fileList').animate({scrollTop: 0}, 1000);
            }
            swal.close();
        }

        $('#upload_add').show();
        $('#upload_submit').show();
        $('#upload_del_all').show();
        $('#upload_del').hide();
        $('#upload_del_close').hide();
    });

    $('#json_format').click(function () {
        if (isJSON($("#inputJsonInModal_textarea").val())) {
            var jsonPretty = JSON.stringify(JSON.parse($("#inputJsonInModal_textarea").val()), null, 2);
            $("#inputJsonInModal_textarea").val(jsonPretty);
        } else {
            swal({
                title: "错误",
                text: "该字符串不能转换为json，请检查输入的格式！",
                type: 'error',
                confirmButtonColor: '#F9534F',
                confirmButtonText: '确定',
            })
        }
    });

    $('#json_format_undo').click(function () {
        if (isJSON($("#inputJsonInModal_textarea").val())) {
            var jsonPretty = JSON.stringify(JSON.parse($("#inputJsonInModal_textarea").val()), null, 0);
            $("#inputJsonInModal_textarea").val(jsonPretty);
        } else {
            swal({
                title: "错误",
                text: "该字符串不能转换为json，请检查输入的格式！",
                type: 'error',
                confirmButtonColor: '#F9534F',
                confirmButtonText: '确定',
            })
        }
    })
}

function stepsRender() {
    /*启动步骤    常用的属性 和事件，或者可以从JS文件中选用自己要用到的属性 和事件重写赋值*/
    $("#algorithm_upload").steps({
        headerTag: "h3",
        bodyTag: "div",
        transitionEffect: "slideLeft",
        autoFocus: true,
        onStepChanging: function (event, beforeIndex, currentIndex) {/*步骤更改之前进行验证，默认验证结果是true*/
            return steps_validate(currentIndex, beforeIndex);
        },
        onStepChanged: function (event, currentIndex, beforeIndex) {/*切换section显示区后  触发的函数   */
            steps_change_render(beforeIndex, currentIndex);
        },
        onFinishing: function () {/*点击 finish 前 触发的事件，默认验证结果是false */
            return steps_validate_3();
            /*验证结果*/
        },
        onFinished: function () {/*点击 finish 后触发的事件*/
            saveDisplay();
        }
    })
}

function wangEditorRender() {
    let E = window.wangEditor;
    baseInfo_editor = new E('#baseInfo_editor');
    baseInfo_editor.customConfig.menus = ['head', 'bold', 'fontSize', 'fontName', 'italic', 'underline', 'strikeThrough', 'foreColor', 'backColor',
        'link', 'list', 'justify', 'quote', 'table', 'code', 'undo', 'redo'];
    baseInfo_editor.create();
}

function steps_change_render(beforeIndex, currentIndex) {
    switch (currentIndex) {
        case 0:
            document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = "500px";
            document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = document.getElementById("algorithm_upload-p-0").scrollHeight + 50 + "px";
            break;
        case 1:
            document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = "500px";
            document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = document.getElementById("algorithm_upload-p-1").scrollHeight + 50 + "px";
            break;
        case 2:
            uploadRunAndInputAndOutput();
            break;
        case 3:
            if ($("#addSingleDisplay").length == 0) {
                uploadDisplay();
            }
            if (displayListServer != null) {
                displayListInPage(displayListServer);
                displayListServer = null;
            }
            var functionDisplay = document.getElementsByName("functionDisplay");
            if (functionDisplay.length > 0 && outputList_bak.length > 0 && !checkOutput(outputList_bak, outputList)) {
                var outputList_bak_temp = []
                for (let i = 0, len = outputList_bak.length; i < len; i++) {
                    if (outputList.filter(function (e) {
                        return e.key === outputList_bak[i].key && e.type === outputList_bak[i].type;
                    }).length === 0) {
                        outputList_bak_temp.push(outputList_bak[i].key);
                    }
                }
                var remove_tr = [];
                for (let i = 0, len = functionDisplay.length; i < len; i++) {
                    let id = functionDisplay[i].getAttribute("id");
                    if (id.split("_")[1] == "key") {
                        var value;
                        value = $("#" + id).val();
                        var value_split = value.split(",");
                        for (let j = 0, len1 = value_split.length; j < len1; j++) {
                            if (outputList_bak_temp.indexOf(value_split[j]) > -1) {
                                remove_tr.push(id);
                                break;
                            }
                        }
                    }
                }
                for (let i = 0, len = remove_tr.length; i < len; i++) {
                    document.getElementById(remove_tr[i]).parentNode.parentNode.parentNode.remove();
                }
            }

            outputList_bak = [];
            for (let i = 0, len = outputList.length; i < len; i++) {
                outputList_bak.push(outputList[i])
            }

            document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = "500px";
            document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = document.getElementById("algorithm_upload-p-3").scrollHeight + 50 + "px";
            break;
    }

}

function checkOutput(array1, array2) {
    if (array1 == null || array2 == null || typeof array1 !== typeof array2 || array1.length !== array2.length) {
        return false
    }
    for (let i = 0, len = array1.length; i < len; i++) {
        if (typeof array1[i] !== typeof array2[i]) {
            return false;
        }
        if (array1[i] instanceof Object) {
            if (array2.filter(function (e) {
                return e.key === array1[i].key && e.type === array1[i].type;
            }).length === 0) {
                return false
            }

        } else {
            if (array1[i] !== array2[i]) {
                return false;
            }
        }
    }
    return true;
}

function checkArray(array1, array2, order) {
    if (array1 == null || array2 == null) {
        return array2 == null && array1 == null;
    }

    if (!(array1 instanceof Object) ||
        !(array2 instanceof Object) ||
        array1.length == null ||
        array2.length == null ||
        array1.length !== array2.length) {
        return false;
    }
    if (order) {
        for (let i = 0, len = array1.length; i < len; i++) {
            if (typeof array1[i] !== typeof array2[i] || array1[i].length !== array2[i].length) {
                return false;
            }
            if (array1[i] instanceof Object) {
                if (array1[i].length == null) {
                    if (!checkJson(array1[i], array2[i])) {
                        return false;
                    }
                } else {
                    if (!checkArray(array1[i], array2[i], true)) {
                        return false;
                    }
                }
            } else {
                if (array1[i] !== array2[i]) {
                    return false;
                }
            }
        }
    } else {
        let array2_temp = array2.slice();
        for (let j = 0, len1 = array1.length; j < len1; j++) {
            let sign = false;
            for (let k = 0, len2 = array2_temp.length; k < len2; k++) {
                if (typeof array1[j] !== typeof array2_temp[k] || array1[j].length !== array2_temp[k].length) {
                    break;
                } else {
                    if (array1[j] instanceof Object) {
                        if (array1[j].length == null) {
                            if (checkJson(array1[j], array2[j])) {
                                sign = true;
                            } else {
                                break;
                            }
                        } else {
                            if (checkArray(array1[j], array2_temp[k], true)) {
                                sign = true;
                            } else {
                                break;
                            }
                        }
                    } else {
                        if (array1[j] === array2_temp[k]) {
                            sign = true;
                        } else {
                            break;
                        }
                    }
                }

                if (sign) {
                    array2_temp.splice(k, 1);
                    break;
                } else if (k === len2 - 1) {
                    return false;
                }


            }
        }
    }

    return true;
}

function checkJson(json1, json2) {
    if (json1 == null || json2 == null) {
        return json1 == null && json2 == null;
    }
    if (typeof json1 instanceof Object ||
        typeof json2 instanceof Object ||
        Object.keys(json1).length !== Object.keys(json2).length ||
        JSON.stringify(json1).length !== JSON.stringify(json2).length) {
        return false;
    }

    for (var key_temp in json1) {
        if (!(key_temp in json2)) {
            return false;
        }
        if (json1[key_temp] !== json2[key_temp]) {
            return false;
        }
    }

    return true;
}


//save
function saveBaseInfo() {
    $.ajax({
        async: true,
        url: "/guteam/algorithm/my/save/baseInfo",
        type: "POST",
        data: {"json": JSON.stringify({"baseInfo": baseInfo, "algorithmInfo": algorithmInfo})},
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在保存算法基本信息，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            })
        },
        success: function (back) {
            swal.close();
            algorithmInfo = back;
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function saveInputListAndOutputList() {
    $.ajax({
        async: true,
        url: "/guteam/algorithm/my/save/inputListAndOutputList",
        type: "POST",
        data: {"json": JSON.stringify({"inputList": inputList, "outputList": outputList, "algorithmInfo": algorithmInfo})},
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在保存算法的输入和输出，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            })
        },
        success: function (back) {
            algorithmInfo = back.algorithmInfo;
            // var inputListServer_temp = back.inputList;
            var outputListServer_temp = back.outputList;
            if (displayListServer != null) {
                displayListServer = back.displayList;
            }
            for (let i = 0, len = outputListServer_temp.length; i < len; i++) {
                outputKeyToIdJson[outputListServer_temp[i].outputKey] = outputListServer_temp[i].id;
            }
            swal.close();
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function saveDisplay() {
    var displayList_temp = [];
    for (let i = 0, len = displayList.length; i < len; i++) {
        displayList_temp.push(displayList[i]);
    }
    for (let i = 0, len = displayList_temp.length; i < len; i++) {
        var key_split = displayList_temp[i].key.split(",");
        var key = "";
        for (let j = 0, len1 = key_split.length; j < len1; j++) {
            key += outputKeyToIdJson[key_split[j]] + ",";
        }
        displayList_temp[i].key = key.substr(0, key.length - 1);
    }

    $.ajax({
        async: true,
        url: "/guteam/algorithm/my/save/displayList",
        type: "POST",
        data: {"json": JSON.stringify({"displayList": displayList_temp, "algorithmInfo": algorithmInfo})},
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在保存算法可视化，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            })
        },
        success: function (back) {
            if (back["sign"] == false) {
                swal({
                    title: "错误",
                    text: "保存错误，请重试！",
                    type: "error",
                    showConfirmButton: false,
                    showCancelButton: true,
                    cancelButtonColor: '#3085d6',
                    cancelButtonText: '确定',
                }).catch(swal.noop);
            } else {
                swal.close();
                swal({
                    title: "成功",
                    text: "算法上传成功！",
                    type: "success",
                    showConfirmButton: false,
                    showCancelButton: true,
                    cancelButtonColor: '#3085d6',
                    cancelButtonText: '确定',
                }).catch(swal.noop);
            }
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

// validate
function steps_validate(currentIndex, beforeIndex) {
    if (currentIndex < beforeIndex) {
        return true;
    } else if (currentIndex - beforeIndex > 1) {
        return false;
    }
    switch (beforeIndex) {
        case 0:
            return steps_validate_0();
        case 1:
            return steps_validate_1();
        case 2:
            return steps_validate_2();
        // case 3:
        //     return steps_validate_3();
    }
}

function steps_validate_0() {
    let baseInfo_temp = document.getElementsByName("baseInfo");
    let baseInfoJson = {};

    for (let i = 0, len = baseInfo_temp.length; i < len; i++) {
        let id = baseInfo_temp[i].id;
        let type = id.split("_")[1];
        switch (type) {
            case "name":
                let name_temp = document.getElementById(id).value;
                if (myValidata(name_temp, "chineseAndEnglishKey", 1, 20, "算法名称", id)) {
                    baseInfoJson.name = name_temp;
                } else {
                    return false;
                }
                break;
            case "type":
                let type_temp = document.getElementById(id).value;
                if (myValidata(type_temp, "none", 1, -1, "算法类别-父类", id)) {
                    baseInfoJson.type = type_temp;
                } else {
                    return false;
                }
                break;
            case "parent":
                let parent_temp = document.getElementById(id).value;
                if (myValidata(parent_temp, "none", 1, -1, "算法类别-子类", id)) {
                    baseInfoJson.parent = parent_temp;
                } else {
                    return false;
                }
                break;
            case "env":
                let env_temp = document.getElementById(id).value;
                if (myValidata(env_temp, "none", 1, -1, "运行环境", id)) {
                    baseInfoJson.environment = env_temp;
                } else {
                    return false;
                }
                break;
            case "activate":
                baseInfoJson.activate = document.getElementById(id).checked;
                break;
            case "share":
                baseInfoJson.share = document.getElementById(id).checked;
                break;
            case "download":
                baseInfoJson.download = document.getElementById(id).checked;
                break;
            case "eng":
                let eng_temp = document.getElementById(id).value;
                if (myValidata(eng_temp, "none", 1, -1, "主要计算引擎", id)) {
                    baseInfoJson.engine = eng_temp;
                } else {
                    return false;
                }
                break;
            case "editor":
                let editor_temp = baseInfo_editor.txt.html();
                baseInfoJson.describe = editor_temp;
                break;
        }
    }
    if (!checkJson(baseInfo, baseInfoJson)) {
        baseInfo = baseInfoJson;
        saveBaseInfo();
    }
    return true;
}

function steps_validate_1() {
    let sign = false;
    for (let i = 0, len = uploadFileNameList.length; i < len; i++) {
        if ($("[id='upload_" + uploadFileNameList[i] + "']").attr('hasUpload') == 1) {
            sign = true;
            break;
        }
    }
    if (!sign) {
        swal({
            title: "错误",
            text: "至少上传一个算法文件",
            type: 'error',
            confirmButtonColor: '#F9534F',
            confirmButtonText: '确定',
        }).then(function (isConfirm) {
            $('html,body').animate({scrollTop: $('#upload_place').offset().top - 150}, 1000);
        }, function (dismiss) {
            $('html,body').animate({scrollTop: $('#upload_place').offset().top - 150}, 1000);
        }).catch(swal.noop);

    }
    return sign;
}

function steps_validate_2() {
    var algorithmFile_temp = methodFileList[fileIndex]["fileName"];
    var algorithmRun_temp = methodFileList[fileIndex]["methodList"][functionIndex]["methodName"];
    var input_temp = getInputList();
    if (input_temp == "false") {
        return false;
    }
    if (input_temp.length == 0) {
        swal({
            title: "错误",
            text: "算法输入不能为空",
            type: 'error',
            confirmButtonColor: '#F9534F',
            confirmButtonText: '确定',
        }).catch(swal.noop);
        return false;
    }
    var output_temp = getOutputList();
    if (output_temp == "false") {
        return false;
    }
    if (output_temp.length == 0) {
        swal({
            title: "错误",
            text: "算法输出不能为空",
            type: 'error',
            confirmButtonColor: '#F9534F',
            confirmButtonText: '确定',
        }).catch(swal.noop);
        return false;
    }
    //是否保存到数据库校验
    if (algorithmFile_temp != algorithmInfo.algorithmFile ||
        algorithmRun_temp != algorithmInfo.algorithmRun ||
        !checkArray(inputList, input_temp, true) ||
        !checkArray(outputList, output_temp, true)) {

        algorithmInfo.algorithmFile = algorithmFile_temp;
        algorithmInfo.algorithmRun = algorithmRun_temp;
        inputList = input_temp;
        outputList = output_temp;
        saveInputListAndOutputList();
    }
    return true;
}

function steps_validate_3() {
    var functionDisplay = document.getElementsByName("functionDisplay");
    var json;
    var disPlayList_temp = [];
    var sign = -1;
    for (var i = 0, len = functionDisplay.length; i < len; i++) {
        var id = functionDisplay[i].id;
        var display_split = id.split("_");
        var split_len = display_split.length;
        var num = display_split[split_len - 1];
        if (sign != num) {
            json = {};
            sign = num;
        }

        switch (display_split[1]) {
            case "key":
                var key_temp;
                key_temp = $("#" + id).val();
                if (myValidata(key_temp, "englishKey", 1, -1, "可视化关键词", id)) {
                    json.key = key_temp;
                } else {
                    return false;
                }
                break;
            case "name":
                var name_temp = functionDisplay[i].value;
                if (myValidata(name_temp, "chineseAndEnglishKey", 1, 20, "可视化名称", id)) {
                    json.name = name_temp;
                } else {
                    return false;
                }
                break;
            case "type":
                var type_temp = functionDisplay[i].value;
                if (myValidata(type_temp, "none", 1, -1, "可视化类型", id)) {
                    json.type = type_temp;
                } else {
                    return false;
                }
                break;
            case "describe":
                var describe_temp = functionDisplay[i].value;
                if (myValidata(describe_temp, "none", 1, 300, "输入描述", id)) {
                    json.describe = describe_temp;
                } else {
                    return false;
                }
                break;
        }

        if (i == len - 1 || functionDisplay[i + 1].id.split("_")[split_len - 1] != sign) {
            disPlayList_temp.push(json);
        }
    }
    if (disPlayList_temp.length == 0) {
        swal({
            title: "错误",
            text: "算法可视化不能为空",
            type: 'error',
            confirmButtonColor: '#F9534F',
            confirmButtonText: '确定',
        }).catch(swal.noop);
        return false;
    }
    displayList = disPlayList_temp;
    return true;
}

function getInputList() {
    var functionInput = document.getElementsByName("functionInput");
    var json;
    var inputList = [];
    var sign = -1;
    for (var i = 0, len = functionInput.length; i < len; i++) {
        var id = functionInput[i].id;
        var input_split = id.split("_");
        var split_len = input_split.length;
        var num = input_split[split_len - 1];
        if (sign != num) {
            json = {};
            sign = num;
        }
        switch (input_split[1]) {
            case "key":
                var key_temp = functionInput[i].value;
                if (myValidata(key_temp, "englishKey", 1, 30, "输入关键词", id)) {
                    if (inputList.filter(function (e) {
                        return e.key == key_temp
                    }).length > 0) {
                        swalHelper("错误", "输入关键词重复", "error", id);
                        return "false";
                    }
                    json.key = key_temp;
                } else {
                    return "false";
                }
                break;
            case "name":
                var name_temp = functionInput[i].value;
                if (myValidata(key_temp, "chineseAndEnglishKey", 1, 20, "输入名称", id)) {
                    json.name = name_temp;
                } else {
                    return "false";
                }
                break;
            case "type":
                var type_temp = functionInput[i].value;
                if (myValidata(type_temp, "none", 1, -1, "输入类型", id)) {
                    json.type = type_temp;
                } else {
                    return "false";
                }
                break;
            case "typeJson":
                if (functionInput[i].getAttribute("disabled") == null) {
                    var typeJson_temp = functionInput[i].value;
                    if (myValidata(typeJson_temp, "json", 1, 300, "输入类型内容", id)) {
                        json.typeJson = typeJson_temp;
                    } else {
                        return "false";
                    }
                }
                break;
            case "describe":
                var describe_temp = functionInput[i].value;
                if (myValidata(describe_temp, "none", 1, 300, "输入描述", id)) {
                    json.describe = describe_temp;
                } else {
                    return "false";
                }
                break;

            case "required":
                var required_temp = functionInput[i].checked;
                json.required = required_temp;
                break;
        }
        if (i == len - 1) {
            inputList.push(json);
        } else if (functionInput[i + 1].id.split("_")[split_len - 1] != sign) {
            inputList.push(json);
        }
    }
    return inputList;
}

function getOutputList() {
    var functionOutput = document.getElementsByName("functionOutput");
    var json;
    var outputList = [];
    var sign = -1;
    for (var i = 0, len = functionOutput.length; i < len; i++) {
        var id = functionOutput[i].id;
        var output_split = id.split("_");
        var split_len = output_split.length;
        var num = output_split[split_len - 1];
        if (sign != num) {
            json = {};
            sign = num;
        }
        switch (output_split[1]) {
            case "key":
                var key_temp = functionOutput[i].value;
                if (myValidata(key_temp, "englishKey", 1, 30, "输出关键词", id)) {
                    if (outputList.filter(function (e) {
                        return e.key == key_temp
                    }).length > 0) {
                        swalHelper("错误", "输出关键词重复", "error", id);
                        return "false";
                    }
                    json.key = key_temp;
                } else {
                    return "false";
                }
                break;
            case "name":
                var name_temp = functionOutput[i].value;
                if (myValidata(name_temp, "chineseAndEnglishKey", 1, 30, "输出名称", id)) {
                    json.name = name_temp;
                } else {
                    return "false";
                }
                break;
            case "type":
                var type_temp = functionOutput[i].value;
                if (myValidata(type_temp, "none", 1, -1, "输出类型", id)) {
                    json.type = type_temp;
                } else {
                    return "false";
                }
                break;
            case "describe":
                var describe_temp = functionOutput[i].value;
                if (myValidata(describe_temp, "none", 1, 300, "输出描述", id)) {
                    json.describe = describe_temp;
                } else {
                    return "false";
                }
                break;
        }
        if (i == len - 1) {
            outputList.push(json);
        } else if (functionOutput[i + 1].id.split("_")[split_len - 1] != sign) {
            outputList.push(json);
        }

    }

    return outputList;
}

//服务端获取数据
function getRunEnvironmentAndEngine(json) {
    $.ajax({
        async: true,
        url: "/guteam/algorithm/my/add/getEnvironmentAndEngine",
        type: "POST",
        // data: {"json": JSON.stringify({"algorithmId": algorithmId})},
        dataType: "json",
        beforeSend: function () {
        },
        success: function (back) {
            algorithmEngine = back["algorithmEngine"];
            algorithmEnvironment = back["algorithmEnvironment"];
            algorithmType = back["algorithmType"];
            initModel();
            if (json != null && json.baseInfo != null) {
                renderAlgorithmInPage(json);
            } else {
                swal.close();
            }
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    })
}

//页面获取数据
function algorithmUploadModel() {
    var html =
        "<div id='algorithm_upload' >" +
        "    <h3>基本信息</h3>" +
        "    <div>" +
        uploadBaseInfo() +
        "    </div>" +
        "    <h3>执行</h3>" +
        "    <div>" +
        uploadFile() +
        "    </div>" +
        "    <h3>输入和输出</h3>" +
        "    <div>" +
        // uploadRunAndInputAndOutput() +
        "    </div>" +
        "    <h3>可视化</h3>" +
        "    <div>" +
        // uploadDisplay() +
        "    </div>" +
        "</div>";
    return html;
}

//steps 0
function uploadBaseInfo() {
    let env_len = algorithmEnvironment.length;
    let eng_len = algorithmEngine.length;
    let type_len = algorithmType.length;

    let html_type =
        "<div class='form-group'>" +
        "<select onchange='algorithmTypeChangeToParent(this)' class='form-control select-control' id='baseInfo_type' name='baseInfo'>";
    for (let i = 0; i < type_len; i++) {
        html_type += "<option value='" + algorithmType[i]["id"] + "'>" + algorithmType[i]["navigationName"] + "</option>";
    }
    html_type += "</select></div>";
    let html_parent = "<div class='form-group'><select class='form-control select-control' id='baseInfo_parent' name='baseInfo'>" + parentSelectModel(algorithmType[0]["id"]) + "</select></div>";


    let html_env =
        "<div class='form-group'>" +
        "<select class='form-control select-control' id='baseInfo_env' name='baseInfo'>";
    for (let j = 0; j < env_len; j++) {
        html_env += "<option value='" + algorithmEnvironment[j]["id"] + "'>" + algorithmEnvironment[j]["algorithmEnvironmentName"] + "</option>";
    }
    html_env += "</select></div>";

    let html_eng =
        "<div class='form-group'>" +
        "<select class='form-control select-control' id='baseInfo_eng' name='baseInfo'>";
    for (var k = 0; k < eng_len; k++) {
        html_eng += "<option value='" + algorithmEngine[k]["id"] + "'>" + algorithmEngine[k]["engineName"] + "</option>";
    }
    html_eng += "</select></div>";

    let html_activate =
        "<label class='switcher'>" +
        "<input type='checkbox' checked id='baseInfo_activate' name='baseInfo'>" +
        "<span class='switcher-indicator success-switcher'>" +
        "</span>" +
        "</label>";
    let html_share =
        "<label class='switcher'>" +
        "<input type='checkbox' checked id='baseInfo_share' name='baseInfo'>" +
        "<span class='switcher-indicator success-switcher'>" +
        "</span>" +
        "</label>";
    let html_download =
        "<label class='switcher'>" +
        "<input type='checkbox' id='baseInfo_download' name='baseInfo'>" +
        "<span class='switcher-indicator success-switcher'>" +
        "</span>" +
        "</label>";

    let html =
        "<label>算法名称</label>" +
        "<div class='form-group'>" +
        "    <input class='form-control' type='text' id='baseInfo_name' name='baseInfo'>" +
        "</div>" +

        "<label>算法类别</label>" +
        "<div class='form-group'>" +
        html_type + html_parent +
        "</div>" +
        "<label>运行环境</label>" +
        "<div class='form-group'>" +
        html_env +
        "</div>" +
        "<label>主要计算引擎</label>" +
        "<div class='form-group'>" +
        html_eng +
        "</div>" +
        "<label>是否激活</label>" +
        "<div class='form-group'>" +
        html_activate +
        "</div>" +
        "<label>是否分享</label>" +
        "<div class='form-group'>" +
        html_share +
        "</div>" +
        "<label>是否可下载</label>" +
        "<div class='form-group'>" +
        html_download +
        "</div>" +
        "<label>项目描述</label>" +
        "<div class='form-group'>" +
        "      <div id='baseInfo_editor' name='baseInfo'></div>" +
        "</div>";
    return html;
}

function algorithmTypeChangeToParent(obj) {
    var html_parent = parentSelectModel(obj.value);
    document.getElementById("baseInfo_parent").innerHTML = html_parent;
}

function parentSelectModel(typeId) {
    var parentList;
    for (var j = 0, len1 = algorithmType.length; j < len1; j++) {
        if (typeId == algorithmType[j]["id"]) {
            parentList = algorithmType[j]["navigationParentList"];
            break;
        }
    }

    var html_parent = "";
    for (var i = 0, len = parentList.length; i < len; i++) {
        html_parent += "<option value='" + parentList[i]["id"] + "'>" + parentList[i]["navigationName"] + "</option>";
    }
    return html_parent;

}

function uploadFile() {
    var html =
        "<label>数据集文件</label>" +
        "<div class='form-group'>" +
        "    <div class='upload-model' id='upload-model'>" +
        uploadModel() +
        "    </div>" +
        "</div>";
    return html;
}

//steps 1
function fileuploadRender() {
    $('#fileList').fileupload({
            type: 'POST',
            url: '/guteam/algorithm/my/upload',
            dataType: 'json',
            autoUpload: false,
            singleFileUploads: false,
            multiple: true,
            dragDrop: true,
            sequential: true,
            sequentialCount: 1,
            add: function (ev, data) {
                if (uploadFileList.abort == null) {
                    uploadFileList = {
                        "abort": data.abort,
                        "fileInput": data.fileInput,
                        "fileInputClone": data.fileInputClone,
                        "form": data.form,
                        "process": data.process,
                        "processing": data.processing,
                        "progress": data.progress,
                        "response": data.response,
                        "state": data.state,
                        "submit": data.submit,
                        "_progress": data._progress,
                        "_response": data._response,
                        "__proto__": data.__proto__,
                    };
                }

                let data_temp;
                let len = data.files.length;
                let num = uploadFileNameList.length;
                let size_temp = now_size;
                let sign = true;
                if (num + len > maxNumberOfFiles) {
                    swal({
                        title: "错误",
                        text: "超出文件的最大上传数量" + maxNumberOfFiles + "，请重新选择!",
                        type: 'error',
                        confirmButtonColor: '#F9534F',
                        confirmButtonText: '确定',
                    });
                    sign = false;
                } else {
                    for (let i = 0; i < len; i++) {
                        let file = data.files[i];
                        let name = file.name;
                        if (!(/(\.|\/)py|m$/i.test(name))) {
                            swal({
                                title: "文件格式错误",
                                text: "只限" + FileTypes + "格式的文件，请重新选择!",
                                type: 'error',
                                confirmButtonColor: '#F9534F',
                                confirmButtonText: '确定',
                            });
                            sign = false;
                            break;
                        } else if (file.size < minFileSize) {
                            swal({
                                title: "文件大小错误",
                                text: "文件最小为" + fileSizeFormat(minFileSize) + "，请重新选择!",
                                type: 'error',
                                confirmButtonColor: '#F9534F',
                                confirmButtonText: '确定',
                            });
                            sign = false;
                            break;
                        } else if (file.size > maxFileSize) {
                            swal({
                                title: "文件大小错误",
                                text: "文件最大为" + fileSizeFormat(maxFileSize) + "，请重新选择!",
                                type: 'error',
                                confirmButtonColor: '#F9534F',
                                confirmButtonText: '确定',
                            });
                            sign = false;
                            break;
                        } else {
                            size_temp = file.size + now_size;
                            if (size_temp > uploadedBytes) {
                                swal({
                                    title: "错误",
                                    text: "超出文件的上传最大字节" + fileSizeFormat(uploadedBytes) + "，请重新选择!",
                                    type: 'error',
                                    confirmButtonColor: '#F9534F',
                                    confirmButtonText: '确定',
                                });
                                sign = false;
                                break;
                            }
                        }
                    }
                }
                if (sign == true) {
                    now_size = size_temp;
                    let sameFileNameList = [];
                    for (let i = 0; i < len; i++) {
                        let fileName = data.files[i].name;
                        let file_temp = uploadFileNameList.filter(function (e) {
                            return e == fileName;
                        });
                        if (file_temp.length > 0) {
                            sameFileNameList.push(fileName)
                        }
                    }

                    if (sameFileNameList.length > 0) {
                        swal({
                            title: "存在" + sameFileNameList.length + "个同名文件",
                            text: "确认后新文件将会替换原文件(已经上传的文件自动从服务器删除)",
                            type: 'warning',
                            confirmButtonColor: '#3085d6',
                            confirmButtonText: '确认',
                            showCancelButton: true,
                            cancelButtonColor: '#d33',
                            cancelButtonText: '取消',
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                        }).then(function (isConfirm) {
                            $('#upload_add').show();
                            $('#upload_submit').show();
                            $('#upload_del_all').show();
                            for (let i = 0; i < len; i++) {
                                let files = data.files[i];
                                let paramName = data.paramName[i];
                                let originalFiles = data.originalFiles[i];
                                let name = files.name;
                                if (sameFileNameList.indexOf(name) >= 0) {
                                    delFileInTable(document.getElementById("del_file_" + name));
                                }
                                fileList.files.push(files);
                                fileList.paramName.push(paramName);
                                fileList.originalFiles.push(originalFiles);

                                if ($('#upload_table').length == 0) {
                                    $('#upload_place').removeClass("file-upload");
                                    $('#upload_place').addClass("file-upload-on");
                                    $("#upload_place").off("click");
                                    $('#upload_place').html("<table class='table' id='upload_table'><tbody></tbody></table>");
                                }

                                uploadFileNameList.push(name);

                                $('#upload_table').append(uploadFileShow(files));
                            }
                        }, function (dismiss) {
                            if (sameFileNameList.length < len) {
                                $('#upload_add').show();
                                $('#upload_submit').show();
                                $('#upload_del_all').show();
                            }
                            for (let i = 0; i < len; i++) {
                                let files = data.files[i];
                                let paramName = data.paramName[i];
                                let originalFiles = data.originalFiles[i];
                                let name = files.name;

                                if (sameFileNameList.indexOf(name) < 0) {
                                    fileList.files.push(files);
                                    fileList.paramName.push(paramName);
                                    fileList.originalFiles.push(originalFiles);

                                    if ($('#upload_table').length == 0) {
                                        $('#upload_place').removeClass("file-upload");
                                        $('#upload_place').addClass("file-upload-on");
                                        $("#upload_place").off("click");
                                        $('#upload_place').html("<table class='table' id='upload_table'><tbody></tbody></table>");
                                    }
                                    uploadFileNameList.push(name);
                                    $('#upload_table').append(uploadFileShow(files));
                                }

                            }
                        }).catch(swal.noop);
                    } else {
                        $('#upload_add').show();
                        $('#upload_submit').show();
                        $('#upload_del_all').show();
                        for (let i = 0; i < len; i++) {
                            let files = data.files[i];
                            let paramName = data.paramName[i];
                            let originalFiles = data.originalFiles[i];
                            let name = files.name;

                            fileList.files.push(files);
                            fileList.paramName.push(paramName);
                            fileList.originalFiles.push(originalFiles);

                            if ($('#upload_table').length == 0) {
                                $('#upload_place').removeClass("file-upload");
                                $('#upload_place').addClass("file-upload-on");
                                $("#upload_place").off("click");
                                $('#upload_place').html("<table class='table' id='upload_table'><tbody></tbody></table>");
                            }

                            uploadFileNameList.push(name);

                            $('#upload_table').append(uploadFileShow(files));
                        }
                    }
                }


            },
            progress: function (e, data) {
                $("[name='del_file']").off('click');
                if (data.loaded < data.total) {
                    var loaded_temp = data.loaded - now_loaded;
                    for (var i = finish_upload_num, len = data.files.length; i < len; i++) {
                        var fileName = data.files[i].name;
                        var file_state = $("[id='" + fileName + "_state']");
                        if (loaded_temp > data.files[i].size) {
                            loaded_temp = loaded_temp - data.files[i].size;
                            $("[id='progress_bar_" + fileName + "']").css('width', "100%");
                            $("[id='progress_bar_" + fileName + "']").css('width', "100%");
                            $("[id='upload_" + fileName + "']").attr("hasUpload", 1);
                            file_state.children("i")[0].setAttribute("class", "fa fa-check");
                            file_state.children("i")[0].style.color = "green";
                        } else {
                            var temp_num = parseInt(loaded_temp / data.files[i].size * 100, 10);
                            $("[id='progress_bar_" + fileName + "']").css('width', temp_num + "%");
                            $("[id='progress_bar_" + fileName + "']").attr("aria-valuenow", temp_num);
                            file_state.children("i")[0].setAttribute("class", "fa fa-spin fa-spinner");
                            file_state.children("i")[0].style.color = "grey";
                            finish_upload_num = i;
                            now_loaded = data.loaded;
                            break;
                        }
                    }
                } else {
                    for (var i = finish_upload_num, len = data.files.length; i < len; i++) {
                        var fileName = data.files[i].name;
                        var file_state = $("[id='" + fileName + "_state']");
                        $("[id='progress_bar_" + fileName + "']").css('width', "100%");
                        $("[id='progress_bar_" + fileName + "']").attr("aria-valuenow", 100);
                        $("[id='upload_" + fileName + "']").attr("hasUpload", 1);
                        file_state.children("i")[0].setAttribute("class", "fa fa-check");
                        file_state.children("i")[0].style.color = "green";
                        finish_upload_num = i;
                    }
                }
                var all_num = parseInt(data.loaded / data.total * 80, 10);


                $('#progress_bar_all').css('width', all_num + "%");
                $('#progress_bar_all').html(all_num + '%');
                $('#progress_bar_all').attr("aria-valuenow", all_num);

            }
            ,
            //上传请求失败时触发的回调函数，如果服务器返回一个带有error属性的json响应这个函数将不会被触发
            fail: function (e, data) {
                var len = uploadFileList.files.length;
                swal({
                    title: "错误",
                    text: "文件上传过程中出错！",
                    type: 'error',
                    confirmButtonColor: '#F9534F',
                    confirmButtonText: '确定',
                });

                for (var i = 0; i < len; i++) {
                    $('#progress_bar_all').css('width', "0%");
                    $('#progress_bar_all').html('0%');
                    $('#progress_bar_all').attr("aria-valuenow", 0);
                    var fileName = uploadFileList.files[i].name;
                    var file_state = $("[id='" + fileName + "_state']");
                    $("[id='progress_bar_" + fileName + "']").css('width', "0%");
                    $("[id='progress_bar_" + fileName + "']").attr("aria-valuenow", 0);
                    $("[id='upload_" + fileName + "']").attr("hasUpload", 0);
                    file_state.children("i")[0].setAttribute("class", "fa fa-times");
                    file_state.children("i")[0].style.color = "red";
                    $('#fileList').animate({scrollTop: 0}, 1000);
                }

                $('#upload_add').show();
                $('#upload_submit').show();
                $('#upload_del_all').show();
                $('#upload_del').hide();
                $('#upload_del_close').hide();
            }
            ,

            done: function (e, data) {
                $('#upload_add').show();
                $('#upload_submit').show();
                $('#upload_del_all').show();
                $('#upload_stop').hide();
            }
            ,
            success: function (result, textStatus, jqXHR) {
                algorithmInfo = result.algorithmInfo;
                $('#progress_bar_all').css('width', "100%");
                $('#progress_bar_all').html('100%');
                $('#progress_bar_all').attr("aria-valuenow", 100);
            }
            ,
            //上传请求结束时（成功，错误或者中止）都会被触发。
            always: function (e, data) {
                fileList.files.splice(0, finish_upload_num);
                fileList.originalFiles.splice(0, finish_upload_num);
                fileList.paramName.splice(0, finish_upload_num);
                now_loaded = 0;
                finish_upload_num = 0;
                now_size = 0;
                $('#upload_add').show();
                $('#upload_submit').show();
                $('#upload_del_all').show();
                $('#upload_stop').hide();

            }
        }
    )


}

function uploadModel() {
    var html =
        "<button type='button' class='btn btn-primary' id='upload_add'>添加文件</button>" +
        "    <button type='button' class='btn btn-success' id='upload_submit' style='display: none'>开始上传</button>" +
        "    <button type='button' class='btn btn-danger' id='upload_del_all' style='display: none'>批量删除</button>" +
        "    <button type='button' class='btn btn-danger' id='upload_del' style='display: none'>删除</button>" +
        "    <button type='button' class='btn btn-default' id='upload_del_close' style='display: none'>关闭</button>" +
        "    <button type='button' class='btn btn-danger' id='upload_stop' style='display: none'>终止上传</button>" +
        "    <div class='progress'>" +
        "        <div class='progress-bar progress-bar-success' aria-valuenow='0' aria-valuemin='0'" +
        "             aria-valuemax='100' id='progress_bar_all' style='width: 0;'>0%" +
        "        </div>" +
        "    </div>" +
        "    <div class='file-upload col-lg-12 col-md-12 col-sm-12 col-xs-12' id='upload_place'>" + file_upload_remind + "</div>" +
        "    <input type='file' multiple='multiple' class='' id='fileList' name='fileList' hidden>";
    return html;
}

function delFileListInTable(fileChecked) {
    var hasUploadFileNameList = [];
    var hasUploadFileList = [];
    var notUploadFileList = [];
    var tbody = fileChecked[0].parentNode.parentNode.parentNode.parentNode;

    for (var i = 0, len = fileChecked.length; i < len; i++) {
        var tr = fileChecked[i].parentNode.parentNode.parentNode;
        var fileName = tr.id.substring(7, tr.id.length);
        if (tr.getAttribute("hasUpload") == 1) {
            hasUploadFileNameList.push(fileName)
            hasUploadFileList.push(tr);
        } else {
            notUploadFileList.push(tr);
        }
    }

    if (hasUploadFileNameList.length > 0) {
        delFileListAtServer(hasUploadFileNameList);
    }

    for (var j = 0, len1 = hasUploadFileList.length; j < len1; j++) {
        var tr = hasUploadFileList[j];
        var fileName = tr.id.substring(7, tr.id.length);
        uploadFileNameList.splice(uploadFileNameList.indexOf(fileName), 1);
        tr.remove();
    }

    for (var k = 0, len2 = notUploadFileList.length; k < len2; k++) {
        var tr = notUploadFileList[k];
        var fileName = tr.id.substring(7, tr.id.length);
        var file = fileList.files.filter(function (e) {
            return e.name == fileName;
        })[0];
        var index = fileList.files.indexOf(file);
        fileList.files.splice(index, 1);
        fileList.originalFiles.splice(index, 1);
        fileList.paramName.splice(index, 1);
        tr.remove();
    }

    if (tbody.childNodes.length == 0) {
        uploadTableNone();
    }
}

function delFileInTable(obj) {
    var tr = obj.parentNode.parentNode;
    var tbody = tr.parentNode;
    var fileName = tr.id.substring(7, tr.id.length);
    if (tr.getAttribute("hasUpload") == 1) {
        delFileAtServer(fileName);
    } else {
        var file = fileList.files.filter(function (e) {
            return e.name == fileName;
        })[0];

        var index = fileList.files.indexOf(file)
        fileList.files.splice(index, 1);
        fileList.originalFiles.splice(index, 1);
        fileList.paramName.splice(index, 1);
    }
    uploadFileNameList.splice(uploadFileNameList.indexOf(fileName), 1);
    tr.remove();

    if (tbody.childNodes.length == 0) {
        uploadTableNone();
    }
}

function uploadTableNone() {
    $('#upload_place').removeClass("file-upload-on");
    $('#upload_place').addClass("file-upload");
    $('#upload_place').html(file_upload_remind);
    $('#upload_place').on("click", function () {
        $('#upload_place').click(function () {
            $('#fileList').click();
        })
    });
    $('#progress_bar_all').css('width', "0%");
    $('#progress_bar_all').html('0%');
    $('#progress_bar_all').attr("aria-valuenow", 0);
    $('#upload_add').show();
    $('#upload_submit').hide();
    $('#upload_del_all').hide();
    $('#upload_del_close').hide();
    $('#upload_stop').hide();
}

function delFileListAtServer(fileNameList) {
    $.ajax({
        async: true,
        url: "/guteam/algorithm/my/delFileList",
        type: "POST",
        data: {"json": JSON.stringify({"path": algorithmInfo.algorithmPath, "fileNameList": fileNameList})},
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在删除文件，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            })
        },
        success: function (back) {
            if (back["sign"] == "true") {
                swal.close();
            } else {
                swal({
                    title: "错误!",
                    text: back["sign"],
                    type: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: '确定',
                }).catch(swal.noop);
            }

        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    })
}

function delFileAtServer(fileName) {
    $.ajax({
        async: true,
        url: "/guteam/algorithm/my/delFile",
        type: "POST",
        data: {"json": JSON.stringify({"path": algorithmInfo.algorithmPath, "fileName": fileName})},
        dataType: "json",
        beforeSend: function () {
            swal({
                html: "<i  class='fa fa-spin fa-spinner'></i>正在删除文件，请稍等...",
                allowOutsideClick: false,
                allowEscapeKey: false,
                showConfirmButton: false,
            })
        },
        success: function (back) {
            if (back["sign"] == "true") {
                swal.close();
            } else {
                swal({
                    title: "错误!",
                    text: back["sign"],
                    type: 'error',
                    confirmButtonColor: '#3085d6',
                    confirmButtonText: '确定',
                }).catch(swal.noop);
            }

        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    })
}

function uploadFileShow(file) {
    var name = file.name;
    var name_len = 0;
    var name_temp = name.slice();
    for (var j = 0; j < name.length; j++) {
        var a = name.charAt(j);
        if (a.match(/[^\x00-\xff]/ig) != null) {
            name_len += 2;
        } else {
            name_len += 1;
        }
        if (name_len > 40) {
            name = name.substr(0, j - 3) + "...";
            break;
        }
    }
    if (name_len > 40) {
        name = "<a data-toggle='tooltip' data-placement='top' title='" + name_temp + "' >" + name + "</a>"
    }
    // name_temp = name_temp.replace(".","_");
    var html =
        "<tr id='upload_" + name_temp + "' hasUpload='0'>" +
        "<td style='width: 5%'><a name='del_file' id='del_file_" + name_temp + "' href='javascript:void(0);' onclick='delFileInTable(this)'><i class='fa fa-trash-o'></i></a></td>" +
        "<td style='width: 40%'>" + name + "</td>" +
        "<td style='width: 40%'>" +
        "   <div class='progress' style='height:8px;'>" +
        "       <div class='progress-bar progress-bar-success' role='progressbar' aria-valuenow='40' aria-valuemin='0' aria-valuemax='100' " +
        "           style='width: 0; height:8px;' id='progress_bar_" + name_temp + "'>" +
        "       </div>" +
        "   </div>" +
        "</td>" +
        "<td style='width: 10%'>" + fileSizeFormat(file.size) + "</td>" +
        "<td id='" + name_temp + "_state' style='width: 5%'><i class='fa fa-times' style='color: red'></i></td>" +
        "</tr>";
    return html;
}

function uploadFileFromServerShow(fileList) {
    var html = "";
    for (var i = 0; i < fileList.length; i++) {
        now_size += fileList[i].fileLongSize;
        var name = fileList[i].fileName;
        uploadFileNameList.push(name);
        var name_len = 0;
        var name_temp = name.slice();
        for (var j = 0; j < name.length; j++) {
            var a = name.charAt(j);
            if (a.match(/[^\x00-\xff]/ig) != null) {
                name_len += 2;
            } else {
                name_len += 1;
            }
            if (name_len > 40) {
                name = name.substr(0, j - 3) + "...";
                break;
            }
        }
        if (name_len > 40) {
            name = "<a data-toggle='tooltip' data-placement='top' title='" + name_temp + "' >" + name + "</a>"
        }

        html +=
            "<tr id='upload_" + name_temp + "' hasUpload='1'>" +
            "<td style='width: 5%'><a name='del_file' id='del_file_" + name_temp + "' href='javascript:void(0);' onclick='delFileInTable(this)'><i class='fa fa-trash-o'></i></a></td>" +
            "<td style='width: 40%'>" + name + "</td>" +
            "<td style='width: 40%'>" +
            "   <div class='progress' style='height:8px;'>" +
            "       <div class='progress-bar progress-bar-success' role='progressbar' aria-valuenow='100' aria-valuemin='0' aria-valuemax='100' " +
            "           style='width: 100%; height:8px;' id='progress_bar_" + name_temp + "'>" +
            "       </div>" +
            "   </div>" +
            "</td>" +
            "<td style='width: 10%'>" + fileList[i].fileSize + "</td>" +
            "<td id='" + name_temp + "_state' style='width: 5%'><i class='fa fa-check' style='color: green'></i></td>" +
            "</tr>";
    }

    return html;
}

function fileSizeFormat(size) {
    var fileSizeString = "";
    if (size < 1024) {
        fileSizeString = size.toFixed(2) + " B";
    } else if (size < 1048576) {
        fileSizeString = (size / 1024).toFixed(2) + " KB";
    } else if (size < 1073741824) {
        fileSizeString = (size / 1048576).toFixed(2) + " MB";
    } else {
        fileSizeString = (size / 1073741824).toFixed(2) + " GB";
    }
    return fileSizeString;
}


//steps 2
function FunctionInput() {
    var html = "<table class='table upload-input-output-table'>" +
        "<thead>" +
        "<tr>" +
        "<td></td><td>关键词</td><td>名称</td><td>类型</td><td>类型内容</td><td>描述</td><td>是否必须</td><td>移动</td>" +
        "</tr>" +
        "</thead>" +
        "<tbody>";
    if (methodFileList.length > 0) {
        var inputList = methodFileList[fileIndex]["methodList"][functionIndex]["inputList"];
        var len = inputList.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                count += 1;
                var required, key;
                if (inputList[i].indexOf("=") != -1) {
                    required = "<input type='checkbox' id='input_required_" + count + "' name='functionInput'/>";
                    key = inputList[i].split("=")[0];
                } else {
                    required = "<input type='checkbox' checked='checked' id='input_required_" + count + "' name='functionInput'/>";
                    key = inputList[i];
                }

                html +=
                    "<tr id='input_" + count + "'>" +
                    "<td><a name='del_file' href='javascript:void(0);' onclick='delInputAndOutputInTable(this)'><i class='fa fa-trash-o'></i></a></td>" +
                    "<td><input type='text' class='form-control' value='" + key + "' id='input_key_" + count + "' name='functionInput'></td>" +
                    "<td><input type='text' class='form-control' value='' id='input_name_" + count + "' name='functionInput'></td>" +
                    "<td>" + inputTypeListModel(count) + "</td>" +
                    "<td><input type='text' class='form-control' disabled id='input_typeJson_" + count + "' name='functionInput' onfocus='inputJsonInTextArea(this)' ></td>" +
                    "<td><input type='text' class='form-control' id='input_describe_" + count + "' name='functionInput' onfocus='inputTextInTextArea(this)' ></td>" +
                    "<td><label class='control control-checkbox control-inline'>" + required + "<span class='control-indicator'></span></label></td>" +
                    "<td>" +
                    "<button type='button' class='btn btn-primary float-button-light' onclick='elementLevelUp(this)'><i class='fa fa-level-up'></i></a></button>" +
                    "<button type='button' class='btn btn-primary float-button-light' onclick='elementLevelDown(this)'><i class='fa fa-level-down'></i></a></button>" +
                    "</td>" +
                    "</tr>";
            }
        }

    }
    html +=
        "<tr>" +
        "<td colspan='7'>" +
        "<button type='button' class='btn btn-block btn-primary float-button-light' id='addInput' onclick='addInput(this)'><i class='fa fa-plus'></i> 添加新的输入</button>" +
        "</td>" +
        "</tr>" +
        "</tbody>" +
        "</table>";
    document.getElementById("function_input_place").innerHTML = html;
}

function addInput(obj) {
    count += 1;
    var html =
        "<tr id='input_" + count + "'>" +
        "<td><a name='del_file' href='javascript:void(0);' onclick='delInputAndOutputInTable(this)'><i class='fa fa-trash-o'></i></a></td>" +
        "<td><input type='text' class='form-control'  id='input_key_" + count + "' name='functionInput'></td>" +
        "<td><input type='text' class='form-control' value='' id='input_key_" + count + "' name='functionInput'></td>" +
        "<td>" + inputTypeListModel(count) + "</td>" +
        "<td><input type='text' class='form-control' disabled id='input_typeJson_" + count + "'  name='functionInput' onfocus='inputJsonInTextArea(this)' ></td>" +
        "<td><input type='text' class='form-control' id='input_describe_" + count + "'  name='functionInput' onfocus='inputTextInTextArea(this)' ></td>" +
        "<td><label class='control control-checkbox control-inline'><input type='checkbox' id='input_required_" + count + "' name='functionInput'/><span class='control-indicator'></span></label></td>" +
        "</tr>";

    $('#addInput').parent().parent().before(html);

    document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = "500px";
    document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = document.getElementById("algorithm_upload-p-2").scrollHeight + 50 + "px";
}

function FunctionOutput() {
    var html =
        "<table class='table upload-input-output-table' >" +
        "<thead>" +
        "<tr>" +
        "<td></td><td>关键词</td><td>名称</td><td>类型</td><td>描述</td><td>移动</td>" +
        "</tr>" +
        "</thead>" +
        "<tbody>";
    if (methodFileList.length > 0) {
        var outputList = methodFileList[fileIndex]["methodList"][functionIndex]["outputList"];
        var len = outputList.length;
        if (len > 0) {
            for (var i = 0; i < len; i++) {
                count += 1;
                html +=
                    "<tr id='output_" + count + "'>" +
                    "<td ><a name='del_file' href='javascript:void(0);' onclick='delInputAndOutputInTable(this)'><i class='fa fa-trash-o'></i></a></td>" +
                    "<td ><input type='text' class='form-control' id='output_key_" + count + "' name='functionOutput' value='" + outputList[i] + "'></td>" +
                    "<td ><input type='text' class='form-control' id='output_name_" + count + "' name='functionOutput'></td>" +
                    "<td>" + outputTypeListModel(count) + "</td>" +
                    "<td><input type='text' class='form-control' name='functionOutput' id='output_describe_" + count + "' onfocus='inputTextInTextArea(this)' ></td>" +
                    "<td>" +
                    "<button type='button' class='btn btn-primary float-button-light' onclick='elementLevelUp(this)'><i class='fa fa-level-up'></i></a></button>" +
                    "<button type='button' class='btn btn-primary float-button-light' onclick='elementLevelDown(this)'><i class='fa fa-level-down'></i></a></button>" +
                    "</td>" +
                    "</tr>";
            }
        }
    }
    html +=
        "<tr>" +
        "<td colspan='7'>" +
        "<button type='button' class='btn btn-block btn-primary float-button-light' id='addOutput' onclick='addOutput(this)'><i class='fa fa-plus'></i> 添加新的输出</button>" +
        "</td>" +
        "</tr>" +
        "</tbody>" +
        "</table>";
    document.getElementById("function_output_place").innerHTML = html;

}

function addOutput(obj) {
    count += 1;
    var html =
        "<tr id='output_" + count + "'>" +
        "<td ><a name='del_file' href='javascript:void(0);' onclick='delInputAndOutputInTable(this)'><i class='fa fa-trash-o'></i></a></td>" +
        "<td ><input type='text' class='form-control' id='output_key_" + count + "' name='functionOutput'></td>" +
        "<td ><input type='text' class='form-control' id='output_name_" + count + "' name='functionOutput'></td>" +
        "<td>" + outputTypeListModel(count) + "</td>" +
        "<td><input type='text' class='form-control' name='functionOutput' id='output_describe_" + count + "' onfocus='inputTextInTextArea(this)' ></td>" +
        "<td>" +
        "<button type='button' class='btn btn-primary float-button-light' onclick='elementLevelUp(this)'><i class='fa fa-level-up'></i></a></button>" +
        "<button type='button' class='btn btn-primary float-button-light' onclick='elementLevelDown(this)'><i class='fa fa-level-down'></i></a></button>" +
        "</td>" +
        "</tr>";

    $('#addOutput').parent().parent().before(html);
    document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = "500px";
    document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = document.getElementById("algorithm_upload-p-2").scrollHeight + 50 + "px";
}

function runFunction() {
    var html_run =
        "<div class='form-group'>" +
        "<select onchange='runFunctionSelectChange(this)' class='form-control select-control' id='run_function'>";
    if (methodFileList.length > 0) {
        var methodList = methodFileList[fileIndex]["methodList"];
        var len = methodList.length;
        for (var i = 0; i < len; i++) {
            html_run += "<option value='" + i + "'>" + methodList[i]["methodName"] + "</option>";
        }
    }

    html_run += "</select></div>";
    if (html_run == null) {
        html_run = "<div class='btn-group btn-dropdown'>" +
            "   <button type='button' id='algorithm_file_dropdown' jsonKey='' class='btn btn-default btn-outline' data-toggle='dropdown' aria-expanded='false'>" +
            "无方法" +
            "       <span class='caret'></span>" +
            "       <span class='sr-only'></span>" +
            "   </button>" +
            "   <ul class='dropdown-menu' id='algorithm_file_dropdown_ul' aria-labelledby='default-dropdown-outline' role='menu'>";
    }

    html_run += "</ul></div>";
    document.getElementById("run_function_place").innerHTML = html_run;
    FunctionInput();
    FunctionOutput();
}

function mainAlgorithmFile() {
    var len = methodFileList.length;
    var html_run =
        "<div class='form-group'>" +
        "<select onchange='mainAlgorithmFileSelectChange(this)' class='form-control select-control' id='run_file'>";
    for (var i = 0; i < len; i++) {
        html_run += "<option value='" + i + "'>" + methodFileList[i]["fileName"] + "</option>";
    }
    html_run += "</select></div>";

    document.getElementById("main_algorithm_file_place").innerHTML = html_run;
    runFunction();
}

function mainAlgorithmFileSelectChange(obj) {
    fileIndex = obj.value;
    runFunction();
}

function uploadRunAndInputAndOutput() {
    $.ajax({
        async: true,
        url: "/guteam/algorithm/my/getAlgorithmMethodList",
        type: "POST",
        data: {"path": algorithmInfo.algorithmPath},
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
            methodFileList = back["methodFileList"];
            inputTypeList = back["inputTypeList"];
            outputTypeList = back["outputTypeList"];
            outputIdWithDisplayTypeList = back["outputIdWithDisplayTypeList"];
            if ($("#main_algorithm_file_place").length == 0) {
                var html =
                    "<label>主算法执行文件</label>" +
                    "<div class='form-group model' id='main_algorithm_file_place'>" +
                    "</div>" +
                    "<label>执行方法</label>" +
                    "<div class='form-group model' id='run_function_place'>" +
                    "</div>" +
                    "<label>输入</label>" +
                    "<div class='form-group model' id='function_input_place'>" +
                    "</div>" +
                    "<label>输出</label>" +
                    "<div class='form-group model' id='function_output_place'>" +
                    "</div>";

                document.getElementById("algorithm_upload-p-2").innerHTML = html;
            }
            if ($("#run_file").length == 0) {
                mainAlgorithmFile();
            }
            if (inputListServer != null) {
                renderAlgorithmMethodInAndOutInPage();
            } else {
                var methodFile_temp = methodFileList.filter(function (e) {
                    return e.fileName == algorithmInfo.algorithmFile;
                });
                if (methodFile_temp.length > 0) {
                    var methodFile = methodFile_temp[0];
                    var methedList = methodFile.methodList;
                    var method_temp = methedList.filter(function (e) {
                        return e.methodName == algorithmInfo.algorithmRun;
                    });

                    if (method_temp.length == 0) {
                        mainAlgorithmFile();
                    }
                } else {
                    mainAlgorithmFile();
                }
            }

            document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = "500px";
            document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = document.getElementById("algorithm_upload-p-2").scrollHeight + 50 + "px";
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    })


}

function runFunctionSelectChange(obj) {
    functionIndex = obj.value;
    FunctionInput();
    FunctionOutput();
    document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = "500px";
    document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = document.getElementById("algorithm_upload-p-2").scrollHeight + 50 + "px";

}

function inputSelectChange(obj) {
    var value = obj.value;
    var hasJson = inputTypeList.filter(function (e) {
        return e.id == value;
    })[0];
    var key = "input_typeJson_" + obj.getAttribute("goal");
    if (hasJson["hasJson"] == true) {
        $('#' + key).attr("disabled", false);
    } else {
        $('#' + key).attr("disabled", true);
    }
}

function inputTypeListModel(key) {
    var html = "<div class='form-group'>" +
        "<select onchange='inputSelectChange(this)' goal='" + key + "' value='' id='input_type_" + key + "' name='functionInput' class='form-control select-control'>";
    for (var i = 0, len = inputTypeList.length; i < len; i++) {
        html += "<option value='" + inputTypeList[i]["id"] + "'>" + inputTypeList[i]["inputName"] + "</option>";
    }
    html += "</select></div>";
    return html;
}

function outputTypeListModel(key) {
    var outputType_temp = outputTypeList.filter(function (e) {
        return e.navigationParentId == algorithmInfo.navigationParentId;
    });
    var html = "<div class='form-group'>" +
        "<select class='form-control select-control' id='output_type_" + key + "' name='functionOutput'>";
    for (var i = 0, len = outputType_temp.length; i < len; i++) {
        html += "<option value='" + outputType_temp[i]["id"] + "'>" + outputType_temp[i]["outputName"] + "</option>";
    }
    html += "</select></div>";
    return html;
}


function delInputAndOutputInTable(obj) {
    var tr = obj.parentNode.parentNode;
    var tbody = tr.parentNode.childNodes;
    tr.remove();
}

//steps 3
function displayGroupModal() {
    var html = "" +
        "<div class='modal fade' id='displayGroupModal' >" +
        "   <div class='modal-dialog modal-large'  style='width:80%'>" +
        "       <div class='modal-content modal-content-modal'>" +
        "           <div class='modal-header'>" +
        "               <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
        "                   <span aria-hidden='true'>&times;</span>" +
        "               </button>" +
        "               <h4 class='modal-title'>选择同类型输出组合构建可视化组件</h4>" +
        "           </div>" +
        "           <div class='modal-body' >" +
        "               <div class='display-group' style='height:" + parseInt(window.screen.height * 0.5) + "px;' id='display_group_div'></div>" +
        "           </div>" +
        "           <div class='modal-footer'>" +
        "               <button type='button' class='btn btn-primary float-button-light' id='displayGroupModal_confirm'  onclick='displayGroupInInput(this)'>确定</button>" +
        "               <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>" +
        "           </div>" +
        "        </div>" +
        "    </div>" +
        "</div>";
    return html;
}

function displayGroupChange(obj) {
    var displayGroup = document.getElementsByName(obj.name);
    var check_type = obj.getAttribute("outputType");
    var check_num = 0;
    var len = displayGroup.length;
    for (var i = 0; i < len; i++) {
        if (displayGroup[i].checked) {
            check_num += 1;
        }
    }
    if (check_num == 1) {
        for (var j = 0; j < len; j++) {
            if (displayGroup[j].getAttribute("outputType") != check_type) {
                displayGroup[j].parentNode.style = "color:#e5e5e5";
                displayGroup[j].disabled = true;

            }
        }
    } else if (check_num == 0) {
        for (var k = 0; k < len; k++) {
            displayGroup[k].parentNode.style = "color:#5e5e5e";
            displayGroup[k].disabled = false;
        }
    }
}

function displayGroupShow(obj) {
    obj.blur();
    uploadDisplayGroup(obj.value);
    $("#displayGroupModal_confirm").attr("goal", obj.id);
    $("#displayGroupModal").modal(modalOption());
    $('#display_group_div').slimScroll({
        alwaysVisible: true,
        height: parseInt(window.screen.height * 0.5),
    });
}

function inputTextInTextArea(obj) {
    obj.blur();
    $("#inputTextInModal_textarea").val(obj.value);
    $("#inputTextInModal_confirm").attr("goal", obj.id);
    $("#inputTextInModal").modal(modalOption());
}

function inputJsonInTextArea(obj) {
    obj.blur();
    $("#inputJsonInModal_textarea").val(obj.value);
    $("#inputJsonInModal_confirm").attr("goal", obj.id);
    $("#inputJsonInModal").modal(modalOption());
}

function displayGroupInInput(obj) {
    var displayGroup = document.getElementsByName("displayGroup");
    var goal = obj.getAttribute("goal");
    var goal_split = goal.split("_");
    var checkList = "";
    for (var i = 0, len = displayGroup.length; i < len; i++) {
        if (displayGroup[i].checked) {
            checkList += displayGroup[i].value + ",";
        }
    }

    $('#' + goal).val(checkList.substring(0, checkList.length - 1));
    document.getElementById("display_type_" + goal_split[goal_split.length - 1]).innerHTML = displayTypeCreate(displayGroup[0].getAttribute("outputType"));
    $("#displayGroupModal").modal('hide');
}

function outputTypeDisplayTypeList(key) {
    var html = "<div class='form-group'><select class='form-control select-control' name='functionDisplay' id='display_type_" + key + "'></select></div>";
    return html;

}

function outputTypeDisplayTypeListWithOption(key, outputTypeId) {
    var outputIdWithDisplayType = outputIdWithDisplayTypeList[outputTypeId];
    var html = "<div class='form-group'><select class='form-control select-control' name='functionDisplay' id='display_type_" + key + "'>";
    for (var i = 0, len = outputIdWithDisplayType.length; i < len; i++) {
        html += "<option value='" + outputIdWithDisplayType[i]["id"] + "'>" + outputIdWithDisplayType[i]["displayName"] + "</option>";
    }
    html += "</select></div>";
    return html;

}

function displayTypeCreate(outputTypeId) {
    var outputIdWithDisplayType = outputIdWithDisplayTypeList[outputTypeId];
    var html = "";
    for (var i = 0, len = outputIdWithDisplayType.length; i < len; i++) {
        html += "<option value='" + outputIdWithDisplayType[i]["id"] + "'>" + outputIdWithDisplayType[i]["displayName"] + "</option>";
    }
    return html;
}

function outputKeyGroupCheckboxModel(key) {
    var html = "<div><input type='text' class='form-control' name='functionDisplay' id='display_key_" + key + "' onfocus='displayGroupShow(this)' ></div>";
    return html;
}

function outputKeySelectModel(key) {
    var html = "<div class='form-group'>" +
        "<select onchange='outputChangeToDisplayType(this)' name='functionDisplay' class='form-control select-control' id='display_key_" + key + "'>";
    for (var i = 0, len = outputList.length; i < len; i++) {
        html += "<option value='" + outputList[i]["key"] + "'>" + outputList[i]["key"] + "</option>";
    }
    html += "</select></div>";


    return html;
}

function outputChangeToDisplayType(obj) {
    var id_split = obj.id.split("_");
    var key = id_split[id_split.length - 1];
    var type = outputList.filter(function (e) {
        return e.key == obj.value;
    })[0].type;
    document.getElementById("display_type_" + key).innerHTML = displayTypeCreate(type);
}

function uploadDisplayGroup(value) {
    var value_split = value.split(",");
    var value_len = value_split.length;
    for (var j = 0; j < value_len; j++) {

    }
    var check_html = "";
    var check_sign;
    for (var i = 0, len = outputList.length; i < len; i++) {
        check_sign = ""
        if (value_split.indexOf(outputList[i]["key"]) > -1) {
            check_sign = "checked";
        }
        check_html +=
            "<label class='control control-checkbox display-checkbox'>" + outputList[i]["key"] +
            "<input value='" + outputList[i]["key"] + "' name='displayGroup' outputType='" + outputList[i]["type"] + "'  onchange='displayGroupChange(this)' type='checkbox' " + check_sign + " />" +
            "<span class='control-indicator'></span>" +
            "</label>";
    }
    document.getElementById("display_group_div").innerHTML = check_html;
}

function uploadDisplay() {
    var html =
        "<table class='table upload-input-output-table' >" +
        "<thead>" +
        "<tr>" +
        "<td></td><td>可视化关键词</td><td>可视化名称</td><td>可视化类型</td><td>描述</td><td>移动</td>" +
        "</tr>" +
        "</thead>" +
        "<tbody>" +
        "<tr>" +
        "<td colspan='3'>" +
        "<button type='button' class='btn btn-block btn-primary float-button-light' id='addSingleDisplay' onclick='addSingleDisplay()'><i class='fa fa-plus'></i> 添加单一可视化组件</button>" +
        "</td>" +
        "<td colspan='3'>" +
        "<button type='button' class='btn btn-block btn-purple float-button-light' id='addGroupDisplay' onclick='addGroupDisplay()'><i class='fa fa-plus'></i> 添加组合可视化组件</button>" +
        "</td>" +
        "</tr>" +
        "</tbody>" +
        "</table>";
    document.getElementById("algorithm_upload-p-3").innerHTML = html;
    // return html;
}

function addGroupDisplay() {
    count += 1;
    var html =
        "<tr>" +
        "<td ><a name='del_file' href='javascript:void(0);' onclick='delFileInTable(this)'><i class='fa fa-trash-o'></i></a></td>" +
        "<td >" + outputKeyGroupCheckboxModel(count) + "</td>" +
        "<td ><input type='text' id='display_name_" + count + "' name='functionDisplay' class='form-control'></td>" +
        "<td>" + outputTypeDisplayTypeList(count) + "</td>" +
        "<td><input type='text' class='form-control' id='display_describe_" + count + "' name='functionDisplay' onfocus='inputTextInTextArea(this)'></td>" +
        "<td>" +
        "<button type='button' class='btn btn-primary float-button-light' onclick='elementLevelUp(this)'><i class='fa fa-level-up'></i></a></button>" +
        "<button type='button' class='btn btn-primary float-button-light' onclick='elementLevelDown(this)'><i class='fa fa-level-down'></i></a></button>" +
        "</td>" +
        "</tr>";

    $('#addGroupDisplay').parent().parent().before(html);

    document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = "500px";
    document.getElementsByClassName("wizard")[0].getElementsByClassName("content")[0].style.height = document.getElementById("algorithm_upload-p-3").scrollHeight + 50 + "px";
    // if (outputList.length > 0) {
    //     document.getElementById("display_type_" + count).innerHTML = displayTypeCreate(outputList[0]["type"])
    // }

}

function addSingleDisplay() {
    count += 1;
    var html =
        "<tr>" +
        "<td ><a name='del_file' href='javascript:void(0);' onclick='delFileInTable(this)'><i class='fa fa-trash-o'></i></a></td>" +
        "<td >" + outputKeySelectModel(count) + "</td>" +
        "<td ><input type='text'  id='display_name_" + count + "' name='functionDisplay' class='form-control'></td>" +
        "<td>" + outputTypeDisplayTypeList(count) + "</td>" +
        "<td><input type='text' class='form-control' id='display_describe_" + count + "' name='functionDisplay' onfocus='inputTextInTextArea(this)'></td>" +
        "<td>" +
        "<button type='button' class='btn btn-primary float-button-light' onclick='elementLevelUp(this)'><i class='fa fa-level-up'></i></a></button>" +
        "<button type='button' class='btn btn-primary float-button-light' onclick='elementLevelDown(this)'><i class='fa fa-level-down'></i></a></button>" +
        "</td>" +
        "</tr>";

    $('#addSingleDisplay').parent().parent().before(html);

    if (outputList.length > 0) {
        document.getElementById("display_type_" + count).innerHTML = displayTypeCreate(outputList[0]["type"])
    }

}

//common
function inputTextInModalHtml() {
    var html = "" +
        "<div class='modal fade' id='inputTextInModal' >" +
        "   <div class='modal-dialog modal-large'  style='width:80%'>" +
        "       <div class='modal-content modal-content-modal'>" +
        "           <div class='modal-header'>" +
        "               <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
        "                   <span aria-hidden='true'>&times;</span>" +
        "               </button>" +
        "               <h4 class='modal-title'>内容</h4>" +
        "           </div>" +
        "           <div class='modal-body' >" +
        "               <div class='form-group'><textarea id='inputTextInModal_textarea' class='form-control' rows='5'></textarea></div>" +
        "           </div>" +
        "           <div class='modal-footer'>" +
        "               <button type='button' class='btn btn-primary float-button-light' id='inputTextInModal_confirm' onclick='textAreaTextInInput(this)'>确定</button>" +
        "               <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>" +
        "           </div>" +
        "        </div>" +
        "    </div>" +
        "</div>";
    return html;
}

function inputJsonInModalHtml() {
    var html = "" +
        "<div class='modal fade' id='inputJsonInModal' >" +
        "   <div class='modal-dialog modal-large'  style='width:80%'>" +
        "       <div class='modal-content modal-content-modal'>" +
        "           <div class='modal-header'>" +
        "               <button type='button' class='close close-modal' data-dismiss='modal' aria-label='Close'>" +
        "                   <span aria-hidden='true'>&times;</span>" +
        "               </button>" +
        "               <h4 class='modal-title'>内容</h4>" +
        "           </div>" +
        "           <div class='modal-body' >" +
        "               <div class='form-group'><textarea id='inputJsonInModal_textarea' class='form-control' rows='5'></textarea></div>" +
        "           </div>" +
        "           <div class='modal-footer'>" +
        "               <button type='button' class='btn btn-success float-button-light'  id='json_format'>格式化</button>" +
        "               <button type='button' class='btn btn-warning float-button-light'  id='json_format_undo'>去除格式化</button>" +
        "               <button type='button' class='btn btn-primary float-button-light' id='inputJsonInModal_confirm' onclick='textAreaJsonInInput(this)'>确定</button>" +
        "               <button type='button' class='btn btn-default float-button-light' data-dismiss='modal'>关闭</button>" +
        "           </div>" +
        "        </div>" +
        "    </div>" +
        "</div>";
    return html;
}

function textAreaTextInInput(obj) {
    $('#' + obj.getAttribute("goal")).val($("#inputTextInModal_textarea").val());
    $("#inputTextInModal").modal('hide');
}

function textAreaJsonInInput(obj) {
    if (isJSON($('#inputJsonInModal_textarea').val())) {
        $('#' + obj.getAttribute("goal")).val(JSON.stringify(JSON.parse($('#inputJsonInModal_textarea').val()), null, 0));
        $("#inputJsonInModal").modal('hide');
    } else {
        swal({
            title: "错误",
            text: "该字符串不是json格式，请检查输入的格式！",
            type: 'error',
            confirmButtonColor: '#F9534F',
            confirmButtonText: '确定',
        })
    }
}

function modalOption() {
    return {
        keyboard: false,
    }
}

function ajaxError() {
    swal({
        title: "错误!",
        text: "无法连接到服务器",
        type: 'error',
        confirmButtonColor: '#3085d6',
        confirmButtonText: '确定',
    }).catch(swal.noop);
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
            if (isJSON(value) == false) {
                swalHelper("错误", name + "不为JSON格式", "error", id);
                return false;
            }
            return true;
        default:
            swalHelper("错误", name + "类型未知", "error", id);
            return false;

    }
}

function isJSON(str) {
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

function elementLevelUp(obj) {
    var tr = $(obj.parentNode.parentNode);

    var pre = tr.prev();
    if (pre.length == 0) {
        swal({
            title: "错误!",
            text: "已经是第一个",
            type: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '确定',
        }).catch(swal.noop);
    }else{
        pre.before(tr);
    }
}

function elementLevelDown(obj) {
    var tr = $(obj.parentNode.parentNode);
    var next = tr.next();
    if (next.length == 0) {
        swal({
            title: "错误!",
            text: "已经是最后一个",
            type: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: '确定',
        }).catch(swal.noop);
    }else{
        tr.before(next)
    }
}