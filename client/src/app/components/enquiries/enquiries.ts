import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EnquiryService } from '../../services/enquiry';
import { Enquiry } from '../../models/enquiry';

@Component({
  selector: 'app-enquiries',
  imports: [FormsModule, CommonModule],
  templateUrl: './enquiries.html',
  styleUrl: './enquiries.css',
})
export class Enquiries implements OnInit {

  enqServ=inject(EnquiryService);
  enqs: Enquiry[]=[];
  replyMsg:string='';
  activeEnqId:string |null=null;


  ngOnInit(): void {
    this.loadEnqs();
  }
  loadEnqs(){
    this.enqServ.getEnq().subscribe({
      next:(data)=>this.enqs=data,
      error:(err)=>console.error('Error loading enquiries ->',err)
    })
  }

  openReply(id:string|undefined){
    if(id){
      this.activeEnqId=id;
      this.replyMsg='';
    }
  }
  sendReply(){
    if(!this.activeEnqId) return;

    this.enqServ.reply(this.activeEnqId,this.replyMsg).subscribe({
      next:()=>{
        alert('Reply sent!');
        this.activeEnqId=null;
        this.loadEnqs();
      },
      error:(err)=>alert('Error while sending reply')
    })
  }

}
