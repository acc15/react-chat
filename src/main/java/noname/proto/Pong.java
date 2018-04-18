package noname.proto;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("PONG")
public class Pong extends Frame {
    public Pong() {
        super(FrameType.PONG);
    }
}
