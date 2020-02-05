(function (window) {
    function Player($audio) {
        return new Player.prototype.init($audio);
    }

    Player.prototype = {
        constructor: Player,
        musicList : [],
        init: function ($audio) {
            this.$audio = $audio;
            this.audio = $audio.get(0);
        },
        currentIndex : -1,
        playMusic: function (index, music) {
            if(this.currentIndex == index){
                //是同一首音乐
                if(this.audio.paused){
                    this.audio.play();
                }else{
                    this.audio.pause();
                }
            }else {
                //不是同一首音乐
                this.$audio.attr("src", music.link_url);
                this.audio.play();
                this.currentIndex = index;
            }
        },
        preIndex: function () {
            var index = this.currentIndex - 1;
            if(index < 0){
                index = this.musicList.length -1;
            }
            return index;
        },
        nextIndex: function () {
            var index = this.currentIndex + 1;
            if(index > this.musicList.length - 1){
                index = 0;
            }
            return index;
        },
        changeMusicList: function (index) {
            this.musicList.splice(index, 1);
            //判断删除的是否是正在播放的音乐之前的音乐
            if (index < this.currentIndex){
                this.currentIndex -= 1;
            }
        },

        musicTimeUpdate: function (callback) {
            var $this = this;
            this.$audio.on("timeupdate",function () {
                // console.log(player.getMusicDuration(), player.getMusicCurrent());
                var duration = $this.audio.duration;
                var currentTime = $this.audio.currentTime;
                var timeStr = $this.getFormatDate(currentTime,duration);
                callback(currentTime,duration,timeStr);
            });
        },
        getFormatDate: function (currentTime,duration) {
            var endTMin = parseInt(duration / 60);
            var endSec = parseInt(duration % 60);
            if(endTMin < 10){
                endTMin = "0" + endTMin;
            }
            if(endSec < 10){
                endSec = "0" + endSec;
            }

            var startTMin = parseInt(currentTime / 60);
            var startSec = parseInt(currentTime % 60);
            if(endTMin < 10){
                startTMin = "0" + startTMin;
            }
            if(startSec < 10){
                startSec = "0" + startSec;
            }

            return startTMin + ":" + startSec + " / " + endTMin + ":" + endSec;
        },
        musicSeekTo: function (value) {
            if(isNaN(value)) return;
            this.audio.currentTime = this.audio.duration * value;
        },
        voiceSeekTo: function (value) {
            if(isNaN(value)) return;
            if(value < 0 || value > 1) return;
            this.audio.volume = value;
        }
    }

    Player.prototype.init.prototype = Player.prototype;
    window.Player = Player;
})(window);