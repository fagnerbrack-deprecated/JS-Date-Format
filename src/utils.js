function zeroDate() {
	var i=0, d;
	do {
		d = new Date(1970, i++, 1);
	} while (d.getHours()); //!= 0
return clearTime(d);
};
function clearTime(d) {
	var day = d.getDate();
	
	d.setHours(0);
	d.setMinutes(0);
	d.setSeconds(0); 
	d.setMilliseconds(0);
	
	//DST
	for(var h = 1; d.getDate() < day; h++) {
		d.setHours(d.getHours() + h);
	}
	
	return d;
};
function cloneDate(d, dontKeepTime) {
	return dontKeepTime? clearTime(new Date(+d)): new Date(+d);
};
String.prototype.removeString = function(token, ignoreCase) {
	return this.replaceAll(token, "", ignoreCase);
};
String.prototype.replaceAll = function(token, newToken, ignoreCase) {
	var str, i = -1, _token;
	if((str = this.toString()) && typeof token === "string") {
		_token = ignoreCase === true? token.toLowerCase() : undefined;
		while((i = (
			_token !== undefined? 
				str.toLowerCase().indexOf(
							_token, 
							i >= 0? i + newToken.length : 0
				) : str.indexOf(
							token,
							i >= 0? i + newToken.length : 0
				)
		)) !== -1 ) {
		    str = str.substring(0, i)
		    		.concat(newToken)
		    		.concat(str.substring(i + token.length));
		}
	}
return str;
};
 String.prototype.padZero = function(ch) {
 	var zeros = [];
 	var t = this.toString();
 	if(ch) {
 		ch = parseInt(ch);
 		for(var i = t.length; i<ch; i++) {
 			zeros.push("0");
 		}
 	zeros.push(t);
 	}
 return zeros.join("");
 };
Date.prototype.getHoursDay = function() {
	var hour = this.getHours();
	return hour > 12? hour - 12: hour;
};
Date.prototype.getMeridiem = function() {
	var hour = this.getHours();
	return hour > 11? 'PM': 'AM';
};
function log(str) {
	if(window.console && window.console.log) {
		return window.console.log(str);
	} else if(window.location.href.indexOf('debug=true') != -1) {
		return alert(str);
	}
return;
};