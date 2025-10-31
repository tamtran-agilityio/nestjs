import { Observable } from 'rxjs';

export interface IResponse<T> {
  data: T;
}

export interface IResponseInterceptor {
  intercept<T>(obs$: Observable<IResponse<T>>): Observable<IResponse<T>>;
}
