import firebase from 'firebase/app'
import 'firebase/storage'
import {upload} from './upload.js'


const firebaseConfig = {
    apiKey: "AIzaSyD7g2pxd_0hT8VOPVyVi0AvGZFyMEGVDSg",
    authDomain: "download-server-9b57c.firebaseapp.com",
    projectId: "download-server-9b57c",
    storageBucket: "download-server-9b57c.appspot.com",
    messagingSenderId: "637920372782",
    appId: "1:637920372782:web:e0b9b837497c52c39857bf"
}

firebase.initializeApp(firebaseConfig)

const storage = firebase.storage()

upload('#file', {
    multi: true,
    accept: ['.mp3'],
    // accept: ['.png', '.jpg', '.jpeg', '.gif', '.mp3'],
    onUpload(files, blocks) {
        files.forEach((file, index) => {
            const ref = storage.ref(`downloads/${file.name}`)
            const task = ref.put(file)

            task.on('state_changed', snapshot => {
                const percentage = ((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0) + '%'
                const block = blocks[index].querySelector('.preview-info-progress')
                block.textContent = percentage
                block.style.width = percentage
            }, error => {
                console.log(error)
            }, () => {
                task.snapshot.ref.getDownloadURL().then(url => {
                    console.log('Download URL', url)
                    const result = document.createElement('div')
                    result.classList.add('result')
                    result.innerHTML = `
<img src="./audio-img.jpg" alt="нет изображения">
                <audio controls>
                <source src="${url}" type="audio/mpeg"></audio>
                <p>${file.name}</p>
                `
                    document.body.appendChild(result)
                })
            })
        })
    }
})