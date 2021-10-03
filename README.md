
# Dice

An experimental mix of Dependency Injection and Cerealization (DICE).

Class annotations:

- @singleton: declares class as singleton, ensuring exactly one instance (if multiple containers exist, they will not share singleton instances)
- @dice: declares class as non-singleton.

Field injection annotations:

- @contains: declares the field with a "has-a" relationship, meaning the field will be automatically instantiated (therefore only works for @dice typed fields) when the parent object is instantiated
- @provides: similar to @contains, but also makes the field accessible to child dices via @requires
- @requires: declares the field as an external dependency, which will be auto-injected

Serialization can be done by using the Serializer class (get it via `@requires` or `container.resolve(Serializer)`):

- Fields marked as @persistent() will be serialized
- Fields marked by @contains and @provides will be recursively serialized
- Fields marked by @required are not serialized, but will be automatically injected upon deserialization
- Unmarked fields will be ignored
- Upon serialization, the snapshot() method will be called, if defined. The return value will then be serialized. This gives you the chance to create a custom serialization logic in case the above features are not enough

# Development notes

## Deployment

    npm install
    npx tsc
    npm publish

## Sonar Setup

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

## Karma test

`npx karma start`
