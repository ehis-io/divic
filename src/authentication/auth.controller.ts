// // import {
// //   Body,
// //   Controller,
// //   HttpCode,
// //   Post,
// //   UnauthorizedException,
// // } from '@nestjs/common';
// // import { AuthenticationService } from './services/authentication.service';
// // import { OpenId } from './services/auth.biometrics.service';

// // @Controller('auth')
// // export class AuthController {
// //   constructor(
// //     private readonly service: OpenId,
// //     private authenticationService: AuthenticationService,
// //   ) {}

// //   @Post('/request-start')
// //   async requestRegister(@Body() body) {
// //     return this.authenticationService.loginWithOutpassword();
// //     return this.service.WebAuthnRegisterStart(body);
// //   }
// //   @Post('/request-finish')
// //   async requestFinish(@Body() body) {
// //     return this.service.WebAuthnRegisterFinish(body);
// //   }
// //   @Post('/login-start')
// //   async loginStart(@Body() body) {
// //     return this.service.WebAuthnAuthenticateStart(body);
// //   }
// //   @Post('/login-finish')
// //   async loginFinish(@Body() body) {
// //     return this.service.WebAuthnAuthenticateFinish(body);
// //   }
// // }

// import { Controller, Post, Body } from '@nestjs/common';
// import { Fido2Service } from './services/auth.biometrics.service';
// import { Login } from './dto/login.dto';

// @Controller('fido2')
// export class Fido2Controller {
//   constructor(private readonly fido2Service: Fido2Service) {}

//   @Post('register')
//   async register(@Body() body: any): Promise<any> {
//     return this.fido2Service.register(body);
//   }

//   @Post('authenticate')
//   async authenticate(@Body() body: any): Promise<any> {
//     return this.fido2Service.verfiyRegister(body);
//   }

//   // @Post('register-response')
//   // async registerResponse(@Body() body: any): Promise<any> {
//   //   return this.fido2Service.handleAttestationResponse(body);
//   // }

//   // @Post('authenticate-response')
//   // async authenticateResponse(@Body() body: any): Promise<any> {
//   //   return this.fido2Service.handleAssertionResponse(body);
//   // }
// }
