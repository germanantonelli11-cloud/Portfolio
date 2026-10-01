package com.example.demo;

public class ProjectItem {
    private String name;
    private boolean approved;
    
    //Constructor to build a project with a starting approval state
    public ProjectItem(String name, boolean approved) {
        this.name = name;
        this.approved = approved;
    }

    //Getters and Setters so SpringBoot and Thymeleaf can safely access the values
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isApproved() { return approved; }
    public void setApproved(boolean approved) { this.approved = approved; }
}