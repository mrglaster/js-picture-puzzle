
let allow_start = 0;

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


function b64ToFile(dataurl, filename) {
 
    var arr = dataurl.split(','),
        mime = arr[0].match(/:(.*?);/)[1],
        bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
        
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new File([u8arr], filename, {type:mime});
}


let image_b64 = '';
const inputElement = document.getElementById("fileselector");
inputElement.addEventListener("change", processImage, false);

/**Process uploaded image file */
function processImage() {
    let fileList = inputElement.files;
    let requested_file = fileList[0];
    if (FileReader && fileList && fileList.length) {
        var fr = new FileReader();
        fr.onload = function () {
            image_b64 = fr.result;
            var setting_image = resizedataB64(image_b64, 450, 300).then(function (result) {
                var file = b64ToFile(result,'image.png');
                
                document.getElementById('tvshape').style.backgroundSize = 'cover';
                document.getElementById('tvshape').style.backgroundImage = 'url(' + {file} + ')';
                document.getElementById('tvshape').style.border = '1 px solid white; ';
                allow_start = 1;
            });
        }
        fr.readAsDataURL(requested_file);
    }
}

function start_game() {
    if (!allow_start) {
        const wrapper = document.createElement('div');
        swal({
            title: 'Image not uploaded!',
            text: 'You should upload some image to start. Or are you going to play with nothing?)',
            content: wrapper
        });
    }
    else {
        let difficulty = document.querySelectorAll('input[name="answer-dark"]')[0].id
        console.log(difficulty)
        //this.location.href = `puzzle.html?image=${image_b64}&difficulty=${difficulty}`
    }
}



