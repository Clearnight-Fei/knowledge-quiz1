
(function(global){
  'use strict';
  const bank = global.RED_SYSU_QUESTIONS;
  if (!bank || !Array.isArray(bank.single) || !Array.isArray(bank.multi)) {
    throw new Error('缺少 data/sysu-questions.js：请先引入题库脚本。');
  }
  const defaultAssets = {
    logo:'assets/sysu-logo.png', emblem:'assets/party-gold.png', hero:'assets/banner-home.jpg', statue:'assets/statue.jpg', oldCampus:'assets/pingshi-old.jpg', gate:'assets/pingshi-gate.jpg', museum:'assets/museum.jpg'
  };
  const esc = (value) => String(value == null ? '' : value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const arrShuffle = (items) => {
    const a=items.slice();
    for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];}
    return a;
  };
  function sampleQuestions(size){
    if(size === 'all') return arrShuffle([...bank.single,...bank.multi].map(q=>({...q})));
    const count = Number(size) === 20 ? 20 : 10;
    const singleCount = count === 20 ? 12 : 6;
    const multiCount = count - singleCount;
    return arrShuffle([...arrShuffle(bank.single).slice(0,singleCount),...arrShuffle(bank.multi).slice(0,multiCount)].map(q=>({...q})));
  }
  function header(assets){
    return `<header class="rj3-top"><div class="rj3-container rj3-topinner"><div class="rj3-brand"><img class="rj3-brand-logo" src="${esc(assets.logo)}" alt="中山大学校徽"><div><div class="rj3-brand-name">传中大红色薪火 · 悟百年党史初心</div><div class="rj3-brand-sub">网络空间安全学院 · 第28学习小组</div></div></div><div class="rj3-navright">2026 年学生入党发展对象培训班</div></div></header>`;
  }
  function footer(){ return `<footer class="rj3-footer"><div class="rj3-container"><p>2026 年学生入党发展对象培训班（第 3 期）第 28 学习小组</p><p>中山大学网络空间安全学院 · 学习交流作品</p></div></footer>`; }
  function scrollTop(){ try{global.scrollTo({top:0,behavior:'instant'});}catch(_){} }
  function init(root,options){
    if(!root || typeof root.replaceChildren !== 'function') throw new Error('mount 需要一个真实的 DOM 容器');
    const settings = options || {};
    const assets={...defaultAssets,...(global.SYSU_ASSETS||{}),...(settings.assets||{})};
    const ctx={root,settings,assets,selectedSize:settings.questionCount || 10,questions:[],index:0,correct:0,submitted:false,answers:new Set(),results:[]};
    function setView(html){root.innerHTML=`<div class="rj3">${header(assets)}${html}${footer()}</div>`;scrollTop();}
    function button(id,fn){const el=root.querySelector('#'+id);if(el)el.addEventListener('click',fn);}
    function home(){ if(typeof settings.onHome==='function') settings.onHome(); else intro(); }
    function intro(){
      setView(`<main class="rj3-page"><div class="rj3-container"><div class="rj3-breadcrumb"><button id="rj3-intro-home" class="rj3-link" type="button">首页</button><span aria-hidden="true">›</span><span>第三关 · 薪火相传</span></div><section class="rj3-introcard">
        <div class="rj3-introcover"><img class="rj3-introseal" src="${esc(assets.emblem)}" alt="" aria-hidden="true"><div class="rj3-introlabel">MODULE 03 · 薪火相传</div><h1>中山大学<br>红色校史专题</h1><p>中山大学自 1924 年由孙中山先生创办，百余年办学历程始终同国家和民族的命运休戚与共。从进步师生投身革命洪流，到烽火岁月里坪石西迁、弦歌不辍，一代代中大人坚守家国理想，赓续红色基因。本关依托校史馆公开史料，回望学校创校初心、革命传统与艰苦办学的峥嵘岁月，让我们从校史故事中读懂 “为社会福，为邦家光” 的校训精神，感悟总书记致中山大学建校 100 周年贺信所嘱托的使命重量。</p></div>
        <div class="rj3-historystrip" aria-label="校史影像"><figure><img src="${esc(assets.statue)}" alt="孙中山先生铜像"><figcaption>创校初心 · 孙中山先生铜像</figcaption></figure><figure><img src="${esc(assets.oldCampus)}" alt="坪石校本部老照片"><figcaption>烽火弦歌 · 坪石校本部旧影</figcaption></figure><figure><img src="${esc(assets.gate)}" alt="坪石三星坪竹校门"><figcaption>艰苦办学 · 三星坪竹校门</figcaption></figure></div><div class="rj3-introbody"><div class="rj3-callout">结合题目与解析读懂中大校史，重点把握创校初心、革命传统、抗战坪石办学等关键历史线索。</div>
        <p class="rj3-rules">题库共70题（40单选、30多选）。每题1分，多选须全部选对，漏选、错选均不得分；提交后立即显示正误、解析与来源。</p><p class="rj3-choice-title">选择本次练习题量</p><div class="rj3-counts" role="group" aria-label="选择练习题量">
        <button class="rj3-count" data-size="10" type="button"><strong>10 题</strong><small>6 单选 + 4 多选</small></button>
        <button class="rj3-count" data-size="20" type="button"><strong>20 题</strong><small>12 单选 + 8 多选</small></button>
        <button class="rj3-count" data-size="all" type="button"><strong>全部</strong><small>40 单选 + 30 多选</small></button></div>
        <div class="rj3-actions"><button id="rj3-intro-start" class="rj3-btn" type="button">进入第三关 <span aria-hidden="true">→</span></button><button id="rj3-intro-back" class="rj3-btn rj3-btn-ghost" type="button">返回首页</button></div></div>
        </section></div></main>`);
      button('rj3-intro-home', home);button('rj3-intro-back',home);
      root.querySelectorAll('[data-size]').forEach(el=>{
        el.setAttribute('aria-pressed', String(el.dataset.size===String(ctx.selectedSize)));
        el.addEventListener('click',()=>{
          ctx.selectedSize=el.dataset.size;
          root.querySelectorAll('[data-size]').forEach(b=>b.setAttribute('aria-pressed',String(b===el)));
        });
      });
      button('rj3-intro-start',()=>{ctx.questions=sampleQuestions(ctx.selectedSize);ctx.index=0;ctx.correct=0;ctx.results=[];ctx.answers=new Set();ctx.submitted=false;quiz();});
    }
    function optionMarkup(q,i){
      const label=q.options[i].label;
      const checked=ctx.answers.has(label);
      const correct=q.answer.includes(label);
      let stateClass='';
      if(ctx.submitted){if(correct)stateClass=' rj3-opt-correct';else if(checked)stateClass=' rj3-opt-wrong';}
      let mark=ctx.submitted?(correct?'✓':checked?'×':''):(checked?'✓':'');
      return `<button class="rj3-option${stateClass}" type="button" data-option="${esc(label)}" aria-pressed="${String(checked)}" ${ctx.submitted?'disabled':''}>
        <span class="rj3-optlabel">${esc(label)}</span><span class="rj3-opttext">${esc(q.options[i].text)}</span><span class="rj3-optmark" aria-hidden="true">${mark}</span></button>`;
    }
    function quiz(){
      const q=ctx.questions[ctx.index];
      const n=ctx.questions.length;
      const feedback=ctx.submitted ? feedbackMarkup(q):'';
      const progress=Math.round((ctx.index+(ctx.submitted?1:0))/n*100);
      setView(`<main class="rj3-page"><div class="rj3-container"><div class="rj3-breadcrumb"><button id="rj3-quiz-home" class="rj3-link" type="button">首页</button><span aria-hidden="true">›</span><span>第三关 · 薪火相传</span><span aria-hidden="true">›</span><span>答题中</span></div>
        <div class="rj3-quizlayout"><aside class="rj3-sidecard"><div><div class="rj3-steps">第三关 / 共三关</div><h3>薪火相传</h3><p>中山大学红色校史专题</p></div>
        <div class="rj3-stat">${ctx.index+1} <small>/ ${n}</small></div><div class="rj3-progress" aria-label="答题进度 ${progress}%"><span style="width:${progress}%"></span></div>
        <div class="rj3-side-more">${ctx.submitted?'本题已提交，可查看解析。':'选择答案后点击“提交答案”。'}<br>已答对 ${ctx.correct} 题</div></aside>
        <section class="rj3-quizcard"><div class="rj3-quizhead"><div class="rj3-quizbar"><span class="rj3-qtype">${q.type==='single'?'单选题':'多选题'}${q.type==='multi'?' · 可选择多项':''}</span><span class="rj3-qnumber">第 ${ctx.index+1} / ${n} 题</span></div>
        <h2>${esc(q.text)}</h2></div><div class="rj3-optionlist" role="group" aria-label="题目选项">${q.options.map((_,i)=>optionMarkup(q,i)).join('')}</div>
        ${feedback}<div class="rj3-quizfoot"><span class="rj3-hint">${ctx.submitted?'已显示答案与知识点解析。':'请根据题目选择答案；多选题须全部选对才算正确。'}</span>
        <button id="rj3-quiz-submit" type="button" class="rj3-btn" ${!ctx.submitted && ctx.answers.size===0?'disabled':''}>${ctx.submitted ? (ctx.index===n-1?'完成本关，查看结果 →':'下一题 →') : '提交答案'}</button></div></section></div></div></main>`);
      button('rj3-quiz-home',()=>{if(global.confirm('返回首页将结束当前答题，确定返回吗？'))home();});
      root.querySelectorAll('[data-option]').forEach(btn=>btn.addEventListener('click',()=>{
        if(ctx.submitted) return;
        const label=btn.dataset.option;
        if(q.type==='single') ctx.answers=new Set([label]);
        else if(ctx.answers.has(label))ctx.answers.delete(label);else ctx.answers.add(label);
        root.querySelectorAll('[data-option]').forEach(b=>{
          const pressed=ctx.answers.has(b.dataset.option);
          b.setAttribute('aria-pressed',String(pressed));
          b.querySelector('.rj3-optmark').textContent=pressed?'✓':'';
        });
        root.querySelector('#rj3-quiz-submit').disabled=ctx.answers.size===0;
      }));
      button('rj3-quiz-submit',()=>{
        if(ctx.submitted){if(ctx.index===n-1)finish();else{ctx.index+=1;ctx.submitted=false;ctx.answers=new Set();quiz();}return;}
        if(ctx.answers.size===0)return;
        const expected=new Set(q.answer);
        const correct=expected.size===ctx.answers.size&&[...expected].every(a=>ctx.answers.has(a));
        if(correct)ctx.correct+=1;
        ctx.results.push({questionId:q.id,correct,selected:[...ctx.answers],answer:q.answer});
        ctx.submitted=true;quiz();
      });
    }
    function sourceMarkup(source){
      const match=source.match(/https?:\/\/[^\s｜]+/);
      if(!match)return esc(source);
      return esc(source.slice(0,match.index))+'<a href="'+esc(match[0])+'" target="_blank" rel="noopener noreferrer">查看原文 ↗</a>';
    }
    function feedbackMarkup(q){
      const isCorrect=ctx.results[ctx.results.length-1].correct;
      const answer=q.answer.join('、');
      return `<div class="rj3-feedback ${isCorrect?'good':'bad'}" role="status"><h3>${isCorrect?'回答正确！':'这道题还有值得思考的地方。'}</h3>
        <div>正确答案：<strong>${esc(answer)}</strong></div>
        <p><strong>知识点解析：</strong>${esc(q.explanation)}</p><div class="rj3-source">资料来源：${sourceMarkup(q.source)}</div></div>`;
    }
    function reflection(){
      if(global.RedJourneyEnding){
        global.RedJourneyEnding.mount(root,{
          assets: settings.endingAssets,
          results: settings.results,
          onHome: home,
          onReview: intro
        });
        return;
      }

      setView(`<main class="rj3-page"><div class="rj3-container"><section class="rj3-resultcard"><div class="rj3-resulthead"><div class="rj3-smallcaps">学思践悟 · 青春担当</div><h1>以学铸魂，以行践志</h1><p>从历史中汲取力量，在奋斗中书写青春</p></div><div class="rj3-reflection"><p>集体创作这份线上知识闯关作品的过程，也是我们小组一次集体党性淬炼。红色历史不只是书本上的知识点，更是指引当代青年前行的精神坐标。经过莲花山现场教学，围绕 “锤炼党性修养，笃行网安担当” 开展小组研讨，再结合答题研学，我们从党的基础理论、四史征程，读到中大先辈坪石西迁、弦歌不辍的报国故事，真切体会个人成长与国家命运紧密相连。</p><p>作为网络空间安全学院的入党发展对象，我们深知国家安全不只体现在烽火年代的浴血抗争，在当下，网络空间就是没有硝烟的主战场。锤炼党性修养，落实到我们身上，就是既要夯实思想根基，也要练好攻防研判、风险防护的专业本领。日常课堂实验、网络安全实践、面向身边同学开展网络反诈科普，都是我们践行担当的微小切口。</p><p>习近平总书记致中山大学建校 100 周年贺信勉励我们传承红色基因、坚持为党育人、为国育才。我们将践行 “博学、审问、慎思、明辨、笃行” 校训，把党史校史学习收获内化于心，以代码为盾筑牢网络安全防线，努力成长为兼具坚定理想信念与过硬技术能力的时代新人。</p><div class="rj3-motto">为社会福，为邦家光</div><p class="rj3-source">出自1924年孙中山先生致国立广东大学首届毕业生的训词。</p><p class="rj3-authors">创作小组：2026年学生入党发展对象培训班（第3期）第28学习小组<br>全部作者：杨雨潼、蔡卓颖、黄锦源、江秉城、李享、李行健、李梓威、吴静桐、仲恒萱<br>所属院系单位：网络空间安全学院</p><div class="rj3-actions"><button id="rj3-reflection-back" type="button" class="rj3-btn">返回第三关</button><button id="rj3-reflection-home" type="button" class="rj3-btn rj3-btn-ghost">返回首页</button></div></div></section></div></main>`);
      button('rj3-reflection-back',intro);button('rj3-reflection-home',home);
    }
    function finish(){
      const summary={moduleId:'sysu',moduleName:'薪火相传',total:ctx.questions.length,correct:ctx.correct,wrong:ctx.questions.length-ctx.correct,results:ctx.results.slice()};
      if(typeof ctx.settings.onComplete==='function')ctx.settings.onComplete(summary);
      setView(`<main class="rj3-page"><div class="rj3-container" style="max-width:900px"><section class="rj3-resultcard"><div class="rj3-resulthead"><div class="rj3-smallcaps">MODULE 03 COMPLETED</div><h1>薪火相传，笃行担当</h1><p>第三关 · 中山大学红色校史专题</p></div>
        <div class="rj3-resultbody"><div class="rj3-resultscore">${ctx.correct} <span>/ ${ctx.questions.length} 题</span></div><div style="font-size:13px;color:#9b8072">本轮正确 ${ctx.correct} 题 · 错误 ${ctx.questions.length-ctx.correct} 题</div>
        <p class="rj3-resulttip">${esc(settings.previousModulesCompleted ? "至此，我们完成全部三个模块的闯关学习。回望党的理论根基、百年四史征程与中大红色校史，历史的力量不仅在于回望过往，更在于指引当下。我们当传承先辈精神，把理论学习、党史校史学习转化为自身前行的动力。" : "本关学习已完成。回望中大红色校史，历史的力量不仅在于回望过往，更在于指引当下。我们当传承先辈精神，把理论学习、党史校史学习转化为自身前行的动力。")}</p>
        <div class="rj3-resultactions"><button id="rj3-result-again" class="rj3-btn rj3-btn-ghost" type="button">再练习一轮</button><button id="rj3-result-home" class="rj3-btn rj3-btn-ghost" type="button">返回首页</button>
        <button id="rj3-result-next" class="rj3-btn" type="button">查看学习感悟 →</button></div>
        </div></section></div></main>`);
      button('rj3-result-home',home);button('rj3-result-again',intro);
      button('rj3-result-next',()=>{if(typeof ctx.settings.onReflection==='function')ctx.settings.onReflection(summary);else reflection();});
    }
    intro();
    return {showHome:home,showSysu:intro,destroy:()=>root.replaceChildren()};
  }
  global.RedJourneySysu={mount:init,getQuestionCounts:()=>({single:bank.single.length,multi:bank.multi.length,total:bank.single.length+bank.multi.length})};
})(window);
