// calc.js

// (C)1996 2001 Copyright calculator.com
// All rigths reserved
// DUPLICATION of this code in whole or in part
// without prior written permission from calculator.com
// IS PROHIBITED

var NDIGITS = 21;
var STACKSIZE = 12;
//formating flags
//var INTEGER = 0;
var DECIMAL = 1;
var FRACTION = 2;
var DEGREES = 3;
var TIME = 4;
var FEETINCHES = 5;
//var format = INTEGER;
var value = 0;          // current value
var valueStr = "";
var memory = 0;
var level = 0;          // no. of items on stack
var plevel = 0;          // no. of open (
var entered = true;     // has value on display been 'entered'?
var dotape = false;	//roll tape up if true
var ophit=false;		//operator button was hit need it for rolling tape
var decimal = 0;        // multiplier when entering after decimal point
var fixed = 0;          // force trailing zero display when entering decimals
var exponent = false;   // currently entering exponent?
var taperoll="";
var tape_up_img;
var tape_down_img;

var mode="RAD" //crlunit
var crlunit=1.0;

var periodHit=0;
var entryString=entryString="";
var firstZero = true;

var fract=false;
var fractEntry=false;
var fracEntryVal="";
var flevel=0;

var modeff = 0;
var usestring=0;
var memfuncHit=false;

function init()
{

	if(document.changecalc.hlp.value == "y") self.resizeTo(520,540);

	//window.menubar.visible=false;
	//self.toolbar.visible=false;
	//self.locationbar.visible=false;
	//self.personalbar.visible=false;

	value = parseFloat(document.changecalc.val.value);
	//memory=0;
	//memory = parseFloat(document.result.mem.value);
	//if(parseFloat(document.result.mem.value) == NaN)
	//	memory=0;
	//else
	memory=0;
	memory = evalNum(parseFloat(document.result.mem.value));
	if (""+memory == "NaN"){
		memory=0;
		document.result.mem.value="0";
	}
	sci_deg_img = new Image;
	sci_deg_img.src ="/img/kpad_drg_deg.jpg";
	sci_rad_img = new Image;
	sci_rad_img.src ="/img/kpad_drg_rad.jpg";
	sci_grad_img = new Image;
	sci_grad_img.src ="/img/kpad_drg_grad.jpg";

	tape_up_img = new Image;
	tape_up_img.src ="/img/kpadtape.jpg";
	tape_down_img = new Image;
	tape_down_img.src ="/img/kpadtape_d.jpg";


	formatDec_img = new Image;
	formatDec_img.src ="/img/kpad_df_dec.jpg";
	formatFra_img = new Image;
	formatFra_img.src ="/img/kpad_df_fra.jpg";

	format_ff_img = new Image;
	format_ff_img.src ="/img/kpad_ff.jpg";
	format_ffa_img = new Image;
	format_ffa_img.src ="/img/kpad_ff_ca.jpg";

	ad1_img = new Image;
	ad1_img.src ="/img/kpadtape.jpg";
	ad2_down_img = new Image;
	ad2_down_img.src ="/img/kpadtape_d.jpg";
	ad3_up_img = new Image;
	ad3_up_img.src ="/img/kpadtape.jpg";
	ad4_down_img = new Image;
	ad4_down_img.src ="http://63.71.220.218/taped.jpg";


	refresh();

}

//=======================
function reloadcalc()
{

//document.changecalc.mem.value =""+memory;
document.changecalc.mem.value =document.result.mem.value;
document.changecalc.val.value =""+value;
document.changecalc.nosci.value = document.result.nosci.value;
document.changecalc.trig.value = document.result.trig.value;
document.changecalc.frac.value = document.result.frac.value;
document.changecalc.hlp.value = document.result.hlp.value;
document.changecalc.tp.value = document.result.tp.value;

document.changecalc.taperoll.value = document.result.taperoll.value;
//alert(document.changecalc.tp.value);
document.changecalc.submit();
}




function swapImage(img_name,img_src)
{
	document[img_name].src=img_src;
}





function stackItem()
{
        this.value = 0;
        this.op = "";
}


function array(length)
{
	this[0] = 0;
	for (i=0; i<length; ++i){
		this[i] = 0;
		this[i] = new stackItem();
	}
	this.length = length;
}

stack = new array(STACKSIZE);

function push(value,op,prec)
{
        if (level==STACKSIZE)
                return false;
        for (i=level;i>0; --i){
                stack[i].value = stack[i-1].value;
                stack[i].op = stack[i-1].op;
                stack[i].prec = stack[i-1].prec;
        }
        stack[0].value = value;
        stack[0].op = op;
        stack[0].prec = prec;
        ++level;

        return true;
}

function pop()
{
        if (level==0)
                return false;
        for (i=0;i<level; ++i){
                stack[i].value = stack[i+1].value;
                stack[i].op = stack[i+1].op;
                stack[i].prec = stack[i+1].prec;
        }
        --level;

        return true;
}

//=======================
function refresh()
{

var display ;
var signat;
var  snt=false;
 	if(((""+value).lastIndexOf("e"))>=0)
		snt=true;

	if(entered){
		if(usestring==0){
			if(fract==true && value!=0){
				var afraction = toFraction(value);
				display = ""+afraction;
			}else{
				display = ""+evalNum(value);
			}
		}else{
			display = entryString;
			entryString = "";
		}
	}else{
		if(value<0)
			display = "-"+entryString;
		else
			display = entryString;
	}

	if (exponent || snt){
		if(entered)
			if (value<0)
				entryString=display.substring(1);
			else
				entryString=display;
		if((signat=(entryString.lastIndexOf("+")))<0)
			signat=(entryString.lastIndexOf("-"));
		//if (expval<0)
		if (value<0)
			entryString=entryString.substring(0,signat)+"-"+entryString.substring(signat+1,entryString.length);
		else
			entryString=entryString.substring(0,signat)+"+"+entryString.substring(signat+1,entryString.length);

		display = entryString;
		if(entered) entryString="";
		//if(value<0)
		//	display = "-"+display;

	}

	var endAT=23;
	if (exponent)
		endAT=24;
	if((signat=(display.lastIndexOf("e")))>=0)
		endAT=24;

	display = "                      " + display;//22
	display = display.substring(display.length-endAT,display.length); //should be 24 for exp

	document.result.result.value = display;

	ophit=false;
	usestring=0;
}

//=======================
function clearAll()
{
	level = 0;
	plevel = 0;
	clear();
	document.result.paren.value =	"";
}



//=======================
function clear()
{
        exponent = false;
        value = 0;
        enter();
        refresh();
}

//=======================
function clear2()
{
        exponent = false;
        value = 0;
        enter();
        refresh();
}
//=======================
function evalNum(num){
/*
	var signat=0;
	var e="";
	var lnum=0;
	if((signat=(""+num).lastIndexOf("e"))>=0){
		e=(""+num).substring((""+num).indexOf("e"),(""+num).length);
		lnum=(""+num).substring(0,(""+num).indexOf("e"));
	}else
		lnum=num;
	var n=Math.abs(lnum);
	var l=(((''+parseFloat(n)).substring((''+parseFloat(n)).indexOf('.')).length)-1)
	if (l<3)
	 return num;

	l-=1;
	var nN=(Math.round(lnum*Math.pow(10,l-1)))/Math.pow(10,l-1);
	if(signat>=0)
		return eval(""+nN+e);

	n=Math.abs(nN);
	var lN=(((''+parseFloat(n)).substring((''+parseFloat(n)).indexOf('.')).length)-1);
	if(l==lN+1)
		return num;
*/

	var signat=0;
var e="";
var lnum=0;
	if((signat=(""+num).lastIndexOf("e"))>=0){
		e=(""+num).substring((""+num).indexOf("e"),(""+num).length);
		lnum=(""+num).substring(0,(""+num).indexOf("e"));
	}else
		lnum=num;
//alert(lnum);
var n=Math.abs(lnum);

var l=(((''+parseFloat(n)).substring((''+parseFloat(n)).indexOf('.')).length)-1)

if (l<3)
	 return num;
//l-=3;
l-=1;
var nN=(Math.round(lnum*Math.pow(10,l-1)))/Math.pow(10,l-1);
n=Math.abs(nN);
var lN=(((''+parseFloat(n)).substring((''+parseFloat(n)).indexOf('.')).length)-1);
//alert(nN);
if(l==lN+1)
	return num;
if(signat>=0)
	nN=eval(""+nN+e)
return nN;
}






//=======================
function evalx()
{
var sval=0;
	if (level==0)
		return false;
	op = stack[0].op;
	sval = stack[0].value;

	if (op == '+'){
		value = sval + value;
	}else if (op == '-'){
		value = sval - value;
	}else if (op == '*'){
		value = sval * value;
	}else if (op == '/'){
		value = sval / value;
	}else if (op == "pow"){
		value = Math.pow(sval,value);
	}else if (op == "xRty"){
		value = Math.pow(sval,(1/value));
	}else if (op == "mod"){
		value = mod(sval,value);
	}else if (op == "base"){
		entryString = baseConverter(""+sval,10,value);
		usestring=1;
		value = sval;
	}else if (op == "lgyx"){
		value = custLog(sval,value);
	}
	//alert(value);
	pop();
	if (op=='(')
		return false;
	return true;
}



//=======================
function operator(op)
{
	enter();
	//alert (op);
	document.result.taperoll.value +=op+" \n";
	rvcroll();
	prec=1;
	/*
	if (op=='+' || op=='-'){
                prec = 1;
	}else if (op=='*' || op=='/')
                prec = 2;
	else if ( op=="pow" || op=="xRTy" || op=="base" || op=="mod" || op == "lgyx")
                prec = 3;

	if (level>0 && prec <= stack[0].prec)
               evalx();
  */
  if (level>0)
               evalx();

	if (!push(value,op,prec)){
                value = "NAN";
	}
	//document.result.taperoll.value +=" \n"+""+op+"\n"

	refresh();

ophit=true;
}





//=======================
function enter()
{
	if (exponent)
		value = value * Math.exp(expval * Math.LN10);
	entered = true;
	exponent = false;
	decimal = 0;
	fixed = 0;
	periodHit = 0;
	entryString="";

	flevel=0;
	fractEntry=false;
	fracEntryVal="";

	var op=" ";
	op = stack[0].op;
	if(op=="") op=" ";
	//alert (op);
	//document.result.taperoll.value +=""+op+"\n"+document.result.result.value+" \n";
	//document.result.taperoll.value +=document.result.result.value+" \n"+""+op+"\n";

	if ((value!=0)&&(memfuncHit==false))
		document.result.taperoll.value +=document.result.result.value+" \n";
	rvcroll();
	memfuncHit=false;
}



//=======================
function equals()
{

	enter();

	document.result.taperoll.value +="= \n----------------------"  + "\n" ;

	while (level>0)
                evalx();
	refresh();
	document.result.taperoll.value += "" + document.result.result.value+" \n";
	document.result.taperoll.value  += "----------------------\n";

	rvcroll();

}



//=======================
function backspace()
{
	if (!entered){

		if (decimal>1)
			fixed--;
		if (digits > 0){
			if (decimal==1){
				decimal = 0;
				digits++;
			}
			digits--;
		}
		entryString = entryString.substring(0,entryString.length-1);
		if(entryString.length == 0){
			enter();
			value=0;
		}else
			value=parseFloat(entryString);
		refresh();
	}
}



//=======================
function digit(n)
{

if(fractEntry==true){
	frafunc(n);
	return;
}
fracEntryVal+= ""+n;

if(periodHit==1)
	periodHit++;

	if (entered){
		value = 0;
		digits = 0;
		entered = false;
	}
	if (n==0){
		if (digits > 0 ){
			entryString += n;
			digits++;
			if (value<0)
				value=0-parseFloat(entryString);
			else
				value=parseFloat(entryString);
			refresh();
			return;
		}else
			return;
	}
	if (exponent){
		if (digits < 3){
			expval = expval * 10 + n;
			++digits;
			entryString += n;
			refresh();
		}
		return;
	}
	if (digits < NDIGITS-1){
		if (decimal>0){
			decimal = decimal * 10;
			++fixed;
		}
	}
	if (digits < NDIGITS){
		digits++;
		entryString += ""+n;
		if (value<0)
			value=0-parseFloat(entryString);
		else
			value=parseFloat(entryString);
		refresh();
	}else
		alert("You can only enter 21 digits\nuse SN for bigger numbers");

	doCalcHelp(" ");
}

//=======================
function sign()
{

	if (exponent)
		expval = -expval;
//	else
		value = -value;



	refresh();
}


//=======================
function period()
{
if(periodHit==0)
	periodHit=1;

	if (entered){
		value = 0;
		digits = 1;
	}
	entered = false;
	if (decimal == 0)
		decimal = 1;

	if(periodHit==1){
		if (value==0)
			entryString = "0.";
		else
			entryString += ".";
	}
	value=parseFloat(entryString);
	refresh();
}

//=======================


function basicfunc(f)
{
var fs=""; //function string the function pretty name for the tape

	enter();

 	switch(f){
 		case  "sqrt":
			value = Math.sqrt(value);
			fs="square root";
			break;
		case  "%":
			value = value/100;
			break;
		case  "%%":
			value = value/1000;
		default:

	}
	if(fs=="")
		fs=f;
	//if (f=="%%")
	//	fs="‰";

	refresh();

	document.result.taperoll.value +=""+fs+" \n"+ document.result.result.value+" \n";
	rvcroll();

}
function memfunc(f)
{
	memfuncHit=true;
	enter();

	//if(memory=="NaN" || memory==NaN){
	//	memory=0;
	//	alert("1 fo  "+memory);

	//}
	//alert(memory);


	if (f=="TC"){
		document.result.tape.value = "";
		document.result.taperoll.value = "";
		plevel=0;
	}else if (f=="MR"){
		value = memory;
		doCalcHelp(f);
 	}else if (f=="MC"){
		memory=0;
		document.result.mem.value = memory;
	}else if (f=="M+"){
            memory += value;
		document.result.mem.value = memory;
	}else if (f=="M-"){
		memory -= value;
	}

	refresh();
	memory=evalNum(memory);
	document.result.mem.value = memory;

}

//=======================
function openp()
{
	enter();
	if (!push(0,'(',0))
		value = "NAN";
	document.result.taperoll.value += "\n";
	refresh();

	for (i=plevel;i>0; --i)
		document.result.taperoll.value += " ";
	document.result.taperoll.value += "(\n";
	plevel++;

	rvcroll();

	document.result.paren.value =	"("+plevel;

}



//=======================
function closep()
{
	if (plevel>0){
		enter();
		while (evalx())
                ;

		document.result.taperoll.value += " "+document.result.result.value;
		refresh();

		document.result.taperoll.value += "\n";
		plevel--;

		for (i=plevel;i>0; --i)
			document.result.taperoll.value += " ";
		document.result.taperoll.value += ")\n";

		rvcroll();

		ophit=true;

		if(plevel==0)
			document.result.paren.value =	" ";
		else
			document.result.paren.value =	"("+plevel;
	}


}


//=======================
function sn()
{
	if (entered || exponent)
		return;
	exponent = true;
	expval = 0;
	digits = 0;
	decimal = 0;
	entryString +="e+" ;
	refresh();

}
//help
function doCalcHelp(button){

	if(document.changecalc.hlp.value=="y")
		doHelp(button);
}

function openOptions(){

	document.changecalc.etc.value ="y";
	reloadcalc();
}

//tape
//=======================
function tape()
{
var tp=document.result.tp.value
if(tp == 4 || tp== -4 || tp==6 || tp==-6|| tp==8 || tp==-8 || tp==12 || tp==-12 )
;else document.result.tp.value = -4;

	//alert(document.result.tp.value);
if (document.result.tp.value > 1)
	document.result.tp.value = ""+0 - parseInt(document.result.tp.value);
else
	document.result.tp.value = ""+Math.abs(parseInt(document.result.tp.value));
//alert(document.result.tp.value);
reloadcalc();
}
//=======================
function rvcroll()

{

var rvctape="";


if(dotape){

var tapelen = document.result.taperoll.value.length;
var i = 0, j = 0;

	while (i < tapelen) {
		i = document.result.taperoll.value.indexOf('\n', i) ;
		rvctape = document.result.taperoll.value.substring(j, i)+ rvctape;
		j = i++;
	 	if (i == 0) break;
	}
	document.result.tape.value=rvctape.substring(1, tapelen) ;
}else
	document.result.tape.value = document.result.taperoll.value;
	document.result.tape.scrollTop = 99999;

}



//=======================
function tagleroll()
{

	if(dotape) dotape = false;
	else dotape = true;
	if(dotape){
		rvcroll();
		swapImage("tape_up_img","http://63.71.220.218/taped.jpg")
		swapImage("tape_up_img",tape_down_img.src)
	}else{
		document.result.tape.value=document.result.taperoll.value;
		swapImage("tape_up_img",tape_up_img.src)

	}

}

//=======================
function add2tape(){

//document.result.taperoll.value+=add2tapeVAL+"\n";
document.result.taperoll.value+=document.result.add2tapeVAL.value+"\n";


document.result.tape.value=document.result.taperoll.value;

}
//=======================
var win = null;

function printTape(printer)
{


	if(win != null)
		win.close();

	win = window.open('','calcTape','scrollbars=yes,menubar=yes,resizable=yes,width=220,height=460,screenX=280,screenY=30');
	win.document.open();
	win.document.write(
	"<html><title>calculator.com tape          </title></head><body >"+
	"<h2>calculator tape</h2>"+
	"<pre>"+
	document.result.taperoll.value+
	"</pre><script>this.moveTo(280,30);</script>");
	if(printer)
		win.document.write(" <script>this.print();</script> ");
	win.document.write("</body></html>");

	//if(printer)
	//	win.print();
}







//=======================
var counter=0;
function doAd()
{
counter++;
if (counter==10)
	counter=0;

}
