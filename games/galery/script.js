let currentIndex = 0;
let images = [];

if(localStorage.getItem('galery')) {
    image = JSON.parse(localStorage.getItem('galery'))
} else {
    images = [
 "images/ll.webp",
 "images/oo.jpg",
 "images/uu.jpg"
];
}

function saveImage() {
localStorage.setItem('galery', JSON.stringify(images));
}



const img = document.getElementById
('gallery-image')

function updateImage() {
    img.style.opacity = 0;
    if (images.length > 0) {
        setTimeout(function() {
            img.src = images[currentIndex];
            img.style.opacity = 1
        }, 300);
    } else {
        setTimeout(function() {
            img.src = "";
            img.alt = "Нет изображений"
        }, 300);
    }
}

function prevImg() {
   currentIndex = (currentIndex - 1 + images.length) % images.length;
        updateImage();
}

function nextImg() {
    currentIndex = (currentIndex + 1 + images.length) % images.length;
    updateImage();
 }


function addimage() {
    const image = document.getElementById("imageurl");
    const imageurl = image.value.trim();
 
    if(imageurl) {
        images.push(imageurl);
        console.log(images);
        currentIndex = images.length - 1;
        updateImage();
        saveImage();
        image.value = '';
    }
}
function deleteimage() {
if(images.length > 0) {
    images.splice(currentIndex, 1)
    if(currentIndex >= images.length) {
        currentIndex = images.length - 1;
    }
    updateImage();
    saveImage();
}
}




updateImage();



document.getElementById('prevbtn').
addEventListener('click', prevImg);
document.getElementById('nextBtn').
addEventListener('click', nextImg);
document.getElementById("addbtn").
addEventListener('click', addimage);
document.getElementById("deletebtn").
addEventListener('click', deleteimage);
