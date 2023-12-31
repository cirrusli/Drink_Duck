let timer = null
let duration = 1800
let seepDuration = 0
let seepNum = 0
let nickTextObj ={}
let timeStopStart = false;
initSetUp()

function starTimer(fun=function(){}){
  clearInterval(timer);
  timer = setInterval(function(){
    if(seepNum>=100){
      clearInterval(timer);
      noticeWater();
      resetInfo();
    }else{
      seepDuration +=1;
      seepNum =  (seepDuration / duration) * 100;
      iconTimer(seepDuration);
      fun({seepNum, seepDuration});
    }
  },1000);
  
  return {seepNum, seepDuration};
}
starTimer()

function starTimer2(callback) {
  const increment = 100 / duration; // 每秒钟需要增加的seepNum值

  const intervalId = setInterval(() => {
    seepDuration += 1000;
    seepNum += increment;
    
    if (seepNum >= 100) {
      clearInterval(intervalId);
      noticeWater();
    } else {
      iconTimer(seepNum);
    }
    
    if (callback) {
      callback({ seepNum, seepDuration });
    }
  }, 1000);
  
  return {seepNum, seepDuration}
}

// 获取基本信息
function getBginfo(){
  return {
    duration,
    seepDuration,
    seepNum
  }
}

// 重置信息
function resetInfo(fun=function(){}){
  clearInterval(timer)
  seepDuration = 0
  seepNum = 0
  starTimer()
  fun({
    duration,
    seepDuration,
    seepNum
  })
}

// 发送通知
function noticeWater(){
  const now = new Date();
  const hour = now.getUTCHours() + 8; // 转换为UTC+8时区
  if (hour >= 0 && hour < 8) { // 判断当前时间是否处于UTC+8的0点-8点之间
    return;
  }
  const {title, content, btnleft, btnright} = initSetUp()
  chrome.notifications.create({
      type: 'basic',
      iconUrl: '../img/icon.png',
      title,
      buttons: [{
          title: btnleft,
          iconUrl: '../img/stunned.png'
      }, {
          title: btnright,
          iconUrl: '../img/crying.png'
      }],
      message: content
  });

}
chrome.notifications.onButtonClicked.addListener(function (id, btnIndex) {
  if(btnIndex===0){
    resetInfo()
  }
  if(btnIndex===1){
    noticeWater()
  }
});


//插件图标的数字分钟数角标
function iconTimer(num=0){
  const text = num < duration ? Math.floor(num / 60) + '' : '危'
  const color = num < duration ? '#1daeff' : '#ff4000'
  const cb = chrome.browserAction
  cb.setBadgeText({
      text: text
  })
  cb.setBadgeBackgroundColor({
    color: color
  })
}

// 个性化设置存入缓存
function setUpLocal(data){
  setLocal({key:'setUp', val:data})
  initSetUp()
  location.reload()
}

// 初始化个性设置
function initSetUp(){
  const {
    duration:durationloc='1800', 
    title='快喝水~', 
    content='已经很久没喝水了，变烤鸭啦~', 
    btnleft='马上喝', 
    btnright='我偏不'
  } = getLocal({key:'setUp'}) || {}
  duration = Number(durationloc)
  nickTextObj.title = title
  nickTextObj.content = content
  nickTextObj.btnleft = btnleft
  nickTextObj.btnright = btnright
  return nickTextObj
}


// 暂停时间(切换)
function changeTime(flag){
  timeStopStart = flag
  if(timeStopStart){
    clearInterval(timer)
  }else{
    starTimer()
  }
}

// 获取暂停时间状态
function getTimeStart(){
  return timeStopStart
}

// 解决chrome插件，ajax访问跨域问题 ----------- start
function removeMatchingHeaders(headers, regex) {
  for (var i = 0, header; (header = headers[i]); i++) {
    if (header.name.match(regex)) {
      headers.splice(i, 1);
      return;
    }
  }
}

function responseListener(details) {
  removeMatchingHeaders(details.responseHeaders, /access-control-allow-origin/i);
  details.responseHeaders.push({ name: 'Access-Control-Allow-Origin', value: '*' });
  return { responseHeaders: details.responseHeaders };
}

chrome.webRequest.onHeadersReceived.addListener(responseListener, {
  urls: ['*://*/*']
}, [
  'blocking',
  'responseHeaders',
  'extraHeaders'
]);
// 解决chrome插件，ajax访问跨域问题 ----------- end
