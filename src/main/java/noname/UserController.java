package noname;

import noname.proto.User;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

@RestController
public class UserController {


    @PostMapping("/api/auth")
    public User authorize(@RequestBody User user) {
        if (user.getId() == null) {
            user.setId(UUID.randomUUID());
        }
        return user;
    }


}
