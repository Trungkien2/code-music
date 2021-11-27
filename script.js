 const $ = document.querySelector.bind(document);
 const $$ = document.querySelectorAll.bind(document);
 const playlist = $('.playlist');
 const heading = $('header h2');
 const cd_thumb = $('.cd-thumb');
 const audio = $('#audio');
 const playsbtn = $('.btn-toggle-play');
 const player = $('.player');
 const progress = $('#progress');
 const nextBtn = $('.btn-next');
 const prevBtn = $('.btn-prev');
 const repeatBtn = $('.btn-repeat');
 const randomBtn = $('.btn-random');
 
 /**
 1. render songs-done
 2. scroll top -done
 3.Play/ pause/seek - done 
 4.Cd Rorate - done
 5.Next/pre -done
 6.Random - done
 7.Next/Repeat when ended -done
 8.Active songs - done
 9. Scroll active song into view - done
 10. Play Song when click
  */
 /**
  * Fix Bug
1. Hạn chế tối đa các bài hát bị lặp lại
2. Fix lỗi khi tua bài hát, click giữ một chút sẽ thấy lỗi, vì event updatetime nó liên tục chạy dẫn tới lỗi
3. Fix lỗi khi next tới 1-3 bài đầu danh sách thì không “scroll into view”
4. Lưu lại vị trí bài hát đang nghe, F5 lại ứng dụng không bị quay trở về bài đầu tiên
5. Thêm chức năng điều chỉnh âm lượng, lưu vị trí âm lượng người dùng đã chọn. Mặc định 100%
  */

 const app = {
   currentIndex : 0,
   isPlaying : false,
   isRandom : false,
   isReapeat : false,
   songs : [ 
     {
      name : 'Phi hành gia',
      author : 'Lệ quyên',
      path : './asset/music/song1.mp3',
      image : './asset/img/song1.jpg'
     },
     {
      name : 'Độ tộc 2',
      author : 'Anh Độ',
      path : './asset/music/song2.mp3',
      image : './asset/img/song2.jpg'
     },
     {
      name : 'song4',
      author : 'Lệ quyên',
      path : './asset/music/song4.mp3',
      image : './asset/img/song4.jpg'
     },
     {
      name : 'song5',
      author : 'Lệ quyên',
      path : './asset/music/song5.mp3',
      image : './asset/img/song5.jpg'
     }, 
     {
      name : 'song6',
      author : 'Lệ quyên',
      path : './asset/music/song6.mp3',
      image : './asset/img/song6.jpg'
     },
     {
      name : 'song7',
      author : 'Lệ quyên',
      path : './asset/music/song7.mp3',
      image : './asset/img/song7.jpg'
     },
     {
      name : 'song8',
      author : 'Lệ quyên',
      path : './asset/music/song8.mp3',
      image : './asset/img/song8.jpg'
     },
     {
      name : 'song9',
      author : 'Lệ quyên',
      path : './asset/music/song9.mp3',
      image : './asset/img/song9.jpg'
     },
     {
      name : 'Vượt chứng ngại vật',
      author : 'Lệ quyên',
      path : './asset/music/song3.mp3',
      image : './asset/img/song3.jpg'
     },
   ],
   render : function(){
     const htmls = this.songs.map((song,index)=>{
       return `
            <div class="song ${index === this.currentIndex ? 'active' : ''} " data-index = " ${index}">
            <div class="thumb" style="background-image: url('${song.image}">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.author}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
       `
     });
     playlist.innerHTML = htmls.join('');

   },
   // hàm xử lý các event
   handleEvent : function(){
    const _this = this;
    const cd = $('.cd');
    const cdWidth = cd.offsetWidth;
    // xử lý khi CD quay
    const cdThumpAnimted = cd_thumb.animate([
      { transform : 'rotate(360deg)'}
    ], {
      duration :10000,
      iterations : Infinity
    })
    cdThumpAnimted.pause();

    document.onscroll = function (){
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const newWidth = cdWidth - scrollTop;

        cd.style.width = newWidth>0 ?newWidth + 'px': 0;
        cd.style.opacity = newWidth / cdWidth;
    }
 
    playsbtn.onclick = function (){
      if(_this.isPlaying){
        
        audio.pause();
      }else{
       
        audio.play();
      }
      // khi song được play
      audio.onplay = function (){
        _this.isPlaying = true;
        player.classList.add('playing');
        cdThumpAnimted.play();
      }
      // khi song bị pause
      audio.onpause = function (){
        _this.isPlaying = false;
        player.classList.remove('playing');
        cdThumpAnimted.pause();
      }
      // xử lý khi thanh range
      audio.ontimeupdate = function (){
        if(audio.duration){
          const currentProgess= Math.floor(audio.currentTime/audio.duration *100);
          progress.value = currentProgess;
        }
      }
      // xử lý khi tua
      progress.onchange = function(e){
        const seekTime = audio.duration/100 * e.target.value;
        audio.currentTime = seekTime;
      }
      // xử lý khi next bài hát
      nextBtn.onclick = function(){
        if(_this.isRandom){
            _this.playRandomSong();
        }else{
          
          _this.nextSong();
        }
        audio.play();
        _this.render();
        _this.scrollActiveSong();
      }
      // xử lý khi prev bài hát 
      prevBtn.onclick = function (){
        if(_this.isRandom){
          _this.playRandomSong();
        }else{
          _this.prevSong();
        }
        audio.play();
        _this.render();
        _this.scrollActiveSong();
      }
      // random bài hát 
      randomBtn.onclick = () => {
       _this.isRandom = !_this.isRandom;
       randomBtn.classList.toggle('active',_this.isRandom);
      }
      // repeat lại bài hát
      repeatBtn.onclick = function(){
        _this.isReapeat = !_this.isReapeat;
        repeatBtn.classList.toggle('active',_this.isReapeat);
      }

      // tự next bài hát khi ended
      audio.onended = function(){
        if(_this.isReapeat){
          audio.play();
        }
        else
        // cách 1 tư đọng bấm net
           nextBtn.click();
        // cách hay là gọi lại hàm next tbn
        // cách này hơi dài dòng
      }
      // chuyển bài hát khi click vào playlist
      playlist.onclick = function (e){
        const clickSong = e.target.closest('.song:not(.active)');
        if(clickSong || e.target.closest('.option')){
          // xử lý khi click vào xong
          if(clickSong){
           _this.currentIndex = Number(clickSong.dataset.index);
           _this.loadCurrentSong();
           _this.render();
           audio.play();
          }
          // xử lý khi click vào options
        }
      }

    }
    
   },
   nextSong : function(){
    this.currentIndex++;
    if(this.currentIndex>this.songs.length-1){
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
    
   },
   prevSong : function(){
    this.currentIndex--;
    if(this.currentIndex<0){
      this.currentIndex = this.songs.length-1;
    }
    this.loadCurrentSong();

   },
   loadCurrentSong : function(){
    this.currentSong=this.songs[this.currentIndex];
        heading.textContent =this.currentSong.name ;
        cd_thumb.style.backgroundImage = `url('${this.currentSong.image}')`;
        audio.src =this.currentSong.path;
  },
  playRandomSong: function (){
    var newIndex =  Math.floor(Math.random() * this.songs.length);
    do{
        this.currentIndex = newIndex;
    }while(newIndex === this.songs.length)
    this.loadCurrentSong();
  },
  scrollActiveSong: function(){
    setTimeout(()=>{
        $('.song.active').scrollIntoView({
          behavior : 'smooth',
          block : 'nearest',
        })
    },200)
  }
  ,
   start : function (){

    // xử lý các event 
     this.handleEvent();
    
    // tải thông tin bài hát đầu tiên vào Ui khi chạy ứng dụng
    this.loadCurrentSong();

     // render playlist ra trình duyệt
      this.render();
   }
 }

 app.start();
 