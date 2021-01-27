import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Globals } from '../shared/globals';
import { oauth2 as SMART } from 'fhirclient';
import { fhirclient } from 'fhirclient/lib/types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers:  []
})
export class DashboardComponent implements OnInit {

  patient: fhirclient.FHIR.Patient;
  user: fhirclient.FHIR.Patient | fhirclient.FHIR.Practitioner | fhirclient.FHIR.RelatedPerson; 

  constructor(private router: Router, private globals: Globals) { }

  PatientName(name: any[]) {
    if (name==null)
      return null;
    let entry =
        name.find(nameRecord => nameRecord.use === "official") || name[0];
    if (!entry) {
        return "No name";
    }
    return entry.given.join(" ") + " " + entry.family;
  }


  Initials(name: any[]) {
    if (name==null)
      return null;
    let entry = name[0];

    return entry.given[0].charAt(0) + entry.family.charAt(0);
  }

  ngOnInit(): void {
    console.log('checking SMART/oauth2 ready');
    SMART.ready((client) => {
      console.log('state', client.state);
      console.log('id', client.patient.id);
      console.log('client', client);
      this.globals.fhirClient = client;

      client.patient.read().then(
        (response) => {
          console.log('patient', response);
          this.patient = response;
          this.globals.patient = response;
        }
      );
      client.user.read().then((response) =>
      {
         console.log('user', response);
         this.user = response;
      });
    });
  }
}
