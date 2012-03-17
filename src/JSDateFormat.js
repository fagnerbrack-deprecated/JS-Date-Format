/**
 * Copyright (c) 2012 Fagner Martins Brack, http://fagnerbrack.com/
 * 
 * Permission is hereby granted, free of charge, to any person obtaining
 * a copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 * 
 * The above copyright notice and this permission notice shall be
 * included in all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
 * EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
 * NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
 * LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
 * OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 * 
 * === JSDateFormat ===
 * == Suporta:
 * %d%d - Day of month (01, 02...20,21)
 * %M%M - Month of Year (03, 04...11, 12)
 * %y%y%y%y - Year (001990, 02008, 2009, 009, 09, 9)
 * %h%h - Hour AM/PM (00, 01...11, 12)
 * %H%H - Hour of day (00, 01...17, 18)
 * %m%m - Minutes in hour (05, 06...50, 51...59, 60)
 * %s%s - Seconds in minute (05, 06...50, 51...59, 60)
 * %a%a - (AM, PM)
 * %WEEK - Day of week according to the DAYS_OF_WEEK variable
 * 
 * == Converts any:
 * milliseconds
 * Date Object
 */
function JSDateFormat(template) {
	
	//Edit your country days of week names
	var DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	
	//Don't edit anything below
	var REGEX_TEMPLATE = new RegExp("^([0-9]{2})(([/|:|-]([0-9]{2}|[0-9]{4}))|([/|:|-]([0-9]{2}))?([/|:|-]([0-9]{2}|[0-9]{4})))$");
	var REGEX_MILLIS = new RegExp("^(\-)?[0-9]+$");
	var t = this;
	
	t.format = function(valueToFormat) {
		
		if(!template) {
			log('JSDateFormat:format(' + valueToFormat + ') - The template has not been defined');
			return "";
		}
		
		if(!valueToFormat) {
			log('JSDateFormat:format(' + valueToFormat + ') - There\'s no value to format');
			return "";
		}
		
		if($.type(valueToFormat) != 'date' && !isMillis(valueToFormat)) {
			log('JSDateFormat:format(' + valueToFormat + ') - The given value is invalid');
			return "";
		}
		
		var date = new Date(+valueToFormat);
		var retorno = template;
		
		if(isNaN(date.getTime())) {
			log('JSDateFormat:format(' + valueToFormat + ') - The given value to format a date object is invalid (Invalid Date)');
			return "";
		}
		
		//Principal - Adicionar aqui a regex para substituir os caracteres do template
		retorno = go(retorno, date.getDate().toString(), new RegExp("((%d)+)"), false);
		retorno = go(retorno, (date.getMonth() + 1).toString(), new RegExp("((%M)+)"), false);
		retorno = go(retorno, date.getFullYear().toString(), new RegExp("((%y)+)"), false);
		retorno = go(retorno, date.getHoursDay().toString(), new RegExp("((%h)+)"), false);
		retorno = go(retorno, date.getHours().toString(), new RegExp("((%H)+)"), false);
		retorno = go(retorno, date.getMinutes().toString(), new RegExp("((%m)+)"), false);
		retorno = go(retorno, date.getSeconds().toString(), new RegExp("((%s)+)"), false);
		retorno = go(retorno, date.getMeridiem().toString(), new RegExp("((%a)+)"), true);
		retorno = retorno.replaceAll('%WEEK', DAYS_OF_WEEK[date.getDay()]);
		
		return retorno;
	}
	
	/**
	 * Given a date template it returns the date object
	 * @param val timestamp/millis to be converted to a date object
	 * @param baseCurrDate Define if the current date hould be taken as a bse to the creation of the Date Object (only timestamp)
	 * @return null if any problem happens
	 */
	t.getDateObj = function(val, baseDate) {
		var date = null;
		if(isMillis(val)) {
			date = new Date(+val);
		} else if(isTemplate(val)) {
			date = parseTemplate(val, baseDate);
		}
	return date;
	}
	
	/**
	 * Convert string date models to a date object
	 * 
	 * SUPPORTS
	 * 
	 * Date:
	 * xx/xx/xxxx - day/month/year
	 * xx-xx-xxxx - day-month-year
	 * 
	 * Time:
	 * xx:xx - hour:minute
	 * xx:xx:xx - hour:minute:second
	 * 
	 * Date/Time:
	 * xx/xx/xxxx xx:xx:xx
	 * xx/xx/xxxx xx:xx
	 * xx-xx-xxxx xx:xx:xx
	 * xx-xx-xxxx xx:xx
	 */
	function parseTemplate(str, baseDate) {
		var date = null;
		
		if(baseDate === true) {
			date = new Date();
		} else if($.type(baseDate) == 'date' && !isNaN(baseDate.getTime())) {
			date = cloneDate(baseDate);
		} else {
			date = zeroDate();
		}
		
		var array = null;
		if(str.indexOf(" ") === -1) {
			array = [str];
		} else {
			array = str.split(" ");
		}
		
		/**
		 * If there'a space the date format is divided between date and hour
		 * Split the space and verify if it has to be treated as date or hour
		 * After that, set the corresponding value to the Date Pbject and returns it
		 */
		for(var i = 0; i<array.length; i++) {
			var string = array[i];
			var matches = REGEX_TEMPLATE.exec(string);
			
			if(string.indexOf("/") !== -1 || string.indexOf("-") !== -1) { //Working with date
				
				var dia = matches[1];
				var mes = matches[6];
				var ano = matches[8];
				
				//Always set in this order: year -> month -> day
				//If you set first the day it will jump to 01 jan 1970 00:00:00 000
				//If it is feb/29 according to the Leap Year it will jump to March/1st
				if(ano) { date.setFullYear(+ano); }
				if(mes) { date.setMonth((+mes - 1)); }
				if(dia) { date.setDate(+dia); }
				
			} else if(string.indexOf(":") != -1) { //Working with time
				var hora = matches[1]; //0-23 (There's no support for hour of day)
				var minutos = matches[4] || matches[6]; //0-59 - If you pass XX:XX it will match the char in the index 4. If you pass XX:XX:XX it will match on index 6
				var segundos = matches[8]; //0-59
				
				if(hora && hora.length == 2) {
					//Instead of setting setHours(0) use the clearTime util to reset the hour according to the daylight saving time
					if(+hora === 0) {
						clearTime(date);
					} else {
						date.setHours(+hora);
					}
				}
				
				if(minutos && minutos.length == 2)
					date.setMinutes(+minutos);
					
				if(segundos && segundos.length == 2)
					date.setSeconds(+segundos);
			}
		}
	return date;
	}
	
	//Make the template substitution
	function go(tmpl, valor, reg, ignorePad) {
		var match = reg.exec(tmpl);
		if(match && match.length) {
			var len = match[1].removeString('%').length;
			if(valor.length > len) {
				valor = valor.substring(valor.length - len);
			}
			
			tmpl = tmpl.replaceAll(match[1], (!ignorePad? valor.padZero(len) : valor));
		}
		return tmpl;
	}
	
	//Verifiy if the data passed has a valid format
	//Like: "18/10/2015" - "15:14" - "15 AM" - "23:49:31"
	function isTemplate(str) {
		
		var retorno = false;
		if($.type(str) === 'string') {
			
			var arr = null;
			if(str.indexOf(" ") !== -1) {
				arr = str.split(" ");
			} else {
				arr = [str];
			}
			
			if(arr) {
				if(arr.length === 2) {
					//Manualmente analisa o formato com um espa�o (XX/XX/XXXX XX:XX)
					retorno = REGEX_TEMPLATE.exec(arr[0]) && REGEX_TEMPLATE.exec(arr[1]);
				} else {
					retorno = REGEX_TEMPLATE.exec(arr[0]);
				}
			}
		}
	return retorno;
	}
	
	//Verify if str has a valid millis format
	//Like: "216516515611" - "16892655441451"
	function isMillis(str) {
		if($.type(str) != 'string') {
			if(str.toString) {
				str = str.toString();
			} else {
				toString(str);
			}
		}
		
		if(REGEX_MILLIS.exec(str)) {
			return true;
		}
	return false;
	}
return t;
};