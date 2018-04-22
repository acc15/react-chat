package noname.proto;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class MessageFactory {

    public Message createNotification(String text) {
        Message msg = new Message();
        msg.setId(UUID.randomUUID());
        msg.setTime(Instant.now());
        msg.setText(text);
        msg.setNotify(true);
        return msg;
    }

    public Message createMessage(User user, String text, boolean notify) {
        Message msg = createNotification(text);
        msg.setUser(user);
        msg.setNotify(notify);
        return msg;
    }

}
