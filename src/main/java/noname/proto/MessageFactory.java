package noname.proto;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.concurrent.atomic.AtomicLong;

@Service
public class MessageFactory {

    private final AtomicLong idSeq = new AtomicLong();

    public Message createNotification(String text) {
        Message msg = new Message();
        msg.setId(idSeq.incrementAndGet());
        msg.setTime(Instant.now());
        msg.setText(text);
        msg.setNotify(true);
        return msg;
    }

    public Message createMessage(String user, String text, boolean notify) {
        Message msg = createNotification(text);
        msg.setUser(user);
        msg.setNotify(notify);
        return msg;
    }

}
