package ro.utcn.sd.mdantonio.StackUnderflow.controller;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import ro.utcn.sd.mdantonio.StackUnderflow.dto.ExceptionDTO;
import ro.utcn.sd.mdantonio.StackUnderflow.exception.*;

@Component
@RestControllerAdvice
public class ErrorHandler {

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(BannedUserException.class)
    public ExceptionDTO handlerBannedUserException(BannedUserException exception) {
        return new ExceptionDTO(exception.getMessage());
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(InvalidLoginException.class)
    public ExceptionDTO handlerInvalidLoginException(InvalidLoginException exception) {
        return new ExceptionDTO(exception.getMessage());
    }

    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ExceptionHandler(InvalidActionException.class)
    public ExceptionDTO handlerInvalidActionException(InvalidActionException exception) {
        return new ExceptionDTO(exception.getMessage());
    }

    @ResponseStatus(HttpStatus.UNAUTHORIZED)
    @ExceptionHandler(InvalidPermissionException.class)
    public ExceptionDTO handlerInvalidPermissionException(InvalidPermissionException exception) {
        return new ExceptionDTO(exception.getMessage());
    }

    @ResponseStatus(HttpStatus.CONFLICT)
    @ExceptionHandler(ObjectAlreadyExistsException.class)
    public ExceptionDTO handlerObjectAlreadyExistsException(ObjectAlreadyExistsException exception) {
        return new ExceptionDTO(exception.getMessage());
    }

    @ResponseStatus(HttpStatus.NOT_FOUND)
    @ExceptionHandler(ObjectNotFoundExpection.class)
    public ExceptionDTO handlerObjectNotFoundExpection(ObjectNotFoundExpection exception) {
        return new ExceptionDTO(exception.getMessage());
    }
}
