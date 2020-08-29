package com.guteam.java_service.controller.admin;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.adminService.AdminNavigationService;
import com.guteam.java_service.adminService.AdminUserService;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.User;
import com.guteam.java_service.entity.UserType;
import com.guteam.java_service.entity.admin.AdminNavigationParent;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;

import javax.xml.crypto.Data;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.logging.SimpleFormatter;

@Controller
public class AdminUserController {
    @Autowired
    private AdminUserService adminUserService;
    @Autowired
    private AdminNavigationService adminNavigationService;
    @Autowired
    private RedisUtil redisUtil;

    @RequestMapping("/admin/user/view")
    public ModelAndView login() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/userView");
        return modelAndView;
    }

    @RequestMapping("/admin/user/insert")
    public ModelAndView insert() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.addObject("userTypeList", adminUserService.selectAllUserType());
        modelAndView.setViewName("admin/main/userInsert");
        return modelAndView;
    }

    @RequestMapping("/admin/user/delete")
    public ModelAndView delete() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/userDelete");
        return modelAndView;
    }


    @RequestMapping("/admin/user/update")
    public ModelAndView update() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/userUpdate");
        return modelAndView;
    }

    @RequestMapping("/admin/user/audit")
    public ModelAndView audit() {
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("navigationList", adminNavigationService.getAdminNavigationByIsActivate(true));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));
        modelAndView.setViewName("admin/main/userAudit");
        return modelAndView;
    }

    @RequestMapping("/admin/user/audit/nonLock")
    @ResponseBody
    public JSONObject auditNonLock(@RequestParam(value = "userId") String userId, @RequestParam(value = "nonLock") boolean nonLock) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sign", adminUserService.updateUserNonLockById(nonLock, userId));
        return jsonObject;
    }

    @RequestMapping("/admin/user/getUserList")
    @ResponseBody
    public List<User> getUserList() {
        return adminUserService.selectAll();
    }

    @RequestMapping("/admin/user/checkUserName")
    @ResponseBody
    public JSONObject checkUserName(@RequestParam(value = "username") String username) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sign", adminUserService.checkUserName(username));
        return jsonObject;
    }

    @RequestMapping("/admin/user/checkPhone")
    @ResponseBody
    public JSONObject checkPhone(@RequestParam(value = "phone") String phone) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sign", adminUserService.checkPhone(phone));
        return jsonObject;
    }


    @RequestMapping("/admin/user/checkEmail")
    @ResponseBody
    public JSONObject checkEmail(@RequestParam(value = "email") String email) {
        System.out.println(email);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sign", adminUserService.checkEmail(email));
        return jsonObject;
    }


    @RequestMapping("/admin/user/addUser")
    @ResponseBody
    public JSONObject addUser(@RequestParam(value = "username") String username,
                              @RequestParam(value = "password") String password,
                              @RequestParam(value = "phone", defaultValue = "") String phone,
                              @RequestParam(value = "email", defaultValue = "") String email,
                              @RequestParam(value = "role") String role) {
        User user = new User();
        user.setUserName(username);
        user.setEmail(email);
        user.setPhone(phone);
        user.setPassword(password);
        user.setUserTypeId(role);
        user.setNonLock(true);
        Date date = new Date();
        SimpleDateFormat format = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        String time = format.format(date);
        user.setCreateTime(time);
        user.setUpdateTime(time);
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sign", adminUserService.insertUser(user));
        return jsonObject;
    }


    @RequestMapping("/admin/user/getUserById")
    @ResponseBody
    public User getUserById(@RequestParam(value = "userId") String userId) {
        return adminUserService.selectUserById(userId);
    }

    @RequestMapping("/admin/user/reset/username")
    @ResponseBody
    public JSONObject resetUsername(@RequestParam(value = "userId") String userId) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sign", adminUserService.resetUserUsernameById(userId));
        return jsonObject;
    }

    @RequestMapping("/admin/user/delete/userById")
    @ResponseBody
    public JSONObject deleteUserById(@RequestParam(value = "userId") String userId) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sign", adminUserService.deleteUserById(userId));
        return jsonObject;
    }

    @RequestMapping("/admin/user/reset/password")
    @ResponseBody
    public JSONObject resetPassword(@RequestParam(value = "userId") String userId) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sign", adminUserService.resetUserPasswordById(userId));
        return jsonObject;
    }

    @RequestMapping("/admin/user/reset/phone")
    @ResponseBody
    public JSONObject resetPhone(@RequestParam(value = "userId") String userId) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sign", adminUserService.resetUserPhoneById(userId));
        return jsonObject;
    }

    @RequestMapping("/admin/user/reset/email")
    @ResponseBody
    public JSONObject resetEmail(@RequestParam(value = "userId") String userId) {
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("sign", adminUserService.resetUserEmailById(userId));
        return jsonObject;
    }

}
