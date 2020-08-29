package com.guteam.java_service.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.Output;
import com.guteam.java_service.entity.OutputType;
import com.guteam.java_service.respository.mysql.OutputRepository;
import com.guteam.java_service.respository.mysql.OutputTypeRepository;
import com.guteam.java_service.service.OutputService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class OutputServiceImpl implements OutputService {
    @Autowired
    private OutputRepository outputRepository;
    @Autowired
    private OutputTypeRepository outputTypeRepository;

    @Override
    public List<Output> findOutputListByAlgorithmId(String algorithmId) {
        List<Output> outputList = outputRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithmId);
        Set<String> outputTypeIdSet = new HashSet<>();
        for (Output output : outputList) {
            outputTypeIdSet.add(output.getOutputTypeId());
        }
        List<OutputType> outputTypeList = outputTypeRepository.findAllByIdInOrderByOrderNumAsc(outputTypeIdSet);

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
    public List<OutputType> findOutputListByActivate(boolean activate) {
        return outputTypeRepository.findAllByActivateOrderByOrderNumAsc(activate);
    }

    @Override
    public List<Output> findOutputListByAlgorithmIdAndActivate(String algorithmId, boolean activate) {
        List<Output> outputList = outputRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithmId);
        Set<String> outputTypeIdSet = new HashSet<>();
        for (Output output : outputList) {
            outputTypeIdSet.add(output.getOutputTypeId());
        }
        List<OutputType> outputTypeList = outputTypeRepository.findAllByIdInAndActivateOrderByOrderNumAsc(outputTypeIdSet, activate);
        List<Output> outputListBack = new ArrayList<>();
        for (Output output : outputList) {
            for (OutputType outputType : outputTypeList) {
                if (outputType.getId().equals(output.getOutputTypeId())) {
                    output.setOutputType(outputType);
                    outputListBack.add(output);
                    break;
                }
            }
        }
        return outputListBack;
    }

    @Override
    public JSONObject findOutputJSONByAlgorithmIdIn(List<String> algorithmIdList) {
        List<Output> outputList = outputRepository.findAllByAlgorithmIdInOrderByOrderNumAsc(algorithmIdList);
        Set<String> outputTypeIdSet = new HashSet<>();
        for (Output output : outputList) {
            outputTypeIdSet.add(output.getOutputTypeId());
        }
        List<OutputType> outputTypeList = outputTypeRepository.findAllByIdInOrderByOrderNumAsc(outputTypeIdSet);


        JSONObject jsonObject = new JSONObject(true);
        for (String algorithmId : algorithmIdList) {
            List<Output> outputListBack = new ArrayList<>();
            for (Output output : outputList) {
                if (algorithmId.equals(output.getAlgorithmId())) {
                    for (OutputType outputType : outputTypeList) {
                        if (output.getOutputTypeId().equals(outputType.getId())) {
                            output.setOutputType(outputType);
                            outputListBack.add(output);
                            break;
                        }
                    }
                    break;
                }
            }
            jsonObject.put(algorithmId, outputListBack);
        }
        return jsonObject;
    }

    @Override
    public JSONObject findOutputJSONByAlgorithmIdInAndActivate(List<String> algorithmIdList, boolean activate) {
        List<Output> outputList = outputRepository.findAllByAlgorithmIdInOrderByOrderNumAsc(algorithmIdList);
        Set<String> outputTypeIdSet = new HashSet<>();
        for (Output output : outputList) {
            outputTypeIdSet.add(output.getOutputTypeId());
        }
        List<OutputType> outputTypeList = outputTypeRepository.findAllByIdInAndActivateOrderByOrderNumAsc(outputTypeIdSet, activate);

        JSONObject jsonObject = new JSONObject(true);
        for (String algorithmId : algorithmIdList) {
            List<Output> outputListBack = new ArrayList<>();
            for (Output output : outputList) {
                if (algorithmId.equals(output.getAlgorithmId())) {
                    for (OutputType outputType : outputTypeList) {
                        if (output.getOutputTypeId().equals(outputType.getId())) {
                            output.setOutputType(outputType);
                            outputListBack.add(output);
                            break;
                        }
                    }
                    break;
                }
            }
            jsonObject.put(algorithmId, outputListBack);
        }
        return jsonObject;
    }


    @Override
    public JSONObject findOutputJSONByAlgorithmIdIn(Set<String> algorithmIdList) {
        List<Output> outputList = outputRepository.findAllByAlgorithmIdInOrderByOrderNumAsc(algorithmIdList);
        Set<String> outputTypeIdSet = new HashSet<>();
        for (Output output : outputList) {
            outputTypeIdSet.add(output.getOutputTypeId());
        }
        List<OutputType> outputTypeList = outputTypeRepository.findAllByIdInOrderByOrderNumAsc(outputTypeIdSet);


        JSONObject jsonObject = new JSONObject(true);
        for (String algorithmId : algorithmIdList) {
            List<Output> outputListBack = new ArrayList<>();
            for (Output output : outputList) {
                if (algorithmId.equals(output.getAlgorithmId())) {
                    for (OutputType outputType : outputTypeList) {
                        if (output.getOutputTypeId().equals(outputType.getId())) {
                            output.setOutputType(outputType);
                            outputListBack.add(output);
                            break;
                        }
                    }
                    break;
                }
            }
            jsonObject.put(algorithmId, outputListBack);
        }
        return jsonObject;
    }

    @Override
    public JSONObject findOutputJSONByAlgorithmIdInAndActivate(Set<String> algorithmIdList, boolean activate) {
        List<Output> outputList = outputRepository.findAllByAlgorithmIdInOrderByOrderNumAsc(algorithmIdList);
        Set<String> outputTypeIdSet = new HashSet<>();
        for (Output output : outputList) {
            outputTypeIdSet.add(output.getOutputTypeId());
        }
        List<OutputType> outputTypeList = outputTypeRepository.findAllByIdInAndActivateOrderByOrderNumAsc(outputTypeIdSet, activate);

        JSONObject jsonObject = new JSONObject(true);
        for (String algorithmId : algorithmIdList) {
            List<Output> outputListBack = new ArrayList<>();
            for (Output output : outputList) {
                if (algorithmId.equals(output.getAlgorithmId())) {
                    for (OutputType outputType : outputTypeList) {
                        if (output.getOutputTypeId().equals(outputType.getId())) {
                            output.setOutputType(outputType);
                            outputListBack.add(output);
                            break;
                        }
                    }
                    break;
                }
            }
            jsonObject.put(algorithmId, outputListBack);
        }
        return jsonObject;
    }
}
