<template>
    <div>
        <a href="https://github.com/ZhangPan66" class="iconfont icon-iconsf"></a>
        <a class="iconfont icon-github" href="https://github.com/ZhangPan66"></a>
        <a href="https://github.com/ZhangPan66" class="iconfont icon-cion15"></a>
        <!-- <p>粤ICP备17036548号</p> -->
        <p>浏览人数{{$store.state.visible_people}}</p>
        <p>Copyright @ 2021 by vue | <router-link :to="{name: 'login'}" tag="span" class="login">站长登录</router-link></p>
    </div>
</template>

<script>
export default {}

</script>

<style lang="scss" rel="stylesheet/scss" scoped>
    .iconfont {
       font-size: 1.875rem;
       color: #fff;
       margin-right: 0.625rem;
    }
    .icon-github:hover {
             color: royalblue;
    }
    .icon-cion15 {
        font-size: 1.625rem;
    }
    .icon-cion15:hover {
        color: deepskyblue;
    }
    .icon-iconsf:hover {
        color: green;
    }
    div {
        text-align: center;
        padding-top: 0.625rem;
        line-height: 2.5rem;
        width: 100%;
        background: rgba(55, 57, 65, 0.5);
    }
    p {
        text-align: center;
        color: #ffffff;
        font-size: 1rem;
    }
    span.login {
        cursor: pointer;
        color: #fff;
    }
</style>
