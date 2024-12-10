package mapogo.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
public class MoMoPaymentResponse {

	 @JsonProperty("partnerCode")
	    private String partnerCode;

	    @JsonProperty("orderId")
	    private String orderId;

	    @JsonProperty("amount")
	    private int amount;

	    @JsonProperty("responseTime")
	    private long responseTime;

	    @JsonProperty("message")
	    private String message;

	    @JsonProperty("resultCode")
	    private int resultCode;

	    @JsonProperty("payUrl")
	    private String payUrl;
    
	    @JsonProperty("requestId")
	    private String requestId; 

	    @JsonProperty("shortLink")
	    private String shortLink; 
}
