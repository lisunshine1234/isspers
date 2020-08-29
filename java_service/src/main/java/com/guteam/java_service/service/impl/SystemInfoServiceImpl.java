package com.guteam.java_service.service.impl;

import com.guteam.java_service.entity.SystemIntroduce;
import com.guteam.java_service.entity.SystemInfo;
import com.guteam.java_service.entity.mongo.SystemIntroduceInfo;
import com.guteam.java_service.respository.mongodb.SystemIntroduceInfoRepository;
import com.guteam.java_service.respository.mysql.SystemIntroduceRepository;
import com.guteam.java_service.respository.mysql.SystemInfoRepository;
import com.guteam.java_service.service.SystemInfoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SystemInfoServiceImpl implements SystemInfoService {
    @Autowired
    private SystemInfoRepository systemInfoRepository;
    @Autowired
    private SystemIntroduceRepository systemIndexIntroduceRepository;
    @Autowired
    private SystemIntroduceInfoRepository systemIntroduceInfoRepository;

    @Override
    public SystemInfo getSystemInfo() {
        return systemInfoRepository.findAll().get(0);
    }

    @Override
    public List<SystemIntroduce> getSystemIntroduceByIsActivate(boolean isActivate) {
        List<SystemIntroduce> systemIndexIntroduceList = systemIndexIntroduceRepository.findAllByActivateOrderByOrderNumAsc(isActivate);
        List<SystemIntroduceInfo> systemIntroduceInfoList = systemIntroduceInfoRepository.findAll();


        for (SystemIntroduce systemIntroduce : systemIndexIntroduceList) {
            for (SystemIntroduceInfo systemIntroduceInfo : systemIntroduceInfoList) {
                if (systemIntroduce.getIntroduceInfoId().equals(systemIntroduceInfo.getId())) {
                    systemIntroduce.setIntroduceInfo(systemIntroduceInfo.getInfo());
                    break;
                }
            }
        }
        return systemIndexIntroduceList;
    }
}
