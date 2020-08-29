//package com.guteam.java_service.Listener;
//
//import matlabcontrol.*;
//
//import javax.servlet.ServletContextEvent;
//import javax.servlet.ServletContextListener;
//
//public class MatlabListener implements ServletContextListener {
//    @Override
//    public void contextInitialized(ServletContextEvent sce) {
////        File file = new File("D:\\myWork\\Matlab2018b");//m文件所在根目录，可以任意，并不是m文件的绝对路径噢。
////        MatlabProxyFactoryOptions options = new MatlabProxyFactoryOptions.Builder()
////                .setProxyTimeout(300000L)
////                .setMatlabStartingDirectory(file)
////                .setHidden(false)
////                .build();
////        MatlabProxyFactory factory = new MatlabProxyFactory(options);
////        MatlabProxy proxy = null;
////        try {
////            proxy = factory.getProxy();
////        }catch (MatlabConnectionException e) {
////            e.printStackTrace();
////        }
////        sce.getServletContext().setAttribute("proxy", proxy);
//
//        System.out.println("matlab连接成功");
//    }
//
//    @Override
//    public void contextDestroyed(ServletContextEvent sce) {
//        MatlabProxy proxy = (MatlabProxy) sce.getServletContext().getAttribute("proxy");
//        try {
//            proxy.exit();
//        } catch (MatlabInvocationException e) {
//            // TODO Auto-generated catch block
//            e.printStackTrace();
//        }
//        System.out.println("matlab销毁");
//    }
//}
