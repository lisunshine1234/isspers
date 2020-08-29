package com.guteam.java_service.controller.admin;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.adminService.AdminNavigationService;
import com.guteam.java_service.adminService.AdminUserNavigationService;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.NavigationParent;
import com.guteam.java_service.entity.NavigationType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
public class AdminNavigationController {

    @Autowired
    private AdminNavigationService adminNavigationService;
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private AdminUserNavigationService adminUserNavigationService;


    @RequestMapping("/admin/navigation/view")
    public ModelAndView view() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/navigationView");
        return modelAndView;
    }

    @RequestMapping("/admin/navigation/view/getNavigationList")
    @ResponseBody
    public List<NavigationType> viewGetNavigationList() {
        return adminUserNavigationService.findAllNavigationTypeList();
    }


    @RequestMapping("/admin/navigation/insert")
    public ModelAndView add() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/navigationInsert");
        return modelAndView;
    }


    @RequestMapping("/admin/navigation/insert/getNavigationList")
    @ResponseBody
    public List<NavigationType> insertGetNavigationList() {
        return adminUserNavigationService.findAllNavigationTypeListByAlgorithmNavigation();
    }

    @RequestMapping("/admin/navigation/insert/save/navigationType")
    @ResponseBody
    public JSONObject insertNavigationType(@RequestParam(value = "navigationTypeName") String navigationTypeName,
                                           @RequestParam(value = "navigationTypeState") boolean navigationTypeState) {
        NavigationType navigationType = new NavigationType();
        navigationType.setNavigationName(navigationTypeName);
        navigationType.setActivate(navigationTypeState);
        navigationType.setNavigationAlgorithm(true);
        JSONObject back = new JSONObject();
        back.put("sign", adminUserNavigationService.insertNavigationType(navigationType));
        return back;
    }

    @RequestMapping("/admin/navigation/insert/save/navigationParent")
    @ResponseBody
    public JSONObject insertNavigationParent(@RequestParam(value = "navigationParentName") String navigationParentName,
                                             @RequestParam(value = "navigationIcon") String navigationIcon,
                                             @RequestParam(value = "navigationUrl") String navigationUrl,
                                             @RequestParam(value = "navigationTypeId") String navigationTypeId,
                                             @RequestParam(value = "navigationParentState") boolean navigationParentState) {
        NavigationParent navigationParent = new NavigationParent();
        navigationParent.setNavigationName(navigationParentName);
        navigationParent.setNavigationIcon(navigationIcon);
        navigationParent.setNavigationUrl(navigationUrl);
        navigationParent.setNavigationTypeId(navigationTypeId);
        navigationParent.setActivate(navigationParentState);
        JSONObject back = new JSONObject();
        back.put("sign", adminUserNavigationService.insertNavigationParent(navigationParent));
        return back;
    }

    @RequestMapping("/admin/navigation/insert/checkNavigationUrl")
    @ResponseBody
    public JSONObject insertCheckNavigationUrl(@RequestParam(value = "navigationId") String navigationId,
                                               @RequestParam(value = "navigationUrl") String navigationUrl) {
        JSONObject back = new JSONObject();
        back.put("sign", adminUserNavigationService.checkNavigationUrlExist(navigationId, navigationUrl));
        return back;
    }

    @RequestMapping("/admin/navigation/insert/checkNavigationTypeName")
    @ResponseBody
    public JSONObject insertCheckNavigationTypeName(@RequestParam(value = "navigationId") String navigationId,
                                                    @RequestParam(value = "navigationTypeName") String navigationTypeName) {
        JSONObject back = new JSONObject();
        back.put("sign", adminUserNavigationService.checkNavigationTypeNameExist(navigationId, navigationTypeName));
        return back;
    }

    @RequestMapping("/admin/navigation/insert/checkNavigationParentName")
    @ResponseBody
    public JSONObject insertCheckNavigationParentName(@RequestParam(value = "navigationId") String navigationId,
                                                      @RequestParam(value = "navigationParentName") String navigationParentName) {
        JSONObject back = new JSONObject();
        back.put("sign", adminUserNavigationService.checkNavigationParentNameExist(navigationId, navigationParentName));
        return back;
    }


    @RequestMapping("/admin/navigation/update")
    public ModelAndView update() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/navigationUpdate");
        return modelAndView;
    }

    @RequestMapping("/admin/navigation/update/save/navigationParent")
    @ResponseBody
    public JSONObject saveNavigationParent(@RequestParam(value = "navigationParent") String navigationParent) {
        JSONObject back = new JSONObject();
        back.put("sign", adminUserNavigationService.saveNavigationParent(JSON.parseObject(navigationParent, NavigationParent.class)));
        return back;
    }

    @RequestMapping("/admin/navigation/update/save/navigationType")
    @ResponseBody
    public JSONObject saveNavigationType(@RequestParam(value = "navigationType") String navigationType) {
        JSONObject back = new JSONObject();
        back.put("sign", adminUserNavigationService.saveNavigationType(JSON.parseObject(navigationType, NavigationType.class)));
        return back;
    }


    @RequestMapping("/admin/navigation/update/save/navigationParentOrder")
    @ResponseBody
    public JSONObject saveNavigationParentOrder(@RequestParam(value = "json") String json,
                                                @RequestParam(value = "navigationParentId") String navigationParentId) {
        JSONObject back = new JSONObject();
        back.put("sign", adminUserNavigationService.saveNavigationParentOrder(navigationParentId, JSON.parseObject(json)));
        return back;
    }

    @RequestMapping("/admin/navigation/update/save/navigationTypeOrder")
    @ResponseBody
    public JSONObject saveNavigationTypeOrder(@RequestParam(value = "json") String json) {
        JSONObject back = new JSONObject();
        back.put("sign", adminUserNavigationService.saveNavigationTypeOrder(JSON.parseObject(json)));
        return back;
    }

    @RequestMapping("/admin/navigation/update/getNavigationList")
    @ResponseBody
    public List<NavigationType> updateGetNavigationList() {
        return adminUserNavigationService.findAllNavigationTypeList();
    }

    @RequestMapping("/admin/navigation/update/checkNavigationUrl")
    @ResponseBody
    public JSONObject updateCheckNavigationUrl(@RequestParam(value = "navigationId") String navigationId,
                                               @RequestParam(value = "navigationUrl") String navigationUrl) {
        JSONObject back = new JSONObject();
        back.put("sign", adminUserNavigationService.checkNavigationUrlExist(navigationId, navigationUrl));
        return back;
    }

    @RequestMapping("/admin/navigation/update/checkNavigationTypeName")
    @ResponseBody
    public JSONObject updateCheckNavigationTypeName(@RequestParam(value = "navigationId") String navigationId,
                                                    @RequestParam(value = "navigationTypeName") String navigationTypeName) {
        JSONObject back = new JSONObject();
        back.put("sign", adminUserNavigationService.checkNavigationTypeNameExist(navigationId, navigationTypeName));
        return back;
    }

    @RequestMapping("/admin/navigation/update/checkNavigationParentName")
    @ResponseBody
    public JSONObject updateCheckNavigationParentName(@RequestParam(value = "navigationId") String navigationId,
                                                      @RequestParam(value = "navigationParentName") String navigationParentName) {
        JSONObject back = new JSONObject();
        back.put("sign", adminUserNavigationService.checkNavigationParentNameExist(navigationId, navigationParentName));
        return back;
    }


    @RequestMapping("/admin/navigation/delete")
    public ModelAndView delete() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/navigationDelete");
        return modelAndView;
    }


    @RequestMapping("/admin/navigation/delete/navigationType")
    @ResponseBody
    public JSONObject deleteNavigationType(@RequestParam(value = "navigationTypeId") String navigationTypeId) {
        JSONObject back = new JSONObject();
        back.put("sign", adminUserNavigationService.deleteNavigationTypeById(navigationTypeId));
        return back;
    }


    @RequestMapping("/admin/navigation/delete/navigationParent")
    @ResponseBody
    public JSONObject deleteNavigationParent(@RequestParam(value = "navigationParentId") String navigationParentId) {
        JSONObject back = new JSONObject();
        back.put("sign", adminUserNavigationService.deleteNavigationParentById(navigationParentId));
        return back;
    }


    @RequestMapping("/admin/navigation/delete/getNavigationList")
    @ResponseBody
    public List<NavigationType> deleteGetNavigationList() {
        return adminUserNavigationService.findAllNavigationTypeList();
    }

}
