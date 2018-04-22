package noname.proto;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;

@Data
@JsonTypeName("JOIN")
public class Join extends BaseMessage {
    public Join() {
        super(FrameType.JOIN);
    }
}
