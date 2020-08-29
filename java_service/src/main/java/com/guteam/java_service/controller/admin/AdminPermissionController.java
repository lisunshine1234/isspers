package com.guteam.java_service.controller.admin;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.adminService.AdminNavigationService;
import com.guteam.java_service.adminService.AdminPermissionService;
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
public class AdminPermissionController {

    @Autowired
    private AdminNavigationService adminNavigationService;
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private AdminPermissionService adminPermissionService;


    @RequestMapping("/admin/permission/view")
    public ModelAndView permissionView() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/permissionView");
        return modelAndView;
    }


    @RequestMapping("/admin/permission/view/getPermissionList")
    @ResponseBody
    public JSONObject viewGetPermissionList() {
        JSONObject back = new JSONObject();
        back.put("permissionList", adminPermissionService.getPermissionList());
        return back;
    }


    @RequestMapping("/admin/permission/update")
    public ModelAndView permissionUpdate() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/permissionUpdate");
        return modelAndView;
    }


    @RequestMapping("/admin/permission/update/getPermissionList")
    @ResponseBody
    public JSONObject updateGetPermissionList() {
        JSONObject back = new JSONObject();
        back.put("permissionList", adminPermissionService.getPermissionList());
        return back;
    }

    @RequestMapping("/admin/permission/update/getPermissionById")
    @ResponseBody
    public JSONObject updateGetPermissionById(@RequestParam(value = "permissionId") Integer permissionId) {
        JSONObject back = new JSONObject();
        back.put("permission", adminPermissionService.getPermissionById(permissionId));
        return back;
    }

    @RequestMapping("/admin/permission/update/save/permission")
    @ResponseBody
    public JSONObject updatePermission(@RequestParam(value = "permissionId") Integer permissionId,
                                       @RequestParam(value = "permissionName") String permissionName,
                                       @RequestParam(value = "permissionUrl") String permissionUrl,
                                       @RequestParam(value = "permissionState") boolean permissionState) {
        JSONObject back = new JSONObject();
        back.put("sign", adminPermissionService.savePermission(permissionId, permissionName, permissionUrl, permissionState));
        return back;
    }


    @RequestMapping("/admin/permission/update/checkPermissionName")
    @ResponseBody
    public JSONObject updateCheckPermissionParentName(@RequestParam(value = "permissionId") Integer permissionId,
                                                      @RequestParam(value = "permissionName") String permissionName) {
        JSONObject back = new JSONObject();
        back.put("sign", adminPermissionService.checkPermissionNameExist(permissionId, permissionName));
        return back;
    }

    @RequestMapping("/admin/permission/update/checkPermissionUrl")
    @ResponseBody
    public JSONObject updateCheckPermissionParentUrl(@RequestParam(value = "permissionId") Integer permissionId,
                                                     @RequestParam(value = "permissionUrl") String permissionUrl) {
        JSONObject back = new JSONObject();
        back.put("sign", adminPermissionService.checkPermissionUrlExist(permissionId, permissionUrl));
        return back;
    }


    @RequestMapping("/admin/permission/insert")
    public ModelAndView permissionInsert() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/permissionInsert");
        return modelAndView;
    }

    @RequestMapping("/admin/permission/insert/save/permission")
    @ResponseBody
    public JSONObject insertPermission(@RequestParam(value = "permissionName") String permissionName,
                                       @RequestParam(value = "permissionUrl") String permissionUrl,
                                       @RequestParam(value = "permissionState") boolean permissionState) {
        JSONObject back = new JSONObject();
        back.put("sign", adminPermissionService.savePermission(permissionName, permissionUrl, permissionState));
        return back;
    }

    @RequestMapping("/admin/permission/insert/checkPermissionName")
    @ResponseBody
    public JSONObject insertCheckPermissionParentName(@RequestParam(value = "permissionId") Integer permissionId,
                                                      @RequestParam(value = "permissionName") String permissionName) {
        JSONObject back = new JSONObject();
        back.put("sign", adminPermissionService.checkPermissionNameExist(permissionId, permissionName));
        return back;
    }

    @RequestMapping("/admin/permission/insert/checkPermissionUrl")
    @ResponseBody
    public JSONObject insertCheckPermissionParentUrl(@RequestParam(value = "permissionId") Integer permissionId,
                                                     @RequestParam(value = "permissionUrl") String permissionUrl) {
        JSONObject back = new JSONObject();
        back.put("sign", adminPermissionService.checkPermissionUrlExist(permissionId, permissionUrl));
        return back;
    }

    @RequestMapping("/admin/permission/delete")
    public ModelAndView permissionDelete() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/permissionDelete");
        return modelAndView;
    }

    @RequestMapping("/admin/permission/delete/getPermissionList")
    @ResponseBody
    public JSONObject deleteGetPermissionList() {
        JSONObject back = new JSONObject();
        back.put("permissionList", adminPermissionService.getPermissionList());
        return back;
    }

    @RequestMapping("/admin/permission/delete/permission")
    @ResponseBody
    public JSONObject deletePermission(@RequestParam(value = "permissionId") Integer permissionId) {
        JSONObject back = new JSONObject();
        back.put("sign", adminPermissionService.deletePermissionById(permissionId));
        return back;
    }


}
