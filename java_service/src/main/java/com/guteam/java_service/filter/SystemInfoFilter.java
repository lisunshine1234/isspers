package com.guteam.java_service.filter;

import com.guteam.java_service.entity.SystemInfo;
import com.guteam.java_service.service.SystemInfoService;
import com.guteam.java_service.config.Redis.RedisUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


@Configuration
public class SystemInfoFilter implements WebMvcConfigurer {
    @Autowired
    private SystemInfoService systemInfoService;
    @Autowired
    private RedisUtil redisUtil;
    @Value("${systemImage}")
    private String systemImage;
    @Value("${systemInfoRedisTime}")
    private Integer systemInfoRedisTime;

    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SessionHandlerInterceptor()).addPathPatterns("/**")
                .excludePathPatterns("/css/**", "/js/**", "/myjs/**", "/sass/**", "/assets/**", "/system/**");
    }

    class SessionHandlerInterceptor implements HandlerInterceptor {
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
            if (!redisUtil.hasKey("systemInfo")) {
                SystemInfo systemInfo = systemInfoService.getSystemInfo();
                systemInfo.setSystemLogo1("/" + systemImage + systemInfo.getSystemLogo1());
                systemInfo.setSystemLogo2("/" + systemImage + systemInfo.getSystemLogo2());
                systemInfo.setSystemLogo3("/" + systemImage + systemInfo.getSystemLogo3());
                systemInfo.setSystemLogo4("/" + systemImage + systemInfo.getSystemLogo4());
                systemInfo.setSystemLogo5("/" + systemImage + systemInfo.getSystemLogo5());

                redisUtil.set("systemInfo", systemInfo, systemInfoRedisTime);
            }

            return true;
        }
    }
}
