terraform {
  required_version = "~>1.0"

  backend "s3" {
    bucket         = "cvs-tf-environment"
    key            = "tf_state/defects_api"
    region         = "eu-west-1"
    dynamodb_table = "cvs-tf-environment"
    profile        = "mgmt"
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.7.0"
    }
  }
}

locals {
  is_feature            = length(regexall("[A-Za-z0-9]+-\\d+", terraform.workspace)) > 0
  domain_name           = data.terraform_remote_state.current_or_dev.outputs.domain_name
  base_lambda_auth_name = data.aws_api_gateway_authorizer.primary_api_authorizer.name
}

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
  name = data.terraform_remote_state.current_or_dev.workspace
}

data "aws_api_gateway_authorizer" "primary_api_authorizer" {
  rest_api_id = data.aws_api_gateway_rest_api.primary_api_gateway.id
  authorizer_id = data.terraform_remote_state.current_or_dev.outputs.lambda_authorizer_id
}

resource "aws_api_gateway_rest_api" "defects_api" {
  name                = "${terraform.workspace}-defects-api"
  binary_media_types  = ["application/octet-stream"]
  body                = templatefile(
    "${path.module}/../docs/defects-api.yml",
    {
      lambda_auth_name        = "${local.base_lambda_auth_name}"
      authorizerUri           = "${data.aws_api_gateway_authorizer.primary_api_authorizer.authorizer_uri}"
      authorizerCredentials   = "${data.aws_api_gateway_authorizer.primary_api_authorizer.authorizer_credentials}"
    }
  )
  policy              = data.aws_api_gateway_rest_api.primary_api_gateway.policy
  tags                = {
    Environment = terraform.workspace
  }
}

resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.defects_api.id
  triggers    = {
    workspace = terraform.workspace
    redeployment = sha1(jsonencode([
      aws_api_gateway_rest_api.defects_api.body,
    ]))
  }
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "defects_api_stage" {
  rest_api_id          = aws_api_gateway_rest_api.defects_api.id
  deployment_id        = aws_api_gateway_deployment.deployment.id
  stage_name           = terraform.workspace
  xray_tracing_enabled = true

  tags = {
    Environment = terraform.workspace
  }
  depends_on = [aws_api_gateway_deployment.deployment]
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_base_path_mapping" "defect_api_gateway_mapping" {
  api_id      = aws_api_gateway_rest_api.defects_api.id
  stage_name  = aws_api_gateway_stage.defects_api_stage.stage_name
  domain_name = local.domain_name
  base_path   = "defects-api"
}
