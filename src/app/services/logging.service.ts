import { Injectable } from "@angular/core";

@Injectable()
export class LoggingService {
    logError(message: string, displayedToUser: boolean): void {
        console.error(message);
    }
}
