`use strict`;

class Ed{
    init__(){
        this.obj=$('#text_');
        this.btn={};
        this.btn.pencil=$('#btnpencil');
        this.btn.title=$('#btntitle');
        this.btn.mark=$('#btnmark'); 
        this.btn.selector=$('#btnseletor');
        this.select='';
        this.content='';
        this.range=undefined;
        this.eles=undefined;
        this.new_obj=undefined;
        this.elesParaInHand=[];
        this.eleInHand=true;
        this.qWrite=0;
        this.exceKeys=['Enter','Backspace','Capslock','Shift'];
        this.px=0;
        this.obj.contentEditable=true;
        document.execCommand('defaultParagraphSeparator', false, 'p');
    }

    write_(){
        let event_=(e)=>{
            for(let exceKey of this.exceKeys) if(e.key==exceKey) this.qWrite++;
            if(this.qWrite==0){
                if(this.obj.querySelectorAll('p')[0]==undefined){ 
                    this.obj.innerHTML=`<p>${this.obj.innerHTML}</p>`;
                    this.get_select();
                    this.select.modify('move', 'forward', 'line');
                } 
                this.clean_();
            }else{
                if(e.key=='Enter'){
                    if(this.obj.querySelectorAll('p')[0]!=undefined){
                        if(this.obj.querySelectorAll('p')[0].innerText==String())
                            this.obj.querySelectorAll('p')[0].remove();
                    }
                    if(/Chrome/.test(navigator.userAgent)){
                        if(this.obj.lastChild!=undefined){
                            if(RegExp("<br>").test(this.obj.lastChild.innerHTML)){
                                this.obj.lastChild.innerHTML=String();
                                this.get_select();
                                this.select.modify('move', 'forward', 'line');
                            }
                        }
                    }
                }
                this.qWrite=0;
            }
        }
        this.obj.addEventListener('keyup', event_);
        this.obj.addEventListener('keypress', event_);
        this.obj.addEventListener('keydown', event_);
    }

    clean_(nameId=String()){
        this.obj.querySelectorAll('span').forEach(span => {
            for(let i=0;i<span.querySelectorAll('br').length;i++){
                span.querySelectorAll('br')[i].remove();
            }
            if(span.innerText==String()){ 
                if(span.getAttribute('id')==nameId){
                    span.remove();
                }
            }else{
                if(/Chrome/.test(navigator.userAgent) && nameId==String()){
                    if(this.obj.querySelectorAll('p')){
                        this.content=span.innerHTML.replace(/\&nbsp;/g, ' ');
                        this.obj.querySelectorAll('p')[this.obj.querySelectorAll('p').length-1].innerText+=this.content;
                        span.remove();
                    }
                }
            }
        });
    }

    get_select(){
        this.select=window.getSelection();
        this.range=this.select.getRangeAt(0);
    }

    replace_node(typee, nameId, funcStyle){
        this.get_select();
        this.eles=this.range.extractContents().childNodes;
        for(let i=0;i<this.eles.length;i++)
            if(this.eles[i].id==nameId && this.eles[i].innerText || this.eles[i].data)
                this.content+=this.eles[i].innerText || this.eles[i].data;
        if(this.content!=String()){
            this.new_obj=c$(typee);
            this.new_obj.setAttribute('id', nameId);
            funcStyle($('#selectcolor').value);
            this.new_obj.innerText=this.content;
            this.clean_(nameId);
            this.range.insertNode(this.new_obj);
            this.content=new String();
        }
        this.clean_(nameId);
        this.range.collapse(true);
    }

    clean_paraEmpty(e){
        if(e.key=='Enter')
            if(this.obj.querySelectorAll('*').length>1)
                if(this.obj.querySelectorAll('*')[0].innerHTML=='<br>')
                    this.obj.querySelectorAll('*')[0].remove();   
    }

    border_focus(pi){
        let pBorder=false;
        let intensidade=0;
        if(this.px<((window.innerWidth-(space*4))-40) && this.px>((window.innerWidth-(space*4))-80)){
            
        }else if(this.px<((window.innerWidth-(space*4))-40)){

        }
        this.obj.querySelectorAll('p')[pi].setAttribute('style', `border-${pBorder}: solid 1px rgba(0, 0, 0, ${intensidade});`);
    }


    select_node(space){
        this.btn.selector.addEventListener('click', ()=>{
            if(this.obj.querySelectorAll('p')[0]!=undefined){
                this.eleInHand=true;
                this.btn.selector.style.transform='rotate(90deg)';
                for(let i=0;i<this.obj.querySelectorAll('p').length;i++){
                    this.elesParaInHand[i]=false;
                    this.obj.querySelectorAll('p')[i].addEventListener('click', ()=>{
                        this.elesParaInHand[i]=true;
                        if(this.eleInHand===true){
                            this.eleInHand=false;
                            this.obj.addEventListener('mousemove', (e)=>{
                                if(this.elesParaInHand[i]==undefined || this.elesParaInHand[i]==true){ 
                                    this.px=((e.pageX-(space*2))+20);
                                    if(this.px>(space*2) && this.px<(window.innerWidth-(space*4)))
                                        if(this.px>((window.innerWidth-(space*4))-40))
                                            this.obj.querySelectorAll('p')[i].removeAttribute('style');
                                        else
                                            this.obj.querySelectorAll('p')[i].setAttribute('style', `width:${this.px}px`);
                                    this.obj.querySelectorAll('p')[i].addEventListener('click', ()=>{
                                        this.elesParaInHand[i]=false;
                                        this.btn.selector.style.transform='rotate(0deg)';
                                    });
                                }
                            });                
                        }
                    }); 
                }
            }else console.log('Não há parágrafos para a edição.');
        });
    }

    works_(){    
        this.btn.pencil.addEventListener('click', this.replace_node.bind(this, 'span', 'fore_',
        (color)=>{this.new_obj.style.color=color;}));
        this.btn.mark.addEventListener('click', this.replace_node.bind(this, 'span', 'mark_', 
        (color)=>{this.new_obj.style.backgroundColor=color;}));
        this.btn.title.addEventListener('click', this.replace_node.bind(this, 'h3', 'title_', function(){}));
        document.body.addEventListener('keyup' ,this.clean_paraEmpty.bind(this));
        document.body.addEventListener('keypress' ,this.clean_paraEmpty.bind(this));
        this.select_node(30);
    }
}

const ed=new Ed();
ed.init__();
ed.write_();
ed.works_();
