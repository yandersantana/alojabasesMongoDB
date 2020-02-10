import { Component, OnInit, ViewChild } from '@angular/core';
import { Producto } from './producto';
import { AngularFirestore } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { DxFormComponent } from 'devextreme-angular';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {

  producto: Producto
  public items: Observable<any[]>;
  clasificaciones:string[] = ['Ceramica', 'Porcelanato','Inodoros']
  uniMedida:string[] = ['Unidad', 'Metros2','Juego']
  estadoAct:string[] = ['Activo', 'Inactivo',]
  @ViewChild("productoForm", { static: false }) dxForm: DxFormComponent

  constructor(private db: AngularFirestore) {
    this.producto = new Producto()
    this.items = db.collection('/productos').valueChanges()
    console.log(this.items)
  }

  ngOnInit() {
  }

  click(e) {
    if (this.dxForm.instance.validate().isValid) {
      this.db.collection('/productos').add(this.dxForm.formData).then(_ => { alert("Se ha añadido un producto"); this.dxForm.instance.resetValues() })
    }

  }

}
