package com.example.be_job_hunt.config.googleDrive;

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
import com.google.api.client.http.InputStreamContent;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.drive.Drive;
import com.google.api.services.drive.DriveScopes;
import com.google.api.services.drive.model.File;
import com.google.api.services.drive.model.FileList;
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
    private static final String SERVICE_ACCOUNT_KEY_PATH = "D:\\prj_job_hunt\\Be_Job_Hunt\\Be_job_hunt\\edublog-462622-4c054ce0482d.json";

    // Nếu bạn có thư mục cha cụ thể thì gán ID vào đây
    private static final String parentFolderId = "1WP5Pi4C0YlsGt7Veb7MQwCdteKOv9RqT";



    public Drive getDriveService() throws IOException, GeneralSecurityException {
        GoogleCredential credential = GoogleCredential.fromStream(
                        new FileInputStream(SERVICE_ACCOUNT_KEY_PATH))
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
