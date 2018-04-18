package noname;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class MessageFactory {

    private final AtomicLong idSeq = new AtomicLong();

    public Message createNotification(String text) {
        var msg = createMessage();
        msg.setText(text);
        return msg;
    }

    public Message createMessage(String user, String text) {
        var msg = createNotification(text);
        msg.setUser(user);
        return msg;
    }

    public Message initMessage(Message msg) {
        msg.setId(idSeq.incrementAndGet());
        msg.setTime(Instant.now());
        return msg;
    }

    public Message createMessage() {
        return initMessage(new Message());
    }

}
