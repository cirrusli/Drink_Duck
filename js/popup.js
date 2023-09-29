
const BG = chrome.extension.getBackgroundPage()
const { seepNum, seepDuration } = BG.getBginfo()
const msgList = [
  { text: '吨~吨~吨~小鸭子喝水啦！' },
  { text: '每天八杯水，开心的源泉~' },
  { text: '辛苦撸代码的同时，也要多喝水哟~' },
  { text: '今天你多喝水了么？' },
  { text: '别光喝水，起来走动走动吧~' },
  { text: '工作一天了，点杯奶茶犒劳自己吧~' },
]
$(function () {
  mounted();
  // 初始化函数
  function mounted(){
    $('#maxBoxId')[BG.getTimeStart() ? 'addClass' : 'removeClass']('backwack')
    // 初始化调用鸭子移动
    setNodeSeep()
  }
  // 喝水啦
  let waterRepeat = true
  $('#resetInitId').on('click', function () {
    if (!waterRepeat) return // 防止重复点击
    waterRepeat = false
    BG.resetInfo(function () {
      const num = Math.floor(Math.random() * (msgList.length));
      $('#duckID').removeClass('roasted-duck')
      $('#msgtextId').text(msgList[num].text)
      $('#msgtextId').fadeIn()
      setTimeout(() => {
        $('#msgtextId').fadeOut()
        waterRepeat = true
      }, 3000);
      setNodeSeep()
    })
  })
  // 设置鸭子节点样式
  function setNodeSeep() {
    const { seepNum = 0 } = BG.getBginfo()
    $('#duckID').css('left', `calc(${seepNum}% - 20px)`)
    $('#seepItemId').css('width', `${seepNum}%`)
    if (seepNum >= 100) {
      $('#duckID').css('left', '86%')
      $('#duckID').addClass('roasted-duck')
    }
  }

  $('body').on('click','#duckID',antiShake(showTalk))
  function showTalk(){
    const sayList = [
      '戳我干嘛？快喝水',
      '戳戳戳，就知道戳我，快去写BUG',
      '一杯茶，一包烟，一个BUG改一天',
      '忙一天了，去摸鱼办看看热搜新鲜事儿',
      '世上无难事，只要肯放弃',
      '只要思想不滑坡，办法总比困难多',
      '起来扭扭腰，动动脖吧',
      '我是一只小黄鸭，天大地大我最大',
      '嘘！老板在你身后盯着你呢',
      '我不想变烤鸭！呜呜呜~',
    ]
    const num = Math.floor(Math.random() * sayList.length) || 0
    totalText(sayList[num])
  }
  // 显示弹层
  $('#setupId').on('click', function () {
    const {
      duration = '10',
      title = '快喝水~',
      content = '已经很久没喝水了，变烤鸭啦~',
      btnleft = '马上喝',
      btnright = '我偏不'
    } = getLoacl({ key: 'setUp' }) || {}
    $('#formTime').val(duration)
    $('#formTitle').val(title)
    $('#formCon').val(content)
    $('#formLeftBtn').val(btnleft)
    $('#formRightBtn').val(btnright)
    $('#modalSetId').fadeIn()
  })
   // 轻提示
   let timeOut = null
   function totalText(text = '温馨提示') {
     $('#msgtextId').text(text)
     $('#msgtextId').fadeIn()
     clearTimeout(timeOut)
     timeOut = setTimeout(() => {
       $('#msgtextId').fadeOut()
     }, 3000);
   }
})

