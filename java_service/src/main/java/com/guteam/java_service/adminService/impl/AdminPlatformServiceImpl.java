package com.guteam.java_service.adminService.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.adminService.AdminPlatformService;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.NavigationParent;
import com.guteam.java_service.entity.SystemInfo;
import com.guteam.java_service.entity.SystemIntroduce;
import com.guteam.java_service.entity.mongo.SystemIntroduceInfo;
import com.guteam.java_service.respository.admin.AdminSystemInfoRepository;
import com.guteam.java_service.respository.admin.AdminSystemIntroduceRepository;
import com.guteam.java_service.respository.mongodb.AdminSystemIntroduceInfoRepository;
import com.guteam.java_service.util.FileHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class AdminPlatformServiceImpl implements AdminPlatformService {
    @Autowired
    private AdminSystemIntroduceRepository adminSystemIntroduceRepository;
    @Autowired
    private AdminSystemIntroduceInfoRepository adminSystemIntroduceInfoRepository;
    @Autowired
    private AdminSystemInfoRepository adminSystemInfoRepository;
    @Autowired
    private FileHelper fileHelper;

    @Autowired
    private RedisUtil redisUtil;
    @Value("${systemImage}")
    private String systemImage;
    @Value("${isspersPath}")
    private String isspersPath;

    @Value("${server.servlet.context-path}")
    private String contextPath;
    @Override
    public JSONObject getPlatformList() {
        List<SystemIntroduceInfo> systemIntroduceInfoList = adminSystemIntroduceInfoRepository.findAll();
        List<SystemIntroduce> systemIntroduceList = adminSystemIntroduceRepository.findAllOrderByOrderNumAsc();
        for (SystemIntroduce systemIntroduce : systemIntroduceList) {
            for (SystemIntroduceInfo systemIntroduceInfo : systemIntroduceInfoList) {
                if (systemIntroduceInfo.getId().equals(systemIntroduce.getIntroduceInfoId())) {
                    systemIntroduce.setIntroduceInfo(systemIntroduceInfo.getInfo());
                }
            }
        }
        JSONObject back = new JSONObject();
        back.put("systemIntroduceList", systemIntroduceList);
        return back;
    }

    @Override
    public boolean updateSystemIntroduceById(SystemIntroduce systemIntroduce) {
        Date date = new Date();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        systemIntroduce.setUpdateTime(simpleDateFormat.format(date));
        SystemIntroduceInfo systemIntroduceInfo = new SystemIntroduceInfo();
        systemIntroduceInfo.setId(systemIntroduce.getIntroduceInfoId());
        systemIntroduceInfo.setInfo(systemIntroduce.getIntroduceInfo());
        adminSystemIntroduceInfoRepository.save(systemIntroduceInfo);
        adminSystemIntroduceRepository.save(systemIntroduce);
        return true;
    }

    @Override
    public boolean updateSystemIntroduceOrder(JSONObject jsonObject) {
        List<SystemIntroduce> systemIntroduceList = adminSystemIntroduceRepository.findAll();
        for (SystemIntroduce systemIntroduce : systemIntroduceList) {
            if (jsonObject.containsKey(systemIntroduce.getId())) {
                systemIntroduce.setOrderNum(Integer.parseInt(jsonObject.get(systemIntroduce.getId()).toString()));
            } else {
                return false;
            }
        }
        adminSystemIntroduceRepository.saveAll(systemIntroduceList);
        return true;
    }

    @Override
    public boolean deleteSystemIntroduceId(String systemIntroduceId) {
        SystemIntroduce systemIntroduce = adminSystemIntroduceRepository.findById(systemIntroduceId).orElse(null);
        if (systemIntroduce == null) {
            return false;
        }
        adminSystemIntroduceInfoRepository.deleteById(systemIntroduce.getIntroduceInfoId());
        adminSystemIntroduceRepository.delete(systemIntroduce);
        return true;
    }

    @Override
    public boolean insertSystemIntroduce(JSONObject json) {

        SystemIntroduceInfo systemIntroduceInfo = new SystemIntroduceInfo();
        systemIntroduceInfo.setInfo(json.get("introduceInfo").toString());
        systemIntroduceInfo = adminSystemIntroduceInfoRepository.save(systemIntroduceInfo);


        Date date = new Date();
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");

        SystemIntroduce systemIntroduce = new SystemIntroduce();
        systemIntroduce.setActivate((Boolean) json.get("systemIntroduceState"));
        systemIntroduce.setIntroduceName(json.get("systemIntroduceName").toString());
        systemIntroduce.setIntroduceInfoId(systemIntroduceInfo.getId());
        systemIntroduce.setCreateTime(simpleDateFormat.format(date));
        systemIntroduce.setUpdateTime(simpleDateFormat.format(date));
        systemIntroduce.setOrderNum(adminSystemIntroduceRepository.findAll().size());
        adminSystemIntroduceRepository.save(systemIntroduce);
        return true;
    }

    @Override
    public SystemInfo findSystemInfo() {
        SystemInfo systemInfo = adminSystemInfoRepository.findAll().get(0);
        systemInfo.setSystemLogo1Url(contextPath+"/"+systemImage+systemInfo.getSystemLogo1());
        systemInfo.setSystemLogo2Url(contextPath+"/"+systemImage+systemInfo.getSystemLogo2());
        systemInfo.setSystemLogo3Url(contextPath+"/"+systemImage+systemInfo.getSystemLogo3());
        systemInfo.setSystemLogo4Url(contextPath+"/"+systemImage+systemInfo.getSystemLogo4());
        systemInfo.setSystemLogo5Url(contextPath+"/"+systemImage+systemInfo.getSystemLogo5());

        return adminSystemInfoRepository.findAll().get(0);
    }

    @Override
    public boolean saveSystemInfo(SystemInfo systemInfo) {
        adminSystemInfoRepository.save(systemInfo);

        redisUtil.del("systemInfo");
        return true;
    }

    @Override
    public JSONObject uploadSystemLogo(MultipartFile[] file) {
        JSONObject jsonObject = fileHelper.uploadFile(file[0], isspersPath + systemImage, true);
        if((boolean)jsonObject.get("sign")){
            jsonObject.put("fileUrl",contextPath+"/"+systemImage+jsonObject.get("fileName"));
        }
        return jsonObject;

    }

}
