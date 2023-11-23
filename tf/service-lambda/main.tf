data "aws_lambda_function" "template_lambda" {
  function_name = "defects-${terraform.workspace}"
}

data "aws_iam_policy_document" "assumerole" {
  statement {
    sid     = "AllowLambdaAssumeRole"
    effect  = "Allow"
    actions = ["sts:AssumeRole"]

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

# data "aws_s3_object" "service_hash" {
#   bucket = var.bucket_name
#   key    = "${var.service_name}/latestHash_${terraform.workspace}.txt"
# }

# data "aws_s3_object" "service" {
#   bucket = var.bucket_name
#   key    = "${var.service_name}/${data.aws_s3_object.service_hash.body}.zip"
# }

resource "aws_lambda_function" "service" {
  function_name = "${var.service_name}-${terraform.workspace}"
  s3_bucket     = "${var.bucket_name}"
  s3_key        = "${var.bucket_key}"

  # This should be generated from the zip file as follows:
  # openssl dgst -sha256 -binary lambda.zip | openssl enc -base64
  # source_code_hash = data.aws_s3_object.service.metadata["Sha256sum"]

  handler                        = data.aws_lambda_function.template_lambda.handler
  runtime                        = data.aws_lambda_function.template_lambda.runtime
  role                           = data.aws_lambda_function.template_lambda.role
  description                    = "${var.description} ${terraform.workspace}"
  memory_size                    = data.aws_lambda_function.template_lambda.memory_size
  timeout                        = data.aws_lambda_function.template_lambda.timeout
  reserved_concurrent_executions = data.aws_lambda_function.template_lambda.reserved_concurrent_executions

  dynamic "vpc_config" {
    for_each = data.aws_lambda_function.template_lambda.vpc_config
    content {
      security_group_ids = vpc_config.value["security_group_ids"]
      subnet_ids         = vpc_config.value["subnet_ids"]
    }
  }

  tracing_config {
    mode = "Active"
  }

  # environment {
  #   variables = merge(local.default_env_vars, var.additional_env_vars)
  # }

  # dynamic "dead_letter_config" {
  #   for_each = var.dlq_arn == "" ? [] : [var.dlq_arn]
  #   content {
  #     target_arn = var.dlq_arn
  #   }
  # }

  tags = {
    Component   = var.component
    Module      = "cvs-tf-service"
    Name        = "cvs-${terraform.workspace}-${var.component}/api"
    Environment = terraform.workspace
  }
}

resource "aws_lambda_alias" "main" {
  name             = terraform.workspace
  description      = "Alias for ${aws_lambda_function.service.function_name}"
  function_name    = aws_lambda_function.service.arn
  function_version = "$LATEST"
}


resource "aws_lambda_permission" "allow_invoke" {
  statement_id  = "AllowApiGatewayInvokeLambdaFunction"
  function_name = aws_lambda_function.service.function_name
  action        = "lambda:InvokeFunction"
  principal     = "apigateway.amazonaws.com"
  source_arn    = var.invoker_arn
}

resource "aws_iam_role" "main" {
  name = var.csi_name

  assume_role_policy = data.aws_iam_policy_document.assumerole.json

  tags = merge(
    {
      "Name" = "${var.csi}/${var.service_name}",
    },
  )
}

resource "aws_iam_role_policy_attachment" "role-policy-attachment-default" {
  for_each   = toset(local.default_iam_policies)
  role       = aws_iam_role.main.name
  policy_arn = each.value
}
