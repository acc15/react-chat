package noname.proto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
public abstract class BaseMessage extends Frame {

    protected BaseMessage(FrameType type) {
        super(type);
    }

    private UUID id;

    private User user;

    @JsonFormat(shape = JsonFormat.Shape.NUMBER_INT)
    private Instant time;

}
