<template>
    <div id='comment'>
        <div class='newComment'>
            <img :src="'../../../../static/' + imgName +'.jpg'"/>
            <textarea spellcheck='false' placeholder='说点什么吧...' v-model='content' id='reply' ref='textBox'></textarea>
            <div class="inputBox">
                <input type='text' placeholder='称呼' v-model='name' class='name' id='nameBox'/>
                <button @click='summit' :disabled='summitFlag'>
                    <span>{{summitFlag ? '提交中...' : '发布留言'}}</span>
                </button>
            </div>
        </div>
        <div class='allComments'>
            <div class='summary'>
                <p>
                   <span @click="getLiuyans({role:true})">最早 </span>|
                   <span @click="getLiuyans({sort: 'date',role:true})">最新 </span>|
                </p>
            </div>
            <div class='comments' v-for='(comment) in liuyans' :key='comment._id'>
                <div id='info' :class='comment.imgName'>
                    <p class='commentName'>昵称:<span>{{comment.name}}</span></p>
                    <p class='text'>留言内容:{{comment.content}}</p>
                    <div class='options'>
                         <span style="color:green;cursor:pointer" v-if="comment.isPublish">{{"已审核"}}</span>
                             <span style="color:red;cursor:pointer" v-else @click='liuyan_isPublish({_id:comment._id})'>{{"未审核"}}</span>
                           <span style="color:red;cursor:pointer;margin:0px 15px" @click="delete_liuyan({_id:comment._id})">删除</span>
                        <p class='commentDate'>{{comment.date | to_date}}</p>

                    </div>
                </div>
            </div>
            <p v-show='liuyans.length === 0' class='nocomment'>哎，没人理我 :(</p>
        </div>
    </div>
</template>

<script>
import {mapActions, mapState, mapMutations} from 'vuex'
export default {
    data () {
        return {
            name: '',
            address: '',
            content: '',
            imgName: '',
            summitFlag: false
        }
    },
    created () {
        this.getLiuyans({role:true})
        if (localStorage.token && this.user.name) {
            this.imgName = 'me'
        } else {
            this.imgName = 'reviewer'
        }
        if (localStorage.reviewer) {
            this.address = localStorage['e-mail']
            this.name = localStorage['reviewer']
        }
    },
    computed: {
        ...mapState(['liuyans', 'user']),
    },
    methods: {
        ...mapActions(['summitLiuyan', 'getLiuyans', 'liuyan_tongguo','deleteLiuyan']),
        ...mapMutations(['set_dialog']),
        liuyan_isPublish(id){
            this.liuyan_tongguo(id).then(res=>{
                this.set_dialog({
                    info:"留言审核通过",
                    hasTwoBtn:false,
                    show:true
                })
                this.getLiuyans({role:true})
            }).catch(err=>{
                 this.set_dialog({
                    info:"留言审核通过失败",
                    hasTwoBtn:false,
                    show:true
                })
            })
        },
        delete_liuyan(id){
            this.deleteLiuyan(id).then(res=>{
                this.set_dialog({
                    info: '留言删除成功',
                    hasTwoBtn: false,
                    show: true
                })
                this.getLiuyans({role:true});
            }).catch(err=>{
                this.set_dialog({
                    info: '留言删除失败',
                    hasTwoBtn: false,
                    show: true
                })
            })
        },
        summit () {
            // 限制评论内容
            if (this.content.length > 500) {
                this.set_dialog({
                    info: '您的评论内容太长，要言简意赅哦',
                    hasTwoBtn: false,
                    show: true
                })
                return false
            } else if (this.content.length < 5) {
                this.set_dialog({
                    info: '您的评论内容太短，说多一点嘛',
                    hasTwoBtn: false,
                    show: true
                })
                return false
            } else if (/\d{7,}/i.test(this.content) || // 连续7个以上数字，过滤发Q号和Q群的评论
                /(\d.*){7,}/i.test(this.content) || // 非连续的7个以上数字，过滤用字符间隔开的Q号和Q群的评论
                /\u52A0.*\u7FA4/i.test(this.content) || // 包含“加群”两字的通常是发Q群的垃圾评论
                /(\u9876.*){5,}/i.test(this.content) || // 过滤5个以上“顶”字的评论
                /([\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D\u4E03\u516B\u4E5D\u25CB\u58F9\u8D30\u53C1\u8086\u4F0D\u9646\u67D2\u634C\u7396\u96F6].*){7,}/i.test(this.content) // 过滤用汉字发Q号和Q群的评论
            ) {
                this.set_dialog({
                    info: '请不要发表灌水、广告、违法、Q群Q号等信息，感谢您的配合！',
                    hasTwoBtn: false,
                    show: true
                })
                return false
            }
            this.summitFlag = true
            this.summitLiuyan({
                name: this.name,
                content: this.content,
            }).then(() => {
                this.content = ''
                this.summitFlag = false
                this.getLiuyans({role:true})
                this.set_dialog({
                    show:true,
                    info:"留言发布成功，等待审核"
                })
            }).catch((err) => {
                this.set_dialog({
                    info: '留言发布失败',
                    hasTwoBtn: false,
                    show: true
                })
                this.summitFlag = false
                this.name = ''
            })
        },
        reply (name) {
            this.content = '@' + name + ': '
            this.$refs.textBox.focus()
        },
    },
    watch: {
        $route (to, from) {
            // #article是跳到另一篇文章，将评论框清空，#目录标题是锚点跳转，不清空评论框
            to.hash === '#article' ? this.content = '' : 0
            this.getLiuyans({role:true})
        }
    }
}

</script>

<style lang='scss' rel='stylesheet/scss' scoped>
#comment {
    margin: 1.875rem auto 0.625rem;
    padding-top: 1.875rem;
    text-align: left;
    .newComment {
        position: relative;
        width: 100%;
        img {
            position: absolute;
            top: 50%;
            left: 3.125rem;
            margin-top: -3.125rem;
            width: 6.25rem;
            height: 6.25rem;
            border: 0.125rem solid #cccccc;
            border-radius: 0.625rem;
        }
        textarea {
            color: #ffffff;
            font-size: 1.125rem;
            border: 0.125rem solid rgb(129, 216, 208);
            padding: 0.3125rem;
            border-radius: 0.625rem;
            width: calc(100% - 16.5rem);
            margin-left: 15.625rem;
            height: 12.5rem;
            resize: none;
            background: transparent;
            outline: none;
            font-family: Georgia, 'Times New Roman', 'Microsoft YaHei', '微软雅黑',  STXihei, '华文细黑',  serif;
        }
        .inputBox {
            margin-left: 15.625rem;
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            input {
                flex-grow: 1;
                margin-right: 1.5625rem;
                color: #ffffff;
                font-size: 1.125rem;
                border: 0.125rem solid rgb(129, 216, 208);
                border-radius: 0.3125rem;
                outline: none;
                width: 12.5rem;
                height: 1.5625rem;
                margin-top: 1.25rem;
                margin-bottom: 0.625rem;
                padding-left: 0.3125rem;
                display: inline-block;
                background: transparent;
            }
            button {
                flex-grow: 1;
                margin-top: 0.625rem;
            }
        }
    }
    .allComments {
        margin-top: 1.875rem;
        .summary {
            display: flex;
            justify-content: space-between;
            background: rgba(245, 245, 245, 0.5);
            padding: 0.625rem;
            border-radius:  0.3125rem;
            span {
                cursor: pointer;
                &:hover {
                    color: darkturquoise;
                 }
            }
        }
        .comments {
            position: relative;
            padding: 0.3125rem;
            margin-top: 0.625rem;
            width: 100%;
            display: flex;
            flex-wrap: wrap;
            #info {
                width: 100%;
                border: 0.125rem solid #cccccc;
                border-radius: 0.3125rem;
                padding: 0.625rem;
                color: #ccc;
                .commentName {
                    font-size: 1.125rem;
                    margin-bottom: 0.3125rem;
                    span {
                        color: darkturquoise;
                    }
                }
                .text {
                    overflow: hidden;
                    margin-top: 0.625rem;
                    margin-bottom: 0.625rem;
                }
                .options {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: flex-end;
                    text-align: right;
                    a {
                        color: white;
                        margin-right: 0.625rem;
                        i.icon-huifu {
                            margin-right: 0.3125rem;
                        }
                        &:hover {
                            color: deepskyblue;
                         }
                    }
                    p {
                        display: inline-block;
                        margin-right: 0.3125rem;
                        cursor: pointer;
                        &:hover {
                             color: darkturquoise;
                         }
                    }
                }
                img {
                    width: 3.75rem;
                    height: 3.75rem;
                    position: absolute;
                    top: 50%;
                    margin-top: -1.875rem;
                    border: 0.125rem solid #cccccc;
                    border-radius: 0.3125rem;
                }
            }
        }
        .nocomment {
            margin: 1.25rem auto;
            text-align: center;
        }
    }
}
.activeLike {
    color: #ffc520;
}
.reviewer {
    margin-left: 6.25rem;
    img {
        left: 0.625rem;
    }
    &:after {
         position: absolute;
         left: 5.55rem;
         top: 50%;
         margin-top: -0.4375rem;
         content: '';
         width: 0;
         height: 0;
         border: 0.625rem solid transparent;
         border-right-color: #000000;
         z-index: 3;
     }
    &:before {
         position: absolute;
         left: 5.4rem;
         top: 50%;
         margin-top: -0.4375rem;
         content: '';
         width: 0;
         height: 0;
         border: 0.625rem solid transparent;
         border-right-color: #cccccc;
         z-index: 2;
     }
}
.me {
    position: relative;
    margin-left: calc(40% - 7.625rem);
    img {
        right: -5.9375rem;
    }
    &:after {
         position: absolute;
         right: -1.15rem;
         top: 50%;
         margin-top: -0.5rem;
         content: '';
         width: 0;
         height: 0;
         border: 0.625rem solid transparent;
         border-left-color: #000000;
         z-index: 3;
     }
    &:before {
         position: absolute;
         right: -1.3rem;
         top: 50%;
         margin-top: -0.5rem;
         content: '';
         width: 0;
         height: 0;
         border: 0.625rem solid transparent;
         border-left-color: #cccccc;
         z-index: 2;
     }
}

@media screen and (max-width: 980px) {
    .newComment {
        img {
            display: none !important;
        }
        textarea {
            width: calc(100% - 0.875rem) !important;
            margin-left: 0 !important;
        }
        .inputBox {
            margin-left: 0 !important;
            input {
                width: 40% !important;
            }
        }
    }
}
</style>
