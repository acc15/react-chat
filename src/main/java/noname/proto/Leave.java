package noname.proto;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonTypeName("LEAVE")
public class Leave extends BaseMsg {
    public Leave() {
        super(FrameType.LEAVE);
    }
}
