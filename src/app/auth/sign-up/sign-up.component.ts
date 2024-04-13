/// <reference types="googlemaps" />
import { HttpClient } from '@angular/common/http';
import {
  Component,
  NgZone,
  OnInit,
  ElementRef,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { BaseService } from 'src/app/services/base.service';

declare var google: any;

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  @ViewChild('xyz', { static: true })
  autocompleteInput!: ElementRef<HTMLInputElement>;

  imageUrl = '../../../assets/user.jpg';
  registerForm!: FormGroup;
  imageControl: FormControl = new FormControl();
  hide = true;

  // openTime = this.convertRangeToTime(9);
  // closeTime = this.convertRangeToTime(18);

  countries: any[] = [];
  selectedCountry: any;
  places: any[] = [];
  // autocompleteInput !: string;
  commonPart!:string;
  autocomplete!: google.maps.places.Autocomplete;

  constructor(
    private baseService: BaseService,
    private ngZone: NgZone,
    private formBuilder: FormBuilder
  ) {
    // ////////Address Line
    
    this.registerForm = this.formBuilder.group({
      image: this.imageControl,
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      selectCountry: [this.selectedCountry],
      mobile_number: ['', [Validators.required, this.mobileValidation]],
      password: ['',[
        Validators.required,
        Validators.minLength(8),
        this.passwordValidator,
        // this.passwordNameValidator
      ]],
      hobby:[''],
      zipcode: ['', Validators.required, Validators.pattern('^[0-9]{6}')],
      address1: ['', Validators.required],
      address2: [''],
      state: ['', Validators.required],
      country: ['', Validators.required],
      startRange: ['9'],
      endRange: ['18'],
      openTime: [this.convertRangeToTime(9)],
      closeTime: [this.convertRangeToTime(18)]
    });
    console.log('DEFAULT',this.selectedCountry);
  }
  
  ngOnInit() {
    console.log('autocomplete: ', this.autocomplete);
    console.log('google: ', google);
    console.log('address input: ', this.autocompleteInput);
    // let autocompleteService:any = new google.maps.places.Autocomplete(this.autocompleteInput);
    // console.log(autocompleteService);

    // autocompleteService.addListener("place_changed", () => {
    //   this.ngZone.run(() => {
    //     const places = autocompleteService.getPlaces();
    //     console.log(places);
    //   })
    // })
    this.baseService.getCountries().subscribe(data => {
      this.countries = data;
      let defalut = this.countries.find( c => c.code == 'IN');
      console.log("defalut: ", defalut);
      this.selectedCountry = {...defalut};
      this.registerForm.get('selectCountry')?.setValue(this.selectedCountry);

      console.log("this.selectedCountry:", this.registerForm.get('selectCountry')?.value);
      
      // console.log(this.countries);

    });

    this.registerForm.get('email')?.value
    console.log("this.registerForm.get('email')?.value: ", this.registerForm.get('email')?.value);
    // console.log("google.maps.places.AutocompleteService(): ",new google.maps.places.AutocompleteService());
  }
  // selectCountry(country: any) {
  //   this.selectedCountry = country;
  // }

  getParts(email: string): string[] {
    let parts: string[] = [];
    for (let i = 0; i <= email.length - 3; i++) {
      parts.push(email.substring(i, i + 3));
    }
    // console.log("parts: ",parts);
    return parts;
  }

  passwordNameValidator():any {
    const password = this.registerForm.get('password')?.value.toLowerCase();
    const email = this.registerForm.get('email')?.value.toLowerCase();
    let emailParts = this.getParts(email.split('@')[0]);
    let passwordParts = this.getParts(password);
    
    console.log("emailParts: ", emailParts);
    console.log("passwordParts: ", passwordParts);
    this.commonPart = '';

      for(const part of emailParts){
        if(passwordParts.includes(part)){
          this.commonPart = part;
          break;
      }
    }
    console.log("commonpart",this.commonPart);
    if(this.commonPart !== ''){
      console.log("validations after this");
      this.registerForm.get('password')?.setErrors({ 'noCommon': true });
    }
    else{
      return null;
    }
    

      // console.log("this.getParts(password): ", this.getParts(password));
      
      
      // const emailParts1 = email.split('@')[0].split('.');
      // this.getParts(email.split('@')[0]);
      // console.log("this.getParts(email): ", );


      // const forbiddenSubstrings = emailParts.filter(
      //   (part: any) => part.length > 4
      //   ); // Only consider substrings longer than 2 characters
      //   console.log("forbiddenSubstrings: ", forbiddenSubstrings);
        
      //   for (const substring of forbiddenSubstrings) {
      //     console.log("forbiddenSubstrings: ", forbiddenSubstrings);
      //     console.log("substring: ", substring);
      //     if (password.includes(substring)) {
      //       console.log('teasefasdfasdfd');
      //       return { containsEmailName: true };
      //     }
      //   }
  }

  mobileValidation = (control: any): { [key: string]: boolean } | null  => {
    const mobile = JSON.stringify(control.value);
    if(mobile.length !== 10){
      return { validMobile : true};
      
    }
    return null;
  }
      
  passwordValidator = (control: FormControl): { [key: string]: boolean } | null => {
    const password = control.value;
    if (!/[A-Z]/.test(password)) {
      return { uppercaseRequired: true };
    }
    if (!/[a-z]/.test(password)) {
      return { lowercaseRequired: true };
    }
    if (!/\d/.test(password)) {
      return { numberRequired: true };
    }
    if (!/[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]/.test(password)) {
      return { specialCharRequired: true };
    }
    return null;
  }

  openFileSelector() {
    const fileInput = document.getElementById('fileInput') as HTMLInputElement;
    fileInput.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    // You can handle the file upload logic here
    // For now, just set the image URL
    this.imageUrl = URL.createObjectURL(file);
  }


  selectCountry(country: string){
    console.log("selected country: ",country);
  }

  ///////hobby
  isHobbyError = false;
  hobbies: string[] = [];

  // hobbyLimitValidator(formGroup: FormGroup) {
  //   const hobby = formGroup.get('hobby')?.value;
  //   console.log("hobby: ", hobby);
  //   const hobbiesArray: string[] = formGroup.get('hobbies')?.value;
  //   console.log("hobbiesArray: ", hobbiesArray);
  //   if (hobbiesArray && hobbiesArray.length >= 4) {
  //     return { hobbyLimitExceeded: true };
  //   }
  //   if (hobbiesArray && hobbiesArray.includes(hobby)) {
  //     return { hobbyAlreadyAdded: true };
  //   }
  //   return null;
  // }

  addHobby() {
    const hobbyControl = this.registerForm.get('hobby');
    hobbyControl?.markAsTouched();
    // const hobby = hobbyControl?.value;

    if (hobbyControl?.valid) {
      const hobby = hobbyControl.value;

      if (this.hobbies.includes(hobby)) {
        hobbyControl.setErrors({ hobbyAlreadyAdded: true });
        setTimeout(() => {
          hobbyControl.setErrors(null);
        }, 2000);
      } else if (this.hobbies.length >= 4) {
        hobbyControl.setErrors({ hobbyLimitExceeded: true });
        setTimeout(() => {
          hobbyControl.setErrors(null);
        }, 2000);
      } 
      else if (hobby == ''){
        hobbyControl.setErrors({  emptyField: true })
        setTimeout(() => {
          hobbyControl.setErrors(null);
        }, 2000);
      }
      else {
        this.hobbies.push(hobby);
        hobbyControl.setValue('');
      }
    } 
  }


  close(index: number) {
    this.hobbies.splice(index, 1);
  }
  
  // addHobby(hobby: string) {
  //   if (hobby && this.hobbies.length < 4) {
  //     this.isHobbyError = true;
  //     // console.log(intrest);
  //     this.hobbies.push(hobby);
  //   } else {
  //     this.isHobbyError = false;
  //   }
  // }
  // close(index: number) {
  //   console.log(index);
  //   this.hobbies = this.hobbies
  //     .slice(0, index)
  //     .concat(this.hobbies.slice(index + 1));
  // }


  /////////Address field
  search() {
    console.log('this.autocompleteInput: ', this.autocompleteInput);
    this.autocomplete = new google.maps.places.Autocomplete(
      this.autocompleteInput.nativeElement,
      {
        componentRestrictions: { country: ['IN'] },
        fields: ['address_components', 'geometry'],
        types: ['address'],
      }
    );
    // this.autocompleteInput.focus(); // When the user selects an address from the drop-down, populate the // address fields in the form.

    this.autocomplete.addListener('place_changed', this.fillInAddress);
    // if (this.autocompleteInput === '') {
    //   this.places = [];
    //   return;
    // }
    // this.autocompleteService.getPlacePredictions({ input: this.autocompleteInput }, predictions => {
    //   this.ngZone.run(() => {
    //     this.places = predictions;
    //   });
    // });
  }
  fillInAddress() {
    // Get the place details from the autocomplete object.
    const place = this.autocomplete.getPlace();
    let address1 = '';
    let postcode = ''; // Get each component of the address from the place details, // and then fill-in the corresponding field on the form. // place.address_components are google.maps.GeocoderAddressComponent objects // which are documented at http://goo.gle/3l5i5Mr

    console.log('place', place);

    // this.autocompleteInput.nativeElement = address1;
  }


  ////////open and close time
  startTime() {
    const convertTime = this.convertRangeToTime(this.registerForm.get('startRange')?.value);
    this.registerForm.get('openTime')?.setValue(convertTime);
    // this.openTime = this.convertRangeToTime(parseFloat(hour));
  }
  
  endTime() {
    const convertTime = this.convertRangeToTime(this.registerForm.get('endRange')?.value);
    this.registerForm.get('closeTime')?.setValue(convertTime);
    // this.closeTim`e = this.convertRangeToTime(parseFloat(hour));
  }
  openT(){
    // this.startRange = this.`convertTimeToRange(this.openTime);
    const convertStartRange = this.convertTimeToRange(this.registerForm.get('openTime')?.value);
    const convertEndRange = this.convertTimeToRange(this.registerForm.get('closeTime')?.value);
    this.registerForm.get('startRange')?.setValue(convertStartRange);

    if(!this.validateTime(this.registerForm.get('openTime')?.value)){
      // console.error("please validate time");
      this.registerForm.get('openTime')?.setErrors({incorrect: true});
    }else if(convertStartRange > convertEndRange){
      // alert('Opening Time is greater than closing Time');
      this.registerForm.get('openTime')?.setErrors({oTimeLesser: true});
    }else {
      // console.log( 'Validate Successfully' );
      this.registerForm.get('openTime')?.setErrors(null);
    }
  }
  closeT(){
    // this.endRange = this.c`onvertTimeToRange(this.closeTime);
    const convertStartRange = this.convertTimeToRange(this.registerForm.get('openTime')?.value);
    const convertEndRange = this.convertTimeToRange(this.registerForm.get('closeTime')?.value);
    this.registerForm.get('endRange')?.setValue(convertEndRange);
    if (!this.validateTime(this.registerForm.get('closeTime')?.value)){
      this.registerForm.get('closeTime')?.setErrors({incorrect: true});
    } else if(convertEndRange < convertStartRange){
      this.registerForm.get('closeTime')?.setErrors( { cTimeGreater : true} );
    }
    else {
      this.registerForm.get('closeTime')?.setErrors(null);
    }
    // if(convertRange < )
  }

  validateTime(time: string):boolean{
    let validTimeRegex = /^(0[1-9]|1[0-2]):[0-5][0-9] [APap][Mm]$/;
    if(validTimeRegex.test(time)){
      return true;
    }
    else {
      return false;
    }
  }

  convertTimeToRange(time: string): number {
    // console.log('time: ', time);
    const [hour, minute, period] = time.split(/[:\s]/);
    let hourNumber = parseInt(hour, 10);
    if (period.toUpperCase() === 'PM' && hourNumber !== 12) {
      hourNumber += 12;
    } else if (period.toUpperCase() === 'AM' && hourNumber === 12) {
      hourNumber = 0;
    }
    let hour24 = hourNumber + parseFloat(minute) / 60;
    return parseFloat(hour24.toFixed(2));
  }

  convertRangeToTime(hour: number): string {
    if (hour == 24) {
      hour = 0;
    }
    const isPM = hour > 12 ? true : false;
    const meridian = isPM ? 'PM' : 'AM';
    const hour12 = isPM
      ? hour === 12
        ? 12
        : hour - 12
      : hour === 0
      ? 12
      : hour;
    // console.log([hour, isPM, meridian, hour12]);
    return `${String(Math.floor(hour12)).padStart(2, '0')}:${String(
      (hour % 1) * 60
    ).padStart(2, '0')} ${meridian}`;
  }

  register() {
    // this.registerForm.get('password')?.addValidators(this.passwordNameValidator);
    this.registerForm.updateValueAndValidity();
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
    }
    console.log(this.registerForm.value);
  }
}
