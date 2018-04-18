package noname.proto;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("PING")
public class Ping extends Frame {
    public Ping() {
        super(FrameType.PING);
    }
}
