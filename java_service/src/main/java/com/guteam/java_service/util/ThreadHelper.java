package com.guteam.java_service.util;

import com.alibaba.fastjson.JSONObject;
import com.sun.media.jfxmediaimpl.platform.Platform;
import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Component;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

@Component
public class ThreadHelper {
    public JSONObject killProcessByPid(String pid) {
        JSONObject back = new JSONObject();
        Process process = null;
        BufferedReader reader = null;
        String command = "";
        boolean result = false;
        String OS = System.getProperty("os.name").toLowerCase();
        if (OS.contains("windows")) {
            command = "cmd.exe /c taskkill /PID " + pid + " /F /T ";
        } else if (OS.contains("linux")) {
            command = "kill -9 " + pid;
        }

        try {
            //杀掉进程
            process = Runtime.getRuntime().exec(command);
            reader = new BufferedReader(new InputStreamReader(process.getInputStream(), "GBK"));
            String line = null;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
            back.put("sign", true);
            back.put("tip", "杀进程成功！");
        } catch (Exception e) {
            back.put("sign", false);
            back.put("tip", "杀进程出错！");
            System.out.println("杀进程出错：" + e);
            result = false;
        } finally {
            if (process != null) {
                process.destroy();
            }
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {

                }
            }
        }
        return back;
    }
}
