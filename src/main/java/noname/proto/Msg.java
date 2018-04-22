package noname.proto;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonTypeName("MSG")
public class Msg extends BaseMsg {

    public Msg() {
        super(FrameType.MSG);
    }

    private String text;

    boolean notify;

}
