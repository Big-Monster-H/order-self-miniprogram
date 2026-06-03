#!/bin/bash
# ==========================================
#  deploy.sh — 白标任务平台 一键部署脚本
#  用法:
#    1. 修改 config.yaml
#    2. bash deploy.sh
# ==========================================
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
CONFIG="$SCRIPT_DIR/config.yaml"
DIST="$SCRIPT_DIR/dist"

RED='\033[0;31m'; GREEN='\033[0;32m'; CYAN='\033[0;36m'; NC='\033[0m'

echo -e "${CYAN}=========================================="
echo "  白标任务平台 — 一键部署"
echo -e "==========================================${NC}"

# 1. Check dependencies
echo -e "\n${GREEN}[1/6] 检查依赖...${NC}"
command -v python3 >/dev/null 2>&1 || { echo -e "${RED}需要 Python3${NC}"; exit 1; }
command -v node >/dev/null 2>&1 || { echo -e "${RED}需要 Node.js${NC}"; exit 1; }
command -v npm >/dev/null 2>&1 || { echo -e "${RED}需要 npm${NC}"; exit 1; }
echo "  ✓ Python3 · Node.js · npm"

# 2. Install Python deps
echo -e "\n${GREEN}[2/6] 安装 Python 依赖...${NC}"
pip3 install pyyaml -q 2>/dev/null || pip install pyyaml -q
echo "  ✓ pyyaml"

# 3. Build (replace placeholders)
echo -e "\n${GREEN}[3/6] 构建产品包...${NC}"
python3 "$SCRIPT_DIR/build.py" "$CONFIG"

# 4. Install server deps
echo -e "\n${GREEN}[4/6] 安装后端依赖...${NC}"
cd "$DIST/server"
npm install --production
npm run build
echo "  ✓ 后端依赖安装完成"

# 5. Install admin deps + build
echo -e "\n${GREEN}[5/6] 构建管理后台...${NC}"
cd "$DIST/admin"
npm install
npm run build
echo "  ✓ 管理后台构建完成"

# 6. Summary
echo -e "\n${GREEN}[6/6] 部署完成!${NC}"
echo -e "${CYAN}=========================================="
echo "  输出目录: $DIST"
echo ""
echo "  启动后端:"
echo "    cd $DIST/server"
echo "    pm2 start dist/main.js --name task-platform"
echo ""
echo "  管理后台静态文件: $DIST/admin/dist"
echo "  小程序源码: $DIST/mini-program"
echo ""
echo "  Nginx 配置示例见: $DIST/nginx.conf"
echo -e "==========================================${NC}"