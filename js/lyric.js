(function (window) {
    function Lyrics(path) {
        return new Lyrics.prototype.init(path);
    }

    Lyrics.prototype = {
        constructor: Lyrics,
        init: function (path) {
            this.path = path;
        },
        times:[],
        lyrics:[],
        index: -1,
        isMove: false,
        locationArr: [],
        loadLyrics: function (callback) {
            var $this = this;
            $.ajax({
                url: $this.path,
                dataType: "text",
                success: function (data) {
                    // console.log(data);
                    $this.parseLyrics(data);
                    callback();
                },
                error: function (e) {
                    console.log(e);
                }

            });
        },
        parseLyrics: function (data) {
            var $this = this;
            $this.times = [];
            $this.lyrics = [];
            var arrayLyrics = data.split("\n");
            // console.log(arrayLyrics);
            //[00:00.92]
            var timeReg = /\[(\d*:\d*\.\d*)\]/;
            //遍历歌词
            $.each(arrayLyrics, function (index, ele) {
                // console.log(ele);
                //歌词
                var lrc = ele.split("]")[1];
                // console.log(lrc);
                //排除空字符串
                if (lrc.length === 1) return true;
                $this.lyrics.push(lrc);

                //时间
                var res = timeReg.exec(ele);
                if (res == null) return true;
                // console.log(res);
                var timeStr = res[1];//00:00.92
                var res2 = timeStr.split(":");
                // console.log(res2);
                var t1 = parseInt(res2[0]) * 60;
                var t2 = parseFloat(res2[1]);
                var time = parseFloat(Number(t1 + t2).toFixed(2));
                $this.times.push(time);


            })
            // console.log($this.times);
            // console.log($this.lyrics);
        },
        currentIndex: function (currentTime) {
            // console.log(currentTime);
            if(currentTime >= this.times[0]){
                this.index ++;
                this.times.shift();//删除数组最前面的元素
            }
            return this.index;
        },
        dragLyrics: function () {
            var $ul = $(".song_lyrics");
            $ul.mousedown(function (event) {
                // var $this = this;
                var old_top = event.pageY;//竖直偏移量
                var change_y;
                //鼠标移动
                $(document).mousemove(function (event) {
                    var new_top = event.pageY;//新的鼠标竖直方向上的偏移量
                    //计算发生改变的偏移量是多少
                    change_y = new_top - old_top;
                    $ul.css({
                        marginTop: change_y + 'px'
                    })
                });
                $ul.mouseup(function () {
                    $(document).off("mousemove");
                })
            });
        }
    };

    Lyrics.prototype.init.prototype = Lyrics.prototype;
    window.Lyrics = Lyrics;
})(window);