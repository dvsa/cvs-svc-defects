locals {
  is_feature                    = length(regexall("[A-Za-z0-9]+-\\d+", terraform.workspace)) > 0
  domain_name                   = data.terraform_remote_state.current_or_dev.outputs.domain_name
  base_api_gateway_name         = data.terraform_remote_state.current_or_dev.workspace
  base_lambda_auth_id           = data.terraform_remote_state.current_or_dev.outputs.lambda_authorizer_id
  base_lambda_auth_name         = data.aws_api_gateway_authorizer.primary_api_authorizer.name
  base_lambda_auth_uri          = data.aws_api_gateway_authorizer.primary_api_authorizer.authorizer_uri
  base_lambda_auth_credentials  = data.aws_api_gateway_authorizer.primary_api_authorizer.authorizer_credentials
}
