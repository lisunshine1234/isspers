package com.guteam.java_service.service;

import com.alibaba.fastjson.JSONObject;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.util.List;

public interface FileService {
    boolean uploadFile(MultipartFile[] projectFile, String dir);


}
