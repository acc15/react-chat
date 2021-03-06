package noname.proto;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;

@Data
@EqualsAndHashCode(callSuper = true)
@JsonTypeName("POST")
public class Post extends Frame {

    public Post() {
        super(FrameType.POST);
    }

    private String text;

}
