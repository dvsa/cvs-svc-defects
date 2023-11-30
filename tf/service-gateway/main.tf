# data "aws_iam_policy_document" "defects_policy_document" {
#   statement {
#     sid     = "AllowAPIGAssumeRole"
#     effect  = "Allow"
#     actions = ["sts:AssumeRole"]

#     principals {
#       type        = "Service"
#       identifiers = ["apigateway.amazonaws.com"]
#     }
#   }
# }

# resource "aws_iam_role" "defects_role" {
#   name = "${var.csi}-defects-apigw"

#   assume_role_policy = data.aws_iam_policy_document.defects_policy_document.json

#   tags = merge(
#     {
#       "Name" = "${var.csi}-defects-apigw",
#     },
#   )
# }

resource "aws_api_gateway_rest_api" "service_api" {
  name                = "${terraform.workspace}-${var.service_name}-api"
  binary_media_types  = ["application/octet-stream"]
  body                = templatefile(
    "${var.open_api_spec_file}",
    {
      lambda_auth_name        = "${local.base_lambda_auth_name}"
      authorizerUri           = "${local.base_lambda_auth_uri}"
      authorizerCredentials   = "${local.base_lambda_auth_credentials}"
      lambdas                 = tomap({
        for key, value in var.lambdas : key => value
      })
    }
  )
  policy              = data.aws_api_gateway_rest_api.primary_api_gateway.policy
  tags                = {
    Environment = terraform.workspace
    Service     = var.service_name
  }
}

resource "aws_api_gateway_deployment" "deployment" {
  rest_api_id = aws_api_gateway_rest_api.service_api.id
  triggers    = {
    workspace = terraform.workspace
    redeployment = sha1(jsonencode([
      aws_api_gateway_rest_api.service_api.body,
    ]))
  }
  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_api_gateway_stage" "service_api_stage" {
  rest_api_id          = aws_api_gateway_rest_api.service_api.id
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

resource "aws_api_gateway_base_path_mapping" "api_gateway_mapping" {
  api_id      = aws_api_gateway_rest_api.service_api.id
  stage_name  = aws_api_gateway_stage.service_api_stage.stage_name
  domain_name = local.domain_name
  base_path   = "${var.service_name}-api"
}
