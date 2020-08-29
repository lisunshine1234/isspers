package com.guteam.java_service.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.service.InputService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class InputController {
    @Autowired
    private InputService inputService;

    @RequestMapping("/input/getInputList")
    @ResponseBody
    public JSONObject getInput(@RequestParam(value = "json") String json) {
        JSONObject jsonObject = JSON.parseObject(json);
        String algorithmId = (String) jsonObject.get("algorithmId");
        JSONObject inputList = new JSONObject();
        inputList.put("inputList", inputService.findInputListByAlgorithmId(algorithmId));
        return inputList;
    }
}
