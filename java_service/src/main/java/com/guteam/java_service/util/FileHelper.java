package com.guteam.java_service.util;

import com.alibaba.fastjson.JSONObject;
import com.guteam.java_service.entity.SetFile;
import com.jmatio.io.MatFileReader;
import com.jmatio.types.MLArray;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;
import java.nio.channels.FileChannel;
import java.text.DecimalFormat;
import java.text.SimpleDateFormat;
import java.util.*;

@Component
public class FileHelper {
    private boolean checkStringNotNull(String s) {
        return (s == null || s.isEmpty());
    }

    public List<String> getFileName(String dir) {
        if (checkStringNotNull(dir)) {
            return new ArrayList<>();
        }
        File file = new File(dir);
        File[] files = file.listFiles();
        if (files == null) {
            return new ArrayList<>();
        }

        List<String> fileList = new ArrayList<>();
        for (File file_temp : files) {
            if (file_temp.isFile()) {
                fileList.add(file_temp.getName());
            }
        }
        return fileList;
    }

    public List<SetFile> getOnlyFileList(String dir) {
        List<SetFile> list = new ArrayList<>();

        File file = new File(dir);
        if (!file.exists()) {
            return null;
        } else {
            File[] files = file.listFiles();
            SimpleDateFormat dateFormat = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
            for (File value : files) {
                SetFile setFile = new SetFile();
                if (value.isFile()) {
                    setFile.setFileType(1);
                    setFile.setFileName(value.getName());
                    setFile.setFileSize(getFileSize(value.length()));
                    setFile.setFileLongSize(value.length());
                    setFile.setFileFormat(getFileType(value.getName()));
                    setFile.setFileUpdateTime(dateFormat.format(value.lastModified()));
                    setFile.setFilePath(value.getParent() + "/");
                    list.add(setFile);
                }
            }
        }
        return list;
    }

    public List<SetFile> getFileList(String dir) {
        List<SetFile> list = new ArrayList<>();

        File file = new File(dir);
        if (!file.exists()) {
            return null;
        } else if (file.isFile()) {
            list = getFileList(file.getParent());
            return list;
        } else {
            File[] files = file.listFiles();
            SimpleDateFormat dateFormat = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
            for (File value : files) {
                SetFile setFile = new SetFile();
                if (value.isFile()) {
                    setFile.setFileType(1);
                    setFile.setFileName(value.getName());
                    setFile.setFileSize(getFileSize(value.length()));
                    setFile.setFileLongSize(value.length());
                    setFile.setFileFormat(getFileType(value.getName()));
                    setFile.setFileUpdateTime(dateFormat.format(value.lastModified()));
                    setFile.setFilePath(value.getParent() + "/");
                    list.add(setFile);
                } else if (value.isDirectory()) {
                    long fileLongSize = getDirOrFileSize(value);
                    setFile.setFileName(value.getName());
                    setFile.setFileType(0);
                    setFile.setFileSize(getFileSize(fileLongSize));
                    setFile.setFileLongSize(fileLongSize);
                    setFile.setFileFormat("文件夹");
                    setFile.setFileUpdateTime(dateFormat.format(value.lastModified()));
                    setFile.setFilePath(value.getParent() + "/");
                    list.add(setFile);
                }
            }
        }
        return list;
    }

    public long getDirOrFileSize(File file) {
        if (file.isFile()) {
            return file.length();
        } else if (file.isDirectory()) {
            long size_temp = 0;
            File[] files = file.listFiles();
            if (files == null) {
                return size_temp;
            }
            for (File value : files) {
                if (value.isFile()) {
                    size_temp += value.length();
                } else if (value.isDirectory()) {
                    size_temp += getDirOrFileSize(value);
                }

            }
            return size_temp;
        } else {
            return 0;
        }

    }


    public List<SetFile> getDirList(String dir) {
        List<SetFile> list = new ArrayList<>();

        File file = new File(dir);
        if (!file.exists()) {
            return null;
        } else if (file.isDirectory()) {
            File[] files = file.listFiles();
            SimpleDateFormat dateFormat = new SimpleDateFormat("YYYY-MM-dd HH:mm:ss");
            for (int i = 0; i < files.length; i++) {
                SetFile setFile = new SetFile();
                if (files[i].isDirectory()) {
                    setFile.setFileName(files[i].getName());
                    setFile.setFileUpdateTime(dateFormat.format(files[i].lastModified()));
                    setFile.setFilePath(files[i].getParent() + "/");
                    list.add(setFile);
                }
            }
        }
        return list;
    }

    public List<JSONObject> getFileAndChild(String dir) {
        List<JSONObject> list = new ArrayList<>();

        File file = new File(dir);
        if (!file.exists()) {
            return null;
        }
        JSONObject jsonObject = new JSONObject();
        jsonObject.put("file", file.toString());
        if (file.isFile()) {
            jsonObject.put("type", 1);
            list.add(jsonObject);
        } else {
            jsonObject.put("type", 0);
            list.add(jsonObject);

            File[] files = file.listFiles();

            for (File file1 : files) {
                list.addAll(getFileAndChild(file1.toString()));
            }
        }
        return list;
    }


    public Integer getSameFileNameNumber(String dir, String[] fileNameList) {
        File file = new File(dir);
        System.out.println(dir);
        if (!file.isDirectory()) {
            return -1;
        }
        File[] list = file.listFiles();
        Integer count = 0;
        for (File f : list) {
            if (f.isFile() && (Arrays.binarySearch(fileNameList, f.getName()) > 0)) {
                count++;
            }
        }
        return count;
    }

    public String getFileSize(long fileSize) {
        DecimalFormat df = new DecimalFormat("#.00");
        String fileSizeString = "";
        if (fileSize == 0) {
            fileSizeString = "0 B";
        } else if (fileSize < 1024) {
            fileSizeString = df.format((double) fileSize) + " B";
        } else if (fileSize < 1048576) {
            fileSizeString = df.format((double) fileSize / 1024) + " KB";
        } else if (fileSize < 1073741824) {
            fileSizeString = df.format((double) fileSize / 1048576) + " MB";
        } else {
            fileSizeString = df.format((double) fileSize / 1073741824) + " GB";
        }
        return fileSizeString;
    }

    public File[] getPathAndFileName(String dir) {
        if (dir == null || "".equals(dir)) {
            return null;
        }
        File file = new File(dir);
        File[] files = file.listFiles();
        return files;
    }

    public boolean isExists(String file) {
        if (file == null || "".equals(file)) {
            return false;
        }
        File f = new File(file);
        return f.exists();
    }

    public boolean isFile(String file) {
        if (file == null || "".equals(file)) {
            return false;
        }
        File f = new File(file);
        return f.isFile();
    }

    public boolean isDir(String dir) {
        if (dir == null || "".equals(dir)) {
            return false;
        }
        File f = new File(dir);
        return f.isDirectory();
    }


    public void createDir(String dir) {
        File fileDir = new File(dir);

        if (!isExists(dir)) {
            fileDir.mkdirs();
        }
    }

    public String createNewDir(String dir, String fileName) {
        File file1 = new File(dir);
        File file2 = new File(dir + fileName);
        if (!file1.exists()) {
            return "源目录不存在";
        }
        if (file2.exists()) {
            return "目标目录下存在同名文件夹";
        }
        return file2.mkdir() == true ? "true" : "创建失败,请检查文件夹名字格式";
    }

    public String changeFileName(String dir, String fileName, String newFileName) {
        File dir_ = new File(dir);
        if (!dir_.exists()) {
            return "源目录不存在";
        }
        File fileName_ = new File(dir + "/" + fileName);
        if (!fileName_.exists()) {
            return "源文件不存在";
        }
        File newFileName_ = new File(dir + "/" + newFileName);
        if (!newFileName.equals(fileName)) {
            if (newFileName_.exists()) {
                return "目标目录中存在同名文件";
            }

            try {
                newFileName_.createNewFile();
            } catch (IOException e) {
                return "文件名格式错误";
            }
            newFileName_.delete();
            fileName_.renameTo(newFileName_);
        }

        return "true";
    }

    public String copyFile(String[] fileNameList, String dir, String newDir) {
        if (fileNameList.length == 0) {
            return "未选择将要复制的文件";
        }

        File file1 = new File(dir);
        if (!file1.exists()) {
            return "源目录不存在";
        }
        if (file1.isFile()) {
            return "源目录错误";
        }
        File file2 = new File(newDir);
        if (!file2.exists()) {
            return "目标目录不存在";
        }
        if (file2.isFile()) {
            return "目标目录错误";
        }

        String temp = file2.toString().replace(file1.toString(), "").replace("\\", "/");
        if (temp.split("/").length > 1) {
            if (Arrays.asList(fileNameList).contains(temp.split("/")[1])) {
                return "目标目录是源目录的子文件夹";
            }
        }


        SimpleDateFormat ft = new SimpleDateFormat("yyyyMMddhhmmss");
        for (String file : fileNameList) {
            File file11 = new File(dir + file);
            File file22 = new File(newDir + file);

            if (!file11.exists()) {
                return "源文件不存在";
            }

            if (file11.isDirectory()) {
                if (file22.exists()) {
                    Date dNow = new Date();
                    file22 = new File(newDir + file + "-复制-" + ft.format(dNow));
                }
                if (!file22.mkdirs()) {
                    return "源文件夹错误";
                }
                copyFile(file11.list(), file11.toString() + "/", file22.toString() + "/");
            } else {
                if (file22.exists()) {

                    Date dNow = new Date();
                    int index = file.lastIndexOf(".");
                    file22 = new File(newDir + file.substring(0, index) + "-复制-" + ft.format(dNow) + file.substring(index, file.length()));
                }
                FileChannel inputChannel = null;
                FileChannel outputChannel = null;
                try {
                    try {
                        inputChannel = new FileInputStream(file11).getChannel();
                        outputChannel = new FileOutputStream(file22).getChannel();
                        outputChannel.transferFrom(inputChannel, 0, inputChannel.size());
                    } finally {
                        inputChannel.close();
                        outputChannel.close();
                    }
                } catch (IOException e) {
                    e.printStackTrace();
                    return "复制过程中出错";
                }
            }
        }
        return "true";

    }

    public String moveFile(String[] fileNameList, String dir, String newDir) {
        if (fileNameList.length == 0) {
            return "未选择将要复制的文件";
        }

        File file1 = new File(dir);
        if (!file1.exists()) {
            return "源目录不存在";
        }
        if (file1.isFile()) {
            return "源目录错误";
        }
        File file2 = new File(newDir);
        if (!file2.exists()) {
            return "目标目录不存在";
        }
        if (file2.isFile()) {
            return "目标目录错误";
        }

        String temp = file2.toString().replace(file1.toString(), "").replace("\\", "/");
        if (temp.split("/").length > 1) {
            if (Arrays.asList(fileNameList).contains(temp.split("/")[1])) {
                return "目标目录是源目录的子文件夹";
            }
        }

        SimpleDateFormat ft = new SimpleDateFormat("yyyyMMddhhmmss");
        for (String file : fileNameList) {
            File file11 = new File(dir + file);
            File file22 = new File(newDir + file);

            if (!file11.exists()) {
                return "源文件不存在";
            }

            Date dNow = new Date();
            if (file22.exists() && !newDir.equals(dir)) {
                int index = file.lastIndexOf(".");
                file22 = new File(newDir + file.substring(0, index) + "-移动-" + ft.format(dNow) + file.substring(index, file.length()));
                file11.renameTo(file22);
            } else if (!file22.exists()) {
                file11.renameTo(file22);
            }
        }
        return "true";
    }

    public boolean deleteDir(File file) {
        if (!file.exists()) {
            return false;
        }
        if (file.isDirectory()) {
            File[] files = file.listFiles();
            for (File f : files) {
                deleteDir(f);
            }
        }
        return file.delete();
    }

    public boolean deleteDir(String dir) {
        File file = new File(dir);
        if (!file.exists()) {
            return false;
        }
        if (file.isDirectory()) {
            File[] files = file.listFiles();
            for (File f : files) {
                deleteDir(f);
            }
        }
        return file.delete();
    }

    public String deleteFile(String[] fileNameList, String dir) {
        File file1 = new File(dir);
        if (!file1.exists()) {
            return "源目录不存在";
        }
        if (file1.isFile()) {
            return "源目录错误";
        }

        for (String file : fileNameList) {
            File file2 = new File(dir + file);

            if (!file2.exists()) {
                return "源文件不存在";
            }

            if (file2.isDirectory()) {
                String[] a = file2.list();
                if (a.length == 0) {
                    file2.delete();
                } else {
                    deleteFile(a, dir + file + "/");
                }
            } else {
                file2.delete();
            }
            file2.delete();
        }

        return "true";

    }

    public String deleteFile(String fileName, String dir) {
        File file1 = new File(dir);
        if (!file1.exists()) {
            return "源目录不存在";
        }
        if (file1.isFile()) {
            return "源目录错误";
        }

        File file2 = new File(dir + fileName);

        if (!file2.exists()) {
            return "源文件不存在";
        }

        if (file2.isDirectory()) {
            String[] a = file2.list();
            if (a.length == 0) {
                file2.delete();
            } else {
                deleteFile(a, dir + fileName + "/");
            }
        } else {
            file2.delete();
        }


        return "true";

    }

    public void createFile(String file) {
        File fileDir = new File(file);
        if (!isExists(file)) {
            try {
                fileDir.createNewFile();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public String getFileType(String fileName) {
        String fileName_split[] = fileName.split("\\.");
        return fileName_split[fileName_split.length - 1];
    }

    public boolean uploadFile(MultipartFile[] files, String dir) {
        for (MultipartFile file : files) {
            String fileName = file.getOriginalFilename();
            File dest = new File(dir + fileName);
            try {
                file.transferTo(dest);
            } catch (IOException e) {
                return false;
            }
        }
        return true;
    }

    public JSONObject uploadFile(MultipartFile file, String dir, boolean uuid) {
        String fileName = file.getOriginalFilename();
        JSONObject back = new JSONObject();
        if (uuid) {
            back.put("fileNameBefore",fileName);
            String[] fileNameSplit = fileName.split("\\.");
            fileName = UUID.randomUUID().toString().replaceAll("-", "") +"."+ fileNameSplit[fileNameSplit.length - 1];
        } else {
            fileName = file.getOriginalFilename();
        }
        File dest = new File(dir + fileName);
        try {
            file.transferTo(dest);
            back.put("sign",true);
            back.put("fileName",fileName);
        } catch (IOException e) {
            back.put("sign",false);
        }
        return back;
    }

    public JSONObject getMatKey(String file) {
        MatFileReader reader;

        JSONObject back = new JSONObject();
        try {
            reader = new MatFileReader(file);
            Map<String, MLArray> MatContent = reader.getContent();

            if (MatContent.keySet().size() > 0) {
                List<String> keyList = new ArrayList<>(MatContent.keySet());
                back.put("keyList", keyList);
            } else {
                back.put("keyList", null);
            }

        } catch (IOException e) {
            e.printStackTrace();
        }
        return back;
    }

    //
//    public boolean saveSetInfo(String dir, String fileName, double[][] data) {
//        String file_split[] = fileName.split(":");
//
//        String fileName_split[] = file_split[0].split("\\.");
//        String fileType = fileName_split[fileName_split.length - 1];
//
//        if (fileType.equals("mat")) {
//            ArrayList list = new ArrayList();
//
//            List<String> matNameList = getSetList(new File(dir + file_split[0]));
//
//            for (String matName : matNameList) {
//                String keyName = matName.split(":")[1];
//                if (keyName.equals(file_split[1])) {
//                    list.add(new MLDouble(file_split[1], data));
//                } else {
//                    list.add(new MLDouble(keyName, (double[][]) getSetInfo(dir, matName).get("set")));
//                }
//            }
//
//            try {
//                new MatFileWriter(dir + file_split[0], list);
//            } catch (IOException e) {
//                e.printStackTrace();
//                return false;
//            }
//            return true;
//        } else if (fileType.equals("csv") || fileType.equals("txt"))
//
//        {
//            CsvWriter csvWriter = new CsvWriter(dir + file_split[0], ',', Charset.forName("UTF-8"));
//            for (double[] c : data) {
//                int len = c.length;
//                String[] s = new String[len];
//                for (int i = 0; i < len; i++) {
//                    s[i] = String.valueOf(c[i]);
//                }
//                try {
//                    csvWriter.writeRecord(s);
//                } catch (IOException e) {
//                    e.printStackTrace();
//                    return false;
//                }
//            }
//            csvWriter.close();
//            return true;
//        }
//        return false;
//    }
//
//    public List<String> getSetList(File file) {
//        List<String> list = new ArrayList<>();
//
//        String fileName = file.getName();
//        String file_split[] = fileName.split("\\.");
//        String fileType = file_split[file_split.length - 1];
//        if (fileType.equals("mat")) {
//            try {
//                MatFileReader read = new MatFileReader(file);
//                for (String key : read.getContent().keySet()) {
//                    list.add(fileName + ":" + key);
//                }
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        } else if (fileType.equals("csv") || fileType.equals("txt")) {
//            list.add(fileName);
//        }
//
//        return list;
//    }
//
//    public JSONObject getSetInfo(File file) {
//        String fileName = file.getName();
//
//        String fileType = getFileType(fileName);
//
//        JSONObject jsonObject = new JSONObject();
//
//        if (fileType.equals("mat")) {
//            try {
//                MatFileReader read = new MatFileReader(file);
//                MLArray mlArray = read.getMLArray(file_split[1]);
//                MLDouble d = (MLDouble) mlArray;
//                double[][] matrix = (d.getArray());
//                List<String> label = new ArrayList<>();
//                int len = matrix[0].length;
//                for (int i = 0; i < len; i++) {
//                    label.add("第" + (i + 1) + "列");
//                }
//                jsonObject.put("set", matrix);
//                jsonObject.put("label", label);
//                return jsonObject;
//
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//        } else if (fileType.equals("csv") || fileType.equals("txt")) {
//            BufferedReader br = null;
//            File file = new File(dir + file_split[0]);
//            try {
////                br = new BufferedReader(new FileReader(dir + file_split[0]));
//                br = new BufferedReader(new InputStreamReader(new FileInputStream(file), "gbk"));
//            } catch (Exception e) {
//                e.printStackTrace();
//            }
//            String line;
//            List<List<Double>> set = new ArrayList<>();
//            List<String> label = null;
//
//            try {
//                while ((line = br.readLine()) != null) {
//                    String numList[] = line.split(",");
//                    List<Double> setLine = new ArrayList<>();
//                    if (numList[0].matches("-?[0-9]+.*[0-9]*")) {
//                        for (int i = 0; i < numList.length; i++) {
//                            setLine.add(Double.valueOf(numList[i]));
//                        }
//                        set.add(setLine);
//                    } else {
//                        label = new ArrayList<>();
//                        for (int i = 0; i < numList.length; i++) {
//                            label.add(numList[i]);
//                        }
//                    }
//
//                }
//            } catch (IOException e) {
//                e.printStackTrace();
//            }
//            jsonObject.put("set", set);
//            if (label != null) {
//                jsonObject.put("label", label);
//            } else {
//                label = new ArrayList<>();
//                int len = set.get(0).size();
//                for (int i = 0; i < len; i++) {
//                    label.add("第" + (i + 1) + "列");
//                }
//                jsonObject.put("label", label);
//            }
//
//            return jsonObject;
//        }
//        return null;
//    }
//
//
//    /**
//     * 读入TXT文件
//     */
    public String readTxt(String file) {
        String back = "";
        try (FileReader reader = new FileReader(file);
             BufferedReader br = new BufferedReader(reader) // 建立一个对象，它把文件内容转成计算机能读懂的语言
        ) {
            String line;
            while ((line = br.readLine()) != null) {
                back += line;
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
        return back;
    }

    /**
     * 写入TXT文件
     */
    public boolean writeTxt(String file, String data) {
        try {
            File writeName = new File(file); // 相对路径，如果没有则要建立一个新的output.txt文件
            if (!writeName.exists()) {
                writeName.createNewFile();
            }
            try (
                    FileWriter writer = new FileWriter(writeName);
                    BufferedWriter out = new BufferedWriter(writer)
            ) {
                out.write(data); // \r\n即为换行
                out.flush(); // 把缓存区内容压入文件
                return true;
            }

        } catch (IOException e) {
            e.printStackTrace();
            return false;
        }
    }

    /**
     * 以字节为单位读取文件，常用于读二进制文件，如图片、声音、影像等文件。
     */
    public void readFileByBytes(String fileName) {
        File file = new File(fileName);
        InputStream in = null;
        try {
            System.out.println("以字节为单位读取文件内容，一次读一个字节：");
            // 一次读一个字节
            in = new FileInputStream(file);
            int tempbyte;
            while ((tempbyte = in.read()) != -1) {
                System.out.write(tempbyte);
            }
            in.close();
        } catch (IOException e) {
            e.printStackTrace();
            return;
        }
        try {
            System.out.println("以字节为单位读取文件内容，一次读多个字节：");
            // 一次读多个字节
            byte[] tempbytes = new byte[100];
            int byteread = 0;
            in = new FileInputStream(fileName);
            // 读入多个字节到字节数组中，byteread为一次读入的字节数
            while ((byteread = in.read(tempbytes)) != -1) {
                System.out.write(tempbytes, 0, byteread);
            }
        } catch (Exception e1) {
            e1.printStackTrace();
        } finally {
            if (in != null) {
                try {
                    in.close();
                } catch (IOException e1) {
                }
            }
        }
    }

    /**
     * 以字符为单位读取文件，常用于读文本，数字等类型的文件
     */
    public void readFileByChars(String fileName) {
        File file = new File(fileName);
        Reader reader = null;
        try {
            System.out.println("以字符为单位读取文件内容，一次读一个字节：");
            // 一次读一个字符
            reader = new InputStreamReader(new FileInputStream(file));
            int tempchar;
            while ((tempchar = reader.read()) != -1) {
                // 对于windows下，\r\n这两个字符在一起时，表示一个换行。
                // 但如果这两个字符分开显示时，会换两次行。
                // 因此，屏蔽掉\r，或者屏蔽\n。否则，将会多出很多空行。
                if (((char) tempchar) != '\r') {
                    System.out.print((char) tempchar);
                }
            }
            reader.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
        try {
            System.out.println("以字符为单位读取文件内容，一次读多个字节：");
            // 一次读多个字符
            char[] tempchars = new char[30];
            int charread = 0;
            reader = new InputStreamReader(new FileInputStream(fileName));
            // 读入多个字符到字符数组中，charread为一次读取字符数
            while ((charread = reader.read(tempchars)) != -1) {
                // 同样屏蔽掉\r不显示
                if ((charread == tempchars.length) && (tempchars[tempchars.length - 1] != '\r')) {
                    System.out.print(tempchars);
                } else {
                    for (int i = 0; i < charread; i++) {
                        if (tempchars[i] == '\r') {
                            continue;
                        } else {
                            System.out.print(tempchars[i]);
                        }
                    }
                }
            }

        } catch (Exception e1) {
            e1.printStackTrace();
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e1) {
                }
            }
        }
    }

    /**
     * 以行为单位读取文件，常用于读面向行的格式化文件
     */
    public String readFileByLines(String fileName) {
        StringBuilder stringBuilder = new StringBuilder();
        File file = new File(fileName);
        BufferedReader reader = null;
        try {
            reader = new BufferedReader(new FileReader(file));
            String tempString = null;
            // 一次读入一行，直到读入null为文件结束
            boolean annotationSign = false;
            while ((tempString = reader.readLine()) != null) {

                stringBuilder.append(tempString).append("\n");
            }
            reader.close();
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e1) {
                    System.out.println(e1);
                }
            }
        }
        return stringBuilder.toString();
    }

    /**
     * 随机读取文件内容
     */
    public void readFileByRandomAccess(String fileName) {
        RandomAccessFile randomFile = null;
        try {
            System.out.println("随机读取一段文件内容：");
            // 打开一个随机访问文件流，按只读方式
            randomFile = new RandomAccessFile(fileName, "r");
            // 文件长度，字节数
            long fileLength = randomFile.length();
            // 读文件的起始位置
            int beginIndex = (fileLength > 4) ? 4 : 0;
            // 将读文件的开始位置移到beginIndex位置。
            randomFile.seek(beginIndex);
            byte[] bytes = new byte[10];
            int byteread = 0;
            // 一次读10个字节，如果文件内容不足10个字节，则读剩下的字节。
            // 将一次读取的字节数赋给byteread
            while ((byteread = randomFile.read(bytes)) != -1) {
                System.out.write(bytes, 0, byteread);
            }
        } catch (IOException e) {
            e.printStackTrace();
        } finally {
            if (randomFile != null) {
                try {
                    randomFile.close();
                } catch (IOException e1) {
                }
            }
        }
    }

}
