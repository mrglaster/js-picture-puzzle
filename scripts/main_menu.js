let allow_start = 0;
let imgb64 = '';
let filename = '';

const inputElement = document.getElementById("fileselector");
inputElement.addEventListener("change", processImage, false);


/**ImgBB API key */
let API_KEY = 'USE YOUR OWN!'

/**URL for request */
let REQUEST_URL = 'https://api.imgbb.com/1/upload'


/**Resizes image by it's Base64 */
function resizedataB64(datas, wantedWidth, wantedHeight) {
    return new Promise(async function (resolve, reject) {
        var img = document.createElement('img');
        img.style.display = 'hidden';
        img.onload = function () {
            var canvas = document.createElement('canvas');
            var ctx = canvas.getContext('2d');
            canvas.width = wantedWidth;
            canvas.height = wantedHeight;
            ctx.drawImage(this, 0, 0, wantedWidth, wantedHeight);

            var dataURI = canvas.toDataURL();
            resolve(dataURI);
        };
        img.src = datas;

    })
}


/**Plays audiofile*/
function play_sound(sound_path){
    var audio = new Audio(sound_path);
    audio.play();
}



/**Converts Base64 back to file */
function dataURLtoFile(dataurl, filename) {
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]),
        n = bstr.length,
        u8arr = new Uint8Array(n);

    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
}


/**Sends request to ImgBB */
function sendImgbbRequest(base64) {
    let body = new FormData()
    body.set('key', API_KEY)
    body.append('image', dataURLtoFile(base64, 'image.png'))
    return axios({
        method: 'POST',
        url: 'https://api.imgbb.com/1/upload',
        data: body
    })
}



/**Process uploaded image file */
function processImage() {
    play_sound("./sounds/click.wav")
    let fileList = inputElement.files;
    let requested_file = fileList[0];
    if (FileReader && fileList && fileList.length) {
        var fr = new FileReader();
        fr.onload = function () {
            image_b64 = fr.result;
            var setting_image = resizedataB64(image_b64, 450, 300).then(function (result) {
                document.getElementById('tvshape').style.backgroundSize = 'cover';
                document.getElementById('tvshape').style.backgroundImage = 'url(' + result + ')';
                document.getElementById('tvshape').style.border = '1 px solid white; ';
                allow_start = 1;
                imgb64 = result;
            });
        }
        fr.readAsDataURL(requested_file);
    }
}


/**Builds custom alert with SweetAlert */
function buildCustomAlert(title, text) {
    const wrapper = document.createElement('div');
    swal({
        title: title,
        text: text,
        content: wrapper
    });
}


/**Start game onClick processing */
function start_game() {
    if (!allow_start) buildCustomAlert('Image not uploaded!', 'You should upload some image to start. Or are you going to play with nothing?)')
    else {
        if (API_KEY == 'USE YOUR OWN!') {
            buildCustomAlert("YOU FOOL!", "Why are you trying to invoke ImgBB's API without the API KEY? Yes, you must use your own, OMG!. So go to the /scripts/main_menu.js and set variable API_KEY's value to ur key. And don't repeat such mistakes anymore!")
            play_sound("./sounds/give_up.wav")
        }
        else {
            play_sound("./sounds/click.wav")
            console.log(document.querySelectorAll('input[name="answer-dark"]:checked')[0].id)
            let difficulty = document.querySelectorAll('input[name="answer-dark"]:checked')[0].id
            buildCustomAlert('Sending Data', 'We send your image to ImgBB server. So, you need a bit time to wait')
            sendImgbbRequest(imgb64).then((response) => {
                let viewUrl = response.data.data.display_url;
                console.log(difficulty)
                buildCustomAlert("Successful!", "You will be redirected to the Game Page right now!")
                this.location.href = `puzzle.html?image=${viewUrl}&difficulty=${difficulty}`;

            }).catch(error => buildCustomAlert("ERROR!", "Connection to ImgBB is unavailable! Sorry, we can't run puzzle game then ("));
        }

    }
}



