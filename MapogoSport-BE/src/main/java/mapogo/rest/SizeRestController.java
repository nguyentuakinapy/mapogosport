package mapogo.rest;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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
	// Endpoint để thêm kích cỡ mới
    @PostMapping("/create")
    public Size createSize(@RequestBody Size newSize) {
        // Kiểm tra xem kích cỡ đã tồn tại chưa
        if (sizeService.findByName(newSize.getSizeName()) != null) {
            throw new RuntimeException("Kích cỡ đã tồn tại!");
        }

        // Tạo mới kích cỡ
        return sizeService.create(newSize);
    }

}
