package com.guteam.java_service.controller.admin;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.adminService.AdminNavigationService;
import com.guteam.java_service.adminService.AdminProjectService;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.Project;
import com.guteam.java_service.entity.SetFile;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
public class AdminProjectController {

    @Autowired
    private AdminNavigationService adminNavigationService;
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private AdminProjectService adminProjectService;

    @RequestMapping("/admin/set/view")
    public ModelAndView view() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/setView");
        return modelAndView;
    }

    @RequestMapping("/admin/set/view/getSetList")
    @ResponseBody
    public List<Project> getSetList() {

        return adminProjectService.findAllSet();
    }

    @RequestMapping("/admin/set/view/getInfo")
    @ResponseBody
    public JSONObject getInfo(@RequestParam(value = "setId") String setId,
                                 @RequestParam(value = "url", defaultValue = "\\") String url) {
        return adminProjectService.findProjectById(setId, url);
    }

    @RequestMapping("/admin/set/insert")
    public ModelAndView insert() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/setInsert");
        return modelAndView;
    }

    @RequestMapping("/admin/set/delete")
    public ModelAndView delete() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/setDelete");
        return modelAndView;
    }


    @RequestMapping("/admin/set/update")
    public ModelAndView update() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/setUpdate");
        return modelAndView;
    }

    @RequestMapping("/admin/set/audit")
    public ModelAndView audit() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/setAudit");
        return modelAndView;
    }
    @RequestMapping("/admin/set/audit/nonLock")
    @ResponseBody
    public JSONObject nonLock(@RequestParam(value = "json") String json) {
        JSONObject jsonObject = JSON.parseObject(json);
        String setId = (String) jsonObject.get("setId");
        boolean nonLock = (boolean) jsonObject.get("nonLock");
        String message = (String) jsonObject.get("message");

        JSONObject back = new JSONObject();
        back.put("sign", adminProjectService.saveAlgorithmNonLock(setId,nonLock,message));
        return back;
    }

}
