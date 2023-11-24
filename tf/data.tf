data "aws_secretsmanager_secret" "acct_ids" {
  provider = aws.mgmt
  name     = "terraform/account-ids"
}

data "aws_secretsmanager_secret_version" "acct_ids" {
  provider  = aws.mgmt
  secret_id = data.aws_secretsmanager_secret.acct_ids.id
}

data "aws_caller_identity" "current" {}