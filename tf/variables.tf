# variable "component" {
#   description = "Service component e.g. dft"
#   type        = string
#   default     = "dft"
# }

# variable "project" {
#   type        = string
#   description = "The name of the tfscaffold project"
#   default     = "cvs"
# 

variable "bucket_name" {
    type = string
    description = "The bucket where the service artefact is stored"
    default = ""
}

variable "bucket_key" {
    type = string
    description = "The name of the service artefact"
    default = ""
}

variable "zip_name" {
    type = string
    description = "The name of the zip artefact"
    default = ""
}