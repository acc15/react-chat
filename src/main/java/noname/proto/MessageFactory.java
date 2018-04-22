package noname.proto;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collection;
import java.util.UUID;

@Service
public class MessageFactory {


    public Join join(User user) {
        return initBaseMsg(new Join(), user);
    }

    public Leave leave(User user) {
        return initBaseMsg(new Leave(), user);
    }

    public Message msg(User user, String text, boolean notify) {
        Message m = initBaseMsg(new Message(), user);
        m.setText(text);
        m.setNotify(notify);
        return m;
    }

    public Pong pong() {
        return new Pong();
    }

    public Init init(Collection<User> users) {
        Init i = new Init();
        i.setUsers(users);
        return i;
    }

    private <T extends BaseMessage> T initBaseMsg(T baseMessage, User user) {
        baseMessage.setId(UUID.randomUUID());
        baseMessage.setTime(Instant.now());
        baseMessage.setUser(user);
        return baseMessage;
    }

}
