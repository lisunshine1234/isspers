package com.guteam.java_service.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Transient;
import java.util.List;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class Output {
    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;
    private String outputTypeId;
    private String outputName;
    private String outputKey;
    private String outputDescribe;
    private String algorithmId;
    private Integer orderNum;
    @Transient
    private OutputType outputType;


    public Output() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOutputTypeId() {
        return outputTypeId;
    }

    public void setOutputTypeId(String outputTypeId) {
        this.outputTypeId = outputTypeId;
    }

    public String getOutputName() {
        return outputName;
    }

    public void setOutputName(String outputName) {
        this.outputName = outputName;
    }

    public String getOutputKey() {
        return outputKey;
    }

    public void setOutputKey(String outputKey) {
        this.outputKey = outputKey;
    }

    public String getOutputDescribe() {
        return outputDescribe;
    }

    public void setOutputDescribe(String outputDescribe) {
        this.outputDescribe = outputDescribe;
    }

    public String getAlgorithmId() {
        return algorithmId;
    }

    public void setAlgorithmId(String algorithmId) {
        this.algorithmId = algorithmId;
    }

    public OutputType getOutputType() {
        return outputType;
    }

    public void setOutputType(OutputType outputType) {
        this.outputType = outputType;
    }

    public Integer getOrderNum() {
        return orderNum;
    }

    public void setOrderNum(Integer orderNum) {
        this.orderNum = orderNum;
    }
}
