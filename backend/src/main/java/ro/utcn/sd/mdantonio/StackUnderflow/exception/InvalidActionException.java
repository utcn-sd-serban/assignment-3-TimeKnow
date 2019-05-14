package ro.utcn.sd.mdantonio.StackUnderflow.exception;

public class InvalidActionException extends RuntimeException {
    public InvalidActionException() {
        super("The operation you requested is invalid!");
    }
}
