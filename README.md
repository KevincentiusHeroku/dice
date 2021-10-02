
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

- To analyze the project, run (put your password if you changed it):

  ```
  sonar-scanner.bat -D"sonar.projectKey=TDS-Engine" -D"sonar.sources=." -D"sonar.host.url=http://localhost:9000" -D"sonar.login=admin" -D"sonar.password=admin"`
  ```

# Karma test

`npx karma start`
