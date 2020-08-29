package com.guteam.java_service.controller.admin;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.adminService.AdminNavigationService;
import com.guteam.java_service.adminService.AdminPlatformService;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.SystemInfo;
import com.guteam.java_service.entity.SystemIntroduce;
import com.guteam.java_service.entity.admin.AdminNavigationParent;
import com.guteam.java_service.util.FileHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
public class AdminSystemController {
    @Autowired
    private AdminNavigationService adminNavigationService;
    @Autowired
    private AdminPlatformService adminPlatformService;
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private FileHelper fileHelper;

    @RequestMapping("/admin/platform/index")
    public ModelAndView index() {
        List<AdminNavigationParent> adminNavigationByIsActivate = adminNavigationService.getAdminNavigationByIsActivate(true);
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationByIsActivate);
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/platformIndex");

        return modelAndView;
    }

    @RequestMapping("/admin/platform/index/getPlatformList")
    @ResponseBody
    public JSONObject getPlatformList() {
        JSONObject back = new JSONObject();
        back.put("platform", adminPlatformService.getPlatformList());
        return back;
    }

    @RequestMapping("/admin/platform/update/saveSystemIntroduce")
    @ResponseBody
    public JSONObject insertSystemIntroduce(@RequestParam(value = "systemIntroduce") String systemIntroduce) {
        JSONObject back = new JSONObject();
        back.put("sign", adminPlatformService.updateSystemIntroduceById(JSON.parseObject(systemIntroduce, SystemIntroduce.class)));
        return back;
    }

    @RequestMapping("/admin/platform/insert/saveSystemIntroduce")
    @ResponseBody
    public JSONObject updateSystemIntroduce(@RequestParam(value = "systemIntroduce") String systemIntroduce) {
        JSONObject back = new JSONObject();
        back.put("sign", adminPlatformService.insertSystemIntroduce(JSON.parseObject(systemIntroduce)));
        return back;
    }


    @RequestMapping("/admin/platform/update/save/systemIntroduceOrder")
    @ResponseBody
    public JSONObject saveSystemIntroduceOrder(@RequestParam(value = "json") String json) {
        JSONObject back = new JSONObject();
        back.put("sign", adminPlatformService.updateSystemIntroduceOrder(JSON.parseObject(json)));
        return back;
    }

    @RequestMapping("/admin/platform/delete/systemIntroduceById")
    @ResponseBody
    public JSONObject systemIntroducetById(@RequestParam(value = "systemIntroduceId") String systemIntroduceId) {
        JSONObject back = new JSONObject();
        back.put("sign", adminPlatformService.deleteSystemIntroduceId(systemIntroduceId));
        return back;
    }


    @RequestMapping("/admin/platform/information")
    public ModelAndView information() {
        List<AdminNavigationParent> adminNavigationByIsActivate = adminNavigationService.getAdminNavigationByIsActivate(true);
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationByIsActivate);
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/platformInformation");

        return modelAndView;
    }


    @RequestMapping("/admin/platform/information/getPlatformInformation")
    @ResponseBody
    public SystemInfo getPlatformInformation() {
        return adminPlatformService.findSystemInfo();
    }


    @RequestMapping("/admin/platform/information/save/platformInformation")
    @ResponseBody
    public JSONObject getPlatformInformation(@RequestParam(value = "json") String json) {
        JSONObject back = new JSONObject();
        back.put("sign", adminPlatformService.saveSystemInfo(JSON.parseObject(json, SystemInfo.class)));
        return back;
    }

    @RequestMapping("/admin/platform/information/upload/logo")
    @ResponseBody
    public JSONObject getPlatformInformation(@RequestParam(value = "fileUpload") MultipartFile[] fileUpload) {
        if (fileUpload.length > 0) {
            return adminPlatformService.uploadSystemLogo(fileUpload);
        }
        else {
            JSONObject back = new JSONObject();
            back.put("sign", false);
            return back;
        }
    }


}
