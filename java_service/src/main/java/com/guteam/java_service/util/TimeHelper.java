package com.guteam.java_service.util;

import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class TimeHelper {
    public String CalculateCostTime(Date start, Date end) {
        long totalMilliSeconds = end.getTime() - start.getTime();
        if (totalMilliSeconds < 1000) {
            return String.valueOf(totalMilliSeconds) + "毫秒";
        } else {
            long currentMilliSeconds = totalMilliSeconds % 1000;
            long totalSeconds = totalMilliSeconds / 1000;
            if (totalSeconds < 60) {
                return String.valueOf(totalSeconds) + "秒" + String.valueOf(currentMilliSeconds) + "毫秒";
            } else {
                long currentSecond = totalSeconds % 60;
                long totalMinutes = totalSeconds / 60;
                if (totalMinutes < 60) {
                    return String.valueOf(totalMinutes) + "分" + String.valueOf(currentSecond) + "秒" + String.valueOf(currentMilliSeconds) + "毫秒";
                } else {
                    long totalHour = totalMinutes / 60;
                    return String.valueOf(totalHour) + "小时" + String.valueOf(totalMinutes) + "分" + String.valueOf(currentSecond) + "秒" + String.valueOf(currentMilliSeconds) + "毫秒";
                }
            }
        }
    }

}
