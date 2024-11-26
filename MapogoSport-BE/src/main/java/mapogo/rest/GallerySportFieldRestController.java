package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.GallerySportField;
import mapogo.service.GallerySportFieldService;

@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/rest")
@RestController
//Mỵ
public class GallerySportFieldRestController {
	@Autowired
	GallerySportFieldService service;

	@GetMapping("/sportfield/gallery/{selectedSportFieldId}")
	public List<GallerySportField> getListGallery(@PathVariable("selectedSportFieldId") Integer selectedSportFieldId) {
		return service.findBySportFieldId(selectedSportFieldId);
	}
	
	@Autowired
    private GallerySportFieldService gallerySportFieldService;

    @DeleteMapping("/gallerySportField/delete/{gallerySportFieldId}")
    public ResponseEntity<String> deleteGallery(@PathVariable int gallerySportFieldId) {
        boolean isDeleted = gallerySportFieldService.deleteGalleryById(gallerySportFieldId);
        if (isDeleted) {
            return ResponseEntity.ok("Gallery đã được xóa thành công");
        } else {
            return ResponseEntity.status(404).body("Không tìm thấy gallery với ID: " + gallerySportFieldId);
        }
    } 
}
