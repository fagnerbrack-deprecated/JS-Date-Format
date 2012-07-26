(function(window, undefined) {
	
	"use strict";
	
	//Edit your country days of week names
	var DAYS_OF_WEEK = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	
	//expose to the window object
	window.JSDateFormat = JSDateFormat;
	
	/**
	* JS Date Format 1.0.2
	* (c) 2010-2012 Fagner Martins Brack <fagnerbrack.com>
	* MIT license
	* 
	* == Supports:
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
		
		var REGEX_TEMPLATE = new RegExp("^([0-9]{2})(([/|:|-]([0-9]{2}|[0-9]{4}))|([/|:|-]([0-9]{2}))?([/|:|-]([0-9]{2}|[0-9]{4})))$"),
			REGEX_MILLIS = new RegExp("^(\\-)?[0-9]+$"),
			self = this,
			console = window.console;
		
		self.format = function(valueToFormat) {
			
			var date, ret;
			
			if( !template ) {
				console && 
					console.log("JSDateFormat:format(" + valueToFormat + ") - The template has not been defined");
				return "";
			}
			
			if( !valueToFormat ) {
				console && 
					console.log("JSDateFormat:format(" + valueToFormat + ") - There's no value to format");
				return "";
			}
			
			if( $.type(valueToFormat) !== "date" && !isMillis(valueToFormat) ) {
				console && 
					console.log("JSDateFormat:format(" + valueToFormat + ") - The given value is invalid");
				return "";
			}
			
			date = new Date( +valueToFormat );
			
			if( isNaN(date.getTime()) ) {
				console && 
					console.log("JSDateFormat:format(" + valueToFormat + ") - The given value to format a date object is invalid (Invalid Date)");
				return "";
			}
			
			ret = template;
			
			//Principal - Adicionar aqui a regex para substituir os caracteres do template
			ret = go( ret, date.getDate().toString(), new RegExp("((%d)+)"), false );
			ret = go( ret, (date.getMonth() + 1).toString(), new RegExp("((%M)+)"), false );
			ret = go( ret, date.getFullYear().toString(), new RegExp("((%y)+)"), false );
			ret = go( ret, date.getHoursDay().toString(), new RegExp("((%h)+)"), false );
			ret = go( ret, date.getHours().toString(), new RegExp("((%H)+)"), false );
			ret = go( ret, date.getMinutes().toString(), new RegExp("((%m)+)"), false );
			ret = go( ret, date.getSeconds().toString(), new RegExp("((%s)+)"), false );
			ret = go( ret, date.getMeridiem().toString(), new RegExp("((%a)+)"), true );
			ret = ret.replaceAll( "%WEEK", DAYS_OF_WEEK[date.getDay()] );
			
			return ret;
		};
		
		/**
		* Given a date template it returns the date object
		* @param val timestamp/millis to be converted to a date object
		* @param baseCurrDate Define if the current date hould be taken as a bse to the creation of the Date Object (only timestamp)
		* @return {Date} The Date object or null if any problem happens
		*/
		self.getDateObj = function( val, baseDate ) {
			var date = null;
			if( isMillis(val) ) {
				date = new Date(+val);
			} else if( isTemplate(val) ) {
				date = parseTemplate( val, baseDate );
			}
		return date;
		};
		
		/**
		* Convert string date models to a date object
		* 
		* SUPPORTS (only PT/BR format)
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
		function parseTemplate( str, baseDate ) {
			var date, array, i, string, matches, 
				day, month, year, hours, minutes, seconds;
			
			if( baseDate !== undefined ) {
				if( baseDate === true ) {
					date = new Date();
				} else if( baseDate && Object.prototype.toString.call(baseDate) === "[object Date]" && baseDate.getTime() ) {
					date = cloneDate(baseDate);
				} else {
					throw new TypeError("JSDateFormat: The baseDate is invalid");
				}
			} else {
				date = zeroDate();
			}
			
			if( str.indexOf(" ") === -1 ) {
				array = [str];
			} else {
				array = str.split(" ");
			}
			
			/**
			* If there'a space the date format is divided between date and hour
			* Split the space and verify if it has to be treated as date or hour
			* After that, set the corresponding value to the Date Pbject and returns it
			*/
			for( i = 0; i<array.length; i++ ) {
				string = array[i];
				matches = REGEX_TEMPLATE.exec(string);
				
				if( string.indexOf("/") !== -1 || string.indexOf("-") !== -1 ) { //Working with date
					
					day = matches[1];
					month = matches[6];
					year = matches[8];
					
					if(year) { date.setFullYear(+year); }
					if(month) { date.setMonth( (+month - 1) ); }
					if(day) { date.setDate(+day); }
					
				} else if( string.indexOf(":") !== -1 ) { //Working with time
					hours = matches[1]; //0-23 (There's no support for hour of day)
					minutes = matches[4] || matches[6]; //0-59 - If you pass XX:XX it will match the char in the index 4. If you pass XX:XX:XX it will match on index 6
					seconds = matches[8]; //0-59
					
					if( hours && hours.length === 2 ) {
						//Instead of setting setHours(0) use the clearTime util to reset the hour according to the daylight saving time
						if( +hours === 0 ) {
							clearTime(date);
						} else {
							date.setHours(+hours);
						}
					}
					
					if( minutes && minutes.length === 2 ) {
						date.setMinutes(+minutes);
					}
						
					if( seconds && seconds.length === 2 ) {
						date.setSeconds(+seconds);
					}
				}
			}
		return date;
		}
		
		//Make the template substitution
		function go( tmpl, val, reg, ignorePad ) {
			var len,
				match = reg.exec(tmpl);
			
			if( match && match.length ) {
				
				len = match[1].removeString('%').length;
				
				if( val.length > len ) {
					val = val.substring(val.length - len);
				}
				
				tmpl = tmpl.replaceAll( match[1], (!ignorePad ? val.padZero(len) : val) );
			}
			
		return tmpl;
		}
		
		//Verifiy if the data passed has a valid format
		//Like: "18/10/2015" - "15:14" - "15 AM" - "23:49:31"
		function isTemplate(str) {
			
			var arr = null,
				ret = false;
			
			if( typeof str === "string" ) {
				
				if( str.indexOf(" ") !== -1 ) {
					arr = str.split(" ");
				} else {
					arr = [str];
				}
				
				if(arr) {
					if( arr.length === 2 ) {
						ret = REGEX_TEMPLATE.exec(arr[0]) && REGEX_TEMPLATE.exec(arr[1]);
					} else {
						ret = REGEX_TEMPLATE.exec(arr[0]);
					}
				}
			}
		return ret;
		}
		
		//Verify if str has a valid millis format
		//Like: "216516515611" - "16892655441451"
		function isMillis(str) {
			if( typeof str !== "string" && $.isFunction(str.toString) ) {
				str = str.toString();
			}
			
			if( REGEX_MILLIS.exec(str) ) {
				return true;
			}
			
		return false;
		}
	}
	
})(window);