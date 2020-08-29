package com.guteam.java_service.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.*;
import com.guteam.java_service.entity.mongo.AlgorithmDescribe;
import com.guteam.java_service.respository.mongodb.AlgorithmDescribeRepository;
import com.guteam.java_service.respository.mysql.*;
import com.guteam.java_service.service.AlgorithmMyService;
import com.guteam.java_service.util.FileHelper;
import com.guteam.java_service.util.JSONHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class AlgorithmMyServiceImpl implements AlgorithmMyService {
    @Autowired
    private AlgorithmRepository algorithmRepository;
    @Autowired
    private NavigationParentRepository navigationParentRepository;
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private AlgorithmEngineRepository algorithmEngineRepository;
    @Autowired
    private AlgorithmEnvironmentRepository algorithmEnvironmentRepository;
    @Autowired
    private FileHelper fileHelper;
    @Autowired
    private JSONHelper jsonHelper;
    @Autowired
    private InputRepository inputRepository;
    @Autowired
    private OutputRepository outputRepository;
    @Autowired
    private DisplayRepository displayRepository;
    @Autowired
    private OutputTypeDisplayTypeRepository outputTypeDisplayTypeRepository;
    @Autowired
    private AlgorithmDescribeRepository algorithmDescribeRepository;

    @Override
    public List<NavigationType> findNavigationListByNavigationAlgorithm() {
        List<NavigationType> navigationTypeList = (List<NavigationType>) redisUtil.get("navigation");

        List<NavigationType> navigationTypeListTemp = new ArrayList<>();

        for (NavigationType navigationType : navigationTypeList) {
            List<NavigationParent> navigationParentTemp = new ArrayList<>();
            if (navigationType.isNavigationAlgorithm()) {
                for (NavigationParent navigationParent : navigationType.getNavigationParentList()) {
                    if (navigationParent.isActivate()) {
                        navigationParentTemp.add(navigationParent);
                    }
                }
                navigationType.setNavigationParentList(navigationParentTemp);
                navigationTypeListTemp.add(navigationType);
            }
        }
        return navigationTypeListTemp;
    }

    @Override
    public List<Algorithm> findAlgorithmListByUserId(String userId) {
        return AlgorithmHelp(algorithmRepository.findAllByUserIdOrderByUploadTimeDesc(userId));
    }

    @Override
    public JSONObject findAlgorithmTypeCount(List<Algorithm> algorithmList, List<NavigationType> navigationTypeList) {
        JSONObject navigationCount = new JSONObject();
        navigationCount.put("all", 0);
        for (NavigationType navigationType : navigationTypeList) {
            navigationCount.put(navigationType.getId(), 0);
            for (NavigationParent navigationParent : navigationType.getNavigationParentList()) {
                navigationCount.put(navigationParent.getId(), 0);
            }
        }
        for (Algorithm algorithm : algorithmList) {
            navigationCount.put(algorithm.getNavigationParentId(), (int) navigationCount.get(algorithm.getNavigationParentId()) + 1);
        }
        for (NavigationType navigationType : navigationTypeList) {
            for (NavigationParent navigationParent : navigationType.getNavigationParentList()) {
                navigationCount.put(navigationType.getId(), (int) navigationCount.get(navigationType.getId()) + (int) navigationCount.get(navigationParent.getId()));
                navigationCount.put("all", (int) navigationCount.get("all") + (int) navigationCount.get(navigationParent.getId()));
            }
        }
        return navigationCount;
    }

    @Override
    public List<SetFile> findAlgorithmFileList(String dir) {
        return fileHelper.getOnlyFileList(dir);
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

    @Override
    public String delAlgorithmFile(String fileName, String path) {
        return fileHelper.deleteFile(fileName, path);
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
            algorithmDescribeRepository.save(algorithmDescribe);

        } else {
            AlgorithmDescribe algorithmDescribe = new AlgorithmDescribe();
            algorithmDescribe.setDescribe((String) baseInfo.get("describe"));
            algorithmDescribe = algorithmDescribeRepository.save(algorithmDescribe);
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

//        if (user.getUserType().getUserTypeKey().contains("ADMIN")) {
            algorithm.setAlgorithmType("base");
//        } else {
//            algorithm.setAlgorithmType("custom");
//        }
        return algorithmRepository.save(algorithm);
    }


    @Override
    public JSONObject findAlgorithmBaseInOutDisplayByAlgorithmId(String algorithmId, String userId) {
        JSONObject jsonObject = new JSONObject();
        Algorithm algorithm = algorithmRepository.findAlgorithmByIdAndUserId(algorithmId, userId);
        if (algorithm != null) {
            jsonObject.put("baseInfo", algorithm);
            jsonObject.put("inputList", null);
            jsonObject.put("outputList", null);
            jsonObject.put("displayList", null);
            algorithm.setAlgorithmDescribe(algorithmDescribeRepository.findAllById(algorithm.getAlgorithmDescribeId()).getDescribe());

            if (algorithm.getAlgorithmPath() != null) {
                jsonObject.put("path", algorithm.getAlgorithmPath());
                List<Input> inputList = inputRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithm.getId());
                List<Output> outputList = outputRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithm.getId());
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

                        List<Display> displayList = displayRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithm.getId());
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
    public Algorithm saveAlgorithmUploadFilePath(String path, Algorithm algorithm) {
        algorithm.setAlgorithmPath(path);
        return algorithmRepository.save(algorithm);
    }

    @Override
    public Algorithm saveAlgorithmUploadFileSize(String path, Algorithm algorithm) {
        algorithm.setAlgorithmSize(fileHelper.getFileSize(fileHelper.getDirOrFileSize(new File(path))));
        return algorithmRepository.save(algorithm);
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


        List<Output> outputList_temp = outputRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithm.getId());

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
            List<OutputTypeDisplayType> outputTypeDisplayTypeList = outputTypeDisplayTypeRepository.findAllByActivate(true);
            JSONObject outputTypeDisplayTypeJson = new JSONObject();

            for (OutputTypeDisplayType outputTypeDisplayType : outputTypeDisplayTypeList) {
                if (outputTypeDisplayTypeJson.containsKey(outputTypeDisplayType.getOutputTypeId())) {
                    outputTypeDisplayTypeJson.put(outputTypeDisplayType.getOutputTypeId(),
                            outputTypeDisplayTypeJson.get(outputTypeDisplayType.getOutputTypeId()) + ","+ outputTypeDisplayType.getDisplayTypeId());
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
                outputRepository.deleteAllByIdIn(outputTempIdDeleteList);
            }
            //去除失效可视化
            displayList = displayRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithm.getId());
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
                displayRepository.deleteAll(displayDeleteTemp);
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


        inputRepository.deleteAllByAlgorithmId(algorithm.getId());

        JSONObject back = new JSONObject();
        back.put("algorithmInfo", algorithmRepository.save(algorithm));
        back.put("inputList", inputRepository.saveAll(inputs));
        back.put("outputList", outputRepository.saveAll(outputs));
        back.put("displayList", displayList);
        return back;
    }

    @Override
    public JSONObject saveAlgorithmDisplay(Algorithm algorithm, List<JSONObject> displayList) {
        displayRepository.deleteAllByAlgorithmId(algorithm.getId());
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
        displays = displayRepository.saveAll(displays);
        algorithm.setHasFinish(true);
        algorithmRepository.save(algorithm);
        JSONObject back = new JSONObject();
        back.put("sign", displays.size() > 0);
        return back;
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
        List<AlgorithmDescribe> algorithmDescribeList = algorithmDescribeRepository.findAllByIdIn(describeList);
        List<User> userList = userRepository.findAllByIdIn(userSet);
        List<NavigationParent> navigationList = navigationParentRepository.findAllByIdIn(navigationSet);
        List<AlgorithmEngine> engineList = algorithmEngineRepository.findAllByIdInAndActivate(engineSet, true);
        List<AlgorithmEnvironment> algorithmEnvironmentList = algorithmEnvironmentRepository.findAllByIdInAndActivate(environmentSet, true);
        JSONObject engineJSON = new JSONObject();
        for (AlgorithmEngine algorithmEngine : engineList) {
            engineJSON.put(algorithmEngine.getId(), algorithmEngine.getEngineName());
        }
        for (Algorithm algorithm : algorithmList) {
            if (algorithm.getAlgorithmType().equals("base")) {
                algorithm.setUserName("官方");
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
}
