# About the project

This project features a **completely fictional company** named Tailor'Pulp, created for **illustrative purposes**.
**All company names, brands, products, employees, or locations mentioned** in the code, frontend are **fictitious**.

Any resemblance to a real company, whether existing or defunct, is **purely coincidental**.
These references **do not imply any affiliation** with or endorsement by any real entity.

**The project is an e-commerce web application** with :

- NodeJS server back-end (Dockerfile)
- React front-end (Dockerfile)
- db : init.sql file for PostgreSQL database
- docker-compose.yml at the root to orchestrate services

The **App set up** section details all the steps to set up and launch the web application with Docker

![Presentation](./demo/demo.png)

# App set up

## 1. Prerequisites

### Requirements

#### Stripe

Have a Stripe account in developer mode with API keys associated with the **test environment** specifically :

Secret Stripe key format : `sk_test_...`
Public Stripe key format : `pk_test_...`

Use the **test card numbers** provided by Stripe for fake transactions. More information on https://docs.stripe.com/

#### Google 

Have generated an ID for Google OAuth2.0
Have generated the secret key for reCAPTCHA

More information on https://console.cloud.google.com/

#### SMTP

Have generated an App Password for Google SMTP (optional if another SMTP service is selected)

### Recommanded

#### jose library

e.g. Cookies, JWT Token

## 2. Set up the repository

```bash
git clone https://github.com/alextechbuild/.git
```

Navigate to the repository

```bash
cd your_repository
```

## 3. Set up the environment variables

Create .env files. Two .env files are necessary

### For the back-end (./back-end/.env)

Create .env file and add the following environment variables (the values should be adapted according to your API keys for the different services) :

```.env

# --- Db host (dev mode : complete with 'localhost' for dev mode, otherwise complete with db service name for Docker (postgres_db by default))
DB_HOST="postgres_db"

# --- Front-end URL ---
FRONT_END_URL="https://localhost:3000"

# --- Cron (leader variable on this specific instance only (mettre false sur tout le reste des .env)) ---
IS_LEADER="true"

# --- Nodemailer ---
SMTP_DOMAIN="smtp.gmail.com"
SMTP_PORT="587"
ASSISTANCE_EMAIL="tailorpulpassistance@example.com"

# --- Db credentials ---
PGHOST="localhost"
PGPORT="5432"
PGDATABASE="tailor_pulp_db"

# --- Back-end port ---
PORT="4000"




# --------------------------- TO BE COMPLETED ---------------------------


# --- Cookies (e.g. jose) ---
COOKIE_SECRET="cookie_secret"

# --- JWT Token (e.g. jose) ---
JWT_SECRET="jwt_secret"

# --- Google OAuth2.0 Client ID (for .aud) ---
GOOGLE_OAUTH_CLIENT_ID=""

# --- Payment Service (Stripe) ---
STRIPE_SECRET_KEY=""

# --- Google reCAPTCHA ---
RECAPTCHA_SECRET_KEY=""

# --- Nodemailer host email (e.g. for Google : @gmail.com address) ---
HOST_EMAIL=""

# --- Nodemailer host password (e.g. for @gmail.com address : Google App Password) ---
HOST_PASSWORD=""

# --- Asymmetric encryption public key (for data encryption between server and db) ---
PUBLIC_KEY=""

# --- Asymmetric encryption private key (for data encryption between server and db) ---
PRIVATE_KEY=""

# --- Db credentials ---
PGUSER=""
PGPASSWORD=""

```

### For the front-end (./front-end/.env)

Create .env file and add the following environment variables (the values should be adapted according to your API keys for the different services) :

```.env

# --- HTTPS ---
VITE_HTTPS="true"

# --- Front-end port ---
PORT="3000"

# --- Back-end URL ---
VITE_BACKEND_URL="https://localhost:4000"




# --------------------------- TO BE COMPLETED ---------------------------


# --- Google OAuth2.0 Client ID ---
VITE_GOOGLE_OAUTH_CLIENT_ID=""

# --- Google reCAPTCHA ---
VITE_RECAPTCHA_WEBSITE_KEY=""

```

## 4. Generate the TLS/SSL certificates

### 1. Install mkcert

```bash
sudo apt install libnss3-tools
wget -O mkcert https://github.com/FiloSottile/mkcert/releases/latest/download/mkcert-v1.4.4-linux-amd64
chmod +x mkcert
sudo mv mkcert /usr/local/bin/
```

### 2. Generate root certificate

```bash
mkcert -install
```

### 3. Generate TLS/SSL certificates for localhost

In **'./back-end/certs/'** folder :

```bash
mkdir certs
cd certs
mkcert localhost 127.0.0.1 ::1
```

2 files will be generated :

localhost+2.pem
localhost+2-key.pem

## 5. Create the database (postgreSQL)

### 1. Configure postgreSQL

#### 1. Install postgreSQL

```bash
sudo apt update -y
sudo apt upgrade -y
sudo apt install postgresql postgresql-contrib
```

#### 2. Check if postgreSQL is correctly installed

```bash
sudo systemctl status postgresql
```

Otherwise, for launching and activating postgreSQL on boot :

```bash
sudo systemctl start postgresql
sudo systemctl enabled postgresql
```

#### 3. Switch to the postgreSQL system user (default)

```bash
sudo -i -u postgres
```

#### 4. Access to postgresql

```bash
psql
```

#### 5. Create a new user

```sql
CREATE USER nickname WITH PASSWORD 'your_password';
```

#### 6. Grant privileges + create DATABASE

```sql
ALTER USER nickname CREATEDB;
CREATE DATABASE tailor_pulp_db WITH OWNER nickname;
\q
```

### 2. Launch database

#### Launch database for the first time

```sql
psql -h localhost -U nickname -d tailor_pulp_db -W;
```

Then copy paste init.sql

#### Re-launch database for next times

```sql
psql -h localhost -U nickname -d tailor_pulp_db -W;
```

## 6. Containerise the app with Docker (dev mode)

### 1. Install Docker

#### 1. Add the official Docker repository

```bash
sudo apt update -y
sudo apt upgrade -y
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
```

#### 2. Install Docker

```bash
sudo apt-get install docker-ce docker-ce-cli containerd.io -y
```

#### 3. Check if Docker is correctly installed

```bash
sudo docker --version
```

#### 4. Launch and activate Docker on boot

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

#### 5. Check Docker installation

```bash
sudo docker run hello-world
```

#### 6. Using Docker without sudo (optional)

```bash
sudo usermod -aG docker $USER
```

### 2. Run the app

#### Build and run the app for the first time

```bash
docker-compose up --build
```

#### Re-run the app for next times

```bash
docker-compose up
```

#### Launch the app with web browser

In a web browser, type https://localhost:3000

# About images

This project uses **images** generated by artificial intelligence for **illustrative** purposes

## Tool used

- Tool : [Perchance](https://perchance.org/)
- Purpose : illustrative visuals for the front-end

## Terms of use

- No image depicts a real or identifiable person
- The images were generated solely for artistic and non-commercial purposes
- The prompts used comply with the ethical rules and terms of use of the Perchance platform

## Licence and attribution

- Images generated via Perchance may be used freely within the scope of this project
- Their use remains subject to the Perchance Terms of Use
- Please mention Perchance as the source if you reuse these visuals in another public context

# About the font used

For licence compatibility reasons, **the original font used in the design of the site (CabinetGrotesk) is not included in this MIT version**.

All CSS declarations of the type :

```css
font-family: 'CabinetGrotesk-Variable', ...;
```

have been replaced by :

```css
font-family: Arial, Helvetica, sans-serif;
```

The screenshots shown in the repository use the original font solely for visual purposes only.
If you wish to find or use this font, you can download or embed it for free from [FontShare](https://www.fontshare.com/fonts/cabinet-grotesk).

# If you like this project, please consider supporting its development:

- ⭐️ By leaving a **star** on this GitHub repository
- 📢 By **sharing** this project with your **network**
- 📝 By leaving **feedback**
