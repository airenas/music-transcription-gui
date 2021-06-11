import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';

@Injectable()
export class Config {
    public transcribeURL: string = "";

    constructor() {
        const prefix = '';
        this.init(prefix);
    }

    init(serverURL: string) {
        this.transcribeURL = environment.transcribeURL;
    }
}
