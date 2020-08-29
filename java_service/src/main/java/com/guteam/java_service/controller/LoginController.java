package com.guteam.java_service.controller;


import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.User;
import com.guteam.java_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import javax.servlet.http.HttpServletRequest;

@Controller
public class LoginController {
    @Autowired
    private UserService userService;

    @Autowired
    private RedisUtil redisUtil;

    @RequestMapping("/login")
    public ModelAndView login() {
        ModelAndView view = new ModelAndView();
        view.addObject("systemInfo", redisUtil.get("systemInfo"));
        view.setViewName("login/login");
        return view;
    }


//    @RequestMapping(value = "/")
//    public String login(Model model, User user
//            , @RequestParam(value = "error", required = false) boolean error
//            , @RequestParam(value = "logout", required = false) boolean logout, HttpServletRequest request) {
//        model.addAttribute(user);
//        //如果已经登陆跳转到个人首页
//        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
//        if (authentication != null && !authentication.getPrincipal().equals("anonymousUser") && authentication.isAuthenticated())
//            return "user";
//        if (error == true)
//            model.addAttribute("error", error);
//        if (logout == true)
//            model.addAttribute("logout", logout);
//        return "login";
//    }

}
