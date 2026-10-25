(function(global){
  'use strict';

  const bank=global.RED_FOUR_HISTORY_QUESTIONS;
  if(!bank||!Array.isArray(bank.single)||!Array.isArray(bank.multi)){
    throw new Error('缺少 data/four-history-questions.js：请先引入四史题库脚本。');
  }

  const defaultAssets={
    logo:'assets/sysu-logo.png',
    intro:'assets/four-history-intro.jpg',
    quiz:'assets/four-history-quiz.jpg',
    result:'assets/four-history-result.jpg'
  };
  const esc=value=>String(value==null?'':value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const shuffle=items=>{
    const copy=items.slice();
    for(let i=copy.length-1;i>0;i--){
      const j=Math.floor(Math.random()*(i+1));
      [copy[i],copy[j]]=[copy[j],copy[i]];
    }
    return copy;
  };
  const sourceMarkup=value=>esc(value).replace(/(https:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener noreferrer">$1</a>').replace(/\n/g,'<br>');

  function sampleQuestions(size){
    if(size==='all')return shuffle([...bank.single,...bank.multi].map(q=>({...q})));
    const count=Number(size)===20?20:10;
    const singleCount=count===20?12:6;
    const multiCount=count-singleCount;
    return shuffle([
      ...shuffle(bank.single).slice(0,singleCount),
      ...shuffle(bank.multi).slice(0,multiCount)
    ].map(q=>({...q})));
  }

  function header(assets){
    return `<header class="fh-top"><div class="fh-container fh-topinner"><div class="fh-brand"><img class="fh-brand-logo" src="${esc(assets.logo)}" alt="中山大学校徽"><div><div class="fh-brand-name">传中大红色薪火 · 悟百年党史初心</div><div class="fh-brand-sub">网络空间安全学院 · 第28学习小组</div></div></div><div class="fh-navright">2026 年学生入党发展对象培训班</div></div></header>`;
  }
  function footer(){
    return `<footer class="fh-footer"><div class="fh-container"><p>2026 年学生入党发展对象培训班（第 3 期）第 28 学习小组</p><p>中山大学网络空间安全学院 · 学习交流作品</p></div></footer>`;
  }
  function scrollTop(){try{global.scrollTo({top:0,behavior:'instant'});}catch(_){}}

  function init(root,options){
    if(!root||typeof root.replaceChildren!=='function')throw new Error('mount 需要一个真实的 DOM 容器');
    const settings=options||{};
    const assets={...defaultAssets,...(global.FOUR_HISTORY_ASSETS||{}),...(settings.assets||{})};
    const ctx={
      root,settings,assets,
      selectedSize:String(settings.questionCount||10),
      questions:[],index:0,correct:0,submitted:false,answers:new Set(),results:[]
    };
    const setView=html=>{root.innerHTML=`<div class="fh">${header(assets)}${html}${footer()}</div>`;scrollTop();};
    const button=(id,handler)=>{const el=root.querySelector('#'+id);if(el)el.addEventListener('click',handler);};
    const leaveToPrevious=()=>{
      if(typeof settings.onPreviousModule==='function')settings.onPreviousModule();
      else intro();
    };

    function intro(){
      setView(`<main class="fh-page"><div class="fh-container"><div class="fh-breadcrumb"><button id="fh-intro-prev" class="fh-link" type="button">${typeof settings.onPreviousModule==='function'?'第一关':'本关介绍'}</button><span aria-hidden="true">›</span><span>第二关 · 回望征程</span></div>
        <section class="fh-introcard"><div class="fh-introcover" style="--fh-intro-image:url('${esc(assets.intro)}')"><div class="fh-introlabel">MODULE 02 · 回望征程</div><h1>学好“四史”<br>读懂中国</h1><p>历史是最好的教科书，也是最好的清醒剂。本模块围绕党史、新中国史、改革开放史、社会主义发展史设置习题，从重要事件、重要会议、重要人物和伟大精神中回望来路，在历史坐标中理解中国共产党为什么“能”、马克思主义为什么“行”、中国特色社会主义为什么“好”。</p><div class="fh-history-tags" aria-label="四史主题"><span>党史</span><span>新中国史</span><span>改革开放史</span><span>社会主义发展史</span></div></div>
        <div class="fh-introbody"><div class="fh-callout">认真阅读题目，选择你认为正确的答案；提交后可查看正确答案、知识点解析与资料来源。题目来自小组整理的《四史学习题库》。</div><p class="fh-choice-title">选择本次练习题量</p><div class="fh-counts" role="group" aria-label="选择练习题量">
          <button class="fh-count" data-size="10" type="button"><strong>10 题</strong><small>6 单选 + 4 多选</small></button>
          <button class="fh-count" data-size="20" type="button"><strong>20 题</strong><small>12 单选 + 8 多选</small></button>
          <button class="fh-count" data-size="all" type="button"><strong>全部</strong><small>${bank.single.length} 单选 + ${bank.multi.length} 多选</small></button></div>
        <div class="fh-actions"><button id="fh-intro-start" class="fh-btn" type="button">进入第二关 <span aria-hidden="true">→</span></button>${typeof settings.onPreviousModule==='function'?'<button id="fh-intro-back" class="fh-btn fh-btn-ghost" type="button">返回第一关</button>':''}</div></div></section></div></main>`);
      button('fh-intro-prev',leaveToPrevious);
      button('fh-intro-back',leaveToPrevious);
      root.querySelectorAll('[data-size]').forEach(el=>{
        el.setAttribute('aria-pressed',String(el.dataset.size===ctx.selectedSize));
        el.addEventListener('click',()=>{
          ctx.selectedSize=el.dataset.size;
          root.querySelectorAll('[data-size]').forEach(item=>item.setAttribute('aria-pressed',String(item===el)));
        });
      });
      button('fh-intro-start',()=>{
        ctx.questions=sampleQuestions(ctx.selectedSize);
        ctx.index=0;ctx.correct=0;ctx.results=[];ctx.answers=new Set();ctx.submitted=false;
        quiz();
      });
    }

    function optionMarkup(q,index){
      const option=q.options[index];
      const checked=ctx.answers.has(option.label);
      const correct=q.answer.includes(option.label);
      let stateClass='';
      if(ctx.submitted){
        if(correct)stateClass=' fh-opt-correct';
        else if(checked)stateClass=' fh-opt-wrong';
      }
      const mark=ctx.submitted?(correct?'✓':checked?'×':''):(checked?'✓':'');
      return `<button class="fh-option${stateClass}" type="button" data-option="${esc(option.label)}" aria-pressed="${String(checked)}" ${ctx.submitted?'disabled':''}><span class="fh-optlabel">${esc(option.label)}</span><span class="fh-opttext">${esc(option.text)}</span><span class="fh-optmark" aria-hidden="true">${mark}</span></button>`;
    }

    function feedbackMarkup(q){
      const current=ctx.results[ctx.results.length-1];
      return `<div class="fh-feedback ${current.correct?'good':'bad'}" role="status"><h3>${current.correct?'回答正确！':'这道题还有值得思考的地方。'}</h3><div>正确答案：<strong>${esc(q.answer.join('、'))}</strong></div><p><strong>知识点解析：</strong>${esc(q.explanation)}</p><div class="fh-source"><strong>资料来源：</strong><br>${sourceMarkup(q.source)}</div></div>`;
    }

    function quiz(){
      const q=ctx.questions[ctx.index];
      const total=ctx.questions.length;
      const progress=Math.round((ctx.index+(ctx.submitted?1:0))/total*100);
      setView(`<main class="fh-page fh-quizpage" style="--fh-quiz-image:url('${esc(assets.quiz)}')"><div class="fh-container"><div class="fh-breadcrumb"><button id="fh-quiz-back" class="fh-link" type="button">第二关介绍</button><span aria-hidden="true">›</span><span>回望征程</span><span aria-hidden="true">›</span><span>答题中</span></div><div class="fh-quizlayout">
        <aside class="fh-sidecard"><div><div class="fh-steps">第二关 / 共三关</div><h3>回望征程</h3><p>党史 · 新中国史<br>改革开放史 · 社会主义发展史</p></div><div class="fh-stat">${ctx.index+1} <small>/ ${total}</small></div><div class="fh-progress" aria-label="答题进度 ${progress}%"><span style="width:${progress}%"></span></div><div class="fh-side-more">${ctx.submitted?'本题已提交，可查看解析。':'选择答案后点击“提交答案”。'}<br>已答对 ${ctx.correct} 题</div></aside>
        <section class="fh-quizcard"><div class="fh-quizhead"><div class="fh-quizbar"><span class="fh-qtype">${q.type==='single'?'单选题':'多选题'}${q.type==='multi'?' · 可选择多项':''}</span><span class="fh-qnumber">第 ${ctx.index+1} / ${total} 题</span></div><h2>${esc(q.text)}</h2></div><div class="fh-optionlist" role="group" aria-label="题目选项">${q.options.map((_,index)=>optionMarkup(q,index)).join('')}</div>${ctx.submitted?feedbackMarkup(q):''}<div class="fh-quizfoot"><span class="fh-hint">${ctx.submitted?'已显示答案与知识点解析。':'多选题须全部选对才算正确。'}</span><button id="fh-quiz-submit" type="button" class="fh-btn" ${!ctx.submitted&&ctx.answers.size===0?'disabled':''}>${ctx.submitted?(ctx.index===total-1?'完成本关，查看结果 →':'下一题 →'):'提交答案'}</button></div></section>
      </div></div></main>`);
      button('fh-quiz-back',()=>{if(global.confirm('返回本关介绍将结束当前答题，确定返回吗？'))intro();});
      root.querySelectorAll('[data-option]').forEach(el=>el.addEventListener('click',()=>{
        if(ctx.submitted)return;
        const label=el.dataset.option;
        if(q.type==='single')ctx.answers=new Set([label]);
        else if(ctx.answers.has(label))ctx.answers.delete(label);else ctx.answers.add(label);
        root.querySelectorAll('[data-option]').forEach(item=>{
          const pressed=ctx.answers.has(item.dataset.option);
          item.setAttribute('aria-pressed',String(pressed));
          item.querySelector('.fh-optmark').textContent=pressed?'✓':'';
        });
        root.querySelector('#fh-quiz-submit').disabled=ctx.answers.size===0;
      }));
      button('fh-quiz-submit',()=>{
        if(ctx.submitted){
          if(ctx.index===total-1)finish();
          else{ctx.index+=1;ctx.submitted=false;ctx.answers=new Set();quiz();}
          return;
        }
        if(ctx.answers.size===0)return;
        const expected=new Set(q.answer);
        const isCorrect=expected.size===ctx.answers.size&&[...expected].every(answer=>ctx.answers.has(answer));
        if(isCorrect)ctx.correct+=1;
        ctx.results.push({questionId:q.id,correct:isCorrect,selected:[...ctx.answers],answer:q.answer.slice()});
        ctx.submitted=true;
        quiz();
      });
    }

    function finish(){
      const summary={moduleId:'four-history',moduleName:'回望征程',total:ctx.questions.length,correct:ctx.correct,wrong:ctx.questions.length-ctx.correct,results:ctx.results.slice()};
      if(typeof settings.onComplete==='function')settings.onComplete(summary);
      const rate=Math.round(ctx.correct/ctx.questions.length*100);
      setView(`<main class="fh-page"><div class="fh-container fh-resultwrap"><section class="fh-resultcard"><div class="fh-resulthead" style="--fh-result-image:url('${esc(assets.result)}')"><div class="fh-smallcaps">MODULE 02 COMPLETED</div><h1>知所从来，方明所往</h1><p>第二关 · “四史”知识学习闯关</p></div><div class="fh-resultbody"><div class="fh-resultscore">${ctx.correct} <span>/ ${ctx.questions.length} 题</span></div><div class="fh-resultmeta">正确率 ${rate}% · 正确 ${ctx.correct} 题 · 错误 ${ctx.questions.length-ctx.correct} 题</div><p class="fh-resulttip">学好“四史”，不是为了停留在对时间与事件的记忆，而是为了从历史中读懂信仰、汲取智慧、坚定方向。愿我们把对奋斗历程的理解化为继续前行的力量，带着这份历史自觉走进中大红色校史，续写薪火相传的新篇章。</p><div class="fh-resultactions"><button id="fh-result-again" class="fh-btn fh-btn-ghost" type="button">再练习一轮</button>${typeof settings.onPreviousModule==='function'?'<button id="fh-result-prev" class="fh-btn fh-btn-ghost" type="button">返回第一关</button>':''}${typeof settings.onNextModule==='function'?'<button id="fh-result-next" class="fh-btn" type="button">进入第三关 →</button>':'<button class="fh-btn" type="button" disabled>第三关待小组合并</button>'}</div>${typeof settings.onNextModule==='function'?'':`<div class="fh-live-notice">${esc(settings.pendingNotice||'单独预览版仅包含第二关；完整网站合并后将接入第三关。')}</div>`}</div></section></div></main>`);
      button('fh-result-again',intro);
      button('fh-result-prev',leaveToPrevious);
      button('fh-result-next',()=>{if(typeof settings.onNextModule==='function')settings.onNextModule(summary);});
    }

    intro();
    return {showFourHistory:intro,destroy:()=>root.replaceChildren()};
  }

  global.RedJourneyFourHistory={
    mount:init,
    getQuestionCounts:()=>({single:bank.single.length,multi:bank.multi.length,total:bank.single.length+bank.multi.length})
  };
})(window);
