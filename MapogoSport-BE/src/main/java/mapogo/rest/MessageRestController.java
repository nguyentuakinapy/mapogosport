package mapogo.rest;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

//import mapogo.controller.WebSocketSubscriptionListener;
import mapogo.dao.MessageDAO;
import mapogo.entity.Message;
import mapogo.service.MessageService;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
public class MessageRestController {

    @Autowired
    private MessageService messageService;
    @Autowired
    MessageDAO messageDAO;
    

    @PostMapping
    public Message sendMessage(@RequestBody Message message) {
        return messageService.saveMessage(message);
    }

    @GetMapping("/{sender}/{receiver}")
    public List<Message> getMessagesBetweenUsers(@PathVariable String sender, @PathVariable String receiver) {
//        return messageService.getMessages(sender, receiver);
        return messageDAO.findMessagesBetweenUsers(sender, receiver);
    }
    
    @GetMapping("/{sender}")
    public List<Message> getMessagesReceverBySender(@PathVariable String sender) {
    	
    	return messageDAO.findReceiverBySender(sender);
    }
    
    @GetMapping("/receiver/{receiverUsernameOrCurrentUser}")
    public List<Message> getMessagesForUser(@PathVariable String receiverUsernameOrCurrentUser) {
        return messageDAO.getMessagesForUser(receiverUsernameOrCurrentUser);
    }
   }
