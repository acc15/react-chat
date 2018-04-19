package noname;

import com.fasterxml.jackson.databind.ObjectMapper;
import noname.proto.Frame;
import noname.proto.MessageFactory;
import noname.proto.Pong;
import noname.proto.Post;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;
import org.springframework.web.util.UriComponents;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;

@Component
public class ChatHandler extends TextWebSocketHandler {

    private static final Logger logger = LoggerFactory.getLogger(ChatHandler.class);

    private final List<WebSocketSession> sessions = new CopyOnWriteArrayList<>();
    private final ObjectMapper objectMapper;
    private final MessageFactory messageFactory;

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
                broadcast(messageFactory.createMessage(getUser(session), ((Post)frame).getText()));
                break;
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        logger.info("Connection closed {}. Status: {}", session.getRemoteAddress(), status);

        sessions.remove(session);

        broadcast(messageFactory.createNotification(getUser(session) + " leave"));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        logger.info("Connection established {}", session.getRemoteAddress());

        UriComponents uriComponents = UriComponentsBuilder.fromUri(session.getUri()).build();
        String user = uriComponents.getQueryParams().getFirst("user");
        session.getAttributes().put("user", user);

        broadcast(messageFactory.createNotification(user + " joined"));
        sessions.add(session);
    }

    private void broadcast(Frame frame) {
        sessions.forEach(s -> sendFrame(s, frame));
    }

    private static String getUser(WebSocketSession session) {
        return session.getAttributes().get("user").toString();
    }

    private void sendFrame(WebSocketSession session, Frame frame) {
        try {
            String frameJson = objectMapper.writeValueAsString(frame);
            logger.info("Sending frame to {}: {}", session.getRemoteAddress(), frameJson);
            session.sendMessage(new TextMessage(frameJson));
        } catch (IOException e) {
            e.printStackTrace();
        }
    }

    private Frame parseFrame(String val) {
        try {
            return objectMapper.readerFor(Frame.class).readValue(val);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

}
