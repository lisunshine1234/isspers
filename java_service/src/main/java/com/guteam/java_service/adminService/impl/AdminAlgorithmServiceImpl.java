package com.guteam.java_service.adminService.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.adminService.AdminAlgorithmService;
import com.guteam.java_service.entity.*;
import com.guteam.java_service.entity.admin.AdminNavigationParent;
import com.guteam.java_service.entity.mongo.AlgorithmDescribe;
import com.guteam.java_service.respository.admin.*;
import com.guteam.java_service.respository.mysql.InputRepository;
import com.guteam.java_service.respository.mysql.InputTypeRepository;
import com.guteam.java_service.util.FileHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AdminAlgorithmServiceImpl implements AdminAlgorithmService {
    @Autowired
    private AdminAlgorithmRepository adminAlgorithmRepository;
    @Autowired
    private AdminUserNavigationParentRepository adminUserNavigationParentRepository;
    @Autowired
    private AdminAlgorithmEngineRepository adminAlgorithmEngineRepository;
    @Autowired
    private AdminAlgorithmEnvironmentRepository adminAlgorithmEnvironmentRepository;
    @Autowired
    private AdminUserRepository adminUserRepository;
    @Autowired
    private AdminInputRepository adminInputRepository;
    @Autowired
    private AdminInputTypeRepository adminInputTypeRepository;
    @Autowired
    private AdminOutputRepository adminOutputRepository;
    @Autowired
    private AdminOutputTypeRepository adminOutputTypeRepository;
    @Autowired
    private AdminDisplayRepository adminDisplayRepository;
    @Autowired
    private AdminDisplayTypeRepository adminDisplayTypeRepository;
    @Autowired
    private AdminAlgorithmDescribeRepository adminAlgorithmDescribeRepository;
    @Autowired
    private AdminOutputTypeDisplayTypeRepository adminOutputTypeDisplayTypeRepository;
    @Autowired
    private AdminOutputDisplayRepository adminOutputDisplayRepository;
    @Autowired
    private FileHelper fileHelper;
    @Value("${isspersPath}")
    private String isspersPath;
    @Value("${algorithmPath}")
    private String algorithmPath;

    @Override
    public List<Algorithm> findAllAlgorithm() {
        return AlgorithmHelp(adminAlgorithmRepository.findAll());
    }

    @Override
    public List<Algorithm> getBaseAlgorithmList() {
        return AlgorithmHelp(adminAlgorithmRepository.findAllByAlgorithmType("base"));
    }

    @Override
    public Algorithm findAlgorithmById(String algorithmId) {
        Algorithm algorithm = adminAlgorithmRepository.findById(algorithmId).orElse(null);
        if (algorithm != null) {
            List<Algorithm> algorithmList = new ArrayList<>();
            algorithmList.add(algorithm);
            algorithm = AlgorithmHelp(algorithmList).get(0);
            algorithm.setInputList(findInputListByAlgorithmId(algorithmId));
            algorithm.setOutputList(findOutputListByAlgorithmId(algorithmId));
            algorithm.setDisplayList(findDisplayListByAlgorithmId(algorithmId));
        }
        return algorithm;
    }

    @Override
    public List<Input> findInputListByAlgorithmId(String algorithmId) {
        List<Input> inputList = adminInputRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithmId);

        Set<String> inputTypeIdSet = new HashSet<>();
        for (Input input : inputList) {
            inputTypeIdSet.add(input.getInputTypeId());
        }
        List<InputType> inputTypeList = adminInputTypeRepository.findAllByIdInOrderByOrderNumAsc(inputTypeIdSet);

        for (Input input : inputList) {
            for (InputType inputType : inputTypeList) {
                if (inputType.getId().equals(input.getInputTypeId())) {
                    if (input.getInputJson() != null && input.getInputJson().length() > 0) {
                        JSONObject jsonObject = new JSONObject(true);
                        jsonObject.putAll(JSON.parseObject(input.getInputJson()));
                        input.setInputJson(jsonObject.toJSONString());
                    }
                    input.setInputType(inputType);
                    break;
                }
            }
        }
        return inputList;
    }

    @Override
    public List<Output> findOutputListByAlgorithmId(String algorithmId) {
        List<Output> outputList = adminOutputRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithmId);
        Set<String> outputTypeIdSet = new HashSet<>();
        for (Output output : outputList) {
            outputTypeIdSet.add(output.getOutputTypeId());
        }
        List<OutputType> outputTypeList = adminOutputTypeRepository.findAllByIdInOrderByOrderNumAsc(outputTypeIdSet);

        for (Output output : outputList) {
            for (OutputType outputType : outputTypeList) {
                if (outputType.getId().equals(output.getOutputTypeId())) {
                    output.setOutputType(outputType);
                    break;
                }
            }
        }
        return outputList;
    }

    @Override
    public List<Display> findDisplayListByAlgorithmId(String algorithmId) {
        List<DisplayType> displayTypeList = adminDisplayTypeRepository.findAllByActivateOrderByOrderNumAsc(true);
        List<Output> outputList = adminOutputRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithmId);

        JSONObject jsonObject = new JSONObject();
        for (Output output : outputList) {
            jsonObject.put(output.getId(), output.getOutputKey());
        }

        List<Display> displayList = adminDisplayRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithmId);
        List<Display> displayListBack = new ArrayList<>();
        for (Display display : displayList) {
            for (DisplayType displayType : displayTypeList)
                if (displayType.getId().equals(display.getDisplayTypeId())) {
                    display.setDisplayType(displayType);
                    display.setOutputKey((String) jsonObject.get(display.getOutputId()));
                    displayListBack.add(display);
                }
        }
        return displayListBack;
    }

    @Override
    public boolean deleteAlgorithmById(String algorithmId) {
        Algorithm algorithm = adminAlgorithmRepository.findById(algorithmId).orElse(null);
        if (algorithm == null) {
            return false;
        }
        adminDisplayRepository.deleteAllByAlgorithmId(algorithmId);
        adminOutputRepository.deleteAllByAlgorithmId(algorithmId);
        adminInputRepository.deleteAllByAlgorithmId(algorithmId);

        if (algorithm.getAlgorithmPath() != null) {
            boolean sign = fileHelper.deleteDir(isspersPath + algorithmPath + algorithm.getAlgorithmPath());
            if (!sign) {
                return false;
            }
        }

        if (algorithm.getAlgorithmDescribeId() != null) {
            adminAlgorithmDescribeRepository.deleteById(algorithm.getAlgorithmDescribeId());
        }

        adminAlgorithmRepository.delete(algorithm);

        return true;
    }

    @Override
    public boolean saveAlgorithmNonLock(String algorithmId, boolean nonLock, String message) {
        Algorithm algorithm = adminAlgorithmRepository.findById(algorithmId).orElse(null);
        if (algorithm == null) {
            return false;
        }
        algorithm.setNonLock(nonLock);
        algorithm.setLockMessage(message);
        adminAlgorithmRepository.save(algorithm);
        return true;
    }


    private List<Algorithm> AlgorithmHelp(List<Algorithm> algorithmList) {
        Set<String> userSet = new HashSet<>();
        Set<String> navigationSet = new HashSet<>();
        Set<String> engineSet = new HashSet<>();
        Set<String> environmentSet = new HashSet<>();
        List<String> describeList = new ArrayList<>();
        for (Algorithm algorithm : algorithmList) {
            userSet.add(algorithm.getUserId());
            navigationSet.add(algorithm.getNavigationParentId());
            String engine = algorithm.getAlgorithmEngineId();
            engineSet.add(engine);
            environmentSet.add(algorithm.getAlgorithmEnvironmentId());
            describeList.add(algorithm.getAlgorithmDescribeId());
        }
        List<AlgorithmDescribe> algorithmDescribeList = adminAlgorithmDescribeRepository.findAllByIdIn(describeList);
        List<User> userList = adminUserRepository.findAllByIdIn(userSet);
        List<NavigationParent> navigationList = adminUserNavigationParentRepository.findAllByIdIn(navigationSet);
        List<AlgorithmEngine> engineList = adminAlgorithmEngineRepository.findAllByIdIn(engineSet);
        List<AlgorithmEnvironment> algorithmEnvironmentList = adminAlgorithmEnvironmentRepository.findAllByIdIn(environmentSet);
        JSONObject engineJSON = new JSONObject();

        for (AlgorithmEngine algorithmEngine : engineList) {
            engineJSON.put(algorithmEngine.getId(), algorithmEngine.getEngineName());
        }
        for (Algorithm algorithm : algorithmList) {
            if (algorithm.getAlgorithmType().equals("base")) {
                algorithm.setUserName("官方");
            } else {
                for (User user : userList) {
                    if (user.getId().equals(algorithm.getUserId())) {
                        algorithm.setUserName(user.getUserName());
                    }
                }
            }

            algorithm.setAlgorithmEngine((String) engineJSON.get(algorithm.getAlgorithmEngineId()));

            for (AlgorithmDescribe algorithmDescribe : algorithmDescribeList) {
                if (algorithm.getAlgorithmDescribeId().equals(algorithmDescribe.getId())) {
                    algorithm.setAlgorithmDescribe(algorithmDescribe.getDescribe());
                    algorithmDescribeList.remove(algorithmDescribe);
                    break;
                }
            }

            for (AlgorithmEnvironment algorithmEnvironment : algorithmEnvironmentList) {
                if (algorithmEnvironment.getId().equals(algorithm.getAlgorithmEnvironmentId())) {
                    algorithm.setAlgorithmEnvironment(algorithmEnvironment.getAlgorithmEnvironmentName());
                }
            }
            for (NavigationParent navigationParent : navigationList) {
                if (navigationParent.getId().equals(algorithm.getNavigationParentId())) {
                    algorithm.setNavigationParent(navigationParent);
                }
            }
        }
        return algorithmList;
    }


    @Override
    public JSONObject findAlgorithmBaseInOutDisplayByAlgorithmId(String algorithmId) {
        JSONObject jsonObject = new JSONObject();
        Algorithm algorithm = adminAlgorithmRepository.findById(algorithmId).orElse(null);
        if (algorithm != null) {
            jsonObject.put("baseInfo", algorithm);
            jsonObject.put("inputList", null);
            jsonObject.put("outputList", null);
            jsonObject.put("displayList", null);
            algorithm.setAlgorithmDescribe(adminAlgorithmDescribeRepository.findAllById(algorithm.getAlgorithmDescribeId()).getDescribe());

            if (algorithm.getAlgorithmPath() != null) {
                jsonObject.put("path", algorithm.getAlgorithmPath());
                List<Input> inputList = adminInputRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithm.getId());
                List<Output> outputList = adminOutputRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithm.getId());
                if (inputList.size() > 0 || outputList.size() > 0) {
                    jsonObject.put("inputList", inputList);
                    jsonObject.put("outputList", outputList);

                    if (outputList.size() > 0) {
                        JSONObject outputIdToKey = new JSONObject();
                        JSONObject outputIdToType = new JSONObject();
                        for (Output output : outputList) {
                            outputIdToKey.put(output.getId(), output.getOutputKey());
                            outputIdToType.put(output.getId(), output.getOutputTypeId());
                        }

                        List<Display> displayList = adminDisplayRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithm.getId());
                        for (Display display : displayList) {
                            StringBuilder stringBuilder = new StringBuilder();
                            for (String outputId : display.getOutputId().split(",")) {
                                stringBuilder.append((String) outputIdToKey.get(outputId)).append(",");
                            }
                            display.setOutputKey(stringBuilder.toString().substring(0, stringBuilder.toString().length() - 1));
                            display.setOutputTypeId((String) outputIdToType.get(display.getOutputId().split(",")[0]));
                        }
                        jsonObject.put("displayList", displayList);
                    }
                }
            }
        }
        return jsonObject;

    }

    @Override
    public List<SetFile> findAlgorithmFileList(String dir) {
        return fileHelper.getOnlyFileList(dir);
    }

    @Override
    public Algorithm saveAlgorithmBaseInfo(JSONObject baseInfo, User user, JSONObject algorithmInfo) {
        Algorithm algorithm = new Algorithm();
        if (algorithmInfo != null) {
            algorithm.setId((String) algorithmInfo.get("id"));
            algorithm.setAlgorithmDescribeId((String) algorithmInfo.get("algorithmDescribeId"));
            algorithm.setCartCount((Integer) algorithmInfo.get("cartCount"));
            algorithm.setUseCount((Integer) algorithmInfo.get("useCount"));
            algorithm.setVisitCount((Integer) algorithmInfo.get("visitCount"));

            AlgorithmDescribe algorithmDescribe = new AlgorithmDescribe();
            algorithmDescribe.setDescribe((String) baseInfo.get("describe"));
            algorithmDescribe.setId(algorithm.getAlgorithmDescribeId());
            adminAlgorithmDescribeRepository.save(algorithmDescribe);

        } else {
            AlgorithmDescribe algorithmDescribe = new AlgorithmDescribe();
            algorithmDescribe.setDescribe((String) baseInfo.get("describe"));
            algorithmDescribe = adminAlgorithmDescribeRepository.save(algorithmDescribe);
            algorithm.setAlgorithmDescribeId(algorithmDescribe.getId());
            algorithm.setCartCount(0);
            algorithm.setUseCount(0);
            algorithm.setVisitCount(0);
        }
        algorithm.setUserId(user.getId());
        algorithm.setAlgorithmEngineId((String) baseInfo.get("engine"));
        algorithm.setNavigationParentId((String) baseInfo.get("parent"));
        algorithm.setAlgorithmEnvironmentId((String) baseInfo.get("environment"));
        algorithm.setAlgorithmName((String) baseInfo.get("name"));
        algorithm.setActivate((Boolean) baseInfo.get("activate"));
        algorithm.setShare((Boolean) baseInfo.get("share"));
        algorithm.setDownload((Boolean) baseInfo.get("download"));
        algorithm.setPass(false);
        algorithm.setHasFinish(false);
        algorithm.setNonLock(true);
        Date date = new Date();
        SimpleDateFormat ft = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        algorithm.setUploadTime(ft.format(date));
        algorithm.setAlgorithmType("base");
        return adminAlgorithmRepository.save(algorithm);
    }

    @Override
    public Algorithm saveAlgorithmUploadFilePath(String path, Algorithm algorithm) {
        algorithm.setAlgorithmPath(path);
        return adminAlgorithmRepository.save(algorithm);
    }

    @Override
    public Algorithm saveAlgorithmUploadFileSize(String path, Algorithm algorithm) {
        algorithm.setAlgorithmSize(fileHelper.getFileSize(fileHelper.getDirOrFileSize(new File(path))));
        return adminAlgorithmRepository.save(algorithm);
    }

    @Override
    public JSONObject saveAlgorithmInAndOut(Algorithm algorithm, List<JSONObject> inputList, List<JSONObject> outputList) {
        int orderNum = 0;
        List<Input> inputs = new ArrayList<>();
        for (JSONObject input_temp : inputList) {
            Input input = new Input();
            input.setAlgorithmId(algorithm.getId());
            input.setInputKey((String) input_temp.get("key"));
            input.setInputName((String) input_temp.get("name"));
            input.setInputTypeId((String) input_temp.get("type"));
            input.setInputDescribe((String) input_temp.get("describe"));
            input.setRequired((Boolean) input_temp.get("required"));
            input.setOrderNum(orderNum++);
            if (input_temp.containsKey("typeJson")) {
                input.setInputJson((String) input_temp.get("typeJson"));
            }
            inputs.add(input);
        }

        orderNum = 0;
        List<Output> outputs = new ArrayList<>();
        for (JSONObject output_temp : outputList) {
            Output output = new Output();
            output.setAlgorithmId(algorithm.getId());
            output.setOutputKey((String) output_temp.get("key"));
            output.setOutputName((String) output_temp.get("name"));
            output.setOutputTypeId((String) output_temp.get("type"));
            output.setOutputDescribe((String) output_temp.get("describe"));
            output.setOrderNum(orderNum++);
            outputs.add(output);
        }


        List<Output> outputList_temp = adminOutputRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithm.getId());

        List<Display> displayList = new ArrayList<>();
        if (outputList_temp.size() > 0 && outputs.size() > 0) {

            //生成输出ID映射输出key和类型Id的json
            JSONObject outputTempIdToKey = new JSONObject();
            JSONObject outputTempIdToTypeId = new JSONObject();
            List<String> outputTempIdDeleteList = new ArrayList<>();
            for (Output out : outputList_temp) {
                outputTempIdDeleteList.add(out.getId());
                outputTempIdToKey.put(out.getId(), out.getOutputKey());
                outputTempIdToTypeId.put(out.getId(), out.getOutputTypeId());
            }

            JSONObject outputKeyToTypeId = new JSONObject();
            for (Output out : outputs) {
                outputKeyToTypeId.put(out.getOutputKey(), out.getOutputTypeId());
            }

            //生成输出类型--可视化类型映射json
            List<OutputTypeDisplayType> outputTypeDisplayTypeList = adminOutputTypeDisplayTypeRepository.findAllByActivate(true);
            JSONObject outputTypeDisplayTypeJson = new JSONObject();

            for (OutputTypeDisplayType outputTypeDisplayType : outputTypeDisplayTypeList) {
                if (outputTypeDisplayTypeJson.containsKey(outputTypeDisplayType.getOutputTypeId())) {
                    outputTypeDisplayTypeJson.put(outputTypeDisplayType.getOutputTypeId(),
                            outputTypeDisplayTypeJson.get(outputTypeDisplayType.getOutputTypeId()) + "," + outputTypeDisplayType.getDisplayTypeId());
                } else {
                    outputTypeDisplayTypeJson.put(outputTypeDisplayType.getOutputTypeId(), outputTypeDisplayType.getDisplayTypeId());
                }
            }

            //检查旧的输出表中和新输出表不同的KEY，并在数据库中删除
            List<String> outputIdSaveList = new ArrayList<>();
            for (Output output_temp : outputList_temp) {
                for (Output output : outputs) {
                    if (output_temp.getOutputKey().equals(output.getOutputKey())) {
                        output.setId(output_temp.getId());
                        outputTempIdDeleteList.remove(output_temp.getId());
                        outputIdSaveList.add(output_temp.getId());
                        break;
                    }
                }
            }

            if (outputTempIdDeleteList.size() > 0) {
                adminOutputRepository.deleteAllByIdIn(outputTempIdDeleteList);
            }
            //去除失效可视化
            displayList = adminDisplayRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithm.getId());
            List<Display> displayDeleteTemp = new ArrayList<>();
            for (Display display : displayList) {
                boolean sign = true;
                for (String a : display.getOutputId().split(",")) {
                    if (outputIdSaveList.indexOf(a) == -1) {
                        displayDeleteTemp.add(display);
                        sign = false;
                        break;
                    }
                }
                if (sign) {
                    String outputId = display.getOutputId().split(",")[0];
                    String outputTypeId = outputKeyToTypeId.get(outputTempIdToKey.get(outputId).toString()).toString();
                    List<String> outputTempTypeIdSplit = Arrays.asList(outputTypeDisplayTypeJson.get(outputTypeId).toString().split(","));

                    if (outputTempTypeIdSplit.indexOf(display.getDisplayTypeId()) == -1) {
                        displayDeleteTemp.add(display);
                    }
                }
            }
            displayList.removeAll(displayDeleteTemp);

            if (displayDeleteTemp.size() > 0) {
                adminDisplayRepository.deleteAll(displayDeleteTemp);
            }
            //可视化增加信息
            for (Display display : displayList) {
                StringBuilder stringBuilder = new StringBuilder();
                for (String outputId : display.getOutputId().split(",")) {
                    stringBuilder.append((String) outputTempIdToKey.get(outputId)).append(",");
                }
                display.setOutputKey(stringBuilder.toString().substring(0, stringBuilder.toString().length() - 1));
                display.setOutputTypeId((String) outputTempIdToTypeId.get(display.getOutputId().split(",")[0]));
            }
        }


        adminInputRepository.deleteAllByAlgorithmId(algorithm.getId());

        JSONObject back = new JSONObject();
        back.put("algorithmInfo", adminAlgorithmRepository.save(algorithm));
        back.put("inputList", adminInputRepository.saveAll(inputs));
        back.put("outputList", adminOutputRepository.saveAll(outputs));
        back.put("displayList", displayList);
        return back;
    }

    @Override
    public JSONObject saveAlgorithmDisplay(Algorithm algorithm, List<JSONObject> displayList) {
        adminDisplayRepository.deleteAllByAlgorithmId(algorithm.getId());
        List<Display> displays = new ArrayList<>();
        int orderNum = 0;
        for (JSONObject jsonObject : displayList) {
            Display display = new Display();
            display.setAlgorithmId(algorithm.getId());
            display.setOutputId((String) jsonObject.get("key"));
            display.setDisplayName((String) jsonObject.get("name"));
            display.setDisplayTypeId((String) jsonObject.get("type"));
            display.setDisplayDescribe((String) jsonObject.get("describe"));
            display.setOrderNum(orderNum++);
            displays.add(display);
        }
        displays = adminDisplayRepository.saveAll(displays);
        algorithm.setHasFinish(true);
        adminAlgorithmRepository.save(algorithm);
        JSONObject back = new JSONObject();
        back.put("sign", displays.size() > 0);
        return back;
    }

    @Override
    public String delAlgorithmFileList(String[] fileNameList, String path) {
        for (String fileName : fileNameList) {
            String temp = fileHelper.deleteFile(fileName, path);
            if (!temp.equals("true")) {
                return temp;
            }
        }
        return "true";
    }

    @Override
    public String delAlgorithmFile(String fileName, String path) {
        return fileHelper.deleteFile(fileName, path);
    }


    @Override
    public List<JSONObject> findAlgorithmPythonMethod(String dir) {
        List<JSONObject> methodFileList = new ArrayList<>();
        List<String> fileNames = fileHelper.getFileName(dir);
        for (String file : fileNames) {
            List<JSONObject> list = new ArrayList<>();
            JSONObject fileJson = new JSONObject();
            String s = fileHelper.readFileByLines(dir + file).replaceAll("#.*", "").replaceAll("[']{3}.*?[']{3}", "").replaceAll("[\"]{3}.*?[\"]{3}", "");

            String defRegex = "[^ |\t]def .+?(?=(def |$|\n[a-zA-Z_]{1,}))";
            String methodRegex = "(?<=def ).+?(?=:)";
            String methodNameRegex = ".+?(?=\\()";
            String inputStringRegex = "(?<=\\().*(?=\\))";
            String outputStringRegex = "(?<=[ \t]return \\{).*(?=})";

            // 创建 Pattern 对象
            Pattern defPattern = Pattern.compile(defRegex, Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
            Pattern methodPattern = Pattern.compile(methodRegex, Pattern.CASE_INSENSITIVE | Pattern.DOTALL);
            Pattern methodNamePattern = Pattern.compile(methodNameRegex);
            Pattern inputStringPattern = Pattern.compile(inputStringRegex);
            Pattern outputStringPattern = Pattern.compile(outputStringRegex, Pattern.CASE_INSENSITIVE | Pattern.DOTALL);

            Matcher defMatcher = defPattern.matcher(s);
            while (defMatcher.find()) {
                String def = defMatcher.group();
                Matcher methodMatcher = methodPattern.matcher(def);

                JSONObject defJSon = new JSONObject();
                while (methodMatcher.find()) {
                    String e = methodMatcher.group().replace(" ", "").replace("\n", "").replace("\t", "");
                    if (e.matches("[a-zA-Z_][0-9a-zA-Z_.]*[(].*?[)]$")) {
                        Matcher methodNameMatcher = methodNamePattern.matcher(e);
                        if (methodNameMatcher.find()) {
                            defJSon.put("methodName", methodNameMatcher.group());
                        }
                    }
                    Matcher inputStringMatcher = inputStringPattern.matcher(e);
                    if (inputStringMatcher.find()) {
                        String inputString = inputStringMatcher.group();
                        if (inputStringMatcher.group().length() == 0) {
                            defJSon.put("inputList", new ArrayList<>());
                        } else {
                            defJSon.put("inputList", inputString.replace(" ", "").replace("\n", "").replace("\t", "").split(","));

                        }
                    }
                }

                Matcher outputStringMatcher = outputStringPattern.matcher(def);

                List<String> outputList = new ArrayList<>();
//                if ((def.length() - def.replace("return ", "").length()) != 7) {
//                    defJSon.put("outputList", outputList);
//                } else {
                if (outputStringMatcher.find()) {
                    String outputString = outputStringMatcher.group().replace("\\", "").replace(" ", "").replace("\n", "").replace("\t", "");
                    String outputJsonRegex = "(?<=:)\\{.*?}";
                    String outputFunctionRegex = "(?<=:)[a-zA-Z_][0-9a-zA-Z_.]+\\(.*?\\)";
                    String outputMatRegex = "(?<=:)[a-zA-Z_][0-9a-zA-Z_.]+\\[.*?]";
                    // 创建 Pattern 对象

                    Pattern outputJsonPattern = Pattern.compile(outputJsonRegex);
                    Pattern outputFunctionPattern = Pattern.compile(outputFunctionRegex);
                    Pattern outputMatPattern = Pattern.compile(outputMatRegex);

                    Matcher outputJsonMatcher = outputJsonPattern.matcher(outputString);

                    while (outputJsonMatcher.find()) {
                        outputString = outputString.replace(outputJsonMatcher.group(), "\"output\"");
//                        outputString = outputString.replace(outputJsonMatcher.group(), "output_" + System.currentTimeMillis());
                    }

                    Matcher outputFunctionMatcher = outputFunctionPattern.matcher(outputString);
                    while (outputFunctionMatcher.find()) {
                        outputString = outputString.replace(outputFunctionMatcher.group(), "\"output\"");
                    }

                    Matcher outputMatMatcher = outputMatPattern.matcher(outputString);
                    while (outputMatMatcher.find()) {
                        outputString = outputString.replace(outputMatMatcher.group(), "\"output\"");
                    }
                    JSONObject jsonObject = new JSONObject();
                    try {
                        jsonObject = JSON.parseObject("{" + outputString + "}");
                    } catch (Exception e) {
                    }
                    outputList.addAll(jsonObject.keySet());
                    defJSon.put("outputList", outputList);
                }

                defJSon.put("outputList", outputList);

//                }
                list.add(defJSon);
            }
            fileJson.put("fileName", file);
            fileJson.put("methodList", list);
            methodFileList.add(fileJson);
        }
        return methodFileList;
    }


}
