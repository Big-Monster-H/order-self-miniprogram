<template>
<div class="pe-root">
  <!-- ====== Common Fields ====== -->
  <div class="pe-section"><div class="pe-section-title">间距</div>
    <div class="pe-row"><label>上边距</label><input type="number" v-model.number="comp.props.marginTop" class="pe-input" placeholder="0" @input="emitChange" /> px</div>
    <div class="pe-row"><label>下边距</label><input type="number" v-model.number="comp.props.marginBottom" class="pe-input" placeholder="0" @input="emitChange" /> px</div>
  </div>

  <!-- ====== Banner ====== -->
  <template v-if="comp.type==='banner'">
    <div class="pe-section"><div class="pe-section-title">轮播图</div>
      <div class="pe-row"><label>高度</label><input type="number" v-model.number="comp.props.height" class="pe-input" @input="emitChange" /> px</div>
      <div class="pe-row"><label>圆角</label><input type="number" v-model.number="comp.props.radius" class="pe-input" @input="emitChange" /> px</div>
      <div class="pe-row"><label>切换间隔</label><input type="number" v-model.number="comp.props.interval" class="pe-input" @input="emitChange" /> ms</div>
      <div class="pe-row"><label>显示圆点</label><label class="pe-switch"><input type="checkbox" v-model="comp.props.dots" @change="emitChange" /></label></div>
      <div class="pe-row" style="flex-direction:column;align-items:flex-start"><label>图片URL (一行一个)</label>
        <textarea v-model="imagesText" class="pe-textarea" rows="3" placeholder="https://..." @input="parseImages"></textarea>
      </div>
    </div>
  </template>

  <!-- ====== Search ====== -->
  <template v-else-if="comp.type==='search'">
    <div class="pe-section"><div class="pe-section-title">搜索栏</div>
      <div class="pe-row"><label>占位文字</label><input v-model="comp.props.placeholder" class="pe-input" @input="emitChange" /></div>
      <div class="pe-row"><label>背景色</label><div class="pe-color-row"><input type="color" v-model="comp.props.bgColor" class="pe-color" @input="emitChange" /><input v-model="comp.props.bgColor" class="pe-input" style="flex:1" @input="emitChange" /></div></div>
      <div class="pe-row"><label>圆角</label><input type="number" v-model.number="comp.props.radius" class="pe-input" @input="emitChange" /> px</div>
      <div class="pe-row" style="flex-direction:column;align-items:flex-start"><label>热搜词 (逗号分隔)</label>
        <input v-model="hotWordsText" class="pe-input" style="width:100%" placeholder="关键词1,关键词2" @input="parseHotWords" />
      </div>
    </div>
  </template>

  <!-- ====== Notice ====== -->
  <template v-else-if="comp.type==='notice'">
    <div class="pe-section"><div class="pe-section-title">公告栏</div>
      <div class="pe-row"><label>公告文字</label><input v-model="comp.props.text" class="pe-input" @input="emitChange" /></div>
      <div class="pe-row"><label>图标</label><input v-model="comp.props.ico" class="pe-input" @input="emitChange" /></div>
      <div class="pe-row"><label>背景色</label><div class="pe-color-row"><input type="color" v-model="comp.props.bgColor" class="pe-color" @input="emitChange" /><input v-model="comp.props.bgColor" class="pe-input" style="flex:1" @input="emitChange" /></div></div>
      <div class="pe-row"><label>文字色</label><div class="pe-color-row"><input type="color" v-model="comp.props.color" class="pe-color" @input="emitChange" /><input v-model="comp.props.color" class="pe-input" style="flex:1" @input="emitChange" /></div></div>
      <div class="pe-row"><label>滚动速度</label><input type="number" v-model.number="comp.props.speed" class="pe-input" @input="emitChange" /></div>
    </div>
  </template>

  <!-- ====== NavGrid ====== -->
  <template v-else-if="comp.type==='navGrid'">
    <div class="pe-section"><div class="pe-section-title">导航宫格</div>
      <div class="pe-row"><label>列数</label><input type="number" v-model.number="comp.props.columns" class="pe-input" @input="emitChange" min="2" max="5" /></div>
      <div class="pe-row"><label>间距</label><input type="number" v-model.number="comp.props.gutter" class="pe-input" @input="emitChange" /> px</div>
      <div v-for="(item,i) in (comp.props.items||[])" :key="i" class="pe-item-block">
        <div class="pe-item-header">导航 {{i+1}} <button class="pe-item-del" @click="removeNavItem(i)">x</button></div>
        <div class="pe-row"><label>图标</label><input v-model="item.icon" class="pe-input" @input="emitChange" /></div>
        <div class="pe-row"><label>名称</label><input v-model="item.name" class="pe-input" @input="emitChange" /></div>
        <div class="pe-row"><label>链接</label><input v-model="item.link" class="pe-input" @input="emitChange" /></div>
      </div>
      <button class="pe-add-btn" @click="addNavItem">+ 添加导航项</button>
    </div>
  </template>

  <!-- ====== TitleBar ====== -->
  <template v-else-if="comp.type==='titleBar'">
    <div class="pe-section"><div class="pe-section-title">标题栏</div>
      <div class="pe-row"><label>标题</label><input v-model="comp.props.title" class="pe-input" @input="emitChange" /></div>
      <div class="pe-row"><label>副标题</label><input v-model="comp.props.subtitle" class="pe-input" @input="emitChange" /></div>
      <div class="pe-row"><label>更多文字</label><input v-model="comp.props.moreText" class="pe-input" @input="emitChange" /></div>
      <div class="pe-row"><label>对齐</label><select v-model="comp.props.align" class="pe-input" @change="emitChange">
        <option value="left">左对齐</option><option value="center">居中</option>
      </select></div>
    </div>
  </template>

  <!-- ====== ImageAd ====== -->
  <template v-else-if="comp.type==='imageAd'">
    <div class="pe-section"><div class="pe-section-title">图片广告</div>
      <div class="pe-row"><label>图片URL</label><input v-model="comp.props.src" class="pe-input" @input="emitChange" /></div>
      <div class="pe-row"><label>链接</label><input v-model="comp.props.link" class="pe-input" @input="emitChange" /></div>
      <div class="pe-row"><label>高度</label><input type="number" v-model.number="comp.props.height" class="pe-input" @input="emitChange" /> px</div>
      <div class="pe-row"><label>圆角</label><input type="number" v-model.number="comp.props.radius" class="pe-input" @input="emitChange" /> px</div>
    </div>
  </template>

  <!-- ====== Coupon ====== -->
  <template v-else-if="comp.type==='coupon'">
    <div class="pe-section"><div class="pe-section-title">优惠券</div>
      <div class="pe-row"><label>样式</label><select v-model="comp.props.style" class="pe-input" @change="emitChange">
        <option value="card">卡片式</option><option value="list">列表式</option>
      </select></div>
      <div class="pe-row"><label>显示数量</label><input type="number" v-model.number="comp.props.showCount" class="pe-input" @input="emitChange" min="1" max="6" /></div>
    </div>
  </template>

  <!-- ====== Countdown ====== -->
  <template v-else-if="comp.type==='countdown'">
    <div class="pe-section"><div class="pe-section-title">倒计时</div>
      <div class="pe-row"><label>标题</label><input v-model="comp.props.title" class="pe-input" @input="emitChange" /></div>
      <div class="pe-row"><label>结束时间</label><input type="datetime-local" v-model="comp.props.endTime" class="pe-input" @input="emitChange" /></div>
      <div class="pe-row"><label>背景色</label><div class="pe-color-row"><input type="color" v-model="comp.props.bgColor" class="pe-color" @input="emitChange" /><input v-model="comp.props.bgColor" class="pe-input" style="flex:1" @input="emitChange" /></div></div>
      <div class="pe-row"><label>文字色</label><div class="pe-color-row"><input type="color" v-model="comp.props.color" class="pe-color" @input="emitChange" /><input v-model="comp.props.color" class="pe-input" style="flex:1" @input="emitChange" /></div></div>
    </div>
  </template>

  <!-- ====== GroupBuy ====== -->
  <template v-else-if="comp.type==='groupBuy'">
    <div class="pe-section"><div class="pe-section-title">拼团</div>
      <div class="pe-row"><label>标题</label><input v-model="comp.props.title" class="pe-input" @input="emitChange" /></div>
    </div>
  </template>

  <!-- ====== Seckill ====== -->
  <template v-else-if="comp.type==='seckill'">
    <div class="pe-section"><div class="pe-section-title">秒杀</div>
      <div class="pe-row"><label>标题</label><input v-model="comp.props.title" class="pe-input" @input="emitChange" /></div>
      <div class="pe-row"><label>显示价格</label><label class="pe-switch"><input type="checkbox" v-model="comp.props.showPrice" @change="emitChange" /></label></div>
      <div class="pe-row"><label>显示进度</label><label class="pe-switch"><input type="checkbox" v-model="comp.props.showProgress" @change="emitChange" /></label></div>
    </div>
  </template>

  <!-- ====== GoodsRow ====== -->
  <template v-else-if="comp.type==='goodsRow'">
    <div class="pe-section"><div class="pe-section-title">商品行</div>
      <div class="pe-row"><label>标题</label><input v-model="comp.props.title" class="pe-input" @input="emitChange" /></div>
      <div class="pe-row"><label>布局</label><select v-model="comp.props.layout" class="pe-input" @change="emitChange">
        <option value="scroll">横向滚动</option><option value="grid">宫格</option>
      </select></div>
      <div class="pe-row" v-if="comp.props.layout==='grid'"><label>列数</label><input type="number" v-model.number="comp.props.columns" class="pe-input" @input="emitChange" min="1" max="4" /></div>
      <div class="pe-row"><label>显示角标</label><label class="pe-switch"><input type="checkbox" v-model="comp.props.showBadge" @change="emitChange" /></label></div>
    </div>
  </template>

  <!-- ====== ArticleList ====== -->
  <template v-else-if="comp.type==='articleList'">
    <div class="pe-section"><div class="pe-section-title">文章列表</div>
      <div class="pe-row"><label>标题</label><input v-model="comp.props.title" class="pe-input" @input="emitChange" /></div>
      <div class="pe-row"><label>数量</label><input type="number" v-model.number="comp.props.count" class="pe-input" @input="emitChange" min="1" max="10" /></div>
      <div class="pe-row"><label>显示封面</label><label class="pe-switch"><input type="checkbox" v-model="comp.props.showCover" @change="emitChange" /></label></div>
      <div class="pe-row"><label>显示日期</label><label class="pe-switch"><input type="checkbox" v-model="comp.props.showDate" @change="emitChange" /></label></div>
    </div>
  </template>

  <!-- ====== VideoPlayer ====== -->
  <template v-else-if="comp.type==='videoPlayer'">
    <div class="pe-section"><div class="pe-section-title">视频</div>
      <div class="pe-row"><label>视频URL</label><input v-model="comp.props.src" class="pe-input" @input="emitChange" /></div>
      <div class="pe-row"><label>封面URL</label><input v-model="comp.props.poster" class="pe-input" @input="emitChange" /></div>
      <div class="pe-row"><label>高度</label><input type="number" v-model.number="comp.props.height" class="pe-input" @input="emitChange" /> px</div>
      <div class="pe-row"><label>自动播放</label><label class="pe-switch"><input type="checkbox" v-model="comp.props.autoplay" @change="emitChange" /></label></div>
    </div>
  </template>

  <!-- ====== RichText ====== -->
  <template v-else-if="comp.type==='richText'">
    <div class="pe-section"><div class="pe-section-title">富文本</div>
      <div class="pe-row"><label>内边距</label><input type="number" v-model.number="comp.props.padding" class="pe-input" @input="emitChange" /> px</div>
      <div class="pe-row" style="flex-direction:column;align-items:flex-start"><label>HTML内容</label>
        <textarea v-model="comp.props.content" class="pe-textarea" rows="6" @input="emitChange"></textarea>
      </div>
    </div>
  </template>

  <!-- ====== FloatingBtn ====== -->
  <template v-else-if="comp.type==='floatingBtn'">
    <div class="pe-section"><div class="pe-section-title">悬浮按钮</div>
      <div class="pe-row"><label>文字</label><input v-model="comp.props.text" class="pe-input" @input="emitChange" /></div>
      <div class="pe-row"><label>图标</label><input v-model="comp.props.ico" class="pe-input" @input="emitChange" /></div>
      <div class="pe-row"><label>位置</label><select v-model="comp.props.position" class="pe-input" @change="emitChange">
        <option value="right">右侧</option><option value="left">左侧</option>
      </select></div>
      <div class="pe-row"><label>距底部</label><input type="number" v-model.number="comp.props.bottom" class="pe-input" @input="emitChange" /> px</div>
    </div>
  </template>

  <!-- ====== Divider ====== -->
  <template v-else-if="comp.type==='divider'">
    <div class="pe-section"><div class="pe-section-title">分割线</div>
      <div class="pe-row"><label>高度</label><input type="number" v-model.number="comp.props.height" class="pe-input" @input="emitChange" /> px</div>
      <div class="pe-row"><label>颜色</label><div class="pe-color-row"><input type="color" v-model="comp.props.color" class="pe-color" @input="emitChange" /><input v-model="comp.props.color" class="pe-input" style="flex:1" @input="emitChange" /></div></div>
      <div class="pe-row"><label>外边距</label><input v-model="comp.props.margin" class="pe-input" @input="emitChange" placeholder="12px 0" /></div>
    </div>
  </template>

  <!-- ====== Blank ====== -->
  <template v-else-if="comp.type==='blank'">
    <div class="pe-section"><div class="pe-section-title">空白占位</div>
      <div class="pe-row"><label>高度</label><input type="number" v-model.number="comp.props.height" class="pe-input" @input="emitChange" /> px</div>
      <div class="pe-row"><label>背景色</label><div class="pe-color-row"><input type="color" v-model="comp.props.bgColor" class="pe-color" @input="emitChange" /><input v-model="comp.props.bgColor" class="pe-input" style="flex:1" @input="emitChange" /></div></div>
    </div>
  </template>

  <!-- ====== No Editor ====== -->
  <div v-else class="pe-none">此组件暂无属性编辑器</div>
</div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({ comp: Object })
const emit = defineEmits(['change'])

const imagesText = ref('')
const hotWordsText = ref('')

function emitChange() {
  emit('change')
}

function parseImages() {
  const lines = imagesText.value.split(/[\n,]/).map(s => s.trim()).filter(Boolean)
  if (props.comp && props.comp.props) {
    props.comp.props.images = lines
  }
  emitChange()
}

function parseHotWords() {
  if (props.comp && props.comp.props) {
    props.comp.props.hotWords = hotWordsText.value.split(',').map(s => s.trim()).filter(Boolean)
  }
  emitChange()
}

function addNavItem() {
  if (!props.comp || !props.comp.props) return
  if (!props.comp.props.items) props.comp.props.items = []
  props.comp.props.items.push({ icon: 'ri-apps-line', name: '新导航', link: '' })
  emitChange()
}

function removeNavItem(i) {
  if (props.comp && props.comp.props && props.comp.props.items) {
    props.comp.props.items.splice(i, 1)
    emitChange()
  }
}

// Init text fields from props
watch(() => props.comp?.props?.images, (imgs) => {
  if (Array.isArray(imgs)) imagesText.value = imgs.join('\n')
}, { immediate: true })

watch(() => props.comp?.props?.hotWords, (words) => {
  if (Array.isArray(words)) hotWordsText.value = words.join(', ')
}, { immediate: true })
</script>

<style scoped>
.pe-root{font-size:12px}
.pe-section{margin-bottom:16px}
.pe-section-title{font-weight:600;font-size:13px;color:#333;margin-bottom:8px;padding-bottom:6px;border-bottom:1px solid #f0f0f0}
.pe-row{display:flex;align-items:center;gap:8px;margin-bottom:8px}
.pe-row label{width:56px;font-size:12px;color:#666;flex-shrink:0}
.pe-input{padding:5px 8px;border:1px solid #d9d9d9;border-radius:4px;font-size:12px;outline:none;width:100%}
.pe-input:focus{border-color:#2979FF}
.pe-color-row{display:flex;align-items:center;gap:6px;flex:1}
.pe-color{width:24px;height:24px;border:none;border-radius:4px;cursor:pointer;padding:0}
.pe-textarea{width:100%;padding:6px 8px;border:1px solid #d9d9d9;border-radius:4px;font-size:12px;resize:vertical;margin-top:4px;outline:none}
.pe-textarea:focus{border-color:#2979FF}
.pe-switch{cursor:pointer}
.pe-switch input{margin:0}
.pe-item-block{background:#fafafa;border:1px solid #eee;border-radius:6px;padding:8px;margin-bottom:8px}
.pe-item-header{font-weight:600;font-size:12px;margin-bottom:6px;display:flex;justify-content:space-between;align-items:center}
.pe-item-del{background:none;border:none;color:#ff4d4f;cursor:pointer;font-size:14px}
.pe-add-btn{width:100%;padding:6px;border:1px dashed #d9d9d9;background:none;border-radius:6px;color:#2979FF;cursor:pointer;font-size:12px}
.pe-add-btn:hover{border-color:#2979FF;background:#f5f8ff}
.pe-none{padding:20px;text-align:center;color:#bbb}
</style>
