package noname.proto;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.time.Instant;
import java.util.UUID;

@Data
@EqualsAndHashCode(callSuper = true)
public abstract class BaseMsg extends Frame {

    protected BaseMsg(FrameType type) {
        super(type);
    }

    private UUID id;

    private User user;

    @JsonFormat(shape = JsonFormat.Shape.NUMBER_INT)
    private Instant time;

}
