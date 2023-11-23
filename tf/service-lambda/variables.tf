variable "service_name" {
  description = "Service name e.g. defects"
  type        = string
  default     = ""
}

variable "handler" {
  description = "The lambda handler entry point"
  type        = string
  default     = ""
}

variable "description" {
  description = "Description of the service lambda (workspace will be appended)"
  type        = string
  default     = ""
}

variable "component" {
  description = "Service component e.g. dft"
  type        = string
  default     = ""
}

variable "project" {
  type        = string
  description = "The name of the tfscaffold project"
  default     = "cvs"
}

variable "invoker_arn" {
  type        = string
  description = "The arn of the service that can invoke this lambda"
  default     = ""
}

variable "bucket_name" {
  type        = string
  description = "The bucket name this service is persisted"
  default     = "cvs-services"
}

variable "bucket_key" {
  type        = string
  description = "The bucket key this service is persisted"
  default     = ""
}

variable "csi" {
  type = string
  description = "CSI for use in resources with a global namespace, i.e. S3 Buckets"
  default = ""
}

variable "csi_name" {
  type = string
  description = "CSI for use in resources with a global namespace, i.e. S3 Buckets"
  default = ""
}