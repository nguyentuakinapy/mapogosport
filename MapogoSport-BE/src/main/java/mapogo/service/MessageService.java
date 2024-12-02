package mapogo.service;



import mapogo.entity.Message;

import java.util.List;
import java.util.Map;

public interface MessageService {

	 public Message saveMessage(Message message) ;
	 
	  public List<Message> getMessages(String senderUsername, String receiverUsername);
	  
	  public  List<Map<String, Object>> findMessagesBetweenUsers(String sender, String receiver);
//	  public List<Message> findMessagesBetweenUsers(String sender, String receiver);
	  
	    List<Map<String, Object>> getMessagesForUser(String username);

}
