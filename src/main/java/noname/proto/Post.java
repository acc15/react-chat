package noname.proto;

import com.fasterxml.jackson.annotation.JsonTypeName;

@JsonTypeName("POST")
public class Post extends Frame {

    private String text;

    public Post() {
        super(FrameType.POST);
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
