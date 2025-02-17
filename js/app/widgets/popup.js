export const popup = {
    props: ['title', 'fullscreen'],
    data() {
        return { active:0, top:0, widthVal:'500px', ml:'-250px', left:'50%', height:'auto' }
    },
    watch: {
        active:function(o, n) {
            if (o == 1 && !this.fullscreen) {
                var self = this;
                setTimeout(function() {
                    let height = self.$refs.popup.clientHeight / 2;
                    let width = self.$refs.popup.clientWidth / 2;
                    self.top = "calc(50% - " + height + "px)";
                    self.left = "calc(50% - " + width + "px)";
                }, 10);
            }
            if (this.fullscreen) {
                this.top = 0;
                this.widthVal = "100%";
                this.ml = 0;
                this.left = 0;
                this.height = "100%";
                // this.margin = "50px";
            }
        }
    },
    template: `
        <template v-if="active == 1">
            <div class="popup-back"></div>
            <div class="popup" :style="{top:top, 'min-width':widthVal, left:left, height:height}" ref="popup">
                <div class="popup-title">
                        <div class="head-title"> <p>{{title}}</p></div> 
                        <a class="close-btn" href="#" @click.prevent="active=0"><i class="fas fa-window-close fa-lg"></i></a>
                </div>
                <div class="popup-inner">
                    <slot />
                </div>
            </div>
        </template>
    `
}