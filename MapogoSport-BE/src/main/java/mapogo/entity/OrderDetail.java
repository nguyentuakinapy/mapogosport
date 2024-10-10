package mapogo.entity;

import java.io.Serializable;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@SuppressWarnings("serial")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "Orderdetails")
public class OrderDetail implements Serializable{
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderDetailId")
    private Integer orderDetailId;

	@ManyToOne
    @JoinColumn(name = "ProductDetailSizeId", nullable = false)
    private ProductDetailSize productDetailSize;

    @Column(name = "Quantity", nullable = false)
    private Integer quantity;

    @ManyToOne
    @JoinColumn(name = "OrderId", nullable = false)
    private Order order;
    

}

