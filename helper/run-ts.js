const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");

// const codeDir = path.join(projectRoot, "code");
const codeDir = projectRoot
const srcDir = path.join(projectRoot, "src");
const distDir = path.join(projectRoot, "dist");

let fileName = process.argv[2];

if (!fileName) {
    console.error("실행할 TypeScript 파일이 없습니다.");
    console.error("예: npm run run -- test.ts");
    process.exit(1);
}

// Windows \ → /
fileName = fileName.replace(/\\/g, "/");

// code/가 붙어 있으면 제거
if (fileName.startsWith("code/")) {
    fileName = fileName.substring(5);
}

if (!fileName.endsWith(".ts")) {
    console.error("TypeScript 파일(.ts)만 실행할 수 있습니다.");
    process.exit(1);
}

// 경로 정규화
const normalizedFileName = path.normalize(fileName);

if (
    normalizedFileName.startsWith("..") ||
    path.isAbsolute(normalizedFileName)
) {
    console.error("code 폴더 내부의 파일만 실행할 수 있습니다.");
    process.exit(1);
}

const sourceFile = path.join(codeDir, normalizedFileName);
const srcFile = path.join(srcDir, normalizedFileName);

const jsFileName = normalizedFileName.replace(/\.ts$/, ".js");
const distFile = path.join(distDir, jsFileName);

if (!fs.existsSync(sourceFile)) {
    console.error(`파일을 찾을 수 없습니다: code/${normalizedFileName}`);
    process.exit(1);
}

// ==================================================
// 1. src / dist 초기화
// ==================================================

// console.log("\n[1/4] 작업 폴더 초기화");

fs.rmSync(srcDir, {
    recursive: true,
    force: true
});

fs.rmSync(distDir, {
    recursive: true,
    force: true
});

fs.mkdirSync(path.dirname(srcFile), {
    recursive: true
});

fs.mkdirSync(distDir, {
    recursive: true
});

// ==================================================
// 2. code → src 복사
// ==================================================

// console.log(`[2/4] code/${normalizedFileName} 복사`);

fs.copyFileSync(sourceFile, srcFile);

// ==================================================
// 3. TypeScript 컴파일
// ==================================================

// console.log("[3/4] TypeScript 컴파일\n");

// 프로젝트에 설치된 TypeScript
const tscPath = path.join(
    projectRoot,
    "node_modules",
    "typescript",
    "bin",
    "tsc"
);

if (!fs.existsSync(tscPath)) {
    console.error("TypeScript를 찾을 수 없습니다.");
    console.error("먼저 다음 명령어를 실행하세요:");
    console.error("npm install");
    process.exit(1);
}

const compileResult = spawnSync(
    process.execPath,
    [
        tscPath,
        "--pretty"
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
        `\nTypeScript 컴파일에 실패했습니다. (exit code: ${compileResult.status})`
    );
    process.exit(compileResult.status || 1);
}
// == 
// 4. 파일 지우기
// ==

fs.unlink(srcFile, (err) => {
  if (err) {
    console.error('파일 삭제 실패:', err);
    process.exit(1);
  }
});


// ==================================================
// 5. Node 실행
// ==================================================

// console.log(
//     `\n[4/4] node ${path.relative(projectRoot, distFile)} 실행\n`
// );

// console.log("========================================");

const runResult = spawnSync(
    process.execPath,
    [distFile],
    {
        cwd: projectRoot,
        stdio: "inherit"
    }
);

// console.log("========================================");

if (runResult.error) {
    console.error("\nNode.js 실행 중 오류가 발생했습니다.");
    console.error(runResult.error);
    process.exit(1);
}

if (runResult.status !== 0) {
    console.error(
        `\nNode.js 실행에 실패했습니다. (exit code: ${runResult.status})`
    );
    process.exit(runResult.status || 1);
}