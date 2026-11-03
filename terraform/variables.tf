variable "aws_region" {
  description = "AWS deployment region"
  type        = string
  default     = "us-east-1"
}

variable "environment" {
  description = "Application deployment environment"
  type        = string
  default     = "production"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr" {
  description = "Public Subnet CIDR block"
  type        = string
  default     = "10.0.1.0/24"
}

variable "availability_zone" {
  description = "Target Availability Zone"
  type        = string
  default     = "us-east-1a"
}

variable "instance_type" {
  description = "EC2 Instance size for CivicTrack multi-container stack"
  type        = string
  default     = "t3.medium"
}

variable "key_name" {
  description = "AWS EC2 Key Pair name for SSH access"
  type        = string
  default     = "civictrack-key"
}
