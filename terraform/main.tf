# Configure the AWS Provider
provider "aws" {
  region = var.aws_region
}

# --- AWS Lambda Resources ---

# IAM Role for Lambda Function
resource "aws_iam_role" "lambda_exec_role" {
  name = "${var.project_name}-lambda-exec-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      },
    ]
  })
}

# Attach basic execution policy to the Lambda role
resource "aws_iam_role_policy_attachment" "lambda_policy_attachment" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Zip the Lambda function code
data "archive_file" "lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/../lambda-dist/"
  output_path = "${path.module}/lambda.zip"
}

# AWS Lambda Function
resource "aws_lambda_function" "my_lambda" {
  function_name = "${var.project_name}-lambda"
  handler       = "lambda.handler"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_exec_role.arn
  filename      = data.archive_file.lambda_zip.output_path
  source_code_hash = data.archive_file.lambda_zip.output_base64sha256
  timeout = 30 # Seconds
}

# --- API Gateway Resources ---

# API Gateway REST API
resource "aws_api_gateway_rest_api" "my_api_gateway" {
  name        = "${var.project_name}-api-gateway"
  description = "API Gateway for my Lambda function"
}

# API Gateway Resource (catch-all path)
# The {proxy+} creates a greedy path parameter that matches all paths.
resource "aws_api_gateway_resource" "proxy_resource" {
  rest_api_id = aws_api_gateway_rest_api.my_api_gateway.id
  parent_id   = aws_api_gateway_rest_api.my_api_gateway.root_resource_id
  path_part   = "{proxy+}"
}

# API Gateway Method (ANY for all HTTP methods)
resource "aws_api_gateway_method" "proxy_method_any" {
  rest_api_id   = aws_api_gateway_rest_api.my_api_gateway.id
  resource_id   = aws_api_gateway_resource.proxy_resource.id
  http_method   = "ANY" # Matches all HTTP methods (GET, POST, PUT, DELETE, etc.)
  authorization = "NONE"
}

# API Gateway Integration (Lambda Proxy Integration)
resource "aws_api_gateway_integration" "lambda_proxy_integration" {
  rest_api_id             = aws_api_gateway_rest_api.my_api_gateway.id
  resource_id             = aws_api_gateway_resource.proxy_resource.id
  http_method             = aws_api_gateway_method.proxy_method_any.http_method
  integration_http_method = "POST" # Lambda proxy integration typically uses POST
  type                    = "AWS_PROXY"
  uri                     = aws_lambda_function.my_lambda.invoke_arn
}

# API Gateway Deployment
resource "aws_api_gateway_deployment" "my_api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.my_api_gateway.id
  # This ensures that the deployment is recreated when the integration changes
  triggers = {
    redeployment = sha1(jsonencode([
      aws_api_gateway_integration.lambda_proxy_integration.id,
      aws_api_gateway_method.proxy_method_any.id,
      aws_api_gateway_resource.proxy_resource.id
    ]))
  }

  lifecycle {
    create_before_destroy = true
  }
}

# API Gateway Stage
resource "aws_api_gateway_stage" "production_stage" {
  deployment_id = aws_api_gateway_deployment.my_api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.my_api_gateway.id
  stage_name    = "prod"
}

# Lambda Permission to allow API Gateway to invoke it
resource "aws_lambda_permission" "allow_api_gateway" {
  statement_id  = "AllowAPIGatewayInvokeLambda"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.my_lambda.function_name
  principal     = "apigateway.amazonaws.com"

  # The source_arn specifies the API Gateway REST API and its stage
  # This makes sure only *this* API Gateway can invoke the Lambda
  source_arn = "${aws_api_gateway_rest_api.my_api_gateway.execution_arn}/*/*"
}