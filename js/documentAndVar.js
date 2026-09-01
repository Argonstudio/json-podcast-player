/*
Иван Войтков
Подключение HTML и глобальные переменные. 2016
voitkov.ne@yandex.ru

*/

var blockVideo = document.getElementById('blockVideo');
var player = document.getElementById('player');
var blockTitle = document.getElementById('blockTitle');
var switchPlayer = document.getElementById('switchPlayer');
var fonPlayer = document.getElementById('fonPlayer');
var fullScreenPlayer = document.getElementById('fullScreenPlayer');
var textPodcast = document.getElementById('textPodcast');
var tags = document.getElementById('tags');
var hiddenFixedSection = document.getElementById('hiddenFixedSection');
var indicator = document.getElementById('indicator');
var loading = document.getElementById('loading');
var volumeMinus = document.getElementById('volumeMinus');
var volumePlus = document.getElementById('volumePlus');
var volumeImg = document.getElementById('volumeImg');
var lastTheme = document.getElementById('lastTheme');
var nextTheme = document.getElementById('nextTheme');
var podcasts = document.getElementById('podcasts');
var hideAndShowPodcasts = document.getElementById('hideAndShowPodcasts');
var channelInfo = document.getElementById('channelInfo');

//Переменная для ID создаваемого плеера
var videoPlayer;

function connectVideoPlayer() {
    videoPlayer = document.getElementById('videoPlayer');
}

//Флажок указывающий создан или нет плеер
var videoPlayerCreated = false;

//Массив тем из подключенной подборки клиента
var clientThemeIds;

//Указатель на открытую сейчас тему(её ID в массиве clientThemeIds)
var openNowId;

//Полученные из темы подкасты
var listPodcasts;

//Подкаст открытый на текущий момент
var openPodcast = 0;

//Уровень звука на момент отключения через кнопку
//Затем восстанавливаем звук из этого значения
var valueVolume;

//Открытый канал
var openedChannel;

//Открытая тема
var openedTheme;

//Теги открытого подкаста
var dataTags;

//Теги пользователя
var userTags;

//Не добавленные пользователем теги подкаста
var notYetAddedTags = [];

//Добавленные теги из подкаста
var alreadyAddedTags = [];

var addedTag = [];

var access_id = 77044;

var access_token = "12ba97d0605684e17d7a35b969873f33b870a081";
