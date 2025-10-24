import { HttpException, HttpStatus } from '@nestjs/common';

export class ForbiddenException extends HttpException {
    constructor(message?: string | object | any) {
        super(message, HttpStatus.FORBIDDEN);
    }
}
