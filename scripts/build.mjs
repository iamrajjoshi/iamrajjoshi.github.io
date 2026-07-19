import { execFileSync } from "node:child_process";
import { createReadStream } from "node:fs";
import { copyFile, mkdir, readFile, rm, stat, writeFile } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const rootDirectory = fileURLToPath(new URL("../", import.meta.url));
const outputDirectory = resolve(rootDirectory, "out");
const repositoryUrl = "https://github.com/iamrajjoshi/iamrajjoshi.github.io";

function getCommitSha() {
  try {
    const sha = execFileSync("git", ["rev-parse", "--short", "HEAD"], {
      cwd: rootDirectory,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();

    return /^[0-9a-f]+$/i.test(sha) ? sha : null;
  } catch {
    return null;
  }
}

async function build() {
  const commitSha = getCommitSha();
  const replacements = {
    "{{COMMIT_LABEL}}": commitSha ? `View commit ${commitSha} on GitHub` : "View source on GitHub",
    "{{COMMIT_SHA}}": commitSha ?? "source",
    "{{COMMIT_URL}}": commitSha ? `${repositoryUrl}/commit/${commitSha}` : repositoryUrl,
  };

  let html = await readFile(resolve(rootDirectory, "index.html"), "utf8");
  for (const [token, value] of Object.entries(replacements)) {
    html = html.replaceAll(token, value);
  }

  await rm(outputDirectory, { recursive: true, force: true });
  await mkdir(outputDirectory);
  await Promise.all([
    writeFile(resolve(outputDirectory, "index.html"), html),
    copyFile(resolve(rootDirectory, "styles.css"), resolve(outputDirectory, "styles.css")),
    copyFile(
      resolve(rootDirectory, "public/octopus-transparent.png"),
      resolve(outputDirectory, "octopus-transparent.png"),
    ),
  ]);

  console.log(`Built site for ${commitSha ?? "source"} in out/`);
}

const contentTypes = new Map([
  [".css", "text/css; charset=utf-8"],
  [".html", "text/html; charset=utf-8"],
  [".png", "image/png"],
]);

function sendNotFound(response) {
  response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
  response.end("Not found\n");
}

async function serve(request, response) {
  try {
    const url = new URL(request.url ?? "/", "http://localhost");
    const relativePath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
    const filePath = resolve(outputDirectory, `.${relativePath}`);

    if (!filePath.startsWith(`${outputDirectory}${sep}`)) {
      sendNotFound(response);
      return;
    }

    const file = await stat(filePath);
    if (!file.isFile()) {
      sendNotFound(response);
      return;
    }

    response.writeHead(200, {
      "Content-Type": contentTypes.get(extname(filePath)) ?? "application/octet-stream",
    });

    if (request.method === "HEAD") {
      response.end();
      return;
    }

    createReadStream(filePath).pipe(response);
  } catch {
    sendNotFound(response);
  }
}

await build();

if (process.argv.includes("--serve")) {
  createServer(serve).listen(3000, "127.0.0.1", () => {
    console.log("Previewing at http://127.0.0.1:3000");
  });
}
