package com.guteam.java_service.service;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Algorithm;
import com.guteam.java_service.entity.NavigationType;
import com.guteam.java_service.entity.SetFile;
import com.guteam.java_service.entity.User;
import org.springframework.transaction.annotation.Transactional;

import java.io.File;
import java.util.List;

public interface AlgorithmMyService {
    List<NavigationType> findNavigationListByNavigationAlgorithm();

    List<Algorithm> findAlgorithmListByUserId(String userId);

    JSONObject findAlgorithmTypeCount(List<Algorithm> algorithmList, List<NavigationType> navigationTypeList);

    List<SetFile> findAlgorithmFileList(String dir);

    List<JSONObject> findAlgorithmPythonMethod(String dir);

    String delAlgorithmFile(String fileName, String path);

    String delAlgorithmFileList(String[] fileNameList, String path);

    JSONObject findAlgorithmBaseInOutDisplayByAlgorithmId(String algorithmId,String userId);

    @Transactional
    Algorithm saveAlgorithmBaseInfo(JSONObject baseInfo, User user, JSONObject algorithmInfo);

    @Transactional
    Algorithm saveAlgorithmUploadFilePath(String path, Algorithm algorithm);

    @Transactional
    Algorithm saveAlgorithmUploadFileSize(String path, Algorithm algorithm);

    @Transactional
    JSONObject saveAlgorithmInAndOut(Algorithm algorithm, List<JSONObject> inputList, List<JSONObject> outputList);


    @Transactional
    JSONObject saveAlgorithmDisplay(Algorithm algorithm, List<JSONObject> displayList);
}
