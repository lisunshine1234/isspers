package com.guteam.java_service.adminService.impl;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.adminService.AdminJobService;
import com.guteam.java_service.adminService.AdminProjectService;
import com.guteam.java_service.config.Redis.RedisUtil2;
import com.guteam.java_service.entity.*;
import com.guteam.java_service.respository.admin.*;
import com.guteam.java_service.util.FileHelper;
import com.guteam.java_service.util.ThreadHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class AdminJobServiceImpl implements AdminJobService {
    @Autowired
    private AdminJobRepository adminJobRepository;
    @Autowired
    private AdminUserNavigationParentRepository adminUserNavigationParentRepository;
    @Autowired
    private AdminUserRepository adminUserRepository;
    @Autowired
    private RedisUtil2 redisUtil2;
    @Autowired
    private ThreadHelper threadHelper;
    @Autowired
    private FileHelper fileHelper;
    @Value("${dataPath}")
    private String dataPath;
    @Value("${isspersPath}")
    private String isspersPath;

    @Override
    public List<Job> findAllJob() {
        List<NavigationParent> navigationList = adminUserNavigationParentRepository.findAllByActivateOrderByOrderNumAsc(true);
        List<Job> jobList = adminJobRepository.findAllOrderByCreateTimeDesc();
        Set<String> userIdSet = new HashSet<>();
        for (Job job : jobList) {
            userIdSet.add(job.getUserId());
        }
        List<User> userList = adminUserRepository.findAllByIdIn(userIdSet);
        for (Job job : jobList) {
            for (NavigationParent navigationParent : navigationList) {
                if (job.getNavigationId().equals(navigationParent.getId())) {
                    job.setNavigationName(navigationParent.getNavigationName());
                    break;
                }
            }
            for (User user : userList) {
                if (job.getUserId().equals(user.getId())) {
                    job.setUserName(user.getUserName());
                    break;
                }
            }
        }
        return jobList;
    }

    @Override
    public boolean saveJobNonLock(String jobId, boolean nonLock, String message) {
        Job job = adminJobRepository.findById(jobId).orElse(null);

        if (job == null) {
            return false;
        }
        if (!nonLock && !job.isFinish()) {
            shutdownJobPassivity(jobId);
        }
        job.setNonLock(nonLock);
        job.setLockMessage(message);
        adminJobRepository.save(job);
        return true;
    }


    public JSONObject shutdownJobPassivity(String jobId) {
        int i = 0;
        while (!redisUtil2.hasKey(jobId)) {
            if (i > 3000) {
                break;
            }
            i += 10;
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        i = 0;
        while (!redisUtil2.hhaskey(jobId, "algorithm_pid")) {
            if (i > 3000) {
                break;
            }
            i += 10;
            try {
                Thread.sleep(10);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
        }
        JSONObject back = new JSONObject();
        String pid = redisUtil2.hget(jobId, "algorithm_pid").toString();
        if ((Integer) redisUtil2.hget(jobId, "finish") == 0) {
            redisUtil2.hset(jobId, "stop", 1);
            back = threadHelper.killProcessByPid(pid);
        }

        return back;
    }

}
