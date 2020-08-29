package com.guteam.java_service.filter;


import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.service.DisplayService;
import com.guteam.java_service.service.InputService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Configuration
public class DisplayFilter implements WebMvcConfigurer {
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private DisplayService displayService;
    @Value("${displayRedisTime}")
    private Integer displayRedisTime;

    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SessionHandlerInterceptor()).addPathPatterns("/**")
                .excludePathPatterns("/css/**", "/js/**", "/myjs/**", "/sass/**", "/assets/**", "/system/**");

    }

    class SessionHandlerInterceptor implements HandlerInterceptor {
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
//            if (!redisUtil.hasKey("displayModel")) {
//                redisUtil.set("displayModel", displayService.findAllDisplayModelByActivate(true), displayRedisTime);
//            }
//            if (!redisUtil.hasKey("displayType")) {
//                redisUtil.set("displayType", displayService.findAllDisplayTypeByActivate(true), displayRedisTime);
//            }

            return true;
        }
    }
}
