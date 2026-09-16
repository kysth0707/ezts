const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

const projectRoot = path.resolve(__dirname, "..");
// const codeDir = path.join(projectRoot, "code");
const codeDir = projectRoot;

const fileName = process.argv[2];

if (!fileName) {
    console.error("파일 이름을 입력해주세요.");
    console.error("예: npm run new -- test");
    process.exit(1);
}

let finalFileName = fileName;

if (!finalFileName.endsWith(".ts")) {
    finalFileName += ".ts";
}

// code 폴더 밖으로 나가는 경로 방지
const normalizedFileName = path.normalize(finalFileName);

if (
    normalizedFileName.startsWith("..") ||
    path.isAbsolute(normalizedFileName)
) {
    console.error("code 폴더 내부의 파일만 생성할 수 있습니다.");
    process.exit(1);
}

const filePath = path.join(codeDir, normalizedFileName);

if (fs.existsSync(filePath)) {
    console.error(`이미 존재하는 파일입니다: code/${normalizedFileName}`);
    process.exit(1);
}

// 날짜 / 시간
const now = new Date();

const pad = (value) => String(value).padStart(2, "0");

const year = now.getFullYear();
const month = pad(now.getMonth() + 1);
const date = pad(now.getDate());

const hour = pad(now.getHours());
const minute = pad(now.getMinutes());
const second = pad(now.getSeconds());

const content = `/*
 * 제목 : 
 * 
 * < 요약 >
 * 
 * 
 * [${year}/${month}/${date} ${hour}:${minute}:${second}]
 */



export {};
`;

fs.mkdirSync(path.dirname(filePath), {
    recursive: true
});

fs.writeFileSync(
    filePath,
    content,
    "utf8"
);

console.log(`생성 완료: code/${normalizedFileName}`);

// ==================================================
// VS Code에서 생성된 파일 열기
// ==================================================

const vscodePath =
    "C:/Users/th070/AppData/Local/Programs/Microsoft VS Code/_/Code.exe";

const vscode = spawn(
    vscodePath,
    [
        "--reuse-window",
        filePath
    ],
    {
        cwd: projectRoot,
        windowsHide: true
    }
);

vscode.on("error", (error) => {
    console.error("VS Code 실행 실패:", error);
});

vscode.on("close", (code) => {
    if (code !== 0) {
        console.error(`VS Code 실행 실패 (exit code: ${code})`);
    }
});