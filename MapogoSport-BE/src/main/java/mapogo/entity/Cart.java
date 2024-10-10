package mapogo.entity;

import java.io.Serializable;
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.*;

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
@Table(name = "Carts")
public class Cart implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CartId")
    private Integer cartId;

    @ManyToOne
    @JoinColumn(name = "Username", nullable = false)
    @JsonManagedReference
    private User user;

    @ManyToOne
    @JoinColumn(name = "ProductDetailSizeId", nullable = false)
    @JsonManagedReference
    private ProductDetailSize productDetailSize;

    @Column(name = "Date", nullable = false)
    private Date date;

    @Column(name = "TotalAmount", nullable = false)
    private Double totalAmount;

    @Column(name = "Quantity", nullable = false)
    private Integer quantity;
}
