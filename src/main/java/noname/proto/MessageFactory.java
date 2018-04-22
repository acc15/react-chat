package noname.proto;

import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Collection;
import java.util.UUID;

@Service
public class MessageFactory {


    public Join join(UUID id, Instant time, User user) {
        return initBaseMsg(new Join(), id, time, user);
    }

    public Leave leave(UUID id, Instant time, User user) {
        return initBaseMsg(new Leave(), id, time, user);
    }

    public Message msg(UUID id, Instant time, User user, String text, boolean notify) {
        Message m = initBaseMsg(new Message(), id, time, user);
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

    private <T extends BaseMessage> T initBaseMsg(T baseMessage, UUID id, Instant time, User user) {
        baseMessage.setId(id);
        baseMessage.setTime(time);
        baseMessage.setUser(user);
        return baseMessage;
    }

}
