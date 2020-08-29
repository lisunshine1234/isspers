package com.guteam.java_service.config;

import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.SystemInfo;
import com.guteam.java_service.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.stereotype.Component;

@Component
public class LoadingConfig implements ApplicationRunner {
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private AlgorithmService algorithmService;
    @Autowired
    private DisplayService displayService;
    @Autowired
    private InputService inputService;
    @Autowired
    private NavigationService navigationService;

    @Autowired
    private OutputService outputService;
    @Autowired
    private SystemInfoService systemInfoService;
    @Value("${systemImage}")
    private String systemImage;
    @Value("${systemInfoRedisTime}")
    private Integer systemInfoRedisTime;
    @Value("${outputRedisTime}")
    private Integer outputRedisTime;
    @Value("${navigationRedisTime}")
    private Integer navigationRedisTime;
    @Value("${inputRedisTime}")
    private Integer inputRedisTime;
    @Value("${displayRedisTime}")
    private Integer displayRedisTime;
    @Value("${algorithmBaseRedisTime}")
    private Integer algorithmBaseRedisTime;

    @Override
    public void run(ApplicationArguments args) throws Exception {
        redisUtil.set("algorithmBase", algorithmService.findAllAlgorithmBase(), algorithmBaseRedisTime);

        redisUtil.set("algorithmCustom", algorithmService.findAllAlgorithmCustom(), algorithmBaseRedisTime);


//        redisUtil.set("displayModel", displayService.findAllDisplayModelByActivate(true), displayRedisTime);

//        redisUtil.set("displayType", displayService.findAllDisplayTypeByActivate(true), displayRedisTime);

//        redisUtil.set("inputModel", inputService.findAllInputModelByActivate(true), inputRedisTime);

//        redisUtil.set("inputType", inputService.findAllInputTypeByActivate(true), inputRedisTime);

        redisUtil.set("navigation", navigationService.getNavigationByIsActivate(true), navigationRedisTime);

//        redisUtil.set("outputModel", outputService.findAllOutputModelByActivate(true), outputRedisTime);
//
//        redisUtil.set("outputType", outputService.findAllOutputTypeByActivate(true), outputRedisTime);

        SystemInfo systemInfo = systemInfoService.getSystemInfo();
        systemInfo.setSystemLogo1("/" + systemImage + systemInfo.getSystemLogo1());
        systemInfo.setSystemLogo2("/" + systemImage + systemInfo.getSystemLogo2());
        systemInfo.setSystemLogo3("/" + systemImage + systemInfo.getSystemLogo3());
        systemInfo.setSystemLogo4("/" + systemImage + systemInfo.getSystemLogo4());
        systemInfo.setSystemLogo5("/" + systemImage + systemInfo.getSystemLogo5());

        redisUtil.set("systemInfo", systemInfo, systemInfoRedisTime);
    }
}
