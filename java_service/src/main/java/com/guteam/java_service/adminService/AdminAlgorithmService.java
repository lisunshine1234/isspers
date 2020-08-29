package com.guteam.java_service.adminService;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.*;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface AdminAlgorithmService {
    List<Algorithm> findAllAlgorithm();

    List<Algorithm> getBaseAlgorithmList();

    Algorithm findAlgorithmById(String algorithmId);

    List<Input> findInputListByAlgorithmId(String algorithmId);

    List<Output> findOutputListByAlgorithmId(String algorithmId);

    List<Display> findDisplayListByAlgorithmId(String algorithmId);

    @Transactional
    boolean deleteAlgorithmById(String algorithmId);

    @Transactional
    boolean saveAlgorithmNonLock(String algorithmId, boolean nonLock, String message);

    JSONObject findAlgorithmBaseInOutDisplayByAlgorithmId(String algorithmId);

    List<SetFile> findAlgorithmFileList(String dir);

    Algorithm saveAlgorithmBaseInfo(JSONObject baseInfo, User user, JSONObject algorithmInfo);

    Algorithm saveAlgorithmUploadFilePath(String path, Algorithm algorithm);

    Algorithm saveAlgorithmUploadFileSize(String path, Algorithm algorithm);

    JSONObject saveAlgorithmInAndOut(Algorithm algorithm, List<JSONObject> inputList, List<JSONObject> outputList);

    JSONObject saveAlgorithmDisplay(Algorithm algorithm, List<JSONObject> displayList);

    String delAlgorithmFileList(String[] fileNameList, String path);

    String delAlgorithmFile(String fileName, String path);

    List<JSONObject> findAlgorithmPythonMethod(String dir);


}
