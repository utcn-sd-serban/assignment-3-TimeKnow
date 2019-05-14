package ro.utcn.sd.mdantonio.StackUnderflow.event;

import lombok.Data;

@Data
public class BaseEvent {
    private final EventType type;
}
