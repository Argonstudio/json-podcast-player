/*
Иван Войтков
HTML5 проигрыватель и получение данных с сервера. 2016
voitkov.ne@yandex.ru

*/


//Создаем плеер
function videoPlayerInference(data) {
        
        videoPlayerCreated = true;
    
        var video = document.createElement('video');
        video.id = "videoPlayer";
        
        video.setAttribute("ontimeupdate","runnerPlayer()");
        video.setAttribute("onclick","funcSwitch()");
        video.setAttribute("onprogress","updateLoading()");
        video.setAttribute("ondurationchange","updateLoading()");

        video.setAttribute("src",data.play.high);
        
        //if(data.type_content === "video") {
            //fonPlayer.classList.add("typeVideo");
        //}

        textOutput(data);
        
        video.poster = data.image;
        
        player.insertBefore(video,player.children[0]);
        
        connectVideoPlayer();
}

//Изменяем плеер
function videoPlayerUpdate(data, typeInitiation) {

    textOutput(data);
    
    videoPlayer.setAttribute("src",data.play.high);
    if( typeInitiation === "changeTheme") { switchPlayer.className = "start"; }
    changeImage(data);
}

function textOutput(data) {

    
    if(data.tags_str) { 
            creationArrayTag(data.tags_str)
        }
        
    blockTitle.innerHTML = data.name;
    if(data.description) { textPodcast.innerHTML = data.description }
    else {textPodcast.innerHTML = "Нет текстового описания";}
    
}

//Функция меняет картинки в плеере
function changeImage(data,typeStart) {
    console.log(data.type_content);
    videoPlayer.poster = data.image; // || typeStart === "podkastPlay"
    
    //if(data.type_content !== "video") fonPlayer.classList.remove("typeVideo");
    //else { console.log(fonPlayer.classList); fonPlayer.classList.add("typeVideo"); console.log(fonPlayer); }
    
}

function creationArrayTag(data) {
    
        dataTags = data.split(','); 
        requestAjax.getDataUser(showTagsPodcast,access_id,access_token);

}

function showTagsPodcast(data) {
     
     if(data) { userTags = data.data[0].tags_str.split(','); }

     tags.innerHTML = "Добавить в предпочтения:";
     dataTags = removeSpacesInArray(dataTags);

     for(var i = 0; i < dataTags.length; i++) {
                    
            var tag = document.createElement('div');
            tag.setAttribute("id","tag");
            var tagSwitch = document.createElement('button');
            
            
            if(userTags.indexOf(dataTags[i]) == -1) { 
                tagSwitch.className = "plusTag"; }
            else { 
                tagSwitch.className = "okTag";  
                tagSwitch.disabled = "true";
            }
            
            
            tagSwitch.setAttribute("onclick", 'addTagsUser("' + dataTags[i] +'")'); 
                    
            tag.innerHTML = dataTags[i];
                    
            tag.insertBefore(tagSwitch,tag.children[0]);
            tags.insertBefore(tag,tags.children[0]);
        }
}






function removeSpacesInArray(array) {
    for(var i = 0; i < array.length; i++) {
        var itemArray = array[i];
        if(itemArray[0] == ' ') {
            array[i] = itemArray.slice(1);
        }
    }
    return array;
}


function addTagsUser(dataTags) { 
        userTags.push(dataTags);
        
        requestAjax.setClientTags(processingAddTag,access_id,access_token,userTags)
};



function processingAddTag(data) {

       showTagsPodcast(); 
}


//Открываем в полный экран
function funcFullScreen() {
    
    if(videoPlayer.requestFullScreen) {
        videoPlayer.requestFullScreen();
      } else if(videoPlayer.mozRequestFullScreen) {
        videoPlayer.mozRequestFullScreen();
      } else if(videoPlayer.webkitRequestFullScreen) {
        videoPlayer.webkitRequestFullScreen();
      }
    
}

//Настраиваем запрос для получения подборки пользователя
requestAjax.getSubscription(connectChannel, access_id, access_token, 73493);

//Получаем подборку с сервера
function connectChannel(parseJson) {
    
    //Получаем id тем подборки и преобразуем в массив 
    clientThemeIds = parseJson.data.clients_subscriptions[0].theme_ids.split(',');
    
    openedChannel = parseJson.data.clients_subscriptions[0];
    
    openNowId = 0;
    
    //Настраиваем запрос для получения подкастов из темы
    requestAjax.getPodcastsTheme(createPodcasts, clientThemeIds[openNowId], 12);
    
}

//Открыть прошлую тему
lastTheme.onclick = function() {
    
    if(openNowId > 0) {
        
        openNowId -= 1;
        requestAjax.getPodcastsTheme(createPodcasts, clientThemeIds[openNowId], 12 );

    }
    
}

//Открыть следующую тему
nextTheme.onclick = function() {
    
    if(openNowId < clientThemeIds.length-1) {
        
        openNowId += 1;
        requestAjax.getPodcastsTheme(createPodcasts, clientThemeIds[openNowId], 12 );
        
    }
    
}

//Открыть прошлый подкаст
lastPodcast.onclick = function() {
   
   if(openPodcast > 0) {
       
       openPodcast--;
       videoPlayerUpdate(listPodcasts[openPodcast]);
       switchVideo();

   
   } else { lastTheme.onclick(); }
       
}



//Открыть следующий подкаст
nextPodcast.onclick = function() {
    
    if(openPodcast < listPodcasts.length-1) {  
       openPodcast++;
       videoPlayerUpdate(listPodcasts[openPodcast]);
       switchVideo();
       
    } else { nextTheme.onclick(); }
}

//Функция включает или выключает новый подкаст(при листании) в зависимости от состояния старого 
function switchVideo() {

    if(switchPlayer.className == "start") {
            videoPlayer.pause();
        }
        else {
            
            videoPlayer.play();
        }

}

hideAndShowPodcasts.onclick = function() {
    
    if(podcasts.style.display === "none") {
        podcasts.style.display = "block";
        hideAndShowPodcasts.innerHTML = "скрыть подкасты";
    }
    else {
        podcasts.style.display = "none"
        hideAndShowPodcasts.innerHTML = "показать подкасты";
    }
}

//Создаем подкасты и вызываем функцию создания плеера
function createPodcasts(parseJson) {
    
        podcasts.innerHTML = "";
    
    /*    
    parseJson.data[1] = {
        id:'9776772',
        name:'Видео для тестирования плеера',
        image:'https://backend.soundstream.media/thumbnails/d708d205b2a535a1b93d520eb2094aa4-9705137.jpg',
        description:'Видео для тестирования плеера. Текстовое описание видео. Оптимальный формат видео mp4. Видео для тестирования плеера. Текстовое описание видео. Оптимальный формат видео mp4. <p></p> Видео для тестирования плеера. Текстовое описание видео. Оптимальный формат видео mp4. ',
        play:{'high':'https://download.blender.org/peach/bigbuckbunny_movies/big_buck_bunny_1080p_stereo.ogg'},
        //play:{'high':'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4'},
        type_content: 'video',
        tags_str: "hitech, юнистар, Развлекательно1"
        
    }
    
     parseJson.data[3] = {
        id:'9776772',
        name:'Пробное видео 2',
        image:'https://backend.soundstream.media/thumbnails/d708d205b2a535a1b93d520eb2094aa4-9705137.jpg',
        description:'текст',
        play:{'high':'http://download.blender.org/peach/bigbuckbunny_movies/BigBuckBunny_320x180.mp4'},
        type_content: 'video'
        
        
    }*/
    
    listPodcasts = parseJson.data;
    
    requestAjax.getThemes(displayChannelInfo, clientThemeIds[openNowId]);
    
    //displayChannelInfo(data)
    
    for(var i = 0; i < parseJson.data.length; i++)
    {
        var podcast = document.createElement("div");
        podcast.className = "podcast";
        podcast.setAttribute("onclick","podcastInPlayer('" + parseJson.data[i].play.high + "'," + i + ")" )
        
        var podcastTitle = document.createElement("div");
        podcastTitle.className = "podcastTitle";
        podcastTitle.innerHTML = checkString(parseJson.data[i].name);
        
        var podcastImg = document.createElement("div");
        podcastImg.className = "podcastImg";
        if(parseJson.data[i].image) podcastImg.innerHTML = "<img src='" + parseJson.data[i].image + "' border='0'>";
        
        podcast.appendChild(podcastTitle);
        podcast.appendChild(podcastImg);
        podcasts.appendChild(podcast);
        
    }
    
    if(!videoPlayerCreated) { videoPlayerInference(parseJson.data[0]); }
    else { videoPlayerUpdate(parseJson.data[0], "changeTheme"); }

    openPodcast = 0;

}

function displayChannelInfo(infoAboutTheme) {
    
    openedTheme = infoAboutTheme.data[0];
    channelInfo.innerHTML = 'Загружен канал: "' + openedChannel.name + '"';
    channelInfo.innerHTML += ', тема: "' + openedTheme.name + '"';
}

//Добавляем подкаст в плеер при клике по нему
function podcastInPlayer(link,numberPodcast) {

    var link = link;
    if(numberPodcast || numberPodcast === 0) {
        
        openPodcast = numberPodcast;
        textOutput(listPodcasts[openPodcast])
        changeImage( listPodcasts[openPodcast], "podkastPlay");

    }

    if(videoPlayer.src != link) {
        
        videoPlayer.src = link;

        switchPlayer.className = "pause";
        
        videoPlayer.play();
        
    } else {funcSwitch(link); }
    
    fullScreenSwitch();
}

//Функция проверяет не превышает ли длина текста установленный лимит
	function checkString(str) {
			 
		//Устанавливаем максимальное число символов
		var maximumStringLength = 100;
			 
		if (str.length > maximumStringLength) {
			     
			var str2 = str.slice(0, maximumStringLength) + "...";				 
			return str2;
				 			  
		} else return str; 
			 
	} 
	


volumeMinus.onclick = function() {
    if(videoPlayer.volume >= 0.2) {
        videoPlayer.volume = videoPlayer.volume - 0.2;
    }
    if(videoPlayer.volume < 0.2) volumeImg.setAttribute("src","img/volumeNo.png");
    
    
}

volumePlus.onclick = function() {
    if(volumeImg.getAttribute("src") == "img/volumeNo.png") volumeImg.setAttribute("src","img/volume.png");
    if(videoPlayer.volume <= 0.8) videoPlayer.volume = videoPlayer.volume + 0.2;
}


volumeImg.onclick = function() {
    
    if(volumeImg.getAttribute("src") == "img/volume.png") {
        valueVolume = videoPlayer.volume;
        videoPlayer.volume = 0;
        volumeImg.setAttribute("src","img/volumeNo.png");
    }else {
        videoPlayer.volume = valueVolume;
        valueVolume = 1;
        volumeImg.setAttribute("src","img/volume.png");
    }
}

fonPlayer.onclick = function(event) {
    if(event.target !== fullScreenPlayer) funcSwitch()
    
}


function funcSwitch(event) {
        
        if(switchPlayer.className == "start") {

            fullScreenSwitch();
            switchPlayer.className = "pause";
            //fonPlayer.classList.remove("typeVideo");
            videoPlayer.play();
        }
        else playerOnPause();
    
    
}

function fullScreenSwitch() {

    if(fullScreenPlayer.style.display !== "block" && listPodcasts[openPodcast].type_content === "video") {
        fullScreenPlayer.style.display = "block";
    } else { fullScreenPlayer.style.display = ""; }

}

function playerOnPause() {
    fullScreenSwitch();
    switchPlayer.className = "start";
    videoPlayer.pause();
}

//Процесс загрузки файла
function updateLoading() {
    
    if(switchPlayer.className != "start") {
    
        var indicatorLoading = 100 * (videoPlayer.buffered.end(videoPlayer.buffered.length-1) / videoPlayer.duration);
        loading.style.width = indicatorLoading + "%";
    
    }
    
}


//Процесс проирывания файла
function runnerPlayer() {
    //fonPlayer.classList.remove("typeVideo");
    var indicatorPlayer = indicator.clientWidth * (videoPlayer.currentTime / videoPlayer.duration);
    runner.style.width = indicatorPlayer + "px";
    
    if(videoPlayer.currentTime == videoPlayer.duration) {
        nextPodcast.onclick();
        videoPlayer.play();
    }
    updateLoading();//Вызывается для корректной работы Мозиллы. Именно в конце для андроид браузера.
    }

//Событие при завершении файла(поддерживается не всеми браузерами - причина дублирования выше)
//videoPlayer.onended = playerOnPause;

//Обрабатываем изменение кликом/перетаскиванием точки с которой проигрывается файл
indicator.onmousedown = function(event) {

    var newPosition = event.clientX - Math.round(indicator.getBoundingClientRect().left);
    runner.style.width = newPosition + "px";
    indicator.onmousemove = function(event) {
        var newPosition = event.clientX - Math.round(indicator.getBoundingClientRect().left);
        runner.style.width = newPosition + "px";
        changingCurrentTime(newPosition);
    }
    changingCurrentTime(newPosition)
    
    
    indicator.onmouseup = function() {
    
    indicator.onmousemove = "";
    }
}


//Здесь ставим новое время для дорожки
function changingCurrentTime(newPosition) {
    videoPlayer.currentTime = videoPlayer.duration * (newPosition/ indicator.clientWidth);
}
