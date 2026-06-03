<template>
<div class="cr-wrap" :style="wrapStyle">
  <!-- Banner / Carousel -->
  <div v-if="type==='banner'" class="cr-banner" :style="{height:p.height+'px',borderRadius:p.radius+'px'}">
    <div class="cr-banner-inner">
      <div v-if="!p.images||!p.images.length" class="cr-banner-empty">
        <i class="ri-image-line"></i><span>轮播图占位</span>
      </div>
      <div v-else class="cr-banner-slide">
        <img v-for="(img,i) in p.images" :key="i" :src="img" />
      </div>
    </div>
    <div v-if="p.dots" class="cr-banner-dots"><span v-for="(img,i) in p.images" :key="i" class="cr-dot" :class="{on:i===0}"></span></div>
  </div>

  <!-- Search Bar -->
  <div v-else-if="type==='search'" class="cr-search" :style="{background:p.bgColor,borderRadius:p.radius+'px'}">
    <i class="ri-search-line"></i><span>{{p.placeholder||'搜索'}}</span>
  </div>

  <!-- Notice Bar -->
  <div v-else-if="type==='notice'" class="cr-notice" :style="{background:p.bgColor,color:p.color}">
    <i :class="p.ico||'ri-volume-up-line'"></i>
    <span class="cr-notice-text">{{p.text}}</span>
  </div>

  <!-- Nav Grid -->
  <div v-else-if="type==='navGrid'" class="cr-navgrid">
    <div v-for="(item,i) in p.items" :key="i" class="cr-navgrid-item" :style="{width:(100/(p.columns||4))+'%',padding:p.gutter+'px'}">
      <div class="cr-navgrid-icon"><i :class="item.icon||'ri-apps-line'"></i></div>
      <div class="cr-navgrid-name">{{item.name}}</div>
    </div>
  </div>

  <!-- Title Bar -->
  <div v-else-if="type==='titleBar'" class="cr-titlebar" :class="'cr-title-'+p.align">
    <div class="cr-titlebar-left">
      <div class="cr-titlebar-title">{{p.title}}</div>
      <div v-if="p.subtitle" class="cr-titlebar-sub">{{p.subtitle}}</div>
    </div>
    <div v-if="p.moreText" class="cr-titlebar-more">{{p.moreText}} <i class="ri-arrow-right-s-line"></i></div>
  </div>

  <!-- Image Ad -->
  <div v-else-if="type==='imageAd'" class="cr-imagead" :style="{height:p.height+'px',borderRadius:p.radius+'px'}">
    <div v-if="!p.src" class="cr-imagead-empty"><i class="ri-image-add-line"></i> 图片广告位</div>
    <img v-else :src="p.src" />
  </div>

  <!-- Coupon -->
  <div v-else-if="type==='coupon'" class="cr-coupon">
    <div v-for="(c,i) in (p.coupons||[]).slice(0,p.showCount||3)" :key="i" class="cr-coupon-item" :class="'cr-coupon-'+p.style">
      <div class="cr-coupon-left"><span class="cr-coupon-symbol">¥</span><span class="cr-coupon-amount">{{c.amount||0}}</span></div>
      <div class="cr-coupon-right"><div class="cr-coupon-name">{{c.name||'优惠券'}}</div><div class="cr-coupon-cond">{{c.condition||'无门槛'}}</div></div>
    </div>
    <div v-if="!p.coupons||!p.coupons.length" class="cr-coupon-empty">暂无优惠券</div>
  </div>

  <!-- Countdown -->
  <div v-else-if="type==='countdown'" class="cr-countdown" :style="{background:p.bgColor,color:p.color}">
    <span class="cr-countdown-title">{{p.title}}</span>
    <span class="cr-countdown-timer">00:00:00</span>
  </div>

  <!-- Group Buy -->
  <div v-else-if="type==='groupBuy'" class="cr-groupbuy">
    <div class="cr-groupbuy-title">{{p.title||'拼团活动'}}</div>
    <div class="cr-groupbuy-grid"><div v-for="i in 3" :key="i" class="cr-groupbuy-item"><i class="ri-group-line"></i><span>拼团商品</span></div></div>
  </div>

  <!-- Seckill -->
  <div v-else-if="type==='seckill'" class="cr-seckill">
    <div class="cr-seckill-header"><span class="cr-seckill-title">{{p.title}}</span><span class="cr-seckill-timer">00:00</span></div>
    <div class="cr-seckill-list"><div v-for="i in 2" :key="i" class="cr-seckill-item"><i class="ri-shopping-bag-3-line"></i><span>秒杀商品</span></div></div>
  </div>

  <!-- Goods Row -->
  <div v-else-if="type==='goodsRow'" class="cr-goodsrow">
    <div v-if="p.title" class="cr-goodsrow-title">{{p.title}}</div>
    <div class="cr-goodsrow-scroll" v-if="p.layout==='scroll'">
      <div v-for="i in 4" :key="i" class="cr-goodsrow-card"><i class="ri-shopping-bag-3-line"></i><span>商品</span></div>
    </div>
    <div class="cr-goodsrow-grid" v-else :style="{gridTemplateColumns:'repeat('+(p.columns||2)+',1fr)'}">
      <div v-for="i in (p.columns||2)*2" :key="i" class="cr-goodsrow-card"><i class="ri-shopping-bag-3-line"></i><span>商品</span></div>
    </div>
  </div>

  <!-- Article List -->
  <div v-else-if="type==='articleList'" class="cr-articlelist">
    <div v-if="p.title" class="cr-articlelist-title">{{p.title}}</div>
    <div v-for="i in (p.count||3)" :key="i" class="cr-articlelist-item">
      <div v-if="p.showCover" class="cr-articlelist-cover"><i class="ri-image-line"></i></div>
      <div class="cr-articlelist-info"><div class="cr-articlelist-name">文章标题</div><div v-if="p.showDate" class="cr-articlelist-date">2024-01-01</div></div>
    </div>
  </div>

  <!-- Video Player -->
  <div v-else-if="type==='videoPlayer'" class="cr-video" :style="{height:p.height+'px'}">
    <div class="cr-video-placeholder"><i class="ri-play-circle-line"></i><span>视频播放器</span></div>
  </div>

  <!-- Rich Text -->
  <div v-else-if="type==='richText'" class="cr-richtext" :style="{padding:p.padding+'px'}" v-html="p.content"></div>

  <!-- Floating Button -->
  <div v-else-if="type==='floatingBtn'" class="cr-floatbtn" :class="'cr-float-'+p.position" :style="{bottom:p.bottom+'px'}">
    <div class="cr-floatbtn-inner"><i :class="p.ico||'ri-customer-service-2-line'"></i><span>{{p.text}}</span></div>
  </div>

  <!-- Divider -->
  <div v-else-if="type==='divider'" class="cr-divider" :style="{height:p.height+'px',background:p.color,margin:p.margin,borderStyle:p.style}"></div>

  <!-- Blank -->
  <div v-else-if="type==='blank'" class="cr-blank" :style="{height:p.height+'px',background:p.bgColor}"></div>

  <!-- Unknown -->
  <div v-else class="cr-unknown">{{type}}</div>
</div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ type: String, props: Object, global: Object })
const p = computed(() => props.props || {})
const wrapStyle = computed(() => {
  const s = {}
  if (p.value.marginTop) s.marginTop = p.value.marginTop + 'px'
  if (p.value.marginBottom) s.marginBottom = p.value.marginBottom + 'px'
  if (p.value.padding) s.padding = p.value.padding + 'px'
  return s
})
</script>

<style scoped>
.cr-wrap{width:100%;overflow:hidden}
.cr-banner{background:#e8e8e8;overflow:hidden;position:relative}
.cr-banner-inner{height:100%}
.cr-banner-empty{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:#bbb;gap:6px;font-size:13px}
.cr-banner-empty i{font-size:28px}
.cr-banner-dots{position:absolute;bottom:8px;left:50%;transform:translateX(-50%);display:flex;gap:6px}
.cr-dot{width:6px;height:6px;border-radius:50%;background:rgba(255,255,255,.5)}
.cr-dot.on{background:#fff;width:16px;border-radius:3px}
.cr-search{display:flex;align-items:center;gap:8px;padding:10px 14px;font-size:13px;color:#999;margin:8px 0}
.cr-notice{display:flex;align-items:center;gap:8px;padding:10px 14px;font-size:12px;border-radius:6px;margin:6px 0}
.cr-notice-text{flex:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.cr-navgrid{display:flex;flex-wrap:wrap;padding:8px 0}
.cr-navgrid-item{display:flex;flex-direction:column;align-items:center;gap:6px;padding:10px 0;box-sizing:border-box}
.cr-navgrid-icon{width:44px;height:44px;border-radius:12px;background:#f5f5f5;display:flex;align-items:center;justify-content:center;font-size:20px;color:#2979FF}
.cr-navgrid-name{font-size:11px;color:#666}
.cr-titlebar{display:flex;align-items:flex-end;justify-content:space-between;padding:12px 0 8px}
.cr-titlebar-title{font-size:16px;font-weight:700;color:#333}
.cr-title-center{justify-content:center;text-align:center}
.cr-titlebar-sub{font-size:12px;color:#999;margin-top:2px}
.cr-titlebar-more{font-size:12px;color:#999;display:flex;align-items:center;gap:2px}
.cr-imagead{background:#e8e8e8;overflow:hidden;margin:6px 0}
.cr-imagead-empty{display:flex;align-items:center;justify-content:center;height:100%;color:#bbb;gap:6px;font-size:13px}
.cr-coupon{padding:8px 0}
.cr-coupon-item{display:flex;margin-bottom:8px;border-radius:8px;overflow:hidden}
.cr-coupon-card{border:1px solid #ff4d4f}
.cr-coupon-left{background:#ff4d4f;color:#fff;padding:10px 14px;display:flex;align-items:center;gap:2px;min-width:70px;justify-content:center}
.cr-coupon-symbol{font-size:12px}
.cr-coupon-amount{font-size:22px;font-weight:700}
.cr-coupon-right{flex:1;padding:10px;background:#fff;border:1px solid #ff4d4f;border-left:none}
.cr-coupon-name{font-size:13px;font-weight:600;color:#333}
.cr-coupon-cond{font-size:11px;color:#999}
.cr-coupon-empty{text-align:center;color:#bbb;font-size:12px;padding:12px}
.cr-countdown{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-radius:8px;font-size:14px;margin:6px 0}
.cr-countdown-timer{font-weight:700;font-size:16px}
.cr-groupbuy{padding:10px 0}
.cr-groupbuy-title{font-size:15px;font-weight:700;margin-bottom:8px}
.cr-groupbuy-grid{display:flex;gap:8px}
.cr-groupbuy-item{flex:1;background:#f5f5f5;border-radius:8px;padding:20px 10px;text-align:center;color:#999;font-size:12px;display:flex;flex-direction:column;align-items:center;gap:6px}
.cr-groupbuy-item i{font-size:22px}
.cr-seckill{padding:10px 0}
.cr-seckill-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:8px}
.cr-seckill-title{font-size:15px;font-weight:700;color:#ff4d4f}
.cr-seckill-timer{background:#333;color:#fff;padding:2px 8px;border-radius:4px;font-size:12px}
.cr-seckill-list{display:flex;gap:8px}
.cr-seckill-item{flex:1;background:#f5f5f5;border-radius:8px;padding:16px 8px;text-align:center;color:#999;font-size:12px;display:flex;flex-direction:column;align-items:center;gap:6px}
.cr-goodsrow{padding:6px 0}
.cr-goodsrow-title{font-size:15px;font-weight:700;margin-bottom:8px}
.cr-goodsrow-scroll{display:flex;gap:8px;overflow-x:auto;padding-bottom:4px}
.cr-goodsrow-grid{display:grid;gap:8px}
.cr-goodsrow-card{min-width:100px;height:100px;background:#f5f5f5;border-radius:8px;display:flex;flex-direction:column;align-items:center;justify-content:center;color:#999;font-size:12px;gap:6px}
.cr-goodsrow-card i{font-size:22px}
.cr-articlelist{padding:6px 0}
.cr-articlelist-title{font-size:15px;font-weight:700;margin-bottom:8px}
.cr-articlelist-item{display:flex;gap:10px;padding:10px 0;border-bottom:1px solid #f5f5f5}
.cr-articlelist-cover{width:80px;height:56px;background:#f0f0f0;border-radius:6px;display:flex;align-items:center;justify-content:center;color:#ccc;font-size:20px;flex-shrink:0}
.cr-articlelist-info{flex:1;display:flex;flex-direction:column;justify-content:center}
.cr-articlelist-name{font-size:13px;color:#333;font-weight:500}
.cr-articlelist-date{font-size:11px;color:#bbb;margin-top:4px}
.cr-video{background:#1a1a2e;border-radius:8px;margin:6px 0}
.cr-video-placeholder{display:flex;flex-direction:column;align-items:center;justify-content:center;height:100%;color:rgba(255,255,255,.5);gap:8px;font-size:13px}
.cr-video-placeholder i{font-size:32px}
.cr-richtext{font-size:14px;line-height:1.6;color:#333}
.cr-floatbtn{position:absolute;z-index:99}
.cr-float-right{right:16px}
.cr-float-left{left:16px}
.cr-floatbtn-inner{display:flex;flex-direction:column;align-items:center;gap:2px;background:#2979FF;color:#fff;padding:10px 14px;border-radius:24px;font-size:11px;box-shadow:0 4px 12px rgba(41,121,255,.3)}
.cr-floatbtn-inner i{font-size:18px}
.cr-divider{width:100%}
.cr-blank{width:100%}
.cr-unknown{padding:20px;text-align:center;color:#999;background:#f0f0f0;border-radius:4px;font-size:12px}
</style>
