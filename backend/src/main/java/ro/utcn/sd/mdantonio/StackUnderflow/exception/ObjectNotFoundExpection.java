package ro.utcn.sd.mdantonio.StackUnderflow.exception;

public class ObjectNotFoundExpection extends RuntimeException {
    public ObjectNotFoundExpection() {
        super("The Resource you required was not found!");
    }
}
