package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RestController;

import mapogo.dto.SportFieldDTO;
import mapogo.entity.Owner;
import mapogo.entity.SportField;
import mapogo.entity.SportFieldDetail;
import mapogo.entity.User;
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

@CrossOrigin(origins = "http://localhost:3000")
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
		System.out.println(sportService.findSportFieldByOwner(owner.getOwnerId()));
		return sportService.findSportFieldByOwner(owner.getOwnerId());
	}

	@GetMapping("/sportfield/{sportFieldId}")
	public SportField getSportField(@PathVariable Integer sportFieldId) {
		return sportService.findBySportFieldId(sportFieldId);
	}
	
	@PostMapping("/sportfield/create")
	public ResponseEntity<SportField> createSportField(@RequestBody SportFieldDTO sportField) {
		System.out.println(sportField.getAddress());
		System.out.println(sportField.getClosing());
		System.out.println(sportField.getDecription());
		System.out.println(sportField.getImage());
		System.out.println(sportField.getName());
		System.out.println(sportField.getOpening());
		System.out.println(sportField.getStatus());
SportField sportField1 = new SportField();
        return ResponseEntity.ok(sportField1);
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
	
//	@GetMapping("/sportfielddetail/{sportFieldDetailId}")
//	public SportFieldDetail getSportFieldDetail(@PathVariable Integer sportFieldDetailId) {
//		return sportFieldDetailService.findBySportFielDetailId(sportFieldDetailId);
//	}
	
	// đến đây
}
