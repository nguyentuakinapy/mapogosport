package mapogo.dto;


import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderDTO {
    private Integer orderId;
    private String username;
    private String address;
    private String phoneNumber;
    private LocalDateTime date;
    private String status;
    private Double amount;
    private String paymentMethod;
    private Integer voucherId;
    private String note;
    private Double shipFee;
}