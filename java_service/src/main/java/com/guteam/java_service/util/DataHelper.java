//package com.guteam.java_service.util;
//
//import com.alibaba.fastjson.JSONObject;
//import com.guteam.java_service.entity.Show;
//
//import java.util.List;
//
//public class DataHelper {
//    public double[][] StringToList(String data) {
//        if (data.contains("[[")) {
//            String[] data_split = data.replace("[[", "").replace("]]", "").split("\\],\\[");
//            int len = data_split.length;
//
//            double[][] d = new double[len][];
//            for (int i = 0; i < len; i++) {
//                String[] c = data_split[i].split(",");
//                int len1 = c.length;
//                double[] doubles = new double[len1];
//                for (int j = 0; j < len1; j++) {
//                    doubles[j] = Double.parseDouble(c[j]);
//                }
//                d[i] = doubles;
//            }
//            return d;
//        } else {
//            String[] data_split = data.replace("[", "").replace("]", "").split(",");
//            int len = data_split.length;
//
//            double[][] d = new double[len][];
//            for (int i = 0; i < len; i++) {
//                double[] doubles = new double[1];
//                doubles[0] = Double.parseDouble(data_split[i]);
//                d[i] = doubles;
//            }
//            return d;
//        }
//
//    }
//
//    public JSONObject DataProcess(JSONObject data, List<Show> outputList) {
//
//        JSONObject data_temp = data;
//        List<Show> outputList_temp = outputList;
//
//        int len = outputList.size();
//
//        for (int i = 0; i < len; i++) {
//            Show output1 = outputList.get(i);
//            if (output1.getOutputType().equals("test_predict")) {
//                for (int j = 0; j < len; j++) {
//                    Show output2 = outputList.get(j);
//
//                    if (output2.getOutputType().equals("y_test") || output2.getOutputType().equals("set_test")) {
//                        double[][] array1 = StringToList(data.get(output1.getOutputKey()).toString());
//                        double[][] array2 = StringToList(data.get(output2.getOutputKey()).toString());
//
//                        if (array1.length != array2.length) {
//                            break;
//                        }
//
//                        double[][] newArray = new double[array1.length][2];
//                        if (output2.getOutputType().equals("y_test")) {
//                            for (int k = 0; k < array1.length; k++) {
//                                newArray[k][0] = array1[k][0];
//                                newArray[k][1] = array2[k][0];
//                            }
//                        }
//                        else if (output2.getOutputType().equals("set_test")) {
//                            for (int k = 0; k < array1.length; k++) {
//                                newArray[k][0] = array1[k][0];
//                                newArray[k][1] = array2[k][array2[0].length - 1];
//                            }
//                        }
//                        data_temp.put("test_and_predict", newArray);
//                        Show output = new Show();
//                        output.setOutputKey("test_and_predict");
//                        output.setOutputType("test_and_predict");
//                        output.setOutputName("测试值与预测值对比");
//                        outputList_temp.add(output);
//
//                        break;
//                    }
//                }
//            }
//
//            else if (output1.getOutputType().equals("train_predict")) {
//                for (int j = 0; j < len; j++) {
//                    Show output2 = outputList.get(j);
//
//                    if (output2.getOutputType().equals("y_test") || output2.getOutputType().equals("set_test")) {
//                        double[][] array1 = StringToList(data.get(output1.getOutputKey()).toString());
//                        double[][] array2 = StringToList(data.get(output2.getOutputKey()).toString());
//
//                        if (array1.length != array2.length) {
//                            break;
//                        }
//
//                        double[][] newArray = new double[array1.length][2];
//                        if (output2.getOutputType().equals("y_train")) {
//                            for (int k = 0; k < array1.length; k++) {
//                                newArray[k][0] = array1[k][0];
//                                newArray[k][1] = array2[k][0];
//                            }
//                        }
//                        if (output2.getOutputType().equals("set_train")) {
//                            for (int k = 0; k < array1.length; k++) {
//                                newArray[k][0] = array1[k][0];
//                                newArray[k][1] = array2[k][array2[0].length - 1];
//                            }
//                        }
//                        data_temp.put("train_and_predict", newArray);
//                        Show output = new Show();
//                        output.setOutputKey("train_and_predict");
//                        output.setOutputType("train_and_predict");
//                        output.setOutputName("测试值与预测值对比");
//                        outputList_temp.add(output);
//
//                        break;
//                    }
//                }
//            }
//        }
//
//
//        JSONObject object = new JSONObject();
//        object.put("data",data_temp);
//        object.put("output",outputList_temp);
//
//        return object;
//
//    }
//
//
//}
