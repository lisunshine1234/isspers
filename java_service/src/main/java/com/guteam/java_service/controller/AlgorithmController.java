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
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

@Controller
public class AlgorithmController {
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private UserService userService;
    @Autowired
    private NavigationService navigationService;
    @Autowired
    private OutputService outputService;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private InputService inputService;
    @Autowired
    private AlgorithmService algorithmService;
    @Autowired
    private AlgorithmCartService algorithmCartService;

    @Value("${dataPath}")
    private String dataPath;
    @Value("${isspersPath}")
    private String isspersPath;


    @RequestMapping(value = "/algorithm/{url}")
    public ModelAndView algorithm(@PathVariable("url") String url,
                                  Authentication authentication) {
        if (url.substring(url.length() - 1).equals("#")) {
            url = url.substring(0, url.length() - 2);
        }
        NavigationParent navigationParent = navigationService.checkNavigationUrlIsExistAndIsActivate("algorithm/" + url);
        ModelAndView modelAndView = new ModelAndView();

        modelAndView.addObject("navigationList", redisUtil.get("navigation"));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.addObject("navigationParent", navigationParent);

        if (navigationParent != null) {
            modelAndView.setViewName("main/algorithm");
        } else {
            modelAndView.setViewName("main/blank");
        }
        return modelAndView;
    }


    @RequestMapping(value = "/algorithm/view/{id}")
    public ModelAndView algorithmView(@PathVariable("id") String url,
                                      Authentication authentication) {
        ModelAndView modelAndView = new ModelAndView();

        modelAndView.addObject("navigationList", redisUtil.get("navigation"));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("main/algorithm_view");
        return modelAndView;
    }

    @RequestMapping("/algorithm/do/getAlgorithmList")
    @ResponseBody
    public JSONObject getAlgorithmList(@RequestParam(value = "json") String json,
                                       Authentication authentication) {
        JSONObject jsonObject = JSON.parseObject(json);
        String url = (String) jsonObject.get("url");
        url = url.replace("#", "");
        NavigationParent navigationParent = navigationService.checkNavigationUrlIsExistAndIsActivate("algorithm/" + url);
        JSONObject back = new JSONObject();
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);

        if (navigationParent != null) {
            List<Algorithm> algorithmBaseList = algorithmService.findAllAlgorithmBaseByNavigationFatherIdAndActivate(navigationParent.getId(), true, true, true, true, true);
            List<Algorithm> algorithmCustomList = algorithmService.findAllAlgorithmCustomByNavigationFatherIdAndActivate(navigationParent.getId(), true, true, true, true, true);
            List<Algorithm> algorithmCartList = algorithmCartService.findAlgorithmListByUserIdAndLockAndPassAndShareAndActivate(user.getId(), true,true, true, true, true);

            back.put("sign", true);
            back.put("algorithmBaseList", algorithmBaseList);
            back.put("algorithmCartList", algorithmCartList);
            back.put("algorithmCustomList", algorithmCustomList);
            return back;
        }
        back.put("sign", false);
        back.put("tip", "不存在该类别的算法");

        return back;
    }

    @RequestMapping("/algorithm/get/info")
    @ResponseBody
    public JSONObject getInfo(@RequestParam(value = "json") String json,
                              Authentication authentication) {

        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        JSONObject jsonObject = JSON.parseObject(json);
        String algorithmId = (String) jsonObject.get("algorithmId");

        Algorithm algorithm = algorithmService.findAlgorithmById(user.getId(), algorithmId);

        JSONObject back = new JSONObject();
        if (algorithm == null) {
            back.put("sign", false);
            back.put("tip", "算法不存在");
        }
        if (algorithm.isShare() || algorithm.getUserId().equals(user.getId())) {
            back.put("sign", true);
            back.put("algorithm", algorithm);
        } else {
            back.put("sign", false);
            back.put("tip", "算法不存在");
        }
        return back;
    }


}
