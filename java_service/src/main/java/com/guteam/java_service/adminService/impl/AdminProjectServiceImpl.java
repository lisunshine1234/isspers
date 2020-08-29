package com.guteam.java_service.adminService.impl;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.adminService.AdminProjectService;
import com.guteam.java_service.entity.Algorithm;
import com.guteam.java_service.entity.Project;
import com.guteam.java_service.entity.SetFile;
import com.guteam.java_service.entity.User;
import com.guteam.java_service.respository.admin.AdminProjectRepository;
import com.guteam.java_service.respository.admin.AdminUserRepository;
import com.guteam.java_service.util.FileHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AdminProjectServiceImpl implements AdminProjectService {
    @Autowired
    private AdminProjectRepository adminProjectRepository;
    @Autowired
    private AdminUserRepository adminUserRepository;
    @Autowired
    private FileHelper fileHelper;
    @Value("${dataPath}")
    private String dataPath;
    @Value("${isspersPath}")
    private String isspersPath;

    @Override
    public List<Project> findAllSet() {
        List<Project> projectList = adminProjectRepository.findAll();
        Set<String> userIdSet = new HashSet<>();
        for (Project project : projectList) {
            userIdSet.add(project.getUserId());
        }
        List<User> userList = adminUserRepository.findAllByIdIn(userIdSet);
        for (Project project : projectList) {
            for (User user : userList) {
                if (project.getUserId().equals(user.getId())) {
                    project.setUserName(user.getUserName());
                    break;
                }
            }
        }
        return projectList;
    }

    @Override
    public JSONObject findProjectById(String setId, String url) {
        Project project = adminProjectRepository.findAllById(setId);
        if (project == null) {
            return null;
        }
        String dir = isspersPath + dataPath + project.getProjectPath();
        List<SetFile> setFileList = fileHelper.getFileList(dir + "/" + url);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("url", (new File(dir + "/" + url).toString() + "/").replace(new File(dir).toString(), "").replace("\\", "/"));
        if (setFileList == null) {
            jsonObject.put("sign", false);
            jsonObject.put("setFileList", new ArrayList<>());
        } else {
            jsonObject.put("sign", true);
            jsonObject.put("setFileList", setFileList);
        }
        return jsonObject;
    }

    @Override
    public boolean saveAlgorithmNonLock(String algorithmId, boolean nonLock, String message) {
        Project project = adminProjectRepository.findById(algorithmId).orElse(null);
        if (project == null) {
            return false;
        }
        project.setNonLock(nonLock);
        project.setLockMessage(message);
        adminProjectRepository.save(project);
        return true;

    }
}
