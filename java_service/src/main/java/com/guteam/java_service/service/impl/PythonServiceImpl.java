package com.guteam.java_service.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.fasterxml.jackson.annotation.JsonAlias;
import com.guteam.java_service.service.PythonService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Service
public class PythonServiceImpl implements PythonService {
    @Autowired
    private RestTemplate restTemplate;


    @Override
    public JSONObject do_base(Map<String, Object> paramSet) {
        String url = "http://sidecar/base";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType("application/json; charset=UTF-8"));
        headers.add("Accept", MediaType.APPLICATION_JSON.toString());
        HttpEntity<String> httpEntity = new HttpEntity<>(JSONObject.toJSONString(paramSet), headers);
        ResponseEntity<String> result = restTemplate.postForEntity(url, httpEntity, String.class);

        JSONObject jsonObject = JSONObject.parseObject(result.getBody());
        return jsonObject;
    }

}
