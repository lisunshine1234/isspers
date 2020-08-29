package com.guteam.java_service.util;

import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class JSONHelper {
    /**
     * 判断字符串是否可以转化为json对象
     *
     * @param content
     * @return
     */
    public JSONObject isJsonObject(String content) {
        // 此处应该注意，不要使用StringUtils.isEmpty(),因为当content为"  "空格字符串时，JSONObject.parseObject可以解析成功，
        // 实际上，这是没有什么意义的。所以content应该是非空白字符串且不为空，判断是否是JSON数组也是相同的情况。
        JSONObject jsonObject = new JSONObject();
        if (StringUtils.isBlank(content)) {
            jsonObject.put("sign", false);
            return jsonObject;
        }
        try {
            JSONObject jsonStr = JSONObject.parseObject(content);
            jsonObject.put("sign", true);
            jsonObject.put("json", jsonStr);
            return jsonObject;
        } catch (Exception e) {
            jsonObject.put("sign", false);
            return jsonObject;
        }
    }

    /**
     * 判断字符串是否可以转化为JSON数组
     *
     * @param content
     * @return
     */
    public boolean isJsonArray(String content) {
        if (StringUtils.isBlank(content))
            return false;
        StringUtils.isEmpty(content);
        try {
            JSONArray jsonStr = JSONArray.parseArray(content);
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
