# Clone repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <PROJECT_FOLDER>

# Install frontend dependencies
npm install

# Configure environment variables
cp .env.example .env

# Install API/backend dependencies
cd backend
npm install

# Configure API environment
cp .env.example .env

# Start the API server
npm run dev

open a new terminal :
# Start the frontend
cd <PROJECT_FOLDER>
npm run dev

APItesting 
# Check API health
curl http://localhost:5000/api/health

if the API uses Python
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
python app.py

# Example API request
curl http://localhost:5000/api/<endpoint>
