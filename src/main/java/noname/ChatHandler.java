package noname;

import com.fasterxml.jackson.databind.ObjectMapper;
import noname.concurrent.LockStripe;
import noname.proto.Frame;
import noname.proto.MessageFactory;
import noname.proto.Pong;
import noname.proto.Post;
import noname.proto.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.HttpCookie;
import java.net.URLDecoder;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class ChatHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(ChatHandler.class);

    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

    private final ObjectMapper objectMapper;
    private final MessageFactory messageFactory;

    private final LockStripe<UUID> userLocks = new LockStripe<>(128);

    @Autowired
    public ChatHandler(ObjectMapper objectMapper, MessageFactory messageFactory) {
        this.objectMapper = objectMapper;
        this.messageFactory = messageFactory;
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
        String frameJson = message.getPayload();
        logger.info("Received frame from ({}): {}", session.getRemoteAddress(), frameJson);

        Frame frame = parseFrame(message.getPayload());
        switch (frame.getType()) {
            case PING:
                sendFrame(session, new Pong());
                break;

            case POST:
                User u = getUser(session);
                UUID id = UUID.randomUUID();
                Instant time = Instant.now();
                broadcast(s -> messageFactory.msg(id, time, u, ((Post)frame).getText(), !getUser(s).getId().equals(u.getId())));
                break;
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        logger.info("Connection closed {}. Status: {}", session.getRemoteAddress(), status);

        User u = getUser(session);

        try (LockStripe.AutoCloseableLock ignored = userLocks.lockFor(u.getId())) {
            sessions.remove(session);
            if (noMoreSessions(u.getId())) {
                broadcast(messageFactory.leave(UUID.randomUUID(), Instant.now(), getUser(session)));
            }
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        logger.info("Connection established {}", session.getRemoteAddress());

        User u = parseUserFromCookieOrNull(session);
        if (u == null) {
            try {
                session.close(new CloseStatus(CloseStatus.NOT_ACCEPTABLE.getCode(),
                    "Connections without 'user' cookie or with invalid 'user' cookie will be rejected"));
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
            return;
        }
        session.getAttributes().put("user", u);

        try (LockStripe.AutoCloseableLock ignored = userLocks.lockFor(u.getId())) {
            if (noMoreSessions(u.getId())) {
                broadcast(messageFactory.join(UUID.randomUUID(), Instant.now(), u));
            }
            sessions.add(session);
        }

        sendFrame(session, messageFactory.init(sessions.stream().map(ChatHandler::getUser).collect(Collectors.toSet())));

    }

    private List<WebSocketSession> getUserSessions(UUID id) {
        return sessions.stream().filter(s -> getUser(s).getId().equals(id)).collect(Collectors.toList());
    }

    private boolean noMoreSessions(UUID userId) {
        return getUserSessions(userId).isEmpty();
    }

    private void broadcast(Function<WebSocketSession, Frame> frameGen) {
        sessions.forEach(s -> sendFrame(s, frameGen.apply(s)));
    }

    private void broadcast(Frame frame) {
        sessions.forEach(s -> sendFrame(s, frame));
    }

    private static User getUser(WebSocketSession session) {
        return (User) session.getAttributes().get("user");
    }

    private void sendFrame(WebSocketSession session, Frame frame) {
        try {
            String frameJson = objectMapper.writeValueAsString(frame);
            logger.info("Sending frame to {}: {}", session.getRemoteAddress(), frameJson);
            session.sendMessage(new TextMessage(frameJson));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private Frame parseFrame(String val) {
        try {
            return objectMapper.readerFor(Frame.class).readValue(val);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private User parseUserFromCookieOrNull(WebSocketSession session) {
        return session.getHandshakeHeaders().get("Cookie")
            .stream()
            .flatMap(v -> HttpCookie.parse(v).stream())
            .filter(c -> "user".equals(c.getName()))
            .map(c -> {
                try {
                    return URLDecoder.decode(c.getValue(), "utf-8");
                } catch (UnsupportedEncodingException e) {
                    throw new RuntimeException(e);
                }
            })
            .map(v -> {
                try {
                    return (User) objectMapper.readerFor(User.class).readValue(v);
                } catch (IOException e) {
                    throw new RuntimeException(e);
                }
            })
            .findAny()
            .orElse(null);
    }

}
