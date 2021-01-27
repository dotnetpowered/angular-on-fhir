import { Injectable } from '@angular/core';
import Client from 'fhirclient/lib/Client';
import { fhirclient } from 'fhirclient/lib/types';

@Injectable({
  providedIn: 'root',
})
export class Globals {

  patient: fhirclient.FHIR.Patient;
  fhirClient: Client;

}