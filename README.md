# gotrade

A Go-based trading application.

## Auto Deploy

This repository is configured for continuous deployment via GitHub Actions. Every push to the `main` branch automatically triggers the [deploy workflow](.github/workflows/deploy.yml), which:

1. Checks out the code
2. Sets up the Go toolchain
3. Builds the project
4. Runs tests
5. Deploys the application

To connect your own deployment target, edit the **Deploy** step in `.github/workflows/deploy.yml`.