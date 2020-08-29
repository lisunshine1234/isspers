var token = $("meta[name='_csrf']").attr("content");
var header = $("meta[name='_csrf_header']").attr("content");
$(document).ajaxSend(function (e, xhr, options) {
    xhr.setRequestHeader(header, token);
});

var userList = [];
var verificationInterval;
var userExist, emailExist, phoneExist;
<!-- start -->
$(document).ready(function () {
    if ($("#user_page").length > 0) {
        getUserList();
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


function changeEmail() {
    clearInterval(verificationInterval);
    $("#phone_place").hide();
    $("#mail_place").show();
    $("#verification").attr("readonly", "readonly");
    var verification = $("#verificationInterval");
    verification.attr("class", "");
    verification.html("发送验证码");
    verification.attr("href", "javascript:void(0);");
    verification.attr("onclick", "sendverification(this)");
}

function changePhone() {
    clearInterval(verificationInterval);
    $("#mail_place").hide();
    $("#phone_place").show();
    $("#verification").attr("readonly", "readonly");
    var verification = $("#verificationInterval");
    verification.attr("class", "");
    verification.html("发送验证码");
    verification.attr("href", "javascript:void(0);");
    verification.attr("onclick", "sendverification(this)");
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

function checkFormat(obj) {
    var id = obj.id;
    switch (id) {
        case "username":
            var sign = myValidata($(obj).val(), "chineseAndEnglishKey", 1, 20, "用户名", id);
            if (sign == false) {
                return false;
            }
            checkUserNameExist($(obj));
            var interval_2 = setInterval(function () {
                if (userExist != null) {
                    clearInterval(interval_2);
                }
            }, 10);
            return !userExist;
        case "password":
            return myValidata($(obj).val(), "password", 1, 20, "密码", id);
        case "confirm_password":
            if ($(obj).val() == $("#password").val()) {
                removeValidataInfo(obj);
                return true;
            } else {
                return addValidataInfo(obj, "两次密码不同");
            }
        case "phone":
            var sign = myValidata($(obj).val(), "phone", -1, -1, "手机号", id);
            if (sign == false) {
                return false;
            }
            checkPhoneExist($(obj));
            var interval_2 = setInterval(function () {
                if (phoneExist != null) {
                    clearInterval(interval_2);
                }
            }, 10);
            return !phoneExist;
        case "email":
            var sign = myValidata($(obj).val(), "email", -1, -1, "邮箱", id);
            if (sign == false) {
                return false;
            }
            checkEmailExist($(obj));
            var interval_2 = setInterval(function () {
                if (emailExist != null) {
                    clearInterval(interval_2);
                }
            }, 10);
            return !emailExist;
    }


}

function checkUserNameExist(obj) {
    userExist = null;
    $.ajax({
        async: true,
        url: "/guteam/admin/user/checkUserName",
        type: "POST",
        data: {"username": $(obj).val()},
        dataType: "json",
        timeout: 3000,
        success: function (back) {
            if (back.sign == false) {
                userExist = false;
                removeValidataInfo(obj);
            } else {
                userExist = true;
                addValidataInfo(obj, "用户名已经存在");
            }
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function checkPhoneExist(obj) {
    phoneExist = null;
    $.ajax({
        async: true,
        url: "/guteam/admin/user/checkPhone",
        type: "POST",
        data: {"phone": $(obj).val()},
        dataType: "json",
        timeout: 3000,
        success: function (back) {
            if (back.sign == false) {
                phoneExist = false;
                removeValidataInfo(obj);
            } else {
                phoneExist = true;
                addValidataInfo(obj, "手机号码已经存在");
            }
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function checkEmailExist(obj) {
    emailExist = null;
    $.ajax({
        async: true,
        url: "/guteam/admin/user/checkEmail",
        type: "POST",
        data: {"email": $(obj).val()},
        dataType: "json",
        timeout: 3000,
        success: function (back) {
            if (back.sign == false) {
                emailExist = false;
                removeValidataInfo(obj);
            } else {
                emailExist = true;
                addValidataInfo(obj, "邮箱已经存在");
            }
        },
        error: function (XMLHttpRequest, statusText) {
            ajaxError();
        }
    });
}

function addUserSubmit() {
    swal({
        html: "<i  class='fa fa-spin fa-spinner'></i>正在检验输入格式，请稍等...",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false
    });
    var username = $("#username");
    var password = $("#password");
    var phone = $("#phone");
    var email = $("#email");
    var role = $("#role");
    var json = {};
    var phoneDisplay = $("#phone_place").css("display") == "block";
    if (phoneDisplay == true) {
        checkFormat(username[0]);
        checkFormat(password[0]);
        checkFormat(phone[0]);
    } else {
        checkFormat(username[0]);
        checkFormat(password[0]);
        checkFormat(email[0]);
    }

    var interval_2 = setInterval(function () {
        if (userExist != null && (phoneExist != null || emailExist != null)) {
            if (phoneDisplay == true) {
                json = {"username": username.val(), "password": password.val(), "phone": phone.val(), "role": role.val()};
            } else {
                json = {"username": username.val(), "password": password.val(), "email": email.val(), "role": role.val()};
            }
            var validataInfo = $("[name='validataInfo']");
            if (validataInfo.length > 0) {
                validataInfo[0].focus();
            } else {
                $.ajax({
                    async: true,
                    url: "/guteam/admin/user/addUser",
                    type: "POST",
                    data: json,
                    dataType: "json",
                    beforeSend: function () {
                        swal({
                            html: "<i  class='fa fa-spin fa-spinner'></i>正在添加用户信息到数据库，请稍等...",
                            allowOutsideClick: false,
                            allowEscapeKey: false,
                            showConfirmButton: false
                        });
                    },
                    success: function (back) {
                        if (back.sign == true) {
                            swal({
                                title: "成功",
                                text: "添加用户成功",
                                type: 'success',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: '确定'
                            });
                        } else {
                            swal({
                                title: "错误",
                                text: "添加用户失败",
                                type: 'error',
                                confirmButtonColor: '#3085d6',
                                confirmButtonText: '确定'
                            });
                        }
                    },
                    error: function (XMLHttpRequest, statusText) {
                        ajaxError();
                    }
                });
            }
            clearInterval(interval_2);
        }
    }, 10);


}


function addValidataInfo(obj, info) {
    if ($(obj).next().attr("name") != "validataInfo") {
        $(obj).after("<div class='font-red' name='validataInfo'>" + info + "</div>");
    }
}

function removeValidataInfo(obj) {
    var obj_temp = $(obj).next();
    if (obj_temp.attr("name") == "validataInfo") {
        obj_temp.remove();
    }
}

function myValidata(value, key, min_len, max_len, name, id) {
    var obj = $("#" + id);
    if (min_len < 0) {
        min_len = 0;
    }
    if (max_len < 0) {
        max_len = -1;
    }
    if (typeof value == "object") {
        if (value.length < min_len) {
            addValidataInfo($("#" + id), name + "至少选择" + min_len + "个", "error");
            return false;
        }
        if (max_len > 0 && value.length > max_len) {
            addValidataInfo($("#" + id), name + "至多选择" + max_len + "个", "error");
            return false;
        }
    } else {
        if (value.toString().length < min_len) {
            addValidataInfo($("#" + id), name + "的最小长度为" + min_len, "error");
            return false;
        }
        if (max_len > 0 && value.toString().length > max_len) {
            addValidataInfo($("#" + id), name + "的最大长度为" + max_len, "error");
            return false;
        }
    }

    var englishKey = new RegExp("[0-9a-zA-Z_]*");
    var password = new RegExp("^[ \n\t\r\f]*");
    var chineseKey = new RegExp("[\u0391-\uFFE5_]*");
    var chineseAndEnglishKey = new RegExp("[0-9a-zA-Z\u0391-\uFFE5_]*");
    var phone = new RegExp(/^1(3|4|5|6|7|8|9)\d{9}$/);
    var email = new RegExp("^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$");
    switch (key) {
        case "phone":
            if (phone.test(value)) {
                removeValidataInfo(obj);
                return true;
            } else {
                addValidataInfo(obj, name + "不符合手机号码格式");
                return false;
            }
        case "email":
            if (email.test(value)) {
                removeValidataInfo(obj);
                return true;
            } else {
                addValidataInfo(obj, name + "不符合邮箱格式");
                return false;
            }
        case "englishKey":
            if (englishKey.test(value)) {
                removeValidataInfo(obj);
                return true;
            } else {
                addValidataInfo(obj, name + "的输入只能为大小写字母以及下划线");
                return false;
            }
        case "chineseKey":
            if (chineseKey.test(value)) {
                removeValidataInfo(obj);
                return true;
            } else {
                addValidataInfo(obj, name + "的输入只能为中文以及下划线");
                return false;
            }
        case "chineseAndEnglishKey" || "englishAndChineseKey":
            if (chineseAndEnglishKey.test(value)) {
                removeValidataInfo(obj);
                return true;
            } else {
                addValidataInfo(obj, name + "的输入只能为中文、大小写字母以及下划线");
                return false;
            }
        case "password":
            if (password.test(value)) {
                removeValidataInfo(obj);
                return true;
            } else {
                addValidataInfo(obj, name + "的输入只能为大小写字母、数字和特殊字符");
                return false;
            }
        case "none":
            removeValidataInfo(obj);
            return true;
        case "json":
            if (isJSON(value) == true) {
                removeValidataInfo(obj);
                return true;
            } else {
                addValidataInfo(obj, name + "不是json格式");
                return false;
            }
        default:
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