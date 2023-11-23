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

provider "aws" {
  region = "eu-west-1"
  default_tags {
    tags = local.tags
  }
}

data "aws_caller_identity" "current" {}

module "service_gateway" {
  source              = "./service-gateway"

  service_name        = "defects"
  open_api_spec_file  = "./../docs/defects-api.yml"
}

module "service_lambda_get_iva_defects" {
  source              = "./service-lambda"
  service_name        = "defects-iva-get"
  bucket_key          = "defects-iva/cb2-9827.zip"
  handler             = "handler.handler"
  description         = "Defects IVA handler"
  component           = "${local.component}"
  csi                 = "${local.csi}"
  csi_name            = "${local.csi_name}"
  invoker_arn         = module.service_gateway.apigw_arn
}
