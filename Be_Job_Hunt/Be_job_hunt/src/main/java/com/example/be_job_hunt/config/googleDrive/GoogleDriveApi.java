package com.example.be_job_hunt.config.googleDrive;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.InputStreamContent;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.List;

@Component
public class GoogleDriveApi {

    private static final String APPLICATION_NAME = "Elearning Project";
    
    // Read from application.properties or use default
    @Value("${google.service.account.key:edublog-credentials.json}")
    private String serviceAccountKeyPath;
    
    private static final String parentFolderId = "1WP5Pi4C0YlsGt7Veb7MQwCdteKOv9RqT";



    public Drive getDriveService() throws IOException, GeneralSecurityException {
        // Try to load from file system
        java.io.File credentialFile = new java.io.File(serviceAccountKeyPath);
        
        // If not found, try to load from classpath
        if (!credentialFile.exists()) {
            credentialFile = new java.io.File(System.getProperty("user.dir"), serviceAccountKeyPath);
        }
        
        // If still not found, try to load from resources
        if (!credentialFile.exists()) {
            try {
                java.io.InputStream inputStream = getClass().getClassLoader().getResourceAsStream(serviceAccountKeyPath);
                if (inputStream != null) {
                    GoogleCredential credential = GoogleCredential.fromStream(inputStream)
                            .createScoped(Collections.singleton(DriveScopes.DRIVE));
                    
                    return new Drive.Builder(
                            GoogleNetHttpTransport.newTrustedTransport(),
                            JacksonFactory.getDefaultInstance(),
                            credential
                    ).setApplicationName(APPLICATION_NAME).build();
                }
            } catch (Exception e) {
                // Fall through to next approach
            }
        }
        
        if (!credentialFile.exists()) {
            throw new IOException("Credential file not found at: " + serviceAccountKeyPath + 
                                 " or " + System.getProperty("user.dir") + "/" + serviceAccountKeyPath);
        }
        
        GoogleCredential credential = GoogleCredential.fromStream(
                        new FileInputStream(credentialFile))
                .createScoped(Collections.singleton(DriveScopes.DRIVE));

        return new Drive.Builder(
                GoogleNetHttpTransport.newTrustedTransport(),
                JacksonFactory.getDefaultInstance(),
                credential
        ).setApplicationName(APPLICATION_NAME).build();
    }

    public String createFolder(String folderName) throws IOException, GeneralSecurityException {
        Drive driveService = getDriveService();

        // Kiểm tra nếu đã có folder
        String folderId = getFolderIdByName(folderName);
        if (folderId != null) {
            return folderId;
        }

        // Tạo mới thư mục
        File fileMetadata = new File();
        fileMetadata.setName(folderName);
        fileMetadata.setMimeType("application/vnd.google-apps.folder");

        if (parentFolderId != null && !parentFolderId.isEmpty()) {
            fileMetadata.setParents(Collections.singletonList(parentFolderId));
        }

        File folder = driveService.files().create(fileMetadata)
                .setFields("id")
                .execute();

        return folder.getId();
    }

    private String getFolderIdByName(String folderName) throws IOException, GeneralSecurityException {
        Drive driveService = getDriveService();

        String query = "mimeType='application/vnd.google-apps.folder' and name='" + folderName + "' and trashed=false";
        if (parentFolderId != null && !parentFolderId.isEmpty()) {
            query += " and '" + parentFolderId + "' in parents";
        }

        FileList result = driveService.files().list()
                .setQ(query)
                .setSpaces("drive")
                .setFields("files(id, name)")
                .execute();

        List<File> files = result.getFiles();
        if (files != null && !files.isEmpty()) {
            return files.get(0).getId(); // Lấy folder đầu tiên tìm được
        }

        return null;
    }
    public File uploadToGoogleDrive(MultipartFile multipartFile, String folderId) throws IOException, GeneralSecurityException {
        Drive driveService = getDriveService();

        File fileMetadata = new File();
        fileMetadata.setName(multipartFile.getOriginalFilename());
        fileMetadata.setParents(Collections.singletonList(folderId));

        InputStreamContent mediaContent = new InputStreamContent(
                multipartFile.getContentType(),
                new BufferedInputStream(multipartFile.getInputStream())
        );
        mediaContent.setLength(multipartFile.getSize());

        return driveService.files().create(fileMetadata, mediaContent)
                .setFields("id, name, mimeType, size, webViewLink")
                .execute();
    }

}
