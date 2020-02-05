$(function () {
    //初始化滚动条
    $(".content_left_list").mCustomScrollbar();
    var $audio = $("audio");
    var player = new Player($audio);
    var progress;
    var voiceProgress;
    var lyrics;
    var lyricsOnly;


    //加载音乐列表
    getMusicList();
    function getMusicList() {
        $.ajax({
            url: "./source/musiclist.json",
            dataType: "json",
            success: function (data) {
                // console.log(data);
                player.musicList = data;
                // console.log(player.musicList);
                var $musicList = $(".content_left_list ul");
                $.each(data, function (index, ele) {
                    var $item = createMusicLi(index, ele);
                    // console.log($musicList);
                    $musicList.append($item);
                });
                initMusicInfo(data[0]);
                initMusicLyrics(data[0]);
                onlyMusicLyrics(data[0]);
            },
            error: function (e) {
                console.log(e);
            }
        });
    }

    //初始化音乐信息 list_right
    function initMusicInfo(music){
        var $musicPic = $(".song_info_pic img");
        var $musicName = $(".song_info_name a");
        var $musicSinger = $(".song_info_singer a");
        var $musicAlbum = $(".song_info_album a");
        var $musicProgressName = $(".music_progress_name");
        var $musicProgressTime = $(".music_progress_time");
        var $musicBg = $(".music_bg");

        $musicPic.attr("src", music.cover);
        $musicName.text(music.name);
        $musicSinger.text(music.singer);
        $musicAlbum.text(music.album);
        $musicProgressName.text(music.name +" / "+ music.singer);
        $musicProgressTime.text("00:00 / " + music.time);
        $musicBg.css("background", "url('"+music.cover+"')");
    }
    
    
    //初始化歌词信息
    function initMusicLyrics(music) {
        lyrics = new Lyrics(music.link_lrc);
        var $lyricsContainer = $(".song_lyrics");
        //清除上一首歌词信息
        $lyricsContainer.html("");
            lyrics.loadLyrics(function () {
            //创建歌词列表
                $.each(lyrics.lyrics, function (index, ele) {
                    var $item = $("<li>"+ele+"</li>");
                    $lyricsContainer.append($item);
                })
        });
        //歌词拖拽
        lyrics.dragLyrics();
    }

    
    //初始化进度条
    initProgress();
    function initProgress() {
        var $musicProgressBar = $(".music_progress_bar");
        var $musicProgressLine = $(".music_progress_line");
        var $musicProgressDot = $(".music_progress_dot");
        progress = Progress($musicProgressBar,$musicProgressLine,$musicProgressDot);
        progress.progressClick(function (value) {
            player.musicSeekTo(value);
        });
        progress.progressMove(function (value) {
            player.musicSeekTo(value);

        });


        var $voiceProgressBar = $(".music_voice_bar");
        var $voiceProgressLine = $(".music_voice_line");
        var $voiceProgressDot = $(".music_voice_dot");
        voiceProgress = Progress($voiceProgressBar,$voiceProgressLine,$voiceProgressDot);
        voiceProgress.progressClick(function (value) {
            player.voiceSeekTo(value);
        });
        voiceProgress.progressMove(function (value) {
            player.voiceSeekTo(value);

        });
    }

    initEvents();
    function initEvents() {
            $(".content_left_list").delegate(".list_music", "mouseenter", function () {
                //************************************li移入移出
                //显示list_item
                $(this).find(".list_menu").stop().fadeIn(100);

                //显示删除
                $(this).find(".list_Time a").stop().fadeIn(100);
                //隐藏span
                $(this).find(".list_Time span").stop().fadeOut(100);
            });
            $(".content_left_list").delegate(".list_music", "mouseleave", function () {
                //隐藏list_item、删除
                $(this).find(".list_menu").stop().fadeOut(100);
                $(this).find(".list_Time a").stop().fadeOut(100);
                //显示span
                $(this).find(".list_Time span").stop().fadeIn(100);
            });

            //删除列表
            $(".content_left_top").delegate(".del_allList", "click", function () {

            alert("确定要删除列表所有音乐？");
            $(".content_left_list li").remove();
            $(".song_info_name a").text("");
            $(".song_info_singer a").text("");
            $(".song_info_album a").text("");
            $(".song_lyrics").text("无音乐信息");
            $(".music_progress_name").text("请添加音乐");
            $(".music_progress_time").text("00:00 / 00:00");
            $(".only_lyrics").text("无音乐信息");
            $(".music_play").click(function () {
            alert("请添加音乐");
             });

        });



            //************************************复选框监听
            $(".content_left_list").delegate(".list_checkBox", "click", function () {
                $(this).toggleClass("list_checked");
            });

            //************************************监听list_menu_play点击事件
            var $musicPlay = $(".music_play");
            $(".content_left_list").delegate(".list_menu_play", "click", function () {
                var $item = $(this).parents(".list_music");
                $(this).toggleClass("list_menu_play2");
                //************************************监听menu的play按钮切换
                $item.siblings().find(".list_menu_play").removeClass("list_menu_play2");

                //子菜单和footer的播放按钮同步
                if($(this).attr("class").indexOf("list_menu_play2") !== -1){
                    //当前子菜单为播放状态
                    $musicPlay.addClass("music_pause");
                    //文字高亮
                    $item.find("div").css("color", "#fff");
                    $item.siblings().find("div").css("color", "rgba(255, 255, 255, 0.5)");

                }else {
                    $musicPlay.removeClass("music_pause");
                    $item.find("div").css("color", "rgba(255, 255, 255, 0.5)");

                }
                //切换索引状态为gif
                $item.find(".list_Number").toggleClass("list_Number2");
                $item.siblings().find(".list_Number").removeClass("list_Number2");

                //播放音乐
                player.playMusic($item.get(0).index, $item.get(0).music);
                initMusicInfo($item.get(0).music);
                initMusicLyrics($item.get(0).music);
                onlyMusicLyrics($item.get(0).music);

            });



            //监听底部播放、上一首、下一首
            $musicPlay.click(function () {

                //判断是否播放过音乐
                if(player.currentIndex == -1){
                    //没有播放过
                    $(".list_music").eq(0).find(".list_menu_play").trigger("click");
                }else {
                    //播放过
                    $(".list_music").eq(player.currentIndex).find(".list_menu_play").trigger("click");
                }

            });
            $(".music_pre").click(function () {
                $(".list_music").eq(player.preIndex()).find(".list_menu_play").trigger("click");

            });

            $(".music_next").click(function () {
                $(".list_music").eq(player.nextIndex()).find(".list_menu_play").trigger("click");

            });
            //删除musicLi
            $(".content_left_list").delegate(".list_menu_del", "click", function () {
                var $item = $(this).parents(".list_music");
                //判断删除的是否为正在播放的音乐
                if($item.index == player.currentIndex){
                    $(".music_next").trigger("click");
                }
                $item.remove();
                player.changeMusicList(this.index);
            });
            //删除后重新排序
            $(".list_music").each(function (index, ele) {
                ele.index = index;
                $(ele).find(".list_Number").text(index + 1);
            });

            //监听播放时长

            player.musicTimeUpdate(function (currentTime,duration,timeStr) {
                //同步时间
                $(".music_progress_time").text(timeStr);
                //进度条同步
                var value = currentTime / duration * 100;
                progress.setProgress(value);
                var index = lyrics.currentIndex(currentTime);
                var $item = $(".song_lyrics li").eq(index);
                $item.addClass("cur");
                $item.siblings().removeClass("cur");
                //歌词滚动 ul滚
                if(index <= 2) return;
                $(".song_lyrics").css({
                    marginTop: (-index + 2) * 25
                })
            });

            //监听纯净模式更改

            $(".footer_in").delegate(".music_only", "click", function () {
                var $item = $(this).parents(".list_music");
                //更改图标
                $(".music_only").toggleClass("music_only2");



                //更改中间内容为歌词

                if($(this).attr("class").indexOf("music_only2") != -1){

                    $(".only_lyrics_container").css("display", "block");
                    $(".content_left").css("display", "none");
                    $(".content_right").css("display", "none");
                    player.musicTimeUpdate(function (currentTime) {
                        var index = lyrics.currentIndex(currentTime);
                        var $item = $(".only_lyrics li").eq(index);
                        $item.addClass("cur");
                        $item.siblings().removeClass("cur");
                        //歌词滚动 ul滚
                        if(index <= 7) return;
                        $(".only_lyrics").css({
                            marginTop: (-index + 7) * 25
                        })
                    });

                }else {
                    $(".content_left").css("display", "inline-block");
                    $(".content_right").css("display", "inline-block");
                }
                if($(this).attr("class").indexOf("music_only2") == -1) {

                    //隐藏
                    $(".only_lyrics_container").css("display", "none");
                }


            });


            $(".music_voice_pic").click(function () {
                //图标切换
                $(this).toggleClass("music_voice_picSilence");
                //声音模式切换
                if($(this).attr("class").indexOf("music_voice_picSilence") != -1){
                    //有声音
                    player.voiceSeekTo(0);
                }else{
                    //静音
                    player.voiceSeekTo(1);

                }
            });





    }
    function onlyMusicLyrics(music) {
        lyricsOnly = new Lyrics(music.link_lrc);
        var $onlyLyrics = $(".only_lyrics");
        //清除上一首歌词信息
        $onlyLyrics.html("");
        lyricsOnly.loadLyrics(function () {
            //创建歌词列表
            $.each(lyricsOnly.lyrics, function (index, ele) {
                var $item = $("<li>"+ele+"</li>");
                $onlyLyrics.append($item);
            })
        });

    }
    



    function createMusicLi(index, music) {
        var $item = $(
            "<li class=\"list_music\">\n" +
            "<div class=\"list_checkBox\"><i></i></div>\n" +
            "<div class=\"list_Number\">"+(index + 1)+"</div>\n" +
            "<div class=\"list_Name\">"+music.name+"" +
            "     <div class=\"list_menu\">\n" +
            "          <a href=\"javascript:;\" title=\"播放\" class='list_menu_play'></a>\n" +
            "          <a href=\"javascript:;\" title=\"添加\"></a>\n" +
            "          <a href=\"javascript:;\" title=\"下载\"></a>\n" +
            "          <a href=\"javascript:;\" title=\"分享\"></a>\n" +
            "     </div>\n" +
            "</div>\n" +
            "<div class=\"list_singer\">"+music.singer+"</div>\n" +
            "<div class=\"list_Time\">\n" +
            "     <span>"+music.time+"</span>\n" +
            "     <a href=\"javascript:;\" title=\"删除\" class='list_menu_del'></a>\n" +
            "</div>\n" +
            "</li>");
        $item.get(0).index = index;
        $item.get(0).music = music;
        return $item;
    }


});