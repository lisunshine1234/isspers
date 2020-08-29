package com.guteam.java_service.service;

import com.alibaba.fastjson.JSONObject;

import java.util.Map;

public interface PythonService {
    JSONObject do_base(Map<String, Object> paramSet);
}
