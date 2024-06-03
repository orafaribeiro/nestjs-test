terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.50.0"
    }
  }
}

// Amazon Machine Image - Ele serve como a unidade básica de implantação para serviços entregues usando EC2
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

// Servidor virtual no Elastic Compute Cloud (EC2)
resource "aws_instance" "jenkins-test" {
  ami                         = "ami-09040d770ffe2224f"
  instance_type               = "m5.large"
  key_name                    = "jenkins-test2"
  security_groups             = ["${aws_security_group.security.id}"]
  associate_public_ip_address = true
  subnet_id                   = aws_subnet.subnet.id

  tags = {
    Name = "jenkins-test"
  }
}

// Um Endereço IP elástico é um endereço IPv4 estático projetado para computação em nuvem dinâmica
resource "aws_eip" "ip-test-env" {
  instance = aws_instance.jenkins-test.id
}

/*variable "cidr_block" {
  description = "CIDR Block"
  type        = string
}*/

// Amazon Virtual Private Cloud - A VPC é uma rede virtual muito semelhante a uma rede tradicional que você pode operar no seu próprio datacenter.
resource "aws_vpc" "test_env" {
  // O CIDR permite que os roteadores organizem endereços IP em várias sub-redes com mais eficiência. Uma sub-rede é uma rede menor existente dentro de outra. Por exemplo, todos os dispositivos conectados a um roteador estão na mesma sub-rede e têm o mesmo prefixo de endereço IP.
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
}

// Uma sub-rede é um intervalo de endereços IP na VPC. É possível criar recursos da AWS, como instâncias do EC2, em sub-redes específicas.
resource "aws_subnet" "subnet" {
  cidr_block        = cidrsubnet(aws_vpc.test_env.cidr_block, 3, 1)
  vpc_id            = aws_vpc.test_env.id
  availability_zone = "us-east-2a"
}

// Um gateway da Internet é um componente da VPC horizontalmente dimensionado, redundante e altamente disponível que permite a comunicação entre a VPC e a Internet. Ele oferece suporte para tráfego IPv4 e IPv6. Não causa riscos de disponibilidade ou restrições de largura de banda no tráfego de rede.
resource "aws_internet_gateway" "test_env_gw" {
  vpc_id = aws_vpc.test_env.id
}

// A route table contains a set of rules, called routes, that determine where network traffic from your subnet or gateway is directed.
resource "aws_route_table" "route-table-test-env" {
  vpc_id = aws_vpc.test_env.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.test_env_gw.id
  }
}

// Associates a subnet with a route table. The subnet and route table must be in the same VPC. This association causes traffic originating from the subnet to be routed according to the routes in the route table.
resource "aws_route_table_association" "subnet-association" {
  subnet_id      = aws_subnet.subnet.id
  route_table_id = aws_route_table.route-table-test-env.id
}

// Um grupo de segurança controla o tráfego que tem permissão para acessar e sair dos recursos aos quais está associado. Por exemplo, depois de associar um grupo de segurança a uma instância do EC2, ele controla o tráfego de entrada e saída da instância.
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
