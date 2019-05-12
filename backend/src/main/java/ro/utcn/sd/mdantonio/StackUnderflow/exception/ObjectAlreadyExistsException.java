package ro.utcn.sd.mdantonio.StackUnderflow.exception;

public class ObjectAlreadyExistsException extends RuntimeException {
    public ObjectAlreadyExistsException() {
        super("The resource already exists!");
    }
}
