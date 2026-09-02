# 更新日志

[English](./CHANGELOG.en.md) · **简体中文**

这里记录 DSH Plugin Marketplace 自首次发布以来值得关注的功能、行为变化和修复。
内容依据 Git 标签和提交历史整理；定时任务产生的纯 Registry 快照更新不逐条展开。

## [未发布]

暂无。

## [0.9.4] - 2026-09-02

### 修复

- 目录选择兼容新旧 DSH：新版优先调用 `workspaces.pickDirectory()`，旧版动态回退到
  `uiWorkspace.pickDirectory()`；市场入口不再把旧版专属的 `uiWorkspace` 当作必需注入，
  修复更新后整个插件市场标签页消失的问题。

### 测试

- 增加新版目录选择、旧版回退以及缺少选择器时明确报错的回归测试，并禁止市场入口再次
  等待 `uiWorkspace`。

## [0.9.3] - 2026-09-02

### 新增与改进

- Registry 现可读取可选的 `dsh-plugin.json`，并按 `dsh-std` Community v0.15 与
  `dsh-TUI` 的 `tui-admission/0.15` 完成静态预检；插件详情会明确区分静态通过、
  清单错误和仍需运行期协商/授权的边界。
- 手动 GitHub 命令现在既可安装新插件，也可更新当前 Profile 中已安装的同名插件。
- 已安装插件新增“可更新”过滤和显式“检查更新”；显式检查会绕过 Registry TTL。
- 默认市场首屏先读取包内 Registry 快照并在后台刷新远端，同时只读取轻量 Profile 快照；
  完整已安装插件扫描改为进入对应页面后按需执行。
- 已安装插件首次扫描不再同步等待市场自身的 GitHub 实时元数据；只有用户显式点击“检查更新”
  才会请求实时自更新信息。已完成的扫描结果会在“已安装插件”和“插件管理”间复用，避免切页重扫。
- 默认安装目录不再遍历整个 `node_modules`；Registry 增加包名/仓库名索引和批量匹配。
- 插件任务队列只在“已安装插件”页面显示，只恢复活跃任务；完成记录限制为最近 12 项、
  10 分钟，并支持一键清除。
- 已安装插件简介支持悬浮查看完整原文；中文界面优先显示双语简介中的中文片段，并在
  Registry 简介为空时保留本地 package manifest 的说明。

### 修复

- Agent 安装/更新改由 Client Sessions 服务使用当前默认 composition 创建会话，不再读取可选的
  `agentPresets` Remote；修复更新 `dsh-better-sidebar` 等引导型插件时出现
  `Cannot read properties of undefined (reading 'list')` 的问题。
- GitHub 自动安装在通过 Registry 的精确仓库与 commit 校验后，改用 codeload 的 HTTPS 固定
  commit 归档交给 pnpm，避免 `github:` shorthand 被解析为 `git@github.com` 并要求 SSH 私钥。
- Profile 修改增加跨 DSH 进程文件锁，并对 Windows 上 `writeLockfile`、`EBUSY`、`EPERM`
  等短暂占用做有界重试，避免并发更新损坏或无法写入 `pnpm-lock.yaml`。
- 读取 Profile 的 pnpm Store 时会归一化被重复放大的 Windows 路径分隔符，并将
  `.modules.yaml` 中的实际 `vN` 目录还原为 pnpm 配置根目录，避免继续产生嵌套 Store。
- 启用/停用也纳入同一 Profile 锁；界面明确说明它只保存下次启动配置，不会另开常驻 CLI。

### 测试

- 增加引导 Agent 必须通过 Client Sessions 创建会话、且不得直接读取 preset roster 的回归断言。
- 增加强制 Registry 刷新、跳过默认目录孤立扫描、手动命令更新、GitHub HTTPS 执行来源、
  完成任务不恢复，以及自更新实时请求仅由显式刷新触发等回归测试。

## [0.9.2] - 2026-08-17

### 修复与回退

- 稳定市场回退尚未成熟的恶意代码扫描与 Agent Loop 运行时验证；这些实验结果不再参与
  `automatic` / `guided` 安装方式判定。
- 修复实验安全门禁把“待扫描”或“需要复核”直接写成 `manualSteps=true` 的问题；在最新
  3608 个条目的 Registry 中恢复 953 个已由原始静态证据确认可自动安装的插件，同时保留
  592 个确实需要引导的条目。
- 定时任务恢复为只执行仓库结构、精确来源、运行产物、生命周期脚本和 Profile 规则检查。
- 增加 Registry 回归断言，禁止实验扫描理由或临时安装覆盖再次写入稳定市场快照。

## [0.9.1] - 2026-08-15

### 新增与改进

- Agent 安装和更新不再继承当前或最近的项目工作区；市场会自动创建并绑定
  `$DSH_HOME/marketplace/agent-workspace` 专用工作区。
- “管理与诊断”新增 Agent 工作区设置，可选择已有目录或恢复隔离默认值。
- `install-dsh-plugin` Skill 要求每次操作使用专用工作区中的唯一子目录，并禁止扫描或写入
  其他 DSH 工作区；工作区外写入仅限目标 Profile 和用户明确批准的插件配置。

### 测试

- 增加默认目录自动创建、自定义目录持久化、无效路径拒绝、恢复默认且不影响插件安装位置，
  以及 Agent 任务与会话工作区绑定测试。

## [0.9.0] - 2026-08-15

### 新增

- 内置并全局注册 `install-dsh-plugin` Skill；“Agent 安装/更新”创建的会话必须先加载该
  Skill，再执行任何安装、构建或 Profile 修改。
- Skill 增加精确来源、隔离源码构建、生命周期审批、配置与启停状态保持、目标级回滚和
  启动说明工作流，并附带无第三方依赖的只读插件检查器。

### 改进

- 统一已安装插件卡片：名称、包名、两行说明、版本和状态各自占据固定信息层级，更新、
  启停、卸载按钮使用固定操作列，任务日志固定显示在卡片底部。
- 引导 Agent 会根据 Registry 证据预选最快安全路径：完整预构建 commit 直接禁用脚本安装；
  缺少运行产物时转入经审批的隔离构建；证据不足时停止。

### 安全与测试

- 检查器验证精确 Git HEAD、包名/版本、Bundle patch、Host/Client 入口、生命周期脚本、
  重复 Bundle ID 和 Cordis 服务冲突。
- 使用四个不同风险类别的真实 Registry 仓库复验决策路径；另在隔离 DSH_HOME 中完成两个
  精确 commit 安装，并验证更新不会重新启用已停用插件或改变其他插件状态。

## [0.8.0] - 2026-08-15

### 新增

- 在“管理与诊断”页面新增手动命令安装，支持官方
  `dsh plugin --profile <当前Profile> add github:owner/repo[#ref]` 格式及精简的
  `github:owner/repo[#ref]` 格式。
- 手动安装会将 tag、分支或默认来源解析为精确 commit，验证 DSH Bundle、检查冲突，安装
  成功后自动加入 Profile 并出现在“已安装插件”页面。

### 安全

- 手动命令作为结构化数据解析，不交给 Shell；拒绝跨 Profile、额外参数、多行、多命令、
  Shell 运算符和危险 Git ref，且安装过程禁用生命周期脚本。

### 测试

- 增加手动命令解析的合法格式、Profile 隔离和命令注入回归测试；Typert Host 可调用性检查
  扩展到 14 个远端方法。

## [0.7.3] - 2026-08-15

### 改进

- 插件页调整为“插件市场 / 已安装插件 / 管理与诊断”三个子页面；插件安装位置和冲突诊断
  移至独立管理页，减少已安装列表中的视觉干扰。
- 已安装插件页新增按包名、说明、仓库和版本过滤的搜索框。
- 市场卡片将仓库名作为主标题，仓库作者移动到独立信息行，不再与仓库名挤在同行。

## [0.7.2] - 2026-08-15

### 修复

- 修复打开插件市场时 `marketplace/installLocation` 报错“active Service has no callable
  method”的问题。Host 实现名称现在与 Typert 远端描述符完全一致。

### 测试

- Typert 契约测试现在会逐项检查远端描述符对应的 Host 方法是否真实存在且可调用，防止
  类似的实现名称偏差再次进入发布版本。

## [0.7.1] - 2026-08-15

### 修复

- 修复安装、更新或卸载插件后，原本已停用的插件偶尔被重新加入
  `dsh.profile.bundles` 并自行启用的问题。
- Profile 插件操作改为全局串行，安装源解析期间也会锁定写操作，避免不同插件任务并发
  覆盖彼此的依赖和启停状态。
- 自定义目录安装和失败回滚只合并目标依赖到最新的 `package.json`，不再写回任务开始时的
  整份旧快照，从而保留任务期间发生的其他有效配置修改。
- Bundle 对账改为只处理当前目标插件：新安装或由普通依赖升级为 Bundle 的插件会自动启用，
  既有但已停用的 Bundle 保持停用，卸载时仅移除自身。
- 引导安装 Agent 在调用 DSH 或 pnpm 前记录 Bundle 顺序，并在完成后恢复所有既有插件的
  启停状态，以兼容尚未包含 CLI 修复的 DSH 版本。

### 测试

- 新增停用状态保持、最新 Manifest 合并、跨插件并发互斥及引导 Agent 安全规则回归测试。

### 文档

- 建立从 `v0.1.0` 到当前版本的完整中英文更新日志，并在 README 中增加入口。

## [0.7.0] - 2026-08-15

### 新增

- 增加自定义插件安装位置，可通过 DSH 原生目录选择器选择目录；外置插件使用
  `file:` 依赖关联当前 Profile，并将运行入口链接回 Profile 的 `node_modules`。
- 增加插件冲突诊断，检查重复 Bundle ID 和常见 Cordis 服务注册形式；安装、更新、
  启用前只阻止本次操作新引入的冲突。
- 在插件卡片中显示安装、更新和卸载进度及可折叠日志；失败信息改为固定位置通知。
- 识别自定义目录中存在但尚未关联当前 Profile 的插件，并以只读状态展示。
- 新增 Pull Request CI：构建真实 DSH 类型契约，执行 TypeScript 检查、完整测试、
  插件构建、manifest 验证及生成物一致性检查。
- 新增真实 pnpm 自定义目录集成测试，覆盖生命周期脚本隔离、Host peer 链接、
  `file:` 规格和 pnpm store 复用。

### 改进

- 安装、更新和卸载统一复用当前 Profile 已绑定的 pnpm store，减少
  `ERR_PNPM_UNEXPECTED_STORE`。
- 切换自定义安装目录只影响后续安装；已有插件继续在原位置更新或卸载，不再被迁移。
- 保留 scoped npm 包的 `@scope/name` 目录层级，避免不同包名被压平后发生冲突。
- 外置安装会将缺失 peer 链接到 DSH Host，并替换错误自动安装出的独立 peer，避免加载
  第二份 Cordis；安装依赖时关闭生命周期脚本和 peer 自动安装。
- README 增加宣传截图，并补充安装位置、冲突诊断和安全边界说明。

### 修复

- GitHub 来源只要声明 `preinstall`、`install`、`postinstall` 或 `prepare` 就保持引导安装；
  已验证且包含完整运行产物的精确 npm tarball 仍可一键安装。
- 修复更改安装目录后，既有外置插件无法正确更新或卸载的问题。
- 修复相对 pnpm store 路径解析到了错误工作目录的问题。
- 修复 Windows 跨盘符路径生成无效 `file:` 规格，以及 Linux CI 错误改写 Windows
  绝对路径的问题。
- 修复目录选择器和任务标签的 TypeScript 可空类型错误。
- 固定浏览器 bundle 的严格模式配置，使 Windows 与 Linux 生成完全一致的产物。
- Registry 分类器升级时复用未受影响的缓存，只重新验证生命周期策略相关条目，避免
  一次扫描耗尽 API 配额。

## [0.6.1] - 2026-08-15

### 改进

- 重写中英文 README，增加能力概览、安装模式、Registry 流程图、安全规则和开发说明。
- 简化市场插件卡片的信息层级、操作区和视觉密度，改善长描述及元数据的可读性。

## [0.6.0] - 2026-08-15

### 新增

- 为不能安全一键安装或更新的条目增加受约束的引导安装 Agent。
- Agent 任务固定精确仓库 commit、包名、Profile、扫描原因和验收条件，并要求成功后
  给出 Profile、重启、配置和入口等启动说明。
- 发布 `registry/guided-audit.json`，为每个引导条目提供逐轮复验结果。

### 改进

- Registry 扫描从每日一次调整为每两小时一次。
- 支持通过 Actions Secret `REGISTRY_GITHUB_TOKEN` 使用只读 PAT；未配置时继续使用
  `GITHUB_TOKEN`，Registry 写回仍使用 Actions 内置凭据。
- 每轮重新核验引导条目和 npm 来源，使后来发布合格 npm 包的插件能够自动转为一键安装。

## [0.5.0] - 2026-08-14

### 新增

- 增加插件市场自更新：直接读取仓库主分支的版本和 commit，不必等待 Registry 刷新。
- 执行更新时把来源固定为已解析的精确 commit，不把可变的 `main` 直接交给 pnpm。
- 增加自更新回归测试。

## [0.4.0] - 2026-08-14

### 新增

- 发布 `registry/discovery.json`，在不改变核心 Registry v2 格式的前提下提供插件分类。
- 增加分类筛选、“近期热门”排序和最近 7 天 Star 增长数据。
- 在增量状态中保存每日 Star 基线；没有历史基线的新插件增长值为 0。

### 修复

- GitHub Search 结果过大时按创建时间细分到秒，绕过单次搜索 1,000 条上限。
- 扫描器会等待 Search API 配额恢复后继续，减少大规模扫描中断。
- README 审计遇到临时 GitHub 错误时自动重试。
- Registry CI 可以脱离本机 DSH checkout 验证生成的 Registry 文件。
- 移除已经过时的人工安装覆盖规则。

## [0.3.3] - 2026-08-14

### 新增

- 在“已安装插件”页面和“重启后生效”提示中增加受控的“重启 DSH”操作。
- 重启会等待正在运行的插件任务结束，沿用相同启动参数和 Profile，并在服务恢复后刷新页面。
- 增加重启流程回归测试。

## [0.3.2] - 2026-08-14

### 改进

- 对全部引导安装条目进行系统复验，并自动消除可以由仓库或 npm 证据证明安全的假阳性。
- 增加精确 npm tarball 验证：检查 Registry URL、SHA-512、包身份、bundle patch、
  运行入口、生命周期脚本和根级 `binding.gyp`。
- `<profile>`、`your-profile`、`my-profile` 等值按占位符处理；README 中的示例 owner
  也不再误判为真实仓库身份。
- Web client 默认只匹配 `web`；host-only 插件默认匹配 `headless` 和 `web`。
- README 中过期的迁移地址保留为审计信息，不再阻断当前精确 commit 的完整安装证据。
- 临时 GitHub 或 npm 请求失败时保留上一次已验证结果，避免插件批量消失。
- 增加 `registry/guided-audit.json` 和 npm 来源的周期复验。

> `v0.3.2` 曾允许部分包含 `prepare` 的 GitHub 来源自动安装；该规则已在 `v0.7.0`
> 收紧为一律引导安装。

## [0.3.1] - 2026-08-14

### 修复

- 撤回 `v0.3.0` 的 packagePath/monorepo 展开方式，恢复一个 GitHub 仓库对应一个市场条目。
- Registry 公共格式恢复为 v2，消除聚合仓库中大量子包被重复展示的问题。
- 保留 `v0.3.0` 已加入的已安装插件启用/停用能力。

## [0.3.0] - 2026-08-14

### 新增

- 增加已安装插件启用/停用，直接维护当前 Profile 的 `dsh.profile.bundles`，不删除依赖。
- 增加基于仓库 manifest、README、运行产物、Profile 和生命周期脚本的安装证据分类。
- 增加 `registry/install-review.json`，保存分类理由和待人工核对的证据。
- 短期引入 `owner/repo&path:/子目录` 身份和 monorepo 多插件扫描。

### 修复

- Registry 远程读取增加临时错误重试。
- 识别更多官方 DSH 安装命令写法、Profile 占位符和 pnpm workspace 参数。

> packagePath/monorepo 展开功能因会把聚合仓库中的大量内部包作为独立插件展示，已在
> `v0.3.1` 撤回；它不是当前 Registry 的行为。

## [0.2.0] - 2026-08-14

### 新增

- Registry v2 增加安装来源、兼容 Profile、构建授权、重启需求和人工步骤元数据。
- 市场增加“已安装插件”子页面，支持检查更新、执行更新和卸载当前 Profile 的插件。
- 自动安装只对 Profile 兼容且满足安全条件的精确来源开放；其他条目显示安装说明。
- 支持插件通过 `dsh.marketplace` 声明市场元数据，并支持中心安装策略覆盖。

### 改进

- 远程 Registry 使用内存缓存和 ETag；失败时先使用最近有效内容，再回退到内置快照。
- 简化 Registry 维护文档，移除不再使用的维护流程。

## [0.1.0] - 2026-08-13

### 首次发布

- 建立中心化、自主维护的 DSH 插件 Registry。
- GitHub Action 自动发现带有 `dsh-plugin` topic 且未归档的仓库。
- 静态验证 `package.json`、`dsh.bundle.patch`、YAML loader entry 和精确 commit，
  不安装依赖、不执行第三方代码。
- 通过 `registry/plugins.json` 发布已验证插件，通过 `registry/rejected.json` 记录
  未通过候选及原因，并以 `registry/state.json` 支持增量扫描。
- 增加 DSH Web 插件市场页面、搜索、Star/更新时间排序、详情展示和精确 commit 安装。
- npm 包内置构建产物和 Registry 快照；远程 Registry 不可用时仍可使用。
- 提供 Registry Schema、扫描测试、构建及真实 DSH loader 验证脚本。

[未发布]: https://github.com/YELEBAI/dsh-plugin-marketplace/compare/v0.9.1...HEAD
[0.9.1]: https://github.com/YELEBAI/dsh-plugin-marketplace/compare/v0.9.0...v0.9.1
[0.9.0]: https://github.com/YELEBAI/dsh-plugin-marketplace/compare/v0.8.0...v0.9.0
[0.8.0]: https://github.com/YELEBAI/dsh-plugin-marketplace/compare/v0.7.3...v0.8.0
[0.7.3]: https://github.com/YELEBAI/dsh-plugin-marketplace/compare/v0.7.2...v0.7.3
[0.7.2]: https://github.com/YELEBAI/dsh-plugin-marketplace/compare/v0.7.1...v0.7.2
[0.7.1]: https://github.com/YELEBAI/dsh-plugin-marketplace/compare/v0.7.0...v0.7.1
[0.7.0]: https://github.com/YELEBAI/dsh-plugin-marketplace/compare/v0.6.1...v0.7.0
[0.6.1]: https://github.com/YELEBAI/dsh-plugin-marketplace/compare/v0.6.0...v0.6.1
[0.6.0]: https://github.com/YELEBAI/dsh-plugin-marketplace/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/YELEBAI/dsh-plugin-marketplace/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/YELEBAI/dsh-plugin-marketplace/compare/v0.3.3...v0.4.0
[0.3.3]: https://github.com/YELEBAI/dsh-plugin-marketplace/compare/v0.3.2...v0.3.3
[0.3.2]: https://github.com/YELEBAI/dsh-plugin-marketplace/compare/v0.3.1...v0.3.2
[0.3.1]: https://github.com/YELEBAI/dsh-plugin-marketplace/compare/v0.3.0...v0.3.1
[0.3.0]: https://github.com/YELEBAI/dsh-plugin-marketplace/compare/v0.2.0...v0.3.0
[0.2.0]: https://github.com/YELEBAI/dsh-plugin-marketplace/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/YELEBAI/dsh-plugin-marketplace/tree/v0.1.0
