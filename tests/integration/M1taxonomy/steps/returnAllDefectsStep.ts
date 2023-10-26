import {Given, When, Then} from "@cucumber/cucumber"
import chai from "chai"
import { generateToken } from "./common"
const {expect}=chai;
var token : string;

var baseURL="https://api.integration.cvs.dvsacloud.uk/integration/v3/technical-records/search/"

Given('A token is generated for authorization', async function () {
  token=await generateToken()
});


When('I hit the M1 taxonomy {string}', async function (endpoint:string) {
  const url=`${baseURL}/${endpoint}`
  const options={
    method:'GET',
    headers:{
      'Authorization':`Bearer ${token}`,
    }
  }
  console.log(options.headers)
  const response= await fetch(url, options);
  this.response= response;
});

Then('status code should be {int}',async function (statuscode:number) {
  console.log(this.response.status)
  expect(this.response.status).to.equal(statuscode)
});

Then('should return all defects in the database', async function () {
  const responseData= await this.response.json()
 expect(responseData).to.have.property('Defects')
});





