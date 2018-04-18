package noname.proto;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class MessageFactory {

    private final AtomicLong idSeq = new AtomicLong();

    public Notification createNotification(String text) {
        var msg = new Notification();
        msg.setId(idSeq.incrementAndGet());
        msg.setTime(Instant.now());
        msg.setText(text);
        return msg;
    }

    public Message createMessage(String user, String text) {
        var msg = new Message();
        msg.setId(idSeq.incrementAndGet());
        msg.setTime(Instant.now());
        msg.setUser(user);
        msg.setText(text);
        return msg;
    }

}
