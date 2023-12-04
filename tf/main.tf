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
  alias  = "mgmt"

  default_tags {
    tags = local.tags
  }
}

provider "aws" {
  region = "eu-west-1"
  assume_role {
    role_arn = "arn:aws:iam::${local.acct_ids[local.provider_profile]}:role/TerraformRole"
  }
  default_tags {
    tags = local.tags
  }
}

provider "aws" {
  region = "us-east-1"
  alias  = "us-east-1"

  assume_role {
    role_arn = "arn:aws:iam::${local.acct_ids[local.provider_profile]}:role/TerraformRole"
  }
  default_tags {
    tags = local.tags
  }
}

module "service_gateway" {
  source              = "git::https://github.com/dvsa/cvs-tf-modules//service-gateway?ref=feature/cb2-9827"

  service_name        = "defects"
  open_api_spec_file  = "./../docs/defects-api.yml"
  lambdas = {
    get_defects     = module.service_lambda_get_iva_defects.lambda_arn
  }
}

module "service_lambda_get_iva_defects" {
  source              = "git::https://github.com/dvsa/cvs-tf-modules//service-lambda?ref=feature/cb2-9827"
  service_name        = "${local.service_name}-get"
  bucket_key          = "${var.bucket_key}"
  handler             = "handler.handler"
  description         = "${local.service_description} Get"
  component           = "${local.component}"
  csi                 = "${local.csi}"
  invoker_arn         = "${module.service_gateway.apigw_arn}/*/*/*"
}
