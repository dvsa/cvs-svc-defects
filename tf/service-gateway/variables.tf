variable "service_name" {
  description = "Service name e.g. defects"
  type        = string
  default     = ""
}

variable "open_api_spec_file" {
  description = "The path to the open api spec to generate the api gateway"
  type        = string
  default     = ""
}