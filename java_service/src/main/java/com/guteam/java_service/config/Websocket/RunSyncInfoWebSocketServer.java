package com.guteam.java_service.config.Websocket;


import com.guteam.java_service.config.Redis.RedisUtil2;
import com.guteam.java_service.service.JobService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.websocket.*;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@ServerEndpoint("/webSocket/algorithm/run/sync/{jobId}")
@Component
public class RunSyncInfoWebSocketServer {
    @Autowired
    private static JobService jobService;
    @Autowired
    private static RedisUtil2 redisUtil2;

    private static final String loggerName = RunSyncInfoWebSocketServer.class.getName();
    //concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。若要实现服务端与单一客户端通信的话，可以使用Map来存放，其中Key可以为用户标识
    public static Map<String, List<Session>> electricSocketMap = new ConcurrentHashMap<String, List<Session>>();

    /**
     * 连接建立成功调用的方法
     *
     * @param session 可选的参数。session为与某个客户端的连接会话，需要通过它来给客户端发送数据
     */
    @OnOpen
    public void onOpen(@PathParam("jobId") String jobId, Session session) {
        List<Session> sessions = electricSocketMap.get(jobId);

        if (null == sessions) {
            List<Session> sessionList = new ArrayList<>();
            sessionList.add(session);
            electricSocketMap.put(jobId, sessionList);
        } else {
            sessions.add(session);
        }
    }

    /**
     * 连接关闭调用的方法
     */
    @OnClose
    public void onClose(@PathParam("jobId") String jobId, Session session) {
        System.out.println("连接关闭");
        jobService.shutdownJobPassivity(jobId);

        if (redisUtil2.hasKey(jobId)) {
            redisUtil2.hdel(jobId, "websocket");
        }
        if (electricSocketMap.containsKey(jobId)) {
            electricSocketMap.get(jobId).remove(session);
        }
    }

    /**
     * 收到客户端消息后调用的方法
     *
     * @param jobId   客户端发送过来的消息
     * @param session 可选的参数
     */
    @OnMessage
    public void onMessage(String jobId, Session session) {
        if (redisUtil2.hasKey(jobId)) {
            redisUtil2.hset(jobId, "websocket", "");
            List<Object> msgList = null;
            boolean sign = true;
            long start = 0;
            try {
                while (sign) {
                    msgList = jobService.syncRunInfo(jobId, start);
                    if (msgList != null) {
                        StringBuilder sendMessage = new StringBuilder();
                        for (Object msg : msgList) {
                            if (msg.toString().equals("#done")) {
                                session.getBasicRemote().sendText("#done");
                                redisUtil2.hdel(jobId, "websocket");
                                sign = false;
                                break;
                            }
                            start += 1;
                            sendMessage.append(msg.toString());
                        }
                        if (sendMessage.length() > 0) {
                            session.getBasicRemote().sendText(sendMessage.toString());
                        }
                    }
                    Thread.sleep(10);
                }
            } catch (IOException | InterruptedException e) {

                if (redisUtil2.hasKey(jobId)) {
                    redisUtil2.hdel(jobId, "websocket");
                }
                if (electricSocketMap.containsKey(jobId)) {
                    electricSocketMap.get(jobId).remove(session);
                }
                System.out.println("错误，连接关闭");
//            e.printStackTrace();
            }
        }
    }

    /**
     * 发生错误时调用
     *
     * @param session
     * @param error
     */
    @OnError
    public void onError(Session session, Throwable error) {
        System.out.println(session);
        System.out.println(error);
        System.out.println("发生错误");
    }

    @Autowired
    public void setChatService(JobService jobService, RedisUtil2 redisUtil2) {
        RunSyncInfoWebSocketServer.jobService = jobService;
        RunSyncInfoWebSocketServer.redisUtil2 = redisUtil2;
    }
}
