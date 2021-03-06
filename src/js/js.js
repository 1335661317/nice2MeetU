class Misaka{

    constructor(ele){
        let makeIterator = (arr) => {
            if (arr.length){
                arr[Symbol.iterator]= () => {
                    let nextIndex = 0;
                    return{
                        next: function(){
                            return nextIndex < arr.length ?
                            {value: arr[nextIndex++]} :
                            {done: true};
                        }
                    }
                }
            }else{
                arr=[arr];
            }
            return arr;

        };
        this[0]=makeIterator(ele);



    }

    static ajax(option,cbk){
        let xhr=new XMLHttpRequest();
        let pRes = () => {
            if (xhr.readyState == 4){
                if (xhr.status == 200){
                    cbk(xhr.responseText);
                }
            }
        };
        xhr.open(option.method || 'get',option.url,true);
        xhr.onreadystatechange=pRes;
        xhr.send();

    }



    getAnimationed(){
    let div = document.createElement('div'),
        style = div.style,
        animationNames = ['animation','WebkitAnimation','OAnimation','msAnimation','MozAnimation'],
        animationName = (() => {
            for (let key of animationNames) {
                if ( style[key] !== undefined ) return key;
            }
            return false;
        })(),
        aniEndName = {
            animation : 'animationend',
            WebkitAnimation : 'webkitAnimationEnd',
            OAnimation : 'oAnimationEnd',
            msAnimation : 'MSAnimationEnd',
            MozAnimation : 'mozAnimationEnd'
        }[ animationName ];
    div = style = animationNames = animationName = null;
    return aniEndName;
    }

    fadeOut(cbk){
        let fadeDone=0;

        let itemDone = () => {

            fadeDone++;
            if (fadeDone == this[0].length && cbk) cbk();
        };
        for (let ele of this[0]){

            ele.classList.add('fade-out-animation');
            let afterOut=()=>{

                ele.classList.remove('fade-out-animation');
                ele.style.display='none';
                ele.removeEventListener(this.getAnimationed(),afterOut);
                itemDone();
            };
            ele.addEventListener(this.getAnimationed(), afterOut);
        }
        return this;

    }

    fadeIn(cbk){
        let fadeDone=0;
        let itemDone = () => {
            fadeDone++;
            if (fadeDone == this[0].length && cbk) cbk();
        };
        for (let ele of this[0]){
            ele.removeAttribute('style');
            ele.style.display='block';
            ele.classList.add('fade-in-animation');

            let afterIn=()=>{
                ele.classList.remove('fade-in-animation');
                ele.removeEventListener(this.getAnimationed(),afterIn);
                itemDone();
            };
            ele.addEventListener(this.getAnimationed(), afterIn)
        }
        return this;
    }
    click(handler){
        for (let ele of this[0]){
            if (handler) {
                ele.addEventListener('click',(e) =>{
                    e.clicked=ele;
                    handler(e);
                });
            }else{
                ele.click();
            }
        }
        return this;
    }
    addClass(cls){
        for (let ele of this[0]){
           ele.classList.add(cls);
        }
        return this;
    }
    toggleClass(cls){
        for (let ele of this[0]){
            ele.classList.toggle(cls);
        }
        return this;
    }

    removeClass(cls){
        for (let ele of this[0]){
            ele.classList.remove(cls);
        }
        return this;
    }
    removeAllClass(){
        for (let ele of this[0]){
            ele.removeAttribute('class');
        }
        return this;
    }

    i18n(lang){
        Misaka.ajax({url:"./assets/i18n/"+lang+".json"},(txt)=>{
            let _=JSON.parse(txt);
            for (let ele of this[0]){
                ele.innerHTML=_[ele.getAttribute('data-i18n')] ? _[ele.getAttribute('data-i18n')] : ele.innerHTML;
            }
        });

    }


}

{

    let body=new Misaka(document.getElementsByTagName('body'));
    let loader=new Misaka(document.getElementsByClassName('loader'));
    let langDisplay=false;
    let i18n=new Misaka(document.getElementsByTagName('i18n'));
    let languageList=new Misaka(document.getElementById('lang-list'));
    let langBtn=new Misaka(document.getElementById('lang-btn')).click((e)=>{
        e.stopPropagation();
        e.preventDefault();
        if (langDisplay){
            languageList.fadeOut();
            langDisplay=false;
        }else{
            languageList.fadeIn();
            langDisplay=true;
        }

    });
    let languageItem=new Misaka(document.getElementsByClassName('lang')).click((e)=>{
        langBtn.click();
        i18n.i18n(e.clicked.getAttribute('data-i18n-item'))

    });
    let myLinks=new Misaka(document.getElementsByClassName('my-link')).click((e)=>{
        e.stopPropagation();
        e.preventDefault();
        body.fadeOut(() => {
            window.location.href=e.clicked.href;
        });
    });



    let hashHandler = () =>{
        let hash=window.location.hash.substring(3);
        if (!hash){
            window.location.hash='#!/h';
        }
        switch (hash){
            case 'h':
                body.removeAllClass().addClass('home-showing');
                break;
            case 'i':
                body.removeAllClass().addClass('i-showing');
                break;
            case 's':
                body.removeAllClass().addClass('skill-showing');
                break;
            case 'l':
                body.removeAllClass().addClass('link-showing');
                break;
            case 'w':
                body.removeAllClass().addClass('work-showing');
                break;
            default:
                window.location.hash='#!/h';
                body.addClass('home-showing');
                break;

        }
    };
    window.onhashchange=hashHandler;


    window.onload=()=>{
        hashHandler();
        let localLang=navigator.language.toLowerCase();
        console.log(localLang)
        if (localLang == "zh-cn" || localLang == "zh-tw"){
            i18n.i18n(localLang)
        }else{
            i18n.i18n('en');
        }
        loader.fadeOut();

    };


}



