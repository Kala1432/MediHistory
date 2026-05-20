package com.medihistory.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;

@Service
public class S3StorageService {

    private final S3Client s3Client;
    private final String bucketName;
    private final String regionName;

    public S3StorageService(
            @Value("${aws.s3.bucket-name}") String bucketName,
            @Value("${aws.region:us-east-1}") String region,
            @Value("${aws.access-key-id:}") String accessKeyId,
            @Value("${aws.secret-access-key:}") String secretAccessKey
    ) {
        this.bucketName = bucketName;
        this.regionName = region.isBlank() ? "us-east-1" : region;
        Region awsRegion = Region.of(this.regionName);

        AwsCredentialsProvider credentialsProvider;
        if (!accessKeyId.isBlank() && !secretAccessKey.isBlank()) {
            credentialsProvider = () -> AwsBasicCredentials.create(accessKeyId, secretAccessKey);
        } else {
            credentialsProvider = DefaultCredentialsProvider.create();
        }

        this.s3Client = S3Client.builder()
                .region(awsRegion)
                .credentialsProvider(credentialsProvider)
                .build();
    }

    public String uploadFile(String key, MultipartFile file) throws IOException {
        String normalizedKey = key.replaceAll("\\s+", "_");

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(normalizedKey)
                .contentType(file.getContentType() != null ? file.getContentType() : "application/octet-stream")
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, regionName, normalizedKey);
    }
}
