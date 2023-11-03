import * as data from "../../../config/settings.json";

interface RequestBody{
    username:string;
    password: string;                                             
    }

interface TokenResponse{
  token: string;
}

export async function generateToken(){
    const headers: Headers = new Headers({
      'Content-Type': 'application/json',
      'x-api-key': `${data.tokenKey}`, 
    });

    const requestBody:RequestBody={
        "username": data.username,
        "password": data.password
    }

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(requestBody),
    };

    try {
      const response = await fetch(data.tokenURL, requestOptions);
      if (!response.ok) {
        throw new Error(`Token request fails : ${response.status}`);
      }
      const responseData:TokenResponse= await response.json() as TokenResponse;
      const token: string=responseData.token;
      return token;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }
  