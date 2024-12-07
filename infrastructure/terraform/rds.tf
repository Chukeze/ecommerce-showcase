resource "aws_db_instance" "podega_db" {
  allocated_storage    = 20
  engine               = "mysql"
  instance_class       = "db.t2.micro"
  name                 = "podega"
  username             = "admin"
  password             = "yourpassword"
  publicly_accessible  = false
}