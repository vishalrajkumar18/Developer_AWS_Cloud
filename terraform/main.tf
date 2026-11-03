# ============================================================
# CivicTrack AWS Infrastructure as Code
# VPC, Networking, Security Groups, ECR, IAM, and EC2 Instance
# ============================================================

# 1. Virtual Private Cloud (VPC)
resource "aws_vpc" "civictrack_vpc" {
  cidr_block           = var.vpc_cidr
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "civictrack-vpc-${var.environment}"
  }
}

# 2. Internet Gateway
resource "aws_internet_gateway" "civictrack_igw" {
  vpc_id = aws_vpc.civictrack_vpc.id

  tags = {
    Name = "civictrack-igw-${var.environment}"
  }
}

# 3. Public Subnet
resource "aws_subnet" "civictrack_public_subnet" {
  vpc_id                  = aws_vpc.civictrack_vpc.id
  cidr_block              = var.public_subnet_cidr
  availability_zone       = var.availability_zone
  map_public_ip_on_launch = true

  tags = {
    Name = "civictrack-public-subnet-${var.environment}"
  }
}

# 4. Route Table
resource "aws_route_table" "civictrack_public_rt" {
  vpc_id = aws_vpc.civictrack_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.civictrack_igw.id
  }

  tags = {
    Name = "civictrack-public-rt-${var.environment}"
  }
}

resource "aws_route_table_association" "civictrack_public_rta" {
  subnet_id      = aws_subnet.civictrack_public_subnet.id
  route_table_id = aws_route_table.civictrack_public_rt.id
}

# 5. Security Group
resource "aws_security_group" "civictrack_sg" {
  name        = "civictrack-ec2-sg-${var.environment}"
  description = "Allow HTTP, HTTPS, API, Monitoring, and SSH traffic"
  vpc_id      = aws_vpc.civictrack_vpc.id

  # HTTP
  ingress {
    description = "HTTP Port"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS
  ingress {
    description = "HTTPS Port"
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Frontend alternative port
  ingress {
    description = "Frontend Port 3000"
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Flask Backend API
  ingress {
    description = "Flask Backend API Port"
    from_port   = 5000
    to_port     = 5000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Prometheus
  ingress {
    description = "Prometheus Metrics"
    from_port   = 9090
    to_port     = 9090
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Grafana Dashboard
  ingress {
    description = "Grafana Monitoring Dashboard"
    from_port   = 3001
    to_port     = 3001
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH Access
  ingress {
    description = "SSH Access"
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # Outbound All
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "civictrack-sg-${var.environment}"
  }
}

# 6. Amazon ECR Repositories for Docker Images
resource "aws_ecr_repository" "frontend_repo" {
  name                 = "civictrack-frontend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

resource "aws_ecr_repository" "backend_repo" {
  name                 = "civictrack-backend"
  image_tag_mutability = "MUTABLE"

  image_scanning_configuration {
    scan_on_push = true
  }
}

# 7. IAM Role for EC2 Instance (ECR Read & SSM Access)
resource "aws_iam_role" "ec2_role" {
  name = "civictrack-ec2-iam-role-${var.environment}"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "ecr_readonly" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

resource "aws_iam_role_policy_attachment" "ssm_managed" {
  role       = aws_iam_role.ec2_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore"
}

resource "aws_iam_instance_profile" "ec2_profile" {
  name = "civictrack-ec2-instance-profile-${var.environment}"
  role = aws_iam_role.ec2_role.name
}

# 8. Latest Ubuntu 22.04 LTS AMI Data Source
data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

# 9. EC2 Instance for CivicTrack Application Stack
resource "aws_instance" "civictrack_server" {
  ami                  = data.aws_ami.ubuntu.id
  instance_type        = var.instance_type
  subnet_id            = aws_subnet.civictrack_public_subnet.id
  vpc_security_group_ids = [aws_security_group.civictrack_sg.id]
  iam_instance_profile = aws_iam_instance_profile.ec2_profile.name
  key_name             = var.key_name

  root_block_device {
    volume_size           = 30
    volume_type           = "gp3"
    delete_on_termination = true
  }

  # Cloud-init User Data script
  user_data = <<-EOF
              #!/bin/bash
              set -e
              apt-get update -y
              apt-get install -y ca-certificates curl gnupg lsb-release git

              # Install Docker
              mkdir -p /etc/apt/keyrings
              curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
              echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
              apt-get update -y
              apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

              # Enable & Start Docker
              systemctl enable docker
              systemctl start docker
              usermod -aG docker ubuntu

              # Create app directory
              mkdir -p /opt/civictrack
              chown -R ubuntu:ubuntu /opt/civictrack
              EOF

  tags = {
    Name = "civictrack-server-${var.environment}"
  }
}

# 10. Elastic IP for Stable Public Endpoint
resource "aws_eip" "civictrack_eip" {
  instance = aws_instance.civictrack_server.id
  domain   = "vpc"

  tags = {
    Name = "civictrack-eip-${var.environment}"
  }
}
