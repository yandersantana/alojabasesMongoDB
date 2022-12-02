import { Request, Response } from 'express';
import { HttpClient } from "@angular/common/http";


export class BancoController {
  constructor(public http: HttpClient){}

    public async listar_bancos(req: Request, res: Response): Promise<void> {
        var url = "http://159.223.107.115:3000/usuario/getUsers"
        var data = this.http.get<any>(url);
        console.log(data)
    }

   
}


