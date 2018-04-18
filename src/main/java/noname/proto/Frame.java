package noname.proto;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;

@JsonTypeInfo(property = "type", use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
    @JsonSubTypes.Type(Ping.class),
    @JsonSubTypes.Type(Pong.class),
    @JsonSubTypes.Type(Message.class),
    @JsonSubTypes.Type(Post.class),
    @JsonSubTypes.Type(Notification.class)
})
public abstract class Frame {

    private FrameType type;

    public Frame(FrameType type) {
        this.type = type;
    }

    public FrameType getType() {
        return type;
    }

    public void setType(FrameType type) {
        this.type = type;
    }
}
