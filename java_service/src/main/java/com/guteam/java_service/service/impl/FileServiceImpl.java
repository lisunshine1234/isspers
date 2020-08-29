package com.guteam.java_service.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.service.FileService;
import com.guteam.java_service.util.FileHelper;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;

@Service
public class FileServiceImpl implements FileService {
    @Autowired
    private FileHelper fileHelper;
    @Autowired
    private RestTemplate restTemplate;

    @Override
    public boolean uploadFile(MultipartFile[] projectFile, String dir) {
        fileHelper.createDir(dir);
        if (projectFile.length != 0) {
            return fileHelper.uploadFile(projectFile, dir);
        }
        return true;
    }

}
