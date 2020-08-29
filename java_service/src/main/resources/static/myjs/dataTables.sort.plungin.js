jQuery.extend(jQuery.fn.dataTableExt.oSort, {
    // "algorithm-name-asc": function (a, b) {                //正序排序引用方法
    //     return ((a < b) ? -1 : ((a > b) ? 1 : 0));
    // },
    //
    // "algorithm-name-desc": function (a, b) {                //倒序排序引用方法
    //     return ((a < b) ? 1 : ((a > b) ? -1 : 0));
    // },

    "algorithm-comprehensive-desc": function (x, y) {                //正序排序引用方法
        return x.algorithmName.localeCompare(y.algorithmName, 'zh-CN');
    },

    "algorithm-comprehensive-asc": function (x, y) {                //倒序排序引用方法
        return y.algorithmName.localeCompare(x.algorithmName, 'zh-CN');
    },

    "update-time-asc": function (x, y) {                //正序排序引用方法
        return x.uploadTime.localeCompare(y.uploadTime);
    },

    "update-time-desc": function (x, y) {                //倒序排序引用方法
        return y.uploadTime.localeCompare(x.uploadTime);
    },

    "visit-count-desc": function (x, y) {                //正序排序引用方法
        return x.visitCount - y.visitCount;
    },

    "visit-count-asc": function (x, y) {                //倒序排序引用方法
        return y.visitCount - x.visitCount;
    },

    "use-count-desc": function (x, y) {                //正序排序引用方法
        return x.useCount - y.useCount;
    },

    "use-count-asc": function (x, y) {                //倒序排序引用方法
        return y.useCount - x.useCount;
    },

    "cart-count-desc": function (x, y) {                //正序排序引用方法
        return x.cartCount - y.cartCount;
    },

    "cart-count-asc": function (x, y) {                //倒序排序引用方法
        return y.cartCount - x.cartCount;
    },
});
