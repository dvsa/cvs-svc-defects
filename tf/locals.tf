locals {
  project = "cvs"
  component = "dft"
  service_name = "defects-iva"
  service_description = "Defects IVA service"

  main_envs     = concat(local.prod_envs, local.non_prod_envs)
  non_prod_envs = ["develop", "devops", "integration"]
  prod_envs     = ["prod", "preprod"]

  is_feature     = length(regexall("[A-Za-z0-9]+-\\d+", terraform.workspace)) > 0
  is_nonprod_env = contains(local.non_prod_envs, terraform.workspace) || local.is_feature

  provider_profile = local.is_nonprod_env ? "develop" : "prod"

  acct_ids = jsondecode(data.aws_secretsmanager_secret_version.acct_ids.secret_string)

  tags = {
    Env        = terraform.workspace
    Project    = "${local.project}"
    Service    = "cvs-tf-service"
    Managed_By = "terraform"
  }

  csi = replace(
    format(
      "%s-%s-%s-%s",
      local.project,
      terraform.workspace,
      local.component,
      local.service_name,
    ),
    "_",
    "",
  )
}