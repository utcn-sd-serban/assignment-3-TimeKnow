package ro.utcn.sd.mdantonio.StackUnderflow.exception;

public class InvalidLoginException extends RuntimeException {
    public InvalidLoginException() {
        super("Invalid Login Credentials!");
    }
}
