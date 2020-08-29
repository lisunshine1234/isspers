package com.guteam.java_service.controller;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.Algorithm;
import com.guteam.java_service.entity.NavigationParent;
import com.guteam.java_service.entity.NavigationType;
import com.guteam.java_service.service.NavigationService;
import com.guteam.java_service.service.ShopService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
public class ShopController {
    @Autowired
    private NavigationService navigationService;
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private ShopService shopService;

    @RequestMapping(value = "/shop")
    public ModelAndView algorithm() {
        NavigationParent navigationParent = navigationService.checkNavigationUrlIsExistAndIsActivate("shop");
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", redisUtil.get("navigation"));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.addObject("navigationParent", navigationParent);
        modelAndView.setViewName("main/shop");
        return modelAndView;
    }

    @RequestMapping(value = "/shop/getInfoJson")
    @ResponseBody
    public JSONObject getInfoJson() {
        JSONObject jsonObject = new JSONObject();
        List<NavigationType> navigationList = shopService.findNavigationListByNavigationAlgorithm();
        List<Algorithm> algorithmList = shopService.findAlgorithmListByLockAndPassAndShareAndActivate(true,true, true, true, true);
        jsonObject.put("navigation", navigationList);
        jsonObject.put("algorithmList", algorithmList);
        jsonObject.put("navigationCount", shopService.findAlgorithmTypeCount(algorithmList, navigationList));
        return jsonObject;
    }
}
