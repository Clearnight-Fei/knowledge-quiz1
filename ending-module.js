(function (global) {
  'use strict';
  const copy = {"paragraphs": ["集体创作这份线上知识闯关作品的过程，也是我们小组一次集体党性淬炼。红色历史不只是书本上的知识点，更是指引当代青年前行的精神坐标。经过莲花山现场教学，围绕 “锤炼党性修养，笃行网安担当” 开展小组研讨，再结合答题研学，我们从党的基础理论、四史征程，读到中大先辈坪石西迁、弦歌不辍的报国故事，真切体会个人成长与国家命运紧密相连。", "作为网络空间安全学院的入党发展对象，我们深知国家安全不只体现在烽火年代的浴血抗争，在当下，网络空间就是没有硝烟的主战场。锤炼党性修养，落实到我们身上，就是既要夯实思想根基，也要练好攻防研判、风险防护的专业本领。日常课堂实验、网络安全实践、面向身边同学开展网络反诈科普，都是我们践行担当的微小切口。", "习近平总书记致中山大学建校 100 周年贺信勉励我们传承红色基因、坚持为党育人、为国育才。我们将践行 “博学、审问、慎思、明辨、笃行” 校训，把党史校史学习收获内化于心，以代码为盾筑牢网络安全防线，努力成长为兼具坚定理想信念与过硬技术能力的时代新人。"], "authors": "杨雨潼，蔡卓颖，黄锦源，江秉城，李享，李行健，李梓威，吴静桐，仲恒萱", "editors": "杨雨潼、黄锦源、江秉城、仲恒萱、李梓威", "developers": "李享、吴静桐、李行健、蔡卓颖", "sources": [{"publisher": "新华社", "title": "习近平致中山大学建校100周年的贺信", "url": "https://www.xinhuanet.com/politics/leaders/20241112/2a681e89a5cc4986bbecce1c41111643/c.html"}, {"publisher": "中山大学博物馆（校史馆）", "title": "校史沿革", "url": "https://bwgxsg.sysu.edu.cn/zh-hans/article/229"}, {"publisher": "中山大学新闻网", "title": "寻踪中大“学术抗战”烽火岁月", "url": "https://www.sysu.edu.cn/news/info/2171/521281.htm"}, {"publisher": "共产党员网", "title": "党史百问｜什么是伟大建党精神？", "url": "https://www.12371.cn/2022/03/18/ARTI1647592716614821.shtml"}]};
  const esc = v => String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function mount(root, options) {
    if (!root || typeof root.replaceChildren !== 'function') throw new Error('mount 需要一个真实的 DOM 容器');
    const settings = options || {};
    const assets = {logo:'assets/sysu-logo.png', emblem:'assets/party-gold.png', banner:'assets/ending-banner.jpg', discussion:'assets/group-discussion.jpg', ...(settings.assets || {})};
    const previous = Array.isArray(settings.results) ? settings.results : [];
    const results = ['party','four-history','sysu'].map(id => previous.find(r => r && r.moduleId === id));
    // Only show a total when all three real, valid module results were supplied.
    const complete = results.every(r => r && Number.isInteger(r.total) && r.total > 0 && Number.isInteger(r.correct) && r.correct >= 0 && r.correct <= r.total);
    const total = complete ? results.reduce((n,r) => n+r.total,0) : 0;
    const correct = complete ? results.reduce((n,r) => n+r.correct,0) : 0;
    root.innerHTML = `<div class="rje">
      <header class="rje-top"><div class="rje-container rje-topinner"><div class="rje-brand"><img class="rje-brand-logo" src="${esc(assets.logo)}" alt="中山大学校徽"><div><div class="rje-brand-name">传中大红色薪火 · 悟百年党史初心</div><div class="rje-brand-sub">网络空间安全学院 · 第28学习小组</div></div></div><div class="rje-navright">2026 年学生入党发展对象培训班</div></div></header>
      <main>
        <section class="rje-endinghero" aria-labelledby="rje-title"><img class="rje-endingart" src="${esc(assets.banner)}" alt="" aria-hidden="true"><div class="rje-container rje-endinghero-content"><div class="rje-kicker">学史明理 · 赓续血脉 · 笃行担当</div><h1 id="rje-title">以学<em>铸魂</em>，以行<em>践志</em></h1><p class="rje-ending-subtitle">从历史中汲取力量，在奋斗中书写青春</p><div class="rje-ending-divider" aria-hidden="true"><span></span>✦<span></span></div><p class="rje-ending-lead">学习不止步，奋进正当时</p><p class="rje-ending-note">${complete ? '闯关已全部完成！请继续浏览，阅读本小组集体学习感悟。' : '愿这次答题成为进一步深入理论学习、赓续红色血脉的新起点。'}</p>${complete ? `<div class="rje-score" aria-label="总成绩">答对 <strong>${correct}</strong> 题 / 共 ${total} 题</div>` : ''}<a class="rje-readmore" href="#rje-reflection">阅读学习感悟 <span aria-hidden="true">↓</span></a></div></section>
        <div class="rje-bannerline"></div>
        <section id="rje-reflection" class="rje-section rje-collective"><div class="rje-container"><div class="rje-sectionhead"><div class="rje-eyebrow">LEARNING & REFLECTION</div><h2>小组集体学习感悟</h2><p>在回望中坚定信仰，在实践中锤炼担当</p></div>
          <div class="rje-reflection-layout"><figure class="rje-group-photo"><img src="${esc(assets.discussion)}" alt="第28学习小组开展学习讨论"><figcaption><span>第28学习小组</span><strong>锤炼党性修养<br>笃行网安担当</strong><p>集体研讨 · 学思践悟</p></figcaption></figure><article class="rje-essay" aria-label="集体学习感悟正文">${copy.paragraphs.map((p,i)=>`<p${i===0?' class="rje-first-paragraph"':''}>${esc(p)}</p>`).join('')}</article></div>
        </div></section>
        <section class="rje-motto-section"><div class="rje-container"><img src="${esc(assets.emblem)}" alt="" aria-hidden="true"><div class="rje-eyebrow">赓续红色血脉 · 勇担时代使命</div><h2>为社会福，为邦家光</h2><p>出自1924年孙中山先生致国立广东大学首届毕业生的训词。</p></div></section>
        <section class="rje-section rje-credits"><div class="rje-container"><div class="rje-sectionhead"><div class="rje-eyebrow">OUR TEAM</div><h2>同心共学，携手前行</h2><p>2026年学生入党发展对象培训班（第3期）第28学习小组</p></div><div class="rje-credit-card"><div class="rje-credit-main"><span class="rje-credit-label">作品名称</span><h3>传中大红色薪火，悟百年党史初心</h3><p>—— 线上知识闯关研学馆</p><div class="rje-credit-label">全部作者</div><p class="rje-author-list">${esc(copy.authors)}</p><div class="rje-credit-label">所属院系单位</div><p>网络空间安全学院</p></div><dl class="rje-work"><div><dt>内容编审组</dt><dd>${esc(copy.editors)}</dd></div><div><dt>代码对接与测试部署组</dt><dd>${esc(copy.developers)}</dd></div><div><dt>创作说明</dt><dd>本作品用于学生入党发展对象培训学习交流。理论与史实资料来源见下方参考链接。</dd></div></dl></div></div></section>
        <section class="rje-resources"><div class="rje-container"><div class="rje-resource-heading"><div><div class="rje-eyebrow">FURTHER READING</div><h2>让学习继续</h2></div><p>参考资料 · 点击访问公开原文</p></div><div class="rje-resource-grid">${copy.sources.map((s,i)=>`<a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer"><span class="rje-resource-number">0${i+1}</span><span><small>${esc(s.publisher)}</small><strong>${esc(s.title)}</strong></span><span aria-hidden="true">↗</span></a>`).join('')}</div><div class="rje-ending-actions"><button id="rje-home" class="rje-btn" type="button">返回首页 <span aria-hidden="true">↗</span></button>${typeof settings.onReview==='function'?'<button id="rje-review" class="rje-btn rje-btn-ghost" type="button">返回第三关</button>':''}<button id="rje-top" class="rje-link" type="button">回到顶部 ↑</button></div></div></section>
      </main><footer class="rje-footer"><div class="rje-container"><p>2026 年学生入党发展对象培训班（第 3 期）第 28 学习小组</p><p>中山大学网络空间安全学院 · 学习交流作品</p></div></footer>
    </div>`;
    const listen = (id,fn) => root.querySelector('#'+id)?.addEventListener('click',fn);
    const top = () => global.scrollTo({top:0,behavior:global.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
    listen('rje-home',()=>{if(typeof settings.onHome==='function') settings.onHome();else global.location.href=settings.homeUrl || '../样例/党的模块_提交整理版_首页与第一关/index.html';});
    listen('rje-review',()=>settings.onReview());listen('rje-top',top);
    global.scrollTo({top:0,behavior:'instant'});
    return {destroy(){root.replaceChildren();}};
  }
  global.RedJourneyEnding = {mount};
})(window);
