# Android releases

The Android release workflow runs when a tag is pushed to GitHub. It builds APKs locally on GitHub-hosted runners using the pinned EAS CLI and the existing Expo-managed Android signing key. It publishes a GitHub Release only after all five APKs build and pass signature and architecture checks.

Each job downloads Gradle 9.4.1 with retries, falling back to Princeton's public MacPorts mirror if the official download is unavailable. The archive must match Gradle's published SHA-256 checksum before it is used.

## Setup

1. Create an Expo access token for an account that can access the project's Android signing credentials.
2. In the GitHub repository, add it as an Actions secret named `EXPO_TOKEN` under **Settings → Secrets and variables → Actions**.
3. Ensure GitHub Actions is enabled for the repository. The release job requests `contents: write` to create the release.

## Release

Push the commits containing the workflow before creating a tag. Then create and push a tag at the commit you want to release, for example:

```sh
git tag v1.0.1
git push origin v1.0.1
```

The resulting GitHub Release has a universal APK and one APK each for `arm64-v8a`, `armeabi-v7a`, `x86`, and `x86_64`. Most current Android phones use `arm64-v8a`; the universal APK supports all four architectures. The workflow does not submit to Google Play or change the app's version name or Android version code. Update those in `app.json` before tagging when needed.

If a release for the tag already exists, publication fails rather than replacing its assets. A failed run can be retried after addressing its error. Builds use GitHub-hosted runner minutes; check the account's allowance before tagging.
