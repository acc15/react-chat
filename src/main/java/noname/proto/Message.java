package noname.proto;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;

import java.time.Instant;
import java.util.UUID;

@Data
@JsonTypeName("MSG")
public class Message extends Frame {

    public Message() {
        super(FrameType.MSG);
    }

    private UUID id;

    private User user;

    @JsonFormat(shape = JsonFormat.Shape.NUMBER_INT)
    private Instant time;

    private String text;

    boolean notify;

}
