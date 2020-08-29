package com.guteam.java_service.service.impl;

import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.NavigationParent;
import com.guteam.java_service.entity.NavigationType;
import com.guteam.java_service.respository.mysql.NavigationParentRepository;
import com.guteam.java_service.respository.mysql.NavigationTypeRepository;
import com.guteam.java_service.service.NavigationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class NavigationServiceImpl implements NavigationService {
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private NavigationTypeRepository navigationTypeRepository;
    @Autowired
    private NavigationParentRepository navigationParentRepository;
    @Value("${navigationRedisTime}")
    private Integer navigationRedisTime;

    @Override
    public List<NavigationType> getNavigationByIsActivate(boolean isActivate) {
        List<NavigationType> navigationTypeList = navigationTypeRepository.findAllByActivateOrderByOrderNumAsc(isActivate);
        List<NavigationParent> navigationParentList = navigationParentRepository.findAllByActivateOrderByOrderNumAsc(isActivate);

        for (NavigationType navigationType : navigationTypeList) {
            List<NavigationParent> newNavigationParentList = new ArrayList<>();
            for (NavigationParent navigationParent : navigationParentList) {
                if (navigationType.getId().equals(navigationParent.getNavigationTypeId())) {
                    newNavigationParentList.add(navigationParent);
                }
            }
            navigationType.setNavigationParentList(newNavigationParentList);
        }
        return navigationTypeList;
    }

    @Override
    public boolean checkNavigationIdIsExist(String navigationId) {
        return navigationParentRepository.findById(navigationId).orElse(null) != null;
    }

    @Override
    public NavigationParent checkNavigationUrlIsExistAndIsActivate(String url) {
        if (!redisUtil.hasKey("navigation")) {
            redisUtil.set("navigation", getNavigationByIsActivate(true), navigationRedisTime);
        }
        List<NavigationType> navigationTypeList = (List<NavigationType>) redisUtil.get("navigation");

        NavigationParent navigationParent = null;
        for (NavigationType navigationType : navigationTypeList) {
            List<NavigationParent> navigationParentList = navigationType.getNavigationParentList();
            for (NavigationParent na : navigationParentList) {
                if (na.getNavigationUrl().equals(url) && na.isActivate()) {
                    navigationParent = na;
                    navigationParent.setNavigationType(navigationType.getNavigationName());
                }
            }

        }
        return navigationParent;
    }

    @Override
    public List<NavigationType> findAllByActivateAndNavigationAlgorithm(boolean activate, boolean navigationAlgorithm) {
        List<NavigationType> navigationTypeList = navigationTypeRepository.findAllByActivateAndNavigationAlgorithm(activate, navigationAlgorithm);
        List<String> navigationTypeIdList = new ArrayList<>();
        for (NavigationType navigationType : navigationTypeList) {
            navigationTypeIdList.add(navigationType.getId());
        }
        List<NavigationParent> navigationParentList = navigationParentRepository.findAllByNavigationTypeIdInAndActivateOrderByOrderNumAsc(navigationTypeIdList, activate);

        for (NavigationType navigationType : navigationTypeList) {
            List<NavigationParent> newNavigationParentList = new ArrayList<>();
            for (NavigationParent navigationParent : navigationParentList) {
                if (navigationType.getId().equals(navigationParent.getNavigationTypeId())) {
                    newNavigationParentList.add(navigationParent);
                }
            }
            navigationType.setNavigationParentList(newNavigationParentList);
        }
        return navigationTypeList;
    }

//    @Override
//    public NavigationParent findNavigationParentByUrl(String url) {
//        return navigationParentRepository.findByNavigationUrl(url);
//    }


//    @Override
//    public List<Navigation> getNavigation() {
//        List<Navigation> navigationFatherList = navigationFatherRepository.findAllByOrderByOrderNumAsc();
//        List<NavigationChild> navigationChildList = navigationChildRepository.findAllByOrderByOrderNumAsc();
//
//        for (int i = 0; i < navigationFatherList.size(); i++) {
//            List<NavigationChild> list = new ArrayList<>();
//            Navigation navigationFather = navigationFatherList.get(i);
//            for (NavigationChild navigationChild : navigationChildList) {
//                if (navigationFatherList.get(i).getId().equals(navigationChild.getNavigationFatherId()))
//                    list.add(navigationChild);
//            }
//            navigationFather.setNavigationChildList(list);
//            navigationFatherList.set(i, navigationFather);
//        }
//        return navigationFatherList;
//    }

//    @Override
//    public List<Input> getNavigationChildAttribute(Integer childId) {
//        if (childId == null)
//            return null;
//        else {
//            List<Input> attributeList = attributeRepository.getAllByChildIdOrderByOrderNum(childId);
//            List<InputType> attributeTypeList = attributeTypeRepository.findAll();
//            for (InputType attributeType : attributeTypeList) {
//                for (Input attribute : attributeList) {
//                    if (attribute.getAttributeType().equals(attributeType.getId().toString())) {
//                        if(attribute.getJson()!= null && !"".equals(attribute.getJson())){
//                            LinkedHashMap<String, Object> json = JSON.parseObject(attribute.getJson(),LinkedHashMap.class, Feature.OrderedField);
//                            JSONObject jsonObject=new JSONObject(true);
//                            jsonObject.putAll(json);
//
//                            attribute.setJsonWord(jsonObject);
//                        }
//                        attribute.setAttributeType(attributeType.getTypeKey());
//                    }
//                }
//            }
//            return attributeList;
//        }
//
//    }

//    @Override
//    public Integer getChildIdByFatherUrlAndChildUrl(String fatherKey, String childKey) {
//        NavigationFather navigationFather = navigationFatherRepository.findByFatherKey(fatherKey);
//        NavigationChild navigationChild = navigationChildRepository.findByNavigationFatherIdAndChildKey(navigationFather.getId(), childKey);
//        if (navigationFather == null || navigationChild == null || navigationFather.getId() != navigationChild.getNavigationFatherId()) {
//            return null;
//        }
//        return navigationChild.getId();
//    }


}
