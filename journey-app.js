(function(global){
  'use strict';
  const root=document.getElementById('red-journey-root');
  if(!root)throw new Error('缺少 #red-journey-root 挂载容器。');
  for(const name of ['RedJourneyParty','RedJourneyFourHistory','RedJourneySysu','RedJourneyEnding']){
    if(!global[name])throw new Error(name+' 脚本未正确加载。');
  }
  const state={party:null,fourHistory:null,sysu:null};
  let active=null;
  function switchModule(module,options){
    if(active)active.destroy();
    active=module.mount(root,options);
  }
  function showParty(view){
    switchModule(global.RedJourneyParty,{
      view:view||'home',
      onComplete(result){state.party=result;},
      onNextModule(result){state.party=result;showFourHistory();}
    });
  }
  function showHome(){showParty('home');}
  function showFourHistory(){
    switchModule(global.RedJourneyFourHistory,{
      onPreviousModule(){showParty('intro');},
      onComplete(result){state.fourHistory=result;},
      onNextModule(result){state.fourHistory=result;showSysu();}
    });
  }
  function showSysu(){
    switchModule(global.RedJourneySysu,{
      previousModulesCompleted:Boolean(state.party&&state.fourHistory),
      onHome:showHome,
      onComplete(result){state.sysu=result;},
      onReflection(result){state.sysu=result;showEnding();}
    });
  }
  function showEnding(){
    switchModule(global.RedJourneyEnding,{
      results:[state.party,state.fourHistory,state.sysu].filter(Boolean),
      onHome:showHome,
      onReview:showSysu
    });
  }
  // Preserve the integration hook offered by the original two-module version.
  global.RED_JOURNEY_ON_THIRD_MODULE=function(results){
    if(results){
      if(results.party)state.party=results.party;
      if(results.fourHistory)state.fourHistory=results.fourHistory;
    }
    showSysu();
  };
  global.RedJourneyIntegrated={
    showHome,
    showParty:()=>showParty('intro'),
    showFourHistory,
    showSysu,
    showEnding,
    // Return a copy so callers cannot overwrite the stored results.
    getResults:()=>JSON.parse(JSON.stringify(state))
  };
  showHome();
})(window);
