function draw(){
    if(settings[3]){/*clear?*/
        buffer.clearRect(0,0,width,height)
    }

    buffer.lineWidth=settings[0];
    i=lines.length-1;
    do{
        buffer.beginPath();
        buffer.moveTo(lines[i][0],lines[i][1]);
        buffer.lineTo(mouse_x,mouse_y);
        buffer.closePath();
        buffer.strokeStyle='rgb('+lines[i][2]+','+lines[i][3]+','+lines[i][4]+')';
        buffer.stroke()
    }while(i--)

    if(settings[3]){/*clear?*/
        canvas.clearRect(0,0,width,height)
    }
    canvas.drawImage(get('buffer'),0,0)
}
function get(i){
    return document.getElementById(i)
}
function randomize_lines(){
    lines=[];

    i=settings[1]-1;/*number of lines*/
    do{
        lines.push([random_number(width),random_number(height),random_number(255),random_number(255),random_number(255)])
    }while(i--);

    draw()
}
function random_number(i){
    return Math.floor(Math.random()*i)
}
function resize(){
    if(mode>0){
        width=get('buffer').width=get('canvas').width=window.innerWidth;
        height=get('buffer').height=get('canvas').height=window.innerHeight;
        mouse_x=x=width/2;
        mouse_y=y=height/2;
        randomize_lines()
    }
}
function save(){
    /*randomize key*/
    if(get('randomize-key').value=='R'){
        ls.removeItem('warped2');
        settings[2]='R'
    }else{
        settings[2]=get('randomize-key').value;
        ls.setItem('warped2',settings[2])
    }

    i=1;
    do{
        j=['line-width','number-of-lines'][i];
        if(get(j).value==[1,100][i]||isNaN(get(j).value)||get(j).value<1){
            ls.removeItem('warped'+i);
            settings[i]=[1,100][i];
            get(j).value=settings[i]
        }else{
            settings[i]=parseInt(get(j).value);
            ls.setItem('warped'+i,settings[i])
        }
    }while(i--);

    i=1;
    do{
        settings[3+i]=get(['clear','mouse-lock'][i]).checked;
        if(settings[3+i]){
            ls.removeItem('warped'+(3+i))
        }else{
            ls.setItem('warped'+(3+i),0)
        }
    }while(i--)
}
function setmode(newmode){
    mode=newmode;
    if(newmode>0){
        save();

        get('page').innerHTML='<canvas id=canvas></canvas>';
        buffer=get('buffer').getContext('2d');
        canvas=get('canvas').getContext('2d');

        resize()
    }else{
        buffer=0;
        canvas=0;

        get('page').innerHTML='<div style="border-right:8px solid #222;display:inline-block;text-align:left;vertical-align:top"><div class=c><b>Warped</b></div><hr><div class=c style=color:#f00>SEIZURE WARNING!<br>FLASHING LIGHTS!</div><hr><div class=c><a onclick=setmode(1)>Lines</a></div><hr><div class=c><input id=number-of-lines size=1 type=text value='+settings[1]+'>Lines<br><input id=line-width size=1 type=text value='+settings[0]+'>Line Width<br><label><input '+(settings[4]?'checked ':'')+'id=mouse-lock type=checkbox>Mouse Lock</label></div></div><div style=display:inline-block;text-align:left><div class=c><input disabled size=3 style=border:0 type=text value=ESC>Main Menu<br><input id=randomize-key maxlength=1 size=3 type=text value='+settings[2]+'>Randomize</div><hr><div class=c><label><input '+(settings[3]?'checked ':'')+'id=clear type=checkbox>Clear</label><br><a onclick="if(confirm(\'Reset settings?\')){get(\'clear\').checked=get(\'line-width\').value=get(\'mouse-lock\').checked=1;get(\'randomize-key\').value=\'R\';get(\'number-of-lines\').value=100;save();setmode(0)}">Reset Settings</a></div></div>'
    }
}
var buffer=canvas=height=i=j=mode=mouse_x=mouse_y=x=width=y=0,
ls=window.localStorage,
settings=[
    ls.getItem('warped0')===null?1:parseInt(ls.getItem('warped0')),/*audio volume*/
    ls.getItem('warped1')===null?100:parseInt(ls.getItem('warped1')),/*number of lines*/
    ls.getItem('warped2')===null?'R':ls.getItem('warped2'),/*randomize key*/
    ls.getItem('warped3')===null,/*clear?*/
    ls.getItem('warped4')===null/*mouse lock?*/
],
lines=[];

resize();
setmode(0);

window.onkeydown=function(e){
    if(mode>0){
        i=window.event?event:e;
        i=i.charCode?i.charCode:i.keyCode;
        if(String.fromCharCode(i)===settings[2]){/*randomize key*/
            randomize_lines()
        }else if(i==27){
            setmode(0)
        }
    }
};
window.onmousedown=function(e){
    if(mode>0){
        e.preventDefault();
        if(!settings[4]){/*mouse not locked*/
            mouse_x=e.pageX;
            mouse_y=e.pageY;
            draw()
        }
    }
};
window.onmousemove=function(e){
    if(mode>0&&settings[4]){/*mouse locked*/
        mouse_x=e.pageX;
        mouse_y=e.pageY;
        draw()
    }
}

window.onresize=resize
