import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    standalone: false
})
export class LoginComponent {
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required,Validators.email]),
    password: new FormControl('', Validators.required)
  })

  returnUrl: string;

  constructor(private accountService: AccountService,private router: Router,
              private activatedRoute: ActivatedRoute  ){
                this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/patient'

  }

  onSubmit() {
    //console.log(this.loginForm.value);
    this.accountService.login(this.loginForm.value).subscribe({
     // next: user => console.log(user)
     // next: () => this.router.navigateByUrl('/shop')
     next: () => this.router.navigateByUrl(this.returnUrl)
    })
  }

}
