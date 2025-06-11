package com.example.be_job_hunt.exception;

import com.example.be_job_hunt.dto.ErrorResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.NoHandlerFoundException;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalException {
    @ExceptionHandler(DuplicateException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateException(DuplicateException de) {
        // Log the detailed error information for debugging
        System.out.println("Duplicate Exception occurred: " + de.getMessage());
        if (de.getSourceMethod() != null) {
            System.out.println("Source method: " + de.getSourceMethod());
        }
        if (de.getErrorDetails() != null) {
            System.out.println("Error details: " + de.getErrorDetails());
        }
        
        // Print stack trace for debugging
        de.printStackTrace();
        
        // Only return the user-friendly message to the client
        ErrorResponse errorResponse = new ErrorResponse(
                de.getMessage(),
                HttpStatus.CONFLICT.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }
    
    @ExceptionHandler(AuthenticationFailedException.class)
    public ResponseEntity<ErrorResponse> handleAuthenticationFailedException(AuthenticationFailedException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                ex.getMessage(),
                HttpStatus.UNAUTHORIZED.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }
    
    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentialsException(BadCredentialsException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "Thông tin đăng nhập không chính xác",
                HttpStatus.UNAUTHORIZED.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }
    
    @ExceptionHandler(UsernameNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleUsernameNotFoundException(UsernameNotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                "Tên đăng nhập không tồn tại",
                HttpStatus.UNAUTHORIZED.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.UNAUTHORIZED);
    }
    
    @ExceptionHandler(NotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFoundException(NotFoundException ex) {
        ErrorResponse errorResponse = new ErrorResponse(
                ex.getMessage(),
                HttpStatus.NOT_FOUND.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }
    
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGenericException(Exception ex) {
        // Log detailed error information for debugging
        System.out.println("Exception occurred: " + ex.getClass().getName());
        System.out.println("Message: " + ex.getMessage());
        System.out.println("Cause: " + (ex.getCause() != null ? ex.getCause().toString() : "None"));
        
        // Print stack trace with line numbers for debugging
        ex.printStackTrace();
        
        // Get the class and line number where the exception occurred
        StackTraceElement[] stackTrace = ex.getStackTrace();
        String errorLocation = "";
        if (stackTrace.length > 0) {
            StackTraceElement element = stackTrace[0];
            errorLocation = " [" + element.getClassName() + "." + element.getMethodName() + 
                            " (dòng " + element.getLineNumber() + ")]";
        }
        
        // Only return a user-friendly message to the client
        ErrorResponse errorResponse = new ErrorResponse(
                "Lỗi hệ thống: " + ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                LocalDateTime.now()
        );
        return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
