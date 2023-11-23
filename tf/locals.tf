locals {
  project = "cvs"
  component = "dft"

  tags = {
    Env        = terraform.workspace
    Project    = "${local.project}"
    Service    = "cvs-tf-service"
    Managed_By = "terraform"
  }

  csi = replace(
    format(
      "%s-%s-%s",
      local.project,
      terraform.workspace,
      local.component,
    ),
    "_",
    "",
  )

  csi_name = replace(
    format(
      "%s-%s-%s-%s",
      local.project,
      terraform.workspace,
      local.component,
      "defects-iva",
    ),
    "_",
    "",
  )
}