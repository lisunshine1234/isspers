package com.guteam.py_sidecar;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.EnableEurekaClient;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;
import org.springframework.cloud.netflix.sidecar.EnableSidecar;


@EnableSidecar
@EnableEurekaClient
@SpringBootApplication
public class PySidecarApplication {
    public static void main(String[] args) {
        SpringApplication.run(PySidecarApplication.class, args);
    }
}
