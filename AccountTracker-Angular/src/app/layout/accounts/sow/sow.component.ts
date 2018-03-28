import { Component, Input, OnInit,OnChanges, NgModule, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SowService } from '../../../shared';
import { Globals } from '../../../shared';
import { CurrencyPipe } from '@angular/common';

import { DataTable, DataTableResource } from 'angular-4-data-table';

@Component({
  selector: 'app-sow',
  templateUrl: './sow.component.html',
  styleUrls: ['./sow.component.scss']
})
export class SowComponent implements OnInit {
  SOWDetails: any = {};

  submitButton :boolean = false;
  saveButton: boolean = true;
  addSOWForm : boolean = false;
  SOWList:any;
  SuccessSave : string = '';
  SuccessMail : string = '';
  MSAId : string;
  MSAName : string;


  @ViewChild(DataTable) SOWTable: DataTable;

  constructor(
      private router: Router,
      private route: ActivatedRoute,
      private sowService : SowService
  ) {

  }
  @ViewChild('f') form: any;
  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
       this.MSAId = params['id'];
       this.MSAName  = params['name'];
       console.log(this.MSAName);
       // this.loginid = sessionStorage.getItem('username');
       // if ( this.employeeid === undefined ) {
       //     this.employeeid = this.loginid;
       // }
       this.getSOW();
    });
      //this.getSOW();
  }

  hideTab() : void {
      this.addSOWForm = false;
  }

  getSOW(): void {

    this.sowService.getSOWList(this.MSAId).subscribe(
        (response) =>{
          console.log(response);
            this.SOWList = response[0].data;
        },
        (error) => {
            alert(error);
            console.log(error);
        }
    );
  }

  addSOW() {
      this.form.reset();
      this.SOWDetails = {};
      this.addSOWForm = true;

  }
  editSOW(sow) {
    console.log(sow);
    this.SOWDetails = sow;
    //this.SOWDetails.Account_Name = this.accountName;
    this.addSOWForm = true;

  }

  save(model : any) {

      if (this.form.valid) {
          var modelData = Object.assign({}, model);
          modelData.MSA_Id = this.MSAId;

          if(this.SOWDetails.SOW_Id === undefined) //This means new msa addition since there is no msa ID for initial save.
          {
            this.sowService.addSOWDetails(modelData)
            .subscribe(
                (response) =>{
                    let body = response.json();

                    this.SuccessSave = body.message;
                    this.getSOW();
                    setTimeout(()=> {    //<<<---    using ()=> syntax
                        this.SuccessSave = "";
                    },4000);
                    this.addSOWForm = false;
                },
                (error) => {
                    alert(error);
                    console.log(error);
                }
            );
          }
          else
          {
            modelData.SOW_Id = this.SOWDetails.SOW_Id;
            this.sowService.updateSOWDetails(modelData) // Updating existing MSA.
            .subscribe(
                (response) =>{
                    let body = response.json();

                    this.SuccessSave = body.message;
                    this.getSOW();
                    setTimeout(()=> {    //<<<---    using ()=> syntax
                        this.SuccessSave = "";
                    },4000);
                    this.addSOWForm = false;
                },
                (error) => {
                    alert(error);
                    console.log(error);
                }
            );
          }

      }
      else {
          alert("Required fields are manadatory")
      }
  }
}
