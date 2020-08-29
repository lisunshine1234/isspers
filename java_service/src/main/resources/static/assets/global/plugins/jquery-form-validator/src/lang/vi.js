/**
 * jQuery Form Validator
 * ------------------------------------------
 *
 * Vietnamese language package
 *
 * @website http://formvalidator.net/
 * @license MIT
 */
(function ($, window) {

    'use strict';

    $.formUtils.registerLoadedModule('lang/vi');

    $(window).bind('validatorsLoaded', function () {

        $.formUtils.LANG = {
            errorTitle: 'Có lỗi trong qua trình gửi dữ liệu!',
            requiredFields: 'Bạn chưa nhập đủ các thông tin bắt buộc',
            badTime: 'Thời gian chưa chính xác',
            badEmail: 'Địa chỉ email chưa chính xác',
            badTelephone: 'Số điện thoại chưa chính xác',
            badSecurityAnswer: 'Câu hỏi bảo mật chưa chính xác',
            badDate: 'Ngày tháng chưa chính xác',
            lengthBadStart: 'Yêu cầu nhập từ ',
            lengthBadEnd: ' ký tự',
            lengthTooLongStart: 'Dữ liệu quá dài, yêu cầu ít hơn ',
            lengthTooShortStart: 'Dữ liệu quá ngắn, yêu cầu nhiều hơn ',
            notConfirmed: 'Dữ liệu không được xác nhận',
            badDomain: 'Tên miền chưa chính xác',
            badUrl: 'Địa chỉ website chưa chính xác',
            badCustomVal: 'Dữ liệu chưa chính xác',
            andSpaces: ' và các khoảng cách ',
            badInt: 'Yêu cầu chỉ nhập số',
            badSecurityNumber: 'Mã bảo mật chưa chính xác',
            badUKVatAnswer: 'UK VAT chưa chính xác',
            badStrength: 'Mật khẩu chưa đủ độ phức tạp',
            badNumberOfSelectedOptionsStart: 'Bạn cần tích chọn ít nhất ',
            badNumberOfSelectedOptionsEnd: ' lựa chọn',
            badAlphaNumeric: 'Yêu cầu chỉ nhập chữ hoặc số ',
            badAlphaNumericExtra: ' và ',
            wrongFileSize: 'File của bạn quá lớn (chỉ chấp nhận file không quá %s)',
            wrongFileType: 'Chỉ cho phép các định dạng file sau: %s',
            groupCheckedRangeStart: 'Vui lòng tích chọn từ ',
            groupCheckedTooFewStart: 'Vui lòng tích chọn ít nhất ',
            groupCheckedTooManyStart: 'Vui lòng tích chọn nhiều nhất ',
            groupCheckedEnd: ' lựa chọn',
            badCreditCard: 'Mã thẻ chưa chính xác',
            badCVV: 'Mã bảo mật (CVV) chưa chính xác',
            wrongFileDim: 'Kích thước ảnh chưa chính xác,',
            imageTooTall: 'Chiều cao ảnh không được vượt quá',
            imageTooWide: 'Chiều rộng ảnh không được vượt quá',
            imageTooSmall: 'Kích thước ảnh quá nhỏ',
            min: 'nhỏ nhất',
            max: 'lớn nhất',
            imageRatioNotAccepted: 'Tỷ lệ ảnh chưa chính xác'
        };

    });

})(jQuery, window);
