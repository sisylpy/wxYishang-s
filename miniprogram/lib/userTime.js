

function getPickData(message) {

  var time = _getTime();
  console.log(time);
  if (time < 14) {
    var customerTime = [
      {
        "method": "今天",
        "day": [
          {
            "dayName": "下午",
            "dayTime": ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00']
          }
        ]
      },
      {
        "method": "明天",
        "day": [
          {
            "dayName": "上午",
            "dayTime": ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00']
          },
          {
            "dayName": "下午",
            "dayTime": ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00']
          }
        ]
      },
    ];
  } else {

    var customerTime = [

      {
        "method": "明天",
        "day": [
          {
            "dayName": "上午",
            "dayTime": ['9:00', '9:30', '10:00', '10:30', '11:00', '11:30', '12:00']
          },
          {
            "dayName": "下午",
            "dayTime": ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00']
          }
        ]
      },
    ];
  }
  return customerTime;
}


function getMultiArray(){
  var multiArray = []

  var customerChoice = getPickData();

  var a = [];
  var lena = customerChoice.length;
  for (var i = 0; i < lena; i++) {
    var az = customerChoice[i].method;
    a.push(az);
  }
  
  multiArray[0] = a;

  var b = [];
  var lenb = customerChoice[0].day.length;
  for (var j = 0; j < lenb; j++) {
    var bz = customerChoice[0].day[j].dayName;
    b.push(bz);
  }
    multiArray[1] = b;

    //shijian
    var c = [];
    for(var m = 0; m < lenb; m++){
      console.log("------333")
      console.log(customerChoice[0].day[m].dayTime.length)

      var lenc = customerChoice[0].day[m].dayTime.length;
       for(var n = 0; n < lenc; n ++){
         var cz = customerChoice[0].day[m].dayTime[n];
         console.log("here??");
         console.log(cz)
         console.log("------")
         c.push(cz);

       }
      

    }

  multiArray[2] = c;

  

    return multiArray;

}



function _getTime() {
  var myDate = new Date();
  var min = myDate.getMinutes();
  //3. 设置当前时间+5分钟：把当前分钟数+30后的值重新设置为date对象的分钟数
  // myDate.setMinutes(min + 30);
  var mytime = myDate.toLocaleTimeString("chinese", {
    hour12: false
  });
  console.log(mytime);
  var newtime = mytime.split(":");
  console.log(newtime);
  var hour = newtime[0];
  var min = newtime[1];
  var nnn = hour + ":" + min;
  return hour;

}

module.exports = {
  getPickData: getPickData,
  getMultiArray: getMultiArray
}