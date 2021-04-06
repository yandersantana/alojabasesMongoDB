import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BulkUploadService {

  //private baseUrl = 'http://localhost:3000/upload';
  private baseUrl = 'http://104.248.14.190:3000/upload'; //localhost
  //private baseUrl = 'http://104.131.82.174:3000/upload';

  constructor(private http: HttpClient) { }

  upload(file: File): Observable<any> {
    const formData: FormData = new FormData();

    formData.append('file', file);
console.log(file)
    const req = new HttpRequest('POST', `${this.baseUrl}/uploadBulkFile`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any>  {
    return this.http.get(`${this.baseUrl}/files`);
  }
}
