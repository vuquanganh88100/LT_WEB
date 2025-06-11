package com.example.be_job_hunt.exception;

import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;

public class DuplicateException extends Exception{
    public DuplicateException(String massage){
        super(massage);
    }
}
