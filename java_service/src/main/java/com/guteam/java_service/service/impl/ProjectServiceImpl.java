package com.guteam.java_service.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Project;
import com.guteam.java_service.entity.mongo.ProjectDescribe;
import com.guteam.java_service.respository.mongodb.ProjectDescribeRepository;
import com.guteam.java_service.respository.mysql.ProjectRepository;
import com.guteam.java_service.service.ProjectService;
import com.guteam.java_service.util.FileHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class ProjectServiceImpl implements ProjectService {
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private FileHelper fileHelper;

    @Autowired
    private ProjectDescribeRepository projectDescribeRepository;

    @Value("${dataPath}")
    private String dataPath;
    @Value("${isspersPath}")
    private String isspersPath;


    @Override
    public List<Project> findAllByUserIdOrderByUpdateTimeDesc(String userId) {
        return projectRepository.findAllByUserIdOrderByUpdateTimeDesc(userId);
    }

    @Override
    public List<Project> findConciseByUserIdOrderByUpdateTimeDesc(String userId) {
        List<Project> projectList = projectRepository.findAllByUserIdOrderByUpdateTimeDesc(userId);
        for (Project project : projectList) {
            project.setCreateTime(null);
            project.setUpdateTime(null);
            project.setUserId(null);
        }
        return projectList;
    }


    @Override
    public Project findByUserIdAndActivateAndNonLock(String userId, boolean isActivate, boolean isNonLock) {
        List<Project> projectList = projectRepository.findByUserIdAndActivateAndNonLock(userId, isActivate, isNonLock);
        if (projectList.size() == 0) {
            return null;
        }
        if (projectList.size() > 1) {
            for (int i = 1; i < projectList.size(); i++) {
                Project project = projectList.get(i);
                project.setActivate(false);
                projectRepository.save(project);
            }
        }
        return projectList.get(0);
    }

    @Override
    public Project findProjectByIdAndUserId(String id, String userId) {
        Project project = projectRepository.findByIdAndUserId(id, userId);
        if (project == null) {
            return null;
        }

        ProjectDescribe projectDescribe = projectDescribeRepository.findById(project.getProjectDescribeId()).orElse(null);
        if(projectDescribe == null){
            project.setProjectDescribe("");
        }else{
            project.setProjectDescribe(projectDescribe.getInfo());
        }

        return project;
    }

    @Override
    public JSONObject checkProject(String userId, String fileName) {
        Project project = findByUserIdAndActivateAndNonLock(userId, true, true);

        JSONObject object = new JSONObject();
        if (project == null) {
            object.put("url", "/guteam/set");
            object.put("sign", false);
            object.put("tip", "未找到激活的数据集，请前往数据集页面激活需要使用的数据集");
            return object;
        }

        String new_dir = isspersPath + dataPath + project.getProjectPath();

        File file = new File(new_dir);

        if (!file.exists()) {
            object.put("sign", false);
            object.put("tip", "文件不存在");
            return object;
        }
        object.put("sign", true);
        object.put("projectId", project.getId());
        return object;

    }


    @Override
    public boolean createProduct(Project project) {
        if (project.isActivate()) {
            projectRepository.updateAllActivateToFalse(project.getId(), project.getUserId());
        }
        ProjectDescribe projectDescribe = new ProjectDescribe();
        projectDescribe.setInfo(project.getProjectDescribe());
        projectDescribe = projectDescribeRepository.save(projectDescribe);
        project.setProjectDescribeId(projectDescribe.getId());
        Date date = new Date();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM");
        SimpleDateFormat simpleDateFormat1 = new SimpleDateFormat("dd");
        String path = simpleDateFormat.format(date) + "/" + simpleDateFormat1.format(date) + "/" + UUID.randomUUID().toString().replaceAll("-", "") + "/";
        project.setProjectPath(path);
        project = projectRepository.save(project);

        String dir = isspersPath + dataPath + path;

        fileHelper.createDir(dir);

        return true;

    }

    @Override
    public boolean updateProduct(Project project) {
        String des = project.getProjectDescribe();
        if (project.isActivate()) {
            projectRepository.updateAllActivateToFalse(project.getId(), project.getUserId());
        }

        project = projectRepository.save(project);
        ProjectDescribe projectDescribe = new ProjectDescribe();
        projectDescribe.setInfo(project.getProjectDescribe());
        projectDescribe.setId(project.getProjectDescribeId());
        projectDescribeRepository.save(projectDescribe);

        return true;
    }

    @Override
    public boolean deleteProject(String id, String userId) {
        Project project_back = projectRepository.findByIdAndUserId(id, userId);
        if (project_back == null) {
            return false;
        }
        fileHelper.deleteDir(isspersPath + dataPath + project_back.getProjectPath());
        projectDescribeRepository.deleteById(project_back.getProjectDescribeId());
        projectRepository.deleteById(id);
        return true;
    }


}
