package mapogo.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import mapogo.dao.MessageDAO;
import mapogo.entity.Message;
import mapogo.service.MessageService;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class MessageServiceImpl implements MessageService{

    @Autowired
    private MessageDAO messageDAO;

    public Message saveMessage(Message message) {
        return messageDAO.save(message);
    }

    public List<Message> getMessages(String senderUsername, String receiverUsername) {
        return messageDAO.findMessagesBetweenUsers(senderUsername, receiverUsername);
    }

    @Override
    public List<Map<String, Object>> findMessagesBetweenUsers(String sender, String receiver) {
        List<Message> messages = messageDAO.findMessagesBetweenUsers(sender, receiver);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Message message : messages) {
            Map<String, Object> messageMap = new HashMap<>();
            messageMap.put("messageId", message.getMessageId());
            messageMap.put("content", message.getContent());
            messageMap.put("createdAt", message.getCreatedAt());

            Map<String, Object> senderMap = new HashMap<>();
            senderMap.put("username", message.getSender().getUsername());
            senderMap.put("fullname", message.getSender().getFullname());
            senderMap.put("email", message.getSender().getEmail());
            senderMap.put("avatar", message.getSender().getAvatar());
            senderMap.put("authorities", message.getSender().getAuthorities()
                    .stream()
                    .map(authority -> authority.getRole().getName())
                    .toList());
            messageMap.put("sender", senderMap);

            Map<String, Object> receiverMap = new HashMap<>();
            receiverMap.put("username", message.getReceiver().getUsername());
            receiverMap.put("fullname", message.getReceiver().getFullname());
            receiverMap.put("email", message.getReceiver().getEmail());
            receiverMap.put("avatar", message.getReceiver().getAvatar());
            receiverMap.put("authorities", message.getReceiver().getAuthorities()
                    .stream()
                    .map(authority -> authority.getRole().getName())
                    .toList());
            messageMap.put("receiver", receiverMap);

            response.add(messageMap);
        }

        return response;
    }

//	@Override
//	public List<Message> findMessagesBetweenUsers(String sender, String receiver) {
//		// TODO Auto-generated method stub
//		return messageDAO.findMessagesBetweenUsers(sender, receiver);
//	}
    @Override
    public List<Map<String, Object>> getMessagesForUser(String username) {
        List<Message> messages = messageDAO.getMessagesForUser(username);
        List<Map<String, Object>> response = new ArrayList<>();

        for (Message message : messages) {
            Map<String, Object> messageMap = new HashMap<>();
            messageMap.put("messageId", message.getMessageId());
            messageMap.put("content", message.getContent());
            messageMap.put("createdAt", message.getCreatedAt());

            // Thông tin sender
            Map<String, Object> senderMap = new HashMap<>();
            senderMap.put("username", message.getSender().getUsername());
            senderMap.put("fullname", message.getSender().getFullname());
            senderMap.put("email", message.getSender().getEmail());
            senderMap.put("avatar", message.getSender().getAvatar());
            senderMap.put("authorities", message.getSender().getAuthorities()
                    .stream()
                    .map(authority -> authority.getRole().getName())
                    .toList());
            messageMap.put("sender", senderMap);

            // Thông tin receiver
            Map<String, Object> receiverMap = new HashMap<>();
            receiverMap.put("username", message.getReceiver().getUsername());
            receiverMap.put("fullname", message.getReceiver().getFullname());
            receiverMap.put("email", message.getReceiver().getEmail());
            receiverMap.put("avatar", message.getReceiver().getAvatar());
            receiverMap.put("authorities", message.getReceiver().getAuthorities()
                    .stream()
                    .map(authority -> authority.getRole().getName())
                    .toList());
            messageMap.put("receiver", receiverMap);

            response.add(messageMap);
        }

        return response;
    }
    
   
}
