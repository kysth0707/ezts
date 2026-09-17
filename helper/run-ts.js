const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
const distDir = path.join(projectRoot, "dist");

let fileName = process.argv[2];

if (!fileName) {
    console.error("실행할 TypeScript 파일이 없습니다.");
    console.error("예: npm run run -- week1-typescript/1/file.ts");
    process.exit(1);
}

// Windows \ → /
fileName = fileName.replace(/\\/g, "/");

// .ts 파일만 허용
if (!fileName.endsWith(".ts")) {
    console.error("TypeScript 파일(.ts)만 실행할 수 있습니다.");
    process.exit(1);
}

// 경로 정규화
const normalizedFileName = path.normalize(fileName);

// 프로젝트 밖 접근 방지
if (
    normalizedFileName.startsWith("..") ||
    path.isAbsolute(normalizedFileName)
) {
    console.error("프로젝트 내부의 파일만 실행할 수 있습니다.");
    process.exit(1);
}

const sourceFile = path.resolve(
    projectRoot,
    normalizedFileName
);

if (!fs.existsSync(sourceFile)) {
    console.error(`파일을 찾을 수 없습니다: ${normalizedFileName}`);
    process.exit(1);
}

// ==================================================
// dist 초기화
// ==================================================

fs.rmSync(distDir, {
    recursive: true,
    force: true
});

fs.mkdirSync(distDir, {
    recursive: true
});

// ==================================================
// TypeScript 컴파일
// ==================================================

const tscPath = path.join(
    projectRoot,
    "node_modules",
    "typescript",
    "bin",
    "tsc"
);

if (!fs.existsSync(tscPath)) {
    console.error("TypeScript를 찾을 수 없습니다.");
    console.error("먼저 npm install을 실행해주세요.");
    process.exit(1);
}

const compileResult = spawnSync(
    process.execPath,
    [
        tscPath,

        // 현재 파일 하나만 컴파일
        sourceFile,

        // tsconfig.json을 무시
        "--ignoreConfig",

        // 컴파일 옵션
        "--target",
        "ES2020",

        "--module",
        "CommonJS",

        "--strict",

        "--esModuleInterop",

        "--skipLibCheck",

        "--forceConsistentCasingInFileNames",

        // 프로젝트 루트를 기준으로 출력
        "--rootDir",
        projectRoot,

        "--outDir",
        distDir
    ],
    {
        cwd: projectRoot,
        stdio: "inherit"
    }
);

if (compileResult.error) {
    console.error("\nTypeScript 실행 중 오류가 발생했습니다.");
    console.error(compileResult.error);
    process.exit(1);
}

if (compileResult.status !== 0) {
    console.error(
        `\nTypeScript 컴파일 실패 (exit code: ${compileResult.status})`
    );
    process.exit(compileResult.status || 1);
}

// ==================================================
// Node 실행
// ==================================================

const relativeJsFile = normalizedFileName.replace(
    /\.ts$/,
    ".js"
);

const distFile = path.join(
    distDir,
    relativeJsFile
);

const runResult = spawnSync(
    process.execPath,
    [distFile],
    {
        cwd: projectRoot,
        stdio: "inherit"
    }
);

if (runResult.error) {
    console.error("\nNode.js 실행 중 오류가 발생했습니다.");
    console.error(runResult.error);
    process.exit(1);
}

if (runResult.status !== 0) {
    console.error(
        `\nNode.js 실행 실패 (exit code: ${runResult.status})`
    );
    process.exit(runResult.status || 1);
}