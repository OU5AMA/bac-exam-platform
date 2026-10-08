
package com.examplatform.common.exception;

/**
 * Thrown when a request's underlying account is not ACTIVE (e.g. a
 * PENDING_APPROVAL or REJECTED teacher attempting a teacher-privileged
 * action). Not used by any endpoint yet in this chat's scope — business
 * endpoints come later — but CurrentUserService.requireActiveUser() is
 * ready for them to call.
 */
public class AccountNotActiveException extends RuntimeException {
    public AccountNotActiveException(String message) {
        super(message);
    }
}