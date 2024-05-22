terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.50.0"
    }
  }
}

data "aws_ami" "ubuntu" {
  most_recent = true

  filter {
    name   = "name"
    values = ["ubuntu/images/hvm-ssd/ubuntu-focal-20.04-amd64-server-*"]
  }

  filter {
    name   = "virtualization-type"
    values = ["hvm"]
  }

  owners = ["099720109477"] # Canonical
}

resource "aws_instance" "jenkins-test" {
  ami                         = "ami-09040d770ffe2224f"
  instance_type               = "t2.micro"
  key_name                    = "jenkins-test2"
  security_groups             = ["${aws_security_group.security.id}"]
  associate_public_ip_address = true
  subnet_id                   = aws_subnet.subnet.id

  tags = {
    Name = "jenkins-test"
  }
}

resource "aws_eip" "ip-test-env" {
  instance = aws_instance.jenkins-test.id
}

/*variable "cidr_block" {
  description = "CIDR Block"
  type        = string
}*/

resource "aws_vpc" "test_env" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
}

resource "aws_subnet" "subnet" {
  cidr_block        = cidrsubnet(aws_vpc.test_env.cidr_block, 3, 1)
  vpc_id            = aws_vpc.test_env.id
  availability_zone = "us-east-2a"
}

resource "aws_internet_gateway" "test_env_gw" {
  vpc_id = aws_vpc.test_env.id
}

resource "aws_route_table" "route-table-test-env" {
  vpc_id = aws_vpc.test_env.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.test_env_gw.id
  }
}
resource "aws_route_table_association" "subnet-association" {
  subnet_id      = aws_subnet.subnet.id
  route_table_id = aws_route_table.route-table-test-env.id
}

resource "aws_security_group" "security" {
  name = "allow-all"

  vpc_id = aws_vpc.test_env.id

  ingress {
    cidr_blocks = [
      "0.0.0.0/0"
    ]
    from_port = 22
    to_port   = 22
    protocol  = "tcp"
  }

  ingress {
    description = "HTTP to EC2"
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    description = "Jenkins to EC2"
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = -1
    cidr_blocks = ["0.0.0.0/0"]
  }
}
