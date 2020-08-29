package com.guteam.java_service.adminService;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.SystemInfo;
import com.guteam.java_service.entity.SystemIntroduce;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AdminPlatformService {
    JSONObject getPlatformList();

    @Transactional
    boolean updateSystemIntroduceById(SystemIntroduce systemIntroduce);

    @Transactional
    boolean updateSystemIntroduceOrder(JSONObject jsonObject);

    @Transactional
    boolean deleteSystemIntroduceId(String systemIntroduceId);

    @Transactional
    boolean insertSystemIntroduce(JSONObject json);

    SystemInfo findSystemInfo();

    @Transactional
    boolean saveSystemInfo(SystemInfo systemInfo);

    @Transactional
    JSONObject uploadSystemLogo(MultipartFile[] file);

}
