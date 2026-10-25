
(function(global){
  'use strict';
  const bank = global.RED_PARTY_QUESTIONS;
  if (!bank || !Array.isArray(bank.single) || !Array.isArray(bank.multi)) {
    throw new Error('缺少 data/party-questions.js：请先引入题库脚本。');
  }
  const defaultAssets = {
    logo:'assets/sysu-logo.png', emblem:'assets/party-gold.png', hero:'assets/banner-home.jpg'
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
    return `<header class="rj-top"><div class="rj-container rj-topinner"><div class="rj-brand"><img class="rj-brand-logo" src="${esc(assets.logo)}" alt="中山大学校徽"><div><div class="rj-brand-name">传中大红色薪火 · 悟百年党史初心</div><div class="rj-brand-sub">网络空间安全学院 · 第28学习小组</div></div></div><div class="rj-navright">2026 年学生入党发展对象培训班</div></div></header>`;
  }
  function footer(){ return `<footer class="rj-footer"><div class="rj-container"><p>2026 年学生入党发展对象培训班（第 3 期）第 28 学习小组</p><p>中山大学网络空间安全学院 · 学习交流作品</p></div></footer>`; }
  function scrollTop(){ try{global.scrollTo({top:0,behavior:'instant'});}catch(_){} }
  function init(root,options){
    if(!root || typeof root.replaceChildren !== 'function') throw new Error('mount 需要一个真实的 DOM 容器');
    const settings = options || {};
    const assets={...defaultAssets,...(global.PARTY_ASSETS||{}),...(settings.assets||{})};
    const ctx={root,settings,assets,selectedSize:settings.questionCount || 10,questions:[],index:0,correct:0,submitted:false,answers:new Set(),results:[]};
    function setView(html){root.innerHTML=`<div class="rj">${header(assets)}${html}${footer()}</div>`;scrollTop();}
    function button(id,fn){const el=root.querySelector('#'+id);if(el)el.addEventListener('click',fn);}
    function home(){
      setView(`<main class="rj-home">
        <section class="rj-hero"><img class="rj-heroart" src="${esc(assets.hero)}" alt="" aria-hidden="true"><div class="rj-heroline"></div><div class="rj-container rj-hero-content">
        <div class="rj-kicker">2026 入党发展对象培训 · 红色学习作品</div><img class="rj-heroseal" src="${esc(assets.emblem)}" alt="" aria-hidden="true">
        <h1>传中大<em>红色薪火</em><br>悟百年<em>党史初心</em></h1>
        <p class="rj-hero-lead">线上知识闯关研学馆</p>
        <p class="rj-hero-intro">在本次2026年学生入党发展对象培训班中，我们赴莲花山党性教育基地开展现场教学，围绕“锤炼党性修养，笃行网安担当”开展小组学习研讨，同步研学习近平新时代中国特色社会主义思想、党的二十大和二十届历次全会精神，以及习近平总书记致中山大学建校100周年贺信精神。总书记勉励中山大学传承红色基因，坚持为党育人、为国育才。为落实学习要求，我们以党的基础知识、伟大建党精神、“四史”与中大红色校史为内容，设计互动知识闯关。愿大家在答题与解析中回望奋斗历程、感悟红色传统，在学思用贯通、知信行统一中坚定理想信念，把学习收获转化为勤学笃行、勇担使命的青春力量。</p>
        <div class="rj-actions"><button id="rj-home-start" class="rj-btn rj-btn-gold" type="button">开启红色知识闯关 <span aria-hidden="true">↗</span></button></div>
        <div class="rj-hero-footnote">三大主题关卡 · 单选与多选 · 答题后可查看知识解析</div>
        </div></section><div class="rj-bannerline"></div>
        <section class="rj-section"><div class="rj-container"><div class="rj-sectionhead"><div class="rj-eyebrow">THREE LEARNING STAGES</div><h2>三大主题关卡</h2><p>循着理论、历史与校史的脉络，在互动研学中感悟精神力量</p></div>
        <div class="rj-modulegrid"><article class="rj-modulecard active"><div class="rj-cardhead"><span class="rj-cardno">01</span><span class="rj-chip">第一关 · 已开放</span></div><h3>感悟初心</h3><p>党的基础理论与伟大建党精神。辨析基础知识，在学习中夯实理论根基。</p></article>
        <article class="rj-modulecard"><div class="rj-cardhead"><span class="rj-cardno">02</span><span class="rj-chip">第二关 · 已开放</span></div><h3>回望征程</h3><p>“四史”知识学习闯关。回望奋斗历程，梳理重要历史节点。</p></article>
        <article class="rj-modulecard"><div class="rj-cardhead"><span class="rj-cardno">03</span><span class="rj-chip">第三关 · 已开放</span></div><h3>薪火相传</h3><p>中大红色校史专题。重温办学传统，感悟百年育人初心。</p></article></div></div></section>
        </main>`);
      button('rj-home-start',()=>intro());
    }
    function intro(){
      setView(`<main class="rj-page"><div class="rj-container"><div class="rj-breadcrumb"><button id="rj-intro-home" class="rj-link" type="button">首页</button><span aria-hidden="true">›</span><span>第一关 · 感悟初心</span></div><section class="rj-introcard">
        <div class="rj-introcover"><img class="rj-introseal" src="${esc(assets.emblem)}" alt="" aria-hidden="true"><div class="rj-introlabel">MODULE 01 · 感悟初心</div><h1>党的基础理论与<br>伟大建党精神</h1><p>信仰的力量，源自理论的滋养。伟大建党精神是中国共产党的精神之源，凝聚着共产党人的理想追求与使命担当。本模块围绕党的性质宗旨、初心使命、党的基础知识与伟大建党精神设置习题，通过单选、多选和知识点解析，希望大家在辨析中加深理解，在回顾中夯实理论基础，以更加坚定的信念迈出红色学习的第一步。</p></div>
        <div class="rj-introbody"><div class="rj-callout">认真阅读题目，选择你认为正确的答案；完成本关后，可查看知识点解析。题目来自小组整理的公开学习资料题库。</div>
        <p class="rj-choice-title">选择本次练习题量</p><div class="rj-counts" role="group" aria-label="选择练习题量">
        <button class="rj-count" data-size="10" type="button"><strong>10 题</strong><small>6 单选 + 4 多选</small></button>
        <button class="rj-count" data-size="20" type="button"><strong>20 题</strong><small>12 单选 + 8 多选</small></button>
        <button class="rj-count" data-size="all" type="button"><strong>全部</strong><small>51 单选 + 35 多选</small></button></div>
        <div class="rj-actions"><button id="rj-intro-start" class="rj-btn" type="button">进入第一关 <span aria-hidden="true">→</span></button><button id="rj-intro-back" class="rj-btn rj-btn-ghost" type="button">返回首页</button></div></div>
        </section></div></main>`);
      button('rj-intro-home', home);button('rj-intro-back',home);
      root.querySelectorAll('[data-size]').forEach(el=>{
        el.setAttribute('aria-pressed', String(el.dataset.size===String(ctx.selectedSize)));
        el.addEventListener('click',()=>{
          ctx.selectedSize=el.dataset.size;
          root.querySelectorAll('[data-size]').forEach(b=>b.setAttribute('aria-pressed',String(b===el)));
        });
      });
      button('rj-intro-start',()=>{ctx.questions=sampleQuestions(ctx.selectedSize);ctx.index=0;ctx.correct=0;ctx.results=[];ctx.answers=new Set();ctx.submitted=false;quiz();});
    }
    function optionMarkup(q,i){
      const label=q.options[i].label;
      const checked=ctx.answers.has(label);
      const correct=q.answer.includes(label);
      let stateClass='';
      if(ctx.submitted){if(correct)stateClass=' rj-opt-correct';else if(checked)stateClass=' rj-opt-wrong';}
      let mark=ctx.submitted?(correct?'✓':checked?'×':''):(checked?'✓':'');
      return `<button class="rj-option${stateClass}" type="button" data-option="${esc(label)}" aria-pressed="${String(checked)}" ${ctx.submitted?'disabled':''}>
        <span class="rj-optlabel">${esc(label)}</span><span class="rj-opttext">${esc(q.options[i].text)}</span><span class="rj-optmark" aria-hidden="true">${mark}</span></button>`;
    }
    function quiz(){
      const q=ctx.questions[ctx.index];
      const n=ctx.questions.length;
      const feedback=ctx.submitted ? feedbackMarkup(q):'';
      const progress=Math.round((ctx.index+(ctx.submitted?1:0))/n*100);
      setView(`<main class="rj-page"><div class="rj-container"><div class="rj-breadcrumb"><button id="rj-quiz-home" class="rj-link" type="button">首页</button><span aria-hidden="true">›</span><span>第一关 · 感悟初心</span><span aria-hidden="true">›</span><span>答题中</span></div>
        <div class="rj-quizlayout"><aside class="rj-sidecard"><div><div class="rj-steps">第一关 / 共三关</div><h3>感悟初心</h3><p>党的基础理论与伟大建党精神</p></div>
        <div class="rj-stat">${ctx.index+1} <small>/ ${n}</small></div><div class="rj-progress" aria-label="答题进度 ${progress}%"><span style="width:${progress}%"></span></div>
        <div class="rj-side-more">${ctx.submitted?'本题已提交，可查看解析。':'选择答案后点击“提交答案”。'}<br>已答对 ${ctx.correct} 题</div></aside>
        <section class="rj-quizcard"><div class="rj-quizhead"><div class="rj-quizbar"><span class="rj-qtype">${q.type==='single'?'单选题':'多选题'}${q.type==='multi'?' · 可选择多项':''}</span><span class="rj-qnumber">第 ${ctx.index+1} / ${n} 题</span></div>
        <h2>${esc(q.text)}</h2></div><div class="rj-optionlist" role="group" aria-label="题目选项">${q.options.map((_,i)=>optionMarkup(q,i)).join('')}</div>
        ${feedback}<div class="rj-quizfoot"><span class="rj-hint">${ctx.submitted?'已显示答案与知识点解析。':'请根据题目选择答案；多选题须全部选对才算正确。'}</span>
        <button id="rj-quiz-submit" type="button" class="rj-btn" ${!ctx.submitted && ctx.answers.size===0?'disabled':''}>${ctx.submitted ? (ctx.index===n-1?'完成本关，查看结果 →':'下一题 →') : '提交答案'}</button></div></section></div></div></main>`);
      button('rj-quiz-home',()=>{if(global.confirm('返回首页将结束当前答题，确定返回吗？'))home();});
      root.querySelectorAll('[data-option]').forEach(btn=>btn.addEventListener('click',()=>{
        if(ctx.submitted) return;
        const label=btn.dataset.option;
        if(q.type==='single') ctx.answers=new Set([label]);
        else if(ctx.answers.has(label))ctx.answers.delete(label);else ctx.answers.add(label);
        root.querySelectorAll('[data-option]').forEach(b=>{
          const pressed=ctx.answers.has(b.dataset.option);
          b.setAttribute('aria-pressed',String(pressed));
          b.querySelector('.rj-optmark').textContent=pressed?'✓':'';
        });
        root.querySelector('#rj-quiz-submit').disabled=ctx.answers.size===0;
      }));
      button('rj-quiz-submit',()=>{
        if(ctx.submitted){if(ctx.index===n-1)finish();else{ctx.index+=1;ctx.submitted=false;ctx.answers=new Set();quiz();}return;}
        if(ctx.answers.size===0)return;
        const expected=new Set(q.answer);
        const correct=expected.size===ctx.answers.size&&[...expected].every(a=>ctx.answers.has(a));
        if(correct)ctx.correct+=1;
        ctx.results.push({questionId:q.id,correct,selected:[...ctx.answers],answer:q.answer});
        ctx.submitted=true;quiz();
      });
    }
    function feedbackMarkup(q){
      const isCorrect=ctx.results[ctx.results.length-1].correct;
      const answer=q.answer.join('、');
      return `<div class="rj-feedback ${isCorrect?'good':'bad'}" role="status"><h3>${isCorrect?'回答正确！':'这道题还有值得思考的地方。'}</h3>
        <div>正确答案：<strong>${esc(answer)}</strong></div>
        <p><strong>知识点解析：</strong>${esc(q.explanation)}</p><div class="rj-source">资料来源：${esc(q.source)}</div></div>`;
    }
    function finish(){
      const summary={moduleId:'party',moduleName:'感悟初心',total:ctx.questions.length,correct:ctx.correct,wrong:ctx.questions.length-ctx.correct,results:ctx.results.slice()};
      if(typeof ctx.settings.onComplete==='function')ctx.settings.onComplete(summary);
      setView(`<main class="rj-page"><div class="rj-container" style="max-width:900px"><section class="rj-resultcard"><div class="rj-resulthead"><div class="rj-smallcaps">MODULE 01 COMPLETED</div><h1>初心如炬，信念如磐</h1><p>第一关 · 党的基础理论与伟大建党精神</p></div>
        <div class="rj-resultbody"><div class="rj-resultscore">${ctx.correct} <span>/ ${ctx.questions.length} 题</span></div><div style="font-size:13px;color:#9b8072">本轮正确 ${ctx.correct} 题 · 错误 ${ctx.questions.length-ctx.correct} 题</div>
        <p class="rj-resulttip">完成本模块学习，我们对党的理论与伟大建党精神有了更加系统的认识。理论学习不是停留在知识点记忆，更要内化于心，不断锤炼自身党性修养。愿我们把这份理论收获记在心里，带着思考继续走进历史长河，开启下一段学习旅程。</p>
        <div class="rj-resultactions"><button id="rj-result-again" class="rj-btn rj-btn-ghost" type="button">再练习一轮</button><button id="rj-result-home" class="rj-btn rj-btn-ghost" type="button">返回首页</button>
        ${typeof ctx.settings.onNextModule==='function'?'<button id="rj-result-next" class="rj-btn" type="button">进入第二关 →</button>':'<button id="rj-result-next" class="rj-btn" type="button" disabled>第二关待小组合并</button>'}</div>
        ${typeof ctx.settings.onNextModule==='function'?'':'<div class="rj-live-notice">单独预览版仅包含首页与第一关；完整网站合并后将接入下一关。</div>'}
        </div></section></div></main>`);
      button('rj-result-home',home);button('rj-result-again',intro);
      button('rj-result-next',()=>{if(typeof ctx.settings.onNextModule==='function')ctx.settings.onNextModule(summary);});
    }
    if(settings.view==='intro'||settings.view==='party')intro();else home();
    return {showHome:home,showParty:intro,destroy:()=>root.replaceChildren()};
  }
  global.RedJourneyParty={mount:init,getQuestionCounts:()=>({single:bank.single.length,multi:bank.multi.length,total:bank.single.length+bank.multi.length})};
})(window);
