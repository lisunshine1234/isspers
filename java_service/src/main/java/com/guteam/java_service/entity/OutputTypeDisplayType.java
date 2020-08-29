package com.guteam.java_service.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
@GenericGenerator(name = "jpa-uuid", strategy = "uuid")
public class OutputTypeDisplayType {

    @Id
    @GeneratedValue(generator = "jpa-uuid")
    private String id;
    private String outputTypeId;
    private String displayTypeId;
    private boolean activate;

    public OutputTypeDisplayType() {
    }

    public boolean isActivate() {
        return activate;
    }

    public void setActivate(boolean activate) {
        this.activate = activate;
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

    public String getDisplayTypeId() {
        return displayTypeId;
    }

    public void setDisplayTypeId(String displayTypeId) {
        this.displayTypeId = displayTypeId;
    }
}
