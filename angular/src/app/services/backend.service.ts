import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CSSClient, CSSPromiseClient } from '../css_grpc_web_pb';
import { DPOptions, Empty, RWOptions, RWState, SaveCode } from '../css_pb';

@Injectable({
  providedIn: 'root'
})
export class BackendService {
  public client: CSSClient;
  private promiseClient: CSSPromiseClient;
  private closer: Closer;
  private startSubject: Subject<void> = new Subject();

  constructor() {
    this.client = new CSSClient(environment.hostname);
    this.promiseClient = new CSSPromiseClient(environment.hostname);
  }

  cancelStream(): void {
    this.closer?.close();
  }

  startStream(): void {
    this.startSubject.next();
  }

  readWrite(options: RWOptions): Observable<RWState | string> {
    const stream = this.client.readWrite(options);
    return new Observable<RWState | string>(subscriber => {
      stream.on('data', state => subscriber.next(state));
      stream.on('end', () => subscriber.complete());
      stream.on('error', err => {
        console.error(err);
        subscriber.error(err);
      });
    });
  }

  validateSaveCode(code: string): Observable<boolean> {
    return new Observable<boolean>(subscribe => {
      const saveCode = new SaveCode();
      saveCode.setSaveCode(code);
      this.client.validateSaveCode(saveCode, {}, (err, response) => {
        subscribe.next(response.getValid());
      });
    });
  }

  getNewSaveCode(): Observable<string> {
    return new Observable<string>(subscriber => {
      const empty = new Empty();
      this.client.newSaveCode(empty, {}, (err, response) => {
        if (err) {
          console.log('error:', err);
        }
        subscriber.next(response.getSaveCode());
      });
    });
  }


}

interface Closer {
  close(): void;
}
