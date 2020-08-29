package com.guteam.java_service.controller.admin;

import com.guteam.java_service.adminService.AdminNavigationService;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.admin.AdminNavigationParent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
public class AdminLoginController {
    @Autowired
    private AdminNavigationService adminNavigationService;
    @Autowired
    private RedisUtil redisUtil;
    @RequestMapping("/admin/login")
    public ModelAndView login() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/login/login");
        return modelAndView;
    }
}
