package com.guteam.java_service.config.Redis;

import com.fasterxml.jackson.annotation.JsonAutoDetect;
import com.fasterxml.jackson.annotation.PropertyAccessor;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.pool2.impl.GenericObjectPoolConfig;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.cache.CacheManager;
import org.springframework.cache.annotation.CachingConfigurerSupport;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.cache.interceptor.KeyGenerator;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.cache.RedisCacheManager;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.jedis.JedisClientConfiguration;
import org.springframework.data.redis.connection.jedis.JedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettucePoolingClientConfiguration;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.JdkSerializationRedisSerializer;
import org.springframework.data.redis.serializer.RedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;
import redis.clients.jedis.JedisPoolConfig;

import java.lang.reflect.Method;

@Configuration
@EnableCaching // 启用缓存，这个注解很重要；
public class RedisConfig extends CachingConfigurerSupport {
    /**
     * 配置lettuce连接池
     *
     * @return
     */
    @Bean("redisPool1")
    @ConfigurationProperties(prefix = "spring.redis.lettuce.pool")
    public GenericObjectPoolConfig redisPool() {
        return new GenericObjectPoolConfig();
    }

    @Bean("redisPool2")
    @ConfigurationProperties(prefix = "spring.redis2.lettuce.pool")
    public GenericObjectPoolConfig redisPool2() {
        return new GenericObjectPoolConfig();
    }

    @Bean("redisPool3")
    @ConfigurationProperties(prefix = "spring.redis3.lettuce.pool")
    public GenericObjectPoolConfig redisPool3() {
        return new GenericObjectPoolConfig();
    }

    /**
     * 配置第一个数据源的
     *
     * @return
     */
    @Bean("redisConfig1")
    @ConfigurationProperties(prefix = "spring.redis")
    public RedisStandaloneConfiguration redisConfig() {
        return new RedisStandaloneConfiguration();
    }

    @Bean("redisConfig2")
    @ConfigurationProperties(prefix = "spring.redis2")
    public RedisStandaloneConfiguration redisConfig2() {
        return new RedisStandaloneConfiguration();
    }

    @Bean("redisConfig3")
    @ConfigurationProperties(prefix = "spring.redis3")
    public RedisStandaloneConfiguration redisConfig3() {
        return new RedisStandaloneConfiguration();
    }

    /**
     * 配置数据源的连接工厂
     * 这里注意：需要添加@Primary 指定bean的名称，目的是为了创建两个不同名称的LettuceConnectionFactory
     *
     * @param config
     * @param redisConfig
     * @return
     */
    @Bean("factory1")
    @Primary
    public LettuceConnectionFactory factory(@Qualifier("redisPool1") GenericObjectPoolConfig config, @Qualifier("redisConfig1") RedisStandaloneConfiguration redisConfig) {
        LettuceClientConfiguration clientConfiguration = LettucePoolingClientConfiguration.builder().poolConfig(config).build();
        return new LettuceConnectionFactory(redisConfig, clientConfiguration);
    }

    @Bean("factory2")
    public LettuceConnectionFactory factory2(@Qualifier("redisPool2") GenericObjectPoolConfig config, @Qualifier("redisConfig2") RedisStandaloneConfiguration redisConfig) {
        LettuceClientConfiguration clientConfiguration = LettucePoolingClientConfiguration.builder().poolConfig(config).build();
        return new LettuceConnectionFactory(redisConfig, clientConfiguration);
    }

    @Bean("factory3")
    public LettuceConnectionFactory factory3(@Qualifier("redisPool3") GenericObjectPoolConfig config, @Qualifier("redisConfig3") RedisStandaloneConfiguration redisConfig) {
        LettuceClientConfiguration clientConfiguration = LettucePoolingClientConfiguration.builder().poolConfig(config).build();
        return new LettuceConnectionFactory(redisConfig, clientConfiguration);
    }

    /**
     * 配置第一个数据源的RedisTemplate
     * 注意：这里指定使用名称=factory2 的 RedisConnectionFactory
     *
     * @param factory
     * @return
     */
    @Bean("redisTemplate1")
    @Primary
    public RedisTemplate<String, Object> redisTemplate(@Qualifier("factory1") RedisConnectionFactory factory) {
        return getStringStringRedisTemplate(factory);
    }


    @Bean("redisTemplate2")
    public RedisTemplate<String, Object> redisTemplate2(@Qualifier("factory2") RedisConnectionFactory factory) {
        return getStringStringRedisTemplate(factory);
    }

    @Bean("redisTemplate3")
    public RedisTemplate<String, Object> redisTemplate3(@Qualifier("factory3") RedisConnectionFactory factory) {
        return getStringStringRedisTemplate(factory);
    }



    /**
     * 设置序列化方式 （这一步不是必须的）
     *
     * @param factory
     * @return
     */
    private RedisTemplate<String, Object> getStringStringRedisTemplate(RedisConnectionFactory factory) {
        RedisTemplate<String, Object> template = new RedisTemplate<>();
        Jackson2JsonRedisSerializer jackson2JsonRedisSerializer = new Jackson2JsonRedisSerializer(Object.class);
        ObjectMapper om = new ObjectMapper();
        om.setVisibility(PropertyAccessor.ALL, JsonAutoDetect.Visibility.ANY);
        om.enableDefaultTyping(ObjectMapper.DefaultTyping.NON_FINAL);
        jackson2JsonRedisSerializer.setObjectMapper(om);
        StringRedisSerializer stringRedisSerializer = new StringRedisSerializer();
        // key采用String的序列化方式
        template.setKeySerializer(stringRedisSerializer);
        // hash的key也采用String的序列化方式
        template.setHashKeySerializer(stringRedisSerializer);
        // value序列化方式采用jackson
        template.setValueSerializer(jackson2JsonRedisSerializer);
        // hash的value序列化方式采用jackson
        template.setHashValueSerializer(jackson2JsonRedisSerializer);
        template.afterPropertiesSet();
        return template;
    }

}
