package com.guteam.java_service.entity;

public class SetFile {
    private String fileName;
    private Integer fileType;
    private String fileSize;
    private long fileLongSize;
    private String fileFormat;
    private String fileUpdateTime;
    private String filePath;

    public SetFile() {
    }

    public long getFileLongSize() {
        return fileLongSize;
    }

    public void setFileLongSize(long fileLongSize) {
        this.fileLongSize = fileLongSize;
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public Integer getFileType() {
        return fileType;
    }

    public void setFileType(Integer fileType) {
        this.fileType = fileType;
    }

    public String getFileSize() {
        return fileSize;
    }

    public void setFileSize(String fileSize) {
        this.fileSize = fileSize;
    }

    public String getFileFormat() {
        return fileFormat;
    }

    public void setFileFormat(String fileFormat) {
        this.fileFormat = fileFormat;
    }

    public String getFileUpdateTime() {
        return fileUpdateTime;
    }

    public void setFileUpdateTime(String fileUpdateTime) {
        this.fileUpdateTime = fileUpdateTime;
    }

    public String getFilePath() {
        return filePath;
    }

    public void setFilePath(String filePath) {
        this.filePath = filePath;
    }
}
