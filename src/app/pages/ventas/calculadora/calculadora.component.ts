import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.css']
})
export class CalculadoraComponent implements OnInit {
  @Input() visible:boolean=false
  constructor() { }

  ngOnInit() {
  }

  print(){
    console.log(this.visible)
  }

}
