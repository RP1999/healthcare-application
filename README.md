🏥 MediLink Health Diagnostics DevOps CI/CD Pipeline

This repository contains a fully automated CI/CD pipeline for deploying the MediLink Health Diagnostics Web Application using Jenkins, Docker, and Ansible on an Azure Virtual Machine.

The pipeline demonstrates how DevOps principles can automate building, testing, and deployment processes while maintaining ISO 27001–aligned security and operational reliability standards within a healthcare environment.

⚙️ Features

Continuous Integration with Jenkins

Containerization using Docker

Automated deployment via Ansible

Cloud deployment on Azure VM

Version control through GitHub

End-to-end verification and health monitoring

🧩 Prerequisites

Jenkins server with Docker plugin installed

Docker installed on Jenkins and Azure VM

Ansible installed on the Jenkins control node

GitHub repository access for application source

Azure Virtual Machine with SSH access and Docker group user

Docker Hub account for storing custom images

🔄 Pipeline Workflow

Checkout Code – Clone the latest MediLink source from GitHub.

Build Docker Image – Build a fresh Apache-based image for the MediLink web app.

Push Image to Docker Hub – Upload the latest version to Docker Hub repository.

Deploy with Ansible – Pull and deploy the image automatically to Azure VM.

Verify Deployment – Validate web application status (HTTP 200 OK).

Monitor & Log – Capture runtime logs and verify container health.

Clean Up – Remove unused Docker images to conserve resources.

📁 Project Structure
Dockerfile      # Build instructions for Apache-based web app
index.html      # MediLink Health web content
Jenkinsfile     # Jenkins pipeline for CI/CD automation
deploy.yml      # Ansible playbook for container deployment
hosts           # Ansible inventory with Azure VM details
/medilink-site  # Web assets (HTML, CSS, JS)

🌐 Accessing the Web Application

Once deployed successfully, open the browser and visit:
http://<your_azure_public_ip>

You will see the MediLink Health Diagnostics homepage hosted on your Azure VM through a Dockerized Apache server.

📊 Monitoring & Logging

To ensure continuous reliability, monitoring and logging mechanisms are integrated within the CI/CD pipeline and deployment environment.
These verify container health, track performance, and maintain operational transparency — aligning with ISO-compliant practices.

Container Health Checks

After deployment, the MediLink Docker container is monitored regularly to confirm it remains active and responsive. Any downtime triggers quick corrective action.

Application Health Verification

The application’s availability and responsiveness are automatically validated through Jenkins using health-check commands (curl -f http://localhost:80).

Log Monitoring

Runtime logs from the Docker container and Apache web server are stored on the Azure VM for analysis, issue tracking, and compliance reporting.

🔗 Integration with CI/CD Pipeline

Monitoring and logging are seamlessly integrated into Jenkins and Ansible workflows:

Jenkins verifies deployment success and container health immediately after each build.

Ansible automates log collection and saves container activity reports on the Azure server.

🌟 Key Benefits

Fully automated build → push → deploy pipeline

Minimal manual intervention and reduced human error

Scalable and portable container-based infrastructure

Continuous visibility via integrated monitoring and logs

ISO 27001–aligned DevOps workflow (security, auditability, automation)

Improved reliability and faster updates for MediLink’s telehealth systems
