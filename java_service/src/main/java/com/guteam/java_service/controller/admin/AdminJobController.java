package com.guteam.java_service.controller.admin;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.adminService.AdminJobService;
import com.guteam.java_service.adminService.AdminNavigationService;
import com.guteam.java_service.adminService.AdminProjectService;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.Job;
import com.guteam.java_service.entity.NavigationParent;
import com.guteam.java_service.entity.Project;
import com.guteam.java_service.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
public class AdminJobController {

    @Autowired
    private AdminNavigationService adminNavigationService;
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private AdminJobService adminJobService;

    @RequestMapping("/admin/job/view")
    public ModelAndView view() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/jobView");
        return modelAndView;
    }

    @RequestMapping("/admin/job/view/getJobList")
    @ResponseBody
    public List<Job> getJobList() {
        return adminJobService.findAllJob();
    }
    @RequestMapping(value = "/admin/job/view/{jobId}")
    public ModelAndView viewJob() {
        ModelAndView view = new ModelAndView();
        view.addObject("navigationList", redisUtil.get("navigation"));
        view.addObject("systemInfo", redisUtil.get("systemInfo"));
        view.addObject("url", "/admin/job/view");
        view.setViewName("admin/main/view_job");
        return view;
    }

    @RequestMapping(value = "/admin/job/audit/{jobId}")
    public ModelAndView auditJob() {
        ModelAndView view = new ModelAndView();
        view.addObject("navigationList", redisUtil.get("navigation"));
        view.addObject("systemInfo", redisUtil.get("systemInfo"));
        view.addObject("url","/admin/job/audit");
        view.setViewName("admin/main/view_job");
        return view;
    }
    @RequestMapping("/admin/job/audit")
    public ModelAndView audit() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/jobAudit");
        return modelAndView;
    }

    @RequestMapping("/admin/job/audit/nonLock")
    @ResponseBody
    public JSONObject nonLock(@RequestParam(value = "json") String json) {
        JSONObject jsonObject = JSON.parseObject(json);
        String jobId = (String) jsonObject.get("jobId");
        boolean nonLock = (boolean) jsonObject.get("nonLock");
        String message = (String) jsonObject.get("message");

        JSONObject back = new JSONObject();
        back.put("sign", adminJobService.saveJobNonLock(jobId,nonLock,message));
        return back;
    }

}
