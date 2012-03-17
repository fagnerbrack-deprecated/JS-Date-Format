/**
 * retorna uma data com o hor�rio 00:00:00 e dateOfMonth=1*
 */
function zeroDate() {
	var i=0, d;
	do {
		d = new Date(1970, i++, 1);
	} while (d.getHours()); //!= 0
return clearTime(d);
};

/**
 * Limpa o hor�rio de um objeto Date
 */
function clearTime(d) {
	var day = d.getDate();
	
	d.setHours(0);
	d.setMinutes(0);
	d.setSeconds(0); 
	d.setMilliseconds(0);
	
	// Considera DST: Se a data final for menor que a data inicial incrementa 1
	// hora at� que a data final seja igual � data inicial
	for(var h = 1; d.getDate() < day; h++) {
		d.setHours(d.getHours() + h);
	}
	
	return d;
};

/**
 * Faz um clone da data passada
 */
function cloneDate(d, dontKeepTime) {
	return dontKeepTime? clearTime(new Date(+d)): new Date(+d);
};

/**
 * Verifica a string e remove o conte�do passado se ele existir
 * @param {String} subs (A substring a ser removida)
 * @param {Boolean} ignoreCase (se deve ignorar mai�sculas ou min�sculas. Padr�o: false)
 * @return A nova string
 * @type String
 */
String.prototype.removeString = function(token, ignoreCase) {
	var str = this.toString();
	if(str) {
		str = str.replaceAll(token, '', ignoreCase);
	}
return str; //Sempre retornar a string
};

/**
 * @param {String} token (A substring a ser substitu�da)
 * @param {String} newToken (A nova substring)
 * @param {String} ignoreCase (Se deve ignorar mai�sculas e min�sculas. Padr�o: false)
 * @return A substring com todas as ocorr�ncias substitu�das
 * @type Boolean
 */
String.prototype.replaceAll = function(token, newToken, ignoreCase) {
	var str = this.toString();
	if(str && token) {
		if(ignoreCase === true) {
			var i = -1;
			while((i = str.toUpperCase().indexOf(token.toUpperCase())) != -1) {
			    var sb = [];
			    sb.push(str.substring(0, i));
				sb.push(newToken);
				sb.push(str.substring(i + token.length));
			    str = sb.join("");
			}
		} else {
			while(str.indexOf(token) != -1) {
				str = str.replace(token, newToken);
			}
		}
	}
return str;
};

/**
 * Preenche todos os caracteres � esquerda com 0(zeros)
 * Ex.: padZero(15, 3) = 015 - padZero(2, 5) = 00002 - padZero(237, 2) = 237
 * 
 * @param {String} v (O n�mero em string a ser modificado)
 * @param {Integer} ch (O n�mero de caracteres deste valor)
 * @return Uma string com os caracteres preenchidos com 0(zero)
 * @type String
 */
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

/**
 * Retorna o hor�rio atual entre 1 e 12
 * Para pegar o AM ou PM use 'new Date().getMeridiem()'
 */
Date.prototype.getHoursDay = function() {
	var hour = this.getHours();
	return hour > 12? hour - 12: hour;
};

/**
 * Retorna se o hor�rio atual � AM ou PM
 */
Date.prototype.getMeridiem = function() {
	var hour = this.getHours();
	return hour > 11? 'PM': 'AM';
};

/**
 * Procedimento de log padr�o de javascript no sistema
 * Se o firebug estiver ativo loga tudo no console dele
 * Se ele n�o estiver ativo e for passado o parametro debug como true na querystring exibe alert
 */
function log(str) {
	if(window.console && window.console.log) {
		return window.console.log(str);
	} else if(window.location.href.indexOf('debug=true') != -1) {
		return alert(str);
	}
return;
};