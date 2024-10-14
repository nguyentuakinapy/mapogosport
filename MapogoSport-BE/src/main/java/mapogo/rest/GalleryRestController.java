package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.Gallery;
import mapogo.service.GalleryService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/gallery")
public class GalleryRestController {
	@Autowired
	GalleryService galleryService;
	
	@GetMapping
	public List<Gallery> findAll()
	{
		return galleryService.findAll();
	}

}
