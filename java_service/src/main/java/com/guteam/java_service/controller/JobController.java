package com.guteam.java_service.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.config.Redis.RedisUtil2;
import com.guteam.java_service.entity.Job;
import com.guteam.java_service.entity.NavigationParent;
import com.guteam.java_service.entity.Project;
import com.guteam.java_service.entity.User;
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

import java.lang.management.ManagementFactory;
import java.util.List;

@Controller
public class JobController {
    @Autowired
    private UserService userService;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private AlgorithmService algorithmService;
    @Autowired
    private InputService inputService;
    @Autowired
    private JobService jobService;
    @Autowired
    private NavigationService navigationService;
    @Autowired
    private RedisUtil redisUtil;
    @Value("${isspersPath}")
    private String isspersPath;
    @Value("${dataPath}")
    private String dataPath;
    @Autowired
    private RedisUtil2 redisUtil2;

    @RequestMapping(value = "/job")
    public ModelAndView algorithm() {
        NavigationParent navigationParent = navigationService.checkNavigationUrlIsExistAndIsActivate("job");
        ModelAndView modelAndView = new ModelAndView();

        modelAndView.addObject("navigationParent", navigationParent);
        modelAndView.addObject("navigationList", redisUtil.get("navigation"));
        modelAndView.addObject("systemInfo", redisUtil.get("systemInfo"));

        modelAndView.setViewName("main/job");
        return modelAndView;
    }


    @RequestMapping(value = "/job/getJobList")
    @ResponseBody
    public JSONObject getJobList(Authentication authentication) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        JSONObject jsonObject = new JSONObject();

        if (user == null) {
            jsonObject.put("sign", false);
            jsonObject.put("tip", "账号异常");
        }
        jsonObject.put("sign", true);
        jsonObject.put("jobList", jobService.findAllByUserId(user.getId()));
        return jsonObject;
    }

    @RequestMapping(value = "/job/do/run")
    @ResponseBody
    public String createJob(@RequestParam(value = "json") String json,
                            Authentication authentication) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        Project project = projectService.findByUserIdAndActivateAndNonLock(user.getId(), true, true);

        JSONObject jsonObject = JSON.parseObject(json);
        List<JSONObject> algorithmList = (List<JSONObject>) jsonObject.get("algorithmList");

        JSONObject object = new JSONObject();

        object.put("algorithmList", algorithmList);
        object.put("userId", user.getId());
        object.put("projectId", project.getId());
        String jobId = jobService.createJob(object);

        jobService.runAlgorithm(jobId);

        return jobId;
    }

    @RequestMapping(value = "/job/shutdown")
    @ResponseBody
    public JSONObject shutdown(@RequestParam(value = "json") String json,
                               Authentication authentication) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        JSONObject jsonObject = JSON.parseObject(json);
        String jobId = (String) jsonObject.get("jobId");
        if (redisUtil2.hget(jobId, "userId").equals(user.getId())) {
            return jobService.shutdownJobInitiative(jobId);
        }
        return jobService.shutdownJobInitiative(jobId);
    }


    @RequestMapping(value = "/job/checkRun")
    @ResponseBody
    public JSONObject checkRun(@RequestParam(value = "json") String json,
                               Authentication authentication) {
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        JSONObject jsonObject = JSON.parseObject(json);
        String jobId = (String) jsonObject.get("jobId");
        JSONObject j = new JSONObject();
        j.put("sign", jobService.checkRun(jobId, user.getId()));
        return j;
    }

    @RequestMapping(value = "/job/view/{jobId}")
    public ModelAndView view(@PathVariable("jobId") String jobId,
                             Authentication authentication) {
        ModelAndView view = new ModelAndView();
        NavigationParent navigationParent = navigationService.checkNavigationUrlIsExistAndIsActivate("job");
        view.addObject("navigationParent", navigationParent);
        view.addObject("navigationList", redisUtil.get("navigation"));
        view.addObject("systemInfo", redisUtil.get("systemInfo"));
        User user = userService.findUserByUserNameAndIsNonLock(authentication.getName(), true);
        Job job = jobService.findByIdAndUserId(jobId, user.getId());
        if (job == null) {
            view.setViewName("main/blank");
        }else{
            if(job.isNonLock()){
                view.setViewName("main/view_job");
            }else{
                view.addObject("message", "任务已经锁定");
                view.setViewName("main/blank");
            }
        }
        return view;
    }

    @RequestMapping(value = "/job/getRunJobInfo")
    @ResponseBody
    public String getJobInfo(@RequestParam(value = "json") String json) {
        JSONObject jsonObject = JSON.parseObject(json);
        String jobId = (String) jsonObject.get("jobId");
        return jobService.getRunJobInfo(jobId);
    }


    @RequestMapping(value = "/job/getFinishJobInfo")
    @ResponseBody
    public JSONObject viewJob(@RequestParam(value = "json") String json) {
        System.out.println(json);
        JSONObject jsonObject = JSON.parseObject(json);
        String jobId = (String) jsonObject.get("jobId");
        return jobService.getFinishJobInfo(jobId);
    }
}
