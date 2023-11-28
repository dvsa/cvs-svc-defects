output "lambda_arn" {
  description = "The unique ARN of the lambda"
  value = aws_lambda_function.service.qualified_invoke_arn
}
