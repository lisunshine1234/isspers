package com.guteam.java_service.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.*;
import com.guteam.java_service.service.AlgorithmCartService;
import com.guteam.java_service.service.NavigationService;
import com.guteam.java_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
public class AlgorithmCartController {
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private UserService userService;
    @Autowired
    private AlgorithmCartService algorithmCartService;
    @Autowired
    private NavigationService navigationService;

    @RequestMapping("/cart")
    public ModelAndView cart() {
        NavigationParent navigationParent = navigationService.checkNavigationUrlIsExistAndIsActivate("cart");
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", redisUtil.get("navigation"));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.addObject("navigationParent", navigationParent);
        modelAndView.setViewName("main/algorithm_cart");

        return modelAndView;
    }

    @RequestMapping("/cart/do/in")
    @ResponseBody
    public JSONObject cartIn(@RequestParam(value = "json") String json,
                             Authentication authentication) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        JSONObject jsonObject = JSON.parseObject(json);
        String algorithmId = jsonObject.get("algorithmId").toString();

        AlgorithmCart algorithmCart = new AlgorithmCart();
        algorithmCart.setUserId(user.getId());
        algorithmCart.setAlgorithmId(algorithmId);
        return algorithmCartService.addAlgorithmInCart(algorithmCart);
    }

    @RequestMapping("/cart/do/out")
    @ResponseBody
    public JSONObject cartOut(@RequestParam(value = "json") String json,
                              Authentication authentication) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        JSONObject jsonObject = JSON.parseObject(json);
        String algorithmId = jsonObject.get("algorithmId").toString();

        AlgorithmCart algorithmCart = new AlgorithmCart();
        algorithmCart.setUserId(user.getId());
        algorithmCart.setAlgorithmId(algorithmId);
        return algorithmCartService.delAlgorithmOutCart(algorithmCart);
    }

    @RequestMapping(value = "/cart/getInfoJson")
    @ResponseBody
    public JSONObject getInfoJson(Authentication authentication) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        JSONObject jsonObject = new JSONObject();
        List<NavigationType> navigationList = algorithmCartService.findNavigationListByNavigationAlgorithm();
        List<Algorithm> algorithmList = algorithmCartService.findAlgorithmListByUserIdAndLockAndPassAndShareAndActivate(user.getId(), true,true, true, true, true);
        jsonObject.put("navigation", navigationList);
        jsonObject.put("algorithmList", algorithmList);
        jsonObject.put("navigationCount", algorithmCartService.findAlgorithmTypeCount(algorithmList, navigationList));
        return jsonObject;
    }
}
