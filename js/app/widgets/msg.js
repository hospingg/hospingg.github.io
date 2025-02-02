export const msg = {
    data:function() {
        return {
            alert: "",
            success: "",
            t1: "",
            t2: "",
            confirmTitle: "Please confirm next action",
            confirm: "",
            code: 0,
            interval: "",
        }
    },
    watch: {

    },
    mounted() {
        this.parent = this.$parent.$parent.$parent;
    },
    methods: {
        fadeIn(el, timeout, display) {
            el.style.opacity = 0;
            el.style.display = display || 'block';
            el.style.transition = `opacity ${timeout}ms`;
            setTimeout(() => {
                el.style.opacity = 1;
            }, 10);
        },
        fadeOut(el, timeout) {
            el.style.opacity = 1;
            el.style.transition = `opacity ${timeout}ms`;
            el.style.opacity = 0;

            setTimeout(() => {
                el.style.display = 'none';
            }, timeout);
        },
        successFun(msg) {
            this.success = msg;

            var self = this;
            if (document.querySelector('.msg.success')) document.querySelector('.msg.success').style = "";
            clearTimeout(self.t1);
            clearTimeout(self.t2);
            self.t1 = setTimeout(function() {
                const block = document.querySelector('.msg.success');
                self.fadeIn(block, 1000, 'flex');
                self.t2 = setTimeout(function() {
                    self.fadeOut(block, 1000);
                }, 3000);
            }, 100);
        },
        alertFun(msg) {
            console.log(msg);
            this.alert = msg;

            var self = this;
            if (document.querySelector('.msg.alert')) document.querySelector('.msg.alert').style = "";
            clearTimeout(self.t1);
            clearTimeout(self.t2);
            self.t1 = setTimeout(function() {
                const block = document.querySelector('.msg.alert');
                console.log(block);
                self.fadeIn(block, 1000, 'flex');
                self.t2 = setTimeout(function() {
                    self.fadeOut(block, 1000);
                }, 3000);
            }, 500);
        },
        confirmFun(title, text) {
            this.code = 0;
            var self = this;

            return new Promise(function(resolve, reject) {
                self.confirmTitle = title;
                self.confirm = text;
                self.$refs.confirm.active = 1;
                self.interval = setInterval(function() {
                    if (self.code > 0) resolve();
                }, 100);
            }).then(function() {
                clearInterval(self.interval);
                self.$refs.confirm.active = 0;

                if (self.code == 1) {
                    return true;
                }
                if (self.code == 2) {
                    return false;
                }
            });
        },
    },
    template: `
        <div class="msg alert" v-show="alert">
            <div class="al">
                {{alert}} <i class="fas fa-times-circle"></i> 
            </div>
        </div>
        <div class="msg success" v-show="success">
            <div class="al">
                {{success}} <i class="fas fa-check-circle"></i> 
            </div>
        </div>
        <popup ref="confirm" :title="confirmTitle">
            <div class ="msg-text"> 
                <i class="fas fa-info-circle"></i> <p> {{confirm}} </p>
                </div>
            </div>
                <div class="btns">
                    <button class="new-btn" href="#" @click.prevent="code=1">Yes</button>
                    <button class="new-btn" href="#" @click.prevent="code=2">No</button>
                </div>
            </div>
        </popup>
    `
};