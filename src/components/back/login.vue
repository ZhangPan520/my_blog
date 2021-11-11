<template>
    <div class="wrapper">
        <div class="login">
            <i class="iconfont icon-icon69"></i>
            <div>
                <input type="text" placeholder="请输入你的账号" v-model="name"/>
                <i class="iconfont icon-zhanghu"></i>
            </div>
            <div>
                <input type="password" placeholder="请输入你的密码" v-model="password" @keydown.enter="confirm(name, password,code)"/>
                <i class="iconfont icon-yuechi"></i>
            </div>
            <div>
               <input type="text" placeholder="请输入你的QQ邮箱" v-model="address" @keydown.enter="confirm(name, password,code)"/>
                <i class="iconfont">&#xe6a6;</i>
            </div>
            <div style="color:white" class="code">
               <input type="text" placeholder="输入验证码" v-model="code" @keydown.enter="confirm(name, password,code)"/>
                <i class="iconfont">&#xe6df;</i>
                <span @click="send">{{!isCode?'获取验证码':`重新发送${time}`}}</span>
            </div>
            <p>{{info}}</p>
            <button @click="confirm(name, password,code)"><span>登录</span></button>
        </div>
          <transition enter-active-class="animated fadeIn" leave-active-class="animated fadeOut">
        <dialog-box v-if="dialog.show"></dialog-box>
    </transition>
    </div>
</template>

<script>

import DialogBox from '../share/DialogBox'
import {mapActions, mapMutations,mapState}       from 'vuex'
export default {
    components:{
        DialogBox,
    },
    data () {
        return {
            name: '',
            password: '',
            info: '',
            address:'',
            //判断发送验证码是否已经执行
            time:60,
            code:'',
            isCode:false,
        }
    },
    methods: {
        ...mapActions(['login','sendCode']),
        ...mapMutations(['set_user','set_dialog']),
        send(){
            if(this.address&&this.address.match(/^\w{5,}@[a-z0-9]{2,3}\.[a-z]+$|\,$/)&&!this.isCode){
                this.isCode = true;
                this.sendCode({
                    address:this.address
                })
                var timer = setInterval(()=>{
                    this.time--;
                    if(this.time==0){
                        clearInterval(timer)
                        this.isCode = true;
                    }
                },1000)
            }else if(!this.isCode){
                this.set_dialog({
                    show:true,
                    info:"请输入正确的邮箱"
                })
            }
        },
        confirm (name, password,code) {
            console.log(typeof this.address,typeof code)
            if(name==''||password==''||this.address==''||code==''){
                this.set_dialog({
                    show:true,
                    info:"把以上选项填完"
                })
                return;
            }
            this.login({name: name, password: password,code:code,address:this.address}).then((res) => {
                this.info = '正在登录中...'
                this.set_user(res.data)
                this.$router.push({name: 'posts'})
            }).catch((err) => {
                console.dir(err)
                this.info = err.message;
            })
        },
        
    },
    computed:{
            ...mapState(['dialog'])
        },
    watch: {
        name () {
            this.info = ''
        },
        password () {
            this.info = ''
        }
    }
}
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
.wrapper {
    .login {
        width: 16.125rem;
        height: 20rem;
        margin: 7rem auto 0;
        text-align: center;
        position: relative;
        .icon-icon69 {
            font-size: 3.75rem;
            color: darkturquoise;
        }
        div {
            width: 100%;
            margin: 0 auto;
            position: relative;
            i {
                color: darkturquoise;
                font-size: 1.875rem;
                display: block;
                position: absolute;
                top: 0;
                left: 0;
                transition:  0.5s;
            }
        }
        input {
            width: 12.5rem;
            height: 1.875rem;
            display: block;
            margin-top: 2.5rem;
            margin-bottom: 1.25rem;
            margin-left: 3rem;
            outline: none;
            border: none;
            border-bottom: 0.1875rem solid darkturquoise;
            background: transparent;
            color: #fff;
            font-size: 1rem;
            padding-left: 0.625rem;
            &:focus + i {
                 color: #ffc520;
             }
        }
        button {
            width: 12.5rem;
            padding-left: 0;
            margin-top: 1.25rem;
            position: relative;
            left: 1.25rem;
            text-align: center;
            background: darkturquoise;
        }
    }
}
.code{
    position: relative;
}
.code span{
    position: absolute;
    top:0;
    right:0
}
.myInput{
    display: inline-block !important ;
}
p {
    color: #ffffff;
    width: 100%;
    height: 1.25rem;
}
@media screen and (max-width: 440px) {
    .login {
        margin-top: 2rem !important;
    }
}
</style>
