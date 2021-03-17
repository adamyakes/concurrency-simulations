import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { SaveCode } from '../css_pb';
import { BackendService } from './backend.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public code: BehaviorSubject<string> = new BehaviorSubject('Loading...');

  constructor(private backendService: BackendService) {
    const code = localStorage.getItem('save-code');
    if (code) {
      this.code.next(code);
    } else {
      backendService.getNewSaveCode().subscribe(newCode =>{
        localStorage.setItem('save-code', newCode);
        this.code.next(newCode);
      });
    }
  }

  setCode(code: string): Observable<boolean> {
    if (code === this.code.getValue()) {
      return of(true);
    }
    return new Observable<boolean>(subscriber => {
      this.backendService.validateSaveCode(code).subscribe(result => {
        if (result) {
          localStorage.setItem('save-code', code);
          this.code.next(code);
        }
        return subscriber.next(result);
      });
    });
  }

  getNewCode(): Observable<void> {
    return new Observable<void>(subscriber => {
      this.backendService.getNewSaveCode().subscribe(newCode => {
        localStorage.setItem('save-code', newCode);
        this.code.next(newCode);
        subscriber.next();
      });
    });
  }

  getSaveCode(): SaveCode {
    const saveCode = new SaveCode();
    saveCode.setSaveCode(this.code.getValue());
    return saveCode;
  }

}
