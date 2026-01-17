import { Component, inject, OnInit } from '@angular/core';
import { CarService } from '../../services/car';
import { RouterLink } from "@angular/router";
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gallery',
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './gallery.html',
  styleUrl: './gallery.css',
})
export class Gallery implements OnInit {

  carServ=inject(CarService);
  cars:any[]=[];
  searchTerm: string = '';

  ngOnInit() {
    this.loadCars();
  }

  loadCars(){
    this.carServ.getCars().subscribe({
      next:(data)=>{
        this.cars=data;
        console.log("Cars ",this.cars);
      },
      error:(err)=>console.error('Error loading cars ->',err)
    })
  }

  get filteredCars() {
    if (!this.searchTerm.trim()) {
      return this.cars;
    }

    const searchLower = this.searchTerm.toLowerCase();
    return this.cars.filter(car =>
      car.make.toLowerCase().includes(searchLower) ||
      car.model.toLowerCase().includes(searchLower) ||
      car.year.toString().includes(searchLower)
    );
  }

}
