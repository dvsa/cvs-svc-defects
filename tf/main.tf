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

module "service_gateway" {
  source              = "./service-gateway"

  service_name        = "defects"
  open_api_spec_file  = "./../docs/defects-api.yml"
}
