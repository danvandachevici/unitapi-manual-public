Was sitting on the couch one morning, and tried to remember my pizza dough recipe I made a couple of weeks ago, and failed remembering.
I decided it's time to create my own recipe tool. I'd better get to work, I'll probably have ~10 minutes to invest in this today

# Goal of the project

Set of basic APIs for common personal projects

# Current APIs

- recipes oracle

# Tech setup

- API: nestjs
- DB: Dynamodb
- ORM: own
- FE: React + TailwindCSS
- OAuth 2.0

# Provisioning
- AWS Lambda
- Codebuild
- Dynamodb

# Milestones
1. Server starts and works locally via web requests (includes remote DB usage, etc)
2. Deploy & provision everything automatically (terraform/serverless?)
3. UI for recipes
4. Lazy-load modules
5. New APIs
6. New UIs