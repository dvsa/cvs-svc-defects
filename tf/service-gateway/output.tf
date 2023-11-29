output "apigw_arn" {
  description = "The service API Gateway ARN"
  value = aws_api_gateway_rest_api.service_api.execution_arn
}