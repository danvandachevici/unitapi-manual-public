variable "aws_region" {
  description = "The AWS region to deploy resources into."
  type        = string
  default     = "eu-central-1" # Or your desired region
}

variable "project_name" {
  description = "A unique name for your project, used to prefix resources."
  type        = string
  default     = "my-serverless-app"
}
