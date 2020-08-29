package com.guteam.java_service.controller.admin;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.adminService.AdminAlgorithmService;
import com.guteam.java_service.adminService.AdminNavigationService;
import com.guteam.java_service.adminService.AdminUserNavigationService;
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
public class AdminAlgorithmController {
    @Autowired
    private AdminNavigationService adminNavigationService;
    @Autowired
    private AdminUserNavigationService adminUserNavigationService;
    @Autowired
    private AdminAlgorithmService adminAlgorithmService;

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
    @Value("${isspersPath}")
    private String isspersPath;
    @Value("${algorithmPath}")
    private String algorithmPath;

    @RequestMapping("/admin/algorithm/view")
    public ModelAndView login() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/algorithmView");
        return modelAndView;
    }

    @RequestMapping("/admin/algorithm/insert")
    public ModelAndView insert() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/algorithmInsert");
        return modelAndView;
    }

    @RequestMapping("/admin/algorithm/delete")
    public ModelAndView delete() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/algorithmDelete");
        return modelAndView;
    }


    @RequestMapping("/admin/algorithm/update")
    public ModelAndView update() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/algorithmUpdate");
        return modelAndView;
    }

    @RequestMapping("/admin/algorithm/audit")
    public ModelAndView audit() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/algorithmAudit");
        return modelAndView;
    }
    @RequestMapping("/admin/algorithm/getBaseAlgorithmList")
    @ResponseBody
    public JSONObject getBaseAlgorithmList() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("algorithmList", adminAlgorithmService.findAllAlgorithm());
        jsonObject.put("navigationTypeList", adminUserNavigationService.findAllNavigationTypeListByAlgorithmNavigation());
        return jsonObject;
    }


    @RequestMapping("/admin/algorithm/getAlgorithmList")
    @ResponseBody
    public JSONObject getAlgorithmList() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("algorithmList", adminAlgorithmService.findAllAlgorithm());
        jsonObject.put("navigationTypeList", adminUserNavigationService.findAllNavigationTypeListByAlgorithmNavigation());
        return jsonObject;
    }

    @RequestMapping("/admin/algorithm/get/info")
    @ResponseBody
    public JSONObject getInfo(@RequestParam(value = "json") String json,
                              Authentication authentication) {
        JSONObject jsonObject = JSON.parseObject(json);
        String algorithmId = (String) jsonObject.get("algorithmId");

        Algorithm algorithm = adminAlgorithmService.findAlgorithmById(algorithmId);

        JSONObject back = new JSONObject();
        if (algorithm == null) {
            back.put("sign", false);
            back.put("tip", "算法不存在");
        } else {
            back.put("sign", true);
            back.put("algorithm", algorithm);
        }
        return back;
    }


    @RequestMapping("/admin/algorithm/update/nonLock")
    @ResponseBody
    public JSONObject nonLock(@RequestParam(value = "json") String json) {
        JSONObject jsonObject = JSON.parseObject(json);
        String algorithmId = (String) jsonObject.get("algorithmId");
        boolean nonLock = (boolean) jsonObject.get("nonLock");
        String message = (String) jsonObject.get("message");

        JSONObject back = new JSONObject();
        back.put("sign", adminAlgorithmService.saveAlgorithmNonLock(algorithmId,nonLock,message));
        return back;
    }

    @RequestMapping("/admin/algorithm/delete/byId")
    @ResponseBody
    public JSONObject deleteById(@RequestParam(value = "json") String json) {
        JSONObject jsonObject = JSON.parseObject(json);
        String algorithmId = (String) jsonObject.get("algorithmId");

        JSONObject back = new JSONObject();
        back.put("sign", adminAlgorithmService.deleteAlgorithmById(algorithmId));
        return back;
    }

    @RequestMapping("/admin/algorithm/update/{algorithmId}")
    public ModelAndView update(Authentication authentication,
                               @PathVariable("algorithmId") String algorithmId) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        JSONObject algorithmAllInfo = algorithmMyService.findAlgorithmBaseInOutDisplayByAlgorithmId(algorithmId, user.getId());
        NavigationParent navigationParent = navigationService.checkNavigationUrlIsExistAndIsActivate("my_algorithm");
        ModelAndView modelAndView = new ModelAndView();

        if (algorithmAllInfo.containsKey("baseInfo")) {
            modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
            modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
            modelAndView.addObject("navigationParent", navigationParent);
            modelAndView.addObject("algorithmEnvironment", algorithmEngineService.findAllAlgorithmEngineByActivate(true));
            modelAndView.addObject("algorithmAllInfo", algorithmAllInfo);
            modelAndView.addObject("url", "/admin/algorithm/update");
            modelAndView.setViewName("admin/main/algorithm_upload");
        } else {
            modelAndView.setViewName("redirect:/admin/algorithm/insert");
        }
        return modelAndView;
    }

    @RequestMapping(value = "/admin/algorithm/my/getAlgorithmFileList", method = RequestMethod.POST)
    @ResponseBody
    public List<SetFile> getAlgorithmFileList(@RequestParam(value = "path") String path) {
        String new_dir = isspersPath + algorithmPath;
        new_dir += path;

        return algorithmMyService.findAlgorithmFileList(new_dir);
    }


    @RequestMapping(value = "/admin/algorithm/my/save/baseInfo", method = RequestMethod.POST)
    @ResponseBody
    public Algorithm saveBaseInfo(Authentication authentication,
                                  @RequestParam(value = "json") String json) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        JSONObject object = JSON.parseObject(json);
        JSONObject baseInfo = (JSONObject) object.get("baseInfo");
        JSONObject algorithmInfo = (JSONObject) object.get("algorithmInfo");

        return algorithmMyService.saveAlgorithmBaseInfo(baseInfo, user, algorithmInfo);
    }

    @RequestMapping(value = "/admin/algorithm/my/upload", method = RequestMethod.POST)
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


    @RequestMapping(value = "/admin/algorithm/my/save/inputListAndOutputList", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject saveInputListAndOutputList(@RequestParam(value = "json") String json) {
        JSONObject object = JSON.parseObject(json);
        JSONObject algorithmInfo = (JSONObject) object.get("algorithmInfo");
        Algorithm algorithm = JSON.parseObject(JSON.toJSONString(algorithmInfo), Algorithm.class);
        List<JSONObject> inputList = (List<JSONObject>) object.get("inputList");
        List<JSONObject> outputList = (List<JSONObject>) object.get("outputList");

        return algorithmMyService.saveAlgorithmInAndOut(algorithm, inputList, outputList);
    }


    @RequestMapping(value = "/admin/algorithm/my/save/displayList", method = RequestMethod.POST)
    @ResponseBody
    public JSONObject saveDisplayList(@RequestParam(value = "json") String json) {
        JSONObject object = JSON.parseObject(json);
        List<JSONObject> displayList = (List<JSONObject>) object.get("displayList");
        JSONObject algorithmInfo = (JSONObject) object.get("algorithmInfo");
        Algorithm algorithm = JSON.parseObject(JSON.toJSONString(algorithmInfo), Algorithm.class);

        return algorithmMyService.saveAlgorithmDisplay(algorithm, displayList);
    }


    @RequestMapping(value = "/admin/algorithm/my/delFileList", method = RequestMethod.POST)
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

    @RequestMapping(value = "/admin/algorithm/my/delFile", method = RequestMethod.POST)
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

    @RequestMapping(value = "/admin/algorithm/my/getAlgorithmMethodList")
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


    @RequestMapping(value = "/admin/algorithm/my/add/getEnvironmentAndEngine")
    @ResponseBody
    public JSONObject getEnvironment() {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("algorithmEnvironment", algorithmEnvironmentService.findAllAlgorithmEnvironmentByActivate(true));
        jsonObject.put("algorithmEngine", algorithmEngineService.findAllAlgorithmEngineByActivate(true));
        jsonObject.put("algorithmType", navigationService.findAllByActivateAndNavigationAlgorithm(true, true));
        return jsonObject;
    }


    @RequestMapping(value = "/admin/algorithm/my/getInfoJson")
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
