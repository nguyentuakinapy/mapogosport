package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;


import mapogo.dto.SportFieldDTO;
import mapogo.dto.SportFieldDetailDTO;
import mapogo.entity.Owner;
import mapogo.entity.SportField;
import mapogo.entity.SportFieldDetail;
import mapogo.entity.User;
import mapogo.service.GallerySportFieldService;
import mapogo.service.OwnerService;
import mapogo.service.SessionService;
import mapogo.service.SportFieldDetailService;
import mapogo.service.SportFieldService;
import mapogo.service.UserService;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;

@CrossOrigin("*")
@RequestMapping("/rest")
@RestController
public class SportFieldManagerRestController {
	// của Mỵ từ đây
	@Autowired
	SessionService session;

	@Autowired
	SportFieldService sportService;

	@Autowired
	OwnerService ownerService;

	@Autowired
	UserService userserver;
	
	@Autowired
	SportFieldDetailService sportFieldDetailService;
	
	//SportField
	@GetMapping("/sportfields/lists/{username}")
	public List<SportField> getListSportField(@PathVariable("username") String username) {
		User user = userserver.findByUsername(username);
		Owner owner = ownerService.findOwnerByUsername(user);
		return sportService.findSportFieldByOwner(owner.getOwnerId());
	}

	@GetMapping("/sportfield/{sportFieldId}")
	public SportField getSportField(@PathVariable Integer sportFieldId) {
		return sportService.findBySportFieldId(sportFieldId);
	}

	@Autowired
	GallerySportFieldService galleryService;
	
	@PostMapping("/sportfield/create")
    public ResponseEntity<?> createSportField(
            @RequestPart("sportFieldData") SportFieldDTO sportFieldDTO,
            @RequestPart("avatar") MultipartFile avatar,
            @RequestPart(value = "galleryFiles", required = false) List<MultipartFile> galleryFiles
            ) {
		SportField sportField= sportService.create(sportFieldDTO, avatar);
		
		if (galleryFiles != null) {
	        for (MultipartFile file : galleryFiles) {
	            if (!file.isEmpty()) {
	                galleryService.create(file, sportField);
	            }
	        }
	    }
        return ResponseEntity.ok(sportField);
    }
	
	@PostMapping("/sportfield/update")
    public ResponseEntity<?> updateSportField(
    		@RequestPart("sportFieldData") SportFieldDTO sportFieldDTO,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar,
            @RequestPart(value = "galleryFiles", required = false) List<MultipartFile> galleryFiles
            ) {
		
		SportField sportField= sportService.update(sportFieldDTO, avatar);
		if (galleryFiles != null) {
	        for (MultipartFile file : galleryFiles) {
	            if (!file.isEmpty()) {
	                galleryService.create(file, sportField);
	            }
	        }
	    }
        return ResponseEntity.ok(sportField);
    }
	//SportFieldDetail
	@GetMapping("/sportfielddetail/lists/{sportFieldId}")
	public List<SportFieldDetail> getSportFieldDetailList(@PathVariable Integer sportFieldId) {
		SportField sportField = sportService.findBySportFieldId(sportFieldId);
		return sportFieldDetailService.findBySportField(sportField);
	}

	@GetMapping("/sportfielddetail/sportFieldName/{sportFieldId}")
	public String getSportFieldName(@PathVariable Integer sportFieldId) {
		SportField sportField = sportService.findBySportFieldId(sportFieldId);
		return sportField.getName();
	}

	@PostMapping("sportFieldDetail/create")
    public ResponseEntity<SportFieldDetail> createSportFieldDetail(@RequestBody SportFieldDetailDTO dto) {
		SportFieldDetail sportFieldDetail= sportFieldDetailService.create(dto);
        return ResponseEntity.ok(sportFieldDetail);
    }
	
	@PostMapping("/SportFieldDetail/update")
    public ResponseEntity<SportFieldDetail> updateSportFieldDetail(@RequestBody SportFieldDetailDTO dto) {
		SportFieldDetail sportFieldDetail= sportFieldDetailService.update(dto);
        return ResponseEntity.ok(sportFieldDetail);
    }
	// đến đây
}
