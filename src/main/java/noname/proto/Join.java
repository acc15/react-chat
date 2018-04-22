package noname.proto;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonTypeName("JOIN")
public class Join extends BaseMsg {
    public Join() {
        super(FrameType.JOIN);
    }
}
