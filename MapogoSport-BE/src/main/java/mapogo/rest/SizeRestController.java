package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import mapogo.entity.Size;
import mapogo.service.SizeService;

@CrossOrigin("*")
@RestController
@RequestMapping("/rest/size")
public class SizeRestController {
	@Autowired
	SizeService sizeService;
	@GetMapping
	public List<Size> findAll()
	{
		return sizeService.findAll();
	}

}
