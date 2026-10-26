# Minecraft Agent 收录安全说明

## 当前限制

2026-10-26 复核的版本为 `@jcs130/dsh-minecraft-agent@0.3.0-rc.22`。
它通过 `agent-mc-world@0.5.7-rc.89` 固定依赖 `zod@4.6.5`，命中
[GHSA-mrhx-c7xc-m3w5](https://github.com/advisories/GHSA-mrhx-c7xc-m3w5)。
公告给出的修复版本为 `4.6.6`；风险为特定超大集合校验导致内存耗尽，不代表发现作者植入恶意代码。
本次确认了依赖版本命中，未复现该插件中的具体攻击路径。

市场保留 Web / Desktop 的发现与精确 npm 校验，但暂时设置 `manualSteps: true`，不开放一键安装或更新。
完整性、Bundle patch 和运行入口检查通过，不等于依赖漏洞已修复。
限制适用于该仓库后续扫描，只有维护者复核修复版并修改策略后才解除；不是自动随新版本消失。

## 给用户和安装 Agent

- 先只读核对精确版本和实际依赖树；若仍包含受影响依赖，停止安装或更新并说明风险，不把“引导安装”理解为允许继续。
- 不通过换用 GitHub 来源、旧版或关闭生命周期脚本来声称漏洞已修复；运行时依赖风险仍然存在。
- 不修改用户 Profile 的全局 pnpm overrides，也不替换其他插件的依赖来规避本限制。
- 不自动停用、卸载或改写用户已经安装的插件；由用户决定是否暂时停用，保留其配置与数据。
- [上游桌面端说明](https://github.com/jcs130/dsh-minecraft-agent/blob/main/docs/desktop.md)仅供兼容性参考，不是继续安装受影响版本的许可。

## 恢复一键安装的条件

1. 作者在核心依赖中修复 Zod 版本并发布新的核心 npm 包。
2. 插件引用修复后的核心精确版本，并发布新的插件版本。
3. 维护者重新验证插件的精确 npm 压缩包、实际依赖树及相关漏洞公告，再显式解除人工限制。

升级市场自身的 Zod、修改说明文档或通过市场 CI，都不能替代上游依赖的修复与重新发布。

## English summary

The reviewed `@jcs130/dsh-minecraft-agent@0.3.0-rc.22` depends on
`agent-mc-world@0.5.7-rc.89`, which pins `zod@4.6.5`. This matches
GHSA-mrhx-c7xc-m3w5; the advisory identifies `4.6.6` as patched. Version exposure
is confirmed, but exploitability in this plugin has not been reproduced.

Web/Desktop discovery and exact npm verification are retained. The maintainer
policy requires manual review, so automatic install/update remains unavailable.
An Agent must stop if the vulnerable dependency is still present, not treat
guided mode as permission to proceed. Do not bypass this through GitHub sources,
global Profile overrides or disabled lifecycle scripts.

The publisher must release a fixed core and a plugin using it. Maintainers must
then verify the exact npm artifact and resolved dependency tree and explicitly
remove the hold. Existing installations are not modified by this policy.
