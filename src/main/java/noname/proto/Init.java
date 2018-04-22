package noname.proto;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;

import java.util.Collection;

@Data
@JsonTypeName("INIT")
public class Init extends Frame {

    public Init() {
        super(FrameType.INIT);
    }

    private Collection<User> users;

}
