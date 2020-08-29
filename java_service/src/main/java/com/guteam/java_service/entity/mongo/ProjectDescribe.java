package com.guteam.java_service.entity.mongo;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Project;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.List;

@Document(collection = "projectDescribe")
public class ProjectDescribe implements Serializable {
    @Id
    private String id;
    private String info;

    public ProjectDescribe() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getInfo() {
        return info;
    }

    public void setInfo(String info) {
        this.info = info;
    }
}
