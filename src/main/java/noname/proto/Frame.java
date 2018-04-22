package noname.proto;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;

@Data
@JsonTypeInfo(property = "type", use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY)
@JsonSubTypes({
    @JsonSubTypes.Type(Ping.class),
    @JsonSubTypes.Type(Msg.class),
    @JsonSubTypes.Type(Post.class),
})
public abstract class Frame {

    private FrameType type;

    public Frame(FrameType type) {
        this.type = type;
    }

}
