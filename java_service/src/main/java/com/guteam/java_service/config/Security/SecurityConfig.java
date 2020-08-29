package com.guteam.java_service.config.Security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)  //  启用方法级别的权限认证
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    /**
     * 配置http相关安全特性
     */
    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http.authorizeRequests()
//                .antMatchers("/**").permitAll()
                .antMatchers("/css/**", "/js/**", "/sass/**", "/assets/**", "/system/**", "/login/*").permitAll()
                .antMatchers("/**").hasAnyRole("USER", "ADMIN", "SUPER_ADMIN")
                .anyRequest()
                .authenticated()
                .and()
                .formLogin()
                .loginPage("/login").permitAll()//这里程序默认路径就是登陆页面，允许所有人进行登陆
                .loginProcessingUrl("/logging")//登陆提交的处理url
                .failureForwardUrl("/login?error=true")//登陆失败进行转发，这里回到登陆页面，参数error可以告知登陆状态
                .defaultSuccessUrl("/index")//登陆成功的url，这里去到个人首页
                .and()
                .logout()
                .logoutUrl("/logout").permitAll()
                .logoutSuccessUrl("/login?logout=true")//按顺序，第一个是登出的url，security会拦截这个url进行处理，所以登出不需要我们实现，第二个是登出url，logout告知登陆状态
                .and()
                .rememberMe()
                .tokenValiditySeconds(604800)//记住我功能，cookies有限期是一周
                .rememberMeParameter("remember-me")//登陆时是否激活记住我功能的参数名字，在登陆页面有展示
                .rememberMeCookieName("workspace");//cookies的名字，登陆后可以通过浏览器查看cookies名字
        http.sessionManagement().
                maximumSessions(1).
                expiredUrl("/login");
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(myUserDetailsService).passwordEncoder(passwordEncoder());
    }

    /**
     * 密码hash算法
     *
     * @return
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }


//    @Bean
//    public AuthenticationSuccessHandler authenticationSuccessHandler(){
//        return new
//    }
//    /**
//     * 认证失败后的处理器
//     *
//     * @return
//     */
//    @Bean
//    public AuthenticationFailureHandler authenticationFailureHandler() {
//        return new CustomAuthenticationFailHandler();
//    }
//
//    /**
//     * 退出登陆处理器
//     * @return
//     */
//    @Bean
//    public LogoutSuccessHandler logoutSuccessHandler() {
//        return new CustomLogoutHandler();
//    }
//
//    /**
//     * 权限验证失败处理器
//     * @return
//     */
//    @Bean
//    public AccessDeniedHandler accessDeniedHandler() {
//        return new CustomAccessDeniedHandler();
//    }

}