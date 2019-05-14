package ro.utcn.sd.mdantonio.StackUnderflow.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.utcn.sd.mdantonio.StackUnderflow.seeder.Seeder;

@Profile("e2e")
@RestController
@RequiredArgsConstructor
public class EndToEndTestsController {
    private final Seeder seed;
    @RequestMapping("/test/reseed")
    public void reseed() {
        seed.clear();
        seed.run();
    }
}
