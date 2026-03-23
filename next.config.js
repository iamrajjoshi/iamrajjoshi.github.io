const { execSync } = require("child_process");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  env: {
    NEXT_PUBLIC_COMMIT_SHA: execSync("git rev-parse --short HEAD")
      .toString()
      .trim(),
  },
};

module.exports = nextConfig;
