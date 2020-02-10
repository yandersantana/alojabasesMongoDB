import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-calculadora',
  templateUrl: './calculadora.component.html',
  styleUrls: ['./calculadora.component.css']
})
export class CalculadoraComponent implements OnInit {
  @Input() private visible:boolean=false
  constructor() { }

  ngOnInit() {
  }

  print(event){
    console.log(this.visible)
  }

}
