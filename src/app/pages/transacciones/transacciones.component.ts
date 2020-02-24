import { Component, OnInit } from '@angular/core';
import { transaccion } from './transacciones';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore } from 'angularfire2/firestore';

@Component({
  selector: 'app-transacciones',
  templateUrl: './transacciones.component.html',
  styleUrls: ['./transacciones.component.scss']
})
export class TransaccionesComponent implements OnInit {

 transacciones : transaccion[] = []

  constructor(private db: AngularFirestore, public  afAuth:  AngularFireAuth) { }

  ngOnInit() {
    this.db.collection('/transacciones').valueChanges().subscribe((data:transaccion[]) => {
      this.transacciones = data

    })
  }

}
