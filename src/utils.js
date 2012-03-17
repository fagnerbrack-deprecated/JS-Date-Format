/**
 * retorna uma data com o horário 00:00:00 e dateOfMonth=1*
 */
function zeroDate() {
	var i=0, d;
	do {
		d = new Date(1970, i++, 1);
	} while (d.getHours()); //!= 0
return clearTime(d);
};

/**
 * Limpa o horário de um objeto Date
 */
function clearTime(d) {
	var day = d.getDate();
	
	d.setHours(0);
	d.setMinutes(0);
	d.setSeconds(0); 
	d.setMilliseconds(0);
	
	// Considera DST: Se a data final for menor que a data inicial incrementa 1
	// hora até que a data final seja igual à data inicial
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
 * Verifica a string e remove o conteúdo passado se ele existir
 * @param {String} subs (A substring a ser removida)
 * @param {Boolean} ignoreCase (se deve ignorar maiúsculas ou minúsculas. Padrão: false)
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
 * @param {String} token (A substring a ser substituída)
 * @param {String} newToken (A nova substring)
 * @param {String} ignoreCase (Se deve ignorar maiúsculas e minúsculas. Padrão: false)
 * @return A substring com todas as ocorrências substituídas
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
 * Preenche todos os caracteres à esquerda com 0(zeros)
 * Ex.: padZero(15, 3) = 015 - padZero(2, 5) = 00002 - padZero(237, 2) = 237
 * 
 * @param {String} v (O número em string a ser modificado)
 * @param {Integer} ch (O número de caracteres deste valor)
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
 * Retorna o horário atual entre 1 e 12
 * Para pegar o AM ou PM use 'new Date().getMeridiem()'
 */
Date.prototype.getHoursDay = function() {
	var hour = this.getHours();
	return hour > 12? hour - 12: hour;
};

/**
 * Retorna se o horário atual é AM ou PM
 */
Date.prototype.getMeridiem = function() {
	var hour = this.getHours();
	return hour > 11? 'PM': 'AM';
};

/**
 * Procedimento de log padrão de javascript no sistema
 * Se o firebug estiver ativo loga tudo no console dele
 * Se ele não estiver ativo e for passado o parametro debug como true na querystring exibe alert
 */
function log(str) {
	if(window.console && window.console.log) {
		return window.console.log(str);
	} else if(window.location.href.indexOf('debug=true') != -1) {
		return alert(str);
	}
return;
};