<!-- ## 컴파일과 실행 한 번에
- npm exec tsc && node dist/index.js
## 타입 오류만 체크 원할 시
- npm exec tsc --noEmit
 -->
# 단축키 설정
1. .vscode의 keybindings.json 내용을 복사
2. ctrl + shift + p로 창을 열기
3. Preferences: Open Keyboard Shortcuts (JSON) 선택. ※ Preferences: Open "Default" Keyboard Shortcuts (JSON)과 혼동 주의
4. 해당 json 안에 .vscode/keybindings.json 내용을 이어붙이기
# 만약 f6랑 ctlr + alt + n을 눌러도 작동이 안 된다면
1. ctrl + k를 눌렀다 뗀 후에 ctrl + s를 누르기
2. 검색창에 ctrl+alt+n과 f6 각각 검색 후, 키바인딩 제거 또는 keybindings.json에서 우선순위 변경
# 껐다 켰는데 단축키 눌러도 실행이 안 된다면,
1. tasks.json 전체 내용 복사하고, 내용 지운 후 저장
2. 그 내용 다시 붙여넣고 저장

<!-- 하나하나 치고 파일 생성하고 옮기는 거 불편하니까 자동으로 해주는 프로그램 만들기 -->