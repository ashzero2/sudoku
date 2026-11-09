#!/bin/sh
set -eu

if [ "$(uname -s)" = Darwin ]; then
  JAVA_HOME=$(/usr/libexec/java_home -v 17)
  export JAVA_HOME
fi

: "${JAVA_HOME:?Set JAVA_HOME to JDK 17}"
export EAS_LOCAL_BUILD_ARTIFACTS_DIR=build

exec npx --yes eas-cli@27.2.0 build --platform android --profile "$1" --local --non-interactive
