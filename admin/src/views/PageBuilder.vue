<template>
<div class="builder-shell">
<div class="top-toolbar">
<div class="toolbar-left"><span class="logo"><i class="ri-brush-3-line"></i> 店铺装修</span><span class="page-tag">首页</span></div>
<div class="toolbar-center">
<button :class="['tool-btn',{active:!previewMode}]" @click="previewMode=false"><i class="ri-edit-line"></i> 编辑</button>
<button :class="['tool-btn',{active:previewMode}]" @click="previewMode=true"><i class="ri-eye-line"></i> 预览</button>
<button class="tool-btn" @click="undo" :disabled="historyIdx<=0"><i class="ri-arrow-go-back-line"></i></button>
<button class="tool-btn" @click="redo" :disabled="historyIdx>=history.length-1"><i class="ri-arrow-go-forward-line"></i></button>
<button class="tool-btn" @click="clearAll"><i class="ri-delete-bin-line"></i></button>
</div>
<div class="toolbar-right">
<button class="tool-btn" @click="showTemplates=true"><i class="ri-layout-line"></i> 模板</button>
<button class="tool-btn" @click="showGlobal=true"><i class="ri-settings-3-line"></i> 全局</button>
<button class="btn btn-outline btn-sm" @click="saveDraft">保存草稿</button>
<button class="btn btn-primary btn-sm" @click="publish">发布</button>
<span v-if="saveStatus==='saving'" class="save-stat"><i class="ri-loader-4-line ri-spin"></i> 保存中</span>
<span v-if="saveStatus==='saved'" class="save-stat ok"><i class="ri-check-line"></i> 已保存</span>
<span v-if="saveStatus==='error'" class="save-stat err"><i class="ri-close-line"></i> 失败</span>
</div>
</div>
<div class="builder-body" v-show="!previewMode">
<div class="lib-panel">
<div class="panel-tabs">
<div v-for="t in libTabs" :key="t.key" :class="['ptab',{on:libTab===t.key}]" @click="libTab=t.key">{{t.label}}</div>
</div>
<div class="lib-list" v-show="libTab==='basic'">
<div v-for="c in baseComps" :key="c.type" class="lib-item" draggable="true" @dragstart="onLibDrag($event,c)">
<div class="lib-icon"><i :class="c.icon"></i></div><div class="lib-name">{{c.label}}</div>
</div>
</div>
<div class="lib-list" v-show="libTab==='market'">
<div v-for="c in marketComps" :key="c.type" class="lib-item" draggable="true" @dragstart="onLibDrag($event,c)">
<div class="lib-icon"><i :class="c.icon"></i></div><div class="lib-name">{{c.label}}</div>
</div>
</div>
<div class="lib-list" v-show="libTab==='content'">
<div v-for="c in contentComps" :key="c.type" class="lib-item" draggable="true" @dragstart="onLibDrag($event,c)">
<div class="lib-icon"><i :class="c.icon"></i></div><div class="lib-name">{{c.label}}</div>
</div>
</div>
<div class="lib-list" v-show="libTab==='tool'">
<div v-for="c in toolComps" :key="c.type" class="lib-item" draggable="true" @dragstart="onLibDrag($event,c)">
<div class="lib-icon"><i :class="c.icon"></i></div><div class="lib-name">{{c.label}}</div>
</div>
</div>
</div>
<div class="canvas-panel" @click.self="selIdx=-1">
<div class="phone">
<div class="phone-top"><div class="phone-notch"></div></div>
<div class="phone-screen" @click.self="selIdx=-1">
<div class="s-navbar" v-if="global.navStyle!=='none'" :style="navBarStyle">
<div class="s-status"><span>9:41</span></div>
<div class="s-title" v-if="global.navStyle==='default'">{{global.pageTitle||'首页'}}</div>
<div class="s-search" v-if="global.navStyle==='search'"><i class="ri-search-line"></i> 搜索</div>
</div>
<div class="s-body" :style="{background:global.bgColor||'#f5f6fa'}" @dragover.prevent @drop.prevent="onCanvasDrop">
<div v-for="(c,i) in components" :key="c._id" :class="['s-comp',{selected:selIdx===i}]" @click.stop="selIdx=i" draggable="true" @dragstart.stop="onReorderStart($event,i)" @dragover.prevent @drop.stop="onReorderDrop($event,i)">
<div v-if="selIdx===i" class="s-comp-bar">
<span class="s-comp-name">{{getCompLabel(c.type)}}</span>
<button @click.stop="moveUp(i)" :disabled="i===0"><i class="ri-arrow-up-s-line"></i></button>
<button @click.stop="moveDown(i)" :disabled="i===components.length-1"><i class="ri-arrow-down-s-line"></i></button>
<button @click.stop="copyComp(i)"><i class="ri-file-copy-line"></i></button>
<button @click.stop="delComp(i)" class="del"><i class="ri-delete-bin-line"></i></button>
</div>
<CompRenderer :type="c.type" :props="c.props" :global="global" />
</div>
<div v-if="!components.length" class="s-empty" @dragover.prevent @drop.prevent="onCanvasDrop">
<i class="ri-drag-drop-line"></i><p>拖拽组件到这里</p>
</div>
</div>
<div class="s-tabbar" v-if="global.showTabbar">
<div v-for="t in global.tabItems" :key="t.name" :class="['s-tab',{on:t.active}]">
<i :class="t.icon"></i><span>{{t.name}}</span>
</div>
</div>
</div>
<div class="phone-bottom"><div class="phone-home"></div></div>
</div>
</div>
<div class="prop-panel">
<div class="prop-title">{{selIdx>=0?'属性编辑':'组件列表'}}</div>
<div v-if="selIdx>=0&&components[selIdx]" class="prop-body">
<PropsEditor :comp="components[selIdx]" @change="saveHistory" />
</div>
<div v-else class="prop-empty">
<i class="ri-cursor-line"></i><p>选择组件进行编辑</p>
</div>
</div>
</div>
<div class="preview-mode" v-show="previewMode">
<div class="phone" style="margin:20px auto">
<div class="phone-top"><div class="phone-notch"></div></div>
<div class="phone-screen">
<div class="s-navbar" :style="navBarStyle" v-if="global.navStyle!=='none'">
<div class="s-status"><span>9:41</span></div>
<div class="s-title" v-if="global.navStyle==='default'">{{global.pageTitle||'首页'}}</div>
<div class="s-search" v-if="global.navStyle==='search'"><i class="ri-search-line"></i> 搜索</div>
</div>
<div class="s-body" :style="{background:global.bgColor||'#f5f6fa'}">
<CompRenderer v-for="c in components" :key="c._id" :type="c.type" :props="c.props" :global="global" />
</div>
<div class="s-tabbar" v-if="global.showTabbar">
<div v-for="t in global.tabItems" :key="t.name" :class="['s-tab',{on:t.active}]">
<i :class="t.icon"></i><span>{{t.name}}</span>
</div>
</div>
</div>
<div class="phone-bottom"><div class="phone-home"></div></div>
</div>
</div>
<div v-if="showTemplates" class="modal-overlay" @click.self="showTemplates=false">
<div class="modal-box">
<h3><i class="ri-layout-line"></i> 选择模板 <button class="btn btn-sm" style="float:right" @click="showTemplates=false">x</button></h3>
<div class="tpl-grid">
<div v-for="t in templates" :key="t.name" class="tpl-card" @click="applyTemplate(t)">
<div class="tpl-preview" :style="{background:t.color}">
<div class="tpl-mock">
<div v-for="(l,i) in t.preview" :key="i" :style="{height:l+'px',background:i%2?'rgba(255,255,255,.4)':'rgba(255,255,255,.25)',marginBottom:'4px',borderRadius:'3px'}"></div>
</div>
</div>
<div class="tpl-name">{{t.name}}</div>
</div>
</div>
</div>
</div>
<div v-if="showGlobal" class="modal-overlay" @click.self="showGlobal=false">
<div class="modal-box" style="width:520px">
<h3><i class="ri-settings-3-line"></i> 全局设置 <button class="btn btn-sm" style="float:right" @click="showGlobal=false">x</button></h3>
<div class="global-form">
<div class="gf-row"><label>页面标题</label><input v-model="global.pageTitle" class="fi" placeholder="首页" /></div>
<div class="gf-row"><label>背景颜色</label><div style="display:flex;gap:8px;align-items:center"><input type="color" v-model="global.bgColor" class="fcolor" /><input v-model="global.bgColor" class="fi" style="flex:1" placeholder="#f5f6fa" /></div></div>
<div class="gf-row"><label>导航样式</label><select v-model="global.navStyle" class="fi"><option value="default">默认标题</option><option value="search">搜索栏</option><option value="none">隐藏</option></select></div>
<div class="gf-row"><label>导航背景</label><input type="color" v-model="global.navBgColor" class="fcolor" /></div>
<div class="gf-row"><label>导航文字</label><input type="color" v-model="global.navTextColor" class="fcolor" /></div>
<div class="gf-row"><label>显示底部栏</label><label class="switch-sm"><input type="checkbox" v-model="global.showTabbar" /> 显示</label></div>
<template v-if="global.showTabbar">
<div class="gf-row" v-for="(t,i) in global.tabItems" :key="i">
<label>Tab {{i+1}}</label>
<div style="display:flex;gap:6px;flex:1">
<select v-model="t.icon" class="fi" style="width:140px">
<option value="ri-home-4-line">首页</option><option value="ri-chat-3-line">消息</option>
<option value="ri-file-list-3-line">订单</option><option value="ri-user-3-line">我的</option>
<option value="ri-search-line">搜索</option><option value="ri-heart-line">收藏</option>
<option value="ri-shopping-bag-3-line">商城</option><option value="ri-notification-3-line">通知</option>
</select>
<input v-model="t.name" class="fi" style="flex:1" placeholder="名称" />
<label class="switch-sm" style="white-space:nowrap"><input type="checkbox" v-model="t.active" /> 激活</label>
</div>
</div>
</template>
<div class="gf-row"><label>分享标题</label><input v-model="global.shareTitle" class="fi" placeholder="微信分享标题" /></div>
<div class="gf-row"><label>分享图片URL</label><input v-model="global.shareImage" class="fi" placeholder="https://..." /></div>
<button class="btn btn-primary btn-sm" style="width:100%;margin-top:12px" @click="showGlobal=false;saveHistory()">确定</button>
</div>
</div>
</div>
<div v-if="showConfirm" class="modal-overlay" @click.self="showConfirm=false">
<div class="modal-box" style="width:360px;text-align:center">
<h3>{{confirmTitle}}</h3>
<p style="color:#888;margin:12px 0">{{confirmMsg}}</p>
<div style="display:flex;gap:10px;justify-content:center">
<button class="btn btn-outline" @click="showConfirm=false">取消</button>
<button class="btn btn-primary" @click="confirmAction();showConfirm=false">确定</button>
</div>
</div>
</div>
</div>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import CompRenderer from '@/components/CompRenderer.vue'
import PropsEditor from '@/components/PropsEditor.vue'
import api from '@/api'

// ---- Component Libraries ----
const libTabs = [
  { key: 'basic', label: '基础' },
  { key: 'market', label: '营销' },
  { key: 'content', label: '内容' },
  { key: 'tool', label: '工具' },
]
const libTab = ref('basic')

const baseComps = [
  { type: 'banner', label: '轮播图', icon: 'ri-image-line', defaultProps: { images: [], height: 160, interval: 3000, dots: true, radius: 8 } },
  { type: 'search', label: '搜索栏', icon: 'ri-search-line', defaultProps: { placeholder: '搜索服务', bgColor: '#fff', radius: 20, hotWords: [] } },
  { type: 'notice', label: '公告栏', icon: 'ri-volume-up-line', defaultProps: { text: '重要通知内容', ico: 'ri-volume-up-line', bgColor: '#fff7e6', color: '#fa8c16', speed: 40 } },
  { type: 'navGrid', label: '导航宫格', icon: 'ri-apps-line', defaultProps: { items: [{ icon: 'ri-service-line', name: '服务', link: '' },{ icon: 'ri-calendar-line', name: '预约', link: '' },{ icon: 'ri-star-line', name: '推荐', link: '' },{ icon: 'ri-more-line', name: '更多', link: '' }], columns: 4, gutter: 8 } },
  { type: 'titleBar', label: '标题栏', icon: 'ri-text', defaultProps: { title: '热门推荐', subtitle: '', moreText: '更多', moreLink: '', align: 'left' } },
  { type: 'imageAd', label: '图片广告', icon: 'ri-advertisement-line', defaultProps: { src: '', link: '', width: '100%', height: 120, radius: 8 } },
]

const marketComps = [
  { type: 'coupon', label: '优惠券', icon: 'ri-coupon-line', defaultProps: { coupons: [], style: 'card', showCount: 3 } },
  { type: 'countdown', label: '倒计时', icon: 'ri-timer-line', defaultProps: { endTime: '', title: '限时抢购', bgColor: '#ff4d4f', color: '#fff' } },
  { type: 'groupBuy', label: '拼团', icon: 'ri-group-line', defaultProps: { title: '拼团活动', products: [] } },
  { type: 'seckill', label: '秒杀', icon: 'ri-flashlight-line', defaultProps: { title: '秒杀专区', products: [], showPrice: true, showProgress: true } },
]

const contentComps = [
  { type: 'goodsRow', label: '商品行', icon: 'ri-shopping-bag-3-line', defaultProps: { title: '精选商品', goods: [], layout: 'scroll', showBadge: true, columns: 2 } },
  { type: 'articleList', label: '文章列表', icon: 'ri-article-line', defaultProps: { title: '最新资讯', count: 3, showCover: true, showDate: true } },
  { type: 'videoPlayer', label: '视频播放', icon: 'ri-video-line', defaultProps: { src: '', poster: '', autoplay: false, height: 200 } },
  { type: 'richText', label: '富文本', icon: 'ri-file-text-line', defaultProps: { content: '<p>编辑内容...</p>', padding: 12 } },
]

const toolComps = [
  { type: 'floatingBtn', label: '悬浮按钮', icon: 'ri-customer-service-2-line', defaultProps: { text: '客服', ico: 'ri-customer-service-2-line', position: 'right', bottom: 80, link: '' } },
  { type: 'divider', label: '分割线', icon: 'ri-separator', defaultProps: { height: 1, color: '#eee', margin: '12px 0', style: 'solid' } },
  { type: 'blank', label: '空白占位', icon: 'ri-layout-bottom-line', defaultProps: { height: 10, bgColor: 'transparent' } },
]

const allComps = [...baseComps, ...marketComps, ...contentComps, ...toolComps]

// ---- State ----
const previewMode = ref(false)
const selIdx = ref(-1)
const showTemplates = ref(false)
const showGlobal = ref(false)
const saveStatus = ref('')
const showConfirm = ref(false)
const confirmTitle = ref('')
const confirmMsg = ref('')
let confirmAction = () => {}

const global = reactive({
  pageTitle: '首页',
  bgColor: '#f5f6fa',
  navStyle: 'default',
  navBgColor: '#ffffff',
  navTextColor: '#333333',
  showTabbar: true,
  shareTitle: '',
  shareImage: '',
  tabItems: [
    { icon: 'ri-home-4-line', name: '首页', active: true },
    { icon: 'ri-chat-3-line', name: '消息', active: false },
    { icon: 'ri-file-list-3-line', name: '订单', active: false },
    { icon: 'ri-user-3-line', name: '我的', active: false },
  ],
})

const components = ref([])

// ---- Undo/Redo History ----
const history = ref([])
const historyIdx = ref(-1)

function saveHistory() {
  const snap = JSON.parse(JSON.stringify({ components: components.value, global: { ...global } }))
  historyIdx.value++
  history.value = history.value.slice(0, historyIdx.value)
  history.value.push(snap)
  if (history.value.length > 50) { history.value.shift(); historyIdx.value-- }
}

function undo() {
  if (historyIdx.value <= 0) return
  historyIdx.value--
  restoreSnapshot(history.value[historyIdx.value])
}

function redo() {
  if (historyIdx.value >= history.value.length - 1) return
  historyIdx.value++
  restoreSnapshot(history.value[historyIdx.value])
}

function restoreSnapshot(snap) {
  components.value = JSON.parse(JSON.stringify(snap.components))
  Object.assign(global, JSON.parse(JSON.stringify(snap.global)))
  selIdx.value = -1
}

// ---- Helpers ----
let idCounter = Date.now()
function genId() { return 'c_' + (idCounter++) }

function getCompLabel(type) {
  const c = allComps.find(x => x.type === type)
  return c ? c.label : type
}

function getCompDefaults(type) {
  const c = allComps.find(x => x.type === type)
  return c ? JSON.parse(JSON.stringify(c.defaultProps)) : {}
}

// ---- Component Operations ----
function onLibDrag(e, comp) {
  e.dataTransfer.setData('text/plain', comp.type)
  e.dataTransfer.effectAllowed = 'copy'
}

function onCanvasDrop(e) {
  const type = e.dataTransfer.getData('text/plain')
  if (!type) return
  const defProps = getCompDefaults(type)
  components.value.push({ _id: genId(), type, props: defProps })
  selIdx.value = components.value.length - 1
  saveHistory()
}

function onReorderStart(e, idx) {
  e.dataTransfer.setData('text/plain', String(idx))
  e.dataTransfer.effectAllowed = 'move'
}

function onReorderDrop(e, targetIdx) {
  const fromIdx = parseInt(e.dataTransfer.getData('text/plain'))
  if (isNaN(fromIdx) || fromIdx === targetIdx) return
  const item = components.value.splice(fromIdx, 1)[0]
  components.value.splice(targetIdx, 0, item)
  selIdx.value = targetIdx
  saveHistory()
}

function moveUp(i) {
  if (i > 0) {
    [components.value[i], components.value[i - 1]] = [components.value[i - 1], components.value[i]]
    selIdx.value = i - 1
    saveHistory()
  }
}

function moveDown(i) {
  if (i < components.value.length - 1) {
    [components.value[i], components.value[i + 1]] = [components.value[i + 1], components.value[i]]
    selIdx.value = i + 1
    saveHistory()
  }
}

function copyComp(i) {
  const clone = JSON.parse(JSON.stringify(components.value[i]))
  clone._id = genId()
  components.value.splice(i + 1, 0, clone)
  selIdx.value = i + 1
  saveHistory()
}

function delComp(i) {
  components.value.splice(i, 1)
  selIdx.value = -1
  saveHistory()
}

function clearAll() {
  confirmTitle.value = '清空所有组件'
  confirmMsg.value = '确定要清空画布上所有组件吗？此操作可撤销。'
  confirmAction = () => { components.value = []; selIdx.value = -1; saveHistory() }
  showConfirm.value = true
}

// ---- Templates ----
const templates = [
  {
    name: '默认风格', color: '#4A90D9', preview: [24, 12, 40, 16, 12, 30, 16],
    components: [
      { type: 'search', props: { placeholder: '搜索服务', bgColor: '#fff', radius: 20 } },
      { type: 'banner', props: { images: [], height: 160, dots: true, radius: 8 } },
      { type: 'navGrid', props: { items: [{ icon: 'ri-service-line', name: '服务' }, { icon: 'ri-calendar-line', name: '预约' }, { icon: 'ri-star-line', name: '推荐' }, { icon: 'ri-more-line', name: '更多' }], columns: 4 } },
      { type: 'notice', props: { text: '欢迎使用任务接单平台', ico: 'ri-volume-up-line', bgColor: '#fff7e6', color: '#fa8c16' } },
      { type: 'titleBar', props: { title: '热门服务', moreText: '更多' } },
      { type: 'goodsRow', props: { title: '精选服务', goods: [], layout: 'scroll', showBadge: true, columns: 2 } },
    ]
  },
  {
    name: '营销风格', color: '#FF6B6B', preview: [28, 10, 20, 18, 14, 16, 12, 24],
    components: [
      { type: 'countdown', props: { endTime: '', title: '限时抢购', bgColor: '#ff4d4f', color: '#fff' } },
      { type: 'banner', props: { images: [], height: 150, dots: true, radius: 8 } },
      { type: 'coupon', props: { coupons: [], style: 'card', showCount: 3 } },
      { type: 'seckill', props: { title: '秒杀专区', products: [] } },
      { type: 'titleBar', props: { title: '爆款推荐', moreText: '全部' } },
      { type: 'goodsRow', props: { title: '', goods: [], layout: 'grid', columns: 2 } },
    ]
  },
  {
    name: '极简风格', color: '#2D2D2D', preview: [20, 10, 8, 30, 12, 20],
    components: [
      { type: 'banner', props: { images: [], height: 180, dots: false, radius: 0 } },
      { type: 'navGrid', props: { items: [{ icon: 'ri-service-line', name: '服务' }, { icon: 'ri-star-line', name: '推荐' }], columns: 4 } },
      { type: 'titleBar', props: { title: '精选', align: 'center' } },
      { type: 'goodsRow', props: { title: '', goods: [], layout: 'grid', columns: 2 } },
    ]
  },
  {
    name: '品牌风格', color: '#7C5CFC', preview: [16, 32, 10, 14, 18, 20, 12],
    components: [
      { type: 'banner', props: { images: [], height: 200, dots: true, radius: 0 } },
      { type: 'notice', props: { text: '品质服务，值得信赖', bgColor: '#f0f0ff', color: '#7C5CFC' } },
      { type: 'navGrid', props: { items: [{ icon: 'ri-service-line', name: '服务' }, { icon: 'ri-calendar-line', name: '预约' }, { icon: 'ri-star-line', name: '推荐' }, { icon: 'ri-more-line', name: '更多' }], columns: 4 } },
      { type: 'titleBar', props: { title: '品牌服务', subtitle: '专业认证' } },
      { type: 'goodsRow', props: { title: '', goods: [], layout: 'grid', columns: 2 } },
    ]
  },
]

function applyTemplate(tpl) {
  confirmTitle.value = '应用模板'
  confirmMsg.value = '确定应用模板「' + tpl.name + '」？当前画布内容将被替换。'
  confirmAction = () => {
    components.value = tpl.components.map(c => ({
      _id: genId(),
      type: c.type,
      props: JSON.parse(JSON.stringify(c.props || getCompDefaults(c.type)))
    }))
    selIdx.value = -1
    saveHistory()
    showTemplates.value = false
  }
  showConfirm.value = true
}

// ---- Nav Bar Style ----
const navBarStyle = computed(() => ({
  background: global.navBgColor || '#ffffff',
  color: global.navTextColor || '#333333',
}))

// ---- Save / Publish ----
async function saveDraft() {
  saveStatus.value = 'saving'
  try {
    const data = { components: JSON.parse(JSON.stringify(components.value)), global: JSON.parse(JSON.stringify(global)) }
    await api.put('/page-config/home', { data: JSON.stringify(data) })
    saveStatus.value = 'saved'
    setTimeout(() => { saveStatus.value = '' }, 2000)
  } catch (e) {
    console.error('Save failed:', e)
    saveStatus.value = 'error'
    setTimeout(() => { saveStatus.value = '' }, 3000)
  }
}

async function publish() {
  confirmTitle.value = '确认发布'
  confirmMsg.value = '发布后将立即更新小程序首页展示，确定发布？'
  confirmAction = async () => {
    saveStatus.value = 'saving'
    try {
      const data = { components: JSON.parse(JSON.stringify(components.value)), global: JSON.parse(JSON.stringify(global)) }
      await api.put('/page-config/home', { data: JSON.stringify(data), published: true })
      saveStatus.value = 'saved'
      setTimeout(() => { saveStatus.value = '' }, 2000)
    } catch (e) {
      console.error('Publish failed:', e)
      saveStatus.value = 'error'
      setTimeout(() => { saveStatus.value = '' }, 3000)
    }
  }
  showConfirm.value = true
}

// ---- Load saved config ----
async function loadConfig() {
  try {
    const res = await api.get('/page-config/home')
    if (res) {
      let parsed = res
      if (typeof parsed === 'string') parsed = JSON.parse(parsed)
      if (parsed.data && typeof parsed.data === 'string') parsed = JSON.parse(parsed.data)
      else if (parsed.data) parsed = parsed.data
      if (parsed.components) components.value = parsed.components
      if (parsed.global) Object.assign(global, parsed.global)
    }
  } catch (e) {
    // No saved config yet
  }
}

loadConfig()
saveHistory()

// ---- Keyboard Shortcuts ----
function onKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'z') { e.preventDefault(); undo() }
  if ((e.ctrlKey || e.metaKey) && e.key === 'y') { e.preventDefault(); redo() }
  if ((e.ctrlKey || e.metaKey) && e.key === 's') { e.preventDefault(); saveDraft() }
}
if (typeof window !== 'undefined') window.addEventListener('keydown', onKeydown)
</script>


<style scoped>
.builder-shell{display:flex;flex-direction:column;height:100vh;background:#f0f2f5}
.top-toolbar{display:flex;align-items:center;justify-content:space-between;padding:0 16px;height:50px;background:#fff;border-bottom:1px solid #e8e8e8;flex-shrink:0;gap:12px}
.toolbar-left{display:flex;align-items:center;gap:12px}
.logo{font-weight:700;color:#2979FF;font-size:15px;display:flex;align-items:center;gap:6px}
.logo i{font-size:18px}
.page-tag{font-size:12px;color:#999;background:#f0f0f0;padding:2px 10px;border-radius:10px}
.toolbar-center{display:flex;gap:4px}
.tool-btn{padding:6px 12px;border:1px solid #d9d9d9;background:#fff;border-radius:6px;cursor:pointer;font-size:12px;display:flex;align-items:center;gap:4px;color:#555;transition:.15s}
.tool-btn:hover{color:#2979FF;border-color:#2979FF}
.tool-btn.active{background:#2979FF;color:#fff;border-color:#2979FF}
.tool-btn:disabled{opacity:.35;cursor:not-allowed}
.toolbar-right{display:flex;align-items:center;gap:8px}
.save-stat{font-size:12px;display:flex;align-items:center;gap:4px}
.save-stat.ok{color:#52c41a}
.save-stat.err{color:#ff4d4f}
.builder-body{display:flex;flex:1;overflow:hidden}
.lib-panel{width:240px;background:#fff;border-right:1px solid #e8e8e8;display:flex;flex-direction:column;flex-shrink:0}
.panel-tabs{display:flex;border-bottom:1px solid #e8e8e8;padding:0 8px}
.ptab{flex:1;text-align:center;padding:10px 0;font-size:12px;color:#888;cursor:pointer;border-bottom:2px solid transparent;transition:.15s}
.ptab.on{color:#2979FF;border-bottom-color:#2979FF;font-weight:600}
.lib-list{padding:10px;overflow-y:auto;display:grid;grid-template-columns:1fr 1fr;gap:8px;flex:1;align-content:start}
.lib-item{padding:12px 8px;border:1px solid #f0f0f0;border-radius:8px;cursor:grab;text-align:center;transition:.15s;user-select:none}
.lib-item:hover{border-color:#2979FF;background:#f5f8ff;box-shadow:0 2px 8px rgba(41,121,255,.1)}
.lib-icon{font-size:22px;color:#2979FF;margin-bottom:4px}
.lib-name{font-size:11px;color:#666;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.canvas-panel{flex:1;display:flex;align-items:flex-start;justify-content:center;padding:20px;overflow-y:auto;background:#e8ecf1}
.phone{width:375px;border-radius:28px;background:#1a1a2e;padding:12px 8px;box-shadow:0 8px 40px rgba(0,0,0,.18)}
.phone-top{height:24px;display:flex;justify-content:center}
.phone-notch{width:120px;height:22px;background:#1a1a2e;border-radius:0 0 14px 14px}
.phone-screen{background:#fff;border-radius:4px;overflow:hidden;min-height:600px;display:flex;flex-direction:column}
.phone-bottom{height:20px;display:flex;justify-content:center;align-items:flex-end}
.phone-home{width:100px;height:4px;background:#555;border-radius:2px}
.s-navbar{padding:8px 14px 6px;font-size:13px;font-weight:600}
.s-status{font-size:11px;opacity:.6;margin-bottom:2px}
.s-title{font-size:15px;text-align:center}
.s-search{display:flex;align-items:center;gap:6px;background:rgba(0,0,0,.05);border-radius:16px;padding:6px 12px;font-size:12px;font-weight:400;color:#999}
.s-body{flex:1;padding:8px;min-height:400px}
.s-comp{position:relative;margin-bottom:6px;border:2px solid transparent;border-radius:6px;transition:.15s}
.s-comp.selected{border-color:#2979FF;box-shadow:0 0 0 2px rgba(41,121,255,.2)}
.s-comp-bar{position:absolute;top:-36px;left:0;right:0;display:flex;align-items:center;gap:4px;background:#2979FF;color:#fff;padding:4px 8px;border-radius:6px 6px 0 0;font-size:11px;z-index:10}
.s-comp-bar .s-comp-name{flex:1;font-weight:600;font-size:11px}
.s-comp-bar button{background:none;border:none;color:#fff;cursor:pointer;padding:2px 4px;border-radius:3px;font-size:14px;display:flex;align-items:center}
.s-comp-bar button:hover{background:rgba(255,255,255,.2)}
.s-comp-bar button.del:hover{background:#ff4d4f}
.s-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:60px 20px;color:#bbb;border:2px dashed #ddd;border-radius:10px;min-height:200px}
.s-empty i{font-size:36px;margin-bottom:8px}
.s-tabbar{display:flex;border-top:1px solid #eee;padding:4px 0 2px;background:#fff}
.s-tab{flex:1;display:flex;flex-direction:column;align-items:center;gap:2px;font-size:10px;color:#999;padding:4px 0}
.s-tab i{font-size:18px}
.s-tab.on{color:#2979FF}
.prop-panel{width:280px;background:#fff;border-left:1px solid #e8e8e8;display:flex;flex-direction:column;flex-shrink:0}
.prop-title{padding:12px 16px;font-weight:600;font-size:14px;border-bottom:1px solid #f0f0f0;color:#333}
.prop-body{flex:1;overflow-y:auto;padding:12px}
.prop-empty{flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#bbb;gap:8px}
.preview-mode{flex:1;display:flex;align-items:center;justify-content:center;background:#d0d5dd;overflow-y:auto}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,.45);display:flex;align-items:center;justify-content:center;z-index:1000}
.modal-box{background:#fff;border-radius:12px;padding:24px;max-height:80vh;overflow-y:auto;box-shadow:0 8px 40px rgba(0,0,0,.15)}
.modal-box h3{font-size:16px;margin:0 0 16px;display:flex;align-items:center;gap:8px}
.tpl-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
.tpl-card{border:2px solid #eee;border-radius:10px;padding:10px;cursor:pointer;transition:.15s}
.tpl-card:hover{border-color:#2979FF;box-shadow:0 4px 16px rgba(41,121,255,.15)}
.tpl-preview{height:120px;border-radius:6px;padding:8px;display:flex;align-items:flex-start}
.tpl-mock{flex:1}
.tpl-name{text-align:center;margin-top:8px;font-size:13px;font-weight:600;color:#333}
.global-form{display:flex;flex-direction:column;gap:10px}
.gf-row{display:flex;align-items:center;gap:10px}
.gf-row label{width:80px;font-size:13px;color:#555;flex-shrink:0}
.fi{flex:1;padding:7px 10px;border:1px solid #d9d9d9;border-radius:6px;font-size:13px;outline:none}
.fi:focus{border-color:#2979FF;box-shadow:0 0 0 2px rgba(41,121,255,.1)}
.fcolor{width:32px;height:32px;border:none;border-radius:6px;cursor:pointer;padding:0}
.switch-sm{display:flex;align-items:center;gap:6px;font-size:12px;cursor:pointer}
.btn{padding:7px 16px;border-radius:6px;font-size:13px;cursor:pointer;border:none;font-weight:500;transition:.15s}
.btn-primary{background:#2979FF;color:#fff}
.btn-primary:hover{background:#1c6ae0}
.btn-outline{border:1px solid #d9d9d9;background:#fff;color:#555}
.btn-outline:hover{border-color:#2979FF;color:#2979FF}
.btn-sm{padding:5px 12px;font-size:12px}
.ri-spin{animation:spin .8s linear infinite}
@keyframes spin{to{transform:rotate(360deg)}}
</style>
