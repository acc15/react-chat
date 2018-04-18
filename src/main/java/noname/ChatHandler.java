package noname;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class ChatHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(ChatHandler.class);

    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final ObjectMapper objectMapper;

    @Autowired
    public ChatHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
        Message msg = parseMessage(message.getPayload());
        msg.setTime(Instant.now());
        logger.debug("Received message from {} (remote {}) at {}", msg.getUser(), session.getRemoteAddress(), msg.getTime());
        broadcast(msg);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        logger.info("Connection closed {}. Status: {}", session.getRemoteAddress(), status);

        sessions.remove(session);
        broadcast(Message.notification(Instant.now(), session.getAttributes().get("user") + " leave"));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        logger.info("Connection established {}", session.getRemoteAddress());

        var uriComponents = UriComponentsBuilder.fromUri(session.getUri()).build();
        var user = uriComponents.getQueryParams().getFirst("user");
        session.getAttributes().put("user", user);

        broadcast(Message.notification(Instant.now(), user + " joined"));
        sessions.add(session);
    }

    private void broadcast(Message msg) {
        sessions.forEach(s -> sendMessage(s, msg));
    }

    private void sendMessage(WebSocketSession session, Message message) {
        logger.debug("Sending messages to {}...", session.getRemoteAddress());
        try {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(message)));
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private Message parseMessage(String val) {
        try {
            return objectMapper.readerFor(Message.class).readValue(val);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
