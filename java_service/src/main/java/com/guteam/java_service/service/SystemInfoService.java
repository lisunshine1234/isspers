package com.guteam.java_service.service;

import com.guteam.java_service.entity.SystemIntroduce;
import com.guteam.java_service.entity.SystemInfo;

import java.util.List;

public interface SystemInfoService {
    SystemInfo getSystemInfo();

    List<SystemIntroduce> getSystemIntroduceByIsActivate(boolean isActivate);
}
