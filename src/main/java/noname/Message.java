package noname;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.Instant;

public class Message {

    private String user;

    @JsonFormat(shape = JsonFormat.Shape.NUMBER_INT)
    private Instant time;

    private String text;

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public Instant getTime() {
        return time;
    }

    public void setTime(Instant time) {
        this.time = time;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
