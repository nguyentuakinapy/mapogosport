package mapogo.service.impl;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.annotation.JsonTypeInfo.Id;

import mapogo.dao.ProductDAO;
import mapogo.entity.Product;
import mapogo.service.ProductService;

@Service
public class ProductServiceImpl implements ProductService {
	
	@Autowired
	ProductDAO productDAO;
	
	@Override
	public List<Product> findAll() {
		// TODO Auto-generated method stub
		List<Product> listPro = productDAO.findAllProductsFromBottom();
		listPro.forEach(product -> {
			Integer idProduct =  product.getProductId();
			Integer totalQuantity = productDAO.getTotalQuantityByProductId(idProduct);
			product.setStock(totalQuantity != null ? totalQuantity: 0);
			if(product.getStock() == 0) {
				product.setStatus("Hết hàng");
			}else {
				product.setStatus("Còn hàng");
			}
		});
//		return productDAO.findAllProductsFromBottom();
//		return productDAO.findAll();
		return listPro;
	}

	@Override
	public Optional<Product> findById(Integer id) {
		// TODO Auto-generated method stub
		return productDAO.findById(id);
	}

	@Override
	public Product create(Product product) {
		// TODO Auto-generated method stub
		return productDAO.save(product);
	}

	  @Override
	    public Product update(Product product) {
	        Optional<Product> existingProduct = productDAO.findById(product.getProductId());
	        if (existingProduct.isPresent()) {
	            return productDAO.save(product);  // Save will update if the product already exists
	        }
	        throw new RuntimeException("Product not found with id: " + product.getProductId());
	    }

	@Override
	public void deleteById(Integer id) {
		// TODO Auto-generated method stub
		 productDAO.deleteById(id);
	}

	@Override
	public Page<Product> getProducts(int page, int size) {
		// TODO Auto-generated method stub
        return productDAO.findAll(PageRequest.of(page, size));
	}



	
}
