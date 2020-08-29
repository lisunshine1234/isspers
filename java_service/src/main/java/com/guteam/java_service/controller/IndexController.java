package com.guteam.java_service.controller;

import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.service.SystemInfoService;
//import matlabcontrol.MatlabProxy;
//import matlabcontrol.extensions.MatlabNumericArray;
//import matlabcontrol.extensions.MatlabTypeConverter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.servlet.ModelAndView;

//import javax.servlet.ServletContext;

@Controller
public class IndexController {
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private SystemInfoService systemInfoService;
//    @Autowired
//    private ServletContext servletContext;

    @RequestMapping("/index")
    public ModelAndView getNavigationList() {
        ModelAndView view = new ModelAndView();
        view.addObject("systemIntroduceList", systemInfoService.getSystemIntroduceByIsActivate(true));
        view.addObject("navigationList", redisUtil.get("navigation"));
        view.addObject("systemInfo", redisUtil.get("systemInfo"));
        view.setViewName("main/index");

//        try {
//            MatlabProxy proxy = (MatlabProxy) servletContext.getAttribute("proxy");
//            proxy.eval("cd test");
//            Object[] result = proxy.returningFeval("hello", 1, 2);
//            double[] r = (double[]) result[0];
//            System.out.print(result);
//
//        } catch (Exception e) {
//            e.printStackTrace();
//        }

        return view;
    }


}
