/*
Иван Войтков
Библиотека отправки AJAX запросов серверу. 2016
voitkov.ne@yandex.ru

*/

//Отправить AJAX запрос на сервер, перевести полученный JSON в JavaScript объект, вызывать функцию с данным объектом идущим первым параметром
//(вызываемая функция, тип запроса, данные запроса, если нужно дополнительный параметр для вызываемой функции)
function requestAjax(whereTransfer,typeRequest,data) {
    
    var getJson = new XMLHttpRequest();
        
        //var linkRequest = 'https://backend.soundstream.media/API/v1.6/?action=';
        var linkRequest = 'http://voitkoze.bget.ru/neradio3/demoserver.php/?action=';
        
        linkRequest += typeRequest;
        
        if(data) {
            
            var dataRequest = '';
            
            for(var key in data)
            {
                dataRequest += "&" + key + '=' + data[key];
            }
            
            linkRequest += dataRequest;
        }   
        
        getJson.open('GET', linkRequest, true);
        
        getJson.send(); 
        
        var parseJson;
        
        getJson.onreadystatechange = function() {
             if (getJson.readyState != 4) return;
            
              if (getJson.status != 200) {
                
                appearedErrorAjax("serverError");
                console.log(getJson.status + ': ' + getJson.statusText);
              } 
            
            parseJson = JSON.parse(getJson.responseText); //Преобразуем в JavaScript объект
            
            if(parseJson.errors[0]) { appearedErrorAjax("answer",parseJson); }
            else { whereTransfer(parseJson); }
        }

} 



//Получить подборки клиента
requestAjax.getClientSubscriptions = function(whereTransfer, access_id, access_token) {
    
     requestAjax(whereTransfer,'get_client_subscriptions', 
    
    {
        access_id: access_id,
        access_token: access_token
    }
    
    );
    
}

//Получить все подкасты
requestAjax.getPodcasts = function(whereTransfer) {
    
    requestAjax(whereTransfer,'get_podcasts');
    
}

//Получить подкасты из подборки (функция в которую передаем подкасты, access_id, access_token, имя подборки )
requestAjax.getPodcastsSubscription = function(whereTransfer, access_id, access_token, subscription_name) {
    
    requestAjax(whereTransfer,'get_podcasts', 
    
    {
        access_id: access_id,
        access_token: access_token,
        subscription_name: subscription_name
    }
    
    );
    
}

//Получаем подборку пользователя которую будем добавлять в плеер
//(функция назначения, access_id, access_token, ID подборки )
requestAjax.getSubscription = function(whereTransfer, access_id, access_token, idSubscription) {
    
    requestAjax(whereTransfer,'get_client_subscriptions', 
    
    {
        access_id: access_id,
        access_token: access_token,
        ids:idSubscription
    }
    
    );
    
}


//Получить подкасты одной из тем
//(функция назначения, ID темы, количество подкастов из неё)
requestAjax.getPodcastsTheme = function(whereTransfer, theme_id, quantityPodcasts ) {
    
     requestAjax(whereTransfer,'get_podcasts', 
    
    {
        theme_ids: theme_id,
        perpage: quantityPodcasts
    }
    
    );
}

//Получить информацию о теме
//(функция назначения, ID темы)
requestAjax.getThemes = function(whereTransfer, theme_id) {
    
     requestAjax(whereTransfer,'get_themes', 
    
    {
        ids: theme_id
    }
    
    );
}



//Установить строку тегов пользователю
requestAjax.setClientTags = function(whereTransfer, access_id, access_token, nameTags) {
    
     requestAjax(whereTransfer,'set_client_tags', 
    
    {
        access_id: access_id,
        access_token: access_token,
        tags:nameTags
    }
    
    );
    
}

//Получить данные пользователя
requestAjax.getDataUser = function(whereTransfer, access_id, access_token) {
    
     requestAjax(whereTransfer,'me', 
    
    {
        access_id: access_id,
        access_token: access_token
    }
    
    );
    
}

//Обработка ошибок при запросах
function appearedErrorAjax(typeError,data) {
    
     var errorAjax = document.createElement("div");
     errorAjax.setAttribute("id","errorAjax");
     
     
     if(typeError === "serverError") {
         
         errorAjax.innerHTML = "Сервер не отвечает";
     } 
     
     else if(typeError === "answer") {
     
         if(data.errors.length > 1) {
             
             errorAjax.innerHTML = "Возникли ошибки: "
             
             for(var i = 0; i < data.errors.length; i++) {
             errorAjax.innerHTML += data.errors[i].message + " | "
             }
         
         } else {
             errorAjax.innerHTML = "Возникла ошибка: " + data.errors[0].message;
         }
         
     } else {errorAjax.innerHTML = "Ошибка";}
     
     document.documentElement.insertBefore(errorAjax,document.documentElement.children[0]);
     
     setTimeout('document.documentElement.removeChild(document.getElementById("errorAjax"))',3000);
}	