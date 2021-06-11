import { TranscribeResult } from '../api/transcribe-result';
import { Config } from './../config';
import { Injectable } from '@angular/core';
import { FileData } from './file-data';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export abstract class TranscriptionService {
  abstract transcribe(fileData: FileData): Observable<TranscribeResult>;
}

@Injectable()
export class HttpTranscriptionService implements TranscriptionService {

  transcribeUrl: string;

  static asString(error: HttpErrorResponse): string {
    if (error !== null) {
      if (error.status === 401) {
        return 'Neturite teisių?';
      }
      if (error.status === 403) {
        return 'Baigėsi limitas';
      }
      //const value = String(error.error);
    }
    return 'Serviso klaida';
  }

  constructor(public _http: HttpClient, _config: Config) {
    this.transcribeUrl = _config.transcribeURL;
  }

  transcribe(fileData: FileData): Observable<TranscribeResult> {
    const formData = new FormData();
    formData.append('file', fileData.file, fileData.file.name);
    const httpOptions = {
      headers: new HttpHeaders({
        'Accept': 'application/json'
      })
    };

    return this._http.post(this.transcribeUrl, formData, httpOptions)
      .pipe(
        map(res => <TranscribeResult>res), 
        catchError((e) => this.handleError(e)
        ));
  }

  protected handleError(error: HttpErrorResponse): Observable<never> {
    console.error(error);
    const errStr = HttpTranscriptionService.asString(error);
    return throwError(errStr);
  }
}
