package com.guteam.java_service.entity.mongo;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Project;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.List;

@Document(collection = "algorithmDescribe")
public class AlgorithmDescribe implements Serializable {
    @Id
    private String id;
    private String describe;

    public AlgorithmDescribe() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getDescribe() {
        return describe;
    }

    public void setDescribe(String describe) {
        this.describe = describe;
    }
}
