package com.guteam.java_service.filter;

import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.service.OutputService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

@Configuration
public class OutputFilter implements WebMvcConfigurer {
    @Autowired
    private RedisUtil redisUtil;
    @Autowired
    private OutputService outputService;
    @Value("${outputRedisTime}")
    private Integer outputRedisTime;

    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SessionHandlerInterceptor()).addPathPatterns("/**")
                .excludePathPatterns("/css/**", "/js/**", "/myjs/**", "/sass/**", "/assets/**", "/system/**");
    }

    class SessionHandlerInterceptor implements HandlerInterceptor {
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
//            if (!redisUtil.hasKey("outputModel")) {
//                redisUtil.set("outputModel", outputService.findAllOutputModelByActivate(true), outputRedisTime);
//            }
//            if (!redisUtil.hasKey("outputType")) {
//                redisUtil.set("outputType", outputService.findAllOutputTypeByActivate(true), outputRedisTime);
//            }

            return true;
        }
    }
}
