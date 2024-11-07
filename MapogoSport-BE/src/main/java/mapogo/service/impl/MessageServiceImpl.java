package mapogo.service.impl;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import mapogo.dao.MessageDAO;
import mapogo.entity.Message;
import mapogo.service.MessageService;

import java.util.List;

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
}
