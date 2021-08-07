
# Sonar Setup

- Install SonarLint extension in VS Code
- Download SonarQube Docker image and run it locally
- Go to localhost:9000, login as admin/admin, create project named "TDS Engine" and create a token
- Put the following in your global VS Code settings (not in project settings!):

```
    "sonarlint.connectedMode.connections.sonarqube": [
      {
        "serverUrl": "http://localhost:9000",
        "token": "XXXXX"
      }
    ],
```

- To analyze the project, run the sonar.bat

# Karma test

`npx karma start`

