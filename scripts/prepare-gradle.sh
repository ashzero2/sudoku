#!/bin/sh
set -eu

version=9.4.1
archive="gradle-$version-bin.zip"
checksum=2ab2958f2a1e51120c326cad6f385153bb11ee93b3c216c5fccebfdfbb7ec6cb
work_dir=$(mktemp -d)
trap 'rm -rf "$work_dir"' EXIT HUP INT TERM

downloaded=false
for base_url in \
  https://services.gradle.org/distributions \
  https://mirror.math.princeton.edu/pub/macports/distfiles/gradle; do
  if curl --fail --location --silent --show-error --retry 2 --retry-all-errors \
    --connect-timeout 15 --max-time 180 --output "$work_dir/$archive" "$base_url/$archive"; then
    downloaded=true
    break
  fi
done

if [ "$downloaded" != true ]; then
  echo 'Could not download the Gradle distribution.' >&2
  exit 1
fi

printf '%s  %s\n' "$checksum" "$work_dir/$archive" | shasum -a 256 -c -

# This directory is the Gradle Wrapper cache key for the pinned distribution URL.
cache_dir="${GRADLE_USER_HOME:-$HOME/.gradle}/wrapper/dists/gradle-$version-bin/arn2x92ynaizyzdaamcbpbhtj"
mkdir -p "$cache_dir"
unzip -q "$work_dir/$archive" -d "$cache_dir"
test -x "$cache_dir/gradle-$version/bin/gradle"
touch "$cache_dir/$archive.ok"
