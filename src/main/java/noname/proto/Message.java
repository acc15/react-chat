package noname.proto;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;

@Data
@JsonTypeName("MSG")
public class Message extends BaseMessage {

    public Message() {
        super(FrameType.MSG);
    }

    private String text;

    boolean notify;

}
