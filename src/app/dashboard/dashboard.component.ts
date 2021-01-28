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
  sys: string 
  dia: string;
  hdl: string;
  ldl: string;
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

  PatientAge(birthDate)
  {
    const dob = new Date(birthDate);
    const today = new Date();
    let age = Math.floor((today.valueOf()-dob.valueOf()) / (365.25 * 24 * 60 * 60 *1000));
    return age;
  }

  Initials(name: any[]) {
    if (name==null)
      return null;
    let entry = name[0];

    return entry.given[0].charAt(0) + entry.family.charAt(0);
  }

  // helper function to get both systolic and diastolic bp
  getBloodPressureValue(BPObservations, typeOfPressure) {
      var formattedBPObservations = [];
      BPObservations.forEach(function(observation) {
        var BP = observation.component.find(function(component) {
          return component.code.coding.find(function(coding) {
            return coding.code == typeOfPressure;
          });
        });
        if (BP) {
          observation.valueQuantity = BP.valueQuantity;
          formattedBPObservations.push(observation);
        }
    });

    return this.getQuantityValueAndUnit(formattedBPObservations[0]);
  }

  //helper function to get quanity and unit from an observation resoruce.
  getQuantityValueAndUnit(ob) {
    if (typeof ob != 'undefined' &&
      typeof ob.valueQuantity != 'undefined' &&
      typeof ob.valueQuantity.value != 'undefined' &&
      typeof ob.valueQuantity.unit != 'undefined') {
      return Number(parseFloat((ob.valueQuantity.value)).toFixed(2)) + ' ' + ob.valueQuantity.unit;
    } else {
      return undefined;
    }
  }

  ngOnInit(): void {
    console.log('checking SMART/oauth2 ready');
    SMART.ready((client) => {
      console.log('state', client.state);
      console.log('id', client.patient.id);
      console.log('client', client);
      this.globals.fhirClient = client;

      var query = new URLSearchParams();
      query.set("patient", client.patient.id);
      query.set("_count", "100");
      query.set("_sort", "-date");
      query.set("code", [
        'http://loinc.org|18262-6',
        'http://loinc.org|8462-4',
        'http://loinc.org|8480-6',
        'http://loinc.org|2085-9',
        'http://loinc.org|2089-1',
        'http://loinc.org|55284-4'
      ].join(","));
      client.request<fhirclient.FHIR.Observation[]>("Observation?" + query, {
        pageLimit: 0,
        flat: true
      }).then(ob=>{ 
          // group all of the observation resoruces by type into their own
          var byCodes = client.byCodes(ob, 'code');
          var systolicbp = this.getBloodPressureValue(byCodes('55284-4'), '8480-6');
          var diastolicbp = this.getBloodPressureValue(byCodes('55284-4'), '8462-4');
          var hdl = byCodes('2085-9');
          var ldl = byCodes('18262-6') || byCodes('2089-1');

          if (typeof systolicbp != 'undefined') {
            this.sys = systolicbp;
          } else {
            this.sys = 'undefined'
          }

          if (typeof diastolicbp != 'undefined') {
            this.dia = diastolicbp;
          } else {
            this.dia = 'undefined'
          }
          this.hdl = this.getQuantityValueAndUnit(hdl[0]);
          this.ldl = this.getQuantityValueAndUnit(ldl[0]);
      });

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
