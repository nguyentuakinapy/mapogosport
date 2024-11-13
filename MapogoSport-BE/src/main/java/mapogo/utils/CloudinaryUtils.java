package mapogo.utils;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Component
public class CloudinaryUtils {

    @Autowired
    private Cloudinary cloudinary;

    // Phương thức để upload ảnh
    public String uploadImage(MultipartFile file) throws IOException {
        Map<String, Object> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
        return (String) uploadResult.get("secure_url"); // Trả về đường dẫn URL an toàn
    }

    // Phương thức để xóa ảnh
    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
    
    public Map<String, Object> uploadImage2(MultipartFile file) throws IOException {
        return cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
    }
    
    public String extractPublicIdFromUrl(String url) {
        int uploadIndex = url.indexOf("upload/") + 7;
        String substringAfterUpload = url.substring(uploadIndex);
        int firstSlashAfterVersion = substringAfterUpload.indexOf('/');

        String publicIdWithVersion = substringAfterUpload.substring(firstSlashAfterVersion + 1);
        int fileExtensionIndex = publicIdWithVersion.lastIndexOf('.');

        return publicIdWithVersion.substring(0, fileExtensionIndex);
    }
}
