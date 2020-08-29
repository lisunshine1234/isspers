package com.guteam.java_service.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.*;
import com.guteam.java_service.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Controller
public class AlgorithmMyController {
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private UserService userService;
    @Autowired
    private AlgorithmMyService algorithmMyService;
    @Autowired
    private NavigationService navigationService;
    @Autowired
    private AlgorithmEngineService algorithmEngineService;
    @Autowired
    private AlgorithmEnvironmentService algorithmEnvironmentService;
    @Autowired
    private InputService inputService;
    @Autowired
    private OutputService outputService;
    @Autowired
    private DisplayService displayService;

    @Autowired
    private FileService fileService;

    @Value("${dataPath}")
    private String dataPath;
    @Value("${isspersPath}")
    private String isspersPath;
    @Value("${algorithmPath}")
    private String algorithmPath;


    @RequestMapping("/my_algorithm")
    public ModelAndView my_algorithm() {
        NavigationParent navigationParent = navigationService.checkNavigationUrlIsExistAndIsActivate("my_algorithm");
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", redisUtil.get("navigation"));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.addObject("navigationParent", navigationParent);
        modelAndView.setViewName("main/algorithm_my");

        return modelAndView;
    }

    @RequestMapping("/my_algorithm/add")
    public ModelAndView add() {
        NavigationParent navigationParent = navigationService.checkNavigationUrlIsExistAndIsActivate("my_algorithm");
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", redisUtil.get("navigation"));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.addObject("navigationParent", navigationParent);
        modelAndView.addObject("algorithmEnvironment", algorithmEngineService.findAllAlgorithmEngineByActivate(true));

        modelAndView.setViewName("main/algorithm_upload");

        return modelAndView;
    }

    @RequestMapping("/my_algorithm/update/{algorithmId}")
    public ModelAndView update(Authentication authentication,
                               @PathVariable("algorithmId") String algorithmId) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        JSONObject algorithmAllInfo = algorithmMyService.findAlgorithmBaseInOutDisplayByAlgorithmId(algorithmId, user.getId());
        NavigationParent navigationParent = navigationService.checkNavigationUrlIsExistAndIsActivate("my_algorithm");
        ModelAndView modelAndView = new ModelAndView();

        if (algorithmAllInfo.containsKey("baseInfo")) {
            modelAndView.addObject("navigationList", redisUtil.get("navigation"));
            modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
            modelAndView.addObject("navigationParent", navigationParent);
            modelAndView.addObject("algorithmEnvironment", algorithmEngineService.findAllAlgorithmEngineByActivate(true));
            modelAndView.addObject("algorithmAllInfo", algorithmAllInfo);
            modelAndView.addObject("url", "/my_algorithm");
            modelAndView.setViewName("main/algorithm_upload");
        } else {
            modelAndView.setViewName("redirect:/my_algorithm/add");
        }
        return modelAndView;
    }

    @RequestMapping(value = "/algorithm/my/getAlgorithmFileList", method = RequestMethod.POST)
    @ResponseBody
    public List<SetFile> getAlgorithmFileList(@RequestParam(value = "path") String path) {
        String new_dir = isspersPath + algorithmPath;

        new_dir += path;

        return algorithmMyService.findAlgorithmFileList(new_dir);
    }


    @RequestMapping(value = "/algorithm/my/save/baseInfo", method = RequestMethod.POST)
    @ResponseBody
    public Algorithm saveBaseInfo(Authentication authentication,
                                  @RequestParam(value = "json") String json) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        JSONObject object = JSON.parseObject(json);
        JSONObject baseInfo = (JSONObject) object.get("baseInfo");
        JSONObject algorithmInfo = (JSONObject) object.get("algorithmInfo");

        return algorithmMyService.saveAlgorithmBaseInfo(baseInfo, user, algorithmInfo);
    }

    @RequestMapping(value = "/algorithm/my/upload", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject algorithmUpload(@RequestParam(value = "fileList") MultipartFile[] fileList,
                                      @RequestParam(value = "algorithmInfo") String algorithmInfo) {
        Algorithm algorithm = JSON.parseObject(algorithmInfo, Algorithm.class);
        String path;
        if (algorithm.getAlgorithmPath() == null) {
            Date date = new Date();
            SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM");
            SimpleDateFormat simpleDateFormat1 = new SimpleDateFormat("dd");
            path = simpleDateFormat.format(date) + "/" + simpleDateFormat1.format(date) + "/" + UUID.randomUUID().toString().replaceAll("-", "") + "/";

            algorithm = algorithmMyService.saveAlgorithmUploadFilePath(path, algorithm);
        } else {
            path = algorithm.getAlgorithmPath();
        }

        String new_dir = isspersPath + algorithmPath;

        new_dir += path;
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sign", fileService.uploadFile(fileList, new_dir));

        algorithm = algorithmMyService.saveAlgorithmUploadFileSize(new_dir, algorithm);
        jsonObject.put("algorithmInfo", algorithm);

        return jsonObject;
    }


    @RequestMapping(value = "/algorithm/my/save/inputListAndOutputList", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject saveInputListAndOutputList(@RequestParam(value = "json") String json) {
        JSONObject object = JSON.parseObject(json);
        JSONObject algorithmInfo = (JSONObject) object.get("algorithmInfo");
        Algorithm algorithm = JSON.parseObject(JSON.toJSONString(algorithmInfo), Algorithm.class);
        List<JSONObject> inputList = (List<JSONObject>) object.get("inputList");
        List<JSONObject> outputList = (List<JSONObject>) object.get("outputList");

        return algorithmMyService.saveAlgorithmInAndOut(algorithm, inputList, outputList);
    }


    @RequestMapping(value = "/algorithm/my/save/displayList", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject saveDisplayList(@RequestParam(value = "json") String json) {
        JSONObject object = JSON.parseObject(json);
        List<JSONObject> displayList = (List<JSONObject>) object.get("displayList");
        JSONObject algorithmInfo = (JSONObject) object.get("algorithmInfo");
        Algorithm algorithm = JSON.parseObject(JSON.toJSONString(algorithmInfo), Algorithm.class);

        return algorithmMyService.saveAlgorithmDisplay(algorithm, displayList);
    }


    @RequestMapping(value = "/algorithm/my/delFileList", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject delFileList(@RequestParam(value = "json") String json) {
        JSONObject object = JSON.parseObject(json);
        String[] fileNameList = (String[]) object.get("fileNameList");
        String path = object.get("path").toString();
        String new_dir = isspersPath + algorithmPath;

        new_dir += path;

        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sign", algorithmMyService.delAlgorithmFileList(fileNameList, new_dir));
        return jsonObject;
    }

    @RequestMapping(value = "/algorithm/my/delFile", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject delFile(@RequestParam(value = "json") String json) {
        JSONObject object = JSON.parseObject(json);
        String fileName = object.get("fileName").toString();
        String path = object.get("path").toString();

        String new_dir = isspersPath + algorithmPath;

        new_dir += path;
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sign", algorithmMyService.delAlgorithmFile(fileName, new_dir));
        return jsonObject;
    }

    @RequestMapping(value = "/algorithm/my/getAlgorithmMethodList")
    @ResponseBody
    public JSONObject getAlgorithmMethodList(@RequestParam(value = "path") String path) {
        String new_dir = isspersPath + algorithmPath;
        new_dir += path;

        JSONObject object = new JSONObject();
        object.put("methodFileList", algorithmMyService.findAlgorithmPythonMethod(new_dir));
        object.put("inputTypeList", inputService.findAllInputTypeListByActivate(true));
        object.put("outputTypeList", outputService.findOutputListByActivate(true));
        object.put("outputIdWithDisplayTypeList", displayService.findOutputIdAndDisplayTypeListJsonByActivate(true));
        return object;
    }


    @RequestMapping(value = "/algorithm/my/add/getEnvironmentAndEngine")
    @ResponseBody
    public JSONObject getEnvironment() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("algorithmEnvironment", algorithmEnvironmentService.findAllAlgorithmEnvironmentByActivate(true));
        jsonObject.put("algorithmEngine", algorithmEngineService.findAllAlgorithmEngineByActivate(true));
        jsonObject.put("algorithmType", navigationService.findAllByActivateAndNavigationAlgorithm(true, true));
        return jsonObject;
    }


    @RequestMapping(value = "/algorithm/my/getInfoJson")
    @ResponseBody
    public JSONObject getInfoJson(Authentication authentication) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        JSONObject jsonObject = new JSONObject();
        List<NavigationType> navigationList = algorithmMyService.findNavigationListByNavigationAlgorithm();
        List<Algorithm> algorithmList = algorithmMyService.findAlgorithmListByUserId(user.getId());
        jsonObject.put("navigation", navigationList);
        jsonObject.put("algorithmList", algorithmList);
        jsonObject.put("navigationCount", algorithmMyService.findAlgorithmTypeCount(algorithmList, navigationList));
        return jsonObject;
    }
}
