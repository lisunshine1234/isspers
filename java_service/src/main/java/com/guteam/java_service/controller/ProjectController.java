package com.guteam.java_service.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.NavigationParent;
import com.guteam.java_service.entity.Project;
import com.guteam.java_service.entity.SetFile;
import com.guteam.java_service.entity.User;
import com.guteam.java_service.service.NavigationService;
import com.guteam.java_service.service.ProjectService;
import com.guteam.java_service.service.UserService;
import com.guteam.java_service.util.FileHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

@Controller
public class ProjectController {
    @Autowired
    private UserService userService;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private FileHelper fileHelper;
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private NavigationService navigationService;
    @Value("${dataPath}")
    private String dataPath;
    @Value("${isspersPath}")
    private String isspersPath;

    @RequestMapping("/set")
    public ModelAndView visit() {
        NavigationParent navigationParent = navigationService.checkNavigationUrlIsExistAndIsActivate("set");
        ModelAndView view = new ModelAndView();

        view.addObject("navigationParent", navigationParent);
        view.addObject("navigationList", redisUtil.get("navigation"));
        view.addObject("systemInfo", redisUtil.get("systemInfo"));
        view.setViewName("main/set");
        return view;
    }

    @RequestMapping("/set/create")
    public ModelAndView create() {
        NavigationParent navigationParent = navigationService.checkNavigationUrlIsExistAndIsActivate("set");
        ModelAndView view = new ModelAndView();
        view.addObject("navigationParent", navigationParent);
        view.addObject("systemInfo", redisUtil.get("systemInfo"));
        view.addObject("navigationList", redisUtil.get("navigation"));
        view.setViewName("main/set_create");
        return view;
    }


    @RequestMapping("/set/update/{id}")
    public ModelAndView update(Authentication authentication,
                               @PathVariable("id") String id) {
        NavigationParent navigationParent = navigationService.checkNavigationUrlIsExistAndIsActivate("set");
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        Project project = projectService.findProjectByIdAndUserId(id, user.getId());
        ModelAndView view = new ModelAndView();
        if (project == null) {
            view.setViewName("main/blank");
            return view;
        }
        view.addObject("navigationParent", navigationParent);
        view.addObject("navigationList", redisUtil.get("navigation"));
        view.addObject("systemInfo", redisUtil.get("systemInfo"));
        view.addObject("project", project);
        view.setViewName("main/set_update");
        return view;
    }

    @RequestMapping(value = "/set/setConciseList")
    @ResponseBody
    public List<Project> setConciseList(Authentication authentication) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        return projectService.findConciseByUserIdOrderByUpdateTimeDesc(user.getId());
    }

    @RequestMapping(value = "/set/fileList")
    @ResponseBody
    public JSONObject fileList(Authentication authentication,
                               @RequestParam("id") String id,
                               @RequestParam(value = "url", required = false, defaultValue = "/") String url) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        Project project = projectService.findProjectByIdAndUserId(id, user.getId());
        JSONObject jsonObject = new JSONObject();
        if (project == null) {
            jsonObject.put("sign", false);
            jsonObject.put("tip", "数据集错误");
            return jsonObject;
        }

        String dir = isspersPath + dataPath + project.getProjectPath();
        List<SetFile> setFileList = fileHelper.getFileList(dir + url);

        if (setFileList == null) {
            jsonObject.put("sign", false);
            jsonObject.put("tip", "数据集不存在");
            return jsonObject;
        }

        dir = new File(dir).toString();
        for (SetFile setFile : setFileList) {
            setFile.setFilePath(setFile.getFilePath().replace(dir, "").replace("\\", "/"));
        }
        jsonObject.put("sign", true);
        jsonObject.put("setFileList", setFileList);
        jsonObject.put("url", (new File(dir + "/" + url).toString() + "/").replace(dir, "").replace("\\", "/"));
        return jsonObject;
    }

    @RequestMapping(value = "/set/dirList")
    @ResponseBody
    public JSONObject dirList(Authentication authentication,
                              @RequestParam("id") String id,
                              @RequestParam(value = "url", required = false, defaultValue = "/") String url) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        Project project = projectService.findProjectByIdAndUserId(id, user.getId());
        JSONObject jsonObject = new JSONObject();
        if (project == null) {
            jsonObject.put("sign", false);
            jsonObject.put("tip", "数据集错误");
            return jsonObject;
        }

        String dir = isspersPath + dataPath + project.getProjectPath();

        List<SetFile> setFileList = fileHelper.getDirList(dir + url);

        if (setFileList == null) {
            jsonObject.put("sign", false);
            jsonObject.put("tip", "数据集不存在");
            return jsonObject;
        }

        dir = new File(dir).toString();
        for (SetFile setFile : setFileList) {
            setFile.setFilePath(setFile.getFilePath().replace(dir, "").replace("\\", "/"));
        }
        jsonObject.put("sign", true);
        jsonObject.put("setDirList", setFileList);
        jsonObject.put("url", (new File(dir + "/" + url).toString() + "/").replace(dir, "").replace("\\", "/"));
        return jsonObject;
    }

    @RequestMapping(value = "/set/fileListByActivate")
    @ResponseBody
    public JSONObject fileListByActivate(Authentication authentication,
                                         @RequestParam(value = "url", required = false, defaultValue = "/") String url) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        Project project = projectService.findByUserIdAndActivateAndNonLock(user.getId(), true, true);
        JSONObject jsonObject = new JSONObject();
        if (project == null) {
            jsonObject.put("sign", false);
            jsonObject.put("tip", "未找到激活的数据集，请前往数据集页面激活需要使用的数据集");
            jsonObject.put("url", "/guteam/set");
            return jsonObject;
        }

        String dir = isspersPath + dataPath + project.getProjectPath();
        List<SetFile> setFileList = fileHelper.getFileList(dir + url);

        if (setFileList == null) {
            jsonObject.put("sign", false);
            jsonObject.put("tip", "数据集不存在");
            return jsonObject;
        }

        dir = new File(dir).toString();
        for (SetFile setFile : setFileList) {
            setFile.setFilePath(setFile.getFilePath().replace(dir, "").replace("\\", "/"));
        }
        jsonObject.put("sign", true);
        jsonObject.put("setFileList", setFileList);
        jsonObject.put("url", (new File(dir + "/" + url).toString() + "/").replace(dir, "").replace("\\", "/"));
        return jsonObject;
    }

    @RequestMapping(value = "/set/dirListByActivate")
    @ResponseBody
    public JSONObject dirListByActivate(Authentication authentication,
                                        @RequestParam(value = "url", required = false, defaultValue = "/") String url) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        Project project = projectService.findByUserIdAndActivateAndNonLock(user.getId(), true, true);
        JSONObject jsonObject = new JSONObject();
        if (project == null) {
            jsonObject.put("sign", false);
            jsonObject.put("url", "/guteam/set");
            jsonObject.put("tip", "未找到激活的数据集，请前往数据集页面激活需要使用的数据集");
            return jsonObject;
        }

        String dir = isspersPath + dataPath + project.getProjectPath();
        List<SetFile> setFileList = fileHelper.getDirList(dir + url);

        if (setFileList == null) {
            jsonObject.put("sign", false);
            jsonObject.put("tip", "数据集不存在");
            return jsonObject;
        }

        dir = new File(dir).toString();
        for (SetFile setFile : setFileList) {
            setFile.setFilePath(setFile.getFilePath().replace(dir, "").replace("\\", "/"));
        }
        jsonObject.put("sign", true);
        jsonObject.put("setDirList", setFileList);
        jsonObject.put("url", (new File(dir + "/" + url).toString() + "/").replace(dir, "").replace("\\", "/"));
        return jsonObject;
    }


    @RequestMapping(value = "/set/creating", method = RequestMethod.POST)
    @ResponseBody
    public boolean creating(Authentication authentication,
                            @RequestParam(value = "projectName") String projectName,
                            @RequestParam(value = "projectDescribe") String projectDescribe,
                            @RequestParam(value = "projectActivate", required = false, defaultValue = "0") boolean projectActivate) {
        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String time = df.format(new Date());
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        Project project = new Project(projectName, time, time, user.getId(), projectActivate, true, projectDescribe);
        return projectService.createProduct(project);
    }


    @RequestMapping(value = "/set/updating", method = RequestMethod.POST)
    @ResponseBody
    public boolean updating(Authentication authentication,
                            @RequestParam(value = "json") String json) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        JSONObject jsonObject = JSON.parseObject(json);
        String id = (String) jsonObject.get("id");
        Project project_back = projectService.findProjectByIdAndUserId(id, user.getId());
        if (project_back == null) {
            return false;
        }

        String projectName = (String) jsonObject.get("projectName");
        String projectDescribe = (String) jsonObject.get("projectDescribe");
        boolean projectActivate = (boolean) jsonObject.get("projectActivate");

        SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
        String time = df.format(new Date());
        project_back.setProjectName(projectName);
        project_back.setProjectDescribe(projectDescribe);
        project_back.setActivate(projectActivate);
        project_back.setUpdateTime(time);
        return projectService.updateProduct(project_back);
    }

    @RequestMapping(value = "/set/deleting", method = RequestMethod.POST)
    @ResponseBody
    public boolean deleting(Authentication authentication,
                            @RequestParam(value = "id") String id) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        return projectService.deleteProject(id, user.getId());
    }


    @RequestMapping(value = "/set/information", method = RequestMethod.POST)
    @ResponseBody
    public Project information(Authentication authentication,
                               @RequestParam(value = "id") String id) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        return projectService.findProjectByIdAndUserId(id, user.getId());
    }


}
