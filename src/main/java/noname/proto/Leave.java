package noname.proto;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;

@Data
@JsonTypeName("LEAVE")
public class Leave extends BaseMsg {
    public Leave() {
        super(FrameType.LEAVE);
    }
}
