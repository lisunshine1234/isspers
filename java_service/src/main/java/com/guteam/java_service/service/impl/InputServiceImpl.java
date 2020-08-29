package com.guteam.java_service.service.impl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Input;
import com.guteam.java_service.entity.InputType;
import com.guteam.java_service.respository.mysql.InputRepository;
import com.guteam.java_service.respository.mysql.InputTypeRepository;
import com.guteam.java_service.service.InputService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class InputServiceImpl implements InputService {
    @Autowired
    private InputRepository inputRepository;
    @Autowired
    private InputTypeRepository inputTypeRepository;

    @Override
    public List<Input> findAllInputList() {
        return inputRepository.findAll();
    }

    @Override
    public List<InputType> findAllInputTypeList() {
        return inputTypeRepository.findAll();
    }

    @Override
    public List<InputType> findAllInputTypeListByActivate(boolean activate) {
        return inputTypeRepository.findAllByActivateOrderByOrderNumAsc(activate);
    }

    @Override
    public List<Input> findInputListByAlgorithmId(String algorithmId) {
        List<Input> inputList = inputRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithmId);

        Set<String> inputTypeIdSet = new HashSet<>();
        for (Input input : inputList) {
            inputTypeIdSet.add(input.getInputTypeId());
        }
        List<InputType> inputTypeList = inputTypeRepository.findAllByIdInOrderByOrderNumAsc(inputTypeIdSet);

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
    public List<Input> findInputListByAlgorithmIdAndActivate(String algorithmId, boolean activate) {
        List<Input> inputList = inputRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithmId);

        Set<String> inputTypeIdSet = new HashSet<>();
        for (Input input : inputList) {
            inputTypeIdSet.add(input.getInputTypeId());
        }
        List<InputType> inputTypeList = inputTypeRepository.findAllByIdInAndActivateOrderByOrderNumAsc(inputTypeIdSet, activate);

        List<Input> inputListBack = new ArrayList<>();

        for (Input input : inputList) {
            for (InputType inputType : inputTypeList) {
                if (inputType.getId().equals(input.getInputTypeId())) {
                    if (input.getInputJson() != null && input.getInputJson().length() > 0) {
                        JSONObject jsonObject = new JSONObject(true);
                        jsonObject.putAll(JSON.parseObject(input.getInputJson()));
                        input.setInputJson(jsonObject.toJSONString());
                    }
                    input.setInputType(inputType);
                    inputListBack.add(input);
                    break;
                }
            }
        }
        return inputListBack;
    }

    @Override
    public JSONObject findInputJSONByAlgorithmIdIn(List<String> algorithmIdList) {
        List<Input> inputList = inputRepository.findAllByAlgorithmIdInOrderByOrderNumAsc(algorithmIdList);

        Set<String> inputTypeIdSet = new HashSet<>();
        for (Input input : inputList) {
            inputTypeIdSet.add(input.getInputTypeId());
        }
        List<InputType> inputTypeList = inputTypeRepository.findAllByIdInOrderByOrderNumAsc(inputTypeIdSet);
        JSONObject jsonObject = new JSONObject(true);
        for (String algorithmId : algorithmIdList) {
            List<Input> inputListBack = new ArrayList<>();
            for (Input input : inputList) {
                if (algorithmId.equals(input.getAlgorithmId())) {
                    for (InputType inputType : inputTypeList) {
                        if (inputType.getId().equals(input.getInputTypeId())) {
                            if (input.getInputJson() != null && input.getInputJson().length() > 0) {
                                JSONObject temp = new JSONObject(true);
                                temp.putAll(JSON.parseObject(input.getInputJson()));
                                input.setInputJson(temp.toJSONString());
                            }
                            input.setInputType(inputType);
                            inputListBack.add(input);
                            break;
                        }
                    }
                    break;
                }
            }
            jsonObject.put(algorithmId, inputListBack);
        }
        return jsonObject;
    }

    @Override
    public JSONObject findInputJSONByAlgorithmIdInAndActivate(List<String> algorithmIdList, boolean activate) {
        List<Input> inputList = inputRepository.findAllByAlgorithmIdInOrderByOrderNumAsc(algorithmIdList);

        Set<String> inputTypeIdSet = new HashSet<>();
        for (Input input : inputList) {
            inputTypeIdSet.add(input.getInputTypeId());
        }
        List<InputType> inputTypeList = inputTypeRepository.findAllByIdInOrderByOrderNumAsc(inputTypeIdSet);
        JSONObject jsonObject = new JSONObject(true);
        for (String algorithmId : algorithmIdList) {
            List<Input> inputListBack = new ArrayList<>();
            for (Input input : inputList) {
                if (algorithmId.equals(input.getAlgorithmId())) {
                    for (InputType inputType : inputTypeList) {
                        if (inputType.getId().equals(input.getInputTypeId())) {
                            if (input.getInputJson() != null && input.getInputJson().length() > 0) {
                                JSONObject temp = new JSONObject(true);
                                temp.putAll(JSON.parseObject(input.getInputJson()));
                                input.setInputJson(temp.toJSONString());
                            }
                            input.setInputType(inputType);
                            inputListBack.add(input);
                            break;
                        }
                    }
                    break;
                }
            }
            jsonObject.put(algorithmId, inputListBack);
        }
        return jsonObject;
    }

    @Override
    public JSONObject findInputJSONByAlgorithmIdIn(Set<String> algorithmIdList) {
        List<Input> inputList = inputRepository.findAllByAlgorithmIdInOrderByOrderNumAsc(algorithmIdList);

        Set<String> inputTypeIdSet = new HashSet<>();
        for (Input input : inputList) {
            inputTypeIdSet.add(input.getInputTypeId());
        }
        List<InputType> inputTypeList = inputTypeRepository.findAllByIdInOrderByOrderNumAsc(inputTypeIdSet);
        JSONObject jsonObject = new JSONObject(true);
        for (String algorithmId : algorithmIdList) {
            List<Input> inputListBack = new ArrayList<>();
            for (Input input : inputList) {
                if (algorithmId.equals(input.getAlgorithmId())) {
                    for (InputType inputType : inputTypeList) {
                        if (inputType.getId().equals(input.getInputTypeId())) {
                            if (input.getInputJson() != null && input.getInputJson().length() > 0) {
                                JSONObject temp = new JSONObject(true);
                                temp.putAll(JSON.parseObject(input.getInputJson()));
                                input.setInputJson(temp.toJSONString());
                            }
                            input.setInputType(inputType);
                            inputListBack.add(input);
                            break;
                        }
                    }
                    break;
                }
            }
            jsonObject.put(algorithmId, inputListBack);
        }
        return jsonObject;
    }

    @Override
    public JSONObject findInputJSONByAlgorithmIdInAndActivate(Set<String> algorithmIdList, boolean activate) {
        List<Input> inputList = inputRepository.findAllByAlgorithmIdInOrderByOrderNumAsc(algorithmIdList);

        Set<String> inputTypeIdSet = new HashSet<>();
        for (Input input : inputList) {
            inputTypeIdSet.add(input.getInputTypeId());
        }
        List<InputType> inputTypeList = inputTypeRepository.findAllByIdInOrderByOrderNumAsc(inputTypeIdSet);
        JSONObject jsonObject = new JSONObject(true);
        for (String algorithmId : algorithmIdList) {
            List<Input> inputListBack = new ArrayList<>();
            for (Input input : inputList) {
                if (algorithmId.equals(input.getAlgorithmId())) {
                    for (InputType inputType : inputTypeList) {
                        if (inputType.getId().equals(input.getInputTypeId())) {
                            if (input.getInputJson() != null && input.getInputJson().length() > 0) {
                                JSONObject temp = new JSONObject(true);
                                temp.putAll(JSON.parseObject(input.getInputJson()));
                                input.setInputJson(temp.toJSONString());
                            }
                            input.setInputType(inputType);
                            inputListBack.add(input);
                            break;
                        }
                    }
                    break;
                }
            }
            jsonObject.put(algorithmId, inputListBack);
        }
        return jsonObject;
    }
}
