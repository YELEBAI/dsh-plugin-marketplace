/**
 * 浏览器 fixture 只引入市场真正使用的 DSH primitives，避免打包整个 index。
 * ui-test.mjs 会把 @dsh-fixture/* 解析到指定的本机 DSH checkout 源文件。
 */
export { Button } from '@dsh-fixture/Button'
export { Input } from '@dsh-fixture/Input'
export { Pill } from '@dsh-fixture/Pill'
export { RiskConfirmation } from '@dsh-fixture/RiskConfirmation'
export { StateDot } from '@dsh-fixture/StateDot'
export type { StateDotState } from '@dsh-fixture/StateDot'
export { IconChevronDownOutline14, IconSearchOutline16 } from '@dsh-fixture/icons'
