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
  { id: 'red',        name: '红火',     desc: '热烈红色，适合节日/重磅发布',            h2Dark: '#bb1e1e',          h2Mid: '#FF4949',            h3Dark: '#bb3827',            h3Mid: '#FF664F',            introText: '#7a3232',          colors: ['#1a1a1a', '#bb1e1e'] },
  { id: 'joker',      name: '小丑',     desc: '柔和紫罗兰，适合书评/文艺',              h2Dark: '#917cb7',          h2Mid: '#BAA8E4',            h3Dark: '#a57d96',            h3Mid: '#deafd0',            introText: '#5a4f78',          colors: ['#5a4f78', '#917cb7'] },
  { id: 'ironman',    name: '钢人',     desc: '红主调 + 金色点缀',                      h2Dark: '#D03E35',          h2Mid: '#DEAC43',            h3Dark: '#D03E35',            h3Mid: '#DEAC43',            introText: '#7d3835',          colors: ['#7d3835', '#D03E35'] },
  { id: 'batman',     name: '老爷',     desc: '深灰主调 + 蓝色 + 金色',                 h2Dark: '#4e4e4e',          h2Mid: '#68b4e4',            h3Dark: '#68b4e4',            h3Mid: '#4e4e4e',            introText: '#3e3e3e',          colors: ['#3e3e3e', '#68b4e4'] },
  { id: 'blueindigo', name: '蓝靛',     desc: '柔和蓝色，适合科技产品介绍',             h2Dark: 'rgb(32, 91, 195)', h2Mid: 'rgb(166, 189, 231)',h3Dark: 'rgb(99, 141, 213)',  h3Mid: 'rgb(133, 165, 222)', introText: 'rgb(60, 80, 130)',colors: ['#1e293b', 'rgb(32, 91, 195)'] },
  { id: 'pink',       name: '桃红',     desc: '甜美粉色，适合生活/美食',                h2Dark: '#fe7e93',          h2Mid: '#feb6a4',            h3Dark: '#feb6a4',            h3Mid: '#fe7e93',            introText: '#8c505f',          colors: ['#8c505f', '#fe7e93'] },
  { id: 'golden',     name: '金黄',     desc: '暖色橙金，适合财经/年度回顾',            h2Dark: '#ffa359',          h2Mid: '#fee691',            h3Dark: '#ffa359',            h3Mid: '#fee691',            introText: '#8c5f32',          colors: ['#8c5f32', '#ffa359'] },
  { id: 'loki',       name: '洛基',     desc: '亦正亦邪的洛基风格',                     h2Dark: '#0b450a',          h2Mid: '#d6d3ae',            h3Dark: '#50630d',            h3Mid: '#d6d3ae',            introText: '#0b450a',          colors: ['#0b450a', '#50630d'] },
  { id: 'spiderman',  name: '小虫',     desc: '经典的蜘蛛侠配色',                       h2Dark: '#7E1F27',          h2Mid: '#2B6BBD',            h3Dark: '#B4202E',            h3Mid: '#114C92',            introText: '#114C92',          colors: ['#114C92', '#7E1F27'] },
  { id: 'posionivy',  name: '毒藤',     desc: '经典的毒藤配色',                         h2Dark: '#ff6325',          h2Mid: '#37c412',            h3Dark: '#37c412',            h3Mid: '#fcdb95',            introText: '#000000',          colors: ['#000000', '#ff6325'] },

  // ===== 精选色系（基于网页前端最佳搭配色系：主色 + 辅助色协调）=====
  { id: 'ocean',   name: '海洋蓝', desc: '科技专业：深蓝主调，青绿辅助',           h2Dark: '#0369A1',          h2Mid: '#7DD3FC',            h3Dark: '#0891B2',            h3Mid: '#67E8F9',            introText: '#075985',          colors: ['#082F49', '#0EA5E9'] },
  { id: 'forest',  name: '森林绿', desc: '自然环保：祖母绿主调，薄荷辅助',          h2Dark: '#047857',          h2Mid: '#6EE7B7',            h3Dark: '#059669',            h3Mid: '#34D399',            introText: '#065F46',          colors: ['#064E3B', '#059669'] },
  { id: 'twilight',name: '暮光紫', desc: '文艺创意：紫罗兰主调，浅紫辅助',          h2Dark: '#6D28D9',          h2Mid: '#C4B5FD',            h3Dark: '#7C3AED',            h3Mid: '#A78BFA',            introText: '#4C1D95',          colors: ['#2E1065', '#7C3AED'] },
  { id: 'sunset',  name: '暖阳橙', desc: '活力美食：赤橙主调，暖金辅助',            h2Dark: '#C2410C',          h2Mid: '#FDBA74',            h3Dark: '#EA580C',            h3Mid: '#FCD34D',            introText: '#9A3412',          colors: ['#431407', '#EA580C'] },
  { id: 'rose',    name: '玫瑰红', desc: '时尚生活：玫红主调，浅粉辅助',            h2Dark: '#9F1239',          h2Mid: '#FDA4AF',            h3Dark: '#BE123C',            h3Mid: '#FB7185',            introText: '#881337',          colors: ['#4C0519', '#BE123C'] },
];

const THEME_CATEGORIES = [
  { id: 'color', label: '颜色',   themeIds: ['default', 'blackwhite', 'blueindigo', 'red', 'pink', 'golden'] },
  { id: 'character', label: '超英', themeIds: ['ironman', 'joker', 'batman', 'loki', 'spiderman', 'posionivy'] },
  { id: 'curated', label: '精选色系', themeIds: ['ocean', 'forest', 'twilight', 'sunset', 'rose'] },
];

// Default token constants (match original defaults)
const BODY_COLOR = 'rgb(43, 43, 43)';
const MUTED = '#888';
const MARK_BG = 'rgb(238, 253, 247)';
const H2_DEFAULT = 'rgb(41, 148, 128)';
const H3_DEFAULT = 'rgb(26, 149, 165)';
const TITLE_DEFAULT = 'rgb(62, 62, 62)';

// Chat speaker emojis
const SPEAKER_EMOJIS = ['🧑', '🧒', '🧑‍💼', '🧑‍🎓', '🧑‍🎨', '🧑‍💻', '🧑‍🔬', '🧑‍⚕️'];

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

## 多角色对话

::: chat
阿禅: 第一句
朋友: 回复
阿禅: 继续
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
  headingStyle: 'numbers',  // 'numbers' | 'eyes' | 'none'
  fontWeight: 'regular',     // 'light' | 'regular' | 'bold'
  darkPreview: false,
  showProgress: true,
  fontScale: 1,
  showLineNumbers: true,
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
  h4:          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h8"/><path d="M4 18V6"/><path d="M12 18V6"/><path d="M16 6v12"/><path d="M20 6 16 13"/><path d="M16 13h4"/></svg>',
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
  stickyNote:  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 9a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 15 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2z"/><path d="M15 3v5a1 1 0 0 0 1 1h5"/></svg>',
  ban:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M4.929 4.929 19.07 19.071"/></svg>',
  messageSquare:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z"/></svg>',
  messagesSquare:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 10a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 14.286V4a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/><path d="M20 9a2 2 0 0 1 2 2v10.286a.71.71 0 0 1-1.212.502l-2.202-2.202A2 2 0 0 0 17.172 19H10a2 2 0 0 1-2-2v-1"/></svg>',
  bookOpen:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/></svg>',
  sparkles:    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11.017 2.814a1 1 0 0 1 1.966 0l1.051 5.558a2 2 0 0 0 1.594 1.594l5.558 1.051a1 1 0 0 1 0 1.966l-5.558 1.051a2 2 0 0 0-1.594 1.594l-1.051 5.558a1 1 0 0 1-1.966 0l-1.051-5.558a2 2 0 0 0-1.594-1.594l-5.558-1.051a1 1 0 0 1 0-1.966l5.558-1.051a2 2 0 0 0 1.594-1.594z"/><path d="M20 2v4"/><path d="M22 4h-4"/><circle cx="4" cy="20" r="2"/></svg>',
  map:         '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"/><path d="M15 5.764v15"/><path d="M9 3.236v15"/></svg>',
};

// ==================== Storage ====================
const STORAGE_KEY = 'knb-mp-editor-state-v1';

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    const data = JSON.parse(raw);
    if (data.markdown != null) state.markdown = data.markdown;
    if (data.theme) state.theme = data.theme;
    if (data.codeTheme) state.codeTheme = data.codeTheme;
    if (typeof data.darkPreview === 'boolean') state.darkPreview = data.darkPreview;
    if (typeof data.showProgress === 'boolean') state.showProgress = data.showProgress;
    if (data.fontScale) state.fontScale = data.fontScale;
    if (data.keymap && typeof data.keymap === 'object') state.keymap = data.keymap;
  } catch (e) { /* ignore */ }
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      markdown: state.markdown,
      theme: state.theme,
      codeTheme: state.codeTheme,
      darkPreview: state.darkPreview,
      showProgress: state.showProgress,
      fontScale: state.fontScale,
      keymap: state.keymap,
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

// Custom renderer to match original yuan.html heading structure
const headingRenderer = new marked.Renderer();
let h2RenderCount = 0;
let h2RenderTotal = 0;
headingRenderer.heading = function(text, level) {
  const t = getThemeCSS();
  if (level === 1) {
    return `<h1 style="margin:1.6em 8px 1em;color:${t.h2Dark};font-size:22px;font-weight:300;text-align:center;line-height:1.5;border:0"><strong style="color:${t.h2Dark};font-weight:600;margin-right:8px">/</strong>${text}<strong style="color:${t.h2Dark};font-weight:600;margin-left:8px">/</strong></h1>\n`;
  }
  if (level === 2) {
    h2RenderCount++;
    const pct = h2RenderTotal > 0 ? Math.round((h2RenderCount / h2RenderTotal) * 100) : 100;
    return `<h2 style="margin:0 8px;padding:0;line-height:9px;min-height:9px;border-radius:10px;background:linear-gradient(to right,${t.h2Dark} ${pct}%,${t.h2Mid} ${pct}%);color:white;font-size:0;border:0;box-sizing:border-box">&nbsp; &nbsp;</h2><p class="h2-progress-title" style="margin:0.6em 8px 1em;color:${t.titleText};font-size:20px;font-weight:600;line-height:1.5"><strong style="color:${t.titleText};font-weight:600;">${text}</strong></p>\n`;
  }
  if (level === 3) {
    return `<h3 style="margin:0 8px;padding:0;line-height:5px;min-height:5px;border-radius:10px;background:linear-gradient(to right,${t.h3Dark},${t.h3Mid});color:white;font-size:0;border:0;box-sizing:border-box">&nbsp; &nbsp;</h3><p class="h3-progress-title" style="margin:0.6em 8px 0.8em;color:${t.titleText};font-size:18px;font-weight:600;line-height:1.5"><strong style="color:${t.titleText};font-weight:600;">${text}</strong></p>\n`;
  }
  if (level === 4) {
    return `<h4 style="margin:1.6em 8px 0.6em;color:${t.titleText};font-size:17px;font-weight:600;line-height:1.5;">${text}</h4>\n`;
  }
  return `<h${level}>${text}</h${level}>\n`;
};

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

// Parse ::: chat block lines → turns
function parseChatLines(text) {
  const lines = text.split('\n').filter(l => l.trim());
  const turns = [];
  let current = null;
  for (const line of lines) {
    const m = line.match(/^([\u4e00-\u9fff\w\s]+?)\s*[:：]\s*(.+)$/);
    if (m) {
      if (current) turns.push(current);
      current = { speaker: m[1].trim(), message: m[2].trim() };
    } else if (current) {
      current.message += '\n' + line;
    }
  }
  if (current) turns.push(current);
  return turns;
}

function renderChat(text) {
  const tokens = getThemeTokens();
  const turns = parseChatLines(text);
  if (turns.length === 0) return '';
  const speakers = [...new Set(turns.map(t => t.speaker))];
  const emoji = (name) => SPEAKER_EMOJIS[speakers.indexOf(name) % SPEAKER_EMOJIS.length];
  const color = (name) => speakers.indexOf(name) === 0 ? tokens.h2Dark : tokens.h3Dark;
  const esc = (s) => s.replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let html = '<section class="knb-chat">';
  for (const t of turns) {
    const segs = t.message.split(/\n\s*\n/).filter(Boolean);
    const msgHtml = segs.map(p => `<p style="margin:0.3em 0;padding:0;color:rgb(43,43,43);font-size:15px;line-height:1.7;letter-spacing:1px;text-align:left;">${esc(p)}</p>`).join('');
    html += `<section class="knb-chat-turn"><p style="margin:0 0 4px;padding:0;color:${color(t.speaker)};font-size:13px;font-weight:600;letter-spacing:0;line-height:1.4;text-align:left;"><span style="color:initial;margin-right:4px;">${emoji(t.speaker)}</span>${esc(t.speaker)}</p>${msgHtml}</section>`;
  }
  return html + '</section>';
}

function preprocessBlocks(md) {
  // Chat first — render directly (marked skips HTML, so post-process won't see it)
  md = md.replace(/^:::\s*chat\s*\n([\s\S]*?)^:::\s*$/gm, (_, text) => {
    return '\n' + renderChat(text) + '\n';
  });
  // Standard containers
  return md.replace(/^:::\s*(\w+)\s*\n([\s\S]*?)^:::\s*$/gm, (_, type, body) => {
    const meta = KNB_BLOCKS[type];
    const cmeta = CONTAINER_META[type];
    if (!meta && !cmeta) return _;
    const bodyTrim = body.trim();
    const t = getThemeCSS();
    const borderRgba = t.h2Mid.startsWith('rgb') ? hexToRgba(hexFromRgb(t.h2Mid), 0.5) : hexToRgba(t.h2Mid, 0.5);
    // Split body into paragraphs and wrap each
    const paras = bodyTrim.split(/\n\s*\n/).filter(Boolean).map(p => `<p style="margin:0.4em 0;padding:0;color:rgb(43,43,43);font-size:inherit;line-height:inherit;letter-spacing:inherit;text-align:inherit;">${p}</p>`).join('\n');
    if (type === 'intro') {
      return `\n<section class="container-intro" style="margin:1.6em 8px 2em;padding:0.9em 0.4em;border: 1px solid #eee;border-radius:0;background:transparent;">\n${paras}\n</section>\n`;
    }
    if (type === 'highlight') {
      return `\n<section class="container-highlight" style="margin:1.6em 8px;padding:0;text-align:center;border:0;border-radius:0;background:transparent;"><span class="quote-mark quote-mark-left" style="display:block;color:${t.h2Dark};font-size:36px;font-weight:700;line-height:0.8;font-family:Georgia,'Times New Roman',serif;text-align:left;padding-left:8px;">\u201c</span>${paras}<span class="quote-mark quote-mark-right" style="display:block;color:${t.h2Dark};font-size:36px;font-weight:700;line-height:0.8;font-family:Georgia,'Times New Roman',serif;text-align:right;padding-right:8px;margin-top:-0.3em;">\u201d</span></section>\n`;
    }
    const icon = cmeta ? cmeta.icon : '';
    const label = cmeta ? cmeta.label : type;
    return `\n<section class="container container-${type}" style="display:block;width:auto;box-sizing:border-box;margin:1.4em 8px;padding:0.6em 14px;background:transparent;border:1px solid ${borderRgba};border-radius:10px;color:rgb(43,43,43);font-size:15px;line-height:28px;letter-spacing:1px;text-align:justify;"><p class="container-label" style="padding:0;font-size:inherit;line-height:inherit;margin:0 0 0.4em 0;font-weight:600;color:${t.h2Dark};letter-spacing:1.5px;text-align:left;">${icon} ${label}</p>\n${paras}\n</section>\n`;
  });
}

// Reading time
function estimateReadingTime(text) {
  const chars = text.length;
  const minutes = Math.max(1, Math.round(chars / 400));
  return { chars, minutes };
}

// Footnote handling
function processFootnotes(md) {
  const defs = {};
  const defRegex = /^\[\^([\w-]+)\]:\s+(.+)$/gm;
  md = md.replace(defRegex, (_, id, text) => { defs[id] = text.trim(); return ''; });
  md = md.replace(/\[\^([\w-]+)\](?!:)/g, (_, id) => {
    if (!defs[id]) return `<sup>[${id}]</sup>`;
    return `<sup id="fnref-${id}"><a href="#fn-${id}">[${id}]</a></sup>`;
  });
  if (Object.keys(defs).length) {
    let fnHtml = '<section class="footnotes"><ol>';
    for (const id of Object.keys(defs)) {
      fnHtml += `<li id="fn-${id}">${defs[id]} <a href="#fnref-${id}" style="margin-left:6px;color:#999;">↩</a></li>`;
    }
    fnHtml += '</ol></section>';
    md += '\n\n' + fnHtml;
  }
  return md;
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
    html += `<section class="article-map__item" style="margin:10px 0;"><p style="margin:0;padding:0;font-size:13px;color:rgb(43,43,43);line-height:1.6;letter-spacing:0;text-align:left;"><span style="color:${t.h2Dark};font-weight:600;margin-right:8px;letter-spacing:0;">${num}</span>${h.text}</p><section class="article-map__bar-wrap" style="margin-top:4px;height:3px;background:rgba(0,0,0,0.06);border-radius:2px;overflow:hidden;"><section class="article-map__bar" style="width:${pct}%;height:3px;background:linear-gradient(to right,${t.h2Dark},${t.h2Mid});border-radius:2px;"><br></section></section></section>`;
  });
  html += '</section>';
  return { html, headings };
}

let lastTOC = { html: '', headings: [] };

function renderMarkdown(md) {
  let processed = preprocessBlocks(md);
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
  // Use custom renderer
  marked.use({ renderer: headingRenderer });
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
  let html = marked.parse(withToc);
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
    if (start === end) {
      // No selection: insert placeholder
      const text = prefix + placeholderText + suffix;
      this.insertText(text, start, end);
      this.setSelection(start + prefix.length, start + prefix.length + placeholderText.length);
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
  h1: () => editor.prefixLines('# '),
  h2: () => editor.prefixLines('## '),
  h3: () => editor.prefixLines('### '),
  h4: () => editor.prefixLines('#### '),
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
  chat: () => {
    editor.insertText('\n\n::: chat\n阿禅: 第一句\n朋友: 回复\n:::\n\n', editor.getSelection().end, editor.getSelection().end);
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
  { id: 'chat',        group: 'special', label: '多角色对话',  run: () => ACTIONS.chat() },

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
  danger: 'Mod+Shift+7', say: 'Mod+Shift+8', chat: 'Mod+Shift+9',

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
      el('div', { class: 'progress-bar', id: 'progress-bar' }),
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

  // Progress bar
  const ps = $('#preview-scroll');
  ps.addEventListener('scroll', updateProgress);
  updateProgress();
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
  row1.appendChild(el('div', { style: 'flex:1' }));
  container.appendChild(row1);

  // ===== Row 1.5: 颜色（平铺直点） =====
  container.appendChild(buildFlatColorRow('颜色', 'outline', FONT_COLORS, (c) => ACTIONS.color(c)));
  // ===== Row 1.5: 背景色（平铺直点） =====
  container.appendChild(buildFlatColorRow('背景色', 'filled', BG_COLORS, (c) => ACTIONS.bg(c)));

  // ===== Row 2: 专有格式 =====
  const row2 = el('div', { class: 'tb-row' });
  row2.appendChild(tbBadge('专有格式', 'filled'));
  row2.appendChild(tbBtn('bookOpen', '摘要段', () => ACTIONS.block('intro'), { iconOnly: true }));
  row2.appendChild(tbBtn('sparkles', '金句', () => ACTIONS.block('highlight'), { iconOnly: true }));
  row2.appendChild(tbBtn('map', '全文导航', ACTIONS.toc, { iconOnly: true }));
  row2.appendChild(separator());
  row2.appendChild(tbBtn('lightbulb', '提示块', () => ACTIONS.block('tip'), { iconOnly: true }));
  row2.appendChild(tbBtn('circleInfo', '说明块', () => ACTIONS.block('info'), { iconOnly: true }));
  row2.appendChild(tbBtn('stickyNote', '笔记块', () => ACTIONS.block('note'), { iconOnly: true }));
  row2.appendChild(tbBtn('warning', '警告块', () => ACTIONS.block('warning'), { iconOnly: true }));
  row2.appendChild(tbBtn('ban', '危险块', () => ACTIONS.block('danger'), { iconOnly: true }));
  row2.appendChild(separator());
  row2.appendChild(tbBtn('messageSquare', '独白', () => ACTIONS.block('say'), { iconOnly: true }));
  row2.appendChild(tbBtn('messagesSquare', '多角色对话', ACTIONS.chat, { iconOnly: true }));
  row2.appendChild(el('div', { style: 'flex:1' }));
  row2.appendChild(tbBtn('undo', '撤销', () => editor.undo(), { iconOnly: true }));
  row2.appendChild(tbBtn('redo', '前进', () => editor.redo(), { iconOnly: true }));
  row2.appendChild(separator());
  row2.appendChild(tbBtn('eraser', '清除', clearSelectionFormatting, { iconOnly: true }));
  row2.appendChild(tbBtn('clear', '清空', clearAll, { iconOnly: true }));
  container.appendChild(row2);

  return container;
}

function tbBadge(text, variant = 'outline') {
  return el('div', { class: 'tb-badge tb-badge-' + variant }, text);
}

function separator() {
  return el('div', { class: 'tb-sep' });
}

// ==================== Flat color rows (直接平铺，点击即设置) ====================
const FONT_COLORS = [
  '#1a1a1a', '#737373', '#dc2626', '#ea580c', '#ca8a04', '#16a34a', '#299480',
  '#0ea5e9', '#6366f1', '#8b5cf6', '#d946ef', '#ec4899', '#fb7185', '#a3a3a3',
  '#fef3c7', '#fed7aa', '#fecaca', '#fecdd3', '#fbcfe8', '#ddd6fe', '#bfdbfe',
  '#a7f3d0', '#fef9c3', '#ffffff',
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
const BG_ALPHA = '1f';
const BG_COLORS = [
  { group: 1, name: '黄色', hex: '#f59e0b' },
  { group: 1, name: '绿色', hex: '#299480' },
  { group: 1, name: '浅绿', hex: '#22c55e' },
  { group: 1, name: '粉色', hex: '#ec4899' },
  { group: 1, name: '红色', hex: '#ef4444' },
  { group: 2, name: '黄色', hex: '#fff066' },
  { group: 2, name: '绿色', hex: '#7eef67' },
  { group: 2, name: '蓝色', hex: '#90def9' },
  { group: 2, name: '粉色', hex: '#f799d1' },
  { group: 2, name: '红色', hex: '#eb4949' },
];

// 背景色已改为平铺行（见 buildFlatColorRow + BG_COLORS），不再使用下拉

function buildBlocksDropdown() {
  const dd = el('div', { class: 'tb-dropdown' });
  const trigger = tbBtn('warning', '特殊容器', null, { iconOnly: true });
  trigger.addEventListener('click', (e) => {
    e.stopPropagation();
    closeAllDropdowns();
    dd.classList.toggle('open');
  });
  dd.appendChild(trigger);

  const items = [
    { id: 'tip',     label: 'tip 提示块' },
    { id: 'info',    label: 'info 说明块' },
    { id: 'note',    label: 'note 笔记块' },
    { id: 'warning', label: 'warning 警告块' },
    { id: 'danger',  label: 'danger 危险块' },
    { id: 'say',     label: 'say 独白' },
    { id: 'highlight', label: 'highlight 金句' },
    { id: 'intro',   label: 'intro 摘要段' },
  ];
  const menu = el('div', { class: 'tb-menu' });
  for (const it of items) {
    const item = el('div', { class: 'item' }, it.label);
    item.addEventListener('click', (e) => {
      e.stopPropagation();
      ACTIONS.block(it.id);
      dd.classList.remove('open');
    });
    menu.appendChild(item);
  }
  // Chat item
  const chatItem = el('div', { class: 'item' }, '多角色对话');
  chatItem.addEventListener('click', (e) => {
    e.stopPropagation();
    ACTIONS.chat();
    dd.classList.remove('open');
  });
  menu.appendChild(chatItem);
  dd.appendChild(menu);
  return dd;
}

function closeAllDropdowns() {
  $$('.tb-dropdown').forEach(d => d.classList.remove('open'));
}

document.addEventListener('click', closeAllDropdowns);

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
  const fontWeight = state.fontWeight === 'bold' ? '500' : (state.fontWeight === 'light' ? '300' : '400');
  const containerBorder = hexToRgba(t.h2Mid, 0.5);
  const containerBorderStr = t.h2Mid.startsWith('rgb') ? hexToRgba(hexFromRgb(t.h2Mid), 0.5) : hexToRgba(t.h2Mid, 0.5);

  return `
.wechat-markdown-root { font-size: 15px; line-height: 28px; color: ${t.bodyColor}; text-align: left; font-weight: ${fontWeight}; letter-spacing: 1px; }
.wechat-markdown-root p { margin: 1.2em 8px; color: ${t.bodyColor}; font-size: 15px; line-height: 28px; letter-spacing: 1px; text-align: justify; }
.wechat-markdown-root h1 { margin: 1.6em 8px 1em; color: ${t.h2Dark}; font-size: 22px; font-weight: 300; text-align: center; line-height: 1.5; border: 0; }
.wechat-markdown-root h1 strong { color: ${t.h2Dark}; font-weight: 600; }
.wechat-markdown-root h2 { margin: 0 8px; padding: 0; line-height: 9px; min-height: 9px; border-radius: 10px; background: transparent; color: white; font-size: 0; border: 0; box-sizing: border-box; }
.wechat-markdown-root .h2-progress-title { margin: 0.6em 8px 1em; color: ${t.titleText}; font-size: 20px; font-weight: 600; line-height: 1.5; }
.wechat-markdown-root .h2-progress-title strong { color: ${t.titleText}; font-weight: 600; }
.wechat-markdown-root h3 { margin: 0 8px; padding: 0; line-height: 5px; min-height: 5px; border-radius: 10px; background: transparent; color: white; font-size: 0; border: 0; box-sizing: border-box; }
.wechat-markdown-root .h3-progress-title { margin: 0.6em 8px 0.8em; color: ${t.titleText}; font-size: 18px; font-weight: 600; line-height: 1.5; }
.wechat-markdown-root .h3-progress-title strong { color: ${t.titleText}; font-weight: 600; }
.wechat-markdown-root h4 { margin: 1.6em 8px 0.6em; color: ${t.titleText}; font-size: 17px; font-weight: 600; line-height: 1.5; }
.wechat-markdown-root strong { color: #1a1a1a; font-weight: 600; }
.wechat-markdown-root em { font-style: italic; }
.wechat-markdown-root s, .wechat-markdown-root del { color: ${t.muted}; text-decoration: line-through; }
.wechat-markdown-root mark { background: ${t.markBg}; color: ${t.h2Dark}; padding: 0 0.3em; border-radius: 2px; }
.wechat-markdown-root ins { text-decoration: underline; text-decoration-color: ${t.h2Dark}; text-underline-offset: 2px; }
.wechat-markdown-root sub, .wechat-markdown-root sup { font-size: 75%; line-height: 0; }
.wechat-markdown-root code { font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace; font-size: 90%; color: #d14; background: rgba(27,31,35,0.05); padding: 2px 5px; border-radius: 4px; }
.wechat-markdown-root pre { margin: 1em 8px; padding: 1em; background: #0d1117; color: #c9d1d9; border-radius: 8px; overflow-x: auto; font-size: 90%; line-height: 1.5; }
.wechat-markdown-root pre code { display: block; background: transparent; color: inherit; padding: 0; border: 0; border-radius: 0; font-size: inherit; white-space: pre; }
.wechat-markdown-root blockquote { margin: 1.4em 8px; padding: 4px 14px; border-left: 4px solid ${t.h2Dark}; border-radius: 0; background: transparent; color: ${t.bodyColor}; font-size: 15px; line-height: 28px; letter-spacing: 1px; text-align: justify; box-sizing: border-box; max-width: 100%; }
.wechat-markdown-root blockquote p { margin: 0.4em 0; padding: 0; color: ${t.bodyColor}; font-size: inherit; line-height: inherit; letter-spacing: inherit; text-align: inherit; }
.wechat-markdown-root ul, .wechat-markdown-root ol { margin: 1em 8px; padding-left: 2em; color: ${t.h2Dark}; }
.wechat-markdown-root ul { list-style-type: disc; }
.wechat-markdown-root ol { list-style-type: decimal; }
.wechat-markdown-root li { margin: 0.4em 0; line-height: 28px; }
.wechat-markdown-root a { color: #576b95; text-decoration: none; }
.wechat-markdown-root img { display: block; margin: 0.6em auto; border-radius: 4px; width: 100%; }
.wechat-markdown-root figure { margin: 1.5em 8px; text-align: center; }
.wechat-markdown-root figcaption { margin-top: 0.4em; color: ${t.muted}; font-size: 0.85em; }
.wechat-markdown-root table { margin: 1.2em 8px; border-collapse: collapse; color: #3f3f3f; font-size: 0.95em; }
.wechat-markdown-root th, .wechat-markdown-root td { border: 1px solid #dfdfdf; padding: 0.4em 0.75em; }
.wechat-markdown-root th { background: rgba(0,0,0,0.04); font-weight: 600; }
.wechat-markdown-root hr { margin: 2em 8px; border: 0; border-top: 1px solid rgba(0,0,0,0.1); }
.wechat-markdown-root .container { display: block; width: auto; box-sizing: border-box; margin: 1.4em 8px; padding: 0.6em 14px; background: transparent; border: 1px solid #eee; border-radius: 10px; color: ${t.bodyColor}; font-size: 15px; line-height: 28px; letter-spacing: 1px; text-align: justify; }
.wechat-markdown-root .container p { margin: 0.4em 0; padding: 0; color: ${t.bodyColor}; font-size: inherit; line-height: inherit; letter-spacing: inherit; text-align: inherit; }
.wechat-markdown-root .container p.container-label { margin: 0 0 0.4em 0; font-weight: 600; color: ${t.h2Dark}; letter-spacing: 1.5px; text-align: left; }
.wechat-markdown-root .container p:last-child { margin-bottom: 0; }
.wechat-markdown-root .container-highlight { margin: 1.6em 8px; padding: 0; text-align: center; border: 0; border-radius: 0; background: transparent; }
.wechat-markdown-root .container-highlight .quote-mark { display: block; color: ${t.h2Dark}; font-size: 36px; font-weight: 700; line-height: 0.8; font-family: Georgia, "Times New Roman", serif; }
.wechat-markdown-root .container-highlight .quote-mark-left { text-align: left; padding-left: 8px; }
.wechat-markdown-root .container-highlight .quote-mark-right { text-align: right; padding-right: 8px; margin-top: -0.3em; }
.wechat-markdown-root .container-highlight p { margin: 0.4em 12px; color: ${t.h2Dark}; font-size: 16px; font-weight: 500; line-height: 1.75; letter-spacing: 0.04em; text-align: center; }
.wechat-markdown-root .container-intro { margin: 1.6em 8px 2em; padding: 0.9em 0.4em; border: 1px solid #eee; border-radius: 0; background: transparent; }
.wechat-markdown-root .container-intro p { margin: 0.3em 0; color: ${t.introText}; font-size: 15px; line-height: 1.85; letter-spacing: 0.04em; text-align: left; }
.wechat-markdown-root .container-intro .article-map { margin: 0 0 0 0; }
.wechat-markdown-root .container-intro .article-map p { margin: 0; padding: 0; }
.wechat-markdown-root .knb-chat { margin: 1.4em 8px; }
.wechat-markdown-root .footnotes { margin-top: 2em; color: ${t.muted}; font-size: 0.9em; }
.wechat-markdown-root .footnotes p { color: ${t.muted}; font-size: inherit; line-height: 1.5; letter-spacing: 0.5px; margin: 1em 8px; }
.wechat-markdown-root .footnotes-list { margin: 0.6em 0; padding-left: 0; list-style: none; color: inherit; }
.wechat-markdown-root .footnote-item { margin: 0.4em 0; }
.wechat-markdown-root .footnote-ref { color: ${t.h2Dark}; font-size: 0.85em; font-weight: 500; margin: 0 1px; vertical-align: super; line-height: 0; }
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
  content.style.fontSize = (15 * state.fontScale) + 'px';
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

function updateProgress() {
  const ps = $('#preview-scroll');
  const pb = $('#progress-bar');
  if (!ps || !pb) return;
  if (!state.showProgress) { pb.style.width = '0'; return; }
  const max = ps.scrollHeight - ps.clientHeight;
  const pct = max > 0 ? (ps.scrollTop / max) * 100 : 0;
  pb.style.width = pct + '%';
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
  dlg.appendChild(body);

  if (name === 'settings' || name === 'about' || name === 'help') {
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
  const tabEditor = el('div', { class: 'tab', 'data-tab': 'editor' }, '编辑器');
  const tabKeys = el('div', { class: 'tab', 'data-tab': 'keys' }, '快捷键');
  const tabReset = el('div', { class: 'tab', 'data-tab': 'reset' }, '存储');
  tabs.appendChild(tabStyle);
  tabs.appendChild(tabEditor);
  tabs.appendChild(tabKeys);
  tabs.appendChild(tabReset);
  body.appendChild(tabs);

  // Theme tab - grouped by category
  const stylePanel = el('div', { class: 'settings-panel' });
  // Heading style
  stylePanel.appendChild(el('div', { class: 'field' },
    el('label', {}, '标题样式'),
    el('div', { class: 'radio-row' },
      el('label', { class: 'radio-item' + (state.headingStyle === 'numbers' ? ' active' : '') }, '数字'),
      el('label', { class: 'radio-item' + (state.headingStyle === 'eyes' ? ' active' : '') }, '眼睛'),
      el('label', { class: 'radio-item' + (state.headingStyle === 'none' ? ' active' : '') }, '无'),
    ),
  ));
  // Font weight
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

  // Heading style handlers
  $$('.radio-row', stylePanel).forEach(row => {
    if (!row.querySelector('.radio-item')) return;
    row.addEventListener('click', (e) => {
      const item = e.target.closest('.radio-item');
      if (!item) return;
      row.querySelectorAll('.radio-item').forEach(r => r.classList.remove('active'));
      item.classList.add('active');
      const label = item.textContent;
      if (label === '数字') state.headingStyle = 'numbers';
      else if (label === '眼睛') state.headingStyle = 'eyes';
      else if (label === '无') state.headingStyle = 'none';
      else if (label === '细') state.fontWeight = 'light';
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

  // Editor tab
  const editorPanel = el('div', { class: 'settings-panel hidden' });
  editorPanel.appendChild(switchRow('显示阅读进度', '顶部显示阅读进度条', state.showProgress, (on) => {
    state.showProgress = on;
    updateProgress();
    saveState();
  }));
  editorPanel.appendChild(fieldRow('字号缩放', `${state.fontScale.toFixed(1)}x`, el('input', {
    type: 'range', min: '0.8', max: '1.4', step: '0.05', value: state.fontScale,
    oninput: (e) => {
      state.fontScale = parseFloat(e.target.value);
      applyPreviewTheme();
      const label = e.target.parentElement.querySelector('.range-val');
      if (label) label.textContent = `${state.fontScale.toFixed(2)}x`;
      saveState();
    },
    style: 'width:100%;',
  })));
  body.appendChild(editorPanel);

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
        state.showProgress = true;
        state.fontScale = 1;
        state.headingStyle = 'numbers';
        state.fontWeight = 'regular';
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

  // Tab switching
  tabs.addEventListener('click', (e) => {
    const t = e.target.closest('.tab');
    if (!t) return;
    $$('.tab', tabs).forEach(x => x.classList.remove('active'));
    t.classList.add('active');
    const name = t.dataset.tab;
    stylePanel.classList.toggle('hidden', name !== 'style');
    editorPanel.classList.toggle('hidden', name !== 'editor');
    keysPanel.classList.toggle('hidden', name !== 'keys');
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

function fieldRow(label, valueDisplay, input) {
  return el('div', { class: 'field' },
    el('div', { class: 'row between' },
      el('label', { style: 'margin-bottom:0;' }, label),
      el('span', { class: 'range-val text-muted', style: 'font-size:12px;' }, valueDisplay),
    ),
    el('div', { style: 'margin-top:6px;' }, input),
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
        <li>支持脚注、表格、任务清单、代码高亮、多角色对话</li>
        <li>公众号外链自动转脚注 / 内链保留可点击</li>
        <li>数据存到浏览器本地，刷新不丢</li>
      </ul>
      <h4>使用提示</h4>
      <ul>
        <li>在左侧编辑 Markdown，右侧手机里实时显示排版</li>
        <li>底部工具栏可一键插入常用格式</li>
        <li>满意后点 <code>复制</code>，即可粘贴到公众号后台发布</li>
        <li>顶部工具栏可一键插入常用格式</li>
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
