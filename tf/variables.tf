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