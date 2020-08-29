package com.guteam.java_service.controller.admin;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.adminService.AdminNavigationService;
import com.guteam.java_service.adminService.AdminPermissionService;
import com.guteam.java_service.adminService.AdminRolePermissionService;
import com.guteam.java_service.config.Redis.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
public class AdminRolePermissionController {

    @Autowired
    private AdminNavigationService adminNavigationService;
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private AdminRolePermissionService adminRolePermissionService;
    @Autowired
    private AdminPermissionService adminPermissionService;

    @RequestMapping("/admin/role-permission/role")
    public ModelAndView permissionRole() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/permissionRole");
        return modelAndView;
    }

    @RequestMapping("/admin/role-permission/role/getPermissionRoleType")
    @ResponseBody
    public JSONObject getPermissionRoleType() {
        JSONObject back = new JSONObject();
        back.put("userTypeParentList", adminRolePermissionService.getUserTypeParentList());
        return back;
    }


    @RequestMapping("/admin/role-permission/role/getPermissionRole")
    @ResponseBody
    public JSONObject getPermissionRole(@RequestParam(value = "userTypeParentId") String userTypeParentId) {
        JSONObject back = new JSONObject();
        back.put("userTypeList", adminRolePermissionService.getUserTypeListByParentId(userTypeParentId));
        return back;
    }

    @RequestMapping("/admin/role-permission/delete/userType")
    @ResponseBody
    public JSONObject deleteUserType(@RequestParam(value = "userTypeId") String userTypeId) {
        JSONObject back = new JSONObject();
        back.put("sign", adminRolePermissionService.deleteUserType(userTypeId));
        return back;
    }

    @RequestMapping("/admin/role-permission/update/getRolePermissionList")
    @ResponseBody
    public JSONObject updateGetPermissionList(@RequestParam(value = "userTypeId") String userTypeId) {
        JSONObject back = new JSONObject();
        back.put("permissionList", adminRolePermissionService.getPermissionList(userTypeId));
        return back;
    }

    @RequestMapping("/admin/role-permission/update/updateRolePermissionList")
    @ResponseBody
    public JSONObject updateRolePermissionList(@RequestParam(value = "json") String json) {
        JSONObject temp = JSON.parseObject(json);
        JSONObject back = new JSONObject();
        back.put("sign", adminRolePermissionService.updateUserTypePermission(temp.get("userTypeId").toString(), JSON.parseArray(temp.get("permissionList").toString(), String.class)));
        return back;
    }


    @RequestMapping("/admin/role-permission/delete/userTypeParent")
    @ResponseBody
    public JSONObject deleteUserTypeParent(@RequestParam(value = "userTypeParentId") String userTypeParentId) {
        System.out.println(userTypeParentId);
        JSONObject back = new JSONObject();
        back.put("sign", adminRolePermissionService.deleteUserTypeParent(userTypeParentId));
        return back;
    }

    @RequestMapping("/admin/role-permission/insert/checkUserTypeName")
    @ResponseBody
    public JSONObject checkUserTypeName(@RequestParam(value = "userTypeId") String userTypeId,
                                        @RequestParam(value = "userTypeName") String userTypeName) {
        JSONObject back = new JSONObject();
        back.put("sign", adminRolePermissionService.checkUserTypeNameExist(userTypeId, userTypeName));
        return back;
    }

    @RequestMapping("/admin/role-permission/insert/checkUserTypeParentName")
    @ResponseBody
    public JSONObject checkUserTypeParentName(@RequestParam(value = "userTypeParentId") String userTypeParentId,
                                              @RequestParam(value = "userTypeParentName") String userTypeParentName) {
        JSONObject back = new JSONObject();
        back.put("sign", adminRolePermissionService.checkUserTypeParentNameExist(userTypeParentId, userTypeParentName));
        return back;
    }

    @RequestMapping("/admin/role-permission/update/getUserTypeParentById")
    @ResponseBody
    public JSONObject getUserTypeById(@RequestParam(value = "userTypeParentId") String userTypeParentId) {
        JSONObject back = new JSONObject();
        back.put("userTypeParent", adminRolePermissionService.getUserTypeParentById(userTypeParentId));
        return back;
    }

    @RequestMapping("/admin/role-permission/update/getUserTypeById")
    @ResponseBody
    public JSONObject getUserTypeParentById(@RequestParam(value = "userTypeId") String userTypeId) {
        JSONObject back = new JSONObject();
        back.put("userTypeParentList", adminRolePermissionService.getUserTypeParentList());
        back.put("userType", adminRolePermissionService.getUserTypeById(userTypeId));
        return back;
    }

    @RequestMapping("/admin/role-permission/insert/userTypeParent")
    @ResponseBody
    public JSONObject insertUserTypeParent(@RequestParam(value = "userTypeParentName") String userTypeParentName,
                                           @RequestParam(value = "userTypeParentType") String userTypeParentType) {
        JSONObject back = new JSONObject();
        back.put("sign", adminRolePermissionService.insertUseTypeParent(userTypeParentName, userTypeParentType));
        return back;
    }

    @RequestMapping("/admin/role-permission/insert/userType")
    @ResponseBody
    public JSONObject insertUserType(@RequestParam(value = "userTypeName") String userTypeName,
                                     @RequestParam(value = "userTypeParentId") String userTypeParentId) {
        JSONObject back = new JSONObject();
        back.put("sign", adminRolePermissionService.insertUseType(userTypeName, userTypeParentId));
        return back;
    }


    @RequestMapping("/admin/role-permission/update/userTypeParent")
    @ResponseBody
    public JSONObject updateUserTypeParent(@RequestParam(value = "userTypeParentId") String userTypeParentId,
                                           @RequestParam(value = "userTypeParentName") String userTypeParentName,
                                           @RequestParam(value = "userTypeParentType") String userTypeParentType) {
        JSONObject back = new JSONObject();
        back.put("sign", adminRolePermissionService.updateUseTypeParent(userTypeParentId, userTypeParentName, userTypeParentType));
        return back;
    }


    @RequestMapping("/admin/role-permission/update/userType")
    @ResponseBody
    public JSONObject updateUserType(@RequestParam(value = "userTypeId") String userTypeId,
                                     @RequestParam(value = "userTypeName") String userTypeName,
                                     @RequestParam(value = "userTypeParentId") String userTypeParentId) {
        JSONObject back = new JSONObject();
        back.put("sign", adminRolePermissionService.updateUseType(userTypeId, userTypeName, userTypeParentId));
        return back;
    }


}
