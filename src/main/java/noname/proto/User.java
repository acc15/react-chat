package noname.proto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.util.UUID;

@Data
@EqualsAndHashCode(exclude = "name")
public class User {

    private UUID id;
    private String name;

}
