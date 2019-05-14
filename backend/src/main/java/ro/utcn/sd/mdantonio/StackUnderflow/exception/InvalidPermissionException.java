package ro.utcn.sd.mdantonio.StackUnderflow.exception;

public class InvalidPermissionException extends RuntimeException {
    public InvalidPermissionException() {
        super("You do not have permission to access the desired resource!");
    }
}
