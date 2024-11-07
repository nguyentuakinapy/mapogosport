package mapogo.dao;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;

import mapogo.entity.Message;

public interface MessageDAO extends JpaRepository<Message, Integer>{
	
//    List<Message> findBySenderUsernameOrReceiverUsername(String senderUsername, String receiverUsername);
    
    @Query("SELECT o FROM Message o where o.sender.username  = ?1")
    List<Message> findBySender(String senderUsername);

    @Query("SELECT o FROM Message o where o.sender.username  = ?1")
    List<Message> findReceiverBySender(String senderUsername);
    
    @Query("SELECT m FROM Message m WHERE m.sender.username = ?1 AND m.isDeleted = false ORDER BY m.createdAt DESC")
    List<Message> getMessagesForCurrentUser(String receiverUsernameOrCurrentUser);

    @Query("SELECT m FROM Message m WHERE (m.sender.username = :username OR m.receiver.username = :username) AND m.isDeleted = false ORDER BY m.createdAt DESC")
    List<Message> getMessagesForUser(String username);

    @Query("SELECT m FROM Message m WHERE (m.sender.username = :senderUsername AND m.receiver.username = :receiverUsername) OR (m.sender.username = :receiverUsername AND m.receiver.username = :senderUsername)")
    List<Message> findMessagesBetweenUsers(@Param("senderUsername") String senderUsername, @Param("receiverUsername") String receiverUsername);

}
