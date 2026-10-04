// Wehou公众号排版器 - Replica
// Single-file application with Markdown editing and WeChat-styled preview.
// Matches mp.knb.im themes, containers, chat, and heading progress.

// Use global `marked` from app/marked.js
const { marked } = window;

// ==================== Themes (exact from original) ====================
// Each theme has the 8 color tokens used by the original EP() CSS function.
const THEMES = [
  { id: 'default',    name: '绿蓝',     desc: '可能吧风格：绿色为主，蓝色为辅',         h2Dark: 'rgb(41, 148, 128)',  h2Mid: 'rgb(73, 200, 149)',  h3Dark: 'rgb(26, 149, 165)',  h3Mid: 'rgb(38, 198, 218)',  introText: 'rgb(60, 90, 80)',  colors: ['#1a1a1a', 'rgb(41, 148, 128)'] },
  { id: 'blackwhite', name: '黑白',     desc: '低饱和灰阶，适合严肃/商务文章',          h2Dark: '#555',             h2Mid: '#999',               h3Dark: '#777',               h3Mid: '#999',               introText: '#3e3e3e',          colors: ['#3e3e3e', '#999'] },
  { id: 'joker',      name: '小丑',     desc: '柔和紫罗兰，适合书评/文艺',              h2Dark: '#917cb7',          h2Mid: '#BAA8E4',            h3Dark: '#a57d96',            h3Mid: '#deafd0',            introText: '#5a4f78',          colors: ['#5a4f78', '#917cb7'] },
  { id: 'loki',       name: '洛基',     desc: '亦正亦邪的洛基风格',                     h2Dark: '#0b450a',          h2Mid: '#d6d3ae',            h3Dark: '#50630d',            h3Mid: '#d6d3ae',            introText: '#0b450a',          colors: ['#0b450a', '#50630d'] },
  { id: 'batman',     name: '老爷',     desc: '深灰主调 + 蓝色 + 金色',                 h2Dark: '#4e4e4e',          h2Mid: '#68b4e4',            h3Dark: '#68b4e4',            h3Mid: '#4e4e4e',            introText: '#3e3e3e',          colors: ['#3e3e3e', '#68b4e4'] },
  { id: 'posionivy',  name: '毒藤',     desc: '经典的毒藤配色',                         h2Dark: '#ff6325',          h2Mid: '#37c412',            h3Dark: '#37c412',            h3Mid: '#fcdb95',            introText: '#000000',          colors: ['#000000', '#ff6325'] },

  // ===== 精选色系（基于网页前端最佳搭配色系：主色 + 辅助色协调）=====
  { id: 'ocean',   name: '海洋蓝', desc: '科技专业：深蓝主调，青绿辅助',           h2Dark: '#0369A1',          h2Mid: '#7DD3FC',            h3Dark: '#0891B2',            h3Mid: '#67E8F9',            introText: '#075985',          colors: ['#082F49', '#0EA5E9'] },
  { id: 'forest',  name: '森林绿', desc: '自然环保：祖母绿主调，薄荷辅助',          h2Dark: '#047857',          h2Mid: '#6EE7B7',            h3Dark: '#059669',            h3Mid: '#34D399',            introText: '#065F46',          colors: ['#064E3B', '#059669'] },
  { id: 'twilight',name: '暮光紫', desc: '文艺创意：紫罗兰主调，浅紫辅助',          h2Dark: '#6D28D9',          h2Mid: '#C4B5FD',            h3Dark: '#7C3AED',            h3Mid: '#A78BFA',            introText: '#4C1D95',          colors: ['#2E1065', '#7C3AED'] },
  { id: 'sunset',  name: '暖阳橙', desc: '活力美食：赤橙主调，暖金辅助',            h2Dark: '#C2410C',          h2Mid: '#FDBA74',            h3Dark: '#EA580C',            h3Mid: '#FCD34D',            introText: '#9A3412',          colors: ['#431407', '#EA580C'] },
  { id: 'rose',    name: '玫瑰红', desc: '时尚生活：玫红主调，浅粉辅助',            h2Dark: '#9F1239',          h2Mid: '#FDA4AF',            h3Dark: '#BE123C',            h3Mid: '#FB7185',            introText: '#881337',          colors: ['#4C0519', '#BE123C'] },
];

// 分类只列仍然保留的主题（已下线：红火 red、蓝靛 blueindigo、桃红 pink、
// 金黄 golden、钢人 ironman、小虫 spiderman）
const THEME_CATEGORIES = [
  { id: 'color', label: '基础',   themeIds: ['default', 'blackwhite', 'posionivy'] },
  { id: 'character', label: '角色', themeIds: ['joker', 'loki', 'batman'] },
  { id: 'curated', label: '精选色系', themeIds: ['ocean', 'forest', 'twilight', 'sunset', 'rose'] },
];

// Default token constants (match original defaults)
const BODY_COLOR = 'rgb(43, 43, 43)';
const MUTED = '#888';
const MARK_BG = 'rgb(238, 253, 247)';
const H2_DEFAULT = 'rgb(41, 148, 128)';
const H3_DEFAULT = 'rgb(26, 149, 165)';
const TITLE_DEFAULT = 'rgb(62, 62, 62)';

// Container labels (match original Wx map)
const CONTAINER_META = {
  tip:    { icon: 'tip',  label: '',  placeholder: '在这里写提示' },
  info:   { icon: 'info',  label: '',  placeholder: '在这里写说明' },
  warning:{ icon: 'warning',  label: '',  placeholder: '在这里写警告' },
  note:   { icon: 'note',  label: '',  placeholder: '在这里写笔记' },
  danger: { icon: 'danger',  label: '',   placeholder: '在这里写危险提示' },
  say:    { icon: 'say',  label: '',    placeholder: '在这里写一段独白' },
  intro:  { icon: 'intro',    label: '',      placeholder: '在这里写摘要' },
  highlight:{ icon: 'highlight',  label: '',    placeholder: '在这里写金句' },
};

const SAMPLE = `# 这是一份示例文档

这是一款有点逼格的 Markdown 排版器，专门为微信公众号准备。在左侧输入 Markdown，右侧会实时显示微信手机预览。

## 基础格式

普通段落支持 **加粗**、*斜体*、~~删除线~~、<u>下划线</u>、H~2~O 上标、x^2^ 下标，以及 [链接](https://mp.knb.im) 等基础行内格式。

> 一段引述：每篇文章开头能让人看下去，中间能让人记下来，结尾能让人转出去。

## 多级标题

### 三级标题

#### 四级标题已经非常接近正文大小

## 列表

下面是无序列表的演示：

- 一件事
- 另一件事
  - 子项 A
  - 子项 B
- 第三件事

下面是有序列表：

1. 第一步
2. 第二步
3. 第三步

任务清单也是支持的：

- [x] 已完成的事情
- [ ] 待办的事情
- [ ] 又或者其它的

## 引用与代码

\`等宽行内代码\` 适合放在正文中。围栏代码块则适合放示例：

\`\`\`js
function hello(name) {
  return \`Hello, \${name}!\`;
}
console.log(hello('Wehou'));
\`\`\`

## 表格

| 名字 | 难度 | 适合 |
| --- | --- | --- |
| 朴素 | 1 | 长文 |
| 几何 | 2 | 严肃 |
| 睿木 | 3 | 评论 |

## 特殊容器

::: note
在这里写笔记——比如想在文章中插入一段辅助说明。
:::

::: tip
在这里写提示——告诉读者接下来会发生什么。
:::

::: warning
在这里写警告——比如这里有一处需要解释的概念。
:::

::: danger
在这里写危险提示。
:::

::: info
在这里写说明。
:::

::: highlight
在这里写金句。
:::

::: intro
在这里写摘要段——通常放文章开头。
:::

## 脚注

这是一句话需要一个解释[^1]，另一个脚注在文末以独立列表形式出现[^long]。

## 图片

![一张示例图片](https://placehold.co/600x300/299480/ffffff?text=Sample)

---

把目前Wehou公众号排版器用得不舒服的地方都展示了一遍。满意后点 **复制**，即可粘贴到公众号后台发布。

[^1]: 脚注在文末以独立列表形式出现，鼠标悬停可看完整内容。
[^long]: 数字之间自动加空格，中英混排会获得最佳体验。`;

// ==================== State ====================
const state = {
  markdown: '',
  theme: 'default',
  codeTheme: 'github-dark',
  // 字重档位：light=300(细) / regular=400(常规) / bold=700(粗)
  fontWeight: 'regular',
  darkPreview: false,
  // 导出时把段落里的裸文本包进无样式 <span>，消除「行内标签 + 纯文本混排」，
  // 从而规避微信线上对这类段落的 2.3.2 误报。
  // 2026-10-04 用户实测：开启后复制到公众号后台，原先 10 段的行高告警全部消失，
  // 视觉零变化 → 默认开启。仍可在「设置 → 导出」关掉。
  wrapInline: true,
  activeDialog: null,
  activeLink: null,
  toolbarDropdown: null,
  keymap: null,               // 命令 id -> 组合键字符串，null 表示未绑定
};

// ==================== DOM helpers ====================
const $ = (sel, parent = document) => parent.querySelector(sel);
const $$ = (sel, parent = document) => Array.from(parent.querySelectorAll(sel));
const el = (tag, attrs = {}, ...children) => {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') node.className = v;
    else if (k === 'style' && typeof v === 'object') Object.assign(node.style, v);
    else if (k.startsWith('on') && typeof v === 'function') node.addEventListener(k.slice(2).toLowerCase(), v);
    else if (k === 'html') node.innerHTML = v;
    else if (v === true) node.setAttribute(k, '');
    else if (v !== false && v != null) node.setAttribute(k, v);
  }
  for (const child of children.flat()) {
    if (child == null || child === false) continue;
    node.appendChild(child.nodeType ? child : document.createTextNode(child));
  }
  return node;
};

// ==================== Icons (Lucide-style inline SVG) ====================
const ICON = {
  bold:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"/><path d="M6 4h7a4 4 0 0 1 0 8H6z"/></svg>',
  italic:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="4" x2="10" y2="4"/><line x1="14" y1="20" x2="5" y2="20"/><line x1="15" y1="4" x2="9" y2="20"/></svg>',
  strike:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4H9a3 3 0 0 0-2.83 4"/><path d="M14 12a4 4 0 0 1 0 8H6"/><line x1="4" y1="12" x2="20" y2="12"/></svg>',
  underline:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4v6a6 6 0 0 0 12 0V4"/><line x1="4" y1="20" x2="20" y2="20"/></svg>',
  superscript: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19l8-10 8 10"/><path d="M17 5h4"/><path d="M19 3v6"/></svg>',
  subscript:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5l7 7-7 7"/><path d="M11 5l7 7-7 7"/><path d="M17 17h4"/><path d="M19 15v6"/></svg>',
  h1:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 12l3-2v8"/></svg>',
  h2:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M21 18h-4c0-4 4-3 4-6 0-1.5-2-2.5-4-1"/></svg>',
  h3:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17.5 10.5c1.7-1 3.5 0 3.5 1.5a2 2 0 0 1-2 2"/><path d="M17 17.5c1.5 1 4 1 4-1.5-0.2-1.8-2-2-3.5-1.5"/></svg>',
  // 「4」的字形：斜边必须从竖线顶端向左下延伸，再由横杠穿过竖线。
  // 原实现斜边画在竖线右侧（M20 6 16 13），视觉上是个反的 4。
  h4:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M17 18V6"/><path d="M17 6l-4 7"/><path d="M13 13h8"/></svg>',
  quote:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/></svg>',
  ul:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>',
  ol:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/><path d="M4 6h1v4"/><path d="M4 10h2"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"/></svg>',
  task:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="6" height="6" rx="1"/><path d="m3 17 2 2 4-4"/><line x1="13" y1="6" x2="21" y2="6"/><line x1="13" y1="12" x2="21" y2="12"/><line x1="13" y1="18" x2="21" y2="18"/></svg>',
  code:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  codeblock:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 9-2 2 2 2"/><path d="m15 9 2 2-2 2"/></svg>',
  table:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="3" y1="15" x2="21" y2="15"/><line x1="9" y1="3" x2="9" y2="21"/><line x1="15" y1="3" x2="15" y2="21"/></svg>',
  image:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>',
  link:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',
  unlink:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.84 12.61a4 4 0 0 0-5.66-5.66l-1.41 1.41"/><path d="M5.16 11.39a4 4 0 0 0 5.66 5.66l1.41-1.41"/><line x1="3" y1="3" x2="21" y2="21"/></svg>',
  emoji:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>',
  footnote:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9 9h.01"/><path d="M15 9h.01"/><path d="M9 15c1 1 2 1.5 3 1.5s2-.5 3-1.5"/></svg>',
  hr:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><circle cx="6" cy="12" r="0.5" fill="currentColor"/><circle cx="18" cy="12" r="0.5" fill="currentColor"/></svg>',
  toc:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="4" cy="6" r="1"/><circle cx="4" cy="12" r="1"/><circle cx="4" cy="18" r="1"/></svg>',
  color:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/><circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/><circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/><circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/></svg>',
  bgColor:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z"/><path d="m5 2 5 5"/><path d="M2 13h15"/><path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z"/></svg>',
  preview:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>',
  copy:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
  paste:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/></svg>',
  clear:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  eraser:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>',
  undo:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>',
  redo:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></svg>',
  settings:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
  about:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
  help:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  close:       '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
  refresh:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>',
  warning:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
  battery:     '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="18" height="10" rx="2"/><line x1="22" y1="11" x2="22" y2="13"/><rect x="4" y="9" width="13" height="6" fill="currentColor"/></svg>',
  wifi:        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/><path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><line x1="12" y1="20" x2="12.01" y2="20"/></svg>',
  signal:      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20h.01"/><path d="M7 20v-4"/><path d="M12 20v-8"/><path d="M17 20V8"/><path d="M22 4v16"/></svg>',
  lightbulb:   '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6"/><path d="M10 22h4"/></svg>',
  circleInfo:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>',
};

// ==================== Storage ====================
const STORAGE_KEY = 'knb-mp-editor-state-v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.markdown != null) state.markdown = data.markdown;
    if (typeof data.darkPreview === 'boolean') state.darkPreview = data.darkPreview;
    // 主题可能已被下线（蓝靛/红火/金黄/小虫/钢人等），回退到默认主题
    if (data.theme && THEMES.some(t => t.id === data.theme)) state.theme = data.theme;
    if (data.fontWeight && ['light', 'regular', 'bold'].includes(data.fontWeight)) {
      state.fontWeight = data.fontWeight;
    }
    if (data.keymap && typeof data.keymap === 'object') state.keymap = data.keymap;
    if (typeof data.wrapInline === 'boolean') state.wrapInline = data.wrapInline;
  } catch (e) { /* ignore */ }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      markdown: state.markdown,
      theme: state.theme,
      codeTheme: state.codeTheme,
      fontWeight: state.fontWeight,
      darkPreview: state.darkPreview,
      keymap: state.keymap,
      wrapInline: state.wrapInline,
    }));
  } catch (e) { /* ignore */ }
}

function clearLocalStorage() {
  try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
}

// ==================== Toast ====================
function toast(msg, ms = 1800) {
  const t = $('#toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => t.classList.remove('show'), ms);
}

// ==================== Markdown rendering ====================
// Configure marked
marked.setOptions({ breaks: true, gfm: true });

// ==================== 自定义渲染器 ====================
// 签名说明（已实测 app/marked.js 确认，勿轻易改动）：
// 该包虽然文件头写着 v12.0.2，但 Renderer 实际仍是「位置参数」旧版契约，
// 不是 v5+ 的 token 对象契约。实测结果：
//   heading(text, level:String, raw)   level 是字符串，须 Number() 后比较
//   paragraph(text) / blockquote(text) / codespan(text) / tablerow(text)
//   list(bodyHTML, ordered:Boolean, start)      bodyHTML 已是渲染好的 <li> 串
//   listitem(text, task:Boolean, checked)       task 为真时 text 内已含 checkbox
//   code(code, lang, escaped) / image(href, title, text) / link(href, title, text)
//   table(headerHTML, bodyHTML) / tablecell(text, {header, align})
// 因此所有判断都按位置参数写；若日后换成 token 版 marked，需同步改回 token 读取。
const esc = (s) => String(s == null ? '' : s)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;');

// 复制到公众号后台时 <style> 会被丢弃，正文级样式必须写进行内 style。
// 下面各 renderer 的内联取值与 generatePreviewCSS() 里的同名声明一一对应，
// 两边保持一致时预览外观不变，复制到公众号后也能保留排版。
// 规范 3：正文不设 font-family；仅 code / pre 保留等宽字体（代码块必须等宽，
// 且与规范给的默认字体栈无关），quote-mark 等纯装饰元素已去掉字体声明。
const articleRenderer = new marked.Renderer();

let h2RenderCount = 0;
let h2RenderTotal = 0;

articleRenderer.heading = function (text, level) {
  const t = getThemeCSS();
  const lv = Number(level);
  if (lv === 1) {
    return `<h1 style="margin:1.6em 8px 1em;color:${t.h2Dark};font-size:22px;font-weight:300;text-align:center;line-height:1.5;border:0"><strong style="color:${t.h2Dark};font-weight:600;margin-right:8px">/</strong>${text}<strong style="color:${t.h2Dark};font-weight:600;margin-left:8px">/</strong></h1>\n`;
  }
  // h2 / h3 是纯装饰进度条，内部零文字（命中规范 1.3 排除场景「元素内部不含文字」）。
  //
  // 【为什么不用固定 px 行高】—— 这里踩过两次坑：
  //   1) 最初写 font-size:0 + 空白占位 + line-height:9px，公众号按「有效字号」实测
  //      （它看不到 font-size:0），判定 9px < 15px，触发 2.3.2 行高重叠告警；
  //   2) 改成 font-size:1px 后仍不保险——若微信粘贴时丢弃极小字号、只保留 line-height，
  //      同样会退回「9px < 15px」再次触发告警。
  //
  // 【现在的写法三重保险】
  //   1) line-height:1 —— 无单位倍数，恒等于自身字号，无论字号被改成多少都满足 lh >= fs
  //   2) height + overflow:hidden —— 固定厚度，微信即使丢弃 font-size 色条也不会变高
  //   3) font-size:1px + br 元素 —— 常态下内容 1px，厚度由 height 决定
  // 另外不加 data-no-dark：规范 4.5.1 的跳过属性本身会被报 darkmode-whitelist 风险。
  // 渐变上方无文字，按 4.1.3 纯装饰渐变本就会被 Dark Mode 保留。
  if (lv === 2) {
    h2RenderCount++;
    const pct = h2RenderTotal > 0 ? Math.round((h2RenderCount / h2RenderTotal) * 100) : 100;
    return `<h2 style="margin:0 8px;padding:0;font-size:1px;line-height:1;height:9px;overflow:hidden;border-radius:10px;background:linear-gradient(to right,${t.h2Dark} ${pct}%,${t.h2Mid} ${pct}%);border:0;box-sizing:border-box"><br></h2><p class="h2-progress-title" style="margin:0.6em 8px 1em;color:${t.titleText};font-size:20px;font-weight:600;line-height:1.5"><strong style="color:${t.titleText};font-weight:600;">${text}</strong></p>\n`;
  }
  if (lv === 3) {
    return `<h3 style="margin:0 8px;padding:0;font-size:1px;line-height:1;height:5px;overflow:hidden;border-radius:10px;background:linear-gradient(to right,${t.h3Dark},${t.h3Mid});border:0;box-sizing:border-box"><br></h3><p class="h3-progress-title" style="margin:0.6em 8px 0.8em;color:${t.titleText};font-size:18px;font-weight:600;line-height:1.5"><strong style="color:${t.titleText};font-weight:600;">${text}</strong></p>\n`;
  }
  if (lv === 4) {
    return `<h4 style="margin:1.6em 8px 0.6em;color:${t.titleText};font-size:17px;font-weight:600;line-height:1.5;">${text}</h4>\n`;
  }
  // h5 / h6 原来直接输出裸标签（无任何内联样式），复制到公众号后字号与行高
  // 全靠平台默认值，是 2.3.2 的潜在雷区。这里一并写死，与 h4 保持同一套节奏。
  if (lv === 5) {
    return `<h5 style="margin:1.5em 8px 0.6em;color:${t.titleText};font-size:16px;font-weight:600;line-height:1.5;">${text}</h5>\n`;
  }
  if (lv === 6) {
    return `<h6 style="margin:1.4em 8px 0.6em;color:${t.muted};font-size:15px;font-weight:600;line-height:1.5;">${text}</h6>\n`;
  }
  return `<h${lv}>${text}</h${lv}>\n`;
};

articleRenderer.paragraph = function (text) {
  if (!text || !text.trim()) return '';
  const t = getThemeCSS();
  return `<p style="margin:1.2em 8px;padding:0;color:${t.bodyColor};font-size:15px;line-height:28px;letter-spacing:1px;text-align:justify;">${text}</p>\n`;
};

// 规范 1.3：line-height 不得小于 font-size（多行时会叠字）。
// 原来的 `line-height:0.8`（36px 字号）已改为 1，闭合引号的负边距同步补偿。
articleRenderer.blockquote = function (text) {
  const t = getThemeCSS();
  // 引用内段落改用紧凑边距。
  // marked 传入的 text 已经是渲染好的 HTML（内层 <p> 不会再走 paragraph renderer），
  // 所以只能做字符串替换；这里用宽松模式匹配整串 style，避免样式微调后就匹配不上。
  // 关键是给内层 p 补上 line-height:1.75 —— 否则它会继承 blockquote 的行高，
  // 微信一旦重置 blockquote 的行高，内层段落就跟着变小，触发 2.3.2 告警。
  const fixed = String(text).replace(
    /<p style="margin:1\.2em 8px;([^"]*)"/g,
    '<p style="margin:0.4em 0;font-size:15px;line-height:1.75;$1"',
  );
  return `<blockquote style="margin:1.4em 8px;padding:4px 14px;border-left:4px solid ${t.h2Dark};border-radius:0;background:transparent;color:${t.bodyColor};font-size:15px;line-height:1.75;letter-spacing:1px;text-align:justify;box-sizing:border-box;max-width:100%;">${fixed}</blockquote>\n`;
};

// 列表与列表项都显式写死 font-size 与 line-height：
// 公众号会用自己的默认值覆盖未声明的属性，行高一失控就会触发 2.3.2。
const LIST_BASE = 'margin:1em 8px;padding-left:2em;font-size:15px;line-height:1.75;';

articleRenderer.list = function (body, ordered, start) {
  const t = getThemeCSS();
  if (ordered) {
    const st = Number(start);
    const startAttr = Number.isFinite(st) && st !== 1 ? ` start="${st}"` : '';
    return `<ol${startAttr} style="${LIST_BASE}color:${t.h2Dark};list-style-type:decimal;">${body}</ol>\n`;
  }
  return `<ul style="${LIST_BASE}color:${t.h2Dark};list-style-type:disc;">${body}</ul>\n`;
};

articleRenderer.listitem = function (text) {
  // task 项的 checkbox 由 marked 内联在 text 里，这里只统一行内样式
  return `<li style="margin:0.4em 0;font-size:15px;line-height:1.75;">${text}</li>\n`;
};

articleRenderer.hr = function () {
  return `<hr style="margin:2em 8px;border:0;border-top:1px solid rgba(0,0,0,0.1);">\n`;
};

// 规范 1.8：<pre> 只承载代码块，正文不得使用；overflow-x:auto 使其可滚动，
// 因此不触发规范 1.5.2 的「固定高度裁剪文字」检测。
// 注意：marked 默认实现在内部做 HTML 转义，自定义覆盖后必须自己转义，
// 否则代码块里的 <div>、& 会被当成真实标签直接渲染。
articleRenderer.code = function (code, lang) {
  const first = String(lang || '').trim().split(/\s+/)[0];
  const cls = first ? ` class="language-${esc(first)}"` : '';
  // 【为什么改成自动折行】官方检测器对 <pre> 的判定是 scrollWidth > clientWidth：
  // 只要横向内容超出（哪怕写了 overflow-x:auto 能滚），就报 1.8「pre 内容不会自动换行」。
  // 因此代码必须真的换行：white-space:pre-wrap + overflow-wrap:anywhere，
  // 保留缩进与换行语义的同时让长行在窄屏折行，scrollWidth 恒等于 clientWidth。
  // 字号也从 90%（相对值，微信一重置就失控）改为固定 13px，视觉几乎无变化。
  return `<pre style="margin:1em 8px;padding:1em;background:#0d1117;color:#c9d1d9;border-radius:8px;overflow-x:auto;font-size:13px;line-height:1.6;box-sizing:border-box;"><code${cls} style="display:block;background:transparent;color:inherit;padding:0;border:0;border-radius:0;font-size:inherit;white-space:pre-wrap;overflow-wrap:anywhere;">${esc(code)}</code></pre>\n`;
};

// 规范 3：等宽字体仅用于代码，属于功能必需，不套用正文默认字体栈。
// 这里【不】缩字号：行内片段字体越小，其矩形 top 与正文的偏差越大，
// 会被公众号 2.3.2 的 top 聚类判成额外一行（见 SUP_STYLE 处的说明）。
// 等宽字体本身已经足够区分，无需再靠字号。
articleRenderer.codespan = function (text) {
  return `<code style="font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace;color:#d14;background:rgba(27,31,35,0.05);padding:2px 5px;border-radius:4px;">${text}</code>`;
};

// 表格同样写死字号与行高：<td>/<th> 属于 2.3.2 的受检标签，
// 原先只给了 em 相对字号、没给行高，一旦微信重置就会失控。
//
// 【宽度踩坑记录】table 的 width:auto 是「按内容收缩」而不是撑满父容器：
// 宽表格在 677px 屏下只占中间一段 → 视觉左对齐，而 375px 屏下被压到撑满 → 居中，
// 同一元素在不同屏幕出现两种居中状态 → 命中规范 1.4.1「居中布局不一致」。
// 正解：外层 section 负责左右缩进（块级，天然撑满、左右恒对称），
// 内部 table 用 width:100% 撑满 section，各屏幕下居中状态永远一致。
// 同时不设固定列宽（1.4.2：列宽总和过大会横向溢出），改用 word-break 让长内容折行。
articleRenderer.table = function (header, body) {
  return `<section class="table-wrap" style="margin:1.2em 8px;padding:0;font-size:14px;line-height:1.75;">\n<table style="width:100%;border-collapse:collapse;color:#3f3f3f;font-size:14px;line-height:1.75;box-sizing:border-box;">\n<thead>\n${header}</thead>\n<tbody>\n${body}</tbody>\n</table>\n</section>\n`;
};

articleRenderer.tablerow = function (content) {
  return `<tr>\n${content}</tr>\n`;
};

articleRenderer.tablecell = function (content, flags) {
  const isHeader = !!(flags && flags.header);
  const tag = isHeader ? 'th' : 'td';
  const bg = isHeader ? 'background:rgba(0,0,0,0.04);font-weight:600;' : '';
  // word-break：表格被限制在 100% 宽度内后，超长英文/链接要能断行，
  // 否则 min-content 撑破表格，反而命中 1.4.2「存在溢出问题」。
  return `<${tag} style="border:1px solid #dfdfdf;padding:0.4em 0.75em;font-size:14px;line-height:1.75;word-break:break-word;${bg}">${content}</${tag}>\n`;
};

articleRenderer.link = function (href, title, text) {
  if (href == null) return text;
  const titleAttr = title ? ` title="${esc(title)}"` : '';
  return `<a href="${esc(href)}"${titleAttr} style="color:#576b95;text-decoration:none;">${text}</a>`;
};

articleRenderer.strong = function (text) {
  return `<strong style="color:#1a1a1a;font-weight:600;">${text}</strong>`;
};

articleRenderer.em = function (text) {
  return `<em style="font-style:italic;">${text}</em>`;
};

articleRenderer.del = function (text) {
  const t = getThemeCSS();
  return `<del style="color:${t.muted};text-decoration:line-through;">${text}</del>`;
};

// 规范 1.4.3：图片务必带 data-w（原始像素宽度），否则检测只能等图片加载，
// 不同屏幕加载速度不同会产生误报。同时补 data-src（公众号后台按它取图）
// 与 data-ratio。支持在 Markdown 里写 `![alt](url "600x300")` 显式声明尺寸。
articleRenderer.image = function (href, title, text) {
  if (href == null) return text;
  const dim = /^\s*(\d+)\s*[x*×]\s*(\d+)\s*$/i.exec(title || '');
  const sizeAttr = dim
    ? ` data-w="${Number(dim[1])}" data-ratio="${(Number(dim[1]) / Number(dim[2])).toFixed(6)}"`
    : '';
  return `<img src="${esc(href)}" data-src="${esc(href)}" alt="${esc(text || '')}"${sizeAttr} style="margin:0.6em auto;border-radius:4px;width:100%;display:block;" />\n`;
};

// marked.use 只应注册一次：官方文档明确指出重复注册同一 renderer
// 会不断叠加扩展。原实现在每次 renderMarkdown 里调用。
marked.use({ renderer: articleRenderer });

const KNB_BLOCKS = {
  tip:    { cls: 'knb-tip' },
  info:   { cls: 'knb-info' },
  warning:{ cls: 'knb-warning' },
  note:   { cls: 'knb-note' },
  danger: { cls: 'knb-danger' },
  say:    { cls: 'knb-say' },
  intro:  { cls: 'knb-intro' },
  highlight:{ cls: 'knb-highlight' },
};

function getThemeTokens() {
  const t = THEMES.find(t => t.id === state.theme) || THEMES[0];
  return {
    h2Dark: t.h2Dark, h2Mid: t.h2Mid, h3Dark: t.h3Dark, h3Mid: t.h3Mid,
    introText: t.introText, titleText: TITLE_DEFAULT,
  };
}

function preprocessBlocks(md) {
  // Standard containers
  return md.replace(/^:::\s*(\w+)\s*\n([\s\S]*?)^:::\s*$/gm, (_, type, body) => {
    const meta = KNB_BLOCKS[type];
    const cmeta = CONTAINER_META[type];
    if (!meta && !cmeta) return _;
    const bodyTrim = body.trim();
    const t = getThemeCSS();
    const borderRgba = t.h2Mid.startsWith('rgb') ? hexToRgba(hexFromRgb(t.h2Mid), 0.5) : hexToRgba(t.h2Mid, 0.5);
    // Split body into paragraphs and wrap each
    //
    // 【重要】这里不能用 line-height:inherit。
    // 容器 section 本身若没声明 line-height，微信会给它一个自己的默认值
    // （常见是 1 或 normal），子 p 的 inherit 就会取到这个未知值，
    // 一旦它小于字号，公众号校验就报「行高小于字体大小」（2.3.2）。
    // 实测该问题会命中所有 ::: 容器内的段落。
    // 因此容器与其内部 p 全部写死 font-size:15px + line-height:1.75（无单位倍数，
    // 恒 >= 字号），彻底不依赖任何继承来的默认值。
    const P_STYLE = 'margin:0.4em 0;padding:0;font-size:15px;line-height:1.75;color:rgb(43,43,43);letter-spacing:1px;';
    //
    // 容器内部现在也走一遍 marked：以前 body 被当成纯文本直接塞进 <p>，
    // 结果容器里写 **加粗**、列表、代码块全都不生效（只有字面量）。
    // 这里对每一段调用 marked.parse 复用同一套 renderer，再把段落的外边距
    // 换成容器专用值（renderer 给的是正文的 1.2em 8px，在容器里太松）。
    const paras = bodyTrim.split(/\n\s*\n/).filter(Boolean).map((p) => {
      const rendered = marked.parse(p).trim();
      return rendered.replace(
        /<p style="margin:1\.2em 8px;([^"]*)"/g,
        `<p style="${P_STYLE}text-align:justify;"`,
      );
    }).join('\n');
    if (type === 'intro') {
      return `\n<section class="container-intro" style="margin:1.6em 8px 2em;padding:0.9em 0.4em;border: 1px solid #eee;border-radius:0;background:transparent;font-size:15px;line-height:1.75;color:${t.introText};letter-spacing:0.04em;">\n${paras}\n</section>\n`;
    }
    if (type === 'highlight') {
      return `\n<section class="container-highlight" style="margin:1.6em 8px;padding:0;text-align:center;border:0;border-radius:0;background:transparent;font-size:15px;line-height:1.75;color:${t.h2Dark};"><span class="quote-mark quote-mark-left" style="display:block;color:${t.h2Dark};font-size:36px;font-weight:700;line-height:1;text-align:left;padding-left:8px;">\u201c</span>${paras}<span class="quote-mark quote-mark-right" style="display:block;color:${t.h2Dark};font-size:36px;font-weight:700;line-height:1;text-align:right;padding-right:8px;">\u201d</span></section>\n`;
    }
    const icon = cmeta ? cmeta.icon : '';
    const label = cmeta ? cmeta.label : type;
    return `\n<section class="container container-${type}" style="display:block;width:auto;box-sizing:border-box;margin:1.4em 8px;padding:0.6em 14px;background:transparent;border:1px solid ${borderRgba};border-radius:10px;color:rgb(43,43,43);font-size:15px;line-height:1.75;letter-spacing:1px;text-align:justify;"><p class="container-label" style="padding:0;font-size:15px;line-height:1.75;margin:0 0 0.4em 0;font-weight:600;color:${t.h2Dark};letter-spacing:1.5px;text-align:left;">${icon} ${label}</p>\n${paras}\n</section>\n`;
  });
}

// Reading time
function estimateReadingTime(text) {
  const chars = text.length;
  const minutes = Math.max(1, Math.round(chars / 400));
  return { chars, minutes };
}

// Footnote handling
// 脚注标记：刻意与正文【同字号、同基线】，不做上标、不缩小字号。
//
// 这是公众号 2.3.2 检测一个非常隐蔽的误报陷阱，值得写清楚：
// 检测器根本不读代码里声明的 line-height，而是把文章塞进隐藏沙箱真实排版，
// 用 Range API 取出每个行内片段的矩形，再按 top 坐标聚类
// （top 相差 < 2px 视为同一行）得到「真实行数」，最后算
//     平均行距 = 内容总高度 ÷ 真实行数
// 低于阈值 0.95 × 字号 就报「行高小于字体大小，且存在多行文本」。
//
// 一旦脚注标记用了 vertical-align:super 或 font-size:75%，
// 上标片段的矩形 top 会比正文高出好几像素（远超 2px 阈值）→
// 被判成「多出来的一行」→ 行数虚高 → 平均行距被稀释 →
// 本来完全正常的段落被误报为叠字。实测：只有一个脚注标记的单行段落
// 会被算成 2 行，平均行距直接腰斩到阈值以下。
//
// 因此这里让标记与正文同字号、同基线，保证并入同一个 top 聚类；
// 视觉区分改由颜色 + 字重承担。
const SUP_STYLE = 'font-size:inherit;line-height:inherit;vertical-align:baseline;font-weight:600;';
const FOOTNOTE_ANCHOR_STYLE = 'margin-left:6px;text-decoration:none;';

function processFootnotes(md) {
  const defs = {};
  const defRegex = /^\[\^([\w-]+)\]:\s+(.+)$/gm;
  md = md.replace(defRegex, (_, id, text) => { defs[id] = text.trim(); return ''; });
  md = md.replace(/\[\^([\w-]+)\](?!:)/g, (_, id) => {
    if (!defs[id]) return `<sup style="${SUP_STYLE}">[${id}]</sup>`;
    return `<sup id="fnref-${id}" style="${SUP_STYLE}"><a href="#fn-${id}" style="text-decoration:none;">[${id}]</a></sup>`;
  });
  if (Object.keys(defs).length) {
    let fnHtml = '<section class="footnotes" style="margin-top:2em;padding-top:1em;border-top:1px solid #e4e4e7;font-size:13px;line-height:1.75;"><ol style="margin:0;padding-left:1.4em;font-size:13px;line-height:1.75;">';
    for (const id of Object.keys(defs)) {
      fnHtml += `<li id="fn-${id}" style="margin:0.4em 0;font-size:13px;line-height:1.75;">${defs[id]} <a href="#fnref-${id}" style="${FOOTNOTE_ANCHOR_STYLE}">↩</a></li>`;
    }
    fnHtml += '</ol></section>';
    md += '\n\n' + fnHtml;
  }
  return md;
}

// 工具栏「上标 / 下标」写入的是 Pandoc 风格标记 ^文本^ / ~文本~。
// marked 不认识这两种语法：^文本^ 会被原样输出，而单 ~ 还会被 GFM 当成删除线
// （实测 H~2~O 渲染成了 <del>2</del>），所以必须在 marked 解析之前先转成 <sup>/<sub>。
//
// 三条硬约束：
//   1. 字号必须 inherit。行内片段字号一旦小于正文，它的矩形与正文的偏差就会变大，
//      影响行框聚类的稳定性（同 SUP_STYLE 处的说明）。
//   2. 只能在非代码区域替换。围栏代码块、行内代码里的 ^ 和 ~ 必须原样保留。
//   3. 必须在 processFootnotes 之后调用。脚注标记 [^1] 同样含 ^，
//      先转脚注可避免 [^1][^2] 被上标正则误吃成 <sup>1][</sup>2]。
// 【为什么要这一步】CommonMark 规定：紧跟在段落行后面的 `---` 是 setext 二级标题的
// 下划线，而不是分隔线。中文写作习惯段与段之间不留空行，于是文末那行 `---` 会把
// 上一整段（连同软换行）吞成一个巨型标题，用户真正想要的那条分割线反而没了。
// 这里给「整行只有 3 个及以上连字符」的行前面补一个空行，让它按 CommonMark 解析成 <hr>。
// 不损失表达能力：二级标题直接写 `##`，一级标题仍可用 `===`。
// 跳过：① 栅栏代码块内部；② 表格分隔行（形如 |---|---|，含竖杠，正则不匹配）；
// ③ 上一行像 YAML 键值对时不动（避免破坏 front matter 的收尾横线）。
function normalizeThematicBreak(md) {
  const lines = String(md == null ? '' : md).split('\n');
  const out = [];
  let inFence = false;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*(?:```|~~~)/.test(line)) { inFence = !inFence; out.push(line); continue; }
    if (inFence) { out.push(line); continue; }
    if (i > 0 && /^ {0,3}-{3,}[ \t]*$/.test(line)) {
      const prev = out[out.length - 1];
      const looksLikeYaml = /^ {0,3}[\w.$-]+:(?:\s|$)/.test(prev);
      if (prev.trim() !== '' && !looksLikeYaml) out.push('');
    }
    out.push(line);
  }
  return out.join('\n');
}

function processInlineMarks(md) {
  const supStyle = 'font-size:inherit;line-height:inherit;vertical-align:super;';
  const subStyle = 'font-size:inherit;line-height:inherit;vertical-align:sub;';
  const stash = [];
  const keep = (s) => { stash.push(s); return '@@KNBKEEP' + (stash.length - 1) + '@@'; };
  let inFence = false;
  return md.split('\n').map((line) => {
    if (/^\s*(?:```|~~~)/.test(line)) { inFence = !inFence; return line; }
    if (inFence) return line;
    // 行内代码先藏起来，处理完再原样放回
    let s = line.replace(/`[^`\n]+`/g, keep);
    s = s.replace(/\^([^\^\n]+)\^/g, '<sup style="' + supStyle + '">$1</sup>');
    // 只有单个 ~ 才是下标；~~删除线~~ 靠前后断言排除（相邻又是 ~ 则不匹配）
    s = s.replace(/(^|[^~])~([^~\n]+)~(?!~)/g,
      (_, pre, txt) => pre + '<sub style="' + subStyle + '">' + txt + '</sub>');
    return s.replace(/@@KNBKEEP(\d+)@@/g, (_, i) => stash[Number(i)]);
  }).join('\n');
}

// TOC — generate article-map matching original yuan.html
function buildTOC(md) {
  const lines = md.split('\n');
  const headings = [];
  let inBlock = false;
  for (const line of lines) {
    if (line.startsWith('```')) { inBlock = !inBlock; continue; }
    if (inBlock) continue;
    const m = line.match(/^(#{1,4})\s+(.+)$/);
    if (m) headings.push({ level: m[1].length, text: m[2].trim() });
  }
  const h2s = headings.filter(h => h.level === 2);
  if (h2s.length < 2) return { html: '', headings };
  const t = getThemeCSS();
  const total = h2s.length;
  let html = `<section class="article-map" style="margin:0 8px 1.6em;"><p style="margin:0 0 10px;padding:0;color:${t.h2Dark};font-size:12px;line-height:1.4;letter-spacing:2px;text-align:left;font-weight:600;">全文导航</p>`;
  h2s.forEach((h, i) => {
    const num = i + 1;
    const pct = Math.round(((num) / total) * 100);
    // 进度条是纯装饰（内部只有 <br>，无文字），按规范 4.1.3 渐变可被保留，
    // 无需 data-no-dark（加了反而会触发 darkmode-whitelist 提示）。
    html += `<section class="article-map__item" style="margin:10px 0;"><p style="margin:0;padding:0;font-size:13px;color:rgb(43,43,43);line-height:1.6;letter-spacing:0;text-align:left;"><span style="color:${t.h2Dark};font-weight:600;margin-right:8px;letter-spacing:0;">${num}</span>${h.text}</p><section class="article-map__bar-wrap" style="margin-top:4px;height:3px;background:rgba(0,0,0,0.06);border-radius:2px;overflow:hidden;"><section class="article-map__bar" style="width:${pct}%;height:3px;background:linear-gradient(to right,${t.h2Dark},${t.h2Mid});border-radius:2px;"><br></section></section></section>`;
  });
  html += '</section>';
  return { html, headings };
}

let lastTOC = { html: '', headings: [] };

// ==================== 导出包裹：消除「行内混排」 ====================
// 微信线上对 2.3.2 的判定有个实测规律：段落里**同时存在行内元素和裸文本**才会被提示，
// 整段被单一行内标签包住的（<p><strong>整句</strong></p>）从不被提示。
// 于是把块级元素下的**直接裸文本节点**各自套一个不带任何样式的 <span>，
// 段落就只剩元素子节点、没有裸文本，理论上不再命中；视觉零变化，样式全保留。
// 只处理确实存在行内子元素的块（纯文本段落包了没意义，还白增体积）。
// 只包裹文本节点，不会把嵌套的 <ul>/<ol>/<table> 塞进 span——那会产生非法嵌套。
function wrapBareTextNodes(html) {
  if (!html) return html;
  const doc = new DOMParser().parseFromString('<div id="__w">' + html + '</div>', 'text/html');
  const root = doc.getElementById('__w');
  if (!root) return html;
  const blocks = root.querySelectorAll('p,li,h1,h2,h3,h4,h5,h6,td,th,blockquote');
  blocks.forEach((b) => {
    const kids = Array.from(b.childNodes);
    const hasInline = kids.some(n => n.nodeType === 1 && !/^(br|img|ul|ol|table|pre|div|section|p)$/i.test(n.tagName || ''));
    if (!hasInline) return;
    const texts = kids.filter(n => n.nodeType === 3 && visibleText(n.nodeValue));
    if (!texts.length) return;
    for (const t of texts) {
      const span = doc.createElement('span');
      b.replaceChild(span, t);
      span.appendChild(t);
    }
  });
  return root.innerHTML;
}

function renderMarkdown(md) {
  let processed = normalizeThematicBreak(preprocessBlocks(md));
  // Count h2 headings for progress bar
  const lines = processed.split('\n');
  h2RenderTotal = 0;
  let inBlock = false;
  for (const line of lines) {
    if (line.startsWith('```')) { inBlock = !inBlock; continue; }
    if (inBlock) continue;
    if (/^##\s+(.+)$/.test(line) && !line.startsWith('###')) h2RenderTotal++;
  }
  h2RenderCount = 0;
  // renderer 已在模块加载时通过 marked.use 注册一次（见 articleRenderer 处的说明）
  const toc = buildTOC(processed);
  lastTOC = toc;
  let withToc = processed;
  // Find [TOC] in intro blocks and replace with article-map
  if (toc.html) {
    withToc = withToc.replace(/\[TOC\]/g, '\n' + toc.html + '\n');
  } else {
    withToc = withToc.replace(/\[TOC\]\s*/g, '');
  }
  withToc = processFootnotes(withToc);
  // 脚注先转、上下标后转：脚注标记里也有 ^，顺序反了会被上标正则误吃
  withToc = processInlineMarks(withToc);
  let html = marked.parse(withToc);
  if (state.wrapInline) html = wrapBareTextNodes(html);
  return html;
}

function getThemeCSS(themeId) {
  const id = themeId || state.theme;
  const t = THEMES.find(t => t.id === id) || THEMES[0];
  return {
    h2Dark: t.h2Dark,
    h2Mid: t.h2Mid,
    h3Dark: t.h3Dark,
    h3Mid: t.h3Mid,
    introText: t.introText,
    titleText: TITLE_DEFAULT,
    accent: t.colors[1],
    bodyColor: BODY_COLOR,
    muted: MUTED,
    markBg: MARK_BG,
  };
}

function hexToRgba(hex, alpha) {
  const m = hex.match(/^#([0-9a-fA-F]{3,8})$/);
  if (!m) return hex;
  let h = m[1];
  if (h.length === 3) h = h.split('').map(c => c + c).join('');
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// ==================== Editor ====================
class Editor {
  constructor(container) {
    this._listeners = {};
    this.container = container;
    this.textarea = el('textarea', {
      class: 'editor-textarea',
      spellcheck: 'false',
      placeholder: '在左侧编辑器输入 Markdown，右侧会实时显示手机预览……',
    });
    this.textarea.style.cssText = `
      width: 100%;
      height: 100%;
      border: 0;
      outline: 0;
      resize: none;
      padding: 16px 20px;
      font-family: var(--font-mono);
      font-size: 13.5px;
      line-height: 1.7;
      background: transparent;
      color: #1a1a1a;
      white-space: pre-wrap;
      word-break: break-word;
      overflow-wrap: break-word;
      overflow: auto;
    `;
    container.appendChild(this.textarea);
    this.textarea.addEventListener('input', () => { this._changeSource = 'native'; this.handleInput(); });
    this.textarea.addEventListener('scroll', () => this.syncOverlay());
    this.textarea.addEventListener('keyup', () => this.syncOverlay());
    this.textarea.addEventListener('click', () => this.syncOverlay());
    this.textarea.addEventListener('select', () => this.syncOverlay());

    // 撤销/前进历史栈
    this._history = [];
    this._historyIndex = -1;
    this._historyLock = false;
    this._changeSource = 'programmatic';
  }

  setValue(v) {
    this.textarea.value = v;
  }

  getValue() {
    return this.textarea.value;
  }

  getSelection() {
    return { start: this.textarea.selectionStart, end: this.textarea.selectionEnd };
  }

  setSelection(start, end) {
    this.textarea.focus();
    this.textarea.setSelectionRange(start, end);
  }

  insertText(text, selStart, selEnd) {
    const value = this.textarea.value;
    const before = value.substring(0, selStart);
    const after = value.substring(selEnd);
    const newValue = before + text + after;
    const savedScrollTop = this.textarea.scrollTop;
    this.textarea.value = newValue;
    const newPos = selStart + text.length;
    this.setSelection(newPos, newPos);
    // 保持视图不跳动：恢复编辑框滚动位置
    this.textarea.scrollTop = savedScrollTop;
    this._changeSource = 'programmatic';
    this.handleInput();
  }

  replaceSelection(text) {
    const { start, end } = this.getSelection();
    this.insertText(text, start, end);
  }

  wrapSelection(prefix, suffix = prefix, placeholderText = '') {
    const savedScrollTop = this.textarea.scrollTop;
    const { start, end } = this.getSelection();
    const value = this.textarea.value;
    // toggle：选区（或光标）外侧已经是同一对标记时，再按一次应【取消】格式，
    // 而不是再包一层。以前没有这个判断，反复点「上标」会得到 x^^2^^ 这种嵌套垃圾。
    const outsideIsWrapped = (s, e) => s - prefix.length >= 0
      && value.substring(s - prefix.length, s) === prefix
      && value.substring(e, e + suffix.length) === suffix;
    if (start === end) {
      // 光标停在已包裹的标记里：直接把标记拆掉
      if (outsideIsWrapped(start, end)) {
        const inner = value.substring(start, end);
        this.insertText(inner, start - prefix.length, end + suffix.length);
        this.setSelection(start - prefix.length, start - prefix.length + (end - start));
      } else {
        // No selection: insert placeholder
        const text = prefix + placeholderText + suffix;
        this.insertText(text, start, end);
        this.setSelection(start + prefix.length, start + prefix.length + placeholderText.length);
      }
    } else if (outsideIsWrapped(start, end)) {
      const selected = value.substring(start, end);
      this.insertText(selected, start - prefix.length, end + suffix.length);
      this.setSelection(start - prefix.length, start - prefix.length + selected.length);
    } else {
      const selected = value.substring(start, end);
      const text = prefix + selected + suffix;
      this.insertText(text, start, end);
      this.setSelection(start + prefix.length, end + prefix.length);
    }
    // 设置颜色/背景色后保持原视觉焦点，避免编辑框自动滚动到末尾
    this.textarea.scrollTop = savedScrollTop;
    requestAnimationFrame(() => { this.textarea.scrollTop = savedScrollTop; });
  }

  prefixLines(prefix) {
    const { start, end } = this.getSelection();
    const value = this.textarea.value;
    // Find line boundaries
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', end);
    const realEnd = lineEnd === -1 ? value.length : lineEnd;
    const lines = value.substring(lineStart, realEnd).split('\n');
    const newLines = lines.map(l => prefix + l).join('\n');
    this.insertText(newLines, lineStart, realEnd);
  }

  // 把选中的每一行设置为指定级别的标题。
  // 关键点：先剥掉原有的 ATX 标记（## / ### ...）再套新的，
  // 否则「## 标题」按 H1 只会变成「### 标题」（前缀叠加）而不是「# 标题」。
  setHeadingLevel(level) {
    const { start, end } = this.getSelection();
    const value = this.textarea.value;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', end);
    const realEnd = lineEnd === -1 ? value.length : lineEnd;
    const sel = value.substring(lineStart, realEnd);
    const marker = '#'.repeat(level) + ' ';
    // 匹配行首 ATX 标题：可选缩进 + 1~6 个 # + 可选尾随空格
    // （可选空格是为了兼容「#无空格」这种不规范的写法）
    const atx = /^(\s*)(#{1,6})(?:\s+|$)/;
    const newLines = sel.split('\n').map((line) => {
      // 空行保持原样，避免把段落之间的空行也塞进标题标记
      if (!line.trim()) return line;
      const m = atx.exec(line);
      // 有原标题：替换标记；无原标题：直接在行首插入
      if (!m) return marker + line;
      return m[1] + marker + line.slice(m[0].length);
    }).join('\n');
    this.insertText(newLines, lineStart, realEnd);
    // 光标定位到首行标题文字的末尾
    const firstLineLen = newLines.split('\n')[0].length;
    const pos = lineStart + firstLineLen;
    this.setSelection(pos, pos);
  }

  handleInput() {
    state.markdown = this.getValue();
    saveState();
    this._listeners.input?.(state.markdown);
    this._recordHistory();
  }

  syncOverlay() {
    // No overlay, but could be used for line numbers later
  }

  focus() { this.textarea.focus(); }

  on(event, cb) { this._listeners[event] = cb; }

  // 记录一次历史状态（自动合并连续输入，保留被撤销的分支）
  _recordHistory() {
    if (this._historyLock) return;
    const value = this.getValue();
    const sel = { start: this.textarea.selectionStart, end: this.textarea.selectionEnd };
    const idx = this._historyIndex;
    const top = idx >= 0 ? this._history[idx] : null;
    const source = this._changeSource || 'programmatic';
    if (top) {
      if (top.value === value) { top.sel = sel; return; }
      // 连续的原生键盘输入合并为同一步，避免每个字符都产生一条记录
      if (source === 'native' && top.source === 'native') {
        top.value = value;
        top.sel = sel;
        return;
      }
    }
    this._history = this._history.slice(0, idx + 1);
    this._history.push({ value, sel, source });
    if (this._history.length > 300) this._history.shift();
    this._historyIndex = this._history.length - 1;
  }

  // 供外部（初始化、清空）显式写入一条历史
  recordHistory() {
    this._changeSource = 'programmatic';
    this._recordHistory();
  }

  undo() {
    if (this._historyIndex <= 0) return;
    this._historyIndex--;
    this._applyHistory(this._history[this._historyIndex]);
  }

  redo() {
    if (this._historyIndex >= this._history.length - 1) return;
    this._historyIndex++;
    this._applyHistory(this._history[this._historyIndex]);
  }

  // 注意：参数不能叫 state，否则会遮蔽全局 state，导致撤销后保存的是旧内容
  _applyHistory(snapshot) {
    this._historyLock = true;
    this.textarea.value = snapshot.value;
    this._changeSource = 'programmatic';
    this.setSelection(snapshot.sel.start, snapshot.sel.end);
    state.markdown = this.getValue();
    saveState();
    this._listeners.input?.(snapshot.value);
    this._historyLock = false;
  }
}

let editor = null;
let settingsPane = null;
let settingsBackdrop = null;

// ==================== Toolbar actions ====================
const ACTIONS = {
  bold: () => editor.wrapSelection('**', '**', '加粗文本'),
  italic: () => editor.wrapSelection('*', '*', '斜体文本'),
  strike: () => editor.wrapSelection('~~', '~~', '删除线'),
  underline: () => editor.wrapSelection('<u>', '</u>', '下划线'),
  superscript: () => editor.wrapSelection('^', '^', '上标'),
  subscript: () => editor.wrapSelection('~', '~', '下标'),
  h1: () => editor.setHeadingLevel(1),
  h2: () => editor.setHeadingLevel(2),
  h3: () => editor.setHeadingLevel(3),
  h4: () => editor.setHeadingLevel(4),
  quote: () => editor.prefixLines('> '),
  ul: () => editor.prefixLines('- '),
  ol: () => {
    const { start, end } = editor.getSelection();
    const value = editor.getValue();
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = value.indexOf('\n', end);
    const realEnd = lineEnd === -1 ? value.length : lineEnd;
    const lines = value.substring(lineStart, realEnd).split('\n');
    const newLines = lines.map((l, i) => `${i + 1}. ${l}`).join('\n');
    editor.insertText(newLines, lineStart, realEnd);
  },
  task: () => editor.prefixLines('- [ ] '),
  code: () => editor.wrapSelection('`', '`', 'code'),
  codeblock: () => {
    const { start, end } = editor.getSelection();
    if (start === end) {
      editor.insertText('\n```\n\n```\n', start, end);
      const newPos = start + 5;
      editor.setSelection(newPos, newPos);
    } else {
      editor.wrapSelection('\n```\n', '\n```\n', 'code');
    }
  },
  table: () => {
    const tpl = '\n| 列1 | 列2 | 列3 |\n| --- | --- | --- |\n| 内容 | 内容 | 内容 |\n| 内容 | 内容 | 内容 |\n';
    const { start, end } = editor.getSelection();
    editor.insertText(tpl, start, end);
  },
  image: () => {
    const url = prompt('图片地址：', 'https://');
    if (!url) return;
    const alt = prompt('图片描述（可选）：', '') || 'image';
    const { start, end } = editor.getSelection();
    editor.insertText(`![${alt}](${url})`, start, end);
  },
  link: () => {
    const { start, end } = editor.getSelection();
    const value = editor.getValue();
    const selected = value.substring(start, end);
    // Check if already a link
    const m = selected.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) {
      openLinkDialog(m[1], m[2], start, end);
    } else {
      openLinkDialog(selected, '', start, end);
    }
  },
  unlink: () => {
    const { start, end } = editor.getSelection();
    if (start === end) { toast('请先选中要取消的链接'); return; }
    const value = editor.getValue();
    const selected = value.substring(start, end);
    // Try several unlink patterns
    let replaced = null;
    // [text](url)
    let m = selected.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (m) { replaced = m[1]; }
    if (replaced == null) {
      // <a href="url">text</a>
      m = selected.match(/^<a [^>]*href="([^"]+)"[^>]*>([^<]+)<\/a>$/i);
      if (m) { replaced = m[2]; }
    }
    if (replaced != null) {
      editor.insertText(replaced, start, end);
      toast('已取消链接');
    } else {
      toast('选中的不是链接');
    }
  },
  emoji: () => {
    const list = ['😀','😁','😂','🤣','😊','😍','😘','😎','🤔','😴','😅','😭','🥳','🤩','🥺','😏','😬','🙄','😪','😱','🤯','🥶','🤬','🤢','🤮','🤧','😷','🤒','🤕','😇','🤠','🥸','🤡','💀','👻','👽','🤖','💩','😺','😸','😹','😻','😼','😽','🙀','😿','😾'];
    showEmojiPicker(list);
  },
  footnote: () => {
    editor.insertText('[^1]\n\n[^1]: 脚注内容。', editor.getSelection().end, editor.getSelection().end);
  },
  hr: () => {
    const { start, end } = editor.getSelection();
    editor.insertText('\n\n---\n\n', start, end);
  },
  toc: () => {
    const { start, end } = editor.getSelection();
    editor.insertText('\n<!-- toc -->\n', start, end);
  },
  color: (color) => {
    editor.wrapSelection(`<span style="color:${color}">`, '</span>', '彩色文字');
  },
  bg: (hex) => {
    const alpha = BG_ALPHA;
    editor.wrapSelection(
      `<span style="margin: 0 2px;background: ${hex}${alpha};border-left: 2px solid ${hex};border-radius: 2px;padding: 2px;">`,
      '</span>',
      '高亮文字',
    );
  },
  block: (type) => {
    const meta = CONTAINER_META[type];
    if (!meta) return;
    const tpl = `\n\n::: ${type}\n${meta.placeholder}。\n:::\n\n`;
    const { start, end } = editor.getSelection();
    editor.insertText(tpl, start, end);
  },
};

// ==================== 快捷键：命令注册表 ====================
const IS_MAC = /Mac|iPhone|iPad|iPod/i.test(navigator.platform || navigator.userAgent || '');

const SHORTCUT_GROUPS = [
  { id: 'heading', label: '标题' },
  { id: 'inline',  label: '行内格式' },
  { id: 'block',   label: '段落与列表' },
  { id: 'insert',  label: '插入' },
  { id: 'special', label: '专有格式' },
  { id: 'edit',    label: '编辑与文件' },
];

// 每一项对应工具栏 / 顶栏上的一个功能，run 即点击按钮的行为
const SHORTCUT_COMMANDS = [
  { id: 'h1',          group: 'heading', label: '一级标题',    run: () => ACTIONS.h1() },
  { id: 'h2',          group: 'heading', label: '二级标题',    run: () => ACTIONS.h2() },
  { id: 'h3',          group: 'heading', label: '三级标题',    run: () => ACTIONS.h3() },
  { id: 'h4',          group: 'heading', label: '四级标题',    run: () => ACTIONS.h4() },

  { id: 'bold',        group: 'inline',  label: '加粗',        run: () => ACTIONS.bold() },
  { id: 'italic',      group: 'inline',  label: '斜体',        run: () => ACTIONS.italic() },
  { id: 'underline',   group: 'inline',  label: '下划线',      run: () => ACTIONS.underline() },
  { id: 'strike',      group: 'inline',  label: '删除线',      run: () => ACTIONS.strike() },
  { id: 'code',        group: 'inline',  label: '行内代码',    run: () => ACTIONS.code() },
  { id: 'superscript', group: 'inline',  label: '上标',        run: () => ACTIONS.superscript() },
  { id: 'subscript',   group: 'inline',  label: '下标',        run: () => ACTIONS.subscript() },

  { id: 'quote',       group: 'block',   label: '大段引用',    run: () => ACTIONS.quote() },
  { id: 'ul',          group: 'block',   label: '无序列表',    run: () => ACTIONS.ul() },
  { id: 'ol',          group: 'block',   label: '有序列表',    run: () => ACTIONS.ol() },
  { id: 'task',        group: 'block',   label: '任务列表',    run: () => ACTIONS.task() },
  { id: 'codeblock',   group: 'block',   label: '代码块',      run: () => ACTIONS.codeblock() },
  { id: 'hr',          group: 'block',   label: '分割线',      run: () => ACTIONS.hr() },

  { id: 'link',        group: 'insert',  label: '链接',        run: () => ACTIONS.link() },
  { id: 'unlink',      group: 'insert',  label: '取消链接',    run: () => ACTIONS.unlink() },
  { id: 'image',       group: 'insert',  label: '图片',        run: () => ACTIONS.image() },
  { id: 'table',       group: 'insert',  label: '表格',        run: () => ACTIONS.table() },
  { id: 'emoji',       group: 'insert',  label: '表情',        run: () => ACTIONS.emoji() },
  { id: 'footnote',    group: 'insert',  label: '脚注',        run: () => ACTIONS.footnote() },
  { id: 'toc',         group: 'insert',  label: '全文导航',    run: () => ACTIONS.toc() },

  { id: 'intro',       group: 'special', label: '摘要段',      run: () => ACTIONS.block('intro') },
  { id: 'highlight',   group: 'special', label: '金句',        run: () => ACTIONS.block('highlight') },
  { id: 'tip',         group: 'special', label: '提示块',      run: () => ACTIONS.block('tip') },
  { id: 'info',        group: 'special', label: '说明块',      run: () => ACTIONS.block('info') },
  { id: 'note',        group: 'special', label: '笔记块',      run: () => ACTIONS.block('note') },
  { id: 'warning',     group: 'special', label: '警告块',      run: () => ACTIONS.block('warning') },
  { id: 'danger',      group: 'special', label: '危险块',      run: () => ACTIONS.block('danger') },
  { id: 'say',         group: 'special', label: '独白',        run: () => ACTIONS.block('say') },

  { id: 'undo',        group: 'edit',    label: '撤销',            run: () => editor.undo() },
  { id: 'redo',        group: 'edit',    label: '前进',            run: () => editor.redo() },
  { id: 'clearFormat', group: 'edit',    label: '清除选中格式',    run: () => clearSelectionFormatting() },
  { id: 'clearAll',    group: 'edit',    label: '清空文档',        run: () => clearAll() },
  { id: 'copyHtml',    group: 'edit',    label: '复制排版结果',    run: () => copyMarkdown() },
  { id: 'pasteMd',     group: 'edit',    label: '粘贴 Markdown',   run: () => pasteMarkdown() },
  { id: 'save',        group: 'edit',    label: '保存到浏览器本地', run: () => { saveState(); toast('已保存'); } },
  { id: 'settings',    group: 'edit',    label: '打开/收起设置',   run: () => toggleSettings() },
  { id: 'help',        group: 'edit',    label: '使用说明',        run: () => openDialog('help') },
];

const SHORTCUT_COMMAND_MAP = SHORTCUT_COMMANDS.reduce((acc, c) => { acc[c.id] = c; return acc; }, {});

// 'Mod' 在 macOS 上代表 ⌘，其他平台代表 Ctrl
const DEFAULT_KEYMAP = {
  h1: 'Mod+Alt+1', h2: 'Mod+Alt+2', h3: 'Mod+Alt+3', h4: 'Mod+Alt+4',

  bold: 'Mod+B', italic: 'Mod+I', underline: 'Mod+U', strike: 'Mod+Shift+X',
  code: 'Mod+E', superscript: 'Mod+Alt+Up', subscript: 'Mod+Alt+Down',

  quote: 'Mod+Shift+.', ul: 'Mod+Shift+U', ol: 'Mod+Shift+L', task: 'Mod+Shift+Y',
  codeblock: 'Mod+Alt+E', hr: 'Mod+Alt+-',

  link: 'Mod+K', unlink: 'Mod+Shift+K', image: 'Mod+Alt+G', table: 'Mod+Alt+R',
  emoji: 'Mod+Alt+O', footnote: 'Mod+Alt+N', toc: 'Mod+Alt+K',

  intro: 'Mod+Shift+1', highlight: 'Mod+Shift+2', tip: 'Mod+Shift+3',
  info: 'Mod+Shift+4', note: 'Mod+Shift+5', warning: 'Mod+Shift+6',
  danger: 'Mod+Shift+7', say: 'Mod+Shift+8',

  undo: 'Mod+Z', redo: 'Mod+Shift+Z', clearFormat: 'Mod+\\', clearAll: null,
  copyHtml: 'Mod+Shift+E', pasteMd: 'Mod+Alt+V', save: 'Mod+S',
  settings: 'Mod+,', help: 'Mod+/',
};

// 浏览器 / 操作系统已占用，页面内无法可靠拦截，直接拒绝绑定
const RESERVED_COMBOS = new Set([
  'Mod+A', 'Mod+C', 'Mod+V', 'Mod+X', 'Mod+F', 'Mod+P', 'Mod+W', 'Mod+Q',
  'Mod+T', 'Mod+N', 'Mod+R', 'Mod+O', 'Mod+D', 'Mod+H', 'Mod+M', 'Mod+L',
  'Mod+G', 'Mod+Space', 'Mod+Tab',
  'Mod+Shift+W', 'Mod+Shift+N', 'Mod+Shift+T', 'Mod+Shift+Q', 'Mod+Shift+R',
  'Mod+Shift+C', 'Mod+Shift+I', 'Mod+Shift+J', 'Mod+Shift+B', 'Mod+Shift+O',
  'Mod+Shift+M', 'Mod+Shift+G', 'Mod+Shift+H', 'Mod+Shift+A', 'Mod+Shift+D',
  'Mod+Shift+V', 'Mod+Shift+P',
  'Mod+Alt+I', 'Mod+Alt+J', 'Mod+Alt+U', 'Mod+Alt+C', 'Mod+Alt+B',
  'Mod+Alt+H', 'Mod+Alt+D', 'Mod+Alt+Left', 'Mod+Alt+Right', 'Mod+Alt+Space',
]);

// ==================== 快捷键：组合键归一化 ====================
// 用 e.code（物理按键）而非 e.key，避免 Alt 组合在 macOS 上变成特殊字符、
// 以及不同键盘布局下的取值差异
const KEYCODE_ALIAS = {
  Minus: '-', Equal: '=', BracketLeft: '[', BracketRight: ']', Backslash: '\\',
  Semicolon: ';', Quote: "'", Comma: ',', Period: '.', Slash: '/', Backquote: '`',
  Space: 'Space', Enter: 'Enter', NumpadEnter: 'Enter', Tab: 'Tab',
  Backspace: 'Backspace', Delete: 'Delete', Escape: 'Escape',
  ArrowUp: 'Up', ArrowDown: 'Down', ArrowLeft: 'Left', ArrowRight: 'Right',
  Home: 'Home', End: 'End', PageUp: 'PageUp', PageDown: 'PageDown',
  // 小键盘运算符不用字面量 '+'，否则组合键字符串里的 '+' 分隔符会产生歧义
  NumpadAdd: 'NumAdd', NumpadSubtract: 'NumSub', NumpadMultiply: 'NumMul', NumpadDivide: 'NumDiv',
};

function normalizeKeyCode(e) {
  const code = e.code || '';
  if (/^Key[A-Z]$/.test(code)) return code.slice(3);
  if (/^Digit[0-9]$/.test(code)) return code.slice(5);
  if (/^Numpad[0-9]$/.test(code)) return 'Num' + code.slice(6);
  if (/^F([1-9]|1[0-9]|2[0-4])$/.test(code)) return code;
  if (KEYCODE_ALIAS[code]) return KEYCODE_ALIAS[code];
  // 没有 code 的环境（少数旧浏览器）退回 e.key
  if (!code && e.key && e.key.length === 1) return e.key.toUpperCase();
  return null; // 纯修饰键或不支持的按键
}

// 归一化顺序固定为 Mod → Ctrl/Meta → Alt → Shift → 按键，便于直接字符串比较
function comboFromEvent(e) {
  const key = normalizeKeyCode(e);
  if (!key) return null;
  const parts = [];
  const mod = IS_MAC ? e.metaKey : e.ctrlKey;
  const secondary = IS_MAC ? e.ctrlKey : e.metaKey;
  if (mod) parts.push('Mod');
  if (secondary) parts.push(IS_MAC ? 'Ctrl' : 'Meta');
  if (e.altKey) parts.push('Alt');
  if (e.shiftKey) parts.push('Shift');
  parts.push(key);
  return parts.join('+');
}

const COMBO_SYMBOL = {
  Mod: IS_MAC ? '⌘' : 'Ctrl', Ctrl: IS_MAC ? '⌃' : 'Ctrl',
  Meta: IS_MAC ? '⌘' : 'Win', Alt: IS_MAC ? '⌥' : 'Alt', Shift: IS_MAC ? '⇧' : 'Shift',
  Up: '↑', Down: '↓', Left: '←', Right: '→',
  Enter: '↩', Tab: '⇥', Backspace: '⌫', Delete: '⌦', Escape: 'Esc', Space: '空格',
};

function formatCombo(combo) {
  if (!combo) return '';
  const parts = combo.split('+');
  // 末位可能是 '+' 自身（如 Num+），拆分后需要合并回来
  const out = parts.map(p => COMBO_SYMBOL[p] || p);
  return out.join(IS_MAC ? '' : '+');
}

// ==================== 快捷键：keymap 读写与校验 ====================
function getKeymap() {
  if (!state.keymap) state.keymap = {};
  return state.keymap;
}

function normalizeKeymap(raw) {
  const map = {};
  for (const cmd of SHORTCUT_COMMANDS) {
    const has = raw && Object.prototype.hasOwnProperty.call(raw, cmd.id);
    const v = has ? raw[cmd.id] : DEFAULT_KEYMAP[cmd.id];
    map[cmd.id] = v || null;
  }
  return map;
}

function findCommandIdByCombo(combo, exceptId) {
  const map = getKeymap();
  for (const cmd of SHORTCUT_COMMANDS) {
    if (cmd.id === exceptId) continue;
    if (map[cmd.id] && map[cmd.id] === combo) return cmd.id;
  }
  return null;
}

// 校验一个组合键是否可用作快捷键
function validateCombo(combo) {
  if (!combo) return { ok: false, reason: '没有识别到有效按键。' };
  const parts = combo.split('+');
  const key = parts[parts.length - 1];
  const hasMod = parts.includes('Mod') || parts.includes('Ctrl') || parts.includes('Meta') || parts.includes('Alt');
  const isFn = /^F([1-9]|1[0-9]|2[0-4])$/.test(key);
  if (!hasMod && !isFn) {
    return {
      ok: false,
      reason: `需要至少包含 ${IS_MAC ? '⌘ / ⌃ / ⌥' : 'Ctrl / Alt'} 修饰键（或 F1–F12），否则会打断正常打字。`,
    };
  }
  if (RESERVED_COMBOS.has(combo)) {
    return { ok: false, reason: `${formatCombo(combo)} 已被浏览器或系统占用，网页里拦不住。` };
  }
  return { ok: true };
}

function setShortcut(commandId, combo) {
  const map = getKeymap();
  map[commandId] = combo || null;
  saveState();
}

function resetKeymapToDefault() {
  state.keymap = normalizeKeymap(null);
  saveState();
}

// ==================== 快捷键：全局调度 ====================
let kmRecordingCtx = null; // 录制中时挂起全局调度，避免录制键被当成命令执行

// 焦点在编辑区 textarea 时要能触发；焦点在其他输入控件（链接对话框、搜索框等）时不触发
function shortcutTargetAllowed() {
  const active = document.activeElement;
  if (!active) return true;
  if (editor && active === editor.textarea) return true;
  const tag = active.tagName;
  if (tag === 'INPUT' || tag === 'SELECT' || tag === 'TEXTAREA') return false;
  if (active.isContentEditable) return false;
  return true;
}

function handleShortcutKeydown(e) {
  if (kmRecordingCtx) return;
  if (e.defaultPrevented) return;
  if (e.isComposing) return;   // 输入法组字过程中不抢按键
  if (!editor) return;
  if (!shortcutTargetAllowed()) return;
  const combo = comboFromEvent(e);
  if (!combo) return;
  const map = getKeymap();
  let hit = null;
  for (const cmd of SHORTCUT_COMMANDS) {
    if (map[cmd.id] === combo) { hit = cmd; break; }
  }
  if (!hit) return;
  e.preventDefault();
  try {
    hit.run();
  } catch (err) {
    console.error('[shortcut]', hit.id, err);
  }
}

// ==================== Mascot（吉祥物）====================
// 复刻自 mp.knb.im 的 Mascot 组件：
//  - 渐变圆形身体 + 白色眼球（带高光）+ 腮红椭圆 + 微笑路径
//  - 眼睛追踪鼠标：瞳孔沿「眼心 → 鼠标」方向偏移，距离 240px 内线性归一，上限 5.5
//  - 身体倾斜：按鼠标相对整体中心的水平偏移写入 CSS 变量 --tilt，距离 400px 内归一，上限 5deg
//  - 点击反应：翻滚一圈 + 眯眼笑 + 八向星点迸发，800ms 后复原
const MASCOT_EYE_L = { cx: 38, cy: 43, r: 11 };
const MASCOT_EYE_R = { cx: 62, cy: 43, r: 11 };
const MASCOT_PUPIL_R = 5;        // 瞳孔半径
const MASCOT_MAX_PUPIL = 5.5;    // 瞳孔最大偏移（用户单位）
const MASCOT_MAX_TILT = 5;       // 身体最大倾斜角度
const MASCOT_PUPIL_RANGE = 240;  // 瞳孔偏移归一距离（px）
const MASCOT_TILT_RANGE = 400;   // 倾斜归一距离（px）
const MASCOT_REACT_MS = 800;

function mascotHappyEye(eye) {
  return `M ${eye.cx - 6} ${eye.cy + 1} Q ${eye.cx} ${eye.cy - 6} ${eye.cx + 6} ${eye.cy + 1}`;
}

function createMascot() {
  const wrap = el('span', { class: 'mascot-wrap' });
  wrap.innerHTML = `
<svg class="mascot" viewBox="0 0 100 100" role="img" aria-label="吉祥物，点一下试试">
  <defs>
    <linearGradient id="mascotBody" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="var(--primary)" />
      <stop offset="100%" stop-color="var(--brand-mid)" />
    </linearGradient>
  </defs>
  <g class="mascot-body">
    <circle cx="50" cy="50" r="40" fill="url(#mascotBody)" />
    <ellipse cx="26" cy="62" rx="5" ry="3" fill="rgba(255, 200, 220, 0.55)" />
    <ellipse cx="74" cy="62" rx="5" ry="3" fill="rgba(255, 200, 220, 0.55)" />
    <g class="m-idle">
      <circle cx="${MASCOT_EYE_L.cx}" cy="${MASCOT_EYE_L.cy}" r="${MASCOT_EYE_L.r}" fill="#ffffff" />
      <circle cx="${MASCOT_EYE_R.cx}" cy="${MASCOT_EYE_R.cy}" r="${MASCOT_EYE_R.r}" fill="#ffffff" />
      <circle class="pupil-l" cx="${MASCOT_EYE_L.cx}" cy="${MASCOT_EYE_L.cy}" r="${MASCOT_PUPIL_R}" fill="#1e1b4b" />
      <circle class="pupil-r" cx="${MASCOT_EYE_R.cx}" cy="${MASCOT_EYE_R.cy}" r="${MASCOT_PUPIL_R}" fill="#1e1b4b" />
      <circle class="hl-l" cx="${MASCOT_EYE_L.cx + 1.6}" cy="${MASCOT_EYE_L.cy - 1.4}" r="1.4" fill="#ffffff" />
      <circle class="hl-r" cx="${MASCOT_EYE_R.cx + 1.6}" cy="${MASCOT_EYE_R.cy - 1.4}" r="1.4" fill="#ffffff" />
    </g>
    <g class="m-happy">
      <path d="${mascotHappyEye(MASCOT_EYE_L)}" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" fill="none" />
      <path d="${mascotHappyEye(MASCOT_EYE_R)}" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" fill="none" />
    </g>
    <path class="m-idle" d="M 38 66 Q 50 76 62 66" stroke="#ffffff" stroke-width="2.6" stroke-linecap="round" fill="none" />
    <path class="m-happy" d="M 34 64 Q 50 80 66 64" stroke="#ffffff" stroke-width="2.8" stroke-linecap="round" fill="#ffffff" />
  </g>
  <g class="sparkles">
    ${Array.from({ length: 8 }, (_, i) =>
      `<circle class="sparkle sparkle-${i}" cx="50" cy="50" r="2" fill="#fde68a" />`).join('\n    ')}
  </g>
</svg>`.trim();

  const svg = wrap.querySelector('svg');
  const bodyG = wrap.querySelector('.mascot-body');
  const pupilL = wrap.querySelector('.pupil-l');
  const pupilR = wrap.querySelector('.pupil-r');
  const hlL = wrap.querySelector('.hl-l');
  const hlR = wrap.querySelector('.hl-r');

  let mouseX = 0;
  let mouseY = 0;
  let tracking = false;   // 鼠标尚未移动前保持正视，避免初始盯着左上角
  let rafPending = false;
  let pendingX = 0;
  let pendingY = 0;
  let reactTimer = null;

  // 计算单只眼睛的瞳孔偏移：方向取「眼心 → 鼠标」，幅度按距离归一
  function eyeOffset(eye) {
    if (!tracking) return { dx: 0, dy: 0 };
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0) return { dx: 0, dy: 0 };
    const ex = rect.left + (eye.cx / 100) * rect.width;
    const ey = rect.top + (eye.cy / 100) * rect.height;
    const dx = mouseX - ex;
    const dy = mouseY - ey;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) return { dx: 0, dy: 0 };
    const amp = Math.min(1, dist / MASCOT_PUPIL_RANGE) * MASCOT_MAX_PUPIL;
    return { dx: (dx / dist) * amp, dy: (dy / dist) * amp };
  }

  // 身体倾斜角度：只取水平分量，鼠标在右侧则右倾
  function bodyTilt() {
    if (!tracking) return 0;
    const rect = svg.getBoundingClientRect();
    if (rect.width === 0) return 0;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = mouseX - cx;
    const dy = mouseY - cy;
    const dist = Math.hypot(dx, dy);
    if (dist === 0) return 0;
    const amp = Math.min(1, dist / MASCOT_TILT_RANGE);
    return (dx / dist) * amp * MASCOT_MAX_TILT;
  }

  function render() {
    const oL = eyeOffset(MASCOT_EYE_L);
    const oR = eyeOffset(MASCOT_EYE_R);
    const lx = MASCOT_EYE_L.cx + oL.dx;
    const ly = MASCOT_EYE_L.cy + oL.dy;
    const rx = MASCOT_EYE_R.cx + oR.dx;
    const ry = MASCOT_EYE_R.cy + oR.dy;
    pupilL.setAttribute('cx', lx.toFixed(2));
    pupilL.setAttribute('cy', ly.toFixed(2));
    pupilR.setAttribute('cx', rx.toFixed(2));
    pupilR.setAttribute('cy', ry.toFixed(2));
    // 高光跟着瞳孔走，固定偏右上
    hlL.setAttribute('cx', (lx + 1.6).toFixed(2));
    hlL.setAttribute('cy', (ly - 1.4).toFixed(2));
    hlR.setAttribute('cx', (rx + 1.6).toFixed(2));
    hlR.setAttribute('cy', (ry - 1.4).toFixed(2));
    bodyG.style.setProperty('--tilt', `${bodyTilt().toFixed(2)}deg`);
  }

  // rAF 节流：mousemove 只记录坐标，每帧最多渲染一次
  function onMouseMove(e) {
    pendingX = e.clientX;
    pendingY = e.clientY;
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(() => {
      rafPending = false;
      mouseX = pendingX;
      mouseY = pendingY;
      tracking = true;
      render();
    });
  }

  // 点击：先移除 class 再于下一帧加回，强制重启 CSS 动画
  function react() {
    svg.classList.remove('is-reacting');
    requestAnimationFrame(() => {
      svg.classList.add('is-reacting');
      if (reactTimer) clearTimeout(reactTimer);
      reactTimer = setTimeout(() => svg.classList.remove('is-reacting'), MASCOT_REACT_MS);
    });
  }

  window.addEventListener('mousemove', onMouseMove, { passive: true });
  svg.addEventListener('click', react);
  render();

  return wrap;
}

// ==================== Render app ====================
function buildApp() {
  const root = $('#app');
  root.innerHTML = '';

  const shell = el('div', { class: 'app-shell' });

  // ========== Top bar ==========
  const topbar = el('header', { class: 'topbar' },
    el('div', { class: 'brand' },
      createMascot(),
      el('span', {}, '公众号排版器'),
    ),
    el('div', { class: 'topbar-actions' },
      btn('help', '使用说明', () => openDialog('help'), 'ghost'),
      btn('about', '关于', () => openDialog('about'), 'ghost'),
      btn('settings', '设置', toggleSettings, 'ghost'),
      btn('circleInfo', '自检', () => openDialog('check'), 'ghost'),
      btn('copy', '复制', copyMarkdown, 'outline'),
      btn('paste', '粘贴', pasteMarkdown, 'outline'),
    ),
  );
  shell.appendChild(topbar);

  // ========== 移动端视图切换（编辑 / 预览），桌面端由 CSS 隐藏 ==========
  const mobileNav = el('nav', { class: 'mobile-nav' });
  const setView = (v) => {
    shell.dataset.view = v;
    mobileNav.querySelectorAll('.seg').forEach(s => s.classList.toggle('active', s.dataset.view === v));
  };
  const seg = (v, label) => {
    const b = el('button', { class: 'seg', 'data-view': v }, label);
    b.classList.toggle('active', v === 'edit');
    b.addEventListener('click', () => setView(v));
    return b;
  };
  mobileNav.appendChild(seg('edit', '编辑'));
  mobileNav.appendChild(seg('preview', '预览'));
  shell.dataset.view = 'edit';
  shell.appendChild(mobileNav);

  // ========== Main ==========
  const main = el('div', { class: 'main' });

  // Editor pane
  const editorPane = el('section', { class: 'editor-pane' });

  // Toolbar at top of editor (below app top bar, above editing area)
  const toolbar = buildToolbar();
  editorPane.appendChild(toolbar);

  // Editor wrap (fills middle)
  const editorWrap = el('div', { class: 'editor-wrap' });
  const editorHost = el('div', { class: 'editor-host' });
  editorWrap.appendChild(editorHost);
  editorPane.appendChild(editorWrap);

  // Status bar at very bottom
  const status = el('div', { class: 'editor-status' },
    el('div', {}, el('span', { class: 'status-dot' }), '已自动存到浏览器本地'),
    el('div', { class: 'spacer' }),
    el('div', { id: 'status-chars' }, '0 字'),
    el('div', { id: 'status-lines' }, '0 行'),
    el('div', { id: 'status-readtime' }, '速读仅需 1 分钟'),
  );
  editorPane.appendChild(status);

  main.appendChild(editorPane);

  // Preview pane
  const previewPane = el('section', { class: 'preview-pane' });
  const phone = el('div', { class: 'phone-frame' },
    el('div', { class: 'phone-screen' },
      el('div', { class: 'phone-notch' }),
      el('div', { class: 'phone-status' },
        el('span', { id: 'phone-time' }, '9:41'),
        el('div', { class: 'right' },
          el('span', { html: ICON.signal }),
          el('span', { html: ICON.wifi }),
          el('span', { html: ICON.battery }),
        ),
      ),
      el('div', { class: 'preview-scroll', id: 'preview-scroll' },
        el('div', { class: 'preview-content', id: 'preview-content' }),
      ),
    ),
  );
  previewPane.appendChild(phone);
  main.appendChild(previewPane);

  // Settings pane (right column, auto-expanded on startup)
  settingsPane = el('aside', { class: 'settings-pane' });
  const settingsHeader = el('div', { class: 'settings-header' },
    el('span', {}, '设置'),
    el('button', { class: 'settings-toggle', title: '收起/展开设置', html: ICON.chevronDown, onclick: toggleSettings }),
  );
  settingsPane.appendChild(settingsHeader);
  const settingsScroll = el('div', { class: 'settings-scroll' });
  buildSettingsBody(settingsScroll);
  settingsPane.appendChild(settingsScroll);
  main.appendChild(settingsPane);

  shell.appendChild(main);

  // Toast
  shell.appendChild(el('div', { class: 'toast', id: 'toast' }));

  // Dialogs root
  shell.appendChild(el('div', { id: 'dialog-root' }));

  // 移动端设置抽屉的遮罩层（仅 ≤900px 经 CSS 显示；点击关闭）
  settingsBackdrop = el('div', { class: 'settings-backdrop' });
  settingsBackdrop.addEventListener('click', toggleSettings);
  shell.appendChild(settingsBackdrop);

  // 移动端默认收起设置，避免一进入就被底部抽屉遮挡
  if (window.matchMedia('(max-width: 900px)').matches) settingsPane.classList.add('collapsed');

  // 从小屏放大到桌面时，恢复设置栏（桌面端是内联列，不应停留在收起态）
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && settingsPane.classList.contains('collapsed')) {
      settingsPane.classList.remove('collapsed');
      if (settingsBackdrop) settingsBackdrop.classList.remove('show');
    }
  });

  root.appendChild(shell);

  // Build editor
  editor = new Editor(editorHost);
  editor.setValue(state.markdown);
  editor.recordHistory();
  editor.on('input', (md) => {
    renderPreview(md);
    updateStatus();
  });

  // Initial render
  renderPreview(state.markdown);
  updateStatus();
  updatePhoneTime();
  setInterval(updatePhoneTime, 60000);
}

function toggleSettings() {
  if (!settingsPane) return;
  const willOpen = settingsPane.classList.contains('collapsed');
  settingsPane.classList.toggle('collapsed');
  if (settingsBackdrop) settingsBackdrop.classList.toggle('show', willOpen);
}

function btn(icon, label, onClick, variant = 'ghost') {
  const b = el('button', { class: `btn ${variant}` });
  if (icon) b.innerHTML = ICON[icon] || '';
  if (label) {
    const s = el('span', {}, label);
    b.appendChild(s);
  }
  b.addEventListener('click', onClick);
  return b;
}

function tbBtn(icon, label, action, attrs = {}) {
  const b = el('button', { class: 'tb-btn' + (attrs.iconOnly ? ' icon-only' : ''), title: label });
  if (icon) b.innerHTML = ICON[icon] || '';
  if (label && !attrs.iconOnly) {
    const s = el('span', {}, label);
    b.appendChild(s);
  }
  if (action) b.addEventListener('click', action);
  return b;
}

function buildToolbar() {
  const container = el('div', { class: 'toolbar' });

  // ===== Row 1: 基础格式 =====
  const row1 = el('div', { class: 'tb-row' });
  row1.appendChild(tbBadge('基础格式', 'outline'));
  row1.appendChild(tbBtn('h1', '一级标题', ACTIONS.h1, { iconOnly: true }));
  row1.appendChild(tbBtn('h2', '二级标题', ACTIONS.h2, { iconOnly: true }));
  row1.appendChild(tbBtn('h3', '三级标题', ACTIONS.h3, { iconOnly: true }));
  row1.appendChild(tbBtn('h4', '四级标题', ACTIONS.h4, { iconOnly: true }));
  row1.appendChild(separator());
  row1.appendChild(tbBtn('bold', '加粗', ACTIONS.bold, { iconOnly: true }));
  row1.appendChild(tbBtn('code', '行内代码', ACTIONS.code, { iconOnly: true }));
  row1.appendChild(separator());
  row1.appendChild(tbBtn('ul', '无序列表', ACTIONS.ul, { iconOnly: true }));
  row1.appendChild(tbBtn('ol', '有序列表', ACTIONS.ol, { iconOnly: true }));
  row1.appendChild(separator());
  row1.appendChild(tbBtn('link', '链接', ACTIONS.link, { iconOnly: true }));
  row1.appendChild(tbBtn('image', '图片', ACTIONS.image, { iconOnly: true }));
  row1.appendChild(separator());
  row1.appendChild(tbBtn('quote', '大段引用', ACTIONS.quote, { iconOnly: true }));
  row1.appendChild(separator());
  // 编辑类按钮（撤销 / 前进 / 清除 / 清空）并入本行右侧
  row1.appendChild(tbBtn('undo', '撤销', () => editor.undo(), { iconOnly: true }));
  row1.appendChild(tbBtn('redo', '前进', () => editor.redo(), { iconOnly: true }));
  row1.appendChild(separator());
  row1.appendChild(tbBtn('eraser', '清除', clearSelectionFormatting, { iconOnly: true }));
  row1.appendChild(tbBtn('clear', '清空', clearAll, { iconOnly: true }));
  row1.appendChild(el('div', { style: 'flex:1' }));
  container.appendChild(row1);

  // ===== Row 1.5: 颜色（平铺直点） =====
  container.appendChild(buildFlatColorRow('颜色', 'outline', FONT_COLORS, (c) => ACTIONS.color(c)));
  // ===== Row 1.5: 背景色（平铺直点） =====
  container.appendChild(buildFlatColorRow('背景色', 'filled', BG_COLORS, (c) => ACTIONS.bg(c)));

  return container;
}

function tbBadge(text, variant = 'outline') {
  return el('div', { class: 'tb-badge tb-badge-' + variant }, text);
}

function separator() {
  return el('div', { class: 'tb-sep' });
}

// ==================== Flat color rows (直接平铺，点击即设置) ====================
// 字色全部取自「设置 → 主题」保留主题的色板，保证工具栏与主题同一套色系。
// 已删除不搭的旧色（正红 #dc2626、靛蓝 #6366f1、品红 #d946ef 等）。
const FONT_COLORS = [
  '#1a1a1a', // 正文黑（中性）
  '#4e4e4e', // 老爷 · 深灰
  '#999',    // 黑白 · 浅灰
  '#299480', // 绿蓝 · 主色
  '#047857', // 森林绿
  '#50630d', // 洛基 · 橄榄绿
  '#37c412', // 毒藤 · 亮绿
  '#0369A1', // 海洋蓝
  '#68b4e4', // 老爷 · 蓝
  '#6D28D9', // 暮光紫
  '#917cb7', // 小丑 · 紫
  '#C2410C', // 暖阳橙
  '#9F1239', // 玫瑰红
];

function buildFlatColorRow(badge, badgeVariant, items, action) {
  const row = el('div', { class: 'tb-row' });
  row.appendChild(tbBadge(badge, badgeVariant));
  for (const it of items) {
    const hex = typeof it === 'string' ? it : it.hex;
    const tip = typeof it === 'string' ? hex : `${it.name} ${it.hex}`;
    const sw = el('button', { class: 'tb-color-swatch', style: `background:${hex};`, title: tip });
    sw.addEventListener('click', (e) => { e.stopPropagation(); action(hex); });
    row.appendChild(sw);
  }
  return row;
}

// ==================== Background color dropdown ====================
// 背景色：底色带透明度（hex + alpha 后缀），左侧描边用实色，参照粉色样式
// 同样对齐保留的主题色系，每种色相取「深 / 浅」两档，已删掉不搭的橙黄等
const BG_ALPHA = '1f';
const BG_COLORS = [
  { group: 1, name: '绿蓝', hex: '#299480' },
  { group: 1, name: '森林绿', hex: '#047857' },
  { group: 1, name: '洛基绿', hex: '#50630d' },
  { group: 1, name: '海洋蓝', hex: '#0369A1' },
  { group: 1, name: '老爷蓝', hex: '#4e4e4e' },
  { group: 1, name: '暮光紫', hex: '#6D28D9' },
  { group: 1, name: '玫瑰红', hex: '#9F1239' },
  { group: 2, name: '浅绿', hex: '#7DD3FC' },
  { group: 2, name: '浅蓝绿', hex: '#6EE7B7' },
  { group: 2, name: '浅紫', hex: '#C4B5FD' },
  { group: 2, name: '浅粉', hex: '#FDA4AF' },
];

// 背景色已改为平铺行（见 buildFlatColorRow + BG_COLORS），不再使用下拉

// ==================== Link dialog ====================
function openLinkDialog(text, url, selStart, selEnd) {
  closeDialog();
  const root = $('#dialog-root');
  const backdrop = el('div', { class: 'dialog-backdrop open' });
  const dlg = el('div', { class: 'dialog', style: 'max-width: 480px;' });

  const header = el('div', { class: 'dialog-header' },
    el('h3', {}, '插入链接'),
    el('button', { class: 'close', html: ICON.close, onclick: closeDialog }),
  );
  dlg.appendChild(header);

  const body = el('div', { class: 'dialog-body' });

  // Link text
  const textField = el('div', { class: 'field' },
    el('label', {}, '链接文字'),
    el('input', { class: 'input', id: 'link-text', value: text || '', placeholder: '显示的文字' }),
  );
  body.appendChild(textField);

  // URL
  const urlField = el('div', { class: 'field' },
    el('label', {}, '链接地址'),
    el('input', { class: 'input', id: 'link-url', value: url || '', placeholder: 'https://...' }),
    el('div', { class: 'hint' }, '公众号内链保留可点击；外站链接会自动处理。'),
  );
  body.appendChild(urlField);

  dlg.appendChild(body);

  const footer = el('div', { class: 'dialog-footer', style: 'justify-content: space-between;' });
  // Unlink button (only if there's existing link) - left side
  if (url) {
    const unlinkBtn = el('button', { class: 'btn outline', style: 'color:#dc2626;border-color:#fecaca;', onclick: () => {
      // Remove the link
      const finalText = $('#link-text').value.trim() || text;
      editor.insertText(finalText, selStart, selEnd);
      toast('已取消链接');
      closeDialog();
    }}, '取消链接');
    footer.appendChild(unlinkBtn);
  } else {
    // Spacer to push buttons right
    footer.appendChild(el('div'));
  }
  // Right side buttons
  const right = el('div', { style: 'display:flex;gap:8px;' });
  right.appendChild(el('button', { class: 'btn ghost', onclick: closeDialog }, '取消'));
  const confirmBtn = el('button', { class: 'btn primary', onclick: () => {
    const t = $('#link-text').value.trim();
    const u = $('#link-url').value.trim();
    if (!t) { toast('请输入链接文字'); return; }
    if (!u) { toast('请输入链接地址'); return; }
    if (!/^(https?:|mailto:|\/|#)/i.test(u)) {
      if (!confirm('该链接不是以 http:// 开头，可能无法在公众号中正确打开。仍要继续吗？')) return;
    }
    editor.insertText(`[${t}](${u})`, selStart, selEnd);
    closeDialog();
  }}, '确定');
  right.appendChild(confirmBtn);
  footer.appendChild(right);
  dlg.appendChild(footer);

  backdrop.appendChild(dlg);
  root.appendChild(backdrop);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeDialog(); });

  // Focus
  setTimeout(() => {
    if (!text) $('#link-text').focus();
    else $('#link-url').focus();
  }, 50);

  // Enter key
  dlg.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') confirmBtn.click();
    if (e.key === 'Escape') closeDialog();
  });
}

// ==================== Emoji picker ====================
function showEmojiPicker(list) {
  closeDialog();
  const root = $('#dialog-root');
  root.innerHTML = '';
  const backdrop = el('div', { class: 'dialog-backdrop open' });
  const dlg = el('div', { class: 'dialog', style: 'max-width: 460px;' });
  const header = el('div', { class: 'dialog-header' },
    el('h3', {}, '插入 Emoji'),
    el('button', { class: 'close', html: ICON.close, onclick: closeDialog }),
  );
  const body = el('div', { class: 'dialog-body' });
  const grid = el('div', { style: 'display:grid;grid-template-columns:repeat(10,1fr);gap:4px;' });
  for (const e of list) {
    const cell = el('button', { class: 'tb-btn', style: 'font-size:18px;height:36px;' }, e);
    cell.addEventListener('click', () => {
      const { start, end } = editor.getSelection();
      editor.insertText(e, start, end);
      closeDialog();
    });
    grid.appendChild(cell);
  }
  body.appendChild(grid);
  dlg.appendChild(header);
  dlg.appendChild(body);
  backdrop.appendChild(dlg);
  root.appendChild(backdrop);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeDialog(); });
}

// ==================== Preview rendering ====================
function renderPreview(md) {
  const html = renderMarkdown(md);
  const content = $('#preview-content');
  content.innerHTML = '<div class="wechat-markdown-root">' + html + '</div>';
  applyPreviewTheme();
  // Add reading meta
  const { chars, minutes } = estimateReadingTime(md);
  const meta = el('div', { class: 'knb-meta' }, `全文约 ${chars} 字 · 阅读需要 ${minutes} 分钟`);
  content.appendChild(meta);
}

function generatePreviewCSS() {
  const t = getThemeCSS();
  // 字重档位：细=300 / 常规=400 / 粗=700
  const fontWeight = state.fontWeight === 'bold' ? '700' : (state.fontWeight === 'light' ? '300' : '400');
  return `
.wechat-markdown-root { font-size: 15px; line-height: 28px; color: ${t.bodyColor}; text-align: left; font-weight: ${fontWeight}; letter-spacing: 1px; }
.wechat-markdown-root p { margin: 1.2em 8px; color: ${t.bodyColor}; font-size: 15px; line-height: 28px; letter-spacing: 1px; text-align: justify; }
.wechat-markdown-root h1 { margin: 1.6em 8px 1em; color: ${t.h2Dark}; font-size: 22px; font-weight: 300; text-align: center; line-height: 1.5; border: 0; }
.wechat-markdown-root h1 strong { color: ${t.h2Dark}; font-weight: 600; }
.wechat-markdown-root h2 { margin: 0 8px; padding: 0; font-size: 1px; line-height: 1; height: 9px; overflow: hidden; border-radius: 10px; background: transparent; border: 0; box-sizing: border-box; }
.wechat-markdown-root .h2-progress-title { margin: 0.6em 8px 1em; color: ${t.titleText}; font-size: 20px; font-weight: 600; line-height: 1.5; }
.wechat-markdown-root .h2-progress-title strong { color: ${t.titleText}; font-weight: 600; }
.wechat-markdown-root h3 { margin: 0 8px; padding: 0; font-size: 1px; line-height: 1; height: 5px; overflow: hidden; border-radius: 10px; background: transparent; border: 0; box-sizing: border-box; }
.wechat-markdown-root .h3-progress-title { margin: 0.6em 8px 0.8em; color: ${t.titleText}; font-size: 18px; font-weight: 600; line-height: 1.5; }
.wechat-markdown-root .h3-progress-title strong { color: ${t.titleText}; font-weight: 600; }
.wechat-markdown-root h4 { margin: 1.6em 8px 0.6em; color: ${t.titleText}; font-size: 17px; font-weight: 600; line-height: 1.5; }
.wechat-markdown-root h5 { margin: 1.5em 8px 0.6em; color: ${t.titleText}; font-size: 16px; font-weight: 600; line-height: 1.5; }
.wechat-markdown-root h6 { margin: 1.4em 8px 0.6em; color: ${t.muted}; font-size: 15px; font-weight: 600; line-height: 1.5; }
.wechat-markdown-root strong { color: #1a1a1a; font-weight: 600; }
.wechat-markdown-root em { font-style: italic; }
.wechat-markdown-root s, .wechat-markdown-root del { color: ${t.muted}; text-decoration: line-through; }
.wechat-markdown-root mark { background: ${t.markBg}; color: ${t.h2Dark}; padding: 0 0.3em; border-radius: 2px; }
.wechat-markdown-root ins { text-decoration: underline; text-decoration-color: ${t.h2Dark}; text-underline-offset: 2px; }
/* 与内联样式保持一致：上标/下标都不缩字号（缩字号会让行内矩形与正文偏差变大）。
   具体 vertical-align 由内联决定：脚注标记是 baseline，用户插入的上下标是 super/sub。 */
.wechat-markdown-root sub, .wechat-markdown-root sup { font-size: inherit; line-height: inherit; }
.wechat-markdown-root code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 90%; color: #d14; background: rgba(27,31,35,0.05); padding: 2px 5px; border-radius: 4px; }
.wechat-markdown-root pre { margin: 1em 8px; padding: 1em; background: #0d1117; color: #c9d1d9; border-radius: 8px; overflow-x: auto; font-size: 13px; line-height: 1.6; }
/* 代码块自动折行（与内联一致）：横向不溢出，才不会被判「pre 内容不会自动换行」 */
.wechat-markdown-root pre code { display: block; background: transparent; color: inherit; padding: 0; border: 0; border-radius: 0; font-size: inherit; white-space: pre-wrap; overflow-wrap: anywhere; }
/* 引用与内联保持一致：统一 15px / 1.75（无单位倍数），预览与粘贴结果才不会分叉 */
.wechat-markdown-root blockquote { margin: 1.4em 8px; padding: 4px 14px; border-left: 4px solid ${t.h2Dark}; border-radius: 0; background: transparent; color: ${t.bodyColor}; font-size: 15px; line-height: 1.75; letter-spacing: 1px; text-align: justify; box-sizing: border-box; max-width: 100%; }
.wechat-markdown-root blockquote p { margin: 0.4em 0; padding: 0; color: ${t.bodyColor}; font-size: 15px; line-height: 1.75; letter-spacing: inherit; text-align: inherit; }
.wechat-markdown-root ul, .wechat-markdown-root ol { margin: 1em 8px; padding-left: 2em; color: ${t.h2Dark}; font-size: 15px; line-height: 1.75; }
.wechat-markdown-root ul { list-style-type: disc; }
.wechat-markdown-root ol { list-style-type: decimal; }
.wechat-markdown-root li { margin: 0.4em 0; font-size: 15px; line-height: 1.75; }
.wechat-markdown-root a { color: #576b95; text-decoration: none; }
.wechat-markdown-root img { display: block; margin: 0.6em auto; border-radius: 4px; width: 100%; }
.wechat-markdown-root figure { margin: 1.5em 8px; text-align: center; }
.wechat-markdown-root figcaption { margin-top: 0.4em; color: ${t.muted}; font-size: 0.85em; }
/* 表格宽度策略与内联一致：外层 .table-wrap 负责左右缩进，table 自身 width:100% 撑满，
   保证各屏幕下居中状态恒一致（否则会命中 1.4.1 居中布局不一致） */
.wechat-markdown-root .table-wrap { margin: 1.2em 8px; padding: 0; font-size: 14px; line-height: 1.75; }
.wechat-markdown-root table { margin: 0; width: 100%; border-collapse: collapse; color: #3f3f3f; font-size: 14px; line-height: 1.75; }
.wechat-markdown-root th, .wechat-markdown-root td { border: 1px solid #dfdfdf; padding: 0.4em 0.75em; font-size: 14px; line-height: 1.75; word-break: break-word; }
.wechat-markdown-root th { background: rgba(0,0,0,0.04); font-weight: 600; }
.wechat-markdown-root hr { margin: 2em 8px; border: 0; border-top: 1px solid rgba(0,0,0,0.1); }
.wechat-markdown-root .container { display: block; width: auto; box-sizing: border-box; margin: 1.4em 8px; padding: 0.6em 14px; background: transparent; border: 1px solid #eee; border-radius: 10px; color: ${t.bodyColor}; font-size: 15px; line-height: 28px; letter-spacing: 1px; text-align: justify; }
.wechat-markdown-root .container p { margin: 0.4em 0; padding: 0; color: ${t.bodyColor}; font-size: 15px; line-height: 1.75; letter-spacing: 1px; text-align: justify; }
.wechat-markdown-root .container p.container-label { margin: 0 0 0.4em 0; font-weight: 600; color: ${t.h2Dark}; letter-spacing: 1.5px; text-align: left; }
.wechat-markdown-root .container p:last-child { margin-bottom: 0; }
.wechat-markdown-root .container-highlight { margin: 1.6em 8px; padding: 0; text-align: center; border: 0; border-radius: 0; background: transparent; font-size: 15px; line-height: 1.75; }
.wechat-markdown-root .container-highlight .quote-mark { display: block; color: ${t.h2Dark}; font-size: 36px; font-weight: 700; line-height: 1; }
.wechat-markdown-root .container-highlight .quote-mark-left { text-align: left; padding-left: 8px; }
.wechat-markdown-root .container-highlight .quote-mark-right { text-align: right; padding-right: 8px; margin-top: -0.5em; }
.wechat-markdown-root .container-highlight p { margin: 0.4em 12px; color: ${t.h2Dark}; font-size: 15px; font-weight: 500; line-height: 1.75; letter-spacing: 0.04em; text-align: center; }
.wechat-markdown-root .container-intro { margin: 1.6em 8px 2em; padding: 0.9em 0.4em; border: 1px solid #eee; border-radius: 0; background: transparent; font-size: 15px; line-height: 1.75; }
.wechat-markdown-root .container-intro p { margin: 0.3em 0; color: ${t.introText}; font-size: 15px; line-height: 1.75; letter-spacing: 0.04em; text-align: left; }
.wechat-markdown-root .container-intro .article-map { margin: 0 0 0 0; }
.wechat-markdown-root .container-intro .article-map p { margin: 0; padding: 0; }
.wechat-markdown-root .footnotes { margin-top: 2em; color: ${t.muted}; font-size: 0.9em; }
.wechat-markdown-root .footnotes p { color: ${t.muted}; font-size: inherit; line-height: 1.5; letter-spacing: 0.5px; margin: 1em 8px; }
.wechat-markdown-root .footnotes-list { margin: 0.6em 0; padding-left: 0; list-style: none; color: inherit; }
.wechat-markdown-root .footnote-item { margin: 0.4em 0; }
.wechat-markdown-root .footnote-ref { color: ${t.h2Dark}; font-size: inherit; font-weight: 600; margin: 0 1px; vertical-align: baseline; line-height: inherit; }
.wechat-markdown-root .task-list-item { list-style: none; }
.wechat-markdown-root ruby rt { color: ${t.muted}; font-size: 0.6em; }
.knb-meta { margin: 1.5em 8px; font-size: 12px; color: ${t.muted}; text-align: center; }
`;
}

function hexFromRgb(rgb) {
  const m = rgb.match(/rgb\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i);
  if (!m) return '#299480';
  const r = parseInt(m[1]), g = parseInt(m[2]), b = parseInt(m[3]);
  return '#' + [r,g,b].map(n => n.toString(16).padStart(2,'0')).join('');
}

function applyPreviewTheme() {
  const screen = $('.phone-screen');
  const content = $('#preview-content');
  const t = getThemeCSS(state.theme);

  if (state.darkPreview) {
    screen.style.background = '#111';
    content.style.background = '#111';
    content.style.color = '#e4e4e7';
  } else {
    screen.style.background = '#fff';
    content.style.background = '#fff';
    content.style.color = t.bodyColor;
  }
  content.style.setProperty('--primary', t.accent);

  // Generate and inject theme CSS as <style>
  const oldStyle = $('#preview-theme-style');
  if (oldStyle) oldStyle.remove();
  const style = el('style', { id: 'preview-theme-style' });
  style.textContent = generatePreviewCSS();
  content.appendChild(style);

  // Themed elements via JS
  $$('a', content).forEach(a => a.style.color = '#576b95');
  $$('.knb-container-label', content).forEach(p => p.style.color = t.h2Dark);
}

function updatePhoneTime() {
  const el = $('#phone-time');
  if (!el) return;
  const d = new Date();
  el.textContent = `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function updateStatus() {
  const md = editor?.getValue() || state.markdown;
  const chars = md.length;
  const lines = md.split('\n').length;
  const { minutes } = estimateReadingTime(md);
  const cs = $('#status-chars');
  const ls = $('#status-lines');
  const rs = $('#status-readtime');
  if (cs) cs.textContent = `${chars} 字`;
  if (ls) ls.textContent = `${lines} 行`;
  if (rs) rs.textContent = `速读仅需 ${minutes} 分钟`;
}

// ==================== Dialogs ====================
function closeDialog() {
  $('#dialog-root').innerHTML = '';
}

function openDialog(name) {
  closeDialog();
  const root = $('#dialog-root');
  const backdrop = el('div', { class: 'dialog-backdrop open' });
  const dlg = el('div', { class: 'dialog' });

  const titles = {
    settings: '设置',
    about: '关于',
    help: '使用说明',
    preview: '预览',
    check: '结构自检',
  };

  const header = el('div', { class: 'dialog-header' },
    el('h3', {}, titles[name] || ''),
    el('button', { class: 'close', html: ICON.close, onclick: closeDialog }),
  );
  dlg.appendChild(header);

  const body = el('div', { class: 'dialog-body' });
  if (name === 'settings') buildSettingsBody(body);
  else if (name === 'about') buildAboutBody(body);
  else if (name === 'help') buildHelpBody(body);
  else if (name === 'preview') buildPreviewBody(body);
  else if (name === 'check') buildCheckBody(body);
  dlg.appendChild(body);

  if (name === 'settings' || name === 'about' || name === 'help' || name === 'check') {
    const footer = el('div', { class: 'dialog-footer' },
      el('button', { class: 'btn outline', onclick: closeDialog }, '关闭'),
    );
    dlg.appendChild(footer);
  }

  backdrop.appendChild(dlg);
  root.appendChild(backdrop);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) closeDialog(); });
}

function buildSettingsBody(body) {
  // Tabs
  const tabs = el('div', { class: 'tabs' });
  const tabStyle = el('div', { class: 'tab active', 'data-tab': 'style' }, '主题');
  const tabKeys = el('div', { class: 'tab', 'data-tab': 'keys' }, '快捷键');
  const tabExport = el('div', { class: 'tab', 'data-tab': 'export' }, '导出');
  const tabReset = el('div', { class: 'tab', 'data-tab': 'reset' }, '存储');
  tabs.appendChild(tabStyle);
  tabs.appendChild(tabKeys);
  tabs.appendChild(tabExport);
  tabs.appendChild(tabReset);
  body.appendChild(tabs);

  // Theme tab - grouped by category
  const stylePanel = el('div', { class: 'settings-panel' });
  // Font weight
  // 字重档位重新映射：旧「常规」(400) → 新「细」，旧「粗」(500) → 新「常规」，
  // 新增「粗」用 700，标签与实际字重一一对应。
  stylePanel.appendChild(el('div', { class: 'field' },
    el('label', {}, '字体粗细'),
    el('div', { class: 'radio-row' },
      el('label', { class: 'radio-item' + (state.fontWeight === 'light' ? ' active' : '') }, '细'),
      el('label', { class: 'radio-item' + (state.fontWeight === 'regular' ? ' active' : '') }, '常规'),
      el('label', { class: 'radio-item' + (state.fontWeight === 'bold' ? ' active' : '') }, '粗'),
    ),
  ));
  // Themes by category
  for (const cat of THEME_CATEGORIES) {
    stylePanel.appendChild(el('div', { class: 'field' },
      el('label', {}, cat.label),
      el('div', { class: 'theme-list' },
        ...cat.themeIds.map(id => {
          const t = THEMES.find(th => th.id === id);
          if (!t) return null;
          const item = el('div', { class: 'theme-item' + (state.theme === t.id ? ' active' : ''), 'data-id': t.id },
            el('span', { class: 'theme-swatch', style: `background: linear-gradient(90deg, ${t.colors[0]} 0 50%, ${t.colors[1]} 50% 100%);` }),
            t.name,
            el('span', { class: 'desc' }, t.desc),
          );
          item.addEventListener('click', () => {
            state.theme = t.id;
            renderPreview(state.markdown);
            $$('.theme-item', stylePanel).forEach(x => x.classList.remove('active'));
            item.classList.add('active');
            saveState();
          });
          return item;
        }).filter(Boolean),
      ),
    ));
  }

  // Radio handlers（当前只有字体粗细一组）
  $$('.radio-row', stylePanel).forEach(row => {
    if (!row.querySelector('.radio-item')) return;
    row.addEventListener('click', (e) => {
      const item = e.target.closest('.radio-item');
      if (!item) return;
      row.querySelectorAll('.radio-item').forEach(r => r.classList.remove('active'));
      item.classList.add('active');
      const label = item.textContent;
      if (label === '细') state.fontWeight = 'light';
      else if (label === '常规') state.fontWeight = 'regular';
      else if (label === '粗') state.fontWeight = 'bold';
      applyPreviewTheme();
      saveState();
    });
  });

  // Dark preview toggle
  stylePanel.appendChild(switchRow('暗色预览', '当前为暗色预览模式（不依赖主题设置）', state.darkPreview, (on) => {
    state.darkPreview = on;
    applyPreviewTheme();
    saveState();
  }));

  body.appendChild(stylePanel);

  // Shortcut tab
  const keysPanel = el('div', { class: 'settings-panel hidden' });
  buildKeymapPanel(keysPanel);
  body.appendChild(keysPanel);

  // Reset tab
  const resetPanel = el('div', { class: 'settings-panel hidden' });
  resetPanel.appendChild(el('div', { class: 'field' },
    el('label', {}, '清空本地存储'),
    el('div', { class: 'hint' }, '排版器会把你设置项、文档内容存到浏览器本地（localStorage）。如果还不够，换浏览器或清除数据。'),
    el('button', { class: 'btn outline', style: 'margin-top:8px;', onclick: () => {
      if (confirm('确定要清空本地存储吗？这会重置所有设置和文档内容。')) {
        clearLocalStorage();
        state.markdown = SAMPLE;
        state.theme = 'default';
        state.darkPreview = false;
        state.fontWeight = 'regular';
        state.wrapInline = true;
        resetKeymapToDefault();
        kmRefreshAllPanels();
        editor.setValue(SAMPLE);
        renderPreview(SAMPLE);
        updateStatus();
        saveState();
        toast('已重置为初始状态');
        closeDialog();
      }
    } }, '重置所有数据'),
  ));
  body.appendChild(resetPanel);

  // Export tab
  const exportPanel = el('div', { class: 'settings-panel hidden' });
  exportPanel.appendChild(el('div', { class: 'field' },
    el('label', {}, '导出兼容'),
    el('div', { class: 'hint' }, '只影响「复制」出来的 HTML，不改 Markdown 源码。'),
  ));
  exportPanel.appendChild(switchRow(
    '包裹行内文字（规避微信行高误报）',
    '微信线上会对「加粗 / 字色 / 背景色与普通文字混排」的段落提示「行高小于字体大小」，改行距无效。开启后导出时把段落里的普通文字套一层无样式 span，段落不再混排，视觉完全不变。已实测：开启后复制到公众号后台，这类告警全部消失，故默认开启。',
    state.wrapInline,
    (on) => {
      state.wrapInline = on;
      renderPreview(state.markdown);
      saveState();
      toast(on ? '已开启：导出时包裹行内文字' : '已关闭');
    },
  ));
  body.appendChild(exportPanel);

  // Tab switching
  tabs.addEventListener('click', (e) => {
    const t = e.target.closest('.tab');
    if (!t) return;
    $$('.tab', tabs).forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    const name = t.dataset.tab;
    stylePanel.classList.toggle('hidden', name !== 'style');
    keysPanel.classList.toggle('hidden', name !== 'keys');
    exportPanel.classList.toggle('hidden', name !== 'export');
    resetPanel.classList.toggle('hidden', name !== 'reset');
    if (name !== 'keys') kmStopRecording();
  });
}

// ==================== 快捷键配置界面 ====================
// 设置面板与设置对话框可能同时存在，改动后需要同步刷新所有已挂载的面板
const kmPanels = [];

function kmRefreshAllPanels() {
  for (let i = kmPanels.length - 1; i >= 0; i--) {
    const p = kmPanels[i];
    if (!document.contains(p.root)) { kmPanels.splice(i, 1); continue; }
    p.refresh();
  }
}

function kmStopRecording() {
  if (!kmRecordingCtx) return;
  const ctx = kmRecordingCtx;
  kmRecordingCtx = null;
  window.removeEventListener('keydown', ctx.onKey, true);
  window.removeEventListener('mousedown', ctx.onOutside, true);
  ctx.restore();
}

function buildKeymapPanel(panel) {
  panel.appendChild(el('div', { class: 'km-intro' },
    `点击右侧按键框录制新的快捷键：在编辑区打字时按下即可触发对应工具栏功能。录制中按 Esc 取消，按 ${IS_MAC ? '⌫' : 'Backspace'} 清除绑定。`,
  ));

  // 冲突 / 非法组合的提示条
  const note = el('div', { class: 'km-note hidden' });
  const noteText = el('span', { class: 'km-note-text' });
  const noteActions = el('span', { class: 'row gap-2' });
  note.appendChild(noteText);
  note.appendChild(noteActions);
  panel.appendChild(note);

  function hideNote() {
    note.classList.add('hidden');
    noteActions.innerHTML = '';
  }

  function showNote(kind, text, actions = []) {
    note.classList.remove('hidden', 'is-warn', 'is-error');
    note.classList.add(kind === 'error' ? 'is-error' : 'is-warn');
    noteText.textContent = text;
    noteActions.innerHTML = '';
    for (const a of actions) {
      noteActions.appendChild(el('button', {
        class: `km-note-btn ${a.primary ? 'primary' : 'plain'}`,
        onclick: a.onClick,
      }, a.label));
    }
  }

  // 搜索 + 恢复默认
  const search = el('input', { class: 'km-search', type: 'search', placeholder: '搜索功能名称…' });
  const resetBtn = el('button', { class: 'km-reset' }, '恢复默认');
  panel.appendChild(el('div', { class: 'km-bar' }, search, resetBtn));

  const rows = {};          // commandId -> { row, chip, clearBtn }
  const groupNodes = [];
  const emptyHint = el('div', { class: 'km-empty hidden' }, '没有匹配的功能');

  function refreshRow(id) {
    const r = rows[id];
    if (!r) return;
    const combo = getKeymap()[id];
    r.chip.classList.remove('is-recording');
    r.chip.classList.toggle('is-empty', !combo);
    r.chip.textContent = combo ? formatCombo(combo) : '未设置';
    r.chip.title = combo ? `${combo}（点击可重新录制）` : '点击录制快捷键';
    r.clearBtn.classList.toggle('hidden', !combo);
  }

  function refreshAllRows() {
    for (const id of Object.keys(rows)) refreshRow(id);
  }

  // 开始录制某个命令的快捷键
  function startRecording(id) {
    kmStopRecording();
    hideNote();
    const r = rows[id];
    r.chip.classList.add('is-recording');
    r.chip.classList.remove('is-empty');
    r.chip.textContent = '按下组合键…';

    function commit(combo) {
      setShortcut(id, combo);
      kmRefreshAllPanels();
      toast(combo ? `已设为 ${formatCombo(combo)}` : '已清除该快捷键');
    }

    const onKey = (e) => {
      e.preventDefault();
      e.stopPropagation();
      const key = normalizeKeyCode(e);
      if (!key) return;                       // 只按住修饰键，继续等待
      if (key === 'Escape') { kmStopRecording(); return; }
      if ((key === 'Backspace' || key === 'Delete') && !e.metaKey && !e.ctrlKey && !e.altKey) {
        kmStopRecording();
        commit(null);
        return;
      }
      const combo = comboFromEvent(e);
      const check = validateCombo(combo);
      if (!check.ok) {
        kmStopRecording();
        showNote('error', `无法绑定：${check.reason}`);
        return;
      }
      if (getKeymap()[id] === combo) { kmStopRecording(); return; }

      // 冲突检测：同一组合键已绑定到其他功能
      const otherId = findCommandIdByCombo(combo, id);
      if (otherId) {
        const otherLabel = SHORTCUT_COMMAND_MAP[otherId].label;
        const selfLabel = SHORTCUT_COMMAND_MAP[id].label;
        kmStopRecording();
        showNote('warn', `${formatCombo(combo)} 已被「${otherLabel}」占用，覆盖后「${otherLabel}」将变为未设置。`, [
          {
            label: `覆盖给「${selfLabel}」`,
            primary: true,
            onClick: () => {
              setShortcut(otherId, null);
              setShortcut(id, combo);
              kmRefreshAllPanels();
              hideNote();
              toast(`已把 ${formatCombo(combo)} 改绑到「${selfLabel}」`);
            },
          },
          { label: '取消', onClick: hideNote },
        ]);
        return;
      }

      kmStopRecording();
      commit(combo);
    };

    // 点击面板以外的地方视为放弃录制
    const onOutside = (e) => { if (!r.chip.contains(e.target)) kmStopRecording(); };

    kmRecordingCtx = { commandId: id, onKey, onOutside, restore: () => refreshRow(id) };
    window.addEventListener('keydown', onKey, true);
    window.addEventListener('mousedown', onOutside, true);
  }

  // 分组渲染
  for (const group of SHORTCUT_GROUPS) {
    const cmds = SHORTCUT_COMMANDS.filter(c => c.group === group.id);
    if (!cmds.length) continue;
    const gWrap = el('div', { class: 'km-group' });
    gWrap.appendChild(el('div', { class: 'km-group-title' }, group.label));
    const rowNodes = [];
    for (const cmd of cmds) {
      const chip = el('button', { class: 'km-chip', onclick: () => startRecording(cmd.id) });
      const clearBtn = el('button', {
        class: 'km-clear', title: '清除此快捷键',
        onclick: () => {
          kmStopRecording();
          hideNote();
          setShortcut(cmd.id, null);
          kmRefreshAllPanels();
          toast('已清除该快捷键');
        },
      }, '×');
      const row = el('div', { class: 'km-row' },
        el('div', { class: 'km-row-label', title: cmd.label }, cmd.label),
        el('div', { class: 'km-keys' }, chip, clearBtn),
      );
      rows[cmd.id] = { row, chip, clearBtn };
      rowNodes.push({ row, label: cmd.label, id: cmd.id });
      gWrap.appendChild(row);
    }
    groupNodes.push({ wrap: gWrap, rowNodes });
    panel.appendChild(gWrap);
  }
  panel.appendChild(emptyHint);

  // 搜索过滤：按功能名 / 命令 id / 当前组合键匹配
  search.addEventListener('input', () => {
    const q = search.value.trim().toLowerCase();
    let visible = 0;
    for (const g of groupNodes) {
      let gVisible = 0;
      for (const rn of g.rowNodes) {
        const combo = getKeymap()[rn.id] || '';
        const hay = `${rn.label} ${rn.id} ${combo} ${formatCombo(combo)}`.toLowerCase();
        const show = !q || hay.includes(q);
        rn.row.classList.toggle('hidden', !show);
        if (show) gVisible++;
      }
      g.wrap.classList.toggle('hidden', gVisible === 0);
      visible += gVisible;
    }
    emptyHint.classList.toggle('hidden', visible > 0);
  });

  resetBtn.addEventListener('click', () => {
    if (!confirm('确定把所有快捷键恢复为默认设置吗？')) return;
    kmStopRecording();
    hideNote();
    resetKeymapToDefault();
    kmRefreshAllPanels();
    toast('快捷键已恢复默认');
  });

  refreshAllRows();
  kmPanels.push({ root: panel, refresh: refreshAllRows });
}

function switchRow(title, desc, value, onChange) {
  return el('div', { class: 'switch-row' },
    el('div', { class: 'label-block' },
      el('div', { class: 'title' }, title),
      el('div', { class: 'desc' }, desc),
    ),
    el('div', { class: 'switch' + (value ? ' on' : ''), onclick: function() {
      this.classList.toggle('on');
      onChange(this.classList.contains('on'));
    }}),
  );
}

function buildAboutBody(body) {
  body.innerHTML = `
    <div class="about-content">
      <p><strong>公众号排版器</strong> 是一款面向公众号作者的 Markdown 排版工具，把 Markdown 一键转换为有点逼格的微信排版。</p>
      <h4>核心特性</h4>
      <ul>
        <li>实时手机预览，所见即所得</li>
        <li>多套主题（默认、罗兰、青草、毒藤、洛基、几何、极简……）</li>
        <li>特殊容器：笔记、提示、警告、危险、说明、金句、摘要</li>
        <li>支持脚注、表格、任务清单、代码高亮</li>
        <li>输出符合微信公众平台编辑器插件规范，粘贴后不丢排版</li>
        <li>公众号外链自动转脚注 / 内链保留可点击</li>
        <li>数据存到浏览器本地，刷新不丢</li>
      </ul>
      <h4>使用提示</h4>
      <ul>
        <li>在左侧编辑 Markdown，右侧手机里实时显示排版</li>
        <li>工具栏第一行右侧为撤销 / 前进 / 清除 / 清空</li>
        <li>满意后点 <code>复制</code>，即可粘贴到公众号后台发布</li>
        <li>遇到问题或建议：欢迎联系 <a href="https://knb.im" style="color:#299480;">knb.im</a></li>
      </ul>
    </div>
  `;
}

function buildHelpBody(body) {
  body.innerHTML = `
    <div class="about-content">
      <h4>1. 在左侧输入 Markdown</h4>
      <p>在左侧编辑器输入你准备好的 Markdown 内容，右侧手机里会实时显示排版效果。</p>

      <h4>2. 使用顶部工具栏</h4>
      <p>顶部工具栏包含几乎所有可能用到的按钮：加粗、斜体、删除线、链接、列表、表格、代码、emoji、脚注、特殊容器等。点击即可插入。</p>

      <h4>3. 换主题</h4>
      <p>打开右上角「设置」，可以切换多种主题。从朴素的默认到几何、毒藤、洛基、几何、极简，总有一款适合你的内容。</p>

      <h4>4. 复制到公众号</h4>
      <p>写完后点顶部「复制」按钮，渲染后的 HTML 会复制到剪贴板。直接到公众号后台粘贴即可。</p>

      <h4>5. 公众号外链处理</h4>
      <p>公众号对外链有限制，外站链接会被改写为可点击的脚注；公众号内链保留可点击。</p>

      <h4>6. 自定义快捷键</h4>
      <p>打开「设置 → 快捷键」，可以给工具栏里几乎每一个功能绑定自己的快捷键。点击按键框后直接按下想要的组合即可，在左侧编辑区打字时按下就能触发。重复占用会给出冲突提示，可选择覆盖。</p>

      <h4>7. 数据保存</h4>
      <p>所有设置项（包括快捷键映射）都会自动保存到浏览器本地（localStorage）。下次打开时还在。</p>

      <h4>8. 特殊容器写法</h4>
      <p>专有格式按钮已从工具栏移除，仍可直接手写容器语法，粘贴到公众号后效果一致：</p>
      <p><code>::: intro</code> 摘要段 · <code>::: highlight</code> 金句 · <code>::: tip</code> 提示块 · <code>::: info</code> 说明块 · <code>::: note</code> 笔记块 · <code>::: warning</code> 警告块 · <code>::: danger</code> 危险块 · <code>::: say</code> 独白</p>
      <p>写法为三行：<code>::: 类型</code> 换行写内容，再换行 <code>:::</code> 结束。</p>

      <h4>9. 图片建议补尺寸</h4>
      <p>公众号校验图片宽度时依赖 <code>data-w</code>（图片原始像素宽度）。缺失时只能等图片加载完成，不同屏幕加载速度不同容易误判。可在图片标题位置写尺寸：</p>
      <p><code>![说明](图片地址 "1080x720")</code>，输出的 HTML 会自动带上 <code>data-w</code> 与 <code>data-ratio</code>。</p>

      <h4>常见问题</h4>
      <ul>
        <li><strong>建议桌面使用</strong>：手机端也可以使用，但桌面体验更佳。</li>
        <li><strong>支持嵌套</strong>：列表可以连续多行、嵌套子项。</li>
        <li><strong>中英混排</strong>：数字之间自动加空格，中英混排会获得最佳体验。</li>
      </ul>
    </div>
  `;
}

function buildPreviewBody(body) {
  body.innerHTML = `
    <div class="about-content">
      <p>当前为${state.darkPreview ? '暗色' : '亮色'}预览。</p>
      <p>如果还不够，你可以打开右上角「设置」面板切换主题。</p>
    </div>
  `;
}

// ==================== 结构自检（本地复刻公众号检测引擎）====================
// 实现对齐官方仓库 wechatjs/verify-article-structure-spec（cli/engine）的核心规则：
//   · 真实排版测量：三档屏幕宽度 585 / 677 / 375（与官方 DEFAULT_SCREENS 一致）
//   · #1.3 / #2.3.2 行高重叠：Range 矩形 → 聚类出真实行数 → 平均行距对比 0.95 × 字号
//   · #1.4 width：居中不一致 / 宽度差异 / 水平溢出
//   · #1.5 height：height:0 或固定高度裁剪文字
//   · #1.8 pre：代码块横向溢出（scrollWidth > clientWidth）
//   · #1.1 opacity、#1.2 caret-color、#1.6 text-align、#2.1 嵌套层级、
//     #3 font-family、#4.5.2 !important、#1.4.3 img 缺 data-w 等静态属性规则
// 结果按规则分组返回，由「自检」弹窗渲染。
const CHECK_WIDTHS = [585, 677, 375];
const CHECK_TAGS = ['p', 'div', 'section', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'li', 'td', 'th'];
// 零宽空格要当作「无文字」处理，否则只含占位符的元素会被误判成有内容
const ZERO_WIDTH = String.fromCharCode(0x200b);
const visibleText = (s) => String(s == null ? '' : s).split(ZERO_WIDTH).join('').replace(/\s/g, '');
const tagNameOf = (n) => String(n.tagName || '').toLowerCase();

// 复刻官方 detectLineHeightOverlap。
// 最关键的细节是**聚类方式**：现行引擎按「垂直区间重叠 > 较小高度的 50%」归并，
// 而不是按 top 等值（相差 <2px）归并。后者会把基线对齐排版里的 sup/sub 上标、
// 大字号片段误判成额外一行，进而把正常段落算成叠字（官方 layout.ts 有专门注释）。
// 本实现与官方保持一致，因此脚注标记、上标下标都不会再被误报。
function measureLineBox(node) {
  const cs = window.getComputedStyle(node);
  const fontSize = parseFloat(cs.fontSize) || 16;
  const lhRaw = cs.lineHeight;
  const lineHeight = lhRaw === 'normal' ? fontSize * 1.2 : parseFloat(lhRaw);
  const range = document.createRange();
  range.selectNodeContents(node);
  const rects = Array.from(range.getClientRects()).filter(r => r.height > 0 && r.width > 0);
  const lines = [];
  for (const r of rects) {
    const top = r.top;
    const bottom = r.top + r.height;
    const hit = lines.find((l) => {
      const overlap = Math.min(l.bottom, bottom) - Math.max(l.top, top);
      const minH = Math.min(l.bottom - l.top, bottom - top);
      return overlap > minH * 0.5;
    });
    if (hit) {
      hit.top = Math.min(hit.top, top);
      hit.bottom = Math.max(hit.bottom, bottom);
    } else {
      lines.push({ top, bottom });
    }
  }
  const lineCount = lines.length;
  const contentHeight = range.getBoundingClientRect().height;
  let overlapping = false;
  if (Number.isFinite(lineHeight) && lineHeight === 0) {
    overlapping = true;                                  // 行框塌缩，直接判叠字
  } else if (lineCount >= 2) {
    overlapping = contentHeight / lineCount < fontSize * 0.95;
  }
  // rectCount 与 lineCount 的差 = 「同一行被拆成了几个行内片段」。
  // 加粗 / 字色 / 背景色 / 上下标都会让 Range 在同一行里产出多个矩形，
  // 微信线上实测会把这些片段之间的 0 间距当成行距，从而误报 2.3.2。
  //
  // 但实测对照发现：光是「片段数 > 行数」还不够准。微信只对**行内标签与纯文本混排**
  // 的段落提示；整段被单一行内标签包住的（<p><strong>小标题</strong></p>、
  // <p><em>尾注</em></p>）虽然同属多片段，却从不被提示。所以额外算一个 mixed：
  // 直接子节点里既有行内元素、又有非空白文本。
  let inlineElem = false;
  let bareText = false;
  for (const child of node.childNodes) {
    if (child.nodeType === 1) {
      if (tagNameOf(child) !== 'br') inlineElem = true;
    } else if (child.nodeType === 3 && visibleText(child.nodeValue)) {
      bareText = true;
    }
  }
  const mixed = inlineElem && bareText;
  return { fontSize, lineHeight, lineCount, rectCount: rects.length, contentHeight, overlapping, mixed };
}

// 复刻官方 hasWidthVariance 的三个维度（阈值同官方：10px / 0.2）
function judgeWidthVariance(findings) {
  if (!findings.length) return '';
  const baseWidth = findings[0].computedWidth;
  const baseRatio = findings[0].widthRatio;
  const baseOverflowing = findings[0].isOverflowing;
  const hasWidthDiff = findings.some(f => Math.abs(f.computedWidth - baseWidth) > 10);
  const isNormalResponsive = hasWidthDiff && findings.every(f => (
    Math.abs(f.computedWidth - baseWidth) <= 10 || Math.abs(f.widthRatio - 1) < 0.1
  ));
  const dynamicRatioTolerance = findings.some(f => f.widthRatio === 1) ? 0 : 0.2;
  const hasRatioDiff = findings.some(f => Math.abs(f.widthRatio - baseRatio) > dynamicRatioTolerance);
  const hasOverflowDiff = findings.some(f => f.isOverflowing !== baseOverflowing);
  const hasCenterInconsistency = findings.some(f => f.isHorizontallyCentered)
    && findings.some(f => !f.isHorizontallyCentered);
  const rules = [];
  if (hasWidthDiff && hasRatioDiff && !isNormalResponsive) rules.push('不同屏幕下宽度差异');
  if (hasCenterInconsistency) rules.push('居中布局不一致');
  if (hasOverflowDiff) rules.push('存在溢出问题');
  return rules.join('；');
}

function nodeLabel(n, index) {
  const tag = tagNameOf(n);
  const cls = n.className ? '.' + String(n.className).trim().split(/\s+/).join('.') : '';
  return '第 ' + index + ' 段 <' + tag + cls + '>';
}

function runStructureCheck() {
  const html = renderMarkdown(editor.getValue());
  const host = document.createElement('div');
  host.className = 'rich_media_content';
  host.style.cssText = 'position:fixed;left:-9999px;top:-9999px;visibility:hidden;pointer-events:none;z-index:-1;box-sizing:border-box;color:rgba(0,0,0,.9);overflow:hidden;text-align:justify;';
  host.innerHTML = html;
  document.body.appendChild(host);

  const groups = [
    { key: 'lineHeight', title: '行高重叠（#1.3 / #2.3.2）', items: [] },
    { key: 'width', title: '宽度与居中（#1.4）', items: [] },
    { key: 'height', title: '高度裁剪（#1.5）', items: [] },
    { key: 'pre', title: '代码块横向溢出（#1.8）', items: [] },
    { key: 'style', title: '不推荐的 CSS 写法（#1.1 / #1.2 / #1.6 / #3 / #4.5.2）', items: [] },
    { key: 'img', title: '图片尺寸声明（#1.4.3）', items: [] },
    { key: 'nest', title: '嵌套层级（#2.1）', items: [] },
    { key: 'frag', title: '行内混排（微信线上会提示「行高重叠」，非真实违规）', items: [] },
  ];
  const add = (key, item) => {
    const g = groups.find(x => x.key === key);
    if (g) g.items.push(item);
  };

  // 复刻微信后台的段落编号：它给 p / h1-h6 / li / hr 依次打 data-para-index，
  // 连空内容的装饰条也计数；面板上显示的「第 N 段」= data-para-index + 1。
  const wxNodes = Array.from(host.querySelectorAll('p,h1,h2,h3,h4,h5,h6,li,hr'));
  const wxIndex = new Map();
  wxNodes.forEach((n, i) => wxIndex.set(n, i + 1));
  const wxLabel = (n) => {
    const i = wxIndex.get(n) || 0;
    return i
      ? '第 ' + (i + 1) + ' 段 <' + tagNameOf(n) + '>（data-para-index=' + i + '）'
      : '<' + tagNameOf(n) + '>';
  };

  try {
    // ---------- 静态属性类（与屏幕宽度无关，只跑一次） ----------
    const all = Array.from(host.querySelectorAll('*'));
    all.forEach((n, i) => {
      const tag = tagNameOf(n);
      const styleText = n.getAttribute('style') || '';

      // #3 font-family：正文不设字体，仅代码保留等宽（等宽是功能必需）
      if (/font-family/i.test(styleText) && tag !== 'code' && tag !== 'pre') {
        add('style', { level: 'warn', where: nodeLabel(n, i + 1), rule: '#3 字体使用规范', detail: '设置了 font-family，移动端字体可能与预览不一致' });
      }
      // #1.6 text-align：start / end 各端解析不一致
      if (/text-align:\s*(start|end)/i.test(styleText)) {
        add('style', { level: 'warn', where: nodeLabel(n, i + 1), rule: '#1.6 text-align', detail: '使用了 text-align:' + (/text-align:\s*start/i.test(styleText) ? 'start' : 'end') });
      }
      // #4.5.2 !important
      if (/!\s*important/i.test(styleText)) {
        add('style', { level: 'warn', where: nodeLabel(n, i + 1), rule: '#4.5.2 !important', detail: '使用了 !important，会使平台公共样式失效' });
      }
      // #1.1 opacity:0 + #1.2 caret-color 透明
      if (tag === 'img' && /opacity:\s*0(\.0+)?\s*[;"]?/i.test(styleText)) {
        add('style', { level: 'warn', where: nodeLabel(n, i + 1), rule: '#1.1 opacity', detail: '图片 opacity 为 0，发布后无法通过后台替换' });
      }
      if (/caret-color:\s*(transparent|rgba\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\))/i.test(styleText)) {
        add('style', { level: 'warn', where: nodeLabel(n, i + 1), rule: '#1.2 caret-color', detail: '光标颜色透明，编辑时无法定位光标' });
      }
      // #1.4.3 img 缺 data-w：图片加载慢时拿不到宽度，容易误报
      if (tag === 'img' && !n.getAttribute('data-w')) {
        add('img', { level: 'info', where: nodeLabel(n, i + 1), rule: '#1.4.3 data-w', detail: '未声明图片原始宽度，建议在 Markdown 里写 ![说明](地址 "宽x高")' });
      }
      // #2.1 嵌套层级：同标签 + 同内联样式 + 单子节点，连续 > 10 层
      let chain = 0;
      let cur = n;
      while (cur && cur.parentElement && cur.parentElement !== host) {
        const p = cur.parentElement;
        if (p.tagName === cur.tagName && (p.getAttribute('style') || '') === (cur.getAttribute('style') || '')
          && p.children.length === 1) {
          chain++;
          cur = p;
        } else break;
      }
      if (chain >= 10) {
        add('nest', { level: 'warn', where: nodeLabel(n, i + 1), rule: '#2.1 嵌套层级', detail: '连续同构嵌套 ' + chain + ' 层（> 10 会被平台自动精简）' });
      }
    });

    // ---------- 布局类（逐档宽度真实排版） ----------
    const paraNodes = Array.from(host.children);
    const textNodes = Array.from(host.querySelectorAll(CHECK_TAGS.join(',')));
    const lhMap = new Map();
    const fragMap = new Map();
    const preMap = new Map();
    const hMap = new Map();
    const widthFindings = paraNodes.map(() => []);
    const push = (map, node, rec) => {
      if (!map.has(node)) map.set(node, []);
      map.get(node).push(rec);
    };

    for (const width of CHECK_WIDTHS) {
      host.style.width = width + 'px';

      // #1.3 / #2.3.2 行高重叠
      let paraIndex = 0;
      for (const n of textNodes) {
        if (tagNameOf(n) === 'svg') continue;
        if (!visibleText(n.textContent)) continue;
        paraIndex++;
        const m = measureLineBox(n);
        if (m.overlapping) push(lhMap, n, { width, index: paraIndex, m });
        if (m.mixed && m.rectCount > m.lineCount) {
          push(fragMap, n, {
            width, index: paraIndex,
            extra: m.rectCount - m.lineCount,
            rectCount: m.rectCount, lineCount: m.lineCount,
          });
        }
      }

      // #1.4 width：只测段落级（沙箱直接子元素），与官方「段落」口径一致
      const pRect = host.getBoundingClientRect();
      paraNodes.forEach((n, idx) => {
        const rect = n.getBoundingClientRect();
        const centerDiff = Math.abs((rect.left - pRect.left) - (pRect.right - rect.right));
        widthFindings[idx].push({
          screenWidth: width,
          computedWidth: Math.round(rect.width),
          widthRatio: rect.width / pRect.width,
          isHorizontallyCentered: centerDiff <= 1,
          isOverflowing: (rect.left < pRect.left - 1 || rect.right > pRect.right + 1) && centerDiff > 1,
        });
      });

      // #1.8 pre：代码块横向溢出
      Array.from(host.querySelectorAll('pre')).forEach((n) => {
        if (n.scrollWidth > n.clientWidth + 1) {
          push(preMap, n, { width, sw: n.scrollWidth, cw: n.clientWidth });
        }
      });

      // #1.5 height：含文字却高度为 0，或固定高度把内容裁掉
      Array.from(host.querySelectorAll('*')).forEach((n) => {
        const ownText = visibleText(n.textContent);
        const rect = n.getBoundingClientRect();
        const cs = window.getComputedStyle(n);
        const styleText = n.getAttribute('style') || '';
        if (ownText && rect.height < 1) {
          push(hMap, n, { width, rule: '#1.5.1 height:0', detail: '元素含文字但实际高度为 0，移动端内容不可见' });
          return;
        }
        if (/height:\s*\d+(\.\d+)?px/i.test(styleText)
          && /overflow:\s*hidden/i.test(styleText)
          && n.scrollHeight > n.clientHeight + 1 && ownText) {
          push(hMap, n, {
            width,
            rule: '#1.5.2 内容溢出容器',
            detail: '内容高度 ' + n.scrollHeight + 'px 超出固定高度 ' + cs.height + '，超出部分被裁剪',
          });
        }
      });
    }

    // 汇总：同一个节点在三档宽度下的命中合并成一条，避免刷屏
    lhMap.forEach((recs, n) => {
      const m = recs[0].m;
      const detail = m.lineCount >= 2
        ? '平均行距 ' + (m.contentHeight / m.lineCount).toFixed(1) + 'px < 阈值 '
          + (m.fontSize * 0.95).toFixed(1) + 'px（字号 ' + m.fontSize.toFixed(1) + 'px，实测 '
          + m.lineCount + ' 行）'
        : 'line-height 实测为 0，行框塌缩（哪怕单行也会被判叠字）';
      add('lineHeight', {
        level: 'warn',
        where: nodeLabel(n, recs[0].index) + ' · ' + recs.map(r => r.width + 'px').join('/') + ' 命中',
        rule: m.lineCount >= 2 ? '#2.3.2 行高重叠' : '#1.3 line-height:0',
        detail,
        text: (n.textContent || '').trim().slice(0, 40),
      });
    });

    // 行内混排：不是规范违规，但微信线上实测会把同一行各片段之间的 0 间距
    // 当成行距，进而提示「行高小于字体大小」。判据是「行内元素 + 纯文本混排」，
    // 整段被单一标签包住的不算。列出它是为了和后台给出的段号一一对得上。
    fragMap.forEach((recs, n) => {
      const worst = recs.reduce((a, b) => (b.extra > a.extra ? b : a));
      add('frag', {
        level: 'info',
        where: wxLabel(n) + ' · ' + recs.map(r => r.width + 'px').join('/') + ' 命中',
        rule: '行内标签与纯文本混排',
        detail: '同一行被切成 ' + worst.rectCount + ' 个行内片段（实际 ' + worst.lineCount
          + ' 行）：加粗 / 字色 / 背景色与正文同处一行时，微信线上实测会把片段间的 0 间距当成行距，'
          + '提示「行高小于字体大小」。行距本身正常，属误报；'
          + '开启「设置 → 导出」的「包裹行内文字」可消除。',
        text: (n.textContent || '').trim().slice(0, 40),
      });
    });

    preMap.forEach((recs, n) => {
      const r = recs[0];
      add('pre', {
        level: 'warn',
        where: '<pre> · ' + recs.map(x => x.width + 'px').join('/') + ' 命中',
        rule: '#1.8 pre 标签',
        detail: '内容宽度 ' + r.sw + 'px 超出容器 ' + r.cw + 'px（移动端不会自动换行）',
        text: (n.textContent || '').trim().slice(0, 40),
      });
    });

    hMap.forEach((recs, n) => {
      add('height', {
        level: 'warn',
        where: '<' + tagNameOf(n) + '> · ' + recs.map(x => x.width + 'px').join('/') + ' 命中',
        rule: recs[0].rule,
        detail: recs[0].detail,
        text: (n.textContent || '').trim().slice(0, 40),
      });
    });

    widthFindings.forEach((findings, idx) => {
      if (findings.length < CHECK_WIDTHS.length) return;
      const rules = judgeWidthVariance(findings);
      if (!rules) return;
      add('width', {
        level: 'warn',
        where: nodeLabel(paraNodes[idx], idx + 1),
        rule: '#1.4 width（' + rules + '）',
        detail: findings.map(f => f.screenWidth + 'px→' + f.computedWidth + 'px'
          + (f.isHorizontallyCentered ? '(居中)' : '(非居中)') + (f.isOverflowing ? '(溢出)' : '')).join('，'),
        text: (paraNodes[idx].textContent || '').trim().slice(0, 40),
      });
    });
  } finally {
    if (host.parentNode) host.parentNode.removeChild(host);
  }

  return groups;
}

function buildCheckBody(body) {
  const intro = el('p', { class: 'text-muted', style: 'font-size:13px;line-height:1.7;margin:0 0 14px;' },
    '本地复刻公众号检测引擎的规则：三档屏幕宽度（585 / 677 / 375）真实排版，测量行高重叠与宽度/居中，再叠加 height、pre 横向溢出、opacity、text-align、font-family、!important、图片 data-w、嵌套层级等静态规则。自己写了自定义 HTML 时，发布前先跑一遍自检最稳。');
  body.appendChild(el('p', { class: 'text-muted', style: 'font-size:13px;line-height:1.7;margin:-8px 0 14px;' },
    '最后一组「行内混排」不是违规：一段里只要出现「加粗 / 字色 / 背景色 + 普通文字」的混排，微信实测就会把同一行多个片段之间的 0 间距当成行距，提示「行高小于字体大小」。整段被单一标签包住的（如 <p><strong>整句</strong></p>）不会被提示。这类提示改行距也消不掉，但「设置 → 导出」里的「包裹行内文字」开关（默认开启）可以消掉它——已实测开启后后台不再告警。若这一组非空，说明该开关被关掉了，或内容里有手写 HTML 绕过了包裹。'));
  body.appendChild(intro);

  let groups;
  try {
    groups = runStructureCheck();
  } catch (e) {
    body.appendChild(el('p', { style: 'color:#b91c1c;' }, '自检失败：' + (e && e.message ? e.message : e)));
    return;
  }

  const bad = groups.filter(g => g.items && g.items.length);
  if (!bad.length) {
    body.appendChild(el('div', { style: 'padding:14px;border-radius:8px;background:rgba(5,150,105,.08);color:#047857;font-size:14px;' },
      '✅ 未发现违规项，可以复制到公众号后台。'));
    return;
  }

  const total = bad.reduce((n, g) => n + g.items.length, 0);
  body.appendChild(el('p', { style: 'color:#b91c1c;font-size:14px;font-weight:600;margin:0 0 10px;' },
    '⚠️ 发现 ' + total + ' 处可能被公众号提示的排版问题：'));

  const wrap = el('div', { style: 'max-height:52vh;overflow:auto;border:1px solid var(--border);border-radius:8px;' });
  for (const g of bad) {
    wrap.appendChild(el('div', { style: 'padding:8px 12px;background:rgba(0,0,0,.03);font-size:12.5px;font-weight:600;color:#374151;border-bottom:1px solid var(--border);' },
      g.title + '（' + g.items.length + '）'));
    for (const it of g.items) {
      const color = it.level === 'warn' ? '#b91c1c' : '#92400e';
      wrap.appendChild(el('div', { style: 'padding:10px 12px;border-bottom:1px solid var(--border);font-size:12.5px;line-height:1.6;' },
        el('div', { style: 'font-weight:600;color:' + color + ';' }, it.where + ' · ' + it.rule),
        el('div', { style: 'font-family:ui-monospace,Menlo,monospace;color:#6b7280;margin-top:2px;' }, it.detail),
        el('div', { style: 'color:#374151;margin-top:4px;' }, it.text || '（无文字预览）'),
      ));
    }
  }
  body.appendChild(wrap);
}

// ==================== Clipboard ====================
async function copyMarkdown() {
  try {
    const html = renderMarkdown(editor.getValue());
    // Use the Clipboard API if available
    if (navigator.clipboard && window.ClipboardItem) {
      const item = new ClipboardItem({
        'text/html': new Blob([html], { type: 'text/html' }),
        'text/plain': new Blob([editor.getValue()], { type: 'text/plain' }),
      });
      await navigator.clipboard.write([item]);
      toast('已复制，可粘贴到公众号后台');
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(editor.getValue());
      toast('已复制（纯文本）');
    } else {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = editor.getValue();
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      toast('已复制');
    }
  } catch (e) {
    toast('复制失败');
    console.error(e);
  }
}

async function pasteMarkdown() {
  try {
    if (navigator.clipboard && navigator.clipboard.readText) {
      const text = await navigator.clipboard.readText();
      if (text) {
        const { start, end } = editor.getSelection();
        editor.insertText(text, start, end);
        toast('已粘贴');
      }
    } else {
      toast('当前浏览器不支持自动粘贴，请使用 Ctrl/Cmd+V');
    }
  } catch (e) {
    toast('粘贴失败，请尝试手动粘贴（Ctrl/Cmd+V）');
  }
}

function clearAll() {
  if (confirm('确定要清空所有内容吗？')) {
    editor.setValue('');
    editor.recordHistory();
    state.markdown = '';
    saveState();
    renderPreview('');
    updateStatus();
    toast('已清空');
  }
}

// 清除选中文本中的非 Markdown 标准 HTML 样式标记（如 <span>、<div> 等），保留纯文本与 Markdown 语法
function stripHtmlTags(text) {
  // 仅移除 HTML 标签（形如 <span ...>、</span>、<br>），保留标签内文字；
  // HTML 注释（<!-- -->）与 Markdown 语法（**、#、::: 等）不受影响
  return text.replace(/<\/?[a-zA-Z][^>]*>/g, '');
}

function clearSelectionFormatting() {
  const { start, end } = editor.getSelection();
  if (start === end) {
    toast('请先选中要清除样式的文本');
    return;
  }
  const value = editor.getValue();
  const selected = value.substring(start, end);
  const cleaned = stripHtmlTags(selected);
  if (cleaned === selected) {
    toast('选中文本中没有可清除的 HTML 标记');
    return;
  }
  editor.insertText(cleaned, start, end);
  toast('已清除选中文本中的 HTML 样式标记');
}

// ==================== Keyboard shortcuts ====================
// 全部绑定由 state.keymap 驱动，可在「设置 → 快捷键」里自定义
document.addEventListener('keydown', handleShortcutKeydown);

// ==================== Init ====================
function init() {
  loadState();
  // 与命令注册表对齐：补齐新增命令的默认绑定，丢弃已下线命令的残留
  state.keymap = normalizeKeymap(state.keymap);
  if (!state.markdown) state.markdown = SAMPLE;
  buildApp();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
