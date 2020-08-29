function displayTwoSymbolOptionHelper(data) {
    var color1 = ["#FF0000", "#0000FF", "#00FF00", "#FFFF00", "#FF00FF", "#00FFFF"];
    var len = color1.length;
    var type = [];
    var series_list = []
    var count = 0;

    var train = data["train"];
    var test = data["test"];

    if (train == null) {
        train = data;
    }


    //图形 'circle', 'rect', 'roundRect', 'triangle', 'diamond', 'pin', 'arrow'
    for (var key in train) {
        if (!type.includes("训练集:" + key)) {
            type.push("训练集:" + key);
        }
        // console.log( color1[count % len] * Math.pow(0.5, parseInt(count / len)))
        series_list.push({
            "name": "训练集:" + key, "symbol": "circle", "symbolSize": 8, "type": "scatter", "color": color1[count % len], "data": train[key],
            "markArea": {
                "silent": true, "itemStyle": {"normal": {"color": "transparent", "borderWidth": 1, "borderType": 'solid'}},
                "data": [[{"name": '训练集类别' + key, "xAxis": 'min', "yAxis": 'min'}, {"xAxis": 'max', "yAxis": 'max'}]]
            }
        });
        count++;
    }

    count = 0;
    for (var key in test) {
        if (!type.includes("测试集:" + key)) {
            type.push("测试集:" + key);
        }
        var markArea = []
        markArea.push()
        series_list.push({
            "name": "测试集:" + key, "symbol": "triangle", "symbolSize": 8, "type": "scatter", "color": color1[count % len], "data": test[key],
            "markArea": {
                "silent": true, "itemStyle": {"normal": {"color": "transparent", "borderWidth": 1, "borderType": 'dashed'}},
                "data": [[{"name": '测试集类别' + key, "xAxis": 'min', "yAxis": 'min'}, {"xAxis": 'max', "yAxis": 'max'}]]
            }
        });
        count++;
    }


    var option = {
        title: {
            text: '数据集类别分布',
        },
        grid: {
            left: '3%',
            right: '7%',
            bottom: '3%',
            containLabel: true
        },
        tooltip: {
            showDelay: 0,
            formatter: function (params) {
                if (params.value.length > 1) {
                    return params.seriesName
                } else {
                    return params.seriesName
                }
            },

        },
        toolbox: {
            feature: {
                dataZoom: {},
                brush: {
                    type: ['rect', 'polygon', 'clear']
                }
            }
        },
        brush: {},
        legend: {
            data: type,
            left: 'center'
        },
        xAxis: [
            {
                type: 'value',
                scale: true,
                splitLine: {
                    show: false
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                scale: true,

                splitLine: {
                    show: false
                }
            }
        ],
        series: series_list

    };


    return option;

}


//直方图
function displayHistogramOneOptionHelper(data) {

    var option = {
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'  // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: data.x,
                axisTick: {
                    alignWithLabel: true
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '数值',
                type: 'bar',
                barWidth: '60%',
                data: data.data
            }
        ]
    };

    return option;

}


function displayHistogramManyOptionHelper(data, name) {
    var data_temp = data.data;
    var y = data.y;


    var y_set = [];
    for (var i = 0; i < data_temp.length; i++) {
        y_set.push({
            name: y[i].toString(),
            type: 'bar',
            data: data_temp[i]
        });
    }

    var option = {
        toolbox: {
            feature: {
                magicType: {
                    type: ['stack', 'tiled']
                },
                dataView: {},
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        },
        tooltip: {},
        dataZoom: [{
            startValue: data.x[0]
        }, {
            type: 'inside'
        }],
        xAxis: {
            data: data.x,
            silent: false,
            splitLine: {
                show: false
            }
        },
        yAxis: {},
        series: y_set,
    };
    return option;
}


// 折线图
function displayLineOneRangeOptionHelper(data) {
    var data_temp = data.data;
    var max_num = data_temp[0], min_num = data_temp[0];
    for (var i = 0, len = data_temp.length; i < len; i++) {
        if (data_temp[i] > max_num) {
            max_num = data_temp[i];
        }
        if (data_temp[i] < min_num) {
            min_num = data_temp[i];
        }
    }

    var num_size = (max_num - min_num) / 6;

    if (num_size == 0) {
        max_num = max_num + 3;
        min_num = min_num - 3;
        num_size = 1;
    }

    var option = {
        tooltip: {
            trigger: 'axis'
        },
        xAxis: {
            data: data.x,
        },
        yAxis: {
            max: Number(max_num),
            min: Number(min_num),
            splitLine: {
                show: false
            }
        },
        toolbox: {
            left: 'center',
            feature: {
                dataZoom: {
                    yAxisIndex: 'none'
                },
                restore: {},
                saveAsImage: {}
            }
        },
        dataZoom: [{
            startValue: data.x[0]
        }, {
            type: 'inside'
        }],
        visualMap: {
            top: 0,
            right: 0,
            precision: 2,
            pieces: [{
                gt: Number(min_num),
                lte: Number(min_num) + Number(num_size),
                color: '#096'
            }, {
                gt: Number(min_num) + Number(num_size),
                lte: Number(min_num) + Number(num_size * 2),
                color: '#ffde33'
            }, {
                gt: Number(min_num) + Number(num_size * 2),
                lte: Number(min_num) + Number(num_size * 3),
                color: '#ff9933'
            }, {
                gt: Number(min_num) + Number(num_size * 3),
                lte: Number(min_num) + Number(num_size * 4),
                color: '#cc0033'
            }, {
                gt: Number(min_num) + Number(num_size * 4),
                lte: Number(min_num) + Number(num_size * 5),
                color: '#660099'
            }, {
                gt: Number(min_num) + Number(num_size * 5),
                color: '#7e0023'
            }],
            outOfRange: {
                color: '#999'
            }
        },
        series: {
            name: '数值',
            type: 'line',
            data: data_temp,
            markLine: {
                silent: true,
                data: [{
                    yAxis: Number(min_num) + Number(num_size)
                }, {
                    yAxis: Number(min_num) + Number(num_size * 2)
                }, {
                    yAxis: Number(min_num) + Number(num_size * 3)
                }, {
                    yAxis: Number(min_num) + Number(num_size * 4)
                }, {
                    yAxis: Number(min_num) + Number(num_size * 5)
                }]
            }
        }

    };
    return option;
}

function displayLineManyOptionHelper(data) {
    var data_temp = data.data;
    var y = data.y;

    var y_set = [];
    for (var i = 0; i < data_temp.length; i++) {
        y_set.push({
            name: y[i].toString(),
            type: 'line',
            data: data_temp[i]
        });
    }

    var option = {
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        dataZoom: [{
            startValue: data.x[0]
        }, {
            type: 'inside'
        }],
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data.x
        },
        yAxis: {
            type: 'value'
        },
        series: y_set
    };
    return option;
}

//fan

function displayFanOneOptionHelper(data) {
    var data_temp = data.data;
    var x = data.x;
    var x_set = [];
    for (var i = 0, len = data_temp.length; i < len; i++) {
        x_set.push({value: data_temp[i], name: x[i].toString()});
    }

    var option = {
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
            {
                name: '扇形图',
                type: 'pie',
                radius: '80%',
                center: ['50%', '60%'],
                data: x_set,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    return option;
}

//雷达图
function displayRadarOneOptionHelper(data) {
    var data_temp = data.data;
    var x = data.x;

    var x_set = [];
    var y_set = [];
    var max = Math.max.apply(null,data_temp);
    y_set.push({value: data_temp});

    for (var i = 0, len = x.length; i < len; i++) {
        x_set.push({name: x[i].toString(), max: max});
    }

    var option = {
        tooltip: {},
        radar: {
            name: {
                textStyle: {
                    color: '#fff',
                    backgroundColor: '#999',
                    borderRadius: 3,
                    padding: [3, 5]
                }
            },
            indicator: x_set
        },
        series: [{
            name: '雷达图',
            type: 'radar',
            // areaStyle: {normal: {}},
            data: y_set
        }]
    };
    return option;

}

function displayRadarManyOptionHelper(data) {
    var data_temp = data.data;
    var x = data.x;
    var y = data.y;

    var x_set = [];
    var y_set = [];
    var max = Math.max.apply(null,data_temp[0]);
    for (var i = 0, len = data_temp.length; i < len; i++) {
        if (max < Math.max.apply(null,data_temp[i])) {
            max = Math.max.apply(null,data_temp[i]);
        }
        y_set.push({value: data_temp[i], name: y[i].toString()});
    }

    for (var i = 0, len = x.length; i < len; i++) {
        x_set.push({name: x[i].toString(), max: max});
    }

    var option = {
        tooltip: {},
        radar: {
            name: {
                textStyle: {
                    color: '#fff',
                    backgroundColor: '#999',
                    borderRadius: 3,
                    padding: [3, 5]
                }
            },
            indicator: x_set
        },
        series: [{
            name: '雷达图',
            type: 'radar',
            // areaStyle: {normal: {}},
            data: y_set
        }]
    };
    return option;
}