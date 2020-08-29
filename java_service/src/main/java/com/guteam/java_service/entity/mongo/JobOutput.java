package com.guteam.java_service.entity.mongo;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Project;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.io.Serializable;
import java.util.List;

@Document(collection = "jobOutput")
public class JobOutput implements Serializable {
    @Id
    private String id;
    private List<JSONObject> info;
    private String userId;
    private Project project;
    private String sign;

    public JobOutput() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public List<JSONObject> getInfo() {
        return info;
    }

    public String getSign() {
        return sign;
    }

    public void setSign(String sign) {
        this.sign = sign;
    }

    public void setInfo(List<JSONObject> info) {
        this.info = info;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }
}
