import { readFileSync } from "fs";

//export var token:string;


interface RequestBody{
    username:string;
    password: string;                                             
    }

interface TokenResponse{
  token: string;
}
    function readSettingsFile(filePath: string){
    try{
        const settings=JSON.parse(readFileSync(filePath,'utf-8'))
        return settings
    }catch(error){
console.error("Error reading settings file:",error);
throw error;
    }
    
}

export async function generateToken(){
   
    const settings =readSettingsFile(`src/config/settings.json`)
    const{tokenKey,tokenURL,username,password}=settings;

    const headers: Headers = new Headers({
      'Content-Type': 'application/json',
      'x-api-key': `${tokenKey}`, 
    });

    const requestBody:RequestBody={
        "username": username,
        "password": password
    }

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
    };

    try {
      const response = await fetch(tokenURL, requestOptions);
      if (!response.ok) {
        throw new Error(`Token request fails : ${response.status}`);
      }
      const data:TokenResponse= await response.json() as TokenResponse;
      const token: string=data.token;
      return token;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
  