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

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

@Component
public class ChatHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(ChatHandler.class);

    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final List<Message> messages = new CopyOnWriteArrayList<>();
    private final ObjectMapper objectMapper;
    private final ScheduledExecutorService executorService;

    @Autowired
    public ChatHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
        this.executorService = Executors.newScheduledThreadPool(4);
    }

    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) {
        Message msg = parseMessage(message.getPayload());
        msg.setTime(Instant.now());
        logger.debug("Received message from {} (remote {}) at {}", msg.getUser(), session.getRemoteAddress(), msg.getTime());

        messages.add(msg);
        broadcastMessages();

        executorService.schedule(() -> {
            logger.debug("Removing expired message at {} from {}", msg.getTime(), msg.getUser());
            messages.remove(msg);
            broadcastMessages();
        }, 120, TimeUnit.SECONDS);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        logger.info("Connection closed {}. Status: {}", session.getRemoteAddress(), status);
        sessions.remove(session);
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        logger.info("Connection established {}", session.getRemoteAddress());
        sessions.add(session);
        sendMessages(session);
    }

    private void broadcastMessages() {
        logger.info("Broadcasting messages...");
        sessions.forEach(this::sendMessages);
    }

    private void sendMessages(WebSocketSession session) {
        logger.debug("Sending messages to {}...", session.getRemoteAddress());
        try {
            session.sendMessage(new TextMessage(objectMapper.writeValueAsString(messages)));
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
