import { APIGatewayProxyEvent } from 'aws-lambda';
import { validateIvaDefectManualQuery } from '../../../src/validators/iva/ivaDefectsByManualValidator';
import { mockToken } from '../../util/mockToken';

describe('test the iva defect manual query error validator', () => {
  it('should return Missing authorization header', () => {
    const event = {
      pathParameters: { id: 'M1' },
      headers: {},
    };
    const res = validateIvaDefectManualQuery(event as unknown as APIGatewayProxyEvent);
    expect(res).toEqual({
      statusCode: 400,
      body: "Missing authorization header",
    });
  });

  it('should return an error when missing a manual ID', () => {
    const event = {
      pathParameters: {},      
      headers: {
        Authorization: mockToken,
      },
    };
    const res = validateIvaDefectManualQuery(event as unknown as APIGatewayProxyEvent);

    expect(res).toEqual({
      "statusCode": 400,
      "body": "{\"errors\":[\"Missing id\"]}",
      "headers": {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
          "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS"
      }
    });
  });

  it('should return undefined when no errors', () => {
    const event = {
        pathParameters: { id: 'M1' },
        headers: {
        Authorization: mockToken,
      },
    };
    const res = validateIvaDefectManualQuery(event as unknown as APIGatewayProxyEvent);
    expect(res).toBeUndefined();
  });
});
