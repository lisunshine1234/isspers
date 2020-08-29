package com.guteam.java_service.controller;

import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.NavigationParent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class NavigationController {
    @Autowired
    private RedisUtil redisUtil;
//    @RequestMapping(value = "/navigation/getList")
//    @ResponseBody
//    public Object algorithm() {
//        return redisUtil.get("navigation");
//    }

}
