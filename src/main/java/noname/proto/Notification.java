package noname.proto;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;

import java.time.Instant;

@Data
@JsonTypeName("NOTIFY")
public class Notification extends Frame {

    private long id;
    private Instant time;
    private String text;

    public Notification() {
        super(FrameType.NOTIFY);
    }

}
