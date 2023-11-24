data "aws_secretsmanager_secret" "acct_ids" {
  name     = "terraform/account-ids"
}

data "aws_secretsmanager_secret_version" "acct_ids" {
  secret_id = data.aws_secretsmanager_secret.acct_ids.id
}

data "aws_caller_identity" "current" {}