package com.guteam.java_service.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Project;
import com.guteam.java_service.entity.User;
import com.guteam.java_service.service.*;
import com.guteam.java_service.util.FileHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import java.util.UUID;

@Controller
public class FileController {
    @Autowired
    private UserService userService;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private FileService fileService;
    @Autowired
    private FileHelper fileHelper;

    @Value("${dataPath}")
    private String dataPath;
    @Value("${isspersPath}")
    private String isspersPath;
    @Value("${algorithmPath}")
    private String algorithmPath;

    @RequestMapping(value = "/file/checkFileName")
    @ResponseBody
    public Integer checkFileName(Authentication authentication,
                                 @RequestParam(value = "json") String json) {
        JSONObject jsonObject = JSON.parseObject(json);
        String id = (String) jsonObject.get("id");
        String dir = (String) jsonObject.get("dir");
        String fileName = jsonObject.get("fileNameList").toString();
        String[] fileNameList = fileName.replace("[\"", "").replace("\"]", "").split("\".\"");
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        Project project = projectService.findProjectByIdAndUserId(id, user.getId());
        if (project == null) {
            return -1;
        }
        String new_dir = isspersPath + dataPath + project.getProjectPath();

        return fileHelper.getSameFileNameNumber(new_dir, fileNameList);
    }

    @RequestMapping(value = "/file/changeFileName")
    @ResponseBody
    public String changeFileName(Authentication authentication,
                                 @RequestParam(value = "json") String json) {
        JSONObject jsonObject = JSON.parseObject(json);
        String dir = (String) jsonObject.get("dir");
        String fileName = (String) jsonObject.get("fileName");
        String newFileName = (String) jsonObject.get("newFileName");
        String id = (String) jsonObject.get("id");


        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        Project project = projectService.findProjectByIdAndUserId(id, user.getId());
        if (project == null) {
            return "路径错误";
        }
        String new_dir = isspersPath + dataPath + project.getProjectPath();

        return fileHelper.changeFileName(new_dir, fileName, newFileName);
    }

    @RequestMapping(value = "/file/upload", method = RequestMethod.POST)
    @ResponseBody
    public boolean upload(Authentication authentication,
                          @RequestParam(value = "projectFile") MultipartFile[] projectFile,
                          @RequestParam(value = "id") String id,
                          @RequestParam(value = "savePath", required = false, defaultValue = "/") String dir) {

        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        Project project = projectService.findProjectByIdAndUserId(id, user.getId());
        if (project == null) {
            return false;
        }
        String new_dir = isspersPath + dataPath + project.getProjectPath();
        return fileService.uploadFile(projectFile, new_dir);
    }


    @RequestMapping(value = "/file/create")
    @ResponseBody
    public String createDir(Authentication authentication,
                            @RequestParam(value = "json") String json) {
        JSONObject jsonObject = JSON.parseObject(json);
        String dir = (String) jsonObject.get("dir");
        String fileName = (String) jsonObject.get("fileName");
        String id = (String) jsonObject.get("id");

        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        Project project = projectService.findProjectByIdAndUserId(id, user.getId());
        if (project == null) {
            return "路径错误";
        }
        String new_dir = isspersPath + dataPath + project.getProjectPath();

        return fileHelper.createNewDir(new_dir, fileName);
    }

    @RequestMapping(value = "/file/copy")
    @ResponseBody
    public String copy(Authentication authentication,
                       @RequestParam(value = "json") String json) {
        JSONObject jsonObject = JSON.parseObject(json);
        String dir = (String) jsonObject.get("dir");
        String fileName = jsonObject.get("fileName").toString();
        String newDir = (String) jsonObject.get("newDir");
        String id = (String) jsonObject.get("id");

        String[] fileNameList = fileName.replace("[\"", "").replace("\"]", "").split("\".\"");
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        Project project = projectService.findProjectByIdAndUserId(id, user.getId());
        if (project == null) {
            return "路径错误";
        }
        String new_dir = isspersPath + dataPath + project.getProjectPath();

        return fileHelper.copyFile(fileNameList, new_dir + dir + "/", new_dir + newDir + "/");
    }

    @RequestMapping(value = "/file/delete")
    @ResponseBody
    public String delete(Authentication authentication,
                         @RequestParam(value = "json") String json) {
        JSONObject jsonObject = JSON.parseObject(json);
        String dir = (String) jsonObject.get("dir");
        String fileName = jsonObject.get("fileName").toString();
        String id = (String) jsonObject.get("id");


        String[] fileNameList = fileName.replace("[\"", "").replace("\"]", "").split("\".\"");
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        Project project = projectService.findProjectByIdAndUserId(id, user.getId());
        if (project == null) {
            return "路径错误";
        }
        String new_dir = isspersPath + dataPath + project.getProjectPath();

        return fileHelper.deleteFile(fileNameList, new_dir + dir + "/");
    }

    @RequestMapping(value = "/file/move")
    @ResponseBody
    public String move(Authentication authentication,
                       @RequestParam(value = "json") String json) {
        JSONObject jsonObject = JSON.parseObject(json);
        String dir = (String) jsonObject.get("dir");
        String fileName = jsonObject.get("fileName").toString();
        String newDir = (String) jsonObject.get("newDir");
        String id = (String) jsonObject.get("id");

        String[] fileNameList = fileName.replace("[\"", "").replace("\"]", "").split("\".\"");
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        Project project = projectService.findProjectByIdAndUserId(id, user.getId());
        if (project == null) {
            return "路径错误";
        }
        String new_dir = isspersPath + dataPath + project.getProjectPath();

        return fileHelper.moveFile(fileNameList, new_dir + dir + "/", new_dir + newDir + "/");
    }

    @RequestMapping(value = "/file/checkExist")
    @ResponseBody
    public boolean checkExist(Authentication authentication,
                              @RequestParam(value = "json") String json) {
        JSONObject jsonObject = JSON.parseObject(json);

        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        Project project = projectService.findByUserIdAndActivateAndNonLock(user.getId(), true, true);

        String file = isspersPath + dataPath + project.getProjectPath();

        return fileHelper.isExists(file) && fileHelper.isFile(file);
    }

    @RequestMapping(value = "/file/getMatKey")
    @ResponseBody
    public JSONObject getMatKey(Authentication authentication,
                                @RequestParam(value = "json") String json) {
        JSONObject jsonObject = JSON.parseObject(json);

        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        Project project = projectService.findByUserIdAndActivateAndNonLock(user.getId(), true, true);

        String file = isspersPath + dataPath + project.getProjectPath();

        return fileHelper.getMatKey(file);
    }


    //    @RequestMapping(value = "/file/save", method = RequestMethod.POST)
//    @ResponseBody
//    public String a(@RequestParam(value = "data") String data,
//                    @SessionAttribute User user) {
//        JSONObject jsonObject = JSON.parseObject(data);
//        Integer prodectId = projectService.getProjectIdByActivate(user.getId());
//
//        String dir = dataPath + user.getId() + "/" + prodectId + "/";
//
//        DataHelper dataHelper = new DataHelper();
//
//        boolean sign = true;
//        for (String key : jsonObject.keySet()) {
//            double[][] data_ = dataHelper.StringToList(jsonObject.get(key).toString());
//            sign = fileService.saveSetInfo(dir, key, data_);
//        }
//
//        return sign ? "success" : "error";
//    }
//

}
