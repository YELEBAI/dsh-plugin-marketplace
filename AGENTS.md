# 插件市场开发约束

## 结构与职责

- `src/host/index.ts`：Remote 服务和安装、更新、卸载事务；沿用 FIFO 队列与跨进程 Profile 锁。
- `src/host/installer.ts`：pnpm 参数、子进程、日志与任务状态。Store 来自实际绑定元数据；不得按版本目录名裁剪路径。
- `src/host/profile.ts`：Profile 定位、依赖解析和 Bundle 状态协调；更新单包时保留其他 Bundle 的顺序与启停选择。
- `src/client/`：插件市场界面；`src/typert.ts`、`src/remote.ts`、`src/types.ts`：通信契约。Remote 安装方法名为 `installPlugin`，`install` 会与服务生命周期冲突。
- `scripts/`：构建、类型检查、Registry 验证和回归测试；`registry/`、`policy/`：发现结果与安装分类依据。
- `lib/`：提交到仓库并直接用于运行的构建产物。修改源码后构建、审阅对应产物差异，不手工只改 bundle。

## 开发与验证

TypeScript 沿用单引号、无分号和现有类型约束。新增注释与主要读者文档使用简体中文，保留现有英文版本的职责与链接。

先查看 `package.json` 与 `.github/workflows/pull-request.yml`。包管理器版本由 `packageManager` 指定；不要为一次修复擅自更新版本或锁文件。

```powershell
# 在本仓库中执行；DSH_CHECKOUT 指向已有依赖和生成类型的上游 checkout。
$env:pnpm_config_verify_deps_before_run = 'false'
pnpm test
pnpm profile:test
pnpm typecheck
pnpm build
pnpm verify
```

Store/卸载/回滚变更至少运行 `scripts/store-test.ts`、`scripts/store-integration-test.ts` 和 `profile:test`。真实 pnpm 集成测试使用临时目录、本地包和禁用生命周期脚本，不能操作用户 Profile。Registry、引导安装或重启变更补充运行对应命名测试；UI 改动使用现有 `ui:test`，环境要求见 README。

构建与检查读取 `DSH_CHECKOUT`，未设置时脚本仍默认维护者路径 `D:/DSH/deepseek-harness`。在其他安装中显式设置，不把本机路径提交进可移植配置。已有 checkout 可能只有源码和工具而没有 DSH 生成类型；遇到缺失依赖先确认事实，报告受限检查，不默默跳过或自动下载整套环境。

已有 DSH npm 安装时，也可用 `DSH_PACKAGE_ROOT` 指向 `@deepseek-ai/dsh` 包目录，直接验证发布版本的公开类型与加载器。`MARKETPLACE_TOOLS_DIR` 只解析已有独立工具依赖，不自动安装；不要把整个市场 `node_modules` 链接到 DSH 安装。

运行 pnpm 前检查 `node_modules` 的真实路径，不允许整个目录链接到活动 DSH 主程序的依赖目录。上面的环境变量关闭 pnpm 运行脚本前的自动安装；需要安装时在隔离的本仓库依赖目录中明确执行。

## 行为边界

- Windows 路径需要覆盖实际 pnpm 集成行为；`.modules.yaml` 的实际 Store 路径归一化后直接复用，包括已有嵌套版本目录。
- 无 TTY 的安装、回滚不得弹出依赖目录清理确认；非交互模式也不能丢失普通安装更新锁文件的语义。显式冻结锁文件的调用保持冻结。
- 依赖变更、Bundle 协调和失败恢复是一项事务；不恢复陈旧完整清单来覆盖期间其他用户选择。
- 调整自动/引导安装分类时保留精确来源和现有验证，不把不明确的第三方构建变成自动执行。
- 测试通过后审阅 `git diff --stat` 与相关 diff，仅提交本任务源码、测试、文档和必要产物。发布、推送与 Registry 外部写入另需用户授权。
