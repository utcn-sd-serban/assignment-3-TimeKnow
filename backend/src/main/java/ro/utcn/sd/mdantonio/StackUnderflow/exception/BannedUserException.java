package ro.utcn.sd.mdantonio.StackUnderflow.exception;

public class BannedUserException extends RuntimeException {
    public BannedUserException() {
        super("The requested user has been banned. Please contact the Server administrator for further information!");
    }
}
