/** 随设置面板挂载的局部样式，沿用 DSH 主题变量，不影响其他插件。 */
export const marketplaceStyles = `
.dsh-marketplace {
  width: 100%; max-width: 1040px; min-width: 0;
  display: flex; flex-direction: column; gap: 12px;
  color: var(--dsw-alias-label-primary);
  container: marketplace / inline-size;
}
.dsh-marketplace *, .dsh-marketplace *::before, .dsh-marketplace *::after { box-sizing: border-box; }
.dsh-marketplace .mkt-heading { display: flex; flex-direction: column; gap: 6px; }
.dsh-marketplace .mkt-heading h2 { margin: 0; font-size: 22px; line-height: 30px; font-weight: 650; letter-spacing: -.4px; }
.dsh-marketplace .mkt-heading p { margin: 0; color: var(--dsw-alias-label-secondary); font-size: 13px; line-height: 21px; }
.dsh-marketplace .mkt-subnav { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; }
.dsh-marketplace .mkt-subnav-group { display: flex; gap: 4px; padding: 4px; border-radius: 12px; background: var(--dsw-alias-bg-layer-2); border: 1px solid var(--dsw-alias-border-l2); }
.dsh-marketplace .mkt-pill { height: auto; min-height: 32px; justify-content: center; border: 1px solid transparent; border-radius: 8px; padding: 5px 11px; font-size: 12px; line-height: 20px; font-weight: 500; color: var(--dsw-alias-label-secondary); background: transparent; white-space: nowrap; cursor: pointer; transition: background .15s, color .15s, border-color .15s; }
.dsh-marketplace .mkt-pill[aria-pressed=true] { color: var(--dsw-alias-state-business-primary); background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 9%, var(--dsw-alias-bg-layer-3)); border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary) 20%, transparent); font-weight: 600; }
.dsh-marketplace .mkt-subnav-group .mkt-pill[aria-pressed=true] { color: var(--dsw-alias-label-primary); background: var(--dsw-alias-bg-layer-3); border-color: var(--dsw-alias-border-l2); box-shadow: 0 1px 3px #0000000a; }
.dsh-marketplace .mkt-profile { display: inline-flex; align-items: center; gap: 7px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; padding: 5px 9px; font-size: 11px; color: var(--dsw-alias-label-secondary); }
.dsh-marketplace .mkt-profile::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--dsw-alias-state-success-primary); }
.dsh-marketplace .mkt-button { min-height: 34px; height: auto; padding: 6px 12px; border-radius: 9px; font-size: 12px; line-height: 20px; font-weight: 550; gap: 6px; transition: background .15s, border-color .15s, box-shadow .15s; }
.dsh-marketplace .mkt-button:disabled { opacity: .5; cursor: not-allowed; }
.dsh-marketplace .mkt-button[data-tone=danger]:not(:disabled) { color: var(--dsw-alias-state-error-primary); border-color: color-mix(in srgb, var(--dsw-alias-state-error-primary) 30%, var(--dsw-alias-border-l2)); background: transparent; }
.dsh-marketplace .mkt-button[data-tone=danger]:hover:not(:disabled) { background: color-mix(in srgb, var(--dsw-alias-state-error-primary) 8%, transparent); }
.dsh-marketplace :is(button, a, input, select, summary):focus-visible { outline: 2px solid var(--dsw-alias-state-business-primary); outline-offset: 3px; }
.dsh-marketplace a:hover { text-decoration: underline; text-underline-offset: 3px; }
.dsh-marketplace .mkt-toolbar { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 10px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; background: var(--dsw-alias-bg-layer-3); }
.dsh-marketplace .mkt-search { min-width: 0; flex: 1 1 260px; }
.dsh-marketplace .mkt-search > span { display: flex; width: 100%; height: 38px; }
.dsh-marketplace .mkt-search input { width: 100%; font-size: 13px; }
.dsh-marketplace input::placeholder { color: var(--dsw-alias-label-tertiary); }
.dsh-marketplace .mkt-results { display: flex; align-items: center; justify-content: space-between; gap: 12px; min-height: 24px; margin-top: -8px; font-size: 12px; color: var(--dsw-alias-label-secondary); }
.dsh-marketplace .mkt-sort-group { display: flex; align-items: center; gap: 5px; flex-wrap: wrap; }
.dsh-marketplace .mkt-select { max-width: 100%; min-height: 34px; padding: 5px 26px 5px 10px; margin-right: 5px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 8px; background: var(--dsw-alias-bg-layer-2); color: var(--dsw-alias-label-secondary); font: inherit; font-size: 12px; cursor: pointer; }
.dsh-marketplace .mkt-cards { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr)); align-items: start; gap: 10px; margin: 0; padding: 0; list-style: none; }
.dsh-marketplace .mkt-card { min-width: 0; overflow: hidden; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; background: var(--dsw-alias-bg-layer-3); transition: border-color .18s, box-shadow .18s; }
.dsh-marketplace .mkt-card:hover, .dsh-marketplace .mkt-card:focus-within { border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary) 35%, var(--dsw-alias-border-l2)); box-shadow: 0 5px 18px #00000008; }
.dsh-marketplace .mkt-card-body { padding: 12px; display: flex; flex-direction: column; gap: 6px; }
.dsh-marketplace .mkt-card-head { display: flex; align-items: flex-start; gap: 8px; min-width: 0; }
.dsh-marketplace .mkt-card-name { min-width: 0; flex: 1; display: flex; flex-direction: column; gap: 3px; }
.dsh-marketplace .mkt-card-name strong { font-size: 14px; font-weight: 650; }
.dsh-marketplace .mkt-card-name p { margin: 0; }
.dsh-marketplace .mkt-card-icon { width: 28px; height: 28px; flex: none; display: grid; place-items: center; border: 1px solid color-mix(in srgb, var(--dsw-alias-state-business-primary) 16%, transparent); border-radius: 8px; color: var(--dsw-alias-state-business-primary); background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 8%, transparent); }
.dsh-marketplace .mkt-card-icon svg { width: 18px; height: 18px; }
.dsh-marketplace .mkt-card-actions { display: flex; align-items: center; gap: 6px; flex-wrap: wrap; margin-top: 2px; padding-top: 6px; border-top: 1px solid var(--dsw-alias-border-l2); }
.dsh-marketplace .mkt-card-actions > button { min-width: 64px; padding-inline: 9px; }
.dsh-marketplace .mkt-detail-toggle { display: inline-flex; align-items: center; gap: 5px; min-height: 32px; padding: 4px 6px; color: var(--dsw-alias-label-secondary); background: transparent; border: 0; border-radius: 6px; cursor: pointer; font: inherit; font-size: 12px; }
.dsh-marketplace .mkt-detail-toggle:hover, .dsh-marketplace .mkt-pill:hover:not([aria-pressed=true]) { background: var(--dsw-alias-bg-layer-2); }
.dsh-marketplace .mkt-pager { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 4px 0; }
.dsh-marketplace .mkt-pager > span { text-align: center; font-size: 12px; }
.dsh-marketplace .mkt-empty { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; min-height: 180px; padding: 24px; border: 1px dashed var(--dsw-alias-border-l2); border-radius: 14px; text-align: center; color: var(--dsw-alias-label-secondary); font-size: 13px; }
.dsh-marketplace .mkt-empty p { margin: 0; }
.dsh-marketplace .mkt-installed-card { display: flex; flex-direction: column; gap: 12px; padding: 18px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 14px; background: var(--dsw-alias-bg-layer-3); }
.dsh-marketplace .mkt-installed-card[data-selected=true] { border-color: color-mix(in srgb, var(--dsw-alias-state-business-primary) 50%, var(--dsw-alias-border-l2)); background: color-mix(in srgb, var(--dsw-alias-state-business-primary) 3%, var(--dsw-alias-bg-layer-3)); }
.dsh-marketplace .mkt-installed-top { display: flex; align-items: flex-start; gap: 20px; flex-wrap: wrap; }
.dsh-marketplace .mkt-installed-info { min-width: 0; display: flex; flex: 1 1 320px; flex-direction: column; gap: 6px; }
.dsh-marketplace .mkt-installed-info > span { overflow: hidden; text-overflow: ellipsis; }
.dsh-marketplace .mkt-installed-actions { display: flex; align-items: center; justify-content: flex-end; gap: 8px; flex-wrap: wrap; }
.dsh-marketplace .mkt-installed-actions > :is(button, a) { width: auto; min-width: 64px; }
.dsh-marketplace input[type=checkbox] { width: 16px; height: 16px; margin: 0; flex: none; accent-color: var(--dsw-alias-state-business-primary); cursor: pointer; }
.dsh-marketplace .mkt-bulk-actions { display: flex; flex-direction: column; gap: 12px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 12px; padding: 14px 16px; background: var(--dsw-alias-bg-layer-2); }
.dsh-marketplace .mkt-bulk-head { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px; }
.dsh-marketplace .mkt-bulk-buttons { display: flex; flex-wrap: wrap; gap: 8px; }
.dsh-marketplace .mkt-management { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); align-items: start; gap: 16px; }
.dsh-marketplace .mkt-management > :first-child, .dsh-marketplace .mkt-management > :last-child { grid-column: 1 / -1; }
.dsh-marketplace .mkt-panel { min-width: 0; display: flex; flex-direction: column; gap: 12px; padding: 20px; border: 1px solid var(--dsw-alias-border-l2); border-radius: 14px; background: var(--dsw-alias-bg-layer-3); }
.dsh-marketplace .mkt-panel > strong { color: var(--dsw-alias-label-primary); font-size: 14px; }
.dsh-marketplace .mkt-manual-command { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.dsh-marketplace .mkt-manual-command > span { flex: 1 1 320px; min-width: 0; height: 38px; }
@container marketplace (max-width: 620px) {
  .dsh-marketplace .mkt-search { flex-basis: 100%; }
  .dsh-marketplace .mkt-installed-actions { width: 100%; padding-top: 12px; border-top: 1px solid var(--dsw-alias-border-l2); }
  .dsh-marketplace .mkt-installed-actions > :is(button, a) { flex: 1; }
  .dsh-marketplace .mkt-management { grid-template-columns: minmax(0, 1fr); }
  .dsh-marketplace .mkt-heading h2 { font-size: 20px; }
}
@container marketplace (max-width: 480px) {
  .dsh-marketplace .mkt-subnav-group { width: 100%; }
  .dsh-marketplace .mkt-subnav-group > button { flex: 1; min-width: 0; white-space: normal; padding-inline: 6px; }
}
@media (prefers-reduced-motion: reduce) {
  .dsh-marketplace .mkt-button, .dsh-marketplace .mkt-pill, .dsh-marketplace .mkt-card { transition: none; }
}
`
