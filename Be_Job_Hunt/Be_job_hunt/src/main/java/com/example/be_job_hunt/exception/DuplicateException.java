package com.example.be_job_hunt.exception;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

public class DuplicateException extends Exception{
    private String errorDetails;
    private String sourceMethod;

    public DuplicateException(String message){
        super(message);
    }
    
    public DuplicateException(String message, String sourceMethod){
        super(message);
        this.sourceMethod = sourceMethod;
    }
    
    public DuplicateException(String message, String sourceMethod, String errorDetails){
        super(message);
        this.sourceMethod = sourceMethod;
        this.errorDetails = errorDetails;
    }
    
    public String getErrorDetails() {
        return errorDetails;
    }
    
    public String getSourceMethod() {
        return sourceMethod;
    }
}
