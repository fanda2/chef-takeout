export function formatDate(timestamp){
	const date = new Date(timestamp); // 将时间戳转换为 Date 对象
	
	const year = date.getFullYear(); // 获取年份
	const month = ('0' + (date.getMonth() + 1)).slice(-2); // 获取月份，加 1 是因为月份从 0 开始计算，然后使用 slice() 方法去掉字符串的第一个字符 0
	const day = ('0' + date.getDate()).slice(-2); // 获取日期，使用 slice() 方法去掉字符串的第一个字符 0
	const hour = ('0' + date.getHours()).slice(-2); // 获取小时，使用 slice() 方法去掉字符串的第一个字符 0
	const minute = ('0' + date.getMinutes()).slice(-2); // 获取分钟，使用 slice() 方法去掉字符串的第一个字符 0
	const second = ('0' + date.getSeconds()).slice(-2); // 获取秒数，使用 slice() 方法去掉字符串的第一个字符 0
	
	const formattedTime = `${year}-${month}-${day} ${hour}:${minute}:${second}`; // 拼接成指定格式的字符串
	return formattedTime;
}

export function numberToChinese(num) {
  var chineseNums = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九"];
  var chineseUnits = ["", "十", "百", "千", "万", "亿"];

  var result = "";
  var numStr = num.toString();

  // 处理特殊情况：0
  if (num === 0) {
    return chineseNums[0];
  }

  for (var i = 0; i < numStr.length; i++) {
    var digit = parseInt(numStr.charAt(i));
    var unit = chineseUnits[numStr.length - i - 1];

    // 处理特殊情况：处理 1X 的情况，如十一、十二
    if (digit === 1 && i === 0 && numStr.length > 1) {
      result += unit;
    } else {
      result += chineseNums[digit] + unit;
    }
  }

  return result;
}