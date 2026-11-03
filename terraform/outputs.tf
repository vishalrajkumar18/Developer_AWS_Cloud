output "ec2_public_ip" {
  description = "Public Elastic IP address of CivicTrack EC2 server"
  value       = aws_eip.civictrack_eip.public_ip
}

output "application_url" {
  description = "CivicTrack Web Application URL"
  value       = "http://${aws_eip.civictrack_eip.public_ip}"
}

output "api_url" {
  description = "CivicTrack Backend REST API URL"
  value       = "http://${aws_eip.civictrack_eip.public_ip}:5000"
}

output "prometheus_url" {
  description = "Prometheus Metrics Explorer URL"
  value       = "http://${aws_eip.civictrack_eip.public_ip}:9090"
}

output "grafana_url" {
  description = "Grafana Monitoring Dashboard URL (User/Pass: admin/admin)"
  value       = "http://${aws_eip.civictrack_eip.public_ip}:3001"
}

output "ecr_frontend_repository_url" {
  description = "ECR Repository URL for Frontend Docker Image"
  value       = aws_ecr_repository.frontend_repo.repository_url
}

output "ecr_backend_repository_url" {
  description = "ECR Repository URL for Backend Docker Image"
  value       = aws_ecr_repository.backend_repo.repository_url
}

output "ssh_command" {
  description = "SSH Command to access EC2 server"
  value       = "ssh -i ${var.key_name}.pem ubuntu@${aws_eip.civictrack_eip.public_ip}"
}
