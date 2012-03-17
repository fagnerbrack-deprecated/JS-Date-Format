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
 * %d - Dia no mês (01, 02...20,21)
 * %M - Mês no ano (03, 04...11, 12)
 * %y - Ano (001990, 02008, 2009, 009, 09, 9)
 * %h - Hora AM/PM (00, 01...11, 12)
 * %H - Hora no dia (00, 01...17, 18)
 * %m - Minutos em hora (05, 06...50, 51...59, 60)
 * %s - Segundos em minuto (05, 06...50, 51...59, 60)
 * %a - Retorna o post/ante meridiem (AM, PM)
 * %WEEK - Dia da semana em pt/br (Domingo, Segunda-Feira...Sexta-Feira, Sábado)
 * 
 * == Converte:
 * millisegundos
 * Date Object
 */
function JSDateFormat(template) {
	
	var REGEX_TEMPLATE = new RegExp("^([0-9]{2})(([/|:|-]([0-9]{2}|[0-9]{4}))|([/|:|-]([0-9]{2}))?([/|:|-]([0-9]{2}|[0-9]{4})))$");
	var REGEX_MILLIS = new RegExp("^(\-)?[0-9]+$");
	var DAYS_OF_WEEK = ['Domingo', 'Segunda-Feira', 'Terça-Feira', 'Quarta-Feira', 'Quinta-Feira', 'Sexta-Feira', 'Sábado'];
	var t = this;
	
	/**
	 * Formata para o template especificado ao instanciar a classe
	 */
	t.format = function(valueToFormat) {
		
		if(!template) {
			log('JSDateFormat:format(' + valueToFormat + ') - O template não foi definido');
			return "";
		}
		
		if(!valueToFormat) {
			log('JSDateFormat:format(' + valueToFormat + ') - Não foi passado nenhum valor para formatar');
			return "";
		}
		
		if($.type(valueToFormat) != 'date' && !isMillis(valueToFormat)) {
			log('JSDateFormat:format(' + valueToFormat + ') - O valor passado para formatar é inválido');
			return "";
		}
		
		var date = new Date(+valueToFormat);
		var retorno = template;
		
		if(isNaN(date.getTime())) {
			log('JSDateFormat:format(' + valueToFormat + ') - O valor passado para formatar é um objeto date inválido (Invalid Date)');
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
	 * Pega um formato de data e retorna o objeto Date()
	 * @param val timestamp/millis a ser convertido em um objeto date
	 * @param baseCurrDate Define se a data atual deve ser levado como base para a criação do objeto Date (somente timestamp).
	 * 			Se for diferente de true o objeto date será criado com base no zeroDate()
	 * Retorna null Se ocorrer alguma problema em fazer o parse
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
	 * Transforma datas de string para um objeto Date()
	 * 
	 * SUPORTA
	 * 
	 * Data:
	 * xx/xx/xxxx - dia/mes/ano
	 * xx-xx-xxxx - dis-mes-ano
	 * 
	 * Horário:
	 * xx:xx - hora:minuto
	 * xx:xx:xx - hora:minuto:segundo
	 * 
	 * Data/Horário:
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
		 * Se houver espaço o formato de data está dividido entre data e hora
		 * Dá um split no espaço e verifica se é para analisar como data ou como hora
		 * Depois seta o valor correspondente no objeto Date() e retorna ele
		 */
		for(var i = 0; i<array.length; i++) {
			var string = array[i];
			var matches = REGEX_TEMPLATE.exec(string);
			
			if(string.indexOf("/") !== -1 || string.indexOf("-") !== -1) { //Trabalhando com data
				
				var dia = matches[1];
				var mes = matches[6];
				var ano = matches[8];
				
				//Sempre setar na ordem ano -> mês -> dia
				//Se setar primeiro o dia ele vai setar na data do clearTime (01 jan 1970 00:00:00 000)
				//No caso o dia 29 de fevereiro vai pular para 01/03 no dia 01 jan 1970
				if(ano) { date.setFullYear(+ano); }
				if(mes) { date.setMonth((+mes - 1)); }
				if(dia) { date.setDate(+dia); }
				
			} else if(string.indexOf(":") != -1) { //Trabalhando com horário
				var hora = matches[1]; //0-23 (Não suporta hora do dia)
				var minutos = matches[4] || matches[6]; //0-59 - Se passar XX:XX casa no índice 4, se passar XX:XX:XX casa no índice 6
				var segundos = matches[8]; //0-59
				
				if(hora && hora.length == 2) {
					//Ao fazer o setHours(0) usa o clearTime para zerar a hora de acordo com o horário de verão
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
	
	/**
	 * faz a substituição do template
	 */
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
	
	/**
	 * Verifica se a string passada possui um formato de template de data
	 * Ex.: "18/10/2015" - "15:14" - "15 AM" - "23:49:31"
	 */
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
					//Manualmente analisa o formato com um espaço (XX/XX/XXXX XX:XX)
					retorno = REGEX_TEMPLATE.exec(arr[0]) && REGEX_TEMPLATE.exec(arr[1]);
				} else {
					retorno = REGEX_TEMPLATE.exec(arr[0]);
				}
			}
		}
	return retorno;
	}
	
	/**
	 * Verifica se o argumento passado possui um formato de millisegundo (só números)
	 * Ex.: "216516515611" - "16892655441451"
	 */
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