package com.guteam.java_service.service.impl;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.*;
import com.guteam.java_service.respository.mysql.*;
import com.guteam.java_service.service.DisplayService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
public class DisplayServiceImpl implements DisplayService {
    @Autowired
    private DisplayRepository displayRepository;
    @Autowired
    private DisplayTypeRepository displayTypeRepository;
    @Autowired
    private OutputRepository outputRepository;
    @Autowired
    private OutputTypeRepository outputTypeRepository;
    @Autowired
    private OutputTypeDisplayTypeRepository outputTypeDisplayTypeRepository;

    @Override
    public List<Display> findDisplayListByAlgorithmId(String algorithmId) {
        List<DisplayType> displayTypeList = displayTypeRepository.findAllByActivateOrderByOrderNumAsc(true);
        List<Output> outputList = outputRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithmId);

        JSONObject jsonObject = new JSONObject();
        for (Output output : outputList) {
            jsonObject.put(output.getId(), output.getOutputKey());
        }

        List<Display> displayList = displayRepository.findAllByAlgorithmIdOrderByOrderNumAsc(algorithmId);
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
    public List<Display> findDisplayListByOutputId(String outputId) {
        List<Display> displayList = displayRepository.findAllByOutputIdOrderByOrderNumAsc(outputId);

        Set<String> displayIdSet = new HashSet<>();
        for (Display display : displayList) {
            displayIdSet.add(display.getDisplayTypeId());
        }

        List<DisplayType> displayTypeList = displayTypeRepository.findAllByIdInOrderByOrderNumAsc(displayIdSet);
        for (Display display : displayList) {
            for (DisplayType displayType : displayTypeList) {
                if (display.getDisplayTypeId().equals(displayType.getId())) {
                    display.setDisplayType(displayType);
                    break;
                }
            }
        }
        return displayList;
    }

    @Override
    public List<Display> findDisplayListByOutputIdAndActivate(String outputId, boolean activate) {
        List<Display> displayList = displayRepository.findAllByOutputIdOrderByOrderNumAsc(outputId);

        Set<String> displayIdSet = new HashSet<>();
        for (Display display : displayList) {
            displayIdSet.add(display.getDisplayTypeId());
        }

        List<DisplayType> displayTypeList = displayTypeRepository.findAllByIdInAndActivateOrderByOrderNumAsc(displayIdSet, true);
        List<Display> displayListBack = new ArrayList<>();
        for (Display display : displayList) {
            for (DisplayType displayType : displayTypeList) {
                if (display.getDisplayTypeId().equals(displayType.getId())) {
                    display.setDisplayType(displayType);
                    displayListBack.add(display);
                    break;
                }
            }
        }
        return displayListBack;
    }

    @Override
    public List<Display> findDisplayListByOutputIdIn(List<Output> outputList) {
        List<String> outputIdList = new ArrayList<>();
        for (Output output : outputList) {
            outputIdList.add(output.getId());
        }

        List<Display> displayList = displayRepository.findAllByOutputIdInOrderByOrderNumAsc(outputIdList);

        Set<String> displayIdSet = new HashSet<>();
        for (Display display : displayList) {
            displayIdSet.add(display.getDisplayTypeId());
        }

        List<DisplayType> displayTypeList = displayTypeRepository.findAllByIdInOrderByOrderNumAsc(displayIdSet);

        List<Display> displayListBack = new ArrayList<>();
        for (Output output : outputList) {
            for (Display display : displayList) {
                if (output.getId().equals(display.getOutputId())) {
                    for (DisplayType displayType : displayTypeList) {
                        if (display.getDisplayTypeId().equals(displayType.getId())) {
                            display.setDisplayType(displayType);
                            display.setOutputKey(output.getOutputKey());
                            displayListBack.add(display);
                            break;
                        }
                    }
                    break;
                }
            }
        }

        return displayListBack;
    }



    @Override
    public List<Display> findDisplayListByOutputIdInAndActivate(List<Output> outputList, boolean activate) {
        List<String> outputIdList = new ArrayList<>();
        for (Output output : outputList) {
            outputIdList.add(output.getId());
        }

        List<Display> displayList = displayRepository.findAllByOutputIdInOrderByOrderNumAsc(outputIdList);

        Set<String> displayIdSet = new HashSet<>();
        for (Display display : displayList) {
            displayIdSet.add(display.getDisplayTypeId());
        }

        List<DisplayType> displayTypeList = displayTypeRepository.findAllByIdInAndActivateOrderByOrderNumAsc(displayIdSet, true);
        List<Display> displayListBack = new ArrayList<>();
        for (Output output : outputList) {
            for (Display display : displayList) {
                if (output.getId().equals(display.getOutputId())) {
                    for (DisplayType displayType : displayTypeList) {
                        if (display.getDisplayTypeId().equals(displayType.getId())) {
                            display.setDisplayType(displayType);
                            display.setOutputKey(output.getOutputKey());
                            displayListBack.add(display);
                            break;
                        }
                    }
                    break;
                }
            }
        }

        return displayListBack;
    }

    @Override
    public List<Display> findDisplayListByOutputIdIn(Set<Output> outputSet) {
        List<String> outputIdList = new ArrayList<>();
        for (Output output : outputSet) {
            outputIdList.add(output.getId());
        }

        List<Display> displayList = displayRepository.findAllByOutputIdInOrderByOrderNumAsc(outputIdList);


        Set<String> displayIdSet = new HashSet<>();
        for (Display display : displayList) {
            displayIdSet.add(display.getDisplayTypeId());
        }

        List<DisplayType> displayTypeList = displayTypeRepository.findAllByIdInOrderByOrderNumAsc(displayIdSet);
        List<Display> displayListBack = new ArrayList<>();
        for (Output output : outputSet) {
            for (Display display : displayList) {
                if (output.getId().equals(display.getOutputId())) {
                    for (DisplayType displayType : displayTypeList) {
                        if (display.getDisplayTypeId().equals(displayType.getId())) {
                            display.setDisplayType(displayType);
                            display.setOutputKey(output.getOutputKey());
                            displayListBack.add(display);
                            break;
                        }
                    }
                    break;
                }
            }
        }

        return displayListBack;
    }

    @Override
    public List<Display> findDisplayListByOutputIdInAndActivate(Set<Output> outputSet, boolean activate) {
        List<String> outputIdList = new ArrayList<>();
        for (Output output : outputSet) {
            outputIdList.add(output.getId());
        }

        List<Display> displayList = displayRepository.findAllByOutputIdInOrderByOrderNumAsc(outputIdList);

        Set<String> displayIdSet = new HashSet<>();
        for (Display display : displayList) {
            displayIdSet.add(display.getDisplayTypeId());
        }

        List<DisplayType> displayTypeList = displayTypeRepository.findAllByIdInAndActivateOrderByOrderNumAsc(displayIdSet, true);
        List<Display> displayListBack = new ArrayList<>();
        for (Output output : outputSet) {
            for (Display display : displayList) {
                if (output.getId().equals(display.getOutputId())) {
                    for (DisplayType displayType : displayTypeList) {
                        if (display.getDisplayTypeId().equals(displayType.getId())) {
                            display.setDisplayType(displayType);
                            display.setOutputKey(output.getOutputKey());
                            displayListBack.add(display);
                            break;
                        }
                    }
                    break;
                }
            }
        }

        return displayListBack;
    }

    @Override
    public JSONObject findOutputIdAndDisplayTypeListJsonByActivate(boolean activate) {
        List<DisplayType> displayTypeList = displayTypeRepository.findAllByActivateOrderByOrderNumAsc(activate);
        List<OutputType> outputTypeList = outputTypeRepository.findAllByActivateOrderByOrderNumAsc(activate);
        List<OutputTypeDisplayType> outputTypeDisplayTypeList = outputTypeDisplayTypeRepository.findAllByActivate(activate);

        JSONObject back = new JSONObject();
        JSONObject displayIdJson = new JSONObject();


        for (DisplayType displayType : displayTypeList) {
            displayIdJson.put(displayType.getId(), displayType);
        }
        for (OutputType outputType : outputTypeList) {
            List<DisplayType> list = new ArrayList<>();
            for (OutputTypeDisplayType outputTypeDisplayType : outputTypeDisplayTypeList) {
                if (outputType.getId().equals(outputTypeDisplayType.getOutputTypeId())) {
                    list.add((DisplayType) displayIdJson.get(outputTypeDisplayType.getDisplayTypeId()));
                }
            }
            back.put(outputType.getId(), list);
        }

        return back;
    }
}
