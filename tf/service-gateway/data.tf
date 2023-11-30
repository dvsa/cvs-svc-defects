data "terraform_remote_state" "current_or_dev" {
  backend   = "s3"
  workspace = terraform.workspace
  config = {
    bucket         = "cvs-tf-environment"
    key            = "tf_state"
    region         = "eu-west-1"
    dynamodb_table = "cvs-tf-environment"
    profile        = "mgmt"
  }
}

data "aws_api_gateway_rest_api" "primary_api_gateway" {
  name = local.base_api_gateway_name
}

data "aws_api_gateway_authorizer" "primary_api_authorizer" {
  rest_api_id = data.aws_api_gateway_rest_api.primary_api_gateway.id
  authorizer_id = local.base_lambda_auth_id
}