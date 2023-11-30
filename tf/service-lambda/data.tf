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