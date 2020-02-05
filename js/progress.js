(function (window) {
    function Progress($musicProgressBar,$musicProgressLine,$musicProgressDot) {
        return new Progress.prototype.init($musicProgressBar,$musicProgressLine,$musicProgressDot);
    }

    Progress.prototype = {
        constructor: Progress,
        init: function ($musicProgressBar,$musicProgressLine,$musicProgressDot) {
            this.$musicProgressBar = $musicProgressBar;
            this.$musicProgressLine = $musicProgressLine;
            this.$musicProgressDot = $musicProgressDot;

        },
        isMove:false,
        progressClick: function (callback) {
            var $this = this;
            this.$musicProgressBar.click(function (event) {
                //背景距离window的位置
                var offsetWidth = $(this).offset().left;
                var eventPageX = event.pageX;
                // console.log(offsetWidth, eventPageX);
                var $progressLineWidth = eventPageX - offsetWidth;
                $this.$musicProgressLine.css("width", $progressLineWidth);
                $this.$musicProgressDot.css("left", $progressLineWidth);
                var value = $progressLineWidth / $(this).width();
                callback(value);
            });
        },
        progressMove: function (callback) {
            var $this = this;
            var eventLeft;
            var offsetWidth = this.$musicProgressBar.offset().left;
            var barWidth = this.$musicProgressBar.width();

            //监听按下
            this.$musicProgressBar.mousedown(function () {
                $this.isMove = true;

                //监听移动
                $(document).mousemove(function (event) {
                    eventLeft = event.pageX;
                    // console.log(offsetWidth, eventPageX);
                    var offset = eventLeft - offsetWidth;
                    if (offset >= 0 && offset <= barWidth){
                        $this.$musicProgressLine.css("width", (eventLeft - offsetWidth));
                        $this.$musicProgressDot.css("left", (eventLeft - offsetWidth));

                    }

                });
            });

            //监听抬起
            $(document).mouseup(function () {
                $(document).off("mousemove");
                $this.isMove = false;
                var value = (eventLeft - offsetWidth)/ barWidth;
                callback(value);
            });
        },
        setProgress: function (value) {
            if(this.isMove) return;
            if(value < 0 || value > 100) return;
            this.$musicProgressLine.css({
                width: value + "%"
            });
            this.$musicProgressDot.css({
                left: value + "%"
            });

        }


    };

    Progress.prototype.init.prototype = Progress.prototype;
    window.Progress = Progress;
})(window);