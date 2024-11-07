package mapogo.service;



import mapogo.entity.Message;

import java.util.List;

public interface MessageService {

	 public Message saveMessage(Message message) ;
	 
	  public List<Message> getMessages(String senderUsername, String receiverUsername);
}
