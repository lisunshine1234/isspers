package com.guteam.java_service.config.Security;


import com.guteam.java_service.config.Redis.RedisUtil;
import com.guteam.java_service.entity.User;
import com.guteam.java_service.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    private UserService userService;
    @Autowired
    private RedisUtil redisUtil;

    /**
     * 授权的时候是对角色授权，而认证的时候应该基于资源，而不是角色，因为资源是不变的，而用户的角色是会变的
     */
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.findUserByUserName(username);
        if (null == user) {
            throw new UsernameNotFoundException(username);  //抛出异常，会根据配置跳到登录失败页面
        }
        List<GrantedAuthority> list = new ArrayList<>(); //GrantedAuthority是security提供的权限类，
        String password = passwordEncoder.encode(user.getPassword());
//        list.add(new SimpleGrantedAuthority("ROLE_" + user.getUserType().getUserTypeKey()));

        list.add(new SimpleGrantedAuthority("ROLE_ADMIN"));

        return new org.springframework.security.core.userdetails.User(user.getUserName(), password, true, true, true, user.isNonLock(), list);
    }
}